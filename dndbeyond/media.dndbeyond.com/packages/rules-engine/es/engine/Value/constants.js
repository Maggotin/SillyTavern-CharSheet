export var AdjustmentTypeEnum;
(function (AdjustmentTypeEnum) {
    AdjustmentTypeEnum[AdjustmentTypeEnum["OVERRIDE_AC"] = 1] = "OVERRIDE_AC";
    AdjustmentTypeEnum[AdjustmentTypeEnum["MAGIC_BONUS_AC"] = 2] = "MAGIC_BONUS_AC";
    AdjustmentTypeEnum[AdjustmentTypeEnum["MISC_BONUS_AC"] = 3] = "MISC_BONUS_AC";
    AdjustmentTypeEnum[AdjustmentTypeEnum["OVERRIDE_BASE_ARMOR"] = 4] = "OVERRIDE_BASE_ARMOR";
    AdjustmentTypeEnum[AdjustmentTypeEnum["OVERRIDE_PASSIVE_PERCEPTION"] = 5] = "OVERRIDE_PASSIVE_PERCEPTION";
    AdjustmentTypeEnum[AdjustmentTypeEnum["OVERRIDE_PASSIVE_INVESTIGATION"] = 6] = "OVERRIDE_PASSIVE_INVESTIGATION";
    AdjustmentTypeEnum[AdjustmentTypeEnum["OVERRIDE_PASSIVE_INSIGHT"] = 7] = "OVERRIDE_PASSIVE_INSIGHT";
    AdjustmentTypeEnum[AdjustmentTypeEnum["NAME_OVERRIDE"] = 8] = "NAME_OVERRIDE";
    AdjustmentTypeEnum[AdjustmentTypeEnum["NOTES"] = 9] = "NOTES";
    AdjustmentTypeEnum[AdjustmentTypeEnum["FIXED_VALUE_BONUS"] = 10] = "FIXED_VALUE_BONUS";
    AdjustmentTypeEnum[AdjustmentTypeEnum["FIXED_VALUE_OVERRIDE"] = 11] = "FIXED_VALUE_OVERRIDE";
    AdjustmentTypeEnum[AdjustmentTypeEnum["TO_HIT_BONUS"] = 12] = "TO_HIT_BONUS";
    AdjustmentTypeEnum[AdjustmentTypeEnum["TO_HIT_OVERRIDE"] = 13] = "TO_HIT_OVERRIDE";
    AdjustmentTypeEnum[AdjustmentTypeEnum["SAVE_DC_BONUS"] = 14] = "SAVE_DC_BONUS";
    AdjustmentTypeEnum[AdjustmentTypeEnum["SAVE_DC_OVERRIDE"] = 15] = "SAVE_DC_OVERRIDE";
    AdjustmentTypeEnum[AdjustmentTypeEnum["DISPLAY_AS_ATTACK"] = 16] = "DISPLAY_AS_ATTACK";
    AdjustmentTypeEnum[AdjustmentTypeEnum["IS_PROFICIENT"] = 17] = "IS_PROFICIENT";
    AdjustmentTypeEnum[AdjustmentTypeEnum["IS_OFFHAND"] = 18] = "IS_OFFHAND";
    AdjustmentTypeEnum[AdjustmentTypeEnum["COST_OVERRIDE"] = 19] = "COST_OVERRIDE";
    AdjustmentTypeEnum[AdjustmentTypeEnum["IS_SILVER"] = 20] = "IS_SILVER";
    AdjustmentTypeEnum[AdjustmentTypeEnum["IS_ADAMANTINE"] = 21] = "IS_ADAMANTINE";
    AdjustmentTypeEnum[AdjustmentTypeEnum["WEIGHT_OVERRIDE"] = 22] = "WEIGHT_OVERRIDE";
    AdjustmentTypeEnum[AdjustmentTypeEnum["SKILL_OVERRIDE"] = 23] = "SKILL_OVERRIDE";
    AdjustmentTypeEnum[AdjustmentTypeEnum["SKILL_MISC_BONUS"] = 24] = "SKILL_MISC_BONUS";
    AdjustmentTypeEnum[AdjustmentTypeEnum["SKILL_MAGIC_BONUS"] = 25] = "SKILL_MAGIC_BONUS";
    AdjustmentTypeEnum[AdjustmentTypeEnum["SKILL_PROFICIENCY_LEVEL"] = 26] = "SKILL_PROFICIENCY_LEVEL";
    AdjustmentTypeEnum[AdjustmentTypeEnum["SKILL_STAT_OVERRIDE"] = 27] = "SKILL_STAT_OVERRIDE";
    AdjustmentTypeEnum[AdjustmentTypeEnum["IS_PACT_WEAPON"] = 28] = "IS_PACT_WEAPON";
    AdjustmentTypeEnum[AdjustmentTypeEnum["IS_HEXBLADE"] = 29] = "IS_HEXBLADE";
    AdjustmentTypeEnum[AdjustmentTypeEnum["DICE_TYPE_OVERRIDE"] = 30] = "DICE_TYPE_OVERRIDE";
    AdjustmentTypeEnum[AdjustmentTypeEnum["DICE_COUNT_OVERRIDE"] = 31] = "DICE_COUNT_OVERRIDE";
    AdjustmentTypeEnum[AdjustmentTypeEnum["ARMOR_PROFICIENCY_LEVEL"] = 32] = "ARMOR_PROFICIENCY_LEVEL";
    AdjustmentTypeEnum[AdjustmentTypeEnum["WEAPON_PROFICIENCY_LEVEL"] = 33] = "WEAPON_PROFICIENCY_LEVEL";
    AdjustmentTypeEnum[AdjustmentTypeEnum["TOOL_PROFICIENCY_LEVEL"] = 34] = "TOOL_PROFICIENCY_LEVEL";
    AdjustmentTypeEnum[AdjustmentTypeEnum["LANGUAGE_PROFICIENCY_LEVEL"] = 35] = "LANGUAGE_PROFICIENCY_LEVEL";
    AdjustmentTypeEnum[AdjustmentTypeEnum["SENSE_OVERRIDE"] = 36] = "SENSE_OVERRIDE";
    AdjustmentTypeEnum[AdjustmentTypeEnum["MOVEMENT_OVERRIDE"] = 37] = "MOVEMENT_OVERRIDE";
    AdjustmentTypeEnum[AdjustmentTypeEnum["SAVING_THROW_OVERRIDE"] = 38] = "SAVING_THROW_OVERRIDE";
    AdjustmentTypeEnum[AdjustmentTypeEnum["SAVING_THROW_MISC_BONUS"] = 39] = "SAVING_THROW_MISC_BONUS";
    AdjustmentTypeEnum[AdjustmentTypeEnum["SAVING_THROW_MAGIC_BONUS"] = 40] = "SAVING_THROW_MAGIC_BONUS";
    AdjustmentTypeEnum[AdjustmentTypeEnum["SAVING_THROW_PROFICIENCY_LEVEL"] = 41] = "SAVING_THROW_PROFICIENCY_LEVEL";
    AdjustmentTypeEnum[AdjustmentTypeEnum["CREATURE_AC"] = 42] = "CREATURE_AC";
    AdjustmentTypeEnum[AdjustmentTypeEnum["CREATURE_HIT_POINTS"] = 43] = "CREATURE_HIT_POINTS";
    AdjustmentTypeEnum[AdjustmentTypeEnum["CREATURE_TYPE_OVERRIDE"] = 44] = "CREATURE_TYPE_OVERRIDE";
    AdjustmentTypeEnum[AdjustmentTypeEnum["CREATURE_ALIGNMENT"] = 45] = "CREATURE_ALIGNMENT";
    AdjustmentTypeEnum[AdjustmentTypeEnum["CREATURE_SIZE"] = 46] = "CREATURE_SIZE";
    AdjustmentTypeEnum[AdjustmentTypeEnum["CREATURE_NOTES"] = 47] = "CREATURE_NOTES";
    AdjustmentTypeEnum[AdjustmentTypeEnum["IS_DEDICATED_WEAPON"] = 48] = "IS_DEDICATED_WEAPON";
    AdjustmentTypeEnum[AdjustmentTypeEnum["CAPACITY_OVERRIDE"] = 49] = "CAPACITY_OVERRIDE";
    AdjustmentTypeEnum[AdjustmentTypeEnum["CAPACITY_WEIGHT_OVERRIDE"] = 50] = "CAPACITY_WEIGHT_OVERRIDE";
})(AdjustmentTypeEnum || (AdjustmentTypeEnum = {}));
export const ProficiencyAdjustmentTypeEnum = [
    AdjustmentTypeEnum.IS_PROFICIENT,
    AdjustmentTypeEnum.SKILL_PROFICIENCY_LEVEL,
    AdjustmentTypeEnum.ARMOR_PROFICIENCY_LEVEL,
    AdjustmentTypeEnum.WEAPON_PROFICIENCY_LEVEL,
    AdjustmentTypeEnum.TOOL_PROFICIENCY_LEVEL,
    AdjustmentTypeEnum.LANGUAGE_PROFICIENCY_LEVEL,
    AdjustmentTypeEnum.SAVING_THROW_PROFICIENCY_LEVEL,
];
