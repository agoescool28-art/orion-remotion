import React, { FC } from "react";
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

const formatIndex = (value: number) => (value < 10 ? `0${value}` : String(value));

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const WordBeatView: FC<{ beat: WordBeat; accent: string }> = ({ beat, accent }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - beat.start;
  const enter = spring({
    frame: Math.max(0, local),
    fps,
    config: { damping: 15, stiffness: 145, mass: 0.62 },
  });
  const opacity = interpolate(local, [0, 5, beat.duration - 7, beat.duration], [0, 1, 1, 0], clamp);
  const y = interpolate(enter, [0, 1], [34, 0]);
  const scale = interpolate(enter, [0, 1], [0.94, 1]);
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        opacity,
        transform: `translate3d(0,${y}px,0) scale(${scale})`,
        transformOrigin: "left center",
        color: accent,
        fontFamily: "Arial, Helvetica, sans-serif",
        fontSize: beat.text.length > 20 ? 39 : 47,
        fontWeight: 900,
        letterSpacing: -0.7,
        lineHeight: 1.05,
        textShadow: "0 5px 28px rgba(0,0,0,.55)",
      }}
    >
      {beat.text}
    </div>
  );
};

const Scene: FC<{ data: SceneData; index: number }> = ({ data, index }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 20, stiffness: 75, mass: 0.9 } });
  const fadeIn = interpolate(frame, [0, 18], [0, 1], clamp);
  const fadeOut = interpolate(frame, [durationInFrames - 14, durationInFrames], [1, 0], clamp);
  const zoom = interpolate(frame, [0, durationInFrames], [1.035, 1.13], clamp);
  const pan = interpolate(frame, [0, durationInFrames], [index % 2 ? 24 : -24, index % 2 ? -22 : 22], clamp);
  const titleY = interpolate(enter, [0, 1], [58, 0]);
  const titleOpacity = interpolate(frame, [5, 22], [0, 1], clamp);
  const titleSize = data.title.length > 12 ? 94 : data.title.length > 8 ? 112 : 138;
  const progress = interpolate(frame, [0, durationInFrames], [0, 1], clamp);
  const hasImage = Boolean(data.imageSrc);

  return (
    <AbsoluteFill style={{ backgroundColor: "#0B100E", color: "#F3F0E8", overflow: "hidden", opacity: fadeOut }}>
      {hasImage ? (
        <AbsoluteFill>
          <Img
            src={staticFile(data.imageSrc as string)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: data.imagePosition ?? "center",
              transform: `scale(${zoom}) translate3d(${pan}px,0,0)`,
              filter: "brightness(.68) contrast(1.08) saturate(.78)",
            }}
          />
        </AbsoluteFill>
      ) : (
        <AbsoluteFill style={{ background: "radial-gradient(ellipse at 78% 28%, rgba(216,184,120,.22), transparent 34%), linear-gradient(145deg,#1A2820 0%,#0B100E 62%,#070A09 100%)" }} />
      )}

      <AbsoluteFill style={{ background: "linear-gradient(180deg,rgba(4,8,7,.40) 0%,rgba(4,8,7,.12) 28%,rgba(4,8,7,.72) 58%,rgba(4,8,7,.96) 100%)" }} />
      <AbsoluteFill style={{ opacity: 0.10, backgroundImage: "linear-gradient(rgba(255,255,255,.16) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.16) 1px,transparent 1px)", backgroundSize: "90px 90px" }} />

      {/* Editorial frame */}
      <div style={{ position: "absolute", left: 72, right: 72, top: 78, height: 2, background: `${data.accent}B0`, transform: `scaleX(${interpolate(frame,[0,24],[0,1],clamp)})`, transformOrigin: "left" }} />
      <div style={{ position: "absolute", left: 76, top: 105, color: data.accent, fontSize: 19, fontWeight: 700, letterSpacing: 4.2, opacity: titleOpacity }}>
        {data.eyebrow}
      </div>

      {/* Chapter marker */}
      <div style={{ position: "absolute", right: 76, top: 98, color: "rgba(255,255,255,.58)", fontSize: 18, letterSpacing: 3 }}>
        {formatIndex(index + 1)} / {formatIndex(project.scenes.length)}
      </div>

      {/* Main title: intentionally constrained to safe width */}
      <div style={{ position: "absolute", left: 76, right: 76, top: "34%", opacity: titleOpacity, transform: `translate3d(0,${titleY}px,0)`, }}>
        <div style={{ width: 900, maxWidth: "100%", fontFamily: "Arial, Helvetica, sans-serif", fontSize: titleSize, fontWeight: 900, lineHeight: 0.94, letterSpacing: -4.5, overflowWrap: "anywhere", textShadow: "0 12px 55px rgba(0,0,0,.55)" }}>
          {data.title}
        </div>
        <div style={{ marginTop: 28, width: 250, height: 5, background: `linear-gradient(90deg,${data.accent},transparent)`, transform: `scaleX(${interpolate(frame,[12,34],[0,1],clamp)})`, transformOrigin: "left" }} />
      </div>

      {/* Kinetic phrase layer */}
      <div style={{ position: "absolute", left: 80, right: 80, top: "59%", height: 90 }}>
        {data.beats.map((beat, i) => <WordBeatView key={`${index}-${i}`} beat={beat} accent={data.accent} />)}
      </div>

      {/* Narrative copy */}
      <div style={{ position: "absolute", left: 82, right: 90, top: "70%", fontSize: 29, lineHeight: 1.38, fontWeight: 400, color: "rgba(243,240,232,.91)", opacity: interpolate(frame,[26,48],[0,1],clamp), transform: `translateY(${interpolate(frame,[26,48],[20,0],clamp)}px)`, textShadow: "0 3px 18px rgba(0,0,0,.75)" }}>
        {data.subtitle}
      </div>

      {/* Scene kicker */}
      {data.kicker ? (
        <div style={{ position: "absolute", left: 82, bottom: 205, color: data.accent, fontSize: 17, fontWeight: 700, letterSpacing: 3.2, opacity: interpolate(frame,[34,54],[0,1],clamp) }}>
          {data.kicker}
        </div>
      ) : null}

      {/* Footer and timeline */}
      <div style={{ position: "absolute", left: 82, right: 82, bottom: 130, height: 2, background: "rgba(255,255,255,.25)" }}>
        <div style={{ width: `${progress * 100}%`, height: "100%", background: data.accent }} />
      </div>
      <div style={{ position: "absolute", left: 82, bottom: 82, fontSize: 16, letterSpacing: 3.2, color: "rgba(243,240,232,.58)" }}>ORION / DOCUMENTARY VISUALS</div>
      <div style={{ position: "absolute", right: 82, bottom: 76, fontSize: 22, fontWeight: 700, color: data.accent, letterSpacing: 2.5 }}>{formatIndex(index + 1)}</div>
      <AbsoluteFill style={{ backgroundColor: "#050706", opacity: 1 - fadeIn, pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};

export const MyComponent: FC = () => {
  const { fps } = useVideoConfig();
  const framesPerScene = project.sceneDurationSeconds * fps;
  return (
    <AbsoluteFill style={{ backgroundColor: "#0B100E" }}>
      {project.scenes.map((scene, index) => (
        <Sequence key={`${index}-${scene.title}`} from={index * framesPerScene} durationInFrames={framesPerScene}>
          <Scene data={scene} index={index} />
        </Sequence>
      ))}
      {project.voiceoverSrc ? <Audio src={staticFile(project.voiceoverSrc)} volume={1} /> : null}
      {project.musicSrc ? <Audio src={staticFile(project.musicSrc)} volume={0.12} /> : null}
      {project.sfxSrc ? <Audio src={staticFile(project.sfxSrc)} volume={0.32} /> : null}
    </AbsoluteFill>
  );
};
