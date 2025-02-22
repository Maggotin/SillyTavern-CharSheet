import { asDarkSvg } from "../../hocs/asDarkSvg";
import { asGraySvg } from "../../hocs/asGraySvg";
import { asLightSvg } from "../../hocs/asLightSvg";
import RadiantSvg from "./RadiantSvg";

const LightRadiantSvg = asLightSvg(RadiantSvg);
const DarkRadiantSvg = asDarkSvg(RadiantSvg);
const GrayRadiantSvg = asGraySvg(RadiantSvg);

export default RadiantSvg;
export { RadiantSvg, LightRadiantSvg, DarkRadiantSvg, GrayRadiantSvg };
