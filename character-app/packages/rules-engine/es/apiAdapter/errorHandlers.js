import axios from 'axios';
import { LoggerUtils } from '../logger';
import { ApiException } from './errors';
export function handleApiException(error) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    // only do something if not canceled, cancellation should be fine
    if (axios.isCancel(error)) {
        throw error;
    }
    else {
        throw new ApiException((_a = error.config.url) !== null && _a !== void 0 ? _a : null, (_c = (_b = error.response) === null || _b === void 0 ? void 0 : _b.status) !== null && _c !== void 0 ? _c : null, (_d = error.config.method) !== null && _d !== void 0 ? _d : null, {
            params: (_e = error.config.params) !== null && _e !== void 0 ? _e : null,
            data: (_f = error.config.data) !== null && _f !== void 0 ? _f : null,
            serverErrorData: (_j = (_h = (_g = error.response) === null || _g === void 0 ? void 0 : _g.data) === null || _h === void 0 ? void 0 : _h.data) !== null && _j !== void 0 ? _j : [],
        });
    }
}
export function handleApiAdapterException(error) {
    LoggerUtils.logError(error);
    throw error;
}
