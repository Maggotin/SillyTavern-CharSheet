import { asDarkSvg, asDisabledSvg, asLightSvg, asThemedSvg } from "../../hocs";
import PaneLeftSvg from "./PaneLeftSvg";

const LightPaneLeftSvg = asLightSvg(PaneLeftSvg);
const DarkPaneLeftSvg = asDarkSvg(PaneLeftSvg);
const DisabledPaneLeftSvg = asDisabledSvg(PaneLeftSvg);
const ThemedPaneLeftSvg = asThemedSvg(PaneLeftSvg);

export default PaneLeftSvg;
export {
  PaneLeftSvg,
  LightPaneLeftSvg,
  DarkPaneLeftSvg,
  DisabledPaneLeftSvg,
  ThemedPaneLeftSvg,
};
