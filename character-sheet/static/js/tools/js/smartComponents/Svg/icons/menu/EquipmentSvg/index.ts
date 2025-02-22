import { asDarkSvg, asLightSvg } from "../../../hocs";
import EquipmentSvg from "./EquipmentSvg";

const LightEquipmentSvg = asLightSvg(EquipmentSvg);
const DarkEquipmentSvg = asDarkSvg(EquipmentSvg);

export default EquipmentSvg;
export { EquipmentSvg, LightEquipmentSvg, DarkEquipmentSvg };
