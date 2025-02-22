import { asDarkSvg } from "../../hocs/asDarkSvg";
import { asGraySvg } from "../../hocs/asGraySvg";
import { asLightSvg } from "../../hocs/asLightSvg";
import NecroticSvg from "./NecroticSvg";

const LightNecroticSvg = asLightSvg(NecroticSvg);
const DarkNecroticSvg = asDarkSvg(NecroticSvg);
const GrayNecroticSvg = asGraySvg(NecroticSvg);

export default NecroticSvg;
export { NecroticSvg, LightNecroticSvg, DarkNecroticSvg, GrayNecroticSvg };
