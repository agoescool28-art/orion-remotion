import React from "react";
import { AbsoluteFill, Audio, Easing, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";

const W=1080,H=1920,FPS=30, DURATION=2237;
const C={navy:"#101B2A",navy2:"#1B2B3D",paper:"#F4F0E8",white:"#FFFDF8",muted:"#AEBBC7",orange:"#FF8657",teal:"#69C6B5",red:"#E56F70",gold:"#E8C46A",line:"#40566B"};
const clamp={extrapolateLeft:"clamp" as const,extrapolateRight:"clamp" as const};
const ease=(f:number,a:number,b:number)=>interpolate(f,[a,b],[0,1],{...clamp,easing:Easing.inOut(Easing.cubic)});
const spring=(f:number,a:number,d=24)=>interpolate(f,[a,a+d],[0,1],{...clamp,easing:Easing.out(Easing.back(1.25))});
const fade=(f:number,a:number,b:number)=>interpolate(f,[a,a+18,b-18,b],[0,1,1,0],clamp);
const tx=(f:number,a:number,b:number,from:number,to:number)=>interpolate(f,[a,b],[from,to],clamp);

const Label:React.FC<{x:number;y:number;text:string;color?:string;size?:number;anchor?: "start"|"middle"|"end";spacing?:number}> =
({x,y,text,color=C.white,size=28,anchor="start",spacing=1})=><text x={x} y={y} fill={color} fontSize={size} fontWeight="900" textAnchor={anchor} letterSpacing={spacing}>{text}</text>;

const SceneIntro:React.FC<{f:number}> = ({f})=>{
 const p=spring(f,4,30), pulse=1+Math.sin(f*.12)*.025;
 return <g>
  <g transform={`translate(540 990) scale(${pulse})`}>
   <circle r="330" fill="none" stroke={C.line} strokeWidth="2" strokeDasharray="5 18"/>
   <circle r="250" fill={C.navy2} stroke={C.orange} strokeWidth="3"/>
   <g opacity=".7">{Array.from({length:12},(_,i)=><line key={i} x1="0" y1="-250" x2="0" y2="-330" stroke={C.line} strokeWidth="2" transform={`rotate(${i*30})`}/>)}</g>
   <g transform={`scale(${p})`}>
    <circle r="95" fill={C.orange} opacity=".14"/>
    <path d="M-90 0 L-42 -55 L0 -18 L52 -80 L95 -24" fill="none" stroke={C.orange} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="95" cy="-24" r="15" fill={C.teal}/>
   </g>
  </g>
  {Array.from({length:8},(_,i)=>{const a=i*Math.PI/4+f*.012;const r=430;return <g key={i} opacity={.7}><circle cx={540+Math.cos(a)*r} cy={990+Math.sin(a)*r} r="12" fill={i%2?C.teal:C.gold}/><line x1={540+Math.cos(a)*r*.78} y1={990+Math.sin(a)*r*.78} x2={540+Math.cos(a)*r*.92} y2={990+Math.sin(a)*r*.92} stroke={C.line} strokeWidth="3"/></g>})}
 <g opacity={fade(f,0,120)}><Label x={540} y={1510} text="KETIKA KEMAMPUAN" color={C.muted} size={27} anchor="middle" spacing={4}/><Label x={540} y={1590} text="DIANGGAP ANCAMAN" color={C.white} size={54} anchor="middle" spacing={0}/></g>
 </g>;
};

const SceneRoom:React.FC<{f:number}> = ({f})=>{
 const shift=tx(f,0,210,0,-90);
 return <g>
  <g transform={`translate(${shift} 0)`}>
   <rect x="105" y="610" width="870" height="820" rx="28" fill={C.navy2} stroke={C.line} strokeWidth="3"/>
   <path d="M105 900 H975 M540 610 V1430" stroke={C.line} strokeWidth="3" opacity=".6"/>
   {Array.from({length:5},(_,i)=><g key={i}><rect x={180+i*150} y="720" width="95" height="130" rx="12" fill={i===2?C.orange:C.line} opacity={i===2?.9:.5}/><circle cx={227+i*150} cy="680" r="28" fill={i===2?C.orange:C.muted}/><path d={`M${195+i*150} 875 v110`} stroke={C.muted} strokeWidth="13" strokeLinecap="round"/></g>)}
   <rect x="430" y="1040" width="220" height="250" rx="18" fill={C.orange} opacity=".16" stroke={C.orange} strokeWidth="3"/>
   <Label x={540} y={1165} text="IDE BARU" color={C.orange} size={28} anchor="middle"/>
  </g>
  <path d="M150 1500 H930" stroke={C.orange} strokeWidth="5" strokeDasharray="12 18" opacity=".8"/>
  <Label x={540} y={1590} text="KEHADIRAN MENGUBAH" size={42} anchor="middle"/>
  <Label x={540} y={1650} text="PERMAINAN" color={C.orange} size={54} anchor="middle"/>
 </g>;
};

const SceneSkill:React.FC<{f:number}> = ({f})=>{
 const t=ease(f,0,170);
 return <g>
  <g transform={`translate(540 1000) rotate(${tx(f,0,210,-12,0)})`}>
   <rect x="-255" y="-260" width="510" height="520" rx="36" fill={C.paper}/>
   <rect x="-205" y="-210" width="410" height="70" rx="14" fill={C.navy2}/>
   <Label x={0} y={-164} text="WORKFLOW" size={27} color={C.white} anchor="middle"/>
   {Array.from({length:4},(_,i)=><g key={i}><rect x="-190" y={-85+i*85} width={380} height="52" rx="12" fill={i===2?C.teal:"#D8D2C7"}/><rect x="-165" y={-68+i*85} width={160+(i%2)*65} height="16" rx="8" fill={C.navy} opacity=".5"/></g>)}
   <circle cx="165" cy="185" r="54" fill={C.orange}/><path d="M140 185 l18 18 34 -42" stroke={C.navy} strokeWidth="10" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
  </g>
  <g opacity={t} transform={`translate(0 ${tx(f,0,170,60,0)})`}>
   <path d="M190 1390 L330 1240 L450 1320 L650 1100 L850 1180" fill="none" stroke={C.teal} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round"/>
   <Label x={540} y={1510} text="CARA KERJA LEBIH BAIK" size={31} anchor="middle"/>
   <Label x={540} y={1570} text="PIKIRAN LEBIH TERBUKA" size={31} color={C.teal} anchor="middle"/>
  </g>
 </g>;
};

const SceneThreat:React.FC<{f:number}> = ({f})=>{
 const crack=ease(f,95,205);
 return <g>
  <rect x="110" y="570" width="860" height="950" rx="34" fill={C.navy2} stroke={C.line} strokeWidth="3"/>
  <g opacity=".9">
   {Array.from({length:6},(_,i)=><rect key={i} x={180+i*125} y="700" width="80" height="500" rx="12" fill={i===3?C.orange:C.line} opacity={i===3?.85:.45}/>)}
  </g>
  <path d={`M540 600 L${500-crack*85} 850 L${590+crack*90} 1010 L${500-crack*50} 1210 L540 1510`} stroke={C.orange} strokeWidth={4+crack*10} fill="none" strokeLinecap="round"/>
  <circle cx="540" cy="1020" r={120+crack*85} fill="none" stroke={C.orange} strokeWidth="3" opacity={crack*.6}/>
  <Label x={540} y={1630} text="PERUBAHAN TERASA" size={36} anchor="middle"/>
  <Label x={540} y={1690} text="MENGANCAM STATUS QUO" size={39} color={C.orange} anchor="middle"/>
 </g>;
};

const SceneAttack:React.FC<{f:number}> = ({f})=>{
 const words=["SOK PINTAR","AMBISIUS","SULIT DIAJAK KERJA SAMA"];
 return <g>
  <g transform={`translate(540 1010) rotate(${tx(f,0,190,-8,0)})`}>
   <circle r="180" fill={C.red} opacity=".12"/><circle r="120" fill={C.navy2} stroke={C.red} strokeWidth="4"/>
   <circle cy="-45" r="38" fill={C.paper}/><path d="M-68 92 Q-58 0 0 0 Q58 0 68 92" fill={C.paper}/>
   <path d="M-65 -15 L65 15" stroke={C.red} strokeWidth="9"/>
  </g>
  {words.map((w,i)=>{const x=[245,790,540][i],y=[650,1020,1390][i];const a=spring(f,20+i*34,22);return <g key={w} opacity={a} transform={`translate(${x} ${y}) rotate(${[-8,7,-4][i]}) scale(${.7+.3*a})`}><rect x="-190" y="-43" width="380" height="86" rx="18" fill={C.red}/><Label x={0} y={10} text={w} size={i===2?20:25} anchor="middle"/></g>})}
 </g>;
};

const SceneReality:React.FC<{f:number}> = ({f})=>{
 const split=ease(f,0,130);
 return <g>
  <rect x="90" y="600" width="430" height="780" rx="28" fill={C.teal} opacity=".12" stroke={C.teal} strokeWidth="3"/>
  <rect x="560" y="600" width="430" height="780" rx="28" fill={C.orange} opacity=".1" stroke={C.orange} strokeWidth="3"/>
  <g transform={`translate(0 ${split*30})`}>
   <circle cx="305" cy="830" r="72" fill={C.teal}/><path d="M210 1150 Q220 930 305 930 Q390 930 400 1150" fill={C.teal}/>
   <circle cx="775" cy="830" r="72" fill={C.orange}/><path d="M680 1150 Q690 930 775 930 Q860 930 870 1150" fill={C.orange}/>
  </g>
  <Label x={305} y={1240} text="LINGKUNGAN" size={24} anchor="middle"/>
  <Label x={305} y={1290} text="TIDAK SEHAT?" size={27} color={C.teal} anchor="middle"/>
  <Label x={775} y={1240} text="KOMUNIKASI" size={24} anchor="middle"/>
  <Label x={775} y={1290} text="PERLU DIPERBAIKI?" size={24} color={C.orange} anchor="middle"/>
  <Label x={540} y={1515} text="JANGAN TERBURU-BURU" size={35} anchor="middle"/>
  <Label x={540} y={1570} text="MERASA PALING HEBAT" size={39} color={C.white} anchor="middle"/>
 </g>;
};

const SceneGrow:React.FC<{f:number}> = ({f})=>{
 const rise=ease(f,0,190);
 return <g>
  <path d="M120 1430 L960 1430" stroke={C.line} strokeWidth="5"/>
  {Array.from({length:5},(_,i)=>{const h=180+i*130;return <g key={i}><rect x={150+i*165} y={1430-h*rise} width="92" height={h*rise} rx="12" fill={[C.line,C.teal,"#6F9FE8","#B69AE8",C.orange][i]}/><circle cx={196+i*165} cy={1430-h*rise-25} r="12" fill={C.white} opacity={rise}/></g>})}
  <path d={`M140 1240 Q390 ${1180-rise*260} 560 ${1050-rise*300} T940 ${650-rise*330}`} stroke={C.orange} strokeWidth="8" fill="none" strokeLinecap="round"/>
  <path d="M900 660 L950 630 L945 695" stroke={C.orange} strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
  <Label x={540} y={1580} text="RENDAH HATI." size={40} anchor="middle"/>
  <Label x={540} y={1640} text="TINGKATKAN KEMAMPUAN." size={39} color={C.teal} anchor="middle"/>
 </g>;
};

const SceneProof:React.FC<{f:number}> = ({f})=>{
 const reveal=ease(f,20,180);
 return <g>
  <g transform={`translate(540 980) scale(${.82+.18*reveal})`}>
   <rect x="-270" y="-290" width="540" height="580" rx="34" fill={C.paper}/>
   <rect x="-220" y="-235" width="440" height="70" rx="15" fill={C.navy2}/>
   <Label x={0} y={-190} text="HASIL KERJA" size={28} anchor="middle"/>
   <path d="M-190 165 L-80 55 L5 115 L155 -70" fill="none" stroke={C.teal} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round"/>
   <path d="M105 -70 H155 V-20" stroke={C.teal} strokeWidth="16" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
   <circle cx="155" cy="-70" r="28" fill={C.orange}/>
  </g>
  <g opacity={reveal}><Label x={540} y={1470} text="BUKTIKAN DENGAN HASIL" size={40} anchor="middle"/><Label x={540} y={1540} text="BUKAN SEKADAR OMONGAN" size={35} color={C.orange} anchor="middle"/></g>
 </g>;
};

const SceneEnd:React.FC<{f:number}> = ({f})=>{
 const glow=ease(f,0,170);
 return <g>
  <circle cx="540" cy="1010" r={220+glow*170} fill="none" stroke={C.teal} strokeWidth="3" opacity={.35+glow*.4}/>
  <circle cx="540" cy="1010" r="185" fill={C.teal} opacity=".1"/>
  <path d="M540 1270 V760 M540 760 L430 870 M540 760 L650 870" stroke={C.teal} strokeWidth="14" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
  <Label x={540} y={1450} text="TERUS BERTUMBUH" size={55} anchor="middle"/>
  <Label x={540} y={1530} text="MESKI RUANGAN TAK MEMBERI TEMPAT" size={25} color={C.muted} anchor="middle"/>
  <Label x={540} y={1680} text="GROW BEYOND THE ROOM." size={29} color={C.orange} anchor="middle" spacing={3}/>
 </g>;
};

const scenes=[
 {from:0,d:240,tag:"HOOK",title:"Kemampuan bisa dianggap ancaman",Comp:SceneIntro},
 {from:225,d:255,tag:"CONTEXT",title:"Kehadiran mengubah permainan",Comp:SceneRoom},
 {from:465,d:270,tag:"CAPABILITY",title:"Cara kerja dan pikiran terbuka",Comp:SceneSkill},
 {from:720,d:270,tag:"RESISTANCE",title:"Perubahan mengguncang kenyamanan",Comp:SceneThreat},
 {from:975,d:270,tag:"CONFLICT",title:"Serang orangnya, bukan idenya",Comp:SceneAttack},
 {from:1230,d:300,tag:"SELF-CHECK",title:"Periksa lingkungan dan diri",Comp:SceneReality},
 {from:1515,d:255,tag:"GROWTH",title:"Rendah hati, tingkatkan kemampuan",Comp:SceneGrow},
 {from:1755,d:270,tag:"PROOF",title:"Buktikan lewat hasil",Comp:SceneProof},
 {from:1995,d:242,tag:"CLOSING",title:"Terus bertumbuh",Comp:SceneEnd},
];

const SceneLayer:React.FC<{Comp:React.FC<{f:number}>;local:number}> = ({Comp,local})=><Comp f={local}/>;

export const OrionV40:React.FC=()=>{
 const f=useCurrentFrame();
 const active=scenes.find(s=>f>=s.from && f<s.from+s.d)??scenes[scenes.length-1];
 const local=f-active.from;
 const titleOpacity=fade(local,0,active.d);
 const progress=f/(DURATION-1);
 return <AbsoluteFill style={{backgroundColor:C.navy,overflow:"hidden"}}>
  <Audio src={staticFile("audio/orion-v40-voiceover.mp3")} volume={1}/>
  <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`}>
   <defs><radialGradient id="v40bg"><stop offset="0%" stopColor="#29445A"/><stop offset="100%" stopColor={C.navy}/></radialGradient><linearGradient id="v40shade" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.navy} stopOpacity="0"/><stop offset="100%" stopColor={C.navy} stopOpacity=".92"/></linearGradient></defs>
   <rect width={W} height={H} fill="url(#v40bg)"/>
   <g opacity=".18">{Array.from({length:11},(_,i)=><line key={i} x1={i*108} y1="0" x2={i*108} y2={H} stroke={C.line} strokeWidth="1"/>)}{Array.from({length:20},(_,i)=><line key={i} x1="0" y1={i*100} x2={W} y2={i*100} stroke={C.line} strokeWidth="1"/>)}</g>
   <text x="76" y="82" fill={C.muted} fontSize="18" fontWeight="900" letterSpacing="4">ORION CREATIVE  /  REAL TALK</text>
   <text x="1004" y="82" fill={C.orange} fontSize="18" fontWeight="900" textAnchor="end">V4.0</text>
   <SceneLayer Comp={active.Comp} local={local}/>
   <rect x="0" y="0" width={W} height={470} fill="url(#v40shade)"/>
   <g opacity={titleOpacity}>
    <text x="76" y="188" fill={C.orange} fontSize="20" fontWeight="900" letterSpacing="4">{active.tag}</text>
    <text x="76" y="268" fill={C.white} fontSize={active.title.length>29?39:46} fontWeight="900">{active.title}</text>
   </g>
   <rect x="76" y="1840" width="928" height="5" rx="2.5" fill={C.line}/>
   <rect x="76" y="1840" width={928*progress} height="5" rx="2.5" fill={C.orange}/>
   <text x="76" y="1884" fill={C.muted} fontSize="17" fontWeight="700" letterSpacing="2">ORION MOTION GRAPHIC SYSTEM</text>
   <text x="1004" y="1884" fill={C.muted} fontSize="17" textAnchor="end">{Math.floor(f/FPS/60)}:{String(Math.floor(f/FPS)%60).padStart(2,"0")}</text>
  </svg>
 </AbsoluteFill>;
};

export const ORION_V40_DURATION = DURATION;
