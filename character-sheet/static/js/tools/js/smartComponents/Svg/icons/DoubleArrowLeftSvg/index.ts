import { asDarkSvg, asLightSvg } from "../../hocs";
import DoubleArrowLeftSvg from "./DoubleArrowLeftSvg";

const LightDoubleArrowLeftSvg = asLightSvg(DoubleArrowLeftSvg);
const DarkDoubleArrowLeftSvg = asDarkSvg(DoubleArrowLeftSvg);

export default DoubleArrowLeftSvg;
export { DoubleArrowLeftSvg, LightDoubleArrowLeftSvg, DarkDoubleArrowLeftSvg };
