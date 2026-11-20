import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import * as googleTTS from "google-tts-api";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const PIXABAY_API_KEY = process.env.PIXABAY_API_KEY;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const IDE_KONTEN = (process.env.IDE_KONTEN || "Perbandingan Takt Time vs Cycle Time").trim();

// 1. Fungsi TTS Bahasa Indonesia (Mengembalikan dataUri & byteLength)
async function generateIndonesianTtsBase64(text) {
  const cleanText = text.replace(/[*#_`]/g, "").trim();
  const parts = await googleTTS.getAllAudioBase64(cleanText, {
    lang: "id",
    slow: false,
    host: "https://translate.google.com",
    splitPunct: ",.?!;:",
  });
  const buffers = parts.map((p) => Buffer.from(p.base64, "base64"));
  const merged = Buffer.concat(buffers);
  return {
    dataUri: `data:audio/mp3;base64,${merged.toString("base64")}`,
    byteLength: merged.length,
  };
}

// 2. Fungsi Pengunduh Foto & Ilustrasi HD dari Pixabay
async function fetchPixabayMedia(query, index) {
  if (!PIXABAY_API_KEY) {
    console.warn("⚠️ PIXABAY_API_KEY kosong! Pastikan sudah diatur di GitHub Secrets & render-gemini.yml.");
    return null;
  }

  const searchQueries = [query, "automotive engine mechanic", "modern technology"].filter(Boolean);

  for (const q of searchQueries) {
    try {
      const url = `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(q)}&image_type=all&safesearch=true&per_page=5`;
      const res = await fetch(url);
      if (!res.ok) continue;

      const data = await res.json();
      const hit = data.hits?.[index % Math.max(1, data.hits.length)] || data.hits?.[0];
      const imageUrl = hit?.largeImageURL || hit?.webformatURL;
      if (!imageUrl) continue;

      const imgRes = await fetch(imageUrl);
      if (!imgRes.ok) continue;

      const buffer = Buffer.from(await imgRes.arrayBuffer());
      const fileName = `pixabay_scene_${index + 1}.jpg`;
      fs.writeFileSync(`./public/${fileName}`, buffer);
      console.log(`✅ Visual Pixabay terpasang [Adegan ${index + 1}]: ${fileName} ("${q}")`);
      return fileName;
    } catch (err) {
      console.warn(`⚠️ Gagal ambil visual Pixabay ("${q}"):`, err.message);
    }
  }

  return null;
}

// 3. Fungsi Panggil Gemini dengan Retry & Fallback Model Aktif
async function callGeminiWithRetry(prompt) {
  if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY tidak ditemukan di environment!");

  const models = [
    "gemini-2.5-flash",
    "gemini-flash-latest",
    "gemini-2.0-flash"
  ];
  const delays = [5000, 15000, 30000];

  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: {
                temperature: 0.7,
                responseMimeType: "application/json",
              },
            }),
          }
        );

        if (!res.ok) {
          const errText = await res.text();
          throw new Error(`HTTP ${res.status}: ${errText}`);
        }

        const data = await res.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!rawText) throw new Error("Respons Gemini kosong");
        return rawText;
      } catch (err) {
        console.warn(`⚠️ Percobaan ${attempt} gagal (${model}): ${err.message}`);
        await new Promise((r) => setTimeout(r, delays[i] || 5000));
      }
    }
  }
  throw new Error("Semua percobaan Gemini API gagal.");
}

// 4. Kirim Video ke Telegram
async function sendVideoToTelegram(videoPath, caption) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.log("ℹ️ Telegram credentials tidak diset, melewati pengiriman Telegram.");
    return;
  }

  const form = new FormData();
  form.append("chat_id", TELEGRAM_CHAT_ID);
  form.append("caption", caption);
  const fileBuffer = fs.readFileSync(videoPath);
  form.append("video", new Blob([fileBuffer], { type: "video/mp4" }), "video_1.mp4");

  const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendVideo`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    console.warn("⚠️ Gagal mengirim ke Telegram:", await res.text());
  } else {
    console.log("✅ Video berhasil terkirim ke Telegram!");
  }
}

async function main() {
  if (!fs.existsSync("./public")) fs.mkdirSync("./public", { recursive: true });
  if (!fs.existsSync("./out")) fs.mkdirSync("./out", { recursive: true });

  let sceneData = null;

  // Cek apakah IDE_KONTEN sudah berupa JSON (baik langsung atau terbungkus markdown ```json)
  const cleanedInput = IDE_KONTEN.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
  if (cleanedInput.startsWith("{")) {
    try {
      const parsed = JSON.parse(cleanedInput);
      if (parsed && Array.isArray(parsed.scenes)) {
        console.log("🎬 Mode Manual JSON: Membaca skenario kustom (Bypass Gemini API)...");
        sceneData = parsed;
      }
    } catch (e) {
      console.warn("⚠️ Input diawali '{' tapi gagal parse JSON, beralih ke Mode Otomatis Gemini:", e.message);
    }
  }

  if (!sceneData) {
    console.log(`🧠 Mode Otomatis: Meracik skenario dari ide: "${IDE_KONTEN}"...`);

    const prompt = `Kamu adalah sutradara video motion graphic edukasi vertikal (9:16) bergaya Technical Explainer modern (latar biru gelap #061338, sorotan emas #facc15, merah #ef4444 untuk masalah/risiko, hijau #22c55e untuk solusi).
Buat skenario video dari ide berikut: "${IDE_KONTEN}"

Aturan wajib:
1. Buat tepat 4 adegan (scenes) yang tuntas dari awal sampai kesimpulan (total 55-75 kata, maks 18 kata per adegan):
  - Adegan 01: Pengenalan topik & konteks utama.
  - Adegan 02: Perbandingan / inti perbedaan (gunakan "overlayType": "compare" jika topik membandingkan 2 hal).
  - Adegan 03: Data, fakta lapangan, atau dampak utama ("bars" atau "pills").
  - Adegan 04: Kesimpulan praktis & rekomendasi penutup yang tuntas ("checklist").
2. Pilih "visualType" yang paling sesuai dari: "medical", "history", "globe", "bulb", "gear", "chart", "shield", "flow".
3. Jika topik mengandung perbandingan ("vs", "perbedaan", "dibanding", "mana lebih baik"), WAJIB gunakan "overlayType": "compare" pada adegan ke-2 dengan mengisi "compareLeft" dan "compareRight" (masing-masing punya "title", "badge", "tone", dan 3 string singkat di "items").
4. Setiap adegan WAJIB menyertakan "visualQuery": "2-3 kata kunci bahasa Inggris spesifik yang relevan dengan konteks industri/teknologi/edukasi (hindari kata ambigu seperti 'speed' atau 'race'; gunakan misalnya 'manufacturing assembly', 'warehouse logistics', 'engineering blueprint', 'data analytics')".
5. Keluarkan HANYA JSON murni tanpa markdown:
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
      "visualType": "bulb",
      "visualQuery": "factory production"
    }
  ]
}`;

    const rawJson = await callGeminiWithRetry(prompt);
    const cleanedJson = rawJson.replace(/```json|```/g, "").trim();
    sceneData = JSON.parse(cleanedJson);
  }

  // Jalankan pengunduhan foto/ilustrasi HD Pixabay untuk SEMUA mode
  if (Array.isArray(sceneData.scenes)) {
    for (let i = 0; i < sceneData.scenes.length; i++) {
      const sc = sceneData.scenes[i];
      if (!sc.media && sc.overlayType !== "compare") {
        const query = sc.visualQuery || sc.heading;
        const downloadedFile = await fetchPixabayMedia(query, i);
        if (downloadedFile) {
          sc.media = downloadedFile;
          sc.mediaType = "image";
          sc.motion = i % 2 === 0 ? "zoom-in" : "zoom-out";
        }
      }
    }
  }

  // Baca durasi ASLI audio kustom atau buat TTS Bahasa Indonesia
  if (Array.isArray(sceneData.scenes)) {
    if (sceneData.audioSrc && !sceneData.audioSrc.startsWith("data:")) {
      const localAudioPath = path.resolve("./public", sceneData.audioSrc);
      if (fs.existsSync(localAudioPath)) {
        let exactAudioSec = 84;
        try {
          const probeOut = execSync(
            `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${localAudioPath}"`
          )
            .toString()
            .trim();
          const parsed = parseFloat(probeOut);
          if (!isNaN(parsed) && parsed > 0) exactAudioSec = parsed;
        } catch (e) {
          const stats = fs.statSync(localAudioPath);
          exactAudioSec = stats.size / 15000;
        }

        const totalFrames = Math.ceil((exactAudioSec + 1.5) * 30);
        sceneData.durationInFrames = totalFrames;
        console.log(
          `🎙️ VO Kustom: ${sceneData.audioSrc} | Durasi asli: ${exactAudioSec.toFixed(2)} dtk -> Render: ${(totalFrames / 30).toFixed(2)} dtk (${totalFrames} frames)`
        );
      }
    } else if (!sceneData.audioSrc) {
      const teksNarasi = sceneData.scenes.map((s) => s.body).join(". ");
      console.log("🎙️ Membuat suara narator TTS Bahasa Indonesia...");
      const ttsResult = await generateIndonesianTtsBase64(teksNarasi);
      sceneData.audioSrc = ttsResult.dataUri;

      const actualAudioSec = Math.ceil(ttsResult.byteLength / 4000);
      const totalSec = Math.max(30, actualAudioSec + 3);
      sceneData.durationInFrames = totalSec * 30;
      console.log(`✅ TTS berhasil dibuat (${ttsResult.byteLength} bytes, ~${totalSec} detik)`);
    }
  }

  // Aktifkan BGM & Whoosh otomatis jika file tersedia di folder public/
  if (fs.existsSync("./public/bgm.mp3")) sceneData.bgmSrc = "bgm.mp3";
  if (fs.existsSync("./public/whoosh.mp3")) sceneData.whooshSrc = "whoosh.mp3";

  console.log("📦 Membundel proyek Remotion...");
  const bundleLocation = await bundle({
    entryPoint: path.resolve("./src/index.ts"),
  });

  const composition = await selectComposition({
    serveUrl: bundleLocation,
    id: "DynamicMotionVideo",
    inputProps: sceneData,
  });

  const outputLocation = path.resolve("./out/video_1.mp4");
  console.log(`🎬 Merender video (${sceneData.durationInFrames} frames)...`);

  await renderMedia({
    composition: {
      ...composition,
      durationInFrames: sceneData.durationInFrames || composition.durationInFrames,
    },
    serveUrl: bundleLocation,
    codec: "h264",
    outputLocation,
    inputProps: sceneData,
  });

  console.log("🎉 Render selesai:", outputLocation);
  const labelIde = sceneData.title || IDE_KONTEN;
  await sendVideoToTelegram(outputLocation, `🎬 *${sceneData.title || "Video Selesai"}*\nTopik: ${labelIde}`);
}

main().catch((err) => {
  console.error("❌ Fatal Error:", err);
  process.exit(1);
});
