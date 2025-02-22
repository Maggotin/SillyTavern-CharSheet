import { asLightSvg, asThemedSvg } from "../../hocs";
import PreferencesSvg from "./PreferencesSvg";

const LightPreferencesSvg = asLightSvg(PreferencesSvg);
const ThemedPreferencesSvg = asThemedSvg(PreferencesSvg);

export default PreferencesSvg;
export { PreferencesSvg, LightPreferencesSvg, ThemedPreferencesSvg };
