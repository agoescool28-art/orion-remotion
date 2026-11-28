import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { V7Scene } from "./v7Project";

const PAPER = "#F4F0E7";
const INK = "#111A17";
const MUTED = "#B9C0B8";
const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

const House: React.FC<{x:number;y:number;s:number;color:string;delay:number;frame:number}> = ({x,y,s,color,delay,frame}) => {
  const p = spring({frame:Math.max(0,frame-delay),fps:30,config:{damping:13,stiffness:90}});
  const float = Math.sin((frame-delay)/13)*5;
  return <g transform={`translate(${x} ${y+float}) scale(${s*p})`} opacity={interpolate(frame,[delay,delay+10],[0,1],clamp)}>
    <path d="M0 70 L75 12 L150 70" fill="none" stroke={color} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="17" y="68" width="116" height="90" rx="5" fill="#26352E" stroke={color} strokeWidth="3"/>
    <rect x="62" y="105" width="28" height="53" fill={color} opacity=".8"/>
    <rect x="30" y="87" width="22" height="22" fill={color} opacity=".5"/>
    <rect x="99" y="87" width="22" height="22" fill={color} opacity=".5"/>
  </g>;
};

const Visual: React.FC<{scene:V7Scene;frame:number}> = ({scene,frame}) => {
  const a=scene.accent;
  if(scene.kind==="neighborhood" || scene.kind==="closing") return <svg viewBox="0 0 900 560" width="100%" height="100%">
    <path d="M0 440 Q180 390 350 440 T700 430 T900 440 V560 H0Z" fill="#1C2B24"/>
    <House x={60} y={160} s={1.0} color={a} delay={0} frame={frame}/>
    <House x={350} y={100} s={1.25} color="#8CC8B0" delay={8} frame={frame}/>
    <House x={660} y={170} s={.95} color="#9DB9E8" delay={16} frame={frame}/>
    {[0,1,2,3,4].map(i=><circle key={i} cx={190+i*130} cy={390+Math.sin(frame/9+i)*10} r="5" fill={a} opacity=".8"/>)}
    <path d={`M130 420 Q450 ${320+Math.sin(frame/12)*14} 760 420`} fill="none" stroke={a} strokeWidth="3" strokeDasharray="10 13" opacity=".8"/>
    {scene.kind==="closing" && <text x="450" y="520" textAnchor="middle" fill={a} fontSize="24" fontWeight="bold" letterSpacing="5">HARMONI DIMULAI DARI RUMAH</text>}
  </svg>;
  if(scene.kind==="definition") return <svg viewBox="0 0 900 560" width="100%" height="100%">
    <House x={75} y={150} s={1.1} color={a} delay={0} frame={frame}/>
    <House x={650} y={150} s={1.1} color={a} delay={8} frame={frame}/>
    <path d="M280 290 C380 180 520 180 620 290" fill="none" stroke={a} strokeWidth="5" strokeDasharray="12 12" strokeDashoffset={-frame*3}/>
    <circle cx="450" cy="245" r={65+Math.sin(frame/8)*7} fill="#20352D" stroke={a} strokeWidth="3"/>
    <text x="450" y="235" textAnchor="middle" fill={PAPER} fontSize="24" fontWeight="bold">HAK</text>
    <text x="450" y="270" textAnchor="middle" fill={a} fontSize="18">↔</text>
    <text x="450" y="310" textAnchor="middle" fill={PAPER} fontSize="16">TANGGUNG JAWAB</text>
  </svg>;
  if(scene.kind==="scripture") return <svg viewBox="0 0 900 560" width="100%" height="100%">
    <rect x="150" y="90" width="600" height="365" rx="20" fill="#E8E1D0" transform={`rotate(${Math.sin(frame/20)*1.3} 450 270)`}/>
    <rect x="175" y="115" width="550" height="315" rx="12" fill="#F4F0E7" stroke={a} strokeWidth="3"/>
    <path d="M450 140 V405" stroke="#C6B99D" strokeWidth="2"/>
    <path d="M205 160 Q300 135 430 160 M470 160 Q600 135 695 160" fill="none" stroke={a} strokeWidth="3"/>
    <text x="450" y="235" textAnchor="middle" fill="#26352E" fontSize="42" fontWeight="bold">وَبِالْجَارِ ذِي الْقُرْبَى</text>
    <text x="450" y="305" textAnchor="middle" fill="#26352E" fontSize="25" fontWeight="bold">QS. AN-NISA: 36</text>
    <text x="450" y="355" textAnchor="middle" fill="#6B746B" fontSize="18">BERBUAT BAIK KEPADA TETANGGA</text>
  </svg>;
  if(scene.kind==="speech") return <svg viewBox="0 0 900 560" width="100%" height="100%">
    <path d="M140 130 Q140 80 200 80 H500 Q560 80 560 140 V240 Q560 300 500 300 H300 L220 365 V300 H200 Q140 300 140 240Z" fill="#27362F" stroke={a} strokeWidth="4"/>
    <text x="350" y="175" textAnchor="middle" fill={PAPER} fontSize="29" fontWeight="bold">KATA-KATA</text>
    <text x="350" y="220" textAnchor="middle" fill={a} fontSize="29" fontWeight="bold">MENYAKITI?</text>
    <path d="M610 150 L770 150 M630 195 L800 195 M610 240 L750 240" stroke="#E58D7D" strokeWidth="13" strokeLinecap="round" opacity={.35+Math.sin(frame/5)*.2}/>
    <path d="M610 120 L800 280" stroke={a} strokeWidth="10" strokeLinecap="round"/>
    <circle cx="700" cy="200" r="115" fill="none" stroke={a} strokeWidth="4" strokeDasharray="14 10" strokeDashoffset={frame*2}/>
  </svg>;
  if(scene.kind==="help" || scene.kind==="kindness") return <svg viewBox="0 0 900 560" width="100%" height="100%">
    <circle cx="300" cy="185" r="62" fill="#D9B28A"/>
    <path d="M200 430 Q210 280 300 280 Q390 280 400 430Z" fill="#4D7563"/>
    <circle cx="600" cy="185" r="62" fill="#C58F72"/>
    <path d="M500 430 Q510 280 600 280 Q690 280 700 430Z" fill="#6D7898"/>
    <path d="M390 320 Q450 250 510 320" fill="none" stroke={a} strokeWidth="12" strokeLinecap="round"/>
    <rect x="405" y="300" width="90" height="75" rx="18" fill={a} transform={`translate(0 ${Math.sin(frame/8)*5})`}/>
    <path d="M450 325 C420 300 400 345 450 370 C500 345 480 300 450 325Z" fill="#F4F0E7"/>
    <text x="450" y="500" textAnchor="middle" fill={a} fontSize="26" fontWeight="bold">HADIR • PEDULI • MEMBANTU</text>
  </svg>;
  if(scene.kind==="privacy") return <svg viewBox="0 0 900 560" width="100%" height="100%">
    <rect x="280" y="90" width="340" height="370" rx="30" fill="#24342D" stroke={a} strokeWidth="4"/>
    <rect x="345" y="250" width="210" height="150" rx="20" fill={a}/>
    <path d="M380 250 V205 Q380 130 450 130 Q520 130 520 205 V250" fill="none" stroke={PAPER} strokeWidth="18" strokeLinecap="round"/>
    <circle cx="450" cy="315" r="18" fill="#24342D"/>
    <path d="M450 330 V360" stroke="#24342D" strokeWidth="12" strokeLinecap="round"/>
    <circle cx="450" cy="265" r={150+Math.sin(frame/10)*8} fill="none" stroke={a} strokeWidth="2" opacity=".35"/>
  </svg>;
  if(scene.kind==="safety") return <svg viewBox="0 0 900 560" width="100%" height="100%">
    <path d="M450 70 L680 160 V310 Q660 430 450 500 Q240 430 220 310 V160Z" fill="#23382F" stroke={a} strokeWidth="8"/>
    <path d="M350 285 L420 355 L565 205" fill="none" stroke={a} strokeWidth="22" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="400" strokeDashoffset={interpolate(frame,[5,35],[400,0],clamp)}/>
    <circle cx="450" cy="285" r={190+Math.sin(frame/12)*8} fill="none" stroke={a} strokeWidth="2" opacity=".25"/>
  </svg>;
  return <svg viewBox="0 0 900 560" width="100%" height="100%">
    {["A","B","C","D"].map((v,i)=><g key={v} transform={`translate(${120+i*190} ${180+Math.sin(frame/10+i)*8})`}>
      <circle cx="0" cy="0" r="48" fill={["#D9B28A","#C58F72","#A9B9A2","#D8C7A5"][i]}/>
      <path d="M-75 190 Q-65 70 0 70 Q65 70 75 190Z" fill={["#4D7563","#6D7898","#927A9B","#B18B5C"][i]}/>
    </g>)}
    <path d="M100 420 Q450 350 800 420" fill="none" stroke={a} strokeWidth="4" strokeDasharray="9 13" strokeDashoffset={-frame*2}/>
  </svg>;
};

export const V7StoryScene: React.FC<{scene:V7Scene;index:number}> = ({scene,index}) => {
  const frame=useCurrentFrame();
  const {fps,durationInFrames}=useVideoConfig();
  const inSpring=spring({frame,fps,config:{damping:16,stiffness:105,mass:.65}});
  const enterY=interpolate(inSpring,[0,1],[85,0]);
  const out=interpolate(frame,[durationInFrames-12,durationInFrames],[1,0],clamp);
  const progress=interpolate(frame,[0,durationInFrames],[0,1],{...clamp,easing:Easing.inOut(Easing.quad)});
  const visualScale=interpolate(frame,[0,durationInFrames],[.88,1.06],clamp);
  const words=scene.title.split(" ");
  return <AbsoluteFill style={{background:INK,color:PAPER,opacity:out,overflow:"hidden",fontFamily:"Arial, sans-serif"}}>
    <AbsoluteFill style={{background:"radial-gradient(ellipse at 50% 35%, #304238 0%, #17231D 42%, #0D1511 100%)"}}/>
    <div style={{position:"absolute",inset:0,opacity:.12,backgroundImage:"linear-gradient(rgba(255,255,255,.12) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.12) 1px,transparent 1px)",backgroundSize:"70px 70px"}}/>
    <div style={{position:"absolute",left:72,right:72,top:72,display:"flex",justifyContent:"space-between",fontSize:16,letterSpacing:4,color:MUTED,fontWeight:800}}>
      <span>ORION / STORYTELLING V7</span><span>{String(index+1).padStart(2,"0")} / 10</span>
    </div>
    <div style={{position:"absolute",left:72,right:72,top:130,height:3,background:"#FFFFFF20"}}>
      <div style={{height:"100%",width:`${progress*100}%`,background:scene.accent,boxShadow:`0 0 18px ${scene.accent}`}}/>
    </div>
    <div style={{position:"absolute",left:42,right:42,top:235,height:610,transform:`scale(${visualScale})`,filter:"drop-shadow(0 25px 35px #0008)"}}>
      <Visual scene={scene} frame={frame}/>
    </div>
    <div style={{position:"absolute",left:82,right:82,top:910,transform:`translateY(${enterY}px)`}}>
      <div style={{color:scene.accent,fontSize:20,fontWeight:800,letterSpacing:5,marginBottom:22}}>{scene.chapter}</div>
      <div style={{fontSize:words.length>4?65:78,lineHeight:.98,fontWeight:900,letterSpacing:-3,textTransform:"uppercase"}}>
        {words.map((word,i)=><span key={i} style={{display:"inline-block",marginRight:".18em",opacity:interpolate(frame,[i*3,i*3+7],[0,1],clamp),transform:`translateY(${interpolate(frame,[i*3,i*3+7],[28,0],clamp)}px)`,color:scene.emphasis.some(e=>word.includes(e))?scene.accent:PAPER}}>{word}</span>)}
      </div>
      <div style={{marginTop:34,width:90,height:5,background:scene.accent,transform:`scaleX(${progress})`,transformOrigin:"left"}}/>
      <div style={{marginTop:30,fontSize:30,lineHeight:1.4,color:"#D5D8D0",maxWidth:900}}>{scene.subtitle}</div>
    </div>
    <div style={{position:"absolute",left:82,right:82,bottom:100,display:"flex",justifyContent:"space-between",alignItems:"center",color:MUTED,fontSize:15,letterSpacing:3}}>
      <span>ADAB • KEPEDULIAN • KERUKUNAN</span><span style={{color:scene.accent}}>ORION V7</span>
    </div>
  </AbsoluteFill>;
};
