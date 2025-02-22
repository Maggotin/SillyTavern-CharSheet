import { asLightSvg, asDarkSvg, asThemedSvg } from "../../hocs";
import PencilSvg from "./PencilSvg";

const LightPencilSvg = asLightSvg(PencilSvg);
const DarkPencilSvg = asDarkSvg(PencilSvg);
const ThemedPencilSvg = asThemedSvg(PencilSvg);

export default PencilSvg;
export { PencilSvg, LightPencilSvg, DarkPencilSvg, ThemedPencilSvg };
