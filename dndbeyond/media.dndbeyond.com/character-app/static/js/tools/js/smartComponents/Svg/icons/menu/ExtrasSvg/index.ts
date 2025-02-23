import { asDarkSvg, asLightSvg } from "../../../hocs";
import ExtrasSvg from "./ExtrasSvg";

const LightExtrasSvg = asLightSvg(ExtrasSvg);
const DarkExtrasSvg = asDarkSvg(ExtrasSvg);

export default ExtrasSvg;
export { ExtrasSvg, LightExtrasSvg, DarkExtrasSvg };
