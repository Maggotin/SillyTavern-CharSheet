import { asDarkSvg, asLightSvg } from "../../../hocs";
import DescriptionSvg from "./DescriptionSvg";

const LightDescriptionSvg = asLightSvg(DescriptionSvg);
const DarkDescriptionSvg = asDarkSvg(DescriptionSvg);

export default DescriptionSvg;
export { DescriptionSvg, LightDescriptionSvg, DarkDescriptionSvg };
