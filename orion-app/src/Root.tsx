
import React from "react";
import {Composition} from "remotion";
import {project} from "./project";
import {FullNarrative} from "./FullNarrative";

const TOTAL_FRAMES = project.scenes.reduce(
  (total, scene) => total + scene.durationFrames,
  0
);

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ORION-FULL-NARRATIVE"
        component={FullNarrative}
        durationInFrames={TOTAL_FRAMES}
        fps={project.fps}
        width={project.width}
        height={project.height}
      />
    </>
  );
};
