import { asDarkSvg } from "../../hocs/asDarkSvg";
import { asGraySvg } from "../../hocs/asGraySvg";
import { asLightSvg } from "../../hocs/asLightSvg";
import AbjurationSvg from "./AbjurationSvg";

const LightAbjurationSvg = asLightSvg(AbjurationSvg);
const DarkAbjurationSvg = asDarkSvg(AbjurationSvg);
const GrayAbjurationSvg = asGraySvg(AbjurationSvg);

export default AbjurationSvg;
export {
  AbjurationSvg,
  LightAbjurationSvg,
  DarkAbjurationSvg,
  GrayAbjurationSvg,
};
