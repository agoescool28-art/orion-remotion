
import React from "react";
import { Composition } from "remotion";
import { MyComponent } from "./Composition";

const FPS = 30;
const DURATION_IN_FRAMES = 3084;

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="MyComp"
      component={MyComponent}
      durationInFrames={DURATION_IN_FRAMES}
      fps={FPS}
      width={1080}
      height={1920}
      defaultProps={{
        voiceoverSrc: "dua toko.mp3",
      }}
    />
  );
};
