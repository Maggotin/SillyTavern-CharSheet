import { asDarkSvg, asDisabledSvg, asLightSvg } from "../../hocs";
import SidebarLeftSvg from "./SidebarLeftSvg";

const LightSidebarLeftSvg = asLightSvg(SidebarLeftSvg);
const DarkSidebarLeftSvg = asDarkSvg(SidebarLeftSvg);
const DisabledSidebarLeftSvg = asDisabledSvg(SidebarLeftSvg);

export default SidebarLeftSvg;
export {
  SidebarLeftSvg,
  LightSidebarLeftSvg,
  DarkSidebarLeftSvg,
  DisabledSidebarLeftSvg,
};
