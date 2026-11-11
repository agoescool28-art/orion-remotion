import { GoogleGenerativeAI } from "@google/generative-ai";
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import path from "path";
import fs from "fs";
import * as googleTTS from "google-tts-api"; 

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const ideKonten = process.env.IDE_KONTEN || "Konsep Produktivitas Kerja"; 

async function sendToTelegram(videoPath) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.log("⚠️ Token atau Chat ID Telegram belum diset di GitHub Secrets. Lewatkan pengiriman Telegram.");
    return;
  }

  console.log("📤 Mengirim video hasil render ke Telegram pribadi...");
  try {
    const FormData = (await import("form-data")).default;
    const fetch = (await import("node-fetch")).default;

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

  const model = genAI.getGenerativeModel({ 
    model: "gemini-3.8-flash", 
    generationConfig: { responseMimeType: "application/json" } 
  });
  
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
  
  let result;
  let attempts = 0;
  const maxAttempts = 3;

  while (attempts < maxAttempts) {
    try {
      attempts++;
      result = await model.generateContent(prompt);
      break;
    } catch (err) {
      console.log(`⚠️ Server Gemini sibuk (Percobaan ${attempts}/${maxAttempts}). Menunggu 5 detik...`);
      if (attempts >= maxAttempts) throw err;
      await new Promise(res => setTimeout(res, 5000));
    }
  }
  // 1. Ambil teks respons Gemini & bersihkan format markdown jika ada
  const rawText = result.response.text();
  const jsonString = rawText.replace(/```json|```/g, "").trim();
  const dynamicData = JSON.parse(jsonString);

  console.log("💡 Data Dinamis dari Gemini:", dynamicData);

  // 2. Simpan juga ke file materi.json (agar komponen React bisa membaca/fallback)
  fs.writeFileSync("./src/materi.json", JSON.stringify(dynamicData, null, 2));

  // 3. Masukkan dynamicData ke dalam inputProps saat merender
  await renderMedia({
    composition,
    serveUrl,
    codec: "h264",
    outputLocation: outputFileName,
    inputProps: dynamicData, // <--- KUNCI UTAMA: Menyuntikkan data Gemini ke Remotion
  });
  const sceneData = JSON.parse(result.response.text());

  console.log(`🎥 Skenario & Style Dinamis Jadi! (Gaya: ${sceneData.themeStyle}, Warna: ${sceneData.accentColor})`);

  console.log("🎙️ Membuat Voiceover Text-to-Speech (TTS)...");
  try {
    // PEMBATASAN KARAKTER: Potong otomatis jika narasi melebihi 180 karakter
    let teksNarasi = sceneData.insight || "Proses render selesai";
    if (teksNarasi.length > 180) {
      teksNarasi = teksNarasi.substring(0, 175) + "...";
    }

    const audioUrl = googleTTS.getAudioUrl(teksNarasi, {
      lang: 'id',
      slow: false,
      host: 'https://translate.google.com',
    });
    
    const response = await fetch(audioUrl);
    const buffer = await response.arrayBuffer();
    fs.writeFileSync(path.resolve("./public/audio/voiceover.mp3"), Buffer.from(buffer));
    console.log("✅ File voiceover.mp3 berhasil disimpan!");
  } catch (error) {
    console.log("⚠️ Gagal membuat TTS:", error.message);
  }

  console.log("🚀 Memulai proses Remotion FFmpeg...");

  const bundled = await bundle(path.resolve("./src/index.ts"));
  
  const composition = await selectComposition({
    serveUrl: bundled,
    id: "StyleframeAkalV36", 
    inputProps: { data: sceneData },
  });

  const outputFileName = `out/Video_${Date.now()}.mp4`;
  await renderMedia({
    composition,
    serveUrl: bundled,
    codec: "h264",
    outputLocation: outputFileName,
    inputProps: { data: sceneData },
  });

  console.log(`✅ Selesai! Video dirender: ${outputFileName}`);

  await sendToTelegram(outputFileName);
}

textToMp4();