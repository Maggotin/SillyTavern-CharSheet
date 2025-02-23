import { asDarkSvg } from "../../hocs/asDarkSvg";
import { asGraySvg } from "../../hocs/asGraySvg";
import { asLightSvg } from "../../hocs/asLightSvg";
import TransmutationSvg from "./TransmutationSvg";

const LightTransmutationSvg = asLightSvg(TransmutationSvg);
const DarkTransmutationSvg = asDarkSvg(TransmutationSvg);
const GrayTransmutationSvg = asGraySvg(TransmutationSvg);

export default TransmutationSvg;
export {
  TransmutationSvg,
  LightTransmutationSvg,
  DarkTransmutationSvg,
  GrayTransmutationSvg,
};
