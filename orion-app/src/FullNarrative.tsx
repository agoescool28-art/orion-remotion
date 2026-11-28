import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

import { project, type SceneData } from "./project";
import { prabowoWords } from "./audio/prabowo.words";
import type { AudioWordCue } from "./audio/types";

const C = {
  paper: "#F5F0E5",
  paper2: "#E9DFC9",
  ink: "#171717",
  muted: "#6B6256",
  yellow: "#F2C230",
  red: "#D94A38",
  blue: "#263F68",
  green: "#647A55",
  white: "#FFFDF7",
};
const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const ease = (f: number, a: number, b: number) =>
  interpolate(f, [a, Math.max(a + 1, b)], [0, 1], clamp);

const springIn = (f: number, fps: number, delay = 0) =>
  spring({
    frame: Math.max(0, f - delay),
    fps,
    config: { damping: 13, stiffness: 145, mass: 0.55 },
  });

const RoughLine: React.FC<{
  width?: number;
  color?: string;
  delay?: number;
  stroke?: number;
}> = ({ width = 400, color = C.ink, delay = 0, stroke = 7 }) => {
  const f = useCurrentFrame();
  const p = ease(f, delay, delay + 22);
  return (
    <svg width={width} height={24} viewBox={`0 0 ${width} 24`}>
      <path
        d={`M3 13 Q${width * 0.2} 4 ${width * 0.38} 12 T${width - 4} 10`}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={width * 1.4}
        strokeDashoffset={width * 1.4 * (1 - p)}
      />
    </svg>
  );
};

const Doodle: React.FC<{ index: number; accent: string }> = ({
  index,
  accent,
}) => {
  const f = useCurrentFrame();
  const p = ease(f, 3, 30);
  const bob = Math.sin(f * 0.07) * 9;
  const common = {
    fill: "none",
    stroke: C.ink,
    strokeWidth: 9,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  const dash = (length: number) => ({
    strokeDasharray: length,
    strokeDashoffset: length * (1 - p),
  });

  // Bespoke hand-drawn visual metaphors for chapters without photographs.
  const art: React.ReactNode[] = [
    <g key="intro">
      <path d="M90 580 Q280 390 430 480 T850 240" {...common} stroke={C.red} strokeWidth="15" {...dash(1200)} />
      <path d="M110 610 L110 680 M430 480 L430 680 M850 240 L850 680" {...common} stroke={C.muted} strokeWidth="5" {...dash(700)} />
      <circle cx="430" cy="480" r="24" fill={C.yellow} stroke={C.ink} strokeWidth="7" />
      <circle cx="850" cy="240" r="24" fill={C.red} stroke={C.ink} strokeWidth="7" />
      <text x="90" y="735" fontSize="45" fontWeight="900" fill={C.ink}>1951</text>
      <text x="710" y="180" fontSize="45" fontWeight="900" fill={C.ink}>2024</text>
    </g>,
    <g key="jakarta" transform={`translate(0 ${bob})`}>
      <path d="M110 590 L110 360 L260 250 L410 360 L410 590 Z" fill="#E8C98C" stroke={C.ink} strokeWidth="9" />
      <path d="M460 590 L460 300 L610 190 L760 300 L760 590 Z" fill="#D8E0D1" stroke={C.ink} strokeWidth="9" />
      <path d="M95 590 H820" {...common} strokeWidth="13" />
      {Array.from({ length: 5 }, (_, i) => <rect key={i} x={150 + i * 125} y={420 + (i % 2) * 25} width="48" height="90" fill={C.white} stroke={C.ink} strokeWidth="6" />)}
      <path d="M300 145 Q460 55 650 130" {...common} stroke={C.red} strokeWidth="10" {...dash(500)} />
      <text x="155" y="690" fontSize="62" fontWeight="900" fill={C.ink}>JAKARTA</text>
    </g>,
    <g key="family">
      <circle cx="280" cy="300" r="92" fill="#D7B18A" stroke={C.ink} strokeWidth="9" />
      <path d="M140 630 Q150 410 280 410 Q410 410 420 630 Z" fill={C.blue} stroke={C.ink} strokeWidth="9" />
      <circle cx="620" cy="300" r="92" fill="#E4C19A" stroke={C.ink} strokeWidth="9" />
      <path d="M480 630 Q490 410 620 410 Q750 410 760 630 Z" fill={C.red} stroke={C.ink} strokeWidth="9" />
      <path d="M380 220 Q450 140 520 220" {...common} stroke={C.yellow} strokeWidth="18" {...dash(250)} />
      <text x="205" y="710" fontSize="48" fontWeight="900" fill={C.ink}>KELUARGA</text>
    </g>,
    <g key="academy">
      {Array.from({ length: 4 }, (_, i) => (
        <g key={i} transform={`translate(${90 + i * 205} 0)`}>
          <circle cx="70" cy="260" r="45" fill="#D8B18D" stroke={C.ink} strokeWidth="7" />
          <path d="M25 315 L115 315 L145 570 L0 570 Z" fill={C.green} stroke={C.ink} strokeWidth="8" />
          <path d="M45 210 L70 180 L100 210" {...common} strokeWidth="9" />
          <path d="M25 570 L0 650 M115 570 L145 650" {...common} strokeWidth="13" />
        </g>
      ))}
      <path d="M70 690 H850" {...common} stroke={C.red} strokeWidth="8" {...dash(800)} />
      <text x="310" y="760" fontSize="72" fontWeight="900" fill={C.ink}>1974</text>
    </g>,
    <g key="military">
      <path d="M110 600 L110 300 L270 180 L430 300 L430 600 Z" fill="#D8D0B7" stroke={C.ink} strokeWidth="9" />
      <path d="M165 600 V370 H375 V600" fill={C.green} stroke={C.ink} strokeWidth="8" />
      <path d="M500 600 Q600 330 820 250" {...common} stroke={C.red} strokeWidth="13" {...dash(550)} />
      <circle cx="820" cy="250" r="25" fill={C.yellow} stroke={C.ink} strokeWidth="7" />
      <text x="140" y="710" fontSize="55" fontWeight="900" fill={C.ink}>KOPASSUS</text>
    </g>,
    <g key="timeline">
      <path d="M120 450 H830" {...common} strokeWidth="12" {...dash(710)} />
      {[220, 500, 780].map((x, i) => <g key={x}><circle cx={x} cy="450" r="28" fill={i === 1 ? C.red : C.yellow} stroke={C.ink} strokeWidth="7" /><path d={`M${x} 420 V${300 - i * 25}`} {...common} strokeWidth="6" /><text x={x - 55} y={260 - i * 25} fontSize="48" fontWeight="900" fill={C.ink}>{i === 0 ? "1996" : i === 1 ? "1998" : "2000"}</text></g>)}
      <text x="230" y="590" fontSize="44" fontWeight="900" fill={C.ink}>JABATAN STRATEGIS</text>
    </g>,
    <g key="reformasi">
      <path d="M120 260 L850 260 L780 620 L190 620 Z" fill="#F0D7B0" stroke={C.ink} strokeWidth="9" />
      {Array.from({ length: 5 }, (_, i) => <g key={i} transform={`translate(${180 + i * 135} 0)`}><circle cx="40" cy="390" r="28" fill="#D6A987" stroke={C.ink} strokeWidth="6" /><path d="M5 425 L75 425 L95 570 L-15 570 Z" fill={i % 2 ? C.blue : C.red} stroke={C.ink} strokeWidth="6" /></g>)}
      <path d="M230 200 L700 200" {...common} stroke={C.red} strokeWidth="12" {...dash(470)} />
      <text x="290" y="150" fontSize="65" fontWeight="900" fill={C.red}>REFORMASI</text>
    </g>,
    <g key="controversy">
      <path d="M130 250 H820 V630 H130 Z" fill="#E5DCCB" stroke={C.ink} strokeWidth="9" />
      <path d="M200 330 L360 510 L520 330 L700 530" {...common} stroke={C.red} strokeWidth="16" {...dash(900)} />
      <circle cx="490" cy="450" r="130" fill="none" stroke={C.ink} strokeWidth="8" strokeDasharray="18 18" />
      <text x="260" y="710" fontSize="60" fontWeight="900" fill={C.ink}>1998</text>
    </g>,
    <g key="transform">
      <path d="M140 520 Q300 220 480 410 T830 220" {...common} stroke={C.green} strokeWidth="15" {...dash(1000)} />
      <path d="M690 180 L830 220 L760 350" {...common} stroke={C.red} strokeWidth="13" {...dash(260)} />
      <circle cx="140" cy="520" r="28" fill={C.yellow} stroke={C.ink} strokeWidth="7" />
      <circle cx="480" cy="410" r="28" fill={C.red} stroke={C.ink} strokeWidth="7" />
      <text x="220" y="680" fontSize="52" fontWeight="900" fill={C.ink}>BABAK BARU</text>
    </g>,
    <g key="politics">
      <path d="M180 260 L480 110 L780 260 L780 620 L180 620 Z" fill="#E8D9B7" stroke={C.ink} strokeWidth="9" />
      <path d="M300 330 H660 M300 430 H660 M300 530 H660" {...common} strokeWidth="8" />
      <circle cx="480" cy="330" r="28" fill={C.red} stroke={C.ink} strokeWidth="7" />
      <circle cx="480" cy="430" r="28" fill={C.yellow} stroke={C.ink} strokeWidth="7" />
      <circle cx="480" cy="530" r="28" fill={C.blue} stroke={C.ink} strokeWidth="7" />
      <text x="310" y="710" fontSize="62" fontWeight="900" fill={C.ink}>GERINDRA</text>
    </g>,
    <g key="ministry">
      <path d="M180 590 V280 L480 120 L780 280 V590 Z" fill="#D9E0D5" stroke={C.ink} strokeWidth="9" />
      <path d="M120 590 H840" {...common} strokeWidth="13" />
      {[300, 480, 660].map((x) => <path key={x} d={`M${x} 590 V330`} {...common} strokeWidth="12" />)}
      <path d="M430 220 L480 175 L530 220" {...common} stroke={C.red} strokeWidth="9" />
      <text x="310" y="700" fontSize="55" fontWeight="900" fill={C.ink}>PERTAHANAN</text>
    </g>,
    <g key="president">
      <path d="M170 590 V300 Q480 50 790 300 V590 Z" fill="#E9D8B4" stroke={C.ink} strokeWidth="9" />
      <path d="M230 590 V380 H730 V590" fill={C.red} stroke={C.ink} strokeWidth="8" />
      <path d="M480 190 V490 M370 300 H590" {...common} stroke={C.yellow} strokeWidth="15" />
      <text x="250" y="700" fontSize="58" fontWeight="900" fill={C.ink}>PRESIDEN KE-8</text>
    </g>,
  ];

  return (
    <svg viewBox="0 0 960 820" width="100%" height="100%" style={{ overflow: "visible" }}>
      <g transform={`translate(0 ${bob})`}>{art[index] || art[0]}</g>
      <path d="M70 760 Q260 735 440 760" stroke={accent} strokeWidth="11" fill="none" strokeLinecap="round" strokeDasharray="500" strokeDashoffset={500 * (1 - p)} />
    </svg>
  );
};

const KineticWords: React.FC<{ start: number; accent: string }> = ({
  start,
  accent,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const absolute = start + frame;
  const cues = (prabowoWords as AudioWordCue[]).map((w) => ({
    ...w,
    sf: Math.round(w.start * fps),
    ef: Math.max(Math.round(w.end * fps), Math.round(w.start * fps) + 1),
  }));
  const active = cues.findIndex((w) => absolute >= w.sf && absolute < w.ef);
  let anchor = active;
  if (anchor < 0) {
    for (let i = cues.length - 1; i >= 0; i--) {
      if (cues[i].ef <= absolute && absolute - cues[i].ef <= 5) {
        anchor = i;
        break;
      }
    }
  }
  if (anchor < 0) return null;

  const from = Math.max(0, anchor - 3);
  const shown = cues.slice(from, anchor + 1);
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 62px" }}>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: "5px 12px", maxWidth: 950 }}>
        {shown.map((w, i) => {
          const isActive = from + i === active;
          const t = spring({ frame: Math.max(0, absolute - w.sf), fps, config: { damping: 12, stiffness: 190, mass: 0.38 } });
          return (
            <span key={`${w.text}-${w.start}`} style={{
              fontFamily: "Arial Black, Arial, sans-serif",
              fontSize: isActive ? 70 : 54,
              lineHeight: 0.98,
              fontWeight: 1000,
              letterSpacing: -2,
              textTransform: "uppercase",
              color: isActive ? C.ink : "#4D493F",
              background: isActive ? accent : "transparent",
              padding: isActive ? "3px 12px 8px" : "0",
              opacity: isActive ? 1 : 0.72,
              transform: `translateY(${(1 - t) * 28}px) rotate(${(1 - t) * -2}deg) scale(${0.88 + t * 0.12})`,
              textShadow: isActive ? "3px 3px 0px rgba(0,0,0,.12)" : "none",
            }}>{w.text}</span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const ChapterScene: React.FC<{
  data: SceneData;
  index: number;
  globalStart: number;
}> = ({ data, index, globalStart }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const accent = data.accent || C.yellow;
  const inP = springIn(frame, fps);
  const outP = ease(frame, Math.max(0, data.durationFrames - 18), data.durationFrames);
  const imageScale = interpolate(frame, [0, data.durationFrames], [1.06, 1.18], clamp);
  const imageX = interpolate(frame, [0, data.durationFrames], [index % 2 ? 18 : -18, index % 2 ? -18 : 18], clamp);
  const photo = Boolean(data.imageSrc);

  return (
    <AbsoluteFill style={{ backgroundColor: C.paper, overflow: "hidden", color: C.ink, fontFamily: "Arial, sans-serif" }}>
      {/* Paper grain and restrained edge marks */}
      <AbsoluteFill style={{ opacity: 0.13, backgroundImage: "repeating-linear-gradient(0deg, transparent 0px, transparent 5px, #8B806E 6px)", backgroundSize: "100% 7px" }} />
      <div style={{ position: "absolute", inset: 34, border: "2px solid #29251E", opacity: 0.22 }} />
      <div style={{ position: "absolute", top: 64, left: 70, display: "flex", alignItems: "center", gap: 16, zIndex: 8 }}>
        <div style={{ width: 46, height: 46, borderRadius: "50%", background: accent, border: `4px solid ${C.ink}`, display: "grid", placeItems: "center", fontSize: 18, fontWeight: 900 }}>{String(index + 1).padStart(2, "0")}</div>
        <div style={{ fontSize: 17, fontWeight: 900, letterSpacing: 4 }}>ORION / BIOGRAFI</div>
      </div>

      {/* Chapter heading */}
      <div style={{ position: "absolute", top: 145, left: 72, right: 72, zIndex: 5, opacity: inP, transform: `translateY(${(1 - inP) * 45}px)` }}>
        <div style={{ fontSize: 19, letterSpacing: 5, fontWeight: 900, color: C.muted }}>{data.eyebrow}</div>
        <div style={{ fontSize: data.title.length > 14 ? 78 : 104, lineHeight: 0.92, letterSpacing: -5, fontWeight: 1000, marginTop: 20, maxWidth: 940 }}>{data.title}</div>
        <div style={{ marginTop: 22 }}><RoughLine width={430} color={accent} delay={5} stroke={12} /></div>
      </div>

      {/* Main visual stage */}
      <div style={{
        position: "absolute", top: 430, left: 55, right: 55, height: 680,
        background: C.white, border: `4px solid ${C.ink}`,
        boxShadow: "12px 14px 0 rgba(30,25,18,.16)",
        transform: `translateY(${(1 - inP) * 65}px) rotate(${index % 2 ? 0.45 : -0.45}deg)`,
        opacity: inP, overflow: "hidden",
      }}>
        {photo ? (
          <Img src={staticFile(data.imageSrc!)} style={{
            width: "100%", height: "100%", objectFit: "cover",
            transform: `translateX(${imageX}px) scale(${imageScale})`,
            filter: "saturate(.88) contrast(1.06)",
          }} />
        ) : (
          <AbsoluteFill style={{ background: C.paper2, padding: "25px 15px 10px" }}>
            <Doodle index={index} accent={accent} />
          </AbsoluteFill>
        )}
        <div style={{ position: "absolute", left: 28, bottom: 28, padding: "11px 18px", background: accent, border: `3px solid ${C.ink}`, fontSize: 18, fontWeight: 1000, letterSpacing: 2, transform: `rotate(-1.5deg) translateY(${(1 - ease(frame, 12, 28)) * 30}px)` }}>
          ARSIP SEJARAH / {String(index + 1).padStart(2, "0")}
        </div>
        {/* Hand-drawn annotation */}
        <svg viewBox="0 0 960 810" width="100%" height="100%" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          <path d="M720 80 Q820 30 900 100" stroke={C.red} strokeWidth="8" fill="none" strokeLinecap="round" strokeDasharray="240" strokeDashoffset={240 * (1 - ease(frame, 12, 35))} />
          <circle cx="850" cy="160" r="32" fill="none" stroke={accent} strokeWidth="8" strokeDasharray="10 9" transform={`rotate(${frame * 1.3} 850 160)`} />
        </svg>
      </div>

      {/* Narrative caption: compact, near visual, not a slide footer */}
      <div style={{
        position: "absolute", top: 1145, left: 72, right: 72, zIndex: 7,
        padding: "23px 28px 25px", background: C.white,
        border: `3px solid ${C.ink}`, boxShadow: "7px 8px 0 rgba(0,0,0,.12)",
        opacity: inP, transform: `translateY(${(1 - inP) * 35}px) rotate(.35deg)`,
      }}>
        <div style={{ position: "absolute", top: -12, left: 32, width: 105, height: 20, background: accent, border: `2px solid ${C.ink}`, transform: "rotate(-2deg)" }} />
        <div style={{ fontSize: data.subtitle.length > 180 ? 24 : 29, lineHeight: 1.22, fontWeight: 750 }}>{data.subtitle}</div>
      </div>

      {/* Kinetic typography zone moved to center-lower, well above footer */}
      <div style={{
        position: "absolute", left: 50, right: 50, top: 1435, height: 230,
        zIndex: 12, display: "flex", alignItems: "center", justifyContent: "center",
        background: "rgba(245,240,229,.93)", borderTop: `5px solid ${C.ink}`, borderBottom: `5px solid ${C.ink}`,
        opacity: 1 - outP,
      }}>
        <KineticWords start={globalStart} accent={accent} />
      </div>

      {/* Progress and chapter marker */}
      <div style={{ position: "absolute", left: 72, right: 72, bottom: 100, height: 8, background: "#29251E30", zIndex: 10 }}>
        <div style={{ height: "100%", width: `${ease(frame, 0, data.durationFrames) * 100}%`, background: accent }} />
      </div>
      <div style={{ position: "absolute", bottom: 53, left: 72, right: 72, display: "flex", justifyContent: "space-between", fontSize: 15, fontWeight: 900, letterSpacing: 3, color: C.muted }}>
        <span>ARSIP PERJALANAN</span><span>ORION V5.3</span>
      </div>
    </AbsoluteFill>
  );
};

export const FullNarrative: React.FC = () => {
  let cursor = 0;
  const scenes = project.scenes.map((scene, index) => {
    const from = cursor;
    cursor += scene.durationFrames;
    return (
      <Sequence key={`scene-${index}`} from={from} durationInFrames={scene.durationFrames}>
        <ChapterScene data={scene} index={index} globalStart={from} />
      </Sequence>
    );
  });

  return (
    <AbsoluteFill>
      {scenes}
      <Audio src={staticFile(project.voiceoverSrc)} volume={1} />
    </AbsoluteFill>
  );
};
