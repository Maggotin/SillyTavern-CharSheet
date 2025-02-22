import { asDarkSvg } from "../../hocs/asDarkSvg";
import { asGraySvg } from "../../hocs/asGraySvg";
import { asLightSvg } from "../../hocs/asLightSvg";
import SphereSvg from "./SphereSvg";

const LightSphereSvg = asLightSvg(SphereSvg);
const DarkSphereSvg = asDarkSvg(SphereSvg);
const GraySphereSvg = asGraySvg(SphereSvg);

export default SphereSvg;
export { SphereSvg, LightSphereSvg, DarkSphereSvg, GraySphereSvg };
