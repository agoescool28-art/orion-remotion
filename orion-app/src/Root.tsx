
import React from "react";
import {
  AbsoluteFill, Audio, Img, Sequence, interpolate, spring,
  staticFile, useCurrentFrame, useVideoConfig,
} from "remotion";
import { project, type SceneData } from "./project";
import { prabowoWords } from "./audio/prabowo.words";
import { AudioSyncedTypography } from "./audio/AudioSyncedTypography";

const C = {
  bg: "#080B0C", paper: "#F3EFE5", gold: "#D8B878",
  red: "#B85B50", blue: "#91BDCC", green: "#A9C99A",
  muted: "#B8B6AD",
};
const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const p = (f:number,a:number,b:number) => interpolate(f,[a,b],[0,1],cl);
const sp = (f:number,fps:number,d=0) => spring({
  frame:Math.max(0,f-d),fps,config:{damping:15,stiffness:115,mass:.65}
});
const fade = (f:number,d=0) => p(f,d,d+18);
const rise = (f:number,fps:number,d=0) => interpolate(sp(f,fps,d),[0,1],[90,0],cl);
const wave = (f:number,n:number,a:number) => Math.sin(f/n)*a;

const K:React.FC<{children:React.ReactNode;color:string}> =
({children,color}) => <div style={{fontSize:17,color,letterSpacing:4,fontWeight:800}}>{children}</div>;

const Big:React.FC<{children:React.ReactNode;color:string;f:number;size?:number}> =
({children,color,f,size=100}) => {
  const {fps}=useVideoConfig();
  return <div style={{
    fontSize:size,color,fontWeight:950,lineHeight:.92,letterSpacing:-3,
    opacity:fade(f),
    transform:`translateY(${rise(f,fps)}px) scale(${.94+sp(f,fps)*.06})`,
    textShadow:"0 16px 55px #000"
  }}>{children}</div>;
};

const Card:React.FC<{f:number;color:string;delay?:number;children:React.ReactNode}> =
({f,color,delay=0,children}) => {
  const {fps}=useVideoConfig();
  return <div style={{
    padding:"24px 26px",
    background:"linear-gradient(120deg,#17201eee,#080d0dee)",
    borderLeft:`4px solid ${color}`,
    borderTop:`1px solid ${color}66`,
    boxShadow:"0 25px 70px #0008",
    opacity:fade(f,delay),
    transform:`translate(${(1-sp(f,fps,delay))*55}px,${rise(f,fps,delay)}px)`
  }}>{children}</div>;
};

const MapVisual:React.FC<{f:number;color:string}> = ({f,color}) => {
  const q=p(f,10,110);
  return <svg viewBox="0 0 900 520" width="100%" height="100%">
    <path d="M50 390 L170 320 L260 350 L365 225 L475 270 L590 145 L720 205 L850 75"
      fill="none" stroke="#ffffff25" strokeWidth="28"/>
    <path d="M50 390 L170 320 L260 350 L365 225 L475 270 L590 145 L720 205 L850 75"
      fill="none" stroke={color} strokeWidth="7"
      strokeDasharray="1300" strokeDashoffset={1300*(1-q)}/>
    <circle cx={50+800*q} cy={390-315*q} r="17" fill={color}/>
    <circle cx={50+800*q} cy={390-315*q} r="42"
      fill="none" stroke={color} strokeWidth="3"/>
    <text x="50" y="465" fill="#F3EFE5" fontSize="24">JAKARTA</text>
  </svg>;
};

const Orbit:React.FC<{f:number;color:string}> = ({f,color}) =>
  <svg viewBox="0 0 900 620" width="100%" height="100%">
    {[0,1,2].map(n=><ellipse key={n} cx="450" cy="310"
      rx={145+n*110} ry={70+n*75} fill="none"
      stroke={color} strokeWidth="2" opacity=".4"
      transform={`rotate(${f*(n%2?1:-1)+n*45} 450 310)`}/>)}
    <circle cx="450" cy="310" r="22" fill={color}/>
    <circle cx={450+Math.cos(f*.035)*255}
      cy={310+Math.sin(f*.035)*155} r="13" fill={color}/>
  </svg>;

const Timeline:React.FC<{f:number;color:string;items:string[]}> =
({f,color,items}) => {
  const {fps}=useVideoConfig();
  return <div style={{position:"relative",paddingLeft:34,display:"grid",gap:24}}>
    <div style={{position:"absolute",left:7,top:5,bottom:5,width:3,background:color+"55"}}>
      <div style={{height:`${p(f,8,150)*100}%`,background:color}}/>
    </div>
    {items.map((item,i)=><div key={item} style={{
      fontSize:26,fontWeight:850,opacity:fade(f,i*17),
      transform:`translateX(${rise(f,fps,i*17)}px)`
    }}>
      <span style={{color,fontSize:17,marginRight:15}}>0{i+1}</span>{item}
    </div>)}
  </div>;
};

const Story:React.FC<{i:number;f:number;color:string}> = ({i,f,color}) => {
  const {fps}=useVideoConfig();
  const stage:React.CSSProperties={position:"absolute",left:62,right:62,top:610,height:790};
  const note:React.CSSProperties={fontSize:22,color:C.muted,lineHeight:1.5,marginTop:22};

  if(i===0) return <div style={stage}>
    <K color={color}>THE LONG JOURNEY</K>
    <Big f={f} color={C.paper} size={105}>73 TAHUN</Big>
    <div style={{height:390}}><MapVisual f={f} color={color}/></div>
    <Timeline f={f} color={color} items={[
      "1951 • KELAHIRAN","1974 • AKABRI",
      "1998 • TITIK BALIK","2024 • PRESIDEN"
    ]}/>
  </div>;

  if(i===1) return <div style={stage}>
    <K color={color}>THE BEGINNING / JAKARTA</K>
    <Big f={f} color={color} size={180}>1951</Big>
    <div style={{height:420}}><MapVisual f={f} color={color}/></div>
    <Card f={f} color={color}>
      <div style={{fontSize:38,fontWeight:900}}>17 OKTOBER 1951</div>
      <div style={note}>Prabowo Subianto lahir di Jakarta</div>
    </Card>
  </div>;

  if(i===2) return <div style={stage}>
    <K color={color}>FAMILY LEGACY</K>
    <div style={{height:370}}><Orbit f={f} color={color}/></div>
    <Card f={f} color={color}>
      <div style={{fontSize:43,fontWeight:900}}>SUMITRO</div>
      <div style={{fontSize:24,color}}>DJOJOHADIKUSUMO</div>
    </Card>
    <div style={{textAlign:"center",fontSize:42,color}}>↓</div>
    <Card f={f} color={color} delay={22}>
      <div style={{fontSize:28,fontWeight:900}}>EKONOM & TOKOH PEMERINTAHAN</div>
    </Card>
  </div>;

  if(i===3) return <div style={stage}>
    <K color={color}>MILITARY FORMATION</K>
    <Big f={f} color={C.paper} size={120}>AKABRI</Big>
    <div style={{height:410,display:"flex",alignItems:"end",gap:13}}>
      {Array.from({length:9},(_,n)=><div key={n} style={{
        flex:1,height:`${(25+(n*37)%75)*p(f,10+n*5,80+n*5)}%`,
        background:`linear-gradient(180deg,${color},#52676a)`,
        transform:`skewY(-7deg) translateY(${wave(f+n*9,17,8)}px)`
      }}/>)}
    </div>
    <Card f={f} color={color}>
      <div style={{fontSize:78,fontWeight:950}}>1974</div>
      <div>LULUS AKADEMI ANGKATAN BERSENJATA</div>
    </Card>
  </div>;

  if(i===4) return <div style={stage}>
    <K color={color}>FIELD / SPECIAL FORCES</K>
    <Big f={f} color={C.paper} size={88}>KOPASSUS</Big>
    <div style={{height:420,position:"relative",overflow:"hidden",
      borderTop:`2px solid ${color}`,borderBottom:`2px solid ${color}`}}>
      {Array.from({length:8},(_,n)=><div key={n} style={{
        position:"absolute",left:`${n*14-10+p(f,0,90)*15}%`,
        top:35+(n%3)*65,width:90,height:320,
        background:"linear-gradient(90deg,#101715,#59665d,#111)",
        clipPath:"polygon(35% 0,65% 0,80% 22%,100% 100%,0 100%,20% 22%)",
        opacity:.25+n*.08,
        transform:`translateX(${wave(f+n*10,19,22)}px)`
      }}/>)}
    </div>
    <Timeline f={f} color={color} items={[
      "ANGKATAN DARAT","PASUKAN KHUSUS","KOPASSUS"
    ]}/>
  </div>;

  if(i===5) return <div style={stage}>
    <K color={color}>COMMAND & RESPONSIBILITY</K>
    <Big f={f} color={color} size={100}>1996—1998</Big>
    <div style={{height:250,display:"flex",alignItems:"end",gap:14,marginTop:30}}>
      {[35,60,45,82,68,100,76].map((v,n)=><div key={n} style={{
        flex:1,height:`${v*p(f,10+n*7,75+n*7)}%`,
        background:`linear-gradient(180deg,${color},#283a38)`
      }}/>)}
    </div>
    <Timeline f={f} color={color} items={[
      "1996 • DANJEN KOPASSUS","1998 • PANGKOSTRAD"
    ]}/>
  </div>;

  if(i===6) return <div style={stage}>
    <K color={color}>INDONESIA / A TURNING POINT</K>
    <Big f={f} color={color} size={112}>REFORMASI</Big>
    <div style={{height:390,marginTop:25,position:"relative",overflow:"hidden",
      background:"linear-gradient(145deg,#42221e,#101010)",
      border:`1px solid ${color}66`}}>
      {Array.from({length:13},(_,n)=><div key={n} style={{
        position:"absolute",top:0,bottom:0,
        left:`${n*9-20+p(f,0,90)*18}%`,width:2,
        background:"#f3d7b0",opacity:.25,transform:"rotate(12deg)"
      }}/>)}
      <div style={{position:"absolute",bottom:15,left:22,
        fontSize:130,fontWeight:950,color:color+"99"}}>1998</div>
    </div>
    <Timeline f={f} color={color} items={[
      "SOEHARTO MUNDUR","PANGKOSTRAD DICOPOT"
    ]}/>
  </div>;

  if(i===7) return <div style={stage}>
    <K color={color}>HISTORICAL RECORD / 1998</K>
    <Big f={f} color={C.paper} size={100}>ARSIP</Big>
    <div style={{marginTop:30,padding:28,
      background:"linear-gradient(130deg,#342c28,#111)",
      border:`1px solid ${color}88`,transform:"rotate(-1.5deg)"}}>
      <div style={{fontSize:16,letterSpacing:4,color}}>CATATAN SEJARAH • DOKUMEN</div>
      <div style={{fontSize:58,fontWeight:950,margin:"18px 0"}}>1998</div>
      <Timeline f={f} color={color} items={[
        "DEWAN KEHORMATAN PERWIRA",
        "KONTROVERSI PENCULIKAN AKTIVIS",
        "DUGAAN PELANGGARAN HAM",
        "BANTAHAN PRABOWO"
      ]}/>
    </div>
    <div style={note}>Bedakan keputusan institusional, dugaan, dan bantahan.</div>
  </div>;

  if(i===8) return <div style={stage}>
    <K color={color}>A NEW CHAPTER</K>
    <Big f={f} color={color} size={82}>TRANSFORMASI</Big>
    <div style={{height:410}}><Orbit f={f} color={color}/></div>
    <Timeline f={f} color={color} items={[
      "MENINGGALKAN DINAS MILITER",
      "MENEKUNI DUNIA USAHA",
      "KEMBALI KE KEHIDUPAN PUBLIK"
    ]}/>
  </div>;

  if(i===9) return <div style={stage}>
    <K color={color}>POLITICAL JOURNEY</K>
    <Big f={f} color={C.paper} size={110}>GERINDRA</Big>
    <div style={{height:210,marginTop:20,position:"relative",overflow:"hidden",
      background:"linear-gradient(120deg,#251d1a,#111)"}}>
      <div style={{position:"absolute",left:-120+p(f,0,120)*350,top:-80,
        width:500,height:400,background:C.red,transform:"rotate(-25deg)",opacity:.5}}/>
    </div>
    <Timeline f={f} color={color} items={[
      "2008 • PENDIRIAN GERINDRA",
      "2009 • CALON WAKIL PRESIDEN",
      "2014 • PILPRES","2019 • PILPRES"
    ]}/>
  </div>;

  if(i===10) return <div style={stage}>
    <K color={color}>GOVERNMENT / DEFENSE</K>
    <Big f={f} color={color} size={150}>2019</Big>
    <div style={{height:370,marginTop:20,position:"relative",overflow:"hidden",
      border:`1px solid ${color}66`,background:"linear-gradient(135deg,#1b2b30,#0b1114)"}}>
      {Array.from({length:6},(_,n)=><div key={n} style={{
        position:"absolute",left:`${n*19+4}%`,top:25,width:3,height:320,
        background:color,opacity:.2+n*.1,transform:"rotate(18deg)"
      }}/>)}
      <div style={{position:"absolute",left:25,bottom:25,fontSize:34,fontWeight:900}}>
        KEMENTERIAN<br/>PERTAHANAN
      </div>
    </div>
    <Card f={f} color={color}>
      <div style={{fontSize:30,fontWeight:900}}>MENTERI PERTAHANAN</div>
      <div style={note}>REPUBLIK INDONESIA</div>
    </Card>
  </div>;

  return <div style={{...stage,textAlign:"center"}}>
    <K color={color}>20 OKTOBER 2024</K>
    <Big f={f} color={C.paper} size={100}>PRESIDEN</Big>
    <div style={{fontSize:245,fontWeight:950,lineHeight:1,color,
      transform:`scale(${.8+sp(f,fps)*.2})`,
      textShadow:`0 0 80px ${color}55`}}>KE-8</div>
    <div style={{height:3,background:color,width:`${p(f,8,90)*100}%`,margin:"35px auto"}}/>
    <Card f={f} color={color}>
      <div style={{fontSize:30,fontWeight:900}}>REPUBLIK INDONESIA</div>
      <div style={note}>BABAK BARU KEPEMIMPINAN NASIONAL</div>
    </Card>
  </div>;
};

const Chapter:React.FC<{data:SceneData;index:number;start:number}> =
({data,index,start}) => {
  const f=useCurrentFrame();
  const {durationInFrames}=useVideoConfig();
  const color=data.accent||C.gold;
  const beat=data.beats.find(b=>f>=b.start&&f<b.start+b.duration);
  const camera=1.04+p(f,0,durationInFrames)*.12;
  const pan=wave(f,durationInFrames,18);

  return <AbsoluteFill style={{background:C.bg,color:C.paper,overflow:"hidden"}}>
    {data.imageSrc&&<AbsoluteFill>
      <Img src={staticFile(data.imageSrc)} style={{
        width:"100%",height:"100%",objectFit:"cover",
        transform:`scale(${camera}) translateX(${pan}px)`,
        filter:"brightness(.38) contrast(1.16) saturate(.72)"
      }}/>
    </AbsoluteFill>}
    <AbsoluteFill style={{background:"linear-gradient(180deg,#050909d0 0%,#05090938 35%,#050909a8 72%,#050909 100%)"}}/>
    <div style={{position:"absolute",top:75,left:65,right:65,
      display:"flex",justifyContent:"space-between",fontSize:14,
      letterSpacing:3,color,fontWeight:800}}>
      <span>ORION / DOCUMENTARY</span><span>INDONESIA • BIOGRAPHY</span>
    </div>
    <div style={{position:"absolute",top:245,left:65,right:65,
      opacity:fade(f),transform:`translateY(${rise(f,30)}px)`}}>
      <K color={color}>{data.eyebrow}</K>
      <div style={{fontSize:data.title.length>13?66:92,fontWeight:950,
        lineHeight:.98,letterSpacing:-2,marginTop:20}}>{data.title}</div>
      <div style={{height:4,width:`${p(f,8,38)*300}px`,
        background:color,marginTop:25}}/>
    </div>
    <Story i={index} f={f} color={color}/>
    <div style={{position:"absolute",left:65,right:65,bottom:365,height:145}}>
      <AudioSyncedTypography words={prabowoWords} globalStartFrame={start} accent={color}/>
    </div>
    <div style={{position:"absolute",left:65,right:65,bottom:215,
      fontSize:21,lineHeight:1.45,color:C.paper,opacity:fade(f,10)}}>
      {beat?.text||data.subtitle}
    </div>
    <div style={{position:"absolute",left:65,right:65,bottom:115,height:3,background:"#ffffff35"}}>
      <div style={{height:"100%",width:`${f/durationInFrames*100}%`,background:color}}/>
    </div>
    <div style={{position:"absolute",right:65,bottom:58,color,fontSize:17,fontWeight:900}}>
      {String(index+1).padStart(2,"0")} / 12
    </div>
    <div style={{position:"absolute",inset:22,border:"1px solid #ffffff20",pointerEvents:"none"}}/>
    <AbsoluteFill style={{background:C.bg,
      opacity:p(f,durationInFrames-16,durationInFrames),pointerEvents:"none"}}/>
  </AbsoluteFill>;
};

export const FullNarrative:React.FC = () => {
  let cursor=0;
  const sequences=project.scenes.map((scene,index)=>{
    const from=cursor;
    cursor+=scene.durationFrames;
    return <Sequence key={index} from={from} durationInFrames={scene.durationFrames}>
      <Chapter data={scene} index={index} start={from}/>
    </Sequence>;
  });
  return <AbsoluteFill style={{background:C.bg}}>
    {sequences}
    <Audio src={staticFile(project.voiceoverSrc)} volume={1}/>
  </AbsoluteFill>;
};
