
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

import { project } from "./project";
import { prabowoWords } from "./audio/prabowo.words";
import { AudioSyncedTypography } from "./audio/AudioSyncedTypography";

const FPS = 30;
const START_SECONDS = 21.5;
const START_FRAME = Math.round(START_SECONDS * FPS);

const CLAMP = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

/* =====================================================
   EDITORIAL SCENE LABEL
===================================================== */

const SceneLabel: React.FC<{
  number: string;
  eyebrow: string;
  title: string;
  frame: number;
  start: number;
}> = ({ number, eyebrow, title, frame, start }) => {
  const opacity = interpolate(
    frame,
    [start, start + 12, start + 72, start + 90],
    [0, 1, 1, 0],
    CLAMP
  );

  const y = interpolate(
    frame,
    [start, start + 18],
    [28, 0],
    CLAMP
  );

  return (
    <div
      style={{
        position: "absolute",
        left: 76,
        top: 190,
        opacity,
        transform: `translateY(${y}px)`,
        color: "#F4EBDD",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        <div
          style={{
            width: 42,
            height: 2,
            background: "#D8BD82",
          }}
        />

        <span
          style={{
            color: "#D8BD82",
            fontSize: 18,
            letterSpacing: 5,
            fontWeight: 700,
          }}
        >
          {number} / {eyebrow}
        </span>
      </div>

      <div
        style={{
          marginTop: 15,
          fontSize: 43,
          fontWeight: 800,
          letterSpacing: -1.5,
        }}
      >
        {title}
      </div>
    </div>
  );
};

/* =====================================================
   SCENE 01 — PENDIDIKAN MILITER
   Documentary photography treatment
===================================================== */


/* =====================================================
   SCENE 01 — MILITARY FORMATION
   Cinematic documentary camera treatment
===================================================== */

const TrainingScene: React.FC = () => {
  const frame = useCurrentFrame();

  const progress = interpolate(frame, [0, 112], [0, 1], CLAMP);
  const scale = interpolate(frame, [0, 112], [1.08, 1.25], CLAMP);
  const x = interpolate(frame, [0, 112], [22, -52], CLAMP);
  const y = interpolate(frame, [0, 112], [0, -32], CLAMP);
  const scan = interpolate(frame, [8, 100], [-200, 1250], CLAMP);
  const opacity = interpolate(frame, [0, 8, 100, 116], [0, 1, 1, 0], CLAMP);

  return (
    <AbsoluteFill style={{ opacity, overflow: "hidden", backgroundColor: "#101713" }}>
      <Img
        src={staticFile("academy-cadets.jpg")}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center 46%",
          transform: `translate(${x}px, ${y}px) scale(${scale})`,
          filter: "contrast(1.16) saturate(.78) sepia(.12)",
        }}
      />

      <AbsoluteFill
        style={{
          background:
            "linear-gradient(90deg,rgba(5,12,9,.55),transparent 75%),linear-gradient(0deg,rgba(5,10,8,.94),transparent 58%),linear-gradient(180deg,rgba(5,10,8,.42),transparent 30%)",
        }}
      />

      {/* Moving cinematic light scan */}
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: scan,
          width: 4,
          background: "linear-gradient(180deg,transparent,#E8D2A0,transparent)",
          boxShadow: "0 0 35px rgba(232,210,160,.55)",
          opacity: .8,
        }}
      />

      {/* Focus frame */}
      <div
        style={{
          position: "absolute",
          left: 68,
          right: 68,
          top: 470,
          height: 640,
          borderTop: "1px solid rgba(232,211,164,.8)",
          borderBottom: "1px solid rgba(232,211,164,.65)",
          transform: `translateY(${interpolate(frame, [0, 112], [30, -25], CLAMP)}px)`,
        }}
      />

      <svg
        viewBox="0 0 1080 1920"
        width="100%"
        height="100%"
        style={{ position: "absolute", inset: 0 }}
      >
        <path
          d="M72 1450 H1008"
          stroke="rgba(235,218,181,.35)"
          strokeWidth="2"
          fill="none"
        />
        <path
          d={`M72 1450 H${72 + progress * 936}`}
          stroke="#E5D2A5"
          strokeWidth="4"
          fill="none"
        />
        <circle
          cx={72 + progress * 936}
          cy="1450"
          r="8"
          fill="#F1D9A7"
        />
        <text
          x="76"
          y="1510"
          fill="#E9DFC8"
          fontSize="18"
          letterSpacing="6"
        >
          FIELD TRAINING / INDONESIA
        </text>
        <text
          x="1004"
          y="1510"
          fill="#E9DFC8"
          fontSize="18"
          letterSpacing="4"
          textAnchor="end"
        >
          01 — FORMATION
        </text>
      </svg>

      <SceneLabel
        number="01"
        eyebrow="PEMBENTUKAN"
        title="DISIPLIN DAN PENGABDIAN"
        frame={frame}
        start={5}
      />
    </AbsoluteFill>
  );
};


/* =====================================================
   SCENE 02 — AKABRI GRADUATION
   Archival portrait + monumental year reveal
===================================================== */

const GraduationScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, [88, 103, 192, 210], [0, 1, 1, 0], CLAMP);
  const reveal = spring({
    frame: frame - 101,
    fps,
    config: { damping: 18, stiffness: 75 },
  });

  const zoom = interpolate(frame, [100, 205], [1.06, 1.25], CLAMP);
  const shift = interpolate(frame, [100, 205], [28, -35], CLAMP);
  const yearLine = interpolate(frame, [112, 158], [0, 390], CLAMP);
  const wipe = interpolate(frame, [96, 120], [100, 0], CLAMP);

  return (
    <AbsoluteFill
      style={{
        opacity,
        overflow: "hidden",
        backgroundColor: "#111713",
      }}
    >
      <Img
        src={staticFile("1000827932.jpg.jpeg")}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "31% 42%",
          transform: `translateX(${shift}px) scale(${zoom})`,
          filter: "grayscale(1) contrast(1.16) brightness(.82)",
        }}
      />

      <AbsoluteFill
        style={{
          background:
            "linear-gradient(90deg,rgba(5,10,8,.04) 0%,rgba(5,10,8,.15) 36%,rgba(5,10,8,.92) 100%),linear-gradient(0deg,rgba(5,10,8,.92),transparent 65%),linear-gradient(180deg,rgba(5,10,8,.22),transparent 32%)",
        }}
      />

      {/* Diagonal archival transition */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "#D9C18D",
          clipPath: `polygon(100% 0,100% 100%,${wipe}% 100%,${wipe + 18}% 0)`,
          opacity: interpolate(frame, [96, 110, 120], [.7, .7, 0], CLAMP),
          mixBlendMode: "screen",
        }}
      />

      {/* Monumental 1974 typography */}
      <div
        style={{
          position: "absolute",
          top: 335,
          right: 62,
          width: 500,
          textAlign: "right",
          opacity: reveal,
          transform: `translateX(${(1 - reveal) * 110}px)`,
        }}
      >
        <div
          style={{
            color: "#D9C18D",
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: 7,
          }}
        >
          CATATAN SEJARAH
        </div>

        <div
          style={{
            color: "rgba(242,232,211,.10)",
            WebkitTextStroke: "2px rgba(235,218,181,.9)",
            fontSize: 178,
            fontWeight: 900,
            letterSpacing: -12,
            lineHeight: .95,
            marginTop: 12,
          }}
        >
          1974
        </div>

        <div
          style={{
            width: yearLine,
            height: 5,
            background: "#D9C18D",
            marginLeft: "auto",
            marginTop: 22,
          }}
        />

        <div
          style={{
            color: "#F4EBDD",
            fontSize: 32,
            fontWeight: 900,
            marginTop: 25,
          }}
        >
          LULUS AKABRI
        </div>

        <div
          style={{
            color: "#D9CBAE",
            fontSize: 17,
            letterSpacing: 3,
            marginTop: 12,
          }}
        >
          AWAL PENGABDIAN MILITER
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          inset: 48,
          border: "1px solid rgba(232,215,178,.4)",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 76,
          bottom: 390,
          color: "#E8D9B8",
          fontSize: 16,
          letterSpacing: 5,
          opacity: interpolate(frame, [132, 150], [0, .85], CLAMP),
        }}
      >
        ARCHIVE FRAME / 1974
      </div>
    </AbsoluteFill>
  );
};


/* =====================================================
   SCENE 03 — CAREER JOURNEY
   Action shot → portrait match cut
===================================================== */

const CareerScene: React.FC = () => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [178, 194, 300], [0, 1, 1], CLAMP);

  const actionOpacity = interpolate(
    frame,
    [188, 222, 236],
    [0, 1, 0],
    CLAMP
  );

  const portraitOpacity = interpolate(
    frame,
    [224, 242, 300],
    [0, 1, 1],
    CLAMP
  );

  const actionZoom = interpolate(frame, [188, 236], [1.12, 1.02], CLAMP);
  const portraitZoom = interpolate(frame, [226, 300], [1.18, 1.04], CLAMP);

  const titleIn = spring({
    frame: frame - 198,
    fps: 30,
    config: { damping: 18, stiffness: 82 },
  });

  const diagonal = interpolate(frame, [222, 241], [110, -12], CLAMP);
  const routeProgress = interpolate(frame, [205, 285], [0, 1], CLAMP);

  return (
    <AbsoluteFill
      style={{
        opacity,
        overflow: "hidden",
        backgroundColor: "#111713",
      }}
    >
      {/* Action photograph */}
      <AbsoluteFill
        style={{
          opacity: actionOpacity,
          overflow: "hidden",
        }}
      >
        <Img
          src={staticFile("1000827935.jpg.jpeg")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "68% center",
            transform: `scale(${actionZoom}) translateX(-18px)`,
            filter: "contrast(1.14) saturate(.86) brightness(.82)",
          }}
        />
      </AbsoluteFill>

      {/* Diagonal portrait match cut */}
      <AbsoluteFill
        style={{
          opacity: portraitOpacity,
          overflow: "hidden",
          clipPath: `polygon(${diagonal}% 0,100% 0,100% 100%,${diagonal - 16}% 100%)`,
        }}
      >
        <Img
          src={staticFile("1000827941.jpg.jpeg")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center 38%",
            transform: `scale(${portraitZoom})`,
            filter: "contrast(1.12) saturate(.9)",
          }}
        />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg,rgba(5,10,8,.58),rgba(5,10,8,.05) 40%,rgba(5,10,8,.94)),linear-gradient(90deg,rgba(5,10,8,.3),transparent 70%)",
        }}
      />

      {/* Oversized chapter number */}
      <div
        style={{
          position: "absolute",
          right: 42,
          top: 300,
          color: "rgba(230,211,170,.16)",
          fontSize: 330,
          fontWeight: 900,
          lineHeight: .8,
          letterSpacing: -25,
          transform: `translateY(${(1 - titleIn) * 80}px)`,
          opacity: titleIn,
        }}
      >
        03
      </div>

      <div
        style={{
          position: "absolute",
          left: 76,
          top: 300,
          right: 80,
          opacity: titleIn,
          transform: `translateX(${(1 - titleIn) * -50}px)`,
        }}
      >
        <div
          style={{
            color: "#E2C58D",
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: 5,
          }}
        >
          03 / PERJALANAN
        </div>

        <div
          style={{
            color: "#FFFFFF",
            fontSize: 43,
            fontWeight: 900,
            lineHeight: 1.08,
            marginTop: 15,
          }}
        >
          DI LINGKUNGAN
          <br />
          ANGKATAN
        </div>
      </div>

      {/* Animated journey trajectory */}
      <svg
        viewBox="0 0 1080 1920"
        width="100%"
        height="100%"
        style={{
          position: "absolute",
          inset: 0,
        }}
      >
        <path
          d="M72 1470 C280 1370 420 1510 610 1390 S850 1300 1008 1360"
          fill="none"
          stroke="#D9C18D"
          strokeWidth="3"
          strokeDasharray="1200"
          strokeDashoffset={1200 * (1 - routeProgress)}
          opacity=".85"
        />

        <circle
          cx={72 + routeProgress * 936}
          cy={1470 - Math.sin(routeProgress * Math.PI) * 100}
          r="8"
          fill="#F0D7A2"
          opacity={routeProgress}
        />
      </svg>

      <div
        style={{
          position: "absolute",
          left: 78,
          right: 78,
          bottom: 370,
          color: "#F0E7D4",
          fontSize: 17,
          letterSpacing: 3,
          opacity: interpolate(frame, [238, 254, 292, 300], [0, 1, 1, 0], CLAMP),
        }}
      >
        PENGALAMAN · TANGGUNG JAWAB · KEPEMIMPINAN
      </div>

      <div
        style={{
          position: "absolute",
          inset: 48,
          border: "1px solid rgba(231,218,185,.35)",
        }}
      />
    </AbsoluteFill>
  );
};



/* =====================================================
   MAIN NARRATIVE VISUAL
===================================================== */

const NarrativeVisual: React.FC = () => {
  const frame = useCurrentFrame();

  const progress = interpolate(
    frame,
    [0, 300],
    [0, 100],
    CLAMP
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#101B18",
        overflow: "hidden",
      }}
    >
      {/* Three visual chapters */}
      <TrainingScene />
      <GraduationScene />
      <CareerScene />

      {/* Documentary identity */}
      <div
        style={{
          position: "absolute",
          top: 86,
          left: 76,
          color: "#D7C69B",
          fontSize: 17,
          fontWeight: 700,
          letterSpacing: 5,
          opacity: 0.9,
        }}
      >
        JEJAK LANGKAH / DOKUMENTER
      </div>

      {/* Original synchronized typography — unchanged */}
      <div
        style={{
          position: "absolute",
          left: 76,
          right: 76,
          bottom: 165,
          height: 120,
          zIndex: 20,
        }}
      >
        <AudioSyncedTypography
          words={prabowoWords}
          globalStartFrame={START_FRAME}
          accent="#E2C789"
        />
      </div>

      {/* Progress indicator */}
      <div
        style={{
          position: "absolute",
          left: 76,
          right: 76,
          bottom: 105,
          height: 3,
          background: "rgba(255,255,255,.22)",
          zIndex: 21,
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: "100%",
            background: "#D8BD82",
          }}
        />
      </div>

      {/* Film frame */}
      <div
        style={{
          position: "absolute",
          inset: 28,
          border: "1px solid rgba(231,218,185,.16)",
          pointerEvents: "none",
          zIndex: 19,
        }}
      />
    </AbsoluteFill>
  );
};

/* =====================================================
   REMOTION COMPOSITION
   AUDIO SETTINGS PRESERVED
===================================================== */

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
