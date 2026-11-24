
import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

import { project, type SceneData } from "./project";
import { prabowoWords } from "./audio/prabowo.words";
import { AudioSyncedTypography } from "./audio/AudioSyncedTypography";

const C = {
  gold: "#D8B878",
  paper: "#F2EBDD",
  muted: "#B8B6AD",
  dark: "#080D0C",
};

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const progress = (frame: number, from: number, to: number) =>
  interpolate(frame, [from, Math.max(from + 1, to)], [0, 1], clamp);

const enter = (frame: number, fps: number, delay = 0) =>
  spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 18, stiffness: 115, mass: 0.65 },
  });

const fade = (frame: number, delay = 0) =>
  progress(frame, delay, delay + 18);

const Kicker: React.FC<{
  children: React.ReactNode;
  color: string;
}> = ({ children, color }) => (
  <div style={{
    color,
    fontSize: 17,
    letterSpacing: 5,
    fontWeight: 800,
    textTransform: "uppercase",
  }}>
    {children}
  </div>
);

const MotionCard: React.FC<{
  frame: number;
  fps: number;
  delay?: number;
  color: string;
  children: React.ReactNode;
}> = ({ frame, fps, delay = 0, color, children }) => {
  const p = enter(frame, fps, delay);

  return (
    <div style={{
      position: "relative",
      overflow: "hidden",
      border: `1px solid ${color}88`,
      background: "linear-gradient(135deg,#19221eeb,#050a09ee)",
      padding: 25,
      opacity: fade(frame, delay),
      transform: `translateY(${interpolate(p,[0,1],[52,0])}px)`,
      boxShadow: "0 24px 65px #0005",
    }}>
      <div style={{
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        width: 3,
        background: color,
      }} />
      {children}
    </div>
  );
};

const BigNumber: React.FC<{
  value: string;
  frame: number;
  color: string;
  size?: number;
}> = ({ value, frame, color, size = 112 }) => {
  const p = enter(frame, 30);

  return (
    <div style={{
      fontSize: size,
      fontWeight: 900,
      lineHeight: 0.94,
      letterSpacing: -3,
      color,
      opacity: fade(frame),
      transform: `translateY(${interpolate(p,[0,1],[70,0])}px)`,
      textShadow: "0 14px 55px #0009",
    }}>
      {value}
    </div>
  );
};

const MovingRule: React.FC<{
  frame: number;
  color: string;
  delay?: number;
}> = ({ frame, color, delay = 8 }) => (
  <div style={{
    height: 3,
    width: `${progress(frame,delay,delay+38)*100}%`,
    background: color,
    boxShadow: `0 0 22px ${color}88`,
  }} />
);

const ChapterVisual: React.FC<{
  index: number;
  frame: number;
  duration: number;
  accent: string;
}> = ({ index, frame, duration, accent }) => {
  const { fps } = useVideoConfig();
  const p = progress(frame, 8, duration * 0.82);
  const left = 76;
  const right = 76;

  // OPENING — TIMELINE
  if (index === 0) {
    const milestones = [
      ["1951","KELAHIRAN"],
      ["1974","AKABRI"],
      ["1998","TITIK BALIK"],
      ["2024","PRESIDEN"],
    ];

    return (
      <AbsoluteFill>
        <div style={{ position:"absolute",left,right,top:760 }}>
          <Kicker color={accent}>A LIFE IN FOUR CHAPTERS</Kicker>
          <BigNumber value="73 TAHUN" frame={frame} color={accent} size={104}/>

          <div style={{marginTop:82,height:4,background:"#ffffff2b"}}>
            <MovingRule frame={frame} color={accent}/>
          </div>

          <div style={{
            display:"grid",
            gridTemplateColumns:"repeat(4,1fr)",
            gap:10,
            marginTop:30,
          }}>
            {milestones.map(([year,label],i)=>(
              <div key={year} style={{
                opacity:fade(frame,18+i*12),
                transform:`translateY(${interpolate(
                  enter(frame,fps,18+i*12),[0,1],[35,0]
                )}px)`,
              }}>
                <div style={{
                  width:15,height:15,borderRadius:20,
                  background:accent,marginBottom:18,
                  boxShadow:`0 0 22px ${accent}`,
                }}/>
                <div style={{color:accent,fontSize:28,fontWeight:900}}>{year}</div>
                <div style={{color:C.paper,fontSize:15,marginTop:9}}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </AbsoluteFill>
    );
  }

  // BIRTH — JAKARTA
  if (index === 1) {
    return (
      <AbsoluteFill>
        <div style={{position:"absolute",left,right,top:700}}>
          <Kicker color={accent}>THE BEGINNING</Kicker>
          <BigNumber value="1951" frame={frame} color={accent} size={176}/>
          <div style={{fontSize:25,fontWeight:850,marginTop:18}}>17 OKTOBER</div>

          <svg width="100%" height="390" viewBox="0 0 900 390">
            <path d="M70 280 L190 245 L300 270 L410 155 L540 195 L680 80 L830 145"
              fill="none" stroke={`${accent}66`} strokeWidth="3"/>
            <path d="M70 280 L190 245 L300 270 L410 155 L540 195 L680 80 L830 145"
              fill="none" stroke={accent} strokeWidth="5"
              strokeDasharray="1100"
              strokeDashoffset={1100*(1-p)}/>
            <circle cx="680" cy="80" r={12+p*12} fill={accent}/>
            <circle cx="680" cy="80" r={42+p*38}
              fill="none" stroke={accent} strokeWidth="2" opacity=".45"/>
            <text x="545" y="165" fill={C.paper} fontSize="36" fontWeight="bold">JAKARTA</text>
            <text x="548" y="205" fill={accent} fontSize="19">INDONESIA</text>
          </svg>

          <MotionCard frame={frame} fps={fps} delay={24} color={accent}>
            <div style={{fontSize:32,fontWeight:900}}>PRABOWO SUBIANTO</div>
            <div style={{color:C.muted,fontSize:20,marginTop:10}}>
              Lahir di Jakarta, 17 Oktober 1951
            </div>
          </MotionCard>
        </div>
      </AbsoluteFill>
    );
  }

  // FAMILY
  if (index === 2) {
    return (
      <AbsoluteFill>
        <div style={{position:"absolute",left,right,top:735}}>
          <Kicker color={accent}>FAMILY & BACKGROUND</Kicker>
          <MotionCard frame={frame} fps={fps} color={accent}>
            <div style={{color:accent,fontSize:18,letterSpacing:4}}>FIGUR KELUARGA</div>
            <div style={{fontSize:48,fontWeight:900,marginTop:22}}>SUMITRO</div>
            <div style={{fontSize:25,color:C.muted,marginTop:8}}>DJOJOHADIKUSUMO</div>
          </MotionCard>

          <div style={{height:110,display:"flex",justifyContent:"center"}}>
            <div style={{width:3,height:`${p*100}%`,background:accent}}/>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            <MotionCard frame={frame} fps={fps} delay={18} color={accent}>
              <div style={{fontSize:25,fontWeight:900}}>EKONOM</div>
            </MotionCard>
            <MotionCard frame={frame} fps={fps} delay={32} color={accent}>
              <div style={{fontSize:23,fontWeight:900}}>TOKOH PEMERINTAHAN</div>
            </MotionCard>
          </div>
        </div>
      </AbsoluteFill>
    );
  }

  // MILITARY EDUCATION
  if (index === 3) {
    const bars = [44,68,54,88,62,100,76];

    return (
      <AbsoluteFill>
        <div style={{position:"absolute",left,right,top:760}}>
          <Kicker color={accent}>MILITARY EDUCATION</Kicker>
          <BigNumber value="AKABRI" frame={frame} color={accent} size={130}/>

          <div style={{
            height:300,display:"flex",alignItems:"end",
            gap:13,marginTop:55,
          }}>
            {bars.map((h,i)=>(
              <div key={i} style={{
                flex:1,height:`${h*p}%`,minHeight:4,
                background:`linear-gradient(180deg,${accent},#405b60)`,
                opacity:.5+i*.07,
                transform:`translateY(${interpolate(
                  enter(frame,fps,i*7),[0,1],[40,0]
                )}px)`,
              }}/>
            ))}
          </div>

          <MotionCard frame={frame} fps={fps} delay={25} color={accent}>
            <div style={{fontSize:66,fontWeight:900}}>1974</div>
            <div style={{fontSize:23,marginTop:12}}>LULUS AKADEMI ANGKATAN BERSENJATA</div>
          </MotionCard>
        </div>
      </AbsoluteFill>
    );
  }

  // KOPASSUS
  if (index === 4) {
    return (
      <AbsoluteFill>
        <div style={{position:"absolute",left,right,top:735}}>
          <Kicker color={accent}>MILITARY CAREER</Kicker>
          <BigNumber value="KOPASSUS" frame={frame} color={accent} size={91}/>

          <div style={{
            position:"relative",height:260,marginTop:42,
            display:"flex",alignItems:"center",justifyContent:"center",
          }}>
            {[0,1,2].map(n=>(
              <div key={n} style={{
                position:"absolute",
                width:150+n*95,height:150+n*95,
                border:`2px solid ${accent}`,borderRadius:"50%",
                opacity:.7-n*.15,
                transform:`scale(${.65+p*.35}) rotate(${frame*(n%2?-0.18:0.18)}deg)`,
              }}/>
            ))}
            <div style={{color:accent,fontSize:29,fontWeight:900}}>
              PASUKAN KHUSUS
            </div>
          </div>

          {["ANGKATAN DARAT","PASUKAN KHUSUS","KOPASSUS"].map((t,i)=>(
            <MotionCard key={t} frame={frame} fps={fps} delay={i*17} color={accent}>
              <div style={{fontSize:26,fontWeight:900}}>{t}</div>
            </MotionCard>
          ))}
        </div>
      </AbsoluteFill>
    );
  }

  // STRATEGIC POSITIONS
  if (index === 5) {
    return (
      <AbsoluteFill>
        <div style={{position:"absolute",left,right,top:735}}>
          <Kicker color={accent}>STRATEGIC POSITIONS</Kicker>
          <BigNumber value="1996—1998" frame={frame} color={accent} size={92}/>

          <div style={{marginTop:65,borderLeft:`4px solid ${accent}`,paddingLeft:34}}>
            {[["1996","DANJEN KOPASSUS"],["1998","PANGKOSTRAD"]].map(([year,title],i)=>(
              <div key={year} style={{
                marginBottom:62,
                opacity:fade(frame,i*28),
                transform:`translateX(${interpolate(
                  enter(frame,fps,i*28),[0,1],[90,0]
                )}px)`,
              }}>
                <div style={{color:accent,fontSize:49,fontWeight:900}}>{year}</div>
                <div style={{fontSize:31,fontWeight:900,marginTop:10}}>{title}</div>
                <MovingRule frame={frame} color={accent} delay={i*28+12}/>
              </div>
            ))}
          </div>
        </div>
      </AbsoluteFill>
    );
  }

  // REFORMASI
  if (index === 6) {
    return (
      <AbsoluteFill>
        <div style={{position:"absolute",left,right,top:710}}>
          <Kicker color={accent}>INDONESIA • 1998</Kicker>
          <BigNumber value="REFORMASI" frame={frame} color={accent} size={87}/>

          <div style={{
            marginTop:55,height:360,
            border:`1px solid ${accent}88`,
            position:"relative",overflow:"hidden",
            background:"linear-gradient(145deg,#3b1c1c,#101312)",
          }}>
            <div style={{
              position:"absolute",inset:0,
              background:`repeating-linear-gradient(0deg,transparent 0px,transparent 34px,${accent}20 35px)`,
              transform:`translateY(${p*100}px)`,
            }}/>
            <div style={{
              position:"absolute",left:30,bottom:28,
              color:accent,fontSize:100,fontWeight:900,
            }}>1998</div>
          </div>

          {["SOEHARTO MUNDUR","PANGKOSTRAD DICOPOT"].map((t,i)=>(
            <MotionCard key={t} frame={frame} fps={fps} delay={i*23} color={accent}>
              <div style={{fontSize:25,fontWeight:900}}>{t}</div>
            </MotionCard>
          ))}
        </div>
      </AbsoluteFill>
    );
  }

  // HISTORICAL ARCHIVE
  if (index === 7) {
    const items = [
      "DEWAN KEHORMATAN PERWIRA",
      "KONTROVERSI PENCULIKAN AKTIVIS",
      "DUGAAN PELANGGARAN HAM",
      "BANTAHAN PRABOWO",
    ];

    return (
      <AbsoluteFill>
        <div style={{position:"absolute",left,right,top:675}}>
          <Kicker color={accent}>HISTORICAL RECORD</Kicker>
          <BigNumber value="ARSIP 1998" frame={frame} color={accent} size={88}/>

          <div style={{height:2,background:`${accent}66`,marginTop:28}}/>

          <div style={{display:"grid",gap:15,marginTop:35}}>
            {items.map((item,i)=>(
              <MotionCard key={item} frame={frame} fps={fps} delay={i*18} color={accent}>
                <div style={{display:"flex",alignItems:"center",gap:18}}>
                  <div style={{color:accent,fontSize:36,fontWeight:900}}>
                    {String(i+1).padStart(2,"0")}
                  </div>
                  <div style={{fontSize:23,fontWeight:850,lineHeight:1.25}}>
                    {item}
                  </div>
                </div>
              </MotionCard>
            ))}
          </div>

          <div style={{color:C.muted,fontSize:18,lineHeight:1.5,marginTop:24}}>
            Catatan sejarah dibaca dengan membedakan keputusan institusional,
            dugaan, dan bantahan.
          </div>
        </div>
      </AbsoluteFill>
    );
  }

  // TRANSFORMATION
  if (index === 8) {
    return (
      <AbsoluteFill>
        <div style={{position:"absolute",left,right,top:735}}>
          <Kicker color={accent}>A NEW CHAPTER</Kicker>
          <BigNumber value="TRANSFORMASI" frame={frame} color={accent} size={76}/>

          <div style={{display:"grid",gap:17,marginTop:62}}>
            {[
              ["MILITER","MASA LALU"],
              ["DUNIA USAHA","BABAK BARU"],
              ["KEHIDUPAN PUBLIK","KEMBALI KE INDONESIA"],
            ].map(([title,desc],i)=>(
              <MotionCard key={title} frame={frame} fps={fps} delay={i*22} color={accent}>
                <div style={{fontSize:29,fontWeight:900}}>{title}</div>
                <div style={{color:accent,marginTop:12,fontSize:18}}>{desc}</div>
              </MotionCard>
            ))}
          </div>
        </div>
      </AbsoluteFill>
    );
  }

  // POLITICAL JOURNEY
  if (index === 9) {
    const events = [
      ["2008","PENDIRIAN GERINDRA"],
      ["2009","CALON WAKIL PRESIDEN"],
      ["2014","KONTES PEMILIHAN PRESIDEN"],
      ["2019","KONTES PEMILIHAN PRESIDEN"],
    ];

    return (
      <AbsoluteFill>
        <div style={{position:"absolute",left,right,top:700}}>
          <Kicker color={accent}>POLITICAL JOURNEY</Kicker>
          <BigNumber value="GERINDRA" frame={frame} color={accent} size={112}/>

          <div style={{position:"relative",paddingLeft:36,marginTop:55}}>
            <div style={{
              position:"absolute",left:8,top:5,bottom:0,
              width:3,background:`${accent}66`,
            }}/>

            {events.map(([year,title],i)=>(
              <div key={year} style={{
                position:"relative",marginBottom:38,
                opacity:fade(frame,i*16),
                transform:`translateX(${interpolate(
                  enter(frame,fps,i*16),[0,1],[60,0]
                )}px)`,
              }}>
                <div style={{
                  position:"absolute",left:-35,top:12,
                  width:14,height:14,borderRadius:20,
                  background:accent,
                }}/>
                <div style={{color:accent,fontSize:40,fontWeight:900}}>{year}</div>
                <div style={{fontSize:23,fontWeight:850,marginTop:7}}>{title}</div>
              </div>
            ))}
          </div>
        </div>
      </AbsoluteFill>
    );
  }

  // MINISTER OF DEFENSE
  if (index === 10) {
    return (
      <AbsoluteFill>
        <div style={{position:"absolute",left,right,top:760}}>
          <Kicker color={accent}>GOVERNMENT • 2019</Kicker>
          <BigNumber value="2019" frame={frame} color={accent} size={170}/>

          <MotionCard frame={frame} fps={fps} delay={24} color={accent}>
            <div style={{fontSize:39,fontWeight:900,lineHeight:1.2}}>
              MENTERI PERTAHANAN
            </div>
            <MovingRule frame={frame} color={accent}/>
            <div style={{fontSize:21,marginTop:24,color:C.muted}}>
              REPUBLIK INDONESIA
            </div>
          </MotionCard>
        </div>
      </AbsoluteFill>
    );
  }

  // PRESIDENCY
  return (
    <AbsoluteFill>
      <div style={{position:"absolute",left,right,top:680,textAlign:"center"}}>
        <Kicker color={accent}>20 OKTOBER 2024</Kicker>
        <BigNumber value="PRESIDEN" frame={frame} color={C.paper} size={100}/>

        <div style={{
          fontSize:220,fontWeight:900,color:accent,lineHeight:1,
          transform:`scale(${0.78+enter(frame,fps)*0.22})`,
          textShadow:`0 0 65px ${accent}55`,
        }}>
          KE-8
        </div>

        <div style={{
          height:3,width:`${p*100}%`,
          background:accent,margin:"42px auto",
        }}/>

        <MotionCard frame={frame} fps={fps} delay={28} color={accent}>
          <div style={{fontSize:29,fontWeight:900}}>REPUBLIK INDONESIA</div>
          <div style={{color:C.muted,fontSize:19,marginTop:14}}>
            BABAK BARU KEPEMIMPINAN NASIONAL
          </div>
        </MotionCard>
      </div>
    </AbsoluteFill>
  );
};


const Chapter: React.FC<{
  data: SceneData;
  index: number;
  start: number;
  duration: number;
}> = ({ data, index, start, duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const accent = data.accent || C.gold;
  const intro = enter(frame, fps);
  const outro = progress(frame, duration - 20, duration - 1);

  const zoom = interpolate(
    frame,
    [0, duration],
    [1.04, 1.13],
    clamp
  );

  const drift = interpolate(
    frame,
    [0, duration],
    [index % 2 === 0 ? -22 : 22, index % 2 === 0 ? 22 : -22],
    clamp
  );

  const beat = data.beats.find(
    (item) =>
      frame >= item.start &&
      frame < item.start + item.duration
  );

  return (
    <AbsoluteFill
      style={{
        background: C.dark,
        color: C.paper,
        overflow: "hidden",
      }}
    >
      {/* BACKGROUND */}
      {data.imageSrc ? (
        <AbsoluteFill>
          <Img
            src={staticFile(data.imageSrc)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: `translate3d(${drift}px,0,0) scale(${zoom})`,
              filter: "brightness(.38) contrast(1.15) saturate(.72)",
            }}
          />
        </AbsoluteFill>
      ) : (
        <AbsoluteFill
          style={{
            background:
              "radial-gradient(ellipse at 70% 35%,#293d35 0%,#111b18 45%,#070b0a 90%)",
          }}
        />
      )}

      {/* CINEMATIC GRADING */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg,#050908dd 0%,#05090822 35%,#05090855 60%,#050908ee 100%)",
        }}
      />

      {/* AMBIENT LIGHT */}
      <div
        style={{
          position: "absolute",
          width: 650,
          height: 650,
          top: 360,
          right: -300 + drift,
          borderRadius: "50%",
          background: `radial-gradient(circle,${accent}28,transparent 70%)`,
          filter: "blur(35px)",
        }}
      />

      {/* HEADER */}
      <div
        style={{
          position: "absolute",
          top: 65,
          left: 75,
          right: 75,
          display: "flex",
          justifyContent: "space-between",
          color: accent,
          fontSize: 14,
          letterSpacing: 3,
          fontWeight: 800,
          opacity: fade(frame),
        }}
      >
        <span>ORION / DOCUMENTARY</span>
        <span>{String(index + 1).padStart(2, "0")} / 12</span>
      </div>

      {/* CHAPTER TITLE */}
      <div
        style={{
          position: "absolute",
          top: 205,
          left: 75,
          right: 75,
          opacity: fade(frame),
          transform: `translateY(${interpolate(
            intro,
            [0, 1],
            [35, 0]
          )}px)`,
        }}
      >
        <div
          style={{
            color: accent,
            fontSize: 17,
            letterSpacing: 4,
            fontWeight: 800,
          }}
        >
          {data.eyebrow}
        </div>

        <div
          style={{
            fontSize: data.title.length > 13 ? 65 : 94,
            lineHeight: 1.02,
            fontWeight: 900,
            letterSpacing: -2,
            marginTop: 16,
            textShadow: "0 10px 45px #000",
          }}
        >
          {data.title}
        </div>

        <div
          style={{
            marginTop: 18,
            height: 3,
            width: `${progress(frame, 8, 42) * 145}px`,
            background: accent,
            boxShadow: `0 0 20px ${accent}88`,
          }}
        />
      </div>

      {/* VISUAL STAGE — RAISED TO CREATE SPACE */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: "translateY(-105px)",
        }}
      >
        <ChapterVisual
          index={index}
          frame={frame}
          duration={duration}
          accent={accent}
        />
      </div>

      {/* VOICE-OVER KINETIC TYPOGRAPHY SAFE ZONE */}
      <div
        style={{
          position: "absolute",
          left: 65,
          right: 65,
          bottom: 175,
          height: 180,
          padding: "22px 18px",
          display: "flex",
          alignItems: "center",
          background:
            "linear-gradient(180deg,#080d0c00,#080d0cdd 28%,#080d0cee)",
          borderBottom: `2px solid ${accent}88`,
          boxSizing: "border-box",
        }}
      >
        <AudioSyncedTypography
          words={prabowoWords}
          globalStartFrame={start}
          accent={accent}
        />
      </div>

      {/* CHAPTER PROGRESS */}
      <div
        style={{
          position: "absolute",
          left: 75,
          right: 75,
          bottom: 95,
          height: 3,
          background: "#ffffff35",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${(frame / duration) * 100}%`,
            background: accent,
            boxShadow: `0 0 15px ${accent}`,
          }}
        />
      </div>

      {/* CINEMATIC EXIT */}
      <AbsoluteFill
        style={{
          background: C.dark,
          opacity: outro,
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};


export const FullNarrative: React.FC = () => {
  let cursor = 0;

  const sequences = project.scenes.map((scene,index)=>{
    const from = cursor;
    cursor += scene.durationFrames;

    return (
      <Sequence
        key={index}
        from={from}
        durationInFrames={scene.durationFrames}
      >
        <Chapter
  data={scene}
  index={index}
  start={from}
  duration={scene.durationFrames}
/>
      </Sequence>
    );
  });

  return (
    <AbsoluteFill style={{background:C.dark}}>
      {sequences}
      <Audio src={staticFile(project.voiceoverSrc)} volume={1}/>
    </AbsoluteFill>
  );
};
