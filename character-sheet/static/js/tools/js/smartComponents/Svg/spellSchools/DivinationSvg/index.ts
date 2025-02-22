import { asDarkSvg } from "../../hocs/asDarkSvg";
import { asGraySvg } from "../../hocs/asGraySvg";
import { asLightSvg } from "../../hocs/asLightSvg";
import DivinationSvg from "./DivinationSvg";

const LightDivinationSvg = asLightSvg(DivinationSvg);
const DarkDivinationSvg = asDarkSvg(DivinationSvg);
const GrayDivinationSvg = asGraySvg(DivinationSvg);

export default DivinationSvg;
export {
  DivinationSvg,
  LightDivinationSvg,
  DarkDivinationSvg,
  GrayDivinationSvg,
};
