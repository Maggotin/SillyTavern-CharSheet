import { AbilityAccessors } from '../Ability';
import { RuleDataAccessors } from '../RuleData';
import { getInitialMaxUses, getNumberUsed, getOperator, getStatModifierUsesId, getUseProficiencyBonus, getProficiencyBonusOperator, } from './accessors';
import { EntityLimitedUseScaleOperatorEnum } from './constants';
import { isLimitedUseContract } from './utils';
/**
 *
 * @param limitedUse
 * @param abilityLookup
 * @param ruleData
 * @param proficiencyBonus
 */
export function deriveMaxUses(limitedUse, abilityLookup, ruleData, proficiencyBonus) {
    let initialMaxUses = getInitialMaxUses(limitedUse);
    let minimumUses = RuleDataAccessors.getMinimumLimitedUseMaxUse(ruleData);
    const statModifierUsesId = getStatModifierUsesId(limitedUse);
    let scaledMaxUses = 0;
    // If we are using a stat modifier
    if (statModifierUsesId) {
        const ability = abilityLookup[statModifierUsesId];
        const abilityModifier = AbilityAccessors.getModifier(ability);
        if (abilityModifier !== null) {
            scaledMaxUses = abilityModifier;
            // If it uses the multiplication operator, the min uses is the multiplier, there is no
            // fixed value anymore since it is the multiplier now
            if (isLimitedUseContract(limitedUse) &&
                getOperator(limitedUse) === EntityLimitedUseScaleOperatorEnum.MULTIPLICATION) {
                scaledMaxUses *= initialMaxUses;
                minimumUses = initialMaxUses;
                initialMaxUses = 0;
            }
        }
        // If proficiency bonus flag is turned on
        if (isLimitedUseContract(limitedUse) && getUseProficiencyBonus(limitedUse)) {
            // If we are multiplying the proficiency bonus
            if (getProficiencyBonusOperator(limitedUse) === EntityLimitedUseScaleOperatorEnum.MULTIPLICATION) {
                // If we need to add the initial bonus, do that now before we reset it
                // for the multiplication math
                if (getOperator(limitedUse) === EntityLimitedUseScaleOperatorEnum.ADDITION) {
                    scaledMaxUses += initialMaxUses;
                }
                scaledMaxUses *= proficiencyBonus;
                minimumUses = initialMaxUses;
                initialMaxUses = 0;
            }
            else {
                // then we are adding the proficiency bonus
                scaledMaxUses += proficiencyBonus;
            }
        }
    }
    else {
        // Not using stat modifier, check for proficiency bonus use
        if (isLimitedUseContract(limitedUse) && getUseProficiencyBonus(limitedUse)) {
            // If proficiency bonus flag is turned on
            if (getProficiencyBonusOperator(limitedUse) === EntityLimitedUseScaleOperatorEnum.MULTIPLICATION) {
                scaledMaxUses = initialMaxUses * proficiencyBonus;
                minimumUses = initialMaxUses;
                initialMaxUses = 0;
            }
            else {
                // Add proficiency bonus
                scaledMaxUses += proficiencyBonus;
            }
        }
    }
    return Math.max(minimumUses, initialMaxUses + scaledMaxUses);
}
/**
 *
 * @param limitedUse
 * @param abilityLookup
 * @param ruleData
 */
export function deriveHasUsesAvailable(limitedUse, abilityLookup, ruleData, proficiencyBonus) {
    if (!limitedUse) {
        return true;
    }
    const maxUses = deriveMaxUses(limitedUse, abilityLookup, ruleData, proficiencyBonus);
    const numberUsed = getNumberUsed(limitedUse);
    if (numberUsed < maxUses) {
        return true;
    }
    return false;
}
