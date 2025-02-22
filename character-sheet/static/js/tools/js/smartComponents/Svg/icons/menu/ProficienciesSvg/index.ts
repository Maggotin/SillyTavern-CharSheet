import { asDarkSvg, asLightSvg } from "../../../hocs";
import ProficienciesSvg from "./ProficienciesSvg";

const LightProficienciesSvg = asLightSvg(ProficienciesSvg);
const DarkProficienciesSvg = asDarkSvg(ProficienciesSvg);

export default ProficienciesSvg;
export { ProficienciesSvg, LightProficienciesSvg, DarkProficienciesSvg };
