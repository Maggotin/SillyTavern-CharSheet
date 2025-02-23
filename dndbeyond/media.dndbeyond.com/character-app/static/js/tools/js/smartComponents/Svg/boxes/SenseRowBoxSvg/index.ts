import { asEmptySvg, asThemedSvg } from "../../hocs";
import SenseRowBoxSvg from "./SenseRowBoxSvg";
import SenseRowSmallBoxSvg from "./SenseRowSmallBoxSvg";

const EmptySenseRowBoxSvg = asEmptySvg(SenseRowBoxSvg);
const ThemedSenseRowBoxSvg = asThemedSvg(SenseRowBoxSvg);
const EmptySenseRowSmallBoxSvg = asEmptySvg(SenseRowSmallBoxSvg);
const ThemedSenseRowSmallBoxSvg = asThemedSvg(SenseRowSmallBoxSvg);

export default SenseRowBoxSvg;
export {
  SenseRowBoxSvg,
  SenseRowSmallBoxSvg,
  EmptySenseRowBoxSvg,
  ThemedSenseRowBoxSvg,
  EmptySenseRowSmallBoxSvg,
  ThemedSenseRowSmallBoxSvg,
};
