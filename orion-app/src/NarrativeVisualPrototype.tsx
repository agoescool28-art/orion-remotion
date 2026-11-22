
import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";

import { project } from "./project";
import { prabowoWords } from "./audio/prabowo.words";
import { AudioSyncedTypography } from "./audio/AudioSyncedTypography";

const START_SECONDS = 21.5;
const START_FRAME = Math.round(START_SECONDS * 30);
const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const Cadet: React.FC<{
  x: number;
  delay: number;
  scale: number;
}> = ({ x, delay, scale }) => {
  const frame = useCurrentFrame();

  const y = interpolate(frame - delay, [0, 24], [70, 0], clamp);
  const opacity = interpolate(frame - delay, [0, 18], [0, 1], clamp);
  const step = Math.sin((frame - delay) / 5) * 4;

  return (
    <g
      transform={`translate(${x} ${y + step}) scale(${scale})`}
      opacity={opacity}
    >
      <ellipse cy="0" rx="25" ry="7" fill="#05090D" opacity=".5" />
      <path d="M-15 -95 L15 -95 L21 -32 L-21 -32Z" fill="#1D3430" />
      <circle cy="-112" r="12" fill="#B98763" />
      <path d="M-14 -123 L14 -123 L9 -132 L-9 -132Z" fill="#C6AD76" />
      <path
        d="M-10 -32 L-17 0 L-4 0 L2 -31 M8 -32 L5 0 L19 0 L17 -32"
        fill="#101A1E"
      />
      <path
        d="M-18 -85 L-36 -50 M18 -85 L34 -52"
        stroke="#B98763"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path d="M-5 -92 L5 -92 L5 -42 L-5 -42Z" fill="#C6AD76" />
    </g>
  );
};

const AcademyVisual: React.FC = () => {
  const frame = useCurrentFrame();

  const push = interpolate(frame, [0, 300], [1, 1.13], clamp);
  const drift = interpolate(frame, [0, 300], [12, -18], clamp);
  const year = interpolate(frame, [145, 205], [0, 1], clamp);
  const sweep = interpolate(frame, [0, 300], [-500, 1500], clamp);
  const progress = interpolate(frame, [20, 120], [0, 100], clamp);

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(ellipse at 50% 30%, #53625B, #263638 42%, #10191D 82%)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: -70,
          transform: `translateX(${drift}px) scale(${push})`,
        }}
      >
        <svg viewBox="0 0 1080 1920" width="100%" height="100%">
          <defs>
            <linearGradient id="facadeV5" x1="0" y1="0" x2="1" y2="1">
              <stop stopColor="#D7CBAA" />
              <stop offset="1" stopColor="#69766E" />
            </linearGradient>

            <linearGradient id="beamV5">
              <stop stopColor="#F2DCA4" stopOpacity="0" />
              <stop offset=".5" stopColor="#F2DCA4" stopOpacity=".25" />
              <stop offset="1" stopColor="#F2DCA4" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Latar dan lapangan */}
          <path d="M0 1050 L1080 930 V1920 H0Z" fill="#172629" />

          {/* Gedung akademi */}
          <path d="M115 900 L540 580 L965 900Z" fill="#56645D" />
          <path d="M165 900 L540 620 L915 900Z" fill="url(#facadeV5)" />
          <path d="M190 900 H890 V1330 H190Z" fill="#A9A58F" />
          <path d="M190 900 L540 650 L890 900Z" fill="#D4C8A8" />

          <path
            d="M170 900 L540 630 L910 900"
            fill="none"
            stroke="#E8DDBD"
            strokeWidth="16"
          />

          {/* Pilar gedung */}
          {Array.from({ length: 6 }).map((_, i) => (
            <g key={i} transform={`translate(${245 + i * 118} 925)`}>
              <rect width="38" height="365" fill="#D8CBA9" />
              <rect
                x="8"
                width="8"
                height="365"
                fill="#F4E8C8"
                opacity=".45"
              />
            </g>
          ))}

          {/* Pintu utama */}
          <rect x="470" y="1050" width="140" height="280" fill="#1B2B2D" />

          <text
            x="540"
            y="858"
            textAnchor="middle"
            fill="#35433D"
            fontSize="30"
            fontWeight="700"
            letterSpacing="7"
          >
            AKADEMI MILITER
          </text>

          {/* Tangga */}
          <path d="M190 1330 H890 L950 1400 H130Z" fill="#7B857A" />
          <path d="M130 1400 H950 L1010 1470 H70Z" fill="#465A57" />

          {/* Perspektif lapangan */}
          <path
            d="M540 1480 L0 1920 M540 1480 L1080 1920"
            stroke="#C5B998"
            strokeWidth="3"
            opacity=".2"
          />

          {/* Taruna */}
          <Cadet x={330} delay={8} scale={1} />
          <Cadet x={470} delay={20} scale={1.2} />
          <Cadet x={625} delay={32} scale={1.12} />
          <Cadet x={770} delay={44} scale={0.96} />

          {/* Cahaya bergerak */}
          <path
            d={`M${sweep} 0 L${sweep + 250} 0 L${sweep - 180} 1920 L${sweep - 430} 1920Z`}
            fill="url(#beamV5)"
          />
        </svg>
      </div>

      {/* Identitas editorial */}
      <div
        style={{
          position: "absolute",
          top: 120,
          left: 76,
          color: "#D5C49A",
          fontSize: 24,
          letterSpacing: 7,
          fontWeight: 700,
        }}
      >
        JEJAK LANGKAH
      </div>

      {/* Informasi visual */}
      <div
        style={{
          position: "absolute",
          left: 76,
          right: 76,
          bottom: 265,
        }}
      >
        <div
          style={{
            color: "#D5C49A",
            fontSize: 22,
            letterSpacing: 5,
          }}
        >
          PENDIDIKAN MILITER
        </div>

        <div
          style={{
            marginTop: 14,
            color: "#F4F0E6",
            fontSize: 68,
            lineHeight: 0.98,
            fontWeight: 900,
            letterSpacing: -2,
          }}
        >
          DISIPLIN
          <br />
          MEMBENTUK
          <br />
          KARAKTER
        </div>

        {/* Timeline progresif */}
        <div
          style={{
            marginTop: 28,
            height: 3,
            background: "rgba(240,230,205,.25)",
          }}
        >
          <div
            style={{
              height: 3,
              width: `${progress}%`,
              background: "#D5C49A",
            }}
          />
        </div>

        {/* Tahun kelulusan */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            marginTop: 18,
            opacity: year,
          }}
        >
          <span
            style={{
              color: "#E5C77F",
              fontSize: 60,
              fontWeight: 900,
            }}
          >
            1974
          </span>

          <span
            style={{
              color: "#EEE7D7",
              fontSize: 20,
              letterSpacing: 3,
            }}
          >
            LULUS DARI AKABRI
          </span>
        </div>
      </div>

      {/* Kinetic typography sinkron VO */}
      <div
        style={{
          position: "absolute",
          left: 76,
          right: 76,
          bottom: 105,
          height: 115,
        }}
      >
        <AudioSyncedTypography
          words={prabowoWords}
          globalStartFrame={START_FRAME}
          accent="#E5C77F"
        />
      </div>

      {/* Progress bar video */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: 10,
          width: "100%",
          background: "rgba(255,255,255,.12)",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${frame / 3}%`,
            background: "#D5C49A",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

export const NarrativeVisualPrototype: React.FC = () => {
  return (
    <AbsoluteFill>
      <Audio
        src={staticFile(project.voiceoverSrc)}
        startFrom={START_FRAME}
        volume={1}
      />
      <AcademyVisual />
    </AbsoluteFill>
  );
};
