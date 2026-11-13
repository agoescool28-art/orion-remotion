
import React from "react";
import { Composition } from "remotion";

import { ToyotaWay } from "./ToyotaWay";
import { EvolusiOtomotif } from "./EvolusiOtomotif";
import { StyleframeAkal } from "./StyleframeAkal";
import { StyleframeAkalV35 } from "./StyleframeAkalV35";
import { StyleframeAkalV36 } from "./StyleframeAkalV36";
import { StyleframeAkalV37 } from "./StyleframeAkalV37";
import { StyleframeAkalV38 } from "./StyleframeAkalV38";
import { StyleframeAkalV39 } from "./StyleframeAkalV39";
import { StyleframeAkalV391 } from "./StyleframeAkalV391";
import { StyleframeAkalV392 } from "./StyleframeAkalV392";
import { StyleframeAkalV393 } from "./StyleframeAkalV393";
import { StyleframeAkalV394 } from "./StyleframeAkalV394";
import { OrionV40 } from "./OrionV40";
import { OrionV50 } from "./OrionV50";
import { OrionV60 } from "./OrionV60";
import { OrionV61 } from "./OrionV61";
import { OrionV62 } from "./OrionV62";
import { OrionV70 } from "./OrionV70";
import { OrionV70MotionTest } from "./OrionV70MotionTest";
import {
  OrionV70MotionTestRevision3
} from "./OrionV70MotionTest-REVISION3";
import { DynamicMotionVideo } from "./DynamicMotionVideo";
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ToyotaWay"
        component={ToyotaWay}
        durationInFrames={1440}
        fps={30}
        width={1080}
        height={1920}
      />

      <Composition
        id="EvolusiOtomotif"
        component={EvolusiOtomotif}
        durationInFrames={1440}
        fps={30}
        width={1080}
        height={1920}
      />

      <Composition
        id="StyleframeAkal"
        component={StyleframeAkal}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1920}
      />

      <Composition
        id="StyleframeAkalV35"
        component={StyleframeAkalV35}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1920}
      />

      <Composition
        id="StyleframeAkalV36"
        component={StyleframeAkalV36}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1920}
      /><Composition
  id="StyleframeAkalV37"
  component={StyleframeAkalV37}
  durationInFrames={606}
  fps={30}
  width={1080}
  height={1920}
/>
<Composition
  id="StyleframeAkalV38"
  component={StyleframeAkalV38}
  durationInFrames={606}
  fps={30}
  width={1080}
  height={1920}
/>
<Composition
  id="StyleframeAkalV39"
  component={StyleframeAkalV39}
  durationInFrames={240}
  fps={30}
  width={1080}
  height={1920}
/>
<Composition
  id="StyleframeAkalV391"
  component={StyleframeAkalV391}
  durationInFrames={300}
  fps={30}
  width={1080}
  height={1920}
/>
<Composition
  id="StyleframeAkalV392"
  component={StyleframeAkalV392}
  durationInFrames={300}
  fps={30}
  width={1080}
  height={1920}
/>
<Composition
  id="StyleframeAkalV393"
  component={StyleframeAkalV393}
  durationInFrames={300}
  fps={30}
  width={1080}
  height={1920}
/>
<Composition
  id="StyleframeAkalV394"
  component={StyleframeAkalV394}
  durationInFrames={300}
  fps={30}
  width={1080}
  height={1920}
/>
<Composition
  id="OrionV40"
  component={OrionV40}
  durationInFrames={2237}
  fps={30}
  width={1080}
  height={1920}
/>
<Composition
  id="OrionV50"
  component={OrionV50}
  durationInFrames={2237}
  fps={30}
  width={1080}
  height={1920}
/>
<Composition
  id="OrionV60"
  component={OrionV60}
  durationInFrames={2237}
  fps={30}
  width={1080}
  height={1920}
/>
<Composition
  id="OrionV61"
  component={OrionV61}
  durationInFrames={360}
  fps={30}
  width={1080}
  height={1920}
/>
<Composition
  id="OrionV62"
  component={OrionV62}
  durationInFrames={360}
  fps={30}
  width={1080}
  height={1920}
/>
<Composition
  id="OrionV70"
  component={OrionV70}
  durationInFrames={2820}
  fps={30}
  width={1080}
  height={1920}
/>
<Composition
  id="OrionV70MotionTest"
  component={OrionV70MotionTest}
  durationInFrames={960}
  fps={30}
  width={1080}
  height={1920}
/>
<Composition
  id="OrionV70MotionTestRevision3"
  component={OrionV70MotionTestRevision3}
  durationInFrames={960}
  fps={30}
  width={1080}
  height={1920}
/>
<Composition
  id="DynamicMotionVideo"
  component={DynamicMotionVideo}
  durationInFrames={1800}
  fps={30}
  width={1080}
  height={1920}
  calculateMetadata={({ props }) => {
  return {
  durationInFrames: (props as any)?.durationInFrames || 1800,
  };
    }}
      />
    </>
  );
};
