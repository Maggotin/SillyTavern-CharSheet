import { asDarkSvg, asLightSvg } from "../../../hocs";
import ActionsSvg from "./ActionsSvg";

const LightActionsSvg = asLightSvg(ActionsSvg);
const DarkActionsSvg = asDarkSvg(ActionsSvg);

export default ActionsSvg;
export { ActionsSvg, LightActionsSvg, DarkActionsSvg };
