import { asDarkSvg } from "../../hocs/asDarkSvg";
import { asGraySvg } from "../../hocs/asGraySvg";
import { asLightSvg } from "../../hocs/asLightSvg";
import Cylinder from "./Cylinder";

const LightCylinderSvg = asLightSvg(Cylinder);
const DarkCylinderSvg = asDarkSvg(Cylinder);
const GrayCylinderSvg = asGraySvg(Cylinder);

export default Cylinder;
export { Cylinder, LightCylinderSvg, DarkCylinderSvg, GrayCylinderSvg };
