import { DataOriginDataInfoKeyEnum } from './constants';
/**
 *
 * @param ref
 * @param data
 */
export function getRefPrimary(ref, data) {
    var _a, _b, _c;
    return (_c = (_b = (_a = data === null || data === void 0 ? void 0 : data[ref.type]) === null || _a === void 0 ? void 0 : _a[ref.key]) === null || _b === void 0 ? void 0 : _b[DataOriginDataInfoKeyEnum.PRIMARY]) !== null && _c !== void 0 ? _c : null;
}
/**
 *
 * @param ref
 * @param data
 */
export function getRefParent(ref, data) {
    var _a, _b, _c;
    return (_c = (_b = (_a = data === null || data === void 0 ? void 0 : data[ref.type]) === null || _a === void 0 ? void 0 : _a[ref.key]) === null || _b === void 0 ? void 0 : _b[DataOriginDataInfoKeyEnum.PARENT]) !== null && _c !== void 0 ? _c : null;
}
