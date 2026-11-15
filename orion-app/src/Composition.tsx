
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
import { orionTemplate } from "./orionTemplate";

type WordBeat = {
  text: string;
  start: number;
  duration: number;
};

type SceneData = {
  eyebrow: string;
  title: string;
  subtitle: string;
  number: string;
  accent: string;
  beats: WordBeat[];
};

type Props = {
  voiceoverSrc?: string;
  musicSrc?: string;
  sfxSrc?: string;
};

const scenes: SceneData[] = [
  {
    eyebrow: "ORION CREATIVE / INTRO",
    title: "IDEA",
    subtitle: "Semua karya besar dimulai dari satu gagasan.",
    number: "01",
    accent: "#B8D99A",
    beats: [
      { text: "SEMUA KARYA", start: 35, duration: 24 },
      { text: "DIMULAI", start: 65, duration: 20 },
      { text: "DARI GAGASAN", start: 95, duration: 30 },
    ],
  },
  {
    eyebrow: "01 / DISCOVER",
    title: "TEMUKAN",
    subtitle: "Gali inti pesan. Kenali siapa yang perlu mendengarnya.",
    number: "02",
    accent: "#E5C58B",
    beats: [
      { text: "GALI INTI PESAN", start: 30, duration: 30 },
      { text: "KENALI AUDIENS", start: 75, duration: 30 },
    ],
  },
  {
    eyebrow: "02 / DESIGN",
    title: "RANCANG",
    subtitle: "Bangun bahasa visual yang punya karakter dan arah.",
    number: "03",
    accent: "#A8C9D9",
    beats: [
      { text: "BANGUN VISUAL", start: 35, duration: 28 },
      { text: "PUNYA KARAKTER", start: 80, duration: 30 },
    ],
  },
  {
    eyebrow: "03 / MOTION",
    title: "GERAKKAN",
    subtitle: "Satukan ritme, tipografi, cahaya, dan suara.",
    number: "04",
    accent: "#D9A8B8",
    beats: [
      { text: "RITME", start: 25, duration: 20 },
      { text: "TIPOGRAFI", start: 55, duration: 25 },
      { text: "SUARA DAN GERAK", start: 95, duration: 30 },
    ],
  },
  {
    eyebrow: "04 / STORY",
    title: "HIDUPKAN",
    subtitle: "Ubah informasi menjadi pengalaman yang berkesan.",
    number: "05",
    accent: "#B8D99A",
    beats: [
      { text: "UBAH INFORMASI", start: 35, duration: 28 },
      { text: "JADI PENGALAMAN", start: 80, duration: 35 },
    ],
  },
  {
    eyebrow: "ORION CREATIVE",
    title: "MAKE IT MATTER.",
    subtitle: "Bukan sekadar terlihat. Tetapi punya makna.",
    number: "06",
    accent: "#E5C58B",
    beats: [
      { text: "BUKAN SEKADAR TERLIHAT", start: 30, duration: 35 },
      { text: "PUNYA MAKNA", start: 85, duration: 30 },
    ],
  },
];

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
    config: { damping: 14, stiffness: 150, mass: 0.65 },
  });

  const opacity = interpolate(
    localFrame,
    [0, 5, beat.duration - 5, beat.duration],
    [0, 1, 1, 0],
    clamp
  );

  const y = interpolate(progress, [0, 1], [35, 0]);
  const scale = interpolate(progress, [0, 1], [0.92, 1]);

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        bottom: 0,
        opacity,
        transform: `translateY(${y}px) scale(${scale})`,
        transformOrigin: "left center",
        color: accent,
        fontFamily: "Arial, sans-serif",
        fontSize: 48,
        fontWeight: 800,
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
    config: { damping: 18, stiffness: 85, mass: 0.9 },
  });

  const exit = interpolate(
    frame,
    [durationInFrames - 15, durationInFrames],
    [1, 0],
    clamp
  );

  const titleY = interpolate(enter, [0, 1], [100, 0]);
  const titleScale = interpolate(enter, [0, 1], [0.82, 1]);
  const titleOpacity = interpolate(frame, [0, 12], [0, 1], clamp);

  const orbitRotation = frame * (index % 2 === 0 ? 0.5 : -0.4);
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

      {/* Dynamic orbit */}
      <div
        style={{
          position: "absolute",
          width: 850,
          height: 850,
          right: -330,
          top: 180,
          border: `2px solid ${data.accent}35`,
          borderRadius: "50%",
          transform: `rotate(${orbitRotation}deg)`,
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
          transform: `rotate(${-orbitRotation * 1.6}deg)`,
        }}
      />

      {/* Editorial frame */}
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

      <div
        style={{
          position: "absolute",
          left: 78,
          top: 105,
          fontSize: 21,
          letterSpacing: 5,
          color: data.accent,
          fontFamily: "Arial, sans-serif",
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
          fontSize: index === 5 ? 105 : 155,
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

      {/* Animated accent line */}
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

      {/* Timed kinetic phrases */}
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
          <WordBeatView key={`${data.number}-${i}`} beat={beat} accent={data.accent} />
        ))}
      </div>

      {/* Supporting subtitle */}
      <div
        style={{
          position: "absolute",
          left: 82,
          top: "70%",
          width: 760,
          fontFamily: "Arial, sans-serif",
          fontSize: 30,
          lineHeight: 1.4,
          color: "rgba(244,241,232,.72)",
          opacity: interpolate(frame, [25, 45], [0, 1], clamp),
          transform: `translateY(${interpolate(frame, [25, 45], [25, 0], clamp)}px)`,
        }}
      >
        {data.subtitle}
      </div>

      {/* Progress indicator */}
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
        {data.number} / {String(scenes.length).padStart(2, "0")}
      </div>
    </AbsoluteFill>
  );
};

export const MyComponent: React.FC<Props> = ({
  voiceoverSrc,
  musicSrc,
  sfxSrc,
}) => {
  const { fps } = useVideoConfig();
  const framesPerScene = orionTemplate.sceneDurationSeconds * fps;

  return (
    <AbsoluteFill style={{ backgroundColor: "#101713" }}>
      {scenes.map((scene, index) => (
        <Sequence
          key={scene.number}
          from={index * framesPerScene}
          durationInFrames={framesPerScene}
        >
          <Scene data={scene} index={index} />
        </Sequence>
      ))}

      {voiceoverSrc ? (
        <Audio src={staticFile(voiceoverSrc)} volume={1} />
      ) : null}

      {musicSrc ? (
        <Audio src={staticFile(musicSrc)} volume={0.18} />
      ) : null}

      {sfxSrc ? (
        <Audio src={staticFile(sfxSrc)} volume={0.55} />
      ) : null}
    </AbsoluteFill>
  );
};
