import { asLightSvg, asThemedSvg } from "../../hocs";
import ManageXpSvg from "./ManageXpSvg";

const LightManageXpSvg = asLightSvg(ManageXpSvg);
const ThemedManageXpSvg = asThemedSvg(ManageXpSvg);

export default ManageXpSvg;
export { ManageXpSvg, LightManageXpSvg, ThemedManageXpSvg };
