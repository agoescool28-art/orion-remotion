
import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  Easing,
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

const ease = (
  frame: number,
  input: number[],
  output: number[]
) =>
  interpolate(frame, input, output, {
    ...CLAMP,
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });

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

  const entrance = spring({
    frame: frame - 96,
    fps,
    config: {
      damping: 18,
      stiffness: 75,
      mass: 1.1,
    },
  });

  const certificate = spring({
    frame: frame - 143,
    fps,
    config: {
      damping: 14,
      stiffness: 90,
    },
  });

  const glow = interpolate(
    frame,
    [108, 165, 205],
    [0, 0.8, 0],
    CLAMP
  );

  const opacity = interpolate(
    frame,
    [88, 104, 188, 210],
    [0, 1, 1, 0],
    CLAMP
  );

  return (
    <AbsoluteFill
      style={{
        opacity,
        overflow: "hidden",
      }}
    >
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg,#24372F 0%,#35483D 55%,#111D18 100%)",
        }}
      />

      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1080 1920"
        style={{
          position: "absolute",
          inset: 0,
        }}
      >
        <defs>
          <linearGradient
            id="gradStone"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop offset="0%" stopColor="#D9CFB2" />
            <stop offset="100%" stopColor="#817D68" />
          </linearGradient>

          <linearGradient
            id="gradGold"
            x1="0"
            y1="0"
            x2="1"
            y2="1"
          >
            <stop offset="0%" stopColor="#F3E2B7" />
            <stop offset="100%" stopColor="#A88A55" />
          </linearGradient>

          <radialGradient id="gradHalo">
            <stop
              offset="0%"
              stopColor="#EBD7A6"
              stopOpacity=".6"
            />
            <stop
              offset="100%"
              stopColor="#EBD7A6"
              stopOpacity="0"
            />
          </radialGradient>
        </defs>

        {/* Atmospheric glow */}
        <ellipse
          cx="540"
          cy="660"
          rx="490"
          ry="500"
          fill="url(#gradHalo)"
          opacity={glow}
        />

        {/* Academy architecture */}
        <g
          transform={`translate(0 ${
            interpolate(entrance, [0, 1], [150, 0])
          })`}
        >
          <path
            d="M75 1120 L540 650 L1005 1120Z"
            fill="#6C7668"
            opacity=".55"
          />

          <path
            d="M145 1120 L540 760 L935 1120Z"
            fill="url(#gradStone)"
          />

          <rect
            x="190"
            y="1090"
            width="700"
            height="450"
            fill="#A9A38C"
          />

          <rect
            x="220"
            y="1120"
            width="640"
            height="390"
            fill="#C9C0A5"
          />

          <path
            d="M170 1090 H910 L940 1130 H140Z"
            fill="#E1D6B8"
          />

          {/* Columns */}
          {Array.from({ length: 6 }).map((_, i) => {
            const x = 260 + i * 112;

            return (
              <g key={i}>
                <rect
                  x={x}
                  y="1170"
                  width="34"
                  height="340"
                  fill="#777D6D"
                />

                <rect
                  x={x - 8}
                  y="1160"
                  width="50"
                  height="18"
                  fill="#E2D7B9"
                />

                <rect
                  x={x - 8}
                  y="1498"
                  width="50"
                  height="20"
                  fill="#777D6D"
                />
              </g>
            );
          })}

          {/* Main entrance */}
          <rect
            x="470"
            y="1280"
            width="140"
            height="230"
            fill="#26372F"
          />

          <path
            d="M470 1280 Q540 1195 610 1280"
            fill="#26372F"
          />

          {/* Ceremonial stage */}
          <path
            d="M210 1540 H870 L930 1600 H150Z"
            fill="#4B5C50"
          />

          <path
            d="M150 1600 H930 L1000 1660 H80Z"
            fill="#273A31"
          />
        </g>

        {/* Light beams */}
        <g opacity={glow * 0.2}>
          <path
            d="M540 260 L760 1300 H640Z"
            fill="#F2DCA9"
          />

          <path
            d="M540 260 L420 1300 H300Z"
            fill="#F2DCA9"
          />
        </g>

        {/* Diploma reveal */}
        <g
          transform={`translate(540 ${
            1110 - certificate * 170
          }) rotate(${-5 + certificate * 5})`}
          opacity={certificate}
        >
          <rect
            x="-165"
            y="-115"
            width="330"
            height="230"
            rx="8"
            fill="#E8DFC7"
            stroke="#B79A62"
            strokeWidth="8"
          />

          <rect
            x="-140"
            y="-90"
            width="280"
            height="180"
            fill="none"
            stroke="#A88A55"
            strokeWidth="2"
          />

          <path
            d="M-85 -42 H85 M-65 -12 H65 M-75 18 H75"
            stroke="#81765D"
            strokeWidth="5"
            opacity=".65"
          />

          <circle
            cx="0"
            cy="55"
            r="22"
            fill="url(#gradGold)"
          />

          <path
            d="M-8 75 L-18 120 L0 106 L18 120 L8 75"
            fill="#A88A55"
          />
        </g>

        {/* Timeline marker */}
        <path
          d="M76 1680 H1004"
          stroke="#D9C493"
          strokeWidth="2"
          opacity=".55"
        />

        <circle
          cx={interpolate(
            frame,
            [112, 180],
            [76, 1004],
            CLAMP
          )}
          cy="1680"
          r="9"
          fill="#E5D1A0"
        />
      </svg>

      <SceneLabel
        number="02"
        eyebrow="1974"
        title="KELULUSAN AKABRI"
        frame={frame}
        start={100}
      />

      <div
        style={{
          position: "absolute",
          left: 76,
          top: 390,
          width: 760,
          color: "#EDE5D4",
          fontSize: 21,
          lineHeight: 1.5,
          letterSpacing: 2,
          opacity: interpolate(
            frame,
            [120, 142, 180, 198],
            [0, 1, 1, 0],
            CLAMP
          ),
        }}
      >
        SEBUAH TAHAP BERAKHIR.
        PERJALANAN PENGABDIAN DIMULAI.
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
  const { fps } = useVideoConfig();

  const opacity = interpolate(
    frame,
    [178, 194, 300],
    [0, 1, 1],
    CLAMP
  );

  const progress = interpolate(
    frame,
    [196, 292],
    [0, 1],
    CLAMP
  );

  const nodes = [0.12, 0.36, 0.62, 0.88];

  const buildings = [
    { x: 145, y: 1300, w: 100, h: 150 },
    { x: 365, y: 1190, w: 115, h: 260 },
    { x: 600, y: 1060, w: 125, h: 390 },
    { x: 845, y: 900, w: 145, h: 550 },
  ];

  return (
    <AbsoluteFill
      style={{
        opacity,
        overflow: "hidden",
        background:
          "linear-gradient(155deg,#14231D 0%,#263B31 55%,#101A16 100%)",
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1080 1920"
        style={{
          position: "absolute",
          inset: 0,
        }}
      >
        <defs>
          <linearGradient
            id="careerLine"
            x1="0"
            y1="0"
            x2="1"
            y2="0"
          >
            <stop offset="0%" stopColor="#8F9A83" />
            <stop offset="100%" stopColor="#E6CC91" />
          </linearGradient>

          <linearGradient
            id="careerBlock"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop offset="0%" stopColor="#75816D" />
            <stop offset="100%" stopColor="#35483B" />
          </linearGradient>
        </defs>

        {/* Background grid */}
        {Array.from({ length: 8 }).map((_, i) => (
          <path
            key={`v-${i}`}
            d={`M${80 + i * 130} 620 V1630`}
            stroke="#D6C69E"
            strokeWidth="1"
            opacity=".08"
          />
        ))}

        {Array.from({ length: 7 }).map((_, i) => (
          <path
            key={`h-${i}`}
            d={`M70 ${760 + i * 130} H1010`}
            stroke="#D6C69E"
            strokeWidth="1"
            opacity=".08"
          />
        ))}

        {/* Career path shadow */}
        <path
          d="M95 1430 C300 1360 350 1280 500 1250 S760 1080 980 950"
          stroke="#07110D"
          strokeWidth="22"
          fill="none"
          opacity=".55"
        />

        {/* Animated career path */}
        <path
          d="M95 1430 C300 1360 350 1280 500 1250 S760 1080 980 950"
          stroke="url(#careerLine)"
          strokeWidth="7"
          strokeDasharray="1200"
          strokeDashoffset={1200 * (1 - progress)}
          fill="none"
          strokeLinecap="round"
        />

        {/* Growth structures */}
        {buildings.map((b, i) => {
          const reveal = interpolate(
            frame,
            [200 + i * 13, 225 + i * 13],
            [0, 1],
            CLAMP
          );

          return (
            <g key={i} opacity={reveal}>
              <rect
                x={b.x}
                y={b.y}
                width={b.w}
                height={b.h}
                fill="url(#careerBlock)"
                opacity=".78"
              />

              {Array.from({ length: 4 }).map((_, j) => (
                <path
                  key={j}
                  d={`M${b.x + 15} ${
                    b.y + 35 + j * 28
                  } H${b.x + b.w - 15}`}
                  stroke="#D7C69D"
                  strokeWidth="3"
                  opacity=".35"
                />
              ))}

              <path
                d={`M${b.x - 12} ${b.y} H${b.x + b.w + 12}`}
                stroke="#E2C88F"
                strokeWidth="4"
                opacity=".8"
              />
            </g>
          );
        })}

        {/* Milestone nodes */}
        {nodes.map((n, i) => {
          const x = 95 + n * 885;
          const y = 1430 - n * 480;

          const reveal = spring({
            frame: frame - (205 + i * 16),
            fps,
            config: {
              damping: 12,
              stiffness: 100,
            },
          });

          return (
            <g
              key={i}
              transform={`translate(${x} ${y}) scale(${reveal})`}
            >
              <circle
                r="28"
                fill="#192A22"
                stroke="#E4CB94"
                strokeWidth="5"
              />

              <circle
                r="9"
                fill="#E4CB94"
              />

              <circle
                r="43"
                fill="none"
                stroke="#E4CB94"
                strokeWidth="2"
                opacity=".22"
              />
            </g>
          );
        })}

        {/* Destination marker */}
        <g
          opacity={interpolate(
            frame,
            [260, 280],
            [0, 1],
            CLAMP
          )}
        >
          <path
            d="M980 820 V940"
            stroke="#E4CB94"
            strokeWidth="5"
          />

          <path
            d="M980 820 L1050 845 L980 870Z"
            fill="#E4CB94"
          />
        </g>
      </svg>

      <SceneLabel
        number="03"
        eyebrow="PERJALANAN"
        title="LANGKAH MENUJU KEPEMIMPINAN"
        frame={frame}
        start={190}
      />

      <div
        style={{
          position: "absolute",
          left: 78,
          right: 78,
          top: 390,
          color: "#D8CBAE",
          fontSize: 19,
          letterSpacing: 3,
          lineHeight: 1.5,
          opacity: interpolate(
            frame,
            [210, 232, 285, 300],
            [0, 1, 1, 0],
            CLAMP
          ),
        }}
      >
        PENGALAMAN, TANGGUNG JAWAB,
        DAN KEPUTUSAN MEMBENTUK PERJALANAN.
      </div>
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
