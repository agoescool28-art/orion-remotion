import { createHash } from "node:crypto";
import { link, mkdir, readFile, rename, stat, unlink, writeFile } from "node:fs/promises";
import { basename, dirname, resolve } from "node:path";

const MODEL = "gemini-3.8-flash-tts";
const VOICE = "Orus";
const STYLE =
	"Natural adult male Indonesian educational mentor. Warm, grounded, confident, clear articulation, conversational delivery, moderate pace, subtle emotional emphasis, varied intonation, natural pauses, and a firm but approachable tone. Sound like an experienced human explaining an important idea directly to the audience. Avoid robotic rhythm, exaggerated drama, monotonous delivery, excessive bass, and overly fast speech.";
const OUTPUT_DIRECTORY = resolve("public/audio");
const CACHE_DIRECTORY = resolve(".orion-cache");
const COMPOSITION_DURATION_SECONDS = 74.5534693877551;
const SAMPLE_WORD_COUNT = 30;
const SAMPLE_DURATION_SECONDS = { min: 10, max: 15 };

const fail = (message) => {
	throw new Error(message);
};

const parseWav = (buffer, durationLimit = SAMPLE_DURATION_SECONDS) => {
	if (buffer.length < 44 || buffer.toString("ascii", 0, 4) !== "RIFF" || buffer.toString("ascii", 8, 12) !== "WAVE") {
		fail("Gemini returned empty or unsupported audio; expected a RIFF/WAVE file.");
	}

	let format;
	let audio;
	for (let offset = 12; offset + 8 <= buffer.length; ) {
		const chunkSize = buffer.readUInt32LE(offset + 4);
		const chunkStart = offset + 8;
		const chunkEnd = chunkStart + chunkSize;
		if (chunkEnd > buffer.length) {
			fail("The WAV file contains a truncated chunk.");
		}

		const chunkType = buffer.toString("ascii", offset, offset + 4);
		if (chunkType === "fmt ") {
			if (chunkSize < 16) {
				fail("The WAV file has an invalid format header.");
			}
			format = {
				codec: buffer.readUInt16LE(chunkStart),
				channels: buffer.readUInt16LE(chunkStart + 2),
				sampleRate: buffer.readUInt32LE(chunkStart + 4),
				byteRate: buffer.readUInt32LE(chunkStart + 8),
				blockAlign: buffer.readUInt16LE(chunkStart + 12),
				bitsPerSample: buffer.readUInt16LE(chunkStart + 14),
			};
		} else if (chunkType === "data") {
			audio = buffer.subarray(chunkStart, chunkEnd);
		}

		offset = chunkEnd + (chunkSize % 2);
	}

	if (
		!format ||
		!audio?.length ||
		format.codec !== 1 ||
		format.bitsPerSample !== 16 ||
		format.channels < 1 ||
		format.sampleRate < 1 ||
		format.blockAlign !== format.channels * 2 ||
		format.byteRate !== format.sampleRate * format.blockAlign ||
		audio.length % format.blockAlign !== 0
	) {
		fail("The WAV file is empty or uses an unsupported format; expected 16-bit PCM.");
	}

	const frameCount = audio.length / format.blockAlign;
	const duration = frameCount / format.sampleRate;
	if (duration < durationLimit.min || duration > durationLimit.max) {
		fail(`The audio is ${duration.toFixed(2)} seconds; it must be between ${durationLimit.min} and ${durationLimit.max} seconds.`);
	}

	let sumSquares = 0;
	let peak = 0;
	let clippedSamples = 0;
	let firstActiveFrame = -1;
	let lastActiveFrame = -1;
	let sampleCount = 0;
	for (let frame = 0; frame < frameCount; frame += 1) {
		let framePeak = 0;
		for (let channel = 0; channel < format.channels; channel += 1) {
			const sample = audio.readInt16LE(frame * format.blockAlign + channel * 2) / 32768;
			const magnitude = Math.abs(sample);
			sumSquares += sample * sample;
			peak = Math.max(peak, magnitude);
			framePeak = Math.max(framePeak, magnitude);
			clippedSamples += magnitude >= 0.999 ? 1 : 0;
			sampleCount += 1;
		}
		if (framePeak >= 0.0005) {
			if (firstActiveFrame === -1) {
				firstActiveFrame = frame;
			}
			lastActiveFrame = frame;
		}
	}

	if (firstActiveFrame === -1) {
		fail("The WAV file contains silence only.");
	}
	if (clippedSamples > 0) {
		fail(`The WAV file contains ${clippedSamples} clipped sample(s).`);
	}

	const leadingSilence = firstActiveFrame / format.sampleRate;
	const trailingSilence = (frameCount - 1 - lastActiveFrame) / format.sampleRate;
	if (leadingSilence > 1.5 || trailingSilence > 1.5) {
		fail(
			`The WAV file has excessive leading/trailing silence (${leadingSilence.toFixed(2)}s / ${trailingSilence.toFixed(2)}s).`,
		);
	}

	const rms = Math.sqrt(sumSquares / sampleCount);
	return {
		duration,
		sampleRate: format.sampleRate,
		channels: format.channels,
		bitsPerSample: format.bitsPerSample,
		peakDbfs: 20 * Math.log10(peak),
		rmsDbfs: 20 * Math.log10(rms),
		leadingSilence,
		trailingSilence,
	};
};

const getAudioData = (response) => {
	const audioParts = response.steps
		?.filter((step) => step.type === "model_output")
		.flatMap((step) => step.content ?? [])
		.filter((content) => content.type === "audio" && typeof content.data === "string");
	const encoded = audioParts?.at(-1)?.data;
	if (!encoded || encoded.length % 4 !== 0 || !/^[A-Za-z0-9+/]+={0,2}$/.test(encoded)) {
		fail("Gemini returned no supported base64 audio output.");
	}
	const audio = Buffer.from(encoded, "base64");
	if (audio.toString("base64") !== encoded) {
		fail("Gemini returned invalid base64 audio.");
	}
	return audio;
};

const readCache = async (path) => {
	try {
		return JSON.parse(await readFile(path, "utf8"));
	} catch (error) {
		if (error.code === "ENOENT") {
			return null;
		}
		throw error;
	}
};

const saveAudio = async (path, buffer) => {
	await mkdir(dirname(path), { recursive: true });
	const temporaryPath = `${path}.tmp-${process.pid}`;
	try {
		await writeFile(temporaryPath, buffer, { flag: "wx" });
		await link(temporaryPath, path);
		await unlink(temporaryPath);
	} catch (error) {
		await unlink(temporaryPath).catch((cleanupError) => {
			if (cleanupError.code !== "ENOENT") {
				throw cleanupError;
			}
		});
		throw error;
	}
};

const main = async () => {
	const args = process.argv.slice(2);
	const modeArgs = args.filter((arg) => arg.startsWith("--mode="));
	const allowedFlags = new Set([
		"--approve-paid-test",
		"--approve-paid-generation",
		"--confirm-sample-reviewed",
		...modeArgs,
	]);
	const scriptFiles = args.filter((arg) => !arg.startsWith("--"));
	const mode = modeArgs.length === 1 ? modeArgs[0].slice("--mode=".length) : null;
	if (
		modeArgs.length !== 1 ||
		!["sample", "full"].includes(mode) ||
		args.some((arg) => arg.startsWith("--") && !allowedFlags.has(arg))
	) {
		fail("Specify --mode=sample or --mode=full and provide one file containing the complete, exact VO script.");
	}
	if (scriptFiles.length !== 1) {
		fail("Provide one file containing the complete, exact VO script from the existing narration.");
	}

	const approvePaidTest = args.includes("--approve-paid-test");
	const approvePaidGeneration = args.includes("--approve-paid-generation");
	const confirmSampleReviewed = args.includes("--confirm-sample-reviewed");
	if (
		(mode === "sample" && (!approvePaidTest || approvePaidGeneration || confirmSampleReviewed)) ||
		(mode === "full" && (!approvePaidGeneration || !confirmSampleReviewed || approvePaidTest))
	) {
		fail(
			mode === "sample"
				? "No API request was made. For a sample, pass --approve-paid-test only after approving one paid request."
				: "No API request was made. Full VO requires --approve-paid-generation and --confirm-sample-reviewed after listening to the sample.",
		);
	}

	const apiKey = process.env.GEMINI_API_KEY;
	if (!apiKey) {
		fail("GEMINI_API_KEY is not set. Add it as a Codespaces secret or environment variable; do not commit it. No API request was made.");
	}

	const transcript = (await readFile(resolve(scriptFiles[0]), "utf8")).trim();
	if (!transcript || /[\u0000-\u0008\u000B\u000C\u000E-\u001F]/u.test(transcript)) {
		fail("The narration script is empty or contains unsupported control characters.");
	}
	const sourceFingerprint = createHash("sha256").update(transcript).digest("hex");
	const words = transcript.split(/\s+/u);
	const excerpt = words.slice(0, SAMPLE_WORD_COUNT).join(" ");
	const excerptWordCount = words.slice(0, SAMPLE_WORD_COUNT).length;
	if (mode === "sample" && excerptWordCount < 22) {
		fail("The source script contains fewer than 22 words and cannot provide a 10-15 second sample.");
	}

	const sampleRequest = {
		model: MODEL,
		input: [
			{
				type: "user_input",
				content: [
					{
						type: "text",
						text: excerpt,
						annotations: [{ type: "speech_metadata", style: STYLE }],
					},
				],
			},
		],
		response_format: { type: "audio" },
		generation_config: { speech_config: [{ voice: VOICE }] },
		store: false,
	};
	const request =
		mode === "sample"
			? sampleRequest
			: {
					model: MODEL,
					input: [
						{
							type: "user_input",
							content: [
								{
									type: "text",
									text: transcript,
									annotations: [{ type: "speech_metadata", style: STYLE }],
								},
							],
						},
					],
					response_format: { type: "audio" },
					generation_config: { speech_config: [{ voice: VOICE }] },
					store: false,
				};
	const sampleFingerprint = createHash("sha256")
		.update(JSON.stringify({ request: sampleRequest, sourceFingerprint }))
		.digest("hex");
	const fingerprint = createHash("sha256")
		.update(JSON.stringify({ request, sourceFingerprint }))
		.digest("hex");
	const outputFilename = `orion-gemini-tts-${mode}-${fingerprint.slice(0, 12)}.wav`;
	const outputPath = resolve(OUTPUT_DIRECTORY, outputFilename);
	const cachePath =
		mode === "sample"
			? resolve(CACHE_DIRECTORY, `gemini-tts-sample-${sampleFingerprint}.json`)
			: resolve(CACHE_DIRECTORY, `gemini-tts-full-${fingerprint.slice(0, 12)}.json`);

	if (mode === "full") {
		const sample = await readCache(resolve(CACHE_DIRECTORY, `gemini-tts-sample-${sampleFingerprint}.json`));
		if (!sample || sample.sourceFingerprint !== sourceFingerprint || sample.fingerprint !== sampleFingerprint) {
			fail("Generate and validate a sample from this exact narration script before requesting full VO.");
		}
		if (basename(sample.file) !== sample.file || !sample.file.endsWith(".wav")) {
			fail("The sample cache contains an invalid audio path.");
		}
		const sampleAudio = await readFile(resolve(OUTPUT_DIRECTORY, sample.file));
		const sampleMetrics = parseWav(sampleAudio, SAMPLE_DURATION_SECONDS);
		if (sampleMetrics.duration !== sample.duration) {
			fail("The cached sample does not match its validation record; generate and review a fresh sample.");
		}
	}

	const cached = await readCache(cachePath);
	if (cached?.fingerprint === fingerprint) {
		const cachedAudio = await readFile(outputPath);
		const durationLimit =
			mode === "sample"
				? SAMPLE_DURATION_SECONDS
				: { min: 15, max: COMPOSITION_DURATION_SECONDS };
		const metrics = parseWav(cachedAudio, durationLimit);
		console.log(`Reused validated ${mode} audio: ${outputPath}`);
		console.log(JSON.stringify(metrics, null, 2));
		if (mode === "full") {
			console.log(`Remotion opt-in: ORION_GEMINI_VO_FILE=audio/${outputFilename} npm run render:gemini-vo`);
		} else {
			console.log("Listen to this sample and verify the Indonesian pronunciation and mentor voice before generating full narration.");
		}
		return;
	}

	if (cached) {
		fail("A conflicting cache entry exists for this script; inspect it before generating or replacing anything.");
	}
	try {
		await stat(outputPath);
		fail(`Refusing to overwrite an existing uncached file: ${outputPath}`);
	} catch (error) {
		if (error.code !== "ENOENT") {
			throw error;
		}
	}

	const apiResponse = await fetch("https://generativelanguage.googleapis.com/v1beta/interactions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"x-goog-api-key": apiKey,
		},
		body: JSON.stringify(request),
	});
	const responseText = await apiResponse.text();
	if (!apiResponse.ok) {
		let detail = responseText.slice(0, 1000).replaceAll(apiKey, "[redacted]");
		try {
			detail = JSON.parse(responseText).error?.message ?? detail;
		} catch {
			// Keep the bounded, redacted response body for non-JSON API errors.
		}
		fail(`Gemini TTS request failed (HTTP ${apiResponse.status}): ${detail.replaceAll(apiKey, "[redacted]")}`);
	}

	let response;
	try {
		response = JSON.parse(responseText);
	} catch {
		fail("Gemini returned a successful response that was not valid JSON.");
	}
	const audio = getAudioData(response);
	const durationLimit =
		mode === "sample"
			? SAMPLE_DURATION_SECONDS
			: { min: 15, max: COMPOSITION_DURATION_SECONDS };
	const metrics = parseWav(audio, durationLimit);

	await saveAudio(outputPath, audio);
	if (mode === "sample") {
		const manifest = {
			file: outputFilename,
			sourceFingerprint,
			fingerprint,
			model: MODEL,
			voice: VOICE,
			style: STYLE,
			duration: metrics.duration,
		};
		const temporaryPath = `${cachePath}.tmp-${process.pid}`;
		try {
			await mkdir(dirname(cachePath), { recursive: true });
			await writeFile(temporaryPath, JSON.stringify(manifest, null, 2), { flag: "wx" });
			await rename(temporaryPath, cachePath);
		} catch (error) {
			await unlink(temporaryPath).catch((cleanupError) => {
				if (cleanupError.code !== "ENOENT") {
					throw cleanupError;
				}
			});
			throw error;
		}
	} else {
		await mkdir(dirname(cachePath), { recursive: true });
		await writeFile(cachePath, JSON.stringify({ fingerprint, model: MODEL, voice: VOICE }, null, 2), { flag: "wx" });
	}

	console.log(`Generated and validated ${mode} audio: ${outputPath}`);
	if (mode === "sample") {
		console.log(`Sample excerpt: first ${excerptWordCount} exact words from the source script.`);
	}
	console.log(JSON.stringify(metrics, null, 2));
	if (mode === "sample") {
		console.log("Listen to this sample and verify the Indonesian pronunciation and mentor voice before generating full narration.");
	} else {
		console.log(`Remotion opt-in: ORION_GEMINI_VO_FILE=audio/${outputFilename} npm run render:gemini-vo`);
	}
};

main().catch((error) => {
	console.error(`TTS generation failed: ${error.message}`);
	process.exitCode = 1;
});
