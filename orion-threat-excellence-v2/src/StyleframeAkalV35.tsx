
import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";

const W = 1080;
const H = 1920;

const C = {
  bg: "#07152D",
  navy: "#0B1B35",
  orange: "#FF805C",
  gold: "#FFC66D",
  cyan: "#72D9F4",
  white: "#F7F8FC",
  muted: "#A8B6D0",
};

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const smooth = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });

const fadeOut = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [1, 0], clamp);

const Brain: React.FC<{ frame: number }> = ({ frame }) => {
  const entrance = smooth(frame, 5, 32);
  const pulse = 1 + Math.sin(frame * 0.12) * 0.025;
  const rotation = Math.sin(frame * 0.025) * 3;

  return (
    <g
      transform={`translate(540 650) scale(${entrance * pulse}) rotate(${rotation})`}
      opacity={entrance}
    >
      <ellipse
        cx="0"
        cy="15"
        rx="235"
        ry="210"
        fill={C.orange}
        opacity="0.08"
        filter="url(#glow)"
      />

      <path
        d="M-8 -145 C-75 -205 -170 -165 -170 -88
        C-250 -65 -240 45 -180 75
        C-190 160 -85 185 -28 130
        L-8 110 Z"
        fill={C.orange}
        stroke="#FFB08F"
        strokeWidth="8"
      />

      <path
        d="M8 -145 C75 -205 170 -165 170 -88
        C250 -65 240 45 180 75
        C190 160 85 185 28 130
        L8 110 Z"
        fill={C.orange}
        stroke="#FFB08F"
        strokeWidth="8"
      />

      <path
        d="M0 -145 L0 130 M-100 -115 Q-145 -65 -95 -20
        M-145 30 Q-90 10 -75 80 M-30 -90 Q-70 -50 -30 -15
        M100 -115 Q145 -65 95 -20 M145 30 Q90 10 75 80
        M30 -90 Q70 -50 30 -15"
        fill="none"
        stroke="#9F4E48"
        strokeWidth="9"
        strokeLinecap="round"
      />

      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2 + frame * 0.008;
        const r = 260 + Math.sin(frame * 0.06 + i) * 10;

        return (
          <circle
            key={i}
            cx={Math.cos(angle) * r}
            cy={Math.sin(angle) * r * 0.78}
            r={5 + (i % 3) * 2}
            fill={i % 2 ? C.gold : C.cyan}
            opacity={0.5 + Math.sin(frame * 0.1 + i) * 0.35}
          />
        );
      })}
    </g>
  );
};

const edges = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [0, 5], [5, 6], [6, 7], [7, 8],
  [2, 6], [1, 5], [3, 7], [4, 8],
  [5, 9], [6, 10], [7, 11], [9, 10],
  [10, 11], [8, 11], [2, 10], [4, 7],
];

const nodes = [
  [190, 490], [350, 390], [520, 470], [710, 350],
  [890, 490], [250, 740], [450, 680], [650, 760],
  [850, 700], [330, 980], [570, 1040], [790, 970],
];

const NeuralNetwork: React.FC<{ frame: number }> = ({ frame }) => {
  const reveal = smooth(frame, 145, 205);
  const drift = Math.sin(frame * 0.025) * 8;

  return (
    <g opacity={reveal}>
      {edges.map(([a, b], i) => {
        const p = smooth(frame, 155 + i * 2, 190 + i * 2);
        const A = nodes[a];
        const B = nodes[b];

        return (
          <line
            key={i}
            x1={A[0]}
            y1={A[1] + drift}
            x2={B[0]}
            y2={B[1] + drift}
            stroke={C.cyan}
            strokeWidth="3"
            strokeDasharray="400"
            strokeDashoffset={400 * (1 - p)}
            opacity="0.65"
          />
        );
      })}

      {nodes.map(([x, y], i) => {
        const pulse = 1 + Math.sin(frame * 0.1 + i) * 0.18;

        return (
          <g key={i}>
            <circle
              cx={x}
              cy={y + drift}
              r={25 * pulse}
              fill={C.cyan}
              opacity="0.12"
            />
            <circle cx={x} cy={y + drift} r="9" fill={C.white} />
            <circle cx={x} cy={y + drift} r="5" fill={C.cyan} />
          </g>
        );
      })}
    </g>
  );
};

const Label: React.FC<{
  frame: number;
  start: number;
  end: number;
  title: string;
  subtitle: string;
}> = ({ frame, start, end, title, subtitle }) => {
  const opacity =
    smooth(frame, start, start + 18) *
    fadeOut(frame, end - 18, end);

  const y = interpolate(frame, [start, start + 24], [45, 0], clamp);

  return (
    <g opacity={opacity} transform={`translate(0 ${y})`}>
      <text
        x={W / 2}
        y="1320"
        textAnchor="middle"
        fill={C.gold}
        fontSize="27"
        fontWeight="800"
        letterSpacing="7"
      >
        {title}
      </text>

      <text
        x={W / 2}
        y="1390"
        textAnchor="middle"
        fill={C.white}
        fontSize="34"
        fontWeight="500"
      >
        {subtitle}
      </text>
    </g>
  );
};

export const StyleframeAkalV35: React.FC = () => {
  const frame = useCurrentFrame();

  const scene1 = fadeOut(frame, 135, 165);
  const scene2 =
    smooth(frame, 140, 175) * fadeOut(frame, 285, 315);
  const scene3 = smooth(frame, 290, 330);

  const headlineOpacity = smooth(frame, 8, 32);

  const headlineScale = interpolate(
    frame,
    [8, 36],
    [0.82, 1],
    {
      ...clamp,
      easing: Easing.out(Easing.back(1.3)),
    }
  );

  const finalWords = [
    { word: "BERPIKIR.", start: 310 },
    { word: "MEMAHAMI.", start: 345 },
    { word: "BERTINDAK.", start: 380 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`}>
        <defs>
          <radialGradient id="backgroundGlow">
            <stop offset="0%" stopColor="#18385D" />
            <stop offset="100%" stopColor={C.bg} />
          </radialGradient>

          <filter id="glow">
            <feGaussianBlur stdDeviation="28" />
          </filter>

          <linearGradient id="lineGlow">
            <stop offset="0%" stopColor={C.cyan} stopOpacity="0" />
            <stop offset="50%" stopColor={C.cyan} />
            <stop offset="100%" stopColor={C.orange} stopOpacity="0" />
          </linearGradient>
        </defs>

        <rect
          width={W}
          height={H}
          fill="url(#backgroundGlow)"
        />

        <text
          x="70"
          y="85"
          fill={C.orange}
          fontSize="23"
          fontWeight="800"
          letterSpacing="4"
        >
          ORION / CREATIVE
        </text>

        <text
          x="1010"
          y="85"
          textAnchor="end"
          fill={C.muted}
          fontSize="18"
          letterSpacing="3"
        >
          MOTION STUDY / 01
        </text>

        {/* SCENE 1 — BRAIN */}
        <g opacity={scene1}>
          <Brain frame={frame} />

          <g
            opacity={headlineOpacity}
            transform={`translate(540 0) scale(${headlineScale}) translate(-540 0)`}
          >
            <text
              x="540"
              y="300"
              textAnchor="middle"
              fill={C.gold}
              fontSize="25"
              fontWeight="800"
              letterSpacing="5"
            >
              PERTANYAAN MENDASAR
            </text>

            <text
              x="540"
              y="390"
              textAnchor="middle"
              fill={C.white}
              fontSize="76"
              fontWeight="900"
            >
              APA ITU
            </text>

            <text
              x="540"
              y="475"
              textAnchor="middle"
              fill={C.orange}
              fontSize="86"
              fontWeight="900"
            >
              AKAL?
            </text>
          </g>

          <Label
            frame={frame}
            start={55}
            end={145}
            title="JEJAK INFORMASI"
            subtitle="Akal mengolah apa yang kita ketahui"
          />

          <circle
            cx="540"
            cy="1060"
            r={100 + Math.sin(frame * 0.08) * 12}
            fill="none"
            stroke={C.gold}
            strokeWidth="2"
            strokeDasharray="5 18"
            opacity="0.8"
          />
        </g>

        {/* SCENE 2 — NEURAL CONNECTION */}
        <g opacity={scene2}>
          <NeuralNetwork frame={frame} />

          <Label
            frame={frame}
            start={205}
            end={300}
            title="IDE TERHUBUNG"
            subtitle="Informasi membentuk pemahaman"
          />
        </g>

        {/* SCENE 3 — KINETIC TYPOGRAPHY */}
        <g opacity={scene3}>
          <rect
            x="120"
            y="560"
            width="840"
            height="3"
            fill="url(#lineGlow)"
          />

          {finalWords.map(({ word, start }, i) => {
            const p = smooth(frame, start, start + 20);

            const scale = interpolate(
              frame,
              [start, start + 20],
              [0.75, 1],
              {
                ...clamp,
                easing: Easing.out(Easing.back(1.2)),
              }
            );

            return (
              <g
                key={word}
                opacity={p}
                transform={`translate(540 ${760 + i * 120}) scale(${scale}) translate(-540 0)`}
              >
                <text
                  x="540"
                  y="0"
                  textAnchor="middle"
                  fill={i === 2 ? C.orange : C.white}
                  fontSize="76"
                  fontWeight="900"
                  letterSpacing="1"
                >
                  {word}
                </text>
              </g>
            );
          })}

          <text
            x="540"
            y="1190"
            textAnchor="middle"
            fill={C.muted}
            fontSize="28"
          >
            Berpikir sebelum bertindak.
          </text>

          <circle
            cx="540"
            cy="1320"
            r={70 + Math.sin(frame * 0.08) * 8}
            fill="none"
            stroke={C.orange}
            strokeWidth="3"
            opacity="0.6"
          />
        </g>

        {/* FOOTER */}
        <rect
          x="70"
          y="1780"
          width="940"
          height="2"
          fill="#52647E"
          opacity="0.6"
        />

        <rect
          x="70"
          y="1780"
          width={940 * (frame / 450)}
          height="4"
          fill={C.orange}
        />

        <text
          x="70"
          y="1830"
          fill={C.muted}
          fontSize="18"
          letterSpacing="2"
        >
          THINK / UNDERSTAND / ACT
        </text>

        <text
          x="1010"
          y="1830"
          textAnchor="end"
          fill={C.orange}
          fontSize="20"
          fontWeight="800"
        >
          ORION / 35
        </text>
      </svg>
    </AbsoluteFill>
  );
};
