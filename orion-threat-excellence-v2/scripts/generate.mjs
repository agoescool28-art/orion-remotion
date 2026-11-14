import { GoogleGenerativeAI } from "@google/generative-ai";
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import path from "path";
import fs from "fs";
import * as googleTTS from "google-tts-api";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const ideKonten = process.env.IDE_KONTEN || "Konsep Karakuri Kaizen di Lantai Produksi";

async function generateWithTimeout(model, prompt, timeoutMs = 20000) {
  return Promise.race([
    model.generateContent(prompt),
    new Promise((_, reject) =>
      setTimeout(
        () => reject(new Error(`Timeout: Server tidak merespons dalam ${timeoutMs / 1000} detik`)),
        timeoutMs
      )
    ),
  ]);
}

async function sendToTelegram(videoPath, judulTopik, durasiDetik) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.log("⚠️ TELEGRAM_BOT_TOKEN atau TELEGRAM_CHAT_ID belum diset di GitHub Secrets.");
    return;
  }

  console.log("📤 Mengirim video hasil render ke Telegram...");
  try {
    const fileBuffer = fs.readFileSync(videoPath);
    const videoBlob = new Blob([fileBuffer], { type: "video/mp4" });

    const form = new FormData();
    form.append("chat_id", chatId);
    form.append("video", videoBlob, path.basename(videoPath));
    form.append(
      "caption",
      `🎬 Video Motion Graphic Selesai Dirender!\n\nJudul: "${judulTopik}"\nDurasi: ${durasiDetik} detik`
    );

    const response = await fetch(`https://api.telegram.org/bot${token}/sendVideo`, {
      method: "POST",
      body: form,
    });

    const result = await response.json();
    if (result.ok) {
      console.log("✅ Video berhasil dikirim ke Telegram!");
    } else {
      console.log("❌ Gagal mengirim ke Telegram:", JSON.stringify(result));
    }
  } catch (err) {
    console.log("❌ Error saat kirim Telegram:", err.message);
  }
}

async function textToMp4() {
  if (!fs.existsSync("out")) fs.mkdirSync("out", { recursive: true });
  if (!fs.existsSync("public/audio")) fs.mkdirSync("public/audio", { recursive: true });

  let sceneData = null;

  // MODE 1: JSON MANUAL / PRESISI
  if (ideKonten.trim().startsWith("{")) {
    try {
      sceneData = JSON.parse(ideKonten.trim());
      console.log("🎯 MODE PRESISI AKTIF: Menggunakan skenario JSON langsung.");
    } catch (err) {
      console.log("⚠️ Format JSON tidak valid, beralih ke Mode AI Director:", err.message);
    }
  }

  // MODE 2: AI DIRECTOR OTOMATIS (4 Adegan, durasi ~15-20 detik)
  if (!sceneData) {
    console.log(`🧠 MODE AI DIRECTOR: Merancang 4 adegan (15-20 detik) untuk "${ideKonten}"...`);

    const prompt = `
    Bertindaklah sebagai Senior Motion Designer dan Industrial Engineer. Buat skenario video motion graphic vertikal 4 adegan (durasi 18 detik / 540 frames) untuk topik: "${ideKonten}".
    Keluarkan JSON murni dengan struktur persis seperti ini:
    {
      "title": "Judul utama singkat maks 4 kata",
      "subtitle": "Subjudul ringkas",
      "insight": "Narasi voiceover Bahasa Indonesia yang jelas, mengalir, dan informatif sepanjang 350 hingga 450 karakter untuk durasi bicara sekitar 18 detik.",
      "accentColor": "#10b981",
      "durationInFrames": 540,
      "scenes": [
        {
          "tag": "01 • PENGENALAN",
          "heading": "Judul Adegan 1 (maks 3 kata)",
          "body": "Penjelasan pembuka yang menarik (maks 14 kata)",
          "visualType": "gear"
        },
        {
          "tag": "02 • MASALAH & ANALISIS",
          "heading": "Judul Adegan 2 (maks 3 kata)",
          "body": "Penjelasan kendala atau potensi efisiensi (maks 14 kata)",
          "visualType": "chart"
        },
        {
          "tag": "03 • CARA KERJA",
          "heading": "Judul Adegan 3 (maks 3 kata)",
          "body": "Penjelasan mekanisme atau solusi utama (maks 14 kata)",
          "visualType": "flow"
        },
        {
          "tag": "04 • PENERAPAN",
          "heading": "Judul Adegan 4 (maks 3 kata)",
          "body": "Kesimpulan dan ajakan aksi di area kerja (maks 14 kata)",
          "visualType": "shield"
        }
      ]
    }
    Catatan visualType hanya boleh berisi salah satu dari: "gear", "chart", "shield", atau "flow".
    `;

    const daftarModel = ["gemini-3.8-flash", "gemini-3.5-flash"];
    let result = null;
    let modelTerpakai = "";

    for (const namaModel of daftarModel) {
      console.log(`🤖 Mencoba model AI: ${namaModel}...`);
      const model = genAI.getGenerativeModel({
        model: namaModel,
        generationConfig: { responseMimeType: "application/json" },
      });

      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          result = await generateWithTimeout(model, prompt, 20000);
          modelTerpakai = namaModel;
          break;
        } catch (err) {
          console.log(`⚠️ ${namaModel} gagal (Percobaan ${attempt}/2): ${err.message}`);
          if (err.status === 429 || err.status === 404) break;
          if (attempt < 2) await new Promise((res) => setTimeout(res, 3000));
        }
      }

      if (result) {
        console.log(`✅ Skenario 4 adegan dibuat oleh: ${modelTerpakai}`);
        break;
      }
    }

    if (result) {
      const rawText = result.response.text();
      const jsonString = rawText.replace(/```json|```/g, "").trim();
      sceneData = JSON.parse(jsonString);
    } else {
      console.log("⚠️ API Gemini sibuk. Menyusun 4 adegan dinamis otomatis (18 detik)...");
      const judulSingkat = ideKonten.split(" ").slice(0, 4).join(" ").toUpperCase();
      sceneData = {
        title: judulSingkat,
        subtitle: ideKonten,
        insight: `Mari kita pelajari konsep ${ideKonten}. Dengan pendekatan sistematis di lantai produksi, kita dapat memangkas pemborosan waktu, meningkatkan efisiensi kerja, serta menjaga standar keselamatan operator setiap hari.`,
        accentColor: "#10b981",
        durationInFrames: 540,
        scenes: [
          {
            tag: "01 • KONSEP UTAMA",
            heading: judulSingkat,
            body: `Memahami prinsip dasar dan tujuan ${ideKonten}.`,
            visualType: "gear",
          },
          {
            tag: "02 • DAMPAK PROSES",
            heading: "EFISIENSI OPTIMAL",
            body: "Mengurangi pemborosan waktu, gerakan, dan energi secara terukur.",
            visualType: "chart",
          },
          {
            tag: "03 • ALUR KERJA",
            heading: "SISTEM TERUKUR",
            body: "Menyelaraskan langkah kerja operator agar proses berjalan lancar.",
            visualType: "flow",
          },
          {
            tag: "04 • IMPLEMENTASI",
            heading: "SIAP DITERAPKAN",
            body: "Langkah praktis yang konsisten, ergonomis, dan aman di area kerja.",
            visualType: "shield",
          },
        ],
      };
    }
  }

  // Generate Voiceover TTS (Hanya jika tidak melampirkan audioFile sendiri)
  let audioDataUri = "";
  let estimasiDurasiFrame = sceneData.durationInFrames || 540;

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
    console.log("🎙️ Membuat Voiceover Text-to-Speech (TTS)...");
    try {
      const teksNarasi = sceneData.insight || sceneData.subtitle || "Video edukasi motion graphic";
      const audioParts = await googleTTS.getAllAudioBase64(teksNarasi, {
        lang: "id",
        slow: false,
        host: "https://translate.google.com",
        timeout: 30000,
      });

      const combinedBuffer = Buffer.concat(
        audioParts.map((part) => Buffer.from(part.base64, "base64"))
      );

      fs.writeFileSync(path.resolve("./public/audio/voiceover.mp3"), combinedBuffer);
      audioDataUri = `data:audio/mp3;base64,${combinedBuffer.toString("base64")}`;

      const detikBicaraAktual = Math.ceil(teksNarasi.length / 10.5) + 3;
      const frameBicaraAktual = detikBicaraAktual * 30;

      estimasiDurasiFrame = Math.max(estimasiDurasiFrame, frameBicaraAktual);
      sceneData.durationInFrames = estimasiDurasiFrame;

      console.log(
        `✅ Audio VO Base64 siap! (${audioParts.length} bagian digabung, durasi final: ${Math.round(
          estimasiDurasiFrame / 30
        )} detik)`
      );
    } catch (error) {
      console.log("⚠️ Gagal membuat TTS:", error.message);
    }
  }
  console.log("🚀 Merender DynamicMotionVideo...");
  const bundled = await bundle({
    entryPoint: path.resolve("./src/index.ts"),
    publicDir: path.resolve("./public"),
  });

  const inputPropsData = {
    ...sceneData,
    durationInFrames: estimasiDurasiFrame,
    audioSrc: audioDataUri,
  };

  const composition = await selectComposition({
    serveUrl: bundled,
    id: "DynamicMotionVideo",
    inputProps: inputPropsData,
  });

  const outputFileName = `out/Video_${Date.now()}.mp4`;

  await renderMedia({
    composition,
    serveUrl: bundled,
    codec: "h264",
    outputLocation: outputFileName,
    inputProps: inputPropsData,
  });

  const durasiFinalDetik = Math.round(estimasiDurasiFrame / 30);
  console.log(`✅ Selesai! Video (${durasiFinalDetik} detik) dirender: ${outputFileName}`);
  await sendToTelegram(outputFileName, sceneData.title || ideKonten, durasiFinalDetik);
}

textToMp4();
