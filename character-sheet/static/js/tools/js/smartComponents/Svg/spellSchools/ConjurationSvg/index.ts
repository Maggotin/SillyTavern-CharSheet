import { asDarkSvg } from "../../hocs/asDarkSvg";
import { asGraySvg } from "../../hocs/asGraySvg";
import { asLightSvg } from "../../hocs/asLightSvg";
import ConjurationSvg from "./ConjurationSvg";

const LightConjurationSvg = asLightSvg(ConjurationSvg);
const DarkConjurationSvg = asDarkSvg(ConjurationSvg);
const GrayConjurationSvg = asGraySvg(ConjurationSvg);

export default ConjurationSvg;
export {
  ConjurationSvg,
  LightConjurationSvg,
  DarkConjurationSvg,
  GrayConjurationSvg,
};
