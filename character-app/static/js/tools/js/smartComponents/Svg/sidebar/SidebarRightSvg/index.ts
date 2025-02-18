import { asDarkSvg, asDisabledSvg, asLightSvg } from "../../hocs";
import SidebarRightSvg from "./SidebarRightSvg";

const LightSidebarRightSvg = asLightSvg(SidebarRightSvg);
const DarkSidebarRightSvg = asDarkSvg(SidebarRightSvg);
const DisabledSidebarRightSvg = asDisabledSvg(SidebarRightSvg);

export default SidebarRightSvg;
export {
  SidebarRightSvg,
  LightSidebarRightSvg,
  DarkSidebarRightSvg,
  DisabledSidebarRightSvg,
};
