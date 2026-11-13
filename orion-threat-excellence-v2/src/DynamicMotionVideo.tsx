import React from "react";
import {
  AbsoluteFill,
  Audio,
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
  visualType: "gear" | "chart" | "shield" | "flow";
}

export interface DynamicVideoProps {
  title?: string;
  subtitle?: string;
  insight?: string;
  accentColor?: string;
  bgColor?: string;
  audioSrc?: string;
  scenes?: SceneItem[];
}

const DynamicVectorIcon: React.FC<{
  type: "gear" | "chart" | "shield" | "flow";
  color: string;
  frame: number;
}> = ({ type, color, frame }) => {
  const pulse = Math.sin(frame * 0.08) * 6;
  const spin = (frame * 1.5) % 360;

  if (type === "gear") {
    return (
      <svg width="260" height="260" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="88" fill={color} fillOpacity="0.12" />
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
        <path
          d="M40 155 L160 130"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
        />
        <circle cx={75 + pulse * 1.5} cy={135 - pulse * 0.3} r="14" fill="#ffffff" />
      </svg>
    );
  }

  if (type === "chart") {
    const h1 = 50 + Math.sin(frame * 0.06) * 15;
    const h2 = 85 + Math.cos(frame * 0.06) * 15;
    const h3 = 115 + Math.sin(frame * 0.08) * 10;
    return (
      <svg width="260" height="260" viewBox="0 0 200 200">
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
      <svg width="260" height="260" viewBox="0 0 200 200">
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
    <svg width="260" height="260" viewBox="0 0 200 200">
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

export const DynamicMotionVideo: React.FC<DynamicVideoProps> = (directProps) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();
  const inputProps = (getInputProps() as DynamicVideoProps) || {};
  const props = { ...directProps, ...inputProps };

  const accent = props.accentColor || "#10b981";
  const bg = props.bgColor || "#090d16";
  const mainTitle = props.title || "MOTION GRAPHIC";
  const subTitle = props.subtitle || "Visualisasi Otomatis";

  const scenes: SceneItem[] =
    props.scenes && props.scenes.length > 0
      ? props.scenes
      : [
          {
            tag: "BAGIAN 01 • KONSEP",
            heading: mainTitle,
            body: subTitle,
            visualType: "gear",
          },
          {
            tag: "BAGIAN 02 • ANALISIS",
            heading: "EFISIENSI KERJA",
            body: props.insight || "Optimalisasi proses secara terukur.",
            visualType: "chart",
          },
          {
            tag: "BAGIAN 03 • PENERAPAN",
            heading: "STANDAR OPERASIONAL",
            body: "Langkah praktis yang konsisten dan aman.",
            visualType: "shield",
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
    config: { damping: 14, stiffness: 110 },
  });

  const slideY = interpolate(entrance, [0, 1], [45, 0]);
  const opacity = interpolate(localFrame, [0, 10], [0, 1], {
    extrapolateRight: "clamp",
  });
  const progressPct = Math.min(100, (frame / durationInFrames) * 100);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: bg,
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
        color: "#ffffff",
        padding: 64,
        justifyContent: "space-between",
      }}
    >
      {props.audioSrc ? <Audio src={props.audioSrc} /> : null}

      {/* Grid Dekoratif Latar */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `radial-gradient(${accent}22 2px, transparent 2px)`,
          backgroundSize: "48px 48px",
          opacity: 0.5,
        }}
      />

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
            marginTop: 22,
            fontSize: 28,
            color: "#94a3b8",
            fontWeight: 600,
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
          alignItems: "center",
          textAlign: "center",
          transform: `translateY(${slideY}px)`,
          opacity,
        }}
      >
        <div style={{ marginBottom: 44 }}>
          <DynamicVectorIcon
            type={activeScene.visualType}
            color={accent}
            frame={frame}
          />
        </div>

        <h1
          style={{
            fontSize: 64,
            fontWeight: 900,
            lineHeight: 1.15,
            margin: 0,
            color: "#ffffff",
            textTransform: "uppercase",
          }}
        >
          {activeScene.heading}
        </h1>

        <p
          style={{
            marginTop: 28,
            fontSize: 36,
            lineHeight: 1.45,
            color: "#cbd5e1",
            maxWidth: width - 140,
            fontWeight: 500,
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
            color: "#94a3b8",
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
            backgroundColor: "#1e293b",
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
