import { ApiAdapterDataException } from './errors';
export function validateApiAdapterResponse(response) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    if (!response.data) {
        throw new ApiAdapterDataException((_a = response.config.url) !== null && _a !== void 0 ? _a : null, response.status, (_b = response.config.method) !== null && _b !== void 0 ? _b : null, {
            params: (_c = response.config.params) !== null && _c !== void 0 ? _c : null,
            data: (_d = response.config.data) !== null && _d !== void 0 ? _d : null,
            responseData: response.data,
        }, 'Invalid JSON response, missing data object');
    }
    if (typeof response.data !== 'object') {
        throw new ApiAdapterDataException((_e = response.config.url) !== null && _e !== void 0 ? _e : null, response.status, (_f = response.config.method) !== null && _f !== void 0 ? _f : null, {
            params: (_g = response.config.params) !== null && _g !== void 0 ? _g : null,
            data: (_h = response.config.data) !== null && _h !== void 0 ? _h : null,
            responseData: response.data,
        }, 'Invalid JSON response, data object is a string');
    }
    return response;
}
export function validateCanRequest(authHeaders, isReadonly) {
    if (isReadonly) {
        return true;
    }
    if (Object.keys(authHeaders).length) {
        return true;
    }
    return false;
}
