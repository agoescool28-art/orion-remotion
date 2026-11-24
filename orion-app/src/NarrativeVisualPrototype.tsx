
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

import { project } from "./project";
import { prabowoWords } from "./audio/prabowo.words";
import { AudioSyncedTypography } from "./audio/AudioSyncedTypography";

const FPS = 30;
const START_SECONDS = 21.5;
const START_FRAME = Math.round(START_SECONDS * FPS);

const CLAMP = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

/* =====================================================
   EDITORIAL SCENE LABEL
===================================================== */

const SceneLabel: React.FC<{
  number: string;
  eyebrow: string;
  title: string;
  frame: number;
  start: number;
}> = ({ number, eyebrow, title, frame, start }) => {
  const opacity = interpolate(
    frame,
    [start, start + 12, start + 72, start + 90],
    [0, 1, 1, 0],
    CLAMP
  );

  const y = interpolate(
    frame,
    [start, start + 18],
    [28, 0],
    CLAMP
  );

  return (
    <div
      style={{
        position: "absolute",
        left: 76,
        top: 190,
        opacity,
        transform: `translateY(${y}px)`,
        color: "#F4EBDD",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        <div
          style={{
            width: 42,
            height: 2,
            background: "#D8BD82",
          }}
        />

        <span
          style={{
            color: "#D8BD82",
            fontSize: 18,
            letterSpacing: 5,
            fontWeight: 700,
          }}
        >
          {number} / {eyebrow}
        </span>
      </div>

      <div
        style={{
          marginTop: 15,
          fontSize: 43,
          fontWeight: 800,
          letterSpacing: -1.5,
        }}
      >
        {title}
      </div>
    </div>
  );
};


/* =====================================================
   SCENE 01 — FORMATION
===================================================== */

const TrainingScene: React.FC = () => {
  const frame = useCurrentFrame();

  const shotA = interpolate(frame, [0, 4, 46, 56], [1, 1, 1, 0], CLAMP);
  const shotB = interpolate(frame, [43, 55, 103, 114], [0, 1, 1, 0], CLAMP);
  const zoomA = interpolate(frame, [0, 55], [1.02, 1.18], CLAMP);
  const zoomB = interpolate(frame, [48, 112], [1.2, 1.04], CLAMP);
  const panA = interpolate(frame, [0, 55], [12, -38], CLAMP);
  const panB = interpolate(frame, [48, 112], [-24, 18], CLAMP);

  const title = spring({
    frame: frame - 7,
    fps: 30,
    config: { damping: 18, stiffness: 100 },
  });

  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#101713" }}>
      <AbsoluteFill style={{ opacity: shotA, overflow: "hidden" }}>
        <Img
          src={staticFile("academy-cadets.jpg")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center 46%",
            transform: `translateX(${panA}px) scale(${zoomA})`,
            filter: "contrast(1.12) saturate(.82) sepia(.1)",
          }}
        />
        
      <SceneLabel
        number="01"
        eyebrow="PEMBENTUKAN"
        title="DISIPLIN DAN PENGABDIAN"
        frame={frame}
        start={5}
      />

      </AbsoluteFill>

      <AbsoluteFill style={{ opacity: shotB, overflow: "hidden" }}>
        <Img
          src={staticFile("academy-cadets.jpg")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center 72%",
            transform: `translateX(${panB}px) scale(${zoomB})`,
            filter: "contrast(1.2) saturate(.72) sepia(.12)",
          }}
        />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          background:
            "linear-gradient(90deg,rgba(5,11,8,.48),transparent 72%),linear-gradient(0deg,rgba(5,10,8,.92),transparent 60%),linear-gradient(180deg,rgba(5,10,8,.38),transparent 34%)",
        }}
      />

      {/* Moving tracking marker */}
      <div
        style={{
          position: "absolute",
          left: 74,
          top: 420,
          bottom: 410,
          width: 2,
          background: "rgba(235,218,181,.32)",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 68,
          top: 420 + interpolate(frame, [0, 112], [0, 760], CLAMP),
          width: 14,
          height: 14,
          borderRadius: 20,
          background: "#E5D2A5",
          boxShadow: "0 0 22px rgba(229,210,165,.7)",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 104,
          top: 680,
          opacity: title,
          transform: `translateX(${(1 - title) * -65}px)`,
        }}
      >
        <div style={{ color: "#E4C98F", fontSize: 19, letterSpacing: 6, fontWeight: 700 }}>
          01 / PEMBENTUKAN
        </div>
        <div style={{ color: "#FFFFFF", fontSize: 54, lineHeight: 1.02, fontWeight: 900, marginTop: 18 }}>
          DISIPLIN
          <br />
          DAN
          <br />
          PENGABDIAN
        </div>
        <div
          style={{
            marginTop: 28,
            width: interpolate(frame, [10, 35], [0, 440], CLAMP),
            height: 4,
            background: "#E4C98F",
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          left: 76,
          right: 76,
          bottom: 340,
          display: "flex",
          justifyContent: "space-between",
          color: "#E9DFC8",
          fontSize: 16,
          letterSpacing: 4,
        }}
      >
        <span>FIELD TRAINING / INDONESIA</span>
        <span>01 — FORMATION</span>
      </div>
    </AbsoluteFill>
  );
};


/* =====================================================
   SCENE 02 — AKABRI / 1974
===================================================== */

const GraduationScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, [88, 98, 198, 212], [0, 1, 1, 0], CLAMP);

  const reveal = spring({
    frame: frame - 99,
    fps,
    config: { damping: 19, stiffness: 90 },
  });

  const zoom = interpolate(frame, [94, 210], [1.08, 1.2], CLAMP);
  const pan = interpolate(frame, [94, 210], [22, -26], CLAMP);

  const yearScale = spring({
    frame: frame - 117,
    fps,
    config: { damping: 14, stiffness: 95 },
  });

  const line = interpolate(frame, [125, 165], [0, 1], CLAMP);
  const flash = interpolate(frame, [91, 97, 104], [0, .28, 0], CLAMP);

  return (
    <AbsoluteFill style={{ opacity, overflow: "hidden", backgroundColor: "#121713" }}>
      <Img
        src={staticFile("1000827932.jpg.jpeg")}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center 36%",
          transform: `translateX(${pan}px) scale(${zoom})`,
          filter: "grayscale(1) contrast(1.12) brightness(.78)",
        }}
      />

      <AbsoluteFill
        style={{
          background:
            "linear-gradient(90deg,rgba(7,12,10,.03),rgba(7,12,10,.1) 43%,rgba(7,12,10,.9)),linear-gradient(0deg,rgba(7,12,10,.94),transparent 65%),linear-gradient(180deg,rgba(7,12,10,.24),transparent 34%)",
        }}
      />

      <AbsoluteFill
        style={{
          backgroundColor: "#F0D9A7",
          opacity: flash,
          mixBlendMode: "screen",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 440,
          right: 64,
          width: 510,
          textAlign: "right",
          opacity: reveal,
          transform: `translateX(${(1 - reveal) * 90}px)`,
        }}
      >
        <div style={{ color: "#DCC28D", fontSize: 18, letterSpacing: 7, fontWeight: 700 }}>
          MOMEN BERSEJARAH
        </div>

        <div
          style={{
            color: "rgba(242,232,211,.06)",
            WebkitTextStroke: "2px rgba(235,218,181,.9)",
            fontSize: 190 * yearScale,
            fontWeight: 900,
            letterSpacing: -13,
            lineHeight: .92,
            marginTop: 12,
          }}
        >
          1974
        </div>

        <div
          style={{
            height: 4,
            width: 420 * line,
            marginLeft: "auto",
            background: "#D9C18D",
            marginTop: 24,
          }}
        />

        <div style={{ color: "#FFFFFF", fontSize: 34, fontWeight: 900, marginTop: 24 }}>
          KELULUSAN AKABRI
        </div>

        <div style={{ color: "#D9CBAE", fontSize: 17, letterSpacing: 3, marginTop: 12 }}>
          AWAL PERJALANAN PENGABDIAN
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          inset: 48,
          border: "1px solid rgba(232,215,178,.38)",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 76,
          bottom: 370,
          color: "#E8D9B8",
          fontSize: 16,
          letterSpacing: 5,
          opacity: reveal,
        }}
      >
        ARCHIVE / 1974 / AKABRI
      </div>
    </AbsoluteFill>
  );
};


/* =====================================================
   SCENE 03 — CAREER / LEADERSHIP
===================================================== */

const CareerScene: React.FC = () => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [178, 190, 300], [0, 1, 1], CLAMP);
  const action = interpolate(frame, [184, 194, 232, 244], [0, 1, 1, 0], CLAMP);
  const portrait = interpolate(frame, [230, 246, 300], [0, 1, 1], CLAMP);

  const actionZoom = interpolate(frame, [184, 244], [1.08, 1.18], CLAMP);
  const portraitZoom = interpolate(frame, [232, 300], [1.2, 1.05], CLAMP);

  const panelX = interpolate(frame, [232, 253], [1080, 0], CLAMP);

  const title = spring({
    frame: frame - 196,
    fps: 30,
    config: { damping: 18, stiffness: 95 },
  });

  const route = interpolate(frame, [204, 280], [0, 1], CLAMP);

  return (
    <AbsoluteFill style={{ opacity, overflow: "hidden", backgroundColor: "#111713" }}>
      <AbsoluteFill style={{ opacity: action, overflow: "hidden" }}>
        <Img
          src={staticFile("1000827935.jpg.jpeg")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center 42%",
            transform: `scale(${actionZoom})`,
            filter: "contrast(1.14) saturate(.86) brightness(.78)",
          }}
        />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          opacity: portrait,
          overflow: "hidden",
          clipPath: `inset(0 0 0 ${interpolate(frame, [230, 250], [100, 0], CLAMP)}%)`,
        }}
      >
        <Img
          src={staticFile("1000827941.jpg.jpeg")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center 35%",
            transform: `scale(${portraitZoom})`,
            filter: "contrast(1.1) saturate(.88) brightness(.82)",
          }}
        />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg,rgba(5,10,8,.62),rgba(5,10,8,.04) 42%,rgba(5,10,8,.94)),linear-gradient(90deg,rgba(5,10,8,.35),transparent 75%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: panelX,
          top: 280,
          bottom: 390,
          width: 12,
          background: "#D9C18D",
          opacity: .9,
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 82,
          top: 300,
          right: 80,
          opacity: title,
          transform: `translateX(${(1 - title) * -70}px)`,
        }}
      >
        <div style={{ color: "#E2C58D", fontSize: 18, fontWeight: 700, letterSpacing: 5 }}>
          03 / PERJALANAN
        </div>

        <div style={{ color: "#FFFFFF", fontSize: 48, fontWeight: 900, lineHeight: 1.06, marginTop: 18 }}>
          KEPEMIMPINAN
          <br />
          DITEMPA
          <br />
          PENGALAMAN
        </div>
      </div>

      <svg
        viewBox="0 0 1080 1920"
        width="100%"
        height="100%"
        style={{ position: "absolute", inset: 0 }}
      >
        <path
          d="M78 1450 C250 1330 390 1510 560 1400 S820 1290 1000 1370"
          fill="none"
          stroke="rgba(217,193,141,.28)"
          strokeWidth="14"
        />

        <path
          d="M78 1450 C250 1330 390 1510 560 1400 S820 1290 1000 1370"
          fill="none"
          stroke="#E7D2A1"
          strokeWidth="4"
          strokeDasharray="1200"
          strokeDashoffset={1200 * (1 - route)}
        />

        {[0, 1, 2, 3].map((i) => {
          const p = interpolate(frame, [208 + i * 12, 226 + i * 12], [0, 1], CLAMP);
          const xs = [78, 330, 590, 1000];
          const ys = [1450, 1415, 1390, 1370];

          return (
            <g key={i} opacity={p}>
              <circle cx={xs[i]} cy={ys[i]} r="24" fill="#17251F" stroke="#E7D2A1" strokeWidth="3" />
              <circle cx={xs[i]} cy={ys[i]} r="7" fill="#E7D2A1" />
            </g>
          );
        })}
      </svg>

      <div
        style={{
          position: "absolute",
          left: 82,
          right: 82,
          bottom: 350,
          color: "#F0E7D4",
          fontSize: 17,
          letterSpacing: 3,
          opacity: interpolate(frame, [244, 260, 294, 300], [0, 1, 1, 0], CLAMP),
        }}
      >
        PENGALAMAN / TANGGUNG JAWAB / KEPEMIMPINAN
      </div>

      <div
        style={{
          position: "absolute",
          inset: 48,
          border: "1px solid rgba(231,218,185,.35)",
        }}
      />
    </AbsoluteFill>
  );
};



/* =====================================================
   MAIN NARRATIVE VISUAL
===================================================== */

const NarrativeVisual: React.FC = () => {
  const frame = useCurrentFrame();

  const progress = interpolate(
    frame,
    [0, 300],
    [0, 100],
    CLAMP
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#101B18",
        overflow: "hidden",
      }}
    >

{/* ANALOG FILM GRAIN */}
<svg
  style={{
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    opacity: 0.12,
    mixBlendMode: "soft-light",
    pointerEvents: "none",
  }}
  viewBox="0 0 1080 1920"
  preserveAspectRatio="none"
>
  <filter id="orion-grain">
    <feTurbulence
      type="fractalNoise"
      baseFrequency="0.82"
      numOctaves="2"
      seed={Math.floor(frame / 3) % 97}
    />
    <feColorMatrix type="saturate" values="0" />
  </filter>
  <rect width="100%" height="100%" filter="url(#orion-grain)" />
</svg>

{/* CINEMATIC VIGNETTE */}
<AbsoluteFill
  style={{
    pointerEvents: "none",
    boxShadow: "inset 0 0 180px 45px #000c",
  }}
/>

{/* EDITORIAL SCANLINES */}
<AbsoluteFill
  style={{
    pointerEvents: "none",
    opacity: 0.16,
    background:
      "repeating-linear-gradient(0deg, transparent 0px, transparent 5px, #d8b87812 6px)",
  }}
/>

{/* MOVING LIGHT SWEEP */}
<div
  style={{
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 260,
    left: interpolate(
      frame,
      [0, durationInFrames],
      [-320, 1180],
      clamp
    ),
    transform: "skewX(-18deg)",
    background:
      "linear-gradient(90deg, transparent, #ffffff0b, transparent)",
    pointerEvents: "none",
  }}
/>
      {/* Three visual chapters */}
      <TrainingScene />
      <GraduationScene />
      <CareerScene />

      {/* Documentary identity */}
      <div
        style={{
          position: "absolute",
          top: 86,
          left: 76,
          color: "#D7C69B",
          fontSize: 17,
          fontWeight: 700,
          letterSpacing: 5,
          opacity: 0.9,
        }}
      >
        JEJAK LANGKAH / DOKUMENTER
      </div>

      {/* Original synchronized typography — unchanged */}
      <div
        style={{
          position: "absolute",
          left: 76,
          right: 76,
          bottom: 165,
          height: 120,
          zIndex: 20,
        }}
      >
        <AudioSyncedTypography
          words={prabowoWords}
          globalStartFrame={START_FRAME}
          accent="#E2C789"
        />
      </div>

      {/* Progress indicator */}
      <div
        style={{
          position: "absolute",
          left: 76,
          right: 76,
          bottom: 105,
          height: 3,
          background: "rgba(255,255,255,.22)",
          zIndex: 21,
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: "100%",
            background: "#D8BD82",
          }}
        />
      </div>

      {/* Film frame */}
      <div
        style={{
          position: "absolute",
          inset: 28,
          border: "1px solid rgba(231,218,185,.16)",
          pointerEvents: "none",
          zIndex: 19,
        }}
      />
    </AbsoluteFill>
  );
};

/* =====================================================
   REMOTION COMPOSITION
   AUDIO SETTINGS PRESERVED
===================================================== */

export const NarrativeVisualPrototype: React.FC = () => {
  return (
    <AbsoluteFill>
      <Audio
        src={staticFile(project.voiceoverSrc)}
        startFrom={START_FRAME}
        volume={1}
      />

      <NarrativeVisual />
    </AbsoluteFill>
  );
};
