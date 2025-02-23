import sortBy from 'lodash/sortBy';
import { CreatureAccessors, CreatureUtils } from '../Creature';
import { RuleDataUtils } from '../RuleData';
import { VehicleAccessors, VehicleConfigurationKeyEnum, VehicleUtils } from '../Vehicle';
import { VehicleComponentAccessors } from '../VehicleComponent';
/**
 *
 * @param creature
 */
export function deriveCreatureArmorClassInfo(creature) {
    return {
        value: CreatureAccessors.getArmorClass(creature),
        showTooltip: false,
    };
}
/**
 *
 * @param creature
 */
export function deriveCreatureHitPointInfo(creature) {
    return {
        data: CreatureAccessors.getHitPointInfo(creature),
        showTooltip: false,
    };
}
/**
 *
 * @param creature
 * @param ruleData
 */
export function deriveCreatureMovementInfo(creature, ruleData) {
    let highestMovementInfo = CreatureUtils.getHighestMovementInfo(creature);
    let data = null;
    let label = null;
    if (highestMovementInfo) {
        data = highestMovementInfo;
        label = RuleDataUtils.getMovementDescription(highestMovementInfo.movementId, ruleData);
    }
    return {
        data,
        label,
        showTooltip: false,
    };
}
/**
 *
 * @param vehicle
 */
export function deriveVehiclePrimaryArmorClassInfo(vehicle) {
    const allComponents = VehicleAccessors.getAllComponentsData(vehicle);
    const primaryComponent = VehicleAccessors.getPrimaryComponent(vehicle);
    let value = null;
    let showTooltip = true;
    if (primaryComponent) {
        showTooltip = allComponents.length !== 1;
        const armorClassInfo = VehicleComponentAccessors.getArmorClassInfo(primaryComponent);
        value = armorClassInfo.base;
        if (armorClassInfo.moving !== null) {
            value = armorClassInfo.moving;
            showTooltip = armorClassInfo.moving !== armorClassInfo.base;
        }
    }
    return {
        value,
        showTooltip,
    };
}
/**
 *
 * @param vehicle
 */
export function deriveVehiclePrimaryHitPointInfo(vehicle) {
    const allComponents = VehicleAccessors.getAllComponentsData(vehicle);
    let showTooltip = false;
    if (VehicleUtils.getConfigurationValue(VehicleConfigurationKeyEnum.ENABLE_COMPONENT_HIT_POINTS, vehicle)) {
        let count = 0;
        allComponents.forEach((component) => {
            if (count > 1) {
                return;
            }
            const hitPointInfo = VehicleComponentAccessors.getHitPointInfo(component);
            if (hitPointInfo !== null) {
                count += 1;
            }
        });
        showTooltip = count > 1;
    }
    const primaryComponent = VehicleAccessors.getPrimaryComponent(vehicle);
    return {
        data: VehicleComponentAccessors.getHitPointInfo(primaryComponent),
        showTooltip,
    };
}
/**
 *
 * @param vehicle
 * @param ruleData
 */
export function deriveVehicleMovementInfo(vehicle, ruleData) {
    let allSpeeds = [];
    VehicleAccessors.getAllComponentsData(vehicle).forEach((component) => {
        const speedInfos = VehicleComponentAccessors.getSpeedInfos(component);
        if (speedInfos.length > 0) {
            allSpeeds.push(...speedInfos);
        }
    });
    let allModes = [];
    allSpeeds.forEach((speedInfo) => {
        if (speedInfo.modes !== null) {
            speedInfo.modes.forEach((mode) => {
                allModes.push(Object.assign(Object.assign({}, mode), { type: speedInfo.type }));
            });
        }
    });
    let highestMovementInfo = sortBy(allModes, [
        (mode) => !mode.restrictionsText,
        (mode) => !mode.description,
        (mode) => mode.value,
    ]).pop();
    let showTooltip = true;
    let data = null;
    let label = null;
    if (highestMovementInfo) {
        if (allModes.length === 1 && !highestMovementInfo.restrictionsText && !highestMovementInfo.description) {
            showTooltip = false;
        }
        data = {
            movementId: highestMovementInfo.type,
            speed: highestMovementInfo.value,
            notes: '',
        };
        label = highestMovementInfo.type
            ? RuleDataUtils.getVehicleMovementName(highestMovementInfo.type, ruleData)
            : null;
    }
    return {
        data,
        label,
        showTooltip,
    };
}
/**
 *
 * @param creature
 * @param ruleData
 */
export function deriveCreatureFilterTypes(creature, ruleData) {
    let filterTypes = [];
    const name = RuleDataUtils.getMonsterTypeName(CreatureAccessors.getTypeId(creature), ruleData);
    if (name) {
        filterTypes.push(name);
    }
    return filterTypes;
}
