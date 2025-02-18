import { asLightSvg, asThemedSvg } from "../../hocs";
import ManageLevelSvg from "./ManageLevelSvg";

const LightManageLevelSvg = asLightSvg(ManageLevelSvg);
const ThemedManageLevelSvg = asThemedSvg(ManageLevelSvg);

export default ManageLevelSvg;
export { ManageLevelSvg, LightManageLevelSvg, ThemedManageLevelSvg };
