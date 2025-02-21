import { serviceDataActions } from "../actions";
import { ActionAccessors } from "../engine/Action";
import { CharacterUtils } from "../engine/Character";
import { HelperUtils } from "../engine/Helper";
import { RuleDataAccessors } from "../engine/RuleData";
import { VehicleConfigurationPrimaryComponentManageTypeEnum } from "../engine/Vehicle";
import { VehicleComponentAccessors } from "../engine/VehicleComponent";
import { rulesEngineSelectors } from "../selectors";
import { BaseManager } from './BaseManager';
const vehicleComponentManagerMap = new Map();
export const getVehicleComponentManager = (params) => {
    var _a;
    const { vehicleComponent } = params;
    const vehicleId = (_a = VehicleComponentAccessors.getId(vehicleComponent)) !== null && _a !== void 0 ? _a : '';
    if (vehicleComponentManagerMap.has(vehicleId)) {
        const vehicleComponentManager = vehicleComponentManagerMap.get(vehicleId);
        if (!vehicleComponentManager) {
            throw new Error(`VehicleManager for vehicle ${vehicleId} is null`);
        }
        if (vehicleComponentManager.vehicleComponent === vehicleComponent) {
            return vehicleComponentManager;
        }
    }
    const newVehicleManger = new VehicleComponentManager(params);
    vehicleComponentManagerMap.set(vehicleId, newVehicleManger);
    return newVehicleManger;
};
export class VehicleComponentManager extends BaseManager {
    constructor(params) {
        super(params);
        // Actions
        this.handleHitPointAdjustment = ({ hitPointDiff }, onSuccess, onError) => {
            const hitPointInfo = this.getHitPointInfo();
            if (hitPointInfo === null) {
                return;
            }
            let newHitPoints = CharacterUtils.calculateHitPoints(hitPointInfo, hitPointDiff);
            this.dispatch(serviceDataActions.vehicleComponentMappingHitPointsSet(this.getMappingId(), newHitPoints.newRemovedHp));
        };
        // Accessors
        this.getMappingId = () => VehicleComponentAccessors.getMappingId(this.vehicleComponent);
        this.getHitPointInfo = () => VehicleComponentAccessors.getHitPointInfo(this.vehicleComponent);
        this.getName = () => VehicleComponentAccessors.getName(this.vehicleComponent);
        this.getTypeNames = () => VehicleComponentAccessors.getTypeNames(this.vehicleComponent);
        this.getUniqueKey = () => VehicleComponentAccessors.getUniqueKey(this.vehicleComponent);
        this.getArmorClassInfo = () => VehicleComponentAccessors.getArmorClassInfo(this.vehicleComponent);
        this.getSpeedInfos = () => VehicleComponentAccessors.getSpeedInfos(this.vehicleComponent);
        this.getCosts = () => VehicleComponentAccessors.getCosts(this.vehicleComponent);
        this.getIsPrimary = () => VehicleComponentAccessors.getIsPrimary(this.vehicleComponent);
        this.getActions = () => VehicleComponentAccessors.getActions(this.vehicleComponent);
        this.getDisplayOrder = () => VehicleComponentAccessors.getDisplayOrder(this.vehicleComponent);
        this.getIsRemovable = () => VehicleComponentAccessors.getIsRemovable(this.vehicleComponent);
        this.getUniquenessFactor = () => VehicleComponentAccessors.getUniquenessFactor(this.vehicleComponent);
        this.getCoverType = () => VehicleComponentAccessors.getCoverType(this.vehicleComponent);
        this.getRequiredCrew = () => VehicleComponentAccessors.getRequiredCrew(this.vehicleComponent);
        this.getDamageThreshold = () => VehicleComponentAccessors.getDamageThreshold(this.vehicleComponent);
        this.getMishapThreshold = () => VehicleComponentAccessors.getMishapThreshold(this.vehicleComponent);
        this.getHitPoints = () => VehicleComponentAccessors.getDefinitionHitPoints(this.vehicleComponent);
        this.getHitPointSpeedAdjustments = () => VehicleComponentAccessors.getHitPointSpeedAdjustments(this.vehicleComponent);
        this.getVehicleMappingId = () => VehicleComponentAccessors.getVehicleMappingId(this.vehicleComponent);
        this.getDescription = () => VehicleComponentAccessors.getDescription(this.vehicleComponent);
        // Utils
        this.generateVehicleComponentCoverType = () => {
            if (!this.vehicle.getEnableComponentCover()) {
                return null;
            }
            const coverType = this.getCoverType();
            if (coverType === null) {
                return null;
            }
            const ruleData = rulesEngineSelectors.getRuleData(this.state);
            const coverTypeLookup = RuleDataAccessors.getCoverTypeLookup(ruleData);
            const cover = HelperUtils.lookupDataOrFallback(coverTypeLookup, coverType);
            return cover ? cover.name : null;
        };
        this.generateVehicleComponentRequiredCrew = () => {
            const enableRequiredCrew = this.vehicle.getEnableComponentCrewRequirements();
            return enableRequiredCrew ? this.getRequiredCrew() : null;
        };
        this.generateVehicleComponentArmorClassInfo = () => {
            const enableArmorClass = this.vehicle.getEnableComponentArmorClass();
            if (enableArmorClass && this.allowComponentProperty()) {
                return this.getArmorClassInfo();
            }
            return null;
        };
        this.generateEnableComponentManagement = () => {
            if (this.generateVehicleBlockComponentHitPointInfo() !== null) {
                return true;
            }
            return false;
        };
        this.generateVehicleBlockComponentInfo = () => {
            const uniqueKey = this.getUniqueKey();
            return {
                actions: this.getActions().map((action) => {
                    return {
                        name: ActionAccessors.getName(action),
                        description: ActionAccessors.getDescription(action),
                        key: `${ActionAccessors.getName(action)}-${ActionAccessors.getUniqueKey(action)}`,
                        ammo: ActionAccessors.getAmmunition(action),
                    };
                }),
                count: 1,
                description: this.getDescription(),
                displayOrder: this.getDisplayOrder(),
                isPrimaryComponent: this.getIsPrimary(),
                isRemovable: this.getIsRemovable(),
                name: this.getName(),
                typeNames: this.getTypeNames(),
                coverType: this.generateVehicleComponentCoverType(),
                requiredCrew: this.generateVehicleComponentRequiredCrew(),
                key: uniqueKey,
                uniqueKey,
                uniquenessFactor: this.getUniquenessFactor(),
                id: this.getMappingId(),
                vehicleId: this.vehicle.getMappingId(),
                displayType: this.vehicle.getDisplayType(),
                armorClassInfo: this.generateVehicleComponentArmorClassInfo(),
                speedInfos: this.generateVehicleComponentSpeedInfos(),
                hitPointInfo: this.generateVehicleBlockComponentHitPointInfo(),
                enableComponentManagement: this.generateEnableComponentManagement(),
                costInfos: this.getCosts(),
                width: this.vehicle.getWidth(),
                length: this.vehicle.getLength(),
            };
        };
        this.params = params;
        this.vehicleComponent = params.vehicleComponent;
        this.vehicle = params.vehicle;
    }
    // Validators
    allowComponentProperty() {
        const primaryManageType = this.vehicle.getPrimaryComponentManageType();
        const isPrimaryComponent = this.getIsPrimary();
        return !(primaryManageType === VehicleConfigurationPrimaryComponentManageTypeEnum.VEHICLE && isPrimaryComponent);
    }
    generateVehicleComponentSpeedInfos() {
        const enableSpeeds = this.vehicle.getEnableComponentSpeeds();
        if (enableSpeeds && this.allowComponentProperty()) {
            return this.getSpeedInfos();
        }
        return [];
    }
    generateVehicleBlockComponentHitPointInfo() {
        if (!this.allowComponentProperty()) {
            return null;
        }
        const enableComponentHitPoints = this.vehicle.getEnableComponentHitPoints();
        if (!enableComponentHitPoints) {
            return null;
        }
        let damageThreshold = null;
        if (this.vehicle.getEnableComponentDamageThreshold()) {
            damageThreshold = this.getDamageThreshold();
        }
        let mishapThreshold = null;
        if (this.vehicle.getEnableComponentMishapThreshold()) {
            mishapThreshold = this.getMishapThreshold();
        }
        let componentHitPointInfo = this.getHitPointInfo();
        const definitionHitPoints = this.getHitPoints();
        return {
            remainingHp: componentHitPointInfo !== null ? componentHitPointInfo.remainingHp : definitionHitPoints,
            tempHp: componentHitPointInfo !== null ? componentHitPointInfo.tempHp : null,
            totalHp: componentHitPointInfo !== null ? componentHitPointInfo.totalHp : definitionHitPoints,
            removedHp: componentHitPointInfo !== null ? componentHitPointInfo.removedHp : 0,
            hitPointSpeedAdjustments: this.getHitPointSpeedAdjustments(),
            damageThreshold,
            mishapThreshold,
        };
    }
}
