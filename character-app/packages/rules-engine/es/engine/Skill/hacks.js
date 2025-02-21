import { AbilityStatEnum } from '../Core';
import { DataOriginGenerators, DataOriginTypeEnum } from '../DataOrigin';
import { DiceAdjustmentRollTypeEnum, DiceAdjustmentTypeEnum } from '../Dice';
import { ItemAccessors } from '../Item';
/**
 *
 * @param skill
 * @param skillDiceAdjustments
 * @param nonProficientEquippedArmor
 */
export function hack__updateDisadvantageAdjustments(skill, skillDiceAdjustments, nonProficientEquippedArmor) {
    const newDiceAdjustments = [];
    switch (skill.stat) {
        case AbilityStatEnum.STRENGTH:
        case AbilityStatEnum.DEXTERITY:
            nonProficientEquippedArmor.forEach((item) => {
                newDiceAdjustments.push({
                    type: DiceAdjustmentTypeEnum.DISADVANTAGE,
                    rollType: DiceAdjustmentRollTypeEnum.ABILITY_CHECK,
                    dataOrigin: DataOriginGenerators.generateDataOrigin(DataOriginTypeEnum.ITEM, item),
                    restriction: 'when not proficient with armor worn',
                    uniqueKey: [ItemAccessors.getUniqueKey(item), 'NOT_PROFICIENT'].join('-'),
                    statId: null,
                    amount: null,
                });
            });
            break;
        default:
        // not implemented;
    }
    return [...skillDiceAdjustments, ...newDiceAdjustments];
}
