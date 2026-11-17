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

  // 301 frame x 12 scene = 3612 frame = 120,4 detik.
  // VO sumber 120,346 detik; selisih akhir sekitar 0,054 detik.
  sceneDurationSeconds: 301 / 30,

  // Pertahankan nama aset yang sudah ada di orion-app/public.
  voiceoverSrc: "prabowo_vo.mp3.mp3",
  musicSrc: "",
  sfxSrc: "",

  scenes: [
    {
      eyebrow: "DOKUMENTER / INDONESIA",
      title: "JEJAK LANGKAH",
      subtitle:
        "Perjalanan dari dunia militer menuju panggung kepemimpinan nasional.",
      accent: "#D8B878",
      imageSrc: "1000827929.jpg.jpeg",
      beats: [
        { text: "PRABOWO SUBIANTO", start: 25, duration: 65 },
        { text: "DARI MILITER", start: 115, duration: 55 },
        { text: "MENUJU KEPEMIMPINAN NASIONAL", start: 205, duration: 80 },
      ],
    },
    {
      eyebrow: "01 / KELAHIRAN",
      title: "JAKARTA",
      subtitle:
        "Prabowo Subianto lahir di Jakarta pada 17 Oktober 1951.",
      accent: "#B8D99A",
      beats: [
        { text: "17 OKTOBER 1951", start: 30, duration: 65 },
        { text: "JAKARTA", start: 125, duration: 55 },
      ],
    },
    {
      eyebrow: "02 / LATAR KELUARGA",
      title: "KELUARGA",
      subtitle:
        "Ia merupakan putra Sumitro Djojohadikusumo, ekonom dan tokoh pemerintahan Indonesia.",
      accent: "#D8B878",
      beats: [
        { text: "SUMITRO DJOJOHADIKUSUMO", start: 35, duration: 90 },
        { text: "EKONOM & TOKOH PEMERINTAHAN", start: 155, duration: 90 },
      ],
    },
    {
      eyebrow: "03 / PENDIDIKAN MILITER",
      title: "AKABRI",
      subtitle:
        "Menempuh pendidikan militer dan lulus dari Akademi Angkatan Bersenjata Republik Indonesia pada 1974.",
      accent: "#A8C9D9",
      beats: [
        { text: "PENDIDIKAN MILITER", start: 25, duration: 75 },
        { text: "LULUS 1974", start: 145, duration: 60 },
      ],
    },
    {
      eyebrow: "04 / KARIER MILITER",
      title: "KOPASSUS",
      subtitle:
        "Kariernya berkembang di lingkungan Angkatan Darat, termasuk penugasan di pasukan khusus.",
      accent: "#D9A8B8",
      beats: [
        { text: "ANGKATAN DARAT", start: 30, duration: 65 },
        { text: "PASUKAN KHUSUS", start: 145, duration: 70 },
      ],
    },
    {
      eyebrow: "05 / JABATAN STRATEGIS",
      title: "1996 — 1998",
      subtitle:
        "Pada 1996 menjabat Danjen Kopassus, kemudian pada 1998 menjadi Pangkostrad.",
      accent: "#E5C58B",
      beats: [
        { text: "1996", start: 20, duration: 45 },
        { text: "DANJEN KOPASSUS", start: 85, duration: 75 },
        { text: "1998", start: 185, duration: 45 },
        { text: "PANGKOSTRAD", start: 245, duration: 55 },
      ],
    },
    {
      eyebrow: "06 / REFORMASI",
      title: "TITIK BALIK",
      subtitle:
        "Setelah Presiden Soeharto mengundurkan diri pada 1998, Prabowo dicopot dari jabatan Pangkostrad.",
      accent: "#D9A8B8",
      beats: [
        { text: "REFORMASI 1998", start: 25, duration: 75 },
        { text: "PANGKOSTRAD DICOPOT", start: 145, duration: 90 },
      ],
    },
    {
      eyebrow: "07 / KONTROVERSI SEJARAH",
      title: "1998",
      subtitle:
        "Dewan Kehormatan Perwira merekomendasikan pemberhentiannya dari dinas militer. Periode ini juga terkait tuduhan penculikan aktivis dan dugaan pelanggaran HAM yang dibantah Prabowo.",
      accent: "#D9A8B8",
      beats: [
        { text: "DEWAN KEHORMATAN PERWIRA", start: 20, duration: 90 },
        { text: "TUDUHAN PENCULIKAN AKTIVIS", start: 120, duration: 85 },
        { text: "PRABOWO MEMBANTAH", start: 225, duration: 65 },
      ],
    },
    {
      eyebrow: "08 / BABAK BARU",
      title: "TRANSFORMASI",
      subtitle:
        "Setelah meninggalkan militer, ia menekuni dunia usaha, kembali ke Indonesia, dan aktif dalam organisasi serta kehidupan publik.",
      accent: "#B8D99A",
      beats: [
        { text: "MENINGGALKAN DINAS MILITER", start: 20, duration: 85 },
        { text: "DUNIA USAHA", start: 125, duration: 65 },
        { text: "KEHIDUPAN PUBLIK", start: 220, duration: 70 },
      ],
    },
    {
      eyebrow: "09 / PERJALANAN POLITIK",
      title: "GERINDRA",
      subtitle:
        "Pada 2008 ikut mendirikan Partai Gerindra. Pada 2009 menjadi calon wakil presiden bersama Megawati, lalu maju dalam pemilihan presiden 2014 dan 2019.",
      accent: "#A8C9D9",
      beats: [
        { text: "2008 — GERINDRA", start: 20, duration: 80 },
        { text: "2009 — CALON WAKIL PRESIDEN", start: 115, duration: 90 },
        { text: "2014 • 2019", start: 225, duration: 60 },
      ],
    },
    {
      eyebrow: "10 / KEMENTERIAN PERTAHANAN",
      title: "MENTERI",
      subtitle:
        "Pada 2019 bergabung dalam pemerintahan sebagai Menteri Pertahanan hingga menjelang Pemilu Presiden 2024.",
      accent: "#D8B878",
      beats: [
        { text: "2019", start: 25, duration: 45 },
        { text: "MENTERI PERTAHANAN", start: 100, duration: 85 },
      ],
    },
    {
      eyebrow: "11 / KEPEMIMPINAN NASIONAL",
      title: "PRESIDEN KE-8",
      subtitle:
        "Pada 20 Oktober 2024, Prabowo Subianto dilantik sebagai Presiden ke-8 Republik Indonesia.",
      accent: "#D8B878",
      beats: [
        { text: "20 OKTOBER 2024", start: 25, duration: 75 },
        { text: "PRESIDEN KE-8", start: 130, duration: 65 },
        { text: "REPUBLIK INDONESIA", start: 225, duration: 65 },
      ],
    },
  ] satisfies SceneData[],
};
