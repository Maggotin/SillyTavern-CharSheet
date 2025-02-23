/**
 *
 * @param charClass
 */
export function getDefinition(charClass) {
    return charClass.definition;
}
/**
 * @param charClass
 */
export function getName(charClass) {
    var _a, _b;
    return (_b = (_a = charClass.definition) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param charClass
 */
export function getId(charClass) {
    var _a, _b;
    return (_b = (_a = charClass.definition) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : -1;
}
/**
 *
 * @param charClass
 */
export function getDefinitionHitDiceType(charClass) {
    var _a, _b;
    return (_b = (_a = charClass.definition) === null || _a === void 0 ? void 0 : _a.hitDice) !== null && _b !== void 0 ? _b : 0;
}
/**
 *
 * @param charClass
 */
export function getHitDiceType(charClass) {
    return getDefinitionHitDiceType(charClass);
}
/**
 *
 * @param charClass
 */
export function getDefinitionSpellcastingStatId(charClass) {
    var _a, _b;
    return (_b = (_a = charClass.definition) === null || _a === void 0 ? void 0 : _a.spellCastingAbilityId) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param charClass
 */
export function getDefinitionSpellContainerName(charClass) {
    var _a, _b;
    return (_b = (_a = charClass.definition) === null || _a === void 0 ? void 0 : _a.spellContainerName) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param charClass
 */
export function getSpellContainerName(charClass) {
    return getDefinitionSpellContainerName(charClass);
}
/**
 *
 * @param charClass
 */
export function getDefinitionKnowsAllSpells(charClass) {
    var _a, _b;
    return (_b = (_a = charClass.definition) === null || _a === void 0 ? void 0 : _a.knowsAllSpells) !== null && _b !== void 0 ? _b : null;
}
export function getKnowsAllSpells(charClass) {
    return getDefinitionKnowsAllSpells(charClass);
}
/**
 *
 * @param charClass
 */
export function getDefinitionSpellPrepareType(charClass) {
    var _a, _b;
    return (_b = (_a = charClass.definition) === null || _a === void 0 ? void 0 : _a.spellPrepareType) !== null && _b !== void 0 ? _b : null;
}
export function getSpellPrepareType(charClass) {
    return getDefinitionSpellPrepareType(charClass);
}
/**
 *
 * @param charClass
 */
export function getDefinitionSpellCastingLearningStyle(charClass) {
    var _a, _b;
    return (_b = (_a = charClass.definition) === null || _a === void 0 ? void 0 : _a.spellCastingLearningStyle) !== null && _b !== void 0 ? _b : null;
}
export function getSpellCastingLearningStyle(charClass) {
    return charClass.spellCastingLearningStyle;
}
/**
 *
 * @param charClass
 */
export function getPortraitUrl(charClass) {
    var _a, _b;
    return (_b = (_a = charClass.definition) === null || _a === void 0 ? void 0 : _a.portraitAvatarUrl) !== null && _b !== void 0 ? _b : '';
}
/**
 *
 * @param charClass
 */
export function getAvatarUrl(charClass) {
    var _a, _b;
    return (_b = (_a = charClass.definition) === null || _a === void 0 ? void 0 : _a.avatarUrl) !== null && _b !== void 0 ? _b : '';
}
/**
 *
 * @param charClass
 */
export function getLargeAvatarUrl(charClass) {
    var _a, _b;
    return (_b = (_a = charClass.definition) === null || _a === void 0 ? void 0 : _a.largeAvatarUrl) !== null && _b !== void 0 ? _b : '';
}
/**
 *
 * @param charClass
 */
export function isKnownSpellcaster(charClass) {
    const spellRules = getSpellRules(charClass);
    return spellRules.isKnownSpellcaster;
}
/**
 *
 * @param charClass
 */
export function isPreparedSpellcaster(charClass) {
    const spellRules = getSpellRules(charClass);
    return spellRules.isPreparedSpellcaster;
}
/**
 *
 * @param charClass
 */
export function isSpellbookSpellcaster(charClass) {
    const spellRules = getSpellRules(charClass);
    return spellRules.isSpellbookSpellcaster;
}
/**
 *
 * @param charClass
 */
export function isRitualSpellCaster(charClass) {
    const spellRules = getSpellRules(charClass);
    return spellRules.isRitualSpellCaster;
}
/**
 *
 * @param charClass
 */
export function getCanCastSpells(charClass) {
    getDefinitionCanCastSpells(charClass);
}
/**
 *
 * @param charClass
 */
export function getDefinitionCanCastSpells(charClass) {
    var _a, _b;
    return (_b = (_a = charClass.definition) === null || _a === void 0 ? void 0 : _a.canCastSpells) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param charClass
 */
export function getDefinitionDescription(charClass) {
    var _a, _b;
    return (_b = (_a = charClass.definition) === null || _a === void 0 ? void 0 : _a.description) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param charClass
 */
export function getDescription(charClass) {
    return getDefinitionDescription(charClass);
}
/**
 *
 * @param charClass
 */
export function getDefinitionEquipmentDescription(charClass) {
    var _a, _b;
    return (_b = (_a = charClass.definition) === null || _a === void 0 ? void 0 : _a.equipmentDescription) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param charClass
 */
export function getEquipmentDescription(charClass) {
    return getDefinitionEquipmentDescription(charClass);
}
/**
 *
 * @param charClass
 */
export function getMoreDetailsUrl(charClass) {
    return getDefinitionMoreDetailsUrl(charClass);
}
/**
 *
 * @param charClass
 */
export function getDefinitionMoreDetailsUrl(charClass) {
    var _a, _b;
    return (_b = (_a = charClass.definition) === null || _a === void 0 ? void 0 : _a.moreDetailsUrl) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param charClass
 */
export function getDefinitionParentClassId(charClass) {
    var _a, _b;
    return (_b = (_a = charClass.definition) === null || _a === void 0 ? void 0 : _a.parentClassId) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param charClass
 */
export function getParentClassId(charClass) {
    return getDefinitionParentClassId(charClass);
}
/**
 *
 * @param charClass
 */
export function getDefinitionSubclassDefinition(charClass) {
    var _a, _b;
    return (_b = (_a = charClass.definition) === null || _a === void 0 ? void 0 : _a.subclassDefinition) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param charClass
 */
export function getWealthDice(charClass) {
    return getDefinitionWealthDice(charClass);
}
/**
 *
 * @param charClass
 */
export function getDefinitionWealthDice(charClass) {
    var _a, _b;
    return (_b = (_a = charClass.definition) === null || _a === void 0 ? void 0 : _a.wealthDice) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param charClass
 */
export function getDefinitionClassFeatures(charClass) {
    var _a;
    return (_a = charClass.classFeatures) !== null && _a !== void 0 ? _a : [];
}
/**
 *
 * @param charClass
 */
export function getMappingEntityTypeId(charClass) {
    return charClass.entityTypeId;
}
/**
 *
 * @param charClass
 */
export function getHitDiceUsed(charClass) {
    return charClass.hitDiceUsed;
}
/**
 *
 * @param charClass
 */
export function getMappingId(charClass) {
    return charClass.id;
}
/**
 *
 * @param charClass
 */
export function isStartingClass(charClass) {
    return charClass.isStartingClass;
}
/**
 *
 * @param charClass
 */
export function getLevel(charClass) {
    return charClass.level;
}
/**
 *
 * @param charClass
 */
export function getSubclassName(charClass) {
    var _a, _b;
    return (_b = (_a = charClass.subclassDefinition) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param charClass
 */
export function getSubclass(charClass) {
    return charClass.subclassDefinition;
}
/**
 * this field will always return null until character service updates to populate it
 * @param charClass
 */
export function getSubclassDefinitionId(charClass) {
    return charClass.subclassDefinitionId;
}
/**
 *
 * @param charClass
 */
export function isPactMagicActive(charClass) {
    return charClass.isPactMagicActive;
}
/**
 *
 * @param charClass
 */
export function isSpellcastingActive(charClass) {
    return charClass.isSpellcastingActive;
}
/**
 *
 * @param charClass
 */
export function getSlug(charClass) {
    return charClass.slug;
}
/**
 *
 * @param charClass
 */
export function getSpellRules(charClass) {
    return charClass.spellRules;
}
/**
 *
 * @param charClass
 */
export function getActions(charClass) {
    return charClass.actions;
}
/**
 *
 * @param charClass
 */
export function getActiveClassFeatures(charClass) {
    return charClass.activeClassFeatures;
}
/**
 * @deprecated only used for typescript parody because of spells being in two different states within the same location
 * @param charClass
 */
export function getBaseClassSpells(charClass) {
    return charClass.spells;
}
/**
 *
 * @param charClass
 */
export function getClassFeatures(charClass) {
    var _a;
    return (_a = charClass.classFeatures) !== null && _a !== void 0 ? _a : [];
}
/**
 *
 * @param charClass
 */
export function getEnablesHexWeapon(charClass) {
    return charClass.enablesHexWeapon;
}
/**
 *
 * @param charClass
 */
export function getEnablesPactWeapon(charClass) {
    return charClass.enablesPactWeapon;
}
/**
 *
 * @param charClass
 */
export function getEnablesDedicatedWeapon(charClass) {
    return charClass.enablesDedicatedWeapon;
}
/**
 *
 * @param charClass
 */
export function getFeats(charClass) {
    return charClass.feats;
}
/**
 *
 * @param charClass
 */
export function getFeatureSpells(charClass) {
    return charClass.featureSpells;
}
/**
 *
 * @param charClass
 */
export function getModifiers(charClass) {
    return charClass.modifiers;
}
/**
 *
 * @param charClass
 */
export function getOrderedClassFeatures(charClass) {
    return charClass.orderedClassFeatures;
}
/**
 *
 * @param charClass
 */
export function getSpells(charClass) {
    return charClass.spells;
}
/**
 *
 * @param charClass
 */
export function getUniqueClassFeatures(charClass) {
    return charClass.uniqueClassFeatures;
}
/**
 *
 * @param charClass
 */
export function getVisibileClassFeatures(charClass) {
    return charClass.visibleClassFeatures;
}
/**
 *
 * @param charClass
 */
export function getActiveId(charClass) {
    return charClass.activeId;
}
/**
 *
 * @param charClass
 */
export function getDefinitionPrimaryAbilities(charClass) {
    var _a, _b;
    return (_b = (_a = charClass.definition) === null || _a === void 0 ? void 0 : _a.primaryAbilities) !== null && _b !== void 0 ? _b : [];
}
/**
 *
 * @param charClass
 */
export function getPrimaryAbilities(charClass) {
    return getDefinitionPrimaryAbilities(charClass);
}
/**
 *
 * @param charClass
 */
export function getDefinitionPrerequisites(charClass) {
    var _a, _b;
    return (_b = (_a = charClass.definition) === null || _a === void 0 ? void 0 : _a.prerequisites) !== null && _b !== void 0 ? _b : [];
}
/**
 *
 * @param charClass
 */
export function getPrerequisites(charClass) {
    return getDefinitionPrerequisites(charClass);
}
/**
 *
 * @param charClass
 */
export function getDefinitionSpellConfiguration(charClass) {
    var _a, _b;
    return (_b = (_a = charClass.definition) === null || _a === void 0 ? void 0 : _a.spellRules) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param charClass
 */
export function getSpellConfiguration(charClass) {
    return getDefinitionSpellConfiguration(charClass);
}
/**
 *
 * @param charClass
 */
export function getDefinitionSources(charClass) {
    var _a, _b;
    return (_b = (_a = charClass.definition) === null || _a === void 0 ? void 0 : _a.sources) !== null && _b !== void 0 ? _b : [];
}
/**
 *
 * @param charClass
 */
export function getSources(charClass) {
    return getDefinitionSources(charClass);
}
/**
 *
 * @param charClass
 */
export function getDefinitionIsHomebrew(charClass) {
    var _a, _b;
    return (_b = (_a = charClass.definition) === null || _a === void 0 ? void 0 : _a.isHomebrew) !== null && _b !== void 0 ? _b : false;
}
/**
 *
 * @param charClass
 */
export function isHomebrew(charClass) {
    return getDefinitionIsHomebrew(charClass);
}
/**
 *
 * @param charClass
 */
export function getSpellListIds(charClass) {
    return charClass.spellListIds;
}
/**
 *
 * @param charClass
 */
export function getOptionalClassFeatures(charClass) {
    return charClass.optionalClassFeatures;
}
