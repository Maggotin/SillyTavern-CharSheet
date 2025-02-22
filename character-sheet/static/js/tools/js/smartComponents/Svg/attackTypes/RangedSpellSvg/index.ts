import { asDarkSvg } from "../../hocs/asDarkSvg";
import { asGraySvg } from "../../hocs/asGraySvg";
import { asLightSvg } from "../../hocs/asLightSvg";
import RangedSpellSvg from "./RangedSpellSvg";

const LightRangedSpellSvg = asLightSvg(RangedSpellSvg);
const DarkRangedSpellSvg = asDarkSvg(RangedSpellSvg);
const GrayRangedSpellSvg = asGraySvg(RangedSpellSvg);

export default RangedSpellSvg;
export {
  RangedSpellSvg,
  LightRangedSpellSvg,
  DarkRangedSpellSvg,
  GrayRangedSpellSvg,
};
