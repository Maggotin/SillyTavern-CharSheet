import { asPositiveSvg, asDarkModePositiveSvg } from "../../hocs";
import ImmunitySvg from "./ImmunitySvg";

const PositiveImmunitySvg = asPositiveSvg(ImmunitySvg);
const DarkModePositiveImmunitySvg = asDarkModePositiveSvg(ImmunitySvg);

export default ImmunitySvg;
export { ImmunitySvg, PositiveImmunitySvg, DarkModePositiveImmunitySvg };
