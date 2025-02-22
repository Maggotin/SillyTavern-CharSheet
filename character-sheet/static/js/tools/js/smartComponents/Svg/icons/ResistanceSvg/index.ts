import { asPositiveSvg, asDarkModePositiveSvg } from "../../hocs";
import ResistanceSvg from "./ResistanceSvg";

const PositiveResistanceSvg = asPositiveSvg(ResistanceSvg);
const DarkModePositiveResistanceSvg = asDarkModePositiveSvg(ResistanceSvg);

export default ResistanceSvg;
export { ResistanceSvg, PositiveResistanceSvg, DarkModePositiveResistanceSvg };
