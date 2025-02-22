import { asDarkSvg, asModifiedSvg } from "../../../hocs";
import ProficiencyDoubleSvg from "./ProficiencyDoubleSvg";

const ModifiedProficiencyDoubleSvg = asModifiedSvg(ProficiencyDoubleSvg);
const DarkProficiencyDoubleSvg = asDarkSvg(ProficiencyDoubleSvg);

export default ProficiencyDoubleSvg;
export {
  ProficiencyDoubleSvg,
  DarkProficiencyDoubleSvg,
  ModifiedProficiencyDoubleSvg,
};
