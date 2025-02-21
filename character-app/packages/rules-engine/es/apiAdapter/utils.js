import { merge } from 'lodash';
import { ApiTypeEnum } from '../api/constants';
import { generateCharacterServiceApiPath } from '../api/generators';
import { ConfigUtils } from '../config';
import { rulesEngineSelectors } from '../selectors';
let emptyPromise = new Promise((resolve, reject) => {
    resolve({
        data: {
            success: false,
        },
        headers: {},
        status: -1,
        statusText: 'EMPTY_PROMISE',
    });
});
export function getApiBaseUrl(apiType) {
    const config = ConfigUtils.getCurrentRulesEngineConfig();
    switch (apiType) {
        case ApiTypeEnum.HACK__CHARACTER_SERVICE_GAME_DATA:
            return config.apiInfo[ApiTypeEnum.CHARACTER_SERVICE];
        default:
        // not implemented
    }
    return config.apiInfo[apiType];
}
export function generateApiUrl(apiType, apiPath, apiVersionOverride) {
    return [getApiBaseUrl(apiType), transformApiPath(apiType, apiPath, apiVersionOverride)].join('/');
}
export function generateDefaultRequestParams(apiType, requestConfig) {
    const config = ConfigUtils.getCurrentRulesEngineConfig();
    if (config.store === undefined || requestConfig.removeDefaultParams) {
        return {};
    }
    switch (apiType) {
        case ApiTypeEnum.CHARACTER_SERVICE:
            return rulesEngineSelectors.getRequiredCharacterServiceParams(config.store.getState());
        case ApiTypeEnum.GAME_DATA_SERVICE:
        case ApiTypeEnum.HACK__CHARACTER_SERVICE_GAME_DATA:
            return rulesEngineSelectors.getRequiredGameDataServiceParams(config.store.getState());
        default:
        // not implemented
    }
    return {};
}
export function transformApiPath(apiType, apiPath, apiVersionOverride) {
    switch (apiType) {
        case ApiTypeEnum.CHARACTER_SERVICE:
        case ApiTypeEnum.HACK__CHARACTER_SERVICE_GAME_DATA:
            return generateCharacterServiceApiPath(apiPath, apiVersionOverride);
        default:
        //not implemented
    }
    return apiPath;
}
export function makeGet(apiType, apiPath, config, apiVersionOverride) {
    return (additionalConfig = {}) => {
        const rulesEngineConfig = ConfigUtils.getCurrentRulesEngineConfig();
        if (rulesEngineConfig.apiAdapter) {
            const initialRequestConfig = merge({}, config, additionalConfig);
            const defaultRequestParams = generateDefaultRequestParams(apiType, initialRequestConfig);
            const defaultRequestConfig = {
                params: defaultRequestParams,
            };
            const requestConfig = merge({}, defaultRequestConfig, initialRequestConfig);
            return rulesEngineConfig.apiAdapter.get(generateApiUrl(apiType, apiPath, apiVersionOverride), requestConfig);
        }
        return emptyPromise;
    };
}
export function makeInterpolatedGet(apiType, apiPath, config, apiVersionOverride) {
    return (data, additionalConfig = {}) => {
        const rulesEngineConfig = ConfigUtils.getCurrentRulesEngineConfig();
        if (rulesEngineConfig.apiAdapter) {
            const initialRequestConfig = merge({}, config, additionalConfig);
            const defaultRequestParams = generateDefaultRequestParams(apiType, initialRequestConfig);
            const defaultRequestConfig = {
                params: defaultRequestParams,
            };
            const requestConfig = merge({}, defaultRequestConfig, initialRequestConfig);
            let interpolatedPath = `${apiPath}`;
            Object.keys(data).forEach((key) => {
                if (!data[key]) {
                    throw new Error(`Key: ${key} was not provided to makeInterpolatedGet`);
                }
                interpolatedPath = interpolatedPath.replace(`{${key}}`, data[key]);
            });
            return rulesEngineConfig.apiAdapter.get(generateApiUrl(apiType, interpolatedPath, apiVersionOverride), requestConfig);
        }
        return emptyPromise;
    };
}
export function makePost(apiType, apiPath, config, apiVersionOverride) {
    return (data, additionalConfig = {}) => {
        const rulesEngineConfig = ConfigUtils.getCurrentRulesEngineConfig();
        if (rulesEngineConfig.apiAdapter) {
            const requestConfig = merge({}, config, additionalConfig);
            const defaultRequestParams = generateDefaultRequestParams(apiType, requestConfig);
            const requestData = merge({}, defaultRequestParams, data);
            return rulesEngineConfig.apiAdapter.post(generateApiUrl(apiType, apiPath, apiVersionOverride), requestData, requestConfig);
        }
        return emptyPromise;
    };
}
export function makePut(apiType, apiPath, config, apiVersionOverride) {
    return (data, additionalConfig = {}) => {
        const rulesEngineConfig = ConfigUtils.getCurrentRulesEngineConfig();
        if (rulesEngineConfig.apiAdapter) {
            const requestConfig = merge({}, config, additionalConfig);
            const defaultRequestParams = generateDefaultRequestParams(apiType, requestConfig);
            const requestData = merge({}, defaultRequestParams, data);
            return rulesEngineConfig.apiAdapter.put(generateApiUrl(apiType, apiPath, apiVersionOverride), requestData, requestConfig);
        }
        return emptyPromise;
    };
}
export function makeDelete(apiType, apiPath, config, apiVersionOverride) {
    return (data, additionalConfig = {}) => {
        const rulesEngineConfig = ConfigUtils.getCurrentRulesEngineConfig();
        if (rulesEngineConfig.apiAdapter) {
            const initialRequestConfig = merge({}, config, additionalConfig);
            const defaultRequestParams = generateDefaultRequestParams(apiType, initialRequestConfig);
            const defaultRequestConfig = {
                data: defaultRequestParams,
            };
            const paramConfig = {
                data: data ? data : {},
            };
            const requestConfig = merge({}, defaultRequestConfig, paramConfig);
            return rulesEngineConfig.apiAdapter.delete(generateApiUrl(apiType, apiPath, apiVersionOverride), requestConfig);
        }
        return emptyPromise;
    };
}
/**
 *
 * @param response
 */
export function getResponseData(response) {
    var _a;
    if (((_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.data) !== undefined) {
        return response.data.data;
    }
    return null;
}
