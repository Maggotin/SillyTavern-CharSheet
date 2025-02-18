import { asDarkSvg, asLightSvg, asPositiveSvg, asThemedSvg } from "../../hocs";
import CloseSvg from "./CloseSvg";

const LightCloseSvg = asLightSvg(CloseSvg);
const DarkCloseSvg = asDarkSvg(CloseSvg);
const ThemedCloseSvg = asThemedSvg(CloseSvg);
const PositiveCloseSvg = asPositiveSvg(CloseSvg);

export default CloseSvg;
export {
  CloseSvg,
  LightCloseSvg,
  ThemedCloseSvg,
  DarkCloseSvg,
  PositiveCloseSvg,
};
