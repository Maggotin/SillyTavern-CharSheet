import { asDarkSvg, asLightSvg } from "../../../hocs";
import FeaturesSvg from "./FeaturesSvg";

const LightFeaturesSvg = asLightSvg(FeaturesSvg);
const DarkFeaturesSvg = asDarkSvg(FeaturesSvg);

export default FeaturesSvg;
export { FeaturesSvg, LightFeaturesSvg, DarkFeaturesSvg };
