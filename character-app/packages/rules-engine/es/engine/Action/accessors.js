/**
 *
 * @param action
 */
export function getDefinitionName(action) {
    return action.definition.name;
}
/**
 *
 * @param action
 */
export function getDefinitionAbilityModifierStatId(action) {
    return action.definition.abilityModifierStatId;
}
/**
 *
 * @param action
 */
export function getAbilityModifierStatId(action) {
    return getDefinitionAbilityModifierStatId(action);
}
/**
 *
 * @param action
 */
export function getDefinitionAttackSubtypeId(action) {
    return action.definition.attackSubtype;
}
/**
 *
 * @param action
 */
export function getAttackSubtypeId(action) {
    return getDefinitionAttackSubtypeId(action);
}
/**
 *
 * @param action
 */
export function getDefinitionAttackRangeId(action) {
    return action.definition.attackTypeRange;
}
/**
 *
 * @param action
 */
export function getAttackRangeId(action) {
    return getDefinitionAttackRangeId(action);
}
/**
 *
 * @param action
 */
export function getDefinitionActivation(action) {
    return action.definition.activation;
}
/**
 *
 * @param action
 */
export function getActivation(action) {
    return getDefinitionActivation(action);
}
/**
 *
 * @param action
 */
export function getDefinitionActionTypeId(action) {
    return action.definition.actionType;
}
/**
 *
 * @param action
 */
export function getActionTypeId(action) {
    return getDefinitionActionTypeId(action);
}
/**
 *
 * @param action
 */
export function getDefinitionDamageTypeId(action) {
    return action.definition.damageTypeId;
}
/**
 *
 * @param action
 */
export function getDamageTypeId(action) {
    return getDefinitionDamageTypeId(action);
}
/**
 *
 * @param action
 */
export function getDefinitionDescription(action) {
    return action.definition.description;
}
/**
 *
 * @param action
 */
export function getDescription(action) {
    return getDefinitionDescription(action);
}
/**
 *
 * @param action
 */
export function getDefinitionSnippet(action) {
    return action.definition.snippet;
}
/**
 *
 * @param action
 */
export function getSnippet(action) {
    return getDefinitionSnippet(action);
}
/**
 *
 * @param action
 */
export function getDefinitionDice(action) {
    return action.definition.dice;
}
/**
 *
 * @param action
 */
export function getDice(action) {
    return getDefinitionDice(action);
}
/**
 *
 * @param action
 */
export function getDefinitionIsMartialArts(action) {
    return action.definition.isMartialArts;
}
/**
 *
 * @param action
 */
export function getIsMartialArts(action) {
    return getDefinitionIsMartialArts(action);
}
/**
 *
 * @param action
 */
export function getDefinitionIsProficienct(action) {
    return action.definition.isProficient;
}
/**
 *
 * @param action
 */
export function getIsProficienct(action) {
    return getDefinitionIsProficienct(action);
}
/**
 *
 * @param action
 */
export function getDefinitionOnMissDescription(action) {
    return action.definition.onMissDescription;
}
/**
 *
 * @param action
 */
export function getOnMissDescription(action) {
    return getDefinitionOnMissDescription(action);
}
/**
 *
 * @param action
 */
export function getDefinitionRange(action) {
    return action.definition.range;
}
/**
 *
 * @param action
 */
export function getDefinitionFixedSaveDc(action) {
    return action.definition.fixedSaveDc;
}
/**
 *
 * @param action
 */
export function getFixedSaveDc(action) {
    return getDefinitionFixedSaveDc(action);
}
/**
 *
 * @param action
 */
export function getDefinitionSaveFailDescription(action) {
    return action.definition.saveFailDescription;
}
/**
 *
 * @param action
 */
export function getSaveFailDescription(action) {
    return getDefinitionSaveFailDescription(action);
}
/**
 *
 * @param action
 */
export function getDefinitionSaveStatId(action) {
    return action.definition.saveStatId;
}
/**
 *
 * @param action
 */
export function getSaveStatId(action) {
    return getDefinitionSaveStatId(action);
}
/**
 *
 * @param action
 */
export function getDefinitionSaveSuccessDescription(action) {
    return action.definition.saveSuccessDescription;
}
/**
 *
 * @param action
 */
export function getSaveSuccessDescription(action) {
    return getDefinitionSaveSuccessDescription(action);
}
/**
 *
 * @param action
 */
export function getDefinitionDisplayAsAttack(action) {
    return action.definition.displayAsAttack;
}
/**
 *
 * @param action
 */
export function getDisplayAsAttack(action) {
    return getDefinitionDisplayAsAttack(action);
}
/**
 *
 * @param action
 */
export function getDefinitionSpellRangeType(action) {
    return action.definition.spellRangeType;
}
/**
 *
 * @param action
 */
export function getSpellRangeType(action) {
    return getDefinitionSpellRangeType(action);
}
/**
 *
 * @param action
 */
export function getDefinitionFixedValue(action) {
    return action.definition.value;
}
/**
 *
 * @param action
 */
export function getFixedValue(action) {
    return getDefinitionFixedValue(action);
}
/**
 *
 * @param action
 */
export function getFixedToHit(action) {
    return getDefinitionFixedToHit(action);
}
/**
 *
 * @param action
 */
export function getDefinitionFixedToHit(action) {
    return action.definition.fixedToHit;
}
/**
 *
 * @param action
 */
export function getDefinitionNumberOfTargets(action) {
    return action.definition.numberOfTargets;
}
/**
 *
 * @param action
 */
export function getAmmunition(action) {
    return getDefinitionAmmunition(action);
}
/**
 *
 * @param action
 */
export function getDefinitionAmmunition(action) {
    return action.definition.ammunition;
}
/**
 *
 * @param action
 */
export function getNumberOfTargets(action) {
    return getDefinitionNumberOfTargets(action);
}
/**
 *
 * @param action
 */
export function getDefinition(action) {
    return action.definition;
}
/**
 *
 * @param action
 */
export function getComponentId(action) {
    return action.componentId;
}
/**
 *
 * @param action
 */
export function getComponentTypeId(action) {
    return action.componentTypeId;
}
/**
 *
 * @param action
 */
export function getEntityTypeId(action) {
    return getMappingEntityTypeId(action);
}
/**
 *
 * @param action
 */
export function getMappingEntityTypeId(action) {
    return action.entityTypeId;
}
/**
 *
 * @param action
 */
export function getId(action) {
    return getMappingId(action);
}
/**
 *
 * @param action
 */
export function getMappingId(action) {
    return action.id;
}
/**
 *
 * @param action
 */
export function getLimitedUse(action) {
    return action.limitedUse;
}
/**
 *
 * @param action
 */
export function displayAsAttack(action) {
    return action.displayAsAttack;
}
/**
 *
 * @param action
 */
export function getName(action) {
    return action.name;
}
/**
 *
 * @param action
 */
export function getNotes(action) {
    return action.notes;
}
/**
 *
 * @param action
 */
export function getOriginalContract(action) {
    return action.originalContract;
}
/**
 *
 * @param action
 */
export function isProficient(action) {
    return action.proficiency;
}
/**
 *
 * @param action
 */
export function requiresAttackRoll(action) {
    return action.requiresAttackRoll;
}
/**
 *
 * @param action
 */
export function requiresSavingThrow(action) {
    return action.requiresSavingThrow;
}
/**
 *
 * @param action
 */
export function getUniqueKey(action) {
    return action.uniqueKey;
}
/**
 *
 * @param action
 */
export function getDataOrigin(action) {
    return action.dataOrigin;
}
/**
 *
 * @param action
 */
export function getDataOriginType(action) {
    const dataOrigin = getDataOrigin(action);
    return dataOrigin.type;
}
/**
 *
 * @param action
 */
export function getAttackSaveValue(action) {
    return action.attackSaveValue;
}
/**
 *
 * @param action
 */
export function getAttackSubtypeName(action) {
    return action.attackSubtypeName;
}
/**
 *
 * @param action
 */
export function getDamage(action) {
    return action.damage;
}
/**
 *
 * @param action
 */
export function getRange(action) {
    return action.range;
}
/**
 *
 * @param action
 */
export function getReach(action) {
    return action.reach;
}
/**
 *
 * @param action
 */
export function getStatId(action) {
    return action.statId;
}
/**
 *
 * @param action
 */
export function getToHit(action) {
    return action.toHit;
}
/**
 *
 * @param action
 */
export function isOffhand(action) {
    return action.isOffhand;
}
/**
 *
 * @param action
 */
export function isSilvered(action) {
    return action.isSilvered;
}
/**
 *
 * @param action
 */
export function isDefaultDisplayAsAttack(action) {
    return action.isDefaultDisplayAsAttack;
}
/**
 *
 * @param action
 */
export function isCustomized(action) {
    return action.isCustomized;
}
