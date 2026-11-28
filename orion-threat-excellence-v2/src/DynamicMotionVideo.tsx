import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

export interface PointItem {
  text: string;
  tone?: 'neutral' | 'gold' | 'danger' | 'success';
  value?: number;
}

export interface CompareColumn {
  title: string;
  badge: string;
  tone: 'danger' | 'success' | 'gold' | 'neutral';
  items: string[];
}

export interface SceneItem {
  tag: string;
  heading: string;
  headingTone?: 'neutral' | 'gold' | 'danger' | 'success';
  heroStat?: string;
  heroLabel?: string;
  body: string;
  durationSec?: number;
  overlayType?: 'pills' | 'bars' | 'compare' | 'checklist';
  points?: PointItem[];
  compareLeft?: CompareColumn;
  compareRight?: CompareColumn;
  visualType?: 'gear' | 'flow' | 'chart' | 'shield' | 'bulb';
  visualQuery?: string;
  imageUrl?: string;
}

export interface StyleConfig {
  bgColor?: string;
  gridColor?: string;
  cardBg?: string;
  accentColor?: string;
  goldColor?: string;
  dangerColor?: string;
  successColor?: string;
  watermark?: string;
}

export interface DynamicMotionProps {
  title: string;
  subtitle?: string;
  audioSrc?: string;
  styleConfig?: StyleConfig;
  scenes: SceneItem[];
}

const getSpeechWeight = (text: string): number => {
  const clean = (text || '').trim();
  if (!clean) return 10;
  const words = clean.split(/\s+/).length;
  const pauses = (clean.match(/[.,!?;:]/g) || []).length;
  return words * 1.15 + pauses * 1.8;
};

// Palet Latar Penuh (Full-Bleed Diorama Environment ala video_2.mp4)
const ENVIRONMENTS = [
  { sky: '#d9c7a3', ground: '#8c9a5b', accent: '#d97706' }, // Halaman Kompleks Pagi
  { sky: '#e6dcc8', ground: '#64748b', accent: '#2563eb' }, // Denah Interaksi 2 Rumah
  { sky: '#f3ead8', ground: '#15803d', accent: '#ca8a04' }, // Meja Kajian Al-Qur'an
  { sky: '#eadbc8', ground: '#b91c1c', accent: '#dc2626' }, // Simulasi Kebisingan & Lisan
  { sky: '#dce7d5', ground: '#4d7c0f', accent: '#ea580c' }, // Antaran Makanan & Kepedulian
  { sky: '#d6dee8', ground: '#334155', accent: '#0284c7' }, // Pagar & Tirai Privasi
  { sky: '#e5e0d5', ground: '#166534', accent: '#16a34a' }, // Zona Aman Lingkungan
  { sky: '#f6e7cb', ground: '#b45309', accent: '#d97706' }, // Meja Makan & Sapaan Hangat
  { sky: '#dfe8e2', ground: '#0f766e', accent: '#0d9488' }, // Peta Kerukunan Warga
  { sky: '#ede0d4', ground: '#7c2d12', accent: '#ea580c' }, // Timbangan Sikap
  { sky: '#e4e8d8', ground: '#3f6212', accent: '#16a34a' }, // Jalur Langkah Nyata
  { sky: '#f5d0a9', ground: '#4d7c0f', accent: '#d97706' }, // Panorama Senja Rukun
];

// Label Callout Mengambang yang Menunjuk Langsung ke Objek (seperti "• disedot?", "• otot bergerak" di video_2)
const CalloutPin: React.FC<{
  x: number;
  y: number;
  label: string;
  active: boolean;
  tone?: 'neutral' | 'danger' | 'success' | 'gold';
  frame: number;
  fps: number;
}> = ({ x, y, label, active, tone = 'neutral', frame, fps }) => {
  const pop = spring({
    frame: active ? frame : 0,
    fps,
    config: { damping: 12, stiffness: 180 },
  });

  if (!active) return null;

  const dotColor =
    tone === 'danger'
      ? '#dc2626'
      : tone === 'success'
      ? '#16a34a'
      : tone === 'gold'
      ? '#eab308'
      : '#2563eb';

  return (
    <g
      transform={`translate(${x}, ${y}) scale(${interpolate(pop, [0, 1], [0.7, 1])})`}
      style={{ transformOrigin: `${x}px ${y}px` }}
    >
      {/* Garis Penunjuk ke Bawah */}
      <line x1="0" y1="18" x2="0" y2="54" stroke="#1e1b18" strokeWidth="3" strokeDasharray="5 4" />
      <circle cx="0" cy="54" r="6" fill={dotColor} stroke="#1e1b18" strokeWidth="2.5" />
      {/* Kapsul Label Kertas */}
      <rect
        x="-125"
        y="-22"
        width="250"
        height="42"
        rx="10"
        fill="#fcf9f2"
        stroke="#1e1b18"
        strokeWidth="3"
      />
      <circle cx="-104" cy="-1" r="6" fill={dotColor} />
      <text
        x="-88"
        y="6"
        fontSize="19"
        fontWeight="800"
        fill="#1e1b18"
        fontFamily="Inter, system-ui, sans-serif"
      >
        {label.length > 22 ? label.slice(0, 22) + '…' : label}
      </text>
    </g>
  );
};

// Panggung Diorama 3D/Papercraft Interaktif Full-Screen (Menggantikan kotak statis)
const InteractiveDioramaStage: React.FC<{
  sceneIndex: number;
  sceneFrame: number;
  sceneDuration: number;
  fps: number;
  points: PointItem[];
  overlayType?: string;
  compareLeft?: CompareColumn;
  compareRight?: CompareColumn;
  heroStat?: string;
}> = ({
  sceneIndex,
  sceneFrame,
  sceneDuration,
  fps,
  points,
  overlayType,
  compareLeft,
  compareRight,
  heroStat,
}) => {
  const progress = Math.min(1, sceneFrame / Math.max(1, sceneDuration));
  const stageStep = progress < 0.33 ? 0 : progress < 0.66 ? 1 : 2;
  const cameraZoom = interpolate(sceneFrame, [0, sceneDuration], [1.0, 1.07]);
  const cameraPanX = interpolate(sceneFrame, [0, sceneDuration], [-12, 12]);
  const wave = Math.sin(sceneFrame / 9);
  const variant = sceneIndex % 12;

  // Ekstrak label callout dinamis dari points atau compare items
  const calloutLabels =
    overlayType === 'compare' && compareLeft && compareRight
      ? [
          { text: compareLeft.items[0] || compareLeft.title, tone: 'danger' as const },
          { text: compareRight.items[0] || compareRight.title, tone: 'success' as const },
          { text: compareRight.items[1] || 'Solusi Tepat', tone: 'gold' as const },
        ]
      : [
          { text: points[0]?.text || 'Langkah 1', tone: points[0]?.tone || 'gold' },
          { text: points[1]?.text || 'Langkah 2', tone: points[1]?.tone || 'success' },
          { text: points[2]?.text || heroStat || 'Harmonis', tone: points[2]?.tone || 'neutral' },
        ];

  return (
    <svg
      width="1080"
      height="1350"
      viewBox="0 0 1080 1350"
      style={{
        position: 'absolute',
        top: 120,
        left: 0,
        width: '100%',
        height: '72%',
        transform: `scale(${cameraZoom}) translateX(${cameraPanX}px)`,
      }}
    >
      <defs>
        <filter id="dioramaShadow" x="-15%" y="-15%" width="130%" height="140%">
          <feDropShadow dx="0" dy="18" stdDeviation="12" floodColor="#1e1b18" floodOpacity="0.28" />
        </filter>
        <linearGradient id="wallGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#e5dec9" />
        </linearGradient>
      </defs>

      {/* Lantai Diorama Isometrik */}
      <ellipse cx="540" cy="790" rx="490" ry="230" fill="rgba(30,27,24,0.12)" />
      <path
        d="M 80 730 Q 540 560 1000 730 L 1000 840 Q 540 1010 80 840 Z"
        fill="#a3b18a"
        stroke="#1e1b18"
        strokeWidth="5"
        filter="url(#dioramaShadow)"
      />
      {/* Rumput / Tekstur Taman Kecil seperti di video_2 */}
      {[
        [210, 740],
        [340, 830],
        [720, 720],
        [840, 810],
        [520, 860],
      ].map(([gx, gy], i) => (
        <g key={i} transform={`translate(${gx}, ${gy + wave * 2})`}>
          <path d="M -12 0 L -6 -22 L 0 0 L 6 -25 L 12 0" fill="none" stroke="#3a5a40" strokeWidth="5" strokeLinecap="round" />
        </g>
      ))}

      {/* === SCENE 0: Pintu Rumah Terbuka & Interaksi Tetangga === */}
      {variant === 0 && (
        <g filter="url(#dioramaShadow)">
          {/* Rumah Kiri */}
          <g transform="translate(170, 440)">
            <polygon points="130,0 260,105 0,105" fill="#d97706" stroke="#1e1b18" strokeWidth="5" />
            <rect x="28" y="105" width="204" height="195" rx="14" fill="url(#wallGrad)" stroke="#1e1b18" strokeWidth="5" />
            {/* Pintu Terbuka Animasi */}
            <rect x="95" y="180" width="70" height="120" fill="#1e1b18" />
            <polygon
              points={`95,180 ${95 + interpolate(stageStep, [0, 2], [70, 22])},192 ${95 + interpolate(stageStep, [0, 2], [70, 22])},312 95,300`}
              fill="#eab308"
              stroke="#1e1b18"
              strokeWidth="4"
            />
          </g>
          {/* Rumah Kanan */}
          <g transform="translate(650, 440)">
            <polygon points="130,0 260,105 0,105" fill="#16a34a" stroke="#1e1b18" strokeWidth="5" />
            <rect x="28" y="105" width="204" height="195" rx="14" fill="url(#wallGrad)" stroke="#1e1b18" strokeWidth="5" />
            <rect x="95" y="180" width="70" height="120" rx="8" fill="#2563eb" stroke="#1e1b18" strokeWidth="4" />
          </g>
          {/* Gelombang Cahaya Penghubung */}
          <path
            d="M 430 620 Q 540 510 650 620"
            fill="none"
            stroke="#eab308"
            strokeWidth="10"
            strokeDasharray="18 14"
            strokeDashoffset={-sceneFrame * 3}
          />
        </g>
      )}

      {/* === SCENE 1: Jembatan 2 Arah (Hak & Tanggung Jawab) === */}
      {variant === 1 && (
        <g filter="url(#dioramaShadow)">
          <rect x="150" y="500" width="260" height="210" rx="28" fill="#ffffff" stroke="#1e1b18" strokeWidth="6" />
          <text x="280" y="618" textAnchor="middle" fontSize="44" fontWeight="900" fill="#1e1b18">HAK</text>
          <rect x="670" y="500" width="260" height="210" rx="28" fill="#eab308" stroke="#1e1b18" strokeWidth="6" />
          <text x="800" y="618" textAnchor="middle" fontSize="38" fontWeight="900" fill="#1e1b18">AMANAH</text>
          {/* Aliran Energi Timbal Balik */}
          <path d="M 430 570 H 650" stroke="#16a34a" strokeWidth="14" strokeLinecap="round" strokeDasharray="24 14" strokeDashoffset={-sceneFrame * 3} />
          <path d="M 650 645 H 430" stroke="#2563eb" strokeWidth="14" strokeLinecap="round" strokeDasharray="24 14" strokeDashoffset={-sceneFrame * 3} />
        </g>
      )}

      {/* === SCENE 2: Kitab Terbuka QS. An-Nisa: 36 === */}
      {variant === 2 && (
        <g filter="url(#dioramaShadow)" transform="translate(0, 30)">
          <ellipse cx="540" cy="705" rx="310" ry="45" fill="#78350f" stroke="#1e1b18" strokeWidth="5" />
          <path d="M 540 460 Q 370 420 220 470 V 690 Q 370 640 540 690 Z" fill="#ffffff" stroke="#1e1b18" strokeWidth="6" />
          <path d="M 540 460 Q 710 420 860 470 V 690 Q 710 640 540 690 Z" fill="#fef9c3" stroke="#1e1b18" strokeWidth="6" />
          <line x1="540" y1="460" x2="540" y2="690" stroke="#1e1b18" strokeWidth="6" />
          {[505, 545, 585, 625].map((ly, idx) => (
            <React.Fragment key={idx}>
              <line x1="270" y1={ly} x2="490" y2={ly - 10} stroke="#94a3b8" strokeWidth="9" strokeLinecap="round" />
              <line x1="590" y1={ly - 10} x2="810" y2={ly} stroke="#eab308" strokeWidth="9" strokeLinecap="round" />
            </React.Fragment>
          ))}
        </g>
      )}

      {/* === SCENE 3: Peredam Kebisingan & Lisan (Volume Turun + Tanda Silang Merah seperti video_2) === */}
      {variant === 3 && (
        <g filter="url(#dioramaShadow)">
          <polygon points="240,540 340,540 450,455 450,735 340,650 240,650" fill="#dc2626" stroke="#1e1b18" strokeWidth="6" />
          {/* Gelombang Suara Bising */}
          <path d="M 500 530 Q 545 595 500 660" fill="none" stroke="#dc2626" strokeWidth="12" strokeLinecap="round" />
          <path d="M 560 490 Q 625 595 560 700" fill="none" stroke="#dc2626" strokeWidth="12" strokeLinecap="round" opacity={stageStep >= 1 ? 0.25 : 0.9} />
          {/* Tanda Silang Merah 3D Tebal pada Kebisingan di Step >= 1 */}
          {stageStep >= 1 && (
            <g transform="translate(550, 595)">
              <path d="M -55 -55 L 55 55 M 55 -55 L -55 55" stroke="#dc2626" strokeWidth="26" strokeLinecap="round" />
              <path d="M -55 -55 L 55 55 M 55 -55 L -55 55" stroke="#ffffff" strokeWidth="8" strokeLinecap="round" />
            </g>
          )}
          {/* Lencana Centang Santun */}
          <circle cx="775" cy="595" r="88" fill="#16a34a" stroke="#1e1b18" strokeWidth="6" />
          <path d="M 735 595 L 765 625 L 820 565" fill="none" stroke="#ffffff" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )}

      {/* === SCENE 4: Mengantar Bantuan & Kepedulian === */}
      {variant === 4 && (
        <g filter="url(#dioramaShadow)">
          <rect x="360" y="510" width="360" height="220" rx="28" fill="#eab308" stroke="#1e1b18" strokeWidth="6" />
          <rect x="505" y="510" width="70" height="220" fill="#dc2626" stroke="#1e1b18" strokeWidth="5" />
          <rect x="360" y="585" width="360" height="60" fill="#dc2626" stroke="#1e1b18" strokeWidth="5" />
          <g transform={`translate(540, ${420 + wave * 10})`}>
            <circle r="58" fill="#ffffff" stroke="#1e1b18" strokeWidth="6" />
            <path d="M 0 24 L -25 -2 A15 15 0 0 1 0 -22 A15 15 0 0 1 25 -2 Z" fill="#dc2626" />
          </g>
        </g>
      )}

      {/* === SCENE 5: Pagar & Gembok Privasi === */}
      {variant === 5 && (
        <g filter="url(#dioramaShadow)">
          {/* Pagar Rumah */}
          {[220, 320, 420, 660, 760, 860].map((px, i) => (
            <rect key={i} x={px - 22} y="480" width="44" height="250" rx="10" fill="#ffffff" stroke="#1e1b18" strokeWidth="5" />
          ))}
          {/* Gembok Utama */}
          <path d="M 465 540 V 485 A 75 75 0 0 1 615 485 V 540" fill="none" stroke="#eab308" strokeWidth="26" strokeLinecap="round" />
          <rect x="425" y="535" width="230" height="190" rx="32" fill="#2563eb" stroke="#1e1b18" strokeWidth="6" />
          <circle cx="540" cy="612" r="24" fill="#1e1b18" />
          <rect x="528" y="625" width="24" height="50" rx="8" fill="#1e1b18" />
        </g>
      )}

      {/* === SCENE 6: Perisai Keamanan & Grafik Pilar Hak === */}
      {variant === 6 && (
        <g filter="url(#dioramaShadow)">
          <path d="M 540 410 L 710 475 V 605 C 710 705 635 768 540 800 C 445 768 370 705 370 605 V 475 Z" fill="#16a34a" stroke="#1e1b18" strokeWidth="7" />
          <path d="M 475 605 L 522 652 L 615 550" fill="none" stroke="#ffffff" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )}

      {/* === SCENE 7: Sepiring Makanan & Sapaan Hangat === */}
      {variant === 7 && (
        <g filter="url(#dioramaShadow)">
          <path d="M 320 660 A 220 180 0 0 1 760 660 Z" fill="#eab308" stroke="#1e1b18" strokeWidth="6" />
          <circle cx="540" cy="465" r="26" fill="#dc2626" stroke="#1e1b18" strokeWidth="5" />
          <rect x="280" y="660" width="520" height="40" rx="20" fill="#ffffff" stroke="#1e1b18" strokeWidth="6" />
          {[-75, 0, 75].map((dx, i) => (
            <path
              key={i}
              d={`M ${540 + dx} ${425 + wave * 6} Q ${560 + dx} 395 ${540 + dx} 365`}
              fill="none"
              stroke="#ffffff"
              strokeWidth="8"
              strokeLinecap="round"
            />
          ))}
        </g>
      )}

      {/* === SCENE 8: Lingkaran 4 Warga Setara === */}
      {variant === 8 && (
        <g filter="url(#dioramaShadow)">
          <circle cx="540" cy="595" r="155" fill="none" stroke="#1e1b18" strokeWidth="8" strokeDasharray="18 14" strokeDashoffset={-sceneFrame * 2} />
          {[
            { cx: 540, cy: 440, c: '#eab308' },
            { cx: 695, cy: 595, c: '#16a34a' },
            { cx: 540, cy: 750, c: '#2563eb' },
            { cx: 385, cy: 595, c: '#dc2626' },
          ].map((n, i) => (
            <g key={i}>
              <circle cx={n.cx} cy={n.cy} r="54" fill={n.c} stroke="#1e1b18" strokeWidth="6" />
              <circle cx={n.cx} cy={n.cy - 10} r="16" fill="#ffffff" />
              <path d={`M ${n.cx - 26} ${n.cy + 28} A 26 20 0 0 1 ${n.cx + 26} ${n.cy + 28}`} fill="#ffffff" />
            </g>
          ))}
        </g>
      )}

      {/* === SCENE 9: Timbangan Aksi vs Tuntutan === */}
      {variant === 9 && (
        <g filter="url(#dioramaShadow)">
          <rect x="520" y="470" width="40" height="270" rx="12" fill="#ffffff" stroke="#1e1b18" strokeWidth="6" />
          <rect x="400" y="725" width="280" height="38" rx="14" fill="#eab308" stroke="#1e1b18" strokeWidth="6" />
          <g transform={`rotate(${interpolate(stageStep, [0, 2], [-8, 8])} 540 510)`}>
            <rect x="270" y="495" width="540" height="28" rx="14" fill="#2563eb" stroke="#1e1b18" strokeWidth="6" />
            <circle cx="310" cy="605" r="65" fill="#dc2626" stroke="#1e1b18" strokeWidth="6" />
            <circle cx="770" cy="605" r="65" fill="#16a34a" stroke="#1e1b18" strokeWidth="6" />
          </g>
        </g>
      )}

      {/* === SCENE 10: Kompas Langkah Diri Sendiri === */}
      {variant === 10 && (
        <g filter="url(#dioramaShadow)">
          <circle cx="540" cy="595" r="170" fill="#ffffff" stroke="#1e1b18" strokeWidth="8" />
          <circle cx="540" cy="595" r="138" fill="none" stroke="#2563eb" strokeWidth="5" strokeDasharray="12 10" />
          <g transform={`rotate(${wave * 22} 540 595)`}>
            <polygon points="540,460 575,595 540,620 505,595" fill="#dc2626" stroke="#1e1b18" strokeWidth="5" />
            <polygon points="540,730 575,595 540,570 505,595" fill="#16a34a" stroke="#1e1b18" strokeWidth="5" />
          </g>
          <circle cx="540" cy="595" r="22" fill="#eab308" stroke="#1e1b18" strokeWidth="5" />
        </g>
      )}

      {/* === SCENE 11: Kampung Harmonis Matahari Terbenam === */}
      {variant === 11 && (
        <g filter="url(#dioramaShadow)">
          <circle cx="540" cy="540" r="135" fill="#eab308" stroke="#1e1b18" strokeWidth="6" />
          {[260, 475, 690].map((hx, idx) => (
            <g key={idx} transform={`translate(${hx}, 545)`}>
              <polygon points="65,0 130,52 0,52" fill="#dc2626" stroke="#1e1b18" strokeWidth="5" />
              <rect x="18" y="52" width="94" height="86" rx="8" fill="#ffffff" stroke="#1e1b18" strokeWidth="5" />
            </g>
          ))}
        </g>
      )}

      {/* CALLOUT LABELS INTERAKTIF YANG MUNCUL BERTAHAP SESUAI DETIK NARASI */}
      <CalloutPin
        x={280}
        y={340}
        label={calloutLabels[0].text}
        active={true}
        tone={calloutLabels[0].tone}
        frame={sceneFrame}
        fps={fps}
      />
      <CalloutPin
        x={790}
        y={360}
        label={calloutLabels[1].text}
        active={stageStep >= 1}
        tone={calloutLabels[1].tone}
        frame={Math.max(0, sceneFrame - Math.floor(sceneDuration * 0.33))}
        fps={fps}
      />
      <CalloutPin
        x={540}
        y={840}
        label={calloutLabels[2].text}
        active={stageStep >= 2}
        tone={calloutLabels[2].tone}
        frame={Math.max(0, sceneFrame - Math.floor(sceneDuration * 0.66))}
        fps={fps}
      />
    </svg>
  );
};

// Subtitle Kertas Krem Tempelan (Tape-Strip Caption ala video_2.mp4)
const PaperStripCaption: React.FC<{
  body: string;
  sceneFrame: number;
  sceneDurationFrames: number;
  fps: number;
  goldColor: string;
}> = ({ body, sceneFrame, sceneDurationFrames, fps, goldColor }) => {
  const words = (body || '').trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return null;

  const CHUNK_SIZE = 5;
  const chunks: string[][] = [];
  for (let i = 0; i < words.length; i += CHUNK_SIZE) {
    chunks.push(words.slice(i, i + CHUNK_SIZE));
  }

  const effectiveFrames = Math.max(1, sceneDurationFrames * 0.94);
  const progress = Math.min(0.999, Math.max(0, sceneFrame / effectiveFrames));
  const activeChunkIdx = Math.min(chunks.length - 1, Math.floor(progress * chunks.length));
  const currentChunk = chunks[activeChunkIdx];

  const chunkStartFrame = (activeChunkIdx / chunks.length) * effectiveFrames;
  const localFrame = Math.max(0, sceneFrame - chunkStartFrame);
  const chunkDuration = effectiveFrames / chunks.length;
  const activeWordInChunk = Math.min(
    currentChunk.length - 1,
    Math.floor((localFrame / Math.max(1, chunkDuration)) * currentChunk.length)
  );

  const pop = spring({
    frame: localFrame,
    fps,
    config: { damping: 14, stiffness: 200 },
  });

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        backgroundColor: '#f5efe6',
        border: '3px solid #1e1b18',
        boxShadow: '0 10px 0 rgba(30,27,24,0.28)',
        borderRadius: 16,
        padding: '20px 26px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px 12px',
        transform: `scale(${interpolate(pop, [0, 1], [0.95, 1])})`,
      }}
    >
      {/* Selotip Kertas Kiri Atas seperti di video_2 */}
      <div
        style={{
          position: 'absolute',
          top: -12,
          left: 24,
          width: 64,
          height: 20,
          backgroundColor: 'rgba(234, 179, 8, 0.72)',
          border: '1.5px solid #1e1b18',
          transform: 'rotate(-6deg)',
        }}
      />
      {currentChunk.map((word, idx) => {
        const isCurrent = idx === activeWordInChunk;
        return (
          <span
            key={`${activeChunkIdx}-${idx}`}
            style={{
              fontSize: 36,
              fontWeight: 900,
              lineHeight: 1.2,
              padding: isCurrent ? '3px 12px' : '3px 2px',
              borderRadius: 10,
              backgroundColor: isCurrent ? goldColor : 'transparent',
              color: '#1e1b18',
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};

export const DynamicMotionVideo: React.FC<DynamicMotionProps> = ({
  title,
  audioSrc,
  styleConfig = {},
  scenes = [],
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const accentColor = styleConfig.accentColor || '#2563eb';
  const goldColor = styleConfig.goldColor || '#eab308';
  const dangerColor = styleConfig.dangerColor || '#dc2626';
  const successColor = styleConfig.successColor || '#16a34a';
  const watermark = styleConfig.watermark || 'usepkreatif';

  const safeScenes = scenes.length > 0 ? scenes : [];
  if (safeScenes.length === 0) return <AbsoluteFill style={{ backgroundColor: '#e6dcc8' }} />;

  const weights = safeScenes.map((s) =>
    s.durationSec && s.durationSec > 0 ? s.durationSec : getSpeechWeight(s.body)
  );
  const totalWeight = weights.reduce((a, b) => a + b, 0);

  let accumulatedFrames = 0;
  const sceneRanges = safeScenes.map((scene, idx) => {
    const rawFrames = Math.round((weights[idx] / totalWeight) * durationInFrames);
    const startFrame = accumulatedFrames;
    const endFrame =
      idx === safeScenes.length - 1 ? durationInFrames : Math.min(durationInFrames, startFrame + rawFrames);
    accumulatedFrames = endFrame;
    return { scene, startFrame, endFrame, duration: Math.max(1, endFrame - startFrame) };
  });

  const currentIdx = Math.max(
    0,
    sceneRanges.findIndex((r) => frame >= r.startFrame && frame < r.endFrame)
  );
  const activeRange = sceneRanges[currentIdx] || sceneRanges[sceneRanges.length - 1];
  const { scene, startFrame, duration: sceneDuration } = activeRange;
  const sceneFrame = Math.max(0, frame - startFrame);

  const env = ENVIRONMENTS[currentIdx % ENVIRONMENTS.length];

  // Transisi Tirai Serat Kayu (Wood-Grain Transition Wipe seperti detik 01:20 & 02:11 di video_2)
  const wipeProgress = interpolate(sceneFrame, [0, 12], [0, 1], { extrapolateRight: 'clamp' });

  const bannerColor =
    scene.headingTone === 'danger'
      ? dangerColor
      : scene.headingTone === 'success'
      ? successColor
      : '#2c3e2e';

  return (
    <AbsoluteFill
      style={{
        backgroundColor: env.sky,
        fontFamily: "'Inter', 'Montserrat', system-ui, sans-serif",
        color: '#1e1b18',
        overflow: 'hidden',
      }}
    >
      {audioSrc ? <Audio src={staticFile(audioSrc)} /> : null}

      {/* Lapisan Foto Pixabay Full-Bleed Lembut di Latar Belakang */}
      {scene.imageUrl ? (
        <Img
          src={scene.imageUrl}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.14,
          }}
        />
      ) : null}

      {/* PANGGUNG DIORAMA FULL-SCREEN INTERAKTIF */}
      <InteractiveDioramaStage
        sceneIndex={currentIdx}
        sceneFrame={sceneFrame}
        sceneDuration={sceneDuration}
        fps={fps}
        points={scene.points || []}
        overlayType={scene.overlayType}
        compareLeft={scene.compareLeft}
        compareRight={scene.compareRight}
        heroStat={scene.heroStat}
      />

      {/* OVERLAY UI ATAS & BAWAH */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          height: '100%',
          padding: '44px 40px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        {/* TOP BAR: Tag Kategori + Watermark + Banner Judul Berbingkai */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div
              style={{
                backgroundColor: '#2c3e2e',
                color: goldColor,
                padding: '8px 18px',
                borderRadius: 99,
                fontSize: 19,
                fontWeight: 800,
                border: '2px solid #1e1b18',
              }}
            >
              • {scene.tag || title}
            </div>
            <div
              style={{
                backgroundColor: '#fcf9f2',
                border: '2.5px solid #1e1b18',
                padding: '6px 14px',
                borderRadius: 10,
                fontSize: 18,
                fontWeight: 800,
              }}
            >
              @{watermark}
            </div>
          </div>

          {/* Papan Judul Miring Halus (Signboard ala video_2) */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 6 }}>
            <div
              style={{
                backgroundColor: bannerColor,
                color: '#fcf9f2',
                padding: '14px 30px',
                borderRadius: 14,
                border: '4px solid #fcf9f2',
                boxShadow: '0 8px 0 #1e1b18',
                fontSize: 40,
                fontWeight: 900,
                textAlign: 'center',
                letterSpacing: 0.5,
                transform: 'rotate(-1.2deg)',
              }}
            >
              {scene.heading}
            </div>
          </div>
        </div>

        {/* BOTTOM AREA: Kartu Angka/Perbandingan Ringkas (jika ada) + Subtitle Tempelan */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {scene.overlayType === 'bars' && scene.points && (
            <div
              style={{
                backgroundColor: 'rgba(252,249,242,0.94)',
                border: '3px solid #1e1b18',
                boxShadow: '0 8px 0 #1e1b18',
                borderRadius: 18,
                padding: '14px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}
            >
              {scene.points.map((pt, i) => {
                const barProg = spring({ frame: Math.max(0, sceneFrame - i * 6), fps, config: { damping: 14 } });
                const val = pt.value ?? 90;
                return (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 20, fontWeight: 800 }}>
                      <span>{pt.text}</span>
                      <span>{Math.round(val * barProg)}%</span>
                    </div>
                    <div style={{ height: 12, backgroundColor: '#e5dec9', borderRadius: 99, overflow: 'hidden', border: '1.5px solid #1e1b18' }}>
                      <div style={{ height: '100%', width: `${val * barProg}%`, backgroundColor: successColor }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <PaperStripCaption
            body={scene.body}
            sceneFrame={sceneFrame}
            sceneDurationFrames={sceneDuration}
            fps={fps}
            goldColor={goldColor}
          />
        </div>
      </div>

      {/* TIRAI TRANSISI ANTAR ADEGAN (Slide Wipe di 12 Frame Pertama Scene) */}
      {wipeProgress < 1 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 30,
            backgroundColor: '#d4c3a3',
            borderLeft: '6px solid #1e1b18',
            transform: `translateX(${interpolate(wipeProgress, [0, 1], [0, 1080])}px)`,
            pointerEvents: 'none',
          }}
        />
      )}
    </AbsoluteFill>
  );
};

export default DynamicMotionVideo;
