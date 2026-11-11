import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from "remotion";

const scenes = [
  {
    title: "AWAL ERA MESIN",
    subtitle: "Dari tenaga uap menuju mesin pembakaran internal",
    year: "1886",
    color: "#D97706",
    visual: "ENGINE",
  },
  {
    title: "MESIN SEMAKIN EFISIEN",
    subtitle: "Teknologi injeksi dan sistem pembakaran berkembang",
    year: "1950 — 2000",
    color: "#38BDF8",
    visual: "PISTON",
  },
  {
    title: "ERA HYBRID",
    subtitle: "Mesin bensin bekerja bersama motor listrik",
    year: "1997",
    color: "#34D399",
    visual: "HYBRID",
  },
  {
    title: "REVOLUSI LISTRIK",
    subtitle: "Baterai menjadi sumber tenaga penggerak utama",
    year: "2010 — SEKARANG",
    color: "#22D3EE",
    visual: "BATTERY",
  },
  {
    title: "MOBIL SEMAKIN CERDAS",
    subtitle: "Sensor, kamera, dan perangkat lunak mengubah pengalaman berkendara",
    year: "ERA DIGITAL",
    color: "#A78BFA",
    visual: "AI",
  },
  {
    title: "MASA DEPAN OTOMOTIF",
    subtitle: "Mobilitas lebih bersih, aman, dan terhubung",
    year: "MASA DEPAN",
    color: "#F59E0B",
    visual: "FUTURE",
  },
];

const Scene: React.FC<{ index: number }> = ({ index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scene = scenes[index];

  const fade = interpolate(
    frame,
    [0, 15, 250, 270],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const move = interpolate(frame, [0, 270], [50, -20], {
    easing: Easing.out(Easing.quad),
    extrapolateRight: "clamp",
  });

  const pulse = 1 + Math.sin(frame / 12) * 0.035;

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(ellipse at 50% 40%, #18334B 0%, #07111D 55%, #03070D 100%)",
        color: "white",
        opacity: fade,
        fontFamily: "Arial, sans-serif",
        overflow: "hidden",
      }}
    >
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          opacity: 0.5,
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 100,
          left: 70,
          color: scene.color,
          fontSize: 22,
          fontWeight: 700,
          letterSpacing: 5,
        }}
      >
        ORION / AUTOMOTIVE DOCUMENTARY
      </div>

      <div
        style={{
          position: "absolute",
          top: 260,
          left: 70,
          right: 70,
          transform: `translateY(${move}px)`,
        }}
      >
        <div
          style={{
            fontSize: 25,
            color: scene.color,
            letterSpacing: 8,
            fontWeight: 700,
          }}
        >
          {scene.year}
        </div>

        <div
          style={{
            fontSize: 72,
            lineHeight: 1.08,
            fontWeight: 900,
            marginTop: 35,
            maxWidth: 900,
            textShadow: `0 0 35px ${scene.color}55`,
          }}
        >
          {scene.title}
        </div>

        <div
          style={{
            marginTop: 35,
            fontSize: 30,
            lineHeight: 1.5,
            color: "#C5D3E0",
            maxWidth: 850,
          }}
        >
          {scene.subtitle}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: 850,
          left: 0,
          right: 0,
          height: 450,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 370,
            height: 370,
            borderRadius: "50%",
            border: `2px solid ${scene.color}88`,
            boxShadow: `0 0 50px ${scene.color}33, inset 0 0 50px ${scene.color}22`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `scale(${pulse}) rotate(${frame * 0.15}deg)`,
          }}
        >
          <div
            style={{
              fontSize: 65,
              fontWeight: 900,
              color: scene.color,
              letterSpacing: 3,
              textShadow: `0 0 30px ${scene.color}`,
            }}
          >
            {scene.visual}
          </div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 110,
          left: 70,
          right: 70,
        }}
      >
        <div
          style={{
            height: 4,
            background: "#FFFFFF22",
            borderRadius: 10,
          }}
        >
          <div
            style={{
              width: `${((index + 1) / scenes.length) * 100}%`,
              height: "100%",
              background: scene.color,
              borderRadius: 10,
            }}
          />
        </div>
        <div
          style={{
            marginTop: 20,
            display: "flex",
            justifyContent: "space-between",
            color: "#8DA1B5",
            fontSize: 18,
            letterSpacing: 3,
          }}
        >
          <span>EVOLUSI TEKNOLOGI OTOMOTIF</span>
          <span>0{index + 1} / 06</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const EvolusiOtomotif: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      {scenes.map((_, index) => (
        <React.Fragment key={index}>
          <Scene index={index} />
        </React.Fragment>
      ))}
    </AbsoluteFill>
  );
};