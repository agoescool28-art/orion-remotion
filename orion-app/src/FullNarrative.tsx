
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

const GOLD = "#D8B878";
const PAPER = "#F2EBDD";
const BLUE = "#A8C9D9";
const GREEN = "#B8D99A";
const ROSE = "#D9A8B8";

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const chapterAssets = [
  "1000827929.jpg.jpeg",
  undefined,
  undefined,
  "academy-cadets.jpg",
  "1000827935.jpg.jpeg",
  "1000827941.jpg.jpeg",
  "1000827944.jpg.jpeg",
  "1000827945.jpg.jpeg",
  undefined,
  undefined,
  "1000827945.jpg.jpeg",
  "1000827945.jpg.jpeg",
];

const motion = (frame: number, fps: number, delay = 0) =>
  spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 17, stiffness: 110, mass: 0.7 },
  });

const rise = (frame: number, fps: number, delay = 0) =>
  interpolate(motion(frame, fps, delay), [0, 1], [75, 0], clamp);

const Visual: React.FC<{
  index: number;
  frame: number;
  duration: number;
  accent: string;
}> = ({ index, frame, duration, accent }) => {
  const { fps } = useVideoConfig();
  const progress = interpolate(
    frame,
    [5, duration * 0.78],
    [0, 1],
    clamp
  );

  const base: React.CSSProperties = {
    position: "absolute",
    left: 76,
    right: 76,
    top: 650,
    color: PAPER,
  };

  const tile = (delay: number): React.CSSProperties => ({
    border: `1px solid ${accent}88`,
    background: "rgba(4,10,9,.82)",
    padding: 24,
    transform: `translateY(${rise(frame, fps, delay)}px)`,
  });

  const heading: React.CSSProperties = {
    fontSize: 25,
    fontWeight: 900,
    letterSpacing: 3,
    color: accent,
  };

  // BAB 1 DAN 10: TIMELINE
  if (index === 0 || index === 9) {
    const points =
      index === 0
        ? ["1951", "MILITER", "NASIONAL"]
        : ["2008", "2014", "2019", "2024"];

    return (
      <AbsoluteFill>
        <div style={base}>
          <div style={heading}>GARIS WAKTU PERJALANAN</div>
          <div
            style={{
              height: 5,
              background: `${accent}55`,
              marginTop: 145,
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progress * 100}%`,
                background: accent,
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: -17,
            }}
          >
            {points.map((point, i) => (
              <div
                key={point}
                style={{
                  textAlign: "center",
                  fontSize: 22,
                  fontWeight: 900,
                  transform: `translateY(${rise(frame, fps, i * 13)}px)`,
                }}
              >
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 20,
                    background: accent,
                    margin: "0 auto 24px",
                    boxShadow: `0 0 25px ${accent}`,
                  }}
                />
                {point}
              </div>
            ))}
          </div>
        </div>
      </AbsoluteFill>
    );
  }

  // BAB 2: KELAHIRAN
  if (index === 1) {
    return (
      <AbsoluteFill>
        <div style={base}>
          <div
            style={{
              fontSize: 180,
              fontWeight: 900,
              color: accent,
              lineHeight: 0.9,
            }}
          >
            17
          </div>
          <div style={{ fontSize: 42, letterSpacing: 8 }}>
            OKTOBER 1951
          </div>

          <div
            style={{
              ...tile(20),
              marginTop: 55,
              height: 270,
              position: "relative",
            }}
          >
            <div
              style={{
                fontSize: 90,
                color: accent,
                position: "absolute",
                right: 25,
                top: 10,
              }}
            >
              ◎
            </div>
            <div
              style={{
                position: "absolute",
                bottom: 25,
                left: 25,
                fontSize: 36,
                letterSpacing: 8,
              }}
            >
              JAKARTA
            </div>
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                height: 6,
                width: `${progress * 100}%`,
                background: accent,
              }}
            />
          </div>
        </div>
      </AbsoluteFill>
    );
  }

  // BAB 3: LATAR KELUARGA
  if (index === 2) {
    return (
      <AbsoluteFill>
        <div style={base}>
          <div style={{ ...heading, textAlign: "center" }}>
            LATAR KELUARGA
          </div>

          <div
            style={{
              margin: "35px auto",
              width: 230,
              height: 145,
              border: `2px solid ${accent}`,
              borderRadius: 100,
              display: "grid",
              placeItems: "center",
              fontSize: 25,
            }}
          >
            SUMITRO
          </div>

          <div
            style={{
              height: 95,
              width: 2,
              background: accent,
              margin: "auto",
              transform: `scaleY(${progress})`,
              transformOrigin: "top",
            }}
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 18,
            }}
          >
            {["EKONOM", "TOKOH PEMERINTAHAN"].map((item, i) => (
              <div
                key={item}
                style={{
                  ...tile(i * 12),
                  textAlign: "center",
                  fontSize: 23,
                  fontWeight: 900,
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </AbsoluteFill>
    );
  }

  // BAB 4 DAN 5: PENDIDIKAN DAN KARIER
  if (index === 3 || index === 4) {
    const items =
      index === 3
        ? ["PENDIDIKAN", "DISIPLIN", "PENGABDIAN"]
        : ["ANGKATAN DARAT", "PASUKAN KHUSUS", "KOPASSUS"];

    return (
      <AbsoluteFill>
        <div style={{ ...base, top: 690 }}>
          <div style={heading}>
            {index === 3 ? "AKABRI • 1974" : "JALUR KARIER MILITER"}
          </div>

          <div
            style={{
              height: 360,
              display: "flex",
              alignItems: "end",
              gap: 18,
              marginTop: 50,
            }}
          >
            {items.map((item, i) => (
              <div
                key={item}
                style={{
                  flex: 1,
                  ...tile(i * 15),
                  height: `${55 + i * 18}%`,
                  display: "flex",
                  alignItems: "end",
                  justifyContent: "center",
                  textAlign: "center",
                  fontSize: 21,
                  fontWeight: 900,
                  borderTop: `5px solid ${accent}`,
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </AbsoluteFill>
    );
  }

  // BAB 6 DAN 7: JABATAN DAN REFORMASI
  if (index === 5 || index === 6) {
    const items =
      index === 5
        ? ["DANJEN KOPASSUS", "PANGKOSTRAD"]
        : ["PERUBAHAN POLITIK", "MEI 1998", "TITIK BALIK"];

    return (
      <AbsoluteFill>
        <div style={base}>
          <div style={{ fontSize: 110, fontWeight: 900, color: accent }}>
            {index === 5 ? "1996 — 1998" : "REFORMASI"}
          </div>

          <div
            style={{
              height: 5,
              background: `${accent}55`,
              margin: "40px 0",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progress * 100}%`,
                background: accent,
              }}
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${items.length}, 1fr)`,
              gap: 14,
            }}
          >
            {items.map((item, i) => (
              <div
                key={item}
                style={{
                  ...tile(i * 14),
                  minHeight: 170,
                  display: "grid",
                  placeItems: "center",
                  textAlign: "center",
                  fontSize: 21,
                  fontWeight: 900,
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </AbsoluteFill>
    );
  }

  // BAB 8: KONTROVERSI SEJARAH
  if (index === 7) {
    const items = [
      "DEWAN KEHORMATAN PERWIRA",
      "KONTROVERSI PENCULIKAN AKTIVIS",
      "DUGAAN PELANGGARAN HAM",
      "BANTAHAN PRABOWO",
    ];

    return (
      <AbsoluteFill>
        <div style={{ ...base, top: 625 }}>
          <div style={heading}>ARSIP • CATATAN SEJARAH</div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
              marginTop: 35,
            }}
          >
            {items.map((item, i) => (
              <div
                key={item}
                style={{
                  ...tile(i * 10),
                  height: 190,
                  display: "flex",
                  alignItems: "end",
                  fontSize: 21,
                  fontWeight: 900,
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </AbsoluteFill>
    );
  }

  // BAB 9: BABAK BARU
  if (index === 8) {
    return (
      <AbsoluteFill>
        <div style={{ ...base, top: 690 }}>
          <div style={heading}>PERUBAHAN BABAK KEHIDUPAN</div>

          <div style={{ display: "flex", gap: 14, marginTop: 55 }}>
            {["MILITER", "DUNIA USAHA", "KEHIDUPAN PUBLIK"].map(
              (item, i) => (
                <div
                  key={item}
                  style={{
                    ...tile(i * 15),
                    flex: 1,
                    minHeight: 190,
                    display: "grid",
                    placeItems: "center",
                    textAlign: "center",
                    fontSize: 21,
                    fontWeight: 900,
                  }}
                >
                  {item}
                </div>
              )
            )}
          </div>
        </div>
      </AbsoluteFill>
    );
  }

  // BAB 11: MENTERI PERTAHANAN
  if (index === 10) {
    return (
      <AbsoluteFill>
        <div style={base}>
          <div style={{ fontSize: 115, fontWeight: 900, color: accent }}>
            2019
          </div>

          <div style={{ ...tile(15), marginTop: 20 }}>
            <div style={{ fontSize: 37, fontWeight: 900 }}>
              MENTERI PERTAHANAN
            </div>
            <div
              style={{
                height: 5,
                background: accent,
                marginTop: 35,
                width: `${progress * 100}%`,
              }}
            />
            <div style={{ fontSize: 22, marginTop: 25 }}>
              KEMENTERIAN PERTAHANAN REPUBLIK INDONESIA
            </div>
          </div>
        </div>
      </AbsoluteFill>
    );
  }

  // BAB 12: PRESIDEN
  return (
    <AbsoluteFill>
      <div style={{ ...base, top: 590, textAlign: "center" }}>
        <div style={{ fontSize: 25, color: accent, letterSpacing: 5 }}>
          20 OKTOBER 2024
        </div>
        <div style={{ fontSize: 112, fontWeight: 900, marginTop: 35 }}>
          PRESIDEN
        </div>
        <div style={{ fontSize: 165, fontWeight: 900, color: accent }}>
          KE-8
        </div>
        <div
          style={{
            width: 250,
            height: 250,
            border: `2px solid ${accent}`,
            borderRadius: 150,
            display: "grid",
            placeItems: "center",
            fontSize: 68,
            margin: "35px auto",
            transform: `scale(${0.8 + progress * 0.2})`,
          }}
        >
          RI
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Chapter: React.FC<{
  data: SceneData;
  index: number;
  start: number;
}> = ({ data, index, start }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const enter = motion(frame, fps);
  const zoom = interpolate(
    frame,
    [0, durationInFrames],
    [1.02, 1.105],
    clamp
  );

  const pan = interpolate(
    frame,
    [0, durationInFrames],
    [index % 2 ? 20 : -20, index % 2 ? -25 : 25],
    clamp
  );

  const asset = data.imageSrc || chapterAssets[index];
  const accent = data.accent || GOLD;

  const beat = data.beats.find(
    (item) =>
      frame >= item.start &&
      frame < item.start + item.duration
  );

  return (
    <AbsoluteFill
      style={{
        background: "#09100e",
        color: PAPER,
        overflow: "hidden",
      }}
    >
      {asset ? (
        <AbsoluteFill>
          <Img
            src={staticFile(asset)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: `translate3d(${pan}px,0,0) scale(${zoom})`,
              filter: "brightness(.38) contrast(1.12) saturate(.72)",
            }}
          />
          <AbsoluteFill
            style={{
              background:
                "linear-gradient(90deg,#030807cc,#03080733),linear-gradient(0deg,#030807 0%,transparent 75%),linear-gradient(180deg,#030807aa,transparent 45%)",
            }}
          />
        </AbsoluteFill>
      ) : (
        <AbsoluteFill
          style={{
            background:
              "radial-gradient(ellipse at 75% 38%,#263b34 0%,#101b18 38%,#060b0a 78%)",
          }}
        />
      )}

      <div
        style={{
          position: "absolute",
          top: 75,
          left: 75,
          right: 75,
          display: "flex",
          justifyContent: "space-between",
          fontSize: 16,
          letterSpacing: 4,
          color: accent,
          fontWeight: 800,
        }}
      >
        <span>ORION / DOCUMENTARY</span>
        <span>INDONESIA • BIOGRAPHY</span>
      </div>

      <div
        style={{
          position: "absolute",
          top: 265,
          left: 80,
          right: 80,
          transform: `translateY(${interpolate(
            enter,
            [0, 1],
            [45, 0],
            clamp
          )}px)`,
        }}
      >
        <div
          style={{
            fontSize: 18,
            letterSpacing: 4,
            color: accent,
            fontWeight: 800,
          }}
        >
          {data.eyebrow}
        </div>

        <div
          style={{
            fontSize: data.title.length > 14 ? 68 : 100,
            lineHeight: 0.98,
            fontWeight: 900,
            letterSpacing: -2,
            marginTop: 20,
            textShadow: "0 8px 35px #000",
          }}
        >
          {data.title}
        </div>

        <div
          style={{
            height: 4,
            width: interpolate(frame, [8, 38], [0, 380], clamp),
            background: accent,
            marginTop: 24,
          }}
        />
      </div>

      <Visual
        index={index}
        frame={frame}
        duration={durationInFrames}
        accent={accent}
      />

      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          bottom: 390,
          height: 125,
        }}
      >
        <AudioSyncedTypography
          words={prabowoWords}
          globalStartFrame={start}
          accent={accent}
        />
      </div>

      <div
        style={{
          position: "absolute",
          left: 82,
          right: 82,
          bottom: 235,
          fontSize: 23,
          lineHeight: 1.4,
          textShadow: "0 3px 18px #000",
        }}
      >
        {beat?.text || data.subtitle}
      </div>

      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          bottom: 115,
          height: 3,
          background: "#ffffff33",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${(frame / durationInFrames) * 100}%`,
            background: accent,
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          inset: 26,
          border: "1px solid #ffffff22",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          right: 80,
          bottom: 60,
          color: accent,
          fontSize: 20,
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
        <Chapter data={scene} index={index} start={from} />
      </Sequence>
    );
  });

  return (
    <AbsoluteFill style={{ background: "#090f0d" }}>
      {sequences}
      <Audio src={staticFile(project.voiceoverSrc)} volume={1} />
    </AbsoluteFill>
  );
};
