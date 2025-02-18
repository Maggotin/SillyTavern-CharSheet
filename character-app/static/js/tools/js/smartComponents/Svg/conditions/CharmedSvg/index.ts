import { asDarkSvg } from "../../hocs/asDarkSvg";
import { asGraySvg } from "../../hocs/asGraySvg";
import { asLightSvg } from "../../hocs/asLightSvg";
import CharmedSvg from "./CharmedSvg";

const LightCharmedSvg = asLightSvg(CharmedSvg);
const DarkCharmedSvg = asDarkSvg(CharmedSvg);
const GrayCharmedSvg = asGraySvg(CharmedSvg);

export default CharmedSvg;
export { CharmedSvg, LightCharmedSvg, DarkCharmedSvg, GrayCharmedSvg };
