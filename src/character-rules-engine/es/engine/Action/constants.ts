import { AdjustmentTypeEnum } from '../Value';

export enum ActionTypeEnum {
    WEAPON = 1,
    SPELL = 2,
    GENERAL = 3
}

export enum AttackSubtypeEnum {
    MANUFACTURED = 1,
    NATURAL = 2,
    UNARMED = 3
}

export const ACTION_CUSTOMIZATION_ADJUSTMENT_TYPES = [
    AdjustmentTypeEnum.TO_HIT_OVERRIDE,
    AdjustmentTypeEnum.TO_HIT_BONUS,
    AdjustmentTypeEnum.FIXED_VALUE_BONUS,
    AdjustmentTypeEnum.DISPLAY_AS_ATTACK,
    AdjustmentTypeEnum.NAME_OVERRIDE,
    AdjustmentTypeEnum.NOTES,
] as const;
