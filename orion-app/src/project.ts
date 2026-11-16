
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
  title: "PRABOWO SUBIANTO",
  subtitle: "Dari Perjalanan Militer Menuju Kepemimpinan Nasional",

  fps: 30,
  width: 1080,
  height: 1920,
  sceneDurationSeconds: 9,

  // Isi nama file setelah kita pastikan audio yang benar.
  voiceoverSrc: "",
  musicSrc: "",
  sfxSrc: "",

  scenes: [
      {
  eyebrow: "BIOGRAFI / INDONESIA",
  title: "PRABOWO",
  subtitle: "Sebuah perjalanan panjang menuju kepemimpinan nasional.",
  accent: "#D8B878",
  imageSrc: "1000827929.jpg.jpeg",
  beats: [
      { text: "SEBUAH PERJALANAN", start: 35, duration: 45 },
      { text: "MENUJU KEPEMIMPINAN", start: 145, duration: 55 },
    ],
  },
    {
      eyebrow: "01 / LATAR BELAKANG",
      title: "AKAR",
      subtitle: "Lahir di Jakarta, 17 Oktober 1951, dalam keluarga dengan latar belakang intelektual dan politik.",
      accent: "#B8D99A",
      beats: [
        { text: "17 OKTOBER 1951", start: 35, duration: 45 },
        { text: "JAKARTA", start: 145, duration: 45 },
      ],
    },
    {
      eyebrow: "02 / PENDIDIKAN MILITER",
      title: "DISIPLIN",
      subtitle: "Menempuh pendidikan militer dan membangun fondasi karier di lingkungan TNI.",
      accent: "#A8C9D9",
      beats: [
        { text: "PENDIDIKAN MILITER", start: 35, duration: 50 },
        { text: "DISIPLIN DAN PENGABDIAN", start: 145, duration: 55 },
      ],
    },
    {
      eyebrow: "03 / KARIER MILITER",
      title: "PENGABDIAN",
      subtitle: "Menjalani berbagai penugasan dan menduduki sejumlah posisi penting di lingkungan militer.",
      accent: "#D9A8B8",
      beats: [
        { text: "BERBAGAI PENUGASAN", start: 35, duration: 50 },
        { text: "JABATAN STRATEGIS", start: 145, duration: 50 },
      ],
    },
    {
      eyebrow: "04 / REFORMASI 1998",
      title: "TITIK BALIK",
      subtitle: "Krisis politik 1998 menjadi babak penting dalam perjalanan karier militernya.",
      accent: "#E5C58B",
      beats: [
        { text: "REFORMASI 1998", start: 35, duration: 50 },
        { text: "BABAK YANG MENENTUKAN", start: 145, duration: 55 },
      ],
    },
    {
      eyebrow: "05 / KONTROVERSI",
      title: "SEJARAH",
      subtitle: "Pemberhentian dari jabatan militer dan kontroversi terkait penculikan aktivis menjadi bagian penting dari catatan sejarahnya. Prabowo membantah tuduhan tersebut.",
      accent: "#D9A8B8",
      beats: [
        { text: "KONTROVERSI 1998", start: 35, duration: 50 },
        { text: "FAKTA, TUDUHAN, BANTAHAN", start: 145, duration: 65 },
      ],
    },
    {
      eyebrow: "06 / DUNIA USAHA",
      title: "TRANSFORMASI",
      subtitle: "Setelah meninggalkan karier militer, ia menekuni dunia usaha.",
      accent: "#B8D99A",
      beats: [
        { text: "BABAK BARU", start: 35, duration: 45 },
        { text: "DUNIA USAHA", start: 145, duration: 45 },
      ],
    },
    {
      eyebrow: "07 / POLITIK NASIONAL",
      title: "PERJUANGAN",
      subtitle: "Memasuki politik nasional, mendirikan Partai Gerindra, dan mengikuti kontestasi politik.",
      accent: "#A8C9D9",
      beats: [
        { text: "MEMBANGUN GERINDRA", start: 35, duration: 50 },
        { text: "KONTES POLITIK NASIONAL", start: 145, duration: 55 },
      ],
    },
    {
      eyebrow: "08 / MENTERI PERTAHANAN",
      title: "PERTAHANAN",
      subtitle: "Pada 2019, dipercaya menjabat Menteri Pertahanan Republik Indonesia.",
      accent: "#E5C58B",
      beats: [
        { text: "MENTERI PERTAHANAN", start: 35, duration: 50 },
        { text: "2019 – 2024", start: 145, duration: 45 },
      ],
    },
    {
      eyebrow: "09 / KEPALA NEGARA",
      title: "PRESIDEN",
      subtitle: "Pada 20 Oktober 2024, Prabowo Subianto dilantik sebagai Presiden ke-8 Republik Indonesia.",
      accent: "#D8B878",
      beats: [
        { text: "20 OKTOBER 2024", start: 35, duration: 50 },
        { text: "PRESIDEN KE-8 INDONESIA", start: 145, duration: 60 },
      ],
    },
  ] satisfies SceneData[],
};
