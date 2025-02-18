import { asDarkSvg } from "../../hocs/asDarkSvg";
import { asGraySvg } from "../../hocs/asGraySvg";
import { asLightSvg } from "../../hocs/asLightSvg";
import WeaponSpellDamageSvg from "./WeaponSpellDamageSvg";

const LightWeaponSpellDamageSvg = asLightSvg(WeaponSpellDamageSvg);
const DarkWeaponSpellDamageSvg = asDarkSvg(WeaponSpellDamageSvg);
const GrayWeaponSpellDamageSvg = asGraySvg(WeaponSpellDamageSvg);

export default WeaponSpellDamageSvg;
export {
  WeaponSpellDamageSvg,
  LightWeaponSpellDamageSvg,
  DarkWeaponSpellDamageSvg,
  GrayWeaponSpellDamageSvg,
};
