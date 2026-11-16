
export type WordBeat = {
  text: string;
  start: number;
  duration: number;
};

export type SceneData = {
  eyebrow: string;
  title: string;
  subtitle: string;
  accent: string;
  imageSrc?: string;
  beats: WordBeat[];
};

export const project = {
  title: "ORION MOTION ENGINE",
  fps: 30,
  width: 1080,
  height: 1920,
  sceneDurationSeconds: 5,

  voiceoverSrc: "dua toko.mp3",
  musicSrc: "",
  sfxSrc: "",

  scenes: [
    {
      eyebrow: "ORION / OPENING",
      title: "CERITA",
      subtitle: "Setiap pesan membutuhkan cara penyampaian yang tepat.",
      accent: "#B8D99A",
      beats: [
        { text: "SEBUAH CERITA", start: 30, duration: 35 },
        { text: "DIMULAI", start: 90, duration: 30 },
      ],
    },
    {
      eyebrow: "01 / CONTEXT",
      title: "KONTEKS",
      subtitle: "Bangun pemahaman sebelum menyampaikan pesan.",
      accent: "#E5C58B",
      beats: [
        { text: "PAHAMI KONTEKS", start: 30, duration: 35 },
      ],
    },
    {
      eyebrow: "02 / STORY",
      title: "NARASI",
      subtitle: "Susun informasi menjadi perjalanan yang bermakna.",
      accent: "#A8C9D9",
      beats: [
        { text: "INFORMASI", start: 25, duration: 30 },
        { text: "MENJADI CERITA", start: 75, duration: 35 },
      ],
    },
    {
      eyebrow: "03 / VISUAL",
      title: "VISUAL",
      subtitle: "Gambar harus memperkuat pesan, bukan sekadar hiasan.",
      accent: "#D9A8B8",
      beats: [
        { text: "VISUAL BERCERITA", start: 30, duration: 35 },
      ],
    },
    {
      eyebrow: "04 / MOTION",
      title: "GERAK",
      subtitle: "Gerakan mengikuti ritme dan emosi narasi.",
      accent: "#B8D99A",
      beats: [
        { text: "RITME", start: 25, duration: 25 },
        { text: "GERAK", start: 65, duration: 25 },
        { text: "EMOSI", start: 105, duration: 25 },
      ],
    },
    {
      eyebrow: "ORION / ENDING",
      title: "BERMAKNA",
      subtitle: "Bukan sekadar video. Sebuah pengalaman visual.",
      accent: "#E5C58B",
      beats: [
        { text: "MAKE IT MATTER", start: 35, duration: 40 },
      ],
    },
  ] satisfies SceneData[],
};
