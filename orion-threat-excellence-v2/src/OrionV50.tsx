import React from "react";
import { AbsoluteFill, Audio, Easing, interpolate, staticFile, useCurrentFrame } from "remotion";

// ORION MOTION GRAPHIC ENGINE V5.0 — REAL TALK / visual-storytelling prototype
// 1080x1920, 30fps, 2237 frames. Voiceover is retained from the V4.0 project.
const W = 1080;
const H = 1920;
const FPS = 30;
const DURATION = 2237;
const C = {
  ink: "#101923", deep: "#172635", panel: "#243746", paper: "#F3EFE6",
  white: "#FFFDF8", muted: "#AAB8C2", orange: "#FF8B5C", teal: "#72D0BE",
  red: "#E66F70", yellow: "#E8C66F", line: "#496071", dark: "#0B1219",
};
const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const mix = (f: number, a: number, b: number, x: number, y: number) =>
  interpolate(f, [a, b], [x, y], { ...clamp, easing: Easing.inOut(Easing.cubic) });
const pop = (f: number, at: number, span = 22) =>
  interpolate(f, [at, at + span], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.35)) });
const fade = (f: number, duration: number) =>
  interpolate(f, [0, 18, duration - 18, duration], [0, 1, 1, 0], clamp);
const drift = (f: number, amp: number, speed = 0.025) => Math.sin(f * speed) * amp;

const Txt: React.FC<{ x: number; y: number; children: React.ReactNode; size?: number; color?: string; anchor?: "start" | "middle" | "end"; weight?: number; spacing?: number }> = ({
  x, y, children, size = 30, color = C.white, anchor = "start", weight = 800, spacing = 0,
}) => <text x={x} y={y} fill={color} fontSize={size} fontWeight={weight} textAnchor={anchor} letterSpacing={spacing} fontFamily="Arial, sans-serif">{children}</text>;

const Person: React.FC<{ x: number; y: number; s?: number; color?: string; f: number; mood?: "calm" | "tense" | "confident" }> = ({ x, y, s = 1, color = C.teal, f, mood = "calm" }) => {
  const bob = Math.sin(f * 0.09) * 5;
  const lean = mood === "tense" ? Math.sin(f * 0.12) * 2.5 : 0;
  return <g transform={`translate(${x + lean} ${y + bob}) scale(${s})`}>
    <ellipse cx="0" cy="220" rx="92" ry="18" fill={C.dark} opacity=".35" />
    <path d="M-78 200 Q-75 88 -42 66 L42 66 Q75 88 78 200 Z" fill={color} />
    <path d="M-44 76 L-12 115 L0 94 L14 115 L44 76" fill={C.white} opacity=".82" />
    <rect x="-18" y="34" width="36" height="42" rx="12" fill="#C98F72" />
    <circle cx="0" cy="0" r="48" fill="#D6A184" />
    <path d="M-49 -5 Q-45 -58 0 -53 Q48 -54 50 -3 L34 -23 Q4 -42 -26 -21 L-42 8 Z" fill="#26323A" />
    <circle cx="-17" cy="4" r="4" fill="#26323A"/><circle cx="17" cy="4" r="4" fill="#26323A"/>
    {mood === "tense" ? <path d="M-16 26 Q0 16 16 26" stroke="#754C42" strokeWidth="4" fill="none" strokeLinecap="round"/> : <path d="M-13 25 Q0 34 13 25" stroke="#754C42" strokeWidth="4" fill="none" strokeLinecap="round"/>}
    <path d="M-75 112 L-120 178 M75 112 L120 178" stroke={color} strokeWidth="22" strokeLinecap="round" />
  </g>;
};

const SceneHook: React.FC<{ f: number }> = ({ f }) => {
  const reveal = pop(f, 8, 28);
  const ring = mix(f, 0, 190, 120, 390);
  return <g>
    <g transform={`translate(540 930) rotate(${mix(f, 0, 240, -8, 0)})`}>
      <rect x="-360" y="-260" width="720" height="520" rx="38" fill={C.deep} stroke={C.line} strokeWidth="3" />
      <path d="M-300 -155 H300 M-300 0 H300 M-300 155 H300" stroke={C.line} strokeWidth="2" opacity=".5" />
      <g transform={`scale(${.75 + reveal * .25})`}>
        <circle r="112" fill={C.orange} opacity=".14" />
        <path d="M-72 15 L-22 -38 L22 0 L86 -88" fill="none" stroke={C.orange} strokeWidth="17" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M48 -88 H86 V-50" fill="none" stroke={C.orange} strokeWidth="14" strokeLinecap="round" />
        <circle cx="-72" cy="15" r="12" fill={C.teal}/><circle cx="86" cy="-88" r="16" fill={C.teal}/>
      </g>
      <circle r={ring} fill="none" stroke={C.orange} strokeWidth="3" opacity={.55 - reveal * .2}/>
    </g>
    {Array.from({ length: 7 }, (_, i) => {
      const x = 150 + i * 130;
      const y = 500 + Math.sin(f * .045 + i) * 20;
      return <g key={i} opacity={.25 + reveal * .55}><path d={`M${x} ${y} l0 100`} stroke={i % 2 ? C.teal : C.orange} strokeWidth="3"/><circle cx={x} cy={y} r="8" fill={i % 2 ? C.teal : C.orange}/></g>;
    })}
    <Txt x={540} y={1510} size={28} color={C.muted} anchor="middle" spacing={5}>KETIKA KEMAMPUAN</Txt>
    <Txt x={540} y={1595} size={58} anchor="middle">DIANGGAP ANCAMAN</Txt>
  </g>;
};

const SceneRoom: React.FC<{ f: number }> = ({ f }) => {
  const slide = mix(f, 0, 190, 160, 0);
  const light = pop(f, 65, 35);
  return <g>
    <g transform={`translate(${slide} 0)`}>
      <path d="M100 650 L540 420 L980 650 V1420 H100 Z" fill={C.deep} stroke={C.line} strokeWidth="4" />
      <path d="M100 650 H980 M540 420 V1420" stroke={C.line} strokeWidth="3" opacity=".65" />
      {Array.from({ length: 4 }, (_, i) => <g key={i}>
        <rect x={160 + i * 190} y="760" width="135" height="270" rx="12" fill={C.panel} stroke={C.line} strokeWidth="2" />
        <rect x={180 + i * 190} y="790" width="95" height="10" rx="5" fill={C.muted} opacity=".45" />
        <rect x={180 + i * 190} y="825" width="70" height="10" rx="5" fill={C.muted} opacity=".25" />
        <circle cx={228 + i * 190} cy="1100" r="32" fill={i === 2 ? C.orange : C.muted} opacity={i === 2 ? .95 : .45} />
      </g>)}
      <g transform={`translate(0 ${mix(f, 30, 140, 120, 0)})`} opacity={light}>
        <rect x="390" y="1140" width="300" height="170" rx="20" fill={C.orange} opacity=".17" stroke={C.orange} strokeWidth="3" />
        <Txt x={540} y={1240} size={28} color={C.orange} anchor="middle">IDE BARU</Txt>
      </g>
    </g>
    <Person x={540} y={1180} s={.72} color={C.teal} f={f} mood="confident" />
    <path d={`M170 ${1500 + drift(f, 10)} H910`} stroke={C.orange} strokeWidth="5" strokeDasharray="12 20" />
    <Txt x={540} y={1630} size={42} anchor="middle">KEHADIRAN MENGUBAH</Txt>
    <Txt x={540} y={1690} size={54} color={C.orange} anchor="middle">PERMAINAN</Txt>
  </g>;
};

const SceneSkill: React.FC<{ f: number }> = ({ f }) => {
  const card = pop(f, 15, 32);
  const rows = [0, 1, 2, 3];
  return <g>
    <g transform={`translate(540 950) rotate(${mix(f, 0, 220, 7, -2)}) scale(${.82 + card * .18})`}>
      <rect x="-300" y="-350" width="600" height="700" rx="32" fill={C.paper} />
      <rect x="-250" y="-290" width="500" height="80" rx="15" fill={C.deep} />
      <Txt x={0} y={-238} size={30} anchor="middle">WORKFLOW BARU</Txt>
      {rows.map((r) => <g key={r} opacity={pop(f, 35 + r * 24, 20)}>
        <rect x="-245" y={-145 + r * 115} width="490" height="78" rx="14" fill={r === 2 ? "#D3E9E2" : "#DDD8CE"} />
        <circle cx={-205} cy={-106 + r * 115} r="15" fill={r === 2 ? C.teal : C.line} />
        <rect x="-172" y={-123 + r * 115} width={230 + (r % 2) * 90} height="12" rx="6" fill={C.deep} opacity=".65" />
        <rect x="-172" y={-99 + r * 115} width={130 + (r % 3) * 40} height="8" rx="4" fill={C.line} opacity=".35" />
      </g>)}
    </g>
    <g opacity={pop(f, 105, 30)}>
      <path d={`M180 1450 Q${350 + drift(f, 25)} 1280 470 1360 T900 1110`} stroke={C.teal} strokeWidth="10" fill="none" strokeLinecap="round" strokeDasharray="18 12" />
      <circle cx={mix(f, 105, 220, 180, 900)} cy={mix(f, 105, 220, 1450, 1110)} r="17" fill={C.orange}/>
    </g>
    <Txt x={540} y={1580} size={34} anchor="middle">CARA KERJA LEBIH BAIK</Txt>
    <Txt x={540} y={1640} size={34} color={C.teal} anchor="middle">PIKIRAN LEBIH TERBUKA</Txt>
  </g>;
};

const SceneResistance: React.FC<{ f: number }> = ({ f }) => {
  const crack = pop(f, 90, 70);
  const shake = f > 90 && f < 150 ? Math.sin(f * 1.7) * 7 : 0;
  return <g>
    <g transform={`translate(${shake} 0)`}>
      <rect x="105" y="540" width="870" height="980" rx="30" fill={C.deep} stroke={C.line} strokeWidth="4" />
      {Array.from({ length: 6 }, (_, i) => <g key={i}>
        <rect x={170 + i * 130} y="690" width="82" height="600" rx="12" fill={i === 3 ? C.orange : C.panel} opacity={i === 3 ? .9 : .8} />
        <path d={`M${180 + i * 130} 760 h62 M${180 + i * 130} 815 h62`} stroke={C.muted} strokeWidth="7" opacity=".25" />
      </g>)}
      <path d={`M540 550 L${510 - crack * 90} 850 L${590 + crack * 100} 1010 L${500 - crack * 65} 1220 L540 1510`} stroke={C.orange} strokeWidth={4 + crack * 12} fill="none" strokeLinecap="round" />
      <circle cx="540" cy="1020" r={90 + crack * 210} fill="none" stroke={C.orange} strokeWidth="3" opacity={crack * .6} />
    </g>
    <Txt x={540} y={1630} size={37} anchor="middle">PERUBAHAN MENGGUNCANG</Txt>
    <Txt x={540} y={1690} size={46} color={C.orange} anchor="middle">STATUS QUO</Txt>
  </g>;
};

const SceneAttack: React.FC<{ f: number }> = ({ f }) => {
  const labels = ["SOK PINTAR", "TERLALU AMBISIUS", "SULIT DIAJAK KERJA SAMA"];
  return <g>
    <Person x={540} y={850} s={1.08} color={C.teal} f={f} mood="tense" />
    {labels.map((label, i) => {
      const x = [265, 810, 540][i];
      const y = [650, 1080, 1450][i];
      const a = pop(f, 24 + i * 42, 24);
      const rot = [-7, 6, -3][i];
      return <g key={label} opacity={a} transform={`translate(${x} ${y}) rotate(${rot}) scale(${.72 + a * .28})`}>
        <path d="M-190 0 H-220 M190 0 H220" stroke={C.red} strokeWidth="5" />
        <rect x="-190" y="-48" width="380" height="96" rx="18" fill={C.red} />
        <Txt x={0} y={9} size={label.length > 20 ? 19 : 25} anchor="middle">{label}</Txt>
      </g>;
    })}
    <circle cx="540" cy="1000" r={210 + Math.sin(f * .12) * 9} fill="none" stroke={C.red} strokeWidth="3" strokeDasharray="8 18" opacity=".5" />
  </g>;
};

const SceneSelfCheck: React.FC<{ f: number }> = ({ f }) => {
  const left = pop(f, 15, 28);
  const right = pop(f, 55, 28);
  return <g>
    <path d="M540 520 V1450" stroke={C.line} strokeWidth="3" strokeDasharray="8 14" />
    <g opacity={left} transform={`translate(${mix(f, 0, 120, -55, 0)} 0)`}>
      <rect x="80" y="600" width="430" height="760" rx="30" fill={C.teal} opacity=".12" stroke={C.teal} strokeWidth="3" />
      <Person x={295} y={790} s={.75} color={C.teal} f={f} />
      <Txt x={295} y={1250} size={25} anchor="middle">LINGKUNGAN</Txt>
      <Txt x={295} y={1300} size={29} color={C.teal} anchor="middle">TIDAK SEHAT?</Txt>
    </g>
    <g opacity={right} transform={`translate(${mix(f, 0, 120, 55, 0)} 0)`}>
      <rect x="570" y="600" width="430" height="760" rx="30" fill={C.orange} opacity=".12" stroke={C.orange} strokeWidth="3" />
      <Person x={785} y={790} s={.75} color={C.orange} f={f} mood="tense" />
      <Txt x={785} y={1250} size={25} anchor="middle">KOMUNIKASI</Txt>
      <Txt x={785} y={1300} size={25} color={C.orange} anchor="middle">PERLU DIPERBAIKI?</Txt>
    </g>
    <Txt x={540} y={1530} size={34} anchor="middle">JANGAN TERBURU-BURU</Txt>
    <Txt x={540} y={1590} size={42} color={C.yellow} anchor="middle">MERASA PALING HEBAT</Txt>
  </g>;
};

const SceneGrowth: React.FC<{ f: number }> = ({ f }) => {
  const t = pop(f, 15, 36);
  return <g>
    <path d="M120 1430 H960" stroke={C.line} strokeWidth="5" />
    {Array.from({ length: 5 }, (_, i) => {
      const h = 160 + i * 120;
      const v = mix(f, 0, 170, 0, h);
      return <g key={i}>
        <rect x={145 + i * 165} y={1430 - v} width="95" height={v} rx="12" fill={[C.panel, C.teal, C.yellow, C.orange, C.white][i]} />
        <circle cx={192 + i * 165} cy={1430 - v - 20} r="10" fill={C.ink} opacity={t} />
      </g>;
    })}
    <path d={`M130 1200 Q330 ${1100 - t * 80} 510 ${1000 - t * 120} T930 ${610 - t * 80}`} stroke={C.orange} strokeWidth="9" fill="none" strokeLinecap="round" />
    <path d="M870 625 L940 590 L930 670" stroke={C.orange} strokeWidth="9" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <Txt x={540} y={1580} size={43} anchor="middle">TETAP RENDAH HATI</Txt>
    <Txt x={540} y={1645} size={38} color={C.teal} anchor="middle">TINGKATKAN KEMAMPUAN</Txt>
  </g>;
};

const SceneProof: React.FC<{ f: number }> = ({ f }) => {
  const reveal = pop(f, 18, 38);
  const metric = mix(f, 30, 180, 0, 100);
  return <g>
    <g transform={`translate(540 960) scale(${.75 + reveal * .25})`}>
      <rect x="-320" y="-340" width="640" height="680" rx="32" fill={C.paper} />
      <rect x="-270" y="-280" width="540" height="76" rx="14" fill={C.deep} />
      <Txt x={0} y={-230} size={29} anchor="middle">HASIL KERJA</Txt>
      <path d="M-240 230 H240 M-240 100 H240 M-240 -30 H240" stroke="#C8C2B8" strokeWidth="2" />
      <path d={`M-220 190 L-90 ${130 - metric * .45} L35 ${160 - metric * .62} L205 ${-100 - metric}`} stroke="#268F7D" strokeWidth="15" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="205" cy={-100 - metric} r="22" fill={C.orange} />
      <rect x="-220" y="260" width={metric * 4.4} height="18" rx="9" fill="#268F7D" />
    </g>
    <g opacity={reveal}>
      <Txt x={540} y={1450} size={39} anchor="middle">BUKTIKAN DENGAN HASIL</Txt>
      <Txt x={540} y={1520} size={34} color={C.orange} anchor="middle">BUKAN SEKADAR OMONGAN</Txt>
    </g>
  </g>;
};

const SceneEnd: React.FC<{ f: number }> = ({ f }) => {
  const grow = pop(f, 12, 40);
  const scale = 1 + grow * .22 + Math.sin(f * .06) * .012;
  return <g>
    <g transform={`translate(540 940) scale(${scale})`}>
      <circle r="260" fill="none" stroke={C.teal} strokeWidth="3" opacity=".5" />
      <circle r="205" fill={C.teal} opacity=".09" />
      <path d="M0 220 V-180 M0 -180 L-100 -80 M0 -180 L100 -80" stroke={C.teal} strokeWidth="17" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {Array.from({ length: 8 }, (_, i) => <circle key={i} cx={Math.cos(i * Math.PI / 4) * 330} cy={Math.sin(i * Math.PI / 4) * 330} r="9" fill={i % 2 ? C.orange : C.yellow} />)}
    </g>
    <Txt x={540} y={1450} size={58} anchor="middle">TERUS BERTUMBUH</Txt>
    <Txt x={540} y={1530} size={27} color={C.muted} anchor="middle">MESKI RUANGAN TAK MEMBERI TEMPAT</Txt>
    <Txt x={540} y={1680} size={30} color={C.orange} anchor="middle" spacing={4}>GROW BEYOND THE ROOM</Txt>
  </g>;
};

type SceneDef = { from: number; duration: number; tag: string; title: string; Component: React.FC<{ f: number }> };
const scenes: SceneDef[] = [
  { from: 0, duration: 240, tag: "HOOK", title: "Kemampuan bisa dianggap ancaman", Component: SceneHook },
  { from: 225, duration: 255, tag: "CONTEXT", title: "Kehadiran mengubah permainan", Component: SceneRoom },
  { from: 465, duration: 270, tag: "CAPABILITY", title: "Cara kerja dan pikiran terbuka", Component: SceneSkill },
  { from: 720, duration: 270, tag: "RESISTANCE", title: "Perubahan mengguncang kenyamanan", Component: SceneResistance },
  { from: 975, duration: 270, tag: "CONFLICT", title: "Orangnya diserang, bukan idenya", Component: SceneAttack },
  { from: 1230, duration: 300, tag: "SELF-CHECK", title: "Periksa lingkungan dan diri", Component: SceneSelfCheck },
  { from: 1515, duration: 255, tag: "GROWTH", title: "Rendah hati, tingkatkan kemampuan", Component: SceneGrowth },
  { from: 1755, duration: 270, tag: "PROOF", title: "Buktikan lewat hasil", Component: SceneProof },
  { from: 1995, duration: 242, tag: "CLOSING", title: "Terus bertumbuh", Component: SceneEnd },
];

export const OrionV50: React.FC = () => {
  const frame = useCurrentFrame();
  const scene = scenes.find((s) => frame >= s.from && frame < s.from + s.duration) ?? scenes[scenes.length - 1];
  const local = frame - scene.from;
  const Component = scene.Component;
  const sceneOpacity = fade(local, scene.duration);
  const progress = frame / (DURATION - 1);
  return <AbsoluteFill style={{ backgroundColor: C.ink, overflow: "hidden" }}>
    <Audio src={staticFile("audio/orion-v40-voiceover.mp3")} volume={1} />
    <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`}>
      <defs>
        <radialGradient id="v50bg"><stop offset="0%" stopColor="#294354"/><stop offset="100%" stopColor={C.ink}/></radialGradient>
        <linearGradient id="v50shade" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.ink} stopOpacity=".78"/><stop offset="100%" stopColor={C.ink} stopOpacity="0"/></linearGradient>
        <filter id="v50shadow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="18"/></filter>
      </defs>
      <rect width={W} height={H} fill="url(#v50bg)" />
      <g opacity=".12" transform={`translate(${drift(frame, 14)} ${drift(frame, 10, .018)})`}>
        {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M${i * 100} 0 V1920`} stroke={C.line} strokeWidth="1" />)}
        {Array.from({ length: 20 }, (_, i) => <path key={i} d={`M0 ${i * 100} H1080`} stroke={C.line} strokeWidth="1" />)}
      </g>
      <text x="76" y="82" fill={C.muted} fontSize="18" fontWeight="800" letterSpacing="4">ORION CREATIVE / REAL TALK</text>
      <text x="1004" y="82" fill={C.orange} fontSize="18" fontWeight="900" textAnchor="end">ENGINE V5.0</text>
      <g opacity={sceneOpacity}><Component f={local} /></g>
      <rect x="0" y="0" width={W} height="380" fill="url(#v50shade)" />
      <g opacity={sceneOpacity}>
        <text x="76" y="185" fill={C.orange} fontSize="20" fontWeight="900" letterSpacing="4">{scene.tag}</text>
        <text x="76" y="260" fill={C.white} fontSize={scene.title.length > 29 ? 36 : 43} fontWeight="900">{scene.title}</text>
      </g>
      <rect x="76" y="1840" width="928" height="5" rx="3" fill={C.line} />
      <rect x="76" y="1840" width={928 * progress} height="5" rx="3" fill={C.orange} />
      <text x="76" y="1884" fill={C.muted} fontSize="17" fontWeight="700" letterSpacing="2">ORION MOTION GRAPHIC SYSTEM</text>
      <text x="1004" y="1884" fill={C.muted} fontSize="17" textAnchor="end">{Math.floor(frame / FPS / 60)}:{String(Math.floor(frame / FPS) % 60).padStart(2, "0")}</text>
    </svg>
  </AbsoluteFill>;
};

export const ORION_V50_DURATION = DURATION;
