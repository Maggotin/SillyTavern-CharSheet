import { ConfigUtils } from '../config';
import { NotificationTypeEnum } from './constants';
/**
 *
 * @param title
 * @param message
 * @param notificationType
 */
export function dispatchMessage(title, message, notificationType = NotificationTypeEnum.SUCCESS) {
    const rulesEngineConfig = ConfigUtils.getCurrentRulesEngineConfig();
    if (rulesEngineConfig === null || rulesEngineConfig === void 0 ? void 0 : rulesEngineConfig.onNotification) {
        rulesEngineConfig.onNotification(title, message, notificationType);
    }
}
