import { asDarkSvg, asDisabledSvg, asLightSvg } from "../../hocs";
import UnlockSvg from "./UnlockSvg";

const LightUnlockSvg = asLightSvg(UnlockSvg);
const DarkUnlockSvg = asDarkSvg(UnlockSvg);
const DisabledUnlockSvg = asDisabledSvg(UnlockSvg);

export default UnlockSvg;
export { UnlockSvg, LightUnlockSvg, DarkUnlockSvg, DisabledUnlockSvg };
