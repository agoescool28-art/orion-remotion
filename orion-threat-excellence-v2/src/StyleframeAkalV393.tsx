import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";

const W = 1080;
const H = 1920;
const FPS = 30;
const DURATION = 300;

const C = {
  bg: "#101E2D",
  bg2: "#172B3E",
  panel: "#20384D",
  paper: "#F5F0E7",
  white: "#FFFDF8",
  muted: "#A9B8C5",
  orange: "#FF8752",
  teal: "#72C7B7",
  lilac: "#B9A5E3",
  blue: "#78A9D8",
  line: "#456176",
};

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const smooth = (f: number, a: number, b: number, from = 0, to = 1) =>
  interpolate(f, [a, b], [from, to], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });

const pop = (f: number, at: number, duration = 22) =>
  interpolate(f, [at, at + duration], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.back(1.35)),
  });

const mix = (a: number, b: number, t: number) => a + (b - a) * t;

type Pt = { x: number; y: number };

const sourcePts: Pt[] = [
  { x: 205, y: 735 }, { x: 475, y: 620 }, { x: 790, y: 760 },
  { x: 285, y: 1015 }, { x: 560, y: 930 }, { x: 850, y: 1080 },
  { x: 190, y: 1280 }, { x: 485, y: 1370 }, { x: 800, y: 1320 },
];

const gridPts: Pt[] = [
  { x: 300, y: 780 }, { x: 540, y: 780 }, { x: 780, y: 780 },
  { x: 300, y: 1020 }, { x: 540, y: 1020 }, { x: 780, y: 1020 },
  { x: 300, y: 1260 }, { x: 540, y: 1260 }, { x: 780, y: 1260 },
];

const decisionPts: Pt[] = [
  { x: 540, y: 680 }, { x: 540, y: 890 }, { x: 540, y: 1100 },
  { x: 540, y: 1310 }, { x: 540, y: 1515 },
  { x: 420, y: 890 }, { x: 660, y: 890 },
  { x: 420, y: 1310 }, { x: 660, y: 1310 },
];

const edges: [number, number][] = [
  [0, 1], [1, 2], [0, 3], [1, 3], [1, 4], [1, 5], [2, 5],
  [3, 4], [4, 5], [3, 6], [3, 7], [4, 7], [4, 8], [5, 8],
  [6, 7], [7, 8],
];

const Cards: React.FC<{ f: number }> = ({ f }) => {
  const cards = [
    { x: 190, y: 780, r: -9, color: C.orange, label: "FAKTA", delay: 0 },
    { x: 540, y: 650, r: 5, color: C.teal, label: "DATA", delay: 9 },
    { x: 870, y: 825, r: 8, color: C.lilac, label: "IDE", delay: 17 },
  ];
  const opacity = 1 - smooth(f, 68, 100);
  return (
    <g opacity={opacity}>
      {cards.map((c, i) => {
        const settle = smooth(f, 26 + c.delay, 58 + c.delay);
        const drift = smooth(f, 0, 72, 0, 1);
        const x = mix(c.x + (i - 1) * 130, c.x, settle);
        const y = mix(c.y - 100, c.y, settle);
        const scale = 0.88 + pop(f, c.delay + 5, 24) * 0.12;
        return (
          <g key={c.label} transform={`translate(${x} ${y}) rotate(${c.r * (1 - settle)}) scale(${scale})`}>
            <rect x="-120" y="-78" width="240" height="156" rx="22" fill="#000" opacity=".2" transform="translate(0 12)" />
            <rect x="-120" y="-78" width="240" height="156" rx="22" fill={C.paper} />
            <rect x="-92" y="-48" width="34" height="34" rx="10" fill={c.color} />
            <text x="-44" y="-22" fill={C.bg} fontSize="22" fontWeight="900" letterSpacing="1.5">{c.label}</text>
            <rect x="-92" y="8" width="176" height="9" rx="4.5" fill={C.bg} opacity=".19" />
            <rect x="-92" y="30" width={112 + i * 18} height="9" rx="4.5" fill={C.bg} opacity=".13" />
          </g>
        );
      })}
    </g>
  );
};

const Nodes: React.FC<{ f: number }> = ({ f }) => {
  const gather = smooth(f, 62, 118);
  const organize = smooth(f, 148, 218);
  const emerge = smooth(f, 218, 258);
  const pulse = 1 + Math.sin(f * 0.16) * 0.045;
  const cameraScale = interpolate(f, [0, 85, 170, 250, 299], [0.94, 1, 1.035, 1.015, 1.04], clamp);
  const cameraX = interpolate(f, [0, 120, 220, 299], [18, 0, -12, 0], clamp);
  const cameraY = interpolate(f, [0, 120, 220, 299], [12, 0, -18, 0], clamp);

  return (
    <g transform={`translate(${540 + cameraX} ${960 + cameraY}) scale(${cameraScale}) translate(-540 -960)`}>
      {/* Network edges continuously change as nodes organize. */}
      {edges.map(([a, b], i) => {
        const ax = mix(sourcePts[a].x, gridPts[a].x, gather);
        const ay = mix(sourcePts[a].y, gridPts[a].y, gather);
        const bx = mix(sourcePts[b].x, gridPts[b].x, gather);
        const by = mix(sourcePts[b].y, gridPts[b].y, gather);
        const opacity = interpolate(f, [60 + i * 1.2, 95 + i * 1.2, 205, 255], [0, 0.75, 0.72, 0.18], clamp);
        return <line key={`${a}-${b}`} x1={ax} y1={ay} x2={bx} y2={by}
          stroke={C.teal} strokeWidth="4" strokeLinecap="round" opacity={opacity} />;
      })}

      {sourcePts.map((p, i) => {
        const gx = mix(p.x, gridPts[i].x, gather);
        const gy = mix(p.y, gridPts[i].y, gather);
        const dx = mix(gx, decisionPts[i].x, emerge);
        const dy = mix(gy, decisionPts[i].y, emerge);
        const r = mix(14, 27, organize) * (i === 4 ? pulse : 1);
        const colors = [C.orange, C.teal, C.lilac, C.blue, C.orange, C.teal, C.lilac, C.blue, C.orange];
        const opacity = interpolate(f, [58, 86, 246, 280], [0, 1, 1, 0.8], clamp);
        return (
          <g key={i} opacity={opacity}>
            <circle cx={dx} cy={dy} r={r + 15} fill={colors[i]} opacity=".1" />
            <circle cx={dx} cy={dy} r={r} fill={colors[i]} stroke={C.bg} strokeWidth="7" />
            {i === 4 && <circle cx={dx} cy={dy} r={r * 0.36} fill={C.white} />}
          </g>
        );
      })}
    </g>
  );
};

const Headline: React.FC<{ f: number }> = ({ f }) => {
  const stages = [
    { at: 0, end: 66, kicker: "01 / INPUT", title: "INFORMASI", sub: "Banyak potongan. Belum ada hubungan." },
    { at: 75, end: 143, kicker: "02 / CONNECTION", title: "TERHUBUNG", sub: "Data mulai menemukan relasinya." },
    { at: 150, end: 222, kicker: "03 / PATTERN", title: "POLA TERBENTUK", sub: "Hubungan berubah menjadi pemahaman." },
    { at: 228, end: 299, kicker: "04 / DECISION", title: "KEPUTUSAN", sub: "Pemahaman mengarahkan tindakan." },
  ];
  return (
    <g>
      {stages.map((s, i) => {
        const alpha = interpolate(f, [s.at, s.at + 12, s.end - 10, s.end], [0, 1, 1, 0], clamp);
        const y = interpolate(f, [s.at, s.at + 16], [220, 0], clamp);
        return (
          <g key={s.title} opacity={alpha} transform={`translate(0 ${y})`}>
            <text x="84" y="178" fill={C.orange} fontSize="22" fontWeight="900" letterSpacing="4">{s.kicker}</text>
            <text x="84" y="270" fill={C.white} fontSize={i === 2 ? 55 : 66} fontWeight="900" letterSpacing="-1.5">{s.title}</text>
            <text x="84" y="326" fill={C.muted} fontSize="27" fontWeight="500">{s.sub}</text>
          </g>
        );
      })}
    </g>
  );
};

const StageMarkers: React.FC<{ f: number }> = ({ f }) => {
  const labels = ["INPUT", "LINK", "PATTERN", "ACTION"];
  return (
    <g>
      {labels.map((label, i) => {
        const x = 84 + i * 236;
        const active = f >= [0, 75, 150, 228][i] && f < [75, 150, 228, 300][i];
        return (
          <g key={label} opacity={active ? 1 : 0.38}>
            <rect x={x} y="1730" width="190" height="7" rx="3.5" fill={active ? C.orange : C.line} />
            <text x={x} y="1772" fill={active ? C.white : C.muted} fontSize="17" fontWeight="900" letterSpacing="2">{label}</text>
          </g>
        );
      })}
    </g>
  );
};

export const StyleframeAkalV393: React.FC = () => {
  const f = useCurrentFrame();
  const gridOpacity = smooth(f, 0, 24) * (1 - smooth(f, 275, 299) * 0.35);
  const endGlow = smooth(f, 225, 299);
  const progress = f / (DURATION - 1);

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, overflow: "hidden" }}>
      <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`}>
        <defs>
          <radialGradient id="v393Glow">
            <stop offset="0%" stopColor={C.teal} stopOpacity=".18" />
            <stop offset="100%" stopColor={C.teal} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="v393Bottom" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={C.bg} stopOpacity="0" />
            <stop offset="100%" stopColor={C.bg2} stopOpacity=".9" />
          </linearGradient>
        </defs>
        <rect width={W} height={H} fill={C.bg} />
        <g opacity={gridOpacity}>
          {Array.from({ length: 12 }, (_, i) => (
            <line key={`v${i}`} x1={i * 100} y1="0" x2={i * 100} y2={H}
              stroke={C.line} strokeWidth="1" opacity=".34" />
          ))}
          {Array.from({ length: 21 }, (_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 100} x2={W} y2={i * 100}
              stroke={C.line} strokeWidth="1" opacity=".28" />
          ))}
        </g>
        <circle cx="540" cy="1030" r="580" fill="url(#v393Glow)" opacity={0.35 + endGlow * 0.65} />
        <text x="84" y="86" fill={C.muted} fontSize="20" fontWeight="900" letterSpacing="4">
          ORION CREATIVE  /  VISUAL STORYTELLING STUDY
        </text>

        <Headline f={f} />
        <Cards f={f} />
        <Nodes f={f} />

        {/* Focus ring forms around the central node when the pattern is understood. */}
        <g opacity={smooth(f, 178, 208) * (1 - smooth(f, 250, 286))}>
          <circle cx="540" cy="1020" r="190" fill="none" stroke={C.orange}
            strokeWidth="3" strokeDasharray="10 18" />
          <circle cx="540" cy="1020" r="225" fill="none" stroke={C.teal}
            strokeWidth="2" opacity=".55" />
        </g>

        <rect x="0" y="1550" width={W} height="370" fill="url(#v393Bottom)" />
        <StageMarkers f={f} />
        <g opacity={smooth(f, 228, 252)}>
          <text x="84" y="1850" fill={C.white} fontSize="31" fontWeight="900">
            VISUAL CLARITY → BETTER DECISIONS
          </text>
        </g>
        <rect x="84" y="1888" width="912" height="5" rx="2.5" fill={C.line} />
        <rect x="84" y="1888" width={912 * progress} height="5" rx="2.5" fill={C.orange} />
        <text x="996" y="84" textAnchor="end" fill={C.orange} fontSize="19" fontWeight="900" letterSpacing="2">
          V3.9.3
        </text>
      </svg>
    </AbsoluteFill>
  );
};
