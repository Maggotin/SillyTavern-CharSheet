import { StatBlockTypeEnum } from './constants';
/**
 *
 * @param creature
 */
export function getUniqueKey(creature) {
    return `${getMappingId(creature)}-${getMappingEntityTypeId(creature)}`;
}
/**
 *
 * @param creature
 */
export function getMappingId(creature) {
    return creature.id;
}
/**
 *
 * @param creature
 */
export function getMappingEntityTypeId(creature) {
    return creature.entityTypeId;
}
/**
 *
 * @param creature
 */
export function isActive(creature) {
    return creature.isActive;
}
/**
 *
 * @param creature
 */
export function getRemoveHitPoints(creature) {
    return creature.removedHitPoints;
}
/**
 *
 * @param creature
 */
export function getTemporaryHitPoints(creature) {
    var _a;
    return (_a = creature.temporaryHitPoints) !== null && _a !== void 0 ? _a : 0;
}
/**
 *
 * @param creature
 */
export function getGroupId(creature) {
    return creature.groupId;
}
/**
 *
 * @param creature
 */
export function getId(creature) {
    return getDefinitionId(creature);
}
/**
 *
 * @param creature
 */
export function getDefinitionId(creature) {
    var _a, _b;
    return (_b = (_a = creature.definition) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : -1;
}
/**
 *
 * @param creature
 */
export function getEntityTypeId(creature) {
    return getDefinitionEntityTypeId(creature);
}
/**
 *
 * @param creature
 */
export function getDefinitionEntityTypeId(creature) {
    var _a, _b;
    return (_b = (_a = creature.definition) === null || _a === void 0 ? void 0 : _a.entityTypeId) !== null && _b !== void 0 ? _b : -1;
}
/**
 *
 * @param creature
 */
export function getName(creature) {
    var _a;
    return (_a = creature.name) !== null && _a !== void 0 ? _a : getDefinitionName(creature);
}
/**
 *
 * @param creature
 */
export function getDefinitionAlignmentId(creature) {
    var _a, _b;
    return (_b = (_a = creature.definition) === null || _a === void 0 ? void 0 : _a.alignmentId) !== null && _b !== void 0 ? _b : -1;
}
/**
 *
 * @param creature
 */
export function getAlignmentId(creature) {
    return creature.alignmentId;
}
/**
 *
 * @param creature
 */
export function getDefinitionSizeId(creature) {
    var _a, _b;
    return (_b = (_a = creature.definition) === null || _a === void 0 ? void 0 : _a.sizeId) !== null && _b !== void 0 ? _b : -1;
}
/**
 *
 * @param creature
 */
export function getSizeId(creature) {
    return creature.sizeId;
}
/**
 *
 * @param creature
 */
export function getSizeInfo(creature) {
    return creature.sizeInfo;
}
export function getDefinitionTypeId(creature) {
    var _a, _b;
    return (_b = (_a = creature.definition) === null || _a === void 0 ? void 0 : _a.typeId) !== null && _b !== void 0 ? _b : -1;
}
/**
 *
 * @param creature
 */
export function getTypeId(creature) {
    return creature.typeId;
}
/**
 *
 * @param creature
 */
export function getDefinitionArmorClass(creature) {
    var _a, _b;
    return (_b = (_a = creature.definition) === null || _a === void 0 ? void 0 : _a.armorClass) !== null && _b !== void 0 ? _b : 0;
}
/**
 *
 * @param creature
 */
export function getDefinitionName(creature) {
    var _a, _b;
    return (_b = (_a = creature.definition) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : '';
}
export function getArmorClassDescription(creature) {
    return getDefinitionArmorClassDescription(creature);
}
/**
 *
 * @param creature
 */
export function getDefinitionArmorClassDescription(creature) {
    var _a, _b;
    return (_b = (_a = creature.definition) === null || _a === void 0 ? void 0 : _a.armorClassDescription) !== null && _b !== void 0 ? _b : null;
}
export function getAverageHitPoints(creature) {
    return getDefinitionAverageHitPoints(creature);
}
/**
 *
 * @param creature
 */
export function getDefinitionAverageHitPoints(creature) {
    var _a, _b;
    return (_b = (_a = creature.definition) === null || _a === void 0 ? void 0 : _a.averageHitPoints) !== null && _b !== void 0 ? _b : 0;
}
/**
 *
 * @param creature
 */
export function getDefinitionStats(creature) {
    var _a, _b;
    return (_b = (_a = creature.definition) === null || _a === void 0 ? void 0 : _a.stats) !== null && _b !== void 0 ? _b : [];
}
/**
 *
 * @param creature
 */
export function getStats(creature) {
    return creature.stats;
}
/**
 *
 * @param creature
 */
export function getChallengeInfo(creature) {
    return creature.challengeInfo;
}
export function getLairChallengeInfo(creature) {
    return creature.lairChallengeInfo;
}
/**
 *
 * @param creature
 * @param fallback
 */
export function getChallengeProficiencyBonus(creature, fallback = 0) {
    var _a;
    const challengeInfo = getChallengeInfo(creature);
    return (_a = challengeInfo === null || challengeInfo === void 0 ? void 0 : challengeInfo.proficiencyBonus) !== null && _a !== void 0 ? _a : fallback;
}
/**
 *
 * @param creature
 */
export function getHitPointDice(creature) {
    return getDefinitionHitPointDice(creature);
}
/**
 *
 * @param creature
 */
export function getDefinitionHitPointDice(creature) {
    var _a, _b;
    return (_b = (_a = creature.definition) === null || _a === void 0 ? void 0 : _a.hitPointDice) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param creature
 */
export function getMovements(creature) {
    return getDefinitionMovements(creature);
}
/**
 *
 * @param creature
 */
export function getDefinitionMovements(creature) {
    var _a, _b;
    return (_b = (_a = creature.definition) === null || _a === void 0 ? void 0 : _a.movements) !== null && _b !== void 0 ? _b : [];
}
/**
 *
 * @param creature
 */
export function getMovementIds(creature) {
    return creature.movementIds;
}
export function getMovementNames(creature) {
    return creature.movementNames;
}
/**
 *
 * @param creature
 */
export function getDefinitionDamageAdjustments(creature) {
    var _a, _b;
    return (_b = (_a = creature.definition) === null || _a === void 0 ? void 0 : _a.damageAdjustments) !== null && _b !== void 0 ? _b : [];
}
/**
 *
 * @param creature
 */
export function getDamageAdjustments(creature) {
    return creature.damageAdjustments;
}
/**
 *
 * @param creature
 */
export function getDamageVulnerabilities(creature) {
    return creature.damageVulnerabilities;
}
/**
 *
 * @param creature
 */
export function getDamageImmunities(creature) {
    return creature.damageImmunities;
}
/**
 *
 * @param creature
 */
export function getDamageResistances(creature) {
    return creature.damageResistances;
}
/**
 *
 * @param creature
 */
export function getDefinitionConditionImmunities(creature) {
    var _a, _b;
    return (_b = (_a = creature.definition) === null || _a === void 0 ? void 0 : _a.conditionImmunities) !== null && _b !== void 0 ? _b : [];
}
/**
 *
 * @param creature
 */
export function getConditionImmunities(creature) {
    return creature.conditionImmunities;
}
/**
 *
 * @param creature
 */
export function getDefinitionSubTypes(creature) {
    var _a, _b;
    return (_b = (_a = creature.definition) === null || _a === void 0 ? void 0 : _a.subTypes) !== null && _b !== void 0 ? _b : [];
}
/**
 *
 * @param creature
 */
export function getSubTypes(creature) {
    return creature.subTypes;
}
/**
 *
 * @param creature
 */
export function getEnvironments(creature) {
    return getDefinitionEnvironments(creature);
}
/**
 *
 * @param creature
 */
export function getDefinitionEnvironments(creature) {
    var _a, _b;
    return (_b = (_a = creature.definition) === null || _a === void 0 ? void 0 : _a.environments) !== null && _b !== void 0 ? _b : [];
}
/**
 *
 * @param creature
 */
export function getTags(creature) {
    return getDefinitionTags(creature);
}
/**
 *
 * @param creature
 */
export function getDefinitionTags(creature) {
    var _a, _b;
    return (_b = (_a = creature.definition) === null || _a === void 0 ? void 0 : _a.tags) !== null && _b !== void 0 ? _b : [];
}
/**
 *
 * @param creature
 */
export function getSwarmInfo(creature) {
    return getDefinitionSwarmInfo(creature);
}
/**
 *
 * @param creature
 */
export function getDefinitionSwarmInfo(creature) {
    var _a, _b;
    return (_b = (_a = creature.definition) === null || _a === void 0 ? void 0 : _a.swarm) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param creature
 */
export function getDefinitionSkills(creature) {
    var _a, _b;
    return (_b = (_a = creature.definition) === null || _a === void 0 ? void 0 : _a.skills) !== null && _b !== void 0 ? _b : [];
}
/**
 *
 * @param creature
 */
export function getSkills(creature) {
    return creature.skills;
}
/**
 *
 * @param creature
 */
export function getDefinitionSavingThrows(creature) {
    var _a, _b;
    return (_b = (_a = creature.definition) === null || _a === void 0 ? void 0 : _a.savingThrows) !== null && _b !== void 0 ? _b : [];
}
/**
 *
 * @param creature
 */
export function getSavingThrows(creature) {
    return creature.savingThrows;
}
/**
 *
 * @param creature
 */
export function getSenses(creature) {
    return getDefinitionSenses(creature);
}
/**
 *
 * @param creature
 */
export function getDefinitionSenses(creature) {
    var _a, _b;
    return (_b = (_a = creature.definition) === null || _a === void 0 ? void 0 : _a.senses) !== null && _b !== void 0 ? _b : [];
}
/**
 *
 * @param creature
 */
export function getDefinitionPassivePerception(creature) {
    var _a, _b;
    return (_b = (_a = creature.definition) === null || _a === void 0 ? void 0 : _a.passivePerception) !== null && _b !== void 0 ? _b : 0;
}
/**
 *
 * @param creature
 */
export function getPassivePerception(creature) {
    return creature.passivePerception;
}
/**
 *
 * @param creature
 */
export function getLanguageDescription(creature) {
    return getDefinitionLanguageDescription(creature);
}
/**
 *
 * @param creature
 */
export function getDefinitionLanguageDescription(creature) {
    var _a, _b;
    return (_b = (_a = creature.definition) === null || _a === void 0 ? void 0 : _a.languageDescription) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param creature
 */
export function getLanguageNote(creature) {
    return getDefinitionLanguageNote(creature);
}
/**
 *
 * @param creature
 */
export function getDefinitionLanguageNote(creature) {
    var _a, _b;
    return (_b = (_a = creature.definition) === null || _a === void 0 ? void 0 : _a.languageNote) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param creature
 */
export function getLanguages(creature) {
    return getDefinitionLanguages(creature);
}
/**
 *
 * @param creature
 */
export function getDefinitionLanguages(creature) {
    var _a, _b;
    return (_b = (_a = creature.definition) === null || _a === void 0 ? void 0 : _a.languages) !== null && _b !== void 0 ? _b : [];
}
/**
 *
 * @param creature
 */
export function isHomebrew(creature) {
    return getDefinitionIsHomebrew(creature);
}
/**
 *
 * @param creature
 */
export function getDefinitionIsHomebrew(creature) {
    var _a, _b;
    return (_b = (_a = creature.definition) === null || _a === void 0 ? void 0 : _a.isHomebrew) !== null && _b !== void 0 ? _b : false;
}
/**
 *
 * @param creature
 */
export function getVersion(creature) {
    return getDefinitionVersion(creature);
}
/**
 *
 * @param creature
 */
export function getDefinitionVersion(creature) {
    var _a, _b;
    return (_b = (_a = creature.definition) === null || _a === void 0 ? void 0 : _a.version) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param creature
 */
export function getChallengeRatingId(creature) {
    return getDefinitionChallengeRatingId(creature);
}
/**
 *
 * @param creature
 */
export function getDefinitionChallengeRatingId(creature) {
    var _a, _b;
    return (_b = (_a = creature.definition) === null || _a === void 0 ? void 0 : _a.challengeRatingId) !== null && _b !== void 0 ? _b : -1;
}
export function getLairChallengeRatingId(creature) {
    var _a, _b;
    return (_b = (_a = creature.definition) === null || _a === void 0 ? void 0 : _a.lairChallengeRatingId) !== null && _b !== void 0 ? _b : -1;
}
export function getInitiative(creature) {
    var _a, _b;
    return (_b = (_a = creature.definition) === null || _a === void 0 ? void 0 : _a.initiative) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param creature
 */
export function isSwarm(creature) {
    return getSwarmInfo(creature) !== null;
}
/**
 *
 * @param creature
 */
export function isLegendary(creature) {
    return getDefinitionIsLegendary(creature);
}
/**
 *
 * @param creature
 */
export function getDefinitionIsLegendary(creature) {
    var _a, _b;
    return (_b = (_a = creature.definition) === null || _a === void 0 ? void 0 : _a.isLegendary) !== null && _b !== void 0 ? _b : false;
}
/**
 *
 * @param creature
 */
export function hasLair(creature) {
    return getDefinitionHasLair(creature);
}
/**
 *
 * @param creature
 */
export function getDefinitionHasLair(creature) {
    var _a, _b;
    return (_b = (_a = creature.definition) === null || _a === void 0 ? void 0 : _a.hasLair) !== null && _b !== void 0 ? _b : false;
}
/**
 *
 * @param creature
 */
export function getAvatarUrl(creature) {
    return getDefinitionAvatarUrl(creature);
}
/**
 *
 * @param creature
 */
export function getDefinitionAvatarUrl(creature) {
    var _a, _b;
    return (_b = (_a = creature.definition) === null || _a === void 0 ? void 0 : _a.avatarUrl) !== null && _b !== void 0 ? _b : '';
}
/**
 *
 * @param creature
 */
export function getLargeAvatarUrl(creature) {
    return getDefinitionLargeAvatarUrl(creature);
}
/**
 *
 * @param creature
 */
export function getDefinitionLargeAvatarUrl(creature) {
    var _a, _b;
    return (_b = (_a = creature.definition) === null || _a === void 0 ? void 0 : _a.largeAvatarUrl) !== null && _b !== void 0 ? _b : '';
}
/**
 *
 * @param creature
 */
export function getBasicAvatarUrl(creature) {
    return getDefinitionBasicAvatarUrl(creature);
}
/**
 *
 * @param creature
 */
export function getDefinitionBasicAvatarUrl(creature) {
    var _a, _b;
    return (_b = (_a = creature.definition) === null || _a === void 0 ? void 0 : _a.basicAvatarUrl) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param creature
 */
export function getSpecialTraitsDescription(creature) {
    return getDefinitionSpecialTraitsDescription(creature);
}
/**
 *
 * @param creature
 */
export function getDefinitionSpecialTraitsDescription(creature) {
    var _a, _b;
    return (_b = (_a = creature.definition) === null || _a === void 0 ? void 0 : _a.specialTraitsDescription) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param creature
 */
export function getActionsDescription(creature) {
    return getDefinitionActionsDescription(creature);
}
/**
 *
 * @param creature
 */
export function getDefinitionActionsDescription(creature) {
    var _a, _b;
    return (_b = (_a = creature.definition) === null || _a === void 0 ? void 0 : _a.actionsDescription) !== null && _b !== void 0 ? _b : null;
}
export function getBonusActionsDescription(creature) {
    var _a, _b;
    return (_b = (_a = creature.definition) === null || _a === void 0 ? void 0 : _a.bonusActionsDescription) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param creature
 */
export function getReactionsDescription(creature) {
    return getDefinitionReactionsDescription(creature);
}
/**
 *
 * @param creature
 */
export function getDefinitionReactionsDescription(creature) {
    var _a, _b;
    return (_b = (_a = creature.definition) === null || _a === void 0 ? void 0 : _a.reactionsDescription) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param creature
 */
export function getLegendaryActionsDescription(creature) {
    return getDefinitionLegendaryActionsDescription(creature);
}
/**
 *
 * @param creature
 */
export function getDefinitionLegendaryActionsDescription(creature) {
    var _a, _b;
    return (_b = (_a = creature.definition) === null || _a === void 0 ? void 0 : _a.legendaryActionsDescription) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param creature
 */
export function getCharacteristicsDescription(creature) {
    return getDefinitionCharacteristicsDescription(creature);
}
/**
 *
 * @param creature
 */
export function getDefinitionCharacteristicsDescription(creature) {
    var _a, _b;
    return (_b = (_a = creature.definition) === null || _a === void 0 ? void 0 : _a.characteristicsDescription) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param creature
 */
export function getLairDescription(creature) {
    return getDefinitionLairDescription(creature);
}
/**
 *
 * @param creature
 */
export function getDefinitionLairDescription(creature) {
    var _a, _b;
    return (_b = (_a = creature.definition) === null || _a === void 0 ? void 0 : _a.lairDescription) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param creature
 */
export function getArmorClass(creature) {
    return creature.armorClass;
}
/**
 *
 * @param creature
 */
export function getGroupInfo(creature) {
    return creature.groupInfo;
}
/**
 *
 * @param creature
 */
export function getEnvironmentTags(creature) {
    return creature.environmentTags;
}
/**
 *
 * @param creature
 */
export function getSubTypeTags(creature) {
    return creature.subTypeTags;
}
/**
 *
 * @param creature
 */
export function getTypeTag(creature) {
    return creature.typeTag;
}
/**
 *
 * @param creature
 */
export function getHitPointInfo(creature) {
    return creature.hitPointInfo;
}
/**
 *
 * @param creature
 */
export function getNotes(creature) {
    return creature.notes;
}
/**
 *
 * @param creature
 */
export function getGroupActionSnippet(creature) {
    var _a;
    const groupInfo = getGroupInfo(creature);
    return (_a = groupInfo === null || groupInfo === void 0 ? void 0 : groupInfo.actionSnippet) !== null && _a !== void 0 ? _a : null;
}
/**
 *
 * @param creature
 */
export function getLevel(creature) {
    return creature.level;
}
/**
 *
 * @param creature
 */
export function getInfusion(creature) {
    return creature.infusion;
}
/**
 *
 * @param creature
 */
export function getFlags(creature) {
    return creature.flags;
}
/**
 *
 * @param creature
 */
export function getDefinitionSources(creature) {
    var _a, _b;
    return (_b = (_a = creature.definition) === null || _a === void 0 ? void 0 : _a.sources) !== null && _b !== void 0 ? _b : [];
}
/**
 *
 * @param creature
 */
export function getSources(creature) {
    return getDefinitionSources(creature);
}
/**
 *
 * @param creature
 */
export function isCustomized(creature) {
    return creature.isCustomized;
}
/**
 *
 * @param creature
 */
export function getDefinitionHideCr(creature) {
    var _a, _b;
    return (_b = (_a = creature.definition) === null || _a === void 0 ? void 0 : _a.hideCr) !== null && _b !== void 0 ? _b : false;
}
/**
 *
 * @param creature
 */
export function getHideCr(creature) {
    return getDefinitionHideCr(creature);
}
/**
 *
 * @param creature
 */
export function getGear(creature) {
    var _a, _b;
    return (_b = (_a = creature.definition) === null || _a === void 0 ? void 0 : _a.gear) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param creature
 */
export function getSlug(creature) {
    var _a, _b;
    return (_b = (_a = creature.definition) === null || _a === void 0 ? void 0 : _a.slug) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param creature
 */
export function getStatBlockType(creature) {
    var _a, _b;
    return (_b = (_a = creature.definition) === null || _a === void 0 ? void 0 : _a.statBlockType) !== null && _b !== void 0 ? _b : StatBlockTypeEnum.CORE_RULES_2014;
}
/**
 *
 * @param creature
 */
export function getInitialTempHp(creature) {
    return creature.initialTempHp;
}
/**
 *
 * @param creature
 */
export function getUseOwnerHp(creature) {
    return creature.useOwnerHp;
}
