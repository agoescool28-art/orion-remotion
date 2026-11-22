
import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";

import { project } from "./project";
import { prabowoWords } from "./audio/prabowo.words";
import { AudioSyncedTypography } from "./audio/AudioSyncedTypography";

const FPS = 30;
const START_SECONDS = 21.5;
const START_FRAME = Math.round(START_SECONDS * FPS);

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const fade = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, start + 12, end - 12, end], [0, 1, 1, 0], clamp);

// Siluet taruna dengan anatomi dan posisi yang terlihat di kanvas.
const Cadet: React.FC<{
  x: number;
  y: number;
  scale?: number;
  delay?: number;
  color?: string;
}> = ({ x, y, scale = 1, delay = 0, color = "#263B34" }) => {
  const frame = useCurrentFrame();
  const local = Math.max(0, frame - delay);
  const walk = Math.sin(local / 4) * 9;
  const enter = interpolate(frame - delay, [0, 18], [70, 0], clamp);
  const opacity = interpolate(frame - delay, [0, 12], [0, 1], clamp);

  return (
    <g
      transform={`translate(${x + walk} ${y + enter}) scale(${scale})`}
      opacity={opacity}
    >
      <ellipse cx="0" cy="0" rx="42" ry="9" fill="#080F0D" opacity=".4" />

      {/* Legs */}
      <path
        d="M-14 -100 L-18 -12 L-35 0 L-7 0 L8 -76 L20 -12 L35 0 L7 0 L4 -100"
        fill="#172822"
      />

      {/* Body */}
      <path
        d="M-22 -175 L22 -175 L31 -105 L-30 -105Z"
        fill={color}
        stroke="#A99B76"
        strokeWidth="2"
      />

      {/* Arms */}
      <path
        d="M-19 -163 L-43 -115 L-32 -108 L-9 -146"
        stroke="#B68E6B"
        strokeWidth="12"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M19 -163 L42 -125 L32 -117 L8 -147"
        stroke="#B68E6B"
        strokeWidth="12"
        strokeLinecap="round"
        fill="none"
      />

      {/* Head and cap */}
      <circle cx="0" cy="-195" r="17" fill="#B68E6B" />
      <path d="M-20 -202 L20 -202 L13 -218 L-13 -218Z" fill="#263B34" />
      <path d="M-23 -202 L23 -202" stroke="#D5C18D" strokeWidth="4" />
    </g>
  );
};

// ADEGAN 1: latihan dan barisan taruna.
const TrainingScene: React.FC = () => {
  const frame = useCurrentFrame();
  const camera = interpolate(frame, [0, 100], [0, -85], clamp);

  return (
    <g transform={`translate(${camera} 0)`}>
      {/* Lapangan perspektif */}
      <path d="M0 1080 L1080 1080 L1080 1920 L0 1920Z" fill="#263B35" />
      <path d="M540 1080 L0 1920 M540 1080 L1080 1920" stroke="#A89B77" strokeWidth="3" opacity=".25" />
      <path d="M0 1450 H1080 M0 1650 H1080" stroke="#C6B995" strokeWidth="3" opacity=".18" />

      {/* Gedung menjadi latar, bukan fokus utama */}
      <path d="M120 760 L540 480 L960 760Z" fill="#6C7568" />
      <rect x="175" y="760" width="730" height="310" fill="#AFA78D" />
      {Array.from({ length: 6 }).map((_, i) => (
        <rect key={i} x={230 + i * 125} y="805" width="42" height="220" fill="#59685D" />
      ))}

      {/* Formasi taruna */}
      <Cadet x={230} y={1570} scale={1.05} delay={2} />
      <Cadet x={420} y={1530} scale={1.15} delay={8} />
      <Cadet x={610} y={1570} scale={1.05} delay={14} />
      <Cadet x={800} y={1530} scale={1.15} delay={20} />
      <Cadet x={970} y={1570} scale={1.05} delay={26} />
    </g>
  );
};

// ADEGAN 2: seremoni kelulusan.
const GraduationScene: React.FC = () => {
  const frame = useCurrentFrame();
  const rise = interpolate(frame, [95, 145], [100, 0], clamp);
  const light = interpolate(frame, [105, 180], [0.1, 0.8], clamp);

  return (
    <g transform={`translate(0 ${rise})`}>
      <path d="M0 1250 H1080 V1920 H0Z" fill="#26362F" />

      {/* Panggung seremoni */}
      <path d="M140 1120 H940 L1010 1280 H70Z" fill="#A79E83" />
      <path d="M70 1280 H1010 L1080 1360 H0Z" fill="#56645A" />

      {/* Latar podium */}
      <rect x="270" y="650" width="540" height="420" fill="#BEB395" />
      <path d="M210 650 L540 430 L870 650Z" fill="#D8CBA9" />
      <path d="M270 650 H810" stroke="#E9DCBA" strokeWidth="12" />

      {/* Pintu utama */}
      <rect x="460" y="830" width="160" height="240" fill="#24342F" />

      {/* Barisan peserta seremoni */}
      {Array.from({ length: 7 }).map((_, i) => (
        <g key={i} transform={`translate(${125 + i * 140} 0)`}>
          <circle cx="0" cy="1160" r="18" fill="#B68E6B" />
          <path d="M-23 1185 H23 L28 1280 H-28Z" fill="#263B34" />
          <path d="M-12 1280 L-15 1340 M12 1280 L18 1340" stroke="#151E1A" strokeWidth="13" />
          <path d="M-20 1143 H20 L13 1130 H-13Z" fill="#D2BD8D" />
        </g>
      ))}

      {/* Cahaya panggung */}
      <path
        d="M540 150 L820 1250 H260Z"
        fill="#F0DCA7"
        opacity={light * 0.12}
      />
    </g>
  );
};

// ADEGAN 3: transisi menuju perjalanan karier.
const CareerScene: React.FC = () => {
  const frame = useCurrentFrame();
  const travel = interpolate(frame, [185, 300], [150, -450], clamp);

  return (
    <g>
      <path d="M0 1120 H1080 V1920 H0Z" fill="#172922" />

      {/* Garis perspektif lapangan */}
      {Array.from({ length: 7 }).map((_, i) => (
        <path
          key={i}
          d={`M540 1080 L${i * 180} 1920`}
          stroke="#BBAE89"
          strokeWidth="3"
          opacity=".2"
        />
      ))}

      {/* Formasi bergerak melintasi layar */}
      <g transform={`translate(${travel} 0)`}>
        <Cadet x={250} y={1530} scale={1.15} delay={185} color="#334C3F" />
        <Cadet x={450} y={1530} scale={1.15} delay={193} color="#334C3F" />
        <Cadet x={650} y={1530} scale={1.15} delay={201} color="#334C3F" />
        <Cadet x={850} y={1530} scale={1.15} delay={209} color="#334C3F" />
        <Cadet x={1050} y={1530} scale={1.15} delay={217} color="#334C3F" />
      </g>

      {/* Garis perjalanan */}
      <path
        d="M90 1420 Q540 1280 990 1420"
        stroke="#D6BD85"
        strokeWidth="4"
        strokeDasharray="14 12"
        fill="none"
        opacity={interpolate(frame, [210, 270], [0, 1], clamp)}
      />
    </g>
  );
};

const NarrativeVisual: React.FC = () => {
  const frame = useCurrentFrame();

  const trainingOpacity = fade(frame, 0, 112);
  const graduationOpacity = fade(frame, 92, 205);
  const careerOpacity = fade(frame, 185, 300);

  return (
    <AbsoluteFill style={{ backgroundColor: "#101B18", overflow: "hidden" }}>
      {/* Background atmospheric depth */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 25%, #53645A 0%, #263A32 42%, #101B18 100%)",
        }}
      />

      {/* Scene layers */}
      <svg
        viewBox="0 0 1080 1920"
        width="100%"
        height="100%"
        style={{ position: "absolute", inset: 0 }}
      >
        <g opacity={trainingOpacity}>
          <TrainingScene />
        </g>

        <g opacity={graduationOpacity}>
          <GraduationScene />
        </g>

        <g opacity={careerOpacity}>
          <CareerScene />
        </g>

        {/* Film grain / editorial texture */}
        <path
          d="M0 0 H1080 V1920 H0Z"
          fill="none"
          stroke="#E7DAB9"
          strokeWidth="3"
          opacity=".12"
        />
      </svg>

      {/* Editorial labels: kecil, tidak menguasai layar */}
      <div
        style={{
          position: "absolute",
          top: 90,
          left: 72,
          color: "#D7C69B",
          fontSize: 20,
          fontWeight: 700,
          letterSpacing: 6,
        }}
      >
        JEJAK LANGKAH / 03
      </div>

      {/* Peristiwa dan penanda waktu */}
      <div
        style={{
          position: "absolute",
          top: 1180,
          left: 75,
          right: 75,
          opacity: interpolate(frame, [110, 135, 180, 200], [0, 1, 1, 0], clamp),
        }}
      >
        <div
          style={{
            color: "#E3CB91",
            fontSize: 76,
            fontWeight: 900,
            letterSpacing: -2,
          }}
        >
          1974
        </div>
        <div
          style={{
            color: "#F1EBDD",
            fontSize: 23,
            letterSpacing: 4,
            marginTop: 5,
          }}
        >
          KELULUSAN AKABRI
        </div>
      </div>

      {/* Typography sinkron dengan VO */}
      <div
        style={{
          position: "absolute",
          left: 76,
          right: 76,
          bottom: 165,
          height: 120,
        }}
      >
        <AudioSyncedTypography
          words={prabowoWords}
          globalStartFrame={START_FRAME}
          accent="#E2C789"
        />
      </div>

      {/* Progress */}
      <div
        style={{
          position: "absolute",
          left: 76,
          right: 76,
          bottom: 105,
          height: 3,
          background: "rgba(255,255,255,.22)",
        }}
      >
        <div
          style={{
            width: `${interpolate(frame, [0, 300], [0, 100], clamp)}%`,
            height: "100%",
            background: "#D8BD82",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

export const NarrativeVisualPrototype: React.FC = () => {
  return (
    <AbsoluteFill>
      <Audio
        src={staticFile(project.voiceoverSrc)}
        startFrom={START_FRAME}
        volume={1}
      />
      <NarrativeVisual />
    </AbsoluteFill>
  );
};
