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
          <circle
            r="112"
            fill={navyCard}
            stroke={cyan}
            strokeWidth="4"
          />
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
          <line x1="14" y1="20" x2="70" y2="20" stroke="#07101f" strokeWidth="4" />
          <line x1="14" y1="36" x2="52" y2="36" stroke="#07101f" strokeWidth="4" />
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
            ? interpolate(
                localFrame - idx * 25,
                [0, 30],
                [0, 18],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
              )
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
          <g key={i} transform={`translate(${b.x - 125}, 565)`}>
            <rect
              width="250"
              height="54"
              rx="27"
              fill={navyCard}
              stroke={b.color}
              strokeWidth="2.5"
            />
            <text
              x="125"
              y="34"
              textAnchor="middle"
              fill={b.color}
              fontFamily="monospace"
              fontSize="19"
              fontWeight="900"
            >
              {b.label}
            </text>
          </g>
        ))}
      </svg>
    );
  }

  // --- BEAT 4: EKANBAN 1 : 6 : X (Scanner + Sinyal Digital + Angka X + 6 Truk) ---
  if (mode === "ekanban-scan") {
    const scanY = 230 + Math.sin(localFrame * 0.22) * 38;
    const xValues = ["X", "5", "6", "7", "6"];
    const dynamicX = xValues[Math.floor((localFrame / 14) % xValues.length)];
    const litTrucks = Math.min(6, Math.floor((localFrame / 18) % 7) + 1);

    return (
      <svg width="960" height="720" viewBox="0 0 960 720">
        {/* TABLET & SCANNER DI LINE (Kiri) */}
        <g transform="translate(105, 165)">
          <rect
            width="210"
            height="230"
            rx="20"
            fill={navyCard}
            stroke={cyan}
            strokeWidth="4"
          />
          <text
            x="105"
            y="45"
            textAnchor="middle"
            fill={cyan}
            fontFamily="monospace"
            fontSize="20"
            fontWeight="900"
          >
            E-KANBAN SCAN
          </text>
          {/* Barcode Lines */}
          {[36, 54, 68, 90, 104, 126, 148, 164].map((bx, idx) => (
            <rect
              key={idx}
              x={bx}
              y="72"
              width={idx % 2 === 0 ? 8 : 4}
              height="95"
              fill="#ffffff"
              opacity="0.85"
            />
          ))}
          {/* Laser Beam */}
          <line
            x1="20"
            y1={scanY - 120}
            x2="190"
            y2={scanY - 120}
            stroke={amberBright}
            strokeWidth="5"
          />
        </g>

        {/* SINYAL DIGITAL & VARIABEL X */}
        <line
          x1="325"
          y1="280"
          x2="635"
          y2="280"
          stroke={cyan}
          strokeWidth="4"
          strokeDasharray="14 12"
          strokeDashoffset={-localFrame * 3}
        />
        <g transform="translate(480, 200)">
          <rect
            x="-76"
            y="-44"
            width="152"
            height="88"
            rx="16"
            fill={navyCard}
            stroke={amber}
            strokeWidth="3.5"
          />
          <text
            x="0"
            y="14"
            textAnchor="middle"
            fill={amberBright}
            fontFamily="monospace"
            fontSize="44"
            fontWeight="900"
          >
            x = {dynamicX}
          </text>
        </g>

        {/* SERVER / SUPPLIER (Kanan) */}
        <g transform="translate(645, 165)">
          <rect
            width="210"
            height="230"
            rx="20"
            fill={navyCard}
            stroke={amber}
            strokeWidth="4"
          />
          <text
            x="105"
            y="50"
            textAnchor="middle"
            fill={amberBright}
            fontFamily="monospace"
            fontSize="20"
            fontWeight="900"
          >
            SUPPLIER EDI
          </text>
          <rect x="42" y="78" width="126" height="32" rx="6" fill="#132b4f" />
          <circle cx="62" cy="94" r="6" fill="#22c55e" />
          <rect x="42" y="124" width="126" height="32" rx="6" fill="#132b4f" />
          <circle cx="62" cy="140" r="6" fill={cyan} />
          <rect x="42" y="170" width="126" height="32" rx="6" fill="#132b4f" />
          <circle cx="62" cy="186" r="6" fill={amber} />
        </g>

        {/* 6 TRUK PENGIRIMAN DI BAWAH */}
        <text
          x="480"
          y="465"
          textAnchor="middle"
          fill="#cbd5e1"
          fontFamily="monospace"
          fontSize="22"
          fontWeight="800"
        >
          6X PENGIRIMAN TERJADWAL PER HARI
        </text>
        {[0, 1, 2, 3, 4, 5].map((tIdx) => {
          const tx = 110 + tIdx * 128;
          const isOn = tIdx < litTrucks;
          return (
            <g
              key={tIdx}
              transform={`translate(${tx}, 495)`}
              opacity={isOn ? 1 : 0.25}
            >
              <rect
                width="102"
                height="68"
                rx="12"
                fill={isOn ? "#0f294a" : navyCard}
                stroke={isOn ? cyan : strokeMuted}
                strokeWidth="3"
              />
              <text
                x="51"
                y="43"
                textAnchor="middle"
                fill={isOn ? amberBright : "#64748b"}
                fontFamily="monospace"
                fontSize="24"
                fontWeight="900"
              >
                T-{tIdx + 1}
              </text>
            </g>
          );
        })}
      </svg>
    );
  }

  // --- BEAT 5: PERBANDINGAN (Timbangan Neraca Stok vs Biaya Truk) ---
  if (mode === "balance-scale") {
    const tilt = Math.sin(localFrame * 0.09) * 9;
    const stockPct = Math.round(
      interpolate(localFrame, [0, 50], [82, 28], { extrapolateRight: "clamp" })
    );
    const truckPct = Math.round(
      interpolate(localFrame, [0, 50], [32, 85], { extrapolateRight: "clamp" })
    );

    return (
      <svg width="960" height="720" viewBox="0 0 960 720">
        {/* TIANG TIMBANGAN */}
        <polygon points="480,155 445,455 515,455" fill={navyCard} stroke={cyan} strokeWidth="3.5" />
        <rect x="370" y="455" width="220" height="22" rx="11" fill={cyan} />

        {/* LENGAN NERACA BERAYUN */}
        <g transform={`translate(480, 195) rotate(${tilt})`}>
          <line
            x1="-275"
            y1="0"
            x2="275"
            y2="0"
            stroke="#ffffff"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <circle r="16" fill={amberBright} />

          {/* Piringan Kiri (STOK KECIL) */}
          <g transform="translate(-275, 0)">
            <line x1="0" y1="0" x2="0" y2="95" stroke={cyan} strokeWidth="3" />
            <rect
              x="-85"
              y="95"
              width="170"
              height="16"
              rx="8"
              fill={cyan}
            />
            <rect
              x="-42"
              y="48"
              width="84"
              height="44"
              rx="8"
              fill={amber}
            />
            <text
              x="0"
              y="145"
              textAnchor="middle"
              fill={cyan}
              fontFamily="monospace"
              fontSize="22"
              fontWeight="900"
            >
              STOK LINE
            </text>
          </g>

          {/* Piringan Kanan (BEBAN LOGISTIK / TRUK) */}
          <g transform="translate(275, 0)">
            <line x1="0" y1="0" x2="0" y2="95" stroke={amber} strokeWidth="3" />
            <rect
              x="-85"
              y="95"
              width="170"
              height="16"
              rx="8"
              fill={amber}
            />
            <rect x="-65" y="55" width="56" height="36" rx="6" fill={cyan} />
            <rect x="8" y="55" width="56" height="36" rx="6" fill={cyan} />
            <rect x="-28" y="14" width="56" height="36" rx="6" fill={amberBright} />
            <text
              x="0"
              y="145"
              textAnchor="middle"
              fill={amberBright}
              fontFamily="monospace"
              fontSize="22"
              fontWeight="900"
            >
              BEBAN TRUK
            </text>
          </g>
        </g>

        {/* DUA BAR INDIKATOR DI BAWAH */}
        <g transform="translate(150, 525)">
          <text x="0" y="0" fill={cyan} fontFamily="monospace" fontSize="21" fontWeight="900">
            STOK DI LINE ({stockPct}%)
          </text>
          <rect x="0" y="14" width="660" height="22" rx="11" fill={navyCard} stroke={strokeMuted} strokeWidth="2" />
          <rect x="0" y="14" width={6.6 * stockPct} height="22" rx="11" fill={cyan} />

          <text x="0" y="75" fill={amberBright} fontFamily="monospace" fontSize="21" fontWeight="900">
            FREKUENSI & BIAYA KIRIM ({truckPct}%)
          </text>
          <rect x="0" y="89" width="660" height="22" rx="11" fill={navyCard} stroke={strokeMuted} strokeWidth="2" />
          <rect x="0" y="89" width={6.6 * truckPct} height="22" rx="11" fill={amber} />
        </g>
      </svg>
    );
  }

  // --- BEAT 6: PENUTUP (Detak Jantung EKG + Truk Tiba di Gerbang Pabrik) ---
  const drawLen = interpolate(localFrame, [0, 42], [900, 0], {
    extrapolateRight: "clamp",
  });
  const beatScale = 1 + Math.abs(Math.sin(localFrame * 0.16)) * 0.14;
  const truckArriveX = interpolate(localFrame, [10, 48], [140, 460], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <svg width="960" height="720" viewBox="0 0 960 720">
      {/* IKON HATI BERDETAK */}
      <g transform={`translate(480, 175) scale(${beatScale})`}>
        <path
          d="M 0 36 C -55 -5 -85 -48 -42 -76 C -16 -92 0 -68 0 -55 C 0 -68 16 -92 42 -76 C 85 -48 55 -5 0 36 Z"
          fill={amber}
        />
      </g>

      {/* GARIS DETAK JANTUNG EKG */}
      <path
        d="M 90 325 L 320 325 L 355 245 L 395 405 L 435 215 L 475 385 L 510 295 L 540 325 L 870 325"
        fill="none"
        stroke={amberBright}
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="900"
        strokeDashoffset={drawLen}
      />

      {/* LANTAI & GERBANG PABRIK (Kanan) */}
      <line x1="90" y1="560" x2="870" y2="560" stroke={cyan} strokeWidth="3.5" opacity="0.45" />
      <g transform="translate(650, 405)">
        <rect
          width="195"
          height="155"
          rx="14"
          fill={navyCard}
          stroke={cyan}
          strokeWidth="4"
        />
        <text
          x="97"
          y="46"
          textAnchor="middle"
          fill="#22c55e"
          fontFamily="monospace"
          fontSize="20"
          fontWeight="900"
        >
          JUST IN TIME
        </text>
        {/* Pintu Gerbang Terbuka */}
        <rect x="38" y="68" width="118" height="87" rx="8" fill="#07101f" stroke="#22c55e" strokeWidth="3" />
        <text
          x="97"
          y="120"
          textAnchor="middle"
          fill="#ffffff"
          fontFamily="monospace"
          fontSize="22"
          fontWeight="900"
        >
          ON TIME
        </text>
      </g>

      {/* TRUK MASUK TEPAT WAKTU */}
      <g transform={`translate(${truckArriveX}, 470)`}>
        <rect width="115" height="68" rx="10" fill={cyan} />
        <path d="M 120 18 L 154 18 L 168 42 L 168 68 L 120 68 Z" fill={amberBright} />
        <circle cx="34" cy="76" r="14" fill="#07101f" stroke={amber} strokeWidth="5" />
        <circle cx="144" cy="76" r="14" fill="#07101f" stroke={amber} strokeWidth="5" />
      </g>
    </svg>
  );
};

/* ============================================================================
   3. KOMPONEN FALLBACK CAD VECTOR (UNTUK MODE KLASIK)
   ============================================================================ */
const CadVectorSchematic: React.FC<{
  type?: string;
  cyan: string;
  orange: string;
  gold: string;
  localFrame: number;
  compact?: boolean;
}> = ({ type = "gear", cyan, orange, gold, localFrame, compact = false }) => {
  const rotate = localFrame * 0.6;
  const pulse = 1 + Math.sin(localFrame * 0.12) * 0.04;
  const drawProgress = interpolate(localFrame, [0, 24], [0, 1], {
    extrapolateRight: "clamp",
  });
  const scaleFactor = compact ? 0.68 : 1;

  return (
    <svg
      width={compact ? "340" : "460"}
      height={compact ? "210" : "320"}
      viewBox="0 0 460 320"
      style={{ overflow: "visible", transform: `scale(${scaleFactor})` }}
    >
      <path
        d="M 24 60 L 24 24 L 60 24 M 400 24 L 436 24 L 436 60 M 436 260 L 436 296 L 400 296 M 60 296 L 24 296 L 24 260"
        fill="none"
        stroke={cyan}
        strokeWidth="2.5"
        opacity="0.7"
      />
      <line
        x1="230"
        y1="15"
        x2="230"
        y2="305"
        stroke="rgba(255,255,255,0.12)"
        strokeDasharray="6 6"
      />
      <line
        x1="20"
        y1="160"
        x2="440"
        y2="160"
        stroke="rgba(255,255,255,0.12)"
        strokeDasharray="6 6"
      />

      <g transform={`translate(230, 160) scale(${pulse})`}>
        <circle
          r="96"
          fill="rgba(56, 189, 248, 0.06)"
          stroke={cyan}
          strokeWidth="2.5"
          strokeDasharray="14 8"
          transform={`rotate(${rotate})`}
        />
        <circle
          r="66"
          fill="rgba(249, 115, 22, 0.12)"
          stroke={orange}
          strokeWidth="3.5"
          transform={`rotate(${-rotate * 1.4})`}
        />
        <circle r="30" fill="#14110e" stroke={gold} strokeWidth="3" />
        {type === "flow" || type === "chart" ? (
          <path
            d="M -140 0 L -66 0 M 66 0 L 140 0 M 0 -115 L 0 -66"
            stroke={cyan}
            strokeWidth="4"
            strokeLinecap="round"
            opacity={drawProgress}
          />
        ) : null}
      </g>
    </svg>
  );
};

/* ============================================================================
   4. KOMPOSISI UTAMA DYNAMIC MOTION VIDEO
   ============================================================================ */
export const DynamicMotionVideo: React.FC<DynamicMotionProps> = ({
  visualStyle,
  styleConfig,
  scenes = [],
  audioSrc,
  bgmSrc,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const isFlatBlueprint =
    visualStyle === "flat-blueprint" ||
    scenes.some((s) => Boolean(s.vectorScene));

  const bgColor = styleConfig?.bgColor || "#14110e";
  const gridColor = styleConfig?.gridColor || "#26201a";
  const cyan = styleConfig?.accentColor || "#38bdf8";
  const gold = styleConfig?.goldColor || "#facc15";
  const danger = styleConfig?.dangerColor || "#f97316";
  const success = styleConfig?.successColor || "#22c55e";
  const watermark = styleConfig?.watermark || "orionmotion";

  const safeScenes = scenes.length > 0 ? scenes : [];

  const getSpeechWeight = (text: string) => {
    const clean = text.trim();
    const wordWeight = clean.split(/\s+/).filter(Boolean).length * 1.0;
    const sentencePauses = (clean.match(/[.!?]+/g) || []).length * 1.65;
    const commaPauses = (clean.match(/[,;:]+/g) || []).length * 0.75;
    return Math.max(4, wordWeight + sentencePauses + commaPauses);
  };

  const activeSpeechFrames = Math.round(durationInFrames * 0.945);
  const totalWeight = safeScenes.reduce(
    (acc, s) => acc + getSpeechWeight(s.body),
    0
  );

  let accumulatedFrames = 0;
  const sceneTimings = safeScenes.map((sc, idx) => {
    const weight = getSpeechWeight(sc.body);
    const ratio = totalWeight > 0 ? weight / totalWeight : 1 / safeScenes.length;
    const isLast = idx === safeScenes.length - 1;
    const speechLen = isLast
      ? Math.max(30, activeSpeechFrames - accumulatedFrames)
      : Math.max(45, Math.round(ratio * activeSpeechFrames));
    const totalLen = isLast ? durationInFrames - accumulatedFrames : speechLen;
    const start = accumulatedFrames;
    accumulatedFrames += totalLen;
    return { start, duration: totalLen, speechDuration: speechLen };
  });

  const activeIndex = Math.max(
    0,
    sceneTimings.findIndex((t, i) =>
      i === sceneTimings.length - 1
        ? frame >= t.start
        : frame >= t.start && frame < t.start + t.duration
    )
  );

  const scene = safeScenes[activeIndex];
  const timing = sceneTimings[activeIndex] || {
    start: 0,
    duration: durationInFrames,
    speechDuration: activeSpeechFrames,
  };
  const localFrame = Math.max(0, frame - timing.start);

  if (!scene) return <AbsoluteFill style={{ backgroundColor: bgColor }} />;

  const enterSpring = spring({
    frame: localFrame,
    fps,
    config: { damping: 16, stiffness: 120 },
  });

  const baseZoom = interpolate(
    activeIndex,
    [0, Math.max(1, safeScenes.length - 1)],
    [1.0, 1.14]
  );
  const sceneMicroZoom = interpolate(
    localFrame,
    [0, timing.duration],
    [baseZoom, baseZoom + 0.06],
    {
      extrapolateRight: "clamp",
    }
  );

  const toneColor = (tone?: string) => {
    if (tone === "danger") return danger;
    if (tone === "success") return success;
    if (tone === "gold") return gold;
    return cyan;
  };

  // Sinkronisasi Karaoke
  const words = scene.body.split(/\s+/).filter(Boolean);
  const wordWeights = words.map((w) => {
    let wt = 1 + Math.min(0.6, w.length * 0.04);
    if (/[.!?]$/.test(w)) wt += 1.5;
    else if (/[,;:]$/.test(w)) wt += 0.7;
    return wt;
  });
  const totalWordWeight = wordWeights.reduce((a, b) => a + b, 0);
  const speechProgress = Math.min(
    1,
    localFrame / Math.max(1, timing.speechDuration)
  );
  const targetWeight = speechProgress * totalWordWeight;

  let accW = 0;
  let currentWordIndex = words.length - 1;
  for (let i = 0; i < wordWeights.length; i++) {
    accW += wordWeights[i];
    if (targetWeight <= accW) {
      currentWordIndex = i;
      break;
    }
  }

  const chunkStart = Math.floor(currentWordIndex / 7) * 7;
  const visibleWords = words.slice(chunkStart, chunkStart + 7);

  /* ==========================================================================
     MODE A: PURE FLAT VECTOR BLUEPRINT (Persis gaya 2026-11-21-075229311.mp4)
     ========================================================================== */
  if (isFlatBlueprint) {
    const cleanBeatLabel = (scene.tag || `BEAT 0${activeIndex + 1}`)
      .replace(/•\s*×\d+\s*ZOOM/i, "")
      .trim();

    return (
      <AbsoluteFill
        style={{ fontFamily: "Inter, system-ui, sans-serif", color: "#f8fafc" }}
      >
        <CadBlueprintBackground
          bgColor="#07101f"
          gridColor={gridColor}
          frame={frame}
          isFlatBlueprint
        />

        {audioSrc ? <Audio src={resolveMediaSrc(audioSrc)} /> : null}
        {bgmSrc ? <Audio src={resolveMediaSrc(bgmSrc)} volume={0.14} /> : null}

        {/* HEADER KIRI ATAS (Badge Beat) & KANAN ATAS (Dots Indikator) */}
        <div
          style={{
            position: "absolute",
            top: 64,
            left: 56,
            right: 56,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            zIndex: 20,
          }}
        >
          <div
            style={{
              backgroundColor: "rgba(13, 27, 51, 0.9)",
              border: "1.5px solid rgba(56, 189, 248, 0.45)",
              borderRadius: 999,
              padding: "10px 24px",
              fontFamily: "monospace",
              fontSize: 22,
              fontWeight: 900,
              color: "#38bdf8",
              letterSpacing: 1.5,
            }}
          >
            {cleanBeatLabel}
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            {safeScenes.map((_, dotIdx) => (
              <div
                key={dotIdx}
                style={{
                  width: dotIdx === activeIndex ? 30 : 12,
                  height: 12,
                  borderRadius: 999,
                  backgroundColor:
                    dotIdx === activeIndex
                      ? "#f59e0b"
                      : dotIdx < activeIndex
                      ? "#38bdf8"
                      : "rgba(255,255,255,0.22)",
                }}
              />
            ))}
          </div>
        </div>

        {/* KINETIC TITLE ATAS (Putih + Amber) */}
        <div
          style={{
            position: "absolute",
            top: 175,
            left: 56,
            right: 56,
            textAlign: "center",
            transform: `translateY(${interpolate(enterSpring, [0, 1], [24, 0])}px)`,
            opacity: enterSpring,
            zIndex: 15,
          }}
        >
          <div
            style={{
              fontSize: 58,
              fontWeight: 900,
              lineHeight: 1.14,
              color: "#ffffff",
              textTransform: "uppercase",
              letterSpacing: -0.5,
            }}
          >
            {scene.heading}
          </div>
          {scene.subHeading || scene.heroLabel ? (
            <div
              style={{
                marginTop: 10,
                fontSize: 44,
                fontWeight: 900,
                lineHeight: 1.15,
                color: "#fbbf24",
                textTransform: "uppercase",
              }}
            >
              {scene.subHeading || scene.heroLabel}
            </div>
          ) : null}
        </div>

        {/* STAGE VECTOR SVG UTAMA TENGAH */}
        <div
          style={{
            position: "absolute",
            top: 390,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            transform: `scale(${interpolate(enterSpring, [0, 1], [0.94, 1])})`,
            opacity: enterSpring,
          }}
        >
          <FlatVectorStage
            scene={scene}
            sceneIndex={activeIndex}
            localFrame={localFrame}
            speechDuration={timing.speechDuration}
            fps={fps}
          />
        </div>

        {/* SUBTITLE KARAOKE BAWAH BERSIH */}
        <div
          style={{
            position: "absolute",
            bottom: 92,
            left: 56,
            right: 56,
            backgroundColor: "rgba(7, 16, 31, 0.88)",
            border: "1.5px solid rgba(56, 189, 248, 0.35)",
            borderRadius: 24,
            padding: "24px 32px",
            textAlign: "center",
            boxShadow: "0 18px 45px rgba(0,0,0,0.65)",
          }}
        >
          <div
            style={{
              fontSize: 38,
              fontWeight: 900,
              lineHeight: 1.38,
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              columnGap: 14,
              rowGap: 6,
            }}
          >
            {visibleWords.map((word, wIdx) => {
              const globalWordIdx = chunkStart + wIdx;
              const isActive = globalWordIdx === currentWordIndex;
              const isSpoken = globalWordIdx < currentWordIndex;
              return (
                <span
                  key={globalWordIdx}
                  style={{
                    color: isActive
                      ? "#fbbf24"
                      : isSpoken
                      ? "#ffffff"
                      : "rgba(255,255,255,0.5)",
                    transform: isActive ? "scale(1.06)" : "scale(1)",
                  }}
                >
                  {word}
                </span>
              );
            })}
          </div>
        </div>
      </AbsoluteFill>
    );
  }

  /* ==========================================================================
     MODE B: KLASIK CAD PHOTO + WHITE CARD (Tetap tersedia jika tanpa flat-blueprint)
     ========================================================================== */
  const zoomBadge =
    scene.tag?.match(/×\d+\s*ZOOM/i)?.[0]?.toUpperCase() ||
    ZOOM_STEPS[Math.min(activeIndex, ZOOM_STEPS.length - 1)];

  const breadcrumbText = (scene.tag || `BAB 0${activeIndex + 1}`)
    .replace(/•\s*×\d+\s*ZOOM/i, "")
    .trim();

  const isCompare = scene.overlayType === "compare";

  return (
    <AbsoluteFill
      style={{ fontFamily: "Inter, system-ui, sans-serif", color: "#f8fafc" }}
    >
      <CadBlueprintBackground
        bgColor={bgColor}
        gridColor={gridColor}
        frame={frame}
      />

      {audioSrc ? <Audio src={resolveMediaSrc(audioSrc)} /> : null}
      {bgmSrc ? <Audio src={resolveMediaSrc(bgmSrc)} volume={0.14} /> : null}

      {/* HUD KIRI ATAS */}
      <div
        style={{
          position: "absolute",
          top: 56,
          left: 48,
          right: 48,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          zIndex: 20,
        }}
      >
        <div
          style={{
            borderLeft: `4px solid ${cyan}`,
            paddingLeft: 16,
            background: "rgba(20, 17, 14, 0.75)",
            paddingTop: 6,
            paddingBottom: 6,
            paddingRight: 16,
            borderRadius: "0 10px 10px 0",
          }}
        >
          <div
            style={{
              fontFamily: "monospace",
              fontSize: 20,
              letterSpacing: 1.5,
              color: "#cbd5e1",
              fontWeight: 700,
            }}
          >
            {breadcrumbText}
          </div>
          <div
            style={{
              fontFamily: "monospace",
              fontSize: 34,
              fontWeight: 900,
              color: cyan,
              marginTop: 2,
              letterSpacing: 1,
            }}
          >
            {zoomBadge}
          </div>
        </div>

        <div
          style={{
            fontFamily: "monospace",
            fontSize: 18,
            color: "rgba(248,250,252,0.5)",
            background: "rgba(255,255,255,0.06)",
            padding: "8px 14px",
            borderRadius: 8,
            border: "1px solid rgba(255,255,255,0.12)",
          }}
        >
          @{watermark}
        </div>
      </div>

      {/* KONTEN UTAMA TENGAH */}
      <div
        style={{
          position: "absolute",
          top: 195,
          left: 48,
          right: 48,
          bottom: 290,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          transform: `translateY(${interpolate(enterSpring, [0, 1], [28, 0])}px)`,
          opacity: enterSpring,
        }}
      >
        <div>
          <div
            style={{
              display: "inline-block",
              fontFamily: "monospace",
              fontSize: 22,
              fontWeight: 800,
              color: toneColor(scene.headingTone),
              letterSpacing: 2,
              marginBottom: 8,
            }}
          >
            {scene.heroStat
              ? `[ ${scene.heroStat} • ${scene.heroLabel || ""} ]`
              : "INSPEKSI TEKNIS"}
          </div>
          <h1
            style={{
              margin: 0,
              fontSize: 54,
              lineHeight: 1.12,
              fontWeight: 900,
              color: "#ffffff",
              textTransform: "uppercase",
              letterSpacing: -0.5,
            }}
          >
            {scene.heading}
          </h1>
        </div>

        <div
          style={{
            position: "relative",
            height: isCompare ? 235 : 430,
            borderRadius: 22,
            overflow: "hidden",
            border: `2px solid rgba(56, 189, 248, 0.45)`,
            backgroundColor: "#0d0b09",
            boxShadow: "0 24px 60px rgba(0,0,0,0.65)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {scene.media && !isCompare ? (
            <>
              <Img
                src={resolveMediaSrc(scene.media)}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transform: `scale(${sceneMicroZoom})`,
                  filter: "contrast(1.08) brightness(0.86)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(180deg, rgba(20,17,14,0.2) 0%, rgba(20,17,14,0.72) 100%)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: 18,
                  left: 18,
                  background: "rgba(14, 18, 26, 0.85)",
                  border: `1.5px solid ${cyan}`,
                  color: cyan,
                  fontFamily: "monospace",
                  fontSize: 18,
                  fontWeight: 800,
                  padding: "6px 14px",
                  borderRadius: 8,
                }}
              >
                ● CAD VIEW // {scene.heroStat || "ACTIVE"}
              </div>
            </>
          ) : (
            <CadVectorSchematic
              type={scene.visualType}
              cyan={cyan}
              orange={danger}
              gold={gold}
              localFrame={localFrame}
              compact={isCompare}
            />
          )}
        </div>

        {isCompare && scene.compareLeft && scene.compareRight ? (
          <div
            style={{
              backgroundColor: "#ffffff",
              color: "#0f172a",
              borderRadius: 26,
              padding: 28,
              boxShadow: "0 25px 60px rgba(0,0,0,0.65)",
              border: `3px solid ${cyan}`,
            }}
          >
            <div
              style={{
                fontFamily: "monospace",
                fontSize: 19,
                fontWeight: 800,
                color: "#475569",
                marginBottom: 14,
                letterSpacing: 1,
              }}
            >
              DIAGRAM PERBANDINGAN KOMPONEN
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              {[scene.compareLeft, scene.compareRight].map((col, cIdx) => {
                const colColor = toneColor(col.tone);
                const colDelay = cIdx * 18;
                const colOpacity = interpolate(
                  localFrame,
                  [colDelay, colDelay + 15],
                  [0.25, 1],
                  {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  }
                );
                return (
                  <div
                    key={cIdx}
                    style={{
                      backgroundColor: "#f8fafc",
                      borderRadius: 18,
                      padding: 20,
                      borderTop: `8px solid ${colColor}`,
                      borderLeft: "1px solid #e2e8f0",
                      borderRight: "1px solid #e2e8f0",
                      borderBottom: "1px solid #e2e8f0",
                      opacity: colOpacity,
                    }}
                  >
                    {col.badge ? (
                      <span
                        style={{
                          display: "inline-block",
                          backgroundColor: colColor,
                          color: "#ffffff",
                          fontFamily: "monospace",
                          fontSize: 16,
                          fontWeight: 900,
                          padding: "4px 12px",
                          borderRadius: 6,
                          marginBottom: 8,
                        }}
                      >
                        {col.badge}
                      </span>
                    ) : null}
                    <div
                      style={{
                        fontSize: 26,
                        fontWeight: 900,
                        color: "#0f172a",
                        marginBottom: 12,
                      }}
                    >
                      {col.title}
                    </div>
                    {col.items.map((item, iIdx) => (
                      <div
                        key={iIdx}
                        style={{
                          fontSize: 21,
                          lineHeight: 1.32,
                          color: "#334155",
                          fontWeight: 600,
                          marginBottom: 8,
                          paddingLeft: 12,
                          borderLeft: `3px solid ${colColor}`,
                        }}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        ) : scene.overlayType === "bars" && scene.points ? (
          <div
            style={{
              backgroundColor: "#ffffff",
              color: "#0f172a",
              borderRadius: 24,
              padding: 30,
              boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
            }}
          >
            {scene.points.map((pt, idx) => {
              const barColor = toneColor(pt.tone);
              const targetVal = pt.value ?? 75;
              const animatedWidth = interpolate(
                localFrame,
                [idx * 14, idx * 14 + 24],
                [0, targetVal],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
              );
              return (
                <div
                  key={idx}
                  style={{
                    marginBottom: idx === scene.points!.length - 1 ? 0 : 20,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 24,
                      fontWeight: 800,
                      marginBottom: 8,
                    }}
                  >
                    <span>{pt.text}</span>
                    <span style={{ fontFamily: "monospace", color: barColor }}>
                      {Math.round(animatedWidth)}%
                    </span>
                  </div>
                  <div
                    style={{
                      height: 22,
                      backgroundColor: "#e2e8f0",
                      borderRadius: 999,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${animatedWidth}%`,
                        height: "100%",
                        backgroundColor: barColor,
                        borderRadius: 999,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : scene.points ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {scene.points.map((pt, idx) => {
              const pColor = toneColor(pt.tone);
              const stepSpan =
                timing.speechDuration / Math.max(1, scene.points!.length);
              const isSpotlight =
                localFrame >= idx * stepSpan &&
                localFrame < (idx + 1) * stepSpan + 10;

              return (
                <div
                  key={idx}
                  style={{
                    backgroundColor: isSpotlight
                      ? "#ffffff"
                      : "rgba(255, 255, 255, 0.12)",
                    color: isSpotlight ? "#0f172a" : "#cbd5e1",
                    borderRadius: 18,
                    padding: "20px 26px",
                    borderLeft: `10px solid ${pColor}`,
                    display: "flex",
                    alignItems: "center",
                    gap: 18,
                    transform: isSpotlight ? "scale(1.02)" : "scale(0.99)",
                    boxShadow: isSpotlight
                      ? "0 14px 34px rgba(0,0,0,0.45)"
                      : "none",
                  }}
                >
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: "50%",
                      backgroundColor: pColor,
                      color: "#ffffff",
                      fontFamily: "monospace",
                      fontWeight: 900,
                      fontSize: 20,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {scene.overlayType === "checklist" ? "✓" : idx + 1}
                  </div>
                  <div style={{ fontSize: 26, fontWeight: 800, lineHeight: 1.3 }}>
                    {pt.text}
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>

      {/* SUBTITLE KARAOKE BAWAH */}
      <div
        style={{
          position: "absolute",
          bottom: 84,
          left: 48,
          right: 48,
          backgroundColor: "rgba(12, 10, 8, 0.88)",
          border: "1px solid rgba(56, 189, 248, 0.28)",
          borderRadius: 22,
          padding: "24px 30px",
          textAlign: "center",
          boxShadow: "0 16px 40px rgba(0,0,0,0.7)",
        }}
      >
        <div
          style={{
            fontSize: 38,
            fontWeight: 900,
            lineHeight: 1.38,
            letterSpacing: 0.2,
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            columnGap: 14,
            rowGap: 6,
          }}
        >
          {visibleWords.map((word, wIdx) => {
            const globalWordIdx = chunkStart + wIdx;
            const isActive = globalWordIdx === currentWordIndex;
            const isSpoken = globalWordIdx < currentWordIndex;
            return (
              <span
                key={globalWordIdx}
                style={{
                  color: isActive
                    ? cyan
                    : isSpoken
                    ? "#ffffff"
                    : "rgba(255,255,255,0.52)",
                  textShadow: isActive
                    ? "0 0 18px rgba(56, 189, 248, 0.75)"
                    : "none",
                  transform: isActive ? "scale(1.06)" : "scale(1)",
                }}
              >
                {word}
              </span>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
