
import React from "react";
import { Composition } from "remotion";
import { MyComponent } from "./Composition";
import { project } from "./project";

export const RemotionRoot: React.FC = () => {
  const durationInFrames =
    project.scenes.length *
    project.sceneDurationSeconds *
    project.fps;

  return (
    <Composition
      id="MyComp"
      component={MyComponent}
      durationInFrames={durationInFrames}
      fps={project.fps}
      width={project.width}
      height={project.height}
    />
  );
};
