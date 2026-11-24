
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

  
  // =====================================================
  // ORION V3.1 — CINEMATIC VISUAL STORYTELLING
  // CHAPTER 01–05 | VISUAL ONLY
  // =====================================================

  // CHAPTER 01 — OPENING / THE LONG JOURNEY
  if (index === 0) {
    const milestones = [
      ["1951", "KELAHIRAN"],
      ["1974", "AKABRI"],
      ["1998", "TITIK BALIK"],
      ["2024", "PRESIDEN"],
    ];

    const lineProgress = progress(frame, 10, 90);

    return (
      <AbsoluteFill>
        <div style={{ position: "absolute", left, right, top: 690 }}>
          <Kicker color={accent}>A LIFE IN FOUR CHAPTERS</Kicker>

          <div style={{
            marginTop: 20,
            fontSize: 75,
            fontWeight: 900,
            lineHeight: 0.95,
            letterSpacing: -3,
            color: C.paper,
            opacity: fade(frame),
            transform: `translateY(${interpolate(
              enter(frame, fps), [0, 1], [55, 0]
            )}px)`,
          }}>
            JALAN
            <br />
            <span style={{ color: accent }}>PANJANG.</span>
          </div>

          <div style={{
            marginTop: 65,
            height: 3,
            background: "#ffffff25",
            position: "relative",
          }}>
            <div style={{
              width: `${lineProgress * 100}%`,
              height: "100%",
              background: accent,
              boxShadow: `0 0 22px ${accent}`,
            }} />
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: 12,
            marginTop: 35,
          }}>
            {milestones.map(([year, label], i) => {
              const reveal = enter(frame, fps, 18 + i * 16);

              return (
                <div key={year} style={{
                  opacity: fade(frame, 18 + i * 16),
                  transform: `translateY(${interpolate(
                    reveal, [0, 1], [45, 0]
                  )}px)`,
                }}>
                  <div style={{
                    width: 13,
                    height: 13,
                    borderRadius: 20,
                    background: accent,
                    boxShadow: `0 0 18px ${accent}`,
                    marginBottom: 18,
                  }} />
                  <div style={{
                    fontSize: 30,
                    fontWeight: 900,
                    color: accent,
                  }}>
                    {year}
                  </div>
                  <div style={{
                    fontSize: 15,
                    color: C.paper,
                    marginTop: 8,
                    letterSpacing: 1,
                  }}>
                    {label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </AbsoluteFill>
    );
  }

  // CHAPTER 02 — BIRTH / JAKARTA
  if (index === 1) {
    const reveal = enter(frame, fps, 8);
    const route = progress(frame, 20, 95);
    const pulse = 1 + Math.sin(frame * 0.09) * 0.12;

    return (
      <AbsoluteFill>
        <div style={{ position: "absolute", left, right, top: 690 }}>
          <Kicker color={accent}>THE BEGINNING</Kicker>

          <div style={{
            display: "flex",
            alignItems: "baseline",
            gap: 18,
            marginTop: 18,
          }}>
            <div style={{
              fontSize: 172,
              fontWeight: 900,
              lineHeight: 0.9,
              color: accent,
              letterSpacing: -8,
              opacity: fade(frame),
              transform: `scale(${0.9 + reveal * 0.1})`,
            }}>
              1951
            </div>
          </div>

          <div style={{
            fontSize: 25,
            fontWeight: 800,
            letterSpacing: 4,
            marginTop: 18,
          }}>
            17 OKTOBER
          </div>

          <div style={{
            position: "relative",
            height: 330,
            marginTop: 45,
            overflow: "hidden",
            borderTop: `1px solid ${accent}55`,
            borderBottom: `1px solid ${accent}55`,
            background: "linear-gradient(145deg,#17231f99,#080d0c55)",
          }}>
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 900 330"
              preserveAspectRatio="none"
            >
              <defs>
                <pattern
                  id="cityGrid"
                  width="55"
                  height="45"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M55 0H0V45"
                    fill="none"
                    stroke={`${accent}25`}
                    strokeWidth="1"
                  />
                </pattern>
              </defs>

              <rect width="900" height="330" fill="url(#cityGrid)" />

              <path
                d="M60 265 L180 225 L290 245 L410 150 L535 190 L680 75 L835 125"
                fill="none"
                stroke={`${accent}55`}
                strokeWidth="3"
              />

              <path
                d="M60 265 L180 225 L290 245 L410 150 L535 190 L680 75 L835 125"
                fill="none"
                stroke={accent}
                strokeWidth="5"
                strokeDasharray="1100"
                strokeDashoffset={1100 * (1 - route)}
              />

              <circle
                cx="680"
                cy="75"
                r={14 * pulse}
                fill={accent}
              />

              <circle
                cx="680"
                cy="75"
                r={48 * pulse}
                fill="none"
                stroke={accent}
                strokeWidth="2"
                opacity=".55"
              />

              <text
                x="535"
                y="155"
                fill={C.paper}
                fontSize="36"
                fontWeight="bold"
              >
                JAKARTA
              </text>

              <text
                x="540"
                y="190"
                fill={accent}
                fontSize="19"
                letterSpacing="4"
              >
                INDONESIA
              </text>
            </svg>

            <div style={{
              position: "absolute",
              left: 20,
              bottom: 15,
              fontSize: 13,
              letterSpacing: 2,
              color: C.muted,
            }}>
              SKEMA LOKASI
            </div>
          </div>

          <div style={{
            marginTop: 25,
            borderLeft: `4px solid ${accent}`,
            paddingLeft: 22,
            opacity: fade(frame, 30),
            transform: `translateX(${interpolate(
              enter(frame, fps, 30), [0, 1], [45, 0]
            )}px)`,
          }}>
            <div style={{
              fontSize: 31,
              fontWeight: 900,
            }}>
              PRABOWO SUBIANTO
            </div>
            <div style={{
              color: C.muted,
              fontSize: 20,
              marginTop: 8,
            }}>
              Lahir di Jakarta, 17 Oktober 1951
            </div>
          </div>
        </div>
      </AbsoluteFill>
    );
  }

  // CHAPTER 03 — FAMILY BACKGROUND
  if (index === 2) {
    const nodeProgress = progress(frame, 10, 65);

    return (
      <AbsoluteFill>
        <div style={{ position: "absolute", left, right, top: 715 }}>
          <Kicker color={accent}>FAMILY & BACKGROUND</Kicker>

          <div style={{
            marginTop: 35,
            position: "relative",
            padding: 30,
            borderTop: `1px solid ${accent}88`,
            borderBottom: `1px solid ${accent}88`,
            background: "linear-gradient(110deg,#17221eaa,#080d0c55)",
          }}>
            <div style={{
              fontSize: 17,
              color: accent,
              letterSpacing: 4,
              fontWeight: 800,
            }}>
              AYAH
            </div>

            <div style={{
              fontSize: 47,
              fontWeight: 900,
              lineHeight: 1,
              marginTop: 20,
            }}>
              SUMITRO
            </div>

            <div style={{
              fontSize: 25,
              color: C.muted,
              marginTop: 10,
            }}>
              DJOJOHADIKUSUMO
            </div>

            <div style={{
              position: "absolute",
              top: 25,
              right: 25,
              fontSize: 60,
              color: `${accent}55`,
              fontWeight: 900,
            }}>
              01
            </div>
          </div>

          <div style={{
            height: 125,
            display: "flex",
            justifyContent: "center",
            position: "relative",
          }}>
            <div style={{
              width: 3,
              height: `${nodeProgress * 100}%`,
              background: accent,
              boxShadow: `0 0 15px ${accent}88`,
            }} />
          </div>

          <div style={{
            display: "flex",
            justifyContent: "center",
            marginTop: -5,
          }}>
            <div style={{
              width: 18,
              height: 18,
              borderRadius: 20,
              background: accent,
              boxShadow: `0 0 25px ${accent}`,
              transform: `scale(${0.7 + nodeProgress * 0.3})`,
            }} />
          </div>

          <div style={{
            marginTop: 35,
            padding: 30,
            border: `1px solid ${accent}88`,
            background: "linear-gradient(135deg,#1b2822cc,#080d0cee)",
            opacity: fade(frame, 25),
            transform: `translateY(${interpolate(
              enter(frame, fps, 25), [0, 1], [45, 0]
            )}px)`,
          }}>
            <div style={{
              color: accent,
              fontSize: 17,
              letterSpacing: 4,
              fontWeight: 800,
            }}>
              PUTRA
            </div>

            <div style={{
              fontSize: 43,
              fontWeight: 900,
              marginTop: 18,
            }}>
              PRABOWO
            </div>

            <div style={{
              fontSize: 23,
              color: C.muted,
              marginTop: 8,
            }}>
              SUBIANTO
            </div>
          </div>
        </div>
      </AbsoluteFill>
    );
  }

  // CHAPTER 04 — MILITARY EDUCATION
  if (index === 3) {
    const steps = [
      "PENDIDIKAN MILITER",
      "PEMBENTUKAN DISIPLIN",
      "AKABRI",
    ];

    const pathProgress = progress(frame, 8, 95);

    return (
      <AbsoluteFill>
        <div style={{ position: "absolute", left, right, top: 700 }}>
          <Kicker color={accent}>MILITARY EDUCATION</Kicker>

          <div style={{
            fontSize: 128,
            fontWeight: 900,
            lineHeight: 0.95,
            color: C.paper,
            marginTop: 20,
            letterSpacing: -5,
          }}>
            AKABRI
          </div>

          <div style={{
            fontSize: 18,
            color: C.muted,
            letterSpacing: 3,
            marginTop: 12,
          }}>
            PERJALANAN PENDIDIKAN
          </div>

          <div style={{
            position: "relative",
            marginTop: 55,
            paddingLeft: 42,
          }}>
            <div style={{
              position: "absolute",
              left: 8,
              top: 8,
              bottom: 8,
              width: 3,
              background: "#ffffff22",
            }} />

            <div style={{
              position: "absolute",
              left: 8,
              top: 8,
              width: 3,
              height: `${pathProgress * 100}%`,
              background: accent,
              boxShadow: `0 0 18px ${accent}`,
            }} />

            {steps.map((step, i) => {
              const delay = 12 + i * 20;
              const reveal = enter(frame, fps, delay);

              return (
                <div key={step} style={{
                  position: "relative",
                  marginBottom: 42,
                  opacity: fade(frame, delay),
                  transform: `translateX(${interpolate(
                    reveal, [0, 1], [45, 0]
                  )}px)`,
                }}>
                  <div style={{
                    position: "absolute",
                    left: -41,
                    top: 5,
                    width: 18,
                    height: 18,
                    borderRadius: 20,
                    background: accent,
                    boxShadow: `0 0 18px ${accent}`,
                  }} />

                  <div style={{
                    color: accent,
                    fontSize: 15,
                    letterSpacing: 3,
                    fontWeight: 800,
                  }}>
                    TAHAP 0{i + 1}
                  </div>

                  <div style={{
                    fontSize: 26,
                    fontWeight: 900,
                    marginTop: 10,
                  }}>
                    {step}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{
            marginTop: 25,
            padding: 28,
            borderLeft: `5px solid ${accent}`,
            background: "linear-gradient(90deg,#1c2922cc,#080d0c55)",
            opacity: fade(frame, 55),
            transform: `translateY(${interpolate(
              enter(frame, fps, 55), [0, 1], [35, 0]
            )}px)`,
          }}>
            <div style={{
              fontSize: 76,
              fontWeight: 900,
              color: accent,
            }}>
              1974
            </div>
            <div style={{
              fontSize: 21,
              fontWeight: 800,
              marginTop: 8,
            }}>
              LULUS AKADEMI ANGKATAN BERSENJATA
            </div>
          </div>
        </div>
      </AbsoluteFill>
    );
  }

  // CHAPTER 05 — KOPASSUS
  if (index === 4) {
    const stages = [
      ["01", "ANGKATAN DARAT"],
      ["02", "PASUKAN KHUSUS"],
      ["03", "KOPASSUS"],
    ];

    const reveal = progress(frame, 8, 90);

    return (
      <AbsoluteFill>
        <div style={{ position: "absolute", left, right, top: 710 }}>
          <Kicker color={accent}>MILITARY CAREER</Kicker>

          <div style={{
            fontSize: 105,
            fontWeight: 900,
            lineHeight: 0.95,
            letterSpacing: -4,
            color: accent,
            marginTop: 20,
          }}>
            KOPASSUS
          </div>

          <div style={{
            position: "relative",
            height: 300,
            marginTop: 35,
            overflow: "hidden",
            borderTop: `1px solid ${accent}66`,
            borderBottom: `1px solid ${accent}66`,
            background: "linear-gradient(145deg,#1a2722aa,#080d0c88)",
          }}>
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 900 300"
              preserveAspectRatio="none"
            >
              <path
                d="M0 230 L180 170 L330 205 L490 105 L650 145 L900 45"
                fill="none"
                stroke={`${accent}35`}
                strokeWidth="2"
              />

              <path
                d="M0 265 L180 205 L330 240 L490 140 L650 180 L900 80"
                fill="none"
                stroke={`${accent}25`}
                strokeWidth="2"
              />

              <path
                d="M0 230 L180 170 L330 205 L490 105 L650 145 L900 45"
                fill="none"
                stroke={accent}
                strokeWidth="4"
                strokeDasharray="1100"
                strokeDashoffset={1100 * (1 - reveal)}
              />

              <circle
                cx={490}
                cy={105}
                r={12 + Math.sin(frame * 0.1) * 3}
                fill={accent}
              />

              <circle
                cx={490}
                cy={105}
                r="35"
                fill="none"
                stroke={accent}
                strokeWidth="2"
                opacity=".6"
              />
            </svg>

            <div style={{
              position: "absolute",
              left: 25,
              bottom: 20,
              fontSize: 14,
              letterSpacing: 3,
              color: C.muted,
            }}>
              VISUALISASI SIMBOLIS
            </div>
          </div>

          <div style={{
            marginTop: 40,
            position: "relative",
            paddingLeft: 35,
          }}>
            <div style={{
              position: "absolute",
              left: 8,
              top: 12,
              bottom: 12,
              width: 3,
              background: `${accent}55`,
            }} />

            {stages.map(([number, title], i) => {
              const delay = 12 + i * 20;
              const revealStage = enter(frame, fps, delay);

              return (
                <div key={number} style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  gap: 24,
                  marginBottom: 30,
                  opacity: fade(frame, delay),
                  transform: `translateX(${interpolate(
                    revealStage, [0, 1], [55, 0]
                  )}px)`,
                }}>
                  <div style={{
                    position: "absolute",
                    left: -34,
                    width: 13,
                    height: 13,
                    borderRadius: 20,
                    background: accent,
                    boxShadow: `0 0 15px ${accent}`,
                  }} />

                  <div style={{
                    fontSize: 37,
                    fontWeight: 900,
                    color: accent,
                    minWidth: 55,
                  }}>
                    {number}
                  </div>

                  <div style={{
                    fontSize: 25,
                    fontWeight: 900,
                    letterSpacing: 1,
                  }}>
                    {title}
                  </div>
                </div>
              );
            })}
          </div>
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
