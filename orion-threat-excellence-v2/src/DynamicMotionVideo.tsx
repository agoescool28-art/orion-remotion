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
  visualType?: "gear" | "chart" | "shield" | "flow";
  media?: string;
  mediaType?: "image" | "video";
  motion?: "zoom-in" | "zoom-out" | "pan-right" | "none";
}

export interface StyleConfig {
  bgColor?: string;
  accentColor?: string;
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
};  type: "gear" | "chart" | "shield" | "flow";
  color: string;
  frame: number;
> = ({ type, color, frame }) => {
  const pulse = Math.sin(frame * 0.08) * 6;
  const spin = (frame * 1.5) % 360;

  if (type === "gear") {
    return (
      <svg width="240" height="240" viewBox="0 0 200 200">
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
      <svg width="240" height="240" viewBox="0 0 200 200">
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
      <svg width="240" height="240" viewBox="0 0 200 200">
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
    <svg width="240" height="240" viewBox="0 0 200 200">
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
  const { fps, durationInFrames, width } = useVideoConfig();
  const inputProps = (getInputProps() as DynamicVideoProps) || {};
  const props = { ...directProps, ...inputProps };

  const style = props.styleConfig || {};
  const accent = style.accentColor || props.accentColor || "#10b981";
  const bg = style.bgColor || props.bgColor || "#090d16";
  const textColor = style.textColor || "#ffffff";
  const layout = style.layout || "center";
  const overlayOpacity = style.overlayOpacity ?? 0.65;
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

  const entrance = spring({
    frame: localFrame,
    fps,
    config: { damping, stiffness: 110 },
  });

  const slideY = interpolate(entrance, [0, 1], [45, 0]);
  const opacity = interpolate(localFrame, [0, 10], [0, 1], {
    extrapolateRight: "clamp",
  });
  const progressPct = Math.min(100, (frame / durationInFrames) * 100);

  // Kalkulasi animasi kamera (Ken Burns) untuk foto/footage
  const mediaProgress = Math.min(1, localFrame / framesPerScene);
  let mediaScale = 1;
  let mediaTranslateX = 0;
  if (activeScene.motion === "zoom-in") {
    mediaScale = interpolate(mediaProgress, [0, 1], [1.0, 1.15]);
  } else if (activeScene.motion === "zoom-out") {
    mediaScale = interpolate(mediaProgress, [0, 1], [1.15, 1.0]);
  } else if (activeScene.motion === "pan-right") {
    mediaScale = 1.12;
    mediaTranslateX = interpolate(mediaProgress, [0, 1], [-25, 25]);
  }

  const resolvedAudio = props.audioSrc
    ? props.audioSrc
    : props.audioFile
    ? resolveMediaPath(props.audioFile)
    : "";

  const hasMedia = Boolean(activeScene.media);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: bg,
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
        color: textColor,
        padding: 64,
        justifyContent: "space-between",
        overflow: "hidden",
      }}
    >
      {resolvedAudio ? <Audio src={resolvedAudio} /> : null}

      {/* Lapisan Media Latar Belakang (Jika layout bukan split-top) */}
      {hasMedia && layout !== "split-top" && (
        <AbsoluteFill style={{ zIndex: 0 }}>
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
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                muted
              />
            ) : (
              <Img
                src={resolveMediaPath(activeScene.media!)}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            )}
          </div>
          <AbsoluteFill
            style={{
              backgroundColor: bg,
              opacity: overlayOpacity,
            }}
          />
        </AbsoluteFill>
      )}

      {/* Grid Dekoratif (Jika tidak memakai media penuh) */}
      {(!hasMedia || layout === "split-top") && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `radial-gradient(${accent}22 2px, transparent 2px)`,
            backgroundSize: "48px 48px",
            opacity: 0.5,
            zIndex: 0,
          }}
        />
      )}

      {/* Header Atas */}
      <div style={{ zIndex: 2 }}>
        <div
          style={{
            display: "inline-block",
            padding: "10px 22px",
            borderRadius: 999,
            backgroundColor: `${accent}26`,
            border: `2px solid ${accent}`,
            color: accent,
            fontSize: 24,
            fontWeight: 800,
            letterSpacing: 2,
          }}
        >
          {activeScene.tag}
        </div>
        <div
          style={{
            marginTop: 20,
            fontSize: 26,
            color: "#cbd5e1",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: 1.5,
          }}
        >
          {mainTitle}
        </div>
      </div>

      {/* Konten Utama Tengah */}
      <div
        style={{
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: layout === "left" ? "flex-start" : "center",
          textAlign: layout === "left" ? "left" : "center",
          transform: `translateY(${slideY}px)`,
          opacity,
        }}
      >
        {/* Bingkai Media Split-Top (Jika memakai foto/footage dengan gaya frame kartu) */}
        {hasMedia && layout === "split-top" && (
          <div
            style={{
              width: "100%",
              height: 620,
              borderRadius: 28,
              overflow: "hidden",
              border: `3px solid ${accent}`,
              marginBottom: 42,
              boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
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
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  muted
                />
              ) : (
                <Img
                  src={resolveMediaPath(activeScene.media!)}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              )}
            </div>
          </div>
        )}

        {/* Ikon Vektor Otomatis (Jika adegan tidak memakai foto/footage) */}
        {!hasMedia && (
          <div style={{ marginBottom: 40 }}>
            <DynamicVectorIcon
              type={activeScene.visualType || "gear"}
              color={accent}
              frame={frame}
            />
          </div>
        )}

        <h1
          style={{
            fontSize: 62,
            fontWeight: 900,
            lineHeight: 1.15,
            margin: 0,
            color: textColor,
            textTransform: "uppercase",
            textShadow: hasMedia && layout !== "split-top" ? "0 4px 20px rgba(0,0,0,0.8)" : "none",
          }}
        >
          {activeScene.heading}
        </h1>

        <p
          style={{
            marginTop: 26,
            fontSize: 36,
            lineHeight: 1.45,
            color: "#e2e8f0",
            maxWidth: width - 130,
            fontWeight: 500,
            textShadow: hasMedia && layout !== "split-top" ? "0 2px 12px rgba(0,0,0,0.8)" : "none",
          }}
        >
          {activeScene.body}
        </p>
      </div>

      {/* Footer & Progress Bar */}
      <div style={{ zIndex: 2 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 22,
            color: "#cbd5e1",
            marginBottom: 14,
            fontWeight: 700,
          }}
        >
          <span>
            ADEGAN {currentSceneIndex + 1} / {scenes.length}
          </span>
          <span style={{ color: accent }}>ORION MOTION ENGINE</span>
        </div>
        <div
          style={{
            width: "100%",
            height: 12,
            backgroundColor: "rgba(255,255,255,0.18)",
            borderRadius: 999,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${progressPct}%`,
              height: "100%",
              backgroundColor: accent,
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};
