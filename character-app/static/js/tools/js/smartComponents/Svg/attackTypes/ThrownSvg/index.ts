import { asDarkSvg } from "../../hocs/asDarkSvg";
import { asGraySvg } from "../../hocs/asGraySvg";
import { asLightSvg } from "../../hocs/asLightSvg";
import ThrownSvg from "./ThrownSvg";

const LightThrownSvg = asLightSvg(ThrownSvg);
const DarkThrownSvg = asDarkSvg(ThrownSvg);
const GrayThrownSvg = asGraySvg(ThrownSvg);

export default ThrownSvg;
export { ThrownSvg, LightThrownSvg, DarkThrownSvg, GrayThrownSvg };
