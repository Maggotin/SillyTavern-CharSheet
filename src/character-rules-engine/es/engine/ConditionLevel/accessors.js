/**
 *
 * @param conditionLevel
 */
export function getUniqueKey(conditionLevel) {
    return `${getId(conditionLevel)}-${getEntityTypeId(conditionLevel)}`;
}
/**
 *
 * @param conditionLevel
 */
export function getEffect(conditionLevel) {
    return getDefinitionEffect(conditionLevel);
}
/**
 *
 * @param conditionLevel
 */
export function getDefinitionEffect(conditionLevel) {
    var _a, _b;
    return (_b = (_a = conditionLevel.definition) === null || _a === void 0 ? void 0 : _a.effect) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param conditionLevel
 */
export function getEntityTypeId(conditionLevel) {
    return getDefinitionEntityTypeId(conditionLevel);
}
/**
 *
 * @param conditionLevel
 */
export function getDefinitionEntityTypeId(conditionLevel) {
    var _a, _b;
    return (_b = (_a = conditionLevel.definition) === null || _a === void 0 ? void 0 : _a.entityTypeId) !== null && _b !== void 0 ? _b : -1;
}
/**
 *
 * @param conditionLevel
 */
export function getId(conditionLevel) {
    return getDefinitionId(conditionLevel);
}
/**
 *
 * @param conditionLevel
 */
export function getDefinitionId(conditionLevel) {
    var _a, _b;
    return (_b = (_a = conditionLevel.definition) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : -1;
}
/**
 *
 * @param conditionLevel
 */
export function getLevel(conditionLevel) {
    return getDefinitionLevel(conditionLevel);
}
/**
 *
 * @param conditionLevel
 */
export function getDefinitionLevel(conditionLevel) {
    var _a, _b;
    return (_b = (_a = conditionLevel.definition) === null || _a === void 0 ? void 0 : _a.level) !== null && _b !== void 0 ? _b : -1;
}
/**
 *
 * @param conditionLevel
 */
export function getModifiers(conditionLevel) {
    return conditionLevel.modifiers;
}
