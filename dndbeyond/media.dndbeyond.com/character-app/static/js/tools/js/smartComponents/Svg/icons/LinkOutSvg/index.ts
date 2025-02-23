import { asLightSvg, asThemedSvg } from "../../hocs";
import LinkOutSvg from "./LinkOutSvg";

const LightLinkOutSvg = asLightSvg(LinkOutSvg);
const ThemedLinkOutSvg = asThemedSvg(LinkOutSvg);

export default LinkOutSvg;
export { LinkOutSvg, LightLinkOutSvg, ThemedLinkOutSvg };
