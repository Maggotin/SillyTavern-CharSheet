import { asDarkSvg } from "../../hocs/asDarkSvg";
import { asGraySvg } from "../../hocs/asGraySvg";
import { asLightSvg } from "../../hocs/asLightSvg";
import DeafenedSvg from "./DeafenedSvg";

const LightDeafenedSvg = asLightSvg(DeafenedSvg);
const DarkDeafenedSvg = asDarkSvg(DeafenedSvg);
const GrayDeafenedSvg = asGraySvg(DeafenedSvg);

export default DeafenedSvg;
export { DeafenedSvg, LightDeafenedSvg, DarkDeafenedSvg, GrayDeafenedSvg };
