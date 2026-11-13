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

async function sendToTelegram(videoPath) {
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
      `🎬 Video Motion Graphic Selesai Dirender!\n\nTopik: "${ideKonten}"`
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
  console.log(`🧠 AI Director merancang 3 adegan untuk topik: "${ideKonten}"...`);

  if (!fs.existsSync("out")) fs.mkdirSync("out", { recursive: true });
  if (!fs.existsSync("public/audio")) fs.mkdirSync("public/audio", { recursive: true });

  const prompt = `
  Bertindaklah sebagai Senior Motion Designer dan Industrial Engineer. Buat skenario video motion graphic vertikal 3 adegan untuk topik: "${ideKonten}".
  Keluarkan JSON murni dengan struktur persis seperti ini:
  {
    "title": "Judul utama singkat maks 4 kata",
    "subtitle": "Subjudul ringkas",
    "insight": "Narasi voiceover Bahasa Indonesia yang jelas dan mengalir (WAJIB di bawah 165 karakter)",
    "accentColor": "#10b981",
    "durationInFrames": 180,
    "scenes": [
      {
        "tag": "01 • PENGENALAN",
        "heading": "Judul Adegan 1 (maks 3 kata)",
        "body": "Penjelasan inti adegan 1 (maks 12 kata)",
        "visualType": "gear"
      },
      {
        "tag": "02 • MEKANISME / DATA",
        "heading": "Judul Adegan 2 (maks 3 kata)",
        "body": "Penjelasan cara kerja atau dampak nyata (maks 12 kata)",
        "visualType": "chart"
      },
      {
        "tag": "03 • PENERAPAN",
        "heading": "Judul Adegan 3 (maks 3 kata)",
        "body": "Kesimpulan atau langkah aksi (maks 12 kata)",
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
      console.log(`✅ Skenario 3 adegan dibuat oleh: ${modelTerpakai}`);
      break;
    }
  }

  let sceneData;
  if (result) {
    const rawText = result.response.text();
    const jsonString = rawText.replace(/```json|```/g, "").trim();
    sceneData = JSON.parse(jsonString);
  } else {
    console.log("⚠️ API Gemini sibuk. Menyusun 3 adegan dinamis otomatis dari topik input...");
    const judulSingkat = ideKonten.split(" ").slice(0, 4).join(" ").toUpperCase();
    sceneData = {
      title: judulSingkat,
      subtitle: ideKonten,
      insight: `Mari pelajari penerapan ${ideKonten} untuk meningkatkan efisiensi dan kualitas kerja.`,
      accentColor: "#10b981",
      durationInFrames: 180,
      scenes: [
        {
          tag: "01 • KONSEP UTAMA",
          heading: judulSingkat,
          body: `Memahami prinsip dasar ${ideKonten}.`,
          visualType: "gear",
        },
        {
          tag: "02 • DAMPAK PROSES",
          heading: "EFISIENSI OPTIMAL",
          body: "Mengurangi pemborosan waktu dan tenaga kerja secara terukur.",
          visualType: "chart",
        },
        {
          tag: "03 • IMPLEMENTASI",
          heading: "SIAP DITERAPKAN",
          body: "Langkah praktis yang konsisten dan aman di area kerja.",
          visualType: "shield",
        },
      ],
    };
  }

  console.log("💡 Skenario Video Aktif:", JSON.stringify(sceneData, null, 2));

  // Generate Voiceover TTS
  console.log("🎙️ Membuat Voiceover Text-to-Speech (TTS)...");
  let audioDataUri = "";
  try {
    let teksNarasi = sceneData.insight || ideKonten;
    if (teksNarasi.length > 175) {
      teksNarasi = teksNarasi.substring(0, 170) + "...";
    }

    const audioUrl = googleTTS.getAudioUrl(teksNarasi, {
      lang: "id",
      slow: false,
      host: "https://translate.google.com",
    });

    const response = await fetch(audioUrl);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = Buffer.from(arrayBuffer);

    fs.writeFileSync(path.resolve("./public/audio/voiceover.mp3"), audioBuffer);
    audioDataUri = `data:audio/mp3;base64,${audioBuffer.toString("base64")}`;
    console.log("✅ Audio VO Base64 siap!");
  } catch (error) {
    console.log("⚠️ Gagal membuat TTS:", error.message);
  }

  // Bundle & Render menggunakan komponen baru DynamicMotionVideo
  console.log("🚀 Merender DynamicMotionVideo...");
  const bundled = await bundle({
    entryPoint: path.resolve("./src/index.ts"),
    publicDir: path.resolve("./public"),
  });

  const inputPropsData = {
    ...sceneData,
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

  console.log(`✅ Selesai! Video dirender: ${outputFileName}`);
  await sendToTelegram(outputFileName);
}

textToMp4();
