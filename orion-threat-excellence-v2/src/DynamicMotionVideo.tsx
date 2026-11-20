import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export interface PointItem {
  text: string;
  tone?: "neutral" | "gold" | "danger" | "success";
  value?: number;
}

export interface CompareColumn {
  title: string;
  badge?: string;
  tone?: "neutral" | "gold" | "danger" | "success";
  items: string[];
}

export interface SceneItem {
  tag?: string;
  heading: string;
  headingTone?: "gold" | "danger" | "success" | "neutral";
  heroStat?: string;
  heroLabel?: string;
  body: string;
  overlayType?: "pills" | "bars" | "compare" | "checklist";
  points?: PointItem[];
  compareLeft?: CompareColumn;
  compareRight?: CompareColumn;
  visualType?: string;
  media?: string;
  mediaType?: "image" | "video";
  motion?: "zoom-in" | "zoom-out";
}

export interface DynamicMotionProps {
  title?: string;
  subtitle?: string;
  visualStyle?: string;
  styleConfig?: {
    bgColor?: string;
    gridColor?: string;
    cardBg?: string;
    accentColor?: string;
    goldColor?: string;
    dangerColor?: string;
    successColor?: string;
    watermark?: string;
  };
  scenes: SceneItem[];
  audioSrc?: string;
  bgmSrc?: string;
  whooshSrc?: string;
}

const ZOOM_STEPS = [
  "×1 ZOOM",
  "×3 ZOOM",
  "×5 ZOOM",
  "×7 ZOOM",
  "×8 ZOOM",
  "×9 ZOOM",
  "×9 ZOOM",
  "×9 ZOOM",
];

const resolveMediaSrc = (src?: string) => {
  if (!src) return "";
  if (src.startsWith("http") || src.startsWith("data:")) return src;
  return staticFile(src);
};

const CadBlueprintBackground: React.FC<{
  bgColor: string;
  gridColor: string;
  frame: number;
}> = ({ bgColor, gridColor, frame }) => {
  const drift = (frame * 0.25) % 60;
  return (
    <AbsoluteFill
      style={{
        backgroundColor: bgColor,
        backgroundImage: `
          linear-gradient(to right, ${gridColor} 1px, transparent 1px),
          linear-gradient(to bottom, ${gridColor} 1px, transparent 1px),
          linear-gradient(to right, rgba(56, 189, 248, 0.05) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(56, 189, 248, 0.05) 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px, 60px 60px, 300px 300px, 300px 300px",
        backgroundPosition: `${drift}px ${drift}px`,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 50% 42%, rgba(250, 204, 21, 0.06) 0%, rgba(10, 8, 6, 0.78) 85%)",
        }}
      />
    </AbsoluteFill>
  );
};

const CadVectorSchematic: React.FC<{
  type?: string;
  cyan: string;
  orange: string;
  gold: string;
  localFrame: number;
  compact?: boolean;
}> = ({ type = "gear", cyan, orange, gold, localFrame, compact = false }) => {
  const rotate = localFrame * 0.6;
  const pulse = 1 + Math.sin(localFrame * 0.12) * 0.04;
  const drawProgress = interpolate(localFrame, [0, 24], [0, 1], {
    extrapolateRight: "clamp",
  });
  const scaleFactor = compact ? 0.68 : 1;

  return (
    <svg
      width={compact ? "340" : "460"}
      height={compact ? "210" : "320"}
      viewBox="0 0 460 320"
      style={{ overflow: "visible", transform: `scale(${scaleFactor})` }}
    >
      <path
        d="M 24 60 L 24 24 L 60 24 M 400 24 L 436 24 L 436 60 M 436 260 L 436 296 L 400 296 M 60 296 L 24 296 L 24 260"
        fill="none"
        stroke={cyan}
        strokeWidth="2.5"
        opacity="0.7"
      />
      <line
        x1="230"
        y1="15"
        x2="230"
        y2="305"
        stroke="rgba(255,255,255,0.12)"
        strokeDasharray="6 6"
      />
      <line
        x1="20"
        y1="160"
        x2="440"
        y2="160"
        stroke="rgba(255,255,255,0.12)"
        strokeDasharray="6 6"
      />

      <g transform={`translate(230, 160) scale(${pulse})`}>
        <circle
          r="96"
          fill="rgba(56, 189, 248, 0.06)"
          stroke={cyan}
          strokeWidth="2.5"
          strokeDasharray="14 8"
          transform={`rotate(${rotate})`}
        />
        <circle
          r="66"
          fill="rgba(249, 115, 22, 0.12)"
          stroke={orange}
          strokeWidth="3.5"
          transform={`rotate(${-rotate * 1.4})`}
        />
        <circle r="30" fill="#14110e" stroke={gold} strokeWidth="3" />
        {type === "flow" || type === "chart" ? (
          <path
            d="M -140 0 L -66 0 M 66 0 L 140 0 M 0 -115 L 0 -66"
            stroke={cyan}
            strokeWidth="4"
            strokeLinecap="round"
            opacity={drawProgress}
          />
        ) : null}
      </g>

      <g opacity={drawProgress}>
        <circle cx="282" cy="116" r="7" fill={orange} />
        <circle cx="282" cy="116" r="14" fill="none" stroke={orange} strokeWidth="2" />
        <polyline
          points="282,116 332,68 422,68"
          fill="none"
          stroke={cyan}
          strokeWidth="2.5"
        />
        <text
          x="336"
          y="58"
          fill={cyan}
          fontFamily="monospace"
          fontSize="15"
          fontWeight="bold"
        >
          TOL: 0.05 MM
        </text>
      </g>
    </svg>
  );
};

export const DynamicMotionVideo: React.FC<DynamicMotionProps> = ({
  styleConfig,
  scenes = [],
  audioSrc,
  bgmSrc,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const bgColor = styleConfig?.bgColor || "#14110e";
  const gridColor = styleConfig?.gridColor || "#26201a";
  const cyan = styleConfig?.accentColor || "#38bdf8";
  const gold = styleConfig?.goldColor || "#facc15";
  const danger = styleConfig?.dangerColor || "#f97316";
  const success = styleConfig?.successColor || "#22c55e";
  const watermark = styleConfig?.watermark || "orionmotion";

  const safeScenes = scenes.length > 0 ? scenes : [];

  // Bobot durasi berbasis kata + jeda tanda baca (. ! ? ,) agar sinkron dengan ritme ElevenLabs
  const getSpeechWeight = (text: string) => {
    const clean = text.trim();
    const wordWeight = clean.split(/\s+/).filter(Boolean).length * 1.0;
    const sentencePauses = (clean.match(/[.!?]+/g) || []).length * 1.65;
    const commaPauses = (clean.match(/[,;:]+/g) || []).length * 0.75;
    return Math.max(4, wordWeight + sentencePauses + commaPauses);
  };

  // Jendela bicara aktif 94.5% dari total durasi (sisanya jeda penutup alami)
  const activeSpeechFrames = Math.round(durationInFrames * 0.945);
  const totalWeight = safeScenes.reduce((acc, s) => acc + getSpeechWeight(s.body), 0);

  let accumulatedFrames = 0;
  const sceneTimings = safeScenes.map((sc, idx) => {
    const weight = getSpeechWeight(sc.body);
    const ratio = totalWeight > 0 ? weight / totalWeight : 1 / safeScenes.length;
    const isLast = idx === safeScenes.length - 1;
    const speechLen = isLast
      ? Math.max(30, activeSpeechFrames - accumulatedFrames)
      : Math.max(45, Math.round(ratio * activeSpeechFrames));
    const totalLen = isLast ? durationInFrames - accumulatedFrames : speechLen;
    const start = accumulatedFrames;
    accumulatedFrames += totalLen;
    return { start, duration: totalLen, speechDuration: speechLen };
  });

  const activeIndex = Math.max(
    0,
    sceneTimings.findIndex((t, i) =>
      i === sceneTimings.length - 1
        ? frame >= t.start
        : frame >= t.start && frame < t.start + t.duration
    )
  );

  const scene = safeScenes[activeIndex];
  const timing = sceneTimings[activeIndex] || {
    start: 0,
    duration: durationInFrames,
    speechDuration: activeSpeechFrames,
  };
  const localFrame = Math.max(0, frame - timing.start);

  if (!scene) return <AbsoluteFill style={{ backgroundColor: bgColor }} />;

  const enterSpring = spring({
    frame: localFrame,
    fps,
    config: { damping: 16, stiffness: 120 },
  });

  const baseZoom = interpolate(
    activeIndex,
    [0, Math.max(1, safeScenes.length - 1)],
    [1.0, 1.14]
  );
  const sceneMicroZoom = interpolate(
    localFrame,
    [0, timing.duration],
    [baseZoom, baseZoom + 0.06],
    {
      extrapolateRight: "clamp",
    }
  );

  const toneColor = (tone?: string) => {
    if (tone === "danger") return danger;
    if (tone === "success") return success;
    if (tone === "gold") return gold;
    return cyan;
  };

  // Sinkronisasi Karaoke Berbobot Tanda Baca & Panjang Kata
  const words = scene.body.split(/\s+/).filter(Boolean);
  const wordWeights = words.map((w) => {
    let wt = 1 + Math.min(0.6, w.length * 0.04);
    if (/[.!?]$/.test(w)) wt += 1.5;
    else if (/[,;:]$/.test(w)) wt += 0.7;
    return wt;
  });
  const totalWordWeight = wordWeights.reduce((a, b) => a + b, 0);
  const speechProgress = Math.min(
    1,
    localFrame / Math.max(1, timing.speechDuration)
  );
  const targetWeight = speechProgress * totalWordWeight;

  let accW = 0;
  let currentWordIndex = words.length - 1;
  for (let i = 0; i < wordWeights.length; i++) {
    accW += wordWeights[i];
    if (targetWeight <= accW) {
      currentWordIndex = i;
      break;
    }
  }

  const chunkStart = Math.floor(currentWordIndex / 7) * 7;
  const visibleWords = words.slice(chunkStart, chunkStart + 7);

  const zoomBadge =
    scene.tag?.match(/×\d+\s*ZOOM/i)?.[0]?.toUpperCase() ||
    ZOOM_STEPS[Math.min(activeIndex, ZOOM_STEPS.length - 1)];

  const breadcrumbText = (scene.tag || `BAB 0${activeIndex + 1}`)
    .replace(/•\s*×\d+\s*ZOOM/i, "")
    .trim();

  const isCompare = scene.overlayType === "compare";

  return (
    <AbsoluteFill
      style={{ fontFamily: "Inter, system-ui, sans-serif", color: "#f8fafc" }}
    >
      <CadBlueprintBackground
        bgColor={bgColor}
        gridColor={gridColor}
        frame={frame}
      />

      {audioSrc ? <Audio src={resolveMediaSrc(audioSrc)} /> : null}
      {bgmSrc ? <Audio src={resolveMediaSrc(bgmSrc)} volume={0.14} /> : null}

      {/* HUD KIRI ATAS */}
      <div
        style={{
          position: "absolute",
          top: 56,
          left: 48,
          right: 48,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          zIndex: 20,
        }}
      >
        <div
          style={{
            borderLeft: `4px solid ${cyan}`,
            paddingLeft: 16,
            background: "rgba(20, 17, 14, 0.75)",
            paddingTop: 6,
            paddingBottom: 6,
            paddingRight: 16,
            borderRadius: "0 10px 10px 0",
          }}
        >
          <div
            style={{
              fontFamily: "monospace",
              fontSize: 20,
              letterSpacing: 1.5,
              color: "#cbd5e1",
              fontWeight: 700,
            }}
          >
            {breadcrumbText}
          </div>
          <div
            style={{
              fontFamily: "monospace",
              fontSize: 34,
              fontWeight: 900,
              color: cyan,
              marginTop: 2,
              letterSpacing: 1,
            }}
          >
            {zoomBadge}
          </div>
        </div>

        <div
          style={{
            fontFamily: "monospace",
            fontSize: 18,
            color: "rgba(248,250,252,0.5)",
            background: "rgba(255,255,255,0.06)",
            padding: "8px 14px",
            borderRadius: 8,
            border: "1px solid rgba(255,255,255,0.12)",
          }}
        >
          @{watermark}
        </div>
      </div>

      {/* KONTEN UTAMA TENGAH */}
      <div
        style={{
          position: "absolute",
          top: 195,
          left: 48,
          right: 48,
          bottom: 290,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          transform: `translateY(${interpolate(enterSpring, [0, 1], [28, 0])}px)`,
          opacity: enterSpring,
        }}
      >
        {/* Judul Bab Teknis & Hero Stat */}
        <div>
          <div
            style={{
              display: "inline-block",
              fontFamily: "monospace",
              fontSize: 22,
              fontWeight: 800,
              color: toneColor(scene.headingTone),
              letterSpacing: 2,
              marginBottom: 8,
            }}
          >
            {scene.heroStat
              ? `[ ${scene.heroStat} • ${scene.heroLabel || ""} ]`
              : "INSPEKSI TEKNIS"}
          </div>
          <h1
            style={{
              margin: 0,
              fontSize: 54,
              lineHeight: 1.12,
              fontWeight: 900,
              color: "#ffffff",
              textTransform: "uppercase",
              letterSpacing: -0.5,
            }}
          >
            {scene.heading}
          </h1>
        </div>

        {/* AREA VISUAL TENGAH: Tetap tampil di semua mode (termasuk mode compare agar tidak kosong) */}
        <div
          style={{
            position: "relative",
            height: isCompare ? 235 : 430,
            borderRadius: 22,
            overflow: "hidden",
            border: `2px solid rgba(56, 189, 248, 0.45)`,
            backgroundColor: "#0d0b09",
            boxShadow: "0 24px 60px rgba(0,0,0,0.65)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {scene.media && !isCompare ? (
            <>
              <Img
                src={resolveMediaSrc(scene.media)}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transform: `scale(${sceneMicroZoom})`,
                  filter: "contrast(1.08) brightness(0.86)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(180deg, rgba(20,17,14,0.2) 0%, rgba(20,17,14,0.72) 100%)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: 18,
                  left: 18,
                  background: "rgba(14, 18, 26, 0.85)",
                  border: `1.5px solid ${cyan}`,
                  color: cyan,
                  fontFamily: "monospace",
                  fontSize: 18,
                  fontWeight: 800,
                  padding: "6px 14px",
                  borderRadius: 8,
                }}
              >
                ● CAD VIEW // {scene.heroStat || "ACTIVE"}
              </div>
            </>
          ) : (
            <CadVectorSchematic
              type={scene.visualType}
              cyan={cyan}
              orange={danger}
              gold={gold}
              localFrame={localFrame}
              compact={isCompare}
            />
          )}
        </div>

        {/* OVERLAY DATA: KANVAS DIAGRAM PUTIH atau SPOTLIGHT CARDS */}
        {isCompare && scene.compareLeft && scene.compareRight ? (
          <div
            style={{
              backgroundColor: "#ffffff",
              color: "#0f172a",
              borderRadius: 26,
              padding: 28,
              boxShadow: "0 25px 60px rgba(0,0,0,0.65)",
              border: `3px solid ${cyan}`,
            }}
          >
            <div
              style={{
                fontFamily: "monospace",
                fontSize: 19,
                fontWeight: 800,
                color: "#475569",
                marginBottom: 14,
                letterSpacing: 1,
              }}
            >
              DIAGRAM PERBANDINGAN KOMPONEN
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              {[scene.compareLeft, scene.compareRight].map((col, cIdx) => {
                const colColor = toneColor(col.tone);
                const colDelay = cIdx * 18;
                const colOpacity = interpolate(
                  localFrame,
                  [colDelay, colDelay + 15],
                  [0.25, 1],
                  {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  }
                );
                return (
                  <div
                    key={cIdx}
                    style={{
                      backgroundColor: "#f8fafc",
                      borderRadius: 18,
                      padding: 20,
                      borderTop: `8px solid ${colColor}`,
                      borderLeft: "1px solid #e2e8f0",
                      borderRight: "1px solid #e2e8f0",
                      borderBottom: "1px solid #e2e8f0",
                      opacity: colOpacity,
                    }}
                  >
                    {col.badge ? (
                      <span
                        style={{
                          display: "inline-block",
                          backgroundColor: colColor,
                          color: "#ffffff",
                          fontFamily: "monospace",
                          fontSize: 16,
                          fontWeight: 900,
                          padding: "4px 12px",
                          borderRadius: 6,
                          marginBottom: 8,
                        }}
                      >
                        {col.badge}
                      </span>
                    ) : null}
                    <div
                      style={{
                        fontSize: 26,
                        fontWeight: 900,
                        color: "#0f172a",
                        marginBottom: 12,
                      }}
                    >
                      {col.title}
                    </div>
                    {col.items.map((item, iIdx) => (
                      <div
                        key={iIdx}
                        style={{
                          fontSize: 21,
                          lineHeight: 1.32,
                          color: "#334155",
                          fontWeight: 600,
                          marginBottom: 8,
                          paddingLeft: 12,
                          borderLeft: `3px solid ${colColor}`,
                        }}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        ) : scene.overlayType === "bars" && scene.points ? (
          <div
            style={{
              backgroundColor: "#ffffff",
              color: "#0f172a",
              borderRadius: 24,
              padding: 30,
              boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
            }}
          >
            <div
              style={{
                fontFamily: "monospace",
                fontSize: 19,
                fontWeight: 800,
                color: "#64748b",
                marginBottom: 16,
              }}
            >
              GRAFIK TEKANAN HIDROLIK (PSI / BAR)
            </div>
            {scene.points.map((pt, idx) => {
              const barColor = toneColor(pt.tone);
              const targetVal = pt.value ?? 75;
              const animatedWidth = interpolate(
                localFrame,
                [idx * 14, idx * 14 + 24],
                [0, targetVal],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
              );
              return (
                <div
                  key={idx}
                  style={{
                    marginBottom: idx === scene.points!.length - 1 ? 0 : 20,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 24,
                      fontWeight: 800,
                      marginBottom: 8,
                    }}
                  >
                    <span>{pt.text}</span>
                    <span style={{ fontFamily: "monospace", color: barColor }}>
                      {Math.round(animatedWidth)}%
                    </span>
                  </div>
                  <div
                    style={{
                      height: 22,
                      backgroundColor: "#e2e8f0",
                      borderRadius: 999,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${animatedWidth}%`,
                        height: "100%",
                        backgroundColor: barColor,
                        borderRadius: 999,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : scene.points ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {scene.points.map((pt, idx) => {
              const pColor = toneColor(pt.tone);
              const stepSpan =
                timing.speechDuration / Math.max(1, scene.points!.length);
              const isSpotlight =
                localFrame >= idx * stepSpan &&
                localFrame < (idx + 1) * stepSpan + 10;

              return (
                <div
                  key={idx}
                  style={{
                    backgroundColor: isSpotlight
                      ? "#ffffff"
                      : "rgba(255, 255, 255, 0.12)",
                    color: isSpotlight ? "#0f172a" : "#cbd5e1",
                    borderRadius: 18,
                    padding: "20px 26px",
                    borderLeft: `10px solid ${pColor}`,
                    display: "flex",
                    alignItems: "center",
                    gap: 18,
                    transform: isSpotlight ? "scale(1.02)" : "scale(0.99)",
                    boxShadow: isSpotlight
                      ? "0 14px 34px rgba(0,0,0,0.45)"
                      : "none",
                  }}
                >
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: "50%",
                      backgroundColor: pColor,
                      color: "#ffffff",
                      fontFamily: "monospace",
                      fontWeight: 900,
                      fontSize: 20,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {scene.overlayType === "checklist" ? "✓" : idx + 1}
                  </div>
                  <div style={{ fontSize: 26, fontWeight: 800, lineHeight: 1.3 }}>
                    {pt.text}
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>

      {/* SUBTITLE KARAOKE BAWAH (Spasi Flex Renggang + Sorotan Cyan #38bdf8) */}
      <div
        style={{
          position: "absolute",
          bottom: 84,
          left: 48,
          right: 48,
          backgroundColor: "rgba(12, 10, 8, 0.88)",
          border: "1px solid rgba(56, 189, 248, 0.28)",
          borderRadius: 22,
          padding: "24px 30px",
          textAlign: "center",
          boxShadow: "0 16px 40px rgba(0,0,0,0.7)",
        }}
      >
        <div
          style={{
            fontSize: 38,
            fontWeight: 900,
            lineHeight: 1.38,
            letterSpacing: 0.2,
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            columnGap: 14,
            rowGap: 6,
          }}
        >
          {visibleWords.map((word, wIdx) => {
            const globalWordIdx = chunkStart + wIdx;
            const isActive = globalWordIdx === currentWordIndex;
            const isSpoken = globalWordIdx < currentWordIndex;
            return (
              <span
                key={globalWordIdx}
                style={{
                  color: isActive
                    ? cyan
                    : isSpoken
                    ? "#ffffff"
                    : "rgba(255,255,255,0.52)",
                  textShadow: isActive
                    ? "0 0 18px rgba(56, 189, 248, 0.75)"
                    : "none",
                  transform: isActive ? "scale(1.06)" : "scale(1)",
                }}
              >
                {word}
              </span>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
