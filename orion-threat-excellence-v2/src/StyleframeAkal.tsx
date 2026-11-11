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
  bg: "#061126",
  deep: "#091B36",
  blue: "#15345A",
  orange: "#FF805C",
  coral: "#FFB08F",
  gold: "#FFD17A",
  cyan: "#79E8F4",
  white: "#F7F5F0",
  muted: "#A8B9D0",
};
const CLAMP = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};
const out = Easing.out(Easing.cubic);
const soft = Easing.inOut(Easing.cubic);

const fade = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], { ...CLAMP, easing: out });
const move = (f: number, a: number, b: number, from: number, to = 0) =>
  interpolate(f, [a, b], [from, to], { ...CLAMP, easing: Easing.out(Easing.back(1.15)) });
const zoom = (f: number, a: number, b: number, from: number, to: number) =>
  interpolate(f, [a, b], [from, to], { ...CLAMP, easing: soft });

const brainPath = `
 M540 310
 C470 205 330 205 275 300
 C165 280 100 375 140 475
 C55 550 105 675 210 700
 C180 810 295 895 390 825
 C445 905 510 885 540 825
 C570 885 635 905 690 825
 C785 895 900 810 870 700
 C975 675 1025 550 940 475
 C980 375 915 280 805 300
 C750 205 610 205 540 310 Z
`;

const brainFolds = [
  "M300 340 C390 360 405 430 375 490",
  "M205 470 C300 470 330 545 300 625",
  "M285 710 C365 650 430 680 450 760",
  "M430 285 C485 350 470 420 445 470",
  "M780 340 C690 360 675 430 705 490",
  "M875 470 C780 470 750 545 780 625",
  "M795 710 C715 650 650 680 630 760",
  "M650 285 C595 350 610 420 635 470",
];

const particles = Array.from({ length: 46 }, (_, i) => ({
  angle: (i / 46) * Math.PI * 2,
  radius: 330 + (i % 5) * 34,
  size: 3 + (i % 4),
  phase: i * 17,
}));

const networkNodes = [
  [140, 220], [300, 120], [490, 220], [690, 130], [900, 240],
  [190, 460], [390, 390], [590, 490], [820, 420],
  [100, 730], [320, 680], [540, 760], [760, 680], [960, 760],
  [240, 980], [470, 930], [700, 1020], [890, 960],
];
const networkEdges = [
  [0,1],[1,2],[2,3],[3,4],[0,5],[1,6],[2,6],[2,7],[3,8],[4,8],
  [5,6],[6,7],[7,8],[5,9],[5,10],[6,10],[7,11],[8,12],[8,13],
  [9,10],[10,11],[11,12],[12,13],[9,14],[10,14],[10,15],[11,15],
  [11,16],[12,16],[13,17],[14,15],[15,16],[16,17],
];

const Word: React.FC<{
  frame: number;
  start: number;
  end: number;
  kicker: string;
  word: string;
  sub?: string;
  align?: "center" | "left";
}> = ({ frame, start, end, kicker, word, sub, align = "center" }) => {
  if (frame < start || frame > end) return null;
  const opacity = interpolate(frame, [start, start + 8, end - 8, end], [0, 1, 1, 0], CLAMP);
  const y = move(frame, start, start + 14, 72);
  const scale = interpolate(frame, [start, start + 8, start + 18], [0.82, 1.07, 1], CLAMP);
  return (
    <div style={{
      position: "absolute", left: 76, right: 76, top: 1260,
      textAlign: align, opacity, transform: `translateY(${y}px) scale(${scale})`,
    }}>
      <div style={{ color: C.gold, fontSize: 24, fontWeight: 800, letterSpacing: 7, marginBottom: 18 }}>
        {kicker}
      </div>
      <div style={{
        color: C.white, fontSize: 88, lineHeight: 0.98, fontWeight: 900,
        letterSpacing: -4, textShadow: `0 0 38px ${C.orange}55`,
      }}>{word}</div>
      {sub && <div style={{ color: C.muted, fontSize: 27, lineHeight: 1.4, marginTop: 24, letterSpacing: 1 }}>{sub}</div>}
    </div>
  );
};

const BrandMark: React.FC<{ frame: number }> = ({ frame }) => {
  const opacity = fade(frame, 4, 22);
  return (
    <div style={{
      position: "absolute", top: 74, left: 76, right: 76, display: "flex",
      justifyContent: "space-between", alignItems: "center", opacity,
      fontSize: 18, letterSpacing: 4, fontWeight: 800,
    }}>
      <span style={{ color: C.white }}>ORION <span style={{ color: C.orange }}>CREATIVE</span></span>
      <span style={{ color: C.muted }}>MOTION STUDY / 01</span>
    </div>
  );
};

const Brain: React.FC<{ frame: number; scale?: number; opacity?: number }> = ({
  frame, scale = 1, opacity = 1,
}) => {
  const pulse = 1 + Math.sin(frame * 0.13) * 0.018;
  const tilt = Math.sin(frame * 0.035) * 2.5;
  const glow = 0.5 + Math.sin(frame * 0.16) * 0.2;
  return (
    <div style={{
      position: "absolute", left: "50%", top: "43%",
      width: 930, height: 760, marginLeft: -465, marginTop: -380,
      transform: `scale(${scale * pulse}) rotate(${tilt}deg)`,
      opacity, filter: `drop-shadow(0 0 ${28 + glow * 24}px ${C.orange}66)`,
    }}>
      <svg viewBox="0 0 1080 1080" width="100%" height="100%">
        <defs>
          <linearGradient id="brainFillV34" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFD0B8" />
            <stop offset="55%" stopColor="#FF9678" />
            <stop offset="100%" stopColor="#D95D50" />
          </linearGradient>
          <radialGradient id="brainHaloV34">
            <stop offset="0%" stopColor={C.orange} stopOpacity="0.34" />
            <stop offset="100%" stopColor={C.orange} stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="540" cy="560" r="500" fill="url(#brainHaloV34)" />
        {[0,1,2].map((i) => (
          <circle key={i} cx="540" cy="560" r={410 + i * 55 + Math.sin(frame * .06 + i) * 12}
            fill="none" stroke={i === 1 ? C.cyan : C.gold} strokeWidth="2"
            strokeDasharray={i === 1 ? "5 18" : "2 22"} opacity={0.24 + 0.16 * Math.sin(frame * .08 + i)}
            transform={`rotate(${frame * (i % 2 ? -.35 : .45)} 540 560)`} />
        ))}
        <path d={brainPath} fill="url(#brainFillV34)" stroke="#FFD6C5" strokeWidth="8" />
        <path d="M540 315 C510 405 565 485 540 560 C515 635 565 720 540 825"
          fill="none" stroke="#A94E48" strokeWidth="10" strokeLinecap="round" />
        {brainFolds.map((d, i) => <path key={i} d={d} fill="none" stroke="#B95C51"
          strokeWidth="10" strokeLinecap="round" opacity=".82" />)}
        {Array.from({ length: 16 }, (_, i) => {
          const a = (i / 16) * Math.PI * 2 + frame * .006;
          const x = 540 + Math.cos(a) * 390;
          const y = 560 + Math.sin(a) * 320;
          const p = .5 + .5 * Math.sin(frame * .18 + i);
          return <g key={i}>
            <circle cx={x} cy={y} r={10 + p * 10} fill={C.cyan} opacity={.08 + p * .16} />
            <circle cx={x} cy={y} r="5" fill={C.white} opacity={.6 + p * .4} />
          </g>;
        })}
      </svg>
    </div>
  );
};

const NeuralWorld: React.FC<{ frame: number }> = ({ frame }) => {
  const pulseIndex = (frame * 0.17) % networkEdges.length;
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1080 1200" style={{ position: "absolute", top: 260, width: "100%", height: 1200 }}>
        <defs>
          <filter id="neonV34"><feGaussianBlur stdDeviation="8" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>
        {networkEdges.map(([a,b], i) => {
          const p = (frame * .12 + i * 2.7) % 36;
          const active = p < 12;
          return <g key={i}>
            <line x1={networkNodes[a][0]} y1={networkNodes[a][1]} x2={networkNodes[b][0]} y2={networkNodes[b][1]}
              stroke={active ? C.cyan : "#55769A"} strokeWidth={active ? 4 : 2}
              opacity={active ? .85 : .23} />
            {active && <circle cx={networkNodes[a][0] + (networkNodes[b][0]-networkNodes[a][0])*(p/12)}
              cy={networkNodes[a][1] + (networkNodes[b][1]-networkNodes[a][1])*(p/12)}
              r="9" fill={C.white} filter="url(#neonV34)" />}
          </g>;
        })}
        {networkNodes.map(([x,y], i) => {
          const q = .5 + .5 * Math.sin(frame * .14 + i * 1.7);
          return <g key={i}>
            <circle cx={x} cy={y} r={14 + q*13} fill={C.cyan} opacity={.08 + q*.17}/>
            <circle cx={x} cy={y} r="6" fill={C.white} opacity={.55 + q*.45}/>
          </g>;
        })}
      </svg>
      <div style={{
        position: "absolute", top: 420, left: 0, right: 0, textAlign: "center",
        opacity: .12 + .08 * Math.sin(frame * .11), color: C.cyan,
        fontSize: 170, fontWeight: 900, letterSpacing: 14,
      }}>NEURAL</div>
    </AbsoluteFill>
  );
};

const ThoughtCards: React.FC<{ frame: number }> = ({ frame }) => {
  const cards = [
    { x: 100, y: 430, title: "INFORMASI", sub: "Apa yang diterima", n: "01" },
    { x: 560, y: 650, title: "INGATAN", sub: "Apa yang disimpan", n: "02" },
    { x: 115, y: 880, title: "MAKNA", sub: "Apa yang dipahami", n: "03" },
  ];
  return (
    <AbsoluteFill>
      <svg style={{ position: "absolute", inset: 0 }} viewBox="0 0 1080 1920">
        <path d="M270 560 C650 470 730 700 760 790 S390 900 320 1050"
          fill="none" stroke={C.cyan} strokeWidth="3" strokeDasharray="8 15" opacity=".5"
          strokeDashoffset={-frame * 3} />
      </svg>
      {cards.map((c, i) => {
        const start = 218 + i * 18;
        const op = fade(frame, start, start + 12) * (1 - fade(frame, 310, 326));
        const y = move(frame, start, start + 16, 80 + i * 15);
        const glow = .18 + .12 * Math.sin(frame * .1 + i);
        return <div key={c.n} style={{
          position: "absolute", left: c.x, top: c.y, width: 420, padding: "28px 30px",
          borderRadius: 24, background: "linear-gradient(135deg, rgba(26,57,94,.96), rgba(11,29,55,.94))",
          border: "1px solid rgba(121,232,244,.35)",
          boxShadow: `0 18px 70px rgba(0,0,0,.25), 0 0 38px rgba(121,232,244,${glow})`,
          opacity: op, transform: `translateY(${y}px)`,
        }}>
          <div style={{ color: C.orange, fontSize: 18, fontWeight: 900, letterSpacing: 4 }}>{c.n} / PROCESS</div>
          <div style={{ color: C.white, fontSize: 36, fontWeight: 900, marginTop: 13 }}>{c.title}</div>
          <div style={{ color: C.muted, fontSize: 23, marginTop: 9 }}>{c.sub}</div>
        </div>;
      })}
    </AbsoluteFill>
  );
};

const Closing: React.FC<{ frame: number }> = ({ frame }) => {
  const op = fade(frame, 332, 352);
  const y = move(frame, 332, 354, 95);
  const pulse = 1 + .012 * Math.sin(frame * .22);
  return (
    <AbsoluteFill style={{ opacity: op }}>
      <div style={{
        position: "absolute", top: 480, left: 70, right: 70, textAlign: "center",
        transform: `translateY(${y}px) scale(${pulse})`,
      }}>
        <div style={{ color: C.gold, fontSize: 24, letterSpacing: 8, fontWeight: 900 }}>AKAL BUKAN SEKADAR INGAT</div>
        <div style={{ color: C.white, fontSize: 86, lineHeight: 1.08, fontWeight: 900, marginTop: 32 }}>
          BERPIKIR<span style={{ color: C.orange }}>.</span>
        </div>
        <div style={{ color: C.white, fontSize: 86, lineHeight: 1.08, fontWeight: 900 }}>
          MEMAHAMI<span style={{ color: C.orange }}>.</span>
        </div>
        <div style={{ color: C.white, fontSize: 86, lineHeight: 1.08, fontWeight: 900 }}>
          BERTINDAK<span style={{ color: C.orange }}>.</span>
        </div>
        <div style={{ width: 110, height: 5, background: C.orange, margin: "44px auto 28px", borderRadius: 9 }} />
        <div style={{ color: C.muted, fontSize: 27, letterSpacing: 2 }}>Berpikir sebelum bertindak.</div>
      </div>
      <Brain frame={frame} scale={.38} opacity={.34} />
    </AbsoluteFill>
  );
};

export const StyleframeAkal: React.FC = () => {
  const f = useCurrentFrame();

  const scene1 = 1 - fade(f, 82, 98);
  const scene2 = fade(f, 82, 100) * (1 - fade(f, 202, 218));
  const scene3 = fade(f, 202, 220) * (1 - fade(f, 320, 338));
  const scene4 = fade(f, 320, 340);

  const camera1 = zoom(f, 0, 86, .78, 1.04);
  const camera2 = zoom(f, 88, 205, 1.15, 1.72);
  const camera3 = zoom(f, 205, 325, .9, 1.02);

  const progress = interpolate(f, [0, 449], [0, 100], CLAMP);
  const energy = .35 + .18 * Math.sin(f * .09);

  return (
    <AbsoluteFill style={{
      background: C.bg, color: C.white, overflow: "hidden",
      fontFamily: "Arial, Helvetica, sans-serif",
    }}>
      <AbsoluteFill style={{
        background: "radial-gradient(ellipse at 50% 42%, #1A3A63 0%, #0B1E3A 43%, #061126 100%)",
      }} />
      <AbsoluteFill style={{
        background: `radial-gradient(circle at 50% 50%, rgba(255,128,92,${energy*.16}) 0%, transparent 48%)`,
      }} />

      <BrandMark frame={f} />

      {/* BABAK 1 — partikel membentuk otak */}
      <AbsoluteFill style={{ opacity: scene1 }}>
        {particles.map((p, i) => {
          const gather = interpolate(f, [0, 58], [p.radius, 150 + (i % 7) * 10], CLAMP);
          const angle = p.angle + f * .004;
          const x = 540 + Math.cos(angle) * gather;
          const y = 790 + Math.sin(angle) * gather * .72;
          const a = fade(f, 0, 35) * (1 - fade(f, 70, 94));
          return <div key={i} style={{
            position: "absolute", left: x, top: y, width: p.size, height: p.size,
            borderRadius: "50%", background: i % 4 === 0 ? C.cyan : C.gold,
            opacity: a, boxShadow: `0 0 22px ${i % 4 === 0 ? C.cyan : C.orange}`,
          }} />;
        })}
        <div style={{ transform: `scale(${camera1})`, transformOrigin: "50% 43%" }}>
          <Brain frame={f} scale={zoom(f, 24, 72, .48, .88)} opacity={fade(f, 12, 35)} />
        </div>
        <div style={{
          position: "absolute", top: 340, left: 70, right: 70, textAlign: "center",
          opacity: fade(f, 4, 20), transform: `translateY(${move(f, 4, 24, 55)}px)`,
        }}>
          <div style={{ color: C.gold, fontSize: 23, fontWeight: 900, letterSpacing: 8 }}>PERTANYAAN MENDASAR</div>
          <div style={{ color: C.white, fontSize: 106, fontWeight: 900, lineHeight: .98, letterSpacing: -5, marginTop: 20 }}>
            APA ITU<br/><span style={{ color: C.orange }}>AKAL?</span>
          </div>
        </div>
        <Word frame={f} start={55} end={91} kicker="LEBIH DARI SEKADAR" word="MENGINGAT" sub="Akal mengolah apa yang kita ketahui." />
      </AbsoluteFill>

      {/* BABAK 2 — masuk ke dunia jaringan saraf */}
      <AbsoluteFill style={{ opacity: scene2 }}>
        <div style={{
          position: "absolute", inset: 0,
          transform: `scale(${camera2})`, transformOrigin: "50% 48%",
        }}>
          <NeuralWorld frame={f} />
        </div>
        <div style={{
          position: "absolute", top: 270, left: 70, right: 70, textAlign: "center",
          opacity: fade(f, 100, 116),
        }}>
          <div style={{ color: C.cyan, fontSize: 22, fontWeight: 900, letterSpacing: 7 }}>DI DALAM PIKIRAN</div>
          <div style={{ color: C.white, fontSize: 74, fontWeight: 900, marginTop: 18 }}>IDE TERHUBUNG</div>
        </div>
        <Word frame={f} start={148} end={214} kicker="BUKAN HANYA MENYIMPAN" word="MENGHUBUNGKAN" sub="Informasi disusun menjadi pemahaman." />
      </AbsoluteFill>

      {/* BABAK 3 — informasi menjadi hubungan dan makna */}
      <AbsoluteFill style={{ opacity: scene3 }}>
        <div style={{
          position: "absolute", inset: 0,
          transform: `scale(${camera3})`, transformOrigin: "50% 50%",
        }}>
          <NeuralWorld frame={f} />
        </div>
        <ThoughtCards frame={f} />
        <Word frame={f} start={270} end={334} kicker="SAAT KITA MEMAHAMI" word="LAHIR MAKNA" sub="Menimbang hubungan, sebab, dan akibat." />
      </AbsoluteFill>

      {/* BABAK 4 — kesimpulan */}
      <AbsoluteFill style={{ opacity: scene4 }}>
        <Closing frame={f} />
      </AbsoluteFill>

      {/* Garis waktu dan penanda babak */}
      <div style={{
        position: "absolute", left: 76, right: 76, bottom: 92, height: 3,
        background: "rgba(168,185,208,.18)", borderRadius: 8,
      }}>
        <div style={{ width: `${progress}%`, height: "100%", background: C.orange, borderRadius: 8,
          boxShadow: `0 0 16px ${C.orange}` }} />
      </div>
      <div style={{
        position: "absolute", bottom: 52, left: 76, right: 76,
        display: "flex", justifyContent: "space-between",
        color: C.muted, fontSize: 16, letterSpacing: 3, fontWeight: 800,
      }}>
        <span>ORION CREATIVE</span>
        <span>THINK / UNDERSTAND / ACT</span>
        <span>V3.4</span>
      </div>
    </AbsoluteFill>
  );
};
