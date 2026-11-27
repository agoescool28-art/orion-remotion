export type WordBeat = {
  text: string;
  start: number; // local frame
  duration: number; // visible frames
};

export type SceneData = {
  eyebrow: string;
  title: string;
  subtitle: string;
  durationFrames: number;
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
  // Dipertahankan untuk kompatibilitas Root.tsx lama.
  // 301 frame x 12 scene = 3.612 frame pada 30 fps.
  sceneDurationSeconds: 301 / 30,

  // Total 3.612 frame = 120,4 detik, selaras dengan durasi render V2.
  // Durasi scene mengikuti struktur 6 bab pada naskah DOCX.
  voiceoverSrc: "prabowo_vo.mp3.mp3",
  musicSrc: "",
  sfxSrc: "",

  scenes: [
    {
      eyebrow: "DOKUMENTER / INDONESIA",
      title: "JEJAK LANGKAH",
      subtitle: "Perjalanan dari dunia militer menuju panggung kepemimpinan nasional.",
      durationFrames: 281,
      accent: "#D8B878",
      imageSrc: "1000827929.jpg.jpeg",
      beats: [
        { text: "SEJARAH INDONESIA MODERN", start: 18, duration: 62 },
        { text: "JALAN PANJANG", start: 96, duration: 58 },
        { text: "MILITER → KEPEMIMPINAN NASIONAL", start: 178, duration: 88 },
      ],
    },
    {
      eyebrow: "01 / KELAHIRAN",
      title: "JAKARTA",
      subtitle: "Prabowo Subianto lahir di Jakarta pada 17 Oktober 1951.",
      durationFrames: 183,
      accent: "#B8D99A",
      beats: [
        { text: "PRABOWO SUBIANTO", start: 20, duration: 65 },
        { text: "17 OKTOBER 1951", start: 135, duration: 85 },
        { text: "JAKARTA", start: 245, duration: 70 },
      ],
    },
    {
      eyebrow: "02 / LATAR KELUARGA",
      title: "KELUARGA",
      subtitle: "Ia merupakan putra ekonom dan tokoh pemerintahan, Sumitro Djojohadikusumo.",
      durationFrames: 169,
      accent: "#D8B878",
      beats: [
        { text: "SUMITRO DJOJOHADIKUSUMO", start: 20, duration: 105 },
        { text: "EKONOM & TOKOH PEMERINTAHAN", start: 160, duration: 125 },
      ],
    },
    {
      eyebrow: "03 / PENDIDIKAN MILITER",
      title: "AKABRI",
      subtitle: "Setelah menempuh pendidikan militer, ia lulus dari AKABRI pada tahun 1974.",
      durationFrames: 187,
      accent: "#A8C9D9",
      imageSrc: "academy-cadets.jpg",
      beats: [
        { text: "PENDIDIKAN MILITER", start: 18, duration: 82 },
        { text: "LULUS AKABRI • 1974", start: 132, duration: 88 },
      ],
    },
    {
      eyebrow: "04 / KARIER MILITER",
      title: "KOPASSUS",
      subtitle: "Dari sinilah perjalanan panjangnya di lingkungan Angkatan Darat berkembang.",
      durationFrames: 225,
      accent: "#D9A8B8",
      imageSrc: "1000827935.jpg.jpeg",
      beats: [
        { text: "KARIER ANGKATAN DARAT", start: 18, duration: 82 },
        { text: "LINGKUNGAN PASUKAN KHUSUS", start: 120, duration: 92 },
        { text: "KOPASSUS", start: 235, duration: 75 },
      ],
    },
    {
      eyebrow: "05 / JABATAN STRATEGIS",
      title: "1996 — 1998",
      subtitle: "Pada 1996 ia dipercaya menjadi Danjen Kopassus, lalu menjabat Pangkostrad pada 1998.",
      durationFrames: 280,
      accent: "#E5C58B",
      imageSrc: "1000827941.jpg.jpeg",
      beats: [
        { text: "1996", start: 15, duration: 48 },
        { text: "DANJEN KOPASSUS", start: 82, duration: 68 },
        { text: "1998 • PANGKOSTRAD", start: 170, duration: 68 },
      ],
    },
    {
      eyebrow: "06 / REFORMASI",
      title: "TITIK BALIK",
      subtitle: "Setelah Soeharto mundur, Prabowo dicopot dari jabatan Pangkostrad.",
      durationFrames: 299,
      accent: "#D9A8B8",
      imageSrc: "1000827938.jpg.jpeg",
      beats: [
        { text: "REFORMASI 1998", start: 16, duration: 72 },
        { text: "SOEHARTO MUNDUR", start: 105, duration: 70 },
        { text: "PANGKOSTRAD DICOPOT", start: 190, duration: 68 },
      ],
    },
    {
      eyebrow: "07 / KONTROVERSI SEJARAH",
      title: "1998",
      subtitle: "Dewan Kehormatan Perwira merekomendasikan pemberhentiannya dari dinas militer. Periode ini juga menyisakan kontroversi terkait penculikan aktivis dan dugaan pelanggaran HAM, yang dibantah Prabowo.",
      durationFrames: 589,
      accent: "#D9A8B8",
      beats: [
        { text: "DEWAN KEHORMATAN PERWIRA", start: 15, duration: 82 },
        { text: "KONTROVERSI PENCULIKAN AKTIVIS", start: 105, duration: 85 },
        { text: "PRABOWO MEMBANTAH", start: 202, duration: 68 },
      ],
    },
    {
      eyebrow: "08 / BABAK BARU",
      title: "TRANSFORMASI",
      subtitle: "Setelah meninggalkan dinas militer, ia menekuni dunia usaha, kembali ke Indonesia, dan aktif dalam organisasi serta kehidupan publik.",
      durationFrames: 294,
      accent: "#B8D99A",
      beats: [
        { text: "MENINGGALKAN DINAS MILITER", start: 18, duration: 80 },
        { text: "DUNIA USAHA", start: 112, duration: 68 },
        { text: "KEMBALI KE INDONESIA", start: 205, duration: 72 },
      ],
    },
    {
      eyebrow: "09 / PERJALANAN POLITIK",
      title: "GERINDRA",
      subtitle: "Pada 2008 ikut mendirikan Partai Gerindra. Tahun 2009 menjadi calon wakil presiden bersama Megawati, lalu maju sebagai calon presiden pada 2014 dan 2019.",
      durationFrames: 443,
      accent: "#A8C9D9",
      imageSrc: "1000827944.jpg.jpeg",
      beats: [
        { text: "2008 • GERINDRA", start: 18, duration: 75 },
        { text: "2009 • CALON WAKIL PRESIDEN", start: 112, duration: 100 },
        { text: "2014 • 2019", start: 242, duration: 72 },
      ],
    },
    {
      eyebrow: "10 / KEMENTERIAN PERTAHANAN",
      title: "MENTERI",
      subtitle: "Pada 2019, ia masuk ke pemerintahan sebagai Menteri Pertahanan hingga menjelang pemilihan presiden 2024.",
      durationFrames: 261,
      accent: "#D8B878",
      imageSrc: "1000827945.jpg.jpeg",
      beats: [
        { text: "2019", start: 18, duration: 55 },
        { text: "MENTERI PERTAHANAN", start: 100, duration: 90 },
        { text: "HINGGA MENJELANG 2024", start: 218, duration: 65 },
      ],
    },
    {
      eyebrow: "11 / KEPEMIMPINAN NASIONAL",
      title: "PRESIDEN KE-8",
      subtitle: "Pada 20 Oktober 2024, Prabowo Subianto dilantik sebagai Presiden Republik Indonesia ke-8.",
      durationFrames: 401,
      accent: "#D8B878",
      imageSrc: "100082746.jpg.jpeg",
      beats: [
        { text: "20 OKTOBER 2024", start: 18, duration: 80 },
        { text: "PELANTIKAN PRESIDEN", start: 125, duration: 90 },
        { text: "PRESIDEN REPUBLIK INDONESIA KE-8", start: 250, duration: 100 },
      ],
    },
  ] satisfies SceneData[],
};
