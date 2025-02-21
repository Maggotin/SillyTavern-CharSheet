import { AbilityAccessors } from '../../Ability';
import { ActionAccessors } from '../../Action';
import { ClassAccessors } from '../../Class';
import { ClassFeatureAccessors } from '../../ClassFeature';
import { AbilityStatEnum, PreferenceHitPointTypeEnum } from '../../Core';
import { DataOriginTypeEnum } from '../../DataOrigin';
import { DiceUtils } from '../../Dice';
import { EntityUtils } from '../../Entity';
import { FeatAccessors } from '../../Feat';
import { HelperUtils } from '../../Helper';
import { ItemAccessors } from '../../Item';
import { ModifierAccessors, ModifierDerivers, ModifierValidators } from '../../Modifier';
import { RaceAccessors } from '../../Race';
import { RacialTraitAccessors } from '../../RacialTrait';
import { RuleDataAccessors } from '../../RuleData';
import { ProtectionSupplierTypeEnum } from '../constants';
import { deriveItemProtectionSupplierAvailabilityStatus, deriveProtectionSupplierAvailabilityStatus, } from '../derivers';
/**
 *
 * @param hitPointParts
 * @param currentLevel
 * @param classes
 * @param abilityLookup
 * @param raceModifiers
 * @param classesModifiers
 * @param miscModifiers
 * @param globalModifiers
 * @param preferences
 * @param ruleData
 */
export function generateHitPointInfo(hitPointParts, currentLevel, classes, abilityLookup, raceModifiers, classesModifiers, miscModifiers, globalModifiers, preferences, ruleData) {
    return getHitPointInfo(hitPointParts.baseHp, hitPointParts.overrideHp, hitPointParts.bonusHp, hitPointParts.tempHp, hitPointParts.removedHp, currentLevel, classes, abilityLookup, raceModifiers, classesModifiers, miscModifiers, globalModifiers, preferences, ruleData);
}
/**
 * //TODO better naming that fits generator convention
 * @param baseHp
 * @param overrideHp
 * @param bonusHp
 * @param tempHp
 * @param removedHp
 * @param currentLevel
 * @param classes
 * @param abilityLookup
 * @param raceModifiers
 * @param classesModifiers
 * @param miscModifiers
 * @param globalModifiers
 * @param preferences
 * @param ruleData
 */
export function getHitPointInfo(baseHp, overrideHp, bonusHp, tempHp, removedHp, currentLevel, classes, abilityLookup, raceModifiers, classesModifiers, miscModifiers, globalModifiers, preferences, ruleData) {
    const classesHitDice = classes.map((charClass) => ({
        dice: {
            diceCount: ClassAccessors.getLevel(charClass),
            diceValue: ClassAccessors.getHitDiceType(charClass),
            diceMultiplier: null,
            diceString: null,
            fixedValue: null,
        },
        charClass,
    }));
    const hitPointSources = [];
    let conStat;
    let conStatModifier;
    if (Object.keys(abilityLookup).length) {
        conStat = abilityLookup[AbilityStatEnum.CONSTITUTION] || 0;
        conStatModifier = AbilityAccessors.getModifier(conStat);
    }
    if (conStatModifier) {
        const source = AbilityAccessors.getLabel(conStat);
        hitPointSources.push({
            amount: currentLevel * conStatModifier,
            source: source === null ? 'UNK' : source,
        });
    }
    const racialHpPerLevelModifiers = raceModifiers.filter((modifier) => ModifierValidators.isBonusHitPointsPerLevelModifier(modifier));
    const classesHpPerLevelModifiers = classesModifiers.filter((modifier) => ModifierValidators.isBonusHitPointsPerLevelModifier(modifier));
    const miscHpPerLevelModifiers = miscModifiers.filter((modifier) => ModifierValidators.isBonusHitPointsPerLevelModifier(modifier));
    if (racialHpPerLevelModifiers.length) {
        racialHpPerLevelModifiers.reduce((acc, modifier) => {
            const value = ModifierAccessors.getValue(modifier);
            if (value !== null) {
                acc.push({
                    amount: currentLevel * value,
                    source: EntityUtils.getDataOriginName(ModifierAccessors.getDataOrigin(modifier)),
                });
            }
            return acc;
        }, hitPointSources);
    }
    if (classesHpPerLevelModifiers.length) {
        classesHpPerLevelModifiers.reduce((acc, modifier) => {
            const value = ModifierAccessors.getValue(modifier);
            const dataOrigin = ModifierAccessors.getDataOrigin(modifier);
            const dataOriginType = ModifierAccessors.getDataOriginType(modifier);
            if (dataOriginType === DataOriginTypeEnum.CLASS_FEATURE && value !== null) {
                acc.push({
                    amount: ClassAccessors.getLevel(dataOrigin.parent) * value,
                    source: EntityUtils.getDataOriginName(ModifierAccessors.getDataOrigin(modifier)),
                });
            }
            return acc;
        }, hitPointSources);
    }
    if (miscHpPerLevelModifiers.length) {
        miscHpPerLevelModifiers.reduce((acc, modifier) => {
            const value = ModifierAccessors.getValue(modifier);
            if (value !== null) {
                acc.push({
                    amount: currentLevel * value,
                    source: EntityUtils.getDataOriginName(ModifierAccessors.getDataOrigin(modifier)),
                });
            }
            return acc;
        }, hitPointSources);
    }
    const globalBonusHpModifiers = globalModifiers.filter((modifier) => ModifierValidators.isBonusHitPointsModifier(modifier));
    if (globalBonusHpModifiers.length) {
        globalBonusHpModifiers.reduce((acc, modifier) => {
            const statId = ModifierAccessors.getStatId(modifier);
            if (statId !== null) {
                const stat = HelperUtils.lookupDataOrFallback(abilityLookup, statId);
                if (stat !== null) {
                    const statModifier = AbilityAccessors.getModifier(stat);
                    acc.push({
                        amount: statModifier === null ? 0 : statModifier,
                        source: EntityUtils.getDataOriginName(ModifierAccessors.getDataOrigin(modifier)),
                    });
                }
            }
            else {
                const hpIncrease = ModifierAccessors.getValue(modifier);
                if (!!hpIncrease) {
                    acc.push({
                        amount: hpIncrease,
                        source: EntityUtils.getDataOriginName(ModifierAccessors.getDataOrigin(modifier)),
                    });
                }
            }
            return acc;
        }, hitPointSources);
    }
    const totalHitPointSources = hitPointSources.reduce((acc, hitPointSource) => (acc += hitPointSource.amount), 0);
    const totalAvgClassHitDie = classes.reduce((acc, charClass) => {
        const hitDiceType = ClassAccessors.getHitDiceType(charClass);
        const level = ClassAccessors.getLevel(charClass);
        if (ClassAccessors.isStartingClass(charClass)) {
            acc += hitDiceType;
            acc += Math.floor((level - 1) * DiceUtils.getAverageDieValue(hitDiceType));
        }
        else {
            acc += Math.floor(level * DiceUtils.getAverageDieValue(hitDiceType));
        }
        return acc;
    }, 0);
    const totalFixedClassHitDie = classes.reduce((acc, charClass) => {
        const hitDiceType = ClassAccessors.getHitDiceType(charClass);
        const level = ClassAccessors.getLevel(charClass);
        if (ClassAccessors.isStartingClass(charClass)) {
            acc += hitDiceType;
            acc += (level - 1) * DiceUtils.getFixedDieValue(hitDiceType);
        }
        else {
            acc += level * DiceUtils.getFixedDieValue(hitDiceType);
        }
        return acc;
    }, 0);
    const totalClassHitDieMax = classes.reduce((acc, charClass) => (acc += ClassAccessors.getLevel(charClass) * ClassAccessors.getHitDiceType(charClass)), 0);
    const totalFixedValueHp = totalFixedClassHitDie + totalHitPointSources;
    const totalAverageHp = totalAvgClassHitDie + totalHitPointSources;
    const possibleMaxHitPoints = totalClassHitDieMax + totalHitPointSources;
    let finalBaseHp = baseHp;
    if (preferences && preferences.hitPointType === PreferenceHitPointTypeEnum.FIXED) {
        finalBaseHp = totalFixedClassHitDie;
    }
    const baseTotalHp = finalBaseHp + totalHitPointSources;
    let totalHp = baseTotalHp + (bonusHp ? bonusHp : 0);
    if (overrideHp !== null) {
        totalHp = overrideHp;
    }
    const finalTotalHp = Math.max(totalHp, RuleDataAccessors.getMinimumHpTotal(ruleData));
    const finalRemovedHp = Math.min(finalTotalHp, removedHp);
    return {
        baseHp: finalBaseHp,
        baseTotalHp,
        bonusHp,
        classesHitDice,
        hitPointSources,
        overrideHp,
        possibleMaxHitPoints,
        remainingHp: finalTotalHp - finalRemovedHp,
        removedHp: finalRemovedHp,
        tempHp,
        totalAverageHp,
        totalFixedValueHp,
        totalHitPointSources,
        totalHp: finalTotalHp,
    };
}
/**
 *
 * @param classes
 * @param race
 * @param feats
 * @param items
 * @param modifierData
 * @param abilityLookup
 * @param ruleData
 * @param proficiencyBonus
 * @param characterId
 */
export function generateProtectionSuppliers(classes, race, feats, items, modifierData, abilityLookup, ruleData, proficiencyBonus, characterId) {
    let protectionSuppliers = [];
    if (race !== null) {
        RaceAccessors.getRacialTraits(race).forEach((racialTrait) => {
            const modifiers = RacialTraitAccessors.getModifiers(racialTrait);
            const foundProtectionModifier = modifiers.find(ModifierValidators.isProtectionZeroHpModifier);
            if (!foundProtectionModifier) {
                return;
            }
            const actions = RacialTraitAccessors.getActions(racialTrait);
            if (actions.length !== 1) {
                return;
            }
            const action = actions[0];
            const limitedUse = ActionAccessors.getLimitedUse(action);
            if (!limitedUse) {
                return;
            }
            protectionSuppliers.push({
                type: ProtectionSupplierTypeEnum.RACIAL_TRAIT,
                data: racialTrait,
                modifier: foundProtectionModifier,
                setHpValue: ModifierDerivers.deriveValue(foundProtectionModifier, modifierData),
                key: [ProtectionSupplierTypeEnum.RACIAL_TRAIT, RacialTraitAccessors.getUniqueKey(racialTrait)].join('-'),
                availabilityStatus: deriveProtectionSupplierAvailabilityStatus(limitedUse, abilityLookup, ruleData, proficiencyBonus),
                action,
            });
        });
    }
    classes.forEach((charClass) => {
        ClassAccessors.getClassFeatures(charClass).forEach((classFeature) => {
            const modifiers = ClassFeatureAccessors.getModifiers(classFeature);
            const foundProtectionModifier = modifiers.find(ModifierValidators.isProtectionZeroHpModifier);
            if (!foundProtectionModifier) {
                return;
            }
            const actions = ClassFeatureAccessors.getActions(classFeature);
            if (actions.length !== 1) {
                return;
            }
            const action = actions[0];
            const limitedUse = ActionAccessors.getLimitedUse(action);
            if (!limitedUse) {
                return;
            }
            protectionSuppliers.push({
                type: ProtectionSupplierTypeEnum.CLASS_FEATURE,
                data: classFeature,
                modifier: foundProtectionModifier,
                setHpValue: ModifierDerivers.deriveValue(foundProtectionModifier, modifierData),
                key: [ProtectionSupplierTypeEnum.CLASS_FEATURE, ClassFeatureAccessors.getUniqueKey(classFeature)].join('-'),
                availabilityStatus: deriveProtectionSupplierAvailabilityStatus(limitedUse, abilityLookup, ruleData, proficiencyBonus),
                action,
            });
        });
    });
    feats.forEach((feat) => {
        const modifiers = FeatAccessors.getModifiers(feat);
        const foundProtectionModifier = modifiers.find(ModifierValidators.isProtectionZeroHpModifier);
        if (!foundProtectionModifier) {
            return;
        }
        const actions = FeatAccessors.getActions(feat);
        if (actions.length !== 1) {
            return;
        }
        const action = actions[0];
        const limitedUse = ActionAccessors.getLimitedUse(action);
        if (!limitedUse) {
            return;
        }
        protectionSuppliers.push({
            type: ProtectionSupplierTypeEnum.FEAT,
            data: feat,
            modifier: foundProtectionModifier,
            setHpValue: ModifierDerivers.deriveValue(foundProtectionModifier, modifierData),
            key: [ProtectionSupplierTypeEnum.FEAT, FeatAccessors.getUniqueKey(feat)].join('-'),
            availabilityStatus: deriveProtectionSupplierAvailabilityStatus(limitedUse, abilityLookup, ruleData, proficiencyBonus),
            action,
        });
    });
    items.forEach((item) => {
        const modifiers = ItemAccessors.getModifiers(item);
        const foundProtectionModifier = modifiers.find(ModifierValidators.isProtectionZeroHpModifier);
        if (!foundProtectionModifier) {
            return;
        }
        const limitedUse = ItemAccessors.getLimitedUse(item);
        if (limitedUse === null) {
            return;
        }
        protectionSuppliers.push({
            type: ProtectionSupplierTypeEnum.ITEM,
            data: item,
            modifier: foundProtectionModifier,
            setHpValue: ModifierDerivers.deriveValue(foundProtectionModifier, modifierData),
            key: [ProtectionSupplierTypeEnum.ITEM, ItemAccessors.getUniqueKey(item)].join('-'),
            availabilityStatus: deriveItemProtectionSupplierAvailabilityStatus(item, foundProtectionModifier, limitedUse, abilityLookup, ruleData, proficiencyBonus, characterId),
            action: null,
        });
    });
    return protectionSuppliers;
}
