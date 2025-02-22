import { asLightSvg, asThemedSvg } from "../../hocs";
import LongRestSvg from "./LongRestSvg";

const LightLongRestSvg = asLightSvg(LongRestSvg);
const ThemedLongRestSvg = asThemedSvg(LongRestSvg);

export default LongRestSvg;
export { LongRestSvg, LightLongRestSvg, ThemedLongRestSvg };
