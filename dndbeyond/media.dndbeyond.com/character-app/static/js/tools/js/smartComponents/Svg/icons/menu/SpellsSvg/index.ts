import { asDarkSvg, asLightSvg } from "../../../hocs";
import SpellsSvg from "./SpellsSvg";

const LightSpellsSvg = asLightSvg(SpellsSvg);
const DarkSpellsSvg = asDarkSvg(SpellsSvg);

export default SpellsSvg;
export { SpellsSvg, LightSpellsSvg, DarkSpellsSvg };
