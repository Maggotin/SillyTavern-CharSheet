import { keyBy, orderBy } from 'lodash';
import { AbilityDerivers } from '../Ability';
import { CharacterDerivers, } from '../Character';
import { ClassFeatureAccessors, ClassFeatureGenerators } from '../ClassFeature';
import { DB_STRING_IMPROVED_PACT_WEAPON } from '../Core';
import { DataOriginDataInfoKeyEnum, DataOriginTypeEnum } from '../DataOrigin';
import { FormatUtils } from '../Format';
import { ModifierDerivers, ModifierValidators } from '../Modifier';
import { OptionAccessors } from '../Option';
import { SpellAccessors, SpellDerivers, SpellGenerators, } from '../Spell';
import { getActiveId, getBaseClassSpells, getClassFeatures, getDefinitionClassFeatures, getEnablesDedicatedWeapon, getEnablesHexWeapon, getEnablesPactWeapon, getId, getLevel, getMappingId, getName, getSlug, getSpellPrepareType, getSpellRules, getSpells, getSubclass, isPactMagicActive, isSpellcastingActive, isStartingClass, } from './accessors';
import { deriveActiveId, deriveClassFeatureGroups, deriveConsolidatedClassFeatures, deriveDedicatedHexAndPactWeaponEnabled, deriveIsPactMagicActive, deriveIsSpellcastingActive, deriveSpellCastingLearningStyle, deriveSpellListIds, deriveSpellRules, deriveSpells, deriveUniqueKey, } from './derivers';
export function generateBaseCharClasses(charClasses, optionalClassFeatures, allClassSpells, allClassAlwaysPreparedSpells, allClassAlwaysKnownSpells, appContext, ruleData, classesLookupData, definitionPool, characterPreferences, characterId, choiceComponents, baseFeats) {
    const orderedClasses = orderBy(charClasses, [(charClass) => isStartingClass(charClass), (charClass) => getName(charClass)], ['desc', 'asc']);
    const hack__baseCharClasses = orderedClasses.map((charClass) => hack__generateHackBaseCharClass(charClass, optionalClassFeatures, ruleData, classesLookupData, characterPreferences.enableOptionalClassFeatures));
    return hack__baseCharClasses.map((charClass) => generateBaseCharClass(charClass, optionalClassFeatures, allClassSpells, allClassAlwaysPreparedSpells, allClassAlwaysKnownSpells, appContext, ruleData, classesLookupData, definitionPool, characterId, choiceComponents, baseFeats));
}
export function hack__generateHackBaseCharClass(charClass, optionalClassFeatures, ruleData, classesLookupData, enableOptionalClassFeatures) {
    const consolidatedClassFeatureDefinitions = deriveConsolidatedClassFeatures(charClass, optionalClassFeatures, enableOptionalClassFeatures);
    return Object.assign(Object.assign({}, charClass), { spellRules: deriveSpellRules(charClass, consolidatedClassFeatureDefinitions, classesLookupData.choiceLookup, ruleData), isSpellcastingActive: deriveIsSpellcastingActive(consolidatedClassFeatureDefinitions, getLevel(charClass)), isPactMagicActive: deriveIsPactMagicActive(consolidatedClassFeatureDefinitions, getLevel(charClass)), classFeatures: consolidatedClassFeatureDefinitions });
}
/**
 *
 * @param charClass
 * @param classSpells
 * @param classFeatures
 */
function updateClassFeatures(charClass, classSpells, classFeatures) {
    return classFeatures.map((classFeature) => {
        const spells = SpellGenerators.updateClassFeatureSpells(ClassFeatureAccessors.getSpells(classFeature), classSpells);
        const options = ClassFeatureAccessors.getOptions(classFeature).map((option) => {
            const spells = SpellGenerators.updateClassFeatureSpells(OptionAccessors.getSpells(option), classSpells);
            return Object.assign(Object.assign({}, option), { spells });
        });
        return Object.assign(Object.assign({}, classFeature), { spells,
            options });
    });
}
export function generateBaseCharClass(charClass, optionalClassFeatures, allClassSpells, allClassAlwaysPreparedSpells, allClassAlwaysKnownSpells, appContext, ruleData, classesLookupData, definitionPool, characterId, choiceComponents, baseFeats) {
    const classModifiers = [];
    const featureSpells = [];
    const feats = [];
    const actions = [];
    const generatedClassFeatures = getDefinitionClassFeatures(charClass).map((classFeature) => ClassFeatureGenerators.generateClassFeature(charClass, classFeature, ruleData, classesLookupData, definitionPool, characterId, choiceComponents, baseFeats));
    // update modifiers, feats and actions arrays based on classFeatures
    generatedClassFeatures.forEach((generatedClassFeature) => {
        classModifiers.push(...ClassFeatureAccessors.getModifiers(generatedClassFeature));
        feats.push(...ClassFeatureAccessors.getFeats(generatedClassFeature));
        actions.push(...ClassFeatureAccessors.getActions(generatedClassFeature));
        ClassFeatureAccessors.getOptions(generatedClassFeature).forEach((option) => {
            classModifiers.push(...OptionAccessors.getModifiers(option));
            feats.push(...OptionAccessors.getFeats(option));
            actions.push(...OptionAccessors.getActions(option));
        });
    });
    const classSpells = deriveSpells(charClass, allClassSpells, allClassAlwaysPreparedSpells, allClassAlwaysKnownSpells);
    const updatedFeatures = updateClassFeatures(charClass, classSpells, generatedClassFeatures);
    // update spells array base on updated classFeatures
    updatedFeatures.forEach((classFeature) => {
        featureSpells.push(...ClassFeatureAccessors.getSpells(classFeature));
        ClassFeatureAccessors.getOptions(classFeature).forEach((option) => {
            featureSpells.push(...OptionAccessors.getSpells(option));
        });
    });
    const { activeFeatures, visibleFeatures, orderedFeatures, uniqueFeatures } = deriveClassFeatureGroups(charClass, updatedFeatures, appContext);
    // do any class features or modifiers enable hex, pact or dedicated weapons
    //TODO eventually should just be able to use modifiers here and not have to check class feature names
    const { enablesHexWeapon, enablesPactWeapon, enablesDedicatedWeapon } = deriveDedicatedHexAndPactWeaponEnabled(updatedFeatures, classModifiers);
    return Object.assign(Object.assign({}, charClass), { activeId: deriveActiveId(charClass), spells: SpellGenerators.updateClassSpells(featureSpells, classSpells), modifiers: classModifiers, featureSpells, classFeatures: updatedFeatures, optionalClassFeatures, activeClassFeatures: activeFeatures, visibleClassFeatures: visibleFeatures, orderedClassFeatures: orderedFeatures, uniqueClassFeatures: uniqueFeatures, feats,
        actions,
        enablesDedicatedWeapon,
        enablesHexWeapon,
        enablesPactWeapon, slug: FormatUtils.cobaltSlugify(getName(charClass)), spellListIds: deriveSpellListIds(updatedFeatures, getLevel(charClass)), spellCastingLearningStyle: deriveSpellCastingLearningStyle(charClass) });
}
export function generateClassFeatureLookup(baseCharClasses) {
    const lookup = {};
    for (const baseCharClass of baseCharClasses) {
        for (const classFeature of baseCharClass.classFeatures) {
            if (classFeature.definition) {
                lookup[classFeature.definition.id] = classFeature;
            }
        }
    }
    return lookup;
}
/**
 *
 * @param classes
 */
export function generateTotalClassLevel(classes) {
    return classes.reduce((acc, charClass) => (acc += getLevel(charClass)), 0);
}
/**
 *
 * @param classes
 * @param ruleData
 * @param proficiencyBonus
 * @param modifiers
 * @param abilityLookup
 */
export function generateClassSpellInfoLookup(classes, ruleData, proficiencyBonus, modifiers, abilityLookup) {
    const lookup = {};
    classes.forEach((charClass) => {
        var _a;
        const classId = getId(charClass);
        const classSlug = getSlug(charClass);
        const classLevel = getLevel(charClass);
        const classSpellRules = getSpellRules(charClass);
        const spellPrepareType = getSpellPrepareType(charClass);
        const spellcastingModifier = AbilityDerivers.deriveStatModifier(classSpellRules.spellcastingAbilityStatId, abilityLookup);
        const knownCantripsMax = classSpellRules.levelCantripsKnownMaxes
            ? classSpellRules.levelCantripsKnownMaxes[classLevel]
            : null;
        const preparedSpellsMax = classSpellRules.levelPreparedSpellMaxes
            ? (_a = classSpellRules.levelPreparedSpellMaxes[classLevel]) !== null && _a !== void 0 ? _a : null // coallesce if the array is shorter than the class level, happens for prepared classes not using OSIRIS rules
            : null;
        const prepareMax = preparedSpellsMax !== null && preparedSpellsMax !== void 0 ? preparedSpellsMax : SpellDerivers.deriveSpellPrepareMax(spellPrepareType, classLevel, spellcastingModifier);
        const baseToHitModifier = SpellDerivers.deriveSpellAttackModifier(proficiencyBonus, spellcastingModifier);
        const bonusSpellSaveDcModifiers = modifiers.filter((modifier) => ModifierValidators.isBonusSpellSaveDc(modifier));
        const bonusSpellSaveDcModifierTotal = ModifierDerivers.sumModifiers(bonusSpellSaveDcModifiers, abilityLookup);
        const bonusClassCantripDamageModifiers = modifiers.filter((modifier) => ModifierValidators.isValidBonusClassCantripDamageModifier(modifier, classSlug));
        const bonusClassCantripDamageModifierTotal = ModifierDerivers.sumModifiers(bonusClassCantripDamageModifiers, abilityLookup);
        const classSaveDcModifiers = modifiers.filter((modifier) => ModifierValidators.isValidBonusClassSpellSaveDcModifier(modifier, classSlug));
        const classSaveDcModifierTotal = ModifierDerivers.sumModifiers(classSaveDcModifiers, abilityLookup);
        const bonusSpellAttackModifiers = modifiers.filter((modifier) => ModifierValidators.isValidBonusSpellAttackModifier(modifier, null));
        const bonusSpellAttackModifierTotal = ModifierDerivers.sumModifiers(bonusSpellAttackModifiers, abilityLookup);
        const classSpellAttackModifiers = modifiers.filter((modifier) => ModifierValidators.isValidBonusClassSpellAttackModifier(modifier, classSlug));
        const classSpellAttackModifierTotal = ModifierDerivers.sumModifiers(classSpellAttackModifiers, abilityLookup);
        const classSpellDamageModifiers = modifiers.filter((modifier) => ModifierValidators.isValidDamageClassSpellAttackModifier(modifier, classSlug));
        const classSpellDamageModifierTotal = ModifierDerivers.sumModifiers(classSpellDamageModifiers, abilityLookup);
        const spellSaveDc = CharacterDerivers.deriveAttackSaveValue(proficiencyBonus, spellcastingModifier) +
            bonusSpellSaveDcModifierTotal +
            classSaveDcModifierTotal;
        const bonusSpellAttack = bonusSpellAttackModifierTotal + classSpellAttackModifierTotal;
        const toHit = baseToHitModifier + bonusSpellAttack;
        lookup[classId] = {
            spellcastingModifier,
            baseToHitModifier,
            bonusSpellAttack,
            spellDamage: classSpellDamageModifierTotal,
            bonusCantripDamage: bonusClassCantripDamageModifierTotal,
            spellSaveDc,
            toHit,
            knownCantripsMax,
            prepareMax,
            knowsAllSpells: classSpellRules.knowsAllSpells,
        };
    });
    return lookup;
}
/**
 *
 * @param charClasses
 * @param classSpellInfoLookup
 * @param overallSpellInfo
 * @param spellListDataOriginLookup
 * @param valueLookup
 * @param ruleData
 * @param modifierData
 */
export function generateCharClasses(charClasses, classSpellInfoLookup, overallSpellInfo, spellListDataOriginLookup, valueLookup, ruleData, modifierData) {
    return charClasses.map((charClass) => generateCharClass(charClass, classSpellInfoLookup, overallSpellInfo, spellListDataOriginLookup, valueLookup, ruleData, modifierData));
}
/**
 *
 * @param charClass
 * @param classSpellInfoLookup
 * @param overallSpellInfo
 * @param spellListDataOriginLookup
 * @param valueLookup
 * @param ruleData
 * @param modifierData
 */
export function generateCharClass(charClass, classSpellInfoLookup, overallSpellInfo, spellListDataOriginLookup, valueLookup, ruleData, modifierData) {
    const classSpellInfo = classSpellInfoLookup[getId(charClass)];
    const generatedSpells = getBaseClassSpells(charClass).map((spell) => {
        const dataOriginSpell = SpellGenerators.generateDataOriginSpell(spell, DataOriginTypeEnum.CLASS, charClass, null, spellListDataOriginLookup);
        return SpellGenerators.generateClassSpell(dataOriginSpell, classSpellInfo, overallSpellInfo, valueLookup, ruleData, modifierData);
    });
    return Object.assign(Object.assign({}, charClass), { spells: generatedSpells });
}
/**
 *
 * @param classes
 */
export function generateStartingClass(classes) {
    const startingClass = classes.find((charClass) => isStartingClass(charClass));
    return startingClass ? startingClass : null;
}
/**
 *
 * @param classes
 */
export function generateHexWeaponEnabled(classes) {
    let hexWeaponEnabled = false;
    classes.forEach((charClass) => {
        hexWeaponEnabled = getEnablesHexWeapon(charClass) || hexWeaponEnabled;
    });
    return hexWeaponEnabled;
}
/**
 *
 * @param classes
 */
export function generatePactWeaponEnabled(classes) {
    let pactWeaponEnabled = false;
    classes.forEach((charClass) => {
        pactWeaponEnabled = getEnablesPactWeapon(charClass) || pactWeaponEnabled;
    });
    return pactWeaponEnabled;
}
/**
 *
 * @param classes
 */
export function generateImprovedPactWeaponEnabled(classes) {
    let improvedPactWeaponEnabled = false;
    classes.forEach((charClass) => {
        if (improvedPactWeaponEnabled) {
            return;
        }
        const features = getClassFeatures(charClass);
        features.forEach((feature) => {
            if (improvedPactWeaponEnabled) {
                return;
            }
            const options = ClassFeatureAccessors.getOptions(feature);
            options.forEach((option) => {
                improvedPactWeaponEnabled =
                    improvedPactWeaponEnabled || OptionAccessors.getName(option) === DB_STRING_IMPROVED_PACT_WEAPON;
            });
        });
    });
    return improvedPactWeaponEnabled;
}
/**
 *
 * @param classes
 */
export function generateDedicatedWeaponEnabled(classes) {
    let dedicatedWeaponEnabled = false;
    classes.forEach((charClass) => {
        dedicatedWeaponEnabled = getEnablesDedicatedWeapon(charClass) || dedicatedWeaponEnabled;
    });
    return dedicatedWeaponEnabled;
}
/**
 *
 * @param classes
 */
export function generateClassLevelLookup(classes) {
    return classes.reduce((acc, charClass) => {
        var _a, _b;
        acc[getId(charClass)] = getLevel(charClass);
        // add subclass level - this is used for Druid Circle of the Moon creature rules
        const subclassId = (_b = (_a = getSubclass(charClass)) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : null;
        if (subclassId) {
            acc[subclassId] = getLevel(charClass);
        }
        return acc;
    }, {});
}
/**
 *
 * @param modifierLookup
 * @param spellLookup
 * @param actionLookup
 * @param choiceLookup
 * @param optionLookup
 * @param valueLookup
 * @param featLookup
 * @param infusionChoiceInfusionLookup
 * @param knownInfusionLookupByChoiceKey
 * @param spellListDataOriginLookup
 */
export function generateClassesLookupData(modifierLookup, spellLookup, actionLookup, choiceLookup, optionLookup, valueLookup, featLookup, infusionChoiceInfusionLookup, knownInfusionLookupByChoiceKey, spellListDataOriginLookup) {
    return {
        modifierLookup,
        spellLookup,
        actionLookup,
        choiceLookup,
        optionLookup,
        valueLookup,
        featLookup,
        infusionChoiceInfusionLookup,
        knownInfusionLookupByChoiceKey,
        spellListDataOriginLookup,
    };
}
/**
 *
 * @param classes
 */
export function generateSpellcastingClasses(classes) {
    return classes.filter(isSpellcastingActive);
}
/**
 *
 * @param classes
 */
export function generatePactMagicClasses(classes) {
    return classes.filter(isPactMagicActive);
}
/**
 *
 * @param spellcastingClasses
 * @param pactMagicClasses
 */
export function generateAggregatedSpellClasses(spellcastingClasses, pactMagicClasses) {
    return [...spellcastingClasses, ...pactMagicClasses];
}
/**
 *
 * @param classes
 */
export function generateClassMappingIdLookupByActiveId(classes) {
    return classes.reduce((acc, charClass) => {
        acc[getActiveId(charClass)] = getMappingId(charClass);
        return acc;
    }, {});
}
/**
 *
 * @param classes
 * @param isMulticlassCharacter
 */
export function generateClassesModifiers(classes, isMulticlassCharacter) {
    const modifiers = [];
    if (classes.length === 0) {
        return modifiers;
    }
    classes.forEach((charClass) => {
        getClassFeatures(charClass).forEach((classFeature) => {
            modifiers.push(...ClassFeatureAccessors.getModifiers(classFeature).filter((modifier) => ModifierValidators.isValidClassModifier(modifier, charClass, isMulticlassCharacter)));
            ClassFeatureAccessors.getOptions(classFeature).forEach((option) => {
                modifiers.push(...OptionAccessors.getModifiers(option).filter((modifier) => ModifierValidators.isValidClassModifier(modifier, charClass, isMulticlassCharacter)));
            });
        });
    });
    return modifiers;
}
/**
 *
 * @param classes
 */
export function generateRefClassData(classes) {
    let data = {};
    classes.forEach((charClass) => {
        data[deriveUniqueKey(charClass)] = {
            [DataOriginDataInfoKeyEnum.PRIMARY]: charClass,
            [DataOriginDataInfoKeyEnum.PARENT]: null,
        };
    });
    return data;
}
/**
 *
 * @param classes
 */
export function generateClassSpellListSpellsLookup(classes) {
    const lookup = {};
    classes.forEach((charClass) => {
        const spells = getSpells(charClass);
        spells.forEach((spell) => {
            const spellListId = SpellAccessors.getSpellListId(spell);
            if (spellListId !== null) {
                if (!lookup[spellListId]) {
                    lookup[spellListId] = [];
                }
                lookup[spellListId].push({
                    spell,
                    charClass,
                });
            }
        });
    });
    return lookup;
}
/**
 *
 * @param classes
 */
export function generateBaseClassLookup(classes) {
    return keyBy(classes, (baseClass) => getMappingId(baseClass));
}
