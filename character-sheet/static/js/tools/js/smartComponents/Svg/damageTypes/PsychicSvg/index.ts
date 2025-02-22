import { asDarkSvg } from "../../hocs/asDarkSvg";
import { asGraySvg } from "../../hocs/asGraySvg";
import { asLightSvg } from "../../hocs/asLightSvg";
import PsychicSvg from "./PsychicSvg";

const LightPsychicSvg = asLightSvg(PsychicSvg);
const DarkPsychicSvg = asDarkSvg(PsychicSvg);
const GrayPsychicSvg = asGraySvg(PsychicSvg);

export default PsychicSvg;
export { PsychicSvg, LightPsychicSvg, DarkPsychicSvg, GrayPsychicSvg };
