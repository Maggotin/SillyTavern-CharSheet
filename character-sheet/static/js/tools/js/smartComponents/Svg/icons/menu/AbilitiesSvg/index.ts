import { asDarkSvg, asLightSvg } from "../../../hocs";
import AbilitiesSvg from "./AbilitiesSvg";

const LightAbilitiesSvg = asLightSvg(AbilitiesSvg);
const DarkAbilitiesSvg = asDarkSvg(AbilitiesSvg);

export default AbilitiesSvg;
export { AbilitiesSvg, LightAbilitiesSvg, DarkAbilitiesSvg };
