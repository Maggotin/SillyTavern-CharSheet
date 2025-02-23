import { asDarkSvg } from "../../hocs/asDarkSvg";
import { asGraySvg } from "../../hocs/asGraySvg";
import { asLightSvg } from "../../hocs/asLightSvg";
import PoisonSvg from "./PoisonSvg";

const LightPoisonSvg = asLightSvg(PoisonSvg);
const DarkPoisonSvg = asDarkSvg(PoisonSvg);
const GrayPoisonSvg = asGraySvg(PoisonSvg);

export default PoisonSvg;
export { PoisonSvg, LightPoisonSvg, DarkPoisonSvg, GrayPoisonSvg };
