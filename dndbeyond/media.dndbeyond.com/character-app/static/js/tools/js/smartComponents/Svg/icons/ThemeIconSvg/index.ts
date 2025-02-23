import { asLightSvg, asThemedSvg } from "../../hocs";
import ThemeIconSvg from "./ThemeIconSvg";

const LightThemeIconSvg = asLightSvg(ThemeIconSvg);
const ThemedThemeIconSvg = asThemedSvg(ThemeIconSvg);

export default ThemeIconSvg;
export { ThemeIconSvg, LightThemeIconSvg, ThemedThemeIconSvg };
