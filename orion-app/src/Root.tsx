
import React from "react";
import { Composition } from "remotion";
import { MyComponent } from "./Composition";
import { orionTemplate } from "./orionTemplate";

export const RemotionRoot: React.FC = () => {
  const fps = orionTemplate.fps;
  const durationInFrames =
    orionTemplate.scenes *
    orionTemplate.sceneDurationSeconds *
    fps;

  return (
    <Composition
      id="MyComp"
      component={MyComponent}
      durationInFrames={durationInFrames}
      fps={fps}
      width={orionTemplate.width}
      height={orionTemplate.height}
      defaultProps={{
        voiceoverSrc: "dua toko.mp3",
      }}
    />
  );
};
