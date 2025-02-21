var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { groupBy, keyBy } from 'lodash';
import { CharacterDerivers } from '../Character';
import { ClassAccessors } from '../Class';
import { DataOriginGenerators, DataOriginTypeEnum } from '../DataOrigin';
import { FeatAccessors } from '../Feat';
import { HelperUtils } from '../Helper';
import { ItemAccessors } from '../Item';
import { OptionAccessors } from '../Option';
import { RaceAccessors } from '../Race';
import { RuleDataAccessors } from '../RuleData';
import { AdjustmentTypeEnum, ValueUtils } from '../Value';
import { getActionTypeId, getDisplayAsAttack, getFixedValue, getUniqueKey } from './accessors';
import { ActionTypeEnum } from './constants';
import { deriveAttackSaveValue, deriveAttackSubtypeName, deriveAvailableAbilities, deriveDamage, deriveDisplayAsAttack, deriveFixedDamageBonuses, deriveHighestDamageDie, deriveIsCustomized, deriveIsDefaultDisplayAsAttack, deriveIsOffhand, deriveIsSilvered, deriveName, deriveProficiency, deriveProficiencyBonus, deriveRange, deriveReach, deriveRequiresAttackRoll, deriveRequiresSavingThrow, deriveToHit, deriveUniqueKey, } from './derivers';
/**
 *
 * @param action
 */
export function generateDataOriginKey(action) {
    return DataOriginGenerators.generateDataOriginKey(action.componentId, action.componentTypeId);
}
/**
 *
 * @param id
 * @param entityTypeId
 * @param actionLookup
 * @param valueLookup
 * @param dataOriginType
 * @param primary
 * @param parent
 */
export function generateBaseActions(id, entityTypeId, actionLookup, valueLookup, dataOriginType, primary, parent = null) {
    const actions = HelperUtils.lookupDataOrFallback(actionLookup, DataOriginGenerators.generateDataOriginKey(id, entityTypeId));
    if (!actions) {
        return [];
    }
    return actions.map((action) => generateDataOriginBaseAction(action, valueLookup, dataOriginType, primary, parent));
}
/**
 *
 * @param action
 * @param valueLookup
 */
export function generateBaseAction(action, valueLookup) {
    const { componentId, componentTypeId, displayAsAttack, entityTypeId, id, limitedUse, name } = action, definitionProps = __rest(action, ["componentId", "componentTypeId", "displayAsAttack", "entityTypeId", "id", "limitedUse", "name"]);
    const simulatedAction = {
        definition: Object.assign(Object.assign({}, definitionProps), { displayAsAttack,
            name }),
        componentId,
        componentTypeId,
        entityTypeId,
        id,
        limitedUse,
    };
    return Object.assign(Object.assign({}, simulatedAction), { displayAsAttack: deriveDisplayAsAttack(simulatedAction, valueLookup), name: deriveName(simulatedAction, valueLookup), notes: ValueUtils.getKeyValue(valueLookup, AdjustmentTypeEnum.NOTES, id, entityTypeId), originalContract: action, proficiency: deriveProficiency(simulatedAction), requiresAttackRoll: deriveRequiresAttackRoll(simulatedAction), requiresSavingThrow: deriveRequiresSavingThrow(simulatedAction), isDefaultDisplayAsAttack: deriveIsDefaultDisplayAsAttack(simulatedAction), uniqueKey: deriveUniqueKey(simulatedAction) });
}
/**
 *
 * @param actions
 * @param valueLookup
 * @param type
 * @param primary
 * @param parent
 */
export function generateDataOriginBaseActions(actions, valueLookup, type, primary = null, parent = null) {
    return actions.map((action) => generateDataOriginBaseAction(action, valueLookup, type, primary, parent));
}
/**
 *
 * @param action
 * @param valueLookup
 * @param dataOriginType
 * @param primary
 * @param parent
 */
export function generateDataOriginBaseAction(action, valueLookup, dataOriginType, primary, parent) {
    const dataOrigin = DataOriginGenerators.generateDataOrigin(dataOriginType, primary, parent);
    return Object.assign(Object.assign({}, generateBaseAction(action, valueLookup)), { dataOrigin });
}
/**
 *
 * @param action
 * @param valueLookup
 */
export function generateInnateNaturalDataOriginBaseAction(action, valueLookup) {
    return generateDataOriginBaseAction(action, valueLookup, DataOriginTypeEnum.RULE_DATA, null, null);
}
/**
 *
 * @param baseAction
 * @param proficiencyBonus
 * @param abilityLookup
 * @param modifiers
 * @param valueLookup
 * @param martialArtsLevel
 * @param ruleData
 * @param modifierData
 */
export function generateAction(baseAction, proficiencyBonus, abilityLookup, modifiers, valueLookup, martialArtsLevel, ruleData, modifierData) {
    const actionType = getActionTypeId(baseAction);
    const fixedValue = getFixedValue(baseAction);
    const highestDamageDie = deriveHighestDamageDie(baseAction, martialArtsLevel, modifiers);
    const includeFallback = actionType !== ActionTypeEnum.GENERAL;
    const availableAbilities = deriveAvailableAbilities(baseAction, martialArtsLevel, ruleData, includeFallback);
    const attackProficiencyBonus = deriveProficiencyBonus(baseAction, proficiencyBonus);
    const abilityPossibilities = CharacterDerivers.deriveAttackAbilityPossibilities(availableAbilities, modifiers, attackProficiencyBonus, abilityLookup);
    const bestAbilityInfo = HelperUtils.getLast(abilityPossibilities, ['toHit', 'modifier']);
    const fixedDamageBonuses = deriveFixedDamageBonuses(bestAbilityInfo, baseAction, modifiers, abilityLookup);
    const damage = deriveDamage(baseAction, highestDamageDie ? highestDamageDie : fixedValue, fixedDamageBonuses, valueLookup, ruleData);
    return Object.assign(Object.assign({}, baseAction), { attackSaveValue: deriveAttackSaveValue(baseAction, abilityLookup, proficiencyBonus, valueLookup, ruleData), attackSubtypeName: deriveAttackSubtypeName(baseAction), damage, range: deriveRange(baseAction, modifiers, abilityLookup), reach: deriveReach(baseAction, modifiers, modifierData, ruleData), statId: bestAbilityInfo ? bestAbilityInfo.abilityId : null, toHit: deriveToHit(bestAbilityInfo, baseAction, modifiers, abilityLookup, valueLookup), isOffhand: deriveIsOffhand(baseAction, valueLookup), isSilvered: deriveIsSilvered(baseAction, valueLookup), isCustomized: deriveIsCustomized(baseAction, valueLookup) });
}
/**
 *
 * @param actions
 */
export function generateActionComponentLookup(actions) {
    return groupBy(actions, (action) => generateDataOriginKey(action));
}
/**
 *
 * @param actions
 */
export function generateActionLookup(actions) {
    return keyBy(actions, (action) => getUniqueKey(action));
}
/**
 *
 * @param feats
 * @param race
 * @param classes
 * @param innateNaturalActions
 * @param inventory
 * @param proficiencyBonus
 * @param abilityLookup
 * @param modifiers
 * @param martialArtsLevel
 * @param ruleData
 * @param modifierData
 * @param valueLookup
 */
export function generateAggregatedActions(feats, race, classes, innateNaturalActions, inventory, proficiencyBonus, abilityLookup, modifiers, martialArtsLevel, ruleData, modifierData, valueLookup) {
    const actions = [];
    actions.push(...innateNaturalActions);
    if (race) {
        actions.push(...RaceAccessors.getActions(race));
    }
    classes.forEach((charClass) => {
        actions.push(...ClassAccessors.getActions(charClass));
    });
    feats.forEach((feat) => {
        actions.push(...FeatAccessors.getActions(feat));
        FeatAccessors.getOptions(feat).forEach((option) => {
            actions.push(...OptionAccessors.getActions(option));
        });
    });
    inventory.forEach((item) => {
        actions.push(...ItemAccessors.getInfusionActions(item));
    });
    return actions.map((baseAction) => generateAction(baseAction, proficiencyBonus, abilityLookup, modifiers, valueLookup, martialArtsLevel, ruleData, modifierData));
}
/**
 *
 * @param customActions
 * @param proficiencyBonus
 * @param abilityLookup
 * @param valueLookup
 * @param modifiers
 * @param martialArtsLevel
 * @param ruleData
 * @param modifierData
 */
export function generateCustomActions(customActions, proficiencyBonus, abilityLookup, valueLookup, modifiers, martialArtsLevel, ruleData, modifierData) {
    return customActions.map((customAction) => generateCustomAction(customAction, proficiencyBonus, abilityLookup, valueLookup, modifiers, martialArtsLevel, ruleData, modifierData));
}
/**
 *
 * @param customAction
 * @param proficiencyBonus
 * @param abilityLookup
 * @param valueLookup
 * @param modifiers
 * @param martialArtsLevel
 * @param ruleData
 * @param modifierData
 */
export function generateCustomAction(customAction, proficiencyBonus, abilityLookup, valueLookup, modifiers, martialArtsLevel, ruleData, modifierData) {
    const { aoeSize, aoeType, longRange, range, activationTime, activationType, diceCount, diceType, fixedValue, rangeId, statId, displayAsAttack, id, isSilvered, isOffhand } = customAction, similarActionProps = __rest(customAction, ["aoeSize", "aoeType", "longRange", "range", "activationTime", "activationType", "diceCount", "diceType", "fixedValue", "rangeId", "statId", "displayAsAttack", "id", "isSilvered", "isOffhand"]);
    let dice = null;
    let value = null;
    if (diceType) {
        dice = {
            diceCount: diceCount ? diceCount : 1,
            diceValue: diceType,
            fixedValue,
            diceMultiplier: null,
            diceString: null,
        };
    }
    else {
        value = fixedValue;
    }
    const actionLike = Object.assign(Object.assign({}, similarActionProps), { id, range: {
            range,
            longRange,
            aoeSize,
            aoeType,
            minimumRange: null,
            hasAoeSpecialDescription: false, // default
        }, activation: {
            activationType,
            activationTime,
        }, abilityModifierStatId: statId, attackTypeRange: rangeId, dice,
        value, limitedUse: null, displayAsAttack: null, componentId: -1, componentTypeId: -1, fixedToHit: null, numberOfTargets: null, ammunition: null });
    const dataOriginBaseAction = generateDataOriginBaseAction(actionLike, valueLookup, DataOriginTypeEnum.CUSTOM, null, null);
    const generatedAction = generateAction(dataOriginBaseAction, proficiencyBonus, abilityLookup, modifiers, valueLookup, martialArtsLevel, ruleData, modifierData);
    const generatedDisplayAsAttack = getDisplayAsAttack(generatedAction);
    return Object.assign(Object.assign({}, generatedAction), { displayAsAttack: displayAsAttack === null ? (generatedDisplayAsAttack ? generatedDisplayAsAttack : false) : displayAsAttack, isSilvered, isOffhand: isOffhand === null ? false : isOffhand });
}
/**
 *
 * @param ruleData
 * @param valueLookup
 */
export function generateInnateBaseActions(ruleData, valueLookup) {
    return RuleDataAccessors.getNaturalActions(ruleData).map((action) => generateInnateNaturalDataOriginBaseAction(action, valueLookup));
}
