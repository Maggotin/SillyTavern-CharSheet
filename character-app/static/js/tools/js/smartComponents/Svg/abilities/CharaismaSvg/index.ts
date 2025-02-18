import { asDarkSvg } from "../../hocs/asDarkSvg";
import { asLightSvg } from "../../hocs/asLightSvg";
import CharismaSvg from "./CharismaSvg";

const LightCharismaSvg = asLightSvg(CharismaSvg);
const DarkCharismaSvg = asDarkSvg(CharismaSvg);

export default CharismaSvg;
export { CharismaSvg, LightCharismaSvg, DarkCharismaSvg };
