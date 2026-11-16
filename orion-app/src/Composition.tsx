
import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
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

  const enter = spring({
    frame: Math.max(0, localFrame),
    fps,
    config: {
      damping: 13,
      stiffness: 160,
      mass: 0.55,
    },
  });

  const opacity = interpolate(
    localFrame,
    [0, 5, beat.duration - 6, beat.duration],
    [0, 1, 1, 0],
    clamp
  );

  const translateY = interpolate(enter, [0, 1], [55, 0]);
  const scale = interpolate(enter, [0, 1], [0.82, 1]);

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: "100%",
        opacity,
        transform: `translateY(${translateY}px) scale(${scale})`,
        transformOrigin: "left center",
        color: accent,
        fontFamily: "Arial, sans-serif",
        fontSize: 47,
        fontWeight: 900,
        letterSpacing: 1,
        textShadow: "0 5px 25px rgba(0,0,0,.6)",
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
      stiffness: 90,
      mass: 0.8,
    },
  });

  const exit = interpolate(
    frame,
    [durationInFrames - 18, durationInFrames],
    [1, 0],
    clamp
  );

  const imageZoom = interpolate(
    frame,
    [0, durationInFrames],
    [1, 1.13],
    clamp
  );

  const imagePan = interpolate(
    frame,
    [0, durationInFrames],
    [0, index % 2 === 0 ? -45 : 45],
    clamp
  );

  const titleY = interpolate(enter, [0, 1], [100, 0]);
  const titleScale = interpolate(enter, [0, 1], [0.88, 1]);

  const titleOpacity = interpolate(
    frame,
    [0, 12],
    [0, 1],
    clamp
  );

  const progress = interpolate(
    frame,
    [0, durationInFrames],
    [0, 1],
    clamp
  );

  const accentLine = interpolate(
    frame,
    [8, 30],
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
      {/* ARCHIVE IMAGE */}
      {data.imageSrc ? (
        <AbsoluteFill>
          <Img
            src={staticFile(data.imageSrc)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: `scale(${imageZoom}) translateX(${imagePan}px)`,
              filter: "brightness(0.52) contrast(1.08) saturate(0.78)",
            }}
          />
        </AbsoluteFill>
      ) : null}

      {/* CINEMATIC OVERLAY */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(5,10,8,.35) 0%, rgba(5,10,8,.15) 35%, rgba(5,10,8,.92) 100%)",
        }}
      />

      {/* EDITORIAL GRID */}
      <AbsoluteFill
        style={{
          opacity: 0.1,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.18) 1px, transparent 1px), linear-gradient(90deg,rgba(255,255,255,.18) 1px, transparent 1px)",
          backgroundSize: "90px 90px",
        }}
      />

      {/* TOP EDITORIAL LINE */}
      <div
        style={{
          position: "absolute",
          left: 76,
          right: 76,
          top: 82,
          height: 2,
          background: `${data.accent}90`,
          transform: `scaleX(${accentLine})`,
          transformOrigin: "left",
        }}
      />

      {/* EYEBROW */}
      <div
        style={{
          position: "absolute",
          left: 80,
          top: 112,
          fontSize: 21,
          fontWeight: 700,
          letterSpacing: 5,
          color: data.accent,
          opacity: titleOpacity,
        }}
      >
        {data.eyebrow}
      </div>

      {/* MAIN TITLE */}
      <div
        style={{
          position: "absolute",
          left: 76,
          top: "31%",
          width: 950,
          fontFamily: "Arial, Helvetica, sans-serif",
          fontSize: 145,
          fontWeight: 900,
          lineHeight: 0.95,
          letterSpacing: -6,
          transform: `translateY(${titleY}px) scale(${titleScale})`,
          transformOrigin: "left center",
          opacity: titleOpacity,
          textShadow: "0 15px 70px rgba(0,0,0,.65)",
        }}
      >
        {data.title}
      </div>

      {/* ACCENT LINE */}
      <div
        style={{
          position: "absolute",
          left: 80,
          top: "52%",
          width: 800,
          height: 5,
          background: `linear-gradient(90deg,${data.accent},transparent)`,
          transform: `scaleX(${accentLine})`,
          transformOrigin: "left",
        }}
      />

      {/* KINETIC TYPOGRAPHY */}
      <div
        style={{
          position: "absolute",
          left: 82,
          top: "58%",
          width: 850,
          height: 120,
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

      {/* NARRATIVE SUBTITLE */}
      <div
        style={{
          position: "absolute",
          left: 82,
          top: "70%",
          width: 820,
          fontSize: 30,
          fontWeight: 400,
          lineHeight: 1.4,
          color: "rgba(244,241,232,.9)",
          opacity: interpolate(frame, [25, 45], [0, 1], clamp),
          transform: `translateY(${interpolate(
            frame,
            [25, 45],
            [25, 0],
            clamp
          )}px)`,
          textShadow: "0 3px 15px rgba(0,0,0,.8)",
        }}
      >
        {data.subtitle}
      </div>

      {/* BOTTOM PROGRESS */}
      <div
        style={{
          position: "absolute",
          left: 82,
          right: 82,
          bottom: 125,
          height: 3,
          background: "rgba(255,255,255,.25)",
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

      {/* FOOTER */}
      <div
        style={{
          position: "absolute",
          left: 82,
          bottom: 82,
          fontSize: 18,
          letterSpacing: 4,
          color: "rgba(244,241,232,.65)",
        }}
      >
        ORION / VISUAL STORYTELLING
      </div>

      <div
        style={{
          position: "absolute",
          right: 82,
          bottom: 76,
          fontSize: 25,
          fontWeight: 700,
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

  const framesPerScene = project.sceneDurationSeconds * fps;

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
          volume={0.16}
        />
      ) : null}

      {project.sfxSrc ? (
        <Audio
          src={staticFile(project.sfxSrc)}
          volume={0.5}
        />
      ) : null}
    </AbsoluteFill>
  );
};
