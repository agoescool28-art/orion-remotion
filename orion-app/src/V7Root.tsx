import React from "react";
import { Composition } from "remotion";
import { V7Composition, V7Metadata } from "./V7Composition";

export const V7Root: React.FC = () => (
  <>
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
