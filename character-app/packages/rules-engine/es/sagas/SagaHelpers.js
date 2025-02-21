import { call } from 'redux-saga/effects';
import * as ApiAdapterUtils from '../apiAdapter/utils';
/**
 *
 * @param apiMakeRequest
 * @param requestParams
 */
export function* getApiRequestData(apiMakeRequest, requestParams, apiAdapterConfig) {
    const response = yield call(sendApiRequest, apiMakeRequest, requestParams, apiAdapterConfig);
    return ApiAdapterUtils.getResponseData(response);
}
/**
 *
 * @param apiMakeRequest
 * @param requestParams
 */
export function* sendApiRequest(apiMakeRequest, requestParams, apiAdapterConfig) {
    const response = yield call(apiMakeRequest, requestParams, apiAdapterConfig);
    return response;
}
