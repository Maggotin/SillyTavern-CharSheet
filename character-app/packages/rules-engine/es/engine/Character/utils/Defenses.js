import { groupBy } from 'lodash';
import { EntityUtils } from '../../Entity';
/**
 *
 * @param defenseAdjustments
 */
export function groupDefenseAdjustments(defenseAdjustments) {
    const groupedDefenseAdjustments = [];
    const keyedGroupDefenseAdjustments = groupBy(defenseAdjustments, 'name');
    Object.keys(keyedGroupDefenseAdjustments).forEach((groupKey) => {
        const damageAdjustments = keyedGroupDefenseAdjustments[groupKey];
        groupedDefenseAdjustments.push({
            name: groupKey,
            sources: damageAdjustments
                .map((adjustment) => {
                return EntityUtils.getDataOriginName(adjustment.dataOrigin, undefined, true);
            })
                .sort(),
            hasCustom: !!damageAdjustments.find((adjustment) => adjustment.isCustom),
            damageAdjustments,
        });
    });
    return groupedDefenseAdjustments;
}
