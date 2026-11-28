
import React from "react";
import { Composition } from "remotion";

import { project } from "./project";
import { FullNarrative } from "./FullNarrative";

import {
  V7Composition,
  V7Metadata,
} from "./V7Composition";

const TOTAL_FRAMES = project.scenes.reduce(
  (total, scene) => total + scene.durationFrames,
  0
);

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* ORIGINAL ORION ENGINE */}
      <Composition
        id="ORION-FULL-NARRATIVE"
        component={FullNarrative}
        durationInFrames={TOTAL_FRAMES}
        fps={project.fps}
        width={project.width}
        height={project.height}
      />

      {/* ORION V7 STORYTELLING ENGINE */}
      <Composition
        id={V7Metadata.id}
        component={V7Composition}
        durationInFrames={V7Metadata.durationInFrames}
        fps={V7Metadata.fps}
        width={V7Metadata.width}
        height={V7Metadata.height}
      />
    </>
  );
};
