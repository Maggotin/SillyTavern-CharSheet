import { asLightSvg, asThemedSvg } from "../../hocs";
import FrameSvg from "./FrameSvg";

const LightFrameSvg = asLightSvg(FrameSvg);
const ThemedFrameSvg = asThemedSvg(FrameSvg);

export default FrameSvg;
export { FrameSvg, LightFrameSvg, ThemedFrameSvg };
