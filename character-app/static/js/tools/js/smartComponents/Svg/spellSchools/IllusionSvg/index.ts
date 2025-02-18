import { asDarkSvg } from "../../hocs/asDarkSvg";
import { asGraySvg } from "../../hocs/asGraySvg";
import { asLightSvg } from "../../hocs/asLightSvg";
import IllusionSvg from "./IllusionSvg";

const LightIllusionSvg = asLightSvg(IllusionSvg);
const DarkIllusionSvg = asDarkSvg(IllusionSvg);
const GrayIllusionSvg = asGraySvg(IllusionSvg);

export default IllusionSvg;
export { IllusionSvg, LightIllusionSvg, DarkIllusionSvg, GrayIllusionSvg };
