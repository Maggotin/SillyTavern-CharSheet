import { asDarkSvg } from "../../hocs/asDarkSvg";
import { asGraySvg } from "../../hocs/asGraySvg";
import { asLightSvg } from "../../hocs/asLightSvg";
import PiercingSvg from "./PiercingSvg";

const LightPiercingSvg = asLightSvg(PiercingSvg);
const DarkPiercingSvg = asDarkSvg(PiercingSvg);
const GrayPiercingSvg = asGraySvg(PiercingSvg);

export default PiercingSvg;
export { PiercingSvg, LightPiercingSvg, DarkPiercingSvg, GrayPiercingSvg };
