import { asDarkSvg, asThemedSvg, asLightSvg } from "../../hocs";
import FilterSvg from "./FilterSvg";

const ThemedFilterSvg = asThemedSvg(FilterSvg);
const DarkFilterSvg = asDarkSvg(FilterSvg);
const LightFilterSvg = asLightSvg(FilterSvg);

export default FilterSvg;
export { FilterSvg, ThemedFilterSvg, DarkFilterSvg, LightFilterSvg };
