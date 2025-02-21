/**
 *
 * @param condition
 */
export function getUniqueKey(condition) {
    return `${getId(condition)}-${getEntityTypeId(condition)}`;
}
/**
 *
 * @param condition
 */
export function getContractId(condition) {
    return condition.id;
}
/**
 *
 * @param condition
 */
export function getContractLevel(condition) {
    return condition.level;
}
/**
 *
 * @param condition
 */
export function getDescription(condition) {
    return getDefinitionDescription(condition);
}
export function getDefinitionDescription(condition) {
    var _a, _b;
    return (_b = (_a = condition.definition) === null || _a === void 0 ? void 0 : _a.description) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param condition
 */
export function getEntityTypeId(condition) {
    return getDefinitionEntityTypeId(condition);
}
/**
 *
 * @param condition
 */
export function getDefinitionEntityTypeId(condition) {
    var _a, _b;
    return (_b = (_a = condition.definition) === null || _a === void 0 ? void 0 : _a.entityTypeId) !== null && _b !== void 0 ? _b : -1;
}
/**
 *
 * @param condition
 */
export function getId(condition) {
    return getDefinitionId(condition);
}
/**
 *
 * @param condition
 */
export function getDefinitionId(condition) {
    var _a, _b;
    return (_b = (_a = condition.definition) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : -1;
}
/**
 *
 * @param condition
 */
export function getDefinitionLevels(condition) {
    var _a, _b;
    return (_b = (_a = condition.definition) === null || _a === void 0 ? void 0 : _a.levels) !== null && _b !== void 0 ? _b : [];
}
/**
 *
 * @param condition
 */
export function getName(condition) {
    return getDefinitionName(condition);
}
/**
 *
 * @param condition
 */
export function getDefinitionName(condition) {
    var _a, _b;
    return (_b = (_a = condition.definition) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : '';
}
/**
 *
 * @param condition
 */
export function getSlug(condition) {
    return getDefinitionSlug(condition);
}
export function getDefinitionSlug(condition) {
    var _a, _b;
    return (_b = (_a = condition.definition) === null || _a === void 0 ? void 0 : _a.slug) !== null && _b !== void 0 ? _b : '';
}
/**
 *
 * @param condition
 */
export function getType(condition) {
    return getDefinitionType(condition);
}
/**
 *
 * @param condition
 */
export function getDefinitionType(condition) {
    var _a, _b;
    return (_b = (_a = condition.definition) === null || _a === void 0 ? void 0 : _a.type) !== null && _b !== void 0 ? _b : -1;
}
/**
 *
 * @param condition
 */
export function getLevels(condition) {
    return condition.levels;
}
/**
 *
 * @param condition
 */
export function getModifiers(condition) {
    return condition.modifiers;
}
/**
 *
 * @param condition
 */
export function getActiveLevel(condition) {
    return condition.level;
}
