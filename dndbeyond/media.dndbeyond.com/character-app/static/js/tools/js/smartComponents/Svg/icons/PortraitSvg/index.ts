import { asLightSvg, asThemedSvg } from "../../hocs";
import PortraitSvg from "./PortraitSvg";

const LightPortraitSvg = asLightSvg(PortraitSvg);
const ThemedPortraitSvg = asThemedSvg(PortraitSvg);

export default PortraitSvg;
export { PortraitSvg, LightPortraitSvg, ThemedPortraitSvg };
