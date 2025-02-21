import { flatten, groupBy, orderBy, uniqBy } from 'lodash';
import { TypeScriptUtils } from '../../utils';
import { AbilityDerivers } from '../Ability';
import { BackgroundAccessors, BackgroundDerivers } from '../Background';
import { CampaignAccessors } from '../Campaign';
import { CharacterDerivers, } from '../Character';
import { ClassAccessors } from '../Class';
import { ClassFeatureAccessors, ClassFeatureSimulators } from '../ClassFeature';
import { DB_STRING_RITUAL_CASTER_LIST } from '../Core';
import { DataOriginGenerators, DataOriginTypeEnum } from '../DataOrigin';
import { FeatAccessors } from '../Feat';
import { HelperUtils } from '../Helper';
import { ItemAccessors, ItemDerivers, ItemValidators } from '../Item';
import { LimitedUseDerivers } from '../LimitedUse';
import { ModifierAccessors, ModifierBonusTypeEnum, ModifierDerivers, ModifierValidators, } from '../Modifier';
import { OptionalClassFeatureAccessors } from '../OptionalClassFeature';
import { OptionalOriginAccessors } from '../OptionalOrigin';
import { RaceAccessors } from '../Race';
import { RacialTraitAccessors, RacialTraitSimulators } from '../RacialTrait';
import { RuleDataAccessors } from '../RuleData';
import { asPartOfWeaponAttack, countsAsKnownSpell, getAttackType, getAtWillLimitedUseLevel, getBaseLevelAtWill, getComponentId, getComponentTypeId, getDataOrigin, getDataOriginType, getId, getLevel, getLimitedUse, getMappingId, getName, getSpellGroups, isActive, isAlwaysPrepared, isAttack, isCantrip, isDisplayAsAttack, } from './accessors';
import { deriveAtHigherLevels, deriveCanPrepare, deriveCanRemove, deriveCharacterLevel, deriveExpandedDataOriginRef, deriveIsActive, deriveIsCantripsKnownMaxed, deriveIsCastAsRitual, deriveIsCastedByRitualSpellcaster, deriveIsCastedBySpellbookSpellcaster, deriveIsCustomized, deriveIsDisplayAsAttack, deriveIsPrepared, deriveIsRitual, deriveIsSpellsKnownMaxed, deriveKnownKey, deriveModifiers, deriveName, deriveNotes, deriveRange, deriveSpellAttackModifier, deriveSpellAttackSaveValue, deriveSpellBonusFixedDamage, deriveSpellPrepareMax, deriveSpellSpellcastingModifier, deriveSpellToHit, deriveStartingCastLevel, deriveUniqueKey, getCastLevelRange, getConsumedLimitedUse, getScaledDamage, } from './derivers';
import { getScaledRange } from './utils';
import { validateIsAtWill, validateIsLimitedUseAvailableAtScaledAmount, validateShouldShowCharacterSpellAtLevel, validateShouldShowClassSpellAtLevel, } from './validators';
/**
 *
 * @param dataOriginSpell
 * @param valueLookup
 * @param ruleData
 */
export function generateBaseSpell(dataOriginSpell, valueLookup, ruleData) {
    return Object.assign(Object.assign({}, dataOriginSpell), { modifiers: deriveModifiers(dataOriginSpell, ruleData), isPrepared: deriveIsPrepared(dataOriginSpell), isActive: deriveIsActive(dataOriginSpell), isRitual: deriveIsRitual(dataOriginSpell), name: deriveName(dataOriginSpell, valueLookup), uniqueKey: deriveUniqueKey(dataOriginSpell), isCustomized: deriveIsCustomized(dataOriginSpell, valueLookup), atHigherLevels: deriveAtHigherLevels(dataOriginSpell, ruleData) });
}
/**
 *
 * @param spell
 * @param classInfo
 * @param overallInfo
 * @param valueLookup
 * @param ruleData
 * @param modifierData
 */
export function generateClassSpell(spell, classInfo, overallInfo, valueLookup, ruleData, modifierData) {
    const { proficiencyBonus, modifiers, abilityLookup, characterLevel, bonusCantripDamage } = overallInfo;
    const baseSpell = generateBaseSpell(spell, valueLookup, ruleData);
    let classFixedDamageTotal = classInfo.spellDamage;
    if (isCantrip(baseSpell)) {
        classFixedDamageTotal += bonusCantripDamage + classInfo.bonusCantripDamage;
    }
    return Object.assign(Object.assign({}, baseSpell), { range: deriveRange(baseSpell, modifiers, abilityLookup), name: deriveName(baseSpell, valueLookup), displayAsAttack: deriveIsDisplayAsAttack(baseSpell, valueLookup), isCastAsRitual: deriveIsCastAsRitual(baseSpell), notes: deriveNotes(baseSpell, valueLookup), toHit: deriveSpellToHit(baseSpell, modifiers, abilityLookup, proficiencyBonus, classInfo.toHit, valueLookup), attackSaveValue: deriveSpellAttackSaveValue(baseSpell, modifiers, proficiencyBonus, abilityLookup, classInfo.spellSaveDc, valueLookup), bonusFixedDamage: deriveSpellBonusFixedDamage(baseSpell, modifiers, abilityLookup, classFixedDamageTotal, valueLookup), spellcastingModifier: classInfo.spellcastingModifier, characterLevel: deriveCharacterLevel(baseSpell, characterLevel), canRemove: deriveCanRemove(baseSpell, classInfo), canPrepare: deriveCanPrepare(baseSpell, classInfo), canAdd: false, entity: null, spellGroupInfoLookup: generateSpellGroupInfoLookup(baseSpell, modifiers, modifierData) });
}
/**
 *
 * @param spell
 * @param modifiers
 * @param modifierData
 */
export function generateSpellGroupInfo(spell, spellGroupId, spellGroupModifiers, modifierData) {
    const highestGroupModifier = ModifierDerivers.deriveHighestValueModifier(spellGroupModifiers, modifierData);
    if (!highestGroupModifier) {
        return null;
    }
    return {
        spellGroupId,
        bonusFixedValue: ModifierDerivers.deriveValue(highestGroupModifier, modifierData, 0, true, {
            [ModifierBonusTypeEnum.SPELL_LEVEL]: getLevel(spell),
        }),
        useCastLevel: ModifierAccessors.getBonusTypes(highestGroupModifier).includes(ModifierBonusTypeEnum.SPELL_LEVEL),
    };
}
/**
 *
 * @param spell
 * @param modifiers
 * @param modifierData
 */
export function generateSpellGroupInfoLookup(spell, modifiers, modifierData) {
    const spellGroupInfos = getSpellGroups(spell)
        .map((spellGroupId) => {
        const spellGroupModifiers = modifiers.filter((modifier) => ModifierValidators.isValidBonusSpellGroupModifier(modifier, spellGroupId));
        return generateSpellGroupInfo(spell, spellGroupId, spellGroupModifiers, modifierData);
    })
        .filter(TypeScriptUtils.isNotNullOrUndefined);
    return HelperUtils.generateNonNullLookup(spellGroupInfos, (spellGroupInfo) => spellGroupInfo.spellGroupId);
}
/**
 *
 * @param toHitFallback
 * @param attackSaveFallback
 * @param bonusFixedDamageFallback
 * @param spellcastingModifier
 */
export function generateCharacterSpell_contextInfo(toHitFallback, attackSaveFallback, bonusFixedDamageFallback, spellcastingModifier) {
    return {
        toHitFallback,
        attackSaveFallback,
        bonusFixedDamageFallback,
        spellcastingModifier,
    };
}
/**
 *
 * @param spell
 * @param overallInfo
 * @param contextInfo
 * @param valueLookup
 * @param ruleData
 */
export function generateCharacterSpell(spell, overallInfo, contextInfo, valueLookup, ruleData, modifierData) {
    const { proficiencyBonus, modifiers, abilityLookup, characterLevel } = overallInfo;
    const baseSpell = generateBaseSpell(spell, valueLookup, ruleData);
    return Object.assign(Object.assign({}, baseSpell), { range: deriveRange(baseSpell, modifiers, abilityLookup), name: deriveName(baseSpell, valueLookup), displayAsAttack: deriveIsDisplayAsAttack(baseSpell, valueLookup), isCastAsRitual: deriveIsCastAsRitual(baseSpell), notes: deriveNotes(baseSpell, valueLookup), toHit: deriveSpellToHit(baseSpell, modifiers, abilityLookup, proficiencyBonus, contextInfo.toHitFallback, valueLookup), attackSaveValue: deriveSpellAttackSaveValue(baseSpell, modifiers, proficiencyBonus, abilityLookup, contextInfo.attackSaveFallback, valueLookup), bonusFixedDamage: deriveSpellBonusFixedDamage(baseSpell, modifiers, abilityLookup, contextInfo.bonusFixedDamageFallback, valueLookup), spellcastingModifier: deriveSpellSpellcastingModifier(baseSpell, abilityLookup, contextInfo.spellcastingModifier), canPrepare: false, canRemove: false, characterLevel: deriveCharacterLevel(baseSpell, characterLevel), canAdd: false, entity: null, spellGroupInfoLookup: generateSpellGroupInfoLookup(baseSpell, modifiers, modifierData) });
}
/**
 *
 * @param featureSpells
 * @param classSpells
 */
export function updateClassSpells(featureSpells, classSpells) {
    featureSpells.forEach((spell, spellIdx) => {
        if (getAtWillLimitedUseLevel(spell) !== null) {
            const classSpellIdx = classSpells.findIndex((decoratedSpell) => getId(decoratedSpell) === getId(spell));
            if (classSpellIdx > -1) {
                const classSpell = classSpells[classSpellIdx];
                const spellAlwaysPrepared = isAlwaysPrepared(spell);
                classSpells[classSpellIdx] = Object.assign(Object.assign({}, classSpell), { alwaysPrepared: spellAlwaysPrepared ? spellAlwaysPrepared : isAlwaysPrepared(classSpell) });
            }
        }
    });
    const alwaysPreparedSpellIds = classSpells.filter((spell) => isAlwaysPrepared(spell)).map((spell) => getId(spell));
    let finalSpells = classSpells;
    if (alwaysPreparedSpellIds.length) {
        finalSpells = classSpells.filter((spell) => {
            if (!isAlwaysPrepared(spell) && alwaysPreparedSpellIds.includes(getId(spell))) {
                return false;
            }
            return true;
        });
    }
    return finalSpells;
}
/**
 *
 * @param featureSpells
 * @param classSpells
 */
export function updateClassFeatureSpells(featureSpells, classSpells) {
    return featureSpells.map((spell, spellIdx) => {
        if (getBaseLevelAtWill(spell)) {
            const decoratedSpellIdx = classSpells.findIndex((decoratedSpell) => getId(decoratedSpell) === getId(spell));
            if (decoratedSpellIdx > -1) {
                const decoratedSpell = classSpells[decoratedSpellIdx];
                return Object.assign(Object.assign({}, spell), { prepared: deriveIsPrepared(decoratedSpell) });
            }
        }
        return spell;
    });
}
/**
 *
 * @param characterLevel
 * @param charClasses
 * @param abilityLookup
 * @param profBonus
 * @param modifiers
 */
export function generateClassSpellLists(characterLevel, charClasses, abilityLookup, profBonus, modifiers) {
    return charClasses.map((charClass) => generateClassSpellsInfo(characterLevel, charClass, abilityLookup, profBonus, modifiers));
}
/**
 *
 * @param characterLevel
 * @param charClass
 * @param abilityLookup
 * @param profBonus
 * @param modifiers
 */
export function generateClassSpellsInfo(characterLevel, charClass, abilityLookup, profBonus, modifiers) {
    var _a;
    let decoratedSpells = ClassAccessors.getSpells(charClass);
    const classSlug = ClassAccessors.getSlug(charClass);
    const classLevel = ClassAccessors.getLevel(charClass);
    const classSpellRules = ClassAccessors.getSpellRules(charClass);
    const spellPrepareType = ClassAccessors.getSpellPrepareType(charClass);
    const spellcastingModifier = AbilityDerivers.deriveStatModifier(classSpellRules.spellcastingAbilityStatId, abilityLookup);
    const knownCantripsMax = classSpellRules.levelCantripsKnownMaxes
        ? classSpellRules.levelCantripsKnownMaxes[classLevel]
        : null;
    const knownSpellsMax = classSpellRules.levelSpellKnownMaxes
        ? classSpellRules.levelSpellKnownMaxes[classLevel]
        : null;
    const preparedSpellsMax = classSpellRules.levelPreparedSpellMaxes
        ? (_a = classSpellRules.levelPreparedSpellMaxes[classLevel]) !== null && _a !== void 0 ? _a : null // coallesce if the array is shorter than the class level, happens for prepared classes not using OSIRIS rules
        : null;
    const prepareMax = preparedSpellsMax !== null && preparedSpellsMax !== void 0 ? preparedSpellsMax : deriveSpellPrepareMax(spellPrepareType, classLevel, spellcastingModifier);
    const canAddSpells = !classSpellRules.knowsAllSpells || knownCantripsMax !== null || knownSpellsMax === null;
    const baseToHitModifier = deriveSpellAttackModifier(profBonus, spellcastingModifier);
    const bonusSpellSaveDcModifiers = modifiers.filter((modifier) => ModifierValidators.isBonusSpellSaveDc(modifier));
    const bonusSpellSaveDcModifierTotal = ModifierDerivers.sumModifiers(bonusSpellSaveDcModifiers, abilityLookup);
    const classSaveDcModifiers = modifiers.filter((modifier) => ModifierValidators.isValidBonusClassSpellSaveDcModifier(modifier, classSlug));
    const classSaveDcModifierTotal = ModifierDerivers.sumModifiers(classSaveDcModifiers, abilityLookup);
    const spellSaveDc = CharacterDerivers.deriveAttackSaveValue(profBonus, spellcastingModifier) +
        bonusSpellSaveDcModifierTotal +
        classSaveDcModifierTotal;
    decoratedSpells = orderBy(decoratedSpells, [(spell) => getLevel(spell), (spell) => getName(spell)]);
    const activeSpells = decoratedSpells.filter((spell) => deriveIsActive(spell));
    let activeCantripsCount = decoratedSpells.filter((s) => countsAsKnownSpell(s) && isCantrip(s)).length;
    const activeFeatureCantripCount = ClassAccessors.getFeatureSpells(charClass).filter((s) => countsAsKnownSpell(s) && isCantrip(s)).length;
    activeCantripsCount += activeFeatureCantripCount;
    let knownSpellCount = decoratedSpells.filter((s) => countsAsKnownSpell(s) && !isCantrip(s)).length;
    const knownFeatureSpellCount = ClassAccessors.getFeatureSpells(charClass).filter((s) => countsAsKnownSpell(s) && !isCantrip(s)).length;
    knownSpellCount += knownFeatureSpellCount;
    const preparedSpellCount = decoratedSpells.filter((s) => !isCantrip(s) && deriveIsPrepared(s, false) && countsAsKnownSpell(s)).length;
    const knownSpellNames = decoratedSpells.map((spell) => getName(spell, false));
    const knownSpellIds = decoratedSpells.map((spell) => deriveKnownKey(spell));
    const isSpellsKnownMaxed = deriveIsSpellsKnownMaxed(knownSpellsMax, knownSpellCount, classSpellRules.knowsAllSpells);
    const isCantripsKnownMaxed = deriveIsCantripsKnownMaxed(knownCantripsMax, activeCantripsCount);
    const isPrepareMaxed = !!prepareMax && preparedSpellCount >= prepareMax;
    let ritualSpells = [];
    if (classSpellRules.isRitualSpellCaster) {
        ritualSpells = decoratedSpells.filter((spell) => deriveIsRitual(spell) &&
            (isCantrip(spell) ||
                (classSpellRules.isPreparedSpellcaster && deriveIsPrepared(spell)) ||
                classSpellRules.isKnownSpellcaster ||
                classSpellRules.isSpellbookSpellcaster));
    }
    return {
        charClass,
        knownSpellcaster: classSpellRules.isKnownSpellcaster,
        preparedSpellcaster: classSpellRules.isPreparedSpellcaster,
        spellbookSpellcaster: classSpellRules.isSpellbookSpellcaster,
        spellcastingModifier,
        spellcastingAbility: classSpellRules.spellcastingAbilityStat,
        attackSaveValue: spellSaveDc,
        toHitValue: baseToHitModifier,
        prepareMax,
        knownCantripsMax,
        knownSpellsMax,
        canAddSpells,
        isSpellsKnownMaxed,
        isCantripsKnownMaxed,
        isPrepareMaxed,
        spells: decoratedSpells,
        activeSpells,
        ritualSpells,
        knownSpellNames,
        knownSpellIds,
        activeCantripsCount,
        activeFeatureCantripCount,
        knownSpellCount,
        knownFeatureSpellCount,
        preparedSpellCount,
    };
}
/**
 *
 * @param spell
 */
export function generateDataOriginKey(spell) {
    return DataOriginGenerators.generateDataOriginKey(getComponentId(spell), getComponentTypeId(spell));
}
/**
 *
 * @param spells
 */
export function generateSpellComponentLookup(spells) {
    return groupBy(spells, (spell) => generateDataOriginKey(spell));
}
/**
 *
 * @param spells
 * @param partyInfo
 */
export function generateItemSpellLookup(spells, partyInfo) {
    const partyItemSpells = partyInfo ? CampaignAccessors.getItemSpells(partyInfo) : [];
    return generateSpellComponentLookup(uniqBy([...partyItemSpells, ...spells], (spell) => getMappingId(spell)));
}
/**
 *
 * @param modifiers
 * @param items
 * @param feats
 * @param race
 * @param classes
 * @param proficiencyBonus
 * @param abilityLookup
 * @param classSpellInfoLookup
 * @param overallSpellInfo
 * @param valueLookup
 * @param ruleData
 * @param modifierData
 */
export function generateCharacterSpells(modifiers, items, feats, race, classes, proficiencyBonus, abilityLookup, classSpellInfoLookup, overallSpellInfo, valueLookup, ruleData, modifierData) {
    /**
     * NOTE: Talked through, and we decided that any character spell cannot be forced
     * to go lower than a 0 value for each of these highest values.  You shouldn't be forced
     * to take a -1 into your calculation if you are very unoptimized
     */
    let highestMiscAttackSave = CharacterDerivers.deriveAttackSaveValue(proficiencyBonus, 0);
    let highestMiscToHit = proficiencyBonus;
    let highestSpellcastingModifier = 0;
    let highestFixedDamage = 0;
    classes.forEach((charClass) => {
        if (ClassAccessors.isSpellcastingActive(charClass) || ClassAccessors.isPactMagicActive(charClass)) {
            // TODO fix lookup
            const classSpellInfo = classSpellInfoLookup[ClassAccessors.getId(charClass)];
            if (classSpellInfo.spellSaveDc > highestMiscAttackSave) {
                highestMiscAttackSave = classSpellInfo.spellSaveDc;
            }
            if (classSpellInfo.baseToHitModifier > highestMiscToHit) {
                highestMiscToHit = classSpellInfo.baseToHitModifier;
            }
            if (classSpellInfo.spellcastingModifier > highestSpellcastingModifier) {
                highestSpellcastingModifier = classSpellInfo.spellcastingModifier;
            }
            if (classSpellInfo.spellDamage > highestFixedDamage) {
                highestFixedDamage = classSpellInfo.spellDamage;
            }
        }
    });
    const spells = [];
    items.forEach((item) => {
        const itemSpells = ItemAccessors.getSpells(item);
        const updatedSpells = itemSpells.map((spell) => {
            const contextInfo = generateCharacterSpell_contextInfo(highestMiscToHit, highestMiscAttackSave, isCantrip(spell) ? overallSpellInfo.bonusCantripDamage : highestFixedDamage, highestSpellcastingModifier);
            return generateCharacterSpell(spell, overallSpellInfo, contextInfo, valueLookup, ruleData, modifierData);
        });
        spells.push(...updatedSpells);
    });
    const featureFallbackToHit = CharacterDerivers.deriveAttackModifier(proficiencyBonus, 0);
    const featureFallbackSaveDc = CharacterDerivers.deriveAttackSaveValue(proficiencyBonus, 0);
    const featureFallbackSpellcastingModifier = 0;
    const featureFixedDamage = 0;
    feats.forEach((feat) => {
        const featSpells = FeatAccessors.getSpells(feat);
        const updatedSpells = featSpells.map((spell) => {
            const contextInfo = generateCharacterSpell_contextInfo(featureFallbackToHit, featureFallbackSaveDc, isCantrip(spell) ? overallSpellInfo.bonusCantripDamage : featureFixedDamage, featureFallbackSpellcastingModifier);
            return generateCharacterSpell(spell, overallSpellInfo, contextInfo, valueLookup, ruleData, modifierData);
        });
        spells.push(...updatedSpells);
    });
    if (race) {
        const raceSpells = RaceAccessors.getSpells(race);
        const updatedRaceSpells = raceSpells.map((spell) => {
            const contextInfo = generateCharacterSpell_contextInfo(featureFallbackToHit, featureFallbackSaveDc, isCantrip(spell) ? overallSpellInfo.bonusCantripDamage : featureFixedDamage, featureFallbackSpellcastingModifier);
            return generateCharacterSpell(spell, overallSpellInfo, contextInfo, valueLookup, ruleData, modifierData);
        });
        spells.push(...updatedRaceSpells);
    }
    classes.forEach((charClass) => {
        const classSpellInfo = classSpellInfoLookup[ClassAccessors.getId(charClass)];
        ClassAccessors.getFeatureSpells(charClass).forEach((spell) => {
            let fixedDamageTotal = classSpellInfo.spellDamage;
            if (isCantrip(spell)) {
                fixedDamageTotal += overallSpellInfo.bonusCantripDamage + classSpellInfo.bonusCantripDamage;
            }
            const contextInfo = generateCharacterSpell_contextInfo(classSpellInfo.toHit, classSpellInfo.spellSaveDc, fixedDamageTotal, classSpellInfo.spellcastingModifier);
            spells.push(generateCharacterSpell(spell, overallSpellInfo, contextInfo, valueLookup, ruleData, modifierData));
        });
    });
    return spells;
}
/**
 *
 * @param spellSlots
 */
export function generateMaxSpellSlotLevel(spellSlots) {
    if (spellSlots.length) {
        const sortedSlot = HelperUtils.getLast(spellSlots, ['level']);
        if (sortedSlot) {
            return sortedSlot.level;
        }
        return 0;
    }
    return 0;
}
/**
 *
 * @param maxSpellSlotLevel
 * @param maxPactMagicSlotLevel
 */
export function generateCombinedMaxSpellSlotLevel(maxSpellSlotLevel, maxPactMagicSlotLevel) {
    return Math.max(maxSpellSlotLevel, maxPactMagicSlotLevel);
}
/**
 *
 * @param spellSlots
 */
export function generateAvailableSpellSlotLevels(spellSlots) {
    return spellSlots.filter((slot) => slot.available > 0).map((slot) => slot.level);
}
/**
 *
 * @param spellSlots
 */
export function generateCastableSpellSlotLevels(spellSlots) {
    return spellSlots.filter((slot) => slot.available - slot.used > 0).map((slot) => slot.level);
}
/**
 *
 * @param classes
 */
export function generateClassSpells(classes) {
    const spells = [];
    for (let i = 0; i < classes.length; i++) {
        const charClass = classes[i];
        spells.push(...ClassAccessors.getSpells(charClass));
    }
    return spells;
}
/**
 *
 * @param classSpells
 */
export function generateActiveClassSpells(classSpells) {
    return classSpells.filter(isActive);
}
/**
 *
 * @param attackClassSpellLists
 * @param characterSpells
 */
export function generateActiveSpellAttackList(attackClassSpellLists, characterSpells) {
    return [
        ...flatten(attackClassSpellLists.map((ClassSpellInfo) => ClassSpellInfo.activeSpells)),
        ...characterSpells,
    ].filter((spell) => !asPartOfWeaponAttack(spell) &&
        ((isAttack(spell) && (isDisplayAsAttack(spell) || isDisplayAsAttack(spell) === null)) ||
            isDisplayAsAttack(spell)));
}
/**
 *
 * @param classSpells
 * @param characterSpells
 * @param xpInfo
 */
export function generateWeaponSpellDamageGroups(classSpells, characterSpells, xpInfo) {
    const damageSources = [];
    classSpells.forEach((spell) => {
        if (!asPartOfWeaponAttack(spell)) {
            return;
        }
        const damageDice = getScaledDamage(spell);
        if (damageDice.length) {
            damageSources.push({
                spell,
                damageDice,
                attackTypeRange: getAttackType(spell),
            });
        }
    });
    characterSpells.forEach((spell) => {
        if (!asPartOfWeaponAttack(spell)) {
            return;
        }
        const damageDice = getScaledDamage(spell);
        if (damageDice.length) {
            damageSources.push({
                spell,
                damageDice,
                attackTypeRange: getAttackType(spell),
            });
        }
    });
    return damageSources;
}
/**
 *
 * @param activeCharacterSpells
 * @param classSpells
 */
export function generateRitualSpells(activeCharacterSpells, classSpells) {
    const ritualCharacterSpells = activeCharacterSpells.filter((spell) => {
        const dataOrigin = getDataOrigin(spell);
        const dataOriginType = getDataOriginType(spell);
        if (dataOriginType === DataOriginTypeEnum.FEAT &&
            DB_STRING_RITUAL_CASTER_LIST.includes(FeatAccessors.getName(dataOrigin.primary)) &&
            deriveIsRitual(spell)) {
            return true;
        }
        return false;
    });
    const ritualClassSpells = classSpells.filter((spell) => {
        if (deriveIsRitual(spell) && deriveIsCastedByRitualSpellcaster(spell)) {
            if (deriveIsCastedBySpellbookSpellcaster(spell)) {
                return true;
            }
            return deriveIsActive(spell);
        }
        return false;
    });
    return [...ritualCharacterSpells, ...ritualClassSpells];
}
/**
 *
 * @param spell
 * @param castLevel
 * @param spellCasterInfo
 * @param ruleData
 * @param abilityLookup
 * @param proficiencyBonus
 */
function generateScaledSpell(spell, castLevel, spellCasterInfo, ruleData, abilityLookup, proficiencyBonus) {
    const startingCastLevel = deriveStartingCastLevel(spell);
    const scaledAmount = Math.max(0, castLevel - startingCastLevel);
    const limitedUse = getLimitedUse(spell);
    let maxUses = null;
    if (limitedUse != null) {
        maxUses = LimitedUseDerivers.deriveMaxUses(limitedUse, abilityLookup, ruleData, proficiencyBonus);
    }
    const isLimitedUseAvailableAtScaledAmount = validateIsLimitedUseAvailableAtScaledAmount(spell, castLevel, scaledAmount, abilityLookup, ruleData, spellCasterInfo, proficiencyBonus);
    return Object.assign(Object.assign({}, spell), { range: getScaledRange(spell, castLevel), consumedUses: getConsumedLimitedUse(spell, scaledAmount), isAtWill: validateIsAtWill(spell, castLevel), isLimitedUseAvailableAtScaledAmount,
        castLevel,
        maxUses,
        scaledAmount });
}
/**
 *
 * @param xpInfo
 * @param classSpells
 * @param characterSpells
 * @param proficiencyBonus
 * @param spellCasterInfo
 * @param ruleData
 * @param preferences
 * @param abilityLookup
 */
export function generateLevelSpells(xpInfo, classSpells, characterSpells, proficiencyBonus, spellCasterInfo, ruleData, preferences, abilityLookup) {
    const maxSpellLevel = RuleDataAccessors.getMaxSpellLevel(ruleData);
    const levels = [];
    // Setup array to exist for all possible spell levels cantrip => maxSpellLevel
    for (let i = 0; i <= maxSpellLevel; i++) {
        levels.push([]);
    }
    classSpells.forEach((spell) => {
        const startLevel = getLevel(spell);
        for (let i = startLevel; i <= maxSpellLevel; i++) {
            if (validateShouldShowClassSpellAtLevel(spell, i, spellCasterInfo, preferences)) {
                levels[i].push(generateScaledSpell(spell, i, spellCasterInfo, ruleData, abilityLookup, proficiencyBonus));
            }
        }
    });
    characterSpells.forEach((spell) => {
        const { startLevel, endLevel } = getCastLevelRange(spell, spellCasterInfo, ruleData);
        for (let i = startLevel; i <= endLevel; i++) {
            if (validateShouldShowCharacterSpellAtLevel(spell, i, spellCasterInfo, preferences)) {
                levels[i].push(generateScaledSpell(spell, i, spellCasterInfo, ruleData, abilityLookup, proficiencyBonus));
            }
        }
    });
    const sortOrderLookup = {
        [DataOriginTypeEnum.RACE]: 1,
        [DataOriginTypeEnum.CLASS]: 2,
        [DataOriginTypeEnum.FEAT]: 3,
        [DataOriginTypeEnum.BACKGROUND]: 4,
        [DataOriginTypeEnum.ITEM]: 5,
    };
    const sortedLevels = [];
    for (let i = 0; i <= maxSpellLevel; i++) {
        sortedLevels.push(orderBy(levels[i], [
            (spell) => getName(spell),
            (spell) => {
                const type = getDataOriginType(spell);
                let orderNum = 100;
                if (type !== null) {
                    const lookupOrderNum = sortOrderLookup[type];
                    if (lookupOrderNum) {
                        orderNum = lookupOrderNum;
                    }
                }
                return orderNum;
            },
        ]));
    }
    return sortedLevels;
}
/**
 *
 * @param spell
 * @param dataOriginType
 * @param primary
 * @param parent
 * @param spellListDataOriginLookup
 */
export function generateDataOriginSpell(spell, dataOriginType, primary, parent, spellListDataOriginLookup) {
    return Object.assign(Object.assign({}, spell), { dataOrigin: DataOriginGenerators.generateDataOrigin(dataOriginType, primary, parent), expandedDataOriginRef: deriveExpandedDataOriginRef(spell, spellListDataOriginLookup) });
}
/**
 *
 * @param id
 * @param entityTypeId
 * @param spellLookup
 * @param dataOriginType
 * @param primary
 * @param parent
 * @param ruleData
 * @param spellListDataOriginLookup
 * @param valueLookup
 */
export function generateBaseSpells(id, entityTypeId, spellLookup, dataOriginType, primary, parent, ruleData, spellListDataOriginLookup, valueLookup) {
    const spells = HelperUtils.lookupDataOrFallback(spellLookup, DataOriginGenerators.generateDataOriginKey(id, entityTypeId));
    if (!spells) {
        return [];
    }
    return spells.map((spell) => {
        const dataOriginSpell = generateDataOriginSpell(spell, dataOriginType, primary, parent, spellListDataOriginLookup);
        return generateBaseSpell(dataOriginSpell, valueLookup, ruleData);
    });
}
/**
 *
 * @param spells
 * @param inventoryInfusionLookup
 * @param characterId
 */
export function generateActiveCharacterSpells(spells, inventoryInfusionLookup, characterId) {
    return spells.filter((spell) => {
        const dataOrigin = getDataOrigin(spell);
        const dataOriginType = getDataOriginType(spell);
        if (dataOriginType === DataOriginTypeEnum.ITEM) {
            const item = dataOrigin.primary;
            const mappingId = ItemAccessors.getMappingId(item);
            const infusion = HelperUtils.lookupDataOrFallback(inventoryInfusionLookup, mappingId);
            if (ItemDerivers.deriveCanAttune(item, infusion)) {
                return ItemValidators.isEquippedToCurrentCharacter(item, characterId) && ItemAccessors.isAttuned(item);
            }
            return ItemValidators.isEquippedToCurrentCharacter(item, characterId);
        }
        return true;
    });
}
/**
 *
 * @param race
 * @param classes
 * @param background
 * @param optionalOrigins
 * @param optionalClassFeatures
 * @param definitionPool
 */
export function generateSpellListDataOriginLookup(race, classes, background, optionalOrigins, optionalClassFeatures, definitionPool) {
    let lookup = {};
    if (race !== null) {
        RaceAccessors.getDefinitionRacialTraits(race).forEach((feature) => {
            const uniqueKey = RacialTraitAccessors.getUniqueKey(feature);
            RacialTraitAccessors.getSpellListIds(feature).forEach((spellListId) => {
                lookup[spellListId] = DataOriginGenerators.generateDataOriginRef(DataOriginTypeEnum.RACE, uniqueKey);
            });
        });
    }
    if (background !== null) {
        const uniqueKey = BackgroundDerivers.deriveUniqueKey(background);
        BackgroundAccessors.getSpellListIds(background).forEach((spellListId) => {
            lookup[spellListId] = DataOriginGenerators.generateDataOriginRef(DataOriginTypeEnum.BACKGROUND, uniqueKey);
        });
    }
    classes.forEach((charClass) => {
        ClassAccessors.getDefinitionClassFeatures(charClass).forEach((feature) => {
            const uniqueKey = ClassFeatureAccessors.getUniqueKey(feature);
            ClassFeatureAccessors.getSpellListIds(feature).forEach((spellListId) => {
                lookup[spellListId] = DataOriginGenerators.generateDataOriginRef(DataOriginTypeEnum.CLASS_FEATURE, uniqueKey);
            });
        });
    });
    optionalOrigins.forEach((optionalOrigin) => {
        const definitionKey = OptionalOriginAccessors.getDefinitionKey(optionalOrigin);
        if (!definitionKey) {
            return;
        }
        const racialTrait = RacialTraitSimulators.simulateRacialTrait(definitionKey, definitionPool);
        if (!racialTrait) {
            return;
        }
        const uniqueKey = RacialTraitAccessors.getUniqueKey(racialTrait);
        RacialTraitAccessors.getSpellListIds(racialTrait).forEach((spellListId) => {
            lookup[spellListId] = DataOriginGenerators.generateDataOriginRef(DataOriginTypeEnum.RACE, uniqueKey);
        });
    });
    optionalClassFeatures.forEach((optionalClassFeature) => {
        const definitionKey = OptionalClassFeatureAccessors.getDefinitionKey(optionalClassFeature);
        if (!definitionKey) {
            return;
        }
        const feature = ClassFeatureSimulators.simulateClassFeature(definitionKey, definitionPool, classes);
        if (!feature) {
            return;
        }
        const uniqueKey = ClassFeatureAccessors.getUniqueKey(feature);
        ClassFeatureAccessors.getSpellListIds(feature).forEach((spellListId) => {
            lookup[spellListId] = DataOriginGenerators.generateDataOriginRef(DataOriginTypeEnum.CLASS_FEATURE, uniqueKey);
        });
    });
    return lookup;
}
/**
 *
 * @param raceSpellListIds
 * @param backgroundSpellListIds
 */
export function generateGlobalSpellListIds(raceSpellListIds, backgroundSpellListIds) {
    return [...raceSpellListIds, ...backgroundSpellListIds];
}
