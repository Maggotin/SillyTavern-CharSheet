import { asLightSvg, asDarkSvg } from "../../hocs";
import { asGraySvg } from "../../hocs/asGraySvg";
import AttunementSvg from "./AttunementSvg";

const LightAttunementSvg = asLightSvg(AttunementSvg);
const DarkAttunementSvg = asDarkSvg(AttunementSvg);
const GrayAttunementSvg = asGraySvg(AttunementSvg);

export default AttunementSvg;
export {
  AttunementSvg,
  LightAttunementSvg,
  DarkAttunementSvg,
  GrayAttunementSvg,
};
