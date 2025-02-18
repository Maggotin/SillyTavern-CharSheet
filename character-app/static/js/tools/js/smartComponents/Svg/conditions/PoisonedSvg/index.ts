import { asDarkSvg } from "../../hocs/asDarkSvg";
import { asGraySvg } from "../../hocs/asGraySvg";
import { asLightSvg } from "../../hocs/asLightSvg";
import PoisonedSvg from "./PoisonedSvg";

const LightPoisonedSvg = asLightSvg(PoisonedSvg);
const DarkPoisonedSvg = asDarkSvg(PoisonedSvg);
const GrayPoisonedSvg = asGraySvg(PoisonedSvg);

export default PoisonedSvg;
export { PoisonedSvg, LightPoisonedSvg, DarkPoisonedSvg, GrayPoisonedSvg };
