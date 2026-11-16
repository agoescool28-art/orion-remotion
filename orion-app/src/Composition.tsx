
import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

import { project, SceneData, WordBeat } from "./project";

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const WordBeatView: React.FC<{
  beat: WordBeat;
  accent: string;
}> = ({ beat, accent }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = frame - beat.start;

  const progress = spring({
    frame: localFrame,
    fps,
    config: {
      damping: 14,
      stiffness: 150,
      mass: 0.65,
    },
  });

  const opacity = interpolate(
    localFrame,
    [0, 5, beat.duration - 5, beat.duration],
    [0, 1, 1, 0],
    clamp
  );

  const y = interpolate(progress, [0, 1], [40, 0]);
  const scale = interpolate(progress, [0, 1], [0.85, 1]);

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        opacity,
        transform: `translateY(${y}px) scale(${scale})`,
        color: accent,
        fontFamily: "Arial, sans-serif",
        fontSize: 48,
        fontWeight: 900,
        letterSpacing: 1,
      }}
    >
      {beat.text}
    </div>
  );
};

const Scene: React.FC<{
  data: SceneData;
  index: number;
}> = ({ data, index }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const enter = spring({
    frame,
    fps,
    config: {
      damping: 18,
      stiffness: 85,
      mass: 0.9,
    },
  });

  const exit = interpolate(
    frame,
    [durationInFrames - 15, durationInFrames],
    [1, 0],
    clamp
  );

  const titleY = interpolate(enter, [0, 1], [100, 0]);
  const titleScale = interpolate(enter, [0, 1], [0.82, 1]);

  const titleOpacity = interpolate(
    frame,
    [0, 12],
    [0, 1],
    clamp
  );

  const rotation = frame * (index % 2 === 0 ? 0.5 : -0.4);

  const progress = interpolate(
    frame,
    [0, durationInFrames],
    [0, 1],
    clamp
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#101713",
        color: "#F4F1E8",
        overflow: "hidden",
        opacity: exit,
      }}
    >
      {/* Background */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 75% 25%, rgba(157,205,120,.20), transparent 35%), linear-gradient(145deg,#18241C,#080D0A)",
        }}
      />

      {/* Grid */}
      <AbsoluteFill
        style={{
          opacity: 0.12,
          backgroundImage:
            "linear-gradient(rgba(235,242,224,.16) 1px, transparent 1px), linear-gradient(90deg,rgba(235,242,224,.16) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />

      {/* Motion orbit */}
      <div
        style={{
          position: "absolute",
          width: 850,
          height: 850,
          right: -330,
          top: 180,
          border: `2px solid ${data.accent}35`,
          borderRadius: "50%",
          transform: `rotate(${rotation}deg)`,
          boxShadow: `0 0 100px ${data.accent}18`,
        }}
      />

      <div
        style={{
          position: "absolute",
          width: 580,
          height: 580,
          right: -200,
          top: 315,
          border: `1px solid ${data.accent}50`,
          borderRadius: "50%",
          transform: `rotate(${-rotation * 1.6}deg)`,
        }}
      />

      {/* Top line */}
      <div
        style={{
          position: "absolute",
          left: 76,
          right: 76,
          top: 80,
          height: 2,
          background: `${data.accent}70`,
        }}
      />

      {/* Eyebrow */}
      <div
        style={{
          position: "absolute",
          left: 78,
          top: 105,
          fontSize: 21,
          letterSpacing: 5,
          color: data.accent,
          opacity: titleOpacity,
        }}
      >
        {data.eyebrow}
      </div>

      {/* Main title */}
      <div
        style={{
          position: "absolute",
          left: 76,
          top: "32%",
          width: 950,
          fontFamily: "Arial, Helvetica, sans-serif",
          fontSize: 145,
          fontWeight: 900,
          lineHeight: 0.95,
          letterSpacing: -6,
          transform: `translateY(${titleY}px) scale(${titleScale})`,
          transformOrigin: "left center",
          opacity: titleOpacity,
          textShadow: "0 15px 70px rgba(0,0,0,.35)",
        }}
      >
        {data.title}
      </div>

      {/* Accent line */}
      <div
        style={{
          position: "absolute",
          left: 80,
          top: "52%",
          width: 800,
          height: 5,
          background: `linear-gradient(90deg,${data.accent},transparent)`,
          transform: `scaleX(${interpolate(frame, [8, 30], [0, 1], clamp)})`,
          transformOrigin: "left",
        }}
      />

      {/* Kinetic typography */}
      <div
        style={{
          position: "absolute",
          left: 82,
          top: "58%",
          width: 850,
          height: 100,
        }}
      >
        {data.beats.map((beat, i) => (
          <WordBeatView
            key={`${index}-${i}`}
            beat={beat}
            accent={data.accent}
          />
        ))}
      </div>

      {/* Subtitle */}
      <div
        style={{
          position: "absolute",
          left: 82,
          top: "70%",
          width: 760,
          fontSize: 30,
          lineHeight: 1.4,
          color: "rgba(244,241,232,.72)",
          opacity: interpolate(frame, [25, 45], [0, 1], clamp),
          transform: `translateY(${interpolate(frame, [25, 45], [25, 0], clamp)}px)`,
        }}
      >
        {data.subtitle}
      </div>

      {/* Progress */}
      <div
        style={{
          position: "absolute",
          left: 82,
          right: 82,
          bottom: 125,
          height: 3,
          background: "rgba(255,255,255,.15)",
        }}
      >
        <div
          style={{
            width: `${progress * 100}%`,
            height: "100%",
            background: data.accent,
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          left: 82,
          bottom: 85,
          fontSize: 18,
          letterSpacing: 4,
          color: "rgba(244,241,232,.5)",
        }}
      >
        ORION / VISUAL STORYTELLING
      </div>

      <div
        style={{
          position: "absolute",
          right: 82,
          bottom: 78,
          fontSize: 25,
          color: data.accent,
          letterSpacing: 3,
        }}
      >
        {String(index + 1).padStart(2, "0")} /{" "}
        {String(project.scenes.length).padStart(2, "0")}
      </div>
    </AbsoluteFill>
  );
};

export const MyComponent: React.FC = () => {
  const { fps } = useVideoConfig();

  const framesPerScene =
    project.sceneDurationSeconds * fps;

  return (
    <AbsoluteFill style={{ backgroundColor: "#101713" }}>
      {project.scenes.map((scene, index) => (
        <Sequence
          key={`${index}-${scene.title}`}
          from={index * framesPerScene}
          durationInFrames={framesPerScene}
        >
          <Scene data={scene} index={index} />
        </Sequence>
      ))}

      {project.voiceoverSrc ? (
        <Audio
          src={staticFile(project.voiceoverSrc)}
          volume={1}
        />
      ) : null}

      {project.musicSrc ? (
        <Audio
          src={staticFile(project.musicSrc)}
          volume={0.18}
        />
      ) : null}

      {project.sfxSrc ? (
        <Audio
          src={staticFile(project.sfxSrc)}
          volume={0.55}
        />
      ) : null}
    </AbsoluteFill>
  );
};
