import { asDarkSvg } from "../../hocs/asDarkSvg";
import { asGraySvg } from "../../hocs/asGraySvg";
import { asLightSvg } from "../../hocs/asLightSvg";
import IncapacitatedSvg from "./IncapacitatedSvg";

const LightIncapacitatedSvg = asLightSvg(IncapacitatedSvg);
const DarkIncapacitatedSvg = asDarkSvg(IncapacitatedSvg);
const GrayIncapacitatedSvg = asGraySvg(IncapacitatedSvg);

export default IncapacitatedSvg;
export {
  IncapacitatedSvg,
  LightIncapacitatedSvg,
  DarkIncapacitatedSvg,
  GrayIncapacitatedSvg,
};
