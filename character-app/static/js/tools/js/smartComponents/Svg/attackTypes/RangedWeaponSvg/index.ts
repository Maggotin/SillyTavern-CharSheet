import { asDarkSvg } from "../../hocs/asDarkSvg";
import { asGraySvg } from "../../hocs/asGraySvg";
import { asLightSvg } from "../../hocs/asLightSvg";
import RangedWeaponSvg from "./RangedWeaponSvg";

const LightRangedWeaponSvg = asLightSvg(RangedWeaponSvg);
const DarkRangedWeaponSvg = asDarkSvg(RangedWeaponSvg);
const GrayRangedWeaponSvg = asGraySvg(RangedWeaponSvg);

export default RangedWeaponSvg;
export {
  RangedWeaponSvg,
  LightRangedWeaponSvg,
  DarkRangedWeaponSvg,
  GrayRangedWeaponSvg,
};
