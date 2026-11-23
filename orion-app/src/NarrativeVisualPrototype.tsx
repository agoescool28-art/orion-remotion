
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
   SCENE 01 — PENDIDIKAN MILITER
   Documentary photography treatment
===================================================== */

const TrainingScene: React.FC = () => {
  const frame = useCurrentFrame();

  const scale = interpolate(
    frame,
    [0, 112],
    [1.04, 1.17],
    CLAMP
  );

  const shiftX = interpolate(
    frame,
    [0, 112],
    [0, -32],
    CLAMP
  );

  const sweep = interpolate(
    frame,
    [12, 94],
    [-380, 1180],
    CLAMP
  );

  const opacity = interpolate(
    frame,
    [0, 8, 98, 116],
    [0, 1, 1, 0],
    CLAMP
  );

  return (
    <AbsoluteFill style={{ opacity, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          overflow: "hidden",
          backgroundColor: "#17241F",
        }}
      >
        <Img
          src={staticFile("academy-cadets.jpg")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center 42%",
            transform: `translateX(${shiftX}px) scale(${scale})`,
            filter: "contrast(1.08) saturate(.72) sepia(.12)",
          }}
        />

        {/* Cinematic vignette */}
        <AbsoluteFill
          style={{
            background:
              "linear-gradient(180deg, rgba(8,15,12,.46) 0%, rgba(8,15,12,.05) 36%, rgba(8,15,12,.2) 62%, rgba(8,15,12,.94) 100%)",
          }}
        />

        <AbsoluteFill
          style={{
            background:
              "linear-gradient(90deg, rgba(8,15,12,.35), transparent 42%, rgba(8,15,12,.18))",
          }}
        />

        {/* Moving cinematic light */}
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            width: 260,
            transform: `translateX(${sweep}px) skewX(-18deg)`,
            background:
              "linear-gradient(90deg, transparent, rgba(235,215,169,.13), transparent)",
          }}
        />

        {/* Documentary frame */}
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1080 1920"
          style={{
            position: "absolute",
            inset: 0,
          }}
        >
          <g
            fill="none"
            stroke="#E5D5B0"
            strokeWidth="3"
            opacity=".7"
          >
            <path d="M64 150 V90 H124" />
            <path d="M956 90 H1016 V150" />
            <path d="M64 1770 V1830 H124" />
            <path d="M956 1830 H1016 V1770" />
          </g>

          <path
            d="M72 1550 H1008"
            stroke="#E5D5B0"
            strokeWidth="1"
            opacity=".2"
          />

          <text
            x="78"
            y="1740"
            fill="#E8D9B9"
            fontSize="17"
            letterSpacing="5"
            opacity=".75"
          >
            ARSIP PENDIDIKAN MILITER
          </text>

          <text
            x="1000"
            y="1740"
            fill="#E8D9B9"
            fontSize="17"
            textAnchor="end"
            letterSpacing="3"
            opacity=".75"
          >
            INDONESIA
          </text>
        </svg>
      </AbsoluteFill>

      <SceneLabel
        number="01"
        eyebrow="PEMBENTUKAN"
        title="DISIPLIN DAN PENGABDIAN"
        frame={frame}
        start={5}
      />
    </AbsoluteFill>
  );
};

/* =====================================================
   SCENE 02 — KELULUSAN AKABRI
   Layered architecture + diploma reveal
===================================================== */


const GraduationScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(
    frame,
    [88, 103, 192, 210],
    [0, 1, 1, 0],
    CLAMP
  );

  const photoIn = spring({
    frame: frame - 100,
    fps,
    config: { damping: 18, stiffness: 65 },
  });

  const photoScale = interpolate(
    frame,
    [100, 205],
    [1.16, 1.02],
    CLAMP
  );

  const dateReveal = spring({
    frame: frame - 125,
    fps,
    config: { damping: 15, stiffness: 90 },
  });

  const lineProgress = interpolate(
    frame,
    [112, 165],
    [0, 1],
    CLAMP
  );

  return (
    <AbsoluteFill
      style={{
        opacity,
        overflow: "hidden",
        backgroundColor: "#111B18",
      }}
    >
      {/* Archival photograph */}
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <Img
          src={staticFile("1000827932.jpg.jpeg")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center 35%",
            transform: `scale(${photoScale}) translateY(${(1-photoIn)*45}px)`,
            filter: "grayscale(1) contrast(1.08) brightness(.78)",
          }}
        />

        <AbsoluteFill
          style={{
            background:
              "linear-gradient(90deg,rgba(8,15,12,.78),rgba(8,15,12,.12) 90%),linear-gradient(0deg,rgba(8,15,12,.88),transparent 65%)",
          }}
        />
      </AbsoluteFill>

      {/* Archival document treatment */}
      <AbsoluteFill
        style={{
          border: "1px solid rgba(225,205,157,.45)",
          margin: 48,
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 330,
          left: 78,
          right: 65,
          opacity: dateReveal,
          transform: `translateY(${(1-dateReveal)*35}px)`,
        }}
      >
        <div
          style={{
            color: "#D9C18D",
            fontSize: 18,
            letterSpacing: 6,
            fontWeight: 700,
          }}
        >
          ARSIP PERJALANAN
        </div>

        <div
          style={{
            color: "#F3EBDD",
            fontSize: 112,
            fontWeight: 900,
            letterSpacing: -5,
            marginTop: 15,
            lineHeight: 1,
          }}
        >
          1974
        </div>

        <div
          style={{
            width: `${lineProgress * 250}px`,
            height: 4,
            background: "#D9C18D",
            marginTop: 25,
          }}
        />

        <div
          style={{
            color: "#F3EBDD",
            fontSize: 29,
            fontWeight: 800,
            marginTop: 22,
            letterSpacing: 1,
          }}
        >
          LULUS AKABRI
        </div>

        <div
          style={{
            color: "#D8CBAE",
            fontSize: 17,
            letterSpacing: 3,
            marginTop: 12,
          }}
        >
          AWAL PERJALANAN PENGABDIAN
        </div>
      </div>

      {/* Archival registration mark */}
      <div
        style={{
          position: "absolute",
          right: 80,
          bottom: 360,
          color: "#D9C18D",
          fontSize: 16,
          letterSpacing: 4,
          opacity: interpolate(
            frame,
            [140, 160],
            [0, 0.8],
            CLAMP
          ),
        }}
      >
        DOKUMENTASI HISTORIS
      </div>
    </AbsoluteFill>
  );
};


/* =====================================================
   SCENE 03 — PERJALANAN KARIER
   Timeline progression + milestone animation
===================================================== */


const CareerScene: React.FC = () => {
  const frame = useCurrentFrame();

  const opacity = interpolate(
    frame,
    [178, 194, 300],
    [0, 1, 1],
    CLAMP
  );

  const photoOne = interpolate(
    frame,
    [190, 222, 235],
    [1, 1, 0],
    CLAMP
  );

  const photoTwo = interpolate(
    frame,
    [222, 240, 300],
    [0, 1, 1],
    CLAMP
  );

  const scaleOne = interpolate(
    frame,
    [190, 235],
    [1.12, 1],
    CLAMP
  );

  const scaleTwo = interpolate(
    frame,
    [225, 300],
    [1.16, 1.02],
    CLAMP
  );

  const reveal = spring({
    frame: frame - 198,
    fps: 30,
    config: { damping: 18, stiffness: 75 },
  });

  const scan = interpolate(
    frame,
    [198, 290],
    [-200, 1200],
    CLAMP
  );

  return (
    <AbsoluteFill
      style={{
        opacity,
        overflow: "hidden",
        backgroundColor: "#111B18",
      }}
    >
      {/* Photograph 1: field leadership */}
      <AbsoluteFill
        style={{
          opacity: photoOne,
          overflow: "hidden",
        }}
      >
        <Img
          src={staticFile("1000827935.jpg.jpeg")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center center",
            transform: `scale(${scaleOne})`,
            filter: "contrast(1.08) saturate(.78)",
          }}
        />
      </AbsoluteFill>

      {/* Photograph 2: military portrait */}
      <AbsoluteFill
        style={{
          opacity: photoTwo,
          overflow: "hidden",
        }}
      >
        <Img
          src={staticFile("1000827941.jpg.jpeg")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center 35%",
            transform: `scale(${scaleTwo})`,
            filter: "contrast(1.08) saturate(.82)",
          }}
        />
      </AbsoluteFill>

      {/* Cinematic dark overlay */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg,rgba(8,15,12,.35) 0%,rgba(8,15,12,.05) 35%,rgba(8,15,12,.9) 100%)",
        }}
      />

      {/* Moving editorial scan line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          width: 2,
          left: scan,
          background:
            "linear-gradient(180deg,transparent,#E4CB94,transparent)",
          opacity: 0.65,
        }}
      />

      {/* Chapter title */}
      <div
        style={{
          position: "absolute",
          left: 76,
          top: 280,
          right: 70,
          opacity: reveal,
          transform: `translateY(${(1-reveal)*30}px)`,
        }}
      >
        <div
          style={{
            color: "#E2C58D",
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: 5,
          }}
        >
          03 / PERJALANAN
        </div>

        <div
          style={{
            color: "#FFFFFF",
            fontSize: 44,
            fontWeight: 900,
            lineHeight: 1.12,
            marginTop: 16,
          }}
        >
          DI LINGKUNGAN
          ANGKATAN
        </div>
      </div>

      {/* Documentary caption */}
      <div
        style={{
          position: "absolute",
          left: 78,
          right: 78,
          bottom: 350,
          color: "#F0E7D4",
          fontSize: 18,
          letterSpacing: 3,
          opacity: interpolate(
            frame,
            [215, 238, 285, 300],
            [0, 1, 1, 0],
            CLAMP
          ),
        }}
      >
        PENGALAMAN DAN TANGGUNG JAWAB
        MEMBENTUK PERJALANAN
      </div>

      {/* Documentary frame */}
      <div
        style={{
          position: "absolute",
          inset: 48,
          border: "1px solid rgba(231,218,185,.35)",
          pointerEvents: "none",
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
