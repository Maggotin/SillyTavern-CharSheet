import { getId, getSubclass } from './accessors';
/**
 *
 * @param charClass
 * @param id
 */
export function isValidClassId(charClass, id) {
    var _a, _b;
    const subClassId = (_b = (_a = getSubclass(charClass)) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : -1;
    return id === getId(charClass) || id === subClassId;
}
