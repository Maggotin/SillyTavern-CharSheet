import { asDarkSvg } from "../../hocs/asDarkSvg";
import { asGraySvg } from "../../hocs/asGraySvg";
import { asLightSvg } from "../../hocs/asLightSvg";
import ColdSvg from "./ColdSvg";

const LightColdSvg = asLightSvg(ColdSvg);
const DarkColdSvg = asDarkSvg(ColdSvg);
const GrayColdSvg = asGraySvg(ColdSvg);

export default ColdSvg;
export { ColdSvg, LightColdSvg, DarkColdSvg, GrayColdSvg };
