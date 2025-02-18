import { asDarkSvg } from "../../hocs/asDarkSvg";
import { asGraySvg } from "../../hocs/asGraySvg";
import { asLightSvg } from "../../hocs/asLightSvg";
import GrappledSvg from "./GrappledSvg";

const LightGrappledSvg = asLightSvg(GrappledSvg);
const DarkGrappledSvg = asDarkSvg(GrappledSvg);
const GrayGrappledSvg = asGraySvg(GrappledSvg);

export default GrappledSvg;
export { GrappledSvg, LightGrappledSvg, DarkGrappledSvg, GrayGrappledSvg };
