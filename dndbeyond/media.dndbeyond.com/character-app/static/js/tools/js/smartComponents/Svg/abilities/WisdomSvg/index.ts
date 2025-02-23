import { asDarkSvg, asLightSvg } from "../../hocs";
import WisdomSvg from "./WisdomSvg";

const LightWisdomSvg = asLightSvg(WisdomSvg);
const DarkWisdomSvg = asDarkSvg(WisdomSvg);

export default WisdomSvg;
export { WisdomSvg, LightWisdomSvg, DarkWisdomSvg };
