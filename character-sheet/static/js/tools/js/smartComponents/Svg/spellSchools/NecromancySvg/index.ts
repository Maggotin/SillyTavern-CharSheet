import { asDarkSvg } from "../../hocs/asDarkSvg";
import { asGraySvg } from "../../hocs/asGraySvg";
import { asLightSvg } from "../../hocs/asLightSvg";
import NecromancySvg from "./NecromancySvg";

const LightNecromancySvg = asLightSvg(NecromancySvg);
const DarkNecromancySvg = asDarkSvg(NecromancySvg);
const GrayNecromancySvg = asGraySvg(NecromancySvg);

export default NecromancySvg;
export {
  NecromancySvg,
  LightNecromancySvg,
  DarkNecromancySvg,
  GrayNecromancySvg,
};
