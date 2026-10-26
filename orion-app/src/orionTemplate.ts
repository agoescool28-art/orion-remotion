export const ORION_TEMPLATE = {
  title: "ORION / VISUAL STORIES V2",
  topic: "IDE MENJADI VISUAL",
  fps: 30,
  width: 1080,
  height: 1920,
  sceneDurationSeconds: 5,
  colors: {
    background: "#050807",
    foreground: "#f4f7ef",
    mutedForeground: "#c6d2c1",
    neon: "#caff62",
    neonBright: "#a7f83f",
    neonSoft: "#dcff9a",
    neonInk: "#10170b",
    neonMarker: "#f0ffd2",
    blue: "#76caff",
    blueSoft: "#70c9ff",
    progressMuted: "#82917b",
  },
  scenes: [
    {
      label: "BERPIKIR",
      title: "JANGAN HANYA",
      accent: "MELIHAT.",
      detail: "Amati lebih dalam.",
      number: "01",
    },
    {
      label: "MEMAHAMI",
      title: "CARI MAKNA",
      accent: "DI BALIKNYA.",
      detail: "Informasi perlu dipahami.",
      number: "02",
    },
    {
      label: "MENGANALISIS",
      title: "HUBUNGKAN",
      accent: "FAKTANYA.",
      detail: "Temukan pola dan hubungan.",
      number: "03",
    },
    {
      label: "MENEMUKAN",
      title: "UBAH DATA",
      accent: "JADI IDE.",
      detail: "Ide besar dimulai dari hal kecil.",
      number: "04",
    },
    {
      label: "MENCIPTAKAN",
      title: "BANGUN",
      accent: "SOLUSINYA.",
      detail: "Wujudkan pemahaman menjadi aksi.",
      number: "05",
    },
    {
      label: "KESIMPULAN",
      title: "PAHAMI DULU.",
      accent: "BARU BERGERAK.",
      detail: "Pengetahuan bernilai saat diterapkan.",
      number: "06",
    },
  ],
} as const;

export const SCENE_DURATION_IN_FRAMES =
  ORION_TEMPLATE.fps * ORION_TEMPLATE.sceneDurationSeconds;
export const COMPOSITION_DURATION_IN_FRAMES =
  SCENE_DURATION_IN_FRAMES * ORION_TEMPLATE.scenes.length;