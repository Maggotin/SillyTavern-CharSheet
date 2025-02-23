import {
  asBuilderSvg,
  asDarkSvg,
  asDisabledSvg,
  asLightSvg,
  asThemedSvg,
} from "../../../hocs";
import ChevronRightSvg from "./ChevronRightSvg";

const BuilderChevronRightSvg = asBuilderSvg(ChevronRightSvg);
const LightChevronRightSvg = asLightSvg(ChevronRightSvg);
const DarkChevronRightSvg = asDarkSvg(ChevronRightSvg);
const DisabledChevronRightSvg = asDisabledSvg(ChevronRightSvg);
const ThemedChevronRightSvg = asThemedSvg(ChevronRightSvg);

export default ChevronRightSvg;
export {
  ChevronRightSvg,
  BuilderChevronRightSvg,
  LightChevronRightSvg,
  ThemedChevronRightSvg,
  DarkChevronRightSvg,
  DisabledChevronRightSvg,
};
