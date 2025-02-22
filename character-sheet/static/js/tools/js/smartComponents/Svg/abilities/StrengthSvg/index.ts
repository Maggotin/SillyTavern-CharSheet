import { asDarkSvg, asLightSvg } from "../../hocs";
import StrengthSvg from "./StrengthSvg";

const LightStrengthSvg = asLightSvg(StrengthSvg);
const DarkStrengthSvg = asDarkSvg(StrengthSvg);

export default StrengthSvg;
export { StrengthSvg, LightStrengthSvg, DarkStrengthSvg };
