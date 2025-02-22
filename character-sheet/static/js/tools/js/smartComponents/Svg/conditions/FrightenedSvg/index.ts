import { asDarkSvg } from "../../hocs/asDarkSvg";
import { asGraySvg } from "../../hocs/asGraySvg";
import { asLightSvg } from "../../hocs/asLightSvg";
import FrightenedSvg from "./FrightenedSvg";

const LightFrightenedSvg = asLightSvg(FrightenedSvg);
const DarkFrightenedSvg = asDarkSvg(FrightenedSvg);
const GrayFrightenedSvg = asGraySvg(FrightenedSvg);

export default FrightenedSvg;
export {
  FrightenedSvg,
  LightFrightenedSvg,
  DarkFrightenedSvg,
  GrayFrightenedSvg,
};
