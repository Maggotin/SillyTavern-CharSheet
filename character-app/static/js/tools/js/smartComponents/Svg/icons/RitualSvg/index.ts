import { asDarkSvg } from "../../hocs/asDarkSvg";
import { asGraySvg } from "../../hocs/asGraySvg";
import { asLightSvg } from "../../hocs/asLightSvg";
import RitualSvg from "./RitualSvg";

const LightRitualSvg = asLightSvg(RitualSvg);
const DarkRitualSvg = asDarkSvg(RitualSvg);
const GrayRitualSvg = asGraySvg(RitualSvg);

export default RitualSvg;
export { RitualSvg, LightRitualSvg, DarkRitualSvg, GrayRitualSvg };
