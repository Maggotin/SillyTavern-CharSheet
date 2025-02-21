import { sortBy } from 'lodash';
import { TypeScriptUtils } from '../../utils';
import { AbilityUtils } from '../Ability';
import { AccessTypeEnum } from '../Access';
import { ProficiencyLevelEnum } from '../Core';
import { DefinitionUtils } from '../Definition';
import { DefinitionPoolUtils } from '../DefinitionPool';
import { HelperUtils } from '../Helper';
import { RuleDataAccessors, RuleDataUtils } from '../RuleData';
import { VehicleComponentAccessors } from '../VehicleComponent';
import { getAllComponentsData, getConditionImmunities, getCreatureCapacity, getDamageImmunities, getDefinitionActions, getDefinitionKey, getDefinitionStats, getDescription, getLength, getType, getWeight, getWidth, } from './accessors';
import { VehicleComponentGroupTypeEnum, VehicleConfigurationDisplayTypeEnum, VehicleConfigurationKeyEnum, VehicleConfigurationSizeTypeEnum, } from './constants';
import { generateVehicleAction } from './generators';
import { getConfigurationValue } from './utils';
/**
 *
 * @param vehicleDefinition
 * @param ruleData
 */
export function deriveStats(vehicleDefinition, ruleData) {
    if (vehicleDefinition.stats === null) {
        return [];
    }
    return vehicleDefinition.stats.map((stat) => {
        const score = stat.value;
        return {
            id: stat.id,
            score,
            statKey: stat.name,
            modifier: score === null ? null : AbilityUtils.getStatScoreModifier(score, ruleData),
        };
    });
}
/**
 *
 * @param vehicle
 * @param ruleData
 */
export function deriveAbilities(vehicle, ruleData) {
    const stats = getDefinitionStats(vehicle);
    return stats.map((stat) => {
        const score = stat.value;
        const name = stat.name ? stat.name : '';
        const statScoreModifier = score === null ? null : AbilityUtils.getStatScoreModifier(score, ruleData);
        return {
            label: name,
            id: stat.id,
            entityTypeId: -1,
            name,
            statKey: name,
            totalScore: score,
            score,
            maxStatScore: RuleDataAccessors.getMaxStatScore(ruleData),
            isMaxed: !!score && score >= RuleDataAccessors.getMaxStatScore(ruleData),
            modifier: statScoreModifier,
            baseScore: score,
            racialBonus: 0,
            classBonuses: 0,
            miscBonus: 0,
            setScore: 0,
            stackingBonus: 0,
            otherBonus: 0,
            overrideScore: null,
            proficiency: false,
            proficiencyLevel: ProficiencyLevelEnum.NONE,
            isSaveProficiencyModified: false,
            isSaveModifierModified: false,
            save: statScoreModifier ? statScoreModifier : 0,
            saveBonuses: 0,
            isSaveOverridden: false,
            allStatBonusSuppliers: [],
            statSetScoreSuppliers: [],
            statMaxBonusSuppliers: [],
            stackingBonusSuppliers: [],
        };
    });
}
/**
 *
 * @param vehicle
 * @param ruleData
 */
export function deriveCreatureCapacityDescriptions(vehicle, ruleData) {
    const creatureCapacityInfos = getCreatureCapacity(vehicle);
    const descriptions = creatureCapacityInfos.map((capacity) => {
        var _a;
        let sizeName = '';
        if (capacity.sizeId !== null) {
            const sizeInfo = RuleDataUtils.getCreatureSizeInfo(capacity.sizeId, ruleData);
            if (sizeInfo && sizeInfo.name) {
                sizeName = sizeInfo.name;
            }
        }
        const isSpelljammer = getConfigurationValue(VehicleConfigurationKeyEnum.DISPLAY_TYPE, vehicle) ===
            VehicleConfigurationDisplayTypeEnum.SPELLJAMMER;
        const needsParens = isSpelljammer && capacity.type !== null;
        return `${capacity.capacity} ${sizeName} ${needsParens ? '(' : ''}${(_a = capacity.type) !== null && _a !== void 0 ? _a : ''}${needsParens ? ')' : ''}`.trim();
    });
    return descriptions;
}
/**
 *
 * @param abilityLookup
 */
export function deriveModifierData(abilityLookup) {
    return {
        proficiencyBonus: 0,
        abilityLookup,
        attunedItemCount: 0,
    };
}
/**
 *
 * @param vehicle
 * @param ruleData
 */
export function deriveDamageImmunities(vehicle, ruleData) {
    return getDamageImmunities(vehicle)
        .map((damageImmunityId) => RuleDataUtils.getDamageType(damageImmunityId, ruleData))
        .filter(TypeScriptUtils.isNotNullOrUndefined);
}
/**
 *
 * @param vehicle
 * @param ruleData
 */
export function deriveConditionImmunities(vehicle, ruleData) {
    return getConditionImmunities(vehicle)
        .map((conditionId) => RuleDataUtils.getCondition(conditionId, ruleData))
        .filter(TypeScriptUtils.isNotNullOrUndefined);
}
/**
 *
 * @param vehicle
 * @param ruleData
 */
export function deriveSizeId(vehicle, ruleData) {
    const sizeType = getConfigurationValue(VehicleConfigurationKeyEnum.SIZE_TYPE, vehicle);
    let ranges = [];
    let value = null;
    switch (sizeType) {
        case VehicleConfigurationSizeTypeEnum.WEIGHT:
            ranges = sortBy(RuleDataAccessors.getVehicleWeightRanges(ruleData), (range) => range.minSize);
            value = getWeight(vehicle);
            break;
        case VehicleConfigurationSizeTypeEnum.DIMENSION:
            ranges = sortBy(RuleDataAccessors.getVehicleDimensionRanges(ruleData), (range) => range.minSize);
            const dimensions = [];
            const width = getWidth(vehicle);
            if (width !== null) {
                dimensions.push(width);
            }
            const length = getLength(vehicle);
            if (length !== null) {
                dimensions.push(length);
            }
            value = dimensions.length > 0 ? Math.max(...dimensions) : null;
            break;
        default:
        // not implemented
    }
    let sizeId = null;
    if (value !== null && ranges.length > 0) {
        const compareValue = value;
        ranges.forEach((range) => {
            if (compareValue >= range.minSize) {
                sizeId = range.sizeId;
            }
        });
    }
    return sizeId;
}
/**
 *
 * @param vehicle
 * @param ruleData
 */
export function deriveSizeInfo(vehicle, ruleData) {
    const sizeId = deriveSizeId(vehicle, ruleData);
    if (sizeId === null) {
        return null;
    }
    return RuleDataUtils.getCreatureSizeInfo(sizeId, ruleData);
}
/**
 *
 * @param vehicle
 */
export function deriveNotes(vehicle) {
    const description = getDescription(vehicle);
    if (!description) {
        return description;
    }
    return null;
}
/**
 *
 * @param vehicle
 * @param ruleData
 */
export function deriveObjectTypeInfo(vehicle, ruleData) {
    const type = getType(vehicle);
    if (type === null) {
        return null;
    }
    return RuleDataUtils.getObjectTypeInfo(type, ruleData);
}
/**
 *
 * @param vehicle
 */
export function deriveMovementKeys(vehicle) {
    const movementKeys = [];
    getAllComponentsData(vehicle).forEach((component) => {
        VehicleComponentAccessors.getSpeedInfos(component).forEach((speed) => {
            if (speed.type && !movementKeys.includes(speed.type)) {
                movementKeys.push(speed.type);
            }
        });
    });
    return movementKeys;
}
/**
 *
 * @param vehicle
 * @param ruleData
 */
export function deriveMovementNames(vehicle, ruleData) {
    return deriveMovementKeys(vehicle)
        .map((typeKey) => RuleDataUtils.getVehicleMovementName(typeKey, ruleData))
        .filter(TypeScriptUtils.isNotNullOrUndefined);
}
/**
 *
 * @param vehicle
 */
export function deriveDefinitionId(vehicle) {
    const definitionKey = getDefinitionKey(vehicle);
    if (!definitionKey) {
        return null;
    }
    return DefinitionUtils.getDefinitionKeyId(definitionKey);
}
/**
 *
 * @param vehicle
 * @param definitionPool
 */
export function deriveAccessType(vehicle, definitionPool) {
    let accessType = AccessTypeEnum.NO_ACCESS;
    const definitionKey = getDefinitionKey(vehicle);
    if (definitionKey !== null) {
        accessType = DefinitionPoolUtils.getDefinitionAccessType(definitionKey, definitionPool);
    }
    return accessType;
}
/**
 *
 * @param configurationLookup
 * @param configurationKey
 * @param defaultValue
 */
export function deriveConfigurationValueLookupValue(configurationLookup, configurationKey, defaultValue) {
    const configurationInfo = HelperUtils.lookupDataOrFallback(configurationLookup, configurationKey);
    if (configurationInfo !== null) {
        return configurationInfo.value;
    }
    return defaultValue;
}
/**
 *
 * @param components
 */
export function deriveComponentListsByGroupType(components) {
    const componentTypes = [];
    const actionStationsTypes = [];
    components.forEach((component) => {
        const groupType = VehicleComponentAccessors.getGroupType(component);
        switch (groupType) {
            case VehicleComponentGroupTypeEnum.COMPONENT:
                componentTypes.push(component);
                break;
            case VehicleComponentGroupTypeEnum.ACTION_STATION:
                actionStationsTypes.push(component);
                break;
            default:
            // not implemented
        }
    });
    return {
        components: componentTypes,
        actionStations: actionStationsTypes,
    };
}
/**
 *
 * @param vehicle
 * @param ruleData
 */
export function deriveActions(vehicle, ruleData) {
    return getDefinitionActions(vehicle).map((actionContract) => generateVehicleAction(vehicle, actionContract, ruleData));
}
