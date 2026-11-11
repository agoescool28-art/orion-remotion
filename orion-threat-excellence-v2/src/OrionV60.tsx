import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Easing,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
} from 'remotion';

// ORION V6.0 — Hybrid Motion Graphic foundation
// 1080x1920, 30fps, 74.57s. Chapter timings are editorial estimates;
// word-level VO synchronization requires a timestamped transcript.

const W = 1080;
const H = 1920;
const FPS = 30;
const DURATION = 2237;
const C = {
  paper: '#FFF7DF', ink: '#171717', blue: '#77C5F2', blueDeep: '#3F9BD8',
  pink: '#F36B9B', yellow: '#FFD83D', green: '#6DDBA5', purple: '#B89AF4',
  orange: '#FF9748', white: '#FFFFFF', muted: '#6E675F',
};

type SceneDef = { from: number; duration: number; label: string; title: string; render: (f: number) => React.ReactNode };
const clamp = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const };
const out = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], clamp);
const inOut = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
const pop = (f: number, fps: number, delay = 0) => spring({ frame: Math.max(0, f - delay), fps, config: { damping: 12, stiffness: 150, mass: 0.7 } });

const Txt: React.FC<{children: React.ReactNode; size?: number; color?: string; weight?: number; align?: 'left'|'center'|'right'; style?: React.CSSProperties}> = ({children,size=58,color=C.ink,weight=800,align='center',style={}}) => (
  <div style={{fontFamily:'Arial, Helvetica, sans-serif',fontSize:size,fontWeight:weight,color,textAlign:align,lineHeight:1.08,letterSpacing:-1.6,...style}}>{children}</div>
);
const Tag: React.FC<{children: React.ReactNode; color?: string; style?: React.CSSProperties}> = ({children,color=C.yellow,style={}}) => (
  <div style={{display:'inline-flex',alignItems:'center',background:color,border:`4px solid ${C.ink}`,borderRadius:18,padding:'10px 20px',fontFamily:'Arial',fontSize:25,fontWeight:900,color:C.ink,boxShadow:'7px 7px 0 #171717',...style}}>{children}</div>
);
const Panel: React.FC<{children: React.ReactNode; title: string; style?: React.CSSProperties; bg?: string}> = ({children,title,style={},bg=C.blue}) => (
  <div style={{position:'absolute',left:90,top:360,width:900,height:850,border:`7px solid ${C.ink}`,borderRadius:30,background:bg,boxShadow:'13px 13px 0 rgba(23,23,23,.18)',overflow:'hidden',...style}}>
    <div style={{height:62,background:C.white,borderBottom:`6px solid ${C.ink}`,display:'flex',alignItems:'center',padding:'0 22px',gap:13}}>
      {[C.pink,C.yellow,C.green].map((c,i)=><span key={i} style={{width:19,height:19,borderRadius:20,background:c,border:`3px solid ${C.ink}`}}/>)}
      <div style={{marginLeft:'auto',fontSize:23,fontWeight:900,color:C.ink,letterSpacing:1}}>{title}</div>
    </div>
    {children}
  </div>
);
const Person: React.FC<{x:number;y:number;scale?:number;color?:string;f:number;delay?:number;tilt?:number}> = ({x,y,scale=1,color=C.pink,f,delay=0,tilt=0}) => {
  const p=pop(f,FPS,delay); const bob=Math.sin((f-delay)*0.12)*9;
  return <g transform={`translate(${x} ${y+bob}) rotate(${tilt*Math.sin((f-delay)*.08)}) scale(${scale*p})`}>
    <circle cx="0" cy="0" r="67" fill={color} stroke={C.ink} strokeWidth="8"/>
    <circle cx="-22" cy="-12" r="7" fill={C.ink}/><circle cx="22" cy="-12" r="7" fill={C.ink}/>
    <path d="M-25 20 Q0 48 25 20" fill="none" stroke={C.ink} strokeWidth="8" strokeLinecap="round"/>
    <path d="M-28 67 L-50 150 M28 67 L50 150" stroke={C.ink} strokeWidth="13" strokeLinecap="round"/>
    <path d="M-30 77 L-80 118 M30 77 L80 118" stroke={C.ink} strokeWidth="13" strokeLinecap="round"/>
  </g>;
};
const SvgTag: React.FC<{x:number;y:number;text:string;color?:string;f:number;delay?:number;rotate?:number;width?:number}> = ({x,y,text,color=C.yellow,f,delay=0,rotate=0,width=250}) => {
  const p=pop(f,FPS,delay);
  return <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${p})`}>
    <rect width={width} height="68" rx="13" fill={color} stroke={C.ink} strokeWidth="7"/>
    <text x={width/2} y="44" textAnchor="middle" fontSize="27" fontWeight="900" fill={C.ink}>{text}</text>
  </g>;
};

const Cursor: React.FC<{x:number;y:number;f:number;delay?:number}> = ({x,y,f,delay=0}) => {
  const p=pop(f,FPS,delay); const press=Math.sin(Math.max(0,f-delay)*.22)>0.88?0.88:1;
  return <g transform={`translate(${x} ${y}) scale(${p*press})`}>
    <path d="M0 0 L0 92 L24 69 L47 112 L67 102 L45 61 L79 59 Z" fill={C.white} stroke={C.ink} strokeWidth="7" strokeLinejoin="round"/>
  </g>;
};
const Brain: React.FC<{x:number;y:number;f:number;scale?:number}> = ({x,y,f,scale=1}) => {
  const pulse=1+Math.sin(f*.12)*.035;
  return <g transform={`translate(${x} ${y}) scale(${scale*pulse})`}>
    <path d="M0 -100 C-70 -160 -145 -80 -120 -20 C-170 50 -90 120 -35 90 C-5 130 35 110 45 82 C115 125 175 45 128 -10 C155 -95 65 -145 20 -102 C10 -130 -20 -130 0 -100Z" fill={C.pink} stroke={C.ink} strokeWidth="9"/>
    <path d="M0 -95 Q-20 -25 0 90 M-80 -55 Q-45 -25 -65 5 M75 -55 Q45 -15 72 12" fill="none" stroke={C.ink} strokeWidth="7" strokeLinecap="round"/>
  </g>;
};
const Door: React.FC<{x:number;y:number;f:number;openAt?:number}> = ({x,y,f,openAt=90}) => {
  const a=interpolate(f,[openAt,openAt+38],[0,-62],clamp);
  return <g transform={`translate(${x} ${y})`}>
    <rect x="0" y="0" width="300" height="470" fill={C.yellow} stroke={C.ink} strokeWidth="12"/>
    <polygon points={`0,0 220,30 220,455 0,470`} fill={C.pink} stroke={C.ink} strokeWidth="10" transform={`translate(${a} 0)`}/>
    <circle cx={a+188} cy="245" r="13" fill={C.yellow} stroke={C.ink} strokeWidth="6"/>
  </g>;
};
const Base: React.FC<{f:number;label:string;title:string;children:React.ReactNode;accent?:string}> = ({f,label,title,children,accent=C.yellow}) => {
  const reveal=out(f,0,16); const y=interpolate(f,[0,18],[50,0],clamp);
  return <AbsoluteFill style={{background:C.paper,color:C.ink,overflow:'hidden'}}>
    <div style={{position:'absolute',inset:0,opacity:.23,backgroundImage:'radial-gradient(#7b715e 1.3px, transparent 1.3px)',backgroundSize:'26px 26px'}}/>
    <div style={{position:'absolute',top:82,left:76,transform:`translateY(${y}px)`,opacity:reveal}}><Tag color={accent}>{label}</Tag></div>
    <div style={{position:'absolute',top:205,left:80,right:80,opacity:reveal,transform:`translateY(${y}px)`}}><Txt size={54}>{title}</Txt></div>
    {children}
    <div style={{position:'absolute',bottom:78,left:80,right:80,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
      <div style={{fontSize:19,fontWeight:900,letterSpacing:2}}>ORION CREATIVE / MOTION LAB</div>
      <div style={{width:170,height:12,border:`3px solid ${C.ink}`,borderRadius:20,overflow:'hidden',background:C.white}}><div style={{width:`${Math.min(100,(f/260)*100)}%`,height:'100%',background:C.orange}}/></div>
    </div>
  </AbsoluteFill>;
};

const Scene1: React.FC<{f:number}> = ({f}) => <Base f={f} label="01 / HOOK" title="Kemampuan bisa dianggap ancaman" accent={C.yellow}>
  <Panel title="RUANG KERJA" bg={C.blue}>
    <svg viewBox="0 0 900 780" width="100%" height="100%">
      <Door x={300} y={100} f={f} openAt={55}/>
      <Person x={120+inOut(f,20,90)*160} y={550} f={f} color={C.green} delay={10}/>
      <g transform={`translate(${590+Math.sin(f*.06)*5} 490)`}>
        {[0,1,2].map((v)=><g key={v} transform={`translate(${v*95} 0)`}><circle cy="0" r="48" fill={C.purple} stroke={C.ink} strokeWidth="7"/><circle cx="-15" cy="-8" r="6"/><circle cx="15" cy="-8" r="6"/><path d="M-18 20 Q0 4 18 20" fill="none" stroke={C.ink} strokeWidth="6"/></g>)}
      </g>
      <SvgTag x={520} y={120} text="ANCAMAN?" color={C.pink} f={f} delay={95} rotate={Math.sin(f*.1)*4} width={220}/>
    </svg>
  </Panel>
  <div style={{position:'absolute',top:1290,left:110,right:110}}><Txt size={40}>Bukan karena dia membuat masalah.</Txt></div>
</Base>;

const Scene2: React.FC<{f:number}> = ({f}) => <Base f={f} label="02 / PERUBAHAN" title="Kehadirannya mengubah permainan" accent={C.pink}>
  <Panel title="ALUR KERJA" bg={C.blue}>
    <svg viewBox="0 0 900 780" width="100%" height="100%">
      {[0,1,2,3].map((v)=><g key={v} transform={`translate(${80+v*185} 155)`}>
        <rect x="0" y="0" width="135" height="310" rx="18" fill={v===2?C.green:C.white} stroke={C.ink} strokeWidth="7" transform={`translate(0 ${Math.sin(f*.08+v)*8})`}/>
        {[0,1,2].map(i=><rect key={i} x="20" y={45+i*65} width={85*(v===2?1:.7)} height="13" rx="6" fill={C.ink} opacity=".55"/>)}
      </g>)}
      <path d={`M90 580 Q260 ${480-50*Math.sin(f*.06)} 420 560 T800 480`} fill="none" stroke={C.orange} strokeWidth="14" strokeLinecap="round" strokeDasharray="1000" strokeDashoffset={interpolate(f,[20,150],[1000,0],clamp)}/>
      <Person x={450} y={620} f={f} color={C.pink} delay={20}/>
      <Cursor x={700} y={570} f={f} delay={95}/>
    </svg>
  </Panel>
  <div style={{position:'absolute',top:1290,left:100,right:100,display:'flex',justifyContent:'center',gap:18}}><Tag color={C.green}>CARA KERJA</Tag><Tag color={C.yellow}>PIKIRAN TERBUKA</Tag></div>
</Base>;

const Scene3: React.FC<{f:number}> = ({f}) => <Base f={f} label="03 / RESISTANCE" title="Perubahan terasa menakutkan" accent={C.purple}>
  <Panel title="STATUS QUO" bg={C.yellow}>
    <svg viewBox="0 0 900 780" width="100%" height="100%">
      {[0,1,2,3,4].map((v)=><g key={v} transform={`translate(${75+v*150} 130)`}>
        <rect width="100" height="420" rx="14" fill={C.white} stroke={C.ink} strokeWidth="7"/>
        <path d="M22 60 H78 M22 95 H78 M22 130 H78" stroke={C.ink} strokeWidth="10" strokeLinecap="round" opacity=".45"/>
      </g>)}
      <path d="M450 70 L430 270 L470 350 L440 520" stroke={C.orange} strokeWidth="17" fill="none" strokeLinecap="round" strokeDasharray="650" strokeDashoffset={interpolate(f,[20,100],[650,0],clamp)}/>
      <SvgTag x={280} y={520} text="PERUBAHAN!" color={C.pink} f={f} delay={60} rotate={-6} width={270}/>
      <g transform={`translate(680 600) rotate(${Math.sin(f*.2)*5})`}><path d="M0 0 L-30 -100 M0 0 L30 -100 M0 0 L0 -140" stroke={C.ink} strokeWidth="14" strokeLinecap="round"/></g>
    </svg>
  </Panel>
  <div style={{position:'absolute',top:1290,left:100,right:100}}><Txt size={42}>Terutama bagi yang nyaman dengan keadaan lama.</Txt></div>
</Base>;

const Scene4: React.FC<{f:number}> = ({f}) => <Base f={f} label="04 / KONFLIK" title="Orangnya diserang, bukan idenya" accent={C.orange}>
  <Panel title="RUANG DISKUSI" bg={C.pink}>
    <svg viewBox="0 0 900 780" width="100%" height="100%">
      <Person x={440} y={500} f={f} color={C.green} delay={0}/>
      {['SOK PINTAR','AMBISIUS','SULIT DIAJAK KERJA'].map((t,i)=><g key={t} transform={`translate(${80+i*235} ${130+Math.sin(f*.09+i)*18}) rotate(${[-7,5,-4][i]}) scale(${pop(f,FPS,35+i*25)})`}>
        <rect width={210} height="76" rx="16" fill={i===1?C.yellow:C.white} stroke={C.ink} strokeWidth="6"/>
        <text x="105" y="48" fontSize={i===2?19:24} fontWeight="900" textAnchor="middle" fill={C.ink}>{t}</text>
      </g>)}
      <path d="M150 370 Q300 280 400 390 M750 360 Q600 270 500 390" stroke={C.ink} strokeWidth="8" strokeDasharray="14 15" fill="none"/>
    </svg>
  </Panel>
  <div style={{position:'absolute',top:1290,left:100,right:100}}><Txt size={43}>Label lebih mudah dilempar daripada membahas gagasan.</Txt></div>
</Base>;

const Scene5: React.FC<{f:number}> = ({f}) => <Base f={f} label="05 / SELF CHECK" title="Jangan buru-buru merasa paling hebat" accent={C.green}>
  <Panel title="DUA KEMUNGKINAN" bg={C.blue}>
    <svg viewBox="0 0 900 780" width="100%" height="100%">
      <rect x="65" y="95" width="340" height="520" rx="28" fill={C.green} stroke={C.ink} strokeWidth="8" transform={`translate(0 ${Math.sin(f*.07)*5})`}/>
      <rect x="495" y="95" width="340" height="520" rx="28" fill={C.purple} stroke={C.ink} strokeWidth="8" transform={`translate(0 ${-Math.sin(f*.07)*5})`}/>
      <Person x={235} y={320} f={f} color={C.pink} delay={15}/><Person x={665} y={320} f={f} color={C.yellow} delay={40}/>
      <text x="235" y="535" textAnchor="middle" fontSize="31" fontWeight="900" fill={C.ink}>LINGKUNGAN</text>
      <text x="235" y="580" textAnchor="middle" fontSize="27" fontWeight="800" fill={C.ink}>TIDAK SEHAT?</text>
      <text x="665" y="535" textAnchor="middle" fontSize="31" fontWeight="900" fill={C.ink}>KOMUNIKASI</text>
      <text x="665" y="580" textAnchor="middle" fontSize="27" fontWeight="800" fill={C.ink}>PERLU DIPERBAIKI?</text>
      <SvgTag x={300} y={650} text="PERIKSA KEDUANYA" color={C.yellow} f={f} delay={95} width={310}/>
    </svg>
  </Panel>
</Base>;

const Scene6: React.FC<{f:number}> = ({f}) => <Base f={f} label="06 / GROWTH" title="Tetap rendah hati. Tingkatkan kemampuan." accent={C.yellow}>
  <Panel title="PROSES BERTUMBUH" bg={C.green}>
    <svg viewBox="0 0 900 780" width="100%" height="100%">
      {[0,1,2,3,4].map((v)=><g key={v}>
        <rect x={105+v*145} y={560-(v+1)*78*pop(f,FPS,20+v*14)} width="100" height={(v+1)*78*pop(f,FPS,20+v*14)} fill={[C.blue,C.purple,C.yellow,C.orange,C.pink][v]} stroke={C.ink} strokeWidth="7"/>
      </g>)}
      <path d={`M90 535 Q260 470 390 400 T800 150`} stroke={C.ink} strokeWidth="12" fill="none" strokeLinecap="round" strokeDasharray="1100" strokeDashoffset={interpolate(f,[30,170],[1100,0],clamp)}/>
      <path d="M740 150 L800 150 L790 215" stroke={C.ink} strokeWidth="12" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <Person x={160+inOut(f,20,170)*570} y={620-inOut(f,20,170)*320} f={f} color={C.white} delay={30}/>
    </svg>
  </Panel>
  <div style={{position:'absolute',top:1290,left:100,right:100}}><Txt size={42}>Buktikan lewat hasil, bukan sekadar omongan.</Txt></div>
</Base>;

const Scene7: React.FC<{f:number}> = ({f}) => <Base f={f} label="07 / CLOSING" title="Terus bertumbuh, bahkan saat ruang tak memberi tempat" accent={C.pink}>
  <Panel title="RUANG BARU" bg={C.pink}>
    <svg viewBox="0 0 900 780" width="100%" height="100%">
      <Door x={300} y={105} f={f} openAt={55}/>
      <Person x={150+inOut(f,10,120)*330} y={630-inOut(f,10,120)*160} f={f} color={C.green} delay={10}/>
      <g transform={`translate(650 520) scale(${pop(f,FPS,90)})`}>
        <circle r="112" fill={C.yellow} stroke={C.ink} strokeWidth="9"/>
        <path d="M0 65 V-65 M-55 -10 L0 -65 L55 -10" fill="none" stroke={C.ink} strokeWidth="20" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
      <SvgTag x={520} y={115} text="RUANG BARU" color={C.green} f={f} delay={115} rotate={5} width={240}/>
    </svg>
  </Panel>
  <div style={{position:'absolute',top:1290,left:90,right:90}}><Txt size={52}>GROW BEYOND THE ROOM.</Txt></div>
</Base>;

const scenes: SceneDef[] = [
  {from:0,duration:270,label:'HOOK',title:'',render:(f)=><Scene1 f={f}/>},
  {from:255,duration:300,label:'CHANGE',title:'',render:(f)=><Scene2 f={f}/>},
  {from:540,duration:300,label:'RESISTANCE',title:'',render:(f)=><Scene3 f={f}/>},
  {from:825,duration:300,label:'CONFLICT',title:'',render:(f)=><Scene4 f={f}/>},
  {from:1110,duration:315,label:'SELF CHECK',title:'',render:(f)=><Scene5 f={f}/>},
  {from:1410,duration:390,label:'GROWTH',title:'',render:(f)=><Scene6 f={f}/>},
  {from:1785,duration:452,label:'CLOSING',title:'',render:(f)=><Scene7 f={f}/>},
];

export const OrionV60: React.FC = () => {
  const frame=useCurrentFrame();
  const active=scenes.find((s)=>frame>=s.from && frame<s.from+s.duration) ?? scenes[scenes.length-1];
  const local=frame-active.from;
  const transitionIn=interpolate(local,[0,18],[0,1],clamp);
  const transitionOut=interpolate(local,[active.duration-18,active.duration],[1,0],clamp);
  const opacity=Math.min(transitionIn,transitionOut);
  const scale=interpolate(local,[0,18],[1.035,1],{...clamp,easing:Easing.out(Easing.cubic)});
  return <AbsoluteFill style={{background:C.paper}}>
    <div style={{position:'absolute',inset:0,opacity,transform:`scale(${scale})`}}>{active.render(local)}</div>
    <Audio src={staticFile('audio/orion-v60-voiceover.mp3')} volume={1}/>
  </AbsoluteFill>;
};

export const ORION_V60_DURATION = DURATION;
