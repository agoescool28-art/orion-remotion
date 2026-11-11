import { GoogleGenerativeAI } from "@google/generative-ai";
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import path from "path";
import fs from "fs";

// === TAMBAHAN BARU: Import Google TTS ===
import * as googleTTS from "google-tts-api"; 
// ========================================

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const ideKonten = process.env.IDE_KONTEN; 

async function textToMp4() {
  console.log(`🧠 AI Director memproses ide: "${ideKonten}"...`);

  // Pastikan folder output tersedia
  if (!fs.existsSync("out")) fs.mkdirSync("out");
  
  // === TAMBAHAN BARU: Pastikan folder public tersedia untuk simpan audio ===
  if (!fs.existsSync("public")) fs.mkdirSync("public");
  if (!fs.existsSync("public/audio")) fs.mkdirSync("public/audio");
  // ========================================================================

  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash", 
    generationConfig: { responseMimeType: "application/json" } 
  });
  
  const prompt = `Buat 1 scene motion graphic vertikal tentang ${ideKonten}. Keluarkan JSON murni dengan: title (string), subtitle (string), insight (string), durationInFrames (number max 150), themeColor (hex code).`;
  
  const result = await model.generateContent(prompt);
  const sceneData = JSON.parse(result.response.text());

  console.log("🎥 JSON Skenario jadi!");

  // === TAMBAHAN BARU: PROSES GENERATE AUDIO TTS SEBELUM RENDER ===
  console.log("🎙️ Membuat Voiceover Text-to-Speech (TTS)...");
  try {
    // Kita minta TTS membacakan bagian 'insight' dari hasil Gemini
    const teksNarasi = sceneData.insight || "Proses selesai";
    
    // Generate URL audio dari Google Translate TTS versi bahasa Indonesia
    const audioUrl = googleTTS.getAudioUrl(teksNarasi, {
      lang: 'id',
      slow: false,
      host: 'https://translate.google.com',
    });
    
    // Download audio-nya dan simpan sebagai file .mp3
    const response = await fetch(audioUrl);
    const buffer = await response.arrayBuffer();
    fs.writeFileSync(path.resolve("./public/audio/voiceover.mp3"), Buffer.from(buffer));
    console.log("✅ File voiceover.mp3 berhasil disimpan ke folder public!");
  } catch (error) {
    console.log("⚠️ Gagal membuat TTS, lanjut render tanpa suara narasi baru. Error:", error);
  }
  // ================================================================

  console.log("🚀 Memulai proses Remotion FFmpeg...");

  // Proses render (Sama persis seperti kode Anda sebelumnya)
  const bundled = await bundle(path.resolve("./src/index.ts"));
  
  const composition = await selectComposition({
    serveUrl: bundled,
    // CATATAN: Pastikan ID ini sesuai dengan ID di Root.tsx Anda
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