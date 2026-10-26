
import { Composition } from "remotion";
import { MyComponent } from "./Composition";
import {
  COMPOSITION_DURATION_IN_FRAMES,
  ORION_TEMPLATE,
} from "./orionTemplate";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="MyComp"
      component={MyComponent}
      durationInFrames={COMPOSITION_DURATION_IN_FRAMES}
      fps={ORION_TEMPLATE.fps}
      width={ORION_TEMPLATE.width}
      height={ORION_TEMPLATE.height}
    />
  );
};
