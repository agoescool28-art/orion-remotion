import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const W = 1080;
const H = 1920;
const FPS = 30;
const DURATION = 606;
const C = {
  cream: "#F8EFE3",
  paper: "#FFFDF8",
  navy: "#142D4D",
  orange: "#F58235",
  orangePale: "#FCE0C8",
  teal: "#A9D8D0",
  tealDark: "#4F9D91",
  lavender: "#B9A2D8",
  ink: "#26384C",
  muted: "#8E969A",
  grid: "#D8D0C5",
};

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const eout = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.25)) });
const fade = (f: number, a: number, b: number, edge = 16) => interpolate(f, [a, a + edge, b - edge, b], [0, 1, 1, 0], clamp);
const smooth = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
const pop = (f: number, at: number, duration = 18) => spring({ frame: f - at, fps: FPS, config: { damping: 12, stiffness: 150, mass: 0.7 }, durationInFrames: duration });

const Grid = () => (
  <g opacity="0.72">
    {Array.from({ length: 15 }, (_, i) => <line key={`v${i}`} x1={i * 80} y1="0" x2={i * 80} y2={H} stroke={C.grid} strokeWidth="1.4" />)}
    {Array.from({ length: 25 }, (_, i) => <line key={`h${i}`} x1="0" y1={i * 80} x2={W} y2={i * 80} stroke={C.grid} strokeWidth="1.4" />)}
  </g>
);

const Caption = ({ children, y = 1510, f, start = 0, width = 850 }: { children: React.ReactNode; y?: number; f: number; start?: number; width?: number }) => {
  const s = pop(f, start, 15);
  return <g transform={`translate(540 ${y}) scale(${s})`}>
    <rect x={-width / 2} y="-48" width={width} height="96" rx="34" fill={C.navy} />
    <text textAnchor="middle" y="13" fontSize="42" fontWeight="800" fill={C.paper} letterSpacing="-1">{children}</text>
  </g>;
};

const Word = ({ children, x, y, size = 58, color = C.navy, rotate = 0 }: { children: React.ReactNode; x: number; y: number; size?: number; color?: string; rotate?: number }) => (
  <text x={x} y={y} textAnchor="middle" fontSize={size} fontWeight="900" fill={color} transform={`rotate(${rotate} ${x} ${y})`} letterSpacing="-2">{children}</text>
);

const SceneInfo = ({ f }: { f: number }) => {
  const a = fade(f, 0, 165);
  const card1 = pop(f, 12), card2 = pop(f, 28), card3 = pop(f, 44);
  const orbit = f * 1.2;
  return <g opacity={a}>
    <text x="540" y="230" textAnchor="middle" fill={C.muted} fontSize="28" fontWeight="700" letterSpacing="7">01 / INPUT</text>
    <Word x={540} y={335} size={74}>INFORMASI</Word>
    <g transform={`translate(540 820)`}>
      <circle r="245" fill={C.paper} stroke="#E8D9C8" strokeWidth="5" />
      <circle r="190" fill={C.orangePale} />
      <g transform={`rotate(${orbit})`}>
        {Array.from({ length: 12 }, (_, i) => <g key={i} transform={`rotate(${i * 30}) translate(0 -285)`}>
          <circle r="13" fill={i % 3 === 0 ? C.orange : C.tealDark} />
        </g>)}
      </g>
      <g transform={`translate(${Math.sin(f / 8) * 8} ${Math.cos(f / 9) * 7})`}>
        <rect x="-100" y="-115" width="200" height="230" rx="28" fill={C.paper} stroke={C.navy} strokeWidth="8" />
        <rect x="-65" y="-76" width="130" height="20" rx="10" fill={C.orange} />
        <rect x="-65" y="-25" width="130" height="13" rx="7" fill={C.tealDark} opacity="0.75" />
        <rect x="-65" y="8" width="95" height="13" rx="7" fill={C.tealDark} opacity="0.45" />
        <rect x="-65" y="54" width="130" height="28" rx="10" fill={C.orangePale} />
      </g>
    </g>
    <g transform={`translate(${interpolate(f, [0, 40], [-260, 125], clamp)} ${570 + Math.sin(f / 6) * 8}) scale(${card1}) rotate(-8)`}>
      <rect x="-125" y="-65" width="250" height="130" rx="28" fill={C.paper} stroke="#E4D8C9" strokeWidth="4" />
      <circle cx="-70" cy="0" r="25" fill={C.orange} /><path d="M-84 2h28M-70 -12v26" stroke={C.paper} strokeWidth="6" strokeLinecap="round" />
      <text x="-30" y="10" fontSize="27" fill={C.navy} fontWeight="800">BERITA</text>
    </g>
    <g transform={`translate(${interpolate(f, [0, 50], [1300, 860], clamp)} ${690 + Math.sin(f / 7) * 9}) scale(${card2}) rotate(7)`}>
      <rect x="-120" y="-62" width="240" height="124" rx="26" fill={C.teal} />
      <path d="M-72 15l35 -42 35 42 35 -42" fill="none" stroke={C.navy} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
      <text x="0" y="48" textAnchor="middle" fontSize="22" fill={C.navy} fontWeight="800">DATA</text>
    </g>
    <g transform={`translate(${interpolate(f, [0, 60], [-260, 180], clamp)} 1080) scale(${card3}) rotate(5)`}>
      <rect x="-115" y="-62" width="230" height="124" rx="26" fill={C.lavender} />
      <circle cx="-55" cy="-8" r="23" fill={C.navy} /><path d="M-90 38q35 -45 70 0" fill="none" stroke={C.navy} strokeWidth="8" strokeLinecap="round" />
      <text x="22" y="9" fontSize="24" fill={C.navy} fontWeight="800">IDEA</text>
    </g>
    <Caption f={f} start={48} y={1450} width={800}>Semua berawal dari informasi.</Caption>
  </g>;
};

const SceneThink = ({ f }: { f: number }) => {
  const a = fade(f, 145, 325);
  const local = f - 145;
  const s = pop(f, 155, 22);
  const eyeY = Math.sin(local / 8) * 3;
  return <g opacity={a}>
    <text x="540" y="230" textAnchor="middle" fill={C.muted} fontSize="28" fontWeight="700" letterSpacing="7">02 / PROCESS</text>
    <Word x={540} y={335} size={76}>BERPIKIR</Word>
    <g transform={`translate(540 890) scale(${s})`}>
      <ellipse cx="0" cy="190" rx="245" ry="34" fill="#E7D7C6" opacity="0.55" />
      <path d="M-175 170q-25 -170 15 -330q45 -155 160 -165q130 -12 180 120q40 100 15 375q-90 75 -370 0" fill={C.orange} />
      <path d="M-170 90q-135 40 -150 145q-5 50 45 55q85 4 155 -60" fill={C.orange} />
      <path d="M170 90q135 40 150 145q5 50 -45 55q-85 4 -155 -60" fill={C.orange} />
      <ellipse cx="-72" cy={-12 + eyeY} rx="16" ry="23" fill={C.navy} />
      <ellipse cx="72" cy={-12 + eyeY} rx="16" ry="23" fill={C.navy} />
      <path d="M-105 -65l62 -15M43 -80l62 15" stroke={C.navy} strokeWidth="13" strokeLinecap="round" />
      <path d={local < 85 ? "M-45 70q45 -50 90 0" : "M-48 58q48 25 96 0"} fill="none" stroke={C.navy} strokeWidth="13" strokeLinecap="round" />
    </g>
    <g transform={`translate(770 ${570 - Math.sin(local / 8) * 12}) scale(${pop(f, 174, 18)})`}>
      <path d="M-100 80q-55 -30 -30 -85q18 -42 68 -35q20 -75 95 -48q70 25 40 92q50 50 -5 95q-80 40 -168 -19" fill={C.paper} stroke={C.navy} strokeWidth="7" />
      <text x="0" y="12" textAnchor="middle" fontSize="58" fontWeight="900" fill={C.orange}>?</text>
      <circle cx="-150" cy="-75" r="12" fill={C.tealDark} /><circle cx="140" cy="-90" r="17" fill={C.lavender} />
    </g>
    <g transform={`translate(245 ${640 + Math.sin(local / 9) * 12}) scale(${pop(f, 195, 18)})`}>
      <rect x="-88" y="-48" width="176" height="96" rx="26" fill={C.teal} />
      <path d="M-48 0h96M0 -28v56" stroke={C.navy} strokeWidth="9" strokeLinecap="round" />
    </g>
    <g transform={`translate(810 1170) scale(${pop(f, 225, 16)})`}>
      <rect x="-155" y="-65" width="310" height="130" rx="30" fill={C.paper} stroke="#E5D9CC" strokeWidth="4" />
      <path d="M-95 12q45 -85 90 0t90 0" fill="none" stroke={C.lavender} strokeWidth="12" strokeLinecap="round" />
    </g>
    <Caption f={f} start={205} y={1480} width={760}>Informasi mulai diolah.</Caption>
  </g>;
};

const SceneUnderstand = ({ f }: { f: number }) => {
  const a = fade(f, 300, 485);
  const local = f - 300;
  const nodes = [
    { x: -210, y: -120, c: C.orange, t: "FAKTA" },
    { x: 0, y: -190, c: C.teal, t: "POLA" },
    { x: 210, y: -120, c: C.lavender, t: "MAKNA" },
    { x: -105, y: 95, c: C.teal, t: "SEBAB" },
    { x: 115, y: 95, c: C.orangePale, t: "AKIBAT" },
  ];
  const progress = smooth(local, 10, 110);
  return <g opacity={a}>
    <text x="540" y="230" textAnchor="middle" fill={C.muted} fontSize="28" fontWeight="700" letterSpacing="7">03 / CLARITY</text>
    <Word x={540} y={335} size={76}>MEMAHAMI</Word>
    <g transform="translate(540 850)">
      <rect x="-365" y="-330" width="730" height="650" rx="48" fill={C.paper} stroke="#E8DED2" strokeWidth="4" />
      <g opacity="0.55"><path d="M-300 -245H300M-300 -125H300M-300 -5H300M-300 115H300" stroke={C.grid} strokeWidth="3" strokeDasharray="8 12" /></g>
      <g stroke={C.navy} strokeWidth="9" strokeLinecap="round" opacity={progress}>
        <path d={`M-210 -120L0 -190L210 -120L115 95L-105 95Z`} fill="none" strokeDasharray="900" strokeDashoffset={900 * (1 - progress)} />
        <path d={`M-210 -120L115 95M0 -190L-105 95`} fill="none" strokeDasharray="600" strokeDashoffset={600 * (1 - progress)} opacity="0.45" />
      </g>
      {nodes.map((n, i) => {
        const p = pop(f, 330 + i * 9, 17);
        return <g key={n.t} transform={`translate(${n.x * p} ${n.y * p}) scale(${p})`}>
          <circle r="75" fill={n.c} stroke={C.navy} strokeWidth="5" />
          <text y="9" textAnchor="middle" fontSize="22" fontWeight="900" fill={C.navy}>{n.t}</text>
        </g>;
      })}
      <circle cx="0" cy="-20" r="42" fill={C.navy} opacity={progress} />
      <path d="M-18 -20l13 14 27 -32" fill="none" stroke={C.paper} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" opacity={progress} />
    </g>
    <g transform={`translate(540 1280) scale(${pop(f, 405, 18)})`}>
      <rect x="-250" y="-58" width="500" height="116" rx="32" fill={C.orangePale} />
      <text textAnchor="middle" y="14" fontSize="39" fontWeight="900" fill={C.navy}>RUMIT  →  TERSTRUKTUR</text>
    </g>
    <Caption f={f} start={420} y={1510} width={760}>Kita mulai melihat hubungan.</Caption>
  </g>;
};

const SceneAct = ({ f }: { f: number }) => {
  const a = fade(f, 460, 606, 18);
  const local = f - 460;
  const walk = Math.sin(local / 5) * 15;
  const move = smooth(local, 20, 110);
  return <g opacity={a}>
    <text x="540" y="230" textAnchor="middle" fill={C.muted} fontSize="28" fontWeight="700" letterSpacing="7">04 / ACTION</text>
    <Word x={540} y={335} size={76}>BERTINDAK</Word>
    <g transform="translate(540 950)">
      <path d="M-430 260H430" stroke={C.navy} strokeWidth="9" strokeLinecap="round" />
      <g transform={`translate(${interpolate(local, [0, 140], [-210, 85], clamp)} 0)`}>
        <ellipse cx="0" cy="-210" rx="80" ry="92" fill={C.orange} stroke={C.navy} strokeWidth="6" />
        <circle cx="-27" cy="-220" r="9" fill={C.navy} /><circle cx="27" cy="-220" r="9" fill={C.navy} />
        <path d="M-24 -178q24 20 48 0" fill="none" stroke={C.navy} strokeWidth="8" strokeLinecap="round" />
        <path d="M-65 -112q-65 70 -48 200h226q15 -130 -48 -200" fill={C.teal} stroke={C.navy} strokeWidth="7" />
        <path d={`M-45 -35l${-45 + walk} 105M45 -35l${45 - walk} 105`} stroke={C.navy} strokeWidth="24" strokeLinecap="round" />
        <path d={`M-20 85l${-48 + walk} 145M20 85l${58 - walk} 145`} stroke={C.navy} strokeWidth="28" strokeLinecap="round" />
        <path d={`M-48 230l-45 0M78 230l45 0`} stroke={C.orange} strokeWidth="24" strokeLinecap="round" />
      </g>
      <g transform={`translate(${240 + move * 90} -50)`}>
        <rect x="-125" y="-250" width="250" height="510" rx="18" fill={C.navy} />
        <rect x="-96" y="-220" width="192" height="450" rx="8" fill={C.orangePale} />
        <circle cx="0" cy="-80" r="58" fill={C.orange} opacity="0.8" />
        <path d="M-65 140h130" stroke={C.tealDark} strokeWidth="16" strokeLinecap="round" />
        <path d="M0 -15v100m-40 -40l40 40 40 -40" fill="none" stroke={C.navy} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g opacity={move}>
        <path d="M-250 -30q80 -70 150 0" fill="none" stroke={C.orange} strokeWidth="8" strokeDasharray="12 15" />
        <path d="M-105 -30l-30 -30m30 30l-42 10" stroke={C.orange} strokeWidth="8" strokeLinecap="round" />
      </g>
    </g>
    <g transform={`translate(540 1280) scale(${pop(f, 515, 18)})`}>
      <rect x="-260" y="-58" width="520" height="116" rx="32" fill={C.orange} />
      <text textAnchor="middle" y="14" fontSize="42" fontWeight="900" fill={C.navy}>PENGETAHUAN → AKSI</text>
    </g>
    <Caption f={f} start={535} y={1510} width={760}>Pemahaman menjadi tindakan.</Caption>
  </g>;
};

const AudioBed: React.FC = () => <Audio src={staticFile("audio/vo-akal.mp3")} volume={1} />;

export const StyleframeAkalV38: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = interpolate(f, [0, DURATION], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ backgroundColor: C.cream, overflow: "hidden" }}>
      <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`}>
        <Grid />
        <SceneInfo f={f} />
        <SceneThink f={f} />
        <SceneUnderstand f={f} />
        <SceneAct f={f} />
        <g opacity="0.7">
          <text x="56" y="1835" fontSize="22" fill={C.navy} fontWeight="800" letterSpacing="4">ORION CREATIVE</text>
          <text x="1024" y="1835" fontSize="22" fill={C.navy} fontWeight="700" textAnchor="end">V3.8 / STORY MODE</text>
          <rect x="56" y="1860" width="968" height="5" rx="3" fill="#D7CDBF" />
          <rect x="56" y="1860" width={968 * progress} height="5" rx="3" fill={C.orange} />
        </g>
      </svg>
      <AudioBed />
    </AbsoluteFill>
  );
};

export const ORION_V38_DURATION = DURATION;
