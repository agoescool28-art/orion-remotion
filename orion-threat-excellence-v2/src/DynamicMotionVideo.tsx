import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export interface PointItem {
  text: string;
  tone?: "neutral" | "gold" | "danger" | "success";
  value?: number;
}

export interface CompareColumn {
  title: string;
  badge?: string;
  tone?: "neutral" | "gold" | "danger" | "success";
  items: string[];
}

export interface SceneItem {
  tag?: string;
  heading: string;
  subHeading?: string;
  headingTone?: "gold" | "danger" | "success" | "neutral";
  heroStat?: string;
  heroLabel?: string;
  body: string;
  overlayType?: "pills" | "bars" | "compare" | "checklist";
  points?: PointItem[];
  compareLeft?: CompareColumn;
  compareRight?: CompareColumn;
  visualType?: string;
  vectorScene?:
    | "hook-supply"
    | "pull-clock"
    | "timeline-144"
    | "ekanban-scan"
    | "balance-scale"
    | "heartbeat-jit";
  media?: string;
  mediaType?: "image" | "video";
  motion?: "zoom-in" | "zoom-out";
}

export interface DynamicMotionProps {
  title?: string;
  subtitle?: string;
  visualStyle?: string;
  styleConfig?: {
    bgColor?: string;
    gridColor?: string;
    cardBg?: string;
    accentColor?: string;
    goldColor?: string;
    dangerColor?: string;
    successColor?: string;
    watermark?: string;
  };
  scenes: SceneItem[];
  audioSrc?: string;
  bgmSrc?: string;
  whooshSrc?: string;
}

const ZOOM_STEPS = [
  "×1 ZOOM",
  "×3 ZOOM",
  "×5 ZOOM",
  "×7 ZOOM",
  "×8 ZOOM",
  "×9 ZOOM",
  "×9 ZOOM",
  "×9 ZOOM",
];

const resolveMediaSrc = (src?: string) => {
  if (!src) return "";
  if (src.startsWith("http") || src.startsWith("data:")) return src;
  return staticFile(src);
};

/* ============================================================================
1. DARK NAVY BLUEPRINT BACKGROUND
   ============================================================================ */
const CadBlueprintBackground: React.FC<{
  bgColor: string;
  gridColor: string;
  frame: number;
  isFlatBlueprint?: boolean;
}> = ({ bgColor, gridColor, frame, isFlatBlueprint }) => {
  const drift = (frame * 0.22) % 48;
  const activeBg = isFlatBlueprint ? "#07101f" : bgColor;
  const minorGrid = isFlatBlueprint ? "rgba(56, 189, 248, 0.08)" : gridColor;
  const majorGrid = isFlatBlueprint
    ? "rgba(56, 189, 248, 0.16)"
    : "rgba(56, 189, 248, 0.05)";

  return (
    <AbsoluteFill
      style={{
        backgroundColor: activeBg,
        backgroundImage: `
          linear-gradient(to right, ${minorGrid} 1px, transparent 1px),
          linear-gradient(to bottom, ${minorGrid} 1px, transparent 1px),
          linear-gradient(to right, ${majorGrid} 1.5px, transparent 1.5px),
          linear-gradient(to bottom, ${majorGrid} 1.5px, transparent 1.5px)
        `,
        backgroundSize: "48px 48px, 48px 48px, 240px 240px, 240px 240px",
        backgroundPosition: `${drift}px ${drift}px`,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: isFlatBlueprint
            ? "radial-gradient(circle at 50% 45%, rgba(14, 165, 233, 0.12) 0%, rgba(4, 9, 20, 0.85) 88%)"
            : "radial-gradient(circle at 50% 42%, rgba(250, 204, 21, 0.06) 0%, rgba(10, 8, 6, 0.78) 85%)",
        }}
      />
    </AbsoluteFill>
  );
};

/* ============================================================================
2. PURE FLAT VECTOR ILLUSTRATIONS (6 BEAT TPS / LOGISTICS / INDUSTRIAL)
   ============================================================================ */
const FlatVectorStage: React.FC<{
  scene: SceneItem;
  sceneIndex: number;
  localFrame: number;
  speechDuration: number;
  fps: number;
}> = ({ scene, sceneIndex, localFrame, speechDuration, fps }) => {
  const amber = "#f59e0b";
  const amberBright = "#fbbf24";
  const cyan = "#38bdf8";
  const navyCard = "#0d1b33";
  const strokeMuted = "#1e3a5f";

  const mode =
    scene.vectorScene ||
    ([
      "hook-supply",
      "pull-clock",
      "timeline-144",
      "ekanban-scan",
      "balance-scale",
      "heartbeat-jit",
    ][sceneIndex % 6] as SceneItem["vectorScene"]);

  const pop = spring({
    frame: localFrame,
    fps,
    config: { damping: 14, stiffness: 130 },
  });

  // --- BEAT 1: HOOK (Truk kiri, Konveyor + Pabrik kanan, Tanda Tanya berdenyut) ---
  if (mode === "hook-supply") {
    const truckX = interpolate(localFrame, [0, 22], [-180, 0], {
      extrapolateRight: "clamp",
    });
    const convX = interpolate(localFrame, [0, 22], [180, 0], {
      extrapolateRight: "clamp",
    });
    const qPulse = 1 + Math.sin(localFrame * 0.14) * 0.06;
    const beltShift = (localFrame * 2) % 36;

    return (
      <svg width="960" height="720" viewBox="0 0 960 720">
        {/* Lantai */}
        <line
          x1="70"
          y1="520"
          x2="890"
          y2="520"
          stroke={cyan}
          strokeWidth="3"
          opacity="0.35"
        />

        {/* TRUK SUPPLIER (Kiri) */}
        <g transform={`translate(${90 + truckX}, 355)`}>
          <rect
            x="0"
            y="20"
            width="175"
            height="110"
            rx="12"
            fill={navyCard}
            stroke={cyan}
            strokeWidth="3.5"
          />
          <rect x="22" y="45" width="52" height="44" rx="6" fill={amber} />
          <rect
            x="84"
            y="45"
            width="52"
            height="44"
            rx="6"
            fill={amberBright}
            opacity="0.85"
          />
          {/* Kabin */}
          <path
            d="M 182 48 L 235 48 L 258 84 L 258 130 L 182 130 Z"
            fill={cyan}
          />
          <polygon points="194,58 228,58 242,82 194,82" fill="#07101f" />
          {/* Roda */}
          <circle
            cx="54"
            cy="138"
            r="24"
            fill="#07101f"
            stroke={amber}
            strokeWidth="6"
          />
          <circle
            cx="215"
            cy="138"
            r="24"
            fill="#07101f"
            stroke={amber}
            strokeWidth="6"
          />
          <text
            x="128"
            y="198"
            textAnchor="middle"
            fill={cyan}
            fontFamily="monospace"
            fontSize="22"
            fontWeight="800"
          >
            SUPPLIER
          </text>
        </g>

        {/* TANDA TANYA BESAR DI TENGAH */}
        <g transform={`translate(480, 320) scale(${pop * qPulse})`}>
          <circle
            r="96"
            fill="rgba(245, 158, 11, 0.12)"
            stroke={amber}
            strokeWidth="3"
            strokeDasharray="12 8"
          />
          <text
            x="0"
            y="44"
            textAnchor="middle"
            fill={amberBright}
            fontSize="138"
            fontWeight="900"
            fontFamily="Inter, sans-serif"
          >
            ?
          </text>
        </g>

        {/* ASSEMBLY LINE & PABRIK (Kanan) */}
        <g transform={`translate(${615 + convX}, 310)`}>
          {/* Gedung Pabrik */}
          <path
            d="M 75 95 L 75 35 L 125 65 L 125 35 L 175 65 L 175 35 L 235 65 L 235 165 L 75 165 Z"
            fill={navyCard}
            stroke={cyan}
            strokeWidth="3.5"
          />
          <rect x="105" y="95" width="32" height="32" rx="4" fill={amber} />
          <rect x="165" y="95" width="32" height="32" rx="4" fill={cyan} />
          {/* Konveyor */}
          <rect
            x="0"
            y="165"
            width="255"
            height="32"
            rx="16"
            fill="#102544"
            stroke={cyan}
            strokeWidth="3"
          />
          {[0, 1, 2, 3, 4, 5].map((r) => (
            <circle
              key={r}
              cx={26 + ((r * 42 + beltShift) % 210)}
              cy="181"
              r="7"
              fill={amber}
            />
          ))}
          {/* Part di atas konveyor */}
          <rect
            x={30 + ((localFrame * 1.4) % 90)}
            y="128"
            width="36"
            height="34"
            rx="6"
            fill={amberBright}
          />
          <text
            x="130"
            y="242"
            textAnchor="middle"
            fill={amberBright}
            fontFamily="monospace"
            fontSize="22"
            fontWeight="800"
          >
            ASSEMBLY LINE
          </text>
        </g>
      </svg>
    );
  }

  // --- BEAT 2: DEFINISI (Jam Amber + Kartu Kanban melengkung + Panah PULL) ---
  if (mode === "pull-clock") {
    const activeSeg = Math.floor((localFrame / 16) % 4);
    const cardT = (localFrame % 65) / 65;
    const cardX = interpolate(cardT, [0, 1], [720, 230]);
    const cardY = 470 - Math.sin(cardT * Math.PI) * 145;

    return (
      <svg width="960" height="720" viewBox="0 0 960 720">
        {/* JAM SIKLUS DI ATAS */}
        <g transform="translate(480, 195)">
          <circle r="112" fill={navyCard} stroke={cyan} strokeWidth="4" />
          {[0, 1, 2, 3].map((seg) => {
            const angle = seg * 90 - 90;
            const isLit = seg <= activeSeg;
            return (
              <g key={seg} transform={`rotate(${angle})`}>
                <path
                  d="M 12 -12 L 88 -12 A 90 90 0 0 1 12 88 Z"
                  fill={isLit ? amber : "rgba(56, 189, 248, 0.1)"}
                  opacity={isLit ? 0.9 : 0.45}
                />
              </g>
            );
          })}
          <circle r="12" fill="#ffffff" />
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="-72"
            stroke="#ffffff"
            strokeWidth="5"
            strokeLinecap="round"
            transform={`rotate(${localFrame * 3.5})`}
          />
        </g>

        {/* SUPPLIER (Kiri) */}
        <g transform="translate(95, 430)">
          <rect
            width="195"
            height="135"
            rx="16"
            fill={navyCard}
            stroke={cyan}
            strokeWidth="3.5"
          />
          <text
            x="97"
            y="62"
            textAnchor="middle"
            fill="#ffffff"
            fontSize="24"
            fontWeight="900"
          >
            SUPPLIER
          </text>
          <text
            x="97"
            y="95"
            textAnchor="middle"
            fill={cyan}
            fontFamily="monospace"
            fontSize="18"
          >
            KIRIM PART
          </text>
        </g>

        {/* ASSEMBLY / CUSTOMER (Kanan) */}
        <g transform="translate(670, 430)">
          <rect
            width="195"
            height="135"
            rx="16"
            fill={navyCard}
            stroke={amber}
            strokeWidth="3.5"
          />
          <text
            x="97"
            y="62"
            textAnchor="middle"
            fill="#ffffff"
            fontSize="24"
            fontWeight="900"
          >
            CUSTOMER
          </text>
          <text
            x="97"
            y="95"
            textAnchor="middle"
            fill={amberBright}
            fontFamily="monospace"
            fontSize="18"
          >
            TARIK ORDER
          </text>
        </g>

        {/* JALUR LENGKUNG KANBAN & PANAH PULL */}
        <path
          d="M 670 475 Q 480 315 290 475"
          fill="none"
          stroke={cyan}
          strokeWidth="3.5"
          strokeDasharray="12 10"
        />
        <text
          x="480"
          y="535"
          textAnchor="middle"
          fill={cyan}
          fontFamily="monospace"
          fontSize="24"
          fontWeight="900"
        >
          ◀── TARIK (PULL SYSTEM) ──
        </text>

        {/* KARTU KANBAN TERBANG */}
        <g transform={`translate(${cardX - 42}, ${cardY - 28})`}>
          <rect
            width="84"
            height="56"
            rx="8"
            fill={amberBright}
            stroke="#ffffff"
            strokeWidth="2.5"
          />
          <line
            x1="14"
            y1="20"
            x2="70"
            y2="20"
            stroke="#07101f"
            strokeWidth="4"
          />
          <line
            x1="14"
            y1="36"
            x2="52"
            y2="36"
            stroke="#07101f"
            strokeWidth="4"
          />
        </g>
      </svg>
    );
  }

  // --- BEAT 3: CONTOH 1 : 4 : 4 (4 Blok Timeline + 4 Kanban + 4 Truk) ---
  if (mode === "timeline-144") {
    const activeBlock = Math.min(
      3,
      Math.floor((localFrame / Math.max(1, speechDuration * 0.85)) * 4)
    );

    return (
      <svg width="960" height="720" viewBox="0 0 960 720">
        {/* GARIS TIMELINE UTAMA */}
        <line
          x1="100"
          y1="350"
          x2="860"
          y2="350"
          stroke={strokeMuted}
          strokeWidth="6"
        />

        {[0, 1, 2, 3].map((idx) => {
          const cx = 175 + idx * 203;
          const isLit = idx <= activeBlock;
          const truckDrive = isLit
            ? interpolate(localFrame - idx * 25, [0, 30], [0, 18], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })
            : 0;

          return (
            <g key={idx}>
              {/* Kartu Kanban di Atas */}
              <g
                transform={`translate(${cx - 38}, ${isLit ? 155 : 175})`}
                opacity={isLit ? 1 : 0.32}
              >
                <rect
                  width="76"
                  height="95"
                  rx="10"
                  fill={isLit ? amber : navyCard}
                  stroke={amberBright}
                  strokeWidth="2.5"
                />
                <text
                  x="38"
                  y="42"
                  textAnchor="middle"
                  fill={isLit ? "#07101f" : amberBright}
                  fontFamily="monospace"
                  fontSize="16"
                  fontWeight="900"
                >
                  KANBAN
                </text>
                <text
                  x="38"
                  y="74"
                  textAnchor="middle"
                  fill={isLit ? "#07101f" : "#ffffff"}
                  fontSize="26"
                  fontWeight="900"
                >
                  #{idx + 1}
                </text>
              </g>

              {/* Blok Shift Timeline */}
              <rect
                x={cx - 78}
                y="316"
                width="156"
                height="68"
                rx="14"
                fill={isLit ? "#0f294a" : navyCard}
                stroke={isLit ? cyan : strokeMuted}
                strokeWidth="3.5"
              />
              <text
                x={cx}
                y="358"
                textAnchor="middle"
                fill={isLit ? "#ffffff" : "#64748b"}
                fontFamily="monospace"
                fontSize="22"
                fontWeight="900"
              >
                ISSUE {idx + 1}
              </text>

              {/* Truk Kirim di Bawah */}
              <g
                transform={`translate(${cx - 52 + truckDrive}, 435)`}
                opacity={isLit ? 1 : 0.25}
              >
                <rect
                  x="0"
                  y="10"
                  width="68"
                  height="44"
                  rx="6"
                  fill={cyan}
                />
                <path
                  d="M 72 22 L 96 22 L 106 36 L 106 54 L 72 54 Z"
                  fill={amberBright}
                />
                <circle cx="22" cy="58" r="10" fill="#ffffff" />
                <circle cx="88" cy="58" r="10" fill="#ffffff" />
              </g>
            </g>
          );
        })}

        {/* BADGE RINGKASAN BAWAH */}
        {[
          { label: "1 HARI JEDA", x: 185, color: cyan },
          { label: "4X KIRIM / HARI", x: 480, color: amberBright },
          { label: "4X ISSUE KANBAN", x: 775, color: "#22c55e" },
        ].map((b, i) => (
          <g key={i} transform
