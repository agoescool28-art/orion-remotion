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

const ENVIRONMENTS = [
  { sky: '#efe4cf', hill: '#8fa368', path: '#d6c3a5', accent: '#d97706' },
  { sky: '#e8dfd1', hill: '#6b7f94', path: '#cbd5e1', accent: '#2563eb' },
  { sky: '#f4ebd9', hill: '#2f6f4e', path: '#e2d4b7', accent: '#ca8a04' },
  { sky: '#eddcd2', hill: '#9e4747', path: '#e5cfc2', accent: '#dc2626' },
  { sky: '#e2ead9', hill: '#5a8238', path: '#d9d2be', accent: '#ea580c' },
  { sky: '#dce3ec', hill: '#475569', path: '#cbd5e1', accent: '#0284c7' },
  { sky: '#e6e4d8', hill: '#2e6b46', path: '#d8d3c1', accent: '#16a34a' },
  { sky: '#f5e6cc', hill: '#9c6621', path: '#e6d3b3', accent: '#d97706' },
  { sky: '#dfeae4', hill: '#1f7a6c', path: '#cce0d8', accent: '#0d9488' },
  { sky: '#ede0d4', hill: '#7f4f24', path: '#ddbea9', accent: '#ea580c' },
  { sky: '#e5ead8', hill: '#4c7031', path: '#d8dec6', accent: '#16a34a' },
  { sky: '#f6d8b8', hill: '#5c7c3b', path: '#e8c9a8', accent: '#d97706' },
];

// Komponen Callout HTML Mengambang (Teks Utuh Tanpa Terpotong '...' & Arah Panah Fleksibel)
const SmartCalloutCard: React.FC<{
  left: string;
  top: string;
  text: string;
  active: boolean;
  tone?: 'neutral' | 'danger' | 'success' | 'gold';
  direction?: 'down' | 'up';
  frame: number;
  fps: number;
}> = ({ left, top, text, active, tone = 'neutral', direction = 'down', frame, fps }) => {
  if (!active || !text) return null;

  const pop = spring({
    frame,
    fps,
    config: { damping: 13, stiffness: 190 },
  });

  const dotColor =
    tone === 'danger'
      ? '#dc2626'
      : tone === 'success'
      ? '#16a34a'
      : tone === 'gold'
      ? '#eab308'
      : '#2563eb';

  return (
    <div
      style={{
        position: 'absolute',
        left,
        top,
        transform: `translate(-50%, -50%) scale(${interpolate(pop, [0, 1], [0.75, 1])})`,
        display: 'flex',
        flexDirection: direction === 'down' ? 'column' : 'column-reverse',
        alignItems: 'center',
        zIndex: 15,
        pointerEvents: 'none',
      }}
    >
      {/* Kartu Teks Utuh (Auto-Wrap 2 Baris, Tanpa Ellipsis) */}
      <div
        style={{
          backgroundColor: '#fcf9f2',
          border: '3px solid #1e1b18',
          boxShadow: '0 6px 0 #1e1b18',
          borderRadius: 14,
          padding: '10px 16px',
          maxWidth: 380,
          display: 'flex',
          alignItems: 'flex-start',
          gap: 10,
        }}
      >
        <span
          style={{
            width: 14,
            height: 14,
            borderRadius: 99,
            backgroundColor: dotColor,
            border: '2px solid #1e1b18',
            marginTop: 5,
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontSize: 22,
            fontWeight: 800,
            lineHeight: 1.25,
            color: '#1e1b18',
            textAlign: 'left',
          }}
        >
          {text}
        </span>
      </div>

      {/* Garis & Titik Penunjuk ke Objek */}
      <div
        style={{
          width: 3,
          height: 36,
          borderLeft: '3px dashed #1e1b18',
        }}
      />
      <div
        style={{
          width: 14,
          height: 14,
          borderRadius: 99,
          backgroundColor: dotColor,
          border: '3px solid #1e1b18',
        }}
      />
    </div>
  );
};

// Panggung Diorama Kaya Detail Arsitektur, Karakter, dan Lingkungan
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
  const cameraZoom = interpolate(sceneFrame, [0, sceneDuration], [1.0, 1.06]);
  const cameraPanX = interpolate(sceneFrame, [0, sceneDuration], [-10, 10]);
  const wave = Math.sin(sceneFrame / 10);
  const cloudDrift = (sceneFrame * 0.45) % 1200;
  const variant = sceneIndex % 12;

  const calloutLabels =
    overlayType === 'compare' && compareLeft && compareRight
      ? [
          { text: compareLeft.items[0] || compareLeft.title, tone: 'danger' as const },
          { text: compareRight.items[0] || compareRight.title, tone: 'success' as const },
          { text: compareRight.items[1] || 'Ketenangan Bersama', tone: 'gold' as const },
        ]
      : [
          { text: points[0]?.text || 'Langkah Pertama', tone: points[0]?.tone || 'gold' },
          { text: points[1]?.text || 'Langkah Kedua', tone: points[1]?.tone || 'success' },
          { text: points[2]?.text || heroStat || 'Harmoni Lingkungan', tone: points[2]?.tone || 'neutral' },
        ];

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: 820,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg
        width="1080"
        height="820"
        viewBox="0 0 1080 820"
        style={{
          width: '100%',
          height: '100%',
          overflow: 'visible',
          transform: `scale(${cameraZoom}) translateX(${cameraPanX}px)`,
        }}
      >
        <defs>
          <filter id="dioramaShadow" x="-15%" y="-15%" width="130%" height="140%">
            <feDropShadow dx="0" dy="16" stdDeviation="10" floodColor="#1e1b18" floodOpacity="0.25" />
          </filter>
          <linearGradient id="wallGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#ebe3d2" />
          </linearGradient>
        </defs>

        {/* Awan Bergerak Halus di Latar Atas */}
        <g opacity="0.55" transform={`translate(${cloudDrift - 150}, 70)`}>
          <path
            d="M 40 40 Q 60 10 95 25 Q 125 5 155 30 Q 185 30 185 55 L 30 55 Q 15 45 40 40 Z"
            fill="#ffffff"
          />
        </g>
        <g opacity="0.45" transform={`translate(${880 - cloudDrift * 0.6}, 105)`}>
          <path
            d="M 40 40 Q 60 10 95 25 Q 125 5 155 30 Q 185 30 185 55 L 30 55 Q 15 45 40 40 Z"
            fill="#ffffff"
          />
        </g>

        {/* Pulau Diorama Berlapis + Jalan Setapak */}
        <ellipse cx="540" cy="645" rx="495" ry="155" fill="rgba(30,27,24,0.14)" />
        <path
          d="M 65 565 Q 540 420 1015 565 L 1015 645 Q 540 795 65 645 Z"
          fill="#9ab073"
          stroke="#1e1b18"
          strokeWidth="5"
          filter="url(#dioramaShadow)"
        />
        {/* Jalan Setapak Lingkungan */}
        <path
          d="M 270 615 Q 540 545 810 615"
          fill="none"
          stroke="#e5d5b7"
          strokeWidth="26"
          strokeLinecap="round"
        />

        {/* Pohon Taman Kiri & Kanan */}
        {[
          { x: 115, y: 470, s: 0.95 },
          { x: 965, y: 475, s: 0.9 },
        ].map((t, idx) => (
          <g key={idx} transform={`translate(${t.x}, ${t.y}) scale(${t.s})`}>
            <rect x="-8" y="25" width="16" height="55" rx="4" fill="#78350f" stroke="#1e1b18" strokeWidth="3.5" />
            <circle cx="0" cy="12" r="34" fill="#4d7c0f" stroke="#1e1b18" strokeWidth="3.5" />
            <circle cx="-22" cy="24" r="24" fill="#65a30d" stroke="#1e1b18" strokeWidth="3.5" />
            <circle cx="22" cy="24" r="24" fill="#65a30d" stroke="#1e1b18" strokeWidth="3.5" />
          </g>
        ))}

        {/* === SCENE 0: Dua Rumah Bertetangga dengan Jendela Bercahaya & Pintu Terbuka === */}
        {variant === 0 && (
          <g filter="url(#dioramaShadow)">
            {/* Rumah Kiri */}
            <g transform="translate(175, 290)">
              <polygon points="125,0 250,100 0,100" fill="#d97706" stroke="#1e1b18" strokeWidth="5" />
              <rect x="26" y="100" width="198" height="190" rx="14" fill="url(#wallGrad)" stroke="#1e1b18" strokeWidth="5" />
              {/* Jendela Hangat */}
              <rect x="44" y="130" width="44" height="44" rx="6" fill="#fef08a" stroke="#1e1b18" strokeWidth="3.5" />
              <line x1="66" y1="130" x2="66" y2="174" stroke="#1e1b18" strokeWidth="3" />
              <line x1="44" y1="152" x2="88" y2="152" stroke="#1e1b18" strokeWidth="3" />
              {/* Pintu Terbuka */}
              <rect x="115" y="170" width="68" height="120" fill="#1e1b18" />
              <polygon
                points={`115,170 ${115 + interpolate(stageStep, [0, 2], [68, 22])},182 ${115 + interpolate(stageStep, [0, 2], [68, 22])},302 115,290`}
                fill="#eab308"
                stroke="#1e1b18"
                strokeWidth="4"
              />
            </g>

            {/* Rumah Kanan */}
            <g transform="translate(655, 290)">
              <polygon points="125,0 250,100 0,100" fill="#16a34a" stroke="#1e1b18" strokeWidth="5" />
              <rect x="26" y="100" width="198" height="190" rx="14" fill="url(#wallGrad)" stroke="#1e1b18" strokeWidth="5" />
              <rect x="162" y="130" width="44" height="44" rx="6" fill="#bae6fd" stroke="#1e1b18" strokeWidth="3.5" />
              <line x1="184" y1="130" x2="184" y2="174" stroke="#1e1b18" strokeWidth="3" />
              <line x1="162" y1="152" x2="206" y2="152" stroke="#1e1b18" strokeWidth="3" />
              <rect x="68" y="170" width="68" height="120" rx="8" fill="#2563eb" stroke="#1e1b18" strokeWidth="4" />
            </g>

            {/* Garis Cahaya Penghubung + Ikon Hati di Tengah */}
            <path
              d="M 425 460 Q 540 355 655 460"
              fill="none"
              stroke="#eab308"
              strokeWidth="10"
              strokeDasharray="16 12"
              strokeDashoffset={-sceneFrame * 3}
            />
            <g transform={`translate(540, ${408 + wave * 5})`}>
              <circle r="30" fill="#ffffff" stroke="#1e1b18" strokeWidth="4" />
              <path d="M 0 12 L -12 -1 A7.5 7.5 0 0 1 0 -11 A7.5 7.5 0 0 1 12 -1 Z" fill="#dc2626" />
            </g>
          </g>
        )}

        {/* === SCENE 1: Jembatan 2 Arah (Hak & Amanah) === */}
        {variant === 1 && (
          <g filter="url(#dioramaShadow)">
            <rect x="155" y="340" width="260" height="210" rx="28" fill="#ffffff" stroke="#1e1b18" strokeWidth="6" />
            <text x="285" y="458" textAnchor="middle" fontSize="44" fontWeight="900" fill="#1e1b18">HAK</text>
            <rect x="665" y="340" width="260" height="210" rx="28" fill="#eab308" stroke="#1e1b18" strokeWidth="6" />
            <text x="795" y="458" textAnchor="middle" fontSize="38" fontWeight="900" fill="#1e1b18">AMANAH</text>
            <path d="M 435 410 H 645" stroke="#16a34a" strokeWidth="14" strokeLinecap="round" strokeDasharray="22 14" strokeDashoffset={-sceneFrame * 3} />
            <path d="M 645 485 H 435" stroke="#2563eb" strokeWidth="14" strokeLinecap="round" strokeDasharray="22 14" strokeDashoffset={-sceneFrame * 3} />
          </g>
        )}

        {/* === SCENE 2: Kitab Terbuka QS. An-Nisa: 36 === */}
        {variant === 2 && (
          <g filter="url(#dioramaShadow)">
            <ellipse cx="540" cy="560" rx="310" ry="44" fill="#78350f" stroke="#1e1b18" strokeWidth="5" />
            <path d="M 540 315 Q 370 275 220 325 V 545 Q 370 495 540 545 Z" fill="#ffffff" stroke="#1e1b18" strokeWidth="6" />
            <path d="M 540 315 Q 710 275 860 325 V 545 Q 710 495 540 545 Z" fill="#fef9c3" stroke="#1e1b18" strokeWidth="6" />
            <line x1="540" y1="315" x2="540" y2="545" stroke="#1e1b18" strokeWidth="6" />
            {[360, 400, 440, 480].map((ly, idx) => (
              <React.Fragment key={idx}>
                <line x1="270" y1={ly} x2="490" y2={ly - 10} stroke="#94a3b8" strokeWidth="9" strokeLinecap="round" />
                <line x1="590" y1={ly - 10} x2="810" y2={ly} stroke="#eab308" strokeWidth="9" strokeLinecap="round" />
              </React.Fragment>
            ))}
          </g>
        )}

        {/* === SCENE 3: Peredam Kebisingan & Lisan Santun === */}
        {variant === 3 && (
          <g filter="url(#dioramaShadow)">
            <polygon points="240,390 340,390 450,305 450,585 340,500 240,500" fill="#dc2626" stroke="#1e1b18" strokeWidth="6" />
            <path d="M 500 380 Q 545 445 500 510" fill="none" stroke="#dc2626" strokeWidth="12" strokeLinecap="round" />
            <path d="M 560 340 Q 625 445 560 550" fill="none" stroke="#dc2626" strokeWidth="12" strokeLinecap="round" opacity={stageStep >= 1 ? 0.2 : 0.9} />
            {stageStep >= 1 && (
              <g transform="translate(550, 445)">
                <path d="M -52 -52 L 52 52 M 52 -52 L -52 52" stroke="#dc2626" strokeWidth="26" strokeLinecap="round" />
                <path d="M -52 -52 L 52 52 M 52 -52 L -52 52" stroke="#ffffff" strokeWidth="8" strokeLinecap="round" />
              </g>
            )}
            <circle cx="775" cy="445" r="88" fill="#16a34a" stroke="#1e1b18" strokeWidth="6" />
            <path d="M 735 445 L 765 475 L 820 415" fill="none" stroke="#ffffff" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        )}

        {/* === SCENE 4: Paket Bantuan & Kepedulian === */}
        {variant === 4 && (
          <g filter="url(#dioramaShadow)">
            <rect x="360" y="365" width="360" height="215" rx="28" fill="#eab308" stroke="#1e1b18" strokeWidth="6" />
            <rect x="505" y="365" width="70" height="215" fill="#dc2626" stroke="#1e1b18" strokeWidth="5" />
            <rect x="360" y="440" width="360" height="60" fill="#dc2626" stroke="#1e1b18" strokeWidth="5" />
            <g transform={`translate(540, ${285 + wave * 8})`}>
              <circle r="54" fill="#ffffff" stroke="#1e1b18" strokeWidth="6" />
              <path d="M 0 22 L -23 -2 A14 14 0 0 1 0 -20 A14 14 0 0 1 23 -2 Z" fill="#dc2626" />
            </g>
          </g>
        )}

        {/* === SCENE 5: Pagar & Gembok Privasi === */}
        {variant === 5 && (
          <g filter="url(#dioramaShadow)">
            {[220, 320, 420, 660, 760, 860].map((px, i) => (
              <rect key={i} x={px - 22} y="340" width="44" height="240" rx="10" fill="#ffffff" stroke="#1e1b18" strokeWidth="5" />
            ))}
            <path d="M 465 395 V 340 A 75 75 0 0 1 615 340 V 395" fill="none" stroke="#eab308" strokeWidth="26" strokeLinecap="round" />
            <rect x="425" y="390" width="230" height="185" rx="32" fill="#2563eb" stroke="#1e1b18" strokeWidth="6" />
            <circle cx="540" cy="465" r="24" fill="#1e1b18" />
            <rect x="528" y="478" width="24" height="48" rx="8" fill="#1e1b18" />
          </g>
        )}

        {/* === SCENE 6: Perisai Keamanan === */}
        {variant === 6 && (
          <g filter="url(#dioramaShadow)">
            <path d="M 540 275 L 700 335 V 455 C 700 545 630 605 540 635 C 450 605 380 545 380 455 V 335 Z" fill="#16a34a" stroke="#1e1b18" strokeWidth="7" />
            <path d="M 480 455 L 524 500 L 610 405" fill="none" stroke="#ffffff" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        )}

        {/* === SCENE 7: Sepiring Makanan & Sapaan Hangat === */}
        {variant === 7 && (
          <g filter="url(#dioramaShadow)">
            <path d="M 320 520 A 220 175 0 0 1 760 520 Z" fill="#eab308" stroke="#1e1b18" strokeWidth="6" />
            <circle cx="540" cy="330" r="26" fill="#dc2626" stroke="#1e1b18" strokeWidth="5" />
            <rect x="280" y="520" width="520" height="38" rx="19" fill="#ffffff" stroke="#1e1b18" strokeWidth="6" />
            {[-75, 0, 75].map((dx, i) => (
              <path
                key={i}
                d={`M ${540 + dx} ${295 + wave * 6} Q ${560 + dx} 265 ${540 + dx} 235`}
                fill="none"
                stroke="#ffffff"
                strokeWidth="8"
                strokeLinecap="round"
              />
            ))}
          </g>
        )}

        {/* === SCENE 8: Lingkaran 4 Warga Tersenyum === */}
        {variant === 8 && (
          <g filter="url(#dioramaShadow)">
            <circle cx="540" cy="445" r="145" fill="none" stroke="#1e1b18" strokeWidth="8" strokeDasharray="18 14" strokeDashoffset={-sceneFrame * 2} />
            {[
              { cx: 540, cy: 300, c: '#eab308' },
              { cx: 685, cy: 445, c: '#16a34a' },
              { cx: 540, cy: 590, c: '#2563eb' },
              { cx: 395, cy: 445, c: '#dc2626' },
            ].map((n, i) => (
              <g key={i}>
                <circle cx={n.cx} cy={n.cy} r="54" fill={n.c} stroke="#1e1b18" strokeWidth="6" />
                {/* Mata & Senyum Ramah */}
                <circle cx={n.cx - 16} cy={n.cy - 10} r="5" fill="#ffffff" />
                <circle cx={n.cx + 16} cy={n.cy - 10} r="5" fill="#ffffff" />
                <path d={`M ${n.cx - 18} ${n.cy + 10} Q ${n.cx} ${n.cy + 28} ${n.cx + 18} ${n.cy + 10}`} fill="none" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" />
              </g>
            ))}
          </g>
        )}

        {/* === SCENE 9: Timbangan Aksi vs Tuntutan === */}
        {variant === 9 && (
          <g filter="url(#dioramaShadow)">
            <rect x="520" y="330" width="40" height="250" rx="12" fill="#ffffff" stroke="#1e1b18" strokeWidth="6" />
            <rect x="400" y="565" width="280" height="36" rx="14" fill="#eab308" stroke="#1e1b18" strokeWidth="6" />
            <g transform={`rotate(${interpolate(stageStep, [0, 2], [-8, 8])} 540 370)`}>
              <rect x="270" y="355" width="540" height="28" rx="14" fill="#2563eb" stroke="#1e1b18" strokeWidth="6" />
              <circle cx="310" cy="460" r="62" fill="#dc2626" stroke="#1e1b18" strokeWidth="6" />
              <circle cx="770" cy="460" r="62" fill="#16a34a" stroke="#1e1b18" strokeWidth="6" />
            </g>
          </g>
        )}

        {/* === SCENE 10: Kompas Langkah Diri Sendiri === */}
        {variant === 10 && (
          <g filter="url(#dioramaShadow)">
            <circle cx="540" cy="445" r="160" fill="#ffffff" stroke="#1e1b18" strokeWidth="8" />
            <circle cx="540" cy="445" r="130" fill="none" stroke="#2563eb" strokeWidth="5" strokeDasharray="12 10" />
            <g transform={`rotate(${wave * 22} 540 445)`}>
              <polygon points="540,315 572,445 540,468 508,445" fill="#dc2626" stroke="#1e1b18" strokeWidth="5" />
              <polygon points="540,575 572,445 540,422 508,445" fill="#16a34a" stroke="#1e1b18" strokeWidth="5" />
            </g>
            <circle cx="540" cy="445" r="20" fill="#eab308" stroke="#1e1b18" strokeWidth="5" />
          </g>
        )}

        {/* === SCENE 11: Panorama Kampung Harmonis === */}
        {variant === 11 && (
          <g filter="url(#dioramaShadow)">
            <circle cx="540" cy="390" r="130" fill="#eab308" stroke="#1e1b18" strokeWidth="6" />
            {[245, 470, 695].map((hx, idx) => (
              <g key={idx} transform={`translate(${hx}, 405)`}>
                <polygon points="70,0 140,54 0,54" fill="#dc2626" stroke="#1e1b18" strokeWidth="5" />
                <rect x="18" y="54" width="104" height="90" rx="8" fill="#ffffff" stroke="#1e1b18" strokeWidth="5" />
                <rect x="52" y="92" width="36" height="52" rx="4" fill="#2563eb" stroke="#1e1b18" strokeWidth="3" />
              </g>
            ))}
          </g>
        )}
      </svg>

      {/* 3 SMART CALLOUT CARDS (Teks Utuh, Arah Panah Benar, Tidak Pernah Terpotong) */}
      <SmartCalloutCard
        left="28%"
        top="19%"
        text={calloutLabels[0].text}
        active={true}
        tone={calloutLabels[0].tone}
        direction="down"
        frame={sceneFrame}
        fps={fps}
      />
      <SmartCalloutCard
        left="73%"
        top="22%"
        text={calloutLabels[1].text}
        active={stageStep >= 1}
        tone={calloutLabels[1].tone}
        direction="down"
        frame={Math.max(0, sceneFrame - Math.floor(sceneDuration * 0.33))}
        fps={fps}
      />
      <SmartCalloutCard
        left="50%"
        top="84%"
        text={calloutLabels[2].text}
        active={stageStep >= 2}
        tone={calloutLabels[2].tone}
        direction="up"
        frame={Math.max(0, sceneFrame - Math.floor(sceneDuration * 0.66))}
        fps={fps}
      />
    </div>
  );
};

// Subtitle Kertas Krem Tempelan
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
        backgroundColor: '#fcf9f2',
        border: '3px solid #1e1b18',
        boxShadow: '0 10px 0 rgba(30,27,24,0.28)',
        borderRadius: 18,
        padding: '22px 26px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px 12px',
        transform: `scale(${interpolate(pop, [0, 1], [0.95, 1])})`,
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: -12,
          left: 24,
          width: 66,
          height: 20,
          backgroundColor: 'rgba(234, 179, 8, 0.78)',
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

  const goldColor = styleConfig.goldColor || '#eab308';
  const dangerColor = styleConfig.dangerColor || '#dc2626';
  const successColor = styleConfig.successColor || '#16a34a';
  const watermark = styleConfig.watermark || 'usepkreatif';

  const safeScenes = scenes.length > 0 ? scenes : [];
  if (safeScenes.length === 0) return <AbsoluteFill style={{ backgroundColor: '#efe4cf' }} />;

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
        padding: '42px 38px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      {audioSrc ? <Audio src={staticFile(audioSrc)} /> : null}

      {scene.imageUrl ? (
        <Img
          src={scene.imageUrl}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.12,
          }}
        />
      ) : null}

      {/* HEADER ATAS + SUB-BADGE KONTEKS */}
      <div style={{ zIndex: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
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

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
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
              transform: 'rotate(-1deg)',
            }}
          >
            {scene.heading}
          </div>

          {/* Sub-Badge HeroStat & HeroLabel agar bagian atas tidak kosong */}
          {(scene.heroStat || scene.heroLabel) && (
            <div
              style={{
                backgroundColor: '#fcf9f2',
                border: '2.5px solid #1e1b18',
                borderRadius: 99,
                padding: '6px 18px',
                fontSize: 19,
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              {scene.heroStat && (
                <span style={{ color: dangerColor, fontWeight: 900 }}>{scene.heroStat}</span>
              )}
              {scene.heroStat && scene.heroLabel && <span>•</span>}
              {scene.heroLabel && <span>{scene.heroLabel}</span>}
            </div>
          )}
        </div>
      </div>

      {/* TENGAH: PANGGUNG DIORAMA INTERAKTIF + SMART CALLOUTS */}
      <div style={{ zIndex: 10, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
      </div>

      {/* BAWAH: GRAFIK BARS RINGKAS (JIKA ADA) + SUBTITLE KERTAS */}
      <div style={{ zIndex: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
        {scene.overlayType === 'bars' && scene.points && (
          <div
            style={{
              backgroundColor: 'rgba(252,249,242,0.95)',
              border: '3px solid #1e1b18',
              boxShadow: '0 7px 0 #1e1b18',
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

      {/* TIRAI TRANSISI ANTAR ADEGAN */}
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
