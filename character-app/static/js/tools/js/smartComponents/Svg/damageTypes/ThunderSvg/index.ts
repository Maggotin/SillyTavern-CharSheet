import { asDarkSvg } from "../../hocs/asDarkSvg";
import { asGraySvg } from "../../hocs/asGraySvg";
import { asLightSvg } from "../../hocs/asLightSvg";
import ThunderSvg from "./ThunderSvg";

const LightThunderSvg = asLightSvg(ThunderSvg);
const DarkThunderSvg = asDarkSvg(ThunderSvg);
const GrayThunderSvg = asGraySvg(ThunderSvg);

export default ThunderSvg;
export { ThunderSvg, LightThunderSvg, DarkThunderSvg, GrayThunderSvg };
