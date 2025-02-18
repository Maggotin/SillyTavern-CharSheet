import { asDarkSvg } from "../../hocs/asDarkSvg";
import { asGraySvg } from "../../hocs/asGraySvg";
import { asLightSvg } from "../../hocs/asLightSvg";
import StunnedSvg from "./StunnedSvg";

const LightStunnedSvg = asLightSvg(StunnedSvg);
const DarkStunnedSvg = asDarkSvg(StunnedSvg);
const GrayStunnedSvg = asGraySvg(StunnedSvg);

export default StunnedSvg;
export { StunnedSvg, LightStunnedSvg, DarkStunnedSvg, GrayStunnedSvg };
