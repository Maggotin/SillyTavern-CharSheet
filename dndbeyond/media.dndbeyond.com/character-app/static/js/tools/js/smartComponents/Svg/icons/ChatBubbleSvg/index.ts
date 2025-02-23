import { asDarkSvg, asLightSvg, asPositiveSvg, asThemedSvg } from "../../hocs";
import ChatBubbleSvg from "./ChatBubbleSvg";

const LightChatBubbleSvg = asLightSvg(ChatBubbleSvg);
const DarkChatBubbleSvg = asDarkSvg(ChatBubbleSvg);
const ThemedChatBubbleSvg = asThemedSvg(ChatBubbleSvg);
const PositiveChatBubbleSvg = asPositiveSvg(ChatBubbleSvg);

export default ChatBubbleSvg;
export {
  ChatBubbleSvg,
  LightChatBubbleSvg,
  ThemedChatBubbleSvg,
  DarkChatBubbleSvg,
  PositiveChatBubbleSvg,
};
