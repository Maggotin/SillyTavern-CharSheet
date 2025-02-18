import axios from 'axios';
import { merge } from 'lodash';
import AuthUtils from '../../authentication-lib-js';
import { handleApiAdapterException, handleApiException } from './errorHandlers';
import { ApiAdapterException, AuthException, AuthMissingException, OverrideApiException } from './errors';
import { validateApiAdapterResponse, validateCanRequest } from './validators';
let getAuthLibAuthHeaders = null;
/**
 *
 * @param authUrl
 * @param isReadonly
 * @param existingConfig
 */
export function generateAuthRequestConfig(authUrl, isReadonly, existingConfig) {
    if (getAuthLibAuthHeaders === null) {
        getAuthLibAuthHeaders = AuthUtils.makeGetAuthorizationHeaders({
            authUrl,
        });
    }
    return getAuthLibAuthHeaders()
        .then((authHeaders = {}) => {
        if (!validateCanRequest(authHeaders, isReadonly)) {
            throw new AuthMissingException();
        }
        let authRequestConfig = {
            headers: authHeaders,
        };
        return merge({}, existingConfig, authRequestConfig);
    })
        .catch((error) => {
        if (error instanceof ApiAdapterException) {
            throw error;
        }
        else {
            throw new AuthException();
        }
    });
}
/**
 *
 * @param existingConfig
 */
export function generateApiAdapterRequestConfig(existingConfig) {
    const defaultConfig = {
        withCredentials: true,
    };
    return merge({}, defaultConfig, existingConfig);
}
export function handleOverrideError(altHandler, config, errorData) {
    return (error) => {
        if (config === null || config === void 0 ? void 0 : config.onError) {
            let thisError = error;
            if (!(thisError instanceof OverrideApiException)) {
                thisError = new OverrideApiException(errorData, 'API ERROR');
            }
            throw thisError;
        }
        else {
            altHandler(error);
        }
    };
}
/**
 *
 * @param authUrl
 * @param isReadonly
 */
export function generateApiAdapter(authUrl, isReadonly) {
    return {
        get: (apiPath, config) => generateAuthRequestConfig(authUrl, isReadonly, config)
            .then((requestConfig) => axios
            .get(apiPath, generateApiAdapterRequestConfig(requestConfig))
            .catch(handleOverrideError(handleApiException, config, { apiPath })))
            .then(validateApiAdapterResponse)
            .catch(handleOverrideError(handleApiAdapterException, config, { apiPath })),
        delete: (apiPath, config) => generateAuthRequestConfig(authUrl, isReadonly, config)
            .then((requestConfig) => axios
            .delete(apiPath, generateApiAdapterRequestConfig(requestConfig))
            .catch(handleOverrideError(handleApiException, config, { apiPath })))
            .then(validateApiAdapterResponse)
            .catch(handleOverrideError(handleApiAdapterException, config, { apiPath })),
        head: axios.head,
        post: (apiPath, data, config) => generateAuthRequestConfig(authUrl, isReadonly, config)
            .then((requestConfig) => axios
            .post(apiPath, data, generateApiAdapterRequestConfig(requestConfig))
            .catch(handleOverrideError(handleApiException, config, { apiPath, data })))
            .then(validateApiAdapterResponse)
            .catch(handleOverrideError(handleApiAdapterException, config, { apiPath, data })),
        put: (apiPath, data, config) => generateAuthRequestConfig(authUrl, isReadonly, config)
            .then((requestConfig) => axios
            .put(apiPath, data, generateApiAdapterRequestConfig(requestConfig))
            .catch(handleOverrideError(handleApiException, config, { apiPath, data })))
            .then(validateApiAdapterResponse)
            .catch(handleOverrideError(handleApiAdapterException, config, { apiPath, data })),
        patch: axios.patch,
    };
}
