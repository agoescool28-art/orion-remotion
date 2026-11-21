import React from "react";
import { AbsoluteFill, interpolate, staticFile, useCurrentFrame, useVideoConfig, spring } from "remotion";

const GOLD = "#D7B77A";
const PAPER = "#EDE8DC";
const MUTED = "#9C9A91";
const RED = "#A94F4F";
const GREEN = "#82977C";
const BLUE = "#829BAA";
const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

const Line: React.FC<{x1:number;y1:number;x2:number;y2:number;progress:number;color?:string;width?:number;opacity?:number}> = ({x1,y1,x2,y2,progress,color=GOLD,width=3,opacity=1}) => (
  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={width} opacity={opacity} strokeDasharray="1200" strokeDashoffset={1200*(1-progress)} />
);

const Label: React.FC<{x:number;y:number;children:React.ReactNode;size?:number;color?:string;weight?:number;spacing?:number}> = ({x,y,children,size=20,color=PAPER,weight=700,spacing=2}) => (
  <text x={x} y={y} fill={color} fontSize={size} fontWeight={weight} letterSpacing={spacing}>{children}</text>
);

const MapArtwork: React.FC<{frame:number}> = ({frame}) => {
  const p=interpolate(frame,[8,75],[0,1],clamp);
  const pulse=1+Math.sin(frame/13)*0.07;
  return <g>
    <path d="M70 170 L240 110 400 160 565 95 790 150 850 320 770 500 590 555 410 500 230 570 90 430Z" fill="#18231F" stroke="#65786B" strokeWidth="2"/>
    {Array.from({length:7},(_,i)=><path key={i} d={`M${110+i*105} 150 Q${170+i*95} 330 ${130+i*100} 520`} fill="none" stroke="#526258" strokeWidth="1.5" opacity=".55"/>)}
    <path d="M145 355 Q300 270 440 320 T760 290" fill="none" stroke={GOLD} strokeWidth="4" strokeDasharray="12 12" strokeDashoffset={1200*(1-p)}/>
    <circle cx="440" cy="320" r={28*pulse} fill="none" stroke={GOLD} strokeWidth="3" opacity={p}/><circle cx="440" cy="320" r="8" fill={GOLD}/>
    <Label x={480} y={305} size={26} color={GOLD}>JAKARTA</Label>
    <Label x={110} y={610} size={17} color={MUTED}>INDONESIA / TITIK AWAL PERJALANAN</Label>
    <Line x1={110} y1={650} x2={810} y2={650} progress={p} color={GOLD}/>
  </g>;
};

const FamilyArtwork: React.FC<{frame:number}> = ({frame}) => {
  const p=interpolate(frame,[8,70],[0,1],clamp);
  return <g>
    <rect x="115" y="110" width="670" height="470" rx="8" fill="#202923" stroke="#6F786D" strokeWidth="2"/>
    <rect x="145" y="140" width="610" height="70" fill="#2B352E"/>
    <Label x={175} y={184} size={19} color={GOLD}>LATAR KELUARGA</Label>
    <rect x="300" y="270" width="300" height="110" rx="5" fill="#343D34" stroke={GOLD} strokeWidth="2" opacity={p}/>
    <Label x={450} y={315} size={22} color={PAPER}>SUMITRO</Label><Label x={450} y={345} size={16} color={MUTED}>DJOJOHADIKUSUMO</Label>
    <Line x1={450} y1={380} x2={450} y2={450} progress={p} color={GOLD}/>
    <rect x="340" y="450" width="220" height="80" rx="5" fill="#29372E" stroke={GREEN} strokeWidth="2" opacity={p}/>
    <Label x={450} y={498} size={23} color={PAPER}>PRABOWO</Label>
    <Label x={450} y={625} size={17} color={MUTED}>KELUARGA • PENDIDIKAN • LINGKUNGAN</Label>
  </g>;
};

const AcademyArtwork: React.FC<{frame:number}> = ({frame}) => {
  const p=interpolate(frame,[0,60],[0,1],clamp);
  return <g>
    <rect x="145" y="115" width="610" height="475" fill="#202A28" stroke="#829BAA" strokeWidth="2"/>
    <path d="M180 260 L450 130 720 260" fill="none" stroke={BLUE} strokeWidth="8"/>
    <path d="M220 260 V500 M340 260 V500 M450 260 V500 M560 260 V500 M680 260 V500" stroke="#829BAA" strokeWidth="10" opacity=".8"/>
    <path d="M175 505 H725" stroke={GOLD} strokeWidth="5"/>
    <rect x="300" y="320" width="300" height="100" fill="#293B3B" stroke={GOLD} strokeWidth="2" opacity={p}/>
    <Label x={450} y={362} size={21} color={PAPER}>AKABRI</Label><Label x={450} y={395} size={16} color={GOLD}>ANGKATAN 1974</Label>
    <Label x={450} y={630} size={18} color={MUTED}>PENDIDIKAN MILITER / 1970-AN</Label>
    <Line x1={180} y1={665} x2={720} y2={665} progress={p} color={GOLD}/>
  </g>;
};

const FieldArtwork: React.FC<{frame:number}> = ({frame}) => {
  const p=interpolate(frame,[0,75],[0,1],clamp);
  return <g>
    {Array.from({length:8},(_,i)=><path key={i} d={`M${100+i*12} ${170+i*48} Q450 ${40+i*52} ${800-i*8} ${160+i*45}`} fill="none" stroke="#586B5D" strokeWidth="2" opacity=".55"/>)}
    <path d="M160 470 L290 330 410 400 560 230 710 340" fill="none" stroke={GREEN} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1000" strokeDashoffset={1000*(1-p)}/>
    <circle cx="560" cy="230" r="22" fill={GOLD} opacity={p}/><circle cx="710" cy="340" r="15" fill={GOLD} opacity={p}/>
    <rect x="145" y="540" width="610" height="90" fill="#202923" stroke="#68786B"/>
    <Label x={450} y={595} size={22} color={PAPER}>KARIER MILITER</Label>
    <Label x={450} y={680} size={16} color={MUTED}>ANGKATAN DARAT • PASUKAN KHUSUS</Label>
  </g>;
};

const TimelineArtwork: React.FC<{frame:number}> = ({frame}) => {
  const p=interpolate(frame,[0,90],[0,1],clamp);
  return <g>
    <Line x1={120} y1={365} x2={780} y2={365} progress={p} color={GOLD} width={5}/>
    {[{x:190,y:"1996",t:"DANJEN KOPASSUS"},{x:710,y:"1998",t:"PANGKOSTRAD"}].map((v,i)=><g key={v.y} opacity={p}>
      <circle cx={v.x} cy="365" r="20" fill={GOLD}/><circle cx={v.x} cy="365" r="35" fill="none" stroke={GOLD} strokeWidth="2" opacity=".5"/>
      <Label x={v.x} y={285} size={42} color={PAPER}>{v.y}</Label>
      <Label x={v.x} y={445} size={17} color={GOLD}>{v.t}</Label>
    </g>)}
    <rect x="220" y="510" width="440" height="100" fill="#252D28" stroke="#6E786F"/>
    <Label x={440} y={570} size={20} color={MUTED}>DUA JABATAN STRATEGIS</Label>
  </g>;
};

const ReformArtwork: React.FC<{frame:number}> = ({frame}) => {
  const p=interpolate(frame,[0,55],[0,1],clamp);
  const slide=interpolate(frame,[0,45],[100,0],clamp);
  return <g transform={`translate(${slide},0)`}>
    <rect x="125" y="90" width="650" height="540" fill="#E7E0D2"/>
    <rect x="155" y="120" width="590" height="72" fill="#1C2622"/>
    <Label x={450} y={165} size={26} color={PAPER}>REFORMASI 1998</Label>
    <Label x={175} y={255} size={46} color="#1B2420" weight={900} spacing={-1}>PERUBAHAN</Label>
    <Label x={175} y={310} size={46} color="#1B2420" weight={900} spacing={-1}>POLITIK</Label>
    {[0,1,2,3,4].map(i=><rect key={i} x="175" y={365+i*34} width={440-(i%2)*65} height="9" fill="#7E8078" opacity={.65*p}/>) }
    <rect x="630" y="365" width="85" height="140" fill={RED} opacity={p}/>
    <Label x={450} y={590} size={17} color="#424941">21 MEI 1998 • KONTEKS SEJARAH NASIONAL</Label>
  </g>;
};

const DossierArtwork: React.FC<{frame:number}> = ({frame}) => {
  const p=interpolate(frame,[0,65],[0,1],clamp);
  return <g>
    <rect x="165" y="75" width="570" height="570" rx="4" fill="#DAD2C3" transform="rotate(-2 450 350)"/>
    <rect x="190" y="105" width="520" height="520" fill="#EEE8DC" stroke="#81796D" strokeWidth="2"/>
    <Label x={450} y={160} size={22} color="#252A25">CATATAN SEJARAH</Label>
    <Label x={450} y={205} size={16} color="#625F58">1998 / DEWAN KEHORMATAN PERWIRA</Label>
    {[0,1,2,3,4].map(i=><g key={i}>
      <rect x="235" y={260+i*55} width={420} height="7" fill="#858078" opacity=".55"/>
      <rect x={235+(i%2)*45} y={277+i*55} width={270} height="14" fill="#252A25" opacity={p*(.75-i*.06)}/>
    </g>)}
    <rect x="245" y="530" width="400" height="54" fill={RED} opacity={p*.9}/>
    <Label x={445} y={565} size={18} color="#FFF8EB">KONTROVERSI & DUGAAN HAM</Label>
    <Label x={450} y={690} size={16} color={MUTED}>BEDAKAN DOKUMEN • TUDUHAN • BANTAHAN</Label>
  </g>;
};

const BusinessArtwork: React.FC<{frame:number}> = ({frame}) => {
  const p=interpolate(frame,[0,75],[0,1],clamp);
  return <g>
    <path d="M145 545 H755" stroke="#6C786D" strokeWidth="3"/>
    {[0,1,2,3].map(i=><g key={i} opacity={p}>
      <rect x={190+i*145} y={300-(i%2)*60} width="90" height={245+(i%2)*60} fill="#26342C" stroke={i===3?GOLD:"#708072"} strokeWidth="2"/>
      <path d={`M${205+i*145} ${330-(i%2)*60} h60 M${205+i*145} ${370-(i%2)*60} h60 M${205+i*145} ${410-(i%2)*60} h60`} stroke="#9BAA9B" strokeWidth="5"/>
    </g>)}
    <path d="M190 230 Q450 80 740 230" fill="none" stroke={GOLD} strokeWidth="3" strokeDasharray="10 12" strokeDashoffset={600*(1-p)}/>
    <Label x={450} y={625} size={20} color={PAPER}>BABAK BARU • DUNIA USAHA • KEHIDUPAN PUBLIK</Label>
  </g>;
};

const PoliticsArtwork: React.FC<{frame:number}> = ({frame}) => {
  const p=interpolate(frame,[0,85],[0,1],clamp);
  return <g>
    <Line x1={120} y1={350} x2={780} y2={350} progress={p} color={BLUE} width={5}/>
    {[{x:180,y:"2008",t:"GERINDRA"},{x:385,y:"2009",t:"WAPRES"},{x:590,y:"2014",t:"PILPRES"},{x:790,y:"2019",t:"PILPRES"}].map((v,i)=><g key={v.y} opacity={p}>
      <circle cx={v.x} cy="350" r="15" fill={i===3?GOLD:BLUE}/><circle cx={v.x} cy="350" r="28" fill="none" stroke={i===3?GOLD:BLUE} opacity=".5"/>
      <Label x={v.x} y={285} size={30} color={PAPER}>{v.y}</Label><Label x={v.x} y={420} size={15} color={i===3?GOLD:BLUE}>{v.t}</Label>
    </g>)}
    <rect x="165" y="510" width="570" height="105" fill="#202B2C" stroke={BLUE}/>
    <Label x={450} y={552} size={18} color={PAPER}>MEMBANGUN JALUR POLITIK</Label><Label x={450} y={583} size={15} color={MUTED}>PARTAI • PEMILU • KONTES DEMOKRASI</Label>
  </g>;
};

const MinistryArtwork: React.FC<{frame:number}> = ({frame}) => {
  const p=interpolate(frame,[0,65],[0,1],clamp);
  return <g>
    <path d="M140 275 L450 115 760 275" fill="#29352D" stroke={GOLD} strokeWidth="4"/>
    <rect x="165" y="275" width="570" height="290" fill="#202B25" stroke="#788477" strokeWidth="2"/>
    {[0,1,2,3,4].map(i=><rect key={i} x={205+i*105} y="315" width="48" height="250" fill="#526458" stroke="#A1A997" strokeWidth="2" opacity={p}/>) }
    <rect x="360" y="445" width="180" height="120" fill="#111A16" stroke={GOLD} strokeWidth="2"/>
    <Label x={450} y={505} size={20} color={GOLD}>2019</Label>
    <Label x={450} y={630} size={18} color={PAPER}>KEMENTERIAN PERTAHANAN</Label>
  </g>;
};

const PresidencyArtwork: React.FC<{frame:number}> = ({frame}) => {
  const p=interpolate(frame,[0,85],[0,1],clamp);
  const rise=interpolate(frame,[0,60],[120,0],clamp);
  return <g transform={`translate(0 ${rise})`}>
    <rect x="155" y="120" width="590" height="430" fill="#1E2A23" stroke={GOLD} strokeWidth="3"/>
    <path d="M155 120 H745 V210 H155Z" fill="#A64A45" opacity={p}/>
    <path d="M155 210 H745 V300 H155Z" fill="#E8E2D5" opacity={p}/>
    <circle cx="450" cy="410" r="86" fill="none" stroke={GOLD} strokeWidth="4" opacity={p}/>
    <circle cx="450" cy="410" r="65" fill="none" stroke="#8D9A87" strokeWidth="2" opacity={p}/>
    <Label x={450} y={405} size={24} color={GOLD}>08</Label><Label x={450} y={438} size={15} color={PAPER}>PRESIDEN</Label>
    <Label x={450} y={625} size={21} color={PAPER}>20 OKTOBER 2024</Label>
  </g>;
};


const OpeningArtwork: React.FC<{frame:number}> = ({frame}) => {
  const p = interpolate(frame, [0, 42], [0, 1], clamp);
  const scale = interpolate(frame, [0, 300], [1.02, 1.17], clamp);
  const driftX = interpolate(frame, [0, 300], [10, -18], clamp);
  const driftY = interpolate(frame, [0, 300], [4, -8], clamp);
  const scan = interpolate(frame, [0, 105], [-180, 980], clamp);
  const rule = interpolate(frame, [18, 72], [0, 1], clamp);
  const pulse = 0.35 + Math.sin(frame / 18) * 0.12;

  return <g>
    <defs>
      <clipPath id="openingPhotoClip">
        <rect x="78" y="58" width="744" height="590" />
      </clipPath>

      <linearGradient id="openingShade" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#07100C" stopOpacity=".12" />
        <stop offset=".55" stopColor="#07100C" stopOpacity=".08" />
        <stop offset="1" stopColor="#07100C" stopOpacity=".86" />
      </linearGradient>

      <linearGradient id="openingSweep" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#D7B77A" stopOpacity="0" />
        <stop offset=".5" stopColor="#D7B77A" stopOpacity=".72" />
        <stop offset="1" stopColor="#D7B77A" stopOpacity="0" />
      </linearGradient>

      <filter id="openingGrade">
        <feColorMatrix type="saturate" values=".58" />
        <feComponentTransfer>
          <feFuncR type="gamma" amplitude="1.08" exponent=".92" offset="0" />
          <feFuncG type="gamma" amplitude="1.02" exponent=".96" offset="0" />
          <feFuncB type="gamma" amplitude=".91" exponent="1.04" offset="0" />
        </feComponentTransfer>
      </filter>
    </defs>

    <g clipPath="url(#openingPhotoClip)">
      <image
        href={staticFile("1000827929.jpg.jpeg")}
        x="58"
        y="35"
        width="790"
        height="650"
        preserveAspectRatio="xMidYMid slice"
        transform={`translate(${driftX} ${driftY}) translate(450 350) scale(${scale}) translate(-450 -350)`}
        filter="url(#openingGrade)"
      />

      <rect x="78" y="58" width="744" height="590" fill="url(#openingShade)" />

      <path
        d={`M${scan} 58 l120 0 -210 590 -120 0 Z`}
        fill="url(#openingSweep)"
        opacity={pulse}
      />

      <path d="M78 510 H822" stroke="#F1EDE3" strokeWidth="1" opacity=".18" />

      <g opacity={p}>
        <rect x="98" y="82" width="4" height="74" fill={GOLD} />
        <text x="116" y="103" fill={GOLD} fontSize="15" fontWeight="800" letterSpacing="4">
          ARSIP PERJALANAN
        </text>
        <text x="116" y="132" fill={PAPER} fontSize="12" letterSpacing="2">
          INDONESIA / DOKUMENTER
        </text>
      </g>

      <g opacity={p}>
        <text x="112" y="548" fill="#F1EDE3" fontSize="13" fontWeight="700" letterSpacing="3">
          SEBUAH PERJALANAN PANJANG
        </text>
        <text x="108" y="604" fill="#F1EDE3" fontSize="48" fontWeight="900" letterSpacing="-1">
          JEJAK LANGKAH
        </text>
        <rect x="110" y="620" width={590 * rule} height="3" fill={GOLD} />
      </g>
    </g>

    <rect x="78" y="58" width="744" height="590" fill="none" stroke={GOLD} strokeWidth="2" opacity={p} />

    <path
      d="M78 58 h62 M78 58 v62 M822 58 h-62 M822 58 v62 M78 648 h62 M78 648 v-62 M822 648 h-62 M822 648 v-62"
      fill="none"
      stroke="#F1EDE3"
      strokeWidth="3"
      opacity=".9"
    />

    <g opacity={p}>
      <text x="78" y="690" fill={GOLD} fontSize="16" fontWeight="800" letterSpacing="3">
        ORION ORIGINAL DOCUMENTARY
      </text>
      <text x="822" y="690" fill={MUTED} fontSize="13" textAnchor="end" letterSpacing="2">
        CHAPTER 01 / THE BEGINNING
      </text>
    </g>

    <circle cx="798" cy="84" r="5" fill={GOLD} opacity={pulse + .2} />
  </g>;
};

export const DocumentaryArt: React.FC<{sceneIndex:number}> = ({sceneIndex}) => {
  const frame=useCurrentFrame();
  const {fps}=useVideoConfig();
  const reveal=spring({frame:Math.max(0,frame-4),fps,config:{damping:18,stiffness:80,mass:.9}});
  const artOpacity=interpolate(frame,[0,16],[0,1],clamp);
  const scale=interpolate(reveal,[0,1],[.94,1]);
  const common={frame};
  return <AbsoluteFill style={{justifyContent:"center",alignItems:"center",opacity:artOpacity,transform:`scale(${scale})`}}>
    <svg width="900" height="760" viewBox="0 0 900 760" style={{overflow:"visible"}}>
      <defs><linearGradient id="panel" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#243129"/><stop offset="1" stopColor="#111A16"/></linearGradient></defs>
      <rect x="35" y="25" width="830" height="710" fill="url(#panel)" stroke="#536256" strokeWidth="2"/>
      <path d="M35 95 H865 M35 665 H865" stroke="#536256" strokeWidth="1" opacity=".7"/>
      <Label x={65} y={70} size={14} color={GOLD}>ARSIP VISUAL / {String(sceneIndex+1).padStart(2,"0")}</Label>
      <Label x={835} y={70} size={13} color={MUTED}>ORION / DOC V2</Label>
      {sceneIndex===0?<OpeningArtwork frame={frame}/>:null}
      {sceneIndex===1?<MapArtwork frame={frame}/>:null}
      {sceneIndex===2?<FamilyArtwork {...common}/>:null}
      {sceneIndex===3?<AcademyArtwork {...common}/>:null}
      {sceneIndex===4?<FieldArtwork {...common}/>:null}
      {sceneIndex===5?<TimelineArtwork {...common}/>:null}
      {sceneIndex===6?<ReformArtwork {...common}/>:null}
      {sceneIndex===7?<DossierArtwork {...common}/>:null}
      {sceneIndex===8?<BusinessArtwork {...common}/>:null}
      {sceneIndex===9?<PoliticsArtwork {...common}/>:null}
      {sceneIndex===10?<MinistryArtwork {...common}/>:null}
      {sceneIndex===11?<PresidencyArtwork {...common}/>:null}
    </svg>
  </AbsoluteFill>;
};
