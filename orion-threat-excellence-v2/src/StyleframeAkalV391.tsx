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
const DURATION = 300; // 10 seconds
const C = {
  bg: "#F6EFE5",
  paper: "#FFFCF7",
  navy: "#152E4B",
  ink: "#26394D",
  orange: "#F58235",
  orangeLight: "#FAD9C1",
  teal: "#8CCFC3",
  tealDark: "#438F84",
  lavender: "#B7A0D5",
  muted: "#78838C",
  grid: "#E4D9CB",
  shadow: "#BBAE9F",
};

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const smooth = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });

const fastOut = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });

const backOut = (f: number, at: number, duration = 18) =>
  spring({
    frame: f - at,
    fps: FPS,
    config: { damping: 14, stiffness: 135, mass: 0.7 },
    durationInFrames: duration,
  });

const SceneGrid: React.FC<{ f: number }> = ({ f }) => {
  const drift = interpolate(f, [0, DURATION], [0, -28], clamp);
  return (
    <g transform={`translate(0 ${drift})`} opacity={0.65}>
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
};

const Spark: React.FC<{ x: number; y: number; s: number; opacity: number }> = ({
  x, y, s, opacity,
}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={opacity}>
    <path d="M0 -18V18M-18 0H18" stroke={C.orange} strokeWidth="5" strokeLinecap="round" />
  </g>
);

const InfoCard: React.FC<{
  x: number; y: number; scale?: number; rotate?: number; opacity?: number;
}> = ({ x, y, scale = 1, rotate = 0, opacity = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`} opacity={opacity}>
    <rect x="-116" y="-78" width="232" height="156" rx="25"
      fill={C.shadow} opacity=".18" transform="translate(0 10)" />
    <rect x="-116" y="-78" width="232" height="156" rx="25"
      fill={C.paper} stroke={C.navy} strokeWidth="5" />
    <circle cx="-76" cy="-36" r="17" fill={C.orange} />
    <path d="M-84 -36h16M-76 -44v16" stroke={C.paper} strokeWidth="4" strokeLinecap="round" />
    <text x="-47" y="-28" fill={C.navy} fontSize="22" fontWeight="900" letterSpacing="1">INFORMASI</text>
    <rect x="-78" y="2" width="154" height="11" rx="5.5" fill={C.navy} opacity=".22" />
    <rect x="-78" y="25" width="118" height="11" rx="5.5" fill={C.navy} opacity=".16" />
    <rect x="-78" y="48" width="86" height="9" rx="4.5" fill={C.tealDark} opacity=".7" />
  </g>
);

const Character: React.FC<{ f: number }> = ({ f }) => {
  const anticipation = smooth(f, 22, 38);
  const reach = smooth(f, 38, 70);
  const recoil = smooth(f, 72, 88);
  const settle = smooth(f, 88, 112);
  const bodyLean = interpolate(f, [0, 36, 70, 90, 112], [0, -7, -11, 4, 0], clamp);
  const headTilt = interpolate(f, [0, 38, 70, 94, 112], [0, -9, -12, 5, 0], clamp);
  const handX = interpolate(f, [0, 38, 70, 88, 112], [655, 680, 790, 760, 690], clamp);
  const handY = interpolate(f, [0, 38, 70, 88, 112], [1010, 1000, 970, 980, 1010], clamp);
  const blink = f >= 82 && f <= 85 ? 0.12 : 1;
  const smile = smooth(f, 70, 100);
  const armPath = `M650 1040 Q${690 + reach * 60} ${1010 - reach * 30} ${handX} ${handY}`;

  return (
    <g>
      <ellipse cx="535" cy="1390" rx="220" ry="31" fill={C.shadow} opacity=".23" />
      {/* Body leans into the incoming information, then settles. */}
      <g transform={`rotate(${bodyLean} 540 1180)`}>
        <path d="M420 1130Q430 1010 540 1000Q650 1010 660 1130L695 1380H385Z"
          fill={C.teal} stroke={C.navy} strokeWidth="9" />
        <path d="M455 1215Q540 1260 625 1215" fill="none"
          stroke={C.tealDark} strokeWidth="8" strokeLinecap="round" opacity=".55" />
      </g>

      {/* Left arm balances the reach. */}
      <path d="M430 1060Q345 1105 350 1200" fill="none"
        stroke={C.orange} strokeWidth="48" strokeLinecap="round" />
      <circle cx="350" cy="1200" r="27" fill={C.orange} stroke={C.navy} strokeWidth="6" />

      {/* Right arm ends at the same coordinates as the card contact point. */}
      <path d={armPath} fill="none" stroke={C.orange} strokeWidth="47" strokeLinecap="round" />
      <circle cx={handX} cy={handY} r="29" fill={C.orange}
        stroke={C.navy} strokeWidth="6" />
      <path d={`M${handX - 13} ${handY - 3}q12 -18 27 -2`}
        fill="none" stroke={C.paper} strokeWidth="5" strokeLinecap="round" />

      <g transform={`rotate(${headTilt} 540 850)`}>
        <circle cx="540" cy="850" r="125" fill={C.orange}
          stroke={C.navy} strokeWidth="9" />
        {/* Brows lift during anticipation; settle after the catch. */}
        <path d={`M485 805q22 ${-8 - anticipation * 7} 42 ${-2 - anticipation * 7}
                  M553 803q22 ${-2 - anticipation * 7} 42 ${-8 - anticipation * 7}`}
          fill="none" stroke={C.navy} strokeWidth="9" strokeLinecap="round" />
        <ellipse cx="505" cy="846" rx="12" ry={17 * blink} fill={C.navy} />
        <ellipse cx="575" cy="846" rx="12" ry={17 * blink} fill={C.navy} />
        <path
          d={smile > .5 ? "M500 905Q540 947 580 905" : "M508 914Q540 896 572 914"}
          fill="none" stroke={C.navy} strokeWidth="9" strokeLinecap="round"
        />
      </g>

      {/* Anticipation marks and contact burst are timed to the catch. */}
      <g opacity={anticipation * (1 - reach)}>
        <path d="M735 875l34 -25M750 910l42 -4" stroke={C.orange}
          strokeWidth="8" strokeLinecap="round" />
      </g>
      <g opacity={smooth(f, 68, 73) * (1 - smooth(f, 78, 86))}>
        <Spark x={handX + 28} y={handY - 30} s={1.15} opacity={1} />
        <Spark x={handX - 25} y={handY + 28} s={0.72} opacity={1} />
      </g>
    </g>
  );
};

const TransformingCard: React.FC<{ f: number }> = ({ f }) => {
  // Card approaches the hand, makes contact, compresses, then breaks into three pieces.
  const x = interpolate(f, [0, 20, 48, 68, 82, 98], [-180, 70, 360, 775, 775, 775], clamp);
  const y = interpolate(f, [0, 20, 48, 68, 82, 98], [660, 710, 850, 970, 970, 970], clamp);
  const rotation = interpolate(f, [0, 20, 48, 68, 82, 98], [-15, -8, 4, 0, -3, 0], clamp);
  const squash = interpolate(f, [68, 73, 78, 86], [1, 0.88, 1.04, 1], clamp);
  const vanish = smooth(f, 88, 104);
  const opacity = 1 - vanish;
  const burst = smooth(f, 92, 112);

  return (
    <>
      <InfoCard x={x} y={y} scale={interpolate(f, [0, 68, 78, 104], [.76, 1, squash, .12], clamp)}
        rotate={rotation} opacity={opacity} />
      {/* The three fragments emerge from the card itself, not from a separate scene cut. */}
      {[
        { dx: -90, dy: -72, color: C.orange, label: "FAKTA" },
        { dx: 0, dy: -130, color: C.teal, label: "POLA" },
        { dx: 90, dy: -72, color: C.lavender, label: "MAKNA" },
      ].map((p, i) => {
        const spread = burst * (i === 1 ? 1.0 : 1.2);
        const cx = x + p.dx * spread;
        const cy = y + p.dy * spread;
        const s = burst * .7;
        return (
          <g key={p.label} transform={`translate(${cx} ${cy}) scale(${s})`} opacity={burst}>
            <rect x="-51" y="-38" width="102" height="76" rx="20"
              fill={p.color} stroke={C.navy} strokeWidth="5" />
            <text textAnchor="middle" y="7" fontSize="16" fontWeight="900" fill={C.navy}>
              {p.label}
            </text>
          </g>
        );
      })}
    </>
  );
};

const NodeStory: React.FC<{ f: number }> = ({ f }) => {
  const form = smooth(f, 108, 158);
  const connect = smooth(f, 132, 176);
  const route = smooth(f, 178, 220);
  const nodes = [
    { sx: 775, sy: 970, ex: 300, ey: 1230, color: C.orange, label: "FAKTA" },
    { sx: 775, sy: 970, ex: 540, ey: 1230, color: C.teal, label: "POLA" },
    { sx: 775, sy: 970, ex: 780, ey: 1230, color: C.lavender, label: "MAKNA" },
  ];
  const points = nodes.map((n) => ({
    x: interpolate(form, [0, 1], [n.sx, n.ex], clamp),
    y: interpolate(form, [0, 1], [n.sy, n.ey], clamp),
    color: n.color,
    label: n.label,
  }));
  const nodeScale = backOut(f, 112, 22);

  return (
    <>
      {/* Connectors draw in behind the nodes. */}
      <g fill="none" stroke={C.navy} strokeWidth="9" strokeLinecap="round"
        opacity={connect}>
        <path d={`M${points[0].x} ${points[0].y}L${points[1].x} ${points[1].y}`}
          strokeDasharray="300" strokeDashoffset={300 * (1 - connect)} />
        <path d={`M${points[1].x} ${points[1].y}L${points[2].x} ${points[2].y}`}
          strokeDasharray="300" strokeDashoffset={300 * (1 - connect)} />
      </g>
      {points.map((p) => (
        <g key={p.label} transform={`translate(${p.x} ${p.y}) scale(${nodeScale})`}>
          <circle r="78" fill={p.color} stroke={C.navy} strokeWidth="7" />
          <circle r="54" fill="none" stroke={C.paper} strokeWidth="4" opacity=".8" />
          <text textAnchor="middle" y="8" fontSize="21" fontWeight="900" fill={C.navy}>
            {p.label}
          </text>
        </g>
      ))}

      {/* The node chain resolves into a directional action route. */}
      <g opacity={route}>
        <path d={`M${points[0].x} 1390H${points[2].x}`}
          stroke={C.orange} strokeWidth="16" strokeLinecap="round"
          strokeDasharray="480" strokeDashoffset={480 * (1 - route)} fill="none" />
        <path d="M735 1340L805 1390L735 1440" fill="none"
          stroke={C.orange} strokeWidth="17" strokeLinecap="round"
          strokeLinejoin="round" />
      </g>
    </>
  );
};

export const StyleframeAkalV391: React.FC = () => {
  const f = useCurrentFrame();
  const progress = interpolate(f, [0, DURATION], [0, 1], clamp);
  const titleIn = backOut(f, 8, 20);
  const subtitle = smooth(f, 18, 36);
  const payoff = smooth(f, 218, 244);
  const cameraScale = interpolate(f, [0, 65, 120, 190, 240, 299],
    [1, 1.035, 1.0, 1.045, 1.0, 1.0], clamp);
  const cameraX = interpolate(f, [0, 65, 120, 190, 240, 299],
    [0, -10, 0, 10, 0, 0], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, overflow: "hidden" }}>
      <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`}>
        <SceneGrid f={f} />
        <g transform={`translate(${cameraX} 0) translate(540 960) scale(${cameraScale}) translate(-540 -960)`}>
          <text x="540" y="178" textAnchor="middle" fill={C.muted}
            fontSize="24" fontWeight="900" letterSpacing="7">ORION / MOTION STUDY</text>

          <g transform={`translate(0 ${interpolate(titleIn, [0, 1], [26, 0], clamp)})`}
            opacity={titleIn}>
            <text x="540" y="330" textAnchor="middle" fill={C.navy}
              fontSize="68" fontWeight="900" letterSpacing="-2">INFORMASI</text>
            <text x="540" y="386" textAnchor="middle" fill={C.muted}
              fontSize="25" fontWeight="800" letterSpacing="3" opacity={subtitle}>
              DITANGKAP. DIOLAH. MENJADI MAKNA.
            </text>
          </g>

          <Character f={f} />
          <TransformingCard f={f} />
          <NodeStory f={f} />

          {/* Clear payoff replaces the previous overlapping caption. */}
          <g opacity={payoff} transform={`translate(0 ${interpolate(payoff, [0, 1], [45, 0], clamp)})`}>
            <rect x="112" y="1530" width="856" height="150" rx="42"
              fill={C.navy} />
            <text x="540" y="1595" textAnchor="middle" fill={C.paper}
              fontSize="34" fontWeight="900" letterSpacing="1">
              INFORMASI MENJADI KEPUTUSAN
            </text>
            <text x="540" y="1640" textAnchor="middle" fill={C.teal}
              fontSize="23" fontWeight="800" letterSpacing="2">
              DAN KEPUTUSAN MENGGERAKKAN AKSI
            </text>
          </g>
        </g>

        <g opacity=".78">
          <text x="56" y="1830" fontSize="21" fill={C.navy}
            fontWeight="900" letterSpacing="4">ORION CREATIVE</text>
          <text x="1024" y="1830" fontSize="21" fill={C.navy}
            fontWeight="800" textAnchor="end">V3.9.1 / INTERACTION REFINEMENT</text>
          <rect x="56" y="1860" width="968" height="5" rx="3" fill="#DCCFC0" />
          <rect x="56" y="1860" width={968 * progress} height="5" rx="3" fill={C.orange} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

export const ORION_V391_DURATION = DURATION;
