import {
  Constants,
  RuleData,
  Vehicle,
  VehicleComponent,
  VehicleComponentUtils,
  VehicleManager,
  VehicleUtils,
} from "@dndbeyond/character-rules-engine/es";

import {
  deriveEnableComponentManagement,
  deriveVehicleBlockActionsActions,
  deriveVehicleBlockComponentHitPointInfoProps,
  deriveVehicleComponentActionsProps,
  deriveVehicleComponentArmorClassInfo,
  deriveVehicleComponentCoverTypeProp,
  deriveVehicleComponentPrimaryPropertiesProps,
  deriveVehicleComponentRequiredCrew,
  deriveVehicleComponentSpeedInfos,
} from "./derivers";
import {
  GD_VehicleBlockActionsProps,
  GD_VehicleBlockActionStationListProps,
  GD_VehicleBlockActionStationProps,
  GD_VehicleBlockActionSummariesProps,
  GD_VehicleBlockComponentListProps,
  GD_VehicleBlockComponentProps,
  GD_VehicleBlockFeaturesProps,
  GD_VehicleBlockHeaderProps,
  GD_VehicleBlockPrimaryComponentProps,
  GD_VehicleBlockPrimaryProps,
  GD_VehicleBlockProps,
  GD_VehicleBlockShellProps,
} from "./typings";

/**
 *
 * @param vehicle
 * @param ruleData
 */
export function generateVehicleBlockProps(
  vehicle: VehicleManager
): GD_VehicleBlockProps {
  return {
    shellProps: generateVehicleShellProps(vehicle),
    headerProps: generateVehicleBlockHeaderProps(vehicle),
    primaryProps: generateVehicleBlockPrimaryProps(vehicle),
    actionSummariesProps: vehicle.generateVehicleActionsSummaries(),
    featuresProps: generateVehicleFeaturesProps(vehicle),
    actionStationsProps: generateVehicleBlockActionStationListProps(vehicle),
    componentsProps: generateVehicleBlockComponentListProps(vehicle),
    actionsProps: vehicle.generateVehicleBlockActionsInfo(),
  };
}

/**
 *
 * @param vehicle
 */
export function generateVehicleShellProps(
  vehicle: VehicleManager
): GD_VehicleBlockShellProps {
  return {
    displayType: vehicle.getDisplayType(),
  };
}

/**
 *
 * @param vehicle
 * @param ruleData
 */
export function generateVehicleBlockHeaderProps(
  vehicle: VehicleManager
): GD_VehicleBlockHeaderProps {
  return {
    name: vehicle.getName(),
    typeName: vehicle.getVehicleTypeName(),
    displayType: vehicle.getDisplayType(),
    weight: vehicle.getWeight(),
    length: vehicle.getLength(),
    width: vehicle.getWidth(),
    sizeName: vehicle.getVehicleSizeName(),
  };
}

/**
 *
 * @param vehicle
 */
export function generateVehicleBlockPrimaryProps(
  vehicle: VehicleManager
): GD_VehicleBlockPrimaryProps {
  return {
    cargoCapacityInfo: vehicle.getVehicleCargoCapacityInfo(),
    conditionImmunities: vehicle.generateVehicleConditionImmunityNames(),
    creatureCapacityDescriptions: vehicle.getCreatureCapacityDescriptions(),
    damageImmunities: vehicle.generateVehicleDamageImmunityNames(),
    displayType: vehicle.getDisplayType(),
    primaryProperties: deriveVehicleComponentPrimaryPropertiesProps(vehicle),
    stats: vehicle.getStats(),
    travelPaceInfo: vehicle.generateVehicleComponentTravelPaceInfo(),
  };
}

/**
 *
 * @param vehicle
 * @param ruleData
 */
export function generateVehicleBlockActionSummariesProps(
  vehicle: VehicleManager,
  ruleData: RuleData
): GD_VehicleBlockActionSummariesProps {
  return {
    actionsText: vehicle.getActionsText(),
    actionsSummaries: vehicle.generateVehicleBlockActionsSummaries(),
  };
}

/**
 *
 * @param vehicle
 */
export function generateVehicleFeaturesProps(
  vehicle: VehicleManager
): GD_VehicleBlockFeaturesProps {
  return {
    features: vehicle.generateFeatures(),
  };
}

/**
 *
 * @param vehicle
 * @param ruleData
 */
export function generateVehicleBlockActionStationListProps(
  vehicle: VehicleManager
): GD_VehicleBlockActionStationListProps {
  const enableActionStations = vehicle.getEnableActionStations();

  return {
    actionStations: enableActionStations
      ? vehicle.generateVehicleActionStationsInfo()
      : [],
  };
}

/**
 *
 * @param station
 * @param vehicle
 * @param ruleData
 */
export function generateVehicleActionStationProps(
  station: VehicleComponent,
  vehicle: Vehicle,
  ruleData: RuleData
): GD_VehicleBlockActionStationProps {
  //share componentProps for now.
  return generateVehicleBlockComponentProps(station, vehicle, ruleData);
}

/**
 *
 * @param vehicle
 */
export function generateVehiclePrimaryComponentProps(
  vehicle: VehicleManager
): GD_VehicleBlockPrimaryComponentProps | null {
  const primaryComponent = vehicle.getPrimaryComponent();

  if (primaryComponent === null) {
    return null;
  }

  return {
    armorClassInfo: primaryComponent.getArmorClassInfo(),
    hitPointInfo: vehicle.generateVehicleBlockPrimaryHitPointInfo(),
    speedInfos: primaryComponent.getSpeedInfos(),
    costInfos: primaryComponent.getCosts(),
    displayType: vehicle.getDisplayType(),
    width: vehicle.getWidth(),
    length: vehicle.getLength(),
    isPrimaryComponent: primaryComponent.getIsPrimary(),
  };
}

/**
 *
 * @param vehicle
 */
export function generateVehicleBlockActionsProps(
  vehicle: VehicleManager
): GD_VehicleBlockActionsProps {
  const allActions = vehicle.getAllActions();

  return {
    reactions: deriveVehicleBlockActionsActions(
      Constants.ActivationTypeEnum.REACTION,
      allActions
    ),
    bonusActions: deriveVehicleBlockActionsActions(
      Constants.ActivationTypeEnum.BONUS_ACTION,
      allActions
    ),
    special: deriveVehicleBlockActionsActions(
      Constants.ActivationTypeEnum.SPECIAL,
      allActions
    ),
  };
}

/**
 *
 * @param vehicle
 * @param ruleData
 */
export function generateVehicleBlockComponentListProps(
  vehicle: VehicleManager
): GD_VehicleBlockComponentListProps {
  const enableComponents = vehicle.getEnableComponents();

  return {
    components: enableComponents
      ? vehicle.generateVehicleComponentsBlockInfo()
      : [],
  };
}

/**
 *
 * @param component
 * @param vehicle
 * @param ruleData
 */
export function generateVehicleBlockComponentProps(
  component: VehicleComponent,
  vehicle: Vehicle,
  ruleData: RuleData
): GD_VehicleBlockComponentProps {
  const uniqueKey = VehicleComponentUtils.getUniqueKey(component);

  return {
    actions: deriveVehicleComponentActionsProps(component),
    count: 1,
    description: VehicleComponentUtils.getDescription(component),
    displayOrder: VehicleComponentUtils.getDisplayOrder(component),
    isPrimaryComponent: VehicleComponentUtils.getIsPrimary(component),
    isRemovable: VehicleComponentUtils.getIsRemovable(component),
    name: VehicleComponentUtils.getName(component),
    typeNames: VehicleComponentUtils.getTypeNames(component),
    coverType: deriveVehicleComponentCoverTypeProp(
      component,
      vehicle,
      ruleData
    ),
    requiredCrew: deriveVehicleComponentRequiredCrew(component, vehicle),
    key: uniqueKey,
    uniqueKey,
    uniquenessFactor: VehicleComponentUtils.getUniquenessFactor(component),
    id: VehicleComponentUtils.getMappingId(component),
    vehicleId: VehicleUtils.getMappingId(vehicle),
    displayType: VehicleUtils.getConfigurationValue(
      Constants.VehicleConfigurationKeyEnum.DISPLAY_TYPE,
      vehicle
    ),
    armorClassInfo: deriveVehicleComponentArmorClassInfo(component, vehicle),
    speedInfos: deriveVehicleComponentSpeedInfos(component, vehicle),
    hitPointInfo: deriveVehicleBlockComponentHitPointInfoProps(
      component,
      vehicle
    ),
    enableComponentManagement: deriveEnableComponentManagement(
      component,
      vehicle
    ),
    costInfos: VehicleComponentUtils.getCosts(component),
    width: VehicleUtils.getWidth(vehicle),
    length: VehicleUtils.getLength(vehicle),
  };
}
