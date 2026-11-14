import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import { GoogleGenerativeAI } from "@google/generative-ai";
import googleTTS from "google-tts-api";
import path from "path";
import fs from "fs";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateIndonesianTtsBase64(text) {
  const cleanText = text.replace(/\s+/g, " ").trim();
  const segments = await googleTTS.getAllAudioBase64(cleanText, {
    lang: "id",
    slow: false,
    host: "https://translate.google.com",
    timeout: 15000,
    splitPunct: ",.?!",
  });
  const buffers = segments.map((seg) => Buffer.from(seg.base64, "base64"));
  const combinedBuffer = Buffer.concat(buffers);
  return {
    dataUri: `data:audio/mp3;base64,${combinedBuffer.toString("base64")}`,
    byteLength: combinedBuffer.length,
  };
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
      const ttsResult = await generateIndonesianTtsBase64(teksNarasi);
      audioDataUri = ttsResult.dataUri;
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

    const model = genAI.getGenerativeModel({
      model: "gemini-3.8-flash",
      generationConfig: { responseMimeType: "application/json" },
    });

    const aiResponse = await model.generateContent(prompt);
    const rawText = aiResponse.response.text();
    sceneData = JSON.parse(rawText);
    sceneData.audioSrc = "";

    console.log("🎙️ Membuat suara narator bahasa Indonesia (Google TTS)...");
    const teksNarasi =
      sceneData.scenes && sceneData.scenes.length > 0
        ? sceneData.scenes.map((s) => s.body).join(" ")
        : sceneData.insight || sceneData.subtitle || "Video edukasi motion graphic";

    const ttsResult = await generateIndonesianTtsBase64(teksNarasi);
    audioDataUri = ttsResult.dataUri;

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
// Kirim otomatis ke Telegram jika Secrets tersedia
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (botToken && chatId) {
    console.log("📲 Mengirim video ke Telegram...");
    const videoBuffer = fs.readFileSync("./out/video_1.mp4");
    const formData = new FormData();
    formData.append("chat_id", chatId);
    formData.append("caption", `🎬 ${sceneData.title || "Video Motion Graphic"}`);
    formData.append("video", new Blob([videoBuffer], { type: "video/mp4" }), "video_1.mp4");

    const tgRes = await fetch(`https://api.telegram.org/bot${botToken}/sendVideo`, {
      method: "POST",
      body: formData,
    });
    const tgJson = await tgRes.json();
    if (tgJson.ok) {
      console.log("✅ Video berhasil terkirim ke Telegram!");
    } else {
      console.error("⚠️ Gagal kirim ke Telegram:", tgJson);
    }
  } else {
    console.log("ℹ️ TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID belum diset di environment.");
  }
  console.log("✅ SUKSES! Video MP4 tersimpan di ./out/video_1.mp4");
}

textToMp4().catch((err) => {
  console.error(err);
  process.exit(1);
});
