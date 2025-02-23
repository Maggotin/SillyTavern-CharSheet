import { DefinitionGenerators } from '../Definition';
/**
 *
 * @param race
 */
export function getAvatarUrl(race) {
    return race.avatarUrl;
}
/**
 *
 * @param race
 */
export function getLargeAvatarUrl(race) {
    return race.largeAvatarUrl;
}
/**
 *
 * @param race
 */
export function getPortraitAvatarUrl(race) {
    return race.portraitAvatarUrl;
}
/**
 *
 * @param race
 */
export function getMoreDetailsUrl(race) {
    return race.moreDetailsUrl;
}
/**
 *
 * @param race
 */
export function getBaseName(race) {
    return race.baseName;
}
/**
 *
 * @param race
 */
export function getBaseRaceId(race) {
    return race.baseRaceId;
}
/**
 *
 * @param race
 */
export function getBaseRaceName(race) {
    return race.baseRaceName;
}
/**
 *
 * @param race
 */
export function getBaseRaceTypeId(race) {
    return race.baseRaceTypeId;
}
/**
 *
 * @param race
 */
export function getDescription(race) {
    return race.description;
}
/**
 *
 * @param race
 */
export function getEntityRaceId(race) {
    return race.entityRaceId;
}
/**
 *
 * @param race
 */
export function getEntityRaceTypeId(race) {
    return race.entityRaceTypeId;
}
/**
 *
 * @param race
 */
export function getFeatIds(race) {
    var _a;
    return (_a = race.featIds) !== null && _a !== void 0 ? _a : [];
}
/**
 *
 * @param race
 */
export function getFullName(race) {
    return race.fullName;
}
/**
 *
 * @param race
 */
export function getGroupIds(race) {
    var _a;
    return (_a = race.groupIds) !== null && _a !== void 0 ? _a : [];
}
/**
 *
 * @param race
 */
export function getIsHomebrew(race) {
    return race.isHomebrew;
}
/**
 *
 * @param race
 */
export function getIsSubRace(race) {
    return race.isSubRace;
}
/**
 *
 * @param race
 */
export function getSizeInfo(race) {
    return race.sizeInfo;
}
/**
 *
 * @param race
 */
export function getSize(race) {
    return race.size;
}
/**
 *
 * @param race
 */
export function getSizeId(race) {
    return race.sizeId;
}
/**
 *
 * @param race
 */
export function getSubRaceShortName(race) {
    return race.subRaceShortName;
}
/**
 *
 * @param race
 */
export function getDefinitionRacialTraits(race) {
    var _a;
    return (_a = race.racialTraits) !== null && _a !== void 0 ? _a : [];
}
/**
 *
 * @param race
 */
export function getType(race) {
    return race.type;
}
/**
 *
 * @param race
 */
export function getVisibleRacialTraits(race) {
    return race.visibleRacialTraits;
}
/**
 *
 * @param race
 */
export function getWeightSpeeds(race) {
    return race.weightSpeeds;
}
/**
 *
 * @param race
 */
export function getRacialTraits(race) {
    return race.racialTraits;
}
/**
 *
 * @param race
 */
export function getFeats(race) {
    return race.feats;
}
/**
 *
 * @param race
 */
export function getModifiers(race) {
    return race.modifiers;
}
/**
 *
 * @param race
 */
export function getActions(race) {
    return race.actions;
}
/**
 *
 * @param race
 */
export function getSpells(race) {
    return race.spells;
}
/**
 *
 * @param race
 */
export function getDefinitionSources(race) {
    var _a;
    return (_a = race.sources) !== null && _a !== void 0 ? _a : [];
}
/**
 *
 * @param race
 */
export function getSources(race) {
    return getDefinitionSources(race);
}
/**
 * This will be replaced once we have definitionKey on the entity, so no need to derive it
 * @param race
 */
export function getDefinitionKey(race) {
    return DefinitionGenerators.generateDefinitionKey(getEntityRaceTypeId(race).toString(), getEntityRaceId(race).toString());
}
/**
 *
 * @param race
 */
export function getSpellListIds(race) {
    return race.spellListIds;
}
/**
 *
 * @param race
 */
export function getOptionalOrigins(race) {
    return race.optionalOrigins;
}
/**
 *
 * @param race
 */
export function getCalledOutRacialTraits(race) {
    return race.calledOutRacialTraits;
}
export function getIsLegacy(race) {
    return race.isLegacy;
}
