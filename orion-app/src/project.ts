
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
  subtitle: "Dari Dunia Militer Menuju Kepemimpinan Nasional",

  fps: 30,
  width: 1080,
  height: 1920,

  // 10 scene x 12,1 detik = 121 detik.
  // Memberi ruang untuk seluruh VO berdurasi 120,35 detik.
  sceneDurationSeconds: 12.1,

  voiceoverSrc: "prabowo_vo.mp3.mp3",
  musicSrc: "",
  sfxSrc: "",

  scenes: [
    {
      eyebrow: "BIOGRAFI / INDONESIA",
      title: "PRABOWO",
      subtitle:
        "Sebuah perjalanan panjang dari dunia militer menuju panggung kepemimpinan nasional.",
      accent: "#D8B878",
      imageSrc: "1000827929.jpg.jpeg",
      beats: [
        { text: "JEJAK LANGKAH", start: 35, duration: 55 },
        { text: "PRABOWO SUBIANTO", start: 145, duration: 65 },
        { text: "KEPEMIMPINAN NASIONAL", start: 265, duration: 65 },
      ],
    },
    {
      eyebrow: "01 / LATAR BELAKANG",
      title: "AKAR",
      subtitle:
        "Lahir di Jakarta pada 17 Oktober 1951, putra ekonom dan tokoh pemerintahan Sumitro Djojohadikusumo.",
      accent: "#B8D99A",
      beats: [
        { text: "17 OKTOBER 1951", start: 25, duration: 55 },
        { text: "JAKARTA", start: 105, duration: 45 },
        { text: "SUMITRO DJOJOHADIKUSUMO", start: 205, duration: 90 },
      ],
    },
    {
      eyebrow: "02 / PENDIDIKAN MILITER",
      title: "DISIPLIN",
      subtitle:
        "Setelah menempuh pendidikan militer, ia lulus dari AKABRI pada tahun 1974.",
      accent: "#A8C9D9",
      beats: [
        { text: "PENDIDIKAN MILITER", start: 35, duration: 65 },
        { text: "AKABRI", start: 145, duration: 45 },
        { text: "LULUS TAHUN 1974", start: 235, duration: 65 },
      ],
    },
    {
      eyebrow: "03 / KARIER MILITER",
      title: "PENGABDIAN",
      subtitle:
        "Kariernya berkembang di lingkungan Angkatan Darat dan pasukan khusus.",
      accent: "#D9A8B8",
      beats: [
        { text: "ANGKATAN DARAT", start: 30, duration: 60 },
        { text: "PASUKAN KHUSUS", start: 125, duration: 60 },
        { text: "KARIER MILITER", start: 235, duration: 65 },
      ],
    },
    {
      eyebrow: "04 / PUNCAK KARIER",
      title: "STRATEGIS",
      subtitle:
        "Pada 1996 dipercaya menjadi Komandan Jenderal Kopassus, lalu menjabat Pangkostrad pada 1998.",
      accent: "#E5C58B",
      beats: [
        { text: "1996", start: 25, duration: 45 },
        { text: "DANJEN KOPASSUS", start: 95, duration: 65 },
        { text: "1998", start: 195, duration: 45 },
        { text: "PANGKOSTRAD", start: 265, duration: 65 },
      ],
    },
    {
      eyebrow: "05 / TITIK PERUBAHAN",
      title: "1998",
      subtitle:
        "Setelah Soeharto mundur, Prabowo dicopot dari jabatan Pangkostrad. Dewan Kehormatan Perwira merekomendasikan pemberhentiannya dari dinas militer.",
      accent: "#D9A8B8",
      beats: [
        { text: "REFORMASI 1998", start: 25, duration: 65 },
        { text: "PANGKOSTRAD DICOPOT", start: 115, duration: 75 },
        { text: "DEWAN KEHORMATAN PERWIRA", start: 225, duration: 100 },
      ],
    },
    {
      eyebrow: "06 / CATATAN SEJARAH",
      title: "KONTROVERSI",
      subtitle:
        "Periode ini menyisakan kontroversi terkait penculikan aktivis dan dugaan pelanggaran HAM. Prabowo membantah keterlibatannya.",
      accent: "#D9A8B8",
      beats: [
        { text: "PENCULIKAN AKTIVIS", start: 25, duration: 75 },
        { text: "DUGAAN PELANGGARAN HAM", start: 125, duration: 85 },
        { text: "PRABOWO MEMBANTAH", start: 245, duration: 75 },
      ],
    },
    {
      eyebrow: "07 / TRANSISI KEHIDUPAN",
      title: "TRANSFORMASI",
      subtitle:
        "Setelah meninggalkan dinas militer, ia menekuni dunia usaha, kemudian kembali ke Indonesia dan aktif dalam kehidupan publik.",
      accent: "#B8D99A",
      beats: [
        { text: "MENINGGALKAN DINAS MILITER", start: 25, duration: 85 },
        { text: "DUNIA USAHA", start: 135, duration: 60 },
        { text: "KEMBALI KE INDONESIA", start: 240, duration: 80 },
      ],
    },
    {
      eyebrow: "08 / POLITIK NASIONAL",
      title: "GERINDRA",
      subtitle:
        "Pada 2008 ikut mendirikan Partai Gerindra. Ia mengikuti kontestasi politik nasional pada 2009, 2014, dan 2019.",
      accent: "#A8C9D9",
      beats: [
        { text: "2008", start: 25, duration: 45 },
        { text: "PARTAI GERINDRA", start: 95, duration: 70 },
        { text: "2009 • 2014 • 2019", start: 205, duration: 85 },
      ],
    },
    {
      eyebrow: "09 / KEPemIMPINAN NASIONAL",
      title: "PRESIDEN",
      subtitle:
        "Pada 2019 menjadi Menteri Pertahanan. Pada 20 Oktober 2024, Prabowo Subianto dilantik sebagai Presiden ke-8 Republik Indonesia.",
      accent: "#D8B878",
      beats: [
        { text: "MENTERI PERTAHANAN", start: 20, duration: 75 },
        { text: "20 OKTOBER 2024", start: 125, duration: 70 },
        { text: "PRESIDEN KE-8", start: 225, duration: 60 },
        { text: "REPUBLIK INDONESIA", start: 295, duration: 60 },
      ],
    },
  ] satisfies SceneData[],
};
