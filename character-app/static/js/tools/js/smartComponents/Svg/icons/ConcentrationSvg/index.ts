import { asDarkSvg } from "../../hocs/asDarkSvg";
import { asGraySvg } from "../../hocs/asGraySvg";
import { asLightSvg } from "../../hocs/asLightSvg";
import ConcentrationSvg from "./ConcentrationSvg";

const LightConcentrationSvg = asLightSvg(ConcentrationSvg);
const DarkConcentrationSvg = asDarkSvg(ConcentrationSvg);
const GrayConcentrationSvg = asGraySvg(ConcentrationSvg);

export default ConcentrationSvg;
export {
  ConcentrationSvg,
  LightConcentrationSvg,
  DarkConcentrationSvg,
  GrayConcentrationSvg,
};
