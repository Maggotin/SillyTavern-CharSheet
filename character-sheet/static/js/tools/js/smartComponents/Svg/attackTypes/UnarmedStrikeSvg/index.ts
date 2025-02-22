import { asDarkSvg } from "../../hocs/asDarkSvg";
import { asGraySvg } from "../../hocs/asGraySvg";
import { asLightSvg } from "../../hocs/asLightSvg";
import UnarmedStrikeSvg from "./UnarmedStrikeSvg";

const LightUnarmedStrikeSvg = asLightSvg(UnarmedStrikeSvg);
const DarkUnarmedStrikeSvg = asDarkSvg(UnarmedStrikeSvg);
const GrayUnarmedStrikeSvg = asGraySvg(UnarmedStrikeSvg);

export default UnarmedStrikeSvg;
export {
  UnarmedStrikeSvg,
  LightUnarmedStrikeSvg,
  DarkUnarmedStrikeSvg,
  GrayUnarmedStrikeSvg,
};
