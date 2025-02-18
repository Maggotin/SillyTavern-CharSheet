import { asDarkSvg } from "../../hocs/asDarkSvg";
import { asGraySvg } from "../../hocs/asGraySvg";
import { asLightSvg } from "../../hocs/asLightSvg";
import ExhaustedSvg from "./ExhaustedSvg";

const LightExhaustedSvg = asLightSvg(ExhaustedSvg);
const DarkExhaustedSvg = asDarkSvg(ExhaustedSvg);
const GrayExhaustedSvg = asGraySvg(ExhaustedSvg);

export default ExhaustedSvg;
export { ExhaustedSvg, LightExhaustedSvg, DarkExhaustedSvg, GrayExhaustedSvg };
