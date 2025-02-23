import { asDarkSvg } from "../../hocs/asDarkSvg";
import { asGraySvg } from "../../hocs/asGraySvg";
import { asLightSvg } from "../../hocs/asLightSvg";
import RestrainedSvg from "./RestrainedSvg";

const LightRestrainedSvg = asLightSvg(RestrainedSvg);
const DarkRestrainedSvg = asDarkSvg(RestrainedSvg);
const GrayRestrainedSvg = asGraySvg(RestrainedSvg);

export default RestrainedSvg;
export {
  RestrainedSvg,
  LightRestrainedSvg,
  DarkRestrainedSvg,
  GrayRestrainedSvg,
};
