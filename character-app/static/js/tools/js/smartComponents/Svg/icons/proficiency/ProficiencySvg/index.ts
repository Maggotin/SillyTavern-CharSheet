import { asDarkSvg, asModifiedSvg } from "../../../hocs";
import ProficiencySvg from "./ProficiencySvg";

const ModifiedProficiencySvg = asModifiedSvg(ProficiencySvg);
const DarkProficiencySvg = asDarkSvg(ProficiencySvg);

export default ProficiencySvg;
export { ProficiencySvg, DarkProficiencySvg, ModifiedProficiencySvg };
