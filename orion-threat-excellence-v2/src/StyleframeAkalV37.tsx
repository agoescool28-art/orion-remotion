import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";

const W = 1080;
const H = 1920;
const DURATION = 606; // 20.2 seconds; aligned to supplied VO duration

const C = {
  bg: "#071426",
  navy: "#102A46",
  orange: "#FF805C",
  gold: "#FFC66D",
  cyan: "#72D9F4",
  white: "#F7F8FC",
  muted: "#A8B6C8",
};

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const ease = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });

const opacity = (f: number, a: number, b: number) =>
  interpolate(f, [a, a + 18, b - 18, b], [0, 1, 1, 0], clamp);

const drift = (f: number, speed: number, amplitude: number) =>
  Math.sin(f * speed) * amplitude;

const Label: React.FC<{
  x: number;
  y: number;
  children: React.ReactNode;
  size?: number;
  color?: string;
  anchor?: "start" | "middle" | "end";
  weight?: number;
}> = ({ x, y, children, size = 30, color = C.white, anchor = "middle", weight = 800 }) => (
  <text
    x={x}
    y={y}
    textAnchor={anchor}
    fill={color}
    fontSize={size}
    fontWeight={weight}
    fontFamily="Arial, sans-serif"
    letterSpacing="1.5"
  >
    {children}
  </text>
);

const ParticleField: React.FC<{ f: number; converge?: number }> = ({ f, converge = 0 }) => {
  return (
    <g>
      {Array.from({ length: 54 }, (_, i) => {
        const x0 = 75 + ((i * 197) % 930);
        const y0 = 280 + ((i * 283) % 1270);
        const tx = 540 + Math.cos(i * 2.4) * (35 + (i % 5) * 12);
        const ty = 850 + Math.sin(i * 1.7) * (40 + (i % 4) * 15);
        const p = ease(f, 0, 190) * converge;
        const x = x0 + (tx - x0) * p + drift(f + i * 4, 0.035, 13);
        const y = y0 + (ty - y0) * p + drift(f + i * 7, 0.04, 16);
        const r = 2 + (i % 4) * 1.4;
        return (
          <g key={i}>
            <circle cx={x} cy={y} r={r * 3} fill={i % 4 ? C.cyan : C.orange} opacity="0.08" />
            <circle cx={x} cy={y} r={r} fill={i % 4 ? C.cyan : C.orange} opacity={0.35 + 0.5 * Math.sin(f * 0.08 + i) ** 2} />
          </g>
        );
      })}
    </g>
  );
};

const Brain: React.FC<{ f: number; x?: number; y?: number; scale?: number }> = ({
  f, x = 540, y = 850, scale = 1,
}) => {
  const pulse = 1 + Math.sin(f * 0.11) * 0.025;
  return (
    <g transform={`translate(${x} ${y}) scale(${scale * pulse})`}>
      <ellipse rx="250" ry="220" fill={C.orange} opacity="0.07" />
      <path
        d="M-8 -155 C-85 -220 -190 -165 -180 -75 C-250 -20 -205 95 -130 105 C-100 190 -25 175 0 125 C25 175 100 190 130 105 C205 95 250 -20 180 -75 C190 -165 85 -220 8 -155 Z"
        fill={C.orange}
        stroke={C.gold}
        strokeWidth="8"
      />
      <path d="M0 -150 C-25 -80 -15 -25 0 0 C-20 55 -15 100 0 130" fill="none" stroke="#98483D" strokeWidth="9" />
      {[-1, 1].map((s) => (
        <g key={s} transform={`scale(${s} 1)`} fill="none" stroke="#98483D" strokeWidth="9" strokeLinecap="round">
          <path d="M-35 -115 C-115 -145 -145 -75 -90 -45 M-105 0 C-155 -30 -145 45 -85 55 M-40 45 C-105 70 -75 125 -25 105" />
        </g>
      ))}
      {Array.from({ length: 12 }, (_, i) => {
        const a = (Math.PI * 2 * i) / 12 + f * 0.006;
        return <circle key={i} cx={Math.cos(a) * 280} cy={Math.sin(a) * 235} r="6" fill={C.gold} />;
      })}
    </g>
  );
};

const Network: React.FC<{ f: number; ordered: number }> = ({ f, ordered }) => {
  const points = Array.from({ length: 14 }, (_, i) => {
    const chaosX = 170 + ((i * 193) % 740);
    const chaosY = 570 + ((i * 157) % 700);
    const gridX = 270 + (i % 4) * 180;
    const gridY = 700 + Math.floor(i / 4) * 155;
    const p = ease(f, 0, 150) * ordered;
    return {
      x: chaosX + (gridX - chaosX) * p,
      y: chaosY + (gridY - chaosY) * p,
    };
  });
  const edges = [[0,1],[1,2],[2,3],[0,4],[1,5],[2,6],[3,7],[4,5],[5,6],[6,7],[4,8],[5,9],[6,10],[7,11],[8,9],[9,10],[10,11],[8,12],[9,12],[10,13],[11,13],[12,13]];
  return (
    <g>
      {edges.map(([a,b], i) => (
        <line key={i} x1={points[a].x} y1={points[a].y} x2={points[b].x} y2={points[b].y}
          stroke={C.cyan} strokeWidth="3" strokeDasharray="9 13"
          strokeDashoffset={-f * 2.2} opacity={0.2 + ease(f, i * 2, 45 + i * 2) * 0.65} />
      ))}
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={17 + Math.sin(f * 0.12 + i) * 4} fill={i % 4 === 0 ? C.orange : C.cyan} opacity="0.18" />
          <circle cx={p.x} cy={p.y} r="7" fill={C.white} />
        </g>
      ))}
    </g>
  );
};

const SceneOne: React.FC<{ f: number }> = ({ f }) => (
  <g opacity={opacity(f, 0, 165)}>
    <ParticleField f={f} converge={0.35} />
    <Label x={540} y={330} size={24} color={C.gold}>DARI LUAR, MENUJU KE DALAM</Label>
    <Label x={540} y={425} size={72}>INFORMASI</Label>
    <Label x={540} y={500} size={35} color={C.orange}>masuk setiap saat</Label>
    <Brain f={f} y={900} scale={0.82 + ease(f, 0, 90) * 0.18} />
    <path d={`M120 ${1250 + drift(f,0.06,10)} Q540 1120 960 ${1250 - drift(f,0.06,10)}`}
      fill="none" stroke={C.cyan} strokeWidth="3" strokeDasharray="8 18" strokeOpacity="0.7" />
    <Label x={540} y={1390} size={28} color={C.muted}>APA YANG KITA LAKUKAN DENGANNYA?</Label>
  </g>
);

const SceneTwo: React.FC<{ f: number }> = ({ f }) => (
  <g opacity={opacity(f, 145, 315)}>
    <Label x={540} y={330} size={24} color={C.gold}>PROSES PERTAMA</Label>
    <Label x={540} y={425} size={82}>BERPIKIR</Label>
    <Brain f={f - 145} x={540} y={850} scale={0.72} />
    <Network f={f - 145} ordered={0.15} />
    <circle cx="540" cy="850" r={300 + drift(f,0.05,18)} fill="none" stroke={C.orange} strokeWidth="3" strokeDasharray="5 22" opacity="0.65" />
    <Label x={540} y={1450} size={28} color={C.cyan}>MENGHUBUNGKAN INFORMASI</Label>
  </g>
);

const SceneThree: React.FC<{ f: number }> = ({ f }) => (
  <g opacity={opacity(f, 295, 465)}>
    <Label x={540} y={330} size={24} color={C.gold}>PROSES KEDUA</Label>
    <Label x={540} y={425} size={82}>MEMAHAMI</Label>
    <Network f={f - 295} ordered={1} />
    <rect x="190" y="570" width="700" height="690" rx="40" fill="none" stroke={C.cyan}
      strokeWidth="3" strokeOpacity={ease(f, 300, 430) * 0.55} />
    <Label x={540} y={1400} size={31} color={C.orange}>YANG ACAK MENJADI POLA</Label>
  </g>
);

const SceneFour: React.FC<{ f: number }> = ({ f }) => {
  const local = f - 445;
  const p = ease(local, 0, 125);
  const personX = interpolate(p, [0, 1], [260, 540]);
  const stride = Math.sin(local * 0.22) * 22;
  return (
    <g opacity={opacity(f, 445, DURATION)}>
      <circle cx="540" cy="940" r={130 + p * 180} fill={C.orange} opacity={0.07 + p * 0.12} />
      <circle cx="540" cy="940" r="115" fill="none" stroke={C.gold} strokeWidth="4" opacity={p} />
      <Label x={540} y={330} size={24} color={C.gold}>PROSES KETIGA</Label>
      <Label x={540} y={425} size={82}>BERTINDAK</Label>
      <g transform={`translate(${personX} 920)`}>
        <circle cx="0" cy="-150" r="39" fill={C.white} />
        <path d="M-48 -95 Q0 -125 48 -95 L38 70 L-38 70 Z" fill={C.cyan} />
        <path d={`M-22 65 L-48 ${170 + stride} M22 65 L48 ${170 - stride}`} stroke={C.white} strokeWidth="22" strokeLinecap="round" />
        <path d={`M-38 -65 L-92 ${15 - stride * 0.6} M38 -65 L92 ${15 + stride * 0.6}`} stroke={C.orange} strokeWidth="18" strokeLinecap="round" />
      </g>
      <path d="M250 1190 Q540 1370 830 1190" fill="none" stroke={C.orange} strokeWidth="5" strokeDasharray="12 16" strokeDashoffset={-local * 3} />
      <Label x={540} y={1460} size={35} color={C.gold}>PENGETAHUAN MENJADI TINDAKAN</Label>
      <Label x={540} y={1520} size={25} color={C.muted}>Bukan hanya diketahui. Tetapi diterapkan.</Label>
    </g>
  );
};

const AudioBed: React.FC = () => (
  <Audio src={staticFile("audio/vo-akal.mp3")} volume={1} />
);

export const StyleframeAkalV37: React.FC = () => {
  const f = useCurrentFrame();
  const progress = interpolate(f, [0, DURATION], [0, 940], clamp);
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AudioBed />
      <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="v37bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#163554" />
            <stop offset="58%" stopColor={C.bg} />
            <stop offset="100%" stopColor="#030914" />
          </linearGradient>
          <radialGradient id="v37glow">
            <stop offset="0%" stopColor="#245778" stopOpacity="0.42" />
            <stop offset="100%" stopColor={C.bg} stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width={W} height={H} fill="url(#v37bg)" />
        <ellipse cx="540" cy="900" rx="530" ry="720" fill="url(#v37glow)" />
        <Label x={65} y={90} anchor="start" size={19} color={C.orange}>ORION / CREATIVE</Label>
        <Label x={1015} y={90} anchor="end" size={17} color={C.muted}>VISUAL INTELLIGENCE / 37</Label>

        <SceneOne f={f} />
        <SceneTwo f={f} />
        <SceneThree f={f} />
        <SceneFour f={f} />

        <rect x="70" y="1785" width="940" height="3" fill="#52647E" opacity="0.55" />
        <rect x="70" y="1785" width={progress} height="5" fill={C.orange} />
        <Label x={70} y={1840} anchor="start" size={17} color={C.muted}>THINK / UNDERSTAND / ACT</Label>
        <Label x={1010} y={1840} anchor="end" size={17} color={C.orange}>ORION / V37</Label>
      </svg>
    </AbsoluteFill>
  );
};
