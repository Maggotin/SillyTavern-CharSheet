import { AdjustmentTypeEnum } from '../Value';
export var CreatureGroupFlagEnum;
(function (CreatureGroupFlagEnum) {
    CreatureGroupFlagEnum["ARMOR_ADD_PROFICIENCY_BONUS"] = "ACPB";
    CreatureGroupFlagEnum["ATTACK_ROLLS_ADD_PROFICIENCY_BONUS"] = "ARPB";
    CreatureGroupFlagEnum["DAMAGE_ROLLS_ADD_PROFICIENCY_BONUS"] = "DRPB";
    CreatureGroupFlagEnum["PROFICIENT_SKILLS_ADD_PROFICIENCY_BONUS"] = "PSPB";
    CreatureGroupFlagEnum["PROFICIENT_SAVING_THROWS_ADD_PROFICIENCY_BONUS"] = "STPB";
    CreatureGroupFlagEnum["MAX_HIT_POINTS_LEVEL_MULTIPLIER_OPTION"] = "HPLM";
    CreatureGroupFlagEnum["EVALUATE_OWNER_SKILL_PROFICIENCIES"] = "EOSKP";
    CreatureGroupFlagEnum["EVALUATE_OWNER_SAVE_PROFICIENCIES"] = "EOSVP";
    CreatureGroupFlagEnum["EVALUATE_OWNER_PASSIVE_PERCEPTION"] = "EOPP";
    CreatureGroupFlagEnum["EVALUATE_UPDATED_PASSIVE_PERCEPTION"] = "EUPP";
    CreatureGroupFlagEnum["CANNOT_BE_SWARM"] = "CBS";
    CreatureGroupFlagEnum["CANNOT_USE_LEGENDARY_ACTIONS"] = "CULGA";
    CreatureGroupFlagEnum["CANNOT_USE_LAIR_ACTIONS"] = "CULRA";
    CreatureGroupFlagEnum["ARTIFICER_HP_MULTIPLIER"] = "AHM";
    CreatureGroupFlagEnum["MAX_HIT_POINTS_ADD_INT_MODIFIER"] = "MHPAIM";
    CreatureGroupFlagEnum["MAX_HIT_POINTS_ADD_MONSTER_CON_MODIFIER"] = "MHPAMCM";
    CreatureGroupFlagEnum["USE_CHALLENGE_RATING_AS_LEVEL"] = "UCRAL";
    CreatureGroupFlagEnum["MAX_HIT_POINTS_BASE_ARTIFICER_LEVEL"] = "MHPBAL";
    CreatureGroupFlagEnum["USE_OWNER_MAX_HIT_POINTS"] = "UOMHP";
    CreatureGroupFlagEnum["TEMP_HIT_POINTS_BASE_DRUID_LEVEL"] = "THPBDL";
    CreatureGroupFlagEnum["TEMP_HIT_POINTS_BASE_DRUID_LEVEL_MULTIPLIER"] = "THPBDLM";
    CreatureGroupFlagEnum["ARMOR_ADD_OWNER_WIS_PLUS_FIXED_VALUE"] = "AAOWPFV";
})(CreatureGroupFlagEnum || (CreatureGroupFlagEnum = {}));
export const CREATURE_CUSTOMIZATION_ADJUSTMENT_TYPES = [
    AdjustmentTypeEnum.CREATURE_SIZE,
    AdjustmentTypeEnum.CREATURE_TYPE_OVERRIDE,
    AdjustmentTypeEnum.CREATURE_ALIGNMENT,
    AdjustmentTypeEnum.CREATURE_AC,
    AdjustmentTypeEnum.CREATURE_HIT_POINTS,
    AdjustmentTypeEnum.CREATURE_NOTES,
];
export const DB_STRING_GROUP_SIDEKICK = 'Sidekick';
export const DB_STRING_TAG_SIDEKICK = 'Sidekick';
export var StatBlockTypeEnum;
(function (StatBlockTypeEnum) {
    StatBlockTypeEnum[StatBlockTypeEnum["CORE_RULES_2014"] = 0] = "CORE_RULES_2014";
    StatBlockTypeEnum[StatBlockTypeEnum["CORE_RULES_2024"] = 1] = "CORE_RULES_2024";
})(StatBlockTypeEnum || (StatBlockTypeEnum = {}));
