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

// Tema warna panggung yang berganti setiap scene agar tidak monoton
const STAGE_THEMES = [
  { bg: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', text: '#f8fafc', border: '#1e1b18' },
  { bg: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', text: '#1e1b18', border: '#1e1b18' },
  { bg: 'linear-gradient(135deg, #064e3b 0%, #022c22 100%)', text: '#ecfdf5', border: '#1e1b18' },
  { bg: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)', text: '#1e1b18', border: '#1e1b18' },
  { bg: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', text: '#1e1b18', border: '#1e1b18' },
  { bg: 'linear-gradient(135deg, #27272a 0%, #18181b 100%)', text: '#fafafa', border: '#1e1b18' },
];

// 12 Ilustrasi Vektor Bercerita (Story-Driven Illustrations)
const StoryVectorArtwork: React.FC<{
  sceneIndex: number;
  frame: number;
  fps: number;
  accent: string;
  gold: string;
  danger: string;
  success: string;
  isLightBg: boolean;
}> = ({ sceneIndex, frame, fps, accent, gold, danger, success, isLightBg }) => {
  const strokeMain = isLightBg ? '#1e1b18' : '#ffffff';
  const floatY = Math.sin(frame / 13) * 6;
  const wave = Math.sin(frame / 8);
  const spin = (frame * 1.2) % 360;
  const dash = -(frame * 2.4);
  const pop = spring({ frame, fps, config: { damping: 13, stiffness: 130 } });

  const variant = sceneIndex % 12;

  return (
    <div style={{ transform: `translateY(${floatY}px) scale(${interpolate(pop, [0, 1], [0.88, 1])})` }}>
      {/* 0: Deretan 3 Rumah dengan Cahaya Koneksi Pagi */}
      {variant === 0 && (
        <svg width="760" height="290" viewBox="0 0 760 290">
          {/* Matahari Pagi */}
          <circle cx="640" cy="65" r="34" fill={gold} stroke="#1e1b18" strokeWidth="4" />
          {/* Garis Koneksi Sosial */}
          <path
            d="M 160 155 C 260 70, 500 70, 600 155"
            fill="none"
            stroke={accent}
            strokeWidth="6"
            strokeDasharray="14 10"
            strokeDashoffset={dash}
          />
          {/* 3 Rumah */}
          {[
            { x: 90, roof: danger, door: gold },
            { x: 315, roof: gold, door: accent },
            { x: 540, roof: success, door: gold },
          ].map((h, i) => (
            <g key={i} transform={`translate(${h.x}, 115)`}>
              <polygon points="65,0 130,52 0,52" fill={h.roof} stroke="#1e1b18" strokeWidth="4" />
              <rect x="16" y="52" width="98" height="82" rx="10" fill="#ffffff" stroke="#1e1b18" strokeWidth="4" />
              <rect x="48" y="84" width="34" height="50" rx="5" fill={h.door} stroke="#1e1b18" strokeWidth="3" />
              <circle cx="74" cy="110" r="3.5" fill="#1e1b18" />
            </g>
          ))}
        </svg>
      )}

      {/* 1: Jembatan Hubungan 2 Arah (Hak & Tanggung Jawab) */}
      {variant === 1 && (
        <svg width="760" height="290" viewBox="0 0 760 290">
          <rect x="110" y="95" width="170" height="110" rx="22" fill="#ffffff" stroke="#1e1b18" strokeWidth="5" />
          <text x="195" y="158" textAnchor="middle" fontSize="28" fontWeight="900" fill="#1e1b18">HAK</text>
          <rect x="480" y="95" width="170" height="110" rx="22" fill={gold} stroke="#1e1b18" strokeWidth="5" />
          <text x="565" y="158" textAnchor="middle" fontSize="24" fontWeight="900" fill="#1e1b18">AMANAH</text>
          {/* Panah Bolak-Balik Animasi */}
          <path d="M 300 130 H 460" stroke={success} strokeWidth="8" strokeLinecap="round" strokeDasharray="16 10" strokeDashoffset={dash} />
          <polygon points="465,130 442,115 442,145" fill={success} />
          <path d="M 460 175 H 300" stroke={accent} strokeWidth="8" strokeLinecap="round" strokeDasharray="16 10" strokeDashoffset={dash} />
          <polygon points="295,175 318,160 318,190" fill={accent} />
        </svg>
      )}

      {/* 2: Kitab Terbuka & Pancaran Dalil QS. An-Nisa: 36 */}
      {variant === 2 && (
        <svg width="760" height="290" viewBox="0 0 760 290">
          {/* Cahaya Geometris */}
          <circle cx="380" cy="145" r={105 + wave * 6} fill="none" stroke={gold} strokeWidth="3" strokeDasharray="12 10" />
          {/* Halaman Kiri & Kanan */}
          <path d="M 380 85 Q 290 65 205 90 V 225 Q 290 200 380 225 Z" fill="#ffffff" stroke="#1e1b18" strokeWidth="5" />
          <path d="M 380 85 Q 470 65 555 90 V 225 Q 470 200 380 225 Z" fill="#fef9c3" stroke="#1e1b18" strokeWidth="5" />
          <line x1="380" y1="85" x2="380" y2="225" stroke="#1e1b18" strokeWidth="5" />
          {/* Baris Teks Simbolik */}
          {[115, 140, 165, 190].map((y, idx) => (
            <React.Fragment key={idx}>
              <line x1="235" y1={y} x2="350" y2={y - 5} stroke="#94a3b8" strokeWidth="6" strokeLinecap="round" />
              <line x1="410" y1={y - 5} x2="525" y2={y} stroke={gold} strokeWidth="6" strokeLinecap="round" />
            </React.Fragment>
          ))}
        </svg>
      )}

      {/* 3: Peredam Kebisingan & Lisan Santun (Volume Down) */}
      {variant === 3 && (
        <svg width="760" height="290" viewBox="0 0 760 290">
          {/* Speaker Kiri */}
          <polygon points="190,115 245,115 305,70 305,220 245,175 190,175" fill={danger} stroke="#1e1b18" strokeWidth="5" />
          {/* Gelombang Suara Mengecil */}
          <path d="M 340 110 Q 365 145 340 180" fill="none" stroke={danger} strokeWidth="7" strokeLinecap="round" />
          <path
            d="M 380 85 Q 420 145 380 205"
            fill="none"
            stroke={danger}
            strokeWidth="7"
            strokeLinecap="round"
            opacity={0.35 + Math.abs(wave) * 0.4}
          />
          {/* Tanda Silang / Mute */}
          <circle cx="515" cy="145" r="64" fill={success} stroke="#1e1b18" strokeWidth="5" />
          <path d="M 488 145 L 508 165 L 546 125" fill="none" stroke="#ffffff" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}

      {/* 4: Paket Kepedulian & Bantuan (Hati + Kotak Kebaikan) */}
      {variant === 4 && (
        <svg width="760" height="290" viewBox="0 0 760 290">
          <rect x="275" y="115" width="210" height="130" rx="20" fill={gold} stroke="#1e1b18" strokeWidth="5" />
          <rect x="358" y="115" width="44" height="130" fill={danger} stroke="#1e1b18" strokeWidth="4" />
          <rect x="275" y="162" width="210" height="36" fill={danger} stroke="#1e1b18" strokeWidth="4" />
          {/* Ikon Hati Mengambang */}
          <g transform={`translate(380, ${68 + wave * 6})`}>
            <circle r="36" fill="#ffffff" stroke="#1e1b18" strokeWidth="4" />
            <path d="M 0 14 L -15 -1 A9 9 0 0 1 0 -13 A9 9 0 0 1 15 -1 Z" fill={danger} />
          </g>
        </svg>
      )}

      {/* 5: Gembok Privasi & Tirai Amanah */}
      {variant === 5 && (
        <svg width="760" height="290" viewBox="0 0 760 290">
          <path d="M 325 125 V 90 A 55 55 0 0 1 435 90 V 125" fill="none" stroke={gold} strokeWidth="18" strokeLinecap="round" />
          <rect x="295" y="120" width="170" height="130" rx="24" fill={accent} stroke="#1e1b18" strokeWidth="5" />
          <circle cx="380" cy="172" r="18" fill="#1e1b18" />
          <rect x="372" y="182" width="16" height="34" rx="6" fill="#1e1b18" />
        </svg>
      )}

      {/* 6: Perisai Keamanan Lingkungan (4 Pilar Hak) */}
      {variant === 6 && (
        <svg width="760" height="290" viewBox="0 0 760 290">
          <circle cx="380" cy="145" r="112" fill="none" stroke={success} strokeWidth="4" strokeDasharray="16 12" transform={`rotate(${spin} 380 145)`} />
          <path d="M 380 42 L 475 80 V 150 C 475 208 432 244 380 262 C 328 244 285 208 285 150 V 80 Z" fill={success} stroke="#1e1b18" strokeWidth="5" />
          <path d="M 342 150 L 370 178 L 424 120" fill="none" stroke="#ffffff" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}

      {/* 7: Kebaikan Kecil — Piring Makanan & Senyum Sapaan */}
      {variant === 7 && (
        <svg width="760" height="290" viewBox="0 0 760 290">
          {/* Tudung Saji / Piring Hangat */}
          <path d="M 245 185 A 135 110 0 0 1 515 185 Z" fill={gold} stroke="#1e1b18" strokeWidth="5" />
          <circle cx="380" cy="65" r="16" fill={danger} stroke="#1e1b18" strokeWidth="4" />
          <rect x="220" y="185" width="320" height="24" rx="12" fill="#ffffff" stroke="#1e1b18" strokeWidth="5" />
          {/* Uap Hangat */}
          {[-45, 0, 45].map((dx, i) => (
            <path
              key={i}
              d={`M ${380 + dx} ${42 + wave * 4} Q ${392 + dx} 24 ${380 + dx} 10`}
              fill="none"
              stroke={strokeMain}
              strokeWidth="5"
              strokeLinecap="round"
            />
          ))}
        </svg>
      )}

      {/* 8: Lingkaran Kesetaraan Warga (Beragam Warna Bersatu) */}
      {variant === 8 && (
        <svg width="760" height="290" viewBox="0 0 760 290">
          <circle cx="380" cy="145" r="92" fill="none" stroke={strokeMain} strokeWidth="5" strokeDasharray="12 10" strokeDashoffset={dash} />
          {[
            { cx: 380, cy: 53, c: gold },
            { cx: 472, cy: 145, c: success },
            { cx: 380, cy: 237, c: accent },
            { cx: 288, cy: 145, c: danger },
          ].map((node, i) => (
            <g key={i}>
              <circle cx={node.cx} cy={node.cy} r="34" fill={node.c} stroke="#1e1b18" strokeWidth="5" />
              <circle cx={node.cx} cy={node.cy - 6} r="10" fill="#ffffff" />
              <path d={`M ${node.cx - 16} ${node.cy + 18} A 16 12 0 0 1 ${node.cx + 16} ${node.cy + 18}`} fill="#ffffff" />
            </g>
          ))}
        </svg>
      )}

      {/* 9: Timbangan Aksi vs Tuntutan */}
      {variant === 9 && (
        <svg width="760" height="290" viewBox="0 0 760 290">
          <rect x="368" y="65" width="24" height="175" rx="8" fill="#ffffff" stroke="#1e1b18" strokeWidth="4" />
          <rect x="295" y="230" width="170" height="24" rx="10" fill={gold} stroke="#1e1b18" strokeWidth="4" />
          <g transform={`rotate(${wave * 5} 380 95)`}>
            <rect x="195" y="86" width="370" height="18" rx="9" fill={accent} stroke="#1e1b18" strokeWidth="4" />
            <circle cx="220" cy="155" r="42" fill={danger} stroke="#1e1b18" strokeWidth="4" />
            <circle cx="540" cy="155" r="42" fill={success} stroke="#1e1b18" strokeWidth="4" />
          </g>
        </svg>
      )}

      {/* 10: Kompas Langkah Awal dari Diri Sendiri */}
      {variant === 10 && (
        <svg width="760" height="290" viewBox="0 0 760 290">
          <circle cx="380" cy="145" r="105" fill="#ffffff" stroke="#1e1b18" strokeWidth="6" />
          <circle cx="380" cy="145" r="85" fill="none" stroke={accent} strokeWidth="3" strokeDasharray="8 8" />
          <g transform={`rotate(${wave * 18} 380 145)`}>
            <polygon points="380,62 402,145 380,162 358,145" fill={danger} stroke="#1e1b18" strokeWidth="3" />
            <polygon points="380,228 402,145 380,128 358,145" fill={success} stroke="#1e1b18" strokeWidth="3" />
          </g>
          <circle cx="380" cy="145" r="14" fill={gold} stroke="#1e1b18" strokeWidth="4" />
        </svg>
      )}

      {/* 11: Panorama Lingkungan Damai & Harmonis */}
      {variant === 11 && (
        <svg width="760" height="290" viewBox="0 0 760 290">
          <circle cx="380" cy="135" r="78" fill={gold} stroke="#1e1b18" strokeWidth="5" />
          <path d="M 120 225 Q 380 165 640 225 L 640 255 L 120 255 Z" fill={success} stroke="#1e1b18" strokeWidth="5" />
          {[220, 345, 470].map((x, idx) => (
            <g key={idx} transform={`translate(${x}, 145)`}>
              <polygon points="35,0 70,28 0,28" fill={danger} stroke="#1e1b18" strokeWidth="3" />
              <rect x="10" y="28" width="50" height="44" rx="5" fill="#ffffff" stroke="#1e1b18" strokeWidth="3" />
            </g>
          ))}
        </svg>
      )}
    </div>
  );
};

// Komponen Kinetic Subtitle Cepat Per Frasa (3 Kata Pop-Up)
const KineticPhraseCaption: React.FC<{
  body: string;
  sceneFrame: number;
  sceneDurationFrames: number;
  fps: number;
  goldColor: string;
}> = ({ body, sceneFrame, sceneDurationFrames, fps, goldColor }) => {
  const words = (body || '').trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return null;

  const CHUNK_SIZE = 3;
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

  const popScale = spring({
    frame: localFrame,
    fps,
    config: { damping: 13, stiffness: 220, mass: 0.6 },
  });

  return (
    <div
      style={{
        width: '100%',
        minHeight: 116,
        backgroundColor: '#1e1b18',
        borderRadius: 24,
        padding: '18px 26px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px 14px',
        boxShadow: '0 10px 0 rgba(30,27,24,0.22)',
        transform: `scale(${interpolate(popScale, [0, 1], [0.9, 1])})`,
      }}
    >
      {currentChunk.map((word, idx) => {
        const isCurrent = idx === activeWordInChunk;
        return (
          <span
            key={`${activeChunkIdx}-${idx}`}
            style={{
              fontSize: 40,
              fontWeight: 900,
              lineHeight: 1.15,
              padding: isCurrent ? '4px 14px' : '4px 4px',
              borderRadius: 12,
              backgroundColor: isCurrent ? goldColor : 'transparent',
              color: isCurrent ? '#1e1b18' : '#ffffff',
              transform: isCurrent ? 'scale(1.08) translateY(-2px)' : 'scale(1)',
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

  const bgColor = styleConfig.bgColor || '#f5efe6';
  const gridColor = styleConfig.gridColor || '#e6dccb';
  const cardBg = styleConfig.cardBg || '#ffffff';
  const accentColor = styleConfig.accentColor || '#2563eb';
  const goldColor = styleConfig.goldColor || '#eab308';
  const dangerColor = styleConfig.dangerColor || '#dc2626';
  const successColor = styleConfig.successColor || '#16a34a';
  const watermark = styleConfig.watermark || 'usepkreatif';

  const safeScenes = scenes.length > 0 ? scenes : [];
  if (safeScenes.length === 0) return <AbsoluteFill style={{ backgroundColor: bgColor }} />;

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

  const stageTheme = STAGE_THEMES[currentIdx % STAGE_THEMES.length];
  const isLightStage = stageTheme.text === '#1e1b18';

  const headerSpring = spring({ frame: sceneFrame, fps, config: { damping: 14, stiffness: 150 } });
  const headingColor =
    scene.headingTone === 'danger'
      ? dangerColor
      : scene.headingTone === 'success'
      ? successColor
      : '#1e1b18';

  const toneBadgeColor = (tone?: string) => {
    if (tone === 'danger') return dangerColor;
    if (tone === 'success') return successColor;
    if (tone === 'gold') return goldColor;
    return accentColor;
  };

  const points = scene.points || [];
  const activePointIdx =
    points.length > 0
      ? Math.min(points.length - 1, Math.floor((sceneFrame / sceneDuration) * points.length))
      : 0;

  // Efek Ken Burns halus jika Pixabay imageUrl tersedia
  const kenBurnsScale = interpolate(sceneFrame, [0, sceneDuration], [1.02, 1.12]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: bgColor,
        fontFamily: "'Inter', 'Montserrat', system-ui, sans-serif",
        color: '#1e1b18',
        padding: '44px 42px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      {audioSrc ? <Audio src={staticFile(audioSrc)} /> : null}

      {/* Grid Kertas Edukatif */}
      <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <defs>
          <pattern id="paperGrid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke={gridColor} strokeWidth="1.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#paperGrid)" />
      </svg>

      {/* Progress Bar Atas */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 10, backgroundColor: 'rgba(30,27,24,0.12)' }}>
        <div
          style={{
            height: '100%',
            width: `${(frame / Math.max(1, durationInFrames)) * 100}%`,
            backgroundColor: dangerColor,
          }}
        />
      </div>

      {/* HEADER */}
      <div
        style={{
          zIndex: 2,
          transform: `translateY(${interpolate(headerSpring, [0, 1], [-24, 0])}px)`,
          opacity: headerSpring,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div
            style={{
              backgroundColor: '#1e1b18',
              color: goldColor,
              padding: '8px 18px',
              borderRadius: 12,
              fontSize: 20,
              fontWeight: 800,
              letterSpacing: 1,
            }}
          >
            {scene.tag || title}
          </div>
          <div
            style={{
              backgroundColor: cardBg,
              border: '2px solid #1e1b18',
              padding: '6px 14px',
              borderRadius: 10,
              fontSize: 18,
              fontWeight: 700,
            }}
          >
            @{watermark}
          </div>
        </div>

        <div
          style={{
            fontSize: 52,
            fontWeight: 900,
            lineHeight: 1.08,
            color: headingColor,
            textTransform: 'uppercase',
            letterSpacing: -0.5,
          }}
        >
          {scene.heading}
        </div>
      </div>

      {/* PANGGUNG ILUSTRASI UTAMA (Besar, Variatif Warna & Vektor Bercerita + Backdrop Pixabay) */}
      <div
        style={{
          zIndex: 2,
          height: 460,
          width: '100%',
          background: stageTheme.bg,
          borderRadius: 30,
          border: '4px solid #1e1b18',
          boxShadow: '0 14px 0 #1e1b18',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Lapisan Foto Pixabay Transparan jika tersedia */}
        {scene.imageUrl ? (
          <Img
            src={scene.imageUrl}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: isLightStage ? 0.14 : 0.22,
              transform: `scale(${kenBurnsScale})`,
            }}
          />
        ) : null}

        {/* Pill Info Atas */}
        <div
          style={{
            position: 'absolute',
            top: 18,
            left: 20,
            right: 20,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 3,
          }}
        >
          <span
            style={{
              backgroundColor: goldColor,
              color: '#1e1b18',
              padding: '6px 16px',
              borderRadius: 99,
              fontWeight: 900,
              fontSize: 19,
              border: '2px solid #1e1b18',
            }}
          >
            {scene.heroStat || `BAGIAN ${currentIdx + 1}`}
          </span>
          {scene.heroLabel && (
            <span
              style={{
                backgroundColor: isLightStage ? '#1e1b18' : 'rgba(255,255,255,0.16)',
                color: isLightStage ? '#ffffff' : stageTheme.text,
                padding: '6px 14px',
                borderRadius: 10,
                fontWeight: 800,
                fontSize: 16,
                letterSpacing: 0.6,
              }}
            >
              {scene.heroLabel}
            </span>
          )}
        </div>

        {/* Karya Vektor Spesifik Scene */}
        <div style={{ zIndex: 2, marginTop: 32 }}>
          <StoryVectorArtwork
            sceneIndex={currentIdx}
            frame={sceneFrame}
            fps={fps}
            accent={accentColor}
            gold={goldColor}
            danger={dangerColor}
            success={successColor}
            isLightBg={isLightStage}
          />
        </div>
      </div>

      {/* KARTU DATA / PERBANDINGAN / CHECKLIST */}
      <div style={{ zIndex: 2, width: '100%' }}>
        {scene.overlayType === 'compare' && scene.compareLeft && scene.compareRight ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
            {[scene.compareLeft, scene.compareRight].map((col, cIdx) => {
              const colColor = toneBadgeColor(col.tone);
              const pop = spring({ frame: Math.max(0, sceneFrame - cIdx * 6), fps, config: { damping: 14 } });
              return (
                <div
                  key={cIdx}
                  style={{
                    backgroundColor: cardBg,
                    border: '3px solid #1e1b18',
                    boxShadow: '0 8px 0 #1e1b18',
                    borderRadius: 22,
                    padding: '18px 16px',
                    transform: `scale(${interpolate(pop, [0, 1], [0.92, 1])})`,
                  }}
                >
                  <div
                    style={{
                      display: 'inline-block',
                      backgroundColor: colColor,
                      color: '#ffffff',
                      fontSize: 15,
                      fontWeight: 800,
                      padding: '4px 12px',
                      borderRadius: 8,
                      marginBottom: 6,
                    }}
                  >
                    {col.badge}
                  </div>
                  <div style={{ fontSize: 26, fontWeight: 900, marginBottom: 10, color: '#1e1b18' }}>
                    {col.title}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {(col.items || []).map((it, i) => (
                      <div
                        key={i}
                        style={{
                          fontSize: 21,
                          fontWeight: 700,
                          padding: '7px 10px',
                          backgroundColor: bgColor,
                          borderRadius: 10,
                          borderLeft: `6px solid ${colColor}`,
                        }}
                      >
                        {it}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : scene.overlayType === 'bars' ? (
          <div
            style={{
              backgroundColor: cardBg,
              border: '3px solid #1e1b18',
              boxShadow: '0 8px 0 #1e1b18',
              borderRadius: 22,
              padding: '20px 22px',
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
            }}
          >
            {points.map((pt, idx) => {
              const barProgress = spring({ frame: Math.max(0, sceneFrame - idx * 5), fps, config: { damping: 15 } });
              const targetVal = pt.value ?? 85;
              const fillColor = toneBadgeColor(pt.tone);
              return (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 22, fontWeight: 800, marginBottom: 5 }}>
                    <span>{pt.text}</span>
                    <span style={{ color: fillColor }}>{Math.round(targetVal * barProgress)}%</span>
                  </div>
                  <div style={{ height: 16, backgroundColor: bgColor, borderRadius: 99, overflow: 'hidden', border: '2px solid #1e1b18' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${targetVal * barProgress}%`,
                        backgroundColor: fillColor,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {points.map((pt, idx) => {
              const isActive = idx === activePointIdx;
              const badgeBg = toneBadgeColor(pt.tone);
              const pop = spring({ frame: Math.max(0, sceneFrame - idx * 4), fps, config: { damping: 14 } });
              return (
                <div
                  key={idx}
                  style={{
                    backgroundColor: isActive ? cardBg : 'rgba(255,255,255,0.72)',
                    border: isActive ? '3px solid #1e1b18' : '2px solid rgba(30,27,24,0.25)',
                    boxShadow: isActive ? '0 7px 0 #1e1b18' : 'none',
                    borderRadius: 18,
                    padding: '15px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 15,
                    transform: `scale(${isActive ? 1.02 : 0.98}) translateX(${interpolate(pop, [0, 1], [-18, 0])}px)`,
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 99,
                      backgroundColor: badgeBg,
                      color: '#ffffff',
                      fontWeight: 900,
                      fontSize: 19,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      border: '2px solid #1e1b18',
                    }}
                  >
                    {scene.overlayType === 'checklist' ? '✓' : idx + 1}
                  </div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: '#1e1b18', lineHeight: 1.25 }}>
                    {pt.text}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* KINETIC CAPTION BAWAH */}
      <div style={{ zIndex: 2, width: '100%' }}>
        <KineticPhraseCaption
          body={scene.body}
          sceneFrame={sceneFrame}
          sceneDurationFrames={sceneDuration}
          fps={fps}
          goldColor={goldColor}
        />
      </div>
    </AbsoluteFill>
  );
};

export default DynamicMotionVideo;
