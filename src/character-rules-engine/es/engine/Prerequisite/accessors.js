/**
 *
 * @param prerequisite
 */
export function getType(prerequisite) {
    return prerequisite.type;
}
/**
 *
 * @param prerequisite
 */
export function getValue(prerequisite) {
    return prerequisite.value;
}
/**
 *
 * @param prerequisite
 */
export function getEntityId(prerequisite) {
    return prerequisite.entityId;
}
/**
 *
 * @param prerequisite
 */
export function getEntityTypeId(prerequisite) {
    return prerequisite.entityTypeId;
}
/**
 *
 * @param prerequisite
 */
export function getEntityKey(prerequisite) {
    return `${getEntityId(prerequisite)}-${getEntityTypeId(prerequisite)}`;
}
/**
 *
 * @param prerequisite
 */
export function getFriendlySubtypeName(prerequisite) {
    return prerequisite.friendlySubTypeName;
}
/**
 *
 * @param prerequisite
 */
export function getFriendlyTypeName(prerequisite) {
    return prerequisite.friendlyTypeName;
}
/**
 *
 * @param prerequisiteGroup
 */
export function getPrerequisites(prerequisiteGroup) {
    var _a;
    return (_a = prerequisiteGroup.prerequisiteMappings) !== null && _a !== void 0 ? _a : [];
}
/**
 *
 * @param prerequisiteGroup
 */
export function getGroupDescription(prerequisiteGroup) {
    return prerequisiteGroup.description;
}
/**
 *
 * @param prerequisiteGrouping
 */
export function getDescription(prerequisiteGrouping) {
    return prerequisiteGrouping
        .filter((prerequisiteGroup) => !getHidePrerequisite(prerequisiteGroup))
        .map((prerequisiteGroup) => getGroupDescription(prerequisiteGroup))
        .join(' ');
}
/**
 *
 * @param prerequisite
 */
export function getSubType(prerequisite) {
    return prerequisite.subType;
}
/**
 * @param prerequisite
 */
export function getHidePrerequisite(prerequisite) {
    return prerequisite.hidePrerequisite;
}
