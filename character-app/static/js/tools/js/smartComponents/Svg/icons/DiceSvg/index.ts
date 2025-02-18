import { asLightSvg, asThemedSvg } from "../../hocs";
import DiceSvg from "./DiceSvg";

const LightDiceSvg = asLightSvg(DiceSvg);
const ThemedDiceSvg = asThemedSvg(DiceSvg);

export default DiceSvg;
export { DiceSvg, LightDiceSvg, ThemedDiceSvg };
