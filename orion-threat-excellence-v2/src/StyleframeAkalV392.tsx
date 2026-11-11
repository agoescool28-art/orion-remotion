import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
} from "remotion";

const W = 1080;
const H = 1920;
const FPS = 30;
const DURATION = 300;

const C = {
  bg: "#F4EFE6",
  paper: "#FFFCF6",
  navy: "#18324B",
  ink: "#263D52",
  orange: "#F47F3D",
  orangeDark: "#D9632D",
  teal: "#75BFB3",
  tealDark: "#438F84",
  lilac: "#B7A5D5",
  muted: "#71808B",
  grid: "#DED6CA",
  shadow: "#18324B",
};

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const ease = (f: number, input: number[], output: number[]) =>
  interpolate(f, input, output, {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });

const out = (f: number, input: number[], output: number[]) =>
  interpolate(f, input, output, {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });

const springAt = (f: number, at: number, duration = 20) =>
  spring({
    frame: f - at,
    fps: FPS,
    config: { damping: 13, stiffness: 125, mass: 0.72 },
    durationInFrames: duration,
  });

const Card: React.FC<{
  x: number;
  y: number;
  scaleX?: number;
  scaleY?: number;
  rotate?: number;
  glow?: number;
}> = ({ x, y, scaleX = 1, scaleY = 1, rotate = 0, glow = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scaleX} ${scaleY})`}>
    <rect x="-137" y="-94" width="274" height="188" rx="30"
      fill={C.shadow} opacity=".12" transform="translate(0 14)" />
    <rect x="-137" y="-94" width="274" height="188" rx="30"
      fill={C.paper} stroke={C.navy} strokeWidth="5" />
    <rect x="-112" y="-69" width="42" height="42" rx="13" fill={C.orange} />
    <path d="M-101 -48h20M-91 -58v20" stroke={C.paper} strokeWidth="4" strokeLinecap="round" />
    <text x="-55" y="-40" fill={C.navy} fontSize="21" fontWeight="900" letterSpacing="1.1">INFORMASI</text>
    <rect x="-105" y="-5" width="205" height="12" rx="6" fill={C.navy} opacity=".16" />
    <rect x="-105" y="20" width="164" height="12" rx="6" fill={C.navy} opacity=".12" />
    <rect x="-105" y="46" width="112" height="10" rx="5" fill={C.tealDark} opacity=".78" />
    <circle cx="110" cy="65" r="7" fill={C.orange} opacity={0.55 + glow * 0.45} />
  </g>
);

const Character: React.FC<{ f: number; contact: number }> = ({ f, contact }) => {
  const lean = interpolate(f, [0, 34, 70, 88, 116, 150], [0, -2, -9, -6, 2, 0], clamp);
  const headTilt = interpolate(f, [0, 38, 70, 92, 120], [0, -2, -8, -5, 0], clamp);
  const blink = (f >= 63 && f <= 66) || (f >= 129 && f <= 132) ? 0.12 : 1;
  const smile = ease(f, [76, 112], [0, 1]);
  const shoulderX = 654;
  const shoulderY = 1088;
  const handX = interpolate(f, [0, 28, 58, 78, 88, 108, 132], [650, 650, 620, 625, 634, 640, 640], clamp);
  const handY = interpolate(f, [0, 28, 58, 78, 88, 108, 132], [1090, 1090, 1008, 965, 955, 962, 1015], clamp);
  const elbowX = interpolate(f, [0, 58, 78, 88, 108, 132], [700, 710, 700, 690, 682, 700], clamp);
  const elbowY = interpolate(f, [0, 58, 78, 88, 108, 132], [1175, 1125, 1080, 1072, 1080, 1150], clamp);
  const forearm = `M${shoulderX} ${shoulderY} Q${elbowX} ${elbowY} ${handX} ${handY}`;

  return (
    <g>
      <ellipse cx="510" cy="1500" rx="238" ry="36" fill={C.shadow} opacity=".12" />
      {/* Torso: a small anticipatory lean, then a visible recoil at contact. */}
      <g transform={`rotate(${lean} 520 1190)`}>
        <path d="M382 1160 Q397 1050 510 1038 Q625 1045 650 1160 L686 1470 L350 1470Z"
          fill={C.teal} stroke={C.navy} strokeWidth="9" />
        <path d="M414 1280 Q510 1322 615 1277" fill="none"
          stroke={C.tealDark} strokeWidth="9" strokeLinecap="round" opacity=".55" />
        <path d="M420 1390 Q510 1415 612 1388" fill="none"
          stroke={C.paper} strokeWidth="7" strokeLinecap="round" opacity=".55" />
      </g>

      {/* Back arm balances the body. */}
      <path d="M390 1130 Q300 1200 340 1310" fill="none"
        stroke={C.orange} strokeWidth="52" strokeLinecap="round" />
      <circle cx="340" cy="1310" r="30" fill={C.orange} stroke={C.navy} strokeWidth="7" />

      {/* Reaching arm: shoulder, elbow, forearm and hand are staged separately. */}
      <path d={`M${shoulderX} ${shoulderY} Q${elbowX} ${elbowY} ${handX} ${handY}`}
        fill="none" stroke={C.navy} strokeWidth="62" strokeLinecap="round" />
      <path d={forearm} fill="none" stroke={C.orange} strokeWidth="48" strokeLinecap="round" />
      <circle cx={handX} cy={handY} r="31" fill={C.orange} stroke={C.navy} strokeWidth="7" />
      {/* Finger shapes curl around the edge of the card at contact. */}
      <g opacity={contact}>
        <path d={`M${handX + 3} ${handY - 17}q22 -18 35 0`}
          fill="none" stroke={C.paper} strokeWidth="8" strokeLinecap="round" />
        <path d={`M${handX + 8} ${handY}q22 -8 32 8`}
          fill="none" stroke={C.paper} strokeWidth="7" strokeLinecap="round" />
      </g>

      {/* Head and expression. */}
      <g transform={`rotate(${headTilt} 510 820)`}>
        <circle cx="510" cy="820" r="132" fill={C.orange}
          stroke={C.navy} strokeWidth="10" />
        <ellipse cx="464" cy="810" rx="12" ry={13 * blink} fill={C.navy} />
        <ellipse cx="555" cy="810" rx="12" ry={13 * blink} fill={C.navy} />
        <path d={smile > 0.5 ? "M466 866 Q510 907 557 863" : "M474 872 Q510 878 548 872"}
          fill="none" stroke={C.navy} strokeWidth="9" strokeLinecap="round" />
        <path d="M425 770q20 -16 40 -4M540 765q23 -14 43 2"
          fill="none" stroke={C.orangeDark} strokeWidth="8" strokeLinecap="round" opacity=".65" />
      </g>
    </g>
  );
};

const Background: React.FC<{ f: number }> = ({ f }) => {
  const drift = interpolate(f, [0, DURATION], [0, -42], clamp);
  return (
    <g transform={`translate(0 ${drift})`}>
      {Array.from({ length: 13 }, (_, i) => (
        <line key={`v${i}`} x1={i * 90} y1="0" x2={i * 90} y2={H}
          stroke={C.grid} strokeWidth="1.5" opacity=".58" />
      ))}
      {Array.from({ length: 23 }, (_, i) => (
        <line key={`h${i}`} x1="0" y1={i * 90} x2={W} y2={i * 90}
          stroke={C.grid} strokeWidth="1.5" opacity=".58" />
      ))}
    </g>
  );
};

const ContactFX: React.FC<{ f: number; x: number; y: number }> = ({ f, x, y }) => {
  const age = f - 88;
  const ring = out(age, [0, 25], [8, 84]);
  const alpha = interpolate(age, [0, 4, 25], [0, 0.7, 0], clamp);
  const burst = springAt(f, 88, 18);
  return (
    <g>
      <circle cx={x} cy={y} r={ring} fill="none" stroke={C.orange}
        strokeWidth="7" opacity={alpha} />
      <g transform={`translate(${x} ${y}) scale(${burst})`}>
        {Array.from({ length: 8 }, (_, i) => {
          const a = (Math.PI * 2 * i) / 8;
          const dx = Math.cos(a) * 54;
          const dy = Math.sin(a) * 54;
          return <circle key={i} cx={dx} cy={dy} r="7" fill={i % 2 ? C.tealDark : C.orange} />;
        })}
      </g>
    </g>
  );
};

export const StyleframeAkalV392: React.FC = () => {
  const f = useCurrentFrame();

  // One clear action: notice -> anticipate -> reach -> touch -> response -> release.
  const cardX = interpolate(f, [0, 22, 58, 82, 88, 98, 132, 166], [1000, 950, 835, 760, 752, 758, 790, 930], {
    ...clamp, easing: Easing.inOut(Easing.cubic),
  });
  const cardY = interpolate(f, [0, 22, 58, 82, 88, 98, 132, 166], [890, 890, 910, 930, 930, 924, 890, 820], {
    ...clamp, easing: Easing.inOut(Easing.cubic),
  });
  const contact = interpolate(f, [78, 88, 112, 132], [0, 1, 1, 0], clamp);
  const squash = interpolate(f, [84, 88, 92, 102, 120], [1, 0.91, 1.04, 1, 1], clamp);
  const cardScale = 0.92 + springAt(f, 18, 34) * 0.08;
  const cardOpacity = interpolate(f, [0, 8, 148, 176], [0, 1, 1, 0], clamp);
  const impactLean = interpolate(f, [84, 90, 102, 126], [0, -3, 2, 0], clamp);
  const cameraZoom = interpolate(f, [0, 70, 96, 150, 220, 299], [0.96, 1, 1.035, 1.015, 1.0, 1.025], clamp);
  const titleOpacity = interpolate(f, [0, 12, 72, 90, 112], [0, 1, 1, 0.25, 0], clamp);
  const subtitleOpacity = interpolate(f, [102, 122, 245, 275], [0, 1, 1, 0], clamp);
  const exit = interpolate(f, [252, 299], [0, 1], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, overflow: "hidden" }}>
      <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`}>
        <defs>
          <radialGradient id="v392Halo">
            <stop offset="0%" stopColor={C.orange} stopOpacity=".17" />
            <stop offset="100%" stopColor={C.orange} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="v392CardLight" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor={C.paper} />
          </linearGradient>
        </defs>

        <rect width={W} height={H} fill={C.bg} />
        <Background f={f} />

        <g opacity=".7">
          <circle cx="540" cy="950" r="490" fill="url(#v392Halo)" />
          <circle cx="540" cy="950" r="380" fill="none" stroke={C.grid} strokeWidth="2" strokeDasharray="4 18" />
        </g>

        {/* Editorial header */}
        <g opacity={titleOpacity}>
          <text x="84" y="132" fill={C.muted} fontSize="24" fontWeight="800" letterSpacing="5">
            ORION / ANIMATION STUDY 01
          </text>
          <text x="84" y="222" fill={C.navy} fontSize="62" fontWeight="900" letterSpacing="-2">
            INFORMASI
          </text>
          <rect x="84" y="250" width="116" height="9" rx="4.5" fill={C.orange} />
          <text x="84" y="305" fill={C.ink} fontSize="26" fontWeight="500">
            Sebuah pesan memulai sebuah tindakan.
          </text>
        </g>

        {/* Main action stage. Subtle camera move is applied around the action center. */}
        <g transform={`translate(540 1000) scale(${cameraZoom}) translate(-540 -1000)`}>
          <Character f={f} contact={contact} />
          <g opacity={cardOpacity}>
            <Card
              x={cardX}
              y={cardY}
              scaleX={cardScale * squash}
              scaleY={cardScale * (2 - squash)}
              rotate={interpolate(f, [0, 58, 82, 88, 112, 166], [-8, -5, -1, 1, 0, 7], clamp)}
              glow={contact}
            />
          </g>
          <ContactFX f={f} x={cardX - 136} y={cardY + 8} />
          {/* Impact ripple from the character's hand/card contact point. */}
          <g opacity={interpolate(f, [86, 90, 115, 138], [0, 1, 0.55, 0], clamp)}>
            <path d={`M${cardX - 128} ${cardY - 48}q-36 -36 -72 -4`}
              fill="none" stroke={C.orange} strokeWidth="7" strokeLinecap="round" />
            <path d={`M${cardX - 128} ${cardY + 48}q-36 36 -72 4`}
              fill="none" stroke={C.orange} strokeWidth="7" strokeLinecap="round" />
          </g>
        </g>

        {/* Contact label appears only after the action has happened. */}
        <g opacity={interpolate(f, [90, 106, 148, 170], [0, 1, 1, 0], clamp)}>
          <rect x="690" y="1330" width="292" height="72" rx="36" fill={C.navy} />
          <circle cx="730" cy="1366" r="9" fill={C.orange} />
          <text x="758" y="1375" fill={C.paper} fontSize="23" fontWeight="800" letterSpacing="1">
            KONTAK TERJADI
          </text>
        </g>

        {/* Final thought: action leaves a visible consequence. */}
        <g opacity={subtitleOpacity} transform={`translate(0 ${interpolate(f, [102, 130], [24, 0], clamp)})`}>
          <rect x="84" y="1570" width="912" height="2" fill={C.grid} />
          <text x="84" y="1645" fill={C.muted} fontSize="23" fontWeight="800" letterSpacing="4">
            INTERAKSI
          </text>
          <text x="84" y="1720" fill={C.navy} fontSize="42" fontWeight="900">
            Gerakan harus punya alasan.
          </text>
          <text x="84" y="1772" fill={C.ink} fontSize="26" fontWeight="500">
            Setiap aksi menghasilkan respons visual.
          </text>
        </g>

        {/* Minimal timeline marker */}
        <g opacity=".55">
          <rect x="84" y="1840" width="912" height="5" rx="2.5" fill={C.grid} />
          <rect x="84" y="1840" width={912 * (f / (DURATION - 1))} height="5" rx="2.5" fill={C.orange} />
        </g>
        <text x="84" y="1882" fill={C.muted} fontSize="17" fontWeight="800" letterSpacing="3">
          ORION CREATIVE  /  V3.9.2
        </text>
        <text x="996" y="1882" textAnchor="end" fill={C.muted} fontSize="17" fontWeight="800">
          {String(Math.floor(f / FPS)).padStart(2, "0")}s
        </text>
      </svg>
    </AbsoluteFill>
  );
};
