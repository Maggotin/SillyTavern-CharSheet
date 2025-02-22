import { asDarkSvg, asLightSvg, asPositiveSvg, asThemedSvg } from "../../hocs";
import CheckSvg from "./CheckSvg";

const LightCheckSvg = asLightSvg(CheckSvg);
const DarkCheckSvg = asDarkSvg(CheckSvg);
const ThemedCheckSvg = asThemedSvg(CheckSvg);
const PositiveCheckSvg = asPositiveSvg(CheckSvg);

export default CheckSvg;
export {
  CheckSvg,
  LightCheckSvg,
  ThemedCheckSvg,
  DarkCheckSvg,
  PositiveCheckSvg,
};
