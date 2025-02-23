import { asEmptySvg, asThemedSvg } from "../../hocs";
import SavingThrowSelectionBoxSvg from "./SavingThrowSelectionBoxSvg";
import SavingThrowSelectionSmallBoxSvg from "./SavingThrowSelectionSmallBoxSvg";

const EmptySavingThrowSelectionBoxSvg = asEmptySvg(SavingThrowSelectionBoxSvg);
const ThemedSavingThrowSelectionBoxSvg = asThemedSvg(
  SavingThrowSelectionBoxSvg
);
const EmptySavingThrowSelectionSmallBoxSvg = asEmptySvg(
  SavingThrowSelectionSmallBoxSvg
);
const ThemedSavingThrowSelectionSmallBoxSvg = asThemedSvg(
  SavingThrowSelectionSmallBoxSvg
);

export default SavingThrowSelectionBoxSvg;
export {
  SavingThrowSelectionBoxSvg,
  SavingThrowSelectionSmallBoxSvg,
  EmptySavingThrowSelectionBoxSvg,
  ThemedSavingThrowSelectionBoxSvg,
  EmptySavingThrowSelectionSmallBoxSvg,
  ThemedSavingThrowSelectionSmallBoxSvg,
};
