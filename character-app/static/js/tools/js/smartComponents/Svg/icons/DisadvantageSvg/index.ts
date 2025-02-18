import { asDarkModeNegativeSvg, asNegativeSvg } from "../../hocs";
import DisadvantageSvg from "./DisadvantageSvg";

const NegativeDisadvantageSvg = asNegativeSvg(DisadvantageSvg);
const DarkModeNegativeDisadvantageSvg = asDarkModeNegativeSvg(DisadvantageSvg);

export default DisadvantageSvg;
export {
  DisadvantageSvg,
  NegativeDisadvantageSvg,
  DarkModeNegativeDisadvantageSvg,
};
