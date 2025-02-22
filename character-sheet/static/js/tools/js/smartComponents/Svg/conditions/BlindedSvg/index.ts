import { asDarkSvg } from "../../hocs/asDarkSvg";
import { asGraySvg } from "../../hocs/asGraySvg";
import { asLightSvg } from "../../hocs/asLightSvg";
import BlindedSvg from "./BlindedSvg";

const LightBlindedSvg = asLightSvg(BlindedSvg);
const DarkBlindedSvg = asDarkSvg(BlindedSvg);
const GrayBlindedSvg = asGraySvg(BlindedSvg);

export default BlindedSvg;
export { BlindedSvg, LightBlindedSvg, DarkBlindedSvg, GrayBlindedSvg };
