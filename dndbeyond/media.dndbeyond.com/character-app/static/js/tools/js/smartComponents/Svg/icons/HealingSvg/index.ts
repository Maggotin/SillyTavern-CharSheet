import { asLightSvg, asDarkSvg } from "../../hocs";
import { asGraySvg } from "../../hocs/asGraySvg";
import HealingSvg from "./HealingSvg";

const LightHealingSvg = asLightSvg(HealingSvg);
const DarkHealingSvg = asDarkSvg(HealingSvg);
const GrayHealingSvg = asGraySvg(HealingSvg);

export default HealingSvg;
export { HealingSvg, LightHealingSvg, DarkHealingSvg, GrayHealingSvg };
