import { asLightSvg, asThemedSvg } from "../../hocs";
import BackdropSvg from "./BackdropSvg";

const LightBackdropSvg = asLightSvg(BackdropSvg);
const ThemedBackdropSvg = asThemedSvg(BackdropSvg);

export default BackdropSvg;
export { BackdropSvg, LightBackdropSvg, ThemedBackdropSvg };
