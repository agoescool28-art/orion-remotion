import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  OffthreadVideo,
  staticFile,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  getInputProps,
} from "remotion";

export interface OverlayPoint {
  text: string;
  value?: string;
  percent?: number;
  tone?: "gold" | "green" | "red" | "neutral";
}

export interface SceneItem {
  tag?: string;
  heading: string;
  headingTone?: "gold" | "red" | "green";
  body: string;
  durationSeconds?: number;
  overlayType?: "pills" | "bars" | "checklist";
  points?: OverlayPoint[];
  pointerLabel?: string;
  visualType?: "gear" | "chart" | "shield" | "flow";
  media?: string;
  mediaType?: "image" | "video";
  mediaFocus?: string;
  motion?: "zoom-in" | "zoom-out" | "pan-right" | "none";
}

export interface StyleConfig {
  bgColor?: string;
  accentColor?: string;
  dangerColor?: string;
  successColor?: string;
  textColor?: string;
  watermark?: string;
  springDamping?: number;
}

export interface DynamicVideoProps {
  title?: string;
  subtitle?: string;
  insight?: string;
  accentColor?: string;
  bgColor?: string;
  audioSrc?: string;
  audioFile?: string;
  durationInFrames?: number;
  styleConfig?: StyleConfig;
  scenes?: SceneItem[];
}

const resolveMediaPath = (src: string) => {
  if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("data:")) {
    return src;
  }
  const cleanPath = src.replace(/^\/+/, "").replace(/^public\//, "");
  return staticFile(cleanPath);
};

const TONE_COLORS = {
  gold: "#facc15",
  green: "#22c55e",
  red: "#ef4444",
  neutral: "#e2e8f0",
};

const DynamicVectorIcon: React.FC<{
  type: "gear" | "chart" | "shield" | "flow";
  color: string;
  frame: number;
}> = ({ type, color, frame }) => {
  const pulse = Math.sin(frame * 0.08) * 6;
  const spin = (frame * 1.5) % 360;

  if (type === "gear") {
    return (
      <svg width="250" height="250" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="88" fill={color} fillOpacity="0.12" />
        <g transform={`rotate(${spin} 100 100)`}>
          <circle
            cx="100"
            cy="100"
            r="48"
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeDasharray="18 12"
          />
          <circle cx="100" cy="100" r="24" fill="none" stroke="#ffffff" strokeWidth="6" />
        </g>
        <path d="M36 156 L164 130" stroke={color} strokeWidth="8" strokeLinecap="round" />
        <circle cx={75 + pulse * 1.5} cy={135 - pulse * 0.3} r="14" fill="#ffffff" />
      </svg>
    );
  }

  if (type === "chart") {
    const h1 = 50 + Math.sin(frame * 0.06) * 15;
    const h2 = 85 + Math.cos(frame * 0.06) * 15;
    const h3 = 115 + Math.sin(frame * 0.08) * 10;
    return (
      <svg width="250" height="250" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="88" fill={color} fillOpacity="0.12" />
        <rect x="45" y={150 - h1} width="26" height={h1} rx="6" fill="#64748b" />
        <rect x="87" y={150 - h2} width="26" height={h2} rx="6" fill={color} />
        <rect x="129" y={150 - h3} width="26" height={h3} rx="6" fill="#ffffff" />
        <line x1="35" y1="152" x2="165" y2="152" stroke="#94a3b8" strokeWidth="4" />
      </svg>
    );
  }

  if (type === "shield") {
    return (
      <svg width="250" height="250" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="88" fill={color} fillOpacity="0.12" />
        <path
          d="M100 35 L152 56 V102 C152 136 128 160 100 170 C72 160 48 136 48 102 V56 Z"
          fill="none"
          stroke={color}
          strokeWidth="9"
        />
        <path
          d="M76 102 L93 119 L126 84"
          fill="none"
          stroke="#ffffff"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg width="250" height="250" viewBox="0 0 200 200">
      <circle cx="100" cy="100" r="88" fill={color} fillOpacity="0.12" />
      <circle cx="52" cy="100" r="18" fill={color} />
      <circle cx="100" cy="62" r="18" fill="#ffffff" />
      <circle cx="148" cy="100" r="18" fill={color} />
      <circle cx="100" cy="138" r="18" fill="#ffffff" />
      <path
        d="M68 88 L85 73 M115 73 L132 88 M132 112 L115 127 M85 127 L68 112"
        stroke={color}
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  );
};

// Subtitle Dinamis dengan Bobot Suku Kata & Jeda Tanda Baca agar Sinkron dengan Ucapan VO
const DynamicKineticSubtitle: React.FC<{
  text: string;
  localFrame: number;
  sceneDurationFrames: number;
  highlightColor: string;
}> = ({ text, localFrame, sceneDurationFrames, highlightColor }) => {
  const words = text.trim().split(/\s+/);
  if (words.length === 0) return null;

  // Hitung bobot waktu tiap kata berdasarkan panjang karakter + jeda tanda baca
  const weights = words.map((w) => {
    let weight = Math.max(3, w.length);
    if (w.endsWith(",")) weight += 4;
    if (w.endsWith(".") || w.endsWith("?") || w.endsWith("!")) weight += 7;
    return weight;
  });

  const totalWeight = weights.reduce((acc, w) => acc + w, 0);
  // Sisakan sedikit buffer 6% di akhir adegan untuk jeda napas antar paragraf
  const effectiveDuration = sceneDurationFrames * 0.94;
  const clampedFrame = Math.min(effectiveDuration - 0.1, Math.max(0, localFrame));
  const targetWeight = (clampedFrame / effectiveDuration) * totalWeight;

  let cumulative = 0;
  let activeWordGlobalIndex = words.length - 1;
  for (let i = 0; i < weights.length; i++) {
    cumulative += weights[i];
    if (targetWeight <= cumulative) {
      activeWordGlobalIndex = i;
      break;
    }
  }

  const chunkSize = 5;
  const chunkIndex = Math.floor(activeWordGlobalIndex / chunkSize);
  const startIdx = chunkIndex * chunkSize;
  const visibleWords = words.slice(startIdx, startIdx + chunkSize);

  return (
    <div
      style={{
        minHeight: 110,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        gap: "8px 14px",
        padding: "0 20px",
        textAlign: "center",
      }}
    >
      {visibleWords.map((word, idx) => {
        const globalIdx = startIdx + idx;
        const isActive = globalIdx === activeWordGlobalIndex;
        return (
          <span
            key={globalIdx}
            style={{
              fontSize: 42,
              fontWeight: 900,
              lineHeight: 1.25,
              color: isActive ? highlightColor : "#ffffff",
              transform: isActive ? "scale(1.06)" : "scale(1)",
              textShadow: "0 4px 16px rgba(0,0,0,0.85)",
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};

export const DynamicMotionVideo: React.FC<DynamicVideoProps> = (directProps) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const inputProps = (getInputProps() as DynamicVideoProps) || {};
  const props = { ...directProps, ...inputProps };

  const style = props.styleConfig || {};
  const bg = style.bgColor || props.bgColor || "#061338";
  const accent = style.accentColor || props.accentColor || "#facc15";
  const textColor = style.textColor || "#ffffff";
  const watermark = style.watermark || "orionmotion";
  const damping = style.springDamping ?? 14;

  const mainTitle = props.title || "MOTION GRAPHIC";
  const subTitle = props.subtitle || "Visualisasi Edukasi";

  const scenes: SceneItem[] =
    props.scenes && props.scenes.length > 0
      ? props.scenes
      : [
          {
            tag: "01 • KONSEP",
            heading: mainTitle,
            body: subTitle,
            visualType: "gear",
          },
        ];

  // Kalkulasi timeline presisi per adegan (mendukung durationSeconds atau bobot panjang naskah otomatis)
  const rawWeights = scenes.map((s) =>
    s.durationSeconds && s.durationSeconds > 0
      ? s.durationSeconds
      : Math.max(15, s.body.length)
  );
  const totalRawWeight = rawWeights.reduce((a, b) => a + b, 0);

  const sceneRanges: { start: number; end: number; duration: number }[] = [];
  let cursor = 0;
  for (let i = 0; i < scenes.length; i++) {
    const dur =
      i === scenes.length - 1
        ? Math.max(30, durationInFrames - cursor)
        : Math.max(30, Math.round((rawWeights[i] / totalRawWeight) * durationInFrames));
    sceneRanges.push({ start: cursor, end: cursor + dur, duration: dur });
    cursor += dur;
  }

  let currentSceneIndex = scenes.length - 1;
  for (let i = 0; i < sceneRanges.length; i++) {
    if (frame >= sceneRanges[i].start && frame < sceneRanges[i].end) {
      currentSceneIndex = i;
      break;
    }
  }

  const activeRange = sceneRanges[currentSceneIndex];
  const localFrame = Math.max(0, frame - activeRange.start);
  const sceneDurationFrames = activeRange.duration;
  const activeScene = scenes[currentSceneIndex];

  const headToneColor =
    activeScene.headingTone === "red"
      ? style.dangerColor || "#ef4444"
      : activeScene.headingTone === "green"
      ? style.successColor || "#22c55e"
      : accent;

  const entrance = spring({
    frame: localFrame,
    fps,
    config: { damping, stiffness: 125 },
  });
  const exitFade = interpolate(
    localFrame,
    [sceneDurationFrames - 8, sceneDurationFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Gerak kamera foto (Ken Burns)
  const mediaProgress = Math.min(1, localFrame / sceneDurationFrames);
  let mediaScale = 1.02;
  let mediaTranslateX = 0;
  if (activeScene.motion === "zoom-in") {
    mediaScale = interpolate(mediaProgress, [0, 1], [1.0, 1.13]);
  } else if (activeScene.motion === "zoom-out") {
    mediaScale = interpolate(mediaProgress, [0, 1], [1.13, 1.0]);
  } else if (activeScene.motion === "pan-right") {
    mediaScale = 1.12;
    mediaTranslateX = interpolate(mediaProgress, [0, 1], [-22, 22]);
  }

  const resolvedAudio = props.audioSrc
    ? props.audioSrc
    : props.audioFile
    ? resolveMediaPath(props.audioFile)
    : "";

  const hasMedia = Boolean(activeScene.media);
  const headingWords = activeScene.heading.split(" ");

  return (
    <AbsoluteFill
      style={{
        backgroundColor: bg,
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
        color: textColor,
        padding: "52px 48px",
        justifyContent: "space-between",
        overflow: "hidden",
      }}
    >
      {resolvedAudio ? <Audio src={resolvedAudio} /> : null}

      {/* Vignette Halus */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 50% 45%, rgba(255,255,255,0.04) 0%, rgba(0,0,0,0.45) 100%)",
          zIndex: 0,
        }}
      />

      {/* Top Watermark & Chapter Heading */}
      <div style={{ zIndex: 2, opacity: exitFade }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <span
            style={{
              fontSize: 24,
              fontWeight: 800,
              color: "#ffffff",
              letterSpacing: 0.5,
              opacity: 0.9,
            }}
          >
            {watermark}
          </span>
          {activeScene.tag && (
            <span
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: headToneColor,
                backgroundColor: `${headToneColor}1f`,
                border: `1.5px solid ${headToneColor}88`,
                padding: "6px 16px",
                borderRadius: 999,
              }}
            >
              {activeScene.tag}
            </span>
          )}
        </div>

        {/* Judul Bab Besar 2 Warna */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "8px 16px",
            textAlign: "center",
            transform: `translateY(${interpolate(entrance, [0, 1], [-22, 0])}px)`,
          }}
        >
          {headingWords.map((w, i) => {
            const isHighlighted = i === headingWords.length - 1 && headingWords.length > 1;
            return (
              <span
                key={i}
                style={{
                  fontSize: 62,
                  fontWeight: 900,
                  lineHeight: 1.1,
                  textTransform: "uppercase",
                  color: isHighlighted ? headToneColor : "#ffffff",
                  letterSpacing: -0.5,
                }}
              >
                {w}
              </span>
            );
          })}
        </div>
      </div>

      {/* Center Stage: Foto / Diagram + Interactive Infographic Overlays */}
      <div
        style={{
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          opacity: exitFade,
          transform: `scale(${interpolate(entrance, [0, 1], [0.95, 1])})`,
        }}
      >
        {hasMedia ? (
          <div
            style={{
              position: "relative",
              width: "100%",
              height: activeScene.points && activeScene.points.length > 0 ? 490 : 610,
              borderRadius: 26,
              overflow: "hidden",
              border: `2px solid rgba(255,255,255,0.2)`,
              boxShadow: "0 24px 60px rgba(0,0,0,0.6)",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                transform: `scale(${mediaScale}) translateX(${mediaTranslateX}px)`,
              }}
            >
              {activeScene.mediaType === "video" ? (
                <OffthreadVideo
                  src={resolveMediaPath(activeScene.media!)}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: activeScene.mediaFocus || "center 18%",
                  }}
                  muted
                />
              ) : (
                <Img
                  src={resolveMediaPath(activeScene.media!)}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: activeScene.mediaFocus || "center 18%",
                  }}
                />
              )}
            </div>

            {activeScene.pointerLabel && (
              <div
                style={{
                  position: "absolute",
                  top: 28,
                  left: 28,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  backgroundColor: "rgba(6, 19, 56, 0.85)",
                  padding: "8px 18px",
                  borderRadius: 12,
                  border: "1.5px solid rgba(255,255,255,0.6)",
                }}
              >
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    backgroundColor: headToneColor,
                  }}
                />
                <span
                  style={{
                    fontSize: 22,
                    fontWeight: 800,
                    color: "#ffffff",
                    letterSpacing: 1,
                  }}
                >
                  {activeScene.pointerLabel}
                </span>
              </div>
            )}
          </div>
        ) : (
          <div style={{ margin: "20px 0" }}>
            <DynamicVectorIcon
              type={activeScene.visualType || "gear"}
              color={headToneColor}
              frame={frame}
            />
          </div>
        )}

        {/* Interactive Overlay Panel */}
        {activeScene.points && activeScene.points.length > 0 && (
          <div
            style={{
              width: "100%",
              marginTop: 24,
              padding: activeScene.overlayType === "pills" ? 0 : "20px 26px",
              borderRadius: 22,
              backgroundColor:
                activeScene.overlayType === "pills"
                  ? "transparent"
                  : "rgba(10, 25, 68, 0.88)",
              border:
                activeScene.overlayType === "pills"
                  ? "none"
                  : "1.5px solid rgba(255,255,255,0.18)",
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            {activeScene.points.map((pt, idx) => {
              const stepDelay = Math.floor(
                (sceneDurationFrames / (activeScene.points!.length + 1)) * idx
              );
              const ptSpring = spring({
                frame: Math.max(0, localFrame - stepDelay),
                fps,
                config: { damping: 14, stiffness: 130 },
              });
              const ptOpacity = interpolate(localFrame - stepDelay, [0, 8], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              const toneCol = TONE_COLORS[pt.tone || "gold"];

              if (activeScene.overlayType === "pills") {
                return (
                  <div
                    key={idx}
                    style={{
                      alignSelf: "center",
                      padding: "12px 28px",
                      borderRadius: 16,
                      backgroundColor: "rgba(15, 23, 42, 0.92)",
                      border: `2px solid ${toneCol}`,
                      color: toneCol,
                      fontSize: 28,
                      fontWeight: 800,
                      opacity: ptOpacity,
                      transform: `translateY(${interpolate(ptSpring, [0, 1], [24, 0])}px)`,
                      boxShadow: "0 10px 25px rgba(0,0,0,0.45)",
                    }}
                  >
                    {pt.text}
                  </div>
                );
              }

              if (activeScene.overlayType === "bars") {
                const barWidth = interpolate(ptSpring, [0, 1], [0, pt.percent || 75]);
                return (
                  <div key={idx} style={{ opacity: ptOpacity }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: 24,
                        fontWeight: 800,
                        marginBottom: 8,
                      }}
                    >
                      <span style={{ color: "#ffffff" }}>{pt.text}</span>
                      <span style={{ color: toneCol }}>{pt.value}</span>
                    </div>
                    <div
                      style={{
                        width: "100%",
                        height: 16,
                        borderRadius: 99,
                        backgroundColor: "rgba(255,255,255,0.12)",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${barWidth}%`,
                          height: "100%",
                          borderRadius: 99,
                          backgroundColor: toneCol,
                        }}
                      />
                    </div>
                  </div>
                );
              }

              const isCross = pt.tone === "red";
              return (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    fontSize: 27,
                    fontWeight: 800,
                    color: isCross ? "#fca5a5" : "#86efac",
                    opacity: ptOpacity,
                    transform: `translateX(${interpolate(ptSpring, [0, 1], [-20, 0])}px)`,
                  }}
                >
                  <span style={{ color: toneCol, fontSize: 30 }}>
                    {isCross ? "✕" : "✓"}
                  </span>
                  <span>{pt.text}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom Dynamic Karaoke Subtitle */}
      <div style={{ zIndex: 2 }}>
        <DynamicKineticSubtitle
          text={activeScene.body}
          localFrame={localFrame}
          sceneDurationFrames={sceneDurationFrames}
          highlightColor={accent}
        />
      </div>
    </AbsoluteFill>
  );
};
