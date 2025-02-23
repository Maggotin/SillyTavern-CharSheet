import { asDarkSvg, asLightSvg } from "../../hocs";
import IntelligenceSvg from "./IntelligenceSvg";

const LightIntelligenceSvg = asLightSvg(IntelligenceSvg);
const DarkIntelligenceSvg = asDarkSvg(IntelligenceSvg);

export default IntelligenceSvg;
export { IntelligenceSvg, LightIntelligenceSvg, DarkIntelligenceSvg };
