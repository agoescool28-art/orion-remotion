
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

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const assets = [
  "1000827929.jpg.jpeg",
  "1000827929.jpg.jpeg",
  "1000827929.jpg.jpeg",
  "academy-cadets.jpg",
  "1000827935.jpg.jpeg",
  "1000827941.jpg.jpeg",
  "1000827944.jpg.jpeg",
  "1000827945.jpg.jpeg",
  "1000827929.jpg.jpeg",
  "1000827944.jpg.jpeg",
  "1000827945.jpg.jpeg",
  "1000827945.jpg.jpeg",
];

const markers = [
  ["1951", "JAKARTA", "AWAL PERJALANAN"],
  ["17 OKTOBER", "1951", "JAKARTA"],
  ["SUMITRO", "KELUARGA", "LATAR BELAKANG"],
  ["1974", "AKABRI", "PENDIDIKAN MILITER"],
  ["ANGKATAN DARAT", "KOPASSUS", "KARIER MILITER"],
  ["1996", "DANJEN KOPASSUS", "1998 • PANGKOSTRAD"],
  ["REFORMASI", "1998", "TITIK BALIK"],
  ["DKP", "KONTROVERSI", "1998"],
  ["BABAK BARU", "DUNIA USAHA", "KEMBALI KE INDONESIA"],
  ["2008", "GERINDRA", "2014 • 2019"],
  ["2019", "MENTERI PERTAHANAN", "2024"],
  ["20 OKTOBER 2024", "PELANTIKAN", "PRESIDEN KE-8"],
];

const Chapter: React.FC<{
  data: SceneData;
  index: number;
  globalStartFrame: number;
}> = ({ data, index, globalStartFrame }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const entrance = spring({
    frame,
    fps,
    config: { damping: 18, stiffness: 90, mass: 0.8 },
  });

  const opacity = interpolate(
    frame,
    [0, 12, durationInFrames - 12, durationInFrames],
    [0, 1, 1, 0],
    clamp
  );

  const zoom = interpolate(
    frame,
    [0, durationInFrames],
    [1.04, 1.18],
    clamp
  );

  const pan = interpolate(
    frame,
    [0, durationInFrames],
    [index % 2 === 0 ? 20 : -20, index % 2 === 0 ? -30 : 30],
    clamp
  );

  const image = data.imageSrc || assets[index] || assets[0];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#101713",
        overflow: "hidden",
        opacity,
        color: "#F2EBDD",
      }}
    >
      <AbsoluteFill>
        <Img
          src={staticFile(image)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `translate3d(${pan}px,0,0) scale(${zoom})`,
            filter: "contrast(1.12) saturate(.78) brightness(.70)",
          }}
        />
        <AbsoluteFill
          style={{
            background:
              "linear-gradient(90deg,rgba(5,10,8,.78),rgba(5,10,8,.12) 82%),linear-gradient(0deg,rgba(5,10,8,.96),transparent 68%),linear-gradient(180deg,rgba(5,10,8,.45),transparent 38%)",
          }}
        />
      </AbsoluteFill>

      <div
        style={{
          position: "absolute",
          left: 76,
          right: 76,
          top: 78,
          display: "flex",
          justifyContent: "space-between",
          color: "#D8BD82",
          fontSize: 17,
          fontWeight: 800,
          letterSpacing: 4,
        }}
      >
        <span>ORION / DOCUMENTARY</span>
        <span>INDONESIA • BIOGRAPHY</span>
      </div>

      <div
        style={{
          position: "absolute",
          left: 82,
          right: 82,
          top: 300,
          opacity: interpolate(frame, [5, 24], [0, 1], clamp),
          transform: `translateY(${interpolate(
            entrance,
            [0, 1],
            [55, 0]
          )}px)`,
        }}
      >
        <div
          style={{
            color: "#D8BD82",
            fontSize: 18,
            fontWeight: 800,
            letterSpacing: 4,
          }}
        >
          {data.eyebrow}
        </div>

        <div
          style={{
            marginTop: 24,
            fontSize:
              data.title.length > 15
                ? 72
                : data.title.length > 10
                  ? 88
                  : 112,
            lineHeight: 0.96,
            fontWeight: 900,
            letterSpacing: -3,
            textShadow: "0 10px 42px #000",
          }}
        >
          {data.title}
        </div>

        <div
          style={{
            marginTop: 25,
            width: interpolate(frame, [14, 48], [0, 390], clamp),
            height: 4,
            background: "#D8BD82",
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          left: 82,
          right: 82,
          top: 930,
          display: "flex",
          gap: 12,
        }}
      >
        {(markers[index] || ["ARSIP", "PERJALANAN", "INDONESIA"]).map(
          (item, i) => (
            <div
              key={`${item}-${i}`}
              style={{
                flex: 1,
                minHeight: 76,
                padding: 12,
                borderTop: "2px solid #D8BD82",
                background: "rgba(8,14,11,.5)",
                color: i === 1 ? "#D8BD82" : "#F2EBDD",
                fontSize: 16,
                fontWeight: 800,
                letterSpacing: 1,
                textAlign: "center",
                display: "grid",
                placeItems: "center",
                opacity: interpolate(
                  frame,
                  [28 + i * 12, 48 + i * 12],
                  [0, 1],
                  clamp
                ),
              }}
            >
              {item}
            </div>
          )
        )}
      </div>

      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          bottom: 380,
          height: 128,
        }}
      >
        <AudioSyncedTypography
          words={prabowoWords}
          globalStartFrame={globalStartFrame}
          accent={data.accent || "#D8BD82"}
        />
      </div>

      <div
        style={{
          position: "absolute",
          left: 84,
          right: 84,
          bottom: 245,
          fontSize: 25,
          lineHeight: 1.35,
          color: "rgba(242,235,221,.92)",
          textShadow: "0 3px 20px #000",
          opacity: interpolate(frame, [28, 48], [0, 1], clamp),
        }}
      >
        {data.subtitle}
      </div>

      <div
        style={{
          position: "absolute",
          left: 82,
          right: 82,
          bottom: 118,
          height: 3,
          background: "rgba(242,235,221,.22)",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${interpolate(
              frame,
              [0, durationInFrames],
              [0, 100],
              clamp
            )}%`,
            background: "#D8BD82",
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          inset: 28,
          border: "1px solid rgba(242,235,221,.18)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          right: 82,
          bottom: 64,
          color: "#D8BD82",
          fontSize: 22,
          fontWeight: 800,
        }}
      >
        {String(index + 1).padStart(2, "0")} / 12
      </div>
    </AbsoluteFill>
  );
};

export const FullNarrative: React.FC = () => {
  let cursor = 0;

  const sequences = project.scenes.map((scene, index) => {
    const from = cursor;
    cursor += scene.durationFrames;

    return (
      <Sequence
        key={index}
        from={from}
        durationInFrames={scene.durationFrames}
      >
        <Chapter
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

      {project.voiceoverSrc && (
        <Audio
          src={staticFile(project.voiceoverSrc)}
          volume={1}
        />
      )}

      {project.musicSrc && (
        <Audio
          src={staticFile(project.musicSrc)}
          volume={0.12}
        />
      )}

      {project.sfxSrc && (
        <Audio
          src={staticFile(project.sfxSrc)}
          volume={0.42}
        />
      )}
    </AbsoluteFill>
  );
};
