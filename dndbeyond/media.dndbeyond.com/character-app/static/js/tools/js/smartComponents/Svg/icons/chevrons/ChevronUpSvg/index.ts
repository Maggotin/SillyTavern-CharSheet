import {
  asDarkSvg,
  asDisabledSvg,
  asLightSvg,
  asThemedSvg,
} from "../../../hocs";
import ChevronUpSvg from "./ChevronUpSvg";

const LightChevronUpSvg = asLightSvg(ChevronUpSvg);
const DarkChevronUpSvg = asDarkSvg(ChevronUpSvg);
const DisabledChevronUpSvg = asDisabledSvg(ChevronUpSvg);
const ThemedChevronUpSvg = asThemedSvg(ChevronUpSvg);

export default ChevronUpSvg;
export {
  ChevronUpSvg,
  LightChevronUpSvg,
  ThemedChevronUpSvg,
  DarkChevronUpSvg,
  DisabledChevronUpSvg,
};
