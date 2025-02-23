import { asDarkSvg } from "../../hocs/asDarkSvg";
import { asGraySvg } from "../../hocs/asGraySvg";
import { asLightSvg } from "../../hocs/asLightSvg";
import BludgeoningSvg from "./BludgeoningSvg";

const LightBludgeoningSvg = asLightSvg(BludgeoningSvg);
const DarkBludgeoningSvg = asDarkSvg(BludgeoningSvg);
const GrayBludgeoningSvg = asGraySvg(BludgeoningSvg);

export default BludgeoningSvg;
export {
  BludgeoningSvg,
  LightBludgeoningSvg,
  DarkBludgeoningSvg,
  GrayBludgeoningSvg,
};
