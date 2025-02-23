import { ModifierValidators } from '../../Modifier';
import { RuleDataAccessors } from '../../RuleData';
import { DeathCauseEnum } from '../constants';
import { deriveAdvantageDeathSavesAdjustments, deriveDisadvantageDeathSavesAdjustments } from '../derivers';
/**
 *
 * @param deathSaves
 * @param modifiers
 * @param ruleData
 */
export function generateDeathCause(deathSaves, modifiers, ruleData) {
    const maxDeathsavesFail = RuleDataAccessors.getMaxDeathsavesFail(ruleData);
    if (deathSaves !== null && deathSaves.failCount !== null && deathSaves.failCount >= maxDeathsavesFail) {
        return DeathCauseEnum.DEATHSAVES;
    }
    if (modifiers.find((modifier) => ModifierValidators.isSetDeathModifier(modifier))) {
        return DeathCauseEnum.CONDITION;
    }
    return DeathCauseEnum.NONE;
}
/**
 *
 * @param deathCause
 */
export function generateIsDead(deathCause) {
    return deathCause !== DeathCauseEnum.NONE;
}
/**
 *
 * @param deathSaveContract
 * @param modifiers
 */
export function generateDeathSaveInfo(deathSaveContract, modifiers) {
    return {
        failCount: deathSaveContract !== null && deathSaveContract.failCount !== null ? deathSaveContract.failCount : 0,
        successCount: deathSaveContract !== null && deathSaveContract.successCount !== null ? deathSaveContract.successCount : 0,
        isStabilized: deathSaveContract === null ? false : deathSaveContract.isStabilized,
        advantageAdjustments: deriveAdvantageDeathSavesAdjustments(modifiers),
        disadvantageAdjustments: deriveDisadvantageDeathSavesAdjustments(modifiers),
    };
}
