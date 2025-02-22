import { asDarkModePositiveSvg, asPositiveSvg } from "../../hocs";
import AdvantageSvg from "./AdvantageSvg";

const PositiveAdvantageSvg = asPositiveSvg(AdvantageSvg);
const DarkModePositiveAdvantageSvg = asDarkModePositiveSvg(AdvantageSvg);

export default AdvantageSvg;
export { AdvantageSvg, PositiveAdvantageSvg, DarkModePositiveAdvantageSvg };
