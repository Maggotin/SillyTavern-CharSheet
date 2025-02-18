import { asDarkSvg } from "../../hocs/asDarkSvg";
import { asGraySvg } from "../../hocs/asGraySvg";
import { asLightSvg } from "../../hocs/asLightSvg";
import PetrifiedSvg from "./PetrifiedSvg";

const LightPetrifiedSvg = asLightSvg(PetrifiedSvg);
const DarkPetrifiedSvg = asDarkSvg(PetrifiedSvg);
const GrayPetrifiedSvg = asGraySvg(PetrifiedSvg);

export default PetrifiedSvg;
export { PetrifiedSvg, LightPetrifiedSvg, DarkPetrifiedSvg, GrayPetrifiedSvg };
