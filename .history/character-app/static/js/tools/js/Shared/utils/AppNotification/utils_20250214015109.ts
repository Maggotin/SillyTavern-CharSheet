import { Constants } from "@dndbeyond/character-rules-engine/es";

import { toastMessageActions } from "../../actions/toastMessage";
import { StateStoreUtils } from "../../stores";

/**
 *
 * @param title
 * @param message
 * @param notificationType
 */
export function dispatchNotification(
  title: string,
  message: string,
  notificationType: Constants.NotificationTypeEnum
): void {
  const store = StateStoreUtils.getAppStore();
  if (store) {
    switch (notificationType) {
      case Constants.NotificationTypeEnum.ERROR:
      case Constants.NotificationTypeEnum.CRITICAL:
        store.dispatch(toastMessageActions.toastError(title, message));
        break;
      default:
        store.dispatch(toastMessageActions.toastSuccess(title, message));
    }
  }
}

/**
 *
 * @param title
 * @param message
 */
export function dispatchSuccess(title: string, message: string): void {
  const store = StateStoreUtils.getAppStore();
  if (store) {
    store.dispatch(toastMessageActions.toastSuccess(title, message));
  }
}

/**
 *
 * @param title
 * @param message
 */
export function dispatchError(title: string, message: string): void {
  const store = StateStoreUtils.getAppStore();
  if (store) {
    store.dispatch(toastMessageActions.toastError(title, message));
  }
}
