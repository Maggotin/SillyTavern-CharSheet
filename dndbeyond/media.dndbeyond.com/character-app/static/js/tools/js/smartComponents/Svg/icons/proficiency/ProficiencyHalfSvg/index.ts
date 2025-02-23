import { asDarkSvg, asModifiedSvg } from "../../../hocs";
import ProficiencyHalfSvg from "./ProficiencyHalfSvg";

const ModifiedProficiencyHalfSvg = asModifiedSvg(ProficiencyHalfSvg);
const DarkProficiencyHalfSvg = asDarkSvg(ProficiencyHalfSvg);

export default ProficiencyHalfSvg;
export {
  ProficiencyHalfSvg,
  DarkProficiencyHalfSvg,
  ModifiedProficiencyHalfSvg,
};
