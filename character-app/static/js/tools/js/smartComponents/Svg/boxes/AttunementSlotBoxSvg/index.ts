import { asEmptySvg, asThemedSvg, asThemedWithOpacitySvg } from "../../hocs";
import AttunementSlotBoxSvg from "./AttunementSlotBoxSvg";

const EmptyAttunementSlotBoxSvg = asEmptySvg(AttunementSlotBoxSvg);
const ThemedAttunementSlotBoxSvg = asThemedSvg(AttunementSlotBoxSvg);
const ThemedWithOpacityAttunementSlotBoxSvg =
  asThemedWithOpacitySvg(AttunementSlotBoxSvg);

export default AttunementSlotBoxSvg;
export {
  AttunementSlotBoxSvg,
  EmptyAttunementSlotBoxSvg,
  ThemedAttunementSlotBoxSvg,
  ThemedWithOpacityAttunementSlotBoxSvg,
};
