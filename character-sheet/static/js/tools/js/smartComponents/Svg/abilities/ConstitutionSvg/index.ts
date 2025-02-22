import { asDarkSvg, asLightSvg } from "../../hocs";
import ConstitutionSvg from "./ConstitutionSvg";

const LightConstitutionSvg = asLightSvg(ConstitutionSvg);
const DarkConstitutionSvg = asDarkSvg(ConstitutionSvg);

export default ConstitutionSvg;
export { ConstitutionSvg, LightConstitutionSvg, DarkConstitutionSvg };
