import { asDarkSvg } from "../../hocs/asDarkSvg";
import { asGraySvg } from "../../hocs/asGraySvg";
import { asLightSvg } from "../../hocs/asLightSvg";
import AcidSvg from "./AcidSvg";

const LightAcidSvg = asLightSvg(AcidSvg);
const DarkAcidSvg = asDarkSvg(AcidSvg);
const GrayAcidSvg = asGraySvg(AcidSvg);

export default AcidSvg;
export { AcidSvg, LightAcidSvg, DarkAcidSvg, GrayAcidSvg };
