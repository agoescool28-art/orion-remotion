
import React from "react";
import { Composition } from "remotion";
import { MyComponent } from "./Composition";
import { project } from "./project";
import { NarrativeVisualPrototype } from "./NarrativeVisualPrototype";
import { FullNarrative } from "./FullNarrative";

export const RemotionRoot: React.FC = () => {
  const durationInFrames = project.scenes.reduce(
    (total, scene) => total + scene.durationFrames,
    0
  );

  return (
    <>
      <Composition
        id="MyComp"
        component={MyComponent}
        durationInFrames={durationInFrames}
        fps={project.fps}
        width={project.width}
        height={project.height}
      />

      <Composition
        id="ORION-V5-PROTOTYPE"
        component={NarrativeVisualPrototype}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
      />

      <Composition
        id="ORION-FULL-NARRATIVE"
        component={FullNarrative}
        durationInFrames={durationInFrames}
        fps={project.fps}
        width={project.width}
        height={project.height}
      />
    </>
  );
};
