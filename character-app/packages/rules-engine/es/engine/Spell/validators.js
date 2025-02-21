import { ClassAccessors } from '../Class';
import { DataOriginTypeEnum } from '../DataOrigin';
import { FeatUtils } from '../Feat';
import { LimitedUseAccessors, LimitedUseDerivers } from '../LimitedUse';
import { getBaseLevelAtWill, getCanCastAtHigherLevel, getCastAtLevel, getDataOrigin, getDataOriginType, getLevel, getLimitedUse, getUsesSpellSlot, isActive, isCantrip, isRitual, } from './accessors';
import { deriveIsActive, deriveIsCastedByRitualSpellcaster, deriveIsCastedBySpellbookSpellcaster, deriveIsPrepared, deriveIsRitual, deriveMustCastAsRitual, getCastLevelAvailableCount, getConsumedLimitedUse, isSpellAvailableAtLevel, } from './derivers';
/**
 *
 * @param spell
 * @param level
 * @param spellCasterInfo
 */
export function validateHasShownSpellSlotsBeforeLevel(spell, level, spellCasterInfo) {
    if ((spellCasterInfo.firstAvailableSpellSlotLevel !== null &&
        spellCasterInfo.lastAvailableSpellSlotLevel !== null &&
        spellCasterInfo.firstAvailableSpellSlotLevel < level &&
        spellCasterInfo.lastAvailableSpellSlotLevel >= getLevel(spell)) ||
        (spellCasterInfo.firstAvailablePactMagicSlotLevel !== null &&
            spellCasterInfo.lastAvailablePactMagicSlotLevel !== null &&
            spellCasterInfo.firstAvailablePactMagicSlotLevel < level &&
            spellCasterInfo.lastAvailablePactMagicSlotLevel >= getLevel(spell))) {
        return true;
    }
    return false;
}
/**
 *
 * @param spell
 * @param level
 * @param spellCasterInfo
 * @param preferences
 */
export function validateShouldShowClassSpellAtLevel(spell, level, spellCasterInfo, preferences) {
    if (!deriveIsActive(spell)) {
        if (deriveIsRitual(spell) &&
            getLevel(spell) === level &&
            deriveIsCastedByRitualSpellcaster(spell) &&
            deriveIsCastedBySpellbookSpellcaster(spell)) {
            return true;
        }
        else {
            return false;
        }
    }
    if (isCantrip(spell)) {
        return getLevel(spell) === level;
    }
    // show spells that have to show at a specific level
    if (getCastAtLevel(spell) === level) {
        return true;
    }
    if (isSpellAvailableAtLevel(spell, level, spellCasterInfo)) {
        if (getLevel(spell) === level) {
            // Check for normal spellcasting rules if a spell is just supposed to show at current level
            return true;
        }
        else {
            // show scalable spells
            if (preferences.showScaledSpells && getCanCastAtHigherLevel(spell)) {
                return true;
            }
            // Force scale spells that don't normally scale, but this is first time slots are available (warlocks)
            if (!validateHasShownSpellSlotsBeforeLevel(spell, level, spellCasterInfo)) {
                return true;
            }
        }
    }
    return false;
}
/**
 *
 * @param spell
 * @param level
 * @param spellCasterInfo
 * @param preferences
 */
export function validateShouldShowCharacterSpellAtLevel(spell, level, spellCasterInfo, preferences) {
    if (isCantrip(spell)) {
        return getLevel(spell) === level;
    }
    if (getUsesSpellSlot(spell)) {
        if (isSpellAvailableAtLevel(spell, level, spellCasterInfo)) {
            if (preferences.showScaledSpells) {
                return true;
            }
            else {
                return getLevel(spell) === level;
            }
        }
        else {
            return false;
        }
    }
    if (getBaseLevelAtWill(spell)) {
        return deriveIsPrepared(spell);
    }
    if (preferences.showScaledSpells) {
        return true;
    }
    else {
        if (getCastAtLevel(spell) === level) {
            return true;
        }
        return getLevel(spell) === level;
    }
}
/**
 *
 * @param spell
 * @param castLevel
 */
export function validateIsAtWill(spell, castLevel) {
    const limitedUse = getLimitedUse(spell);
    const usesSpellSlot = getUsesSpellSlot(spell);
    const baseLevelAtWill = getBaseLevelAtWill(spell);
    if (isCantrip(spell)) {
        return limitedUse === null;
    }
    if (baseLevelAtWill && castLevel === getLevel(spell)) {
        return true;
    }
    if (!limitedUse && !usesSpellSlot) {
        return true;
    }
    if (isRitual(spell) && deriveMustCastAsRitual(spell)) {
        return true;
    }
    if (isRitual(spell) &&
        !isActive(spell) &&
        deriveIsCastedByRitualSpellcaster(spell) &&
        deriveIsCastedBySpellbookSpellcaster(spell)) {
        return true;
    }
    return false;
}
/**
 *
 * @param spell
 * @param castLevel
 * @param scaledAmount
 * @param abilityLookup
 * @param ruleData
 * @param spellCasterInfo
 * @param proficiencyBonus
 */
export function validateIsLimitedUseAvailableAtScaledAmount(spell, castLevel, scaledAmount, abilityLookup, ruleData, spellCasterInfo, proficiencyBonus) {
    const limitedUse = getLimitedUse(spell);
    if (limitedUse === null) {
        return false;
    }
    const maxUses = LimitedUseDerivers.deriveMaxUses(limitedUse, abilityLookup, ruleData, proficiencyBonus);
    const numberUsed = LimitedUseAccessors.getNumberUsed(limitedUse);
    const usesSpellSlots = getUsesSpellSlot(spell);
    const consumedAmount = getConsumedLimitedUse(spell, scaledAmount);
    let isAvailable = numberUsed + consumedAmount <= maxUses;
    let areSpellSlotsAvailable;
    if (isAvailable && usesSpellSlots) {
        const dataOrigin = getDataOrigin(spell);
        const dataOriginType = getDataOriginType(spell);
        if (dataOriginType === DataOriginTypeEnum.CLASS_FEATURE &&
            ClassAccessors.isPactMagicActive(dataOrigin.parent)) {
            areSpellSlotsAvailable = getCastLevelAvailableCount(castLevel, spellCasterInfo.pactMagicSlots);
        }
        else {
            areSpellSlotsAvailable = getCastLevelAvailableCount(castLevel, spellCasterInfo.spellSlots);
        }
        if (areSpellSlotsAvailable !== null) {
            isAvailable = areSpellSlotsAvailable > 0;
        }
    }
    return isAvailable;
}
/**
 *
 * @param spell
 */
export function isValidToUsePactSlots(spell) {
    const dataOrigin = getDataOrigin(spell);
    const dataOriginType = getDataOriginType(spell);
    return ((dataOriginType === DataOriginTypeEnum.CLASS_FEATURE &&
        ClassAccessors.isPactMagicActive(dataOrigin.parent)) ||
        (dataOriginType === DataOriginTypeEnum.FEAT &&
            FeatUtils.isEldritchAdept(dataOrigin.parent)));
}
