import { asDarkSvg } from "../../hocs/asDarkSvg";
import { asGraySvg } from "../../hocs/asGraySvg";
import { asLightSvg } from "../../hocs/asLightSvg";
import CubeSvg from "./CubeSvg";

const LightCubeSvg = asLightSvg(CubeSvg);
const DarkCubeSvg = asDarkSvg(CubeSvg);
const GrayCubeSvg = asGraySvg(CubeSvg);

export default CubeSvg;
export { CubeSvg, LightCubeSvg, DarkCubeSvg, GrayCubeSvg };
