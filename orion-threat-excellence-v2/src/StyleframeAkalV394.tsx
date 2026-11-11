import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";

const W = 1080;
const H = 1920;
const DURATION = 300;

const C = {
  bg: "#101E2D",
  bg2: "#172B3E",
  white: "#FFFDF8",
  muted: "#A9B8C5",
  orange: "#FF8752",
  teal: "#72C7B7",
  lilac: "#B9A5E3",
  blue: "#78A9D8",
  line: "#456176",
  card: "#F5F0E7",
};

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const ease = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });

const springPop = (f: number, at: number, duration = 24) =>
  interpolate(f, [at, at + duration], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.back(1.25)),
  });

type Point = { x: number; y: number };

const input: Point[] = [
  { x: 220, y: 740 }, { x: 500, y: 650 }, { x: 820, y: 760 },
  { x: 280, y: 1000 }, { x: 560, y: 930 }, { x: 850, y: 1080 },
  { x: 200, y: 1280 }, { x: 500, y: 1370 }, { x: 810, y: 1300 },
];

const network: Point[] = [
  { x: 300, y: 800 }, { x: 540, y: 760 }, { x: 780, y: 800 },
  { x: 300, y: 1030 }, { x: 540, y: 1030 }, { x: 780, y: 1030 },
  { x: 300, y: 1260 }, { x: 540, y: 1300 }, { x: 780, y: 1260 },
];

// A single connected decision path. The edge endpoints and node centers
// are both derived from the same interpolated positions below.
const decision: Point[] = [
  { x: 540, y: 670 }, { x: 540, y: 850 }, { x: 540, y: 1030 },
  { x: 540, y: 1210 }, { x: 540, y: 1390 }, { x: 350, y: 850 },
  { x: 730, y: 850 }, { x: 350, y: 1210 }, { x: 730, y: 1210 },
];

const edges: [number, number][] = [
  [0, 1], [1, 2], [0, 3], [1, 3], [1, 4], [1, 5], [2, 5],
  [3, 4], [4, 5], [3, 6], [3, 7], [4, 7], [4, 8], [5, 8],
  [6, 7], [7, 8],
];

const colors = [C.orange, C.teal, C.lilac, C.blue, C.orange, C.teal, C.lilac, C.blue, C.orange];

const pointAt = (i: number, f: number): Point => {
  const a = ease(f, 60, 120);
  const b = ease(f, 165, 238);
  const x1 = input[i].x + (network[i].x - input[i].x) * a;
  const y1 = input[i].y + (network[i].y - input[i].y) * a;
  return {
    x: x1 + (decision[i].x - x1) * b,
    y: y1 + (decision[i].y - y1) * b,
  };
};

const BackgroundGrid: React.FC<{ f: number }> = ({ f }) => {
  const opacity = 0.28 * (1 - ease(f, 270, 299) * 0.5);
  const drift = interpolate(f, [0, 299], [0, -34], clamp);
  return (
    <g opacity={opacity} transform={`translate(${drift} 0)`}>
      {Array.from({ length: 13 }, (_, i) => (
        <line key={`v${i}`} x1={i * 100} y1="0" x2={i * 100} y2={H}
          stroke={C.line} strokeWidth="1" />
      ))}
      {Array.from({ length: 21 }, (_, i) => (
        <line key={`h${i}`} x1="0" y1={i * 100} x2={W} y2={i * 100}
          stroke={C.line} strokeWidth="1" />
      ))}
    </g>
  );
};

const InputCards: React.FC<{ f: number }> = ({ f }) => {
  const cards = [
    { x: 205, y: 770, angle: -8, label: "FAKTA", color: C.orange, start: 0 },
    { x: 540, y: 650, angle: 4, label: "DATA", color: C.teal, start: 8 },
    { x: 870, y: 800, angle: 8, label: "IDE", color: C.lilac, start: 16 },
  ];
  const fade = 1 - ease(f, 72, 112);
  return (
    <g opacity={fade}>
      {cards.map((card, i) => {
        const t = springPop(f, 7 + card.start, 26);
        const settle = ease(f, 30 + card.start, 62 + card.start);
        const x = card.x + (i - 1) * 105 * (1 - settle);
        const y = card.y - 90 * (1 - t);
        const rotation = card.angle * (1 - settle);
        return (
          <g key={card.label} transform={`translate(${x} ${y}) rotate(${rotation}) scale(${0.88 + 0.12 * t})`}>
            <rect x="-116" y="-74" width="232" height="148" rx="22" fill="#000" opacity=".22" transform="translate(0 12)" />
            <rect x="-116" y="-74" width="232" height="148" rx="22" fill={C.card} />
            <rect x="-88" y="-44" width="32" height="32" rx="9" fill={card.color} />
            <text x="-42" y="-19" fill={C.bg} fontSize="22" fontWeight="900" letterSpacing="1.5">{card.label}</text>
            <rect x="-88" y="10" width="170" height="8" rx="4" fill={C.bg} opacity=".18" />
            <rect x="-88" y="31" width={105 + i * 17} height="8" rx="4" fill={C.bg} opacity=".12" />
          </g>
        );
      })}
    </g>
  );
};

const NetworkTransform: React.FC<{ f: number }> = ({ f }) => {
  const focus = ease(f, 174, 228);
  const pulse = 1 + Math.sin(f * 0.17) * 0.045;
  const cameraScale = interpolate(f, [0, 75, 155, 235, 299], [0.93, 1.0, 1.045, 1.015, 1.055], clamp);
  const cameraX = interpolate(f, [0, 90, 190, 299], [22, 0, -15, 0], clamp);
  const cameraY = interpolate(f, [0, 90, 190, 299], [20, 0, -18, 0], clamp);

  return (
    <g transform={`translate(${540 + cameraX} ${960 + cameraY}) scale(${cameraScale}) translate(-540 -960)`}>
      {/* Edges use the exact same pointAt() function as nodes, preventing detached lines. */}
      {edges.map(([from, to], index) => {
        const p1 = pointAt(from, f);
        const p2 = pointAt(to, f);
        const opacity = interpolate(f, [58 + index, 92 + index, 244, 285], [0, 0.78, 0.7, 0.35], clamp);
        return (
          <g key={`${from}-${to}`} opacity={opacity}>
            <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
              stroke={C.teal} strokeWidth="13" opacity=".08" strokeLinecap="round" />
            <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
              stroke={C.teal} strokeWidth="4" strokeLinecap="round" />
          </g>
        );
      })}

      {/* Small travelling pulses reinforce direction and connectivity. */}
      {edges.slice(0, 10).map(([from, to], i) => {
        const p1 = pointAt(from, f);
        const p2 = pointAt(to, f);
        const travel = ((f * 0.018 + i * 0.137) % 1);
        const x = p1.x + (p2.x - p1.x) * travel;
        const y = p1.y + (p2.y - p1.y) * travel;
        const opacity = ease(f, 88, 112) * (1 - ease(f, 265, 292)) * 0.9;
        return <circle key={`pulse-${i}`} cx={x} cy={y} r="5" fill={C.white} opacity={opacity} />;
      })}

      {input.map((_, i) => {
        const p = pointAt(i, f);
        const r = (14 + ease(f, 145, 210) * 10) * (i === 4 ? pulse : 1);
        const opacity = interpolate(f, [55, 84, 250, 290], [0, 1, 1, 0.9], clamp);
        return (
          <g key={`node-${i}`} opacity={opacity}>
            <circle cx={p.x} cy={p.y} r={r + 17} fill={colors[i]} opacity=".11" />
            <circle cx={p.x} cy={p.y} r={r} fill={colors[i]} stroke={C.bg} strokeWidth="7" />
            {i === 4 && <circle cx={p.x} cy={p.y} r={r * 0.34} fill={C.white} />}
          </g>
        );
      })}

      <g opacity={focus}>
        <circle cx="540" cy="1030" r="205" fill="none" stroke={C.orange}
          strokeWidth="3" strokeDasharray="9 16" />
        <circle cx="540" cy="1030" r="246" fill="none" stroke={C.teal}
          strokeWidth="2" opacity=".45" />
      </g>
    </g>
  );
};

const Copy: React.FC<{ f: number }> = ({ f }) => {
  const items = [
    { a: 0, b: 72, label: "INFORMASI", kicker: "01 / INPUT", sub: "Banyak potongan. Belum ada hubungan." },
    { a: 76, b: 150, label: "TERHUBUNG", kicker: "02 / CONNECTION", sub: "Data mulai menemukan relasinya." },
    { a: 154, b: 226, label: "POLA TERBENTUK", kicker: "03 / PATTERN", sub: "Hubungan berubah menjadi pemahaman." },
    { a: 230, b: 299, label: "KEPUTUSAN", kicker: "04 / DECISION", sub: "Pemahaman mengarahkan tindakan." },
  ];
  return (
    <g>
      {items.map((item) => {
        const alpha = interpolate(f, [item.a, item.a + 12, item.b - 10, item.b], [0, 1, 1, 0], clamp);
        const y = interpolate(f, [item.a, item.a + 16], [32, 0], clamp);
        return (
          <g key={item.label} opacity={alpha} transform={`translate(0 ${y})`}>
            <text x="82" y="176" fill={C.orange} fontSize="21" fontWeight="900" letterSpacing="4">{item.kicker}</text>
            <text x="82" y="270" fill={C.white} fontSize={item.label.length > 12 ? 54 : 66}
              fontWeight="900" letterSpacing="-1.5">{item.label}</text>
            <text x="82" y="326" fill={C.muted} fontSize="26">{item.sub}</text>
          </g>
        );
      })}
    </g>
  );
};

const Footer: React.FC<{ f: number }> = ({ f }) => {
  const labels = ["INPUT", "LINK", "PATTERN", "ACTION"];
  const starts = [0, 76, 154, 230];
  return (
    <g>
      {labels.map((label, i) => {
        const active = f >= starts[i] && f < (starts[i + 1] ?? 300);
        const x = 82 + i * 238;
        return (
          <g key={label} opacity={active ? 1 : 0.36}>
            <rect x={x} y="1725" width="190" height="7" rx="3.5" fill={active ? C.orange : C.line} />
            <text x={x} y="1768" fill={active ? C.white : C.muted} fontSize="17"
              fontWeight="900" letterSpacing="2">{label}</text>
          </g>
        );
      })}
    </g>
  );
};

export const StyleframeAkalV394: React.FC = () => {
  const f = useCurrentFrame();
  const progress = f / (DURATION - 1);
  const gridAlpha = 1 - ease(f, 275, 299) * 0.35;
  const glow = 0.3 + ease(f, 218, 290) * 0.7;

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, overflow: "hidden" }}>
      <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`}>
        <defs>
          <radialGradient id="v394Glow">
            <stop offset="0%" stopColor={C.teal} stopOpacity=".22" />
            <stop offset="100%" stopColor={C.teal} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="v394Footer" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={C.bg} stopOpacity="0" />
            <stop offset="100%" stopColor={C.bg2} stopOpacity=".95" />
          </linearGradient>
        </defs>
        <rect width={W} height={H} fill={C.bg} />
        <BackgroundGrid f={f} />
        <circle cx="540" cy="1030" r="620" fill="url(#v394Glow)" opacity={glow} />

        <text x="82" y="82" fill={C.muted} fontSize="19" fontWeight="900" letterSpacing="4">
          ORION CREATIVE  /  CONTINUOUS MOTION STUDY
        </text>
        <text x="998" y="82" textAnchor="end" fill={C.orange} fontSize="19"
          fontWeight="900" letterSpacing="2">V3.9.4</text>

        <Copy f={f} />
        <InputCards f={f} />
        <NetworkTransform f={f} />

        <rect x="0" y="1540" width={W} height="380" fill="url(#v394Footer)" />
        <Footer f={f} />
        <g opacity={ease(f, 230, 255)}>
          <text x="82" y="1845" fill={C.white} fontSize="30" fontWeight="900">
            FROM CONNECTION TO CLARITY
          </text>
          <text x="82" y="1880" fill={C.muted} fontSize="18" letterSpacing="1">
            EVERY MOVEMENT HAS A PURPOSE
          </text>
        </g>
        <rect x="82" y="1900" width="916" height="5" rx="2.5" fill={C.line} />
        <rect x="82" y="1900" width={916 * progress} height="5" rx="2.5" fill={C.orange} />
      </svg>
    </AbsoluteFill>
  );
};
