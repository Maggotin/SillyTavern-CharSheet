import { asDarkSvg } from "../../hocs/asDarkSvg";
import { asGraySvg } from "../../hocs/asGraySvg";
import { asLightSvg } from "../../hocs/asLightSvg";
import SquareSvg from "./SquareSvg";

const LightSquareSvg = asLightSvg(SquareSvg);
const DarkSquareSvg = asDarkSvg(SquareSvg);
const GraySquareSvg = asGraySvg(SquareSvg);

export default SquareSvg;
export { SquareSvg, LightSquareSvg, DarkSquareSvg, GraySquareSvg };
