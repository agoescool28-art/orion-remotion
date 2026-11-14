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

export interface SceneItem {
  tag: string;
  heading: string;
  body: string;
  statNumber?: string;
  statLabel?: string;
  visualType?: "gear" | "chart" | "shield" | "flow";
  media?: string;
  mediaType?: "image" | "video";
  mediaFocus?: string;
  motion?: "zoom-in" | "zoom-out" | "pan-right" | "none";
}

export interface StyleConfig {
  bgColor?: string;
  accentColor?: string;
  secondaryAccent?: string;
  textColor?: string;
  layout?: "center" | "left" | "split-top";
  overlayOpacity?: number;
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

const KineticHeading: React.FC<{
  text: string;
  accent: string;
  textColor: string;
  localFrame: number;
  fps: number;
  align: "center" | "left";
}> = ({ text, accent, textColor, localFrame, fps, align }) => {
  const words = text.split(" ");
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: align === "center" ? "center" : "flex-start",
        gap: "12px 18px",
      }}
    >
      {words.map((word, idx) => {
        const delay = idx * 4;
        const spr = spring({
          frame: Math.max(0, localFrame - delay),
          fps,
          config: { damping: 13, stiffness: 140 },
        });
        const y = interpolate(spr, [0, 1], [48, 0]);
        const scale = interpolate(spr, [0, 1], [0.85, 1]);
        const op = interpolate(localFrame - delay, [0, 8], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const isLastWord = idx === words.length - 1 && words.length > 1;

        return (
          <span
            key={idx}
            style={{
              display: "inline-block",
              fontSize: 64,
              fontWeight: 900,
              lineHeight: 1.08,
              letterSpacing: -1,
              textTransform: "uppercase",
              color: isLastWord ? accent : textColor,
              transform: `translateY(${y}px) scale(${scale})`,
              opacity: op,
              textShadow: isLastWord ? `0 0 32px ${accent}55` : "none",
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
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
      <svg width="210" height="210" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="88" fill={color} fillOpacity="0.14" />
        <g transform={`rotate(${spin} 100 100)`}>
          <circle
            cx="100"
            cy="100"
            r="46"
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeDasharray="18 12"
          />
          <circle cx="100" cy="100" r="24" fill="none" stroke="#ffffff" strokeWidth="6" />
        </g>
        <path d="M40 155 L160 130" stroke={color} strokeWidth="8" strokeLinecap="round" />
        <circle cx={75 + pulse * 1.5} cy={135 - pulse * 0.3} r="14" fill="#ffffff" />
      </svg>
    );
  }

  if (type === "chart") {
    const h1 = 50 + Math.sin(frame * 0.06) * 15;
    const h2 = 85 + Math.cos(frame * 0.06) * 15;
    const h3 = 115 + Math.sin(frame * 0.08) * 10;
    return (
      <svg width="210" height="210" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="88" fill={color} fillOpacity="0.14" />
        <rect x="45" y={150 - h1} width="26" height={h1} rx="6" fill="#64748b" />
        <rect x="87" y={150 - h2} width="26" height={h2} rx="6" fill={color} />
        <rect x="129" y={150 - h3} width="26" height={h3} rx="6" fill="#ffffff" />
        <line x1="35" y1="152" x2="165" y2="152" stroke="#94a3b8" strokeWidth="4" />
      </svg>
    );
  }

  if (type === "shield") {
    return (
      <svg width="210" height="210" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="88" fill={color} fillOpacity="0.14" />
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
    <svg width="210" height="210" viewBox="0 0 200 200">
      <circle cx="100" cy="100" r="88" fill={color} fillOpacity="0.14" />
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

export const DynamicMotionVideo: React.FC<DynamicVideoProps> = (directProps) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const inputProps = (getInputProps() as DynamicVideoProps) || {};
  const props = { ...directProps, ...inputProps };

  const style = props.styleConfig || {};
  const accent = style.accentColor || props.accentColor || "#10b981";
  const secondaryAccent = style.secondaryAccent || "#3b82f6";
  const bg = style.bgColor || props.bgColor || "#07090f";
  const textColor = style.textColor || "#ffffff";
  const layout = style.layout || "split-top";
  const damping = style.springDamping ?? 14;

  const mainTitle = props.title || "MOTION GRAPHIC";
  const subTitle = props.subtitle || "Visualisasi Otomatis";

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

  const framesPerScene = Math.max(30, Math.floor(durationInFrames / scenes.length));
  const currentSceneIndex = Math.min(
    scenes.length - 1,
    Math.floor(frame / framesPerScene)
  );
  const localFrame = frame - currentSceneIndex * framesPerScene;
  const activeScene = scenes[currentSceneIndex];

  // Transisi keluar-masuk antar adegan (Morph wipe & scale)
  const cardSpring = spring({
    frame: localFrame,
    fps,
    config: { damping, stiffness: 120 },
  });
  const exitProgress = interpolate(
    localFrame,
    [framesPerScene - 12, framesPerScene],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const cardScale = interpolate(cardSpring, [0, 1], [0.9, 1]) * interpolate(exitProgress, [0, 1], [0.95, 1]);
  const cardY = interpolate(cardSpring, [0, 1], [60, 0]);
  const bodyOpacity = interpolate(localFrame, [10, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * exitProgress;
  const bodyY = interpolate(localFrame, [10, 22], [24, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Gerak Ambient Glow Orb
  const orbX = Math.sin(frame * 0.02) * 120;
  const orbY = Math.cos(frame * 0.015) * 90;

  // Gerak kamera foto (Ken Burns)
  const mediaProgress = Math.min(1, localFrame / framesPerScene);
  let mediaScale = 1.02;
  let mediaTranslateX = 0;
  if (activeScene.motion === "zoom-in") {
    mediaScale = interpolate(mediaProgress, [0, 1], [1.0, 1.14]);
  } else if (activeScene.motion === "zoom-out") {
    mediaScale = interpolate(mediaProgress, [0, 1], [1.14, 1.0]);
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
  const progressPct = Math.min(100, (frame / durationInFrames) * 100);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: bg,
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
        color: textColor,
        padding: "56px 52px",
        justifyContent: "space-between",
        overflow: "hidden",
      }}
    >
      {resolvedAudio ? <Audio src={resolvedAudio} /> : null}

      {/* Ambient Glowing Orbs (Latar Belakang Dinamis Ala Claude/Apple) */}
      <div
        style={{
          position: "absolute",
          top: 140 + orbY,
          left: -120 + orbX,
          width: 620,
          height: 620,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${accent}33 0%, transparent 70%)`,
          filter: "blur(40px)",
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 180 - orbY,
          right: -140 - orbX,
          width: 580,
          height: 580,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${secondaryAccent}28 0%, transparent 70%)`,
          filter: "blur(50px)",
          zIndex: 0,
        }}
      />

      {/* Grid Halus */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
          zIndex: 0,
        }}
      />

      {/* Top Glass Header Bar */}
      <div
        style={{
          zIndex: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 24px",
          borderRadius: 24,
          backgroundColor: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.12)",
        }}
      >
        <div
          style={{
            padding: "8px 18px",
            borderRadius: 999,
            backgroundColor: `${accent}24`,
            border: `1.5px solid ${accent}`,
            color: accent,
            fontSize: 21,
            fontWeight: 800,
            letterSpacing: 1.5,
          }}
        >
          {activeScene.tag}
        </div>
        <div
          style={{
            fontSize: 20,
            color: "#94a3b8",
            fontWeight: 700,
            letterSpacing: 1,
          }}
        >
          {currentSceneIndex + 1} / {scenes.length}
        </div>
      </div>

      {/* Main Glassmorphism UI Stage */}
      <div
        style={{
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: layout === "left" ? "flex-start" : "center",
          textAlign: layout === "left" ? "left" : "center",
          transform: `translateY(${cardY}px) scale(${cardScale})`,
          opacity: exitProgress,
        }}
      >
        {/* UI Media Card dengan Stat Pill Melayang */}
        {hasMedia ? (
          <div
            style={{
              position: "relative",
              width: "100%",
              height: 640,
              borderRadius: 34,
              padding: 12,
              background: "linear-gradient(145deg, rgba(255,255,255,0.16), rgba(255,255,255,0.03))",
              border: `1.5px solid ${accent}66`,
              boxShadow: `0 28px 70px rgba(0,0,0,0.65), 0 0 40px ${accent}22`,
              marginBottom: 40,
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 24,
                overflow: "hidden",
                position: "relative",
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

              {/* Vignette Bawah pada Foto agar Teks Overlay Kontras */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 45%)",
                }}
              />
            </div>

            {/* Floating Stat / Year Morph Pill */}
            {activeScene.statNumber && (
              <div
                style={{
                  position: "absolute",
                  bottom: -22,
                  right: 28,
                  padding: "14px 28px",
                  borderRadius: 22,
                  backgroundColor: "#0f172a",
                  border: `2px solid ${accent}`,
                  boxShadow: "0 14px 30px rgba(0,0,0,0.6)",
                  display: "flex",
                  alignItems: "baseline",
                  gap: 12,
                }}
              >
                <span
                  style={{
                    fontSize: 42,
                    fontWeight: 900,
                    color: accent,
                    letterSpacing: -1,
                  }}
                >
                  {activeScene.statNumber}
                </span>
                {activeScene.statLabel && (
                  <span
                    style={{
                      fontSize: 20,
                      fontWeight: 700,
                      color: "#e2e8f0",
                      textTransform: "uppercase",
                    }}
                  >
                    {activeScene.statLabel}
                  </span>
                )}
              </div>
            )}
          </div>
        ) : (
          /* Glass Card untuk Adegan Tanpa Foto (Ikon Vektor + Stat Besar) */
          <div
            style={{
              width: "100%",
              padding: "44px 32px",
              borderRadius: 34,
              background: "linear-gradient(145deg, rgba(255,255,255,0.09), rgba(255,255,255,0.02))",
              border: `1.5px solid ${accent}55`,
              marginBottom: 40,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <DynamicVectorIcon
              type={activeScene.visualType || "gear"}
              color={accent}
              frame={frame}
            />
            {activeScene.statNumber && (
              <div
                style={{
                  marginTop: 18,
                  fontSize: 56,
                  fontWeight: 900,
                  color: accent,
                  letterSpacing: -1,
                }}
              >
                {activeScene.statNumber}
              </div>
            )}
          </div>
        )}

        {/* Kinetic Word-by-Word Heading */}
        <KineticHeading
          text={activeScene.heading}
          accent={accent}
          textColor={textColor}
          localFrame={localFrame}
          fps={fps}
          align={layout === "left" ? "left" : "center"}
        />

        {/* Glass Caption Box */}
        <div
          style={{
            marginTop: 26,
            padding: "22px 28px",
            borderRadius: 24,
            backgroundColor: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            opacity: bodyOpacity,
            transform: `translateY(${bodyY}px)`,
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: 33,
              lineHeight: 1.45,
              color: "#e2e8f0",
              fontWeight: 500,
            }}
          >
            {activeScene.body}
          </p>
        </div>
      </div>

      {/* Bottom Audio Waveform & Timeline Bar */}
      <div style={{ zIndex: 2 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 14,
          }}
        >
          <span
            style={{
              fontSize: 20,
              color: "#94a3b8",
              fontWeight: 700,
              letterSpacing: 1,
            }}
          >
            {mainTitle}
          </span>

          {/* Animated Audio Equalizer Bars */}
          <div style={{ display: "flex", alignItems: "center", gap: 5, height: 26 }}>
            {[0, 1, 2, 3, 4, 5, 6].map((bar) => {
              const barH = 8 + Math.abs(Math.sin(frame * 0.22 + bar * 1.1)) * 18;
              return (
                <div
                  key={bar}
                  style={{
                    width: 5,
                    height: barH,
                    borderRadius: 99,
                    backgroundColor: accent,
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Segmented Timeline Progress */}
        <div style={{ display: "flex", gap: 8 }}>
          {scenes.map((_, i) => {
            const segFill =
              i < currentSceneIndex
                ? 100
                : i === currentSceneIndex
                ? Math.min(100, (localFrame / framesPerScene) * 100)
                : 0;
            return (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: 8,
                  borderRadius: 99,
                  backgroundColor: "rgba(255,255,255,0.14)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${segFill}%`,
                    height: "100%",
                    backgroundColor: accent,
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
