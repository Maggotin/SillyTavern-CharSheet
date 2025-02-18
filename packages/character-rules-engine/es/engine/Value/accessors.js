import { HelperUtils } from '../Helper';
import { generateEntityContextKey, generateEntityKey, generateUniqueKey } from './generators';
/**
 *
 * @param charValue
 */
export function getUniqueKey(charValue) {
    return generateUniqueKey(getTypeId(charValue), getValueId(charValue), getValueTypeId(charValue), getContextId(charValue), getContextTypeId(charValue));
}
/**
 *
 * @param charValue
 */
export function getEntityContextKey(charValue) {
    return generateEntityContextKey(getValueId(charValue), getValueTypeId(charValue), getContextId(charValue), getContextTypeId(charValue));
}
/**
 *
 * @param charValue
 */
export function getEntityKey(charValue) {
    return generateEntityKey(getValueId(charValue), getValueTypeId(charValue));
}
/**
 *
 * @param charValue
 */
export function getContextId(charValue) {
    return charValue.contextId;
}
/**
 *
 * @param charValue
 */
export function getContextTypeId(charValue) {
    return charValue.contextTypeId;
}
/**
 *
 * @param charValue
 */
export function getNotes(charValue) {
    var _a;
    return (_a = charValue === null || charValue === void 0 ? void 0 : charValue.notes) !== null && _a !== void 0 ? _a : null;
}
/**
 *
 * @param charValue
 */
export function getTypeId(charValue) {
    return charValue.typeId;
}
/**
 *
 * @param charValue
 */
export function getValue(charValue) {
    var _a;
    return (_a = charValue === null || charValue === void 0 ? void 0 : charValue.value) !== null && _a !== void 0 ? _a : null;
}
/**
 *
 * @param charValue
 */
export function getValueId(charValue) {
    return charValue.valueId;
}
/**
 * temporary to handle transition for ids/entityTypeIds from numbers to strings
 * @param charValue
 */
export function getValueIntId(charValue) {
    if (charValue.valueId !== null) {
        return HelperUtils.parseInputInt(charValue.valueId, -1);
    }
    return null;
}
/**
 *
 * @param charValue
 */
export function getValueTypeId(charValue) {
    return charValue.valueTypeId;
}
