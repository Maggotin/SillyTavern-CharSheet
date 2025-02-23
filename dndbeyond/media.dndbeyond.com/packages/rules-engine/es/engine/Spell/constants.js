import { AdjustmentTypeEnum } from '../Value';
export const DB_STRING_SPELL_ELDRITCH_BLAST = 'Eldritch Blast';
export var SpellRangeTypeEnum;
(function (SpellRangeTypeEnum) {
    SpellRangeTypeEnum[SpellRangeTypeEnum["SELF"] = 1] = "SELF";
    SpellRangeTypeEnum[SpellRangeTypeEnum["TOUCH"] = 2] = "TOUCH";
    SpellRangeTypeEnum[SpellRangeTypeEnum["RANGED"] = 3] = "RANGED";
    SpellRangeTypeEnum[SpellRangeTypeEnum["SIGHT"] = 4] = "SIGHT";
    SpellRangeTypeEnum[SpellRangeTypeEnum["UNLIMITED"] = 9] = "UNLIMITED";
})(SpellRangeTypeEnum || (SpellRangeTypeEnum = {}));
export var SpellRangeTypeNameEnum;
(function (SpellRangeTypeNameEnum) {
    SpellRangeTypeNameEnum["SELF"] = "Self";
    SpellRangeTypeNameEnum["TOUCH"] = "Touch";
    SpellRangeTypeNameEnum["RANGED"] = "Ranged";
    SpellRangeTypeNameEnum["SIGHT"] = "Sight";
    SpellRangeTypeNameEnum["UNLIMITED"] = "Unlimited";
})(SpellRangeTypeNameEnum || (SpellRangeTypeNameEnum = {}));
export var SpellConditionTypeEnum;
(function (SpellConditionTypeEnum) {
    SpellConditionTypeEnum[SpellConditionTypeEnum["APPLY"] = 1] = "APPLY";
    SpellConditionTypeEnum[SpellConditionTypeEnum["REMOVE"] = 2] = "REMOVE";
    SpellConditionTypeEnum[SpellConditionTypeEnum["SUPRESS"] = 3] = "SUPRESS";
})(SpellConditionTypeEnum || (SpellConditionTypeEnum = {}));
export var SpellDurationTypeEnum;
(function (SpellDurationTypeEnum) {
    SpellDurationTypeEnum["INSTANTANEOUS"] = "Instantaneous";
    SpellDurationTypeEnum["CONCENTRATION"] = "Concentration";
    SpellDurationTypeEnum["TIME"] = "Time";
    SpellDurationTypeEnum["SPECIAL"] = "Special";
    SpellDurationTypeEnum["UNIT_DISPELLED"] = "Unit Dispelled";
    SpellDurationTypeEnum["UNIT_DISPELLED_TRIGGERED"] = "Unit Dispelled or Triggered";
})(SpellDurationTypeEnum || (SpellDurationTypeEnum = {}));
export var SpellPrepareTypeEnum;
(function (SpellPrepareTypeEnum) {
    SpellPrepareTypeEnum[SpellPrepareTypeEnum["LEVEL"] = 1] = "LEVEL";
    SpellPrepareTypeEnum[SpellPrepareTypeEnum["HALF_LEVEL"] = 2] = "HALF_LEVEL";
})(SpellPrepareTypeEnum || (SpellPrepareTypeEnum = {}));
export var SpellScaleTypeNameEnum;
(function (SpellScaleTypeNameEnum) {
    SpellScaleTypeNameEnum["CHARACTER_LEVEL"] = "characterlevel";
    SpellScaleTypeNameEnum["SPELL_SCALE"] = "spellscale";
    SpellScaleTypeNameEnum["SPELL_LEVEL"] = "spelllevel";
})(SpellScaleTypeNameEnum || (SpellScaleTypeNameEnum = {}));
export var RitualCastingTypeEnum;
(function (RitualCastingTypeEnum) {
    RitualCastingTypeEnum[RitualCastingTypeEnum["CAN_CAST_AS_RITUAL"] = 1] = "CAN_CAST_AS_RITUAL";
    RitualCastingTypeEnum[RitualCastingTypeEnum["MUST_CAST_AS_RITUAL"] = 2] = "MUST_CAST_AS_RITUAL";
})(RitualCastingTypeEnum || (RitualCastingTypeEnum = {}));
export var SpellGroupEnum;
(function (SpellGroupEnum) {
    SpellGroupEnum[SpellGroupEnum["HEALING"] = 1] = "HEALING";
})(SpellGroupEnum || (SpellGroupEnum = {}));
export const SPELL_CUSTOMIZATION_ADJUSTMENT_TYPES = [
    AdjustmentTypeEnum.SAVE_DC_BONUS,
    AdjustmentTypeEnum.SAVE_DC_OVERRIDE,
    AdjustmentTypeEnum.FIXED_VALUE_BONUS,
    AdjustmentTypeEnum.NAME_OVERRIDE,
    AdjustmentTypeEnum.TO_HIT_BONUS,
    AdjustmentTypeEnum.TO_HIT_OVERRIDE,
    AdjustmentTypeEnum.NOTES,
    AdjustmentTypeEnum.DISPLAY_AS_ATTACK,
];
export var SpellCastingLearningStyle;
(function (SpellCastingLearningStyle) {
    SpellCastingLearningStyle[SpellCastingLearningStyle["Prepared"] = 1] = "Prepared";
    SpellCastingLearningStyle[SpellCastingLearningStyle["Learned"] = 2] = "Learned";
})(SpellCastingLearningStyle || (SpellCastingLearningStyle = {}));
;
export const SpellCastingLearningStyleAddText = {
    [SpellCastingLearningStyle.Learned]: "Learn",
    [SpellCastingLearningStyle.Prepared]: "Prepare",
};
export const SpellCastingLearningStyleRemoveText = {
    [SpellCastingLearningStyle.Learned]: "Delete",
    [SpellCastingLearningStyle.Prepared]: "Unprepare",
};
export const DefaultSpellCastingLearningStyle = SpellCastingLearningStyle.Learned;
