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
    console.log("⚠️ Token atau Chat ID Telegram belum diset di GitHub Secrets. Lewatkan pengiriman Telegram.");
    return;
  }

  console.log("📤 Mengirim video hasil render ke Telegram...");
  try {
    const FormData = (await import("form-data")).default;
    const fetch = globalThis.fetch || (await import("node-fetch")).default;

    const form = new FormData();
    form.append("chat_id", chatId);
    form.append("video", fs.createReadStream(videoPath));
    form.append("caption", `🎬 Video Motion Graphic Selesai Dirender!\n\nTopik: "${ideKonten}"`);

    const response = await fetch(`https://api.telegram.org/bot${token}/sendVideo`, {
      method: "POST",
      body: form,
    });

    const result = await response.json();
    if (result.ok) {
      console.log("✅ Video berhasil dikirim ke Telegram!");
    } else {
      console.log("❌ Gagal mengirim ke Telegram:", result);
    }
  } catch (err) {
    console.log("❌ Error saat kirim Telegram:", err.message);
  }
}

async function textToMp4() {
  console.log(`🧠 AI Director memproses ide secara dinamis: "${ideKonten}"...`);

  if (!fs.existsSync("out")) fs.mkdirSync("out");
  if (!fs.existsSync("public")) fs.mkdirSync("public");
  if (!fs.existsSync("public/audio")) fs.mkdirSync("public/audio");
  if (!fs.existsSync("src")) fs.mkdirSync("src");

  const prompt = `
  Bertindaklah sebagai Senior Motion Designer dan AI Director. Analisis ide konten berikut: "${ideKonten}".
  Tentukan secara cerdas dan dinamis:
  1. title: Judul singkat yang kuat (maks 4 kata).
  2. subtitle: Penjelas atau poin utama yang tajam.
  3. insight: Narasi voiceover yang mengalir natural dalam Bahasa Indonesia (WAJIB di bawah 170 karakter agar aman di TTS).
  4. themeStyle: Pilih salah satu gaya visual ("industrial", "corporate", "creative", atau "clean").
  5. accentColor: Kode HEX warna aksen yang cocok (misal: #10b981, #3b82f6, #f59e0b).
  6. durationInFrames: Angka durasi antara 120 sampai 180.

  Keluarkan hasilnya dalam format JSON murni tanpa teks lain.
  `;

  const daftarModel = [
    "gemini-3.8-flash",
    "gemini-3.5-flash",
  ];

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
      console.log(`✅ Skenario berhasil dibuat menggunakan: ${modelTerpakai}`);
      break;
    }
  }

  let sceneData;
  if (result) {
    const rawText = result.response.text();
    const jsonString = rawText.replace(/```json|```/g, "").trim();
    sceneData = JSON.parse(jsonString);
    fs.writeFileSync("./src/materi.json", JSON.stringify(sceneData, null, 2));
  } else {
    console.log("⚠️ Semua server API Gemini sedang tidak merespons. Menggunakan cadangan src/materi.json...");
    sceneData = JSON.parse(fs.readFileSync("./src/materi.json", "utf-8"));
  }

  console.log("💡 Data Skenario Aktif:", sceneData);

  // Generate Voiceover TTS Audio & Konversi langsung ke Base64 Data URI
  console.log("🎙️ Membuat Voiceover Text-to-Speech (TTS)...");
  let audioDataUri = "";
  try {
    let teksNarasi = sceneData.insight || "Proses perbaikan berkelanjutan di area kerja";
    if (teksNarasi.length > 180) {
      teksNarasi = teksNarasi.substring(0, 175) + "...";
    }

    const audioUrl = googleTTS.getAudioUrl(teksNarasi, {
      lang: "id",
      slow: false,
      host: "https://translate.google.com",
    });

    const fetch = globalThis.fetch || (await import("node-fetch")).default;
    const response = await fetch(audioUrl);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = Buffer.from(arrayBuffer);

    fs.writeFileSync(path.resolve("./public/audio/voiceover.mp3"), audioBuffer);
    audioDataUri = `data:audio/mp3;base64,${audioBuffer.toString("base64")}`;
    console.log("✅ File voiceover.mp3 & Base64 Audio berhasil disiapkan!");
  } catch (error) {
    console.log("⚠️ Gagal membuat TTS:", error.message);
  }

  // Remotion Bundling & Render
  console.log("🚀 Memulai proses Remotion Bundle & Render...");
  const bundled = await bundle({
    entryPoint: path.resolve("./src/index.ts"),
    publicDir: path.resolve("./public"),
  });

  const inputPropsData = {
    ...sceneData,
    data: sceneData,
    audioSrc: audioDataUri,
  };

  const composition = await selectComposition({
    serveUrl: bundled,
    id: "StyleframeAkalV36",
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
