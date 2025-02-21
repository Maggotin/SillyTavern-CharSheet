import { keyBy } from 'lodash';
import { SpeedMovementKeyEnum, WeightSpeedTypeEnum } from '../../Core';
import { ModifierDerivers, ModifierValidators } from '../../Modifier';
import { RaceAccessors } from '../../Race';
import { RuleDataUtils } from '../../RuleData';
/**
 *
 * @param speedMovementKey
 * @param baseWeightSpeedLookup
 * @param weightSpeedType
 * @param mirrorSpeed
 * @param armorSpeedAdjustment
 * @param modifiers
 * @param customSpeedLookup
 * @param equippedArmor
 */
export function generateSpeedInfoByKey(speedMovementKey, baseWeightSpeedLookup, weightSpeedType, mirrorSpeed, armorSpeedAdjustment, modifiers, customSpeedLookup, equippedArmor) {
    if (baseWeightSpeedLookup === null) {
        return null;
    }
    const speedReductionRemoveModifiers = modifiers.filter((modifier) => ModifierValidators.isSpeedReductionRemoveModifier(modifier));
    const hasSpeedReductionRemove = speedReductionRemoveModifiers.length > 0;
    // set up initial speed
    let finalSpeed = baseWeightSpeedLookup[speedMovementKey];
    // calc based on standard modifiers
    const setModifiers = modifiers.filter((modifier) => ModifierValidators.isValidSetSpeedModifier(modifier, speedMovementKey));
    if (setModifiers.length) {
        finalSpeed = ModifierDerivers.deriveHighestModifierValue(setModifiers);
    }
    else {
        const innateSetModifiers = modifiers.filter((modifier) => ModifierValidators.isValidSetInnateSpeedModifier(modifier, speedMovementKey));
        let baseMovementSpeed = baseWeightSpeedLookup[speedMovementKey];
        if (baseMovementSpeed === null) {
            baseMovementSpeed = 0;
        }
        const baseSpeed = Math.max(baseMovementSpeed, ModifierDerivers.deriveHighestModifierValue(innateSetModifiers));
        if (baseSpeed === 0) {
            finalSpeed = baseSpeed;
        }
        else {
            const speedAdjustmentModifiers = modifiers.filter((modifier) => ModifierValidators.isValidBonusSpeedModifier(modifier, speedMovementKey));
            const speedAdjustmentModifierTotal = ModifierDerivers.sumModifiers(speedAdjustmentModifiers);
            let unarmoredBonus = 0;
            if (!equippedArmor) {
                const unarmoredBonusModifiers = modifiers.filter((modifier) => ModifierValidators.isBonusUnarmoredMovementModifier(modifier));
                unarmoredBonus = ModifierDerivers.sumModifiers(unarmoredBonusModifiers);
            }
            finalSpeed = baseSpeed + speedAdjustmentModifierTotal + armorSpeedAdjustment + unarmoredBonus;
        }
    }
    // check if there are any speed reductions
    if (!hasSpeedReductionRemove && finalSpeed !== 0) {
        let speed = finalSpeed;
        if (weightSpeedType === WeightSpeedTypeEnum.ENCUMBERED) {
            speed -= 10;
        }
        else if (weightSpeedType === WeightSpeedTypeEnum.HEAVILY_ENCUMBERED) {
            speed -= 20;
        }
        finalSpeed = Math.max(0, speed);
    }
    // check for custom speed overrides
    const movementId = RuleDataUtils.getMovementTypeBySpeedMovementKey(speedMovementKey);
    if (movementId !== null) {
        const speed = customSpeedLookup[movementId];
        if (speed && speed.distance !== null) {
            finalSpeed = speed.distance;
        }
    }
    // Have to do another pass to check if any of the speed set modifiers are null, if so use the mirror speed (most likely walking)
    if (mirrorSpeed !== null) {
        const speedSetModifiers = modifiers.filter((modifier) => ModifierValidators.isValidSetInnateSpeedModifier(modifier, speedMovementKey));
        const nullSpeedSetModifiers = speedSetModifiers.filter((modifier) => ModifierDerivers.deriveFixedModifierValue(modifier, null) === null);
        if (nullSpeedSetModifiers.length) {
            finalSpeed = mirrorSpeed;
        }
    }
    return finalSpeed;
}
/**
 *
 * @param weightSpeeds
 * @param weightSpeedType
 * @param armorSpeedAdjustment
 * @param modifiers
 * @param customSpeedLookup
 * @param equippedArmor
 */
export function generateSpeedInfo(weightSpeeds, weightSpeedType, armorSpeedAdjustment, modifiers, customSpeedLookup, equippedArmor) {
    const baseWeightSpeedLookup = weightSpeeds ? weightSpeeds[WeightSpeedTypeEnum.NORMAL] : null;
    const walkingSpeed = generateSpeedInfoByKey(SpeedMovementKeyEnum.WALK, baseWeightSpeedLookup, weightSpeedType, null, armorSpeedAdjustment, modifiers, customSpeedLookup, equippedArmor);
    return {
        [SpeedMovementKeyEnum.WALK]: walkingSpeed,
        [SpeedMovementKeyEnum.FLY]: generateSpeedInfoByKey(SpeedMovementKeyEnum.FLY, baseWeightSpeedLookup, weightSpeedType, walkingSpeed, armorSpeedAdjustment, modifiers, customSpeedLookup, equippedArmor),
        [SpeedMovementKeyEnum.CLIMB]: generateSpeedInfoByKey(SpeedMovementKeyEnum.CLIMB, baseWeightSpeedLookup, weightSpeedType, walkingSpeed, armorSpeedAdjustment, modifiers, customSpeedLookup, equippedArmor),
        [SpeedMovementKeyEnum.BURROW]: generateSpeedInfoByKey(SpeedMovementKeyEnum.BURROW, baseWeightSpeedLookup, weightSpeedType, walkingSpeed, armorSpeedAdjustment, modifiers, customSpeedLookup, equippedArmor),
        [SpeedMovementKeyEnum.SWIM]: generateSpeedInfoByKey(SpeedMovementKeyEnum.SWIM, baseWeightSpeedLookup, weightSpeedType, walkingSpeed, armorSpeedAdjustment, modifiers, customSpeedLookup, equippedArmor),
    };
}
/**
 *
 * @param speedInfo
 * @param customSpeedLookup
 * @param ruleData
 */
export function generateSpeeds(speedInfo, customSpeedLookup, ruleData) {
    return Object.keys(speedInfo).map((movementKey, idx) => {
        const movementAmount = speedInfo[movementKey];
        let source = '';
        const movementType = RuleDataUtils.getMovementTypeBySpeedMovementKey(movementKey);
        if (movementType && customSpeedLookup[movementType]) {
            source = customSpeedLookup[movementType].source;
        }
        return {
            distance: movementAmount,
            type: movementType,
            source,
            name: RuleDataUtils.getMovementDescription(movementType, ruleData),
        };
    });
}
/**
 *
 * @param race
 */
export function generateWeightSpeeds(race) {
    if (race === null) {
        return null;
    }
    return RaceAccessors.getWeightSpeeds(race);
}
/**
 *
 * @param speeds
 */
export function generateCustomSpeedLookup(speeds) {
    return keyBy(speeds, 'movementId');
}
