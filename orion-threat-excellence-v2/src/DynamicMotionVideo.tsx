import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Easing,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

export interface PointItem {
  text: string;
  tone?: 'neutral' | 'gold' | 'danger' | 'success';
  value?: number;
}

export interface CompareColumn {
  title: string;
  badge: string;
  tone: 'danger' | 'success' | 'gold' | 'neutral';
  items: string[];
}

export interface SceneItem {
  tag: string;
  heading: string;
  headingTone?: 'neutral' | 'gold' | 'danger' | 'success';
  heroStat?: string;
  heroLabel?: string;
  body: string;
  durationSec?: number;
  overlayType?: 'pills' | 'bars' | 'compare' | 'checklist';
  points?: PointItem[];
  compareLeft?: CompareColumn;
  compareRight?: CompareColumn;
  visualType?: 'gear' | 'flow' | 'chart' | 'shield' | 'bulb';
  visualQuery?: string;
  imageUrl?: string;
}

export interface StyleConfig {
  bgColor?: string;
  gridColor?: string;
  cardBg?: string;
  accentColor?: string;
  goldColor?: string;
  dangerColor?: string;
  successColor?: string;
  watermark?: string;
}

export interface DynamicMotionProps {
  title: string;
  subtitle?: string;
  audioSrc?: string;
  styleConfig?: StyleConfig;
  scenes: SceneItem[];
}

const getSpeechWeight = (text: string): number => {
  const clean = (text || '').trim();
  if (!clean) return 10;
  const words = clean.split(/\s+/).length;
  const pauses = (clean.match(/[.,!?;:]/g) || []).length;
  return words * 1.15 + pauses * 1.8;
};

// Palet Gradasi Atmosfer Penuh (Tanpa Bingkai Kotak, Persis Gaya Claude Reference)
const SCENE_GRADIENTS = [
  'linear-gradient(180deg, #6b5b4b 0%, #c89d6c 38%, #f3d5a5 68%, #9fb380 68%, #525b76 82%)', // 0: Senja Kompleks
  'linear-gradient(180deg, #091e2c 0%, #0f3443 55%, #164e63 100%)', // 1: Top-Down Blueprint Rumah
  'linear-gradient(180deg, #072227 0%, #0d3b3e 55%, #134e4a 100%)', // 2: Emerald Dalil Al-Qur'an
  'linear-gradient(180deg, #1e1b4b 0%, #312e81 55%, #4338ca 100%)', // 3: Malam Tenang & Lisan
  'linear-gradient(180deg, #9a7b56 0%, #d4a373 45%, #faedcd 70%, #8ab17d 70%)', // 4: Sore Hangat Kepedulian
  'linear-gradient(180deg, #0f172a 0%, #1e293b 60%, #334155 100%)', // 5: Malam Privasi & Amanah
  'linear-gradient(180deg, #06282d 0%, #0e444b 55%, #115e59 100%)', // 6: Perisai Keamanan
  'linear-gradient(180deg, #8c6d53 0%, #d4a373 42%, #fde68a 68%, #94a3b8 68%)', // 7: Kebaikan Kecil & Pelangi
  'linear-gradient(180deg, #3b6998 0%, #7aa5d2 45%, #dbeafe 68%, #65a30d 68%)', // 8: Pagi Cerah Kerukunan
  'linear-gradient(180deg, #1e1b4b 0%, #3730a3 50%, #7c3aed 100%)', // 9: Timbangan Keadilan & Sikap
  'linear-gradient(180deg, #172554 0%, #1e3a8a 55%, #0284c7 100%)', // 10: Kompas Langkah Diri
  'linear-gradient(180deg, #1e293b 0%, #475569 35%, #d97706 72%, #fbbf24 100%)', // 11: Lingkaran Kampung Damai
];

// Karakter Flat Modern Tanpa Garis Tepi Kasar (Lineless Editorial Character)
const FlatPerson: React.FC<{
  x: number;
  y: number;
  shirt: string;
  pants?: string;
  skin?: string;
  peci?: boolean;
  hijab?: string;
  scale?: number;
  armAngle?: number;
  walkPhase?: number;
}> = ({
  x,
  y,
  shirt,
  pants = '#1e293b',
  skin = '#f1c27d',
  peci = false,
  hijab,
  scale = 1,
  armAngle = 0,
  walkPhase = 0,
}) => {
  const legSwing = Math.sin(walkPhase) * 14;
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {/* Kaki */}
      <rect x="-11" y="42" width="9" height="36" rx="4.5" fill={pants} transform={`rotate(${legSwing} -6 42)`} />
      <rect x="2" y="42" width="9" height="36" rx="4.5" fill={pants} transform={`rotate(${-legSwing} 6 42)`} />
      {/* Badan */}
      <rect x="-16" y="0" width="32" height="48" rx="14" fill={shirt} />
      {/* Hijab jika ada */}
      {hijab && <circle cx="0" cy="-16" r="19" fill={hijab} />}
      {/* Kepala */}
      <circle cx="0" cy="-16" r="14" fill={skin} />
      {/* Rambut / Peci */}
      {!hijab && !peci && <path d="M -14 -18 A 14 14 0 0 1 14 -18 Z" fill="#1e293b" />}
      {peci && <rect x="-12" y="-31" width="24" height="11" rx="3" fill="#0f172a" />}
      {/* Mata & Senyum Halus */}
      <circle cx="5" cy="-17" r="2" fill="#1e293b" />
      <path d="M 3 -11 Q 7 -8 10 -11" fill="none" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
      {/* Lengan */}
      <rect
        x="-5"
        y="8"
        width="10"
        height="30"
        rx="5"
        fill={skin}
        transform={`rotate(${armAngle} 0 10)`}
      />
    </g>
  );
};

// Rumah Flat Modern Tanpa Garis Tepi Kasar
const FlatHouse: React.FC<{
  x: number;
  y: number;
  roofColor: string;
  wallColor?: string;
  doorColor?: string;
  scale?: number;
}> = ({ x, y, roofColor, wallColor = '#fefae0', doorColor = '#d4a373', scale = 1 }) => (
  <g transform={`translate(${x}, ${y}) scale(${scale})`}>
    <polygon points="90,0 180,68 0,68" fill={roofColor} />
    <rect x="16" y="68" width="148" height="122" fill={wallColor} />
    {/* Jendela Kiri & Kanan */}
    <rect x="30" y="92" width="32" height="32" rx="4" fill="#bae6fd" />
    <line x1="46" y1="92" x2="46" y2="124" stroke="#ffffff" strokeWidth="2.5" />
    <line x1="30" y1="108" x2="62" y2="108" stroke="#ffffff" strokeWidth="2.5" />
    <rect x="118" y="92" width="32" height="32" rx="4" fill="#bae6fd" />
    <line x1="134" y1="92" x2="134" y2="124" stroke="#ffffff" strokeWidth="2.5" />
    <line x1="118" y1="108" x2="150" y2="108" stroke="#ffffff" strokeWidth="2.5" />
    {/* Pintu */}
    <rect x="74" y="116" width="32" height="74" rx="4" fill={doorColor} />
    <circle cx="100" cy="154" r="2.5" fill="#fef08a" />
  </g>
);

// Atap Top-Down untuk Adegan Arsitektur Jaringan Tetangga (00:12 & 01:56 di referensi)
const TopDownRoof: React.FC<{
  x: number;
  y: number;
  color: string;
  doorSide?: 'bottom' | 'top' | 'left' | 'right';
  scale?: number;
}> = ({ x, y, color, doorSide = 'bottom', scale = 1 }) => (
  <g transform={`translate(${x}, ${y}) scale(${scale})`}>
    <rect x="-72" y="-48" width="144" height="96" rx="18" fill={color} opacity="0.95" />
    <line x1="-54" y1="0" x2="54" y2="0" stroke="rgba(255,255,255,0.35)" strokeWidth="4" strokeLinecap="round" />
    {doorSide === 'bottom' && <rect x="-14" y="34" width="28" height="14" rx="3" fill="#fefae0" />}
    {doorSide === 'top' && <rect x="-14" y="-48" width="28" height="14" rx="3" fill="#fefae0" />}
    {doorSide === 'left' && <rect x="-72" y="-14" width="14" height="28" rx="3" fill="#fefae0" />}
    {doorSide === 'right' && <rect x="58" y="-14" width="14" height="28" rx="3" fill="#fefae0" />}
  </g>
);

// Panggung Visual Penuh dengan Interpolasi Easing Halus & Animasi Bertahap
const SmoothEditorialStage: React.FC<{
  sceneIndex: number;
  sceneFrame: number;
  sceneDuration: number;
  fps: number;
  points: PointItem[];
}> = ({ sceneIndex, sceneFrame, sceneDuration, fps, points }) => {
  const variant = sceneIndex % 12;

  // Kurva gerak mulus (Ease-In-Out Cubic)
  const t = Math.min(1, sceneFrame / Math.max(1, sceneDuration));
  const smoothT = Easing.inOut(Easing.cubic)(t);
  const stage1 = spring({ frame: sceneFrame, fps, config: { damping: 18, stiffness: 90 } });
  const stage2 = spring({
    frame: Math.max(0, sceneFrame - Math.floor(sceneDuration * 0.32)),
    fps,
    config: { damping: 18, stiffness: 90 },
  });
  const stage3 = spring({
    frame: Math.max(0, sceneFrame - Math.floor(sceneDuration * 0.64)),
    fps,
    config: { damping: 18, stiffness: 90 },
  });

  // Gerakan napas & gelombang lembut
  const breathe = Math.sin((sceneFrame / fps) * 2.2);
  const cloudX = interpolate(sceneFrame, [0, sceneDuration], [-40, 60]);
  const camZoom = interpolate(smoothT, [0, 1], [1.0, 1.045]);

  return (
    <svg
      width="1080"
      height="1920"
      viewBox="0 0 1080 1920"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        transform: `scale(${camZoom})`,
      }}
    >
      {/* Partikel Cahaya Halus di Latar Belakang */}
      {[
        [180, 420],
        [890, 380],
        [240, 1280],
        [840, 1220],
        [540, 480],
        [150, 860],
        [930, 890],
      ].map(([px, py], i) => (
        <circle
          key={i}
          cx={px + Math.sin((sceneFrame + i * 20) / 25) * 14}
          cy={py + Math.cos((sceneFrame + i * 20) / 25) * 14}
          r={3 + (i % 3)}
          fill="#ffffff"
          opacity={0.18 + (i % 2) * 0.12}
        />
      ))}

      {/* === SCENE 0: Deretan Rumah Pagi, Warga Menyapu, Berangkat Kerja & Anak Bermain === */}
      {variant === 0 && (
        <g>
          {/* Matahari Hangat & Awan Lembut */}
          <circle cx="810" cy="680" r="78" fill="#fef08a" opacity="0.55" />
          <g transform={`translate(${240 + cloudX}, 540)`} opacity="0.65">
            <path d="M 20 35 Q 40 5 75 20 Q 105 0 135 25 Q 160 25 160 45 L 15 45 Z" fill="#ffffff" />
          </g>
          <g transform={`translate(${760 - cloudX * 0.7}, 580)`} opacity="0.5">
            <path d="M 20 35 Q 40 5 75 20 Q 105 0 135 25 Q 160 25 160 45 L 15 45 Z" fill="#ffffff" />
          </g>

          {/* 3 Rumah Berdampingan */}
          <FlatHouse x={70} y={760} roofColor="#e07a5f" scale={1.35} />
          <FlatHouse x={415} y={760} roofColor="#3d85c6" scale={1.35} />
          <FlatHouse x={765} y={760} roofColor="#c06c84" scale={1.35} />

          {/* Lengkungan Cahaya Penghubung Antar Rumah */}
          <path
            d="M 210 755 Q 370 670 535 755 Q 700 670 885 755"
            fill="none"
            stroke="#fef08a"
            strokeWidth="4"
            strokeDasharray="10 10"
            strokeDashoffset={-sceneFrame * 2}
            opacity={stage2}
          />

          {/* Jalan Aspal & Marka */}
          <rect x="0" y="1020" width="1080" height="320" fill="#4a5568" />
          <line x1="0" y1="1150" x2="1080" y2="1150" stroke="#cbd5e1" strokeWidth="8" strokeDasharray="48 36" />

          {/* Warga 1: Menyapu di Kiri */}
          <g transform="translate(155, 975)">
            <FlatPerson x={0} y={0} shirt="#2a9d8f" armAngle={-25 + breathe * 12} scale={1.25} />
            <line
              x1="12"
              y1="10"
              x2={32 + breathe * 10}
              y2="92"
              stroke="#b45309"
              strokeWidth="5"
              strokeLinecap="round"
            />
          </g>

          {/* Warga 2: Berjalan Berangkat Kerja */}
          <FlatPerson
            x={interpolate(smoothT, [0, 1], [430, 860])}
            y={985}
            shirt="#1d3557"
            walkPhase={sceneFrame * 0.22}
            scale={1.25}
          />

          {/* Anak Bermain Bola */}
          <g transform={`translate(${interpolate(smoothT, [0, 1], [740, 640])}, 1005)`}>
            <FlatPerson x={0} y={0} shirt="#f4a261" scale={1.0} walkPhase={sceneFrame * 0.18} />
            <circle cx="-28" cy={52 - Math.abs(breathe) * 18} r="12" fill="#e76f51" />
          </g>
        </g>
      )}

      {/* === SCENE 1: Top-Down Arsitektur 5 Rumah & Jaringan Koneksi Bercahaya === */}
      {variant === 1 && (
        <g>
          {/* Garis Jalur Koneksi Bercahaya (Muncul di Stage 2) */}
          <g opacity={stage2}>
            {[
              [310, 740, 770, 740],
              [310, 740, 540, 950],
              [770, 740, 540, 950],
              [310, 1160, 540, 950],
              [770, 1160, 540, 950],
              [310, 1160, 770, 1160],
            ].map(([x1, y1, x2, y2], idx) => (
              <line
                key={idx}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#fde047"
                strokeWidth="5"
                strokeDasharray="16 12"
                strokeDashoffset={-sceneFrame * 2.5}
              />
            ))}
          </g>

          {/* 5 Atap Rumah Top-Down */}
          <g transform={`scale(${stage1})`} style={{ transformOrigin: '540px 950px' }}>
            <TopDownRoof x={310} y={740} color="#e07a5f" doorSide="bottom" scale={1.3} />
            <TopDownRoof x={770} y={740} color="#f2cc8f" doorSide="bottom" scale={1.3} />
            <TopDownRoof x={540} y={950} color="#4ea8de" doorSide="bottom" scale={1.35} />
            <TopDownRoof x={310} y={1160} color="#9b5de5" doorSide="top" scale={1.3} />
            <TopDownRoof x={770} y={1160} color="#3b82f6" doorSide="top" scale={1.3} />
          </g>

          {/* 3 Lencana Ikon Interaksi (Chat, Peduli, Aman) muncul bertahap */}
          {stage2 > 0.2 && (
            <g transform={`translate(540, 740) scale(${stage2})`}>
              <circle r="44" fill="#1e293b" stroke="#fde047" strokeWidth="4" />
              <circle cx="-12" cy="0" r="4" fill="#fde047" />
              <circle cx="0" cy="0" r="4" fill="#fde047" />
              <circle cx="12" cy="0" r="4" fill="#fde047" />
            </g>
          )}
          {stage3 > 0.2 && (
            <g transform={`translate(395, 950) scale(${stage3})`}>
              <circle r="44" fill="#1e293b" stroke="#f87171" strokeWidth="4" />
              <path d="M 0 14 L -14 0 A8 8 0 0 1 0 -11 A8 8 0 0 1 14 0 Z" fill="#f87171" />
            </g>
          )}
          {stage3 > 0.2 && (
            <g transform={`translate(685, 950) scale(${stage3})`}>
              <circle r="44" fill="#1e293b" stroke="#4ade80" strokeWidth="4" />
              <path d="M 0 -16 L 16 -9 V 3 C 16 13 9 19 0 22 C -9 19 -16 13 -16 3 V -9 Z" fill="#4ade80" />
            </g>
          )}
        </g>
      )}

      {/* === SCENE 2: Kitab Al-Qur'an Terbuka & Transisi ke Deretan Rumah === */}
      {variant === 2 && (
        <g>
          {/* Bingkai Bintang Islami Halus */}
          <rect
            x="340"
            y="640"
            width="400"
            height="400"
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="3"
            transform={`rotate(${sceneFrame * 0.15} 540 840)`}
          />
          <rect
            x="340"
            y="640"
            width="400"
            height="400"
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="3"
            transform={`rotate(${45 - sceneFrame * 0.15} 540 840)`}
          />

          {/* Kitab Terbuka Halus */}
          <g transform={`translate(540, ${840 + breathe * 6}) scale(${stage1})`}>
            <rect x="-255" y="-155" width="510" height="310" rx="22" fill="#8d5b4c" />
            <path d="M 0 -140 Q -120 -165 -235 -135 V 135 Q -120 105 0 135 Z" fill="#fefae0" />
            <path d="M 0 -140 Q 120 -165 235 -135 V 135 Q 120 105 0 135 Z" fill="#fcf6bd" />
            <line x1="0" y1="-140" x2="0" y2="135" stroke="#d4a373" strokeWidth="4" />
            {/* Penanda Pita Merah */}
            <polygon points="-14,135 6,135 6,195 -4,182 -14,195" fill="#e63946" />
            {/* Baris Teks & Highlight Ayat */}
            {[-90, -55, -20, 15, 50, 85].map((ly, i) => (
              <React.Fragment key={i}>
                <line x1="-200" y1={ly} x2="-35" y2={ly - 6} stroke="#cbd5e1" strokeWidth="9" strokeLinecap="round" />
                <line
                  x1="35"
                  y1={ly - 6}
                  x2="200"
                  y2={ly}
                  stroke={i === 2 ? '#eab308' : '#cbd5e1'}
                  strokeWidth={i === 2 ? '13' : '9'}
                  strokeLinecap="round"
                />
              </React.Fragment>
            ))}
          </g>

          {/* Pill Rujukan QS. An-Nisa: 36 */}
          <g transform={`translate(540, 560) scale(${stage2})`}>
            <rect x="-135" y="-26" width="270" height="52" rx="26" fill="rgba(15,23,42,0.75)" stroke="#facc15" strokeWidth="3" />
            <text x="0" y="9" textAnchor="middle" fontSize="26" fontWeight="800" fill="#facc15">
              QS. An-Nisa: 36
            </text>
          </g>
        </g>
      )}

      {/* === SCENE 3: Balon Kata Kasar -> Santun & Speaker Volume Turun + Mobil Parkir === */}
      {variant === 3 && (
        <g>
          <rect x="0" y="1060" width="1080" height="320" fill="#312e81" />
          <line x1="0" y1="1180" x2="1080" y2="1180" stroke="#818cf8" strokeWidth="7" strokeDasharray="44 32" />

          {/* Bagian Awal (t < 0.5): Dua Tetangga Berbicara — Balon Kasar Berubah Jadi Senyum */}
          {t < 0.52 ? (
            <g>
              <FlatPerson x={330} y={1005} shirt="#ea580c" armAngle={-45} scale={1.45} />
              <FlatPerson x={750} y={1005} shirt="#f8fafc" peci={true} scale={1.45} />

              {t < 0.26 ? (
                <g transform={`translate(470, 780) scale(${stage1})`}>
                  <polygon
                    points="0,-95 42,-65 110,-85 88,-30 140,0 88,30 110,85 42,65 0,95 -42,65 -110,85 -88,30 -140,0 -88,-30 -110,-85 -42,-65"
                    fill="#ef4444"
                    stroke="#ffffff"
                    strokeWidth="5"
                  />
                  <text x="0" y="-12" textAnchor="middle" fontSize="34" fontWeight="900" fill="#ffffff">
                    !?#
                  </text>
                  <path d="M -55 24 L -30 8 L -5 24 L 20 8 L 45 24" fill="none" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" />
                </g>
              ) : (
                <g transform={`translate(470, 780) scale(${stage2})`}>
                  <ellipse cx="0" cy="0" rx="135" ry="78" fill="#10b981" stroke="#ffffff" strokeWidth="5" />
                  <circle cx="0" cy="-6" r="30" fill="#facc15" />
                  <circle cx="-10" cy="-12" r="3.5" fill="#1e293b" />
                  <circle cx="10" cy="-12" r="3.5" fill="#1e293b" />
                  <path d="M -12 0 Q 0 14 12 0" fill="none" stroke="#1e293b" strokeWidth="3.5" strokeLinecap="round" />
                </g>
              )}
            </g>
          ) : (
            /* Bagian Kedua (t >= 0.52): Volume Speaker Turun & Mobil Parkir Tertib */
            <g>
              <FlatHouse x={110} y={760} roofColor="#e07a5f" scale={1.45} />
              {/* Speaker & Knob Volume */}
              <rect x="275" y="885" width="44" height="68" rx="8" fill="#1e293b" />
              <circle cx="297" cy="928" r="14" fill="#475569" />
              <g transform="translate(530, 810)">
                <circle r="68" fill="#1e1b4b" stroke="#facc15" strokeWidth="5" />
                <line
                  x1="0"
                  y1="0"
                  x2={Math.cos(interpolate(t, [0.52, 0.9], [-0.5, -2.4])) * 48}
                  y2={Math.sin(interpolate(t, [0.52, 0.9], [-0.5, -2.4])) * 48}
                  stroke="#facc15"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
                <text x="0" y="96" textAnchor="middle" fontSize="22" fontWeight="800" fill="#ffffff">
                  VOL TURUN
                </text>
              </g>
              {/* Kotak Akses Tetangga + Mobil Minggir */}
              <rect
                x="120"
                y="1080"
                width="260"
                height="72"
                rx="12"
                fill="none"
                stroke="#4ade80"
                strokeWidth="4"
                strokeDasharray="12 8"
              />
              <text x="250" y="1124" textAnchor="middle" fontSize="20" fontWeight="800" fill="#4ade80">
                AKSES TETANGGA
              </text>
              <g transform={`translate(${interpolate(t, [0.52, 0.9], [480, 740])}, 1075)`}>
                <rect x="0" y="24" width="150" height="44" rx="14" fill="#2dd4bf" />
                <path d="M 28 24 L 46 0 H 108 L 126 24 Z" fill="#5eead4" />
                <circle cx="34" cy="68" r="16" fill="#0f172a" />
                <circle cx="116" cy="68" r="16" fill="#0f172a" />
              </g>
            </g>
          )}
        </g>
      )}

      {/* === SCENE 4: Montase Kepedulian (Antar Makanan, Angkat Barang, Tengok Sakit) === */}
      {variant === 4 && (
        <g>
          <rect x="0" y="1020" width="1080" height="320" fill="#4a5568" />
          <line x1="0" y1="1150" x2="1080" y2="1150" stroke="#cbd5e1" strokeWidth="8" strokeDasharray="48 36" />

          {t < 0.35 && (
            <g>
              <FlatHouse x={570} y={740} roofColor="#3b82f6" scale={1.45} />
              <FlatPerson x={interpolate(t, [0, 0.35], [320, 490])} y={975} shirt="#ea580c" armAngle={-55} scale={1.35} />
              {/* Piring Makanan */}
              <ellipse cx={interpolate(t, [0, 0.35], [365, 535])} cy="975" rx="28" ry="8" fill="#ffffff" />
            </g>
          )}

          {t >= 0.35 && t < 0.7 && (
            <g transform={`translate(${interpolate(t, [0.35, 0.7], [340, 560])}, 975)`}>
              <FlatPerson x={-85} y={0} shirt="#3b82f6" armAngle={-45} scale={1.35} walkPhase={sceneFrame * 0.25} />
              <FlatPerson x={85} y={0} shirt="#ea580c" armAngle={45} scale={1.35} walkPhase={sceneFrame * 0.25} />
              <rect x="-75" y="-12" width="150" height="42" rx="8" fill="#d4a373" />
            </g>
          )}

          {t >= 0.7 && (
            <g transform="translate(540, 890)">
              <circle r="115" fill="#fb7185" transform={`scale(${1 + breathe * 0.05})`} />
              <path d="M 0 42 L -46 -4 A28 28 0 0 1 0 -40 A28 28 0 0 1 46 -4 Z" fill="#ffffff" />
            </g>
          )}
        </g>
      )}

      {/* === SCENE 5: Pagar Privasi (Mata Mengintip -> Gembok & Ponsel Aman) === */}
      {variant === 5 && (
        <g>
          {t < 0.55 ? (
            <g>
              <FlatHouse x={360} y={710} roofColor="#b5838d" wallColor="#e6ccb2" scale={2.0} />
              {/* Pagar Putih Depan Rumah */}
              <g transform="translate(220, 1020)">
                <rect x="0" y="25" width="640" height="12" fill="#f8fafc" />
                <rect x="0" y="75" width="640" height="12" fill="#f8fafc" />
                {Array.from({ length: 16 }).map((_, idx) => (
                  <rect key={idx} x={idx * 41} y="0" width="22" height="110" rx="4" fill="#ffffff" />
                ))}
              </g>
              {/* Transformasi Mata Mengintip menjadi Gembok Aman */}
              {t < 0.28 ? (
                <g transform="translate(540, 960)">
                  <ellipse cx="-26" cy="0" rx="22" ry="14" fill="#ffffff" />
                  <circle cx="-26" cy="0" r="8" fill="#0284c7" />
                  <ellipse cx="26" cy="0" rx="22" ry="14" fill="#ffffff" />
                  <circle cx="26" cy="0" r="8" fill="#0284c7" />
                </g>
              ) : (
                <g transform={`translate(540, 965) scale(${stage2})`}>
                  <circle r="56" fill="#0f172a" stroke="#facc15" strokeWidth="5" />
                  <path d="M -18 -6 V -20 A 18 18 0 0 1 18 -20 V -6" fill="none" stroke="#facc15" strokeWidth="7" strokeLinecap="round" />
                  <rect x="-24" y="-6" width="48" height="38" rx="8" fill="#facc15" />
                </g>
              )}
            </g>
          ) : (
            /* Ponsel dengan Perisai Privasi (Rahasia Tidak Diteruskan) */
            <g transform={`translate(540, 920) scale(${stage3})`}>
              <rect x="-135" y="-230" width="270" height="460" rx="34" fill="#0f172a" stroke="#e2e8f0" strokeWidth="8" />
              <rect x="-118" y="-175" width="236" height="365" rx="16" fill="#f8fafc" />
              <path d="M 0 -85 L 78 -52 V 14 C 78 68 44 102 0 120 C -44 102 -78 68 -78 14 V -52 Z" fill="#0f172a" stroke="#facc15" strokeWidth="6" />
              <rect x="-22" y="-6" width="44" height="36" rx="8" fill="#facc15" />
            </g>
          )}
        </g>
      )}

      {/* === SCENE 6: Perisai Rumah + 3 Checklist Kebersihan & Akses Jalan === */}
      {variant === 6 && (
        <g>
          {t < 0.45 ? (
            <g transform={`translate(540, 880) scale(${stage1})`}>
              <path
                d="M 0 -240 L 230 -150 V 35 C 230 175 135 265 0 310 C -135 265 -230 175 -230 35 V -150 Z"
                fill="rgba(250,204,21,0.12)"
                stroke="#facc15"
                strokeWidth="7"
              />
              <FlatHouse x={-125} y={-110} roofColor="#e07a5f" scale={1.38} />
              <path d="M -25 -155 L -5 -135 L 30 -175" fill="none" stroke="#facc15" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          ) : (
            <g transform="translate(540, 740)">
              {[
                { label: 'SAMPAH PADA TEMPATNYA', color: '#22c55e', active: stage2 },
                { label: 'SALURAN AIR LANCAR', color: '#38bdf8', active: stage2 },
                { label: 'JALAN TIDAK TERHALANG', color: '#facc15', active: stage3 },
              ].map((item, idx) => (
                <g key={idx} transform={`translate(0, ${idx * 155}) scale(${item.active})`}>
                  <rect x="-360" y="-52" width="720" height="112" rx="22" fill="rgba(255,255,255,0.08)" stroke={item.color} strokeWidth="3" />
                  <circle cx="-285" cy="4" r="24" fill={item.color} />
                  <path d="M -296 4 L -288 12 L -273 -4" fill="none" stroke="#0f172a" strokeWidth="6" strokeLinecap="round" />
                  <text x="-235" y="13" fontSize="28" fontWeight="900" fill="#ffffff">
                    {item.label}
                  </text>
                </g>
              ))}
            </g>
          )}
        </g>
      )}

      {/* === SCENE 7: Kebaikan Kecil — Sapaan, Senyum, Berbagi Makanan & Pelangi === */}
      {variant === 7 && (
        <g>
          <rect x="0" y="1020" width="1080" height="320" fill="#4a5568" />
          <line x1="0" y1="1150" x2="1080" y2="1150" stroke="#cbd5e1" strokeWidth="8" strokeDasharray="48 36" />

          {/* Pelangi Koneksi muncul di tahap akhir */}
          {stage3 > 0.1 && (
            <path
              d="M 220 820 A 320 260 0 0 1 860 820"
              fill="none"
              stroke="#facc15"
              strokeWidth="16"
              strokeLinecap="round"
              opacity={stage3 * 0.85}
            />
          )}

          <FlatHouse x={110} y={760} roofColor="#e07a5f" scale={1.4} />
          <FlatHouse x={720} y={760} roofColor="#3b82f6" scale={1.4} />

          {/* Dua Tetangga Saling Menyapa & Berbagi Makanan */}
          <FlatPerson x={455} y={975} shirt="#ef4444" armAngle={-55 + breathe * 10} scale={1.35} />
          <FlatPerson x={625} y={975} shirt="#eab308" peci={true} armAngle={45} scale={1.35} />
          <ellipse cx="540" cy="980" rx="34" ry="10" fill="#ffffff" />
        </g>
      )}

      {/* === SCENE 8: Beragam Warga Bersatu & Timbangan Keadilan === */}
      {variant === 8 && (
        <g>
          <rect x="0" y="1020" width="1080" height="320" fill="#4a5568" />
          <FlatHouse x={120} y={780} roofColor="#2563eb" scale={1.25} />
          <FlatHouse x={430} y={780} roofColor="#16a34a" scale={1.25} />
          <FlatHouse x={740} y={780} roofColor="#ea580c" scale={1.25} />

          {/* 6 Warga Beragam Latar Belakang */}
          {[
            { x: 220, shirt: '#db2777', hijab: '#be185d', s: 1.25 },
            { x: 315, shirt: '#facc15', s: 0.95 },
            { x: 430, shirt: '#f8fafc', peci: true, s: 1.25 },
            { x: 545, shirt: '#38bdf8', s: 1.25 },
            { x: 660, shirt: '#fb923c', hijab: '#f97316', s: 1.25 },
            { x: 825, shirt: '#94a3b8', s: 1.25 },
          ].map((p, idx) => (
            <FlatPerson
              key={idx}
              x={p.x}
              y={p.s < 1 ? 1005 : 980}
              shirt={p.shirt}
              hijab={p.hijab}
              peci={p.peci}
              scale={p.s}
              armAngle={Math.sin((sceneFrame + idx * 10) / 15) * 14}
            />
          ))}

          {/* Ikon Timbangan Keadilan di Atas */}
          {stage3 > 0.1 && (
            <g transform={`translate(540, 710) scale(${stage3})`}>
              <rect x="-6" y="-50" width="12" height="110" rx="6" fill="#facc15" />
              <rect x="-95" y="-42" width="190" height="10" rx="5" fill="#facc15" />
              <polygon points="-85,-32 -112,18 -58,18" fill="#fef08a" />
              <polygon points="85,-32 58,18 112,18" fill="#fef08a" />
            </g>
          )}
        </g>
      )}

      {/* === SCENE 9 & 10 & 11: Lingkaran Kampung Harmonis 8 Rumah + Hati Pusat === */}
      {variant >= 9 && (
        <g>
          {/* Lingkaran Orbit Cahaya Menghubungkan 8 Rumah */}
          <circle
            cx="540"
            cy="960"
            r="320"
            fill="none"
            stroke="#fde047"
            strokeWidth="6"
            strokeDasharray="24 14"
            strokeDashoffset={-sceneFrame * 2.5}
          />
          <circle cx="540" cy="960" r="145" fill="rgba(74, 222, 128, 0.25)" />
          <circle cx="540" cy="960" r="88" fill="#4ade80" transform={`scale(${1 + breathe * 0.04})`} style={{ transformOrigin: '540px 960px' }} />
          {/* Ikon Hati di Pusat */}
          <path d="M 540 990 L 506 955 A20 20 0 0 1 540 928 A20 20 0 0 1 574 955 Z" fill="#ef4444" />

          {/* 8 Rumah Mengelilingi Lingkaran */}
          {[
            { deg: -90, c: '#ef4444' },
            { deg: -45, c: '#eab308' },
            { deg: 0, c: '#14b8a6' },
            { deg: 45, c: '#6366f1' },
            { deg: 90, c: '#38bdf8' },
            { deg: 135, c: '#f97316' },
            { deg: 180, c: '#22c55e' },
            { deg: 225, c: '#ec4899' },
          ].map((item, idx) => {
            const rad = (item.deg * Math.PI) / 180;
            const hx = 540 + Math.cos(rad) * 320;
            const hy = 960 + Math.sin(rad) * 320;
            return (
              <g key={idx} transform={`translate(${hx}, ${hy}) scale(${stage1})`}>
                <rect x="-56" y="-42" width="112" height="84" rx="16" fill={item.c} />
                <line x1="-40" y1="0" x2="40" y2="0" stroke="rgba(255,255,255,0.4)" strokeWidth="4" />
                <rect x="-12" y="28" width="24" height="14" rx="3" fill="#fefae0" />
              </g>
            );
          })}
        </g>
      )}
    </svg>
  );
};

// Kinetic Subtitle Pil Gelap Semi-Transparan (Persis Gaya Claude Reference)
const CleanKineticSubtitle: React.FC<{
  body: string;
  sceneFrame: number;
  sceneDurationFrames: number;
  goldColor: string;
}> = ({ body, sceneFrame, sceneDurationFrames, goldColor }) => {
  const words = (body || '').trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return null;

  const CHUNK_SIZE = 6;
  const chunks: string[][] = [];
  for (let i = 0; i < words.length; i += CHUNK_SIZE) {
    chunks.push(words.slice(i, i + CHUNK_SIZE));
  }

  const effectiveFrames = Math.max(1, sceneDurationFrames * 0.94);
  const progress = Math.min(0.999, Math.max(0, sceneFrame / effectiveFrames));
  const activeChunkIdx = Math.min(chunks.length - 1, Math.floor(progress * chunks.length));
  const currentChunk = chunks[activeChunkIdx];

  const chunkStartFrame = (activeChunkIdx / chunks.length) * effectiveFrames;
  const localFrame = Math.max(0, sceneFrame - chunkStartFrame);
  const chunkDuration = effectiveFrames / chunks.length;
  const activeWordInChunk = Math.min(
    currentChunk.length - 1,
    Math.floor((localFrame / Math.max(1, chunkDuration)) * currentChunk.length)
  );

  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        padding: '0 24px',
      }}
    >
      <div
        style={{
          backgroundColor: 'rgba(15, 23, 42, 0.84)',
          backdropFilter: 'blur(8px)',
          borderRadius: 24,
          padding: '22px 32px',
          maxWidth: 920,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px 12px',
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.28)',
        }}
      >
        {currentChunk.map((word, idx) => {
          const isCurrent = idx === activeWordInChunk;
          return (
            <span
              key={`${activeChunkIdx}-${idx}`}
              style={{
                fontSize: 40,
                fontWeight: 800,
                lineHeight: 1.25,
                color: isCurrent ? goldColor : '#f8fafc',
                transform: isCurrent ? 'scale(1.06)' : 'scale(1)',
                transition: 'color 0.1s ease, transform 0.1s ease',
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

export const DynamicMotionVideo: React.FC<DynamicMotionProps> = ({
  title,
  subtitle,
  audioSrc,
  styleConfig = {},
  scenes = [],
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const goldColor = styleConfig.goldColor || '#facc15';

  const safeScenes = scenes.length > 0 ? scenes : [];
  if (safeScenes.length === 0) return <AbsoluteFill style={{ backgroundColor: '#0f172a' }} />;

  const weights = safeScenes.map((s) =>
    s.durationSec && s.durationSec > 0 ? s.durationSec : getSpeechWeight(s.body)
  );
  const totalWeight = weights.reduce((a, b) => a + b, 0);

  let accumulatedFrames = 0;
  const sceneRanges = safeScenes.map((scene, idx) => {
    const rawFrames = Math.round((weights[idx] / totalWeight) * durationInFrames);
    const startFrame = accumulatedFrames;
    const endFrame =
      idx === safeScenes.length - 1 ? durationInFrames : Math.min(durationInFrames, startFrame + rawFrames);
    accumulatedFrames = endFrame;
    return { scene, startFrame, endFrame, duration: Math.max(1, endFrame - startFrame) };
  });

  const currentIdx = Math.max(
    0,
    sceneRanges.findIndex((r) => frame >= r.startFrame && frame < r.endFrame)
  );
  const activeRange = sceneRanges[currentIdx] || sceneRanges[sceneRanges.length - 1];
  const { scene, startFrame, duration: sceneDuration } = activeRange;
  const sceneFrame = Math.max(0, frame - startFrame);

  // Transisi Crossfade Halus Antar Scene (10 frame)
  const sceneOpacity = interpolate(sceneFrame, [0, 10], [0, 1], { extrapolateRight: 'clamp' });
  const headingSlide = interpolate(
    spring({ frame: sceneFrame, fps, config: { damping: 16, stiffness: 110 } }),
    [0, 1],
    [28, 0]
  );

  // Pisahkan kata terakhir heading untuk diberi aksen warna emas (seperti "HIDUP SENDIRI", "TEMPAT TINGGAL")
  const headingWords = (scene.heading || '').trim().split(/\s+/);
  const splitPoint = Math.max(1, Math.ceil(headingWords.length / 2));
  const headingLine1 = headingWords.slice(0, splitPoint).join(' ');
  const headingLine2 = headingWords.slice(splitPoint).join(' ');

  return (
    <AbsoluteFill
      style={{
        background: SCENE_GRADIENTS[currentIdx % SCENE_GRADIENTS.length],
        fontFamily: "'Inter', 'Montserrat', system-ui, sans-serif",
        overflow: 'hidden',
      }}
    >
      {audioSrc ? <Audio src={staticFile(audioSrc)} /> : null}

      {/* PANGGUNG VISUAL PENUH (Smooth Lineless Flat Animation) */}
      <div style={{ opacity: sceneOpacity }}>
        <SmoothEditorialStage
          sceneIndex={currentIdx}
          sceneFrame={sceneFrame}
          sceneDuration={sceneDuration}
          fps={fps}
          points={scene.points || []}
        />
      </div>

      {/* OVERLAY UI MINIMALIS ATAS & BAWAH */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          height: '100%',
          padding: '86px 48px 140px 48px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        {/* TOP PROGRESS LINE + JUDUL BERSIH DUA WARNA */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* Garis Progress Minimalis Berujung Titik Emas */}
          <div
            style={{
              width: 720,
              height: 4,
              backgroundColor: 'rgba(255,255,255,0.28)',
              borderRadius: 99,
              position: 'relative',
              marginBottom: 56,
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${(frame / Math.max(1, durationInFrames)) * 100}%`,
                backgroundColor: goldColor,
                borderRadius: 99,
                position: 'relative',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  right: -7,
                  top: -5,
                  width: 14,
                  height: 14,
                  borderRadius: 99,
                  backgroundColor: goldColor,
                  boxShadow: `0 0 12px ${goldColor}`,
                }}
              />
            </div>
          </div>

          {/* Pill Konteks Kecil jika Scene Akhir */}
          {currentIdx === safeScenes.length - 1 && (
            <div
              style={{
                backgroundColor: 'rgba(15, 23, 42, 0.72)',
                border: `2px solid ${goldColor}`,
                color: goldColor,
                padding: '8px 24px',
                borderRadius: 99,
                fontSize: 22,
                fontWeight: 800,
                letterSpacing: 1.5,
                marginBottom: 18,
              }}
            >
              {title || subtitle}
            </div>
          )}

          {/* Judul Besar Tanpa Kotak Banner */}
          <div
            style={{
              textAlign: 'center',
              transform: `translateY(${headingSlide}px)`,
              opacity: sceneOpacity,
              textShadow: '0 4px 18px rgba(0,0,0,0.28)',
            }}
          >
            <div style={{ fontSize: 64, fontWeight: 900, lineHeight: 1.12, color: '#ffffff', letterSpacing: 1 }}>
              {headingLine1}
            </div>
            {headingLine2 && (
              <div style={{ fontSize: 64, fontWeight: 900, lineHeight: 1.12, color: goldColor, letterSpacing: 1 }}>
                {headingLine2}
              </div>
            )}
          </div>
        </div>

        {/* BOTTOM KINETIC SUBTITLE */}
        <CleanKineticSubtitle
          body={scene.body}
          sceneFrame={sceneFrame}
          sceneDurationFrames={sceneDuration}
          goldColor={goldColor}
        />
      </div>
    </AbsoluteFill>
  );
};

export default DynamicMotionVideo;
