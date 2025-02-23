import { asDarkSvg } from "../../hocs/asDarkSvg";
import { asGraySvg } from "../../hocs/asGraySvg";
import { asLightSvg } from "../../hocs/asLightSvg";
import LineSvg from "./LineSvg";

const LightLineSvg = asLightSvg(LineSvg);
const DarkLineSvg = asDarkSvg(LineSvg);
const GrayLineSvg = asGraySvg(LineSvg);

export default LineSvg;
export { LineSvg, LightLineSvg, DarkLineSvg, GrayLineSvg };
