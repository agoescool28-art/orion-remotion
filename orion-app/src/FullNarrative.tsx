
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

const C = {
  gold: "#D8B878",
  paper: "#F2EBDD",
  muted: "#B8B6AD",
  dark: "#080D0C",
};

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const progress = (frame: number, from: number, to: number) =>
  interpolate(frame, [from, Math.max(from + 1, to)], [0, 1], clamp);

const enter = (frame: number, fps: number, delay = 0) =>
  spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 18, stiffness: 115, mass: 0.65 },
  });

const fade = (frame: number, delay = 0) =>
  progress(frame, delay, delay + 18);

const Kicker: React.FC<{
  children: React.ReactNode;
  color: string;
}> = ({ children, color }) => (
  <div style={{
    color,
    fontSize: 17,
    letterSpacing: 5,
    fontWeight: 800,
    textTransform: "uppercase",
  }}>
    {children}
  </div>
);

const MotionCard: React.FC<{
  frame: number;
  fps: number;
  delay?: number;
  color: string;
  children: React.ReactNode;
}> = ({ frame, fps, delay = 0, color, children }) => {
  const p = enter(frame, fps, delay);

  return (
    <div style={{
      position: "relative",
      overflow: "hidden",
      border: `1px solid ${color}88`,
      background: "linear-gradient(135deg,#19221eeb,#050a09ee)",
      padding: 25,
      opacity: fade(frame, delay),
      transform: `translateY(${interpolate(p,[0,1],[52,0])}px)`,
      boxShadow: "0 24px 65px #0005",
    }}>
      <div style={{
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        width: 3,
        background: color,
      }} />
      {children}
    </div>
  );
};

const BigNumber: React.FC<{
  value: string;
  frame: number;
  color: string;
  size?: number;
}> = ({ value, frame, color, size = 112 }) => {
  const p = enter(frame, 30);

  return (
    <div style={{
      fontSize: size,
      fontWeight: 900,
      lineHeight: 0.94,
      letterSpacing: -3,
      color,
      opacity: fade(frame),
      transform: `translateY(${interpolate(p,[0,1],[70,0])}px)`,
      textShadow: "0 14px 55px #0009",
    }}>
      {value}
    </div>
  );
};

const MovingRule: React.FC<{
  frame: number;
  color: string;
  delay?: number;
}> = ({ frame, color, delay = 8 }) => (
  <div style={{
    height: 3,
    width: `${progress(frame,delay,delay+38)*100}%`,
    background: color,
    boxShadow: `0 0 22px ${color}88`,
  }} />
);


const ChapterVisual: React.FC<{
  index: number;
  frame: number;
  duration: number;
  accent: string;
}> = ({ index, frame, duration, accent }) => {
  const { fps } = useVideoConfig();

  const p = progress(frame, 8, duration * 0.82);
  const left = 76;
  const right = 76;

  const reveal = (delay = 0) => fade(frame, delay);

  const lift = (delay = 0) =>
    interpolate(enter(frame, fps, delay), [0, 1], [48, 0]);

  const line = (delay = 8) => ({
    height: 3,
    width: `${progress(frame, delay, delay + 55) * 100}%`,
    background: accent,
    boxShadow: `0 0 20px ${accent}88`,
  });

  const stage = (
    kicker: string,
    headline: string,
    description: string,
    visual: React.ReactNode
  ) => (
    <AbsoluteFill>
      <div style={{ position: "absolute", left, right, top: 690 }}>
        <Kicker color={accent}>{kicker}</Kicker>

        <div
          style={{
            fontSize: headline.length > 12 ? 76 : 105,
            fontWeight: 900,
            lineHeight: 0.98,
            letterSpacing: -4,
            marginTop: 22,
            color: C.paper,
            opacity: reveal(),
            transform: `translateY(${lift()}px)`,
          }}
        >
          {headline}
        </div>

        {visual}

        <div
          style={{
            fontSize: 19,
            color: C.muted,
            lineHeight: 1.5,
            marginTop: 25,
          }}
        >
          {description}
        </div>
      </div>
    </AbsoluteFill>
  );

  // 01 — OPENING
  if (index === 0) {
    const milestones = [
      ["1951", "KELAHIRAN"],
      ["1974", "AKABRI"],
      ["1998", "TITIK BALIK"],
      ["2024", "PRESIDEN"],
    ];

    return (
      <AbsoluteFill>
        <div style={{ position: "absolute", left, right, top: 665 }}>
          <Kicker color={accent}>THE LONG ROAD</Kicker>

          <div
            style={{
              fontSize: 86,
              fontWeight: 900,
              lineHeight: 0.9,
              letterSpacing: -4,
              marginTop: 22,
              opacity: reveal(),
              transform: `translateY(${lift()}px)`,
            }}
          >
            JEJAK
            <br />
            <span style={{ color: accent }}>SEJARAH.</span>
          </div>

          <div
            style={{
              height: 390,
              marginTop: 42,
              position: "relative",
              overflow: "hidden",
              borderTop: `1px solid ${accent}`,
              borderBottom: `1px solid ${accent}`,
              background:
                "repeating-linear-gradient(0deg,transparent 0 34px,#ffffff0b 35px),repeating-linear-gradient(90deg,transparent 0 54px,#ffffff0b 55px)",
            }}
          >
            <svg viewBox="0 0 900 360" width="100%" height="100%">
              <path
                d="M0 290 C150 260 170 180 320 205 S510 110 630 145 S780 70 900 40"
                fill="none"
                stroke={accent}
                strokeWidth="5"
                strokeDasharray="1200"
                strokeDashoffset={1200 * (1 - p)}
              />

              {milestones.map(([year, label], i) => {
                const x = 55 + i * 260;
                const y = [278, 205, 135, 55][i];

                return (
                  <g key={year} opacity={reveal(18 + i * 15)}>
                    <circle cx={x} cy={y} r="9" fill={accent} />
                    <text
                      x={x}
                      y={y - 30}
                      fill={C.paper}
                      fontSize="30"
                      fontWeight="bold"
                    >
                      {year}
                    </text>
                    <text
                      x={x}
                      y={y + 45}
                      fill={accent}
                      fontSize="15"
                    >
                      {label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div
            style={{
              fontSize: 18,
              color: C.muted,
              letterSpacing: 3,
              marginTop: 25,
            }}
          >
            EMPAT ERA • SATU PERJALANAN
          </div>
        </div>
      </AbsoluteFill>
    );
  }

  // 02 — KELAHIRAN
  if (index === 1) {
    return stage(
      "JAKARTA • 17 OKTOBER 1951",
      "1951",
      "Prabowo Subianto lahir di Jakarta pada 17 Oktober 1951.",
      <div
        style={{
          height: 360,
          marginTop: 45,
          position: "relative",
          overflow: "hidden",
          background: "linear-gradient(145deg,#1b2925,#080d0c)",
          border: `1px solid ${accent}`,
        }}
      >
        <svg viewBox="0 0 900 360" width="100%" height="100%">
          <g stroke={accent} strokeOpacity=".22" strokeWidth="2">
            {Array.from({ length: 8 }, (_, i) => (
              <path
                key={i}
                d={`M${i * 130 - 80} 0 L${i * 130 + 160} 360`}
              />
            ))}
            {Array.from({ length: 6 }, (_, i) => (
              <path
                key={i}
                d={`M0 ${i * 65} L900 ${i * 65 - 40}`}
              />
            ))}
          </g>

          <path
            d="M60 280 L210 220 L350 250 L500 140 L680 170 L820 55"
            fill="none"
            stroke={accent}
            strokeWidth="5"
            strokeDasharray="1100"
            strokeDashoffset={1100 * (1 - p)}
          />

          <circle cx="820" cy="55" r="16" fill={accent} />
          <circle
            cx="820"
            cy="55"
            r={48 + Math.sin(frame * 0.09) * 5}
            fill="none"
            stroke={accent}
            strokeWidth="2"
          />

          <text
            x="570"
            y="260"
            fill={C.paper}
            fontSize="38"
            fontWeight="bold"
          >
            JAKARTA
          </text>
        </svg>

        <div
          style={{
            position: "absolute",
            bottom: 15,
            left: 20,
            fontSize: 12,
            color: C.muted,
            letterSpacing: 2,
          }}
        >
          PETA ILUSTRATIF
        </div>
      </div>
    );
  }

  // 03 — KELUARGA
  if (index === 2) {
    return stage(
      "FAMILY & BACKGROUND",
      "KELUARGA",
      "Sumitro Djojohadikusumo merupakan ayah Prabowo Subianto.",
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 55px 1fr",
          alignItems: "center",
          marginTop: 55,
        }}
      >
        <div
          style={{
            padding: 25,
            background: "#17221e",
            borderTop: `3px solid ${accent}`,
            minHeight: 180,
          }}
        >
          <div style={{ fontSize: 14, color: accent, letterSpacing: 3 }}>
            AYAH
          </div>
          <div style={{ fontSize: 31, fontWeight: 900, marginTop: 18 }}>
            SUMITRO
          </div>
          <div style={{ fontSize: 17, color: C.muted }}>
            DJOJOHADIKUSUMO
          </div>
        </div>

        <div
          style={{
            height: 3,
            background: accent,
            transform: `scaleX(${p})`,
          }}
        />

        <div
          style={{
            padding: 25,
            background: "#17221e",
            borderBottom: `3px solid ${accent}`,
            minHeight: 180,
          }}
        >
          <div style={{ fontSize: 14, color: accent, letterSpacing: 3 }}>
            PUTRA
          </div>
          <div style={{ fontSize: 31, fontWeight: 900, marginTop: 18 }}>
            PRABOWO
          </div>
          <div style={{ fontSize: 17, color: C.muted }}>SUBIANTO</div>
        </div>
      </div>
    );
  }

  // 04 — PENDIDIKAN MILITER
  if (index === 3) {
    return stage(
      "THE MAKING OF A SOLDIER",
      "AKABRI",
      "Prabowo menempuh pendidikan militer dan lulus dari AKABRI pada 1974.",
      <>
        <div
          style={{
            height: 350,
            marginTop: 38,
            background: "linear-gradient(110deg,#101a18,#26342d)",
            border: `1px solid ${accent}`,
            overflow: "hidden",
          }}
        >
          <svg viewBox="0 0 900 350" width="100%" height="100%">
            <path
              d="M0 300 L900 300 M0 330 L900 330"
              stroke={accent}
              strokeOpacity=".3"
              strokeWidth="2"
            />
            <path
              d="M100 300 L180 145 L260 300 M320 300 L400 105 L480 300 M540 300 L620 145 L700 300"
              fill="none"
              stroke={accent}
              strokeOpacity=".6"
              strokeWidth="5"
            />
            <text
              x="450"
              y="65"
              textAnchor="middle"
              fill={C.paper}
              fontSize="24"
              letterSpacing="7"
            >
              DISCIPLINE • TRAINING • SERVICE
            </text>
          </svg>
        </div>

        <div style={{ marginTop: 28 }}>
          <div style={line(10)} />
          <div
            style={{
              fontSize: 72,
              fontWeight: 900,
              color: accent,
              marginTop: 18,
            }}
          >
            1974
          </div>
          <div style={{ fontSize: 20, fontWeight: 800 }}>
            LULUS AKABRI
          </div>
        </div>
      </>
    );
  }

  // 05 — KOPASSUS
  if (index === 4) {
    return stage(
      "MILITARY CAREER",
      "KOPASSUS",
      "Perjalanan karier berkembang di lingkungan Angkatan Darat dan pasukan khusus.",
      <div
        style={{
          height: 360,
          marginTop: 38,
          background: "linear-gradient(155deg,#1b2924,#080d0c)",
          borderTop: `1px solid ${accent}`,
          borderBottom: `1px solid ${accent}`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <svg viewBox="0 0 900 360" width="100%" height="100%">
          <g
            fill="none"
            stroke={accent}
            strokeOpacity=".25"
            strokeWidth="3"
          >
            <path d="M0 300 Q180 130 340 260 T680 170 T900 70" />
            <path d="M0 350 Q180 180 340 310 T680 220 T900 120" />
            <path d="M0 250 Q180 80 340 210 T680 120 T900 20" />
          </g>

          <path
            d="M60 290 L250 190 L420 230 L600 110 L820 60"
            fill="none"
            stroke={accent}
            strokeWidth="5"
            strokeDasharray="1100"
            strokeDashoffset={1100 * (1 - p)}
          />

          <text
            x="25"
            y="335"
            fill={C.muted}
            fontSize="14"
            letterSpacing="3"
          >
            VISUALISASI SIMBOLIS
          </text>
        </svg>
      </div>
    );
  }

  // 06 — JABATAN STRATEGIS
  if (index === 5) {
    return stage(
      "CAREER MILESTONES",
      "1996—1998",
      "Pada periode ini Prabowo mengemban dua jabatan strategis di lingkungan militer.",
      <div
        style={{
          marginTop: 45,
          borderLeft: `4px solid ${accent}`,
          paddingLeft: 35,
        }}
      >
        {[
          ["1996", "DANJEN KOPASSUS"],
          ["1998", "PANGKOSTRAD"],
        ].map(([year, role], i) => (
          <div
            key={year}
            style={{
              marginBottom: 48,
              opacity: reveal(i * 25),
              transform: `translateX(${lift(i * 25)}px)`,
            }}
          >
            <div
              style={{
                fontSize: 54,
                fontWeight: 900,
                color: accent,
              }}
            >
              {year}
            </div>
            <div style={{ fontSize: 29, fontWeight: 900, marginTop: 8 }}>
              {role}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // 07 — REFORMASI
  if (index === 6) {
    return stage(
      "INDONESIA • 1998",
      "REFORMASI",
      "Perubahan politik nasional menjadi titik balik dalam perjalanan kariernya.",
      <div
        style={{
          height: 350,
          marginTop: 35,
          background: "linear-gradient(180deg,#392522,#11100f)",
          border: `1px solid ${accent}`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "repeating-linear-gradient(0deg,transparent 0 38px,#ffffff10 39px)",
            transform: `translateY(${p * 65}px)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 25,
            bottom: 20,
            fontSize: 100,
            fontWeight: 900,
            color: accent,
            opacity: reveal(),
          }}
        >
          1998
        </div>
        <div
          style={{
            position: "absolute",
            right: 25,
            top: 25,
            fontSize: 14,
            color: C.paper,
            letterSpacing: 4,
          }}
        >
          ERA PERUBAHAN
        </div>
      </div>
    );
  }

  // 08 — KONTROVERSI SEJARAH
  if (index === 7) {
    const records = [
      ["01", "DEWAN KEHORMATAN PERWIRA"],
      ["02", "KONTROVERSI PENCULIKAN AKTIVIS"],
      ["03", "DUGAAN PELANGGARAN HAM"],
      ["04", "BANTAHAN PRABOWO"],
    ];

    return stage(
      "HISTORICAL DOSSIER",
      "ARSIP 1998",
      "Periode ini memuat keputusan institusional, kontroversi, dugaan, dan bantahan.",
      <div
        style={{
          marginTop: 35,
          padding: 25,
          background: "#e8dfcc",
          color: "#1a1a18",
          transform: `rotate(-1deg) translateY(${lift()}px)`,
          boxShadow: "0 18px 40px #0008",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 14,
            letterSpacing: 3,
            borderBottom: "1px solid #70685a",
            paddingBottom: 14,
          }}
        >
          CATATAN HISTORIS <span>1998</span>
        </div>

        {records.map(([number, text], i) => (
          <div
            key={number}
            style={{
              display: "grid",
              gridTemplateColumns: "45px 1fr",
              gap: 12,
              alignItems: "center",
              padding: "19px 0",
              borderBottom: "1px solid #b9ae9c",
              fontSize: 18,
              fontWeight: 800,
              opacity: reveal(i * 14),
            }}
          >
            <b>{number}</b>
            <span>{text}</span>
          </div>
        ))}

        <div style={{ fontSize: 13, marginTop: 15, color: "#514b42" }}>
          Pisahkan keputusan institusional, dugaan, dan bantahan.
        </div>
      </div>
    );
  }

  // 09 — TRANSFORMASI
  if (index === 8) {
    return stage(
      "A NEW CHAPTER",
      "TRANSFORMASI",
      "Setelah meninggalkan dinas militer, ia menekuni dunia usaha dan kembali aktif dalam kehidupan publik.",
      <div style={{ marginTop: 42, display: "grid", gap: 14 }}>
        {[
          ["MILITER", "MASA LALU"],
          ["DUNIA USAHA", "BABAK BARU"],
          ["KEHIDUPAN PUBLIK", "KEMBALI AKTIF"],
        ].map(([title, subtitle], i) => (
          <div
            key={title}
            style={{
              padding: 23,
              background: "#17221e",
              borderLeft: `4px solid ${accent}`,
              opacity: reveal(i * 20),
              transform: `translateX(${lift(i * 20)}px)`,
            }}
          >
            <div style={{ fontSize: 27, fontWeight: 900 }}>{title}</div>
            <div
              style={{
                fontSize: 15,
                color: accent,
                letterSpacing: 2,
                marginTop: 8,
              }}
            >
              {subtitle}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // 10 — PERJALANAN POLITIK
  if (index === 9) {
    const events = [
      ["2008", "PENDIRIAN GERINDRA"],
      ["2009", "CALON WAKIL PRESIDEN"],
      ["2014", "KONTES PEMILIHAN PRESIDEN"],
      ["2019", "KONTES PEMILIHAN PRESIDEN"],
    ];

    return stage(
      "POLITICAL JOURNEY",
      "GERINDRA",
      "Dari pendirian partai menuju beberapa kontestasi pemilihan presiden.",
      <div
        style={{
          marginTop: 38,
          paddingLeft: 34,
          borderLeft: `3px solid ${accent}`,
        }}
      >
        {events.map(([year, description], i) => (
          <div
            key={year}
            style={{
              marginBottom: 27,
              opacity: reveal(i * 15),
              transform: `translateX(${lift(i * 15)}px)`,
            }}
          >
            <div
              style={{
                fontSize: 38,
                color: accent,
                fontWeight: 900,
              }}
            >
              {year}
            </div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 850,
                marginTop: 5,
              }}
            >
              {description}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // 11 — MENTERI PERTAHANAN
  if (index === 10) {
    return stage(
      "GOVERNMENT • 2019–2024",
      "MENTERI",
      "Pada 2019, Prabowo masuk ke pemerintahan sebagai Menteri Pertahanan Republik Indonesia.",
      <div
        style={{
          marginTop: 40,
          padding: 28,
          borderTop: `2px solid ${accent}`,
          borderBottom: `2px solid ${accent}`,
          background: "#17221e",
          opacity: reveal(),
          transform: `translateY(${lift()}px)`,
        }}
      >
        <div
          style={{
            fontSize: 100,
            fontWeight: 900,
            color: accent,
          }}
        >
          2019
        </div>
        <div style={{ fontSize: 32, fontWeight: 900, marginTop: 15 }}>
          MENTERI PERTAHANAN
        </div>
        <div
          style={{
            fontSize: 18,
            color: C.muted,
            marginTop: 12,
            letterSpacing: 2,
          }}
        >
          REPUBLIK INDONESIA
        </div>
        <div style={{ marginTop: 28 }}>
          <div style={line(15)} />
          <div style={{ fontSize: 25, marginTop: 12 }}>2019 — 2024</div>
        </div>
      </div>
    );
  }

  // 12 — PRESIDEN
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left,
          right,
          top: 660,
          textAlign: "center",
        }}
      >
        <Kicker color={accent}>20 OKTOBER 2024</Kicker>

        <div
          style={{
            fontSize: 65,
            fontWeight: 900,
            marginTop: 30,
            opacity: reveal(),
          }}
        >
          PELANTIKAN
        </div>

        <div
          style={{
            fontSize: 190,
            fontWeight: 900,
            color: accent,
            lineHeight: 0.95,
            letterSpacing: -8,
            opacity: reveal(),
            transform: `scale(${0.82 + enter(frame, fps) * 0.18})`,
            textShadow: `0 0 70px ${accent}55`,
          }}
        >
          KE-8
        </div>

        <div
          style={{
            height: 3,
            width: `${p * 100}%`,
            background: accent,
            margin: "35px auto",
            boxShadow: `0 0 20px ${accent}`,
          }}
        />

        <div style={{ fontSize: 31, fontWeight: 900, lineHeight: 1.3 }}>
          PRESIDEN REPUBLIK
          <br />
          INDONESIA
        </div>

        <div
          style={{
            fontSize: 18,
            color: C.muted,
            letterSpacing: 3,
            marginTop: 20,
          }}
        >
          BABAK BARU KEPEMIMPINAN NASIONAL
        </div>

        <div
          style={{
            marginTop: 55,
            fontSize: 14,
            color: accent,
            letterSpacing: 5,
          }}
        >
          20 • 10 • 2024
        </div>
      </div>
    </AbsoluteFill>
  );
};

  
const Chapter: React.FC<{
  data: SceneData;
  index: number;
  start: number;
  duration: number;
}> = ({ data, index, start, duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const accent = data.accent || C.gold;
  const intro = enter(frame, fps);
  const outro = progress(frame, duration - 20, duration - 1);

  const zoom = interpolate(
    frame,
    [0, duration],
    [1.04, 1.13],
    clamp
  );

  const drift = interpolate(
    frame,
    [0, duration],
    [index % 2 === 0 ? -22 : 22, index % 2 === 0 ? 22 : -22],
    clamp
  );

  

  return (
    <AbsoluteFill
      style={{
        background: C.dark,
        color: C.paper,
        overflow: "hidden",
      }}
    >
      {/* BACKGROUND */}
      {data.imageSrc ? (
        <AbsoluteFill>
          <Img
            src={staticFile(data.imageSrc)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: `translate3d(${drift}px,0,0) scale(${zoom})`,
              filter: "brightness(.38) contrast(1.15) saturate(.72)",
            }}
          />
        </AbsoluteFill>
      ) : (
        <AbsoluteFill
          style={{
            background:
              "radial-gradient(ellipse at 70% 35%,#293d35 0%,#111b18 45%,#070b0a 90%)",
          }}
        />
      )}

      {/* CINEMATIC GRADING */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg,#050908dd 0%,#05090822 35%,#05090855 60%,#050908ee 100%)",
        }}
      />

      {/* AMBIENT LIGHT */}
      <div
        style={{
          position: "absolute",
          width: 650,
          height: 650,
          top: 360,
          right: -300 + drift,
          borderRadius: "50%",
          background: `radial-gradient(circle,${accent}28,transparent 70%)`,
          filter: "blur(35px)",
        }}
      />

      {/* HEADER */}
      <div
        style={{
          position: "absolute",
          top: 65,
          left: 75,
          right: 75,
          display: "flex",
          justifyContent: "space-between",
          color: accent,
          fontSize: 14,
          letterSpacing: 3,
          fontWeight: 800,
          opacity: fade(frame),
        }}
      >
        <span>ORION / DOCUMENTARY</span>
        <span>{String(index + 1).padStart(2, "0")} / 12</span>
      </div>

      {/* CHAPTER TITLE */}
      <div
        style={{
          position: "absolute",
          top: 205,
          left: 75,
          right: 75,
          opacity: fade(frame),
          transform: `translateY(${interpolate(
            intro,
            [0, 1],
            [35, 0]
          )}px)`,
        }}
      >
        <div
          style={{
            color: accent,
            fontSize: 17,
            letterSpacing: 4,
            fontWeight: 800,
          }}
        >
          {data.eyebrow}
        </div>

        <div
          style={{
            fontSize: data.title.length > 13 ? 65 : 94,
            lineHeight: 1.02,
            fontWeight: 900,
            letterSpacing: -2,
            marginTop: 16,
            textShadow: "0 10px 45px #000",
          }}
        >
          {data.title}
        </div>

        <div
          style={{
            marginTop: 18,
            height: 3,
            width: `${progress(frame, 8, 42) * 145}px`,
            background: accent,
            boxShadow: `0 0 20px ${accent}88`,
          }}
        />
      </div>

      {/* VISUAL STAGE — RAISED TO CREATE SPACE */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: "translateY(-105px)",
        }}
      >
        <ChapterVisual
          index={index}
          frame={frame}
          duration={duration}
          accent={accent}
        />
      </div>

      {/* VOICE-OVER KINETIC TYPOGRAPHY SAFE ZONE */}
      <div
        style={{
          position: "absolute",
          left: 65,
          right: 65,
          bottom: 175,
          height: 180,
          padding: "22px 18px",
          display: "flex",
          alignItems: "center",
          background:
            "linear-gradient(180deg,#080d0c00,#080d0cdd 28%,#080d0cee)",
          borderBottom: `2px solid ${accent}88`,
          boxSizing: "border-box",
        }}
      >
        <AudioSyncedTypography
          words={prabowoWords}
          globalStartFrame={start}
          accent={accent}
        />
      </div>

      {/* CHAPTER PROGRESS */}
      <div
        style={{
          position: "absolute",
          left: 75,
          right: 75,
          bottom: 95,
          height: 3,
          background: "#ffffff35",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${(frame / duration) * 100}%`,
            background: accent,
            boxShadow: `0 0 15px ${accent}`,
          }}
        />
      </div>

      {/* CINEMATIC EXIT */}
      <AbsoluteFill
        style={{
          background: C.dark,
          opacity: outro,
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};


export const FullNarrative: React.FC = () => {
  let cursor = 0;

  const sequences = project.scenes.map((scene,index)=>{
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
  start={from}
  duration={scene.durationFrames}
/>
      </Sequence>
    );
  });

  return (
    <AbsoluteFill style={{background:C.dark}}>
      {sequences}
      <Audio src={staticFile(project.voiceoverSrc)} volume={1}/>
    </AbsoluteFill>
  );
};
