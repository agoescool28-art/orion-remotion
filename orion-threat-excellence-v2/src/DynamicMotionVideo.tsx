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

export type VisualCategory =
  | "gear"
  | "chart"
  | "shield"
  | "flow"
  | "medical"
  | "history"
  | "globe"
  | "bulb";

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
  heroStat?: string;
  heroLabel?: string;
  startTime?: number;
  durationSeconds?: number;
  overlayType?: "pills" | "bars" | "checklist";
  points?: OverlayPoint[];
  pointerLabel?: string;
  visualType?: VisualCategory;
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

const DynamicVectorIllustration: React.FC<{
  type: VisualCategory;
  color: string;
  frame: number;
}> = ({ type, color, frame }) => {
  const pulse = Math.sin(frame * 0.08) * 8;
  const spin = (frame * 1.4) % 360;
  const reverseSpin = (-frame * 0.9) % 360;

  if (type === "medical") {
    const beat = 1 + Math.sin(frame * 0.14) * 0.06;
    return (
      <svg width="340" height="340" viewBox="0 0 240 240">
        <circle cx="120" cy="120" r="108" fill={color} fillOpacity="0.08" />
        <g transform={`translate(120 120) scale(${beat}) translate(-120 -120)`}>
          <rect x="102" y="54" width="36" height="132" rx="10" fill={color} />
          <rect x="54" y="102" width="132" height="36" rx="10" fill={color} />
          <circle cx="120" cy="120" r="14" fill="#ffffff" />
        </g>
        <path
          d="M36 176 L76 176 L92 152 L112 198 L132 144 L148 176 L204 176"
          fill="none"
          stroke="#ffffff"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (type === "history") {
    return (
      <svg width="340" height="340" viewBox="0 0 240 240">
        <circle cx="120" cy="120" r="108" fill={color} fillOpacity="0.08" />
        <polygon points="120,44 48,82 192,82" fill={color} />
        <rect x="56" y="88" width="128" height="10" rx="4" fill="#ffffff" />
        <rect x="68" y="104" width="18" height="66" rx="4" fill="#e2e8f0" />
        <rect x="111" y="104" width="18" height="66" rx="4" fill={color} />
        <rect x="154" y="104" width="18" height="66" rx="4" fill="#e2e8f0" />
        <rect x="48" y="176" width="144" height="14" rx="6" fill="#ffffff" />
      </svg>
    );
  }

  if (type === "globe") {
    return (
      <svg width="340" height="340" viewBox="0 0 240 240">
        <circle cx="120" cy="120" r="108" fill={color} fillOpacity="0.08" />
        <circle cx="120" cy="120" r="72" fill="none" stroke={color} strokeWidth="7" />
        <ellipse cx="120" cy="120" rx="34" ry="72" fill="none" stroke="#ffffff" strokeWidth="5" />
        <line x1="48" y1="120" x2="192" y2="120" stroke="#ffffff" strokeWidth="5" />
        <path d="M58 88 Q120 102 182 88" fill="none" stroke={color} strokeWidth="4" />
        <path d="M58 152 Q120 138 182 152" fill="none" stroke={color} strokeWidth="4" />
        <circle
          cx={120 + Math.cos(frame * 0.06) * 72}
          cy={120 + Math.sin(frame * 0.06) * 28}
          r="10"
          fill={color}
        />
      </svg>
    );
  }

  if (type === "bulb") {
    const glow = 0.25 + Math.abs(Math.sin(frame * 0.08)) * 0.35;
    return (
      <svg width="340" height="340" viewBox="0 0 240 240">
        <circle cx="120" cy="120" r="108" fill={color} fillOpacity="0.08" />
        <circle cx="120" cy="105" r="64" fill={color} fillOpacity={glow} />
        <path
          d="M120 50 C88 50 66 74 66 104 C66 124 78 140 92 152 L96 168 H144 L148 152 C162 140 174 124 174 104 C174 74 152 50 120 50 Z"
          fill="none"
          stroke={color}
          strokeWidth="9"
        />
        <rect x="98" y="176" width="44" height="12" rx="6" fill="#ffffff" />
        <path
          d="M106 112 L118 124 L138 96"
          fill="none"
          stroke="#ffffff"
          strokeWidth="8"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (type === "gear") {
    return (
      <svg width="340" height="340" viewBox="0 0 240 240">
        <circle cx="120" cy="120" r="108" fill={color} fillOpacity="0.08" />
        <g transform={`rotate(${reverseSpin} 120 120)`}>
          <circle
            cx="120"
            cy="120"
            r="96"
            fill="none"
            stroke={color}
            strokeOpacity="0.35"
            strokeWidth="2"
            strokeDasharray="10 14"
          />
        </g>
        <g transform={`rotate(${spin} 120 120)`}>
          <circle
            cx="120"
            cy="120"
            r="56"
            fill="none"
            stroke={color}
            strokeWidth="14"
            strokeDasharray="22 14"
          />
          <circle cx="120" cy="120" r="28" fill="none" stroke="#ffffff" strokeWidth="6" />
        </g>
        <path d="M42 184 L198 152" stroke={color} strokeWidth="9" strokeLinecap="round" />
        <circle cx={90 + pulse * 2} cy={160 - pulse * 0.4} r="16" fill="#ffffff" />
      </svg>
    );
  }

  if (type === "chart") {
    const h1 = 62 + Math.sin(frame * 0.06) * 16;
    const h2 = 104 + Math.cos(frame * 0.06) * 16;
    const h3 = 142 + Math.sin(frame * 0.08) * 12;
    return (
      <svg width="340" height="340" viewBox="0 0 240 240">
        <circle cx="120" cy="120" r="108" fill={color} fillOpacity="0.08" />
        <line x1="40" y1="65" x2="200" y2="65" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
        <line x1="40" y1="115" x2="200" y2="115" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
        <rect x="52" y={182 - h1} width="34" height={h1} rx="8" fill="#64748b" />
        <rect x="103" y={182 - h2} width="34" height={h2} rx="8" fill={color} />
        <rect x="154" y={182 - h3} width="34" height={h3} rx="8" fill="#ffffff" />
        <path
          d={`M69 ${172 - h1} L120 ${172 - h2} L171 ${172 - h3}`}
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeLinecap="round"
        />
        <line x1="38" y1="184" x2="202" y2="184" stroke="#94a3b8" strokeWidth="4" />
      </svg>
    );
  }

  if (type === "shield") {
    return (
      <svg width="340" height="340" viewBox="0 0 240 240">
        <circle cx="120" cy="120" r="108" fill={color} fillOpacity="0.08" />
        <g transform={`rotate(${spin} 120 120)`}>
          <circle
            cx="120"
            cy="120"
            r="95"
            fill="none"
            stroke={color}
            strokeOpacity="0.3"
            strokeWidth="3"
            strokeDasharray="16 12"
          />
        </g>
        <path
          d="M120 40 L182 66 V122 C182 162 154 190 120 202 C86 190 58 162 58 122 V66 Z"
          fill={`${color}18`}
          stroke={color}
          strokeWidth="10"
        />
        <path
          d="M90 122 L111 143 L152 98"
          fill="none"
          stroke="#ffffff"
          strokeWidth="12"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg width="340" height="340" viewBox="0 0 240 240">
      <circle cx="120" cy="120" r="108" fill={color} fillOpacity="0.08" />
      <path
        d="M64 120 L120 68 L176 120 L120 172 Z"
        fill="none"
        stroke={color}
        strokeWidth="6"
        strokeDasharray="10 8"
      />
      <circle cx="64" cy="120" r="22" fill={color} />
      <circle cx="120" cy="68" r="22" fill="#ffffff" />
      <circle cx="176" cy="120" r="22" fill={color} />
      <circle cx="120" cy="172" r="22" fill="#ffffff" />
    </svg>
  );
};

const DynamicKineticSubtitle: React.FC<{
  text: string;
  localFrame: number;
  sceneDurationFrames: number;
  highlightColor: string;
}> = ({ text, localFrame, sceneDurationFrames, highlightColor }) => {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return null;

  const weights = words.map((w) => {
    let weight = Math.max(3, w.length);
    if (w.endsWith(",")) weight += 4;
    if (w.endsWith(".") || w.endsWith("?") || w.endsWith("!")) weight += 7;
    return weight;
  });

  const totalWeight = weights.reduce((acc, w) => acc + w, 0);
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
        minHeight: 115,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        padding: "0 20px",
        textAlign: "center",
        lineHeight: 1.3,
      }}
    >
      {visibleWords.map((word, idx) => {
        const globalIdx = startIdx + idx;
        const isActive = globalIdx === activeWordGlobalIndex;
        return (
          <React.Fragment key={globalIdx}>
            <span
              style={{
                display: "inline-block",
                fontSize: 42,
                fontWeight: 900,
                color: isActive ? highlightColor : "#ffffff",
                transform: isActive ? "scale(1.06)" : "scale(1)",
                textShadow: "0 4px 16px rgba(0,0,0,0.85)",
              }}
            >
              {word}
            </span>
            {idx < visibleWords.length - 1 ? <span>{"\u00A0\u00A0"}</span> : null}
          </React.Fragment>
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
            visualType: "bulb",
          },
        ];

  const sceneRanges: { start: number; end: number; duration: number }[] = [];
  const hasExplicitStartTimes = scenes.some((s) => typeof s.startTime === "number");

  if (hasExplicitStartTimes) {
    for (let i = 0; i < scenes.length; i++) {
      const startSec = scenes[i].startTime ?? 0;
      const nextStartSec =
        i < scenes.length - 1
          ? scenes[i + 1].startTime ?? durationInFrames / fps
          : durationInFrames / fps;
      const startFrame = Math.round(startSec * fps);
      const endFrame = Math.max(startFrame + 15, Math.round(nextStartSec * fps));
      sceneRanges.push({
        start: startFrame,
        end: endFrame,
        duration: endFrame - startFrame,
      });
    }
  } else {
    const rawWeights = scenes.map((s) =>
      s.durationSeconds && s.durationSeconds > 0
        ? s.durationSeconds
        : Math.max(15, s.body.length)
    );
    const totalRawWeight = rawWeights.reduce((a, b) => a + b, 0);

    let cursor = 0;
    for (let i = 0; i < scenes.length; i++) {
      const dur =
        i === scenes.length - 1
          ? Math.max(30, durationInFrames - cursor)
          : Math.max(30, Math.round((rawWeights[i] / totalRawWeight) * durationInFrames));
      sceneRanges.push({ start: cursor, end: cursor + dur, duration: dur });
      cursor += dur;
    }
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

  const effectivePoints: OverlayPoint[] =
    activeScene.points && activeScene.points.length > 0
      ? activeScene.points
      : activeScene.body
          .split(/[,.;]+/)
          .map((part) => part.trim())
          .filter((part) => part.length > 4)
          .slice(0, 3)
          .map((part, idx) => ({
            text: part.charAt(0).toUpperCase() + part.slice(1),
            tone: idx === 0 ? "neutral" : activeScene.headingTone || "gold",
          }));

  const effectiveOverlayType = activeScene.overlayType || "pills";

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

      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 50% 42%, ${headToneColor}22 0%, rgba(0,0,0,0.5) 75%)`,
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
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

      {/* Center Stage */}
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
              height: effectivePoints.length > 0 ? 490 : 610,
              borderRadius: 26,
              overflow: "hidden",
              border: "2px solid rgba(255,255,255,0.2)",
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
          <div
            style={{
              width: "100%",
              padding: "32px 28px",
              borderRadius: 30,
              background:
                "linear-gradient(155deg, rgba(255,255,255,0.09) 0%, rgba(10,25,68,0.75) 100%)",
              border: `2px solid ${headToneColor}55`,
              boxShadow: `0 24px 60px rgba(0,0,0,0.55), 0 0 36px ${headToneColor}18`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              position: "relative",
            }}
          >
            <DynamicVectorIllustration
              type={activeScene.visualType || "bulb"}
              color={headToneColor}
              frame={frame}
            />
            {activeScene.heroStat && (
              <div
                style={{
                  marginTop: 8,
                  display: "flex",
                  alignItems: "baseline",
                  gap: 12,
                }}
              >
                <span
                  style={{
                    fontSize: 58,
                    fontWeight: 900,
                    color: headToneColor,
                    letterSpacing: -1,
                  }}
                >
                  {activeScene.heroStat}
                </span>
                {activeScene.heroLabel && (
                  <span
                    style={{
                      fontSize: 24,
                      fontWeight: 800,
                      color: "#e2e8f0",
                      textTransform: "uppercase",
                    }}
                  >
                    {activeScene.heroLabel}
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        {/* Interactive Overlay Panel */}
        {effectivePoints.length > 0 && (
          <div
            style={{
              width: "100%",
              marginTop: 26,
              padding: effectiveOverlayType === "pills" ? 0 : "22px 26px",
              borderRadius: 22,
              backgroundColor:
                effectiveOverlayType === "pills"
                  ? "transparent"
                  : "rgba(10, 25, 68, 0.9)",
              border:
                effectiveOverlayType === "pills"
                  ? "none"
                  : "1.5px solid rgba(255,255,255,0.18)",
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            {effectivePoints.map((pt, idx) => {
              const stepDelay = Math.floor(
                (sceneDurationFrames / (effectivePoints.length + 1)) * idx
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

              if (effectiveOverlayType === "pills") {
                return (
                  <div
                    key={idx}
                    style={{
                      alignSelf: "center",
                      maxWidth: "94%",
                      textAlign: "center",
                      padding: "13px 28px",
                      borderRadius: 16,
                      backgroundColor: "rgba(15, 23, 42, 0.94)",
                      border: `2px solid ${toneCol}`,
                      color: toneCol,
                      fontSize: 27,
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

              if (effectiveOverlayType === "bars") {
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
