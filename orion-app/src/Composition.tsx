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

type Props = {
  voiceoverSrc?: string;
  musicSrc?: string;
  sfxSrc?: string;
};

const scenes = [
  { eyebrow: "ORION CREATIVE PRESENTS", title: "IDEA", subtitle: "Semua karya besar dimulai dari satu gagasan.", number: "01" },
  { eyebrow: "01 / DISCOVER", title: "TEMUKAN", subtitle: "Gali inti pesan. Kenali siapa yang perlu mendengarnya.", number: "02" },
  { eyebrow: "02 / DESIGN", title: "RANCANG", subtitle: "Bangun bahasa visual yang punya karakter dan arah.", number: "03" },
  { eyebrow: "03 / MOTION", title: "GERAKKAN", subtitle: "Satukan ritme, tipografi, cahaya, dan suara.", number: "04" },
  { eyebrow: "04 / STORY", title: "HIDUPKAN", subtitle: "Ubah informasi menjadi pengalaman yang berkesan.", number: "05" },
  { eyebrow: "ORION CREATIVE", title: "MAKE IT MATTER.", subtitle: "Bukan sekadar terlihat. Tetapi punya makna.", number: "06" },
];

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

const Scene: React.FC<{ index: number; data: (typeof scenes)[number] }> = ({ index, data }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 18, stiffness: 90, mass: 0.8 } });
  const exit = interpolate(frame, [durationInFrames - 12, durationInFrames], [0, 1], clamp);
  const opacity = interpolate(exit, [0, 1], [1, 0]);
  const titleY = interpolate(enter, [0, 1], [90, 0]);
  const titleScale = interpolate(enter, [0, 1], [0.88, 1]);
  const line = interpolate(frame, [8, 30], [0, 1], clamp);
  const orbit = frame * (index % 2 === 0 ? 0.45 : -0.35);
  const glow = 0.45 + Math.sin(frame / 13) * 0.12;

  return (
    <AbsoluteFill style={{ backgroundColor: "#101713", color: "#F4F1E8", overflow: "hidden", opacity }}>
      <AbsoluteFill style={{
        background: "radial-gradient(circle at 72% 25%, rgba(157,205,120,.18), transparent 34%), radial-gradient(circle at 15% 82%, rgba(77,130,108,.18), transparent 38%), linear-gradient(145deg,#111A15 0%,#0A0F0D 100%)"
      }} />
      <AbsoluteFill style={{ opacity: 0.18, backgroundImage: "linear-gradient(rgba(235,242,224,.12) 1px, transparent 1px), linear-gradient(90deg,rgba(235,242,224,.12) 1px, transparent 1px)", backgroundSize: "72px 72px" }} />
      <div style={{
        position: "absolute", width: 900, height: 900, border: "1px solid rgba(194,220,167,.18)",
        borderRadius: "50%", right: -360, top: 150, transform: `rotate(${orbit}deg) scale(${0.9 + glow * 0.1})`,
        boxShadow: "0 0 100px rgba(146,190,118,.08)"
      }} />
      <div style={{
        position: "absolute", width: 620, height: 620, border: "1px solid rgba(194,220,167,.14)",
        borderRadius: "50%", right: -220, top: 290, transform: `rotate(${-orbit * 1.7}deg)`
      }} />
      <div style={{ position: "absolute", left: 76, right: 76, top: 78, height: 1, background: "rgba(240,240,220,.28)" }} />
      <div style={{ position: "absolute", left: 76, right: 76, bottom: 90, height: 1, background: "rgba(240,240,220,.28)" }} />

      <div style={{ position: "absolute", left: 78, top: 104, fontFamily: "Arial, sans-serif", fontSize: 22, letterSpacing: 5, color: "#B8C9A4" }}>
        {data.eyebrow}
      </div>
      <div style={{
        position: "absolute", left: 76, top: "34%", width: 930,
        transform: `translateY(${titleY}px) scale(${titleScale})`, transformOrigin: "left center",
        fontFamily: "Arial, Helvetica, sans-serif", fontSize: index === 5 ? 112 : 164,
        fontWeight: 800, letterSpacing: index === 5 ? -4 : -7, lineHeight: 0.92,
        color: "#F4F1E8", textShadow: "0 14px 70px rgba(0,0,0,.25)"
      }}>
        {data.title}
      </div>
      <div style={{
        position: "absolute", left: 82, top: "57%", width: 720, height: 4,
        background: "linear-gradient(90deg,#B8D99A,rgba(184,217,154,0))",
        transform: `scaleX(${line})`, transformOrigin: "left center"
      }} />
      <div style={{
        position: "absolute", left: 82, top: "60%", width: 720,
        fontFamily: "Arial, sans-serif", fontSize: 34, lineHeight: 1.35,
        color: "rgba(244,241,232,.78)", opacity: interpolate(frame, [15, 35], [0, 1], clamp),
        transform: `translateY(${interpolate(frame, [15, 35], [24, 0], clamp)}px)`
      }}>
        {data.subtitle}
      </div>
      <div style={{ position: "absolute", left: 82, bottom: 122, fontFamily: "Arial, sans-serif", fontSize: 19, letterSpacing: 4, color: "rgba(244,241,232,.48)" }}>
        VISUAL STORYTELLING ENGINE
      </div>
      <div style={{ position: "absolute", right: 82, bottom: 112, fontFamily: "Arial, sans-serif", fontSize: 24, color: "#B8D99A", letterSpacing: 3 }}>
        {data.number} / 06
      </div>
      <div style={{
        position: "absolute", right: 100, top: 150, width: 12, height: 12, borderRadius: "50%",
        background: "#B8D99A", boxShadow: "0 0 28px rgba(184,217,154,.8)",
        opacity: interpolate(frame, [0, 12, 24], [0, 1, 0.45], clamp)
      }} />
    </AbsoluteFill>
  );
};

export const MyComponent: React.FC<Props> = ({ voiceoverSrc, musicSrc, sfxSrc }) => {
  const { fps } = useVideoConfig();
  const framesPerScene = 5 * fps;

  return (
    <AbsoluteFill style={{ backgroundColor: "#101713" }}>
      {scenes.map((scene, index) => (
        <Sequence key={scene.number} from={index * framesPerScene} durationInFrames={framesPerScene}>
          <Scene index={index} data={scene} />
        </Sequence>
      ))}
      {voiceoverSrc ? <Audio src={staticFile(voiceoverSrc)} volume={1} /> : null}
      {musicSrc ? <Audio src={staticFile(musicSrc)} volume={0.18} /> : null}
      {sfxSrc ? <Audio src={staticFile(sfxSrc)} volume={0.55} /> : null}
    </AbsoluteFill>
  );
};
