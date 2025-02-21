import { orderBy } from 'lodash';
import { ChoiceUtils } from '../Choice';
import { ClassFeatureAccessors, ClassFeatureUtils, ClassFeatureValidators } from '../ClassFeature';
import { DB_STRING_BOOK_OF_ANCIENT_SECRETS, DB_STRING_INFUSE_ITEM, FeatureTypeEnum, } from '../Core';
import { DataOriginGenerators } from '../DataOrigin';
import { HelperUtils } from '../Helper';
import { ModifierValidators } from '../Modifier';
import { OptionalClassFeatureAccessors } from '../OptionalClassFeature';
import { DefaultSpellCastingLearningStyle, SpellDerivers } from '../Spell';
import { getActiveId, getDefinitionClassFeatures, getDefinitionSpellcastingStatId, getId, getLevel, getMappingId, getSubclass, getClassFeatures, getDefinitionSpellCastingLearningStyle, } from './accessors';
/**
 *
 * @param charClass
 * @param subclassDefinition
 */
export function deriveSpellcastingStatId(charClass, subclassDefinition) {
    if (subclassDefinition && subclassDefinition.spellCastingAbilityId !== null) {
        return subclassDefinition.spellCastingAbilityId;
    }
    return getDefinitionSpellcastingStatId(charClass);
}
/**
 *
 * @param charClass
 * @param subclassDefinition
 */
export function deriveSpellCastingLearningStyle(charClass) {
    var _a;
    const subclassDefinition = getSubclass(charClass);
    if (subclassDefinition === null || subclassDefinition === void 0 ? void 0 : subclassDefinition.spellCastingLearningStyle) {
        return subclassDefinition.spellCastingLearningStyle;
    }
    return (_a = getDefinitionSpellCastingLearningStyle(charClass)) !== null && _a !== void 0 ? _a : DefaultSpellCastingLearningStyle;
}
/**
 *
 * @param classFeatures
 * @param classLevel
 */
export function deriveIsSpellcastingActive(classFeatures, classLevel) {
    const spellcastingFeature = classFeatures.find((feature) => ClassFeatureUtils.doesEnableSpellcasting(feature));
    return !!spellcastingFeature && ClassFeatureAccessors.getRequiredLevel(spellcastingFeature) <= classLevel;
}
/**
 *
 * @param classFeatures
 * @param classLevel
 */
export function deriveIsPactMagicActive(classFeatures, classLevel) {
    const pactMagicFeature = classFeatures.find((feature) => ClassFeatureUtils.doesEnablePactMagic(feature));
    return !!pactMagicFeature && ClassFeatureAccessors.getRequiredLevel(pactMagicFeature) <= classLevel;
}
/**
 *
 * @param charClass
 * @param allClassSpells
 * @param allClassAlwaysPreparedSpells
 * @param allClassAlwaysKnownSpells
 */
export function deriveSpells(charClass, allClassSpells, allClassAlwaysPreparedSpells, allClassAlwaysKnownSpells) {
    const classSpells = allClassSpells.find((classSpell) => classSpell.characterClassId === getMappingId(charClass));
    const spells = [];
    if (classSpells === null || classSpells === void 0 ? void 0 : classSpells.spells) {
        spells.push(...classSpells.spells);
    }
    let classSpellMappingLookup = {};
    const alwaysPreparedSpells = HelperUtils.lookupDataOrFallback(allClassAlwaysPreparedSpells, deriveActiveId(charClass));
    const alwaysKnownSpells = HelperUtils.lookupDataOrFallback(allClassAlwaysKnownSpells, deriveActiveId(charClass));
    // If we have any "always" spells, make a lookup of the existing class spell mappings
    if (alwaysKnownSpells !== null || alwaysPreparedSpells !== null) {
        if (classSpells === null || classSpells === void 0 ? void 0 : classSpells.spells) {
            classSpellMappingLookup = classSpells.spells.reduce((acc, spell) => {
                acc[SpellDerivers.deriveKnownKey(spell)] = true;
                return acc;
            }, {});
        }
    }
    // exclude always prepared spells that we are already sent in the class spell mappings
    if (alwaysPreparedSpells !== null) {
        alwaysPreparedSpells.forEach((spell) => {
            const knownKey = SpellDerivers.deriveKnownKey(spell);
            if (!HelperUtils.lookupDataOrFallback(classSpellMappingLookup, knownKey, false)) {
                spells.push(spell);
                classSpellMappingLookup[knownKey] = true;
            }
        });
    }
    // exclude always known spells that we are already sent in the class spell mappings
    if (alwaysKnownSpells !== null) {
        alwaysKnownSpells.forEach((spell) => {
            if (!HelperUtils.lookupDataOrFallback(classSpellMappingLookup, SpellDerivers.deriveKnownKey(spell), false)) {
                spells.push(spell);
            }
        });
    }
    return spells;
}
/**
 * The classFeatures being passed in here are updated during BaseCharClass generation and cannot be accessed off charClass
 * fix this to eventually not have class and class features from separate stages
 *
 * @param charClass
 * @param classFeatures
 * @param choiceLookup
 * @param ruleData
 */
export function deriveSpellRules(charClass, classFeatures, choiceLookup, ruleData) {
    const abilityId = deriveSpellcastingStatId(charClass, getSubclass(charClass));
    let enablesRitualCasting = false;
    classFeatures.forEach((feature) => {
        const id = ClassFeatureAccessors.getId(feature);
        const entityTypeId = ClassFeatureAccessors.getEntityTypeId(feature);
        const choicesFallback = [];
        const choices = HelperUtils.lookupDataOrFallback(choiceLookup, DataOriginGenerators.generateDataOriginKey(id, entityTypeId), choicesFallback);
        if (choices.length > 0) {
            choices.forEach((choice) => {
                const selectedOption = ChoiceUtils.getSelectedOption(choice);
                if (!enablesRitualCasting &&
                    selectedOption &&
                    selectedOption.label === DB_STRING_BOOK_OF_ANCIENT_SECRETS) {
                    enablesRitualCasting = true;
                }
            });
        }
    });
    return SpellDerivers.deriveClassSpellRules(charClass, abilityId, ruleData, enablesRitualCasting);
}
/**
 *
 * @param charClass
 * @param classFeatures
 * @param appContext
 */
export function deriveClassFeatureGroups(charClass, classFeatures, appContext) {
    const activeFeatures = classFeatures.filter((feature) => ClassFeatureAccessors.getRequiredLevel(feature) <= getLevel(charClass));
    const visibleFeatures = activeFeatures.filter((feature) => appContext === null || !ClassFeatureUtils.getHideInContext(feature, appContext));
    const orderedFeatures = deriveOrderedClassFeatures(visibleFeatures);
    const uniqueFeatures = orderedFeatures.reduce((acc, feature) => {
        const existingFeatureIdx = acc.findIndex((accFeature) => ClassFeatureAccessors.getName(accFeature) === ClassFeatureAccessors.getName(feature));
        if (existingFeatureIdx > 0) {
            acc[existingFeatureIdx] = feature;
        }
        else {
            acc.push(feature);
        }
        return acc;
    }, []);
    return {
        activeFeatures,
        visibleFeatures,
        orderedFeatures,
        uniqueFeatures,
    };
}
/**
 *
 * @param classFeatures
 */
export function deriveOrderedClassFeatures(classFeatures) {
    return orderBy(classFeatures, [
        (classFeature) => ClassFeatureAccessors.getRequiredLevel(classFeature),
        (classFeature) => ClassFeatureAccessors.getDisplayOrder(classFeature),
        (classFeature) => ClassFeatureAccessors.getName(classFeature),
    ]);
}
/**
 *
 * @param classFeatures
 */
export function deriveDedicatedHexAndPactWeaponEnabled(classFeatures, classModifiers) {
    let enablesHexWeapon = false;
    let enablesPactWeapon = false;
    let enablesDedicatedWeapon = false;
    classModifiers.forEach((modifier) => {
        if (!enablesPactWeapon && ModifierValidators.isEnablePactWeaponModifier(modifier)) {
            enablesPactWeapon = true;
            return;
        }
        if (!enablesHexWeapon && ModifierValidators.isEnableHexWeaponModifier(modifier)) {
            enablesHexWeapon = true;
            return;
        }
    });
    //TODO remove this once we have dedicated weapon driven by modifiers
    classFeatures.forEach((feature) => {
        if (!enablesDedicatedWeapon && ClassFeatureUtils.doesEnableDedicatedWeapon(feature)) {
            enablesDedicatedWeapon = true;
        }
    });
    return {
        enablesHexWeapon,
        enablesPactWeapon,
        enablesDedicatedWeapon,
    };
}
/**
 *
 * @param charClass
 */
export function deriveActiveId(charClass) {
    const subclass = getSubclass(charClass);
    if (subclass === null) {
        return getId(charClass);
    }
    return subclass.id;
}
/**
 *
 * @param classes
 */
export function deriveIsMulticlassCharacter(classes) {
    return classes.length > 1;
}
/**
 *
 * @param charClass
 */
export function deriveUniqueKey(charClass) {
    return `class-${getActiveId(charClass)}`;
}
/**
 *
 * @param classFeatures
 * @param classLevel
 */
export function deriveSpellListIds(classFeatures, classLevel) {
    let spellLidsIds = [];
    classFeatures
        .filter((classFeature) => ClassFeatureAccessors.getRequiredLevel(classFeature) <= classLevel)
        .forEach((classFeature) => {
        spellLidsIds.push(...ClassFeatureAccessors.getSpellListIds(classFeature));
    });
    return spellLidsIds;
}
/**
 * has mirrored deriver RaceDerivers.deriveConsolidatedRacialTraits
 *   - most likely update together
 *
 * @param charClass
 * @param optionalClassFeatures
 * @param enableOptionalClassFeatures
 */
export function deriveConsolidatedClassFeatures(charClass, optionalClassFeatures, enableOptionalClassFeatures) {
    //filtering because after generating CharClass, this function is used in getUpdateEnableOptionalClassFeaturesSpellListIdsToRemove
    //      to determine updated look of race and we don't store original definition info for classes
    const originalDefinitionClassFeatures = getDefinitionClassFeatures(charClass).filter((feature) => ClassFeatureAccessors.getFeatureType(feature) === FeatureTypeEnum.GRANTED);
    if (!enableOptionalClassFeatures) {
        return originalDefinitionClassFeatures;
    }
    const additionalClassFeatures = [];
    const definitionKeysToRemove = new Set();
    optionalClassFeatures.forEach((optionalClassFeature) => {
        const classFeature = OptionalClassFeatureAccessors.getClassFeature(optionalClassFeature);
        if (classFeature === null) {
            return;
        }
        const featureType = ClassFeatureAccessors.getFeatureType(classFeature);
        switch (featureType) {
            case FeatureTypeEnum.REPLACEMENT: {
                const affectedDefinitionKey = OptionalClassFeatureAccessors.getAffectedClassFeatureDefinitionKey(optionalClassFeature);
                const affectedFeatureKeys = ClassFeatureAccessors.getAffectedFeatureDefinitionKeys(classFeature);
                //verify this is a valid replacement
                if (affectedDefinitionKey &&
                    affectedFeatureKeys.includes(affectedDefinitionKey) &&
                    ClassFeatureValidators.isValidClassClassFeature(charClass, classFeature)) {
                    definitionKeysToRemove.add(affectedDefinitionKey);
                    additionalClassFeatures.push(classFeature);
                }
                break;
            }
            case FeatureTypeEnum.ADDITIONAL:
            case FeatureTypeEnum.GRANTED:
            default:
                if (ClassFeatureValidators.isValidClassClassFeature(charClass, classFeature)) {
                    additionalClassFeatures.push(classFeature);
                }
        }
    });
    //remove definitionKeysToRemove
    const filteredDefinitionClassFeatures = originalDefinitionClassFeatures.filter((feature) => !definitionKeysToRemove.has(ClassFeatureAccessors.getDefinitionKey(feature)));
    return [...filteredDefinitionClassFeatures, ...additionalClassFeatures];
}
/**
 *
 * @param charClass
 */
export function deriveMaxInfusions(charClass) {
    var _a;
    const features = getClassFeatures(charClass);
    const infuseFeature = features.find((classFeature) => ClassFeatureAccessors.getName(classFeature) === DB_STRING_INFUSE_ITEM);
    if (infuseFeature) {
        const infusionLevelScale = ClassFeatureAccessors.getLevelScale(infuseFeature);
        return (_a = infusionLevelScale === null || infusionLevelScale === void 0 ? void 0 : infusionLevelScale.fixedValue) !== null && _a !== void 0 ? _a : 0;
    }
    return null;
}
