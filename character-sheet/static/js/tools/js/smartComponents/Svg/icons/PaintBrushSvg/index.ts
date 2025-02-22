import { asLightSvg, asDarkSvg, asThemedSvg } from "../../hocs";
import PaintBrushSvg from "./PaintBrushSvg";

const LightPaintBrushSvg = asLightSvg(PaintBrushSvg);
const DarkPaintBrushSvg = asDarkSvg(PaintBrushSvg);
const ThemedPaintBrushSvg = asThemedSvg(PaintBrushSvg);

export default PaintBrushSvg;
export {
  PaintBrushSvg,
  LightPaintBrushSvg,
  DarkPaintBrushSvg,
  ThemedPaintBrushSvg,
};
