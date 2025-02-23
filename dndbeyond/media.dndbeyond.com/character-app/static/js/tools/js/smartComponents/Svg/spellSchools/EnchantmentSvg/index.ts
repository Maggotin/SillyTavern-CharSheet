import { asDarkSvg } from "../../hocs/asDarkSvg";
import { asGraySvg } from "../../hocs/asGraySvg";
import { asLightSvg } from "../../hocs/asLightSvg";
import EnchantmentSvg from "./EnchantmentSvg";

const LightEnchantmentSvg = asLightSvg(EnchantmentSvg);
const DarkEnchantmentSvg = asDarkSvg(EnchantmentSvg);
const GrayEnchantmentSvg = asGraySvg(EnchantmentSvg);

export default EnchantmentSvg;
export {
  EnchantmentSvg,
  LightEnchantmentSvg,
  DarkEnchantmentSvg,
  GrayEnchantmentSvg,
};
