import { asLightSvg, asThemedSvg } from "../../hocs";
import ShortRestSvg from "./ShortRestSvg";

const LightShortRestSvg = asLightSvg(ShortRestSvg);
const ThemedShortRestSvg = asThemedSvg(ShortRestSvg);

export default ShortRestSvg;
export { ShortRestSvg, LightShortRestSvg, ThemedShortRestSvg };
