import { asDarkSvg } from "../../hocs/asDarkSvg";
import { asGraySvg } from "../../hocs/asGraySvg";
import { asLightSvg } from "../../hocs/asLightSvg";
import FireSvg from "./FireSvg";

const LightFireSvg = asLightSvg(FireSvg);
const DarkFireSvg = asDarkSvg(FireSvg);
const GrayFireSvg = asGraySvg(FireSvg);

export default FireSvg;
export { FireSvg, LightFireSvg, DarkFireSvg, GrayFireSvg };
