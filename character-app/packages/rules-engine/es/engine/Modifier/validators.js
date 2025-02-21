import { ActionAccessors, AttackSubtypeEnum } from '../Action';
import { ClassAccessors } from '../Class';
import { AbilityStatEnum, AttackTypeRangeEnum, SpeedMovementKeyEnum } from '../Core';
import { DataOriginTypeEnum } from '../DataOrigin';
import { FeatUtils } from '../Feat';
import { FormatUtils } from '../Format';
import { ItemAccessors, ItemUtils, WeaponPropertyEnum } from '../Item';
import { SpellAccessors, SpellGroupEnum } from '../Spell';
import { getDataOrigin, getDataOriginType, getEntityId, getEntityTypeId, getStatId, getSubType, getType, isAvailableToMulticlass, requiresAttunement, } from './accessors';
import { ALL_ARMOR_LIST, DAMAGE_ADJUSTMENT_LIST, HEAVY_ARMOR_LIST, LIGHT_ARMOR_LIST, MAGIC_ITEM_ATTACK_WITH_STAT_LIST, MEDIUM_ARMOR_LIST, ModifierSubTypeEnum, ModifierTypeEnum, PROPERTY_LIST, SHIELDS_LIST, SIZE_LIST, STAT_ABILITY_SCORE_LIST, } from './constants';
/**
 *
 * @param modifier
 */
export function isLanguageModifier(modifier) {
    return getType(modifier) === ModifierTypeEnum.LANGUAGE;
}
/**
 *
 * @param modifier
 */
export function isDamageModifier(modifier) {
    return getType(modifier) === ModifierTypeEnum.DAMAGE;
}
/**
 *
 * @param modifier
 */
export function isSetExtraAttacksModifier(modifier) {
    return getType(modifier) === ModifierTypeEnum.SET && getSubType(modifier) === ModifierSubTypeEnum.EXTRA_ATTACKS;
}
/**
 *
 * @param modifier
 */
export function isSetAcMaxDexModifierModifier(modifier) {
    return (getType(modifier) === ModifierTypeEnum.SET && getSubType(modifier) === ModifierSubTypeEnum.AC_MAX_DEX_MODIFIER);
}
/**
 *
 * @param modifier
 */
export function isSetAcMaxDexArmoredModifier(modifier) {
    return (getType(modifier) === ModifierTypeEnum.SET &&
        getSubType(modifier) === ModifierSubTypeEnum.AC_MAX_DEX_ARMORED_MODIFIER);
}
/**
 *
 * @param modifier
 */
export function isSetAcMaxDexUnarmoredModifier(modifier) {
    return (getType(modifier) === ModifierTypeEnum.SET &&
        getSubType(modifier) === ModifierSubTypeEnum.AC_MAX_DEX_UNARMORED_MODIFIER);
}
/**
 *
 * @param modifier
 */
export function isBonusInitiativeModifier(modifier) {
    if (getType(modifier) !== ModifierTypeEnum.BONUS) {
        return false;
    }
    return getSubType(modifier) === ModifierSubTypeEnum.INITIATIVE;
}
/**
 *
 * @param modifier
 */
export function isAdvantageInitiativeModifier(modifier) {
    if (getType(modifier) !== ModifierTypeEnum.ADVANTAGE) {
        return false;
    }
    return getSubType(modifier) === ModifierSubTypeEnum.INITIATIVE;
}
/**
 *
 * @param modifier
 */
export function isSetArmoredArmorClassModifier(modifier) {
    if (getType(modifier) !== ModifierTypeEnum.SET) {
        return false;
    }
    return getSubType(modifier) === ModifierSubTypeEnum.ARMORED_ARMOR_CLASS;
}
/**
 *
 * @param modifier
 */
export function isBonusArmoredArmorClassModifier(modifier) {
    if (getType(modifier) !== ModifierTypeEnum.BONUS) {
        return false;
    }
    return getSubType(modifier) === ModifierSubTypeEnum.ARMORED_ARMOR_CLASS;
}
/**
 *
 * @param modifier
 */
export function isSetUnarmoredArmorClassModifier(modifier) {
    if (getType(modifier) !== ModifierTypeEnum.SET) {
        return false;
    }
    return getSubType(modifier) === ModifierSubTypeEnum.UNARMORED_ARMOR_CLASS;
}
/**
 *
 * @param modifier
 */
export function isBonusUnarmoredArmorClassModifier(modifier) {
    if (getType(modifier) !== ModifierTypeEnum.BONUS) {
        return false;
    }
    return getSubType(modifier) === ModifierSubTypeEnum.UNARMORED_ARMOR_CLASS;
}
/**
 *
 * @param modifier
 */
export function isIgnoreUnarmoredDexAcBonusModifier(modifier) {
    if (getType(modifier) !== ModifierTypeEnum.IGNORE) {
        return false;
    }
    return getSubType(modifier) === ModifierSubTypeEnum.UNARMORED_DEX_AC_BONUS;
}
/**
 *
 * @param modifier
 */
export function isSetMinimumBaseArmorModifier(modifier) {
    return (getType(modifier) === ModifierTypeEnum.SET && getSubType(modifier) === ModifierSubTypeEnum.MINIMUM_BASE_ARMOR);
}
/**
 *
 * @param modifier
 */
export function isHalfProficiencyInitiativeModifier(modifier) {
    if (getType(modifier) !== ModifierTypeEnum.HALF_PROFICIENCY) {
        return false;
    }
    return getSubType(modifier) === ModifierSubTypeEnum.INITIATIVE;
}
/**
 *
 * @param modifier
 */
export function isHalfProficiencyRoundUpInitiativeModifier(modifier) {
    if (getType(modifier) !== ModifierTypeEnum.HALF_PROFICIENCY_ROUND_UP) {
        return false;
    }
    return getSubType(modifier) === ModifierSubTypeEnum.INITIATIVE;
}
/**
 *
 * @param modifier
 */
export function isBonusMagicModifier(modifier) {
    return getType(modifier) === ModifierTypeEnum.BONUS && getSubType(modifier) === ModifierSubTypeEnum.MAGIC;
}
/**
 *
 * @param modifier
 */
export function isBonusArmorModifier(modifier) {
    return getType(modifier) === ModifierTypeEnum.BONUS && getSubType(modifier) === ModifierSubTypeEnum.ARMOR_CLASS;
}
/**
 *
 * @param modifier
 */
export function isProficiencySelfModifier(modifier) {
    return getType(modifier) === ModifierTypeEnum.PROFICIENCY && getSubType(modifier) === ModifierSubTypeEnum.SELF;
}
/**
 *
 * @param modifier
 */
export function isResistanceModifier(modifier) {
    return getType(modifier) === ModifierTypeEnum.RESISTANCE;
}
/**
 *
 * @param modifier
 */
export function isImmunityModifier(modifier) {
    return getType(modifier) === ModifierTypeEnum.IMMUNITY;
}
/**
 *
 * @param modifier
 */
export function isVulnerabilityModifier(modifier) {
    return getType(modifier) === ModifierTypeEnum.VULNERABILITY;
}
/**
 *
 * @param modifier
 */
export function isBonusProficiencyBonusModifier(modifier) {
    return (getType(modifier) === ModifierTypeEnum.BONUS && getSubType(modifier) === ModifierSubTypeEnum.PROFICIENCY_BONUS);
}
/**
 *
 * @param modifier
 */
export function isWeaponAttackModifier(modifier) {
    return getSubType(modifier) === ModifierSubTypeEnum.WEAPON_ATTACKS;
}
/**
 *
 * @param modifier
 */
export function isWeaponAdditionalDamageModifier(modifier) {
    if (getType(modifier) !== ModifierTypeEnum.DAMAGE) {
        return false;
    }
    const subType = getSubType(modifier);
    if (subType === null) {
        return false;
    }
    return DAMAGE_ADJUSTMENT_LIST.includes(subType);
}
/**
 *
 * @param modifier
 */
export function isReplaceDamageTypeModifier(modifier) {
    if (getType(modifier) !== ModifierTypeEnum.REPLACE_DAMAGE_TYPE) {
        return false;
    }
    const subType = getSubType(modifier);
    if (subType === null) {
        return false;
    }
    return DAMAGE_ADJUSTMENT_LIST.includes(subType);
}
export function isReplaceWeaponAbilityModifier(modifier) {
    if (getType(modifier) !== ModifierTypeEnum.REPLACE_WEAPON_ABILITY) {
        return false;
    }
    const subType = getSubType(modifier);
    if (subType === null) {
        return false;
    }
    return STAT_ABILITY_SCORE_LIST.includes(subType);
}
/**
 *
 * @param modifier
 */
export function isWeaponPropertySubTypeModifier(modifier) {
    const subType = getSubType(modifier);
    if (subType === null) {
        return false;
    }
    return PROPERTY_LIST.includes(subType);
}
/**
 *
 * @param modifier
 */
export function isWeaponPropertyModifier(modifier) {
    if (getType(modifier) !== ModifierTypeEnum.WEAPON_PROPERTY) {
        return false;
    }
    return isWeaponPropertySubTypeModifier(modifier);
}
/**
 *
 * @param modifier
 */
export function isIgnoreWeaponPropertyModifier(modifier) {
    if (getType(modifier) !== ModifierTypeEnum.IGNORE_WEAPON_PROPERTY) {
        return false;
    }
    return isWeaponPropertySubTypeModifier(modifier);
}
/**
 *
 * @param modifier
 */
export function isBonusSpellAttackRangeMultiplierModifier(modifier) {
    return (getType(modifier) === ModifierTypeEnum.BONUS &&
        getSubType(modifier) === ModifierSubTypeEnum.SPELL_ATTACK_RANGE_MULTIPLIER);
}
/**
 *
 * @param modifier
 */
export function isEldritchBlastBonusDamageModifier(modifier) {
    return (getType(modifier) === ModifierTypeEnum.ELDRITCH_BLAST &&
        getSubType(modifier) === ModifierSubTypeEnum.BONUS_DAMAGE);
}
/**
 *
 * @param modifier
 */
export function isEldritchBlastBonusRangeModifier(modifier) {
    return (getType(modifier) === ModifierTypeEnum.ELDRITCH_BLAST &&
        getSubType(modifier) === ModifierSubTypeEnum.BONUS_RANGE);
}
export function isEnablePactWeaponModifier(modifier) {
    return (getType(modifier) === ModifierTypeEnum.ENABLE_FEATURE &&
        getSubType(modifier) === ModifierSubTypeEnum.ENABLE_PACT_WEAPON);
}
export function isEnableHexWeaponModifier(modifier) {
    return (getType(modifier) === ModifierTypeEnum.ENABLE_FEATURE &&
        getSubType(modifier) === ModifierSubTypeEnum.ENABLE_HEX_WEAPON);
}
/**
 *
 * @param modifier
 */
export function isArmorModifier(modifier) {
    const subType = getSubType(modifier);
    if (subType === null) {
        return false;
    }
    return ALL_ARMOR_LIST.includes(subType);
}
/**
 *
 * @param modifier
 */
export function isSpellAttackModifier(modifier) {
    return getSubType(modifier) === ModifierSubTypeEnum.SPELL_ATTACKS;
}
/**
 *
 * @param modifier
 */
export function isSetUnarmedDamageDieModifier(modifier) {
    return (getType(modifier) === ModifierTypeEnum.SET && getSubType(modifier) === ModifierSubTypeEnum.UNARMED_DAMAGE_DIE);
}
/**
 *
 * @param modifier
 */
export function isProficiencyModifier(modifier) {
    return getType(modifier) === ModifierTypeEnum.PROFICIENCY;
}
/**
 *
 * @param modifier
 */
export function isExpertiseModifier(modifier) {
    return getType(modifier) === ModifierTypeEnum.EXPERTISE;
}
/**
 *
 * @param modifier
 */
export function isBonusUnarmoredMovementModifier(modifier) {
    return (getType(modifier) === ModifierTypeEnum.BONUS && getSubType(modifier) === ModifierSubTypeEnum.UNARMORED_MOVEMENT);
}
/**
 *
 * @param modifier
 */
export function isBonusHitPointsPerLevelModifier(modifier) {
    if (getType(modifier) !== ModifierTypeEnum.BONUS) {
        return false;
    }
    return getSubType(modifier) === ModifierSubTypeEnum.HIT_POINTS_PER_LEVEL;
}
/**
 *
 * @param modifier
 */
export function isBonusHitPointsModifier(modifier) {
    return getType(modifier) === ModifierTypeEnum.BONUS && getSubType(modifier) === ModifierSubTypeEnum.HIT_POINTS;
}
/**
 *
 * @param modifier
 */
export function isSpellDamageModifier(modifier) {
    return getType(modifier) === ModifierTypeEnum.DAMAGE;
}
/**
 *
 * @param modifier
 */
export function isSpellHealingHitPointsModifier(modifier) {
    return getType(modifier) === ModifierTypeEnum.BONUS && getSubType(modifier) === ModifierSubTypeEnum.HIT_POINTS;
}
/**
 *
 * @param modifier
 */
export function isSpellHealingTempHitPointsModifier(modifier) {
    return (getType(modifier) === ModifierTypeEnum.BONUS &&
        getSubType(modifier) === ModifierSubTypeEnum.TEMPORARY_HIT_POINTS);
}
/**
 *
 * @param modifier
 */
export function isIgnoreOffhandModifierRestrictionsModifier(modifier) {
    return (getType(modifier) === ModifierTypeEnum.IGNORE &&
        getSubType(modifier) === ModifierSubTypeEnum.OFFHAND_MODIFIER_RESTRICTIONS);
}
/**
 *
 * @param modifier
 */
export function isIgnoreOffhandLightRestrictionsModifier(modifier) {
    return (getType(modifier) === ModifierTypeEnum.IGNORE &&
        getSubType(modifier) === ModifierSubTypeEnum.OFFHAND_LIGHT_RESTRICTIONS);
}
/**
 *
 * @param modifier
 */
export function isBonusDualWieldAcModifier(modifier) {
    return (getType(modifier) === ModifierTypeEnum.BONUS &&
        getSubType(modifier) === ModifierSubTypeEnum.DUAL_WIELD_ARMOR_CLASS);
}
/**
 *
 * @param modifier
 */
export function isCarringCapacityMultiplierModifier(modifier) {
    return (getType(modifier) === ModifierTypeEnum.CARRYING_CAPACITY &&
        getSubType(modifier) === ModifierSubTypeEnum.MULTIPLIER);
}
/**
 *
 * @param modifier
 */
export function isCarryingCapacitySizeModifier(modifier) {
    const subType = getSubType(modifier);
    if (subType === null) {
        return false;
    }
    return getType(modifier) === ModifierTypeEnum.CARRYING_CAPACITY && SIZE_LIST.includes(subType);
}
/**
 *
 * @param modifier
 */
export function isSizeModifier(modifier) {
    const subType = getSubType(modifier);
    if (subType === null) {
        return false;
    }
    return getType(modifier) === ModifierTypeEnum.SIZE && SIZE_LIST.includes(subType);
}
/**
 *
 * @param modifier
 */
export function isBonusPassivePerceptionModifier(modifier) {
    return (getType(modifier) === ModifierTypeEnum.BONUS && getSubType(modifier) === ModifierSubTypeEnum.PASSIVE_PERCEPTION);
}
/**
 *
 * @param modifier
 */
export function isBonusPassiveInvestigationModifier(modifier) {
    return (getType(modifier) === ModifierTypeEnum.BONUS &&
        getSubType(modifier) === ModifierSubTypeEnum.PASSIVE_INVESTIGATION);
}
/**
 *
 * @param modifier
 */
export function isBonusPassiveInsightModifier(modifier) {
    return getType(modifier) === ModifierTypeEnum.BONUS && getSubType(modifier) === ModifierSubTypeEnum.PASSIVE_INSIGHT;
}
/**
 *
 * @param modifier
 */
export function isBonusMeleeReachModifier(modifier) {
    return getType(modifier) === ModifierTypeEnum.BONUS && getSubType(modifier) === ModifierSubTypeEnum.MELEE_REACH;
}
/**
 *
 * @param modifier
 */
export function isKenseiWeaponModifier(modifier) {
    if (getType(modifier) !== ModifierTypeEnum.KENSEI) {
        return false;
    }
    return true;
}
/**
 *
 * @param modifier
 */
export function isMonkWeaponModifier(modifier) {
    if (getType(modifier) !== ModifierTypeEnum.MONK_WEAPON) {
        return false;
    }
    return true;
}
/**
 *
 * @param modifier
 */
export function isProtectionModifier(modifier) {
    return getType(modifier) === ModifierTypeEnum.PROTECTION;
}
/**
 *
 * @param modifier
 */
export function isProtectionZeroHpModifier(modifier) {
    return isProtectionModifier(modifier) && getSubType(modifier) === ModifierSubTypeEnum.ZERO_HP;
}
/**
 *
 * @param modifier
 */
export function isStealthDisadvantageRemoveModifier(modifier) {
    return (getType(modifier) === ModifierTypeEnum.STEALTH_DISADVANTAGE &&
        getSubType(modifier) === ModifierSubTypeEnum.REMOVE);
}
/**
 *
 * @param modifier
 */
export function isSetDeathModifier(modifier) {
    return getType(modifier) === ModifierTypeEnum.SET && getSubType(modifier) === ModifierSubTypeEnum.DEATH;
}
/**
 *
 * @param modifier
 */
export function isSpeedReductionRemoveModifier(modifier) {
    return (getType(modifier) === ModifierTypeEnum.SPEED_REDUCTION && getSubType(modifier) === ModifierSubTypeEnum.REMOVE);
}
/**
 *
 * @param modifier
 */
export function isIgnoreUnarmoredWhileArmoredModifier(modifier) {
    if (getType(modifier) !== ModifierTypeEnum.IGNORE) {
        return false;
    }
    return getSubType(modifier) === ModifierSubTypeEnum.UNARMORED_WHILE_ARMORED;
}
/**
 *
 * @param modifier
 */
export function isArmorBranchingModifier(modifier) {
    return (isSetMinimumBaseArmorModifier(modifier) ||
        isSetUnarmoredArmorClassModifier(modifier) ||
        isIgnoreUnarmoredDexAcBonusModifier(modifier) ||
        isIgnoreUnarmoredWhileArmoredModifier(modifier));
}
/**
 *
 * @param modifier
 */
export function isBonusShieldAcOnDexSavesModifier(modifier) {
    return (getType(modifier) === ModifierTypeEnum.BONUS &&
        getSubType(modifier) === ModifierSubTypeEnum.SHIELD_AC_ON_DEX_SAVES);
}
/**
 *
 * @param modifier
 */
export function isSetAttunementSlotsModifier(modifier) {
    return getType(modifier) === ModifierTypeEnum.SET && getSubType(modifier) === ModifierSubTypeEnum.ATTUNEMENT_SLOTS;
}
/**
 *
 * @param modifier
 */
export function isAdvantageDeathSavesModifier(modifier) {
    return (getType(modifier) === ModifierTypeEnum.ADVANTAGE &&
        getSubType(modifier) === ModifierSubTypeEnum.DEATH_SAVING_THROWS);
}
/**
 *
 * @param modifier
 */
export function isDisadvantageDeathSavesModifier(modifier) {
    return (getType(modifier) === ModifierTypeEnum.DISADVANTAGE &&
        getSubType(modifier) === ModifierSubTypeEnum.DEATH_SAVING_THROWS);
}
/**
 *
 * @param modifier
 */
export function isBonusMagicItemAttackWithStatModifier(modifier) {
    if (getType(modifier) !== ModifierTypeEnum.BONUS) {
        return false;
    }
    const subType = getSubType(modifier);
    if (subType === null) {
        return false;
    }
    return MAGIC_ITEM_ATTACK_WITH_STAT_LIST.includes(subType);
}
/**
 *
 * @param modifier
 */
export function isIgnoreHeavyArmorSpeedReductionModifier(modifier) {
    return (getType(modifier) === ModifierTypeEnum.IGNORE &&
        getSubType(modifier) === ModifierSubTypeEnum.HEAVY_ARMOR_SPEED_REDUCTION);
}
export function isStealthDisadvantageRemoveModifierForMediumArmor(modifier) {
    const dataOrigin = getDataOrigin(modifier);
    return (isStealthDisadvantageRemoveModifier(modifier) &&
        getDataOriginType(modifier) === DataOriginTypeEnum.FEAT &&
        FeatUtils.isMediumArmorMaster(dataOrigin.primary));
}
/**
 * When a modifier is type bonus it might be associated with a spell group, eg SPELL_GROUP_HEALING for Disciple of Life
 * @param modifier
 * @param spellGroupId
 */
export function isValidBonusSpellGroupModifier(modifier, spellGroupId) {
    if (getType(modifier) !== ModifierTypeEnum.BONUS) {
        return false;
    }
    return isValidSpellGroupModifier(modifier, spellGroupId);
}
/**
 * Check to see if a modifer has a valid spellGroupId
 * @param modifier
 * @param spellGroupId
 */
export function isValidSpellGroupModifier(modifier, spellGroupId) {
    switch (spellGroupId) {
        case SpellGroupEnum.HEALING:
            return getSubType(modifier) === ModifierSubTypeEnum.SPELL_GROUP_HEALING;
        default:
            return false;
    }
}
/**
 *
 * @param modifier
 * @param senseKey
 */
export function isValidSenseModifier(modifier, senseKey) {
    return getType(modifier) === ModifierTypeEnum.SENSE && getSubType(modifier) === senseKey;
}
/**
 *
 * @param modifier
 * @param senseKey
 */
export function isValidSetBaseSenseModifier(modifier, senseKey) {
    return getType(modifier) === ModifierTypeEnum.SET_BASE && getSubType(modifier) === senseKey;
}
/**
 *
 * @param modifier
 * @param senseKey
 */
export function isValidSetSenseModifier(modifier, senseKey) {
    return getType(modifier) === ModifierTypeEnum.SET && getSubType(modifier) === senseKey;
}
/**
 *
 * @param modifier
 * @param senseKey
 */
export function isValidBonusSenseModifier(modifier, senseKey) {
    return getType(modifier) === ModifierTypeEnum.BONUS && getSubType(modifier) === senseKey;
}
/**
 *
 * @param modifier
 */
export function isValidBonusChooseAbilityScoreModifier(modifier) {
    return (getType(modifier) === ModifierTypeEnum.BONUS &&
        getSubType(modifier) === ModifierSubTypeEnum.CHOOSE_AN_ABILITY_SCORE);
}
/**
 *
 * @param modifier
 * @param abilityId
 */
export function isValidStatScoreModifier(modifier, abilityId) {
    switch (abilityId) {
        case AbilityStatEnum.STRENGTH:
            return getSubType(modifier) === ModifierSubTypeEnum.STRENGTH_SCORE;
        case AbilityStatEnum.CHARISMA:
            return getSubType(modifier) === ModifierSubTypeEnum.CHARISMA_SCORE;
        case AbilityStatEnum.INTELLIGENCE:
            return getSubType(modifier) === ModifierSubTypeEnum.INTELLIGENCE_SCORE;
        case AbilityStatEnum.CONSTITUTION:
            return getSubType(modifier) === ModifierSubTypeEnum.CONSTITUTION_SCORE;
        case AbilityStatEnum.DEXTERITY:
            return getSubType(modifier) === ModifierSubTypeEnum.DEXTERITY_SCORE;
        case AbilityStatEnum.WISDOM:
            return getSubType(modifier) === ModifierSubTypeEnum.WISDOM_SCORE;
        default:
            return false;
    }
}
/**
 *
 * @param modifier
 * @param abilityId
 */
export function isValidBonusStatScoreModifier(modifier, abilityId) {
    if (getType(modifier) !== ModifierTypeEnum.BONUS) {
        return false;
    }
    return isValidStatScoreModifier(modifier, abilityId);
}
/**
 *
 * @param modifier
 * @param abilityId
 */
export function isValidStackingBonusStatScoreModifier(modifier, abilityId) {
    if (getType(modifier) !== ModifierTypeEnum.STACKING_BONUS) {
        return false;
    }
    return isValidStatScoreModifier(modifier, abilityId);
}
/**
 *
 * @param modifier
 * @param abilityId
 */
export function isValidSetStatScoreModifier(modifier, abilityId) {
    if (getType(modifier) !== ModifierTypeEnum.SET) {
        return false;
    }
    return isValidStatScoreModifier(modifier, abilityId);
}
/**
 *
 * @param modifier
 * @param abilityId
 */
export function isValidStatMaxModifier(modifier, abilityId) {
    if (getSubType(modifier) !== ModifierSubTypeEnum.ABILITY_SCORE_MAXIMUM) {
        return false;
    }
    const statId = getStatId(modifier);
    if (!statId) {
        return false;
    }
    return statId === abilityId;
}
/**
 *
 * @param modifier
 * @param abilityId
 */
export function isValidBonusStatMaxModifier(modifier, abilityId) {
    if (getType(modifier) !== ModifierTypeEnum.BONUS) {
        return false;
    }
    return isValidStatMaxModifier(modifier, abilityId);
}
/**
 *
 * @param modifier
 * @param abilityId
 */
export function isValidSaveModifier(modifier, abilityId = null) {
    if (getSubType(modifier) === ModifierSubTypeEnum.SAVING_THROWS) {
        return true;
    }
    switch (abilityId) {
        case AbilityStatEnum.STRENGTH:
            return getSubType(modifier) === ModifierSubTypeEnum.STRENGTH_SAVING_THROWS;
        case AbilityStatEnum.CHARISMA:
            return getSubType(modifier) === ModifierSubTypeEnum.CHARISMA_SAVING_THROWS;
        case AbilityStatEnum.INTELLIGENCE:
            return getSubType(modifier) === ModifierSubTypeEnum.INTELLIGENCE_SAVING_THROWS;
        case AbilityStatEnum.CONSTITUTION:
            return getSubType(modifier) === ModifierSubTypeEnum.CONSTITUTION_SAVING_THROWS;
        case AbilityStatEnum.DEXTERITY:
            return getSubType(modifier) === ModifierSubTypeEnum.DEXTERITY_SAVING_THROWS;
        case AbilityStatEnum.WISDOM:
            return getSubType(modifier) === ModifierSubTypeEnum.WISDOM_SAVING_THROWS;
        default:
            return false;
    }
}
/**
 *
 * @param modifier
 * @param abilityId
 */
export function isValidBonusSaveModifier(modifier, abilityId = null) {
    if (getType(modifier) !== ModifierTypeEnum.BONUS) {
        return false;
    }
    return isValidSaveModifier(modifier, abilityId);
}
/**
 *
 * @param modifier
 * @param abilityId
 */
export function isValidAdvantageSaveModifier(modifier, abilityId = null) {
    if (getType(modifier) !== ModifierTypeEnum.ADVANTAGE) {
        return false;
    }
    return isValidSaveModifier(modifier, abilityId);
}
/**
 *
 * @param modifier
 * @param abilityId
 */
export function isValidDisadvantageSaveModifier(modifier, abilityId = null) {
    if (getType(modifier) !== ModifierTypeEnum.DISADVANTAGE) {
        return false;
    }
    return isValidSaveModifier(modifier, abilityId);
}
/**
 *
 * @param modifier
 * @param abilityId
 */
export function isValidProficiencySaveModifier(modifier, abilityId = null) {
    if (getType(modifier) !== ModifierTypeEnum.PROFICIENCY) {
        return false;
    }
    return isValidSaveModifier(modifier, abilityId);
}
/**
 *
 * @param modifier
 * @param abilityId
 */
export function isValidSetSaveModifier(modifier, abilityId = null) {
    if (getType(modifier) !== ModifierTypeEnum.SET) {
        return false;
    }
    return isValidSaveModifier(modifier, abilityId);
}
/**
 *
 * @param modifier
 * @param abilityId
 */
export function isValidStatAttackModifier(modifier, abilityId) {
    switch (abilityId) {
        case AbilityStatEnum.STRENGTH:
            return getSubType(modifier) === ModifierSubTypeEnum.STRENGTH_ATTACKS;
        case AbilityStatEnum.DEXTERITY:
            return getSubType(modifier) === ModifierSubTypeEnum.DEXTERITY_ATTACKS;
    }
    return false;
}
/**
 *
 * @param modifier
 * @param armor
 */
export function isValidArmorTypeModifier(modifier, armor) {
    const armorTypeSlug = FormatUtils.cobaltSlugify(ItemAccessors.getBaseArmorName(armor));
    if (getSubType(modifier) === ModifierSubTypeEnum.LIGHT_ARMOR) {
        return LIGHT_ARMOR_LIST.indexOf(armorTypeSlug) > -1;
    }
    else if (getSubType(modifier) === ModifierSubTypeEnum.MEDIUM_ARMOR) {
        return MEDIUM_ARMOR_LIST.indexOf(armorTypeSlug) > -1;
    }
    else if (getSubType(modifier) === ModifierSubTypeEnum.HEAVY_ARMOR) {
        return HEAVY_ARMOR_LIST.indexOf(armorTypeSlug) > -1;
    }
    else if (getSubType(modifier) === ModifierSubTypeEnum.SHIELDS) {
        return SHIELDS_LIST.indexOf(armorTypeSlug) > -1;
    }
    else if (isArmorModifier(modifier)) {
        return getSubType(modifier) === armorTypeSlug;
    }
    return false;
}
/**
 *
 * @param modifier
 * @param category
 */
export function isValidProficiencyWeaponCategoryModifier(modifier, category) {
    if (getType(modifier) !== ModifierTypeEnum.PROFICIENCY) {
        return false;
    }
    return isValidWeaponCategoryModifierEntity(modifier, category);
}
/**
 *
 * @param modifier
 * @param category
 */
export function isValidWeaponCategoryModifierEntity(modifier, category) {
    if (!category) {
        return false;
    }
    return category.entityTypeId === getEntityTypeId(modifier) && category.id === getEntityId(modifier);
}
/**
 *
 * @param modifier
 * @param weapon
 */
export function isValidWeaponModifier(modifier, weapon) {
    if (isValidWeaponCategoryModifierEntity(modifier, ItemAccessors.getCategoryInfo(weapon))) {
        return true;
    }
    if (isValidWeaponSubTypeModifier(modifier, weapon)) {
        return true;
    }
    return false;
}
/**
 *
 * @param modifier
 * @param weapon
 */
export function isValidWeaponSubTypeModifier(modifier, weapon) {
    return (ItemAccessors.getBaseItemId(weapon) === getEntityId(modifier) &&
        ItemAccessors.getBaseTypeId(weapon) === getEntityTypeId(modifier));
}
/**
 *
 * @param modifier
 * @param attackTypeRange
 */
export function isValidWeaponRangeTypeModifier(modifier, attackTypeRange) {
    switch (attackTypeRange) {
        case AttackTypeRangeEnum.MELEE:
            switch (getSubType(modifier)) {
                case ModifierSubTypeEnum.MELEE_ATTACKS:
                case ModifierSubTypeEnum.MELEE_WEAPON_ATTACKS:
                    return true;
            }
            break;
        case AttackTypeRangeEnum.RANGED:
            switch (getSubType(modifier)) {
                case ModifierSubTypeEnum.RANGED_ATTACKS:
                case ModifierSubTypeEnum.RANGED_WEAPON_ATTACKS:
                    return true;
            }
            break;
    }
    return false;
}
/**
 *
 * @param modifier
 * @param action
 */
export function isValidActionWeaponModifier(modifier, action) {
    const attackRangeType = ActionAccessors.getAttackRangeId(action);
    const attackSubtype = ActionAccessors.getAttackSubtypeId(action);
    if (isWeaponAttackModifier(modifier)) {
        return true;
    }
    if (isValidWeaponRangeTypeModifier(modifier, attackRangeType)) {
        return true;
    }
    if (attackSubtype === AttackSubtypeEnum.NATURAL) {
        if (getSubType(modifier) === ModifierSubTypeEnum.NATURAL_ATTACKS) {
            return true;
        }
        if (attackRangeType === AttackTypeRangeEnum.MELEE &&
            getSubType(modifier) === ModifierSubTypeEnum.MELEE_NATURAL_ATTACKS) {
            return true;
        }
        if (attackRangeType === AttackTypeRangeEnum.RANGED &&
            getSubType(modifier) === ModifierSubTypeEnum.RANGED_NATURAL_ATTACKS) {
            return true;
        }
    }
    if (attackSubtype === AttackSubtypeEnum.UNARMED) {
        switch (getSubType(modifier)) {
            case ModifierSubTypeEnum.UNARMED_ATTACKS:
            case ModifierSubTypeEnum.NATURAL_ATTACKS:
                return true;
        }
        if (attackRangeType === AttackTypeRangeEnum.MELEE &&
            (getSubType(modifier) === ModifierSubTypeEnum.MELEE_UNARMED_ATTACKS ||
                getSubType(modifier) === ModifierSubTypeEnum.MELEE_NATURAL_ATTACKS)) {
            return true;
        }
        if (attackRangeType === AttackTypeRangeEnum.RANGED &&
            (getSubType(modifier) === ModifierSubTypeEnum.RANGED_UNARMED_ATTACKS ||
                getSubType(modifier) === ModifierSubTypeEnum.RANGED_NATURAL_ATTACKS)) {
            return true;
        }
    }
    return false;
}
/**
 *
 * @param modifier
 * @param weapon
 * @param ruleData
 * @param isVersatileCheck
 */
export function isValidItemWeaponModifier(modifier, weapon, ruleData, isVersatileCheck = false) {
    if (isWeaponAttackModifier(modifier)) {
        return true;
    }
    if (isValidWeaponRangeTypeModifier(modifier, ItemAccessors.getAttackType(weapon))) {
        return true;
    }
    switch (getSubType(modifier)) {
        case ModifierSubTypeEnum.ONE_HANDED_WEAPON_ATTACKS:
            return !ItemUtils.hasWeaponProperty(weapon, WeaponPropertyEnum.TWO_HANDED) && !isVersatileCheck;
        case ModifierSubTypeEnum.TWO_HANDED_WEAPON_ATTACKS:
            return ItemUtils.hasWeaponProperty(weapon, WeaponPropertyEnum.TWO_HANDED) || isVersatileCheck;
        case ModifierSubTypeEnum.THROWN_WEAPON_ATTACKS:
            return ItemUtils.hasWeaponProperty(weapon, WeaponPropertyEnum.THROWN) || isVersatileCheck;
    }
    switch (ItemAccessors.getAttackType(weapon)) {
        case AttackTypeRangeEnum.MELEE:
            switch (getSubType(modifier)) {
                case ModifierSubTypeEnum.ONE_HANDED_MELEE_ATTACKS:
                    return !ItemUtils.hasWeaponProperty(weapon, WeaponPropertyEnum.TWO_HANDED) && !isVersatileCheck;
                case ModifierSubTypeEnum.TWO_HANDED_MELEE_ATTACKS:
                    return ItemUtils.hasWeaponProperty(weapon, WeaponPropertyEnum.TWO_HANDED) || isVersatileCheck;
                case ModifierSubTypeEnum.THROWN_MELEE_ATTACKS:
                    return ItemUtils.hasWeaponProperty(weapon, WeaponPropertyEnum.THROWN) || isVersatileCheck;
            }
            break;
        case AttackTypeRangeEnum.RANGED:
            switch (getSubType(modifier)) {
                case ModifierSubTypeEnum.ONE_HANDED_RANGED_ATTACKS:
                    return !ItemUtils.hasWeaponProperty(weapon, WeaponPropertyEnum.TWO_HANDED) && !isVersatileCheck;
                case ModifierSubTypeEnum.TWO_HANDED_RANGED_ATTACKS:
                    return ItemUtils.hasWeaponProperty(weapon, WeaponPropertyEnum.TWO_HANDED) || isVersatileCheck;
                case ModifierSubTypeEnum.THROWN_RANGED_ATTACKS:
                    return ItemUtils.hasWeaponProperty(weapon, WeaponPropertyEnum.THROWN) || isVersatileCheck;
            }
            break;
    }
    return isValidWeaponModifier(modifier, weapon);
}
/**
 *
 * @param modifier
 * @param weapon
 */
export function isValidWeaponProficiencyModifier(modifier, weapon) {
    if (getType(modifier) !== ModifierTypeEnum.PROFICIENCY) {
        return false;
    }
    return isValidWeaponModifier(modifier, weapon);
}
/**
 *
 * @param modifier
 * @param armor
 */
export function isValidArmorProficiencyModifier(modifier, armor) {
    if (getType(modifier) !== ModifierTypeEnum.PROFICIENCY) {
        return false;
    }
    return isValidArmorTypeModifier(modifier, armor);
}
/**
 *
 * @param modifier
 * @param weapon
 * @param ruleData
 * @param isVersatileCheck
 */
export function isValidWeaponDamageModifier(modifier, weapon, ruleData, isVersatileCheck = false) {
    if (getType(modifier) !== ModifierTypeEnum.DAMAGE) {
        return false;
    }
    return isValidItemWeaponModifier(modifier, weapon, ruleData, isVersatileCheck);
}
/**
 *
 * @param modifier
 * @param abilityId
 */
export function isValidDamageStatAttackModifier(modifier, abilityId) {
    if (getType(modifier) !== ModifierTypeEnum.DAMAGE) {
        return false;
    }
    return isValidStatAttackModifier(modifier, abilityId);
}
export function isBonusSpellSaveDc(modifier) {
    return getType(modifier) === ModifierTypeEnum.BONUS && getSubType(modifier) === ModifierSubTypeEnum.SPELL_SAVE_DC;
}
/**
 *
 * @param modifier
 * @param baseClassSlug
 */
export function isValidBonusClassSpellSaveDcModifier(modifier, baseClassSlug) {
    if (getType(modifier) !== ModifierTypeEnum.BONUS) {
        return false;
    }
    const classModifierString = `${baseClassSlug}-spell-save-dc`;
    return classModifierString === getSubType(modifier);
}
export function isBonusCantripDamage(modifier) {
    return getType(modifier) === ModifierTypeEnum.BONUS && getSubType(modifier) === ModifierSubTypeEnum.CANTRIP_DAMAGE;
}
/**
 *
 * @param modifier
 * @param baseClassSlug
 */
export function isValidBonusClassCantripDamageModifier(modifier, baseClassSlug) {
    if (getType(modifier) !== ModifierTypeEnum.BONUS) {
        return false;
    }
    const classModifierString = `${baseClassSlug}-cantrip-damage`;
    return classModifierString === getSubType(modifier);
}
/**
 *
 * @param modifier
 * @param attackTypeRange
 */
export function isValidSpellAttackRangeModifier(modifier, attackTypeRange) {
    switch (attackTypeRange) {
        case AttackTypeRangeEnum.MELEE:
            switch (getSubType(modifier)) {
                case ModifierSubTypeEnum.MELEE_ATTACKS:
                case ModifierSubTypeEnum.MELEE_SPELL_ATTACKS:
                    return true;
            }
            break;
        case AttackTypeRangeEnum.RANGED:
            switch (getSubType(modifier)) {
                case ModifierSubTypeEnum.RANGED_ATTACKS:
                case ModifierSubTypeEnum.RANGED_SPELL_ATTACKS:
                    return true;
            }
            break;
        default:
        // not implemented
    }
    return false;
}
/**
 *
 * @param modifier
 * @param spell
 */
export function isValidSpellAttackModifier(modifier, spell) {
    if (isSpellAttackModifier(modifier)) {
        return true;
    }
    if (spell && isValidSpellAttackRangeModifier(modifier, SpellAccessors.getAttackType(spell))) {
        return true;
    }
    return false;
}
/**
 *
 * @param modifier
 * @param spell
 */
export function isValidBonusSpellAttackModifier(modifier, spell) {
    if (getType(modifier) !== ModifierTypeEnum.BONUS) {
        return false;
    }
    return isValidSpellAttackModifier(modifier, spell);
}
/**
 *
 * @param modifier
 * @param spell
 */
export function isValidDamageSpellAttackModifier(modifier, spell) {
    if (getType(modifier) !== ModifierTypeEnum.DAMAGE) {
        return false;
    }
    return isValidSpellAttackModifier(modifier, spell);
}
/**
 *
 * @param modifier
 * @param baseClassSlug
 */
export function isValidBonusClassSpellAttackModifier(modifier, baseClassSlug) {
    if (getType(modifier) !== ModifierTypeEnum.BONUS) {
        return false;
    }
    const classModifierString = `${baseClassSlug}-spell-attacks`;
    return classModifierString === getSubType(modifier);
}
/**
 *
 * @param modifier
 * @param baseClassSlug
 */
export function isValidDamageClassSpellAttackModifier(modifier, baseClassSlug) {
    if (getType(modifier) !== ModifierTypeEnum.DAMAGE) {
        return false;
    }
    const classModifierString = `${baseClassSlug}-spell-attacks`;
    return classModifierString === getSubType(modifier);
}
/**
 *
 * @param modifier
 * @param weapon
 * @param ruleData
 */
export function isValidBonusWeaponToHitModifier(modifier, weapon, ruleData) {
    if (getType(modifier) !== ModifierTypeEnum.BONUS) {
        return false;
    }
    return isValidItemWeaponModifier(modifier, weapon, ruleData);
}
/**
 *
 * @param modifier
 * @param abilityId
 */
export function isValidBonusStatAttackModifier(modifier, abilityId) {
    if (getType(modifier) !== ModifierTypeEnum.BONUS) {
        return false;
    }
    return isValidStatAttackModifier(modifier, abilityId);
}
/**
 *
 * @param modifier
 * @param action
 */
export function isValidBonusActionWeaponToHitModifier(modifier, action) {
    if (getType(modifier) !== ModifierTypeEnum.BONUS) {
        return false;
    }
    return isValidActionWeaponModifier(modifier, action);
}
/**
 *
 * @param modifier
 * @param action
 */
export function isValidDamageActionWeaponModifier(modifier, action) {
    if (getType(modifier) !== ModifierTypeEnum.DAMAGE) {
        return false;
    }
    return isValidActionWeaponModifier(modifier, action);
}
/**
 *
 * @param modifier
 * @param action
 */
export function isValidActionSpellModifier(modifier, action) {
    if (isSpellAttackModifier(modifier)) {
        return true;
    }
    const attackRangeType = ActionAccessors.getAttackRangeId(action);
    if (isValidSpellAttackRangeModifier(modifier, attackRangeType)) {
        return true;
    }
    return false;
}
/**
 *
 * @param modifier
 * @param action
 */
export function isValidBonusActionSpellToHitModifier(modifier, action) {
    if (getType(modifier) !== ModifierTypeEnum.BONUS) {
        return false;
    }
    return isValidActionSpellModifier(modifier, action);
}
/**
 *
 * @param modifier
 * @param action
 */
export function isValidDamageActionSpellModifier(modifier, action) {
    if (getType(modifier) !== ModifierTypeEnum.DAMAGE) {
        return false;
    }
    return isValidActionSpellModifier(modifier, action);
}
/**
 *
 * @param modifier
 * @param skill
 */
export function isValidAbilitySkillModifier(modifier, skill) {
    if (getSubType(modifier) === ModifierSubTypeEnum.ABILITY_CHECKS) {
        return true;
    }
    switch (getSubType(modifier)) {
        case ModifierSubTypeEnum.STRENGTH_ABILITY_CHECKS:
            return skill.stat === AbilityStatEnum.STRENGTH;
        case ModifierSubTypeEnum.DEXTERITY_ABILITY_CHECKS:
            return skill.stat === AbilityStatEnum.DEXTERITY;
        case ModifierSubTypeEnum.CONSTITUTION_ABILITY_CHECKS:
            return skill.stat === AbilityStatEnum.CONSTITUTION;
        case ModifierSubTypeEnum.INTELLIGENCE_ABILITY_CHECKS:
            return skill.stat === AbilityStatEnum.INTELLIGENCE;
        case ModifierSubTypeEnum.WISDOM_ABILITY_CHECKS:
            return skill.stat === AbilityStatEnum.WISDOM;
        case ModifierSubTypeEnum.CHARISMA_ABILITY_CHECKS:
            return skill.stat === AbilityStatEnum.CHARISMA;
    }
    if (getEntityId(modifier) === skill.id && getEntityTypeId(modifier) === skill.entityTypeId) {
        return true;
    }
    return false;
}
/**
 *
 * @param modifier
 * @param skill
 */
export function isValidAbilitySkillBonusModifier(modifier, skill) {
    if (getType(modifier) !== ModifierTypeEnum.BONUS) {
        return false;
    }
    return isValidAbilitySkillModifier(modifier, skill);
}
/**
 *
 * @param modifier
 * @param skill
 */
export function isValidAbilitySkillProficiencyModifier(modifier, skill) {
    if (getType(modifier) !== ModifierTypeEnum.PROFICIENCY) {
        return false;
    }
    return isValidAbilitySkillModifier(modifier, skill);
}
/**
 *
 * @param modifier
 * @param skill
 */
export function isValidAbilitySkillExpertiseModifier(modifier, skill) {
    if (getType(modifier) !== ModifierTypeEnum.EXPERTISE) {
        return false;
    }
    return isValidAbilitySkillModifier(modifier, skill);
}
/**
 *
 * @param modifier
 * @param skill
 */
export function isValidAbilitySkillHalfProficiencyModifier(modifier, skill) {
    if (getType(modifier) !== ModifierTypeEnum.HALF_PROFICIENCY) {
        return false;
    }
    return isValidAbilitySkillModifier(modifier, skill);
}
/**
 *
 * @param modifier
 * @param skill
 */
export function isValidAbilitySkillHalfProficiencyRoundUpModifier(modifier, skill) {
    if (getType(modifier) !== ModifierTypeEnum.HALF_PROFICIENCY_ROUND_UP) {
        return false;
    }
    return isValidAbilitySkillModifier(modifier, skill);
}
/**
 *
 * @param modifier
 * @param movement
 */
export function isValidSpeedModifier(modifier, movement) {
    if (getSubType(modifier) === ModifierSubTypeEnum.SPEED) {
        return true;
    }
    switch (movement) {
        case SpeedMovementKeyEnum.WALK:
            return getSubType(modifier) === ModifierSubTypeEnum.SPEED_WALKING;
        case SpeedMovementKeyEnum.FLY:
            return getSubType(modifier) === ModifierSubTypeEnum.SPEED_FLYING;
        case SpeedMovementKeyEnum.BURROW:
            return getSubType(modifier) === ModifierSubTypeEnum.SPEED_BURROWING;
        case SpeedMovementKeyEnum.SWIM:
            return getSubType(modifier) === ModifierSubTypeEnum.SPEED_SWIMMING;
        case SpeedMovementKeyEnum.CLIMB:
            return getSubType(modifier) === ModifierSubTypeEnum.SPEED_CLIMBING;
    }
    return false;
}
/**
 *
 * @param modifier
 * @param movement
 */
export function isValidInnateSpeedModifier(modifier, movement) {
    switch (movement) {
        case SpeedMovementKeyEnum.WALK:
            return getSubType(modifier) === ModifierSubTypeEnum.INNATE_SPEED_WALKING;
        case SpeedMovementKeyEnum.FLY:
            return getSubType(modifier) === ModifierSubTypeEnum.INNATE_SPEED_FLYING;
        case SpeedMovementKeyEnum.BURROW:
            return getSubType(modifier) === ModifierSubTypeEnum.INNATE_SPEED_BURROWING;
        case SpeedMovementKeyEnum.SWIM:
            return getSubType(modifier) === ModifierSubTypeEnum.INNATE_SPEED_SWIMMING;
        case SpeedMovementKeyEnum.CLIMB:
            return getSubType(modifier) === ModifierSubTypeEnum.INNATE_SPEED_CLIMBING;
    }
    return false;
}
/**
 *
 * @param modifier
 * @param movement
 */
export function isValidBonusSpeedModifier(modifier, movement) {
    if (getType(modifier) !== ModifierTypeEnum.BONUS) {
        return false;
    }
    return isValidSpeedModifier(modifier, movement);
}
/**
 *
 * @param modifier
 * @param movement
 */
export function isValidSetSpeedModifier(modifier, movement) {
    if (getType(modifier) !== ModifierTypeEnum.SET) {
        return false;
    }
    return isValidSpeedModifier(modifier, movement);
}
/**
 *
 * @param modifier
 * @param movement
 */
export function isValidSetInnateSpeedModifier(modifier, movement) {
    if (getType(modifier) !== ModifierTypeEnum.SET) {
        return false;
    }
    return isValidInnateSpeedModifier(modifier, movement);
}
/**
 *
 * @param modifier
 * @param item
 */
export function isValidAttunedItemModifier(modifier, item) {
    if (requiresAttunement(modifier) && ItemAccessors.canAttune(item)) {
        return !!ItemAccessors.isAttuned(item);
    }
    return true;
}
/**
 *
 * @param modifier
 * @param charClass
 * @param isMulticlassCharacter
 */
export function isValidClassModifier(modifier, charClass, isMulticlassCharacter) {
    if (isMulticlassCharacter) {
        return isAvailableToMulticlass(modifier) || ClassAccessors.isStartingClass(charClass);
    }
    return true;
}
/**
 *
 * @param modifier
 * @param skill
 */
export function isValidSkillAdvantageModifier(modifier, skill) {
    if (getType(modifier) !== ModifierTypeEnum.ADVANTAGE) {
        return false;
    }
    return isValidAbilitySkillModifier(modifier, skill);
}
/**
 *
 * @param modifier
 * @param skill
 */
export function isValidSkillDisadvantageModifier(modifier, skill) {
    if (getType(modifier) !== ModifierTypeEnum.DISADVANTAGE) {
        return false;
    }
    return isValidAbilitySkillModifier(modifier, skill);
}
/**
 *
 * @param modifier
 */
export function isValidWeaponMasteryModifier(modifier) {
    return getType(modifier) === ModifierTypeEnum.WEAPON_MASTERY;
}
