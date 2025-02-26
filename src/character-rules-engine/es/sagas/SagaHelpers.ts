import { call } from 'redux-saga/effects';
import * as ApiAdapterUtils from '../apiAdapter/utils';

export function* getApiRequestData<T>(
  apiMakeRequest: any, 
  requestParams?: any, 
  apiAdapterConfig?: any
): Generator<any, T, any> {
    const response = yield call(sendApiRequest, apiMakeRequest, requestParams, apiAdapterConfig);
    return ApiAdapterUtils.getResponseData(response);
}

export function* sendApiRequest(
  apiMakeRequest: any, 
  requestParams?: any, 
  apiAdapterConfig?: any
): Generator<any, any, any> {
    const response = yield call(apiMakeRequest, requestParams, apiAdapterConfig);
    return response;
} 