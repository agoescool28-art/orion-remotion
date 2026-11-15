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
1. Buat tepat 4 adegan (scenes) yang tuntas dari awal sampai kesimpulan (total 55-75 kata, maks 18 kata per adegan):
   - Adegan 01: Pengenalan topik & konteks utama.
   - Adegan 02: Perbandingan / inti perbedaan (gunakan "overlayType": "compare" jika topik membandingkan 2 hal).
   - Adegan 03: Data, fakta lapangan, atau dampak utama ("bars" atau "pills").
   - Adegan 04: Kesimpulan praktis & rekomendasi penutup yang tuntas ("checklist").
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
      "heading": "JUDUL BAB SINGKAT",
      "headingTone": "gold",
      "heroStat": "2 OPSI",
      "heroLabel": "PERBANDINGAN UTAMA",
      "body": "Kalimat pembuka yang menarik tentang topik yang dibahas.",
      "overlayType": "pills",
      "points": [
        { "text": "Poin pengantar pertama", "tone": "neutral" },
        { "text": "Poin pengantar kedua", "tone": "gold" }
      ],
      "visualType": "bulb"
    },
    {
      "tag": "02 • PERBANDINGAN",
      "heading": "DUEL KARAKTERISTIK",
      "headingTone": "gold",
      "body": "Kalimat yang membandingkan sisi kiri dan sisi kanan secara jelas.",
      "overlayType": "compare",
      "compareLeft": {
        "title": "OPSI A",
        "badge": "SISI KIRI",
        "tone": "red",
        "items": ["Ciri utama pertama", "Kelebihan atau batasannya", "Kondisi pemakaian"]
      },
      "compareRight": {
        "title": "OPSI B",
        "badge": "SISI KANAN",
        "tone": "green",
        "items": ["Ciri utama pertama", "Keunggulan utamanya", "Kondisi pemakaian"]
      },
      "visualType": "flow"
    }
  ]
}`;

    const candidateModels = [
      "gemini-3.8-flash",
      "gemini-3-flash-preview",
      "gemini-3.8-flash",
    ];
    let rawText = "";

    for (let attempt = 0; attempt < candidateModels.length; attempt++) {
      const modelName = candidateModels[attempt];
      try {
        if (attempt > 0) {
          const waitMs = attempt * 5000;
          console.log(`🔄 Percobaan ke-${attempt + 1} (${modelName}) dalam ${waitMs / 1000} detik...`);
          await new Promise((r) => setTimeout(r, waitMs));
        }
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: { responseMimeType: "application/json" },
        });
        const aiResponse = await model.generateContent(prompt, { timeout: 30000 });
        rawText = aiResponse.response.text();
        if (rawText) break;
      } catch (err) {
        console.warn(`⚠️ ${modelName} gagal (${err.status || err.message}), mencoba ulang...`);
      }
    }

    if (rawText) {
      sceneData = JSON.parse(rawText);
    } else {
      console.log("🛡️ Menggunakan struktur cadangan otomatis agar render tetap lanjut...");
      const cleanTopic = ideKonten.toUpperCase().slice(0, 32);
      sceneData = {
        title: cleanTopic,
        subtitle: "Visualisasi Edukasi Terstruktur",
        styleConfig: {
          bgColor: "#061338",
          accentColor: "#facc15",
          dangerColor: "#ef4444",
          successColor: "#22c55e",
          watermark: "orionmotion",
        },
        scenes: [
          {
            tag: "01 • KONSEP UTAMA",
            heading: cleanTopic,
            headingTone: "gold",
            heroStat: "100%",
            heroLabel: "FOKUS SISTEM",
            body: `Mari kita pahami konsep dasar mengenai ${ideKonten} secara terstruktur dan mudah diterapkan.`,
            overlayType: "pills",
            points: [
              { text: "Fondasi Prinsip Kerja", tone: "neutral" },
              { text: "Penerapan Konsisten di Lapangan", tone: "gold" },
            ],
            visualType: "flow",
          },
          {
            tag: "02 • DAMPAK & HASIL",
            heading: "MANFAAT PENERAPAN",
            headingTone: "green",
            heroStat: "+40%",
            heroLabel: "EFISIENSI KERJA",
            body: `Dengan memahami ${ideKonten}, proses kerja menjadi lebih stabil, efisien, dan terukur setiap hari.`,
            overlayType: "bars",
            points: [
              { text: "Stabilitas Proses", value: "95%", percent: 95, tone: "green" },
              { text: "Efisiensi Operasional", value: "85%", percent: 85, tone: "gold" },
            ],
            visualType: "chart",
          },
        ],
      };
    }
    sceneData.audioSrc = "";
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
    const estimatedSec = Math.max(25, Math.ceil(wordCount / 1.65) + 4);
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
  }
  console.log("✅ SUKSES! Video MP4 tersimpan di ./out/video_1.mp4");
}

textToMp4().catch((err) => {
  console.error(err);
  process.exit(1);
});
