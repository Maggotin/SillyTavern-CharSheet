import { asDarkSvg, asLightSvg, asThemedSvg, asDisabledSvg } from "../../hocs";
import ExportSvg from "./ExportSvg";

const LightExportSvg = asLightSvg(ExportSvg);
const DarkExportSvg = asDarkSvg(ExportSvg);
const ThemedExportSvg = asThemedSvg(ExportSvg);
const DisabledExportSvg = asDisabledSvg(ExportSvg);

export default ExportSvg;
export {
  ExportSvg,
  DarkExportSvg,
  LightExportSvg,
  ThemedExportSvg,
  DisabledExportSvg,
};
