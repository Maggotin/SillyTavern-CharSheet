import { asDarkSvg } from "../../hocs/asDarkSvg";
import { asGraySvg } from "../../hocs/asGraySvg";
import { asLightSvg } from "../../hocs/asLightSvg";
import EvocationSvg from "./EvocationSvg";

const LightEvocationSvg = asLightSvg(EvocationSvg);
const DarkEvocationSvg = asDarkSvg(EvocationSvg);
const GrayEvocationSvg = asGraySvg(EvocationSvg);

export default EvocationSvg;
export { EvocationSvg, LightEvocationSvg, DarkEvocationSvg, GrayEvocationSvg };
