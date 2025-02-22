import { asDarkSvg, asLightSvg } from "../../../hocs";
import CreaturesSvg from "./CreaturesSvg";

const LightCreaturesSvg = asLightSvg(CreaturesSvg);
const DarkCreaturesSvg = asDarkSvg(CreaturesSvg);

export default CreaturesSvg;
export { CreaturesSvg, LightCreaturesSvg, DarkCreaturesSvg };
