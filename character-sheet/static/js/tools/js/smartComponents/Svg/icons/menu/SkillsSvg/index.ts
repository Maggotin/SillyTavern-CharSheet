import { asDarkSvg, asLightSvg } from "../../../hocs";
import SkillsSvg from "./SkillsSvg";

const LightSkillsSvg = asLightSvg(SkillsSvg);
const DarkSkillsSvg = asDarkSvg(SkillsSvg);

export default SkillsSvg;
export { SkillsSvg, LightSkillsSvg, DarkSkillsSvg };
