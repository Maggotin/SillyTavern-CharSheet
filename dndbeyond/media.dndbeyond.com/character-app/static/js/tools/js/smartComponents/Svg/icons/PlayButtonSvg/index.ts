import { asDarkSvg, asLightSvg, asPositiveSvg, asThemedSvg } from "../../hocs";
import PlayButtonSvg from "./PlayButtonSvg";

const LightPlayButtonSvg = asLightSvg(PlayButtonSvg);
const DarkPlayButtonSvg = asDarkSvg(PlayButtonSvg);
const ThemedPlayButtonSvg = asThemedSvg(PlayButtonSvg);
const PositivePlayButtonSvg = asPositiveSvg(PlayButtonSvg);

export default PlayButtonSvg;
export {
  PlayButtonSvg,
  LightPlayButtonSvg,
  ThemedPlayButtonSvg,
  DarkPlayButtonSvg,
  PositivePlayButtonSvg,
};
