import { asDarkSvg } from "../../hocs/asDarkSvg";
import { asGraySvg } from "../../hocs/asGraySvg";
import { asLightSvg } from "../../hocs/asLightSvg";
import ParalyzedSvg from "./ParalyzedSvg";

const LightParalyzedSvg = asLightSvg(ParalyzedSvg);
const DarkParalyzedSvg = asDarkSvg(ParalyzedSvg);
const GrayParalyzedSvg = asGraySvg(ParalyzedSvg);

export default ParalyzedSvg;
export { ParalyzedSvg, LightParalyzedSvg, DarkParalyzedSvg, GrayParalyzedSvg };
