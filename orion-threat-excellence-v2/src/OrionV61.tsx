import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const W = 1080;
const H = 1920;
const D = 360; // 12 seconds at 30 fps

const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const smooth = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });

const springAt = (f: number, fps: number, config = { damping: 14, stiffness: 110, mass: 0.8 }) =>
  spring({ frame: Math.max(0, f), fps, config });

const Palette = {
  ink: "#17212B",
  paper: "#F2EFE8",
  coral: "#F06B4F",
  teal: "#2D8E87",
  yellow: "#E9B94E",
  lilac: "#A99ACB",
  muted: "#89939A",
};

const Grain: React.FC = () => (
  <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0, opacity: 0.12, pointerEvents: "none" }}>
    <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="2" stitchTiles="stitch" /></filter>
    <rect width={W} height={H} filter="url(#grain)" opacity=".22" />
  </svg>
);

const Character: React.FC<{ f: number }> = ({ f }) => {
  // Walk cycle is built from independent limbs. Each foot has a planted phase.
  const enter = smooth(f, 18, 62);
  const walk = f > 58 && f < 180 ? (f - 58) : 0;
  const stride = Math.sin(walk * 0.105);
  const counter = Math.sin(walk * 0.105 + Math.PI);
  const bob = f > 58 && f < 180 ? Math.abs(Math.sin(walk * 0.105)) * 13 : 0;
  const settle = smooth(f, 180, 220);
  const bodyX = interpolate(f, [0, 62, 180, 220], [170, 0, 0, -12], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const bodyY = 1260 - bob - enter * 8 + settle * 8;
  const torsoTilt = f > 58 && f < 180 ? stride * 3.2 : interpolate(f, [180, 220], [3, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const armA = f > 58 && f < 180 ? -stride * 24 : -8;
  const armB = f > 58 && f < 180 ? stride * 24 : 8;
  const react = springAt(f - 205, 30, { damping: 9, stiffness: 160, mass: 0.65 });
  const reach = f > 205 ? react : 0;
  return (
    <g transform={`translate(${bodyX},${bodyY})`} opacity={enter}>
      {/* soft contact shadow */}
      <ellipse cx="0" cy="290" rx="100" ry="19" fill="#17212B" opacity=".14" />
      {/* legs */}
      <g transform={`translate(-24,190) rotate(${f > 58 && f < 180 ? stride * 27 : 0})`}>
        <path d="M0 0 Q-8 56 -16 112 L-32 188" fill="none" stroke={Palette.ink} strokeWidth="31" strokeLinecap="round" />
        <path d="M-32 188 Q-24 204 12 202" fill="none" stroke={Palette.ink} strokeWidth="27" strokeLinecap="round" />
      </g>
      <g transform={`translate(26,190) rotate(${f > 58 && f < 180 ? counter * 27 : 0})`}>
        <path d="M0 0 Q8 56 16 112 L32 188" fill="none" stroke={Palette.ink} strokeWidth="31" strokeLinecap="round" />
        <path d="M32 188 Q40 204 75 202" fill="none" stroke={Palette.ink} strokeWidth="27" strokeLinecap="round" />
      </g>
      {/* torso with slight counter-rotation */}
      <g transform={`rotate(${torsoTilt})`}>
        <path d="M-68 28 Q-76 8 -58 -8 L58 -8 Q77 8 68 28 L56 185 Q0 207 -56 185 Z" fill={Palette.teal} />
        <path d="M-48 25 Q0 42 48 25" fill="none" stroke="#FFFFFF" strokeOpacity=".3" strokeWidth="7" />
        {/* arms */}
        <g transform={`translate(-62,38) rotate(${armA})`}>
          <path d="M0 0 Q-22 54 -26 108" fill="none" stroke={Palette.ink} strokeWidth="25" strokeLinecap="round" />
          <circle cx="-26" cy="112" r="15" fill={Palette.coral} />
        </g>
        <g transform={`translate(62,38) rotate(${armB + reach * -38})`}>
          <path d="M0 0 Q22 54 26 108" fill="none" stroke={Palette.ink} strokeWidth="25" strokeLinecap="round" />
          <circle cx="26" cy="112" r="15" fill={Palette.coral} />
        </g>
        {/* neck and head */}
        <rect x="-17" y="-29" width="34" height="44" rx="12" fill="#D99D78" />
        <circle cx="0" cy="-76" r="58" fill="#D99D78" />
        <path d="M-54 -84 Q-48 -146 12 -137 Q61 -129 58 -77 Q28 -105 -8 -104 Q-34 -101 -54 -84" fill={Palette.ink} />
        <circle cx="20" cy="-74" r="5" fill={Palette.ink} />
        <path d="M15 -47 Q29 -37 42 -47" fill="none" stroke={Palette.ink} strokeWidth="5" strokeLinecap="round" />
      </g>
    </g>
  );
};

const Door: React.FC<{ f: number }> = ({ f }) => {
  const anticipation = smooth(f, 88, 104);
  const open = springAt(f - 104, 30, { damping: 18, stiffness: 72, mass: 1.2 });
  const angle = interpolate(open, [0, 1], [0, -72]);
  const shake = f > 102 && f < 132 ? Math.sin((f - 102) * 1.4) * (1 - smooth(f, 102, 132)) * 3 : 0;
  return (
    <g transform="translate(690 735)">
      <rect x="-12" y="-12" width="300" height="720" rx="8" fill="#17212B" opacity=".12" />
      <rect x="0" y="0" width="270" height="690" rx="6" fill="#D8D2C6" />
      {/* frame */}
      <path d="M0 690 V0 H270 V690" fill="none" stroke={Palette.ink} strokeWidth="20" />
      {/* door rotates around left hinge */}
      <g transform={`translate(12 0) rotate(${angle + shake} 0 0)`}>
        <rect x="0" y="0" width="246" height="680" rx="4" fill={Palette.coral} />
        <rect x="28" y="34" width="190" height="270" rx="4" fill="#F68C72" opacity=".65" />
        <rect x="28" y="334" width="190" height="306" rx="4" fill="#D95843" opacity=".55" />
        <circle cx="208" cy="350" r="12" fill={Palette.yellow} />
        <rect x="-5" y="118" width="12" height="58" rx="5" fill={Palette.yellow} />
        <rect x="-5" y="510" width="12" height="58" rx="5" fill={Palette.yellow} />
      </g>
      {/* light spilling from the opening */}
      <path d={`M270 0 L${270 + 230 * open} 110 L${270 + 230 * open} 620 L270 690 Z`} fill={Palette.yellow} opacity={open * 0.24} />
      <circle cx="0" cy="0" r="17" fill={Palette.yellow} opacity={anticipation * .85} />
    </g>
  );
};

const FloatingCard: React.FC<{ f: number }> = ({ f }) => {
  const p = springAt(f - 146, 30, { damping: 12, stiffness: 100, mass: 0.7 });
  const y = interpolate(p, [0, 1], [180, 0]);
  const rot = interpolate(p, [0, 1], [-9, 0]);
  const pulse = 1 + Math.sin(Math.max(0, f - 160) * .12) * .018;
  return (
    <g transform={`translate(180 ${720 + y}) rotate(${rot} 170 120) scale(${pulse})`} opacity={smooth(f, 142, 164)}>
      <rect x="0" y="0" width="340" height="240" rx="24" fill="#FFFFFF" />
      <rect x="28" y="30" width="92" height="12" rx="6" fill={Palette.muted} opacity=".45" />
      <rect x="28" y="66" width="270" height="22" rx="11" fill={Palette.ink} opacity=".9" />
      <rect x="28" y="106" width="210" height="14" rx="7" fill={Palette.muted} opacity=".42" />
      <path d="M28 190 L105 158 L166 174 L235 126 L300 140" fill="none" stroke={Palette.teal} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="235" cy="126" r="12" fill={Palette.coral} />
    </g>
  );
};

const KineticText: React.FC<{ f: number }> = ({ f }) => {
  const inA = springAt(f - 18, 30, { damping: 13, stiffness: 125, mass: .7 });
  const y = interpolate(inA, [0, 1], [90, 0]);
  const scale = interpolate(inA, [0, 1], [.82, 1]);
  const flash = 1 - smooth(f, 112, 142);
  return (
    <g>
      <g transform={`translate(86 ${250 + y}) scale(${scale})`} opacity={smooth(f, 12, 38)}>
        <text x="0" y="0" fill={Palette.ink} fontSize="34" fontWeight="800" letterSpacing="5">ORION / MOTION STUDY 01</text>
        <text x="0" y="112" fill={Palette.ink} fontSize="86" fontWeight="900" letterSpacing="-3">PERUBAHAN</text>
        <text x="0" y="205" fill={Palette.coral} fontSize="86" fontWeight="900" letterSpacing="-3">DIMULAI.</text>
        <rect x="0" y="236" width={interpolate(f, [30, 82], [0, 450], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} height="9" rx="5" fill={Palette.teal} />
      </g>
      <g opacity={flash} transform={`translate(88 1600)`}>
        <text x="0" y="0" fill={Palette.ink} fontSize="33" fontWeight="800" letterSpacing="3">BUKA PINTU.</text>
        <text x="0" y="70" fill={Palette.coral} fontSize="53" fontWeight="900">Ubah cara melihat.</text>
      </g>
    </g>
  );
};

const Scene: React.FC<{ f: number }> = ({ f }) => {
  const camera = interpolate(f, [0, 110, 220, 359], [1, 1.055, 1.12, 1.02], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const cameraX = interpolate(f, [0, 120, 250, 359], [0, -22, -56, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const parallax = interpolate(f, [0, 180, 359], [0, -55, 22], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const vignette = smooth(f, 0, 40);
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F7F4ED" />
          <stop offset="1" stopColor="#DDD8CE" />
        </linearGradient>
        <radialGradient id="glow">
          <stop offset="0" stopColor="#E9B94E" stopOpacity=".5" />
          <stop offset="1" stopColor="#E9B94E" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={W} height={H} fill="url(#bg)" />
      {/* distant architecture - slow parallax */}
      <g transform={`translate(${parallax * .25} 0)`} opacity=".34">
        <path d="M0 540 H1080 M0 600 H1080" stroke={Palette.muted} strokeWidth="3" />
        <path d="M70 0 V1920 M1010 0 V1920" stroke={Palette.muted} strokeWidth="2" strokeDasharray="10 18" />
        <rect x="70" y="470" width="250" height="260" fill="#FFFFFF" opacity=".25" />
        <rect x="760" y="400" width="230" height="340" fill="#FFFFFF" opacity=".28" />
      </g>
      <g transform={`translate(${cameraX} 0) scale(${camera})`} style={{ transformOrigin: "540px 960px" }}>
        <ellipse cx="780" cy="1050" rx="360" ry="500" fill="url(#glow)" />
        <path d="M0 1450 Q250 1410 520 1450 T1080 1430 V1920 H0 Z" fill="#D5D0C6" />
        <path d="M0 1450 Q250 1410 520 1450 T1080 1430" fill="none" stroke="#C0BAAF" strokeWidth="5" />
        <Door f={f} />
        <Character f={f} />
        <FloatingCard f={f} />
      </g>
      <KineticText f={f} />
      {/* impact rings around the door at opening */}
      {f > 100 && f < 145 ? (
        <g opacity={1 - smooth(f, 100, 145)}>
          <circle cx="690" cy="735" r={interpolate(f, [100, 145], [40, 270])} fill="none" stroke={Palette.yellow} strokeWidth="8" />
          <circle cx="690" cy="735" r={interpolate(f, [100, 145], [20, 170])} fill="none" stroke={Palette.coral} strokeWidth="4" />
        </g>
      ) : null}
      <rect width={W} height={H} fill="#17212B" opacity={0.08 * vignette} />
    </svg>
  );
};

export const OrionV61: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = Math.min(frame, D - 1);
  const end = smooth(f, 320, 359);
  return (
    <AbsoluteFill style={{ backgroundColor: Palette.paper, overflow: "hidden" }}>
      <Scene f={f} />
      <Grain />
      <AbsoluteFill style={{ justifyContent: "flex-end", padding: 64, opacity: end }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: Palette.ink, fontFamily: "Arial, sans-serif", fontSize: 22, fontWeight: 800, letterSpacing: 4 }}>
          <span>ORION CREATIVE</span>
          <span>V6.1 / MOTION BENCHMARK</span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const ORION_V61_DURATION = D;
