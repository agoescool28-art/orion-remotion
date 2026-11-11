import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const C = {
  bg: "#F3F0E9",
  ink: "#17191B",
  muted: "#77766F",
  line: "#D8D3C9",
  orange: "#F26A38",
  teal: "#2D7775",
  white: "#FFFDF8",
  dark: "#202326",
  paleOrange: "#F8DFD2",
  paleTeal: "#DCEAE6",
};

const TOTAL = 2820; // 94 seconds at 30 fps
// Scene ranges below are an editorial timing map. Exact word-level sync still requires measured cue timestamps from the final voice recording.

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const fadeUp = (f: number, start = 0, duration = 18) =>
  interpolate(f, [start, start + duration], [0, 1], clamp);

const rise = (f: number, start = 0, duration = 22, distance = 34) =>
  interpolate(f, [start, start + duration], [distance, 0], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });

const Text = ({
  children,
  size = 54,
  color = C.ink,
  weight = 700,
  style = {},
}: {
  children: React.ReactNode;
  size?: number;
  color?: string;
  weight?: number;
  style?: React.CSSProperties;
}) => (
  <div
    style={{
      fontFamily: "Arial, Helvetica, sans-serif",
      fontSize: size,
      color,
      fontWeight: weight,
      lineHeight: 1.04,
      letterSpacing: -1.8,
      ...style,
    }}
  >
    {children}
  </div>
);

const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      color: C.muted,
      fontFamily: "Arial, sans-serif",
      fontSize: 21,
      fontWeight: 700,
      letterSpacing: 3,
      textTransform: "uppercase",
    }}
  >
    {children}
  </div>
);

const Base = ({
  children,
  dark = false,
}: {
  children: React.ReactNode;
  dark?: boolean;
}) => (
  <AbsoluteFill
    style={{
      backgroundColor: dark ? C.dark : C.bg,
      color: dark ? C.white : C.ink,
      padding: "112px 82px 100px",
      fontFamily: "Arial, Helvetica, sans-serif",
      overflow: "hidden",
    }}
  >
    <div
      style={{
        position: "absolute",
        left: 82,
        right: 82,
        top: 72,
        height: 2,
        background: dark ? "#45494A" : C.line,
      }}
    />
    <div
      style={{
        position: "absolute",
        left: 82,
        bottom: 54,
        color: dark ? "#A7AAA6" : "#858178",
        fontSize: 17,
        fontWeight: 700,
        letterSpacing: 3,
      }}
    >
      ORION CREATIVE / PHYSICS IN MOTION
    </div>
    {children}
  </AbsoluteFill>
);

const Meter = ({
  value,
  label,
  accent = C.orange,
  compact = false,
}: {
  value: string;
  label: string;
  accent?: string;
  compact?: boolean;
}) => (
  <div
    style={{
      width: compact ? 270 : 390,
      padding: compact ? "22px 24px" : "30px 34px",
      borderRadius: 22,
      background: C.dark,
      boxShadow: "0 20px 50px rgba(20,20,20,.16)",
      color: C.white,
      border: `3px solid ${accent}`,
    }}
  >
    <div
      style={{
        fontSize: 17,
        color: "#B9BCB7",
        letterSpacing: 3,
        fontWeight: 700,
      }}
    >
      {label}
    </div>
    <div
      style={{
        fontSize: compact ? 76 : 112,
        lineHeight: 1,
        fontWeight: 800,
        letterSpacing: -5,
        marginTop: 12,
      }}
    >
      {value}
      <span style={{ fontSize: compact ? 25 : 32, letterSpacing: 0 }}> kg</span>
    </div>
  </div>
);

const Elevator = ({
  position = "up",
  number = "60",
  accent = C.orange,
}: {
  position?: "up" | "steady" | "slow" | "down";
  number?: string;
  accent?: string;
}) => {
  const frame = useCurrentFrame();
  const movingUp = position === "up" || position === "slow";
  const travel =
    position === "up"
      ? interpolate(frame, [0, 100], [0, -62], clamp)
      : position === "down"
        ? interpolate(frame, [0, 100], [0, 62], clamp)
        : position === "slow"
          ? interpolate(frame, [0, 100], [0, -26], clamp)
          : 0;
  const shake =
    position === "up"
      ? Math.sin(frame * 0.48) * 2.8
      : position === "down"
        ? Math.sin(frame * 0.38) * 2
        : 0;
  const scalePulse = interpolate(frame, [0, 8, 16, 30], [1, 1.045, 1, 1], clamp);
  const indicator = position === "down" ? "↓" : position === "steady" ? "Ⅱ" : "↑";

  return (
    <div style={{ position: "relative", width: 560, height: 850 }}>
      {/* Elevator shaft: moving floor markers make travel direction readable. */}
      <div
        style={{
          position: "absolute",
          left: 74,
          right: 74,
          top: 0,
          bottom: 0,
          border: `8px solid ${C.ink}`,
          borderBottomWidth: 14,
          borderRadius: "24px 24px 12px 12px",
          background: "#E5E0D6",
          overflow: "hidden",
        }}
      >
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 18,
              right: 18,
              top: ((i * 190 + frame * (position === "up" ? 3.2 : position === "down" ? -3.2 : position === "slow" ? 1.25 : 0)) % 1140) - 140,
              height: 3,
              background: "#C8C2B7",
              opacity: 0.8,
            }}
          />
        ))}
        <div
          style={{
            position: "absolute",
            left: 26,
            right: 26,
            top: 32,
            height: 10,
            borderRadius: 10,
            background: "#BEB8AD",
          }}
        />
        {/* Lift cabin and passenger */}
        <div
          style={{
            position: "absolute",
            left: 54,
            right: 54,
            bottom: 54,
            height: 570,
            transform: `translateY(${travel + shake}px) scale(${scalePulse})`,
            transformOrigin: "center bottom",
            border: `7px solid ${C.ink}`,
            borderRadius: "18px 18px 8px 8px",
            background: "linear-gradient(90deg,#D7D2C8 0%,#F4F0E7 18%,#EAE5DB 82%,#CFC9BE 100%)",
            boxShadow: "0 18px 0 rgba(23,25,27,.12)",
          }}
        >
          <div style={{ position: "absolute", left: 18, right: 18, top: 18, height: 8, background: "#BEB8AD" }} />
          <div
            style={{
              position: "absolute",
              left: "50%",
              bottom: 30,
              transform: `translateX(-50%) translateY(${Math.sin(frame / 5) * (movingUp ? 3 : 1)}px)`,
              width: 132,
              height: 390,
            }}
          >
            <div
              style={{
                width: 94,
                height: 94,
                borderRadius: "50%",
                background: "#C58F6C",
                margin: "0 auto",
                border: `5px solid ${C.ink}`,
                boxShadow: "inset -10px -8px 0 rgba(0,0,0,.08)",
              }}
            />
            <div
              style={{
                width: 132,
                height: 205,
                marginTop: 8,
                borderRadius: "42px 42px 16px 16px",
                background: C.teal,
                border: `5px solid ${C.ink}`,
                boxShadow: "inset -12px 0 0 rgba(0,0,0,.12)",
              }}
            />
            <div style={{ display: "flex", justifyContent: "space-around" }}>
              <div style={{ width: 27, height: 76, background: C.ink, borderRadius: "0 0 8px 8px" }} />
              <div style={{ width: 27, height: 76, background: C.ink, borderRadius: "0 0 8px 8px" }} />
            </div>
          </div>
          <div
            style={{
              position: "absolute",
              left: 20,
              right: 20,
              bottom: 18,
              height: 9,
              background: accent,
              borderRadius: 8,
            }}
          />
        </div>
        {/* Direction indicator */}
        <div
          style={{
            position: "absolute",
            right: 18,
            top: 26,
            width: 62,
            height: 62,
            borderRadius: 14,
            background: C.dark,
            color: C.orange,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 38,
            fontWeight: 900,
            boxShadow: "0 6px 0 rgba(0,0,0,.16)",
          }}
        >
          {indicator}
        </div>
        {/* Motion streaks */}
        {position !== "steady" && (
          <>
            <div style={{ position: "absolute", left: 14, top: 250 + Math.sin(frame / 4) * 10, width: 30, height: 5, background: accent, opacity: 0.8 }} />
            <div style={{ position: "absolute", right: 14, top: 430 + Math.cos(frame / 5) * 12, width: 30, height: 5, background: accent, opacity: 0.8 }} />
          </>
        )}
      </div>
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 40,
          transform: `translateX(25%) scale(${scalePulse})`,
          transformOrigin: "left top",
        }}
      >
        <Meter value={number} label="TIMBANGAN" compact accent={accent} />
      </div>
    </div>
  );
};

const ForceDiagram = ({
  normal = 600,
  gravity = 600,
  accel = "0",
}: {
  normal?: number;
  gravity?: number;
  accel?: string;
}) => (
  <div
    style={{
      width: 470,
      padding: 30,
      background: C.white,
      borderRadius: 24,
      border: `2px solid ${C.line}`,
    }}
  >
    <div style={{ textAlign: "center", fontSize: 20, color: C.muted, fontWeight: 700 }}>
      DIAGRAM GAYA
    </div>
    <div style={{ height: 360, position: "relative", marginTop: 18 }}>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 128,
          transform: "translateX(-50%)",
          width: 100,
          height: 100,
          borderRadius: 18,
          background: C.teal,
          border: `5px solid ${C.ink}`,
        }}
      />
      <div style={{ position: "absolute", left: "50%", top: 0, transform: "translateX(-50%)", textAlign: "center" }}>
        <div style={{ color: C.orange, fontWeight: 800, fontSize: 26 }}>N ↑</div>
        <div style={{ width: 8, height: Math.max(65, normal / 7), background: C.orange, margin: "4px auto" }} />
      </div>
      <div style={{ position: "absolute", left: "50%", top: 236, transform: "translateX(-50%)", textAlign: "center" }}>
        <div style={{ width: 8, height: Math.max(65, gravity / 7), background: C.teal, margin: "0 auto 4px" }} />
        <div style={{ color: C.teal, fontWeight: 800, fontSize: 26 }}>↓ W = 600 N</div>
      </div>
    </div>
    <div style={{ textAlign: "center", fontSize: 22, fontWeight: 700 }}>
      Percepatan: <span style={{ color: C.orange }}>{accel}</span>
    </div>
  </div>
);

const Scene = ({
  children,
  dark = false,
}: {
  children: React.ReactNode;
  dark?: boolean;
}) => <Base dark={dark}>{children}</Base>;

const Hook = () => {
  const f = useCurrentFrame();
  const phase = f < 82 ? 0 : f < 166 ? 1 : 2;
  const phrases = [
    { top: "KAMU BERDIRI", bottom: "DI ATAS TIMBANGAN.", color: C.orange },
    { top: "DI DALAM", bottom: "SEBUAH LIFT.", color: C.teal },
    { top: "ANGKANYA NAIK", bottom: "ATAU TURUN?", color: C.orange },
  ];
  const active = phrases[phase];
  const local = phase === 0 ? f : phase === 1 ? f - 82 : f - 166;
  const liftY = interpolate(f, [0, 45, 95, 165, 260, 299], [80, 24, -8, -46, -82, -105], clamp);
  const cabinTilt = interpolate(f, [0, 20, 40, 70, 90], [0, -1.2, 0, 0.8, 0], clamp);
  const questionScale = interpolate(f, [166, 184, 205], [0.82, 1.08, 1], clamp);

  return (
    <Scene dark>
      <div style={{ position: "absolute", top: 152, left: 82, right: 82 }}>
        <Eyebrow>Eksperimen fisika sehari-hari</Eyebrow>
        <div
          key={phase}
          style={{
            marginTop: 42,
            opacity: fadeUp(local, 0, 12),
            transform: `translateY(${rise(local, 0, 18, 48)}px)`,
          }}
        >
          <Text size={88} color={C.white}>{active.top}</Text>
          <Text size={94} color={active.color}>{active.bottom}</Text>
        </div>
      </div>

      {/* Lift travels through a shaft; floor lines move in the opposite direction. */}
      <div
        style={{
          position: "absolute",
          left: 150,
          bottom: 85,
          width: 500,
          height: 670,
          borderLeft: "5px solid #666A68",
          borderRight: "5px solid #666A68",
          overflow: "hidden",
          opacity: 0.9,
        }}
      >
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: ((i * 150 + f * 3.3) % 1050) - 150,
              height: 3,
              background: "#666A68",
              opacity: 0.7,
            }}
          />
        ))}
        <div
          style={{
            position: "absolute",
            left: 48,
            right: 48,
            bottom: 42,
            height: 410,
            border: `7px solid ${C.white}`,
            borderRadius: "18px 18px 6px 6px",
            background: "linear-gradient(90deg,#A7AAA5,#E7E2D8 22%,#D9D3C8 78%,#898E89)",
            transform: `translateY(${liftY}px) rotate(${cabinTilt}deg)`,
            boxShadow: "0 24px 45px rgba(0,0,0,.3)",
          }}
        >
          <div style={{ position: "absolute", left: 18, right: 18, top: 18, height: 7, background: "#9C9E98" }} />
          <div style={{ position: "absolute", left: 18, right: 18, bottom: 24, height: 10, background: C.orange }} />
          <div
            style={{
              position: "absolute",
              left: "50%",
              bottom: 36,
              transform: "translateX(-50%)",
              width: 105,
              height: 300,
            }}
          >
            <div style={{ width: 74, height: 74, margin: "0 auto", borderRadius: "50%", background: "#C58F6C", border: `5px solid ${C.ink}` }} />
            <div style={{ width: 105, height: 155, marginTop: 7, borderRadius: "34px 34px 10px 10px", background: C.teal, border: `5px solid ${C.ink}` }} />
            <div style={{ display: "flex", justifyContent: "space-around" }}>
              <div style={{ width: 22, height: 58, background: C.ink }} />
              <div style={{ width: 22, height: 58, background: C.ink }} />
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          right: 74,
          bottom: 370,
          width: 330,
          opacity: fadeUp(f, 36, 18),
          transform: `scale(${phase === 2 ? questionScale : 1})`,
          transformOrigin: "right center",
        }}
      >
        <Meter value="60" label="BERAT AWAL" compact accent={C.orange} />
        <div style={{ marginTop: 24, color: "#B9BCB7", fontSize: 25, lineHeight: 1.25, fontWeight: 700 }}>
          Timbangan mengukur gaya tekanmu.
        </div>
      </div>

      {/* Acceleration cue builds as the question lands. */}
      <div
        style={{
          position: "absolute",
          right: 112,
          top: 650,
          color: C.orange,
          fontSize: 82,
          fontWeight: 900,
          opacity: interpolate(f, [180, 198, 260], [0, 1, 1], clamp),
          transform: `translateY(${interpolate(f, [180, 205], [24, 0], clamp)}px)`,
        }}
      >
        ↑ ?
      </div>
    </Scene>
  );
};

const Setup = () => {
  const f = useCurrentFrame();
  return (
    <Scene>
      <Eyebrow>Atur eksperimennya</Eyebrow>
      <div style={{ marginTop: 34, opacity: fadeUp(f), transform: `translateY(${rise(f)}px)` }}>
        <Text size={90}>MASSA KAMU</Text>
        <Text size={148} color={C.orange}>60 kg</Text>
      </div>
      <div style={{ display: "flex", gap: 22, marginTop: 60 }}>
        <div style={{ flex: 1, padding: 28, borderRadius: 22, background: C.white, border: `2px solid ${C.line}` }}>
          <Eyebrow>Percepatan lift</Eyebrow>
          <Text size={82} color={C.teal}>1 m/s²</Text>
        </div>
        <div style={{ flex: 1, padding: 28, borderRadius: 22, background: C.white, border: `2px solid ${C.line}` }}>
          <Eyebrow>Gravitasi</Eyebrow>
          <Text size={82}>10 m/s²</Text>
        </div>
      </div>
      <div style={{ marginTop: 66, padding: 34, borderLeft: `10px solid ${C.orange}`, background: C.paleOrange }}>
        <Text size={40}>Timbangan mengukur gaya tekan,</Text>
        <Text size={40}>bukan massa tubuhmu secara langsung.</Text>
      </div>
    </Scene>
  );
};

const FourMoments = () => {
  const f = useCurrentFrame();
  const items = [
    { id: "01", title: "MULAI NAIK", sub: "Percepatan ke atas", arrow: "↑", color: C.orange, value: "66" },
    { id: "02", title: "KECEPATAN TETAP", sub: "Percepatan nol", arrow: "—", color: C.teal, value: "60" },
    { id: "03", title: "NAIK, MELAMBAT", sub: "Percepatan ke bawah", arrow: "↓", color: C.orange, value: "54" },
    { id: "04", title: "MULAI TURUN", sub: "Percepatan ke bawah", arrow: "↓", color: C.teal, value: "54" },
  ];
  const active = Math.min(3, Math.floor(f / 82));
  const current = items[active];
  return (
    <Scene>
      <Eyebrow>Empat kondisi gerak</Eyebrow>
      <Text size={78} style={{ marginTop: 26 }}>ARAH GERAK ≠</Text>
      <Text size={82} color={C.orange}>ARAH PERCEPATAN</Text>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 48 }}>
        {items.map((it, i) => {
          const selected = active === i;
          return (
            <div key={it.id} style={{
              background: selected ? C.dark : C.white,
              color: selected ? C.white : C.ink,
              border: `2px solid ${selected ? it.color : C.line}`,
              borderTop: `8px solid ${it.color}`,
              borderRadius: 20,
              padding: 22,
              transform: `translateY(${selected ? -8 : 0}px)`,
              boxShadow: selected ? "0 16px 34px rgba(0,0,0,.14)" : "none",
              opacity: fadeUp(f, i * 4, 12),
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Text size={48} color={it.color}>{it.id}</Text>
                <div style={{ fontSize: 56, fontWeight: 900, color: it.color }}>{it.arrow}</div>
              </div>
              <Text size={27} color={selected ? C.white : C.ink} style={{ marginTop: 12 }}>{it.title}</Text>
              <div style={{ fontSize: 19, color: selected ? "#C6C8C2" : C.muted, marginTop: 8 }}>{it.sub}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 12 }}>
                <span style={{ color: it.color, fontSize: 42, fontWeight: 900 }}>{it.value}</span>
                <span style={{ color: selected ? "#C6C8C2" : C.muted, fontSize: 17 }}>kg</span>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", bottom: 122, left: 82, right: 82, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 24px", background: C.paleOrange, borderRadius: 16 }}>
        <span style={{ fontSize: 22, fontWeight: 800, color: C.ink }}>SEDANG DIBAHAS</span>
        <span style={{ fontSize: 27, fontWeight: 900, color: C.orange }}>{current.id} / 04 · {current.title}</span>
      </div>
    </Scene>
  );
};

const Countdown = () => {
  const f = useCurrentFrame();
  const n = f < 40 ? "3" : f < 80 ? "2" : "1";
  return (
    <Scene dark>
      <div style={{ position: "absolute", top: 230, left: 82 }}>
        <Eyebrow>Sudah punya jawaban?</Eyebrow>
        <Text size={76} color={C.white} style={{ marginTop: 28 }}>TULIS ANGKANYA</Text>
        <Text size={76} color={C.orange}>SEBELUM WAKTU HABIS.</Text>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 650, textAlign: "center" }}>
        <Text size={330} color={C.orange} style={{ opacity: fadeUp(f % 40, 0, 7), transform: `scale(${interpolate(f % 40, [0, 7, 15], [0.72, 1.12, 1], clamp)})` }}>{n}</Text>
      </div>
    </Scene>
  );
};

const Reveal = ({
  moment,
  title,
  value,
  explanation,
  position,
  accent,
}: {
  moment: string;
  title: string;
  value: string;
  explanation: string;
  position: "up" | "steady" | "slow" | "down";
  accent: string;
}) => {
  const f = useCurrentFrame();
  const isUpAccel = position === "up";
  const isZero = position === "steady";
  const accelDown = position === "slow" || position === "down";
  const forceNormal = isUpAccel ? 660 : isZero ? 600 : 540;
  const displayed = Number(value);
  const duration = 300;

  // The whole ten-second scene has a readable motion arc, not a two-second entrance followed by a static hold.
  const anticipation = interpolate(f, [0, 16, 32], [0, 1, 0], clamp);
  const action = interpolate(f, [20, 72, 225, 285], [0, 1, 0.92, 0.18], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const settle = interpolate(f, [220, 270, 299], [0, 0.65, 1], clamp);

  // Cabin travel is continuous for the full scene. Shaft marks move in the opposite direction.
  const travelSign = isUpAccel || position === "slow" ? -1 : position === "down" ? 1 : 0;
  const travelDistance = isZero ? 0 : position === "up" ? -310 : position === "slow" ? -250 : 310;
  const travelProgress = interpolate(f, [0, 299], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.quad),
  });
  const cabinY = travelDistance * travelProgress;
  const shaftSpeed = isZero ? 0 : (position === "slow" ? 3.1 : 5.4) * (position === "down" ? -1 : 1);
  const shaftOffset = (f * shaftSpeed + (f * f * 0.012 * (isZero ? 0 : 1))) % 170;

  // Inertial lag is a distinct impulse followed by a damped settle.
  const lagDirection = accelDown ? -1 : 1;
  const bodyLag = isZero ? 0 : lagDirection * (
    36 * Math.exp(-f / 58) * Math.sin(f / 8.5) + 11 * Math.sin(f / 39) * (1 - settle)
  );
  const torsoTilt = isZero ? 0 : lagDirection * (
    9 * Math.exp(-f / 62) * Math.sin(f / 10.5) + 2.2 * Math.sin(f / 28) * (1 - settle)
  );
  const headLag = isZero ? 0 : -torsoTilt * 0.42 + 2.4 * Math.sin(f / 17) * (1 - settle);

  // The scale reading rolls from 60 to the target during the causal event, then remains readable.
  const scaleNumber = interpolate(f, [0, 48, 92, 128], [60, 60, displayed, displayed], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const impact = interpolate(f, [72, 88, 103, 126], [1, 1.12, 0.985, 1], clamp);
  const pulse = 1 + Math.sin(f / 10) * 0.012 * (f > 80 && f < 230 ? 1 : 0);
  const scaleGlow = interpolate(f, [70, 100, 170, 260], [0, 1, 0.58, 0.22], clamp);

  const normalReveal = interpolate(f, [105, 150], [0, 1], clamp);
  const accelReveal = interpolate(f, [30, 72], [0, 1], clamp);
  const arrowDirection = isZero ? 0 : accelDown ? 1 : -1;
  const arrowHeight = isZero ? 0 : 150 * accelReveal;
  const caption = f < 72
    ? (isZero ? "KECEPATAN TETAP" : "LIFT BERGERAK")
    : f < 142
      ? (isUpAccel ? "PERCEPATAN KE ATAS" : isZero ? "PERCEPATAN = 0" : "PERCEPATAN KE BAWAH")
      : f < 218
        ? (isUpAccel ? "LANTAI MENDORONG LEBIH KUAT" : isZero ? "GAYA NORMAL = BERAT" : "LANTAI MENDORONG LEBIH LEMAH")
        : `HASIL: ${value} KG`;
  const normalBar = (forceNormal / 700) * 100;
  const weightBar = 600 / 700 * 100;

  return (
    <Scene>
      {/* Header remains legible while the physical demonstration continues underneath. */}
      <div style={{ position: "absolute", left: 76, right: 76, top: 104, zIndex: 10 }}>
        <Eyebrow>{`MOMEN ${moment} / EKSPERIMEN`}</Eyebrow>
        <div style={{ marginTop: 16, display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
          <Text size={65}>{title}</Text>
          <div style={{ color: accent, fontSize: 30, fontWeight: 900 }}>{moment}/4</div>
        </div>
        <div style={{
          display: "inline-flex", marginTop: 18, padding: "13px 20px",
          borderRadius: 12, background: C.dark, color: C.white,
          fontSize: 22, fontWeight: 900, letterSpacing: 1,
          opacity: fadeUp(f, 8, 12),
        }}>
          {caption}
        </div>
      </div>

      {/* Elevator shaft and cabin: the cabin keeps travelling throughout the scene. */}
      <div style={{
        position: "absolute", left: 66, top: 370, width: 492, height: 920,
        borderLeft: `7px solid ${C.ink}`, borderRight: `7px solid ${C.ink}`,
        background: "linear-gradient(90deg,#E8E3D9 0%,#F7F4ED 48%,#E8E3D9 100%)",
        overflow: "hidden",
      }}>
        {[0,1,2,3,4,5,6,7,8,9,10].map(i => (
          <div key={i} style={{
            position: "absolute", left: 0, right: 0,
            top: ((i * 170 + shaftOffset) % 1870) - 170,
            height: 4, background: "#C6C0B5", opacity: 0.95,
          }} />
        ))}
        <div style={{
          position: "absolute", left: 28, right: 28, bottom: 64,
          height: 630, border: `8px solid ${C.ink}`,
          borderRadius: "22px 22px 8px 8px",
          background: "linear-gradient(90deg,#BDB8AE 0%,#F5F1E8 18%,#E8E2D7 78%,#B9B4AA 100%)",
          transform: `translateY(${cabinY}px)`,
          boxShadow: `0 ${22 + anticipation * 12}px 48px rgba(23,25,27,.22)`,
        }}>
          <div style={{ position: "absolute", left: 20, right: 20, top: 22, height: 9, background: "#A9A49A", borderRadius: 8 }} />
          <div style={{ position: "absolute", left: 20, right: 20, bottom: 20, height: 13, background: accent, borderRadius: 8 }} />

          {/* Passenger reacts to acceleration with damped body/head lag, then stabilizes. */}
          <div style={{
            position: "absolute", left: "50%", bottom: 42,
            transform: `translateX(-50%) translateY(${bodyLag}px) rotate(${torsoTilt}deg)`,
            transformOrigin: "center bottom", width: 174, height: 490,
          }}>
            <div style={{
              width: 104, height: 104, margin: "0 auto",
              borderRadius: "50%", background: "#C58F6C",
              border: `6px solid ${C.ink}`,
              transform: `rotate(${headLag}deg)`,
              boxShadow: "inset -12px -8px 0 rgba(0,0,0,.08)",
            }} />
            <div style={{
              width: 154, height: 255, margin: "10px auto 0",
              borderRadius: "46px 46px 18px 18px", background: C.teal,
              border: `6px solid ${C.ink}`,
              boxShadow: "inset -14px 0 0 rgba(0,0,0,.12)",
            }} />
            <div style={{ display: "flex", justifyContent: "space-around" }}>
              <div style={{ width: 32, height: 98, background: C.ink, borderRadius: "0 0 9px 9px" }} />
              <div style={{ width: 32, height: 98, background: C.ink, borderRadius: "0 0 9px 9px" }} />
            </div>
          </div>

          {/* Contact plate compresses visually as the normal force rises/falls. */}
          <div style={{
            position: "absolute", left: 42, right: 42, bottom: 7,
            height: 12 + Math.max(0, (forceNormal - 600) / 60) * 9 + Math.sin(f / 5) * 1.2,
            background: accent, borderRadius: 8,
            boxShadow: `0 0 ${18 * scaleGlow}px ${accent}`,
          }} />
        </div>

        {/* Acceleration vector */}
        {!isZero && (
          <div style={{
            position: "absolute", right: 18, top: arrowDirection > 0 ? 520 : 140,
            display: "flex", flexDirection: "column", alignItems: "center",
            color: accent, opacity: accelReveal,
            transform: `translateY(${Math.sin(f / 12) * 3}px)`,
          }}>
            <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: 1 }}>a</div>
            <div style={{ width: 8, height: arrowHeight, borderRadius: 8, background: accent }} />
            <div style={{ fontSize: 48, lineHeight: .8, fontWeight: 900 }}>{arrowDirection > 0 ? "▼" : "▲"}</div>
          </div>
        )}
        {isZero && (
          <div style={{
            position: "absolute", right: 18, top: 145, padding: "12px 14px",
            background: C.dark, color: C.teal, borderRadius: 10,
            fontSize: 18, fontWeight: 900,
          }}>a = 0</div>
        )}
      </div>

      {/* Right measurement panel: number changes during the causal event. */}
      <div style={{ position: "absolute", left: 592, right: 58, top: 420, zIndex: 5 }}>
        <div style={{ color: C.muted, fontSize: 19, fontWeight: 900, letterSpacing: 2 }}>HASIL TIMBANGAN</div>
        <div style={{
          marginTop: 14, padding: "28px 24px", background: C.dark,
          borderRadius: 22, border: `4px solid ${accent}`,
          boxShadow: `0 18px 44px rgba(0,0,0,.16), 0 0 ${26 * scaleGlow}px ${accent}66`,
          transform: `scale(${impact * pulse})`, transformOrigin: "left center",
        }}>
          <div style={{ color: "#B9BCB7", fontSize: 17, fontWeight: 800, letterSpacing: 2 }}>MASSA TERBACA</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 10 }}>
            <span style={{ color: accent, fontSize: 112, lineHeight: 1, fontWeight: 900, letterSpacing: -6 }}>{Math.round(scaleNumber)}</span>
            <span style={{ color: C.white, fontSize: 29, fontWeight: 800 }}>kg</span>
          </div>
          <div style={{ height: 8, background: "#45494A", borderRadius: 8, marginTop: 18, overflow: "hidden" }}>
            <div style={{ width: `${(scaleNumber / 70) * 100}%`, height: "100%", background: accent }} />
          </div>
        </div>

        {/* Force comparison: both vectors are visible, so the reason for the reading is explicit. */}
        <div style={{
          marginTop: 20, padding: 22, background: C.white,
          borderRadius: 18, border: `2px solid ${C.line}`,
          opacity: normalReveal, transform: `translateY(${(1-normalReveal)*18}px)`,
        }}>
          <div style={{ color: C.muted, fontSize: 18, fontWeight: 900, letterSpacing: 1 }}>PERBANDINGAN GAYA</div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontSize: 18, fontWeight: 900 }}>
            <span>Normal (N)</span><span style={{ color: accent }}>{forceNormal} N</span>
          </div>
          <div style={{ height: 9, marginTop: 7, background: "#E6E1D8", borderRadius: 8, overflow: "hidden" }}>
            <div style={{ width: `${normalBar}%`, height: "100%", background: accent }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, fontSize: 18, fontWeight: 900 }}>
            <span>Berat (mg)</span><span style={{ color: C.muted }}>600 N</span>
          </div>
          <div style={{ height: 9, marginTop: 7, background: "#E6E1D8", borderRadius: 8, overflow: "hidden" }}>
            <div style={{ width: `${weightBar}%`, height: "100%", background: "#858178" }} />
          </div>
          <div style={{ color: accent, fontSize: 20, fontWeight: 900, marginTop: 12 }}>
            {isUpAccel ? "N > mg" : isZero ? "N = mg" : "N < mg"}
          </div>
        </div>

        <div style={{
          marginTop: 18, padding: "18px 20px", borderLeft: `8px solid ${accent}`,
          background: isUpAccel ? C.paleOrange : C.paleTeal,
          fontSize: 22, lineHeight: 1.22, fontWeight: 800, color: C.ink,
          opacity: fadeUp(f, 150, 18),
        }}>{explanation}</div>
      </div>

      {/* A three-step causal chain is revealed sequentially in the lower third. */}
      <div style={{
        position: "absolute", left: 76, right: 76, bottom: 112,
        display: "flex", alignItems: "stretch", gap: 12,
      }}>
        {[
          { label: "PERCEPATAN", value: isZero ? "0" : accelDown ? "KE BAWAH" : "KE ATAS" },
          { label: "GAYA NORMAL", value: `${forceNormal} N` },
          { label: "SKALA", value: `${value} kg` },
        ].map((item, i) => {
          const reveal = interpolate(f, [130 + i * 24, 150 + i * 24], [0, 1], clamp);
          return (
            <div key={item.label} style={{
              flex: 1, padding: "16px 17px", borderRadius: 14,
              background: i === 2 ? C.dark : C.white,
              border: `2px solid ${i === 2 ? accent : C.line}`,
              color: i === 2 ? C.white : C.ink,
              opacity: reveal,
              transform: `translateY(${(1 - reveal) * 20}px)`,
            }}>
              <div style={{ fontSize: 14, fontWeight: 900, letterSpacing: 1, color: i === 2 ? "#B9BCB7" : C.muted }}>{item.label}</div>
              <div style={{ fontSize: 24, fontWeight: 900, marginTop: 6, color: i === 2 ? accent : C.ink }}>{item.value}</div>
            </div>
          );
        })}
      </div>
    </Scene>
  );
};

const Principle = () => {
  const f = useCurrentFrame();
  return (
    <Scene dark>
      <Eyebrow>Inti pelajarannya</Eyebrow>
      <div style={{ marginTop: 56, opacity: fadeUp(f) }}>
        <Text size={75} color={C.white}>BUKAN ARAH</Text>
        <Text size={112} color={C.orange}>GERAKNYA.</Text>
        <Text size={75} color={C.white}>TAPI ARAH</Text>
        <Text size={112} color={C.teal}>PERCEPATANNYA.</Text>
      </div>
      <div style={{ marginTop: 70, maxWidth: 800, color: "#C6C8C2", fontSize: 32, lineHeight: 1.35 }}>
        Lift masih bergerak naik, tetapi percepatannya ke bawah. Timbangan pun menunjukkan angka lebih kecil.
      </div>
    </Scene>
  );
};

const FreeFall = () => {
  const f = useCurrentFrame();
  const y = interpolate(f, [0, 100], [0, 420], clamp);
  return (
    <Scene dark>
      <Eyebrow>Pertanyaan berikutnya</Eyebrow>
      <Text size={88} color={C.white} style={{ marginTop: 40 }}>BAGAIMANA JIKA</Text>
      <Text size={108} color={C.orange}>LIFT JATUH BEBAS?</Text>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 170, display: "flex", justifyContent: "center" }}>
        <div
          style={{
            width: 300,
            height: 390,
            border: `8px solid ${C.white}`,
            borderRadius: 24,
            transform: `translateY(${y}px)`,
            position: "relative",
          }}
        >
          <div style={{ position: "absolute", left: 75, top: 80, width: 130, height: 130, borderRadius: "50%", background: C.teal }} />
          <div style={{ position: "absolute", left: 90, top: 220, width: 100, height: 130, borderRadius: "36px 36px 12px 12px", background: C.orange }} />
        </div>
      </div>
      <div style={{ position: "absolute", right: 72, top: 770, width: 340 }}>
        <Text size={42} color={C.white}>TIMBANGAN MENUNJUKKAN BERAPA?</Text>
        <Text size={26} color="#B7B9B4" style={{ marginTop: 22 }}>Tulis tebakanmu di komentar.</Text>
      </div>
    </Scene>
  );
};

export const OrionV70: React.FC = () => {
  const { fps } = useVideoConfig();
  const duration = Math.round(94 * fps);

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Audio src={staticFile("lift.mp3")} volume={1} />
      <Sequence from={0} durationInFrames={300}><Hook /></Sequence>
      <Sequence from={300} durationInFrames={360}><Setup /></Sequence>
      <Sequence from={660} durationInFrames={420}><FourMoments /></Sequence>
      <Sequence from={1080} durationInFrames={120}><Countdown /></Sequence>
      <Sequence from={1200} durationInFrames={300}>
        <Reveal moment="1" title="LIFT MULAI NAIK" value="66" explanation="Lantai mendorong tubuh lebih kuat. Angka timbangan naik." position="up" accent={C.orange} />
      </Sequence>
      <Sequence from={1500} durationInFrames={240}>
        <Reveal moment="2" title="KECEPATAN TETAP" value="60" explanation="Tidak ada percepatan. Angka kembali ke nilai normal." position="steady" accent={C.teal} />
      </Sequence>
      <Sequence from={1740} durationInFrames={300}>
        <Reveal moment="3" title="MASIH NAIK, MELAMBAT" value="54" explanation="Gerak ke atas, tetapi percepatan ke bawah. Angka berkurang." position="slow" accent={C.orange} />
      </Sequence>
      <Sequence from={2040} durationInFrames={240}>
        <Reveal moment="4" title="MULAI TURUN" value="54" explanation="Percepatan ke bawah. Angka timbangan juga berkurang." position="down" accent={C.teal} />
      </Sequence>
      <Sequence from={2280} durationInFrames={240}><Principle /></Sequence>
      <Sequence from={2520} durationInFrames={300}><FreeFall /></Sequence>
    </AbsoluteFill>
  );
};

export const ORION_V70_DURATION = TOTAL;
