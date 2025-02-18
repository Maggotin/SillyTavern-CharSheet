import {
  asBuilderSvg,
  asDarkSvg,
  asDisabledSvg,
  asLightSvg,
  asThemedSvg,
} from "../../../hocs";
import ChevronLeftSvg from "./ChevronLeftSvg";

const BuilderChevronLeftSvg = asBuilderSvg(ChevronLeftSvg);
const LightChevronLeftSvg = asLightSvg(ChevronLeftSvg);
const DarkChevronLeftSvg = asDarkSvg(ChevronLeftSvg);
const DisabledChevronLeftSvg = asDisabledSvg(ChevronLeftSvg);
const ThemedChevronLeftSvg = asThemedSvg(ChevronLeftSvg);

export default ChevronLeftSvg;
export {
  ChevronLeftSvg,
  BuilderChevronLeftSvg,
  LightChevronLeftSvg,
  ThemedChevronLeftSvg,
  DarkChevronLeftSvg,
  DisabledChevronLeftSvg,
};
