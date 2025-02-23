import { asEmptySvg, asThemedSvg } from "../../hocs";
import SavingThrowRowBoxSvg from "./SavingThrowRowBoxSvg";
import SavingThrowRowSmallBoxSvg from "./SavingThrowRowSmallBoxSvg";

const EmptySavingThrowRowBoxSvg = asEmptySvg(SavingThrowRowBoxSvg);
const ThemedSavingThrowRowBoxSvg = asThemedSvg(SavingThrowRowBoxSvg);
const EmptySavingThrowRowSmallBoxSvg = asEmptySvg(SavingThrowRowSmallBoxSvg);
const ThemedSavingThrowRowSmallBoxSvg = asThemedSvg(SavingThrowRowSmallBoxSvg);

export default SavingThrowRowBoxSvg;
export {
  SavingThrowRowBoxSvg,
  SavingThrowRowSmallBoxSvg,
  EmptySavingThrowRowBoxSvg,
  ThemedSavingThrowRowBoxSvg,
  EmptySavingThrowRowSmallBoxSvg,
  ThemedSavingThrowRowSmallBoxSvg,
};
