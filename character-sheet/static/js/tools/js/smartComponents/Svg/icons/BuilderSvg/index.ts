import { asDarkSvg, asLightSvg, asThemedSvg } from "../../hocs";
import BuilderSvg from "./BuilderSvg";

const LightBuilderSvg = asLightSvg(BuilderSvg);
const DarkBuilderSvg = asDarkSvg(BuilderSvg);
const ThemedBuilderSvg = asThemedSvg(BuilderSvg);

export default BuilderSvg;
export { BuilderSvg, DarkBuilderSvg, LightBuilderSvg, ThemedBuilderSvg };
