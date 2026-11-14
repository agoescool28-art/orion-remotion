import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import { GoogleGenAI } from "@google/genai";
import textToSpeech from "@google-cloud/text-to-speech";
import path from "path";
import fs from "fs";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const ttsClient = new textToSpeech.TextToSpeechClient();

async function getMp3DurationSeconds(buffer) {
  try {
    const tmpFile = path.resolve("./out/temp_check.mp3");
    fs.writeFileSync(tmpFile, buffer);
    const stats = fs.statSync(tmpFile);
    // Estimasi akurat untuk MP3 32kbps-64kbps standar Google TTS
    return Math.max(10, Math.ceil(stats.size / 4000));
  } catch {
    return 35;
  }
}

async function textToMp4() {
  const ideKonten = process.env.IDE_KONTEN || "Cara kerja mesin efisiensi produksi modern";

  if (!fs.existsSync("./out")) {
    fs.mkdirSync("./out", { recursive: true });
  }

  let sceneData = {};
  let isCustomJson = false;

  try {
    const parsed = JSON.parse(ideKonten.trim());
    if (parsed && typeof parsed === "object") {
      sceneData = parsed;
      isCustomJson = true;
      console.log("🎯 MODE PRESISI AKTIF: Menggunakan skenario JSON langsung.");
    }
  } catch (e) {
    isCustomJson = false;
  }

  let audioDataUri = "";

  if (isCustomJson) {
    if (sceneData.audioFile) {
      console.log(`🎧 Menggunakan file audio kustom: ${sceneData.audioFile}`);
      const cleanAudioPath = sceneData.audioFile.replace(/^\/+/, "").replace(/^public\//, "");
      const fullAudioPath = path.resolve("./public", cleanAudioPath);
      if (fs.existsSync(fullAudioPath)) {
        const audioBuffer = fs.readFileSync(fullAudioPath);
        audioDataUri = `data:audio/mp3;base64,${audioBuffer.toString("base64")}`;
        console.log(`✅ File audio kustom berhasil dimuat (${Math.round(audioBuffer.length / 1024)} KB)`);
      } else {
        console.log(`⚠️ File audio tidak ditemukan di: ${fullAudioPath}`);
      }
    } else {
      console.log("🎙️ Membuat suara narator dari naskah JSON...");
      const teksNarasi =
        sceneData.scenes && sceneData.scenes.length > 0
          ? sceneData.scenes.map((s) => s.body).join(" ")
          : sceneData.insight || sceneData.subtitle || "Video edukasi motion graphic";
      const [ttsResponse] = await ttsClient.synthesizeSpeech({
        input: { text: teksNarasi },
        voice: { languageCode: "id-ID", name: "id-ID-Standard-B" },
        audioConfig: { audioEncoding: "MP3", speakingRate: 1.0 },
      });
      audioDataUri = `data:audio/mp3;base64,${ttsResponse.audioContent.toString("base64")}`;
    }
  } else {
    console.log(`🧠 Meracik skenario visual infografis dari ide: "${ideKonten}"...`);

    const prompt = `Kamu adalah sutradara video motion graphic edukasi vertikal (9:16) bergaya Technical Explainer modern (latar biru gelap #061338, sorotan emas #facc15, merah #ef4444 untuk masalah/risiko, hijau #22c55e untuk solusi).
Buat skenario video dari ide berikut: "${ideKonten}"

Aturan wajib:
1. Buat tepat 4 adegan (scenes) yang runtut, informatif, dan mengalir (total sekitar 55-70 kata).
2. Pilih "visualType" yang PALING SESUAI dengan topik dari daftar ini:
   - "medical" (untuk kesehatan, gigi, tubuh, penyakit, obat)
   - "history" (untuk sejarah, biografi, hukum, pemerintahan)
   - "globe" (untuk geografi, perjalanan, dunia, lingkungan, ekonomi)
   - "bulb" (untuk edukasi umum, psikologi, tips, inovasi, ide)
   - "gear" (untuk mesin, otomotif, teknik, manufaktur)
   - "chart" (untuk data, keuangan, statistik, pertumbuhan)
   - "shield" (untuk keamanan, pencegahan, perlindungan)
   - "flow" (untuk proses, sistem, tahapan kerja)
3. Setiap adegan WAJIB memiliki "overlayType" ("pills", "bars", atau "checklist") dan 2-3 item "points", serta "heroStat" + "heroLabel" singkat agar tampilan visual sangat kaya.
4. Keluarkan HANYA JSON murni tanpa markdown/backticks:
{
  "title": "JUDUL UTAMA SINGKAT",
  "subtitle": "Subjudul singkat",
  "styleConfig": {
    "bgColor": "#061338",
    "accentColor": "#facc15",
    "dangerColor": "#ef4444",
    "successColor": "#22c55e",
    "watermark": "orionmotion"
  },
  "scenes": [
    {
      "tag": "01 • PENGENALAN",
      "heading": "JUDUL BAB DUA KATA",
      "headingTone": "gold",
      "heroStat": "24 JAM",
      "heroLabel": "PROSES AWAL",
      "body": "Kalimat narasi adegan pertama yang jelas dan komunikatif.",
      "overlayType": "pills",
      "points": [
        { "text": "Fakta penting pertama", "tone": "neutral" },
        { "text": "Dampak utama yang terjadi", "tone": "gold" }
      ],
      "visualType": "bulb"
    },
    {
      "tag": "02 • PENYEBAB UTAMA",
      "heading": "KENAPA INI TERJADI?",
      "headingTone": "red",
      "heroStat": "80%",
      "heroLabel": "FAKTOR RISIKO",
      "body": "Kalimat narasi adegan kedua yang menjelaskan akar masalah.",
      "overlayType": "bars",
      "points": [
        { "text": "Faktor Pemicu Utama", "value": "80%", "percent": 80, "tone": "red" },
        { "text": "Faktor Pendukung", "value": "45%", "percent": 45, "tone": "gold" }
      ],
      "visualType": "chart"
    }
  ]
}`;

    const aiResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: { responseMimeType: "application/json" },
    });

    sceneData = JSON.parse(aiResponse.text);
    sceneData.audioSrc = "";

    console.log("🎙️ Membuat suara narator bahasa Indonesia (Google TTS)...");
    const teksNarasi =
      sceneData.scenes && sceneData.scenes.length > 0
        ? sceneData.scenes.map((s) => s.body).join(" ")
        : sceneData.insight || sceneData.subtitle || "Video edukasi motion graphic";

    const [ttsResponse] = await ttsClient.synthesizeSpeech({
      input: { text: teksNarasi },
      voice: { languageCode: "id-ID", name: "id-ID-Standard-B" },
      audioConfig: { audioEncoding: "MP3", speakingRate: 1.0 },
    });

    const audioBuffer = Buffer.from(ttsResponse.audioContent);
    audioDataUri = `data:audio/mp3;base64,${audioBuffer.toString("base64")}`;

    // Hitung durasi total frame otomatis dari panjang kata (~2.3 kata/detik + buffer 2 detik)
    const wordCount = teksNarasi.split(/\s+/).filter(Boolean).length;
    const estimatedSec = Math.max(25, Math.ceil(wordCount / 2.2) + 2);
    sceneData.durationInFrames = estimatedSec * 30;
  }

  sceneData.audioSrc = audioDataUri;
  const targetFrames = sceneData.durationInFrames || 1200;

  console.log(`🚀 Merender DynamicMotionVideo (${targetFrames} frames)...`);

  const bundleLocation = await bundle({
    entryPoint: path.resolve("./src/index.ts"),
  });

  const composition = await selectComposition({
    serveUrl: bundleLocation,
    id: "DynamicMotionVideo",
    inputProps: sceneData,
  });

  composition.durationInFrames = targetFrames;

  await renderMedia({
    composition,
    serveUrl: bundleLocation,
    codec: "h264",
    outputLocation: "./out/video_1.mp4",
    inputProps: sceneData,
    chromiumOptions: {
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    },
  });

  console.log("✅ SUKSES! Video MP4 tersimpan di ./out/video_1.mp4");
}

textToMp4().catch((err) => {
  console.error(err);
  process.exit(1);
});
