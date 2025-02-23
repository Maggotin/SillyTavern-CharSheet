import { groupBy, orderBy } from 'lodash';
import { TypeScriptUtils } from '../../utils';
import { CreatureSizeEnum, CreatureSizeNameEnum, FeatureTypeEnum } from '../Core';
import { FormatUtils } from '../Format';
import { HelperUtils } from '../Helper';
import { ModifierAccessors, ModifierSubTypeEnum, ModifierValidators, STAT_ABILITY_SCORE_LIST, } from '../Modifier';
import { OptionalOriginAccessors } from '../OptionalOrigin';
import { RacialTraitAccessors, RacialTraitDerivers, RacialTraitValidators } from '../RacialTrait';
import { RuleDataUtils } from '../RuleData';
import { getDefinitionRacialTraits } from './accessors';
import { hack__deriveRaceSize } from './hacks';
/**
 * has mirrored deriver ClassDerivers.deriveConsolidatedClassFeatures
 *   - most likely update together
 *
 * @param race
 * @param optionalOrigins
 * @param enableOptionalOrigins
 */
export function deriveConsolidatedRacialTraits(race, optionalOrigins, enableOptionalOrigins) {
    //filtering because after generating Race, this function is used in getUpdateEnableOptionalOriginsSpellListIdsToRemove
    //      to determine updated look of race and we don't store original definition info for race
    const originalDefinitionRacialTraits = getDefinitionRacialTraits(race).filter((trait) => RacialTraitAccessors.getFeatureType(trait) === FeatureTypeEnum.GRANTED);
    if (!enableOptionalOrigins) {
        return originalDefinitionRacialTraits;
    }
    const additionalRacialTraits = [];
    const definitionKeysToRemove = new Set();
    optionalOrigins.forEach((optionalOrigin) => {
        const racialTrait = OptionalOriginAccessors.getRacialTrait(optionalOrigin);
        if (racialTrait === null) {
            return;
        }
        const featureType = RacialTraitAccessors.getFeatureType(racialTrait);
        switch (featureType) {
            case FeatureTypeEnum.REPLACEMENT: {
                const affectedDefinitionKey = OptionalOriginAccessors.getAffectedRacialTraitDefinitionKey(optionalOrigin);
                const affectedFeatureKeys = RacialTraitAccessors.getAffectedFeatureDefinitionKeys(racialTrait);
                //verify this is a valid replacement
                if (affectedDefinitionKey &&
                    affectedFeatureKeys.includes(affectedDefinitionKey) &&
                    RacialTraitValidators.isValidRaceRacialTrait(race, racialTrait)) {
                    definitionKeysToRemove.add(affectedDefinitionKey);
                    additionalRacialTraits.push(racialTrait);
                }
                break;
            }
            case FeatureTypeEnum.ADDITIONAL:
            case FeatureTypeEnum.GRANTED:
            default:
                if (RacialTraitValidators.isValidRaceRacialTrait(race, racialTrait)) {
                    additionalRacialTraits.push(racialTrait);
                }
                break;
        }
    });
    //remove definitionKeysToRemove
    const filteredDefinitionRacialTraits = originalDefinitionRacialTraits.filter((trait) => !definitionKeysToRemove.has(RacialTraitAccessors.getDefinitionKey(trait)));
    return [...filteredDefinitionRacialTraits, ...additionalRacialTraits];
}
/**
 *
 * @param racialTraits
 * @param appContext
 */
export function deriveVisibleRacialTraits(racialTraits, appContext) {
    return racialTraits.filter((racialTrait) => !RacialTraitDerivers.deriveHideInContext(racialTrait, appContext));
}
/**
 *
 * @param racialTraits
 */
export function deriveOrderedRacialTraits(racialTraits) {
    return orderBy(racialTraits, [
        (racialTrait) => RacialTraitAccessors.getDisplayOrder(racialTrait),
        (racialTrait) => RacialTraitAccessors.getName(racialTrait),
    ]);
}
/**
 *
 * @param racialTraits
 * @param ruleData
 */
export function deriveCalledOutRacialTraits(racialTraits, ruleData) {
    const filteredTraits = racialTraits.filter((trait) => RacialTraitAccessors.isCalledOut(trait));
    const orderedTraits = deriveOrderedRacialTraits(filteredTraits);
    const calledOutTraitNames = [];
    const abilityScoreIncreases = [];
    const abilityScoreIncreasesToChoose = [];
    const modifierLookupBySubType = {};
    orderedTraits.forEach((trait) => {
        const name = RacialTraitAccessors.getName(trait);
        const modifiers = RacialTraitAccessors.getModifiers(trait);
        if (modifiers.length) {
            //aggregate all ability score related modifiers into a lookup
            let abilityModifiersCount = 0;
            modifiers.forEach((modifier) => {
                const statId = ModifierAccessors.getEntityId(modifier);
                if ((statId && ModifierValidators.isValidBonusStatScoreModifier(modifier, statId)) ||
                    ModifierValidators.isValidBonusChooseAbilityScoreModifier(modifier)) {
                    abilityModifiersCount++;
                    const modifierSubType = ModifierAccessors.getSubType(modifier);
                    if (!modifierSubType) {
                        return;
                    }
                    if (!modifierLookupBySubType.hasOwnProperty(modifierSubType)) {
                        modifierLookupBySubType[modifierSubType] = [];
                    }
                    modifierLookupBySubType[modifierSubType].push(modifier);
                }
            });
            if (abilityModifiersCount === 0) {
                calledOutTraitNames.push(name);
            }
        }
        else {
            calledOutTraitNames.push(name);
        }
    });
    let hasAllAbilityStatScoreGrantedBonuses = false;
    const modifierSubTypeStrings = Object.keys(modifierLookupBySubType);
    const filteredSubTypeStrings = modifierSubTypeStrings.filter((subType) => subType !== ModifierSubTypeEnum.CHOOSE_AN_ABILITY_SCORE);
    if (filteredSubTypeStrings.length === STAT_ABILITY_SCORE_LIST.length &&
        filteredSubTypeStrings.every((subType) => STAT_ABILITY_SCORE_LIST.includes(subType))) {
        //TODO should check all the values are the same (this is only applies to Humans right now)
        hasAllAbilityStatScoreGrantedBonuses = true;
        abilityScoreIncreases.push(`+1 to All Ability Scores`);
    }
    modifierSubTypeStrings.forEach((modifierSubType) => {
        const modifiers = HelperUtils.lookupDataOrFallback(modifierLookupBySubType, modifierSubType);
        if (modifiers !== null) {
            if (modifierSubType === ModifierSubTypeEnum.CHOOSE_AN_ABILITY_SCORE) {
                const modifiersByValueLookup = groupBy(modifiers, (modifier) => ModifierAccessors.getValue(modifier));
                Object.keys(modifiersByValueLookup).forEach((value) => {
                    const lookupModifiers = HelperUtils.lookupDataOrFallback(modifiersByValueLookup, value);
                    if (lookupModifiers !== null) {
                        const numberOfModifiers = lookupModifiers.length;
                        abilityScoreIncreasesToChoose.push(`+${value} to ${FormatUtils.upperCaseFirstLetterOnly(FormatUtils.convertSingleDigitIntToWord(numberOfModifiers))} Other Ability Score${numberOfModifiers > 1 ? 's' : ''}`);
                    }
                });
            }
            else if (!hasAllAbilityStatScoreGrantedBonuses) {
                const statId = ModifierAccessors.getEntityId(modifiers[0]);
                if (!statId) {
                    return;
                }
                const modifiersValueTotal = modifiers.reduce((acc, modifier) => {
                    const value = ModifierAccessors.getValue(modifier);
                    if (value !== null) {
                        acc += value;
                    }
                    return acc;
                }, 0);
                abilityScoreIncreases.push(`+${modifiersValueTotal} ${RuleDataUtils.getStatNameById(statId, ruleData, true)}`);
            }
        }
    });
    return [...abilityScoreIncreases, ...abilityScoreIncreasesToChoose, ...calledOutTraitNames];
}
/**
 *
 * @param racialTraits
 */
export function deriveSpellListIds(racialTraits) {
    const spellListIds = [];
    racialTraits.forEach((feature) => {
        spellListIds.push(...RacialTraitAccessors.getSpellListIds(feature));
    });
    return spellListIds;
}
/**
 *
 * @param race
 * @param experienceInfo
 * @param raceModifiers
 */
export function deriveRaceSize(race, experienceInfo, raceModifiers) {
    //temp hack handles specific race size for granted level size changes - need to set up logic for that
    let [sizeId, size] = hack__deriveRaceSize(race, experienceInfo);
    let sizeModifiersIds = raceModifiers
        .filter(ModifierValidators.isSizeModifier)
        .map(ModifierAccessors.getEntityId)
        .filter(TypeScriptUtils.isNotNullOrUndefined);
    let largestSizeModifierId = sizeModifiersIds.length ? Math.max(...sizeModifiersIds) : null;
    if (largestSizeModifierId !== null) {
        sizeId = largestSizeModifierId;
        size = deriveRaceSizeName(sizeId);
    }
    return [sizeId, size];
}
/**
 *
 * @param sizeId
 */
export function deriveRaceSizeName(sizeId) {
    switch (sizeId) {
        case CreatureSizeEnum.TINY:
            return CreatureSizeNameEnum.TINY;
        case CreatureSizeEnum.SMALL:
            return CreatureSizeNameEnum.SMALL;
        case CreatureSizeEnum.MEDIUM:
            return CreatureSizeNameEnum.MEDIUM;
        case CreatureSizeEnum.LARGE:
            return CreatureSizeNameEnum.LARGE;
        case CreatureSizeEnum.HUGE:
            return CreatureSizeNameEnum.HUGE;
        case CreatureSizeEnum.GARGANTUAN:
            return CreatureSizeNameEnum.GARGANTUAN;
        default:
            return null;
    }
}
