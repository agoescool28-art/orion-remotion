
import React from "react";
import { Composition } from "remotion";
import { MyComponent } from "./Composition";
import { project } from "./project";
import { NarrativeVisualPrototype } from "./NarrativeVisualPrototype";

export const RemotionRoot: React.FC = () => {
  const durationInFrames =
    project.scenes.length *
    project.sceneDurationSeconds *
    project.fps;

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
        id="ORION_V5_PROTOTYPE"
        component={NarrativeVisualPrototype}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
