/**
 *
 * @param activation
 */
export function getTime(activation) {
    var _a;
    return (_a = activation === null || activation === void 0 ? void 0 : activation.activationTime) !== null && _a !== void 0 ? _a : null;
}
/**
 *
 * @param activation
 */
export function getType(activation) {
    var _a;
    return (_a = activation === null || activation === void 0 ? void 0 : activation.activationType) !== null && _a !== void 0 ? _a : null;
}
