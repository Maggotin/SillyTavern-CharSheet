/**
 *
 * @param choice
 */
export function getComponentId(choice) {
    return choice.componentId;
}
/**
 *
 * @param choice
 */
export function getComponentTypeId(choice) {
    return choice.componentTypeId;
}
/**
 *
 * @param choice
 */
export function getDefaultSubtypes(choice) {
    var _a;
    return (_a = choice.defaultSubtypes) !== null && _a !== void 0 ? _a : [];
}
/**
 *
 * @param choice
 */
export function getId(choice) {
    return choice.id;
}
/**
 *
 * @param choice
 */
export function isInfinite(choice) {
    return choice.isInfinite;
}
/**
 *
 * @param choice
 */
export function isOptional(choice) {
    return choice.isOptional;
}
/**
 *
 * @param choice
 */
export function getLabel(choice) {
    return choice.label;
}
/**
 *
 * @param choice
 */
export function getOptions(choice) {
    var _a;
    return (_a = choice.options) !== null && _a !== void 0 ? _a : [];
}
/**
 *
 * @param choice
 */
export function getOptionIds(choice) {
    var _a;
    return (_a = choice.optionIds) !== null && _a !== void 0 ? _a : [];
}
/**
 *
 * @param choice
 */
export function getDisplayOrder(choice) {
    return choice.displayOrder;
}
/**
 *
 * @param choice
 */
export function getOptionValue(choice) {
    return choice.optionValue;
}
/**
 *
 * @param choice
 */
export function getParentChoiceId(choice) {
    return choice.parentChoiceId;
}
/**
 *
 * @param choice
 */
export function getSubType(choice) {
    return choice.subType;
}
/**
 *
 * @param choice
 */
export function getType(choice) {
    return choice.type;
}
/**
 *
 * @param choice
 */
export function getDataOrigin(choice) {
    return choice.dataOrigin;
}
/**
 *
 * @param choice
 */
export function getUniqueKey(choice) {
    return getId(choice);
}
/**
 *
 * @param choice
 */
export function getTagConstraints(choice) {
    var _a;
    return (_a = choice.tagConstraints) !== null && _a !== void 0 ? _a : [];
}
