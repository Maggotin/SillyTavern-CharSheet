import { asDarkSvg } from "../../hocs/asDarkSvg";
import { asGraySvg } from "../../hocs/asGraySvg";
import { asLightSvg } from "../../hocs/asLightSvg";
import ProneSvg from "./ProneSvg";

const LightProneSvg = asLightSvg(ProneSvg);
const DarkProneSvg = asDarkSvg(ProneSvg);
const GrayProneSvg = asGraySvg(ProneSvg);

export default ProneSvg;
export { ProneSvg, LightProneSvg, DarkProneSvg, GrayProneSvg };
