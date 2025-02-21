import { groupBy, orderBy } from 'lodash';
import { CreatureAccessors, CreatureNotes, CreatureUtils } from '../Creature';
import { RuleDataUtils } from '../RuleData';
import { VehicleAccessors, VehicleNotes } from '../Vehicle';
import { getGroupId } from './accessors';
import { ExtraGroupTypeEnum, ExtraTypeEnum } from './constants';
import { deriveCreatureArmorClassInfo, deriveCreatureFilterTypes, deriveCreatureHitPointInfo, deriveCreatureMovementInfo, deriveVehicleMovementInfo, deriveVehiclePrimaryArmorClassInfo, deriveVehiclePrimaryHitPointInfo, } from './derivers';
/**
 *
 * @param creatures
 * @param vehicles
 * @param ruleData
 */
export function generateExtras(creatures, vehicles, ruleData) {
    let creatureExtras = creatures.map((creature) => generateCreatureExtra(creature, ruleData));
    let vehicleExtras = vehicles.map((vehicle) => generateVehicleExtra(vehicle, ruleData));
    return [...creatureExtras, ...vehicleExtras];
}
/**
 *
 * @param creature
 * @param ruleData
 */
export function generateCreatureExtra(creature, ruleData) {
    return {
        extraType: ExtraTypeEnum.CREATURE,
        key: CreatureAccessors.getUniqueKey(creature),
        entityTypeId: CreatureAccessors.getEntityTypeId(creature),
        avatarUrl: CreatureAccessors.getAvatarUrl(creature),
        name: CreatureAccessors.getName(creature),
        armorClassInfo: deriveCreatureArmorClassInfo(creature),
        movementNames: CreatureAccessors.getMovementNames(creature),
        movementInfo: deriveCreatureMovementInfo(creature, ruleData),
        isActive: CreatureAccessors.isActive(creature),
        isCustomized: CreatureAccessors.isCustomized(creature),
        isHomebrew: CreatureAccessors.isHomebrew(creature),
        sizeId: CreatureAccessors.getSizeId(creature),
        sizeInfo: RuleDataUtils.getCreatureSizeInfo(CreatureAccessors.getSizeId(creature), ruleData),
        type: CreatureUtils.getTypeName(creature, ruleData),
        hitPointInfo: deriveCreatureHitPointInfo(creature),
        noteComponents: CreatureNotes.getNoteComponents(creature, ruleData),
        searchTags: CreatureUtils.getSearchTags(creature),
        tags: CreatureAccessors.getTags(creature),
        mappingId: CreatureAccessors.getMappingId(creature),
        id: CreatureAccessors.getId(creature),
        groupId: CreatureAccessors.getGroupId(creature),
        environments: CreatureAccessors.getEnvironments(creature),
        filterTypes: deriveCreatureFilterTypes(creature, ruleData),
        sources: CreatureAccessors.getSources(creature),
        metaText: generateCreatureMeta(creature, ruleData),
    };
}
/**
 *
 * @param vehicle
 * @param ruleData
 */
export function generateVehicleExtra(vehicle, ruleData) {
    return {
        extraType: ExtraTypeEnum.VEHICLE,
        key: VehicleAccessors.getUniqueKey(vehicle),
        entityTypeId: -1,
        avatarUrl: VehicleAccessors.getAvatarUrl(vehicle),
        name: VehicleAccessors.getName(vehicle),
        armorClassInfo: deriveVehiclePrimaryArmorClassInfo(vehicle),
        movementNames: VehicleAccessors.getMovementNames(vehicle),
        movementInfo: deriveVehicleMovementInfo(vehicle, ruleData),
        isActive: null,
        isCustomized: false,
        isHomebrew: false,
        sizeId: VehicleAccessors.getSizeId(vehicle),
        sizeInfo: VehicleAccessors.getSizeInfo(vehicle),
        type: VehicleAccessors.getTypeName(vehicle),
        hitPointInfo: deriveVehiclePrimaryHitPointInfo(vehicle),
        noteComponents: VehicleNotes.getNoteComponents(vehicle, ruleData),
        searchTags: VehicleAccessors.getSearchTags(vehicle),
        tags: [],
        mappingId: VehicleAccessors.getMappingId(vehicle),
        id: VehicleAccessors.getId(vehicle),
        groupId: ExtraGroupTypeEnum.VEHICLE,
        environments: [],
        filterTypes: VehicleAccessors.getMovementNames(vehicle).map((name) => `Vehicle - ${name}`),
        sources: VehicleAccessors.getSources(vehicle),
        metaText: generateVehicleMeta(vehicle, ruleData),
    };
}
/**
 *
 * @param creature
 * @param ruleData
 */
export function generateCreatureMeta(creature, ruleData) {
    let metaItems = [];
    const sizeInfo = RuleDataUtils.getCreatureSizeInfo(CreatureAccessors.getSizeId(creature), ruleData);
    let size = '';
    if (sizeInfo && sizeInfo.name !== null) {
        size = sizeInfo.name;
    }
    let type = CreatureUtils.getTypeName(creature, ruleData);
    let extraTextChunks = [];
    let subTypes = CreatureAccessors.getSubTypes(creature);
    subTypes.forEach((monsterInfo) => {
        if (monsterInfo.name !== null) {
            extraTextChunks.push(monsterInfo.name);
        }
    });
    let extraText = extraTextChunks.join(', ');
    metaItems.push(`${size} ${type}${extraText ? ` (${extraText})` : ''}`.trim());
    let envTags = CreatureAccessors.getEnvironmentTags(creature);
    metaItems.push(envTags.join(', '));
    return metaItems.filter((metaItem) => metaItem);
}
/**
 *
 * @param vehicle
 * @param ruleData
 */
export function generateVehicleMeta(vehicle, ruleData) {
    let metaText = [];
    const sizeInfo = VehicleAccessors.getSizeInfo(vehicle);
    let size = '';
    if (sizeInfo && sizeInfo.name !== null) {
        size = sizeInfo.name;
    }
    let type = VehicleAccessors.getType(vehicle);
    let typeName = type === null ? '' : RuleDataUtils.getObjectTypeName(type, ruleData);
    typeName = typeName ? typeName.toLowerCase() : '';
    let primaryText = `${size} ${typeName}`.trim();
    let movementTypesText = VehicleAccessors.getMovementNames(vehicle).join(', ');
    metaText.push(`${primaryText}${movementTypesText ? ` (${movementTypesText})` : ''}`.trim());
    return metaText;
}
export function generateGroups(extras) {
    return groupBy(extras, (extra) => getGroupId(extra));
}
export function generateCurrentExtraGroupInfos(extras, ruleData) {
    let groups = generateGroups(extras);
    let groupIds = Object.keys(groups);
    let groupInfos = [];
    groupIds.forEach((groupId) => {
        let groupInfo = null;
        if (groupId === ExtraGroupTypeEnum.VEHICLE) {
            groupInfo = {
                isPrimary: false,
                name: 'Vehicle',
                id: groupId,
            };
        }
        else {
            const creatureGroupInfo = RuleDataUtils.getCreatureGroupInfo(parseInt(groupId), ruleData);
            if (creatureGroupInfo) {
                groupInfo = creatureGroupInfo;
            }
        }
        if (groupInfo) {
            groupInfos.push(groupInfo);
        }
    });
    return orderBy(groupInfos, [(extraGroup) => extraGroup.isPrimary, (extraGroup) => extraGroup.name], ['desc']);
}
