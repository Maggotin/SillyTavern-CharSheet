export function getId(extra) {
    return extra.id;
}
export function getMappingId(extra) {
    return extra.mappingId;
}
export function getMappingEntityTypeId(extra) {
    return extra.entityTypeId;
}
export function getUniqueKey(extra) {
    return `${getMappingId(extra)}-${getMappingEntityTypeId(extra)}`;
}
export function getName(extra) {
    return extra.name;
}
export function getSizeId(extra) {
    return extra.sizeId;
}
export function getSizeInfo(extra) {
    return extra.sizeInfo;
}
export function getType(extra) {
    return extra.type;
}
export function getSearchTags(extra) {
    return extra.searchTags;
}
export function getEnvironments(extra) {
    return extra.environments;
}
export function getTags(extra) {
    return extra.tags;
}
export function getMovementNames(extra) {
    return extra.movementNames;
}
export function getMovementInfo(extra) {
    return extra.movementInfo;
}
export function getAvatarUrl(extra) {
    return extra.avatarUrl;
}
export function getArmorClassInfo(extra) {
    return extra.armorClassInfo;
}
export function getHitPointInfo(extra) {
    return extra.hitPointInfo;
}
export function getNoteComponents(extra) {
    return extra.noteComponents;
}
export function getExtraType(extra) {
    return extra.extraType;
}
export function getFilterTypes(extra) {
    return extra.filterTypes;
}
export function getGroupId(extra) {
    return extra.groupId;
}
export function isCustomized(extra) {
    return extra.isCustomized;
}
export function getSources(extra) {
    return extra.sources;
}
export function getMetaText(extra) {
    return extra.metaText;
}
export function isHomebrew(extra) {
    return extra.isHomebrew;
}
