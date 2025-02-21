import { ApiTypeEnum } from '../api/constants';
import { NotificationTypeEnum } from '../notification';
import { ConfigUtils } from './index';
const defaultApiInfo = {
    [ApiTypeEnum.WEBSITE]: '',
    [ApiTypeEnum.GAME_DATA_SERVICE]: '',
    [ApiTypeEnum.CHARACTER_SERVICE]: '',
};
const defaultRulesEngineConfig = {
    apiInfo: defaultApiInfo,
};
export let rulesEngineConfig = {
    apiInfo: defaultApiInfo,
    messageBroker: null,
    characterId: 0,
};
/**
 *
 * @param config
 */
export function configureRulesEngine(config) {
    rulesEngineConfig = Object.assign(Object.assign(Object.assign({}, defaultRulesEngineConfig), rulesEngineConfig), config);
    function dispatchMessage(title, message, notificationType = NotificationTypeEnum.SUCCESS) {
        const rulesEngineConfig = ConfigUtils.getCurrentRulesEngineConfig();
        if (rulesEngineConfig === null || rulesEngineConfig === void 0 ? void 0 : rulesEngineConfig.onNotification) {
            rulesEngineConfig.onNotification(title, message, notificationType);
        }
    }
}
/**
 *
 */
export function getCurrentRulesEngineConfig() {
    return rulesEngineConfig;
}
const dummyDispatch = (action) => {
    console.warn('Dispatch was called before store was initialized.');
    console.log(action);
    return action;
};
export function getDispatch() {
    var _a;
    return ((_a = getCurrentRulesEngineConfig().store) === null || _a === void 0 ? void 0 : _a.dispatch) || dummyDispatch;
}
