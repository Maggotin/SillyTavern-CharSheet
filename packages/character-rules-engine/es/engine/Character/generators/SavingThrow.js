import { groupBy } from 'lodash';
import { AbilityStatEnum, SaveTypeEnum, SituationalBonusSavingThrowTypeEnum } from '../../Core';
import { DiceAdjustmentRollTypeEnum, DiceAdjustmentTypeEnum, DiceDerivers } from '../../Dice';
import { FormatUtils } from '../../Format';
import { ModifierAccessors, ModifierDerivers, ModifierValidators } from '../../Modifier';
import { RuleDataAccessors, RuleDataUtils } from '../../RuleData';
import { deriveSaveTypeName } from '../derivers';
/**
 *
 * @param highestShield
 * @param modifiers
 * @param ruleData
 */
export function generateSituationalBonusSavingThrows(highestShield, modifiers, ruleData) {
    const saves = [];
    RuleDataAccessors.getStats(ruleData).forEach((statData) => {
        if (statData.id === AbilityStatEnum.DEXTERITY) {
            const bonusShieldAcModifiers = modifiers.filter((modifier) => ModifierValidators.isBonusShieldAcOnDexSavesModifier(modifier));
            if (highestShield) {
                bonusShieldAcModifiers.forEach((modifier) => {
                    saves.push({
                        key: ModifierAccessors.getEntityKey(modifier),
                        statId: statData.id,
                        value: highestShield.armorClass,
                        extra: modifier,
                        type: SituationalBonusSavingThrowTypeEnum.MODIFIER,
                    });
                });
            }
        }
    });
    return saves;
}
/**
 *
 * @param situationalBonusSavingThrows
 */
export function generateSituationalBonusSavingThrowsLookup(situationalBonusSavingThrows) {
    return groupBy(situationalBonusSavingThrows, 'statId');
}
/**
 *
 * @param type
 * @param modifier
 */
export function generateSavingThrowModifierSummary(type, modifier) {
    let tooltipParts = [];
    if (type === SaveTypeEnum.BONUS) {
        let valueTotal = ModifierAccessors.getValueTotal(modifier);
        if (valueTotal) {
            tooltipParts.push(FormatUtils.renderSignedNumber(valueTotal));
        }
    }
    tooltipParts.push(deriveSaveTypeName(type));
    let abilityName = ModifierDerivers.deriveSavingThrowModifierAbilityName(modifier);
    if (abilityName) {
        tooltipParts.push(`on ${abilityName}`);
    }
    else {
        if (!modifier.restriction) {
            tooltipParts.push('on saves');
        }
    }
    let restrictionText = ModifierAccessors.getRestriction(modifier);
    if (restrictionText) {
        tooltipParts.push(restrictionText);
    }
    return tooltipParts.join(' ');
}
/**
 *
 * @param adjustment
 * @param ruleData
 */
export function generateSavingThrowAdjustmentSummary(adjustment, ruleData) {
    let tooltipParts = [];
    if (adjustment.type === DiceAdjustmentTypeEnum.BONUS) {
        if (adjustment.amount) {
            tooltipParts.push(FormatUtils.renderSignedNumber(adjustment.amount));
        }
    }
    tooltipParts.push(DiceDerivers.deriveDiceAdjustmentTypeName(adjustment.type));
    let abilityName = null;
    if (adjustment.statId) {
        abilityName = RuleDataUtils.getStatNameById(adjustment.statId, ruleData);
    }
    if (abilityName) {
        tooltipParts.push(`on ${abilityName}`);
    }
    else if (adjustment.rollType === DiceAdjustmentRollTypeEnum.DEATH_SAVE) {
        tooltipParts.push('on death saves');
    }
    if (adjustment.restriction) {
        tooltipParts.push(adjustment.restriction);
    }
    else {
        if (adjustment.rollType === DiceAdjustmentRollTypeEnum.SAVE) {
            tooltipParts.push('on saves');
        }
    }
    return tooltipParts.join(' ');
}
