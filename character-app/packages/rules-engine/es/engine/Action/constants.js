import { AdjustmentTypeEnum } from '../Value';
export var ActionTypeEnum;
(function (ActionTypeEnum) {
    ActionTypeEnum[ActionTypeEnum["WEAPON"] = 1] = "WEAPON";
    ActionTypeEnum[ActionTypeEnum["SPELL"] = 2] = "SPELL";
    ActionTypeEnum[ActionTypeEnum["GENERAL"] = 3] = "GENERAL";
})(ActionTypeEnum || (ActionTypeEnum = {}));
export var AttackSubtypeEnum;
(function (AttackSubtypeEnum) {
    AttackSubtypeEnum[AttackSubtypeEnum["MANUFACTURED"] = 1] = "MANUFACTURED";
    AttackSubtypeEnum[AttackSubtypeEnum["NATURAL"] = 2] = "NATURAL";
    AttackSubtypeEnum[AttackSubtypeEnum["UNARMED"] = 3] = "UNARMED";
})(AttackSubtypeEnum || (AttackSubtypeEnum = {}));
export const ACTION_CUSTOMIZATION_ADJUSTMENT_TYPES = [
    AdjustmentTypeEnum.TO_HIT_OVERRIDE,
    AdjustmentTypeEnum.TO_HIT_BONUS,
    AdjustmentTypeEnum.FIXED_VALUE_BONUS,
    AdjustmentTypeEnum.DISPLAY_AS_ATTACK,
    AdjustmentTypeEnum.NAME_OVERRIDE,
    AdjustmentTypeEnum.NOTES,
];
