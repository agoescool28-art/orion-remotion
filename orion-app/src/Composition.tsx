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
import { project, type SceneData, type WordBeat } from "./project";
import { DocumentaryArt } from "./DocumentaryArt";
import { prabowoWords } from "./audio/prabowo.words";
import { AudioSyncedTypography } from "./audio/AudioSyncedTypography";
const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};
const PAPER = "#F1EDE3";
const GOLD = "#D7B77A";
const MUTED = "#A5A69B";

const BeatTypography: React.FC<{ beat: WordBeat; accent: string; index: number }> = ({ beat, accent, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - beat.start;
  const enter = spring({
    frame: Math.max(0, local),
    fps,
    config: { damping: 14, stiffness: 135, mass: 0.55 },
  });
  const opacity = interpolate(local, [0, 5, beat.duration - 7, beat.duration], [0, 1, 1, 0], clamp);
  const y = interpolate(enter, [0, 1], [52, 0]);
  const scale = interpolate(enter, [0, 1], [0.92, 1]);
  const fontSize = beat.text.length > 25 ? 35 : beat.text.length > 17 ? 42 : 52;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: "100%",
        opacity,
        transform: `translate3d(0,${y}px,0) scale(${scale})`,
        transformOrigin: "left center",
        color: accent,
        fontFamily: "Arial, Helvetica, sans-serif",
        fontSize,
        fontWeight: 900,
        letterSpacing: beat.text.length > 20 ? 0 : 1.2,
        lineHeight: 1.08,
        textShadow: "0 5px 28px rgba(0,0,0,.65)",
        whiteSpace: "normal",
      }}
    >
      <span style={{ color: "rgba(241,237,227,.42)", fontSize: 18, marginRight: 14, verticalAlign: "middle" }}>
        {String(index + 1).padStart(2, "0")}
      </span>
      {beat.text.split(" ").map((word, wordIndex, words) => {
        const wordLocal = local - wordIndex * 3;
        const wordSpring = spring({
          frame: Math.max(0, wordLocal),
          fps,
          config: { damping: 13, stiffness: 175, mass: 0.42 },
        });
        const wordOpacity = interpolate(wordLocal, [0, 3], [0, 1], clamp);
        const wordY = interpolate(wordSpring, [0, 1], [22, 0]);
        const wordScale = interpolate(wordSpring, [0, 1], [0.88, 1]);
        const isEmphasis = wordIndex === words.length - 1;
        return (
          <span
            key={`${word}-${wordIndex}`}
            style={{
              display: "inline-block",
              opacity: wordOpacity,
              color: isEmphasis ? accent : PAPER,
              transform: `translate3d(0,${wordY}px,0) scale(${wordScale})`,
              transformOrigin: "left bottom",
              marginRight: 9,
              textShadow: isEmphasis ? `0 0 24px ${accent}55` : "none",
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};

const Scene: React.FC<{
  data: SceneData;
  index: number;
  globalStartFrame: number;
}> = ({ data, index, globalStartFrame }) => {

  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();

  // Kode Scene selanjutnya tetap seperti semula.  const entrance = spring({ frame, fps, config: { damping: 20, stiffness: 72, mass: 0.95 } });
  const opacity = interpolate(frame, [0, 15, durationInFrames - 18, durationInFrames], [0, 1, 1, 0], clamp);
  const titleY = interpolate(entrance, [0, 1], [54, 0]);
  const titleScale = interpolate(entrance, [0, 1], [0.96, 1]);
  const progress = interpolate(frame, [0, durationInFrames], [0, 1], clamp);
  const line = interpolate(frame, [8, 34], [0, 1], clamp);
  const subtitleOpacity = interpolate(frame, [25, 42], [0, 1], clamp);
  const number = String(index + 1).padStart(2, "0");
  const titleSize = data.title.length > 16 ? 76 : data.title.length > 10 ? 92 : 118;

  return (
    <AbsoluteFill style={{ backgroundColor: "#101713", color: PAPER, overflow: "hidden", opacity }}>
      <AbsoluteFill
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 50% 40%, rgba(67,83,68,.22) 0%, rgba(16,23,19,0) 55%), linear-gradient(135deg,#101713 0%,#18221C 52%,#0D1411 100%)",
        }}
      />
      <AbsoluteFill
        style={{
          opacity: 0.09,
          backgroundImage:
            "linear-gradient(rgba(229,226,211,.2) 1px, transparent 1px),linear-gradient(90deg,rgba(229,226,211,.2) 1px,transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage: "linear-gradient(180deg,black,transparent 90%)",
        }}
      />
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse at center, transparent 42%, rgba(0,0,0,.34) 100%), repeating-linear-gradient(0deg, rgba(255,255,255,.012) 0px, rgba(255,255,255,.012) 1px, transparent 1px, transparent 4px)",
          opacity: 0.72,
        }}
      />
      <div style={{ position: "absolute", left: 72, right: 72, top: 72, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ color: GOLD, fontSize: 17, fontWeight: 800, letterSpacing: 4 }}>ORION / DOCUMENTARY</div>
        <div style={{ color: MUTED, fontSize: 15, letterSpacing: 2 }}>INDONESIA • BIOGRAPHY</div>
      </div>
      <div style={{ position: "absolute", left: 72, right: 72, top: 112, height: 2, background: "rgba(215,183,122,.22)" }}>
        <div style={{ width: `${line * 100}%`, height: "100%", background: GOLD, transformOrigin: "left" }} />
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 180,
          height: 790,
          overflow: "hidden",
          transform: `translate3d(${interpolate(frame, [0, durationInFrames], [index % 2 === 0 ? 18 : -18, index % 2 === 0 ? -26 : 26], clamp)}px,${interpolate(frame, [0, durationInFrames], [index % 3 === 0 ? 8 : -6, index % 3 === 0 ? -12 : 10], clamp)}px,0) scale(${interpolate(frame, [0, durationInFrames], [1.02, 1.105], clamp)})`,
          transformOrigin: index % 2 === 0 ? "center left" : "center right",
          willChange: "transform",
        }}
      >
        <DocumentaryArt sceneIndex={index} />
      </div>

      <div style={{ position: "absolute", left: 78, right: 78, top: 1005, display: "flex", alignItems: "center", gap: 18 }}>
        <div style={{ width: 52, height: 3, background: GOLD, opacity: line }} />
        <div style={{ color: GOLD, fontSize: 18, fontWeight: 800, letterSpacing: 4 }}>{data.eyebrow}</div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 72,
          right: 72,
          top: 1070,
          fontFamily: "Arial, Helvetica, sans-serif",
          fontSize: titleSize,
          lineHeight: 0.94,
          fontWeight: 900,
          letterSpacing: -3.5,
          color: PAPER,
          textTransform: "uppercase",
          transform: `translate3d(${interpolate(frame, [0, durationInFrames], [index % 2 === 0 ? -8 : 8, 0], clamp)}px,${titleY}px,0) scale(${titleScale})`,
          transformOrigin: "left top",
          textShadow: "0 12px 50px rgba(0,0,0,.4)",
        }}
      >
        {data.title}
      </div>

      <div
  style={{
    position: "absolute",
    left: 82,
    right: 82,
    top: 1265,
    height: 115,
  }}
>
  {prabowoWords.length > 0 ? (
    <AudioSyncedTypography
      words={prabowoWords}
      globalStartFrame={globalStartFrame}
      accent={data.accent || GOLD}
    />
  ) : (
    data.beats.map((beat, i) => (
      <BeatTypography
        key={`${index}-${i}`}
        beat={beat}
        accent={data.accent || GOLD}
        index={i}
      />
    ))
  )}
</div>

      <div
        style={{
          position: "absolute",
          left: 82,
          right: 110,
          top: 1435,
          fontSize: 27,
          lineHeight: 1.38,
          fontWeight: 400,
          color: "rgba(241,237,227,.83)",
          opacity: subtitleOpacity,
          transform: `translateY(${interpolate(frame, [25, 42], [18, 0], clamp)}px)`,
          maxHeight: 170,
        }}
      >
        {data.subtitle}
      </div>

      <div style={{ position: "absolute", left: 82, right: 82, bottom: 132, height: 3, background: "rgba(241,237,227,.18)" }}>
        <div style={{ width: `${progress * 100}%`, height: "100%", background: GOLD }} />
      </div>
      <div style={{ position: "absolute", left: 82, bottom: 82, color: MUTED, fontSize: 16, letterSpacing: 3 }}>JEJAK LANGKAH / PRABOWO SUBIANTO</div>
      <div style={{ position: "absolute", right: 82, bottom: 75, color: GOLD, fontSize: 23, fontWeight: 800, letterSpacing: 2 }}>{number} / {String(project.scenes.length).padStart(2, "0")}</div>
      <div style={{ position: "absolute", right: 82, top: 175, color: "rgba(241,237,227,.25)", fontSize: 15, letterSpacing: 3, writingMode: "vertical-rl" as const }}>ARSIP • GARIS WAKTU • KONTEKS</div>
    </AbsoluteFill>
  );
};

export const MyComponent: React.FC = () => {
  let cursor = 0;
  const sequences = project.scenes.map((scene, index) => {
    const from = cursor;
    cursor += scene.durationFrames;
    return (
      <Sequence key={`${index}-${scene.title}`} from={from} durationInFrames={scene.durationFrames}>
        <Scene
  data={scene}
  index={index}
  globalStartFrame={from}
/>
      </Sequence>
    );
  });
  return (
    <AbsoluteFill style={{ backgroundColor: "#101713" }}>
      {sequences}
      {project.voiceoverSrc ? <Audio src={staticFile(project.voiceoverSrc)} volume={1} /> : null}
      {project.musicSrc ? <Audio src={staticFile(project.musicSrc)} volume={0.12} /> : null}
      {project.sfxSrc ? <Audio src={staticFile(project.sfxSrc)} volume={0.42} /> : null}
    </AbsoluteFill>
  );
};
