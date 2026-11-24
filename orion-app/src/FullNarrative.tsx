
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

/* =========================================================
   ORION FULL NARRATIVE — EXTREME VISUAL REBUILD
   1080 x 1920 | 30 FPS
   Voiceover and word synchronization remain unchanged.
========================================================= */

const C = {
  gold: "#D8B878",
  paper: "#F2EBDD",
  muted: "#A7A69D",
  dark: "#080D0C",
  red: "#A94D42",
  blue: "#91BFD2",
  green: "#A8C99A",
  rose: "#D5A1AA",
};

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const ease = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], clamp);

const pop = (frame: number, fps: number, delay = 0) =>
  spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 16, stiffness: 105, mass: 0.7 },
  });

const rise = (frame: number, fps: number, delay = 0) =>
  interpolate(pop(frame, fps, delay), [0, 1], [90, 0], clamp);

const fade = (frame: number, delay = 0) =>
  ease(frame, delay, delay + 18);

const lineStyle = (color: string): React.CSSProperties => ({
  height: 3,
  background: color,
  boxShadow: `0 0 18px ${color}88`,
});

/* =========================================================
   REUSABLE MOTION COMPONENTS
========================================================= */

const Kicker: React.FC<{ children: React.ReactNode; color: string }> = ({
  children,
  color,
}) => (
  <div
    style={{
      color,
      fontSize: 17,
      letterSpacing: 5,
      fontWeight: 800,
      textTransform: "uppercase",
    }}
  >
    {children}
  </div>
);

const MotionCard: React.FC<{
  frame: number;
  fps: number;
  delay?: number;
  color: string;
  children: React.ReactNode;
}> = ({ frame, fps, delay = 0, color, children }) => (
  <div
    style={{
      border: `1px solid ${color}88`,
      background: "linear-gradient(135deg,#17201dcc,#080d0bee)",
      padding: 25,
      opacity: fade(frame, delay),
      transform: `translateY(${rise(frame, fps, delay)}px)`,
      boxShadow: "0 20px 55px #0006",
    }}
  >
    {children}
  </div>
);

const MovingLine: React.FC<{
  frame: number;
  delay?: number;
  color: string;
}> = ({ frame, delay = 0, color }) => (
  <div
    style={{
      ...lineStyle(color),
      width: `${ease(frame, delay, delay + 35) * 100}%`,
    }}
  />
);

const NumberDisplay: React.FC<{
  value: string;
  frame: number;
  color: string;
  size?: number;
}> = ({ value, frame, color, size = 110 }) => (
  <div
    style={{
      fontSize: size,
      fontWeight: 900,
      lineHeight: 0.95,
      color,
      opacity: fade(frame),
      transform: `translateY(${interpolate(frame, [0, 22], [65, 0], clamp)}px)`,
      textShadow: `0 12px 45px #000`,
    }}
  >
    {value}
  </div>
);

/* =========================================================
   CHAPTER VISUAL STORYTELLING
========================================================= */

const ChapterVisual: React.FC<{
  index: number;
  frame: number;
  duration: number;
  accent: string;
}> = ({ index, frame, duration, accent }) => {
  const { fps } = useVideoConfig();
  const progress = ease(frame, 8, duration * 0.82);

  const left = 76;
  const right = 76;

  const label: React.CSSProperties = {
    fontSize: 22,
    fontWeight: 900,
    letterSpacing: 2,
    color: C.paper,
  };

  /* 01 — OPENING: A JOURNEY THROUGH TIME */
  if (index === 0) {
    const milestones = [
      ["1951", "KELAHIRAN"],
      ["1974", "AKABRI"],
      ["1998", "TITIK BALIK"],
      ["2024", "PRESIDEN"],
    ];

    return (
      <AbsoluteFill>
        <div style={{ position: "absolute", left, right, top: 720 }}>
          <Kicker color={accent}>A LIFE IN FOUR CHAPTERS</Kicker>
          <div style={{ marginTop: 32 }}>
            <NumberDisplay value="73 TAHUN" frame={frame} color={accent} size={100} />
          </div>

          <div style={{ marginTop: 85, position: "relative" }}>
            <div style={{ height: 4, background: "#ffffff25" }}>
              <MovingLine frame={frame} color={accent} />
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4,1fr)",
                marginTop: 28,
                gap: 8,
              }}
            >
              {milestones.map(([year, title], i) => (
                <div
                  key={year}
                  style={{
                    opacity: fade(frame, i * 13),
                    transform: `translateY(${rise(frame, fps, i * 13)}px)`,
                  }}
                >
                  <div
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: 20,
                      background: accent,
                      boxShadow: `0 0 25px ${accent}`,
                      marginBottom: 20,
                    }}
                  />
                  <div style={{ color: accent, fontSize: 28, fontWeight: 900 }}>
                    {year}
                  </div>
                  <div style={{ color: C.paper, fontSize: 15, marginTop: 10 }}>
                    {title}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </AbsoluteFill>
    );
  }

  /* 02 — BIRTH: JAKARTA */
  if (index === 1) {
    return (
      <AbsoluteFill>
        <div style={{ position: "absolute", left, right, top: 690 }}>
          <Kicker color={accent}>THE BEGINNING</Kicker>
          <NumberDisplay value="1951" frame={frame} color={accent} size={170} />
          <div style={{ ...label, marginTop: 20 }}>17 OKTOBER</div>

          <svg
            width="100%"
            height="450"
            viewBox="0 0 900 450"
            style={{ marginTop: 45 }}
          >
            <path
              d="M70 300 L200 250 L300 290 L410 150 L540 210 L680 90 L830 170"
              fill="none"
              stroke={accent}
              strokeWidth="5"
              strokeDasharray="1100"
              strokeDashoffset={1100 * (1 - progress)}
            />
            <circle
              cx={680}
              cy={90}
              r={14 + progress * 13}
              fill={accent}
              opacity={0.95}
            />
            <circle
              cx={680}
              cy={90}
              r={48 + progress * 30}
              fill="none"
              stroke={accent}
              strokeWidth="2"
              opacity={0.4}
            />
            <text x="560" y="180" fill={C.paper} fontSize="34" fontWeight="bold">
              JAKARTA
            </text>
            <text x="560" y="225" fill={accent} fontSize="19">
              INDONESIA
            </text>
          </svg>

          <MotionCard frame={frame} fps={fps} delay={28} color={accent}>
            <div style={{ fontSize: 30, fontWeight: 900 }}>
              PRABOWO SUBIANTO
            </div>
            <div style={{ color: C.muted, fontSize: 20, marginTop: 12 }}>
              Lahir di Jakarta, 17 Oktober 1951
            </div>
          </MotionCard>
        </div>
      </AbsoluteFill>
    );
  }

  /* 03 — FAMILY BACKGROUND */
  if (index === 2) {
    return (
      <AbsoluteFill>
        <div style={{ position: "absolute", left, right, top: 700 }}>
          <Kicker color={accent}>FAMILY & BACKGROUND</Kicker>

          <MotionCard frame={frame} fps={fps} color={accent}>
            <div style={{ fontSize: 19, letterSpacing: 4, color: accent }}>
              GENERASI KELUARGA
            </div>
            <div style={{ fontSize: 48, fontWeight: 900, marginTop: 22 }}>
              SUMITRO
            </div>
            <div style={{ fontSize: 22, color: C.muted, marginTop: 10 }}>
              DJOJOHADIKUSUMO
            </div>
          </MotionCard>

          <div style={{ display: "flex", justifyContent: "center", height: 115 }}>
            <div
              style={{
                width: 3,
                height: `${progress * 100}%`,
                background: accent,
              }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
            <MotionCard frame={frame} fps={fps} delay={18} color={accent}>
              <div style={{ fontSize: 27, fontWeight: 900 }}>EKONOM</div>
            </MotionCard>
            <MotionCard frame={frame} fps={fps} delay={32} color={accent}>
              <div style={{ fontSize: 27, fontWeight: 900 }}>TOKOH PEMERINTAHAN</div>
            </MotionCard>
          </div>

          <div style={{ color: C.muted, fontSize: 20, marginTop: 35 }}>
            Latar keluarga dan lingkungan intelektual
          </div>
        </div>
      </AbsoluteFill>
    );
  }

  /* 04 — MILITARY ACADEMY */
  if (index === 3) {
    return (
      <AbsoluteFill>
        <div style={{ position: "absolute", left, right, top: 720 }}>
          <Kicker color={accent}>MILITARY EDUCATION</Kicker>
          <NumberDisplay value="AKABRI" frame={frame} color={accent} size={115} />

          <div style={{ marginTop: 60, display: "flex", gap: 12, alignItems: "end", height: 330 }}>
            {[45, 72, 58, 90, 67, 100, 75].map((height, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: `${height * progress}%`,
                  minHeight: 5,
                  background: `linear-gradient(180deg,${accent},#526d70)`,
                  opacity: 0.35 + i * 0.08,
                  transform: `translateY(${rise(frame, fps, i * 8)}px)`,
                }}
              />
            ))}
          </div>

          <MotionCard frame={frame} fps={fps} delay={24} color={accent}>
            <div style={{ fontSize: 55, fontWeight: 900 }}>1974</div>
            <div style={{ fontSize: 24, marginTop: 12 }}>
              LULUS AKADEMI ANGKATAN BERSENJATA
            </div>
          </MotionCard>
        </div>
      </AbsoluteFill>
    );
  }

  /* 05 — KOPASSUS */
  if (index === 4) {
    return (
      <AbsoluteFill>
        <div style={{ position: "absolute", left, right, top: 700 }}>
          <Kicker color={accent}>MILITARY CAREER</Kicker>
          <NumberDisplay value="KOPASSUS" frame={frame} color={accent} size={83} />

          <div style={{ marginTop: 70, display: "grid", gap: 18 }}>
            {[
              ["01", "ANGKATAN DARAT"],
              ["02", "PASUKAN KHUSUS"],
              ["03", "KOPASSUS"],
            ].map(([number, title], i) => (
              <MotionCard
                key={number}
                frame={frame}
                fps={fps}
                delay={i * 20}
                color={accent}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 25 }}>
                  <div style={{ fontSize: 45, color: accent, fontWeight: 900 }}>
                    {number}
                  </div>
                  <div style={{ fontSize: 27, fontWeight: 900 }}>{title}</div>
                </div>
              </MotionCard>
            ))}
          </div>
        </div>
      </AbsoluteFill>
    );
  }

  /* 06 — STRATEGIC POSITIONS */
  if (index === 5) {
    return (
      <AbsoluteFill>
        <div style={{ position: "absolute", left, right, top: 710 }}>
          <Kicker color={accent}>STRATEGIC POSITIONS</Kicker>
          <NumberDisplay value="1996—1998" frame={frame} color={accent} size={95} />

          <div style={{ marginTop: 70, borderLeft: `4px solid ${accent}`, paddingLeft: 35 }}>
            {[
              ["1996", "DANJEN KOPASSUS"],
              ["1998", "PANGKOSTRAD"],
            ].map(([year, title], i) => (
              <div
                key={year}
                style={{
                  marginBottom: 65,
                  opacity: fade(frame, i * 30),
                  transform: `translateX(${interpolate(frame, [i * 30, i * 30 + 24], [100, 0], clamp)}px)`,
                }}
              >
                <div style={{ color: accent, fontSize: 48, fontWeight: 900 }}>
                  {year}
                </div>
                <div style={{ fontSize: 31, fontWeight: 900, marginTop: 12 }}>
                  {title}
                </div>
                <MovingLine frame={frame} delay={i * 30 + 10} color={accent} />
              </div>
            ))}
          </div>
        </div>
      </AbsoluteFill>
    );
  }

  /* 07 — REFORMASI */
  if (index === 6) {
    return (
      <AbsoluteFill>
        <div style={{ position: "absolute", left, right, top: 700 }}>
          <Kicker color={accent}>INDONESIA • 1998</Kicker>
          <NumberDisplay value="REFORMASI" frame={frame} color={accent} size={85} />

          <div
            style={{
              marginTop: 65,
              height: 360,
              border: `1px solid ${accent}88`,
              position: "relative",
              overflow: "hidden",
              background: "linear-gradient(145deg,#3b1c1c,#111)",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `repeating-linear-gradient(0deg,transparent 0px,transparent 35px,${accent}18 36px)`,
                transform: `translateY(${progress * 90}px)`,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 30,
                bottom: 40,
                fontSize: 90,
                fontWeight: 900,
                color: accent,
              }}
            >
              1998
            </div>
            <div
              style={{
                position: "absolute",
                top: 35,
                right: 35,
                fontSize: 20,
                letterSpacing: 4,
              }}
            >
              A TURNING POINT
            </div>
          </div>

          <div style={{ display: "grid", gap: 15, marginTop: 35 }}>
            {["SOEHARTO MUNDUR", "PANGKOSTRAD DICOPOT"].map((item, i) => (
              <MotionCard key={item} frame={frame} fps={fps} delay={i * 24} color={accent}>
                <div style={{ fontSize: 25, fontWeight: 900 }}>{item}</div>
              </MotionCard>
            ))}
          </div>
        </div>
      </AbsoluteFill>
    );
  }

  /* 08 — HISTORICAL CONTROVERSY */
  if (index === 7) {
    const items = [
      "DEWAN KEHORMATAN PERWIRA",
      "KONTROVERSI PENCULIKAN AKTIVIS",
      "DUGAAN PELANGGARAN HAM",
      "BANTAHAN PRABOWO",
    ];

    return (
      <AbsoluteFill>
        <div style={{ position: "absolute", left, right, top: 660 }}>
          <Kicker color={accent}>HISTORICAL RECORD</Kicker>
          <NumberDisplay value="ARSIP 1998" frame={frame} color={accent} size={86} />

          <div style={{ marginTop: 50, display: "grid", gap: 14 }}>
            {items.map((item, i) => (
              <MotionCard
                key={item}
                frame={frame}
                fps={fps}
                delay={i * 18}
                color={accent}
              >
                <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
                  <div style={{ color: accent, fontSize: 36, fontWeight: 900 }}>
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div style={{ fontSize: 23, fontWeight: 800 }}>{item}</div>
                </div>
              </MotionCard>
            ))}
          </div>

          <div style={{ color: C.muted, fontSize: 18, marginTop: 25, lineHeight: 1.5 }}>
            Catatan sejarah perlu dibaca secara kritis dengan membedakan
            keputusan institusional, dugaan, dan bantahan.
          </div>
        </div>
      </AbsoluteFill>
    );
  }

  /* 09 — TRANSFORMATION */
  if (index === 8) {
    return (
      <AbsoluteFill>
        <div style={{ position: "absolute", left, right, top: 720 }}>
          <Kicker color={accent}>A NEW CHAPTER</Kicker>
          <NumberDisplay value="TRANSFORMASI" frame={frame} color={accent} size={74} />

          <div style={{ marginTop: 65, display: "grid", gap: 18 }}>
            {[
              ["MILITER", "MASA LALU"],
              ["DUNIA USAHA", "BABAK BARU"],
              ["KEHIDUPAN PUBLIK", "KEMBALI KE INDONESIA"],
            ].map(([title, desc], i) => (
              <MotionCard key={title} frame={frame} fps={fps} delay={i * 22} color={accent}>
                <div style={{ fontSize: 29, fontWeight: 900 }}>{title}</div>
                <div style={{ color: accent, marginTop: 12, fontSize: 18 }}>
                  {desc}
                </div>
              </MotionCard>
            ))}
          </div>
        </div>
      </AbsoluteFill>
    );
  }

  /* 10 — POLITICAL JOURNEY */
  if (index === 9) {
    return (
      <AbsoluteFill>
        <div style={{ position: "absolute", left, right, top: 700 }}>
          <Kicker color={accent}>POLITICAL JOURNEY</Kicker>
          <NumberDisplay value="GERINDRA" frame={frame} color={accent} size={105} />

          <div style={{ marginTop: 65, position: "relative", paddingLeft: 35 }}>
            <div
              style={{
                position: "absolute",
                left: 8,
                top: 5,
                bottom: 0,
                width: 3,
                background: `${accent}55`,
              }}
            />
            {[
              ["2008", "PENDIRIAN GERINDRA"],
              ["2009", "CALON WAKIL PRESIDEN"],
              ["2014", "KONTES PEMILIHAN PRESIDEN"],
              ["2019", "KONTES PEMILIHAN PRESIDEN"],
            ].map(([year, title], i) => (
              <div
                key={year}
                style={{
                  marginBottom: 43,
                  opacity: fade(frame, i * 17),
                  transform: `translateX(${rise(frame, fps, i * 17)}px)`,
                }}
              >
                <div style={{ color: accent, fontSize: 39, fontWeight: 900 }}>
                  {year}
                </div>
                <div style={{ fontSize: 23, fontWeight: 800, marginTop: 8 }}>
                  {title}
                </div>
              </div>
            ))}
          </div>
        </div>
      </AbsoluteFill>
    );
  }

  /* 11 — MINISTER OF DEFENSE */
  if (index === 10) {
    return (
      <AbsoluteFill>
        <div style={{ position: "absolute", left, right, top: 720 }}>
          <Kicker color={accent}>GOVERNMENT • 2019</Kicker>
          <NumberDisplay value="2019" frame={frame} color={accent} size={165} />

          <MotionCard frame={frame} fps={fps} delay={24} color={accent}>
            <div style={{ fontSize: 37, fontWeight: 900, lineHeight: 1.2 }}>
              MENTERI PERTAHANAN
            </div>
            <div style={{ marginTop: 25 }}>
              <MovingLine frame={frame} color={accent} />
            </div>
            <div style={{ fontSize: 21, marginTop: 28, color: C.muted }}>
              REPUBLIK INDONESIA
            </div>
          </MotionCard>

          <div style={{ marginTop: 45, display: "flex", gap: 12 }}>
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                style={{
                  flex: 1,
                  height: 9,
                  background: accent,
                  opacity: ease(frame, n * 15, n * 15 + 20),
                }}
              />
            ))}
          </div>
        </div>
      </AbsoluteFill>
    );
  }

  /* 12 — PRESIDENCY */
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left, right, top: 650, textAlign: "center" }}>
        <Kicker color={accent}>20 OKTOBER 2024</Kicker>
        <NumberDisplay value="PRESIDEN" frame={frame} color={C.paper} size={95} />

        <div
          style={{
            fontSize: 205,
            fontWeight: 900,
            color: accent,
            lineHeight: 1,
            transform: `scale(${0.75 + pop(frame, fps) * 0.25})`,
            textShadow: `0 0 60px ${accent}44`,
          }}
        >
          KE-8
        </div>

        <div
          style={{
            height: 3,
            width: `${progress * 100}%`,
            background: accent,
            margin: "45px auto",
          }}
        />

        <MotionCard frame={frame} fps={fps} delay={28} color={accent}>
          <div style={{ fontSize: 29, fontWeight: 900 }}>
            REPUBLIK INDONESIA
          </div>
          <div style={{ color: C.muted, fontSize: 20, marginTop: 15 }}>
            BABAK BARU KEPEMIMPINAN NASIONAL
          </div>
        </MotionCard>
      </div>
    </AbsoluteFill>
  );
};

/* =========================================================
   CHAPTER COMPOSITION
========================================================= */

const Chapter: React.FC<{
  data: SceneData;
  index: number;
  start: number;
}> = ({ data, index, start }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const accent = data.accent || C.gold;

  const enter = pop(frame, fps);
  const exit = ease(frame, durationInFrames - 20, durationInFrames);

  const zoom = interpolate(frame, [0, durationInFrames], [1.02, 1.13], clamp);
  const drift = interpolate(
    frame,
    [0, durationInFrames],
    [index % 2 === 0 ? -25 : 25, index % 2 === 0 ? 25 : -25],
    clamp
  );

  const beat = data.beats.find(
    (item) => frame >= item.start && frame < item.start + item.duration
  );

  const imageSrc = data.imageSrc;

  return (
    <AbsoluteFill
      style={{
        background: C.dark,
        color: C.paper,
        overflow: "hidden",
      }}
    >
      {/* BACKGROUND IMAGE WITH CINEMATIC CAMERA */}
      {imageSrc ? (
        <AbsoluteFill>
          <Img
            src={staticFile(imageSrc)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: `translate3d(${drift}px,0,0) scale(${zoom})`,
              filter: "brightness(.55) contrast(1.13) saturate(.78)",
            }}
          />
        </AbsoluteFill>
      ) : (
        <AbsoluteFill
          style={{
            background:
              "radial-gradient(ellipse at 70% 30%,#263b35 0%,#111b18 40%,#070b0a 85%)",
          }}
        />
      )}

      {/* CINEMATIC LIGHT AND SHADOW */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg,#050908bb 0%,#05090822 35%,#05090888 65%,#050908 100%),linear-gradient(90deg,#05090899,transparent 85%)",
        }}
      />

      {/* MOVING AMBIENT LIGHT */}
      <div
        style={{
          position: "absolute",
          width: 700,
          height: 700,
          borderRadius: "50%",
          top: 280,
          right: -300 + drift * 2,
          background: `radial-gradient(circle,${accent}20,transparent 70%)`,
          filter: "blur(25px)",
        }}
      />

      {/* TOP BRAND */}
      <div
        style={{
          position: "absolute",
          top: 75,
          left: 75,
          right: 75,
          display: "flex",
          justifyContent: "space-between",
          color: accent,
          fontSize: 15,
          letterSpacing: 4,
          fontWeight: 800,
          opacity: fade(frame),
        }}
      >
        <span>ORION / DOCUMENTARY</span>
        <span>INDONESIA • BIOGRAPHY</span>
      </div>

      {/* CHAPTER TITLE */}
      <div
        style={{
          position: "absolute",
          top: 260,
          left: 80,
          right: 80,
          opacity: fade(frame),
          transform: `translateY(${interpolate(enter, [0, 1], [65, 0], clamp)}px)`,
        }}
      >
        <div
          style={{
            color: accent,
            fontSize: 19,
            letterSpacing: 5,
            fontWeight: 800,
          }}
        >
          {data.eyebrow}
        </div>

        <div
          style={{
            fontSize: data.title.length > 13 ? 68 : 105,
            lineHeight: 1,
            fontWeight: 900,
            letterSpacing: -2,
            marginTop: 22,
            textShadow: "0 10px 45px #000",
          }}
        >
          {data.title}
        </div>

        <div
          style={{
            marginTop: 28,
            width: `${ease(frame, 8, 42) * 380}px`,
            ...lineStyle(accent),
          }}
        />
      </div>

      {/* CHAPTER-SPECIFIC VISUAL */}
      <ChapterVisual
        index={index}
        frame={frame}
        duration={durationInFrames}
        accent={accent}
      />

      {/* WORD-SYNCED KINETIC TYPOGRAPHY — PRESERVED */}
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

      {/* NARRATION BEAT */}
      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          bottom: 235,
          fontSize: 23,
          lineHeight: 1.45,
          color: C.paper,
          textShadow: "0 4px 20px #000",
          opacity: fade(frame, 10),
        }}
      >
        {beat?.text || data.subtitle}
      </div>

      {/* CHAPTER PROGRESS */}
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
            boxShadow: `0 0 15px ${accent}`,
          }}
        />
      </div>

      {/* FRAME */}
      <div
        style={{
          position: "absolute",
          inset: 25,
          border: "1px solid #ffffff22",
          pointerEvents: "none",
        }}
      />

      {/* CHAPTER COUNTER */}
      <div
        style={{
          position: "absolute",
          right: 80,
          bottom: 60,
          color: accent,
          fontSize: 19,
          fontWeight: 900,
        }}
      >
        {String(index + 1).padStart(2, "0")} / 12
      </div>

      {/* CINEMATIC CHAPTER TRANSITION */}
      <AbsoluteFill
        style={{
          background: C.dark,
          opacity: exit,
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};

/* =========================================================
   FULL NARRATIVE MASTER
========================================================= */

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
    <AbsoluteFill style={{ background: C.dark }}>
      {sequences}
      <Audio src={staticFile(project.voiceoverSrc)} volume={1} />
    </AbsoluteFill>
  );
};
