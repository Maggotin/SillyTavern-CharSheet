import { asDarkSvg } from "../../hocs/asDarkSvg";
import { asGraySvg } from "../../hocs/asGraySvg";
import { asLightSvg } from "../../hocs/asLightSvg";
import LightningSvg from "./LightningSvg";

const LightLightningSvg = asLightSvg(LightningSvg);
const DarkLightningSvg = asDarkSvg(LightningSvg);
const GrayLightningSvg = asGraySvg(LightningSvg);

export default LightningSvg;
export { LightningSvg, LightLightningSvg, DarkLightningSvg, GrayLightningSvg };
