import { asDarkModeNegativeSvg, asNegativeSvg } from "../../hocs";
import BonusNegativeSvg from "./BonusNegativeSvg";

const NegativeBonusNegativeSvg = asNegativeSvg(BonusNegativeSvg);
const DarkModeNegativeBonusNegativeSvg =
  asDarkModeNegativeSvg(BonusNegativeSvg);

export default BonusNegativeSvg;
export {
  BonusNegativeSvg,
  NegativeBonusNegativeSvg,
  DarkModeNegativeBonusNegativeSvg,
};
