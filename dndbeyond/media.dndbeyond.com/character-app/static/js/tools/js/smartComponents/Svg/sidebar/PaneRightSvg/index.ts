import { asDarkSvg, asDisabledSvg, asLightSvg, asThemedSvg } from "../../hocs";
import PaneRightSvg from "./PaneRightSvg";

const LightPaneRightSvg = asLightSvg(PaneRightSvg);
const DarkPaneRightSvg = asDarkSvg(PaneRightSvg);
const DisabledPaneRightSvg = asDisabledSvg(PaneRightSvg);
const ThemedPaneRightSvg = asThemedSvg(PaneRightSvg);

export default PaneRightSvg;
export {
  PaneRightSvg,
  LightPaneRightSvg,
  DarkPaneRightSvg,
  DisabledPaneRightSvg,
  ThemedPaneRightSvg,
};
