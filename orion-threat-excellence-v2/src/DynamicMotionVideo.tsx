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

// Ilustrasi Vektor Animasi Kaya Gerak (Gaya Claude / Flat Editorial Motion)
const VectorIllustrationStage: React.FC<{
  type: string;
  frame: number;
  fps: number;
  accent: string;
  gold: string;
  danger: string;
  success: string;
  heroStat?: string;
  heroLabel?: string;
}> = ({ type, frame, fps, accent, gold, danger, success, heroStat, heroLabel }) => {
  const enter = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const floatY = Math.sin(frame / 14) * 7;
  const pulse = 1 + Math.sin(frame / 10) * 0.04;
  const spin = (frame * 1.4) % 360;
  const dashOffset = -(frame * 2.5);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: 'linear-gradient(145deg, #1e1b18 0%, #2c2620 100%)',
        borderRadius: 28,
        border: '3px solid #1e1b18',
        boxShadow: '0 14px 0 #1e1b18',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        transform: `scale(${interpolate(enter, [0, 1], [0.92, 1])})`,
      }}
    >
      {/* Grid Latar Halus */}
      <svg width="100%" height="100%" style={{ position: 'absolute', opacity: 0.14 }}>
        <defs>
          <pattern id="vecGrid" width="36" height="36" patternUnits="userSpaceOnUse">
            <path d="M 36 0 L 0 0 0 36" fill="none" stroke="#f5efe6" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#vecGrid)" />
      </svg>

      {/* Badge Atas */}
      <div
        style={{
          position: 'absolute',
          top: 16,
          left: 18,
          background: gold,
          color: '#1e1b18',
          padding: '5px 14px',
          borderRadius: 99,
          fontWeight: 900,
          fontSize: 18,
          letterSpacing: 1,
          border: '2px solid #1e1b18',
        }}
      >
        {heroStat || 'INSIGHT'}
      </div>

      {heroLabel && (
        <div
          style={{
            position: 'absolute',
            top: 20,
            right: 20,
            color: '#f5efe6',
            opacity: 0.85,
            fontWeight: 700,
            fontSize: 16,
            letterSpacing: 0.8,
          }}
        >
          {heroLabel}
        </div>
      )}

      {/* Vektor Utama Berdasarkan Tipe */}
      <div style={{ transform: `translateY(${floatY}px) scale(${pulse})`, marginTop: 22 }}>
        {type === 'flow' && (
          <svg width="460" height="220" viewBox="0 0 460 220">
            {/* Jalur Koneksi Animasi */}
            <path
              d="M 110 130 Q 230 40 350 130"
              fill="none"
              stroke={accent}
              strokeWidth="5"
              strokeDasharray="12 10"
              strokeDashoffset={dashOffset}
            />
            <path
              d="M 110 145 Q 230 210 350 145"
              fill="none"
              stroke={gold}
              strokeWidth="4"
              strokeDasharray="10 8"
              strokeDashoffset={-dashOffset}
            />
            {/* Rumah Kiri */}
            <g transform="translate(50, 75)">
              <polygon points="55,0 110,45 0,45" fill={gold} stroke="#1e1b18" strokeWidth="4" />
              <rect x="14" y="45" width="82" height="65" rx="8" fill="#ffffff" stroke="#1e1b18" strokeWidth="4" />
              <rect x="42" y="68" width="26" height="42" rx="4" fill={accent} />
            </g>
            {/* Node Hati/Harmoni di Tengah */}
            <circle cx="230" cy="118" r="32" fill={success} stroke="#1e1b18" strokeWidth="4" />
            <path
              d="M230 132 L217 119 A8 8 0 0 1 230 108 A8 8 0 0 1 243 119 Z"
              fill="#ffffff"
            />
            {/* Rumah Kanan */}
            <g transform="translate(300, 75)">
              <polygon points="55,0 110,45 0,45" fill={success} stroke="#1e1b18" strokeWidth="4" />
              <rect x="14" y="45" width="82" height="65" rx="8" fill="#ffffff" stroke="#1e1b18" strokeWidth="4" />
              <rect x="42" y="68" width="26" height="42" rx="4" fill={gold} />
            </g>
          </svg>
        )}

        {type === 'shield' && (
          <svg width="420" height="220" viewBox="0 0 420 220">
            <circle
              cx="210"
              cy="110"
              r="88"
              fill="none"
              stroke={accent}
              strokeWidth="3"
              strokeDasharray="14 10"
              transform={`rotate(${spin} 210 110)`}
            />
            <path
              d="M210 26 L282 56 V112 C282 158 250 188 210 202 C170 188 138 158 138 112 V56 Z"
              fill={success}
              stroke="#1e1b18"
              strokeWidth="5"
            />
            <path
              d="M180 112 L202 134 L244 88"
              fill="none"
              stroke="#ffffff"
              strokeWidth="12"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}

        {type === 'gear' && (
          <svg width="440" height="220" viewBox="0 0 440 220">
            <g transform={`translate(155, 110) rotate(${spin})`}>
              <circle r="48" fill={gold} stroke="#1e1b18" strokeWidth="5" />
              <circle r="18" fill="#1e1b18" />
              {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                <rect
                  key={deg}
                  x="-9"
                  y="-64"
                  width="18"
                  height="22"
                  rx="4"
                  fill={gold}
                  stroke="#1e1b18"
                  strokeWidth="3"
                  transform={`rotate(${deg})`}
                />
              ))}
            </g>
            <g transform={`translate(285, 110) rotate(${-spin})`}>
              <circle r="48" fill={accent} stroke="#1e1b18" strokeWidth="5" />
              <circle r="18" fill="#1e1b18" />
              {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                <rect
                  key={deg}
                  x="-9"
                  y="-64"
                  width="18"
                  height="22"
                  rx="4"
                  fill={accent}
                  stroke="#1e1b18"
                  strokeWidth="3"
                  transform={`rotate(${deg})`}
                />
              ))}
            </g>
          </svg>
        )}

        {type === 'chart' && (
          <svg width="440" height="220" viewBox="0 0 440 220">
            <line x1="60" y1="185" x2="380" y2="185" stroke="#f5efe6" strokeWidth="4" strokeLinecap="round" />
            {[
              { x: 95, h: 75, c: accent },
              { x: 165, h: 110, c: gold },
              { x: 235, h: 135, c: success },
              { x: 305, h: 160, c: danger },
            ].map((bar, i) => {
              const grow = spring({ frame: Math.max(0, frame - i * 4), fps, config: { damping: 12 } });
              const curH = bar.h * grow;
              return (
                <rect
                  key={i}
                  x={bar.x}
                  y={185 - curH}
                  width="46"
                  height={curH}
                  rx="8"
                  fill={bar.c}
                  stroke="#1e1b18"
                  strokeWidth="4"
                />
              );
            })}
          </svg>
        )}

        {(type === 'bulb' || !['flow', 'shield', 'gear', 'chart'].includes(type)) && (
          <svg width="420" height="220" viewBox="0 0 420 220">
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
              <line
                key={deg}
                x1="210"
                y1="105"
                x2="210"
                y2="18"
                stroke={gold}
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="10 14"
                strokeDashoffset={dashOffset}
                transform={`rotate(${deg} 210 105)`}
              />
            ))}
            <circle cx="210" cy="105" r="56" fill={gold} stroke="#1e1b18" strokeWidth="5" />
            <rect x="186" y="152" width="48" height="26" rx="8" fill="#ffffff" stroke="#1e1b18" strokeWidth="4" />
            <path d="M196 105 L208 118 L228 92" fill="none" stroke="#1e1b18" strokeWidth="7" strokeLinecap="round" />
          </svg>
        )}
      </div>
    </div>
  );
};

// Komponen Kinetic Subtitle Cepat Per Frasa (3-4 kata per tampil, pop-up responsif)
const KineticPhraseCaption: React.FC<{
  body: string;
  sceneFrame: number;
  sceneDurationFrames: number;
  fps: number;
  accentColor: string;
  goldColor: string;
}> = ({ body, sceneFrame, sceneDurationFrames, fps, accentColor, goldColor }) => {
  const words = (body || '').trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return null;

  // Bagi teks menjadi frasa 3 kata agar terbaca cepat & tidak menumpuk
  const CHUNK_SIZE = 3;
  const chunks: string[][] = [];
  for (let i = 0; i < words.length; i += CHUNK_SIZE) {
    chunks.push(words.slice(i, i + CHUNK_SIZE));
  }

  // Beri sedikit buffer 6% di akhir scene agar tidak telat saat pindah scene
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
        minHeight: 118,
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
              transition: 'all 0.08s ease-out',
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

  // Hitung durasi tiap scene secara proporsional dari jumlah kata & tanda baca
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

  return (
    <AbsoluteFill
      style={{
        backgroundColor: bgColor,
        fontFamily: "'Inter', 'Montserrat', system-ui, sans-serif",
        color: '#1e1b18',
        padding: '48px 44px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      {/* Audio Narasi */}
      {audioSrc ? <Audio src={staticFile(audioSrc)} /> : null}

      {/* Pola Grid Kertas Edukatif */}
      <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <defs>
          <pattern id="paperGrid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke={gridColor} strokeWidth="1.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#paperGrid)" />
      </svg>

      {/* Progress Bar Atas */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 10,
          backgroundColor: 'rgba(30,27,24,0.12)',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${(frame / Math.max(1, durationInFrames)) * 100}%`,
            backgroundColor: dangerColor,
          }}
        />
      </div>

      {/* HEADER: Tag Kategori + Watermark + Judul */}
      <div
        style={{
          zIndex: 2,
          transform: `translateY(${interpolate(headerSpring, [0, 1], [-24, 0])}px)`,
          opacity: headerSpring,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
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
            fontSize: 54,
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

      {/* PANGGUNG VISUAL TENGAH: Ilustrasi Vektor Animasi (Selalu Penuh & Dinamis) */}
      <div style={{ zIndex: 2, height: 340, width: '100%', my: 10 }}>
        <VectorIllustrationStage
          type={scene.visualType || 'flow'}
          frame={sceneFrame}
          fps={fps}
          accent={accentColor}
          gold={goldColor}
          danger={dangerColor}
          success={successColor}
          heroStat={scene.heroStat}
          heroLabel={scene.heroLabel}
        />
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
                    padding: '20px 18px',
                    transform: `scale(${interpolate(pop, [0, 1], [0.92, 1])})`,
                  }}
                >
                  <div
                    style={{
                      display: 'inline-block',
                      backgroundColor: colColor,
                      color: '#ffffff',
                      fontSize: 16,
                      fontWeight: 800,
                      padding: '4px 12px',
                      borderRadius: 8,
                      marginBottom: 8,
                    }}
                  >
                    {col.badge}
                  </div>
                  <div style={{ fontSize: 28, fontWeight: 900, marginBottom: 12, color: '#1e1b18' }}>
                    {col.title}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {(col.items || []).map((it, i) => (
                      <div
                        key={i}
                        style={{
                          fontSize: 22,
                          fontWeight: 700,
                          padding: '8px 12px',
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
              padding: '22px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}
          >
            {points.map((pt, idx) => {
              const barProgress = spring({ frame: Math.max(0, sceneFrame - idx * 5), fps, config: { damping: 15 } });
              const targetVal = pt.value ?? 85;
              const fillColor = toneBadgeColor(pt.tone);
              return (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 23, fontWeight: 800, marginBottom: 6 }}>
                    <span>{pt.text}</span>
                    <span style={{ color: fillColor }}>{Math.round(targetVal * barProgress)}%</span>
                  </div>
                  <div style={{ height: 18, backgroundColor: bgColor, borderRadius: 99, overflow: 'hidden', border: '2px solid #1e1b18' }}>
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {points.map((pt, idx) => {
              const isActive = idx === activePointIdx;
              const badgeBg = toneBadgeColor(pt.tone);
              const pop = spring({ frame: Math.max(0, sceneFrame - idx * 4), fps, config: { damping: 14 } });
              return (
                <div
                  key={idx}
                  style={{
                    backgroundColor: isActive ? cardBg : 'rgba(255,255,255,0.68)',
                    border: isActive ? '3px solid #1e1b18' : '2px solid rgba(30,27,24,0.25)',
                    boxShadow: isActive ? '0 7px 0 #1e1b18' : 'none',
                    borderRadius: 18,
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    transform: `scale(${isActive ? 1.02 : 0.98}) translateX(${interpolate(pop, [0, 1], [-18, 0])}px)`,
                  }}
                >
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 99,
                      backgroundColor: badgeBg,
                      color: '#ffffff',
                      fontWeight: 900,
                      fontSize: 20,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      border: '2px solid #1e1b18',
                    }}
                  >
                    {scene.overlayType === 'checklist' ? '✓' : idx + 1}
                  </div>
                  <div style={{ fontSize: 25, fontWeight: 800, color: '#1e1b18', lineHeight: 1.25 }}>
                    {pt.text}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* KINETIC CAPTION BAWAH: Pop-Up Per 3 Kata Cepat & Responsif */}
      <div style={{ zIndex: 2, width: '100%' }}>
        <KineticPhraseCaption
          body={scene.body}
          sceneFrame={sceneFrame}
          sceneDurationFrames={sceneDuration}
          fps={fps}
          accentColor={accentColor}
          goldColor={goldColor}
        />
      </div>
    </AbsoluteFill>
  );
};

export default DynamicMotionVideo;
