import { asDarkSvg } from "../../hocs/asDarkSvg";
import { asGraySvg } from "../../hocs/asGraySvg";
import { asLightSvg } from "../../hocs/asLightSvg";
import MeleeSpellSvg from "./MeleeSpellSvg";

const LightMeleeSpellSvg = asLightSvg(MeleeSpellSvg);
const DarkMeleeSpellSvg = asDarkSvg(MeleeSpellSvg);
const GrayMeleeSpellSvg = asGraySvg(MeleeSpellSvg);

export default MeleeSpellSvg;
export {
  MeleeSpellSvg,
  LightMeleeSpellSvg,
  DarkMeleeSpellSvg,
  GrayMeleeSpellSvg,
};
