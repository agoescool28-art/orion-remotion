import { GoogleGenerativeAI } from "@google/generative-ai";
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import path from "path";
import fs from "fs";
import * as googleTTS from "google-tts-api"; 

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const ideKonten = process.env.IDE_KONTEN || "Konsep Produktivitas Kerja"; 

async function textToMp4() {
  console.log(`🧠 AI Director memproses ide secara dinamis: "${ideKonten}"...`);

  if (!fs.existsSync("out")) fs.mkdirSync("out");
  if (!fs.existsSync("public")) fs.mkdirSync("public");
  if (!fs.existsSync("public/audio")) fs.mkdirSync("public/audio");

  const model = genAI.getGenerativeModel({ 
    model: "gemini-3.8-flash", 
    generationConfig: { responseMimeType: "application/json" } 
  });
  
  // === PROMPT DINAMIS: Gemini menyesuaikan style visual & narasi berdasarkan topik ===
  const prompt = `
  Bertindaklah sebagai Senior Motion Designer dan AI Director. Analisis ide konten berikut: "${ideKonten}".
  Tentukan secara cerdas dan dinamis:
  1. title: Judul singkat yang kuat (maks 4 kata).
  2. subtitle: Penjelas atau poin utama yang tajam.
  3. insight: Narasi voiceover yang mengalir natural, edukatif, dan sesuai konteks topik dalam Bahasa Indonesia.
  4. themeStyle: Pilih salah satu gaya visual yang paling cocok dengan topik ("industrial" untuk manufaktur/teknik, "corporate" untuk bisnis/manajemen, "creative" untuk psikologi/ide/quotes, atau "clean" untuk edukasi umum).
  5. accentColor: Kode HEX warna aksen yang cocok dengan tema (misal: #10b981 untuk hijau pendar industrial, #3b82f6 untuk biru korporat, #f59e0b untuk kuning kreatif).
  6. durationInFrames: Angka durasi antara 120 sampai 180.

  Keluarkan hasilnya dalam format JSON murni tanpa teks lain.
  `;
  
  const result = await model.generateContent(prompt);
  const sceneData = JSON.parse(result.response.text());

  console.log(`🎥 Skenario & Style Dinamis Jadi! (Gaya: ${sceneData.themeStyle}, Warna: ${sceneData.accentColor})`);

  // Proses Generate Voiceover TTS
  console.log("🎙️ Membuat Voiceover Text-to-Speech (TTS)...");
  try {
    const teksNarasi = sceneData.insight || "Proses selesai";
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
    console.log("⚠️ Gagal membuat TTS, lanjut render tanpa suara narasi. Error:", error);
  }

  console.log("🚀 Memulai proses Remotion FFmpeg...");

  const bundled = await bundle(path.resolve("./src/index.ts"));
  
  const composition = await selectComposition({
    serveUrl: bundled,
    id: "VerticalMotionReel", 
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
}

textToMp4();