import { asDarkSvg } from "../../hocs/asDarkSvg";
import { asGraySvg } from "../../hocs/asGraySvg";
import { asLightSvg } from "../../hocs/asLightSvg";
import UnconsciousSvg from "./UnconsciousSvg";

const LightUnconsciousSvg = asLightSvg(UnconsciousSvg);
const DarkUnconsciousSvg = asDarkSvg(UnconsciousSvg);
const GrayUnconsciousSvg = asGraySvg(UnconsciousSvg);

export default UnconsciousSvg;
export {
  UnconsciousSvg,
  LightUnconsciousSvg,
  DarkUnconsciousSvg,
  GrayUnconsciousSvg,
};
