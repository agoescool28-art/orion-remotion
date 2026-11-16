export type WordBeat = {
  text: string;
  start: number; // frame within the scene
  duration: number;
};

export type SceneData = {
  eyebrow: string;
  title: string;
  subtitle: string;
  accent: string;
  imageSrc?: string;
  imagePosition?: string;
  kicker?: string;
  beats: WordBeat[];
};

export const project = {
  title: "PRABOWO SUBIANTO",
  subtitle: "Dari perjalanan militer menuju kepemimpinan nasional",
  fps: 30,
  width: 1080,
  height: 1920,
  sceneDurationSeconds: 9,
  voiceoverSrc: "prabowo_vo.mp3.mp3",
  musicSrc: "",
  sfxSrc: "",
  scenes: [
    {
      eyebrow: "ORION DOCUMENTARY / INDONESIA",
      title: "PRABOWO",
      subtitle: "Sebuah perjalanan panjang menuju pusat kepemimpinan nasional.",
      accent: "#D8B878",
      imageSrc: "1000827929.jpg.jpeg",
      imagePosition: "center 48%",
      kicker: "BIOGRAFI • 1951—2024",
      beats: [
        { text: "SEBUAH PERJALANAN", start: 38, duration: 42 },
        { text: "MENUJU KEPEMIMPINAN", start: 150, duration: 65 },
      ],
    },
    {
      eyebrow: "01 / LATAR BELAKANG",
      title: "AKAR",
      subtitle: "Lahir di Jakarta pada 17 Oktober 1951, dalam keluarga dengan latar intelektual dan politik.",
      accent: "#D8B878",
      imageSrc: "1000827929.jpg.jpeg",
      imagePosition: "center 45%",
      kicker: "JAKARTA · 17 OKTOBER 1951",
      beats: [
        { text: "17 OKTOBER 1951", start: 34, duration: 48 },
        { text: "JAKARTA", start: 145, duration: 48 },
      ],
    },
    {
      eyebrow: "02 / PENDIDIKAN MILITER",
      title: "DISIPLIN",
      subtitle: "Pendidikan militer membentuk fondasi awal perjalanan kariernya di lingkungan TNI.",
      accent: "#AFC8B2",
      imageSrc: "1000827932.jpg.jpeg",
      imagePosition: "center 28%",
      kicker: "MEMBENTUK KARAKTER",
      beats: [
        { text: "PENDIDIKAN MILITER", start: 38, duration: 55 },
        { text: "DISIPLIN DAN PENGABDIAN", start: 150, duration: 62 },
      ],
    },
    {
      eyebrow: "03 / KARIER MILITER",
      title: "PENGABDIAN",
      subtitle: "Menjalani berbagai penugasan dan menduduki sejumlah posisi penting di lingkungan militer.",
      accent: "#A9C8D7",
      imageSrc: "1000827935.jpg.jpeg",
      imagePosition: "center 40%",
      kicker: "DINAMIKA KARIER TNI",
      beats: [
        { text: "BERBAGAI PENUGASAN", start: 38, duration: 52 },
        { text: "JABATAN STRATEGIS", start: 150, duration: 55 },
      ],
    },
    {
      eyebrow: "04 / REFORMASI 1998",
      title: "TITIK BALIK",
      subtitle: "Krisis politik dan gelombang Reformasi 1998 menjadi babak penting dalam perjalanan karier militernya.",
      accent: "#D8B878",
      imageSrc: "1000827938.jpg.jpeg",
      imagePosition: "center 40%",
      kicker: "INDONESIA · 1998",
      beats: [
        { text: "REFORMASI 1998", start: 38, duration: 52 },
        { text: "SEBUAH TITIK BALIK", start: 150, duration: 58 },
      ],
    },
    {
      eyebrow: "05 / KONTROVERSI",
      title: "CATATAN SEJARAH",
      subtitle: "Pemberhentian dari jabatan militer dan tuduhan terkait penculikan aktivis menjadi bagian penting catatan 1998. Prabowo membantah tuduhan tersebut.",
      accent: "#D5A4A4",
      imageSrc: "1000827941.jpg.jpeg",
      imagePosition: "center 30%",
      kicker: "FAKTA · TUDUHAN · BANTAHAN",
      beats: [
        { text: "KONTROVERSI 1998", start: 36, duration: 52 },
        { text: "FAKTA DAN BANTAHAN", start: 150, duration: 58 },
      ],
    },
    {
      eyebrow: "06 / BABAK BARU",
      title: "TRANSFORMASI",
      subtitle: "Setelah meninggalkan karier militernya, ia memasuki dunia usaha dan membangun babak kehidupan yang berbeda.",
      accent: "#AFC8B2",
      kicker: "DARI MILITER KE DUNIA USAHA",
      beats: [
        { text: "BABAK BARU", start: 38, duration: 48 },
        { text: "DUNIA USAHA", start: 150, duration: 52 },
      ],
    },
    {
      eyebrow: "07 / POLITIK NASIONAL",
      title: "PERJUANGAN",
      subtitle: "Memasuki politik nasional, mendirikan Partai Gerindra, dan mengikuti kontestasi politik dalam beberapa periode.",
      accent: "#A9C8D7",
      imageSrc: "1000827944.jpg.jpeg",
      imagePosition: "center 34%",
      kicker: "MEMBANGUN JALAN POLITIK",
      beats: [
        { text: "MEMBANGUN GERINDRA", start: 38, duration: 55 },
        { text: "KONTES POLITIK NASIONAL", start: 150, duration: 62 },
      ],
    },
    {
      eyebrow: "08 / MENTERI PERTAHANAN",
      title: "PERTAHANAN",
      subtitle: "Pada 2019, Prabowo dipercaya menjabat Menteri Pertahanan Republik Indonesia.",
      accent: "#D8B878",
      imageSrc: "1000827935.jpg.jpeg",
      imagePosition: "center 42%",
      kicker: "2019—2024",
      beats: [
        { text: "MENTERI PERTAHANAN", start: 38, duration: 55 },
        { text: "2019 — 2024", start: 150, duration: 48 },
      ],
    },
    {
      eyebrow: "09 / KEPALA NEGARA",
      title: "PRESIDEN",
      subtitle: "Pada 20 Oktober 2024, Prabowo Subianto dilantik sebagai Presiden ke-8 Republik Indonesia.",
      accent: "#D8B878",
      imageSrc: "1000827949.jpg.jpeg",
      imagePosition: "center 28%",
      kicker: "REPUBLIK INDONESIA · KE-8",
      beats: [
        { text: "20 OKTOBER 2024", start: 38, duration: 55 },
        { text: "PRESIDEN KE-8 INDONESIA", start: 150, duration: 65 },
      ],
    },
  ] satisfies SceneData[],
};
