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
import { AudioSyncedTypography } from "./audio/AudioSyncedTypography";
import {
  HandDrawnCanvas,
  HandDrawnCard,
  HANDDRAWN_PALETTE,
} from "./HandDrawnStyle";

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const progress = (frame: number, from: number, to: number) =>
  interpolate(frame, [from, Math.max(from + 1, to)], [0, 1], clamp);

const rise = (frame: number, fps: number, delay = 0) =>
  spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 18, stiffness: 115, mass: 0.65 },
  });

const Kicker: React.FC<{ children: React.ReactNode; color: string }> = ({
  children,
  color,
}) => (
  <div
    style={{
      color,
      fontSize: 17,
      letterSpacing: 4,
      fontWeight: 900,
      textTransform: "uppercase",
    }}
  >
    {children}
  </div>
);

const Chapter: React.FC<{
  data: SceneData;
  index: number;
  start: number;
  duration: number;
}> = ({ data, index, start, duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const accent = data.accent || HANDDRAWN_PALETTE.mustard;
  const entrance = rise(frame, fps);
  const imageZoom = interpolate(frame, [0, duration], [1.04, 1.15], clamp);
  const imageDrift = interpolate(
    frame,
    [0, duration],
    [index % 2 === 0 ? -20 : 20, index % 2 === 0 ? 20 : -20],
    clamp
  );
  const progressLine = progress(frame, 12, Math.max(30, duration - 20));
  const activeBeat = data.beats.find((beat) => {
    const local = frame;
    return local >= beat.start && local < beat.start + beat.duration;
  });

  return (
    <HandDrawnCanvas chapter={index} accent={accent}>
      <AbsoluteFill
        style={{
          padding: "150px 75px 150px",
          boxSizing: "border-box",
        }}
      >
        {/* EDITORIAL HEADING */}
        <div
          style={{
            opacity: entrance,
            transform: `translateY(${(1 - entrance) * 35}px)`,
          }}
        >
          <Kicker color={HANDDRAWN_PALETTE.muted}>{data.eyebrow}</Kicker>
          <div
            style={{
              marginTop: 22,
              fontSize: data.title.length > 15 ? 65 : 88,
              lineHeight: 0.98,
              fontWeight: 900,
              letterSpacing: -3,
              color: HANDDRAWN_PALETTE.ink,
              maxWidth: 930,
            }}
          >
            {data.title}
          </div>
          <div
            style={{
              width: 180,
              height: 8,
              marginTop: 26,
              background: accent,
              transform: `scaleX(${progress(frame, 4, 30)})`,
              transformOrigin: "left",
            }}
          />
        </div>

        {/* DOCUMENTARY IMAGE / MOTION PANEL */}
        <div
          style={{
            position: "absolute",
            top: 455,
            left: 75,
            right: 75,
            height: 820,
            padding: 16,
            boxSizing: "border-box",
            background: "#FFF9EC",
            border: `3px solid ${HANDDRAWN_PALETTE.ink}`,
            boxShadow: "12px 14px 0px #29282025",
            transform: `translateY(${(1 - entrance) * 45}px) rotate(-0.5deg)`,
            opacity: entrance,
            overflow: "hidden",
          }}
        >
          {data.imageSrc ? (
            <Img
              src={staticFile(data.imageSrc)}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transform: `translateX(${imageDrift}px) scale(${imageZoom})`,
                filter: "contrast(1.06) saturate(.88)",
              }}
            />
          ) : (
            <AbsoluteFill
              style={{
                background:
                  "linear-gradient(145deg,#26342d 0%,#101a18 55%,#080d0c 100%)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg viewBox="0 0 900 700" width="100%" height="100%">
                <defs>
                  <linearGradient id={`line-${index}`} x1="0" x2="1">
                    <stop offset="0%" stopColor={accent} stopOpacity="0.05" />
                    <stop offset="55%" stopColor={accent} stopOpacity="0.9" />
                    <stop offset="100%" stopColor={accent} stopOpacity="0.15" />
                  </linearGradient>
                </defs>
                {Array.from({ length: 7 }, (_, i) => (
                  <path
                    key={i}
                    d={`M${i * 155 - 80} 0 L${i * 155 + 220} 700`}
                    stroke={accent}
                    strokeOpacity="0.18"
                    strokeWidth="2"
                    fill="none"
                  />
                ))}
                <path
                  d="M70 560 C230 450 310 510 430 350 S680 190 830 100"
                  stroke={`url(#line-${index})`}
                  strokeWidth="7"
                  strokeDasharray="1200"
                  strokeDashoffset={1200 * (1 - progress(frame, 8, duration * 0.8))}
                  fill="none"
                />
                <circle
                  cx={430 + Math.sin(frame * 0.035) * 90}
                  cy={350 + Math.cos(frame * 0.03) * 80}
                  r="12"
                  fill={accent}
                />
              </svg>
            </AbsoluteFill>
          )}

          {/* IMAGE SHADE */}
          <AbsoluteFill
            style={{
              background:
                "linear-gradient(180deg, transparent 45%, rgba(0,0,0,.62) 100%)",
              pointerEvents: "none",
            }}
          />

          {/* ARCHIVE LABEL */}
          <div
            style={{
              position: "absolute",
              left: 34,
              bottom: 34,
              padding: "12px 18px",
              background: HANDDRAWN_PALETTE.paper,
              color: HANDDRAWN_PALETTE.ink,
              border: `2px solid ${HANDDRAWN_PALETTE.ink}`,
              fontSize: 16,
              fontWeight: 900,
              letterSpacing: 2,
            }}
          >
            ARSIP SEJARAH • {String(index + 1).padStart(2, "0")}
          </div>
        </div>

        {/* STORY COPY */}
        <div
          style={{
            position: "absolute",
            top: 1305,
            left: 75,
            right: 75,
            opacity: entrance,
            transform: `translateY(${(1 - entrance) * 24}px)`,
          }}
        >
          <HandDrawnCard accent={accent}>
            <div
              style={{
                fontSize: 27,
                lineHeight: 1.38,
                fontWeight: 650,
                color: HANDDRAWN_PALETTE.ink,
              }}
            >
              {data.subtitle}
            </div>
          </HandDrawnCard>
        </div>

        {/* CHAPTER PROGRESS */}
        <div
          style={{
            position: "absolute",
            left: 75,
            right: 75,
            bottom: 245,
            height: 5,
            background: "#29282025",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progressLine * 100}%`,
              background: accent,
            }}
          />
        </div>

        {/* AUDIO-SYNCED KINETIC TYPOGRAPHY */}
        <div
          style={{
            position: "absolute",
            left: 75,
            right: 75,
            bottom: 65,
            height: 150,
            zIndex: 20,
          }}
        >
          <AudioSyncedTypography
            words={prabowoWords}
            globalStartFrame={start}
            accent={accent}
          />
        </div>

        {/* CURRENT SCRIPT BEAT LABEL */}
        {activeBeat ? (
          <div
            style={{
              position: "absolute",
              right: 75,
              top: 345,
              maxWidth: 500,
              padding: "10px 16px",
              background: accent,
              color: HANDDRAWN_PALETTE.ink,
              fontSize: 15,
              fontWeight: 900,
              letterSpacing: 1.2,
              opacity: progress(frame, activeBeat.start, activeBeat.start + 8),
            }}
          >
            {activeBeat.text}
          </div>
        ) : null}
      </AbsoluteFill>
    </HandDrawnCanvas>
  );
};

export const FullNarrative: React.FC = () => {
  let cursor = 0;

  const sequences = project.scenes.map((scene, index) => {
    const from = cursor;
    cursor += scene.durationFrames;

    return (
      <Sequence
        key={`chapter-${index}`}
        from={from}
        durationInFrames={scene.durationFrames}
      >
        <Chapter
          data={scene}
          index={index}
          start={from}
          duration={scene.durationFrames}
        />
      </Sequence>
    );
  });

  return (
    <HandDrawnCanvas chapter={0}>
      {sequences}
      <Audio src={staticFile(project.voiceoverSrc)} volume={1} />
    </HandDrawnCanvas>
  );
};
