import React from 'react';
import {
  AbsoluteFill, Audio, Easing, Sequence, interpolate, staticFile,
  useCurrentFrame, } from 'remotion';
import { Canvas, useThree } from '@react-three/fiber';

/**
 * ORION CREATIVE — EVOLUSI OTOMOTIF V8.0
 * Hybrid procedural 3D + editorial motion graphics.
 * Requires: three, @react-three/fiber
 * Composition contract: named export EvolusiOtomotif, 1080x1920, 30fps, 1440 frames.
 */

const FPS = 30;
const SCENE_FRAMES = 240;
const TOTAL_FRAMES = 1440;

type SceneSpec = {
  title: string; eyebrow: string; subtitle: string; year: string;
  accent: string; accent2: string; tag: string; kind: 'steam'|'engine'|'hybrid'|'battery'|'sensor'|'future';
  style: 'paper'|'brutal'|'iso'|'ui'|'glass'|'mask';
};

const SCENES: SceneSpec[] = [
  { title: 'LAHIRNYA MESIN', eyebrow: '01 / THE BEGINNING', subtitle: 'Dari tenaga uap menuju mesin pembakaran internal.', year: '1769 — 1886', accent: '#E66A3D', accent2: '#E9C89B', tag: 'MECHANICAL REVOLUTION', kind: 'steam', style: 'paper' },
  { title: 'REKAYASA PRESISI', eyebrow: '02 / ENGINEERING', subtitle: 'Siklus mekanis yang semakin efisien dan presisi.', year: '1900 — 1990', accent: '#F0B64B', accent2: '#F4F0E8', tag: 'INTERNAL COMBUSTION', kind: 'engine', style: 'brutal' },
  { title: 'DUA SUMBER ENERGI', eyebrow: '03 / HYBRID ERA', subtitle: 'Mesin pembakaran dan motor listrik bekerja bersama.', year: '1997 — NOW', accent: '#47D6C2', accent2: '#B9F5EA', tag: 'HYBRID POWERTRAIN', kind: 'hybrid', style: 'iso' },
  { title: 'ERA ELEKTRIFIKASI', eyebrow: '04 / ELECTRIC SHIFT', subtitle: 'Energi tersimpan menjadi daya gerak yang senyap.', year: '2010 — NOW', accent: '#65B8FF', accent2: '#C5E6FF', tag: 'BATTERY SYSTEM', kind: 'battery', style: 'ui' },
  { title: 'KENDARAAN CERDAS', eyebrow: '05 / INTELLIGENCE', subtitle: 'Sensor membaca lingkungan dan membantu mengambil keputusan.', year: '2020 — NEXT', accent: '#B69BFF', accent2: '#E1D7FF', tag: 'SENSING & COMPUTE', kind: 'sensor', style: 'glass' },
  { title: 'MOBILITAS ESOK', eyebrow: '06 / THE NEXT CHAPTER', subtitle: 'Teknologi bergerak menuju mobilitas yang lebih terhubung.', year: 'THE FUTURE', accent: '#FF765F', accent2: '#FFD0A8', tag: 'NEXT GENERATION MOBILITY', kind: 'future', style: 'mask' },
];

const clamp = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const };
const smooth = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: Easing.bezier(.16, 1, .3, 1) });

function Metal({ color = '#9BA8B4', metalness = .82, roughness = .24 }: {color?: string; metalness?: number; roughness?: number}) {
  return <meshStandardMaterial color={color} metalness={metalness} roughness={roughness} />;
}

function EngineModel({ frame, accent, hybrid = false }: {frame:number; accent:string; hybrid?:boolean}) {
  const t = frame / 30 * Math.PI * 2 * 1.25;
  return <group rotation={[.18, -.28, -.12]}>
    <mesh position={[0,0,0]}><boxGeometry args={[2.5,.48,1.15]}/><Metal color="#303B45"/></mesh>
    <mesh position={[0,.48,0]}><boxGeometry args={[2.35,.18,1.05]}/><meshStandardMaterial color="#8996A0" metalness={.7} roughness={.3}/></mesh>
    {[0,1,2,3].map((n)=> <group key={n} position={[-.82+n*.55,.6,0]}>
      <mesh position={[0,.35,0]}><cylinderGeometry args={[.2,.2,.16,32]}/><Metal color="#D7E0E6"/></mesh>
      <mesh position={[0,.42+Math.sin(t+n*Math.PI)*.32,0]}><cylinderGeometry args={[.15,.15,.58,32]}/><meshStandardMaterial color={accent} metalness={.58} roughness={.25}/></mesh>
      <group position={[0,.12,.16]} rotation={[0,0,Math.sin(t+n*Math.PI)*.22]}>
        <mesh><boxGeometry args={[.09,.82,.09]}/><Metal color="#AAB6C0"/></mesh>
        <mesh position={[0,-.4,0]}><torusGeometry args={[.13,.045,10,28]}/><Metal color="#E0E5E9"/></mesh>
      </group>
    </group>)}
    <group position={[0,-.18,.25]} rotation={[0,0,t]}>
      <mesh rotation={[Math.PI/2,0,0]}><cylinderGeometry args={[.12,.12,1.4,32]}/><Metal color="#D7A65B"/></mesh>
      {[0,1,2,3].map(i=><mesh key={i} position={[-.82+i*.55,0,0]} rotation={[0,0,i*Math.PI/2]}><boxGeometry args={[.48,.1,.12]}/><Metal color="#C6D0D8"/></mesh>)}
    </group>
    {hybrid && <group position={[1.75,.05,0]}><mesh><cylinderGeometry args={[.48,.48,.52,48]}/><meshStandardMaterial color="#143D43" metalness={.65} roughness={.22}/></mesh><mesh rotation={[Math.PI/2,0,0]}><torusGeometry args={[.4,.07,12,48]}/><meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={1.4}/></mesh></group>}
  </group>;
}

function BatteryModel({ frame, accent }: {frame:number; accent:string}) {
  const pulse = .55 + .45*Math.sin(frame/8);
  return <group rotation={[.12,-.32,.06]}>
    <mesh position={[0,0,0]}><boxGeometry args={[2.9,.32,1.35]}/><Metal color="#253441"/></mesh>
    {Array.from({length:12},(_,i)=><group key={i} position={[-1.18+(i%4)*.78,.28,-.42+Math.floor(i/4)*.42]}>
      <mesh><boxGeometry args={[.62,.5,.34]}/><meshStandardMaterial color="#163B50" metalness={.48} roughness={.25} emissive={accent} emissiveIntensity={pulse*.35}/></mesh>
      <mesh position={[0,.27,0]}><boxGeometry args={[.42,.025,.22]}/><meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={pulse*1.5}/></mesh>
    </group>)}
    <mesh position={[0,.58,0]}><boxGeometry args={[2.75,.035,1.2]}/><meshStandardMaterial color="#C6E8F5" transparent opacity={.14} metalness={.8} roughness={.12}/></mesh>
  </group>;
}

function CarModel({ frame, accent }: {frame:number; accent:string}) {
  const wheelRotation = -frame/30*2.6;
  return <group rotation={[.08,-.32,0]}>
    <mesh position={[0,.18,0]}><boxGeometry args={[3.4,.42,1.45]}/><meshStandardMaterial color="#B8C3CD" metalness={.86} roughness={.2}/></mesh>
    <mesh position={[.05,.58,0]} rotation={[0,0,-.04]}><boxGeometry args={[1.85,.62,1.2]}/><meshStandardMaterial color="#1B3447" metalness={.82} roughness={.12} transparent opacity={.92}/></mesh>
    <mesh position={[1.25,.25,0]}><boxGeometry args={[.42,.16,1.25]}/><meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={1.3}/></mesh>
    {[-1.05,1.05].map((x,i)=>[-.72,.72].map((z,j)=><group key={`${i}-${j}`} position={[x,-.12,z]} rotation={[wheelRotation,0,0]}>
      <mesh rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[.39,.39,.2,48]}/><meshStandardMaterial color="#111820" roughness={.85}/></mesh>
      <mesh rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[.22,.22,.22,32]}/><meshStandardMaterial color="#AAB7C1" metalness={.92} roughness={.18}/></mesh>
      <mesh rotation={[0,0,Math.PI/2]}><torusGeometry args={[.29,.025,8,32]}/><meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={.6}/></mesh>
    </group>))}
    <mesh position={[1.72,.35,-.42]} rotation={[0,0,-.1]}><boxGeometry args={[.12,.08,.18]}/><meshStandardMaterial color="#EAF7FF" emissive="#CDEEFF" emissiveIntensity={3}/></mesh>
    <mesh position={[1.72,.35,.42]} rotation={[0,0,-.1]}><boxGeometry args={[.12,.08,.18]}/><meshStandardMaterial color="#EAF7FF" emissive="#CDEEFF" emissiveIntensity={3}/></mesh>
  </group>;
}

function SensorRings({ frame, accent }: {frame:number; accent:string}) {
  return <group rotation={[Math.PI/2,0,0]} position={[0,.65,0]}>
    {[.8,1.35,1.9].map((r,i)=><mesh key={i} rotation={[0,0,frame/50+i*.7]}>
      <torusGeometry args={[r,.012,8,100]}/><meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={1.4-i*.25} transparent opacity={.75-i*.12}/>
    </mesh>)}
    {Array.from({length:32},(_,i)=><mesh key={i} position={[Math.cos(i/32*Math.PI*2)*1.9,Math.sin(i/32*Math.PI*2)*1.9,0]}><sphereGeometry args={[.025,8,8]}/><meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={2}/></mesh>)}
  </group>;
}

function CameraRig({frame}:{frame:number}) {
  const {camera}=useThree();
  const t=frame/FPS;
  camera.position.set(Math.sin(t*.48)*.32,1.5+Math.sin(t*.36)*.12,6.2-Math.sin(t*.4)*.5);
  camera.lookAt(0,0,0);
  return null;
}

function ThreeScene({ spec, localFrame }: {spec:SceneSpec; localFrame:number}) {
  const t=localFrame/FPS;
  const cameraRig = <CameraRig frame={localFrame}/>;
  return <>
    <color attach="background" args={['#07111B']} />
    <fog attach="fog" args={['#07111B',7,14]} />
    <ambientLight intensity={.72}/>
    <directionalLight position={[4,6,5]} intensity={2.2} color="#EAF4FF"/>
    <pointLight position={[-4,1,2]} intensity={34} color={spec.accent}/>
    <pointLight position={[3,-2,-3]} intensity={18} color={spec.accent2}/>
    {cameraRig}
    <group rotation={[0,Math.sin(t*.3)*.12-.28,0]} position={[0,Math.sin(t*1.1)*.045,0]}>
      {spec.kind==='steam' || spec.kind==='engine' ? <EngineModel frame={localFrame} accent={spec.accent}/> : null}
      {spec.kind==='hybrid' ? <group><EngineModel frame={localFrame} accent={spec.accent} hybrid/><mesh position={[0,-1.1,0]}><torusGeometry args={[2.3,.018,8,100]}/><meshStandardMaterial color={spec.accent} emissive={spec.accent} emissiveIntensity={1.6}/></mesh></group> : null}
      {spec.kind==='battery' ? <BatteryModel frame={localFrame} accent={spec.accent}/> : null}
      {spec.kind==='sensor' ? <group><CarModel frame={localFrame} accent={spec.accent}/><SensorRings frame={localFrame} accent={spec.accent}/></group> : null}
      {spec.kind==='future' ? <group><CarModel frame={localFrame} accent={spec.accent}/><SensorRings frame={localFrame} accent={spec.accent}/></group> : null}
    </group>
    <gridHelper args={[16,32,'#254154','#142A3A']} position={[0,-1.25,0]}/>
  </>;
}

function DataParticles({ accent, frame }: {accent:string; frame:number}) {
  return <div style={{position:'absolute',inset:0,pointerEvents:'none',opacity:.6}}>
    {Array.from({length:22},(_,i)=>{
      const x=(i*47+Math.sin(frame/24+i)*18)%100;
      const y=(i*31-frame*.16*(i%3+1)+1000)%100;
      return <div key={i} style={{position:'absolute',left:`${x}%`,top:`${y}%`,width:i%4===0?4:2,height:i%4===0?4:2,borderRadius:20,background:accent,boxShadow:`0 0 12px ${accent}`,opacity:.25+(i%5)*.12}}/>;
    })}
  </div>;
}

function StyleLayer({spec, frame}: {spec:SceneSpec; frame:number}) {
  const p=smooth(frame,0,28);
  const titleX=interpolate(p,[0,1],[90,0]);
  const titleOpacity=p;
  const isBrutal=spec.style==='brutal';
  const isPaper=spec.style==='paper';
  const isGlass=spec.style==='glass'||spec.style==='ui';
  const isMask=spec.style==='mask';
  return <>
    <DataParticles accent={spec.accent} frame={frame}/>
    <div style={{position:'absolute',top:64,left:64,right:64,display:'flex',justifyContent:'space-between',alignItems:'center',fontSize:17,letterSpacing:4,fontWeight:900,color:'#E9F0F5'}}>
      <span><i style={{display:'inline-block',width:10,height:10,borderRadius:20,background:spec.accent,marginRight:13,boxShadow:`0 0 16px ${spec.accent}`}}/>ORION CREATIVE</span>
      <span style={{color:'#8DA2B3',fontSize:13}}>MOTION LAB / V8.0</span>
    </div>
    <div style={{position:'absolute',top:205,left:68,right:68,transform:`translateX(${titleX}px)`,opacity:titleOpacity}}>
      <div style={{fontSize:17,fontWeight:900,letterSpacing:6,color:spec.accent}}>{spec.eyebrow}</div>
      <div style={{marginTop:20,fontSize:isBrutal?88:76,lineHeight:.94,fontWeight:950,letterSpacing:-4,color:isMask?'transparent':(isBrutal?'#F4F0E8':'#F5F8FB'),background:isMask?`linear-gradient(100deg,#FFFFFF 0%,${spec.accent} 48%,#FFFFFF 100%)`:undefined,backgroundSize:isMask?'220% 100%':undefined,backgroundPosition:isMask?`${(frame/SCENE_FRAMES)*100}% 50%`:undefined,backgroundClip:isMask?'text':undefined,WebkitBackgroundClip:isMask?'text':undefined,textShadow:isPaper?`8px 9px 0 ${spec.accent}55`:`0 12px 50px ${spec.accent}28`,WebkitTextStroke:isMask?`1px ${spec.accent}`:undefined}}>{spec.title}</div>
      <div style={{marginTop:24,maxWidth:780,fontSize:25,lineHeight:1.35,color:'#B8C8D4',fontWeight:500}}>{spec.subtitle}</div>
      <div style={{marginTop:23,display:'flex',alignItems:'center',gap:15}}><div style={{width:54,height:4,background:spec.accent}}/><span style={{fontSize:16,fontWeight:900,letterSpacing:4,color:spec.accent}}>{spec.year}</span></div>
    </div>
    {isPaper && <div style={{position:'absolute',top:830,left:64,width:160,height:360,background:'#E9D8BD',opacity:.13,transform:'rotate(-8deg)',boxShadow:'18px 20px 0 rgba(0,0,0,.2)'}}/>}
    {isBrutal && <div style={{position:'absolute',right:54,top:770,background:spec.accent,color:'#07111B',padding:'14px 20px',fontSize:17,fontWeight:950,letterSpacing:3,transform:'rotate(4deg)',boxShadow:'9px 9px 0 #F4F0E8'}}>ENGINEERING / 02</div>}
    {spec.style==='ui' && <div style={{position:'absolute',left:64,right:64,bottom:190,padding:'22px 24px',border:'1px solid rgba(255,255,255,.15)',borderRadius:18,background:'rgba(7,18,29,.78)',display:'flex',gap:22,alignItems:'end',boxShadow:'0 20px 60px rgba(0,0,0,.32)'}}><div style={{flex:1}}><div style={{fontSize:12,letterSpacing:3,color:spec.accent,fontWeight:900}}>ENERGY DENSITY / INDEX</div><div style={{display:'flex',alignItems:'end',gap:9,height:112,marginTop:16}}>{[.22,.3,.38,.5,.62,.74,.88,1].map((v,i)=><div key={i} style={{flex:1,height:`${v*100}%`,background:`linear-gradient(180deg,${spec.accent},${spec.accent}44)`,borderRadius:'5px 5px 0 0',transform:`scaleY(${smooth(frame,18+i*3,48+i*3)})`,transformOrigin:'bottom',boxShadow:`0 0 12px ${spec.accent}55`}}/>)}</div><div style={{display:'flex',justifyContent:'space-between',fontSize:11,color:'#8CA2B4',marginTop:8}}><span>EARLY GEN</span><span>HIGH DENSITY</span></div></div><div style={{width:150,borderLeft:'1px solid rgba(255,255,255,.15)',paddingLeft:20}}><div style={{fontSize:12,color:'#91A8B9',letterSpacing:2}}>CHARGE</div><div style={{fontSize:42,fontWeight:950,color:'#F4F8FA',marginTop:5}}>{Math.round(24+76*smooth(frame,25,180))}<span style={{fontSize:18,color:spec.accent}}>%</span></div><div style={{height:5,background:'#263B4C',marginTop:8,borderRadius:8,overflow:'hidden'}}><div style={{height:'100%',width:`${24+76*smooth(frame,25,180)}%`,background:spec.accent}}/></div></div></div>}
    {isGlass && <div style={{position:'absolute',left:64,right:64,bottom:190,padding:'22px 25px',borderRadius:22,border:`1px solid ${spec.accent}66`,background:'linear-gradient(135deg,rgba(255,255,255,.13),rgba(255,255,255,.025))',backdropFilter:'blur(18px)',boxShadow:`0 20px 70px ${spec.accent}18`,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
      <div><div style={{fontSize:13,letterSpacing:3,color:spec.accent,fontWeight:900}}>SYSTEM STATUS</div><div style={{fontSize:20,color:'#F2F7FA',fontWeight:800,marginTop:7}}>{spec.tag}</div></div>
      <div style={{textAlign:'right'}}><div style={{fontSize:12,color:'#91A7B7',letterSpacing:2}}>CHAPTER</div><div style={{fontSize:29,fontWeight:950,color:'#F4F8FA'}}>0{SCENES.indexOf(spec)+1}<span style={{fontSize:17,color:'#7D91A2'}}> / 06</span></div></div>
    </div>}
    {isMask && <div style={{position:'absolute',left:64,right:64,bottom:185,fontSize:66,lineHeight:.9,fontWeight:950,letterSpacing:-3,color:'transparent',WebkitTextStroke:`1.5px ${spec.accent}`,opacity:.7}}>MOVE BEYOND<br/>THE MACHINE</div>}
    {isPaper && <div style={{position:'absolute',left:64,bottom:190,background:'#E9D8BD',color:'#17212A',padding:'18px 24px',fontWeight:950,letterSpacing:3,boxShadow:'10px 12px 0 rgba(0,0,0,.22)'}}>INDUSTRIAL AGE</div>}
    <div style={{position:'absolute',bottom:75,left:64,right:64}}>
      <div style={{height:4,background:'rgba(255,255,255,.13)',overflow:'hidden'}}><div style={{height:'100%',width:`${((SCENES.indexOf(spec)+frame/SCENE_FRAMES)/6)*100}%`,background:spec.accent,boxShadow:`0 0 16px ${spec.accent}`}}/></div>
      <div style={{display:'flex',justifyContent:'space-between',marginTop:13,fontSize:12,letterSpacing:2,color:'#71899B'}}><span>EVOLUSI TEKNOLOGI OTOMOTIF</span><span>ORION / CINEMATIC SERIES</span></div>
    </div>
  </>;
}

function Scene({spec,index}:{spec:SceneSpec;index:number}) {
  const frame=useCurrentFrame();
  const localFrame=frame;
  const intro=smooth(frame,0,30);
  const transition=interpolate(frame,[0,18,SCENE_FRAMES-18,SCENE_FRAMES],[0,1,1,0],clamp);
  const zoom=interpolate(frame,[0,SCENE_FRAMES],[1.12,1.0],{...clamp,easing:Easing.inOut(Easing.cubic)});
  return <AbsoluteFill style={{background:'#07111B',overflow:'hidden'}}>
    <AbsoluteFill style={{opacity:.98,transform:`scale(${zoom})`}}>
      <Canvas dpr={1} gl={{antialias:true,alpha:false}} camera={{position:[0,1.5,6.2],fov:38}}>
        <ThreeScene spec={spec} localFrame={localFrame}/>
      </Canvas>
    </AbsoluteFill>
    <AbsoluteFill style={{background:'linear-gradient(180deg,rgba(3,9,16,.94) 0%,rgba(3,9,16,.35) 38%,rgba(3,9,16,.05) 58%,rgba(3,9,16,.86) 100%)'}}/>
    <StyleLayer spec={spec} frame={frame}/>
    <AbsoluteFill style={{background:spec.accent,opacity:(1-transition)*.16,mixBlendMode:'screen'}}/>
    <div style={{position:'absolute',top:0,left:0,width:'100%',height:8,background:spec.accent,transform:`scaleX(${intro})`,transformOrigin:'left'}}/>
  </AbsoluteFill>;
}

export const EvolusiOtomotif: React.FC = () => (
  <AbsoluteFill style={{background:'#07111B'}}>
    {SCENES.map((spec,index)=><Sequence key={spec.kind} from={index*SCENE_FRAMES} durationInFrames={SCENE_FRAMES}><Scene spec={spec} index={index}/></Sequence>)}
    <Audio src={staticFile('evolusi-otomotif-vo.mp3')}/>
  </AbsoluteFill>
);

export const evolusiOtomotifConfig = { id:'EvolusiOtomotif', width:1080, height:1920, fps:FPS, durationInFrames:TOTAL_FRAMES };
