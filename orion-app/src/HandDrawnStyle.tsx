
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
} from "remotion";

export const HANDDRAWN_PALETTE = {
  paper: "#F3EBDD",
  paperDark: "#E6DAC4",
  ink: "#292820",
  muted: "#777064",
  mustard: "#D5A52F",
  red: "#A94D3D",
  olive: "#687354",
};

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

type HandDrawnCanvasProps = {
  children?: React.ReactNode;
  accent?: string;
  chapter?: number;
};

export const HandDrawnCanvas: React.FC<HandDrawnCanvasProps> = ({
  children,
  accent = HANDDRAWN_PALETTE.mustard,
  chapter = 0,
}) => {
  const frame = useCurrentFrame();

  const reveal = interpolate(frame, [0, 24], [0, 1], clamp);
  const drift = Math.sin(frame * 0.025) * 7;
  const rotation = Math.sin(frame * 0.018) * 0.5;

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        backgroundColor: HANDDRAWN_PALETTE.paper,
        color: HANDDRAWN_PALETTE.ink,
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* PAPER TEXTURE */}
      <AbsoluteFill
        style={{
          opacity: 0.16,
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent 0px, transparent 3px, #8D8068 4px)",
          backgroundSize: "100% 5px",
          pointerEvents: "none",
        }}
      />

      {/* EDITORIAL FRAME */}
      <div
        style={{
          position: "absolute",
          inset: 35,
          border: "2px solid #292820",
          opacity: 0.18,
          transform: `rotate(${rotation}deg)`,
          pointerEvents: "none",
        }}
      />

      {/* HAND-DRAWN DECORATION */}
      <svg
        viewBox="0 0 1080 1920"
        width="100%"
        height="100%"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          opacity: reveal,
        }}
      >
        <path
          d="M65 270 Q280 250 470 270 T1010 260"
          fill="none"
          stroke={HANDDRAWN_PALETTE.ink}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="950"
          strokeDashoffset={950 * (1 - reveal)}
        />

        <path
          d="M75 1640 Q250 1625 420 1645"
          fill="none"
          stroke={accent}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray="380"
          strokeDashoffset={380 * (1 - reveal)}
        />

        <path
          d="M900 390 q35 -35 70 0 q-35 35 -70 0"
          fill="none"
          stroke={HANDDRAWN_PALETTE.red}
          strokeWidth="4"
          strokeLinecap="round"
          transform={`translate(${drift}, 0)`}
        />

        <circle
          cx="940"
          cy="1550"
          r="34"
          fill="none"
          stroke={accent}
          strokeWidth="5"
          strokeDasharray="8 8"
          transform={`rotate(${frame * 0.35} 940 1550)`}
        />

        <path
          d="M80 1780 l25 -18 l20 18 l25 -18"
          fill="none"
          stroke={HANDDRAWN_PALETTE.olive}
          strokeWidth="5"
          strokeLinecap="round"
        />
      </svg>

      {/* CHAPTER MARKER */}
      <div
        style={{
          position: "absolute",
          top: 65,
          left: 75,
          display: "flex",
          alignItems: "center",
          gap: 14,
          opacity: reveal,
          transform: `translateY(${(1 - reveal) * 18}px)`,
        }}
      >
        <div
          style={{
            width: 38,
            height: 38,
            background: accent,
            border: `2px solid ${HANDDRAWN_PALETTE.ink}`,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 900,
            fontSize: 17,
          }}
        >
          {String(chapter + 1).padStart(2, "0")}
        </div>

        <div
          style={{
            fontSize: 15,
            fontWeight: 900,
            letterSpacing: 3,
          }}
        >
          ORION • BIOGRAFI
        </div>
      </div>

      {/* CONTENT */}
      <AbsoluteFill
        style={{
          zIndex: 2,
        }}
      >
        {children}
      </AbsoluteFill>

      {/* FOOTER */}
      <div
        style={{
          position: "absolute",
          bottom: 48,
          left: 75,
          right: 75,
          display: "flex",
          justifyContent: "space-between",
          fontSize: 12,
          fontWeight: 800,
          letterSpacing: 2,
          color: HANDDRAWN_PALETTE.muted,
          opacity: reveal,
        }}
      >
        <span>ARSIP PERJALANAN</span>
        <span>ORION V5.2</span>
      </div>
    </AbsoluteFill>
  );
};

type HandDrawnCardProps = {
  children: React.ReactNode;
  accent?: string;
  delay?: number;
};

export const HandDrawnCard: React.FC<HandDrawnCardProps> = ({
  children,
  accent = HANDDRAWN_PALETTE.mustard,
  delay = 0,
}) => {
  const frame = useCurrentFrame();

  const progress = interpolate(
    frame,
    [delay, delay + 18],
    [0, 1],
    clamp
  );

  return (
    <div
      style={{
        position: "relative",
        padding: 26,
        background: "#FFF9EC",
        border: `2px solid ${HANDDRAWN_PALETTE.ink}`,
        borderRadius: 3,
        boxShadow: "7px 8px 0px #29282022",
        opacity: progress,
        transform: `translateY(${(1 - progress) * 35}px) rotate(-0.6deg)`,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -9,
          left: 28,
          width: 82,
          height: 17,
          background: accent,
          border: "1px solid #29282066",
          transform: "rotate(-2deg)",
        }}
      />
      {children}
    </div>
  );
};

type HandDrawnHighlightProps = {
  children: React.ReactNode;
  accent?: string;
};

export const HandDrawnHighlight: React.FC<HandDrawnHighlightProps> = ({
  children,
  accent = HANDDRAWN_PALETTE.mustard,
}) => {
  return (
    <span
      style={{
        background: `linear-gradient(transparent 48%, ${accent} 48%, ${accent} 91%, transparent 91%)`,
        padding: "0 5px",
        color: HANDDRAWN_PALETTE.ink,
        fontWeight: 900,
      }}
    >
      {children}
    </span>
  );
};
