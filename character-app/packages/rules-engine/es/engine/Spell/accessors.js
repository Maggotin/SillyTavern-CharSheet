import { ActivationAccessors } from '../Activation';
/**
 *
 * @param spell
 */
export function getDefinition(spell) {
    return spell.definition;
}
/**
 *
 * @param spell
 */
export function getUniqueKey(spell) {
    return spell.uniqueKey;
}
/**
 *
 * @param spell
 */
export function getDefinitionName(spell) {
    var _a, _b;
    return (_b = (_a = spell.definition) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param spell
 */
export function getAttackType(spell) {
    return getDefinitionAttackType(spell);
}
/**
 *
 * @param spell
 */
export function getDefinitionAttackType(spell) {
    var _a, _b;
    return (_b = (_a = spell.definition) === null || _a === void 0 ? void 0 : _a.attackType) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param spell
 */
export function getId(spell) {
    var _a, _b;
    return (_b = (_a = spell.definition) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : -1;
}
/**
 *
 * @param spell - The spell in question
 */
export function getSpellGroups(spell) {
    var _a;
    return ((_a = getDefinition(spell)) === null || _a === void 0 ? void 0 : _a.spellGroups) || [];
}
/**
 *
 * @param spell
 */
export function getDefinitionRange(spell) {
    var _a, _b;
    return (_b = (_a = spell.definition) === null || _a === void 0 ? void 0 : _a.range) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param spell
 */
export function getDefinitionRangeArea(spell) {
    var _a, _b;
    return (_b = (_a = spell.definition) === null || _a === void 0 ? void 0 : _a.rangeArea) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param spell
 */
export function getMappingId(spell) {
    return spell.id;
}
/**
 *
 * @param spell
 */
export function getMappingEntityTypeId(spell) {
    return spell.entityTypeId;
}
/**
 *
 * @param spell
 */
export function getLimitedUse(spell) {
    return spell.limitedUse;
}
/**
 *
 * @param spell
 */
export function getActivation(spell) {
    return spell.activation;
}
/**
 *
 * @param spell
 */
export function getDefinitionActivation(spell) {
    var _a, _b;
    return (_b = (_a = spell.definition) === null || _a === void 0 ? void 0 : _a.activation) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param spell
 */
export function getActivationTime(spell) {
    return ActivationAccessors.getTime(getActivation(spell));
}
/**
 *
 * @param spell
 */
export function getActivationType(spell) {
    return ActivationAccessors.getType(getActivation(spell));
}
/**
 *
 * @param spell
 */
export function getCastingTimeDescription(spell) {
    return getDefinitionCastingTimeDescription(spell);
}
/**
 *
 * @param spell
 */
export function getDefinitionCastingTimeDescription(spell) {
    var _a, _b;
    return (_b = (_a = spell.definition) === null || _a === void 0 ? void 0 : _a.castingTimeDescription) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param spell
 */
export function getTags(spell) {
    return getDefinitionTags(spell);
}
/**
 *
 * @param spell
 */
export function getDefinitionTags(spell) {
    var _a, _b;
    return (_b = (_a = spell.definition) === null || _a === void 0 ? void 0 : _a.tags) !== null && _b !== void 0 ? _b : [];
}
/**
 *
 * @param spell
 */
export function getDefinitionTempHpDice(spell) {
    var _a, _b;
    return (_b = (_a = spell.definition) === null || _a === void 0 ? void 0 : _a.tempHpDice) !== null && _b !== void 0 ? _b : [];
}
/**
 *
 * @param spell
 */
export function getConditions(spell) {
    return getDefinitionConditions(spell);
}
/**
 *
 * @param spell
 */
export function getDefinitionConditions(spell) {
    var _a, _b;
    return (_b = (_a = spell.definition) === null || _a === void 0 ? void 0 : _a.conditions) !== null && _b !== void 0 ? _b : [];
}
/**
 *
 * @param spell
 */
export function getDefinitionDamageEffect(spell) {
    var _a, _b;
    return (_b = (_a = spell.definition) === null || _a === void 0 ? void 0 : _a.damageEffect) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param spell
 */
export function getLevel(spell) {
    return getDefinitionLevel(spell);
}
/**
 *
 * @param spell
 */
export function getDefinitionLevel(spell) {
    var _a, _b;
    return (_b = (_a = spell.definition) === null || _a === void 0 ? void 0 : _a.level) !== null && _b !== void 0 ? _b : 0;
}
/**
 *
 * @param spell
 */
export function getSchool(spell) {
    return getDefinitionSchool(spell);
}
/**
 *
 * @param spell
 */
export function getDefinitionSchool(spell) {
    var _a, _b;
    return (_b = (_a = spell.definition) === null || _a === void 0 ? void 0 : _a.school) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param spell
 */
export function getDefinitionSnippet(spell) {
    var _a, _b;
    return (_b = (_a = spell.definition) === null || _a === void 0 ? void 0 : _a.snippet) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param spell
 */
export function getDescription(spell) {
    return getDefinitionDescription(spell);
}
/**
 *
 * @param spell
 */
export function getDefinitionDescription(spell) {
    var _a, _b;
    return (_b = (_a = spell.definition) === null || _a === void 0 ? void 0 : _a.description) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param spell
 */
export function getDefinitionIsHomebrew(spell) {
    var _a, _b;
    return (_b = (_a = spell.definition) === null || _a === void 0 ? void 0 : _a.isHomebrew) !== null && _b !== void 0 ? _b : false;
}
/**
 *
 * @param spell
 */
export function getVersion(spell) {
    return getDefinitionVersion(spell);
}
/**
 *
 * @param spell
 */
export function getDefinitionVersion(spell) {
    var _a, _b;
    return (_b = (_a = spell.definition) === null || _a === void 0 ? void 0 : _a.version) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param spell
 */
export function getUsesSpellSlot(spell) {
    if (isCantrip(spell)) {
        return false;
    }
    return spell.usesSpellSlot;
}
/**
 *
 * @param spell
 */
export function isDisplayAsAttack(spell) {
    return spell.displayAsAttack;
}
/**
 *
 * @param spell
 */
export function isAlwaysPrepared(spell) {
    return spell.alwaysPrepared;
}
/**
 *
 * @param spell
 */
export function isCantrip(spell) {
    return getLevel(spell) === 0;
}
/**
 *
 * @param spell
 */
export function isAttack(spell) {
    return getDefinitionRequiresAttackRoll(spell);
}
/**
 *
 * @param spell
 */
export function getDefinitionRequiresAttackRoll(spell) {
    var _a, _b;
    return (_b = (_a = spell.definition) === null || _a === void 0 ? void 0 : _a.requiresAttackRoll) !== null && _b !== void 0 ? _b : false;
}
/**
 *
 * @param spell
 */
export function asPartOfWeaponAttack(spell) {
    return getDefinitionAsPartOfWeaponAttack(spell);
}
/**
 *
 * @param spell
 */
export function getDefinitionAsPartOfWeaponAttack(spell) {
    var _a, _b;
    return (_b = (_a = spell.definition) === null || _a === void 0 ? void 0 : _a.asPartOfWeaponAttack) !== null && _b !== void 0 ? _b : false;
}
/**
 *
 * @param spell
 */
export function getToHit(spell) {
    return spell.toHit;
}
/**
 *
 * @param spell
 */
export function canRemove(spell) {
    return spell.canRemove;
}
/**
 *
 * @param spell
 */
export function canPrepare(spell) {
    return spell.canPrepare;
}
/**
 *
 * @param spell
 */
export function canAdd(spell) {
    return spell.canAdd;
}
/**
 *
 * @param spell
 */
export function getModifiers(spell) {
    return spell.modifiers;
}
/**
 *
 * @param spell
 */
export function getDefinitionModifiers(spell) {
    var _a, _b;
    return (_b = (_a = spell.definition) === null || _a === void 0 ? void 0 : _a.modifiers) !== null && _b !== void 0 ? _b : [];
}
/**
 *
 * @param spell
 */
export function getCastAtLevel(spell) {
    return spell.castAtLevel;
}
/**
 *
 * @param spell
 */
export function getCastOnlyAsRitual(spell) {
    return spell.castOnlyAsRitual;
}
/**
 *
 * @param spell
 */
export function getRitualCastingType(spell) {
    return spell.ritualCastingType;
}
/**
 *
 * @param spell
 */
export function getBaseLevelAtWill(spell) {
    return spell.baseLevelAtWill;
}
/**
 *
 * @param spell
 */
export function getConcentration(spell) {
    return getDefinitionConcentration(spell);
}
/**
 *
 * @param spell
 */
export function getDefinitionConcentration(spell) {
    var _a, _b;
    return (_b = (_a = spell.definition) === null || _a === void 0 ? void 0 : _a.concentration) !== null && _b !== void 0 ? _b : false;
}
/**
 *
 * @param spell
 */
export function getRitual(spell) {
    return getDefinitionRitual(spell);
}
/**
 *
 * @param spell
 */
export function getDefinitionRitual(spell) {
    var _a, _b;
    return (_b = (_a = spell.definition) === null || _a === void 0 ? void 0 : _a.ritual) !== null && _b !== void 0 ? _b : false;
}
/**
 *
 * @param spell
 */
export function isCustomized(spell) {
    return spell.isCustomized;
}
/**
 *
 * @param spell
 */
export function getDuration(spell) {
    return getDefinitionDuration(spell);
}
/**
 *
 * @param spell
 */
export function getDefinitionDuration(spell) {
    var _a, _b;
    return (_b = (_a = spell.definition) === null || _a === void 0 ? void 0 : _a.duration) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param spell
 */
export function getDefinitionHealing(spell) {
    var _a, _b;
    return (_b = (_a = spell.definition) === null || _a === void 0 ? void 0 : _a.healing) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param spell
 */
export function getDefinitionHealingDice(spell) {
    var _a, _b;
    return (_b = (_a = spell.definition) === null || _a === void 0 ? void 0 : _a.healingDice) !== null && _b !== void 0 ? _b : [];
}
/**
 *
 * @param spell
 */
export function getComponents(spell) {
    return getDefinitionComponents(spell);
}
/**
 *
 * @param spell
 */
export function getDefinitionComponents(spell) {
    var _a, _b;
    return (_b = (_a = spell.definition) === null || _a === void 0 ? void 0 : _a.components) !== null && _b !== void 0 ? _b : [];
}
/**
 *
 * @param spell
 */
export function getComponentsDescription(spell) {
    return getDefinitionComponentsDescription(spell);
}
/**
 *
 * @param spell
 */
export function getDefinitionComponentsDescription(spell) {
    var _a, _b;
    return (_b = (_a = spell.definition) === null || _a === void 0 ? void 0 : _a.componentsDescription) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param spell
 */
export function getRange(spell) {
    return spell.range;
}
/**
 *
 * @param spell
 */
export function getRescriction(spell) {
    return spell.restriction;
}
/**
 *
 * @param spell
 */
export function getAdditionalDescription(spell) {
    return spell.additionalDescription;
}
/**
 *
 * @param spell
 */
export function getRequiresAttackRoll(spell) {
    return getDefinitionRequiresAttackRoll(spell);
}
/**
 *
 * @param spell
 */
export function getRequiresSavingThrow(spell) {
    return getDefinitionRequiresSavingThrow(spell);
}
/**
 *
 * @param spell
 */
export function getDefinitionRequiresSavingThrow(spell) {
    var _a, _b;
    return (_b = (_a = spell.definition) === null || _a === void 0 ? void 0 : _a.requiresSavingThrow) !== null && _b !== void 0 ? _b : false;
}
/**
 *
 * @param spell
 */
export function getAtHigherLevels(spell) {
    return spell.atHigherLevels;
}
/**
 *
 * @param spell
 */
export function getDefinitionAtHigherLevels(spell) {
    var _a, _b;
    return (_b = (_a = spell.definition) === null || _a === void 0 ? void 0 : _a.atHigherLevels) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param spell
 */
export function getCanCastAtHigherLevel(spell) {
    return getDefinitionCanCastAtHigherLevel(spell);
}
/**
 *
 * @param spell
 */
export function getDefinitionCanCastAtHigherLevel(spell) {
    var _a, _b;
    return (_b = (_a = spell.definition) === null || _a === void 0 ? void 0 : _a.canCastAtHigherLevel) !== null && _b !== void 0 ? _b : false;
}
/**
 *
 * @param spell
 */
export function getAttackSaveValue(spell) {
    return spell.attackSaveValue;
}
/**
 *
 * @param spell
 */
export function getBonusFixedDamage(spell) {
    return spell.bonusFixedDamage;
}
/**
 *
 * @param spell
 */
export function getSaveDcAbility(spell) {
    return getDefinitionSaveDcAbility(spell);
}
/**
 *
 * @param spell
 */
export function getDefinitionSaveDcAbility(spell) {
    var _a, _b;
    return (_b = (_a = spell.definition) === null || _a === void 0 ? void 0 : _a.saveDcAbilityId) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param spell
 */
export function getDefinitionScaleType(spell) {
    var _a, _b;
    return (_b = (_a = spell.definition) === null || _a === void 0 ? void 0 : _a.scaleType) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param spell
 */
export function getScaleType(spell) {
    return getDefinitionScaleType(spell);
}
/**
 *
 * @param spell
 */
export function getNotes(spell) {
    return spell.notes;
}
/**
 *
 * @param spell
 */
export function getDataOrigin(spell) {
    return spell.dataOrigin;
}
/**
 *
 * @param spell
 */
export function getDataOriginType(spell) {
    const dataOrigin = getDataOrigin(spell);
    return dataOrigin.type;
}
/**
 *
 * @param spell
 */
export function getExpandedDataOriginRef(spell) {
    return spell.expandedDataOriginRef;
}
/**
 *
 * @param spell
 */
export function getAtWillLimitedUseLevel(spell) {
    return spell.atWillLimitedUseLevel;
}
/**
 *
 * @param spell
 */
export function getComponentId(spell) {
    return spell.componentId;
}
/**
 *
 * @param spell
 */
export function getComponentTypeId(spell) {
    return spell.componentTypeId;
}
/**
 *
 * @param spell
 */
export function countsAsKnownSpell(spell) {
    return spell.countsAsKnownSpell;
}
/**
 *
 * @param spell
 */
export function getSpellCastingAbilityId(spell) {
    return spell.spellCastingAbilityId;
}
/**
 *
 * @param spell
 */
export function getOverrideSaveDc(spell) {
    return spell.overrideSaveDc;
}
/**
 *
 * @param spell
 */
export function getSpellListId(spell) {
    return spell.spellListId;
}
/**
 *
 * @param spell
 * @param useOverride
 */
export function getName(spell, useOverride = true) {
    var _a;
    if (useOverride && spell.name) {
        return spell.name;
    }
    return (_a = getDefinitionName(spell)) !== null && _a !== void 0 ? _a : '';
}
/**
 *
 * @param spell
 */
export function getCharacterLevel(spell) {
    return spell.characterLevel;
}
/**
 *
 * @param spell
 */
export function getEntity(spell) {
    return spell.entity;
}
/**
 *
 * @param spell
 */
export function getSpellcastingModifier(spell) {
    return spell.spellcastingModifier;
}
/**
 *
 * @param spell
 */
export function getDefinitionId(spell) {
    return spell.definitionId;
}
/**
 *
 * @param spell
 */
export function getIsSignatureSpell(spell) {
    return spell.isSignatureSpell;
}
/**
 * This is the mapping value of whether it is prepared, but may be false and the spell has
 * alwaysPrepared, so if you are checking for if the spell really is prepared use isPrepared()
 * @param spell
 */
export function getPrepared(spell) {
    return spell.prepared;
}
/**
 *
 * @param spell
 */
export function isPrepared(spell) {
    return spell.isPrepared;
}
/**
 *
 * @param spell
 */
export function isRitual(spell) {
    return spell.isRitual;
}
/**
 * @param spell
 */
export function isActive(spell) {
    return spell.isActive;
}
/**
 *
 * @param spell
 */
export function isCastAsRitual(spell) {
    return spell.isCastAsRitual;
}
/**
 *
 * @param spell
 */
export function getDefinitionSources(spell) {
    var _a, _b;
    return (_b = (_a = spell.definition) === null || _a === void 0 ? void 0 : _a.sources) !== null && _b !== void 0 ? _b : [];
}
/**
 *
 * @param spell
 */
export function getSources(spell) {
    return getDefinitionSources(spell);
}
/**
 *
 * @param spell - The spell in question
 */
export function getSpellGroupInfoLookup(spell) {
    return spell.spellGroupInfoLookup;
}
/**
 *
 * @param spell
 */
export function isAtWill(spell) {
    return spell.isAtWill;
}
/**
 *
 * @param spell
 */
export function isLimitedUseAvailableAtScaledAmount(spell) {
    return spell.isLimitedUseAvailableAtScaledAmount;
}
/**
 *
 * @param spell
 */
export function getScaledAmount(spell) {
    return spell.scaledAmount;
}
/**
 *
 * @param spell
 */
export function getCastLevel(spell) {
    return spell.castLevel;
}
/**
 *
 * @param spell
 */
export function getMaxUses(spell) {
    return spell.maxUses;
}
/**
 *
 * @param spell
 */
export function getConsumedUses(spell) {
    return spell.consumedUses;
}
export function isLegacy(spell) {
    var _a, _b;
    return (_b = (_a = getDefinition(spell)) === null || _a === void 0 ? void 0 : _a.isLegacy) !== null && _b !== void 0 ? _b : false;
}
