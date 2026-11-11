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
const DURATION = 240; // 8 seconds at 30fps
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
  muted: "#7E8992",
  grid: "#DED5CA",
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

const out = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.back(1.35)),
  });

const pop = (f: number, at: number, duration = 16) =>
  spring({
    frame: f - at,
    fps: 30,
    config: { damping: 13, stiffness: 150, mass: 0.72 },
    durationInFrames: duration,
  });

const Grid = () => (
  <g opacity={0.55}>
    {Array.from({ length: 13 }, (_, i) => (
      <line key={`v${i}`} x1={i * 90} y1="0" x2={i * 90} y2={H}
        stroke={C.grid} strokeWidth="1.5" />
    ))}
    {Array.from({ length: 23 }, (_, i) => (
      <line key={`h${i}`} x1="0" y1={i * 90} x2={W} y2={i * 90}
        stroke={C.grid} strokeWidth="1.5" />
    ))}
  </g>
);

const Label = ({ text, y, f, start = 0 }: {
  text: string; y: number; f: number; start?: number;
}) => {
  const s = pop(f, start, 14);
  return (
    <g transform={`translate(540 ${y}) scale(${s})`}>
      <rect x="-205" y="-37" width="410" height="74" rx="28" fill={C.navy} />
      <text textAnchor="middle" y="12" fontSize="29" fontWeight="800"
        letterSpacing="2" fill={C.paper}>{text}</text>
    </g>
  );
};

const Card = ({
  x, y, scale = 1, rotate = 0, fill, kind, opacity = 1,
}: {
  x: number; y: number; scale?: number; rotate?: number;
  fill: string; kind: "news" | "data" | "idea"; opacity?: number;
}) => (
  <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`} opacity={opacity}>
    <rect x="-112" y="-72" width="224" height="144" rx="28"
      fill={fill} stroke={C.navy} strokeWidth="5" />
    {kind === "news" && <>
      <circle cx="-63" cy="-20" r="21" fill={C.orange} />
      <path d="M-74 -20h22M-63 -31v22" stroke={C.paper}
        strokeWidth="5" strokeLinecap="round" />
      <text x="-29" y="-12" fontSize="23" fontWeight="900" fill={C.navy}>BERITA</text>
      <rect x="-75" y="20" width="150" height="10" rx="5" fill={C.navy} opacity=".24" />
      <rect x="-75" y="42" width="105" height="10" rx="5" fill={C.navy} opacity=".18" />
    </>}
    {kind === "data" && <>
      <path d="M-70 25l37 -46 35 38 37 -55" fill="none"
        stroke={C.navy} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="-70" cy="25" r="7" fill={C.orange} />
      <circle cx="-33" cy="-21" r="7" fill={C.orange} />
      <circle cx="2" cy="17" r="7" fill={C.orange} />
      <circle cx="39" cy="-38" r="7" fill={C.orange} />
      <text x="0" y="57" textAnchor="middle" fontSize="20" fontWeight="900" fill={C.navy}>DATA</text>
    </>}
    {kind === "idea" && <>
      <path d="M-28 -35q-34 0 -34 33q0 22 20 34v19h54V32q20 -12 20 -34q0 -33 -34 -33Z"
        fill={C.lavender} stroke={C.navy} strokeWidth="5" />
      <path d="M-20 56h40" stroke={C.navy} strokeWidth="6" strokeLinecap="round" />
      <path d="M-16 -8q16 -22 32 0" fill="none" stroke={C.paper}
        strokeWidth="6" strokeLinecap="round" />
      <text x="0" y="95" textAnchor="middle" fontSize="19" fontWeight="900" fill={C.navy}>IDEA</text>
    </>}
  </g>
);

// A compact expressive guide character. The arm reaches, catches and redirects the incoming card.
const GuideCharacter = ({ f }: { f: number }) => {
  const reach = ease(f, 24, 58);
  const retract = ease(f, 72, 94);
  const armX = interpolate(f, [24, 58, 94], [88, 255, 90], clamp);
  const armY = interpolate(f, [24, 58, 94], [-20, -118, -20], clamp);
  const blink = f >= 67 && f <= 70 ? 0.22 : 1;
  const headTilt = interpolate(f, [0, 55, 100], [0, -7, 0], clamp);
  return (
    <g transform="translate(540 1050)">
      <ellipse cx="0" cy="330" rx="210" ry="30" fill="#D8C9B8" opacity=".48" />
      <path d="M-128 145q-22 -140 30 -205q98 -78 196 0q52 65 30 205Z"
        fill={C.teal} stroke={C.navy} strokeWidth="8" />
      <g transform={`rotate(${headTilt} 0 -145)`}>
        <circle cx="0" cy="-155" r="112" fill={C.orange}
          stroke={C.navy} strokeWidth="8" />
        <ellipse cx="-38" cy="-164" rx="12" ry={16 * blink} fill={C.navy} />
        <ellipse cx="38" cy="-164" rx="12" ry={16 * blink} fill={C.navy} />
        <path d={f < 60 ? "M-35 -112q35 -32 70 0" : "M-35 -116q35 38 70 0"}
          fill="none" stroke={C.navy} strokeWidth="9" strokeLinecap="round" />
        <path d="M-63 -205q25 -16 48 -2M15 -207q24 -14 48 2"
          fill="none" stroke={C.navy} strokeWidth="8" strokeLinecap="round" />
      </g>
      {/* Shoulder-to-hand reach: the hand visibly meets the incoming card. */}
      <path d={`M92 10 Q${150 + armX * .35} ${-30 + armY * .25} ${armX} ${armY}`}
        fill="none" stroke={C.orange} strokeWidth="42" strokeLinecap="round" />
      <path d={`M${armX - 7} ${armY}q-22 -32 3 -50q17 -10 27 9q22 -20 35 0q13 20 -7 39q-25 24 -58 2Z`}
        fill={C.orange} stroke={C.navy} strokeWidth="6"
        transform={`translate(${retract * -140} ${retract * 72})`} />
      {/* Small shoulder motion reinforces the reach. */}
      <circle cx="96" cy="12" r="24" fill={C.orange} stroke={C.navy} strokeWidth="6" />
      <g opacity={reach * (1 - retract)}>
        <path d="M285 -160q32 -26 63 0M300 -205q42 -22 76 7"
          fill="none" stroke={C.orange} strokeWidth="8" strokeLinecap="round" />
      </g>
    </g>
  );
};

const InteractionSequence = ({ f }: { f: number }) => {
  // Incoming information card travels toward the character, is caught, then becomes a node.
  const cardX = interpolate(f, [0, 24, 54, 82, 112], [-230, 60, 300, 210, 0], clamp);
  const cardY = interpolate(f, [0, 24, 54, 82, 112], [590, 650, 770, 800, 0], clamp);
  const cardScale = interpolate(f, [0, 24, 54, 82, 112], [.78, 1, 1.06, .9, .05], clamp);
  const cardRot = interpolate(f, [0, 24, 54, 82, 112], [-12, -5, 5, 0, 0], clamp);
  const cardOpacity = interpolate(f, [0, 104, 116], [1, 1, 0], clamp);
  const caughtPulse = interpolate(f, [53, 58, 66], [1, 1.16, 1], clamp);
  const lineProgress = ease(f, 112, 155);
  const nodeIn = pop(f, 116, 20);
  const morph = ease(f, 158, 205);

  // Three connected nodes rearrange into a forward route. The transition is the story.
  const startNodes = [
    { x: -170, y: 0, c: C.orange, label: "FAKTA" },
    { x: 0, y: -105, c: C.teal, label: "POLA" },
    { x: 170, y: 0, c: C.lavender, label: "MAKNA" },
  ];
  const endNodes = [
    { x: -210, y: 10, c: C.orange, label: "PILIH" },
    { x: 0, y: 10, c: C.teal, label: "PUTUSKAN" },
    { x: 210, y: 10, c: C.lavender, label: "LAKUKAN" },
  ];
  return (
    <>
      <GuideCharacter f={f} />
      <g transform={`translate(${cardX} ${cardY}) rotate(${cardRot}) scale(${cardScale * caughtPulse})`}
        opacity={cardOpacity}>
        <Card x={0} y={0} scale={1} fill={C.paper} kind="news" />
      </g>

      {/* Information becomes connected meaning. */}
      <g transform="translate(540 850)" opacity={lineProgress}>
        <path d={`M-170 0L0 -105L170 0`} fill="none" stroke={C.navy}
          strokeWidth="10" strokeLinecap="round" strokeDasharray="500"
          strokeDashoffset={500 * (1 - lineProgress)} />
        {startNodes.map((n, i) => {
          const target = endNodes[i];
          const x = interpolate(morph, [0, 1], [n.x, target.x], clamp);
          const y = interpolate(morph, [0, 1], [n.y, target.y], clamp);
          const p = nodeIn;
          return (
            <g key={n.label} transform={`translate(${x} ${y}) scale(${p})`}>
              <circle r="76" fill={n.c} stroke={C.navy} strokeWidth="6" />
              <text textAnchor="middle" y="9" fontSize="21" fontWeight="900" fill={C.navy}>
                {morph < .5 ? n.label : target.label}
              </text>
            </g>
          );
        })}
        <path d={`M-170 0L0 10L170 10`} fill="none" stroke={C.orange}
          strokeWidth="9" strokeLinecap="round" opacity={morph} />
      </g>

      {/* Route arrow grows out of the transformed node chain. */}
      <g transform={`translate(${interpolate(morph, [0, 1], [540, 540], clamp)} 1100)`}
        opacity={morph}>
        <path d={`M-270 0H230`} stroke={C.orange} strokeWidth="22" strokeLinecap="round"
          strokeDasharray="520" strokeDashoffset={520 * (1 - morph)} />
        <path d="M185 -65L270 0L185 65" fill="none" stroke={C.orange}
          strokeWidth="22" strokeLinecap="round" strokeLinejoin="round"
          opacity={morph} />
      </g>
    </>
  );
};

export const StyleframeAkalV39: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = interpolate(f, [0, DURATION], [0, 1], clamp);
  const titleOut = interpolate(f, [0, 28, 44], [0, 1, 0], clamp);
  const titleIn = interpolate(f, [184, 210, 240], [0, 1, 1], clamp);
  const bgShift = interpolate(f, [0, 240], [0, 34], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: C.cream, overflow: "hidden" }}>
      <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`}>
        <g transform={`translate(0 ${bgShift})`}>
          <Grid />
        </g>

        <text x="540" y="210" textAnchor="middle" fill={C.muted}
          fontSize="25" fontWeight="800" letterSpacing="6">ORION / INTERACTION LAB</text>

        <g opacity={titleOut}>
          <text x="540" y="440" textAnchor="middle" fill={C.navy}
            fontSize="66" fontWeight="900" letterSpacing="-2">INFORMASI</text>
          <text x="540" y="505" textAnchor="middle" fill={C.muted}
            fontSize="28" fontWeight="700">BUKAN SEKADAR DILIHAT</text>
        </g>

        <InteractionSequence f={f} />

        <g opacity={titleIn} transform={`translate(0 ${interpolate(titleIn, [0, 1], [35, 0], clamp)})`}>
          <rect x="170" y="1300" width="740" height="118" rx="42" fill={C.navy} />
          <text x="540" y="1375" textAnchor="middle" fill={C.paper}
            fontSize="42" fontWeight="900">INFORMASI → KEPUTUSAN → AKSI</text>
          <text x="540" y="1465" textAnchor="middle" fill={C.ink}
            fontSize="27" fontWeight="700">Objek berubah. Makna ikut bergerak.</text>
        </g>

        <g opacity=".75">
          <text x="56" y="1835" fontSize="22" fill={C.navy}
            fontWeight="800" letterSpacing="4">ORION CREATIVE</text>
          <text x="1024" y="1835" fontSize="22" fill={C.navy}
            fontWeight="700" textAnchor="end">V3.9 / INTERACTION TEST</text>
          <rect x="56" y="1860" width="968" height="5" rx="3" fill="#D7CDBF" />
          <rect x="56" y="1860" width={968 * progress} height="5" rx="3" fill={C.orange} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

export const ORION_V39_DURATION = DURATION;
