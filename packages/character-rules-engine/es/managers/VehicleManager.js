import { AccessUtils } from "../engine/Access";
import { ActionValidators } from "../engine/Action";
import { ActivationTypeEnum } from "../engine/Activation";
import { ConditionAccessors } from "../engine/Condition";
import { ExtraGenerators } from "../engine/Extra";
import { RuleDataUtils } from "../engine/RuleData";
import { SourceUtils } from "../engine/Source";
import { TypeScriptUtils } from "../utils";
import { ActionUtils } from '..';
import { serviceDataActions } from '../actions';
import { VehicleAccessors, VehicleConfigurationDisplayTypeEnum, VehicleConfigurationKeyEnum, VehicleConfigurationPrimaryComponentManageTypeEnum, VehicleUtils, } from '../engine/Vehicle';
import { rulesEngineSelectors } from '../selectors';
import { BaseManager } from './BaseManager';
import { getVehicleComponentManager } from './VehicleComponentManager';
const vehicleManagerMap = new Map();
export const getVehicleManager = (params) => {
    const { vehicle } = params;
    const vehicleId = VehicleAccessors.getId(vehicle);
    if (vehicleManagerMap.has(vehicleId)) {
        const vehicleManager = vehicleManagerMap.get(vehicleId);
        if (!vehicleManager) {
            throw new Error(`VehicleManager for vehicle ${vehicleId} is null`);
        }
        if (vehicleManager.vehicle === vehicle) {
            return vehicleManager;
        }
    }
    const newVehicleManger = new VehicleManager(params);
    vehicleManagerMap.set(vehicleId, newVehicleManger);
    return newVehicleManger;
};
export class VehicleManager extends BaseManager {
    constructor(params) {
        super(params);
        // Actions
        this.handleRemove = (onSuccess, onError) => {
            this.dispatch(serviceDataActions.vehicleMappingRemove(this.getMappingId()));
        };
        this.handleDataUpdate = ({ properties }, onSuccess, onError) => {
            this.dispatch(serviceDataActions.vehicleMappingDataSet(this.getMappingId(), properties));
        };
        this.handleFuelChange = ({ remainingFuel }, onSuccess, onError) => {
            this.dispatch(serviceDataActions.vehicleMappingRemainingFuelSet(this.getMappingId(), remainingFuel));
        };
        this.handleConditionLevelChange = (conditionId, newLevel, prevLevel) => {
            const vehicleId = this.getMappingId();
            if (!prevLevel && newLevel !== null) {
                this.dispatch(serviceDataActions.vehicleMappingConditionAdd(vehicleId, conditionId, newLevel));
            }
            else if (!newLevel) {
                this.dispatch(serviceDataActions.vehicleMappingConditionRemove(vehicleId, conditionId));
            }
            else {
                this.dispatch(serviceDataActions.vehicleMappingConditionSet(vehicleId, conditionId, newLevel));
            }
        };
        // Accessors
        this.getAccessType = () => VehicleAccessors.getAccessType(this.vehicle);
        this.getMappingId = () => VehicleAccessors.getMappingId(this.vehicle);
        this.getPrimaryComponent = () => getVehicleComponentManager({
            vehicle: this,
            vehicleComponent: VehicleAccessors.getPrimaryComponent(this.vehicle),
        });
        this.getName = () => VehicleAccessors.getName(this.vehicle);
        this.getDescription = () => VehicleAccessors.getDescription(this.vehicle);
        this.getLargeAvatarUrl = () => VehicleAccessors.getLargeAvatarUrl(this.vehicle);
        this.getDefinitionName = () => VehicleAccessors.getDefinitionName(this.vehicle);
        this.getMovementNames = () => VehicleAccessors.getMovementNames(this.vehicle);
        this.getDefinitionDescription = () => VehicleAccessors.getDefinitionDescription(this.vehicle);
        this.getSources = () => VehicleAccessors.getSources(this.vehicle);
        this.getFuelData = () => VehicleAccessors.getFuelData(this.vehicle);
        this.getEnabledConditions = () => VehicleAccessors.getEnabledConditions(this.vehicle);
        this.getActiveConditionLookup = () => VehicleAccessors.getActiveConditionLookup(this.vehicle);
        this.getPrimaryComponentManageType = () => VehicleUtils.getConfigurationValue(VehicleConfigurationKeyEnum.PRIMARY_COMPONENT_MANAGE_TYPE, this.vehicle);
        this.getDisplayType = () => VehicleUtils.getConfigurationValue(VehicleConfigurationKeyEnum.DISPLAY_TYPE, this.vehicle);
        this.getEnableConditionTracking = () => VehicleUtils.getConfigurationValue(VehicleConfigurationKeyEnum.ENABLE_CONDITIONS_TRACKING, this.vehicle);
        this.getEnableFuelTracking = () => VehicleUtils.getConfigurationValue(VehicleConfigurationKeyEnum.ENABLE_FUEL_TRACKING, this.vehicle);
        this.getEnableActionStations = () => VehicleUtils.getConfigurationValue(VehicleConfigurationKeyEnum.ENABLE_ACTION_STATIONS, this.vehicle);
        this.getEnableTravelPace = () => VehicleUtils.getConfigurationValue(VehicleConfigurationKeyEnum.ENABLE_TRAVEL_PACE, this.vehicle);
        this.getEnableComponentCover = () => VehicleUtils.getConfigurationValue(VehicleConfigurationKeyEnum.ENABLE_COMPONENT_COVER, this.vehicle);
        this.getEnableComponentArmorClass = () => VehicleUtils.getConfigurationValue(VehicleConfigurationKeyEnum.ENABLE_COMPONENT_ARMOR_CLASS, this.vehicle);
        this.getEnableComponentSpeeds = () => VehicleUtils.getConfigurationValue(VehicleConfigurationKeyEnum.ENABLE_COMPONENT_SPEEDS, this.vehicle);
        this.getEnableComponentHitPoints = () => VehicleUtils.getConfigurationValue(VehicleConfigurationKeyEnum.ENABLE_COMPONENT_HIT_POINTS, this.vehicle);
        this.getEnableComponentDamageThreshold = () => VehicleUtils.getConfigurationValue(VehicleConfigurationKeyEnum.ENABLE_COMPONENT_DAMAGE_THRESHOLD, this.vehicle);
        this.getEnableComponentMishapThreshold = () => VehicleUtils.getConfigurationValue(VehicleConfigurationKeyEnum.ENABLE_COMPONENT_MISHAP_THRESHOLD, this.vehicle);
        this.getEnableComponents = () => VehicleUtils.getConfigurationValue(VehicleConfigurationKeyEnum.ENABLE_COMPONENTS, this.vehicle);
        this.getEnableComponentCrewRequirements = () => VehicleUtils.getConfigurationValue(VehicleConfigurationKeyEnum.ENABLE_COMPONENT_CREW_REQUIREMENTS, this.vehicle);
        this.getUrl = () => VehicleAccessors.getUrl(this.vehicle);
        this.getUniqueKey = () => VehicleAccessors.getUniqueKey(this.vehicle);
        this.getAvatarUrl = () => VehicleAccessors.getAvatarUrl(this.vehicle);
        this.isHomebrew = () => VehicleAccessors.isHomebrew(this.vehicle);
        this.getType = () => VehicleAccessors.getType(this.vehicle);
        this.getComponents = () => {
            return VehicleAccessors.getComponents(this.vehicle).map((vehicleComponent) => getVehicleComponentManager(Object.assign(Object.assign({}, this.params), { vehicle: this, vehicleComponent })));
        };
        this.getActionStations = () => {
            return VehicleAccessors.getActionStations(this.vehicle).map((vehicleComponent) => getVehicleComponentManager(Object.assign(Object.assign({}, this.params), { vehicle: this, vehicleComponent })));
        };
        this.getEnableFeatures = () => VehicleUtils.getConfigurationValue(VehicleConfigurationKeyEnum.ENABLE_FEATURES, this.vehicle);
        this.getFeatures = () => VehicleAccessors.getFeatures(this.vehicle);
        this.getWeight = () => VehicleAccessors.getWeight(this.vehicle);
        this.getWidth = () => VehicleAccessors.getWidth(this.vehicle);
        this.getLength = () => VehicleAccessors.getLength(this.vehicle);
        this.getSizeInfo = () => VehicleAccessors.getSizeInfo(this.vehicle);
        this.getCargoCapacity = () => VehicleAccessors.getCargoCapacity(this.vehicle);
        this.getCargoCapacityDescription = () => VehicleAccessors.getCargoCapacityDescription(this.vehicle);
        this.getConditionImmunityInfos = () => VehicleAccessors.getConditionImmunityInfos(this.vehicle);
        this.getCreatureCapacityDescriptions = () => VehicleAccessors.getCreatureCapacityDescriptions(this.vehicle);
        this.getCreatureCapacity = () => VehicleAccessors.getCreatureCapacity(this.vehicle);
        this.getDamageImmunityInfos = () => VehicleAccessors.getDamageImmunityInfos(this.vehicle);
        this.getActionSummaries = () => VehicleAccessors.getActionSummaries(this.vehicle);
        this.getActionsText = () => VehicleAccessors.getActionsText(this.vehicle);
        this.getStats = () => VehicleAccessors.getStats(this.vehicle);
        this.getTravelPace = () => VehicleAccessors.getTravelPace(this.vehicle);
        this.getTravelPaceEffectiveHours = () => VehicleAccessors.getTravelPaceEffectiveHours(this.vehicle);
        this.getAllActions = () => VehicleAccessors.getAllActions(this.vehicle);
        // Validators
        this.isAccessible = () => AccessUtils.isAccessible(this.getAccessType());
        this.isSpelljammer = () => this.getDisplayType() === VehicleConfigurationDisplayTypeEnum.SPELLJAMMER;
        this.isInfernalWarMachine = () => this.getDisplayType() === VehicleConfigurationDisplayTypeEnum.INFERNAL_WAR_MACHINE;
        this.isShip = () => this.getDisplayType() === VehicleConfigurationDisplayTypeEnum.SHIP;
        // Utils
        this.generateVehicleMeta = () => {
            const ruleData = rulesEngineSelectors.getRuleData(this.state);
            return ExtraGenerators.generateVehicleMeta(this.vehicle, ruleData);
        };
        this.getSourceNames = () => {
            const ruleData = rulesEngineSelectors.getRuleData(this.state);
            return SourceUtils.getSourceFullNames(this.getSources(), ruleData);
        };
        this.getResolvedEnabledConditions = () => {
            const ruleData = rulesEngineSelectors.getRuleData(this.state);
            return this.getEnabledConditions().map((id) => RuleDataUtils.getCondition(id, ruleData));
        };
        this.getVehicleSizeName = () => { var _a, _b; return (_b = (_a = this.getSizeInfo()) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : null; };
        this.getVehicleTypeName = () => {
            const ruleData = rulesEngineSelectors.getRuleData(this.state);
            const type = this.getType();
            if (type === null) {
                return null;
            }
            return RuleDataUtils.getObjectTypeName(type, ruleData);
        };
        this.getVehicleCargoCapacityInfo = () => {
            return {
                weight: this.getCargoCapacity(),
                description: this.getCargoCapacityDescription(),
            };
        };
        this.generateVehicleConditionImmunityNames = () => {
            return this.getConditionImmunityInfos().map((conditionInfo) => ConditionAccessors.getName(conditionInfo));
        };
        this.generateVehicleDamageImmunityNames = () => {
            return this.getDamageImmunityInfos()
                .map((immunityInfo) => immunityInfo.name)
                .filter(TypeScriptUtils.isNotNullOrUndefined);
        };
        this.generateFeatures = () => {
            return this.getEnableFeatures() ? this.getFeatures() : [];
        };
        this.generateVehicleComponentTravelPaceInfo = () => {
            const enableTravelPace = this.getEnableTravelPace();
            if (!enableTravelPace) {
                return null;
            }
            const pace = this.getTravelPace();
            const effectiveHours = this.getTravelPaceEffectiveHours();
            return pace !== null
                ? {
                    pace,
                    effectiveHours,
                }
                : null;
        };
        this.params = params;
        this.vehicle = params.vehicle;
    }
    generateVehicleBlockActionsSummaries() {
        const ruleData = rulesEngineSelectors.getRuleData(this.state);
        return this.getActionSummaries().map((action) => {
            let sourceInfo = null;
            if (action.sourceId !== null) {
                sourceInfo = RuleDataUtils.getSourceDataInfo(action.sourceId, ruleData);
            }
            return Object.assign(Object.assign({}, action), { sourceName: sourceInfo ? sourceInfo.name : null, sourceFullName: sourceInfo ? sourceInfo.description : null });
        });
    }
    generateVehicleActionsSummaries() {
        return {
            actionsText: this.getActionsText(),
            actionsSummaries: this.generateVehicleBlockActionsSummaries(),
        };
    }
    generateVehicleActionStationsInfo() {
        return this.getActionStations().map((station) => station.generateVehicleBlockComponentInfo());
    }
    generateVehicleComponentsBlockInfo() {
        return this.getComponents().map((component) => component.generateVehicleBlockComponentInfo());
    }
    generateVehicleActionInfo(action) {
        return {
            name: ActionUtils.getName(action),
            description: ActionUtils.getDescription(action),
            key: `${ActionUtils.getName(action)}-${ActionUtils.getUniqueKey(action)}`,
            ammo: ActionUtils.getAmmunition(action),
        };
    }
    generateVehicleBlockActions(activationType, actions) {
        return actions
            .filter((action) => ActionValidators.validateIsActivationType(action, activationType))
            .map(this.generateVehicleActionInfo);
    }
    generateVehicleBlockActionsInfo() {
        const allActions = this.getAllActions();
        return {
            reactions: this.generateVehicleBlockActions(ActivationTypeEnum.REACTION, allActions),
            bonusActions: this.generateVehicleBlockActions(ActivationTypeEnum.BONUS_ACTION, allActions),
            special: this.generateVehicleBlockActions(ActivationTypeEnum.SPECIAL, allActions),
        };
    }
    generateVehicleBlockPrimaryHitPointInfo() {
        const primaryManageType = this.getPrimaryComponentManageType();
        if (primaryManageType === VehicleConfigurationPrimaryComponentManageTypeEnum.COMPONENT) {
            return null;
        }
        return this.getPrimaryComponent().generateVehicleBlockComponentHitPointInfo();
    }
}
