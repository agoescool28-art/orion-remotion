import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

/**
 * ORION V7.0 — Corrected 32s Motion Proof of Concept
 * Purpose: demonstrate four elevator states with scene-local timing and a shared kinematic model.
 * This is a motion-system test, not the final 94s narrated edit.
 */

const COLORS = {
  bg: "#F1EEE7",
  paper: "#FBF9F4",
  ink: "#1D2022",
  muted: "#77766F",
  line: "#D4CFC5",
  orange: "#E96C3C",
  teal: "#397D79",
  dark: "#222629",
  pale: "#E7E2D8",
};

const FPS = 30;
const SCENE_FRAMES = 8 * FPS;
const TOTAL_FRAMES = 4 * SCENE_FRAMES;
const PX_PER_METER = 12;

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

type Mode = "accelerate-up" | "constant-up" | "decelerate-up" | "accelerate-down";

type MotionState = {
  displacement: number;
  velocity: number;
  acceleration: number;
  direction: "UP" | "DOWN";
  label: string;
  shortLabel: string;
  scaleKg: number;
  normalN: number;
  accent: string;
  explanation: string;
};

const getMotionState = (mode: Mode, t: number): MotionState => {
  // t is seconds within the 8-second scene.
  if (mode === "accelerate-up") {
    // Accelerate upward continuously for 8 seconds, reaching 8 m/s.
    const displacementM = 0.5 * t * t;
    const velocity = t;
    const acceleration = 1;
    return {
      displacement: displacementM * PX_PER_METER,
      velocity,
      acceleration,
      direction: "UP",
      label: "LIFT MULAI NAIK",
      shortLabel: "PERCEPATAN KE ATAS",
      scaleKg: 66,
      normalN: 660,
      accent: COLORS.orange,
      explanation: "Lantai mendorong tubuh lebih kuat.",
    };
  }

  if (mode === "constant-up") {
    // Continue upward at the 8 m/s reached in the previous moment.
    return {
      displacement: 8 * t * PX_PER_METER,
      velocity: 8,
      acceleration: 0,
      direction: "UP",
      label: "KECEPATAN TETAP",
      shortLabel: "GERAK KE ATAS KONSTAN",
      scaleKg: 60,
      normalN: 600,
      accent: COLORS.teal,
      explanation: "Lift tetap naik. Percepatannya nol.",
    };
  }

  if (mode === "decelerate-up") {
    // Start at 8 m/s upward and decelerate at 1 m/s², stopping at 8 seconds.
    const displacementM = 8 * t - 0.5 * t * t;
    const velocity = Math.max(0, 8 - t);
    const acceleration = t < 8 ? -1 : 0;
    return {
      displacement: displacementM * PX_PER_METER,
      velocity,
      acceleration,
      direction: "UP",
      label: "MASIH NAIK, MELAMBAT",
      shortLabel: "PERCEPATAN KE BAWAH",
      scaleKg: 54,
      normalN: 540,
      accent: COLORS.orange,
      explanation: "Lift masih naik, tetapi kecepatannya berkurang.",
    };
  }

  // Starts from rest and accelerates downward.
  return {
    displacement: -0.5 * t * t * PX_PER_METER,
    velocity: t,
    acceleration: -1,
    direction: "DOWN",
    label: "LIFT MULAI TURUN",
    shortLabel: "PERCEPATAN KE BAWAH",
    scaleKg: 54,
    normalN: 540,
    accent: COLORS.teal,
    explanation: "Percepatan ke bawah membuat bacaan berkurang.",
  };
};

const Text: React.FC<{
  children: React.ReactNode;
  size?: number;
  color?: string;
  weight?: number;
  style?: React.CSSProperties;
}> = ({ children, size = 32, color = COLORS.ink, weight = 700, style }) => (
  <div
    style={{
      fontFamily: "Arial, Helvetica, sans-serif",
      fontSize: size,
      lineHeight: 1.08,
      letterSpacing: -0.8,
      fontWeight: weight,
      color,
      ...style,
    }}
  >
    {children}
  </div>
);

const Arrow: React.FC<{ up: boolean; color: string; height: number; label: string }> = ({
  up,
  color,
  height,
  label,
}) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
    <Text size={19} color={color}>{up ? "↑" : "↓"}</Text>
    <div
      style={{
        width: 8,
        height,
        background: color,
        borderRadius: 8,
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: up ? -2 : "auto",
          bottom: up ? "auto" : -2,
          left: -7,
          width: 0,
          height: 0,
          borderLeft: "11px solid transparent",
          borderRight: "11px solid transparent",
          ...(up ? { borderBottom: `15px solid ${color}` } : { borderTop: `15px solid ${color}` }),
        }}
      />
    </div>
    <Text size={17} color={color}>{label}</Text>
  </div>
);

const DigitalScale: React.FC<{ frame: number; target: number; accent: string }> = ({
  frame,
  target,
  accent,
}) => {
  const value = interpolate(frame, [0, 18, 36], [60, target, target], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  return (
    <div
      style={{
        width: 250,
        background: COLORS.dark,
        border: `4px solid ${accent}`,
        borderRadius: 18,
        padding: "18px 22px",
        boxShadow: "0 12px 28px rgba(0,0,0,.14)",
      }}
    >
      <Text size={15} color="#B9BCB7" style={{ letterSpacing: 2 }}>TIMBANGAN</Text>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 8 }}>
        <Text size={65} color={COLORS.paper}>{Math.round(value)}</Text>
        <Text size={20} color={COLORS.paper}>kg</Text>
      </div>
    </div>
  );
};

const Person: React.FC<{ acceleration: number; frame: number }> = ({
  acceleration,
  frame,
}) => {
  // Small inertial lean opposite the cabin's acceleration; eased settling avoids a sine-only bob.
  const lean = interpolate(acceleration, [-1, 0, 1], [7, 0, -7], clamp);
  const settle = Math.exp(-Math.max(0, frame - 12) / 22);
  const response = lean * (0.35 + 0.65 * settle);
  const headY = Math.sin(frame / 8) * 1.8;

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        bottom: 42,
        width: 118,
        height: 310,
        transform: `translateX(-50%) rotate(${response}deg)`,
        transformOrigin: "50% 82%",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: headY,
          left: 31,
          width: 58,
          height: 58,
          borderRadius: "50%",
          background: "#C68E6B",
          border: `4px solid ${COLORS.ink}`,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 65,
          left: 17,
          width: 86,
          height: 145,
          borderRadius: "34px 34px 13px 13px",
          background: COLORS.teal,
          border: `4px solid ${COLORS.ink}`,
        }}
      />
      <div style={{ position: "absolute", top: 204, left: 29, width: 22, height: 96, background: COLORS.ink, borderRadius: 8 }} />
      <div style={{ position: "absolute", top: 204, right: 29, width: 22, height: 96, background: COLORS.ink, borderRadius: 8 }} />
    </div>
  );
};

const ElevatorScene: React.FC<{ mode: Mode; moment: number }> = ({ mode, moment }) => {
  const globalFrame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // Each 8-second moment has its own local clock. Never feed global time
  // into a scene-local kinematic equation.
  const localFrame = globalFrame % SCENE_FRAMES;
  const t = localFrame / fps;
  const state = getMotionState(mode, t);
  const shaftDrift = state.displacement * 0.72;
  const accelerationLabel = state.acceleration > 0 ? "a = +1 m/s²" : state.acceleration < 0 ? "a = −1 m/s²" : "a = 0 m/s²";

  return (
    <AbsoluteFill style={{ background: COLORS.bg, padding: "72px 70px 62px", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 42, left: 70, right: 70, height: 2, background: COLORS.line }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Text size={17} color={COLORS.muted} style={{ letterSpacing: 3 }}>ORION CREATIVE / PHYSICS IN MOTION</Text>
        <Text size={18} color={state.accent}>MOMEN 0{moment}</Text>
      </div>

      <div style={{ marginTop: 48 }}>
        <Text size={54}>{state.label}</Text>
        <Text size={23} color={COLORS.muted} style={{ marginTop: 12 }}>{state.shortLabel}</Text>
      </div>

      <div style={{ position: "absolute", left: 70, top: 300, width: 560, height: 1050 }}>
        {/* Shaft guide marks move opposite to the cabin to make travel legible. */}
        <div style={{ position: "absolute", left: 70, right: 70, top: 0, bottom: 0, borderLeft: `5px solid ${COLORS.ink}`, borderRight: `5px solid ${COLORS.ink}`, overflow: "hidden" }}>
          {Array.from({ length: 10 }, (_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: ((i * 150 + shaftDrift) % 1500) - 150,
                height: 3,
                background: COLORS.line,
              }}
            />
          ))}
          <div
            style={{
              position: "absolute",
              left: 45,
              right: 45,
              top: 230,
              height: 650,
              border: `7px solid ${COLORS.ink}`,
              borderRadius: "18px 18px 8px 8px",
              background: "linear-gradient(90deg,#D4CFC5 0%,#F9F7F1 22%,#E8E3D9 78%,#C9C4BA 100%)",
              transform: "translateY(0px)",
              boxShadow: "0 22px 35px rgba(0,0,0,.12)",
            }}
          >
            <div style={{ position: "absolute", left: 18, right: 18, top: 18, height: 8, background: "#BEB8AD" }} />
            <div style={{ position: "absolute", left: 22, right: 22, bottom: 20, height: 10, background: state.accent, borderRadius: 8 }} />
            <Person acceleration={state.acceleration} frame={localFrame} />
            <div style={{ position: "absolute", left: 18, bottom: 8, width: 100, height: 5, background: COLORS.ink }} />
          </div>
        </div>
      </div>

      <div style={{ position: "absolute", right: 70, top: 370, width: 330 }}>
        <DigitalScale frame={localFrame} target={state.scaleKg} accent={state.accent} />
        <div style={{ marginTop: 24, background: COLORS.paper, border: `2px solid ${COLORS.line}`, borderRadius: 18, padding: 22 }}>
          <Text size={17} color={COLORS.muted}>KECEPATAN</Text>
          <Text size={42} color={COLORS.ink}>{state.velocity.toFixed(1)} m/s</Text>
          <div style={{ height: 1, background: COLORS.line, margin: "15px 0" }} />
          <Text size={17} color={COLORS.muted}>PERCEPATAN</Text>
          <Text size={34} color={state.accent}>{accelerationLabel}</Text>
          <Text size={17} color={COLORS.muted} style={{ marginTop: 14 }}>{state.direction === "UP" ? "Arah gerak: ke atas ↑" : "Arah gerak: ke bawah ↓"}</Text>
        </div>

        <div style={{ marginTop: 22, background: COLORS.paper, border: `2px solid ${COLORS.line}`, borderRadius: 18, padding: 22 }}>
          <Text size={17} color={COLORS.muted}>DIAGRAM GAYA</Text>
          <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", marginTop: 20 }}>
            <Arrow up color={COLORS.orange} height={state.normalN / 9} label={`N ${state.normalN} N`} />
            <Arrow up={false} color={COLORS.teal} height={600 / 9} label="W 600 N" />
          </div>
          <Text size={17} color={COLORS.muted} style={{ marginTop: 14, textAlign: "center" }}>N − W = m × a</Text>
        </div>
      </div>

      <div style={{ position: "absolute", left: 70, right: 70, bottom: 115 }}>
        <div style={{ height: 3, background: COLORS.line, borderRadius: 4, overflow: "hidden" }}>
          <div style={{ width: `${(localFrame / SCENE_FRAMES) * 100}%`, height: "100%", background: state.accent }} />
        </div>
        <Text size={25} color={COLORS.ink} style={{ marginTop: 18 }}>{state.explanation}</Text>
        <Text size={16} color={COLORS.muted} style={{ marginTop: 12 }}>MASSA 60 kg  ·  GRAVITASI 10 m/s²  ·  TIMELINE {Math.floor(t)} / 8 DETIK</Text>
      </div>
    </AbsoluteFill>
  );
};

export const OrionV70MotionTest: React.FC = () => {
  const frame = useCurrentFrame();
  const sceneIndex = Math.min(3, Math.floor(frame / SCENE_FRAMES));
  const modes: Mode[] = ["accelerate-up", "constant-up", "decelerate-up", "accelerate-down"];
  return (
    <AbsoluteFill>
      <ElevatorScene mode={modes[sceneIndex]} moment={sceneIndex + 1} />
    </AbsoluteFill>
  );
};

export const ORION_V70_MOTION_TEST_DURATION = TOTAL_FRAMES;
