import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

/**
 * ORION V7.0 — Motion Physics Engine / Revision 3
 * A 32-second motion-system validation composition.
 * One continuous kinematic timeline drives the cabin, shaft markers,
 * character response, scale reading, and force diagram.
 * This remains a technical prototype, not the final narrated production.
 */

const C = {
  bg: "#F1EEE7",
  paper: "#FBF9F4",
  ink: "#1D2022",
  muted: "#77766F",
  line: "#D4CFC5",
  orange: "#E96C3C",
  teal: "#397D79",
  dark: "#222629",
  metal: "#D8D2C7",
};

const FPS = 30;
const SCENE_SECONDS = 8;
const SCENE_FRAMES = FPS * SCENE_SECONDS;
const TOTAL_FRAMES = SCENE_FRAMES * 4;
const PX_PER_METER = 2;
const CABIN_TOP_AT_START = 436;
const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

type Mode = "accelerate-up" | "constant-up" | "decelerate-up" | "accelerate-down";
type MotionState = {
  sceneIndex: number;
  localFrame: number;
  localTime: number;
  displacementM: number;
  velocity: number;
  acceleration: number;
  direction: "UP" | "DOWN";
  cabinTop: number;
  scaleKg: number;
  normalN: number;
  label: string;
  shortLabel: string;
  explanation: string;
  accent: string;
  mode: Mode;
};

const MODES: Mode[] = ["accelerate-up", "constant-up", "decelerate-up", "accelerate-down"];

/** Continuous displacement and velocity across all four moments. */
const getMotionState = (frame: number, fps: number): MotionState => {
  const safeFrame = Math.max(0, Math.min(TOTAL_FRAMES - 1, frame));
  const sceneIndex = Math.min(3, Math.floor(safeFrame / SCENE_FRAMES));
  const localFrame = safeFrame - sceneIndex * SCENE_FRAMES;
  const t = localFrame / fps;
  const mode = MODES[sceneIndex];

  // Scene boundary conditions are deliberately continuous:
  // 0 m, 0 m/s -> 32 m, 8 m/s -> 96 m, 8 m/s -> 128 m, 0 m/s -> 96 m, -8 m/s.
  let displacementM = 0;
  let velocity = 0;
  let acceleration = 0;
  let direction: "UP" | "DOWN" = "UP";
  let scaleKg = 60;
  let normalN = 600;
  let label = "";
  let shortLabel = "";
  let explanation = "";
  let accent = C.teal;

  if (mode === "accelerate-up") {
    displacementM = 0.5 * t * t;
    velocity = t;
    acceleration = 1;
    scaleKg = 66;
    normalN = 660;
    label = "LIFT DIPERCEPAT KE ATAS";
    shortLabel = "KECEPATAN BERTAMBAH";
    explanation = "Lift bergerak naik dan semakin cepat.";
    accent = C.orange;
  } else if (mode === "constant-up") {
    displacementM = 32 + 8 * t;
    velocity = 8;
    acceleration = 0;
    scaleKg = 60;
    normalN = 600;
    label = "KECEPATAN TETAP";
    shortLabel = "GERAK KE ATAS KONSTAN";
    explanation = "Lift tetap naik dengan kecepatan yang sama.";
    accent = C.teal;
  } else if (mode === "decelerate-up") {
    displacementM = 96 + 8 * t - 0.5 * t * t;
    velocity = Math.max(0, 8 - t);
    acceleration = t < SCENE_SECONDS ? -1 : 0;
    scaleKg = 54;
    normalN = 540;
    label = "MASIH NAIK, MELAMBAT";
    shortLabel = "PERCEPATAN BERLAWANAN ARAH GERAK";
    explanation = "Lift masih naik, tetapi kecepatannya berkurang.";
    accent = C.orange;
  } else {
    displacementM = 128 - 0.5 * t * t;
    velocity = t;
    acceleration = -1;
    direction = "DOWN";
    scaleKg = 54;
    normalN = 540;
    label = "LIFT DIPERCEPAT KE BAWAH";
    shortLabel = "KECEPATAN TURUN BERTAMBAH";
    explanation = "Lift bergerak turun dan semakin cepat.";
    accent = C.teal;
  }

  // A fixed camera makes the cabin's actual travel visible inside the shaft.
  const cabinTop = CABIN_TOP_AT_START - displacementM * PX_PER_METER;

  return {
    sceneIndex, localFrame, localTime: t, displacementM, velocity, acceleration,
    direction, cabinTop, scaleKg, normalN, label, shortLabel, explanation, accent, mode,
  };
};

const Txt: React.FC<{
  children: React.ReactNode;
  size?: number;
  color?: string;
  weight?: number;
  style?: React.CSSProperties;
}> = ({ children, size = 28, color = C.ink, weight = 700, style }) => (
  <div style={{ fontFamily: "Arial, Helvetica, sans-serif", fontSize: size, lineHeight: 1.08,
    letterSpacing: -0.65, fontWeight: weight, color, ...style }}>{children}</div>
);

const ForceArrow: React.FC<{ up: boolean; color: string; height: number; label: string }> = ({ up, color, height, label }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5, minWidth: 105 }}>
    <Txt size={19} color={color}>{up ? "↑" : "↓"}</Txt>
    <div style={{ width: 8, height, background: color, borderRadius: 8, position: "relative" }}>
      <div style={{ position: "absolute", top: up ? -2 : "auto", bottom: up ? "auto" : -2,
        left: -7, width: 0, height: 0, borderLeft: "11px solid transparent", borderRight: "11px solid transparent",
        ...(up ? { borderBottom: `15px solid ${color}` } : { borderTop: `15px solid ${color}` }) }} />
    </div>
    <Txt size={16} color={color}>{label}</Txt>
  </div>
);

const Person: React.FC<{ acceleration: number; localFrame: number }> = ({ acceleration, localFrame }) => {
  // Simple readable inertial response: lean opposite acceleration, with a damped settling response.
  const targetLean = interpolate(acceleration, [-1, 0, 1], [8, 0, -8], clamp);
  const entry = interpolate(localFrame, [0, 5, 18, 42], [1, 0.96, 1.03, 1], {
    ...clamp, easing: Easing.out(Easing.cubic),
  });
  const lean = targetLean * entry;
  const headShift = acceleration === 0 ? 0 : -acceleration * 3;
  const armAngle = -lean * 1.3;
  return (
    <div style={{ position: "absolute", left: "50%", bottom: 42, width: 140, height: 310,
      transform: `translateX(-50%) scale(${entry}) rotate(${lean}deg)`, transformOrigin: "50% 84%" }}>
      <div style={{ position: "absolute", top: 0, left: 41 + headShift, width: 58, height: 58,
        borderRadius: "50%", background: "#C68E6B", border: `4px solid ${C.ink}` }} />
      <div style={{ position: "absolute", top: 65, left: 20, width: 86, height: 145,
        borderRadius: "34px 34px 13px 13px", background: C.teal, border: `4px solid ${C.ink}` }} />
      <div style={{ position: "absolute", top: 91, left: 3, width: 22, height: 105, borderRadius: 12,
        background: C.ink, transform: `rotate(${armAngle}deg)`, transformOrigin: "top center" }} />
      <div style={{ position: "absolute", top: 91, right: 3, width: 22, height: 105, borderRadius: 12,
        background: C.ink, transform: `rotate(${-armAngle}deg)`, transformOrigin: "top center" }} />
      <div style={{ position: "absolute", top: 204, left: 32, width: 22, height: 96, background: C.ink, borderRadius: 8 }} />
      <div style={{ position: "absolute", top: 204, right: 32, width: 22, height: 96, background: C.ink, borderRadius: 8 }} />
    </div>
  );
};

const DigitalScale: React.FC<{ localFrame: number; target: number; accent: string }> = ({ localFrame, target, accent }) => {
  const value = interpolate(localFrame, [0, 20, 38], [60, target, target], {
    ...clamp, easing: Easing.out(Easing.cubic),
  });
  return (
    <div style={{ width: 250, background: C.dark, border: `4px solid ${accent}`, borderRadius: 18,
      padding: "18px 22px", boxShadow: "0 12px 28px rgba(0,0,0,.14)" }}>
      <Txt size={15} color="#B9BCB7" style={{ letterSpacing: 2 }}>TIMBANGAN</Txt>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 8 }}>
        <Txt size={65} color={C.paper}>{Math.round(value)}</Txt><Txt size={20} color={C.paper}>kg</Txt>
      </div>
    </div>
  );
};

const Cabin: React.FC<{ state: MotionState }> = ({ state }) => (
  <div style={{ position: "absolute", left: 115, top: state.cabinTop, width: 330, height: 600,
    border: `7px solid ${C.ink}`, borderRadius: "18px 18px 8px 8px",
    background: "linear-gradient(90deg,#D4CFC5 0%,#F9F7F1 22%,#E8E3D9 78%,#C9C4BA 100%)",
    boxShadow: "0 22px 35px rgba(0,0,0,.12)" }}>
    <div style={{ position: "absolute", left: 18, right: 18, top: 18, height: 8, background: "#BEB8AD" }} />
    <div style={{ position: "absolute", left: 22, right: 22, bottom: 20, height: 10, background: state.accent, borderRadius: 8 }} />
    <Person acceleration={state.acceleration} localFrame={state.localFrame} />
    <div style={{ position: "absolute", left: 18, bottom: 8, width: 100, height: 5, background: C.ink }} />
  </div>
);

const ElevatorScene: React.FC<{ state: MotionState }> = ({ state }) => {
  const accelerationLabel = state.acceleration > 0 ? "a = +1 m/s²" : state.acceleration < 0 ? "a = −1 m/s²" : "a = 0 m/s²";
  const shaftMarks = Array.from({ length: 12 }, (_, i) => i * 92);
  return (
    <AbsoluteFill style={{ background: C.bg, padding: "72px 70px 62px", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 42, left: 70, right: 70, height: 2, background: C.line }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Txt size={17} color={C.muted} style={{ letterSpacing: 3 }}>ORION CREATIVE / PHYSICS IN MOTION</Txt>
        <Txt size={18} color={state.accent}>MOMEN 0{state.sceneIndex + 1}</Txt>
      </div>
      <div style={{ marginTop: 48 }}>
        <Txt size={48}>{state.label}</Txt>
        <Txt size={21} color={C.muted} style={{ marginTop: 12 }}>{state.shortLabel}</Txt>
      </div>

      <div style={{ position: "absolute", left: 70, top: 300, width: 560, height: 1050 }}>
        <div style={{ position: "absolute", left: 70, right: 70, top: 0, bottom: 0,
          borderLeft: `5px solid ${C.ink}`, borderRight: `5px solid ${C.ink}`, overflow: "hidden" }}>
          {shaftMarks.map((base, i) => {
            const markerY = ((base + state.displacementM * PX_PER_METER) % 1104) - 28;
            return <div key={i} style={{ position: "absolute", left: 0, right: 0, top: markerY,
              height: 3, background: C.line }} />;
          })}
          <div style={{ position: "absolute", left: 45, right: 45, top: 0, bottom: 0,
            borderLeft: `2px solid ${C.line}`, borderRight: `2px solid ${C.line}` }} />
          <Cabin state={state} />
        </div>
        <Txt size={15} color={C.muted} style={{ position: "absolute", bottom: -34, left: 70 }}>
          POSISI RELATIF KABIN / SHAFT
        </Txt>
      </div>

      <div style={{ position: "absolute", right: 70, top: 370, width: 330 }}>
        <DigitalScale localFrame={state.localFrame} target={state.scaleKg} accent={state.accent} />
        <div style={{ marginTop: 24, background: C.paper, border: `2px solid ${C.line}`, borderRadius: 18, padding: 22 }}>
          <Txt size={17} color={C.muted}>KECEPATAN</Txt>
          <Txt size={42}>{state.velocity.toFixed(1)} m/s</Txt>
          <div style={{ height: 1, background: C.line, margin: "15px 0" }} />
          <Txt size={17} color={C.muted}>PERCEPATAN</Txt>
          <Txt size={32} color={state.accent}>{accelerationLabel}</Txt>
          <Txt size={16} color={C.muted} style={{ marginTop: 14 }}>
            Arah gerak: {state.direction === "UP" ? "ke atas ↑" : "ke bawah ↓"}
          </Txt>
          <Txt size={15} color={C.muted} style={{ marginTop: 8 }}>Perpindahan: {state.displacementM.toFixed(1)} m</Txt>
        </div>
        <div style={{ marginTop: 22, background: C.paper, border: `2px solid ${C.line}`, borderRadius: 18, padding: 22 }}>
          <Txt size={17} color={C.muted}>DIAGRAM GAYA</Txt>
          <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", marginTop: 20 }}>
            <ForceArrow up color={C.orange} height={state.normalN / 9} label={`N ${state.normalN} N`} />
            <ForceArrow up={false} color={C.teal} height={600 / 9} label="W 600 N" />
          </div>
          <Txt size={16} color={C.muted} style={{ marginTop: 14, textAlign: "center" }}>N − W = m × a</Txt>
        </div>
      </div>

      <div style={{ position: "absolute", left: 70, right: 70, bottom: 115 }}>
        <div style={{ height: 3, background: C.line, borderRadius: 4, overflow: "hidden" }}>
          <div style={{ width: `${(state.localFrame / SCENE_FRAMES) * 100}%`, height: "100%", background: state.accent }} />
        </div>
        <Txt size={24} style={{ marginTop: 18 }}>{state.explanation}</Txt>
        <Txt size={16} color={C.muted} style={{ marginTop: 12 }}>
          MASSA 60 kg · GRAVITASI 10 m/s² · {Math.floor(state.localTime)} / 8 DETIK
        </Txt>
      </div>
    </AbsoluteFill>
  );
};

export const OrionV70MotionTestRevision3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const state = getMotionState(frame, fps);
  return <AbsoluteFill><ElevatorScene state={state} /></AbsoluteFill>;
};

export const ORION_V70_MOTION_TEST_REVISION3_DURATION = TOTAL_FRAMES;
