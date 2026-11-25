
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


  // 01 — OPENING: ORION V4 Editorial Timeline
  if (index === 0) {
    const milestones = [
      ["1951", "KELAHIRAN"],
      ["1974", "AKABRI"],
      ["1998", "REFORMASI"],
      ["2024", "PRESIDEN"],
    ];

    return (
      <AbsoluteFill>
        <div style={{ position: "absolute", left, right, top: 650 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 48, height: 3, background: accent }} />
            <Kicker color={accent}>
              SEBUAH PERJALANAN • INDONESIA
            </Kicker>
          </div>

          <div
            style={{
              marginTop: 24,
              fontSize: 106,
              fontWeight: 900,
              lineHeight: 0.82,
              letterSpacing: -7,
              opacity: reveal(),
              transform: `translateY(${lift()}px)`,
            }}
          >
            JEJAK
            <br />
            <span
              style={{
                color: C.paper,
                fontFamily: "Georgia, serif",
                fontWeight: 500,
                fontStyle: "italic",
              }}
            >
              langkah.
            </span>
          </div>

          <div
            style={{
              marginTop: 34,
              padding: "28px 24px 24px",
              background: "linear-gradient(120deg,#e9dfca 0%,#cfc1a5 100%)",
              color: "#1a211d",
              boxShadow: "0 24px 60px #0007",
              transform: `translateY(${interpolate(
                enter(frame, fps, 12),
                [0, 1],
                [38, 0]
              )}px)`,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 13,
                letterSpacing: 3,
                fontWeight: 800,
                opacity: 0.7,
              }}
            >
              <span>GARIS WAKTU</span>
              <span>1951 — 2024</span>
            </div>

            <div
              style={{
                height: 3,
                background: "#8c8069",
                marginTop: 28,
                position: "relative",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${p * 100}%`,
                  background: "#273b31",
                }}
              />

              {milestones.map(([year], i) => {
                const x = [0, 33.3, 66.6, 100][i];

                return (
                  <div
                    key={year}
                    style={{
                      position: "absolute",
                      left: `${x}%`,
                      top: -8,
                      width: 16,
                      height: 16,
                      borderRadius: "50%",
                      background: "#273b31",
                      border: "3px solid #e9dfca",
                      transform: "translateX(-50%)",
                      opacity: reveal(12 + i * 13),
                    }}
                  />
                );
              })}
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4,1fr)",
                gap: 8,
                marginTop: 22,
              }}
            >
              {milestones.map(([year, label], i) => (
                <div key={year} style={{ opacity: reveal(12 + i * 13) }}>
                  <div
                    style={{
                      fontSize: 28,
                      fontWeight: 900,
                      letterSpacing: -1,
                    }}
                  >
                    {year}
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      letterSpacing: 1.2,
                      fontWeight: 800,
                      marginTop: 5,
                    }}
                  >
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              marginTop: 22,
              display: "flex",
              justifyContent: "space-between",
              color: C.muted,
              fontSize: 13,
              letterSpacing: 2,
            }}
          >
            <span>ARSIP • BIOGRAFI</span>
            <span>ORION DOCUMENTARY / 01</span>
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

  
  // 07 — REFORMASI: ORION V4 Editorial Archive
  if (index === 6) {
    return stage(
      "INDONESIA • MEI 1998",
      "REFORMASI",
      "Perubahan politik nasional menjadi titik balik dalam perjalanan kariernya.",
      <div
        style={{
          height: 350,
          marginTop: 35,
          padding: 22,
          boxSizing: "border-box",
          position: "relative",
          overflow: "hidden",
          color: "#25251f",
          background: "linear-gradient(145deg,#e9dfca,#cfc3aa)",
          boxShadow: "0 22px 55px #0008",
          transform: `translateY(${interpolate(
            enter(frame, fps, 10),
            [0, 1],
            [35, 0]
          )}px) rotate(-1deg)`,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderBottom: "2px solid #292b25",
            paddingBottom: 10,
            fontSize: 11,
            fontWeight: 900,
            letterSpacing: 2,
          }}
        >
          <span>ARSIP NASIONAL</span>
          <span>EDISI KHUSUS • 1998</span>
        </div>

        <div
          style={{
            marginTop: 20,
            fontFamily: "Georgia, serif",
            fontSize: 43,
            fontWeight: 900,
            lineHeight: 0.95,
            letterSpacing: -2,
            opacity: reveal(5),
          }}
        >
          INDONESIA
          <br />
          BERUBAH.
        </div>

        <div
          style={{
            display: "flex",
            gap: 16,
            marginTop: 18,
            alignItems: "stretch",
          }}
        >
          <div
            style={{
              width: 7,
              flexShrink: 0,
              background: "#963e31",
            }}
          />
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 900,
                letterSpacing: 2,
                color: "#963e31",
              }}
            >
              MEI 1998
            </div>
            <div
              style={{
                marginTop: 7,
                fontSize: 17,
                fontWeight: 800,
                lineHeight: 1.15,
              }}
            >
              Sebuah babak baru dalam sejarah politik Indonesia.
            </div>
            <div
              style={{
                marginTop: 9,
                fontSize: 11,
                lineHeight: 1.4,
                color: "#555044",
              }}
            >
              Krisis ekonomi, demonstrasi mahasiswa, dan perubahan
              kepemimpinan nasional.
            </div>
          </div>
          <div
            style={{
              width: 105,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#292b25",
              color: "#e9dfca",
              fontSize: 35,
              fontWeight: 900,
              letterSpacing: -2,
              opacity: reveal(18),
            }}
          >
            98
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            left: 22,
            right: 22,
            bottom: 17,
            borderTop: "1px solid #716957",
            paddingTop: 9,
            display: "flex",
            justifyContent: "space-between",
            fontSize: 9,
            fontWeight: 800,
            letterSpacing: 1.5,
          }}
        >
          <span>REFORMASI INDONESIA</span>
          <span>SEJARAH • POLITIK</span>
        </div>

        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: `${p * 100}%`,
            height: 3,
            background: "#963e31",
          }}
        />
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

  
  // 12 — PRESIDEN: ORION V4 Monumental Editorial Closing
  return (
    <AbsoluteFill>
      {/* EDITORIAL FRAME */}
      <div
        style={{
          position: "absolute",
          left: 68,
          right: 68,
          top: 620,
          padding: "30px 26px",
          background: "linear-gradient(145deg,#eee5d3f2,#d9cdb8ed)",
          color: "#20231f",
          boxShadow: "0 25px 65px #0009",
          borderTop: `5px solid ${accent}`,
          transform: `translateY(${interpolate(
            enter(frame, fps, 8),
            [0, 1],
            [65, 0]
          )}px)`,
          opacity: reveal(8),
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 12,
            fontWeight: 900,
            letterSpacing: 2,
            borderBottom: "1px solid #777064",
            paddingBottom: 14,
          }}
        >
          <span>ORION • DOKUMENTER</span>
          <span>INDONESIA / 2024</span>
        </div>

        <div
          style={{
            marginTop: 28,
            fontSize: 15,
            fontWeight: 900,
            letterSpacing: 4,
            color: "#856c3f",
          }}
        >
          20 OKTOBER 2024
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 5,
          }}
        >
          <div
            style={{
              fontFamily: "Georgia,serif",
              fontSize: 178,
              fontWeight: 900,
              lineHeight: 0.95,
              letterSpacing: -12,
              color: "#252820",
              transform: `scale(${interpolate(
                enter(frame, fps, 12),
                [0, 1],
                [0.78, 1]
              )})`,
              transformOrigin: "left center",
            }}
          >
            08
          </div>

          <div
            style={{
              width: 4,
              height: 145,
              background: "#a58a53",
              marginRight: 18,
            }}
          />

          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: 30,
                fontWeight: 900,
                lineHeight: 1.05,
                letterSpacing: -1,
              }}
            >
              PRESIDEN
              <br />
              REPUBLIK
              <br />
              INDONESIA
            </div>
            <div
              style={{
                marginTop: 13,
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: 2,
                color: "#856c3f",
              }}
            >
              PRABOWO SUBIANTO
            </div>
          </div>
        </div>

        <div
          style={{
            height: 2,
            background: "#9c8c6d",
            marginTop: 25,
            transformOrigin: "left",
            transform: `scaleX(${p})`,
          }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 17,
            fontSize: 11,
            fontWeight: 900,
            letterSpacing: 1.5,
          }}
        >
          <span>AWAL BABAK KEPEMIMPINAN NASIONAL</span>
          <span>01 / 08</span>
        </div>
      </div>

      {/* FINAL EDITORIAL STATEMENT */}
      <div
        style={{
          position: "absolute",
          left: 75,
          right: 75,
          top: 1080,
          textAlign: "center",
          opacity: reveal(28),
          transform: `translateY(${interpolate(
            enter(frame, fps, 28),
            [0, 1],
            [25, 0]
          )}px)`,
        }}
      >
        <div
          style={{
            fontFamily: "Georgia,serif",
            fontSize: 27,
            fontStyle: "italic",
            color: C.paper,
            lineHeight: 1.35,
          }}
        >
          Sebuah perjalanan panjang.
          <br />
          Sebuah babak baru bagi Indonesia.
        </div>
      </div>
    </AbsoluteFill>
  );

};
 

const CinematicMotionLayer: React.FC<{
  index: number;
  frame: number;
  duration: number;
  accent: string;
}> = ({ index, frame, duration, accent }) => {
  const reveal = interpolate(frame, [0, 35], [0, 1], clamp);
  const pulse = 0.5 + Math.sin(frame * 0.055) * 0.18;
  const sweep = ((frame * 2.2 + index * 137) % 1200) - 300;

  const paths = [
    "M-100 1450 C250 1200 180 900 520 780 S800 400 1200 220",
    "M-100 1100 C250 900 400 1150 650 750 S900 450 1200 500",
    "M-100 1350 C200 1000 450 1100 620 700 S950 300 1200 150",
    "M-100 800 C250 1050 400 650 650 850 S950 500 1200 250",
  ];

  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        opacity: reveal,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 850,
          height: 850,
          left: -300,
          top: 300,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${accent}18, transparent 68%)`,
          transform: `scale(${0.9 + pulse * 0.25})`,
        }}
      />

      <div
        style={{
          position: "absolute",
          top: -300,
          left: sweep,
          width: 180,
          height: 2400,
          transform: "rotate(18deg)",
          background: `linear-gradient(90deg, transparent, ${accent}12, transparent)`,
          filter: "blur(22px)",
        }}
      />

      <svg
        viewBox="0 0 1080 1920"
        width="100%"
        height="100%"
        style={{ position: "absolute", inset: 0, opacity: 0.5 }}
      >
        <defs>
          <linearGradient id={`orion-route-${index}`}>
            <stop offset="0%" stopColor={accent} stopOpacity="0" />
            <stop offset="50%" stopColor={accent} stopOpacity="0.9" />
            <stop offset="100%" stopColor={accent} stopOpacity="0.1" />
          </linearGradient>
        </defs>

        <path
          d={paths[index % paths.length]}
          fill="none"
          stroke={`url(#orion-route-${index})`}
          strokeWidth="3"
          strokeDasharray="18 22"
          strokeDashoffset={-frame * 2.5}
        />

        <circle
          cx={540 + Math.sin(frame * 0.035) * 160}
          cy={920 + Math.cos(frame * 0.025) * 230}
          r={4 + pulse * 5}
          fill={accent}
        />
      </svg>

      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.12,
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent 0px, transparent 5px, #ffffff 6px)",
          backgroundSize: "100% 7px",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, transparent 35%, #00000055 100%)",
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
