import { asDarkSvg } from "../../hocs/asDarkSvg";
import { asGraySvg } from "../../hocs/asGraySvg";
import { asLightSvg } from "../../hocs/asLightSvg";
import InvisibleSvg from "./InvisibleSvg";

const LightInvisibleSvg = asLightSvg(InvisibleSvg);
const DarkInvisibleSvg = asDarkSvg(InvisibleSvg);
const GrayInvisibleSvg = asGraySvg(InvisibleSvg);

export default InvisibleSvg;
export { InvisibleSvg, LightInvisibleSvg, DarkInvisibleSvg, GrayInvisibleSvg };
