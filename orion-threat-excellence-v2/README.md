# ORION Motion Documentary — The Threat of Excellence

## Jalankan
```bash
npm install
npm run start
npm run render
```

- 1080 × 1920, 30 FPS, 2237 frames (74,567 detik); seluruh voice-over asli di `public/voiceover.mp3` (74,553 detik) diputar satu kali.
- 8 adegan sinematik dengan komposisi dan metafora visual berbeda, kinetic typography, parallax, masking, jalur SVG, partikel, serta animasi `spring`.
- Preview: `npm run start`. Render final: `npm run render`.
- Render membutuhkan Node.js dan akses npm.

## Toyota Way — Filosofi di Balik Keunggulan

- Composition vertikal 1080 × 1920, 30 FPS, durasi 30 detik, dengan voice-over Bahasa Indonesia, musik industrial, dan SFX.
- Preview 10 detik (300 frame): `npm run render:toyota-way-preview` → `out/toyota-way-clean-preview-v1.mp4`.
- Render penuh: `npm run render:toyota-way` → `out/toyota-way-clean-v1.mp4`.
- Composition baru `ToyotaWay` mempertahankan composition lama `OrionThreatOfExcellence` dan output-nya.
- Composition aktif Toyota Way terdaftar dari `src/ToyotaWay.tsx`; `src/MainVideo.tsx` adalah composition terpisah bernama `ToyotaWayNeon`.
- File MP4 di `out/` adalah hasil render statis dan tidak berubah saat kode diperbarui. `out/toyota-way-preview.mp4` dan `out/toyota-way.mp4` merupakan output lama, bukan preview otomatis dari source saat ini.
- Preview review terbaru (10 detik): `npx remotion render src/index.ts ToyotaWay out/toyota-way-cinematic-review-v2.mp4 --frames=0-299`.

### Status VO dan pembuatan lokal gratis

- `public/audio/toyota-way-neon-id.wav` bukan VO final dan tidak dipakai oleh composition. `ToyotaWay` memutar VO `public/audio/toyota-way-vo-final.wav`, musik `public/toyota-way-music.wav`, dan SFX `public/toyota-way-sfx.wav`. Composition terpisah `ToyotaWayNeon` memakai `public/audio/toyota-way-vo-sample.wav`.
- Naskah VO Toyota Way lengkap tidak tersedia sebagai teks di repository. Untuk mempertahankan narasi secara persis, gunakan file transkrip asli—jangan menebak atau menulis ulang isinya.
- Gemini TTS dapat diarahkan dengan metadata `speech_metadata` untuk gaya penyampaian natural, tetapi Gemini 3.8 Flash TTS tidak tercantum sebagai model Free Tier pada dokumentasi harga Gemini API yang diperiksa. Jangan jalankan generator Gemini dengan asumsi gratis atau aktifkan billing.
- Opsi lokal tanpa panggilan API adalah Piper dengan model Bahasa Indonesia `id_ID-news_tts-medium`. Model tersebut sudah ada di cache Codespaces ini. Setelah menaruh transkrip asli di file lokal, buat audio baru dengan nama yang belum dipakai:

  ```bash
  test ! -e public/audio/toyota-way-piper-free-v1.wav || { echo "Target already exists; choose a new filename."; exit 1; }
  piper \
    --model "$HOME/.cache/piper/models/id_ID-news_tts-medium/id_ID-news_tts-medium.onnx" \
    --config "$HOME/.cache/piper/models/id_ID-news_tts-medium/id_ID-news_tts-medium.onnx.json" \
    --input-file /path/to/exact-toyota-narration.txt \
    --output-file public/audio/toyota-way-piper-free-v1.wav
  ```

- Dengarkan dan periksa pelafalan, ritme, dan durasi hasil Piper terlebih dahulu. Piper berjalan lokal dan tidak dikenai biaya API, tetapi kualitasnya tidak dijamin identik dengan sampel MP3; metadata model menyebut kualitas medium. Periksa lisensi dataset/model sebelum pemakaian komersial. Jangan mengganti VO composition sampai hasil lengkap disetujui.

## Gemini TTS — sampel terlebih dahulu

- VO Orion yang ada adalah `public/voiceover.mp3` (74,553 detik). Berkas naskah sumber tidak tersedia di repository; jangan membuat transkrip perkiraan atau mengubah wording.
- Generator memakai Gemini 3.8 Flash TTS (`gemini-3.8-flash-tts`), voice `Orus`, permintaan satu speaker dalam Bahasa Indonesia, dan WAV 16-bit PCM. Arah penyampaian berada di metadata agar tidak ikut dibacakan. Gender dan kualitas suara belum dapat dipastikan tanpa mendengarkan sampel.
- Model TTS ini tidak tercantum sebagai Free Tier pada dokumentasi harga Gemini API yang diperiksa. Perintah di bawah membutuhkan persetujuan untuk penggunaan berbayar; jangan jalankan untuk workflow gratis.
- Tambahkan `GEMINI_API_KEY` sebagai Codespaces secret atau environment variable. `.env.example` mendokumentasikan nama variabel saja; jangan isi secret di file yang dilacak Git.
- Setelah memperoleh naskah lengkap, simpan teks persisnya saja ke file lokal. Generator sampel memakai 30 kata pertama tanpa menulis ulang naskah, lalu memvalidasi WAV 10–15 detik, keheningan, dan clipping.
- Permintaan yang mungkin berbayar memerlukan persetujuan eksplisit:

  ```bash
  npm run tts:sample -- /path/to/exact-full-narration.txt --approve-paid-test
  ```

- Sampel disimpan di `public/audio/`. Dengarkan file tersebut dan verifikasi pelafalan serta karakter suara. **Jangan jalankan perintah VO penuh sebelum sampel didengar dan disetujui.**
- Setelah sampel didengar dan disetujui, perintah berikut mensyaratkan persetujuan eksplisit. Ia memakai naskah lengkap yang sama, membatasi WAV agar muat dalam durasi composition yang ada, dan tidak otomatis merender:

  ```bash
  npm run tts:full -- /path/to/exact-full-narration.txt --confirm-sample-reviewed --approve-paid-generation
  ```

- VO lama tetap menjadi audio default dan tetap diputar sekali. Untuk memilih VO Gemini, jalankan perintah render **terpisah** memakai path yang dicetak oleh generator:

  ```bash
  ORION_GEMINI_VO_FILE=audio/orion-gemini-tts-full-<hash>.wav npm run render:gemini-vo
  ```

  Render baru disimpan sebagai `out/orion-gemini-vo.mp4`; output video lama, composition, timeline, musik, dan SFX tidak ditimpa atau diubah. Tanpa `ORION_GEMINI_VO_FILE`, komposisi tetap menggunakan `public/voiceover.mp3`.
