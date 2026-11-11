import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

const FPS = 30;
const DURATION = 360;
const C = {
  ink: "#18232B",
  paper: "#F2EFE7",
  wall: "#E7E1D6",
  floor: "#CFC8BC",
  coral: "#E96E54",
  coralDark: "#B94E3C",
  teal: "#347F79",
  tealLight: "#75AAA1",
  gold: "#E5B85B",
  lilac: "#A69AC0",
  white: "#FFFDF8",
  grey: "#8C9698",
};

const clamp = (v:number, a=0, b=1) => Math.max(a, Math.min(b, v));
const ease = (f:number, a:number, b:number) =>
  interpolate(f, [a,b], [0,1], {extrapolateLeft:"clamp", extrapolateRight:"clamp", easing:Easing.inOut(Easing.cubic)});
const springValue = (f:number, fps:number, stiffness=110, damping=15, mass=0.8) =>
  spring({frame:Math.max(0,f), fps, config:{stiffness,damping,mass}});

const Shadow:React.FC<{x:number;y:number;rx:number;opacity?:number}> = ({x,y,rx,opacity=0.15}) =>
  <ellipse cx={x} cy={y} rx={rx} ry="17" fill={C.ink} opacity={opacity}/>;

const Character:React.FC<{f:number}> = ({f}) => {
  // Character travels into frame, plants feet, leans, pushes the door, then walks through.
  const enter = ease(f, 0, 18);
  const x = interpolate(f,[0,24,112,138,188,248,294,360],[-250,-250,335,335,365,700,880,920],{
    extrapolateLeft:"clamp",extrapolateRight:"clamp",
    easing:Easing.bezier(0.22,0.78,0.25,1)
  });
  const walking = (f>=24 && f<112) || (f>=248 && f<294);
  const phase = walking ? (f<112 ? (f-24)*0.16 : (f-248)*0.16) : 0;
  const stride = walking ? Math.sin(phase) : 0;
  const opposite = walking ? Math.sin(phase+Math.PI) : 0;
  const bob = walking ? Math.abs(Math.sin(phase*2))*8 : 0;
  const push = ease(f,138,166) * (1-ease(f,184,205));
  const lean = push*17 + (f>=112 && f<138 ? ease(f,112,132)*-5 : 0);
  const armReach = ease(f,132,154) * (1-ease(f,184,202));
  const exitFade = 1-ease(f,320,350);

  const legA = walking ? stride*25 : (push*8);
  const legB = walking ? opposite*25 : (-push*8);
  const armA = walking ? -stride*22 : (-8-push*20);
  const armB = walking ? stride*22 : (8+armReach*55);
  const bodyY = 0 - bob + push*5;
  const scale = interpolate(f,[0,100,180,280,360],[0.94,1,1.02,0.98,0.94],{extrapolateLeft:"clamp",extrapolateRight:"clamp"});

  return (
    <g transform={`translate(${x} ${1420+bodyY}) scale(${scale})`} opacity={enter*exitFade}>
      <Shadow x={0} y={218} rx={75} opacity={0.18}/>
      {/* Rear leg */}
      <g transform={`translate(-23 104) rotate(${legB})`}>
        <path d="M0 0 Q-6 44 -12 91 L-15 170" fill="none" stroke={C.ink} strokeWidth="29" strokeLinecap="round"/>
        <path d="M-15 170 Q-10 184 24 184" fill="none" stroke={C.ink} strokeWidth="24" strokeLinecap="round"/>
      </g>
      {/* Front leg */}
      <g transform={`translate(22 104) rotate(${legA})`}>
        <path d="M0 0 Q7 45 13 91 L17 170" fill="none" stroke={C.ink} strokeWidth="29" strokeLinecap="round"/>
        <path d="M17 170 Q24 184 58 184" fill="none" stroke={C.ink} strokeWidth="24" strokeLinecap="round"/>
      </g>
      {/* torso and limbs counter-swing */}
      <g transform={`rotate(${lean})`}>
        <path d="M-58 -65 Q-70 -84 -53 -101 L51 -101 Q70 -84 58 -65 L49 105 Q0 124 -49 105 Z" fill={C.teal}/>
        <path d="M-42 -58 Q0 -43 42 -58" stroke={C.tealLight} strokeWidth="8" fill="none" opacity=".8"/>
        <g transform={`translate(-54 -77) rotate(${armA})`}>
          <path d="M0 0 Q-17 42 -20 84" stroke={C.ink} strokeWidth="22" fill="none" strokeLinecap="round"/>
          <circle cx="-20" cy="88" r="13" fill="#C98F70"/>
        </g>
        <g transform={`translate(54 -77) rotate(${armB})`}>
          <path d={`M0 0 Q${armReach*5+15} 38 ${armReach*80+22} ${armReach*18+82}`} stroke={C.ink} strokeWidth="22" fill="none" strokeLinecap="round"/>
          <circle cx={armReach*80+22} cy={armReach*18+86} r="13" fill="#C98F70"/>
        </g>
        <rect x="-15" y="-132" width="30" height="43" rx="10" fill="#C98F70"/>
        <circle cx="0" cy="-177" r="51" fill="#D7A17F"/>
        <path d="M-49 -185 Q-46 -238 5 -234 Q51 -229 51 -181 Q20 -203 -12 -200 Q-34 -198 -49 -185" fill={C.ink}/>
        <circle cx="18" cy="-178" r="4.5" fill={C.ink}/>
        <path d="M14 -153 Q27 -145 38 -153" stroke={C.ink} strokeWidth="4" fill="none" strokeLinecap="round"/>
      </g>
    </g>
  );
};

const Door:React.FC<{f:number}> = ({f}) => {
  const anticipation = ease(f,118,132);
  const open = springValue(f-164,FPS,58,18,1.25);
  const angle = interpolate(open,[0,1],[0,-78]);
  const closeGlow = ease(f,158,185);
  return (
    <g>
      {/* door recess and frame */}
      <rect x="535" y="760" width="300" height="690" rx="5" fill="#BEB7AB" opacity=".42"/>
      <rect x="548" y="772" width="270" height="670" fill="#D5CEC2"/>
      <path d="M548 1442 V772 H818 V1442" fill="none" stroke={C.ink} strokeWidth="19"/>
      {/* interior light */}
      <path d="M818 780 L1050 690 L1080 1540 L818 1440 Z" fill={C.gold} opacity={closeGlow*.28}/>
      {/* hinged slab: origin is the left hinge */}
      <g transform={`translate(560 790) rotate(${angle})`}>
        <rect x="0" y="0" width="248" height="640" rx="5" fill={C.coralDark}/>
        <rect x="12" y="12" width="224" height="616" rx="3" fill={C.coral}/>
        <rect x="35" y="42" width="178" height="240" rx="4" fill="#F28C73" opacity=".7"/>
        <rect x="35" y="308" width="178" height="278" rx="4" fill="#D85E49" opacity=".55"/>
        <circle cx="207" cy="333" r="12" fill={C.gold}/>
        <rect x="-7" y="110" width="14" height="62" rx="6" fill={C.gold}/>
        <rect x="-7" y="485" width="14" height="62" rx="6" fill={C.gold}/>
      </g>
      {/* hinge vibration */}
      <g opacity={anticipation*.75}>
        <path d="M530 880 l-18 -8 M530 900 l-20 0 M530 920 l-18 8" stroke={C.gold} strokeWidth="6" strokeLinecap="round"/>
      </g>
    </g>
  );
};

const Environment:React.FC<{f:number}> = ({f}) => {
  const parallax = interpolate(f,[0,180,359],[0,-35,24],{extrapolateLeft:"clamp",extrapolateRight:"clamp",easing:Easing.inOut(Easing.cubic)});
  return (
    <g>
      <rect width="1080" height="1920" fill={C.paper}/>
      {/* far wall */}
      <g transform={`translate(${parallax*.22} 0)`}>
        <rect x="0" y="0" width="1080" height="1460" fill={C.wall}/>
        <path d="M90 0 V1460 M990 0 V1460" stroke="#D2CBC0" strokeWidth="3" opacity=".5"/>
        <rect x="92" y="480" width="280" height="270" fill="#F8F5EE" opacity=".48"/>
        <rect x="760" y="420" width="220" height="320" fill="#F8F5EE" opacity=".42"/>
        <path d="M0 760 H1080" stroke="#D1C9BD" strokeWidth="4" opacity=".45"/>
      </g>
      {/* floor */}
      <path d="M0 1450 Q270 1418 540 1450 T1080 1440 V1920 H0 Z" fill={C.floor}/>
      <path d="M0 1450 Q270 1418 540 1450 T1080 1440" fill="none" stroke="#BEB6AA" strokeWidth="5"/>
      <g opacity=".16" transform={`translate(${parallax*.65} 0)`}>
        {Array.from({length:8},(_,i)=><path key={i} d={`M${i*170-200} 1460 L${i*170+80} 1920`} stroke={C.ink} strokeWidth="2"/>)}
      </g>
    </g>
  );
};

const InformationPanel:React.FC<{f:number}> = ({f}) => {
  const p = springValue(f-218,FPS,95,13,.75);
  const y = interpolate(p,[0,1],[160,0]);
  const rot = interpolate(p,[0,1],[-12,0]);
  const pulse = 1+Math.sin(Math.max(0,f-235)*.09)*.012;
  const opacity = ease(f,210,232)*(1-ease(f,316,344));
  return (
    <g transform={`translate(105 ${780+y}) rotate(${rot} 170 110) scale(${pulse})`} opacity={opacity}>
      <rect x="0" y="0" width="350" height="226" rx="22" fill={C.white} />
      <rect x="27" y="28" width="95" height="10" rx="5" fill={C.grey} opacity=".42"/>
      <rect x="27" y="60" width="265" height="19" rx="9" fill={C.ink}/>
      <rect x="27" y="94" width="210" height="11" rx="5" fill={C.grey} opacity=".45"/>
      <path d="M28 178 L92 146 L152 162 L220 118 L302 132" fill="none" stroke={C.teal} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="220" cy="118" r="10" fill={C.coral}/>
    </g>
  );
};

const LightParticles:React.FC<{f:number}> = ({f}) => {
  const reveal = ease(f,165,205);
  return <g opacity={reveal*.8}>
    {Array.from({length:18},(_,i)=>{
      const t=(f*0.9+i*31)%180;
      const x=650+Math.sin(i*2.4)*80+t*1.15;
      const y=990+Math.cos(i*1.7)*220-t*.7;
      const r=2+(i%4)*1.4;
      return <circle key={i} cx={x} cy={y} r={r} fill={C.gold} opacity={.25+(i%5)*.12}/>;
    })}
  </g>;
};

const Typography:React.FC<{f:number}> = ({f}) => {
  const intro = springValue(f-14,FPS,125,15,.7);
  const introY = interpolate(intro,[0,1],[95,0]);
  const lineW = interpolate(f,[28,80],[0,500],{extrapolateLeft:"clamp",extrapolateRight:"clamp",easing:Easing.out(Easing.cubic)});
  const second = ease(f,180,210);
  const third = ease(f,258,288);
  return (
    <g fontFamily="Arial, Helvetica, sans-serif">
      <g transform={`translate(82 ${230+introY})`} opacity={1-ease(f,182,205)}>
        <text x="0" y="0" fill={C.ink} fontSize="28" fontWeight="800" letterSpacing="5">ORION / MOTION LAB 02</text>
        <text x="0" y="112" fill={C.ink} fontSize="82" fontWeight="900" letterSpacing="-3">JANGAN</text>
        <text x="0" y="198" fill={C.coral} fontSize="82" fontWeight="900" letterSpacing="-3">BERHENTI.</text>
        <rect x="0" y="232" width={lineW} height="8" rx="4" fill={C.teal}/>
      </g>
      <g opacity={second*(1-third)} transform={`translate(84 350)`}>
        <text x="0" y="0" fill={C.ink} fontSize="34" fontWeight="800" letterSpacing="2">SATU LANGKAH</text>
        <text x="0" y="58" fill={C.coral} fontSize="48" fontWeight="900">Membuka kemungkinan.</text>
      </g>
      <g opacity={third} transform={`translate(84 350)`}>
        <text x="0" y="0" fill={C.ink} fontSize="34" fontWeight="800" letterSpacing="2">RUANG BARU.</text>
        <text x="0" y="58" fill={C.teal} fontSize="48" fontWeight="900">Cara pandang baru.</text>
      </g>
    </g>
  );
};

const Scene:React.FC<{f:number}> = ({f}) => {
  const zoom = interpolate(f,[0,110,180,300,359],[1,1.035,1.065,1.025,1],{extrapolateLeft:"clamp",extrapolateRight:"clamp",easing:Easing.inOut(Easing.cubic)});
  const camX = interpolate(f,[0,110,190,300,359],[0,-12,-38,-22,0],{extrapolateLeft:"clamp",extrapolateRight:"clamp",easing:Easing.inOut(Easing.cubic)});
  const flash = ease(f,162,178)*(1-ease(f,188,210));
  return (
    <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{position:"absolute",inset:0}}>
      <defs>
        <radialGradient id="doorGlow"><stop offset="0" stopColor={C.gold} stopOpacity=".45"/><stop offset="1" stopColor={C.gold} stopOpacity="0"/></radialGradient>
        <linearGradient id="fadeBottom" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={C.ink} stopOpacity="0"/><stop offset="1" stopColor={C.ink} stopOpacity=".16"/></linearGradient>
      </defs>
      <Environment f={f}/>
      <g transform={`translate(${camX} 0) translate(540 960) scale(${zoom}) translate(-540 -960)`}>
        <ellipse cx="690" cy="1110" rx="420" ry="510" fill="url(#doorGlow)" opacity={ease(f,150,195)}/>
        <Door f={f}/>
        <LightParticles f={f}/>
        <Character f={f}/>
        <InformationPanel f={f}/>
      </g>
      <Typography f={f}/>
      {/* action accent at contact, expands and dissipates */}
      {f>145 && f<190 ? <g opacity={1-ease(f,145,190)}>
        <circle cx="808" cy="1118" r={interpolate(f,[145,190],[12,180])} fill="none" stroke={C.gold} strokeWidth="7"/>
        <circle cx="808" cy="1118" r={interpolate(f,[145,190],[5,105])} fill="none" stroke={C.coral} strokeWidth="4"/>
      </g>:null}
      <rect width="1080" height="1920" fill={C.white} opacity={flash*.16}/>
      <rect x="0" y="1680" width="1080" height="240" fill="url(#fadeBottom)"/>
    </svg>
  );
};

export const OrionV62:React.FC = () => {
  const f = Math.min(useCurrentFrame(),DURATION-1);
  const {fps} = useVideoConfig();
  const end = ease(f,326,359);
  return (
    <AbsoluteFill style={{backgroundColor:C.paper,overflow:"hidden"}}>
      <Scene f={f}/>
      <AbsoluteFill style={{justifyContent:"flex-end",padding:"0 62px 62px",opacity:end}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",fontFamily:"Arial, sans-serif",fontSize:20,fontWeight:800,letterSpacing:3,color:C.ink}}>
          <span>ORION CREATIVE</span><span>V6.2 / MOTION LAB</span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const ORION_V62_DURATION = DURATION;
