import { ConfigUtils } from '../config';
/**
 *
 * @param error
 * @param contextData
 */
export function logError(error, contextData = null) {
    let config = ConfigUtils.getCurrentRulesEngineConfig();
    if (config === null || config === void 0 ? void 0 : config.onLogError) {
        return config.onLogError(error, contextData);
    }
    return null;
}
/**
 *
 * @param message
 * @param messageType
 * @param contextData
 */
export function logMessage(message, messageType, contextData = null) {
    let config = ConfigUtils.getCurrentRulesEngineConfig();
    if (config === null || config === void 0 ? void 0 : config.onLogMessage) {
        return config.onLogMessage(message, messageType, contextData);
    }
    return null;
}
