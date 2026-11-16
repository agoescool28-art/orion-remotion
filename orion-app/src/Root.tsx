
import React from "react";
import { Composition } from "remotion";
import { MyComponent } from "./Composition";
import { orionTemplate } from "./orionTemplate";

const durationInFrames =
  orionTemplate.scenes *
  orionTemplate.sceneDurationSeconds *
  orionTemplate.fps;

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="MyComp"
      component={MyComponent}
      durationInFrames={durationInFrames}
      fps={orionTemplate.fps}
      width={orionTemplate.width}
      height={orionTemplate.height}
      defaultProps={{
        voiceoverSrc: "dua toko.mp3",
      }}
    />
  );
};
