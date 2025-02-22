import { asDarkSvg } from "../../hocs/asDarkSvg";
import { asGraySvg } from "../../hocs/asGraySvg";
import { asLightSvg } from "../../hocs/asLightSvg";
import ForceSvg from "./ForceSvg";

const LightForceSvg = asLightSvg(ForceSvg);
const DarkForceSvg = asDarkSvg(ForceSvg);
const GrayForceSvg = asGraySvg(ForceSvg);

export default ForceSvg;
export { ForceSvg, LightForceSvg, DarkForceSvg, GrayForceSvg };
