
import React from "react";
import { AbsoluteFill, interpolate, getInputProps, useCurrentFrame, Audio, staticFile } from "remotion";
import defaultData from "./materi.json";
const W = 1080;
const H = 1920;

const C = {
  bg: "#07152D",
  bg2: "#102746",
  orange: "#FF805C",
  yellow: "#FFC66B",
  white: "#F7F5F1",
  blue: "#67C9E8",
  muted: "#A8B6D0",
};

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const fade = (f: number, start: number, end: number) =>
  interpolate(f, [start, start + 14, end - 14, end], [0, 1, 1, 0], clamp);

const smooth = (f: number, start: number, end: number) =>
  interpolate(f, [start, end], [0, 1], {
    ...clamp,
    easing: (t) => t * t * (3 - 2 * t),
  });

const particles = Array.from({ length: 24 }, (_, i) => ({
  x: 100 + ((i * 173) % 880),
  y: 300 + ((i * 251) % 1150),
  delay: i * 2,
  size: 3 + (i % 4) * 2,
}));

const nodes = [
  [230, 540], [390, 430], [560, 510], [760, 400],
  [850, 620], [680, 760], [470, 700], [260, 850],
  [420, 1010], [650, 990], [830, 1120], [300, 1190],
  [540, 1270], [750, 1360],
];

const links = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5],
  [5, 6], [6, 7], [7, 0], [1, 6], [2, 5],
  [5, 9], [6, 8], [8, 9], [9, 10], [7, 11],
  [8, 11], [8, 12], [9, 12], [10, 13], [12, 13],
];

const Label: React.FC<{
  x: number;
  y: number;
  children: React.ReactNode;
  size?: number;
  color?: string;
  anchor?: "middle" | "start" | "end";
}> = ({ x, y, children, size = 28, color = C.white, anchor = "middle" }) => (
  <text
    x={x}
    y={y}
    fill={color}
    fontSize={size}
    fontWeight="800"
    textAnchor={anchor}
    letterSpacing="2"
    fontFamily="Arial, sans-serif"
  >
    {children}
  </text>
);

const Brain: React.FC<{ f: number }> = ({ f }) => {
  const pulse = 1 + Math.sin(f * 0.12) * 0.035;

  return (
    <g transform={`translate(540 800) scale(${pulse})`}>
      <ellipse
        cx="0"
        cy="0"
        rx="205"
        ry="175"
        fill={C.orange}
        opacity="0.08"
      />
      <path
        d="M-12 -145 C-95 -205 -185 -135 -170 -55
           C-235 0 -180 105 -120 105
           C-95 180 -20 170 0 125
           C25 170 95 180 120 105
           C180 105 235 0 170 -55
           C185 -135 95 -205 12 -145
           Z"
        fill={C.orange}
        stroke={C.yellow}
        strokeWidth="8"
      />
      <path
        d="M0 -145 C-30 -80 -15 -25 0 0
           C-20 55 -18 95 0 130"
        stroke="#8E3E36"
        strokeWidth="8"
        fill="none"
      />
      {[-1, 1].map((side) => (
        <g key={side} transform={`scale(${side} 1)`}>
          <path
            d="M-35 -105 C-100 -130 -135 -80 -90 -45
               M-95 0 C-150 -25 -145 45 -85 55
               M-40 35 C-100 65 -70 115 -25 100"
            stroke="#9E493C"
            strokeWidth="9"
            fill="none"
            strokeLinecap="round"
          />
        </g>
      ))}
      {Array.from({ length: 12 }, (_, i) => {
        const a = (Math.PI * 2 * i) / 12;
        return (
          <circle
            key={i}
            cx={Math.cos(a) * 245}
            cy={Math.sin(a) * 210}
            r={5 + (i % 3) * 2}
            fill={C.yellow}
          />
        );
      })}
    </g>
  );
};

const Background: React.FC = () => (
  <>
    <rect width={W} height={H} fill="url(#bg)" />
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor={C.bg2} />
        <stop offset="55%" stopColor={C.bg} />
        <stop offset="100%" stopColor="#030B19" />
      </linearGradient>
      <radialGradient id="glow">
        <stop offset="0%" stopColor="#1E5274" stopOpacity="0.45" />
        <stop offset="100%" stopColor={C.bg} stopOpacity="0" />
      </radialGradient>
    </defs>
    <ellipse cx="540" cy="850" rx="490" ry="650" fill="url(#glow)" />
    <path
      d="M60 120 H1020"
      stroke={C.blue}
      strokeOpacity="0.25"
      strokeWidth="2"
    />
    <path
      d="M60 1790 H1020"
      stroke={C.orange}
      strokeOpacity="0.6"
      strokeWidth="3"
    />
  </>
);

const Header: React.FC = () => (
  <>
    <Label x={65} y={85} anchor="start" size={19} color={C.orange}>
      ORION / CREATIVE
    </Label>
    <Label x={1015} y={85} anchor="end" size={17} color={C.muted}>
      VISUAL THINKING
    </Label>
  </>
);

const SceneOne: React.FC<{ f: number }> = ({ f }) => {
  const progress = smooth(f, 0, 90);

  return (
    <g opacity={fade(f, 0, 112)}>
      <Label x={540} y={300} size={22} color={C.yellow}>
        SETIAP HARI
      </Label>
      <Label x={540} y={365} size={56}>
        KITA MENERIMA
      </Label>
      <Label x={540} y={430} size={64} color={C.orange}>
        INFORMASI.
      </Label>

      {particles.map((p, i) => {
        const t = smooth(f, p.delay, 75 + p.delay);
        const x = p.x + (540 - p.x) * t;
        const y = p.y + (800 - p.y) * t;

        return (
          <g key={i}>
            <circle
              cx={x}
              cy={y}
              r={p.size}
              fill={i % 3 === 0 ? C.orange : C.blue}
              opacity={0.35 + 0.65 * Math.sin(f * 0.1 + i) ** 2}
            />
            <circle
              cx={x}
              cy={y}
              r={p.size * 3}
              fill={C.blue}
              opacity="0.08"
            />
          </g>
        );
      })}

      <Brain f={f} />
      <Label x={540} y={1110} size={27} color={C.muted}>
        TAPI APA YANG TERJADI SELANJUTNYA?
      </Label>

      <path
        d={`M540 1160 V${1160 + progress * 95}`}
        stroke={C.orange}
        strokeWidth="5"
        strokeDasharray="9 12"
        opacity={progress}
      />
    </g>
  );
};

const SceneTwo: React.FC<{ f: number }> = ({ f }) => {
  const local = f - 94;
  const pulse = 0.5 + 0.5 * Math.sin(local * 0.16);

  return (
    <g opacity={fade(f, 94, 228)}>
      <Label x={540} y={290} size={22} color={C.yellow}>
        PROSES PERTAMA
      </Label>
      <Label x={540} y={370} size={67}>
        BERPIKIR.
      </Label>
      <Label x={540} y={430} size={25} color={C.muted}>
        Informasi mulai diproses.
      </Label>

      <Brain f={local} />

      {links.map(([a, b], i) => {
        const A = nodes[a];
        const B = nodes[b];
        const active = smooth(local, i * 3, 35 + i * 3);

        return (
          <g key={i}>
            <line
              x1={A[0]}
              y1={A[1]}
              x2={B[0]}
              y2={B[1]}
              stroke={C.blue}
              strokeWidth="3"
              strokeDasharray="8 12"
              strokeDashoffset={-local * 2}
              opacity={0.15 + active * 0.75}
            />
          </g>
        );
      })}

      {nodes.map(([x, y], i) => (
        <g key={i}>
          <circle
            cx={x}
            cy={y}
            r={13 + pulse * 7}
            fill={C.blue}
            opacity="0.13"
          />
          <circle cx={x} cy={y} r="7" fill={C.white} />
        </g>
      ))}

      <Label x={540} y={1450} size={25} color={C.blue}>
        MENGHUBUNGKAN INFORMASI
      </Label>
    </g>
  );
};

const SceneThree: React.FC<{ f: number }> = ({ f }) => {
  const local = f - 215;
  const progress = smooth(local, 0, 95);

  return (
    <g opacity={fade(f, 215, 340)}>
      <Label x={540} y={290} size={22} color={C.yellow}>
        PROSES KEDUA
      </Label>
      <Label x={540} y={375} size={68}>
        MEMAHAMI.
      </Label>
      <Label x={540} y={435} size={24} color={C.muted}>
        Yang rumit mulai menemukan pola.
      </Label>

      {nodes.map(([x, y], i) => {
        const targetX = 300 + (i % 4) * 160;
        const targetY = 700 + Math.floor(i / 4) * 125;
        const px = interpolate(progress, [0, 1], [x, targetX]);
        const py = interpolate(progress, [0, 1], [y, targetY]);

        return (
          <g key={i}>
            <circle
              cx={px}
              cy={py}
              r={12 + Math.sin(local * 0.12 + i) * 3}
              fill={i % 3 === 0 ? C.orange : C.blue}
            />
            <circle
              cx={px}
              cy={py}
              r="28"
              fill="none"
              stroke={C.blue}
              strokeOpacity="0.3"
              strokeWidth="2"
            />
          </g>
        );
      })}

      <rect
        x="220"
        y="620"
        width="640"
        height="490"
        rx="32"
        fill="none"
        stroke={C.blue}
        strokeOpacity={progress * 0.45}
        strokeWidth="3"
      />

      <Label x={540} y={1250} size={32} color={C.orange}>
        POLA MULAI TERBENTUK
      </Label>
      <Label x={540} y={1310} size={23} color={C.muted}>
        Kita tidak sekadar mengingat.
      </Label>
      <Label x={540} y={1355} size={23} color={C.muted}>
        Kita mulai mengerti.
      </Label>
    </g>
  );
};

const SceneFour: React.FC<{ f: number }> = ({ f }) => {
  const local = f - 325;
  const walk = smooth(local, 0, 95);
  const x = interpolate(walk, [0, 1], [300, 540]);
  const step = Math.sin(local * 0.18) * 22;
  const light = smooth(local, 15, 100);

  return (
    <g opacity={fade(f, 325, 450)}>
      <circle
        cx="540"
        cy="920"
        r={160 + light * 180}
        fill={C.orange}
        opacity={0.06 + light * 0.14}
      />
      <circle
        cx="540"
        cy="920"
        r="110"
        fill="none"
        stroke={C.orange}
        strokeWidth="4"
        opacity={light}
      />

      <Label x={540} y={285} size={22} color={C.yellow}>
        PROSES KETIGA
      </Label>
      <Label x={540} y={370} size={65}>
        BERTINDAK.
      </Label>
      <Label x={540} y={430} size={24} color={C.muted}>
        Pemahaman harus menghasilkan perubahan.
      </Label>

      <g transform={`translate(${x} 900)`}>
        <circle cx="0" cy="-145" r="42" fill={C.white} />
        <path
          d="M-55 -90 Q0 -125 55 -90 L42 85 L-42 85 Z"
          fill={C.blue}
        />
        <path
          d={`M-25 80 L-42 ${185 + step} M25 80 L45 ${185 - step}`}
          stroke={C.white}
          strokeWidth="22"
          strokeLinecap="round"
        />
        <path
          d={`M-45 -65 L-100 ${30 - step} M45 -65 L95 ${20 + step}`}
          stroke={C.orange}
          strokeWidth="19"
          strokeLinecap="round"
        />
      </g>

      <path
        d="M300 1150 Q540 1300 780 1150"
        fill="none"
        stroke={C.orange}
        strokeWidth="5"
        strokeDasharray="12 15"
        strokeDashoffset={-local * 3}
        opacity={light}
      />

      <Label x={540} y={1450} size={34} color={C.yellow}>
        BERPIKIR. MEMAHAMI. BERTINDAK.
      </Label>
      <Label x={540} y={1510} size={23} color={C.muted}>
        Pengetahuan menjadi berarti saat diterapkan.
      </Label>
    </g>
  );
};

export const StyleframeAkalV36: React.FC = () => {// Ambil data dinamis dari Gemini
  const inputProps = getInputProps();
const data = Object.keys(inputProps).length > 0 ? inputProps : defaultData;

const titleText = data.title;
const subtitleText = data.subtitle;
const insightText = data.insight;
  const f = useCurrentFrame();

  return (
  <AbsoluteFill style={{ backgroundColor: C.bg }}>
    {(getInputProps() as any)?.audioSrc ? (
        <Audio src={(getInputProps() as any).audioSrc} />
      ) : null}
    <svg
      width="100%"
      height="100%"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid meet"
    >
        <Background />
        <Header />
        <SceneOne f={f} />
        <SceneTwo f={f} />
        <SceneThree f={f} />
        <SceneFour f={f} />

        <Label x={65} y={1840} size={17} anchor="start" color={C.muted}>
          THINK / UNDERSTAND / ACT
        </Label>
        <Label x={1015} y={1840} size={17} anchor="end" color={C.orange}>
          ORION / 36
        </Label>
      </svg>
    </AbsoluteFill>
  );
};
