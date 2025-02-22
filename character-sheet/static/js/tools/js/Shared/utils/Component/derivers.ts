import {
  Action,
  ActionUtils,
  ConditionUtils,
  Constants,
  DiceUtils,
  FormatUtils,
  HelperUtils,
  RuleData,
  RuleDataUtils,
  SourceData,
  Vehicle,
  VehicleComponent,
  VehicleComponentArmorClassInfo,
  VehicleComponentSpeedInfo,
  VehicleComponentUtils,
  VehicleFeatureData,
  VehicleManager,
  VehicleUtils,
} from "@dndbeyond/character-rules-engine/es";

import { TypeScriptUtils } from "../index";
import {
  generateVehicleActionStationProps,
  generateVehicleBlockComponentProps,
  generateVehiclePrimaryComponentProps,
} from "./generators";
import {
  GD_VehicleBlockActionStationProps,
  GD_VehicleBlockComponentProps,
  GD_VehicleBlockPrimaryComponentProps,
  VehicleActionSummaryProps,
  VehicleBlockActionProp,
  VehicleComponentActionInfoProp,
  VehicleComponentCargoCapacityProp,
  VehicleComponentHitPointInfoProps,
  VehicleComponentTravelPaceInfoProp,
} from "./typings";

/**
 *
 * @param vehicle
 * @param ruleData
 */
export function deriveVehicleTypeNameProp(
  vehicle: Vehicle,
  ruleData: RuleData
): string | null {
  const type = VehicleUtils.getType(vehicle);
  if (type === null) {
    return null;
  }

  return RuleDataUtils.getObjectTypeName(type, ruleData);
}

/**
 *
 * @param vehicle
 */
export function deriveVehicleSizeNameProp(vehicle: Vehicle): string | null {
  const sizeInfo = VehicleUtils.getSizeInfo(vehicle);

  if (sizeInfo === null) {
    return null;
  }

  return sizeInfo.name;
}

/**
 *
 * @param vehicle
 */
export function deriveVehicleComponentCargoCapacityProp(
  vehicle: Vehicle
): VehicleComponentCargoCapacityProp {
  return {
    weight: VehicleUtils.getCargoCapacity(vehicle),
    description: VehicleUtils.getCargoCapacityDescription(vehicle),
  };
}

/**
 *
 * @param vehicle
 */
export function deriveVehicleDamageImmunitiesProps(
  vehicle: Vehicle
): Array<string> {
  return VehicleUtils.getDamageImmunityInfos(vehicle)
    .map((immunityInfo) => immunityInfo.name)
    .filter(TypeScriptUtils.isNotNullOrUndefined);
}

/**
 *
 * @param vehicle
 */
export function deriveVehicleConditionImmunitiesProps(
  vehicle: Vehicle
): Array<string> {
  return VehicleUtils.getConditionImmunityInfos(vehicle).map((conditionInfo) =>
    ConditionUtils.getName(conditionInfo)
  );
}

/**
 *
 * @param vehicle
 */
export function deriveVehicleComponentTravelPaceInfoProp(
  vehicle: Vehicle
): VehicleComponentTravelPaceInfoProp | null {
  const enableTravelPace = VehicleUtils.getConfigurationValue(
    Constants.VehicleConfigurationKeyEnum.ENABLE_TRAVEL_PACE,
    vehicle
  );

  if (!enableTravelPace) {
    return null;
  }

  const pace = VehicleUtils.getTravelPace(vehicle);
  const effectiveHours = VehicleUtils.getTravelPaceEffectiveHours(vehicle);

  let travelPaceInfo: VehicleComponentTravelPaceInfoProp | null = null;
  if (pace !== null) {
    travelPaceInfo = {
      pace,
      effectiveHours,
    };
  }

  return travelPaceInfo;
}

/**
 *
 * @param vehicle
 */
export function deriveVehicleComponentPrimaryPropertiesProps(
  vehicle: VehicleManager
): GD_VehicleBlockPrimaryComponentProps | null {
  const primaryComponentManageType = vehicle.getPrimaryComponentManageType();

  if (
    primaryComponentManageType ===
    Constants.VehicleConfigurationPrimaryComponentManageTypeEnum.VEHICLE
  ) {
    return generateVehiclePrimaryComponentProps(vehicle);
  }

  return null;
}

/**
 *
 * @param vehicle
 */
export function deriveVehicleBlockPrimaryHitPointInfoProps(
  vehicle: Vehicle
): VehicleComponentHitPointInfoProps | null {
  const primaryManageType = VehicleUtils.getConfigurationValue(
    Constants.VehicleConfigurationKeyEnum.PRIMARY_COMPONENT_MANAGE_TYPE,
    vehicle
  );
  if (
    primaryManageType ===
    Constants.VehicleConfigurationPrimaryComponentManageTypeEnum.COMPONENT
  ) {
    return null;
  }

  return deriveVehicleComponentHitPointInfoProps(
    VehicleUtils.getPrimaryComponent(vehicle),
    vehicle
  );
}

/**
 *
 * @param component
 * @param vehicle
 */
export function deriveVehicleBlockComponentHitPointInfoProps(
  component: VehicleComponent,
  vehicle: Vehicle
): VehicleComponentHitPointInfoProps | null {
  const isPrimaryComponent = VehicleComponentUtils.getIsPrimary(component);
  const primaryManageType = VehicleUtils.getConfigurationValue(
    Constants.VehicleConfigurationKeyEnum.PRIMARY_COMPONENT_MANAGE_TYPE,
    vehicle
  );
  if (
    isPrimaryComponent &&
    primaryManageType ===
      Constants.VehicleConfigurationPrimaryComponentManageTypeEnum.VEHICLE
  ) {
    return null;
  }

  const enableComponentHitPoints = VehicleUtils.getConfigurationValue(
    Constants.VehicleConfigurationKeyEnum.ENABLE_COMPONENT_HIT_POINTS,
    vehicle
  );
  if (!enableComponentHitPoints) {
    return null;
  }

  return deriveVehicleComponentHitPointInfoProps(component, vehicle);
}

/**
 *
 * @param component
 * @param vehicle
 */
export function deriveVehicleComponentHitPointInfoProps(
  component: VehicleComponent,
  vehicle: Vehicle
): VehicleComponentHitPointInfoProps {
  let damageThreshold: number | null = null;
  if (
    VehicleUtils.getConfigurationValue(
      Constants.VehicleConfigurationKeyEnum.ENABLE_COMPONENT_DAMAGE_THRESHOLD,
      vehicle
    )
  ) {
    damageThreshold = VehicleComponentUtils.getDamageThreshold(component);
  }
  let mishapThreshold: number | null = null;
  if (
    VehicleUtils.getConfigurationValue(
      Constants.VehicleConfigurationKeyEnum.ENABLE_COMPONENT_MISHAP_THRESHOLD,
      vehicle
    )
  ) {
    mishapThreshold = VehicleComponentUtils.getMishapThreshold(component);
  }

  let componentHitPointInfo = VehicleComponentUtils.getHitPointInfo(component);

  const definitionHitPoints = VehicleComponentUtils.getHitPoints(component);

  return {
    remainingHp:
      componentHitPointInfo !== null
        ? componentHitPointInfo.remainingHp
        : definitionHitPoints,
    tempHp:
      componentHitPointInfo !== null ? componentHitPointInfo.tempHp : null,
    totalHp:
      componentHitPointInfo !== null
        ? componentHitPointInfo.totalHp
        : definitionHitPoints,
    removedHp:
      componentHitPointInfo !== null ? componentHitPointInfo.removedHp : 0,
    hitPointSpeedAdjustments:
      VehicleComponentUtils.getHitPointSpeedAdjustments(component),
    damageThreshold,
    mishapThreshold,
  };
}

/**
 *
 * @param vehicle
 * @param ruleData
 */
export function deriveVehicleBlockActionsSummariesProps(
  vehicle: Vehicle,
  ruleData: RuleData
): Array<VehicleActionSummaryProps> {
  return VehicleUtils.getActionSummaries(vehicle).map((action) => {
    let sourceInfo: SourceData | null = null;
    if (action.sourceId !== null) {
      sourceInfo = RuleDataUtils.getSourceDataInfo(action.sourceId, ruleData);
    }

    return {
      ...action,
      sourceName: sourceInfo ? sourceInfo.name : null,
      sourceFullName: sourceInfo ? sourceInfo.description : null,
    };
  });
}

/**
 *
 * @param vehicle
 */
export function deriveFeaturesProps(
  vehicle: Vehicle
): Array<VehicleFeatureData> {
  const enableFeatures = VehicleUtils.getConfigurationValue(
    Constants.VehicleConfigurationKeyEnum.ENABLE_FEATURES,
    vehicle
  );
  return enableFeatures ? VehicleUtils.getFeatures(vehicle) : [];
}

/**
 *
 * @param activationType
 * @param actions
 */
export function deriveVehicleBlockActionsActions(
  activationType: Constants.ActivationTypeEnum,
  actions: Array<Action>
): Array<VehicleBlockActionProp> {
  return actions
    .filter((action) =>
      ActionUtils.validateIsActivationType(action, activationType)
    )
    .map(deriveVehicleActionProps);
}

/**
 *
 * @param action
 */
function deriveVehicleActionProps(action: Action): VehicleBlockActionProp {
  return {
    name: ActionUtils.getName(action),
    description: ActionUtils.getDescription(action),
    key: deriveVehicleActionUniqueKey(action),
    ammo: ActionUtils.getAmmunition(action),
  };
}

function deriveVehicleActionUniqueKey(action: Action): string {
  //TODO use ActionUtils.getUniqueKey once vehicle action have real id and entityTypeIds, need this for react keys
  return `${ActionUtils.getName(action)}-${ActionUtils.getUniqueKey(action)}`;
}

/**
 *
 * @param vehicle
 * @param ruleData
 */
export function deriveVehicleActionStationsProps(
  vehicle: Vehicle,
  ruleData: RuleData
): Array<GD_VehicleBlockActionStationProps> {
  return VehicleUtils.getActionStations(vehicle).map((station) =>
    generateVehicleActionStationProps(station, vehicle, ruleData)
  );
}

/**
 *
 * @param vehicle
 * @param ruleData
 */
export function deriveVehicleComponentsProps(
  vehicle: Vehicle,
  ruleData: RuleData
): Array<GD_VehicleBlockComponentProps> {
  return VehicleUtils.getComponents(vehicle).map((component) =>
    generateVehicleBlockComponentProps(component, vehicle, ruleData)
  );
}

/**
 *
 * @param component
 */
export function deriveVehicleComponentActionsProps(
  component: VehicleComponent
): Array<VehicleBlockActionProp> {
  return VehicleComponentUtils.getActions(component).map((action) =>
    deriveVehicleActionProps(action)
  );
}

/**
 *
 * @param component
 * @param vehicle
 * @param ruleData
 */
export function deriveVehicleComponentCoverTypeProp(
  component: VehicleComponent,
  vehicle: Vehicle,
  ruleData: RuleData
): string | null {
  const enableComponentCover = VehicleUtils.getConfigurationValue(
    Constants.VehicleConfigurationKeyEnum.ENABLE_COMPONENT_COVER,
    vehicle
  );

  if (!enableComponentCover) {
    return null;
  }

  const coverType = VehicleComponentUtils.getCoverType(component);
  if (coverType === null) {
    return null;
  }

  const coverTypeLookup = RuleDataUtils.getCoverTypeLookup(ruleData);
  const cover = HelperUtils.lookupDataOrFallback(coverTypeLookup, coverType);

  return cover ? cover.name : null;
}

/**
 *
 * @param component
 * @param vehicle
 */
export function deriveVehicleComponentRequiredCrew(
  component: VehicleComponent,
  vehicle: Vehicle
): number | null {
  const enableRequiredCrew = VehicleUtils.getConfigurationValue(
    Constants.VehicleConfigurationKeyEnum.ENABLE_COMPONENT_CREW_REQUIREMENTS,
    vehicle
  );
  return enableRequiredCrew
    ? VehicleComponentUtils.getRequiredCrew(component)
    : null;
}

/**
 * TODO move this one?
 * @param component
 * @param vehicle
 */
function allowComponentProperty(
  component: VehicleComponent,
  vehicle: Vehicle
): boolean {
  const primaryManageType = VehicleUtils.getConfigurationValue(
    Constants.VehicleConfigurationKeyEnum.PRIMARY_COMPONENT_MANAGE_TYPE,
    vehicle
  );
  const isPrimaryComponent = VehicleComponentUtils.getIsPrimary(component);

  return !(
    primaryManageType ===
      Constants.VehicleConfigurationPrimaryComponentManageTypeEnum.VEHICLE &&
    isPrimaryComponent
  );
}

/**
 *
 * @param component
 * @param vehicle
 */
export function deriveVehicleComponentArmorClassInfo(
  component: VehicleComponent,
  vehicle: Vehicle
): VehicleComponentArmorClassInfo | null {
  const enableArmorClass = VehicleUtils.getConfigurationValue(
    Constants.VehicleConfigurationKeyEnum.ENABLE_COMPONENT_ARMOR_CLASS,
    vehicle
  );

  if (enableArmorClass && allowComponentProperty(component, vehicle)) {
    return VehicleComponentUtils.getArmorClassInfo(component);
  }

  return null;
}

/**
 *
 * @param component
 * @param vehicle
 */
export function deriveVehicleComponentSpeedInfos(
  component: VehicleComponent,
  vehicle: Vehicle
): Array<VehicleComponentSpeedInfo> {
  const enableSpeeds = VehicleUtils.getConfigurationValue(
    Constants.VehicleConfigurationKeyEnum.ENABLE_COMPONENT_SPEEDS,
    vehicle
  );

  if (enableSpeeds && allowComponentProperty(component, vehicle)) {
    return VehicleComponentUtils.getSpeedInfos(component);
  }

  return [];
}

/**
 * Set up this function to derive more possibilities of component management
 * @param component
 * @param vehicle
 */
export function deriveEnableComponentManagement(
  component: VehicleComponent,
  vehicle: Vehicle
): boolean {
  if (
    deriveVehicleBlockComponentHitPointInfoProps(component, vehicle) !== null
  ) {
    return true;
  }

  return false;
}

/**
 * preserving how to derive ActionInfoProps for when we can get rid of dangerouslySetHtml in Vehicle Action.descriptions
 * @param action
 */
export function deriveVehicleComponentActionInfo(
  action: Action
): VehicleComponentActionInfoProp {
  const actionTypeId = ActionUtils.getActionTypeId(action);
  const toHit = ActionUtils.getToHit(action);
  const rangeInfo = ActionUtils.getRange(action);
  const numOfTargets = ActionUtils.getNumberOfTargets(action);
  const attackRangeTypeId = ActionUtils.getAttackRangeId(action);

  let actionTypeDisplayText: Array<string> = [];
  if (attackRangeTypeId === Constants.AttackTypeRangeEnum.RANGED) {
    actionTypeDisplayText.push("Ranged");
  } else if (attackRangeTypeId === Constants.AttackTypeRangeEnum.MELEE) {
    actionTypeDisplayText.push("Melee");
  }

  if (actionTypeId === Constants.ActionTypeEnum.WEAPON) {
    actionTypeDisplayText.push("Weapon");
  } else if (actionTypeId === Constants.ActionTypeEnum.SPELL) {
    actionTypeDisplayText.push("Spell");
  }

  if (actionTypeId !== null) {
    actionTypeDisplayText.push("Attack");
  } else {
    actionTypeDisplayText.push("Action");
  }

  let actionDescriptionDisplay: Array<string> = [];
  if (toHit !== null) {
    actionDescriptionDisplay.push(
      `${FormatUtils.renderSignedNumber(toHit)} to hit`
    );
  }

  if (rangeInfo) {
    const { minimumRange, range, longRange } = rangeInfo;

    let rangeText: Array<string> = [];

    let rangeString = `range ${range}`;
    if (longRange !== null) {
      rangeString = `range ${range}/${FormatUtils.renderDistance(longRange)}`;
    }
    rangeText.push(rangeString);

    if (minimumRange !== null) {
      rangeText.push(
        `(can't hit targets within ${FormatUtils.renderDistance(
          minimumRange
        )} of it)`
      );
    }
    actionDescriptionDisplay.push(rangeText.join(" "));
  }

  if (numOfTargets) {
    let numOfTargetText: string =
      numOfTargets === 1 ? "one target" : `${numOfTargets} targets`;
    actionDescriptionDisplay.push(numOfTargetText);
  }

  return {
    label: `${actionTypeDisplayText.join(" ")}`,
    snippet: actionDescriptionDisplay.length
      ? `${actionDescriptionDisplay.join(", ")}`
      : null,
  };
}

/**
 * preserving how to derive DamageInfoProps for when we can get rid of dangerouslySetHtml in Vehicle Action.descriptions
 * @param action
 */
export function deriveVehicleComponentActionDamageInfo(
  action: Action
): VehicleComponentActionInfoProp {
  const diceInfo = ActionUtils.getDice(action);
  let avgDiceValue: number | null = null;
  if (diceInfo !== null) {
    avgDiceValue = DiceUtils.getAverageDiceValue(diceInfo);
  }

  const damageType = ActionUtils.getDamage(action).type;

  let snippet: Array<string | number> = [];
  if (avgDiceValue !== null) {
    snippet.push(avgDiceValue);
  }

  if (diceInfo !== null) {
    snippet.push(`(${DiceUtils.renderDie(diceInfo)})`);
  }

  if (damageType !== null && damageType.name !== null) {
    snippet.push(`${damageType.name.toLowerCase()} damage`);
  }

  return {
    label: "Hit",
    snippet: snippet.length ? `${snippet.join(" ")}` : null,
  };
}
