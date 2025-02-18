import { TypeScriptUtils } from '../../utils';
import { AbilityStatEnum } from '../Core';
import { HelperUtils } from '../Helper';
import { RuleDataUtils } from '../RuleData';
import { VehicleAccessors, VehicleUtils } from '../Vehicle';
import { VehicleConfigurationKeyEnum, VehicleGenerators } from '../Vehicle';
import { getArmorClass, getArmorClassDescription, getDefinitionActions, getDefinitionSpeeds, getHitPoints, getRemovedHitPoints, getTypes, } from './accessors';
import { ComponentAdjustmentEnum } from './constants';
/**
 *
 * @param component
 * @param vehicle
 */
export function deriveArmorClassInfo(component, vehicle) {
    const enableMotionlessArmorClass = VehicleUtils.getConfigurationValue(VehicleConfigurationKeyEnum.ENABLE_COMPONENT_ARMOR_CLASS_MOTIONLESS, vehicle);
    const armorClass = getArmorClass(component);
    let movingArmorClass = null;
    if (enableMotionlessArmorClass && armorClass !== null) {
        const dexScore = HelperUtils.lookupDataOrFallback(VehicleAccessors.getStatLookup(vehicle), AbilityStatEnum.DEXTERITY);
        let dexModifier = 0;
        if (dexScore !== null && dexScore.modifier !== null) {
            dexModifier = dexScore.modifier;
        }
        movingArmorClass = armorClass + dexModifier;
    }
    return {
        base: armorClass,
        moving: movingArmorClass,
        description: getArmorClassDescription(component),
    };
}
/**
 *
 * @param component
 * @param ruleData
 */
export function deriveTypeNames(component, ruleData) {
    return getTypes(component)
        .map((type) => {
        if (type.type === null) {
            return null;
        }
        return RuleDataUtils.getComponentTypeName(type.type, ruleData);
    })
        .filter(TypeScriptUtils.isNotNullOrUndefined);
}
/**
 *
 * @param component
 * @param ruleData
 */
export function deriveSpeedInfos(component, ruleData) {
    return getDefinitionSpeeds(component).map((speedInfo) => {
        if (speedInfo.modes === null) {
            return speedInfo;
        }
        const modes = speedInfo.modes.map((mode) => {
            const movementInfo = mode.movementId === null ? null : RuleDataUtils.getMovementInfo(mode.movementId, ruleData);
            return Object.assign(Object.assign({}, mode), { movementInfo });
        });
        return Object.assign(Object.assign({}, speedInfo), { modes });
    });
}
/**
 *
 * @param component
 */
export function deriveHitPointInfo(component) {
    const hitPoints = getHitPoints(component);
    if (hitPoints === null) {
        return null;
    }
    const removedHp = getRemovedHitPoints(component);
    return {
        baseHp: hitPoints,
        bonusHp: null,
        overrideHp: null,
        remainingHp: hitPoints - removedHp,
        removedHp,
        tempHp: null,
        totalHp: hitPoints,
    };
}
/**
 *
 * @param component
 */
export function deriveHitPointSpeedAdjustments(component) {
    const adjustments = [];
    getTypes(component).forEach((type) => {
        if (type.adjustments) {
            type.adjustments.forEach((adjustment) => {
                if (adjustment.type && adjustment.type === ComponentAdjustmentEnum.HIT_POINT_SPEED_ADJUSTMENT) {
                    if (adjustment.values) {
                        adjustments.push(...adjustment.values);
                    }
                }
            });
        }
    });
    return adjustments;
}
/**
 *
 * @param component
 * @param ruleData
 * @param vehicle
 */
export function deriveActions(component, ruleData, vehicle) {
    return getDefinitionActions(component).map((actionContract) => VehicleGenerators.generateVehicleAction(vehicle, actionContract, ruleData));
}
