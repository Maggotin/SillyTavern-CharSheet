import { asDarkSvg } from "../../hocs/asDarkSvg";
import { asGraySvg } from "../../hocs/asGraySvg";
import { asLightSvg } from "../../hocs/asLightSvg";
import SlashingSvg from "./SlashingSvg";

const LightSlashingSvg = asLightSvg(SlashingSvg);
const DarkSlashingSvg = asDarkSvg(SlashingSvg);
const GraySlashingSvg = asGraySvg(SlashingSvg);

export default SlashingSvg;
export { SlashingSvg, LightSlashingSvg, DarkSlashingSvg, GraySlashingSvg };
