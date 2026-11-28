export type V7SceneKind =
  | "neighborhood"
  | "definition"
  | "scripture"
  | "speech"
  | "help"
  | "privacy"
  | "safety"
  | "kindness"
  | "respect"
  | "closing";

export type V7Scene = {
  id: string;
  kind: V7SceneKind;
  chapter: string;
  title: string;
  subtitle: string;
  start: number;
  duration: number;
  accent: string;
  emphasis: string[];
};

export const v7Project = {
  title: "ADAB & HAK BERTETANGGA",
  fps: 30,
  width: 1080,
  height: 1920,
  durationSeconds: 90,
  voiceoverSrc: "", // Isi dengan path file di public/, contoh: "audio/adab-bertetangga.mp3"
  musicSrc: "",
  scenes: [
    { id: "opening", kind: "neighborhood", chapter: "PEMBUKA", title: "KITA TIDAK HIDUP SENDIRI", subtitle: "Setiap hari, orang-orang di sekitar kita ikut merasakan bagaimana kita hidup.", start: 0, duration: 7, accent: "#E8B96B", emphasis: ["TIDAK HIDUP SENDIRI"] },
    { id: "definition", kind: "definition", chapter: "DEFINISI", title: "APA ITU BERTETANGGA?", subtitle: "Hubungan orang-orang yang tinggal berdekatan, saling berinteraksi, dan memiliki hak serta tanggung jawab.", start: 7, duration: 9, accent: "#8CC8B0", emphasis: ["HAK", "TANGGUNG JAWAB"] },
    { id: "islam", kind: "scripture", chapter: "LANDASAN ISLAM", title: "BERBUAT BAIK KEPADA TETANGGA", subtitle: "QS. An-Nisa: 36 mengingatkan kita untuk berbuat baik kepada tetangga dekat maupun jauh.", start: 16, duration: 9, accent: "#D9C28C", emphasis: ["BERBUAT BAIK"] },
    { id: "speech", kind: "speech", chapter: "ADAB 01", title: "JAGA LISAN & PERILAKU", subtitle: "Jangan mencela, menyebarkan aib, membuat gaduh, atau mengganggu ketenangan.", start: 25, duration: 9, accent: "#E58D7D", emphasis: ["JAGA LISAN", "JANGAN MENGGANGGU"] },
    { id: "help", kind: "help", chapter: "ADAB 02", title: "PEDULI & SALING MENOLONG", subtitle: "Ketika tetangga kesulitan atau sakit, hadirkan perhatian sesuai kemampuan.", start: 34, duration: 9, accent: "#E8B96B", emphasis: ["PEDULI", "MENOLONG"] },
    { id: "privacy", kind: "privacy", chapter: "ADAB 03", title: "HORMATI PRIVASI", subtitle: "Jangan mengintip, mencampuri urusan pribadi, atau menyebarkan cerita yang dipercayakan.", start: 43, duration: 8, accent: "#9DB9E8", emphasis: ["HORMATI PRIVASI"] },
    { id: "safety", kind: "safety", chapter: "HAK TETANGGA", title: "BERHAK MERASA AMAN", subtitle: "Tetangga berhak bebas dari kebisingan, gangguan, dan tindakan yang merugikan.", start: 51, duration: 9, accent: "#8CC8B0", emphasis: ["MERASA AMAN"] },
    { id: "kindness", kind: "kindness", chapter: "HAK TETANGGA", title: "KEBAIKAN KECIL, DAMPAK BESAR", subtitle: "Menyapa, tersenyum, berbagi makanan, dan saling membantu menguatkan hubungan.", start: 60, duration: 9, accent: "#E8B96B", emphasis: ["KEBAIKAN KECIL"] },
    { id: "respect", kind: "respect", chapter: "HAK TETANGGA", title: "HORMATI SETIAP TETANGGA", subtitle: "Perbedaan latar belakang bukan alasan untuk merendahkan atau berlaku tidak adil.", start: 69, duration: 9, accent: "#B9A3E8", emphasis: ["HORMATI"] },
    { id: "closing", kind: "closing", chapter: "PENUTUP", title: "JAGA HAK TETANGGA, RAWAT KERUKUNAN", subtitle: "Jangan mengganggu. Ringankan kesulitan. Hadirkan kebaikan.", start: 78, duration: 12, accent: "#E8B96B", emphasis: ["JANGAN MENGGANGGU", "HADIRKAN KEBAIKAN"] },
  ] satisfies V7Scene[],
} as const;
