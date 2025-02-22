import { asLightSvg, asThemedSvg } from "../../hocs";
import ShareSvg from "./ShareSvg";

const LightShareSvg = asLightSvg(ShareSvg);
const ThemedShareSvg = asThemedSvg(ShareSvg);

export default ShareSvg;
export { ShareSvg, LightShareSvg, ThemedShareSvg };
