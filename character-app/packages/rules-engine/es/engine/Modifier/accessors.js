/**
 *
 * @param modifier
 */
export function getComponentId(modifier) {
    return modifier.componentId;
}
/**
 *
 * @param modifier
 */
export function getComponentTypeId(modifier) {
    return modifier.componentTypeId;
}
/**
 *
 * @param modifier
 */
export function getDice(modifier) {
    return modifier.dice;
}
/**
 *
 * @param modifier
 */
export function getStatId(modifier) {
    return modifier.statId;
}
/**
 *
 * @param modifier
 */
export function getSubType(modifier) {
    return modifier.subType;
}
/**
 *
 * @param modifier
 */
export function getType(modifier) {
    return modifier.type;
}
/**
 *
 * @param modifier
 */
export function getFriendlyTypeName(modifier) {
    return modifier.friendlyTypeName;
}
/**
 *
 * @param modifier
 */
export function getFriendlySubtypeName(modifier) {
    return modifier.friendlySubtypeName;
}
/**
 *
 * @param modifier
 */
export function getRestriction(modifier) {
    return modifier.restriction;
}
/**
 *
 * @param modifier
 */
export function getValue(modifier) {
    return modifier.value;
}
/**
 *
 * @param modifier
 */
export function getEntityId(modifier) {
    return modifier.entityId;
}
/**
 *
 * @param modifier
 */
export function getEntityTypeId(modifier) {
    return modifier.entityTypeId;
}
/**
 *
 * @param modifier
 */
export function getEntityKey(modifier) {
    return `${getEntityId(modifier)}-${getEntityTypeId(modifier)}`;
}
/**
 *
 * @param modifier
 */
export function isGranted(modifier) {
    return modifier.isGranted;
}
/**
 *
 * @param modifier
 */
export function getDataOrigin(modifier) {
    return modifier.dataOrigin;
}
/**
 *
 * @param modifier
 */
export function getDataOriginType(modifier) {
    const dataOrigin = getDataOrigin(modifier);
    return dataOrigin.type;
}
/**
 *
 * @param modifier
 */
export function getBonusTypes(modifier) {
    var _a;
    return (_a = modifier.bonusTypes) !== null && _a !== void 0 ? _a : [];
}
/**
 *
 * @param modifier
 */
export function getId(modifier) {
    return modifier.id;
}
/**
 *
 * @param modifier
 */
export function requiresAttunement(modifier) {
    return modifier.requiresAttunement;
}
/**
 *
 * @param modifier
 */
export function getAtHigherLevels(modifier) {
    return modifier.atHigherLevels;
}
/**
 *
 * @param modifier
 */
export function getCount(modifier) {
    return modifier.count;
}
/**
 *
 * @param modifier
 */
export function getDie(modifier) {
    return modifier.die;
}
/**
 *
 * @param modifier
 */
export function getDurationUnit(modifier) {
    return modifier.durationUnit;
}
/**
 *
 * @param modifier
 */
export function getUsePrimaryStat(modifier) {
    return modifier.usePrimaryStat;
}
/**
 *
 * @param modifier
 */
export function getValueTotal(modifier) {
    var _a;
    return (_a = modifier.valueTotal) !== null && _a !== void 0 ? _a : 0;
}
/**
 *
 * @param modifier
 */
export function isAvailableToMulticlass(modifier) {
    return modifier.availableToMulticlass;
}
