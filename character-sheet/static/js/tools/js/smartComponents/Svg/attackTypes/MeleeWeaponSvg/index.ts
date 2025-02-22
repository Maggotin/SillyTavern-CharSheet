import { asDarkSvg } from "../../hocs/asDarkSvg";
import { asGraySvg } from "../../hocs/asGraySvg";
import { asLightSvg } from "../../hocs/asLightSvg";
import MeleeWeaponSvg from "./MeleeWeaponSvg";

const LightMeleeWeaponSvg = asLightSvg(MeleeWeaponSvg);
const DarkMeleeWeaponSvg = asDarkSvg(MeleeWeaponSvg);
const GrayMeleeWeaponSvg = asGraySvg(MeleeWeaponSvg);

export default MeleeWeaponSvg;
export {
  MeleeWeaponSvg,
  LightMeleeWeaponSvg,
  DarkMeleeWeaponSvg,
  GrayMeleeWeaponSvg,
};
