
import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { AudioWordCue } from "./types";

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

type Props = {
  words: AudioWordCue[];
  globalStartFrame: number;
  accent: string;
};

export const AudioSyncedTypography: React.FC<Props> = ({
  words,
  globalStartFrame,
  accent,
}) => {
  const localFrame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const absoluteFrame = globalStartFrame + localFrame;

  const cues = words.map((word) => ({
    ...word,
    startFrame: Math.round(word.start * fps),
    endFrame: Math.max(
      Math.round(word.end * fps),
      Math.round(word.start * fps) + 1
    ),
  }));

  const activeIndex = cues.findIndex(
    (word) =>
      absoluteFrame >= word.startFrame &&
      absoluteFrame < word.endFrame
  );

  const nextIndex = cues.findIndex(
    (word) => word.startFrame > absoluteFrame
  );

  const anchor = activeIndex >= 0 ? activeIndex : nextIndex;

  if (anchor < 0) return null;

  const from = Math.max(0, anchor - 2);
  const visible = cues.slice(from, from + 6);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        alignContent: "center",
        flexWrap: "wrap",
        gap: "8px 11px",
        overflow: "hidden",
        fontFamily: "Arial, sans-serif",
        fontSize: 43,
        lineHeight: 1.08,
        fontWeight: 900,
        textTransform: "uppercase",
        textShadow: "0 5px 28px rgba(0,0,0,.68)",
      }}
    >
      {visible.map((word, index) => {
        const cueIndex = from + index;
        const isActive = cueIndex === activeIndex;

        const framesUntil = word.startFrame - absoluteFrame;

        const enter = spring({
          frame: Math.max(0, 8 - Math.max(0, framesUntil)),
          fps,
          config: {
            damping: 14,
            stiffness: 170,
            mass: 0.42,
          },
        });

        const opacity = isActive
          ? 1
          : interpolate(enter, [0, 1], [0.38, 0.78], clamp);

        const y = interpolate(enter, [0, 1], [16, 0], clamp);

        return (
          <span
            key={`${word.start}-${word.text}-${index}`}
            style={{
              display: "inline-block",
              color: isActive ? accent : "#F1EDE3",
              opacity,
              transform: `translate3d(0,${y}px,0) scale(${
                isActive ? 1.08 : 1
              })`,
              textShadow: isActive
                ? `0 0 24px ${accent}66`
                : "none",
            }}
          >
            {word.text}
          </span>
        );
      })}
    </div>
  );
};
