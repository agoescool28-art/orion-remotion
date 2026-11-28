import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { v7Project } from "./v7Project";
import { V7StoryScene } from "./V7StoryScene";

const fps = v7Project.fps;
const totalFrames = v7Project.durationSeconds * fps;

export const V7Composition: React.FC = () => {
  return <AbsoluteFill style={{background:"#111A17"}}>
    {v7Project.scenes.map((scene,index)=>(
      <Sequence key={scene.id} from={scene.start*fps} durationInFrames={scene.duration*fps}>
        <V7StoryScene scene={scene} index={index}/>
      </Sequence>
    ))}
    {v7Project.voiceoverSrc ? <Audio src={staticFile(v7Project.voiceoverSrc)} volume={1}/> : null}
    {v7Project.musicSrc ? <Audio src={staticFile(v7Project.musicSrc)} volume={0.13}/> : null}
  </AbsoluteFill>;
};

export const V7Metadata = {
  id:"ORION-V7-ADAB-BERTETANGGA",
  durationInFrames:totalFrames,
  fps,
  width:v7Project.width,
  height:v7Project.height,
};
