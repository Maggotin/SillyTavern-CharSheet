import { TypeScriptUtils } from '../../utils';
import { AbilityAccessors, AbilityDerivers } from '../Ability';
import { CharacterDerivers } from '../Character';
import { ClassAccessors } from '../Class';
import { AdditionalTypeEnum, CoreSimulators, MulticlassSpellSlotRoundingEnum } from '../Core';
import { DataOriginGenerators, DataOriginTypeEnum } from '../DataOrigin';
import { DiceAccessors, DiceSimulators } from '../Dice';
import { HelperUtils } from '../Helper';
import { ItemAccessors } from '../Item';
import { LimitedUseAccessors } from '../LimitedUse';
import { ModifierAccessors, ModifierDerivers, ModifierValidators } from '../Modifier';
import { RuleDataAccessors } from '../RuleData';
import { AdjustmentTypeEnum, ValueHacks, ValueUtils, ValueValidators } from '../Value';
import { getCastAtLevel, getCharacterLevel, getDataOrigin, getDataOriginType, getDefinitionAtHigherLevels, getDefinitionModifiers, getDefinitionName, getExpandedDataOriginRef, getLevel, getLimitedUse, getMappingEntityTypeId, getMappingId, getModifiers, getOverrideSaveDc, getRange, getRequiresSavingThrow, getRitual, getRitualCastingType, getScaleType, getSpellCastingAbilityId, getSpellListId, getUsesSpellSlot, isActive, isAlwaysPrepared, isAttack, isCantrip, isRitual, } from './accessors';
import { DB_STRING_SPELL_ELDRITCH_BLAST, RitualCastingTypeEnum, SPELL_CUSTOMIZATION_ADJUSTMENT_TYPES, SpellPrepareTypeEnum, SpellScaleTypeNameEnum, } from './constants';
import { getSpellFinalScaledDie } from './utils';
/**
 * Calculates the Spellcasting Ability Modifier for the specified Proficiency Bonus and Ability Score Modifier,
 * @param profBonus The proficiency bonus
 * @param statModifier The modifier from the Ability Score
 */
export function deriveSpellAttackModifier(profBonus, statModifier) {
    return profBonus + statModifier;
}
/**
 * Determines if the specified spell is currently prepared
 * @param spell The spell in question
 * @param includeAlwaysPrepared When set to true, "Always Prepared" spells will be return true even if they are not prepared.
 */
export function deriveIsPrepared(spell, includeAlwaysPrepared = true) {
    return spell.prepared || (includeAlwaysPrepared && isAlwaysPrepared(spell));
}
/**
 * Determines if the specified spell can be cast as a ritual
 * @param spell The spell in question
 */
export function deriveCanCastAsRitual(spell) {
    return getRitualCastingType(spell) === RitualCastingTypeEnum.CAN_CAST_AS_RITUAL;
}
/**
 * Determines if the spell can only be cast as a ritual
 * @param spell The spell in question
 */
export function deriveMustCastAsRitual(spell) {
    return getRitualCastingType(spell) === RitualCastingTypeEnum.MUST_CAST_AS_RITUAL;
}
/**
 *
 * @param spell
 */
export function deriveIsRitual(spell) {
    const dataOrigin = getDataOrigin(spell);
    const dataOriginType = getDataOriginType(spell);
    if (dataOrigin) {
        switch (dataOriginType) {
            case DataOriginTypeEnum.CLASS:
            case DataOriginTypeEnum.CLASS_FEATURE:
                return getRitual(spell) && deriveIsCastedByRitualSpellcaster(spell);
            case DataOriginTypeEnum.RACE:
            case DataOriginTypeEnum.FEAT:
            case DataOriginTypeEnum.ITEM:
                return deriveCanCastAsRitual(spell) || deriveMustCastAsRitual(spell);
            case DataOriginTypeEnum.SIMULATED:
                return getRitual(spell);
            default:
            // not implemented
        }
    }
    return false;
}
/**
 *
 * @param spell
 */
export function deriveIsCastAsRitual(spell) {
    if (!getDataOrigin(spell) || !isRitual(spell)) {
        return false;
    }
    // if we have an override to only cast, then don't let them cast with spell slot at all
    if (deriveMustCastAsRitual(spell)) {
        return true;
    }
    // otherwise if the spell isn't active, but we got to this point, it could only be cast as ritual
    return !isActive(spell);
}
/**
 *
 * @param spell
 */
export function deriveExpandedContextIds(spell) {
    let contextId = null;
    let contextTypeId = null;
    const expandedDataOriginRef = getExpandedDataOriginRef(spell);
    if (expandedDataOriginRef) {
        const dataOrigin = getDataOrigin(spell);
        const dataOriginType = getDataOriginType(spell);
        switch (dataOriginType) {
            case DataOriginTypeEnum.CLASS:
                const charClass = dataOrigin.primary;
                contextId = ClassAccessors.getMappingId(charClass);
                contextTypeId = ClassAccessors.getMappingEntityTypeId(charClass);
                break;
            default:
            // not implemented
        }
    }
    return [contextId, contextTypeId];
}
/**
 * TODO - move to utils
 * @param level
 * @param slotLevels
 */
export function getCastLevelAvailableCount(level, slotLevels) {
    const slotLevel = slotLevels.find((slotLevel) => slotLevel.level === level);
    if (!slotLevel) {
        return null;
    }
    return slotLevel.available - slotLevel.used;
}
/**
 * TODO - move to utils
 * @param spell
 * @param scaledAmount
 */
export function getConsumedLimitedUse(spell, scaledAmount) {
    const limitedUse = getLimitedUse(spell);
    if (limitedUse === null) {
        return 0;
    }
    const minConsumed = LimitedUseAccessors.getMinNumberConsumed(limitedUse);
    if (getDataOriginType(spell) === DataOriginTypeEnum.ITEM) {
        return minConsumed + scaledAmount;
    }
    return minConsumed;
}
/**
 *
 * @param spell
 */
export function deriveStartingCastLevel(spell) {
    if (isCantrip(spell)) {
        return getLevel(spell);
    }
    const castAtLevel = getCastAtLevel(spell);
    let startingCastLevel = getLevel(spell);
    if (castAtLevel !== null) {
        startingCastLevel = castAtLevel;
    }
    return startingCastLevel;
}
/**
 * TODO - move to utils
 * @param spell
 * @param spellCasterInfo
 * @param ruleData
 * @param initialCastLevel
 */
export function getMinCastLevel(spell, spellCasterInfo, ruleData, initialCastLevel = null) {
    const { startLevel, endLevel } = getCastLevelRange(spell, spellCasterInfo, ruleData);
    let castLevel = deriveStartingCastLevel(spell);
    if (initialCastLevel !== null) {
        castLevel = initialCastLevel;
    }
    return Math.max(castLevel, startLevel);
}
/**
 * TODO - move to utils
 * @param spell
 * @param spellCasterInfo
 * @param ruleData
 * @param initialCastLevel
 */
export function getCastableLevels(spell, spellCasterInfo, ruleData, initialCastLevel = null) {
    const { startLevel, endLevel } = getCastLevelRange(spell, spellCasterInfo, ruleData);
    const usesSpellSlot = getUsesSpellSlot(spell);
    const castAtLevel = getCastAtLevel(spell);
    const castableLevels = [];
    for (let i = startLevel; i <= endLevel; i++) {
        if (initialCastLevel !== null && initialCastLevel === i) {
            castableLevels.push(i);
        }
        else if (castAtLevel !== null && castAtLevel === i) {
            castableLevels.push(i);
        }
        else if (getDataOriginType(spell) === DataOriginTypeEnum.ITEM) {
            castableLevels.push(i);
        }
        else if (usesSpellSlot) {
            if (spellCasterInfo.availableSpellLevels.includes(i) ||
                spellCasterInfo.availablePactMagicLevels.includes(i)) {
                castableLevels.push(i);
            }
        }
    }
    return castableLevels;
}
/**
 * TODO - move to utils
 * @param spell
 * @param spellCasterInfo
 * @param ruleData
 */
export function getCastLevelRange(spell, spellCasterInfo, ruleData) {
    let startLevel = getLevel(spell);
    let endLevel = getLevel(spell);
    const castAtLevel = getCastAtLevel(spell);
    const limitedUse = getLimitedUse(spell);
    if (isCantrip(spell)) {
        return {
            startLevel,
            endLevel,
        };
    }
    if (getUsesSpellSlot(spell)) {
        const availableLevels = [
            ...spellCasterInfo.availableSpellLevels,
            ...spellCasterInfo.availablePactMagicLevels,
        ].filter((level) => level >= getLevel(spell));
        startLevel = Math.max(getLevel(spell), Math.min(...availableLevels));
        endLevel = Math.max(getLevel(spell), ...availableLevels);
        if (limitedUse && getDataOriginType(spell) === DataOriginTypeEnum.CLASS_FEATURE) {
            const dataOrigin = getDataOrigin(spell);
            const charClass = dataOrigin.parent;
            if (ClassAccessors.isPactMagicActive(charClass)) {
                startLevel = Math.min(...spellCasterInfo.availablePactMagicLevels);
                endLevel = Math.max(...spellCasterInfo.availablePactMagicLevels);
            }
            else {
                startLevel = Math.max(getLevel(spell), Math.min(...spellCasterInfo.availableSpellLevels));
                endLevel = Math.max(getLevel(spell), ...spellCasterInfo.availableSpellLevels);
            }
        }
    }
    if (getDataOriginType(spell) !== DataOriginTypeEnum.CLASS) {
        if (castAtLevel === null) {
            switch (getDataOriginType(spell)) {
                case DataOriginTypeEnum.ITEM:
                    let itemSpellLevelDiff = 0;
                    if (limitedUse) {
                        const minNumberConsumed = LimitedUseAccessors.getMinNumberConsumed(limitedUse);
                        let maxNumberConsumed = LimitedUseAccessors.getMaxNumberConsumed(limitedUse);
                        if (maxNumberConsumed === null) {
                            maxNumberConsumed = minNumberConsumed;
                        }
                        itemSpellLevelDiff = maxNumberConsumed - minNumberConsumed;
                    }
                    endLevel = startLevel + itemSpellLevelDiff;
                    break;
                default:
                // not implemented
            }
        }
        else {
            startLevel = castAtLevel;
            endLevel = castAtLevel;
        }
    }
    const maxSpellLevel = RuleDataAccessors.getMaxSpellLevel(ruleData);
    return {
        startLevel: HelperUtils.clampInt(startLevel, 1, maxSpellLevel),
        endLevel: HelperUtils.clampInt(endLevel, 1, maxSpellLevel),
    };
}
/**
 * TODO - move to validators
 * @param spell
 * @param scaleType
 * @param higherLevelsItems
 * @param castLevel
 */
export function isSpellScaledByCastLevel(spell, scaleType, higherLevelsItems, castLevel) {
    if (scaleType === null) {
        return false;
    }
    if (scaleType === SpellScaleTypeNameEnum.CHARACTER_LEVEL) {
        return false;
    }
    if (getCastAtLevel(spell) === castLevel) {
        return false;
    }
    if (!higherLevelsItems.length) {
        return false;
    }
    return !!spellLevelFilter(higherLevelsItems, castLevel);
}
/**
 * TODO - move to utils
 * @param spell
 * @param scaleType
 * @param higherLevelsItems
 * @param characterLevel //deprecated and will be removed, DCP-1412
 * @param castLevel
 */
export function getSpellScaledAtHigher(spell, scaleType, higherLevelsItems, characterLevel, castLevel) {
    if (scaleType === null) {
        return null;
    }
    const castAtLevel = getCastAtLevel(spell);
    if (scaleType === SpellScaleTypeNameEnum.CHARACTER_LEVEL) {
        return characterLevelFilter(higherLevelsItems, getCharacterLevel(spell));
    }
    else if (scaleType === SpellScaleTypeNameEnum.SPELL_SCALE || scaleType === SpellScaleTypeNameEnum.SPELL_LEVEL) {
        return spellLevelFilter(higherLevelsItems, castAtLevel === null ? castLevel : castAtLevel);
    }
    return null;
}
/**
 * TODO - move to utils
 * @param spell
 * @param characterLevel
 */
export function getScaledDamage(spell, characterLevel = null) {
    const damageDice = [];
    const castLevel = deriveStartingCastLevel(spell);
    const damageModifiers = getModifiers(spell).filter((modifier) => ModifierValidators.isSpellDamageModifier(modifier));
    damageModifiers.map((modifier) => {
        const { atHigherLevels } = modifier;
        if (atHigherLevels !== null && atHigherLevels.points !== null) {
            const atHigherDamage = getSpellScaledAtHigher(spell, getScaleType(spell), atHigherLevels.points, characterLevel, castLevel);
            const scaledDamageDie = getSpellFinalScaledDie(spell, modifier, atHigherDamage);
            const type = ModifierAccessors.getFriendlySubtypeName(modifier);
            if (scaledDamageDie !== null && type !== null) {
                damageDice.push({
                    dice: scaledDamageDie,
                    type,
                    restriction: ModifierAccessors.getRestriction(modifier),
                });
            }
        }
    });
    return damageDice;
}
/**
 * TODO - move to validators
 * @param spell
 * @param level
 * @param spellCasterInfo
 */
export function isSpellAvailableAtLevel(spell, level, spellCasterInfo) {
    if (isCantrip(spell)) {
        return true;
    }
    if (spellCasterInfo.availableSpellLevels.includes(level) ||
        spellCasterInfo.availablePactMagicLevels.includes(level)) {
        return true;
    }
    return false;
}
/**
 * NOTE: leaving for now, this will go away eventually once we generate higher level locally
 * @param higherLevelsItems
 * @param characterLevel
 */
function characterLevelFilter(higherLevelsItems, characterLevel) {
    if (characterLevel === null) {
        return null;
    }
    if (!higherLevelsItems.length) {
        return null;
    }
    return HelperUtils.getLast(higherLevelsItems.filter((item) => item.level !== null && item.level <= characterLevel), ['level']);
}
/**
 * NOTE: leaving for now, this will go away eventually once we generate higher level locally
 * @param higherLevelsItems
 * @param castLevel
 */
function spellLevelFilter(higherLevelsItems, castLevel) {
    if (castLevel === null) {
        return null;
    }
    if (!higherLevelsItems.length) {
        return null;
    }
    return HelperUtils.getLast(higherLevelsItems.filter((item) => item.level === null || item.level <= castLevel), ['level']);
}
/**
 *
 * @param prepareType
 * @param level
 * @param modifier
 */
export function deriveSpellPrepareMax(prepareType, level, modifier) {
    switch (prepareType) {
        case SpellPrepareTypeEnum.LEVEL:
            return Math.max(modifier + level, 1);
        case SpellPrepareTypeEnum.HALF_LEVEL:
            return Math.max(modifier + Math.floor(level / 2), 1);
        default:
        // not implemented
    }
    return null;
}
/**
 *
 * @param charClass
 * @param abilityId
 * @param ruleData
 * @param overrideIsRitualSpellCaster
 */
export function deriveClassSpellRules(charClass, abilityId, ruleData, overrideIsRitualSpellCaster = false) {
    var _a;
    const spellcastingAbilityStatId = abilityId;
    let spellcastingAbilityStat = null;
    if (spellcastingAbilityStatId) {
        spellcastingAbilityStat = ruleData.statsLookup[spellcastingAbilityStatId].key;
    }
    const configSpellRules = ClassAccessors.getSpellConfiguration(charClass);
    let filteredLevelCantripsKnownMaxes = [];
    if (configSpellRules && configSpellRules.levelCantripsKnownMaxes !== null) {
        filteredLevelCantripsKnownMaxes = configSpellRules.levelCantripsKnownMaxes.filter((max) => max !== 0);
    }
    const spellPrepareType = ClassAccessors.getSpellPrepareType(charClass);
    const knowsAllSpells = ClassAccessors.getKnowsAllSpells(charClass);
    const hasSpellPrepareMax = spellPrepareType !== null;
    const isKnownSpellcaster = !hasSpellPrepareMax;
    const isSpellbookSpellcaster = hasSpellPrepareMax && !knowsAllSpells;
    const isPreparedSpellcaster = hasSpellPrepareMax && !isSpellbookSpellcaster;
    let isRitualSpellCaster = false;
    if (overrideIsRitualSpellCaster) {
        isRitualSpellCaster = true;
    }
    else {
        isRitualSpellCaster = configSpellRules === null ? false : configSpellRules.isRitualSpellCaster;
    }
    let levelCantripsKnownMaxes = null;
    if (filteredLevelCantripsKnownMaxes.length) {
        levelCantripsKnownMaxes = configSpellRules === null ? null : configSpellRules.levelCantripsKnownMaxes;
    }
    let levelSpellKnownMaxes = [];
    if (configSpellRules !== null && configSpellRules.levelSpellKnownMaxes) {
        levelSpellKnownMaxes = configSpellRules.levelSpellKnownMaxes.filter(TypeScriptUtils.isNotNullOrUndefined);
    }
    let levelPreparedSpellMaxes = [];
    if (configSpellRules !== null && configSpellRules.levelPreparedSpellMaxes) {
        levelPreparedSpellMaxes = configSpellRules.levelPreparedSpellMaxes.filter(TypeScriptUtils.isNotNullOrUndefined);
    }
    let levelSpellSlots = [];
    if (configSpellRules !== null) {
        levelSpellSlots = (_a = configSpellRules.levelSpellSlots) !== null && _a !== void 0 ? _a : [
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
        ];
    }
    return {
        spellcastingAbilityStat,
        spellcastingAbilityStatId,
        knowsAllSpells,
        levelCantripsKnownMaxes,
        levelSpellKnownMaxes,
        levelPreparedSpellMaxes,
        levelSpellSlots,
        isRitualSpellCaster,
        isKnownSpellcaster,
        isSpellbookSpellcaster,
        isPreparedSpellcaster,
    };
}
/**
 *
 * @param pactMagicClasses
 * @param ruleData
 */
export function deriveClassPactMagicSlots(pactMagicClasses, ruleData) {
    let pactMagicSlotsAvailable = [];
    if (pactMagicClasses.length > 1) {
        pactMagicSlotsAvailable = deriveMulticlassSlots(pactMagicClasses, ruleData, RuleDataAccessors.getPactMagicMultiClassSpellSlots(ruleData));
    }
    else if (pactMagicClasses.length === 1) {
        pactMagicSlotsAvailable = deriveClassLevelSpellSlots(pactMagicClasses[0]);
    }
    return pactMagicSlotsAvailable;
}
/**
 *
 * @param spellcastingClasses
 * @param ruleData
 */
export function deriveClassSpellSlots(spellcastingClasses, ruleData) {
    let spellSlotsAvailable = [];
    if (spellcastingClasses.length > 1) {
        spellSlotsAvailable = deriveMulticlassSlots(spellcastingClasses, ruleData, RuleDataAccessors.getMultiClassSpellSlots(ruleData));
    }
    else if (spellcastingClasses.length === 1) {
        spellSlotsAvailable = deriveClassLevelSpellSlots(spellcastingClasses[0]);
    }
    return spellSlotsAvailable;
}
/**
 *
 * @param charClass
 */
export function deriveClassLevelSpellSlots(charClass) {
    const classLevel = ClassAccessors.getLevel(charClass);
    const configSpellRules = ClassAccessors.getSpellConfiguration(charClass);
    return configSpellRules && configSpellRules.levelSpellSlots ? configSpellRules.levelSpellSlots[classLevel] : [];
}
/**
 *
 * @param charClasses
 * @param ruleData
 * @param spellSlotsData
 */
export function deriveMulticlassSlots(charClasses, ruleData, spellSlotsData) {
    if (spellSlotsData === null) {
        return [];
    }
    const combinedLevel = charClasses.reduce((acc, charClass) => {
        const configSpellRules = ClassAccessors.getSpellConfiguration(charClass);
        if (configSpellRules !== null && configSpellRules.multiClassSpellSlotDivisor !== null) {
            const levelContribution = ClassAccessors.getLevel(charClass) / configSpellRules.multiClassSpellSlotDivisor;
            if (configSpellRules.multiClassSpellSlotRounding === MulticlassSpellSlotRoundingEnum.UP) {
                acc += Math.ceil(levelContribution);
            }
            else {
                acc += Math.floor(levelContribution);
            }
        }
        return acc;
    }, 0);
    return spellSlotsData[combinedLevel];
}
/**
 *
 * @param knownCantripsMax
 * @param activeCantripsCount
 */
export function deriveIsCantripsKnownMaxed(knownCantripsMax, activeCantripsCount) {
    let cantripsKnownMaxed = false;
    if (knownCantripsMax === null) {
        cantripsKnownMaxed = true;
    }
    else {
        cantripsKnownMaxed = activeCantripsCount >= knownCantripsMax;
    }
    return cantripsKnownMaxed;
}
/**
 *
 * @param knownSpellsMax
 * @param knownSpellCount
 * @param knowAllClassSpells
 */
export function deriveIsSpellsKnownMaxed(knownSpellsMax, knownSpellCount, knowAllClassSpells) {
    let spellsKnownMaxed = false;
    if (knowAllClassSpells) {
        spellsKnownMaxed = true;
    }
    else if (knownSpellsMax === null) {
        spellsKnownMaxed = false;
    }
    else {
        spellsKnownMaxed = knownSpellCount >= knownSpellsMax;
    }
    return spellsKnownMaxed;
}
/**
 *
 * @param spellSlots
 * @param pactMagicSlots
 * @param ruleData
 */
export function deriveCombinedSpellSlotsInfo(spellSlots, pactMagicSlots, ruleData) {
    const maxSpellLevel = RuleDataAccessors.getMaxSpellLevel(ruleData);
    const combinedSpellSlots = [];
    for (let i = 1; i <= maxSpellLevel; i++) {
        const pactMagicSlotLevel = pactMagicSlots.find((slotLevel) => slotLevel.level === i);
        const spellSlotLevel = spellSlots.find((slotLevel) => slotLevel.level === i);
        const pactMagicAvailable = pactMagicSlotLevel ? pactMagicSlotLevel.available : 0;
        const pactMagicUsed = pactMagicSlotLevel ? pactMagicSlotLevel.used : 0;
        const spellAvailable = spellSlotLevel ? spellSlotLevel.available : 0;
        const spellUsed = spellSlotLevel ? spellSlotLevel.used : 0;
        combinedSpellSlots.push({
            level: i,
            available: pactMagicAvailable + spellAvailable,
            used: pactMagicUsed + spellUsed,
            remaining: pactMagicAvailable + spellAvailable - (pactMagicUsed + spellUsed),
        });
    }
    return combinedSpellSlots;
}
/**
 *
 * @param spellcastingClasses
 * @param spellSlotsData
 * @param ruleData
 */
export function deriveSpellSlotsInfo(spellcastingClasses, spellSlotsData, ruleData) {
    const spellSlotsAvailable = deriveClassSpellSlots(spellcastingClasses, ruleData);
    return spellSlotsAvailable
        .map((availableCount, idx) => {
        if (availableCount === 0) {
            return null;
        }
        return {
            available: availableCount,
            used: spellSlotsData.length ? spellSlotsData[idx].used : 0,
            level: idx + 1,
        };
    })
        .filter(TypeScriptUtils.isNotNullOrUndefined);
}
/**
 *
 * @param pactMagicClasses
 * @param pactMagicSlotsData
 * @param ruleData
 */
export function derivePactMagicSlotsInfo(pactMagicClasses, pactMagicSlotsData, ruleData) {
    const pactMagicSlotsAvailable = deriveClassPactMagicSlots(pactMagicClasses, ruleData);
    return pactMagicSlotsAvailable
        .map((availableCount, idx) => {
        if (availableCount === 0) {
            return null;
        }
        return {
            available: availableCount,
            used: pactMagicSlotsData.length ? pactMagicSlotsData[idx].used : 0,
            level: idx + 1,
        };
    })
        .filter(TypeScriptUtils.isNotNullOrUndefined)
        .reduce((acc, slot) => {
        if (slot.available !== 0) {
            acc.push(slot);
        }
        return acc;
    }, []);
}
/**
 * TODO refactor this to supply base toHit and bonus toHit so that it doesn't have to know if bonuses are added in already
 * @param spell
 * @param modifiers
 * @param abilityLookup
 * @param profBonus
 * @param fallbackToHit
 * @param valueLookup
 */
export function deriveSpellToHit(spell, modifiers, abilityLookup, profBonus, fallbackToHit, valueLookup) {
    let toHit = null;
    if (isAttack(spell)) {
        const toHitOverride = deriveCustomValue(spell, AdjustmentTypeEnum.TO_HIT_OVERRIDE, null, valueLookup);
        let toHitBonus = deriveCustomValue(spell, AdjustmentTypeEnum.TO_HIT_BONUS, 0, valueLookup);
        toHitBonus = toHitBonus === null ? 0 : toHitBonus;
        if (toHitOverride !== null) {
            return toHitOverride;
        }
        let baseToHit = 0;
        const spellCastingAbilityId = getSpellCastingAbilityId(spell);
        if (spellCastingAbilityId === null) {
            baseToHit = fallbackToHit;
        }
        else {
            baseToHit = deriveSpellAttackModifier(profBonus, AbilityDerivers.deriveStatModifier(spellCastingAbilityId, abilityLookup));
        }
        const dataOriginType = getDataOrigin(spell) ? getDataOriginType(spell) : null;
        if (dataOriginType !== DataOriginTypeEnum.CLASS && dataOriginType !== DataOriginTypeEnum.CLASS_FEATURE) {
            // find out about bonus toHit for current spell
            const bonusToHitModifiers = modifiers.filter((modifier) => ModifierValidators.isValidBonusSpellAttackModifier(modifier, spell));
            baseToHit += ModifierDerivers.sumModifiers(bonusToHitModifiers, abilityLookup);
        }
        toHit = baseToHit + toHitBonus;
    }
    return toHit;
}
/**
 *
 * @param spell
 * @param abilityLookup
 * @param fallbackModifier
 */
export function deriveSpellSpellcastingModifier(spell, abilityLookup, fallbackModifier) {
    const spellCastingAbilityId = getSpellCastingAbilityId(spell);
    if (spellCastingAbilityId !== null) {
        const ability = abilityLookup[spellCastingAbilityId];
        const abilityModifier = AbilityAccessors.getModifier(ability);
        if (ability && abilityModifier !== null) {
            return abilityModifier;
        }
        return fallbackModifier;
    }
    return fallbackModifier;
}
/**
 *
 * @param spell
 */
export function deriveIsCastedBySpellbookSpellcaster(spell) {
    const dataOrigin = getDataOrigin(spell);
    return !!(dataOrigin.primary !== null && ClassAccessors.isSpellbookSpellcaster(dataOrigin.primary));
}
/**
 *
 * @param spell
 */
export function deriveIsCastedByRitualSpellcaster(spell) {
    const dataOrigin = getDataOrigin(spell);
    const dataOriginType = getDataOriginType(spell);
    switch (dataOriginType) {
        case DataOriginTypeEnum.CLASS:
            return !!(dataOrigin.primary !== null &&
                ClassAccessors.isRitualSpellCaster(dataOrigin.primary));
        case DataOriginTypeEnum.CLASS_FEATURE:
            return !!(dataOrigin.parent !== null &&
                ClassAccessors.isRitualSpellCaster(dataOrigin.parent));
    }
    return false;
}
/**
 *
 * @param spell
 */
export function deriveIsActive(spell) {
    switch (getDataOriginType(spell)) {
        case DataOriginTypeEnum.CLASS:
            const dataOrigin = getDataOrigin(spell);
            const spellIsPepared = deriveIsPrepared(spell);
            const charClass = dataOrigin.primary;
            return (isCantrip(spell) ||
                (ClassAccessors.isPreparedSpellcaster(charClass) && spellIsPepared) ||
                ClassAccessors.isKnownSpellcaster(charClass) ||
                (ClassAccessors.isSpellbookSpellcaster(charClass) && spellIsPepared));
        default:
            return true;
    }
}
/**
 *
 * @param spell
 * @param modifiers
 * @param abilityLookup
 * @param fixedDamageBonus
 * @param valueLookup
 */
export function deriveSpellBonusFixedDamage(spell, modifiers, abilityLookup, fixedDamageBonus, valueLookup) {
    let adjustmentDamageBonus = deriveCustomValue(spell, AdjustmentTypeEnum.FIXED_VALUE_BONUS, 0, valueLookup);
    adjustmentDamageBonus = adjustmentDamageBonus === null ? 0 : adjustmentDamageBonus;
    const damageSpellAttackModifiers = modifiers.filter((modifier) => ModifierValidators.isValidDamageSpellAttackModifier(modifier, spell));
    const damageSpellAttackModifierTotal = ModifierDerivers.sumModifiers(damageSpellAttackModifiers, abilityLookup);
    let extraDamageBonus = 0;
    if (getDefinitionName(spell) === DB_STRING_SPELL_ELDRITCH_BLAST) {
        const eldritchBlastBonusDamageModifiers = modifiers.filter((modifier) => ModifierValidators.isEldritchBlastBonusDamageModifier(modifier));
        const edlritchBlastBonusDamageTotal = ModifierDerivers.sumModifiers(eldritchBlastBonusDamageModifiers, abilityLookup);
        extraDamageBonus += edlritchBlastBonusDamageTotal;
    }
    return damageSpellAttackModifierTotal + fixedDamageBonus + adjustmentDamageBonus + extraDamageBonus;
}
/**
 *
 * @param spell
 * @param modifiers
 * @param proficiencyBonus
 * @param abilityLookup
 * @param fallbackBaseSaveDc
 * @param valueLookup
 */
export function deriveSpellAttackSaveValue(spell, modifiers, proficiencyBonus, abilityLookup, fallbackBaseSaveDc, valueLookup) {
    if (!getRequiresSavingThrow(spell)) {
        return null;
    }
    const saveDcOverride = deriveCustomValue(spell, AdjustmentTypeEnum.SAVE_DC_OVERRIDE, null, valueLookup);
    let saveDcBonus = deriveCustomValue(spell, AdjustmentTypeEnum.SAVE_DC_BONUS, 0, valueLookup);
    saveDcBonus = saveDcBonus === null ? 0 : saveDcBonus;
    if (saveDcOverride !== null) {
        return saveDcOverride;
    }
    const overrideSaveDc = getOverrideSaveDc(spell);
    if (overrideSaveDc !== null) {
        return overrideSaveDc;
    }
    let saveDc = 0;
    const spellCastingAbilityId = getSpellCastingAbilityId(spell);
    if (spellCastingAbilityId === null) {
        saveDc = fallbackBaseSaveDc + saveDcBonus;
    }
    else {
        const abilityModifier = AbilityDerivers.deriveStatModifier(spellCastingAbilityId, abilityLookup);
        saveDc = CharacterDerivers.deriveAttackSaveValue(proficiencyBonus, abilityModifier) + saveDcBonus;
    }
    switch (getDataOriginType(spell)) {
        case DataOriginTypeEnum.CLASS:
        case DataOriginTypeEnum.CLASS_FEATURE:
        case DataOriginTypeEnum.ITEM:
            break;
        default:
            const bonusToHitModifiers = modifiers.filter((modifier) => ModifierValidators.isBonusSpellSaveDc(modifier));
            saveDc += ModifierDerivers.sumModifiers(bonusToHitModifiers, abilityLookup);
    }
    return saveDc;
}
/**
 *
 * @param spell
 * @param modifiers
 * @param abilityLookup
 */
export function deriveSpellRange(spell, modifiers, abilityLookup) {
    const range = getRange(spell);
    let extraRangeBonus = 0;
    if (getDefinitionName(spell) === DB_STRING_SPELL_ELDRITCH_BLAST) {
        const eldritchBlastBonusRangeModifiers = modifiers.filter((modifier) => ModifierValidators.isEldritchBlastBonusRangeModifier(modifier));
        const edlritchBlastBonusRangeTotal = ModifierDerivers.sumModifiers(eldritchBlastBonusRangeModifiers, abilityLookup);
        extraRangeBonus += edlritchBlastBonusRangeTotal;
    }
    let spellAttackRangeMultiplierTotal = 1;
    if (isAttack(spell)) {
        const spellAttackRangeMultiplierModifiers = modifiers.filter((modifier) => ModifierValidators.isBonusSpellAttackRangeMultiplierModifier(modifier));
        spellAttackRangeMultiplierTotal = Math.max(1, ModifierDerivers.sumModifiers(spellAttackRangeMultiplierModifiers, abilityLookup, 1));
    }
    return (((range !== null && range.rangeValue ? range.rangeValue : 0) + extraRangeBonus) *
        spellAttackRangeMultiplierTotal);
}
/**
 *
 * @param spell
 * @param valueLookup
 */
export function deriveIsCustomized(spell, valueLookup) {
    const [contextId, contextTypeId] = deriveExpandedContextIds(spell);
    return ValueValidators.validateHasCustomization(SPELL_CUSTOMIZATION_ADJUSTMENT_TYPES, valueLookup, ValueHacks.hack__toString(getMappingId(spell)), ValueHacks.hack__toString(getMappingEntityTypeId(spell)), ValueHacks.hack__toString(contextId), ValueHacks.hack__toString(contextTypeId));
}
/**
 *
 * @param spell
 * @param spellListDataOriginLookup
 */
export function deriveExpandedDataOriginRef(spell, spellListDataOriginLookup) {
    const spellListId = getSpellListId(spell);
    if (spellListId !== null) {
        const dataOriginRef = HelperUtils.lookupDataOrFallback(spellListDataOriginLookup, spellListId);
        if (dataOriginRef === null) {
            return DataOriginGenerators.generateDataOriginRef(DataOriginTypeEnum.UNKNOWN, '');
        }
        return dataOriginRef;
    }
    return null;
}
/**
 *
 * @param spell
 * @param valueTypeId
 * @param fallback
 * @param valueLookup
 */
function deriveCustomValue(spell, valueTypeId, fallback, valueLookup) {
    if (valueLookup) {
        const [contextId, contextTypeId] = deriveExpandedContextIds(spell);
        return ValueUtils.getKeyValue(valueLookup, valueTypeId, ValueHacks.hack__toString(getMappingId(spell)), ValueHacks.hack__toString(getMappingEntityTypeId(spell)), fallback, ValueHacks.hack__toString(contextId), ValueHacks.hack__toString(contextTypeId));
    }
    return fallback;
}
/**
 *
 * @param spell
 * @param valueLookup
 */
export function deriveNotes(spell, valueLookup) {
    return deriveCustomValue(spell, AdjustmentTypeEnum.NOTES, null, valueLookup);
}
/**
 *
 * @param spell
 * @param valueLookup
 */
export function deriveName(spell, valueLookup) {
    const definitionName = getDefinitionName(spell);
    let fallbackName = '';
    if (definitionName !== null) {
        fallbackName = definitionName;
    }
    return deriveCustomValue(spell, AdjustmentTypeEnum.NAME_OVERRIDE, fallbackName, valueLookup);
}
/**
 *
 * @param spell
 * @param modifiers
 * @param abilityLookup
 */
export function deriveRange(spell, modifiers, abilityLookup) {
    let range = null;
    if (spell.range !== null) {
        range = Object.assign(Object.assign({}, spell.range), { rangeValue: deriveSpellRange(spell, modifiers, abilityLookup) });
    }
    return range;
}
/**
 *
 * @param spell
 * @param classInfo
 */
export function deriveCanRemove(spell, classInfo) {
    let canRemove = false;
    if (getLevel(spell) === 0) {
        if (classInfo.knownCantripsMax !== null) {
            canRemove = true;
        }
    }
    else if (!classInfo.knowsAllSpells) {
        canRemove = true;
    }
    return canRemove;
}
/**
 *
 * @param spell
 * @param classInfo
 */
export function deriveCanPrepare(spell, classInfo) {
    let canPrepare = !!classInfo.prepareMax;
    if (getLevel(spell) === 0 || isAlwaysPrepared(spell)) {
        canPrepare = false;
    }
    return canPrepare;
}
/**
 *
 * @param spell
 * @param valueLookup
 */
export function deriveIsDisplayAsAttack(spell, valueLookup) {
    return deriveCustomValue(spell, AdjustmentTypeEnum.DISPLAY_AS_ATTACK, null, valueLookup);
}
/**
 *
 * @param spell
 * @param characterLevel
 */
export function deriveCharacterLevel(spell, characterLevel) {
    var _a;
    if (getScaleType(spell) === SpellScaleTypeNameEnum.CHARACTER_LEVEL) {
        return (_a = getCastAtLevel(spell)) !== null && _a !== void 0 ? _a : characterLevel;
    }
    return characterLevel;
}
/**
 *
 * @param spell
 */
export function deriveUniqueKey(spell) {
    let sourceId = '';
    switch (getDataOriginType(spell)) {
        case DataOriginTypeEnum.ITEM:
            sourceId = ItemAccessors.getUniqueKey(getDataOrigin(spell).primary);
            break;
        case DataOriginTypeEnum.CLASS:
            sourceId = ClassAccessors.getId(getDataOrigin(spell).primary);
            break;
        default:
        // not implemented
    }
    return `${deriveKnownKey(spell)}-${sourceId}`;
}
/**
 *
 * @param spell
 */
export function deriveKnownKey(spell) {
    return `${getMappingId(spell)}-${getMappingEntityTypeId(spell)}`;
}
/**
 *
 * @param spell
 */
export function deriveLeveledKnownKey(spell, castLevel) {
    return `${getMappingId(spell)}-${getMappingEntityTypeId(spell)}-${castLevel}`;
}
/**
 *
 * @param scaleType
 * @param higherLevelDefinition
 * @param spell
 * @param ruleData
 */
export function deriveAtHigherLevelAdditionalCountEntries(scaleType, higherLevelDefinition, spell, ruleData) {
    var _a, _b, _c;
    const entries = [];
    if (scaleType === SpellScaleTypeNameEnum.SPELL_SCALE) {
        const spellLevel = getLevel(spell);
        const maxSpellLevel = RuleDataAccessors.getMaxSpellLevel(ruleData);
        const levelIncrement = (_a = higherLevelDefinition.level) !== null && _a !== void 0 ? _a : 1;
        const start = spellLevel + levelIncrement;
        let j = 1;
        for (let i = start; i <= maxSpellLevel; i += levelIncrement, j++) {
            entries.push(CoreSimulators.simulateHigherLevelEntryContract({
                level: i,
                description: higherLevelDefinition.details,
                totalCount: j * ((_b = higherLevelDefinition.value) !== null && _b !== void 0 ? _b : 1),
            }));
        }
    }
    else {
        entries.push(CoreSimulators.simulateHigherLevelEntryContract({
            level: higherLevelDefinition.level,
            description: higherLevelDefinition.details,
            totalCount: (_c = higherLevelDefinition.value) !== null && _c !== void 0 ? _c : 1,
        }));
    }
    return entries;
}
/**
 *
 * @param scaleType
 * @param higherLevelDefinition
 * @param spell
 * @param ruleData
 */
export function deriveAtHigherLevelAdditionalTargetsEntries(scaleType, higherLevelDefinition, spell, ruleData) {
    var _a, _b, _c;
    const entries = [];
    if (scaleType === SpellScaleTypeNameEnum.SPELL_SCALE) {
        const spellLevel = getLevel(spell);
        const maxSpellLevel = RuleDataAccessors.getMaxSpellLevel(ruleData);
        const levelIncrement = (_a = higherLevelDefinition.level) !== null && _a !== void 0 ? _a : 1;
        const start = spellLevel + levelIncrement;
        let j = 1;
        for (let i = start; i <= maxSpellLevel; i += levelIncrement, j++) {
            entries.push(CoreSimulators.simulateHigherLevelEntryContract({
                level: i,
                description: higherLevelDefinition.details,
                targets: j * ((_b = higherLevelDefinition.value) !== null && _b !== void 0 ? _b : 1),
            }));
        }
    }
    else {
        entries.push(CoreSimulators.simulateHigherLevelEntryContract({
            level: higherLevelDefinition.level,
            description: higherLevelDefinition.details,
            targets: (_c = higherLevelDefinition.value) !== null && _c !== void 0 ? _c : 1,
        }));
    }
    return entries;
}
/**
 *
 * @param scaleType
 * @param higherLevelDefinition
 * @param spell
 * @param ruleData
 */
export function deriveAtHigherLevelExtendedAreaEntries(scaleType, higherLevelDefinition, spell, ruleData) {
    var _a, _b, _c;
    const entries = [];
    if (scaleType === SpellScaleTypeNameEnum.SPELL_SCALE) {
        const spellRange = getRange(spell);
        const spellLevel = getLevel(spell);
        const maxSpellLevel = RuleDataAccessors.getMaxSpellLevel(ruleData);
        const levelIncrement = (_a = higherLevelDefinition.level) !== null && _a !== void 0 ? _a : 1;
        const start = spellLevel + levelIncrement;
        let j = 1;
        for (let i = start; i <= maxSpellLevel; i += levelIncrement, j++) {
            entries.push(CoreSimulators.simulateHigherLevelEntryContract({
                level: i,
                description: higherLevelDefinition.details,
                extendedAoe: j * ((_b = higherLevelDefinition.value) !== null && _b !== void 0 ? _b : 1) + ((_c = spellRange === null || spellRange === void 0 ? void 0 : spellRange.aoeValue) !== null && _c !== void 0 ? _c : 0),
            }));
        }
    }
    else {
        entries.push(CoreSimulators.simulateHigherLevelEntryContract({
            level: higherLevelDefinition.level,
            description: higherLevelDefinition.details,
            extendedAoe: higherLevelDefinition.value,
        }));
    }
    return entries;
}
/**
 *
 * @param scaleType
 * @param higherLevelDefinition
 * @param spell
 * @param ruleData
 */
export function deriveAtHigherLevelCommonDescriptionEntries(scaleType, higherLevelDefinition, spell, ruleData) {
    const entries = [];
    if (scaleType === SpellScaleTypeNameEnum.SPELL_SCALE) {
        let levelIncrement = higherLevelDefinition.level;
        if (levelIncrement === null) {
            entries.push(CoreSimulators.simulateHigherLevelEntryContract({
                level: higherLevelDefinition.level,
                description: higherLevelDefinition.details,
            }));
        }
        else {
            const spellLevel = getLevel(spell);
            const maxSpellLevel = RuleDataAccessors.getMaxSpellLevel(ruleData);
            const start = spellLevel + levelIncrement;
            for (let i = start; i <= maxSpellLevel; i += levelIncrement) {
                entries.push(CoreSimulators.simulateHigherLevelEntryContract({
                    level: i,
                    description: higherLevelDefinition.details,
                }));
            }
        }
    }
    else {
        entries.push(CoreSimulators.simulateHigherLevelEntryContract({
            level: higherLevelDefinition.level,
            description: higherLevelDefinition.details,
        }));
    }
    return entries;
}
export function deriveAtHigherLevelExtendedRangeEntries(scaleType, higherLevelDefinition, spell, ruleData) {
    var _a, _b, _c;
    const entries = [];
    if (scaleType === SpellScaleTypeNameEnum.SPELL_SCALE) {
        const spellRange = getRange(spell);
        const spellLevel = getLevel(spell);
        const maxSpellLevel = RuleDataAccessors.getMaxSpellLevel(ruleData);
        const levelIncrement = (_a = higherLevelDefinition.level) !== null && _a !== void 0 ? _a : 1;
        const start = spellLevel + levelIncrement;
        let j = 1;
        for (let i = start; i <= maxSpellLevel; i += levelIncrement, j++) {
            entries.push(CoreSimulators.simulateHigherLevelEntryContract({
                level: i,
                description: higherLevelDefinition.details,
                range: j * ((_b = higherLevelDefinition.value) !== null && _b !== void 0 ? _b : 1) + ((_c = spellRange === null || spellRange === void 0 ? void 0 : spellRange.rangeValue) !== null && _c !== void 0 ? _c : 0),
            }));
        }
    }
    else {
        entries.push(CoreSimulators.simulateHigherLevelEntryContract({
            level: higherLevelDefinition.level,
            description: higherLevelDefinition.details,
            range: higherLevelDefinition.value,
        }));
    }
    return entries;
}
/**
 *
 * @param spell
 * @param ruleData
 */
export function deriveAtHigherLevels(spell, ruleData) {
    var _a;
    const higherLevelData = getDefinitionAtHigherLevels(spell);
    // TODO V5: do we need the check this julie/brian for context
    const scaleType = higherLevelData ? getScaleType(spell) : null;
    if (higherLevelData === null || scaleType === null) {
        return null;
    }
    const additionalAttacks = [];
    const additionalTargets = [];
    const areaOfEffect = [];
    const creatures = [];
    const duration = [];
    const special = [];
    const range = [];
    (_a = higherLevelData.higherLevelDefinitions) === null || _a === void 0 ? void 0 : _a.forEach((higherLevelDefinition) => {
        switch (higherLevelDefinition.typeId) {
            case AdditionalTypeEnum.ADDITIONAL_COUNT:
                additionalAttacks.push(...deriveAtHigherLevelAdditionalCountEntries(scaleType, higherLevelDefinition, spell, ruleData));
                break;
            case AdditionalTypeEnum.ADDITIONAL_TARGETS:
                additionalTargets.push(...deriveAtHigherLevelAdditionalTargetsEntries(scaleType, higherLevelDefinition, spell, ruleData));
                break;
            case AdditionalTypeEnum.EXTENDED_AREA:
                areaOfEffect.push(...deriveAtHigherLevelExtendedAreaEntries(scaleType, higherLevelDefinition, spell, ruleData));
                break;
            case AdditionalTypeEnum.EXTENDED_DURATION:
                duration.push(...deriveAtHigherLevelCommonDescriptionEntries(scaleType, higherLevelDefinition, spell, ruleData));
                break;
            case AdditionalTypeEnum.ADDITIONAL_CREATURES:
                creatures.push(...deriveAtHigherLevelCommonDescriptionEntries(scaleType, higherLevelDefinition, spell, ruleData));
                break;
            case AdditionalTypeEnum.EXTENDED_RANGE:
                range.push(...deriveAtHigherLevelExtendedRangeEntries(scaleType, higherLevelDefinition, spell, ruleData));
                break;
            case AdditionalTypeEnum.ADDITIONAL_POINTS:
            case AdditionalTypeEnum.SPECIAL:
            default:
                special.push(...deriveAtHigherLevelCommonDescriptionEntries(scaleType, higherLevelDefinition, spell, ruleData));
                break;
        }
    });
    return {
        additionalAttacks,
        additionalTargets,
        areaOfEffect,
        creatures,
        duration,
        higherLevelDefinitions: higherLevelData.higherLevelDefinitions,
        points: [],
        special,
        range,
    };
}
/**
 *
 * @param modifier
 * @param spell
 * @param ruleData
 */
export function deriveModifier(modifier, spell, ruleData) {
    var _a;
    const higherLevelData = ModifierAccessors.getAtHigherLevels(modifier);
    // TODO V5: do we need the check this julie/brian for context
    const scaleType = higherLevelData ? getScaleType(spell) : null;
    if (higherLevelData === null || scaleType === null) {
        return modifier;
    }
    const additionalAttacks = [];
    const additionalTargets = [];
    const areaOfEffect = [];
    const creatures = [];
    const duration = [];
    const points = [];
    const special = [];
    const range = [];
    (_a = higherLevelData.higherLevelDefinitions) === null || _a === void 0 ? void 0 : _a.forEach((higherLevelDefinition) => {
        var _a, _b, _c, _d;
        switch (higherLevelDefinition.typeId) {
            case AdditionalTypeEnum.ADDITIONAL_POINTS:
                if (scaleType === SpellScaleTypeNameEnum.SPELL_SCALE) {
                    const spellLevel = getLevel(spell);
                    const maxSpellLevel = RuleDataAccessors.getMaxSpellLevel(ruleData);
                    const defDice = higherLevelDefinition.dice;
                    const defDiceValue = defDice === null ? null : DiceAccessors.getValue(defDice);
                    const defDiceCount = defDice === null ? null : DiceAccessors.getCount(defDice);
                    const modifierDice = ModifierAccessors.getDie(modifier);
                    const modifierDiceValue = modifierDice === null ? null : DiceAccessors.getValue(modifierDice);
                    const modifierDiceCount = modifierDice === null ? null : DiceAccessors.getCount(modifierDice);
                    const modifierDiceFixed = modifierDice === null ? null : DiceAccessors.getFixedValue(modifierDice);
                    let levelIncrement = (_a = higherLevelDefinition.level) !== null && _a !== void 0 ? _a : 1;
                    let start = spellLevel + levelIncrement;
                    let j = 1;
                    for (let i = start; i <= maxSpellLevel; i += levelIncrement, j++) {
                        // Dice count will be base spell modifier dice count plus the product of the iteration of the spell level bonus and the dice count of the bonus
                        let newDiceCount = (modifierDiceCount !== null && modifierDiceCount !== void 0 ? modifierDiceCount : 0) + j * (defDiceCount !== null && defDiceCount !== void 0 ? defDiceCount : 0);
                        // Add bonus fixed value to base fixed value
                        let newFixedValue = (modifierDiceFixed !== null && modifierDiceFixed !== void 0 ? modifierDiceFixed : 0) + j * ((_b = higherLevelDefinition.value) !== null && _b !== void 0 ? _b : 0);
                        points.push(CoreSimulators.simulateHigherLevelEntryContract({
                            level: i,
                            description: higherLevelDefinition.details,
                            die: DiceSimulators.simulateDiceContract({
                                diceCount: newDiceCount,
                                diceValue: defDiceValue !== null && defDiceValue !== void 0 ? defDiceValue : modifierDiceValue,
                                fixedValue: newFixedValue,
                            }),
                        }));
                    }
                }
                else {
                    const defDice = higherLevelDefinition.dice;
                    points.push(CoreSimulators.simulateHigherLevelEntryContract({
                        level: higherLevelDefinition.level,
                        description: higherLevelDefinition.details,
                        die: DiceSimulators.simulateDiceContract({
                            diceCount: defDice === null ? null : DiceAccessors.getCount(defDice),
                            diceValue: (_c = (defDice === null ? null : DiceAccessors.getValue(defDice))) !== null && _c !== void 0 ? _c : (_d = ModifierAccessors.getDie(modifier)) === null || _d === void 0 ? void 0 : _d.diceValue,
                            fixedValue: defDice === null ? null : DiceAccessors.getFixedValue(defDice),
                        }),
                    }));
                }
                break;
            case AdditionalTypeEnum.ADDITIONAL_COUNT:
                additionalAttacks.push(...deriveAtHigherLevelAdditionalCountEntries(scaleType, higherLevelDefinition, spell, ruleData));
                break;
            case AdditionalTypeEnum.ADDITIONAL_TARGETS:
                additionalTargets.push(...deriveAtHigherLevelAdditionalTargetsEntries(scaleType, higherLevelDefinition, spell, ruleData));
                break;
            case AdditionalTypeEnum.EXTENDED_AREA:
                areaOfEffect.push(...deriveAtHigherLevelExtendedAreaEntries(scaleType, higherLevelDefinition, spell, ruleData));
                break;
            case AdditionalTypeEnum.EXTENDED_RANGE:
                range.push(...deriveAtHigherLevelExtendedRangeEntries(scaleType, higherLevelDefinition, spell, ruleData));
                break;
            case AdditionalTypeEnum.EXTENDED_DURATION:
                duration.push(...deriveAtHigherLevelCommonDescriptionEntries(scaleType, higherLevelDefinition, spell, ruleData));
                break;
            case AdditionalTypeEnum.ADDITIONAL_CREATURES:
                creatures.push(...deriveAtHigherLevelCommonDescriptionEntries(scaleType, higherLevelDefinition, spell, ruleData));
                break;
            case AdditionalTypeEnum.SPECIAL:
            default:
                special.push(...deriveAtHigherLevelCommonDescriptionEntries(scaleType, higherLevelDefinition, spell, ruleData));
                break;
        }
    });
    return Object.assign(Object.assign({}, modifier), { atHigherLevels: {
            additionalAttacks,
            additionalTargets,
            areaOfEffect,
            creatures,
            duration,
            higherLevelDefinitions: higherLevelData.higherLevelDefinitions,
            points,
            special,
            range,
        } });
}
/**
 *
 * @param spell
 * @param ruleData
 */
export function deriveModifiers(spell, ruleData) {
    return getDefinitionModifiers(spell).map((modifier) => deriveModifier(modifier, spell, ruleData));
}
