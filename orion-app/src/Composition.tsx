
import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ORION_TEMPLATE } from "./orionTemplate";

const colorToRgba = (hex: string, opacity: number) => {
  const value = hex.slice(1);
  const red = Number.parseInt(value.slice(0, 2), 16);
  const green = Number.parseInt(value.slice(2, 4), 16);
  const blue = Number.parseInt(value.slice(4, 6), 16);

  return `rgba(${red},${green},${blue},${opacity})`;
};

export const MyComponent: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const sceneDuration = fps * ORION_TEMPLATE.sceneDurationSeconds;
  const totalDuration = sceneDuration * ORION_TEMPLATE.scenes.length;
  const index = Math.min(
    ORION_TEMPLATE.scenes.length - 1,
    Math.floor(frame / sceneDuration),
  );

  const scene = ORION_TEMPLATE.scenes[index];
  const localFrame = frame - index * sceneDuration;
  const enter = spring({
    frame: localFrame,
    fps,
    config: { damping: 22, stiffness: 115, mass: 0.8 },
  });
  const exit = interpolate(
    localFrame,
    [sceneDuration - 18, sceneDuration],
    [1, 0],
    {
      easing: Easing.in(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );
  const sceneOpacity = Math.min(enter, exit);
  const sceneOffset = interpolate(enter, [0, 1], [42, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const sceneScale = interpolate(enter, [0, 1], [0.985, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const titleSpring = spring({
    frame: Math.max(0, localFrame - 7),
    fps,
    config: { damping: 20, stiffness: 125, mass: 0.7 },
  });
  const accentSpring = spring({
    frame: Math.max(0, localFrame - 12),
    fps,
    config: { damping: 20, stiffness: 125, mass: 0.7 },
  });
  const detailSpring = spring({
    frame: Math.max(0, localFrame - 19),
    fps,
    config: { damping: 22, stiffness: 115, mass: 0.75 },
  });
  const titleEnter = interpolate(localFrame, [7, 27], [28, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const accentEnter = interpolate(localFrame, [12, 32], [24, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const detailEnter = interpolate(localFrame, [19, 39], [18, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const glowMove = Math.sin(frame / 24) * width * 0.035;
  const progressWidth = interpolate(frame, [0, totalDuration - 1], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const progress = Math.round(progressWidth);

  const small = width * 0.023;
  const headline = Math.min(width * 0.103, 112);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: ORION_TEMPLATE.colors.background,
        color: ORION_TEMPLATE.colors.foreground,
        fontFamily: "Arial, Helvetica, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* LAYERED DARK GREEN BACKGROUND */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 78% 36%, rgba(39,93,56,0.42) 0%, rgba(15,33,25,0.4) 30%, transparent 62%), radial-gradient(ellipse at 14% 76%, rgba(32,108,148,0.2) 0%, transparent 48%), linear-gradient(145deg, #101914 0%, #080d0a 48%, #040605 100%)",
        }}
      />

      <AbsoluteFill
        style={{
          background:
            `linear-gradient(120deg, ${colorToRgba(ORION_TEMPLATE.colors.neon, 0.045)}, transparent 38%, rgba(3,7,5,0.55) 82%)`,
        }}
      />

      {/* SLOW NEON LIGHT */}
      <div
        style={{
          position: "absolute",
          width: width * 0.72,
          height: width * 0.72,
          borderRadius: "50%",
          top: height * 0.13,
          right: -width * 0.28 + glowMove,
          transform: `translateY(${Math.sin(frame / 45) * height * 0.008}px)`,
          background:
            `radial-gradient(circle, ${colorToRgba(ORION_TEMPLATE.colors.neon, 0.13)}, ${colorToRgba(ORION_TEMPLATE.colors.neonBright, 0.035)} 55%, transparent 72%)`,
        }}
      />

      {/* GEOMETRIC RINGS */}
      {[0, 1, 2].map((n) => (
        <div
          key={n}
          style={{
            position: "absolute",
            width: width * (0.48 + n * 0.14),
            height: width * (0.48 + n * 0.14),
            border:
              n === 1
                ? `1px solid ${colorToRgba(ORION_TEMPLATE.colors.blue, 0.14)}`
                : `1px solid ${colorToRgba(ORION_TEMPLATE.colors.neon, 0.12 - n * 0.025)}`,
            borderRadius: "50%",
            top: height * 0.16 - n * width * 0.07,
            right: -width * 0.2 - n * width * 0.07 + glowMove,
            transform: `rotate(${frame * (n % 2 ? -0.12 : 0.08)}deg)`,
          }}
        />
      ))}

      {/* SUBTLE TECHNICAL GRID */}
      <AbsoluteFill
        style={{
          opacity: 0.085,
          backgroundImage:
            `linear-gradient(${colorToRgba(ORION_TEMPLATE.colors.neon, 0.16)} 1px, transparent 1px), linear-gradient(90deg, ${colorToRgba(ORION_TEMPLATE.colors.neon, 0.16)} 1px, transparent 1px)`,
          backgroundSize: `${width * 0.07}px ${width * 0.07}px`,
          maskImage:
            "linear-gradient(to bottom, transparent, black 30%, black 80%, transparent)",
        }}
      />

      {/* FRAME */}
      <AbsoluteFill
        style={{
          margin: width * 0.045,
          width: "auto",
          height: "auto",
          border: `1px solid ${colorToRgba(ORION_TEMPLATE.colors.neon, 0.18)}`,
        }}
      />

      {/* HEADER */}
      <div
        style={{
          position: "absolute",
          top: height * 0.068,
          left: width * 0.09,
          right: width * 0.09,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: small,
          fontWeight: 700,
          color: ORION_TEMPLATE.colors.mutedForeground,
        }}
      >
        <span>{ORION_TEMPLATE.title}</span>
        <span style={{ color: ORION_TEMPLATE.colors.blue }}>
          {scene.number} / {`0${ORION_TEMPLATE.scenes.length}`.slice(-2)}
        </span>
      </div>

      {/* SCENE CONTENT */}
      <div
        style={{
          position: "absolute",
          top: height * 0.235,
          left: width * 0.09,
          right: width * 0.09,
          opacity: sceneOpacity,
          transform: `translateY(${sceneOffset}px) scale(${sceneScale})`,
        }}
      >
        <div
          style={{
            display: "inline-block",
            background: `linear-gradient(105deg, ${ORION_TEMPLATE.colors.neon}, ${ORION_TEMPLATE.colors.neonBright})`,
            color: ORION_TEMPLATE.colors.neonInk,
            padding: `${height * 0.009}px ${width * 0.02}px`,
            fontSize: width * 0.027,
            fontWeight: 800,
            marginBottom: height * 0.034,
            opacity: interpolate(localFrame, [0, 18], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            transform: `translateY(${interpolate(localFrame, [0, 18], [14, 0], {
              easing: Easing.out(Easing.cubic),
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })}px) scale(${interpolate(localFrame, [0, 18], [0.96, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })})`,
          }}
        >
          {scene.label}
        </div>

        <div
          style={{
            fontSize: headline,
            lineHeight: 1,
            fontWeight: 900,
            overflowWrap: "break-word",
            textWrap: "balance",
            maxWidth: "100%",
            opacity: interpolate(localFrame, [7, 27], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            transform: `translateY(${titleEnter}px) scale(${interpolate(titleSpring, [0, 1], [0.965, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })})`,
          }}
        >
          {scene.title}
        </div>

        <div
          style={{
            color: ORION_TEMPLATE.colors.neon,
            fontSize: headline,
            lineHeight: 1,
            fontWeight: 900,
            overflowWrap: "break-word",
            textWrap: "balance",
            marginTop: height * 0.012,
            maxWidth: "100%",
            opacity: interpolate(localFrame, [12, 32], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            transform: `translateY(${accentEnter}px) scale(${interpolate(accentSpring, [0, 1], [0.97, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })})`,
          }}
        >
          {scene.accent}
        </div>

        {/* ACCENT LINE */}
        <div
          style={{
            width: interpolate(
              localFrame,
              [15, 35],
              [width * 0.035, width * 0.22],
              {
                easing: Easing.out(Easing.cubic),
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              },
            ),
            height: 5,
            opacity: interpolate(localFrame, [12, 30], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            transform: `translateX(${interpolate(localFrame, [12, 30], [-18, 0], {
              easing: Easing.out(Easing.cubic),
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })}px)`,
            background: `linear-gradient(90deg, ${ORION_TEMPLATE.colors.neon} 0%, ${colorToRgba(ORION_TEMPLATE.colors.neon, 0.72)} 68%, ${colorToRgba(ORION_TEMPLATE.colors.blue, 0.42)} 100%)`,
            marginTop: height * 0.032,
            marginBottom: height * 0.028,
            boxShadow: `0 0 18px ${colorToRgba(ORION_TEMPLATE.colors.neon, 0.28)}`,
          }}
        />

        <div
          style={{
            borderLeft: `3px solid ${ORION_TEMPLATE.colors.blueSoft}`,
            paddingLeft: width * 0.025,
            maxWidth: width * 0.72,
            fontSize: width * 0.036,
            lineHeight: 1.4,
            color: "#d2dbce",
            opacity: interpolate(localFrame, [19, 39], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            transform: `translateY(${detailEnter}px) scale(${interpolate(detailSpring, [0, 1], [0.985, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })})`,
          }}
        >
          {scene.detail}
        </div>
      </div>

      {/* LOWER INFORMATION */}
      <div
        style={{
          position: "absolute",
          left: width * 0.09,
          right: width * 0.09,
          bottom: height * 0.105,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            color: ORION_TEMPLATE.colors.mutedForeground,
            fontSize: small,
            fontWeight: 700,
            marginBottom: height * 0.014,
          }}
        >
          <span>{ORION_TEMPLATE.topic}</span>
          <span>{progress}%</span>
        </div>

        <div
          style={{
            position: "relative",
            width: "100%",
            height: 7,
            backgroundColor: "rgba(210,235,198,0.17)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${progressWidth}%`,
              height: "100%",
              background: `linear-gradient(90deg, ${ORION_TEMPLATE.colors.neonBright} 0%, ${ORION_TEMPLATE.colors.neonSoft} 78%, ${ORION_TEMPLATE.colors.blue} 100%)`,
              boxShadow: `0 0 14px ${colorToRgba(ORION_TEMPLATE.colors.neon, 0.55)}`,
            }}
          />
          {[1, 2, 3, 4, 5].map((marker) => (
            <div
              key={marker}
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: `${(marker / ORION_TEMPLATE.scenes.length) * 100}%`,
                width: 2,
                backgroundColor: "rgba(4,8,5,0.7)",
              }}
            />
          ))}
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: `${Math.min(progressWidth, 99)}%`,
              width: Math.max(5, width * 0.008),
              backgroundColor: ORION_TEMPLATE.colors.neonMarker,
              boxShadow: `0 0 12px ${colorToRgba(ORION_TEMPLATE.colors.neon, 0.9)}`,
              transform: "translateX(-50%)",
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: height * 0.018,
            color: ORION_TEMPLATE.colors.progressMuted,
            fontSize: width * 0.019,
          }}
        >
          <span>THINK</span>
          <span>UNDERSTAND</span>
          <span>CREATE</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
