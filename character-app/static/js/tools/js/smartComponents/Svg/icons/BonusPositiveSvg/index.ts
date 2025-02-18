import { asDarkModePositiveSvg, asPositiveSvg } from "../../hocs";
import BonusPositiveSvg from "./BonusPositiveSvg";

const PositiveBonusPositiveSvg = asPositiveSvg(BonusPositiveSvg);
const DarkModePositiveBonusPositiveSvg =
  asDarkModePositiveSvg(BonusPositiveSvg);

export default BonusPositiveSvg;
export {
  BonusPositiveSvg,
  PositiveBonusPositiveSvg,
  DarkModePositiveBonusPositiveSvg,
};
