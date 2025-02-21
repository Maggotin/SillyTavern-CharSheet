import { TypeScriptUtils } from '../../utils';
import { AbilityAccessors } from '../Ability';
import { CharacterDerivers } from '../Character';
import { ClassAccessors } from '../Class';
import { AbilityStatEnum, AttackTypeRangeEnum } from '../Core';
import { DataOriginTypeEnum } from '../DataOrigin';
import { DiceAccessors, DiceDerivers, DiceUtils } from '../Dice';
import { HelperUtils } from '../Helper';
import { ModifierAccessors, ModifierDerivers, ModifierValidators } from '../Modifier';
import { RuleDataAccessors, RuleDataUtils } from '../RuleData';
import { AdjustmentTypeEnum, ValueUtils, ValueValidators } from '../Value';
import { getAbilityModifierStatId, getActionTypeId, getAttackRangeId, getAttackSubtypeId, getDamageTypeId, getDataOrigin, getDataOriginType, getDefinitionName, getDefinitionRange, getDice, getDisplayAsAttack, getEntityTypeId, getFixedSaveDc, getFixedToHit, getId, getIsMartialArts, getIsProficienct, getMappingEntityTypeId, getMappingId, getSaveStatId, getSpellRangeType, requiresAttackRoll, } from './accessors';
import { ACTION_CUSTOMIZATION_ADJUSTMENT_TYPES, ActionTypeEnum, AttackSubtypeEnum } from './constants';
/**
 *
 * @param action
 */
export function deriveUniqueKey(action) {
    return `${getId(action)}-${getEntityTypeId(action)}`;
}
/**
 *
 * @param action
 */
export function deriveRequiresAttackRoll(action) {
    return getAttackRangeId(action) !== null;
}
/**
 *
 * @param action
 */
export function deriveRequiresSavingThrow(action) {
    return getSaveStatId(action) !== null;
}
/**
 *
 * @param action
 */
export function deriveIsDefaultDisplayAsAttack(action) {
    const displayAsAttack = getDisplayAsAttack(action);
    if (displayAsAttack !== null) {
        return displayAsAttack;
    }
    return deriveRequiresAttackRoll(action);
}
/**
 *
 * @param action
 */
export function deriveAttackSubtypeName(action) {
    switch (getAttackSubtypeId(action)) {
        case AttackSubtypeEnum.UNARMED:
            return 'Unarmed Strike';
        case AttackSubtypeEnum.NATURAL:
            return 'Natural Attack';
    }
    return null;
}
/**
 *
 * @param action
 * @param martialArtsLevel
 */
export function deriveIsMartialArtsAvailable(action, martialArtsLevel) {
    const isMartialArtsEnabled = getIsMartialArts(action);
    const attackSubtype = getAttackSubtypeId(action);
    if (martialArtsLevel !== null && (attackSubtype === AttackSubtypeEnum.UNARMED || isMartialArtsEnabled)) {
        return true;
    }
    return false;
}
/**
 *
 * @param action
 * @param ruleData
 */
export function deriveFallbackAbilityIds(action, ruleData) {
    const actionType = getActionTypeId(action);
    const attackTypeRange = getAttackRangeId(action);
    const availableAbilities = [];
    if (actionType === ActionTypeEnum.WEAPON) {
        if (attackTypeRange === AttackTypeRangeEnum.RANGED) {
            availableAbilities.push(AbilityStatEnum.DEXTERITY);
        }
        else {
            availableAbilities.push(AbilityStatEnum.STRENGTH);
        }
    }
    else {
        const dataOrigin = getDataOrigin(action);
        const dataOriginType = getDataOriginType(action);
        switch (dataOriginType) {
            case DataOriginTypeEnum.CLASS_FEATURE:
                const primaryAbilities = ClassAccessors.getPrimaryAbilities(dataOrigin.parent);
                if (primaryAbilities.length) {
                    availableAbilities.push(...primaryAbilities);
                }
                break;
        }
    }
    return availableAbilities;
}
/**
 *
 * @param action
 * @param abilityLookup
 * @param ruleData
 */
export function deriveBestFallbackAbility(action, abilityLookup, ruleData) {
    const fallbackAbilityIds = deriveFallbackAbilityIds(action, ruleData);
    const fallbackAbilities = fallbackAbilityIds.map((id) => abilityLookup[id]);
    return HelperUtils.getLast(fallbackAbilities, 'modifier');
}
/**
 *
 * @param action
 * @param martialArtsLevel
 * @param ruleData
 * @param includeFallbacks
 */
export function deriveAvailableAbilities(action, martialArtsLevel, ruleData, includeFallbacks = true) {
    let attackStat = null;
    if (requiresAttackRoll(action)) {
        attackStat = getAbilityModifierStatId(action);
    }
    const availableAbilities = [];
    if (attackStat) {
        availableAbilities.push(attackStat);
    }
    else if (includeFallbacks) {
        availableAbilities.push(...deriveFallbackAbilityIds(action, ruleData));
    }
    if (deriveIsMartialArtsAvailable(action, martialArtsLevel) &&
        !availableAbilities.includes(AbilityStatEnum.DEXTERITY)) {
        availableAbilities.push(AbilityStatEnum.DEXTERITY);
    }
    return availableAbilities;
}
/**
 *
 * @param action
 * @param abilityLookup
 * @param proficiencyBonus
 * @param valueLookup
 * @param ruleData
 */
export function deriveAttackSaveValue(action, abilityLookup, proficiencyBonus, valueLookup, ruleData) {
    const id = getMappingId(action);
    const entityId = getMappingEntityTypeId(action);
    if (getSaveStatId(action) === null) {
        return null;
    }
    const fixedSaveDc = getFixedSaveDc(action);
    if (fixedSaveDc) {
        return fixedSaveDc;
    }
    const saveDcOverride = ValueUtils.getKeyValue(valueLookup, AdjustmentTypeEnum.SAVE_DC_OVERRIDE, id, entityId);
    if (saveDcOverride !== null) {
        return saveDcOverride;
    }
    let attackSaveAbility = null;
    const abilityModifierStatId = getAbilityModifierStatId(action);
    if (abilityModifierStatId) {
        attackSaveAbility = abilityLookup[abilityModifierStatId];
    }
    else {
        attackSaveAbility = deriveBestFallbackAbility(action, abilityLookup, ruleData);
    }
    if (!attackSaveAbility) {
        return null;
    }
    const abilityModifier = AbilityAccessors.getModifier(attackSaveAbility);
    const attackSaveAbilityModifier = abilityModifier ? abilityModifier : 0;
    let saveDc = CharacterDerivers.deriveAttackSaveValue(proficiencyBonus, attackSaveAbilityModifier);
    saveDc += ValueUtils.getKeyValue(valueLookup, AdjustmentTypeEnum.SAVE_DC_BONUS, id, entityId, 0);
    return saveDc;
}
/**
 *
 * @param bestAbilityInfo
 * @param action
 * @param modifiers
 * @param abilityLookup
 * @param valueLookup
 */
export function deriveToHit(bestAbilityInfo, action, modifiers, abilityLookup, valueLookup) {
    const actionType = getActionTypeId(action);
    let toHit = null;
    if (bestAbilityInfo && getAttackRangeId(action) !== null) {
        const id = getMappingId(action);
        const entityId = getMappingEntityTypeId(action);
        const toHitOverride = ValueUtils.getKeyValue(valueLookup, AdjustmentTypeEnum.TO_HIT_OVERRIDE, id, entityId);
        if (toHitOverride !== null) {
            return toHitOverride;
        }
        let bonusToHitModifiers = null;
        let bonusToHitModifierTotal = 0;
        if (actionType === ActionTypeEnum.SPELL) {
            bonusToHitModifiers = modifiers.filter((modifier) => ModifierValidators.isValidBonusActionSpellToHitModifier(modifier, action));
        }
        else if (actionType === ActionTypeEnum.WEAPON) {
            bonusToHitModifiers = modifiers.filter((modifier) => ModifierValidators.isValidBonusActionWeaponToHitModifier(modifier, action));
        }
        if (bonusToHitModifiers !== null) {
            bonusToHitModifierTotal = ModifierDerivers.sumModifiers(bonusToHitModifiers, abilityLookup);
        }
        const toHitCustomBonus = ValueUtils.getKeyValue(valueLookup, AdjustmentTypeEnum.TO_HIT_BONUS, id, entityId, 0);
        toHit = bestAbilityInfo.toHit + bonusToHitModifierTotal + toHitCustomBonus;
    }
    const fixedToHit = getFixedToHit(action);
    if (fixedToHit !== null) {
        toHit = fixedToHit;
    }
    return toHit;
}
/**
 *
 * @param action
 * @param baseDamage
 * @param fixedDamageBonuses
 * @param valueLookup
 * @param ruleData
 */
export function deriveDamage(action, baseDamage, fixedDamageBonuses, valueLookup, ruleData) {
    const id = getMappingId(action);
    const entityId = getMappingEntityTypeId(action);
    const damageTypeId = getDamageTypeId(action);
    let type = null;
    let value = null;
    let dataOrigin = null;
    let isMartialArts = false;
    const damageCustomBonus = ValueUtils.getKeyValue(valueLookup, AdjustmentTypeEnum.FIXED_VALUE_BONUS, id, entityId, 0);
    const fixedDamage = fixedDamageBonuses + damageCustomBonus;
    if (baseDamage !== null) {
        if (typeof baseDamage === 'number') {
            value = Math.max(0, baseDamage + fixedDamage);
        }
        else if (baseDamage.isMartialArts !== undefined) {
            if (baseDamage.dataOrigin) {
                dataOrigin = baseDamage.dataOrigin;
            }
            else if (baseDamage.isMartialArts) {
                isMartialArts = true;
            }
            const fixedValue = DiceAccessors.getFixedValue(baseDamage);
            value = Object.assign(Object.assign({}, baseDamage), { fixedValue: (fixedValue ? fixedValue : 0) + fixedDamage });
        }
    }
    if (damageTypeId) {
        type = RuleDataUtils.getDamageType(damageTypeId, ruleData);
    }
    return {
        type,
        value,
        dataOrigin,
        isMartialArts,
    };
}
/**
 *
 * @param action
 * @param valueLookup
 */
export function deriveName(action, valueLookup) {
    const id = getMappingId(action);
    const entityId = getMappingEntityTypeId(action);
    let derivedName = getDefinitionName(action);
    const nameOverride = ValueUtils.getKeyValue(valueLookup, AdjustmentTypeEnum.NAME_OVERRIDE, id, entityId);
    if (nameOverride) {
        derivedName = nameOverride;
    }
    if (derivedName === null) {
        derivedName = '';
    }
    return derivedName;
}
/**
 *
 * @param action
 * @param modifiers
 */
export function deriveLabel(action, modifiers) {
    const masteryModifiers = modifiers.filter((modifier) => ModifierValidators.isValidWeaponMasteryModifier(modifier));
    const masteryModifier = masteryModifiers.find((modifier) => modifier.componentId === action.componentId);
    if (masteryModifier) {
        return ModifierAccessors.getFriendlySubtypeName(masteryModifier);
    }
    return null;
}
/**
 *
 * @param action
 * @param proficiencyBonus
 */
export function deriveProficiencyBonus(action, proficiencyBonus) {
    let bonus = 0;
    if (getIsProficienct(action)) {
        bonus = proficiencyBonus;
    }
    return bonus;
}
/**
 *
 * @param action
 */
export function deriveProficiency(action) {
    return getIsProficienct(action);
}
/**
 *
 * @param action
 * @param valueLookup
 */
export function deriveDisplayAsAttack(action, valueLookup) {
    const id = getMappingId(action);
    const entityId = getMappingEntityTypeId(action);
    const displayAsAttackOverride = ValueUtils.getKeyValue(valueLookup, AdjustmentTypeEnum.DISPLAY_AS_ATTACK, id, entityId);
    if (displayAsAttackOverride !== null) {
        return displayAsAttackOverride;
    }
    return deriveIsDefaultDisplayAsAttack(action);
}
/**
 *
 * @param action
 * @param modifiers
 * @param modifierData
 * @param ruleData
 */
export function deriveReach(action, modifiers, modifierData, ruleData) {
    let baseReach = null;
    if (getActionTypeId(action) === ActionTypeEnum.SPELL) {
        return null;
    }
    // Reach is null if it isn't a melee attack
    if (getAttackRangeId(action) !== AttackTypeRangeEnum.MELEE) {
        return null;
    }
    // Figure out base reach based on initial data
    const range = getDefinitionRange(action);
    if (range) {
        baseReach = range.range;
    }
    if (baseReach === null) {
        baseReach = RuleDataAccessors.getBaseWeaponReach(ruleData);
    }
    const bonusReachModifiers = modifiers.filter((modifier) => ModifierValidators.isBonusMeleeReachModifier(modifier));
    const bonusReachModifierTotal = ModifierDerivers.deriveTotalValue(bonusReachModifiers, modifierData);
    return baseReach + bonusReachModifierTotal;
}
/**
 *
 * @param action
 * @param martialArtsLevel
 * @param modifiers
 */
export function deriveHighestDamageDie(action, martialArtsLevel, modifiers) {
    const actionType = getActionTypeId(action);
    const baseDice = getDice(action);
    const attackSubtype = getAttackSubtypeId(action);
    const isMartialArtsAvailable = deriveIsMartialArtsAvailable(action, martialArtsLevel);
    const allDamageDice = [];
    if (baseDice) {
        allDamageDice.push(Object.assign(Object.assign({}, baseDice), { isMartialArts: false, dataOrigin: null }));
    }
    if (actionType === ActionTypeEnum.WEAPON && attackSubtype === AttackSubtypeEnum.UNARMED) {
        const setDamageDieModifiers = modifiers.filter((modifier) => ModifierValidators.isSetUnarmedDamageDieModifier(modifier));
        const setDamageDice = setDamageDieModifiers
            .map((modifier) => {
            const modifierDice = ModifierAccessors.getDice(modifier);
            if (modifierDice === null) {
                return null;
            }
            return Object.assign(Object.assign({}, modifierDice), { isMartialArts: false, dataOrigin: ModifierAccessors.getDataOrigin(modifier) });
        })
            .filter(TypeScriptUtils.isNotNullOrUndefined);
        allDamageDice.push(...setDamageDice);
    }
    if (martialArtsLevel !== null && isMartialArtsAvailable) {
        const martialArtsDie = DiceDerivers.deriveMartialArtsDamageDie(martialArtsLevel);
        allDamageDice.push(Object.assign(Object.assign({}, martialArtsDie), { isMartialArts: true, dataOrigin: null }));
    }
    return DiceUtils.getHighestDie(allDamageDice);
}
/**
 *
 * @param bestAbilityInfo
 * @param action
 * @param modifiers
 * @param abilityLookup
 */
export function deriveFixedDamageBonuses(bestAbilityInfo, action, modifiers, abilityLookup) {
    const actionType = getActionTypeId(action);
    let damageModifiers = [];
    let damageModifierTotal = 0;
    if (actionType === ActionTypeEnum.SPELL) {
        damageModifiers = modifiers.filter((modifier) => ModifierValidators.isValidDamageActionSpellModifier(modifier, action));
    }
    else if (actionType === ActionTypeEnum.WEAPON) {
        damageModifiers = modifiers.filter((modifier) => ModifierValidators.isValidDamageActionWeaponModifier(modifier, action));
    }
    if (damageModifiers.length) {
        damageModifierTotal = ModifierDerivers.sumModifiers(damageModifiers, abilityLookup);
    }
    return damageModifierTotal + (bestAbilityInfo ? bestAbilityInfo.damageBonus : 0);
}
/**
 *
 * @param action
 * @param modifiers
 * @param abilityLookup
 */
export function deriveRange(action, modifiers, abilityLookup) {
    const actionType = getActionTypeId(action);
    const definitionRange = getDefinitionRange(action);
    if (definitionRange === null) {
        return definitionRange;
    }
    let range = Object.assign(Object.assign({}, definitionRange), { origin: null });
    if (actionType === ActionTypeEnum.SPELL) {
        const attackTypeRange = getAttackRangeId(action);
        let newRange = definitionRange.range;
        if (attackTypeRange !== null && newRange) {
            const spellAttackRangeMultiplierModifiers = modifiers.filter((modifier) => ModifierValidators.isBonusSpellAttackRangeMultiplierModifier(modifier));
            const spellAttackRangeMultiplierTotal = Math.max(1, ModifierDerivers.sumModifiers(spellAttackRangeMultiplierModifiers, abilityLookup, 1));
            newRange *= spellAttackRangeMultiplierTotal;
        }
        range = Object.assign(Object.assign({}, definitionRange), { range: newRange, origin: getSpellRangeType(action) });
    }
    return range;
}
/**
 *
 * @param action
 * @param valueLookup
 */
export function deriveIsOffhand(action, valueLookup) {
    let isOffhand = false;
    if (getActionTypeId(action) === ActionTypeEnum.WEAPON) {
        const id = getMappingId(action);
        const entityId = getMappingEntityTypeId(action);
        isOffhand = ValueUtils.getKeyValue(valueLookup, AdjustmentTypeEnum.IS_OFFHAND, id, entityId, false);
    }
    return isOffhand;
}
/**
 *
 * @param action
 * @param valueLookup
 */
export function deriveIsSilvered(action, valueLookup) {
    let isSilvered = false;
    if (getActionTypeId(action) === ActionTypeEnum.WEAPON) {
        const id = getMappingId(action);
        const entityId = getMappingEntityTypeId(action);
        isSilvered = ValueUtils.getKeyValue(valueLookup, AdjustmentTypeEnum.IS_SILVER, id, entityId, false);
    }
    return isSilvered;
}
/**
 *
 * @param action
 * @param valueLookup
 */
export function deriveIsCustomized(action, valueLookup) {
    return ValueValidators.validateHasCustomization(ACTION_CUSTOMIZATION_ADJUSTMENT_TYPES, valueLookup, getMappingId(action), getMappingEntityTypeId(action));
}
