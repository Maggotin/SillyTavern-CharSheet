import { asDarkSvg, asDisabledSvg, asLightSvg } from "../../hocs";
import LockSvg from "./LockSvg";

const LightLockSvg = asLightSvg(LockSvg);
const DarkLockSvg = asDarkSvg(LockSvg);
const DisabledLockSvg = asDisabledSvg(LockSvg);

export default LockSvg;
export { LockSvg, LightLockSvg, DarkLockSvg, DisabledLockSvg };
