import { asDarkSvg } from "../../hocs/asDarkSvg";
import { asGraySvg } from "../../hocs/asGraySvg";
import { asLightSvg } from "../../hocs/asLightSvg";
import ConeSvg from "./ConeSvg";

const LightConeSvg = asLightSvg(ConeSvg);
const DarkConeSvg = asDarkSvg(ConeSvg);
const GrayConeSvg = asGraySvg(ConeSvg);

export default ConeSvg;
export { ConeSvg, LightConeSvg, DarkConeSvg, GrayConeSvg };
