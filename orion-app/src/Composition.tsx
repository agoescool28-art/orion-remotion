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

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const BG = "#160F0D";
const PAPER = "#F7F7F3";
const CYAN = "#53D7E5";
const ORANGE = "#FF9C52";
const INK = "#171B1D";
const MUTED = "#B6B1AA";

const PhraseCaption: React.FC<{ beat: WordBeat }> = ({ beat }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - beat.start;
  const fade = interpolate(local, [0, 5, beat.duration - 6, beat.duration], [0, 1, 1, 0], clamp);
  const words = beat.text.trim().split(/\s+/);

  return (
    <div
      style={{
        position: "absolute",
        left: 72,
        right: 72,
        top: 1500,
        minHeight: 170,
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        opacity: fade,
        textAlign: "center",
        fontFamily: "Arial, Helvetica, sans-serif",
        fontSize: beat.text.length > 28 ? 43 : beat.text.length > 18 ? 50 : 58,
        lineHeight: 1.08,
        fontWeight: 900,
        letterSpacing: -1.1,
        color: PAPER,
        textShadow: "0 4px 24px rgba(0,0,0,.6)",
      }}
    >
      <div style={{ maxWidth: 930 }}>
        {words.map((word, wordIndex) => {
          const wordLocal = local - wordIndex * 3;
          const enter = spring({
            frame: Math.max(0, wordLocal),
            fps,
            config: { damping: 14, stiffness: 165, mass: 0.42 },
          });
          const opacity = interpolate(wordLocal, [0, 3], [0, 1], clamp);
          const y = interpolate(enter, [0, 1], [24, 0]);
          const scale = interpolate(enter, [0, 1], [0.9, 1]);
          const isAccent = wordIndex === words.length - 1 || wordIndex === 0;
          return (
            <span
              key={`${word}-${wordIndex}`}
              style={{
                display: "inline-block",
                margin: "0 7px 7px",
                opacity,
                color: isAccent ? CYAN : PAPER,
                transform: `translate3d(0,${y}px,0) scale(${scale})`,
                textShadow: isAccent ? "0 0 22px rgba(83,215,229,.28)" : "none",
              }}
            >
              {word}
            </span>
          );
        })}
      </div>
    </div>
  );
};

const Scene: React.FC<{ data: SceneData; index: number }> = ({ data, index }) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 18, stiffness: 78, mass: 0.8 } });
  const sceneOpacity = interpolate(frame, [0, 12, durationInFrames - 14, durationInFrames], [0, 1, 1, 0], clamp);
  const progress = interpolate(frame, [0, durationInFrames], [0, 1], clamp);
  const artScale = interpolate(frame, [0, durationInFrames], [1.015, 1.075], clamp);
  const artX = interpolate(frame, [0, durationInFrames], [index % 2 === 0 ? -14 : 14, index % 2 === 0 ? 18 : -18], clamp);
  const cardY = interpolate(enter, [0, 1], [44, 0]);
  const cardOpacity = interpolate(frame, [8, 24], [0, 1], clamp);
  const titleSize = data.title.length > 16 ? 66 : data.title.length > 10 ? 78 : 94;
  const sceneNo = String(index + 1).padStart(2, "0");

  return (
    <AbsoluteFill style={{ backgroundColor: BG, color: PAPER, overflow: "hidden", opacity: sceneOpacity }}>
      {/* Warm technical-grid background */}
      <AbsoluteFill
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 50% 42%, rgba(111,67,45,.25) 0%, rgba(22,15,13,0) 62%), linear-gradient(145deg,#1B120F 0%,#160F0D 55%,#100B09 100%)",
        }}
      />
      <AbsoluteFill
        style={{
          opacity: 0.17,
          backgroundImage:
            "linear-gradient(rgba(218,190,165,.18) 1px, transparent 1px),linear-gradient(90deg,rgba(218,190,165,.18) 1px,transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage: "linear-gradient(180deg,rgba(0,0,0,.95),rgba(0,0,0,.25) 75%,transparent)",
        }}
      />
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background: "radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,.48) 100%)",
        }}
      />

      {/* Compact editorial header */}
      <div style={{ position: "absolute", top: 48, left: 54, right: 54, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 30, height: 30, borderRadius: 7, background: ORANGE, transform: "rotate(8deg)", boxShadow: "0 0 22px rgba(255,156,82,.25)" }} />
          <div>
            <div style={{ fontSize: 17, fontWeight: 900, letterSpacing: 2.8, color: PAPER }}>ORION / STORY LAB</div>
            <div style={{ marginTop: 3, fontSize: 10, letterSpacing: 2.4, color: MUTED }}>BIOGRAPHY • INDONESIA</div>
          </div>
        </div>
        <div style={{ color: CYAN, fontSize: 17, fontWeight: 900, letterSpacing: 2 }}>BAB {sceneNo}</div>
      </div>

      {/* Main artwork stage */}
      <div
        style={{
          position: "absolute",
          left: 34,
          right: 34,
          top: 128,
          height: 850,
          overflow: "hidden",
          borderRadius: 20,
          border: "1px solid rgba(255,255,255,.12)",
          background: "rgba(0,0,0,.16)",
          boxShadow: "0 24px 70px rgba(0,0,0,.38)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: -24,
            transform: `translate3d(${artX}px,0,0) scale(${artScale})`,
            transformOrigin: index % 2 === 0 ? "center left" : "center right",
          }}
        >
          <DocumentaryArt sceneIndex={index} />
        </div>
        <div style={{ position: "absolute", left: 22, top: 22, padding: "9px 13px", borderRadius: 6, background: "rgba(15,12,11,.78)", color: CYAN, fontSize: 13, fontWeight: 800, letterSpacing: 1.8 }}>
          KONTEKS SEJARAH
        </div>
        <div style={{ position: "absolute", right: 22, top: 22, padding: "9px 13px", borderRadius: 6, background: "rgba(15,12,11,.78)", color: ORANGE, fontSize: 13, fontWeight: 800, letterSpacing: 1.8 }}>
          ARSIP • LINIMASA
        </div>
        {/* Technical callout accents, used as graphic language rather than fabricated facts */}
        <div style={{ position: "absolute", left: 28, bottom: 64, width: 112, height: 2, background: CYAN, opacity: 0.9 }} />
        <div style={{ position: "absolute", left: 136, bottom: 58, width: 12, height: 12, borderRadius: 12, background: CYAN, boxShadow: "0 0 16px rgba(83,215,229,.7)" }} />
        <div style={{ position: "absolute", right: 28, bottom: 64, width: 86, height: 2, background: ORANGE, opacity: 0.9 }} />
      </div>

      {/* White information card: visual hierarchy inspired by the reference */}
      <div
        style={{
          position: "absolute",
          left: 54,
          right: 54,
          top: 1010,
          minHeight: 330,
          padding: "34px 38px 30px",
          boxSizing: "border-box",
          borderRadius: 18,
          background: PAPER,
          color: INK,
          boxShadow: "0 22px 52px rgba(0,0,0,.38)",
          transform: `translate3d(0,${cardY}px,0)`,
          opacity: cardOpacity,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <div style={{ color: "#327F88", fontSize: 15, fontWeight: 900, letterSpacing: 2.1 }}>{data.eyebrow}</div>
          <div style={{ color: "#A75A2E", fontSize: 14, fontWeight: 900, letterSpacing: 1.4 }}>ORION / {sceneNo}</div>
        </div>
        <div
          style={{
            fontFamily: "Arial, Helvetica, sans-serif",
            fontSize: titleSize,
            lineHeight: 0.98,
            fontWeight: 900,
            letterSpacing: -2.8,
            textTransform: "uppercase",
            color: INK,
          }}
        >
          {data.title}
        </div>
        <div style={{ height: 3, width: 104, marginTop: 22, marginBottom: 19, background: `linear-gradient(90deg,${CYAN} 0 62%,${ORANGE} 62% 100%)` }} />
        <div style={{ fontSize: 25, lineHeight: 1.28, fontWeight: 600, color: "#3E4548", maxHeight: 100, overflow: "hidden" }}>
          {data.subtitle}
        </div>
      </div>

      {/* Phrase caption: large, centered, word-by-word */}
      {data.beats.map((beat, i) => (
        <PhraseCaption key={`${index}-${i}`} beat={beat} />
      ))}

      {/* Footer progress */}
      <div style={{ position: "absolute", left: 54, right: 54, bottom: 70, height: 4, borderRadius: 4, background: "rgba(255,255,255,.18)" }}>
        <div style={{ width: `${progress * 100}%`, height: "100%", borderRadius: 4, background: `linear-gradient(90deg,${CYAN},${ORANGE})` }} />
      </div>
      <div style={{ position: "absolute", left: 54, bottom: 35, color: MUTED, fontSize: 12, letterSpacing: 2.2 }}>JEJAK LANGKAH • PRABOWO SUBIANTO</div>
      <div style={{ position: "absolute", right: 54, bottom: 30, color: CYAN, fontSize: 16, fontWeight: 900, letterSpacing: 2 }}>{sceneNo} / {String(project.scenes.length).padStart(2, "0")}</div>
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
        <Scene data={scene} index={index} />
      </Sequence>
    );
  });

  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      {sequences}
      {project.voiceoverSrc ? <Audio src={staticFile(project.voiceoverSrc)} volume={1} /> : null}
      {project.musicSrc ? <Audio src={staticFile(project.musicSrc)} volume={0.12} /> : null}
      {project.sfxSrc ? <Audio src={staticFile(project.sfxSrc)} volume={0.42} /> : null}
    </AbsoluteFill>
  );
};
