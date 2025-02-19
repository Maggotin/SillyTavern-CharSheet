import { MobileMessage } from "./typings";

/**
 *
 * @param message
 */
export function sendMessage(message: MobileMessage): void {
  if ((window as any)?.webkit?.messageHandlers?.mobileApp?.postMessage) {
    // This should not be stringify'd because iOS is fine with objects
    // https://github.com/DnDBeyond/stcs-character-tools-client/pull/306
    (window as any).webkit.messageHandlers.mobileApp.postMessage(message);
    return;
  }

  if ((window as any)?.mobileApp?.postMessage) {
    (window as any).mobileApp.postMessage(JSON.stringify(message));
    return;
  }
}
