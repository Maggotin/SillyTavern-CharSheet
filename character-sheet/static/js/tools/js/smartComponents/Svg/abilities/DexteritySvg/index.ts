import { asDarkSvg, asLightSvg } from "../../hocs";
import DexteritySvg from "./DexteritySvg";

const LightDexteritySvg = asLightSvg(DexteritySvg);
const DarkDexteritySvg = asDarkSvg(DexteritySvg);

export default DexteritySvg;
export { DexteritySvg, LightDexteritySvg, DarkDexteritySvg };
