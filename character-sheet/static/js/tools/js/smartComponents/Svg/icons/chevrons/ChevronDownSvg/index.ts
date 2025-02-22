import {
  asDarkSvg,
  asDisabledSvg,
  asLightSvg,
  asThemedSvg,
} from "../../../hocs";
import ChevronDownSvg from "./ChevronDownSvg";

const LightChevronDownSvg = asLightSvg(ChevronDownSvg);
const DarkChevronDownSvg = asDarkSvg(ChevronDownSvg);
const DisabledChevronDownSvg = asDisabledSvg(ChevronDownSvg);
const ThemedChevronDownSvg = asThemedSvg(ChevronDownSvg);

export default ChevronDownSvg;
export {
  ChevronDownSvg,
  LightChevronDownSvg,
  ThemedChevronDownSvg,
  DarkChevronDownSvg,
  DisabledChevronDownSvg,
};
