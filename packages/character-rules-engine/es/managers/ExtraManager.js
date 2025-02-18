import { CreatureSimulators } from "../engine/Creature";
import { DefinitionGenerators } from "../engine/Definition";
import { DefinitionPoolUtils } from "../engine/DefinitionPool";
import { HelperUtils } from "../engine/Helper";
import { RuleDataUtils } from "../engine/RuleData";
import { VehicleSimulators } from "../engine/Vehicle";
import { TypeScriptUtils } from "../utils";
import { characterActions, serviceDataActions } from '../actions';
import { ExtraAccessors, ExtraUtils } from '../engine/Extra';
import { rulesEngineSelectors, serviceDataSelectors } from '../selectors';
import { BaseManager } from './BaseManager';
import { getVehicleManager } from './VehicleManager';
const extraManagerMap = new Map();
export const getExtraManager = (params) => {
    const { extra } = params;
    const extraId = ExtraAccessors.getId(extra);
    if (extraManagerMap.has(extraId)) {
        const extraManager = extraManagerMap.get(extraId);
        if (!extraManager) {
            throw new Error(`ExtraManager for extra ${extraId} is null`);
        }
        if (extraManager.extra === extra) {
            return extraManager;
        }
    }
    const newExtraManger = new ExtraManager(params);
    extraManagerMap.set(extraId, newExtraManger);
    return newExtraManger;
};
export class ExtraManager extends BaseManager {
    constructor(params) {
        super(params);
        //Handlers
        this.handleAcceptOnSuccess = (onSuccess) => {
            return () => {
                typeof onSuccess === 'function' && onSuccess();
            };
        };
        this.handleRejectOnError = (onError) => {
            return () => {
                typeof onError === 'function' && onError();
            };
        };
        this.handleAdd = ({ quantity, selectedGroup }, onSuccess, onError) => {
            var _a;
            const extraId = this.getId();
            if (this.isCreature()) {
                if (selectedGroup && typeof extraId === 'number') {
                    let names = [];
                    if (quantity > 1) {
                        for (let i = 1; i <= quantity; i++) {
                            names.push(`${this.getName()} ${i}`);
                        }
                    }
                    else {
                        names.push(null);
                    }
                    this.dispatch(characterActions.creatureCreate(selectedGroup, extraId, names, this.handleAcceptOnSuccess(onSuccess)));
                }
            }
            else if (this.isVehicle()) {
                if (typeof extraId === 'string') {
                    this.dispatch(serviceDataActions.vehicleMappingCreate(extraId, (_a = this.getName()) !== null && _a !== void 0 ? _a : 'Vehicle', this.handleAcceptOnSuccess(onSuccess)));
                }
            }
        };
        this.handleRemove = (onSuccess, onError) => {
            const mappingId = this.getMappingId();
            if (this.isCreature()) {
                this.dispatch(characterActions.creatureRemove(mappingId));
            }
            else if (this.isVehicle()) {
                this.getExtraData().handleRemove();
            }
        };
        this.handleSetActive = ({ isActive }, onSuccess, onError) => {
            this.dispatch(characterActions.creatureActiveSet(this.getMappingId(), isActive));
        };
        this.getExtraData = () => {
            if (this.isCreature()) {
                //this lookup is only creatures mapped to the character
                const creatureLookup = rulesEngineSelectors.getCreatureLookup(this.state);
                return ExtraUtils.getTypedExtra(this.extra, creatureLookup);
            }
            else if (this.isVehicle()) {
                //this lookup is only vehicles mapped to the character
                const vehicleLookup = rulesEngineSelectors.getVehicleLookup(this.state);
                const vehicle = ExtraUtils.getTypedExtra(this.extra, vehicleLookup);
                if (vehicle === null) {
                    return null;
                }
                return getVehicleManager({ vehicle });
            }
            else {
                return null;
            }
        };
        //TODO this could probably use some clean up and not have to pass in the lookup etc. maybe make the lookup as a selector? or put creatures in the definitionPool?
        this.simulateExtraData = (groupId, creatureLookup) => {
            const ruleData = rulesEngineSelectors.getRuleData(this.state);
            if (this.isCreature()) {
                const definition = HelperUtils.lookupDataOrFallback(creatureLookup !== null && creatureLookup !== void 0 ? creatureLookup : {}, this.getId());
                if (!definition || groupId === null) {
                    return null;
                }
                return CreatureSimulators.simulateCreature(definition, groupId, ruleData);
            }
            else if (this.isVehicle()) {
                const definitionPool = serviceDataSelectors.getDefinitionPool(this.state);
                const type = this.getType();
                if (!type) {
                    return null;
                }
                const vehicleDefinitionKey = DefinitionGenerators.generateDefinitionKey(type, String(this.getId()));
                const vehicleDefinition = DefinitionPoolUtils.getVehicleDefinition(vehicleDefinitionKey, definitionPool);
                if (!vehicleDefinition) {
                    return null;
                }
                const vehicle = VehicleSimulators.simulateVehicle(vehicleDefinition, definitionPool, ruleData);
                if (vehicle === null) {
                    return null;
                }
                return getVehicleManager({
                    vehicle,
                });
            }
            else {
                return null;
            }
        };
        //Utils
        this.getSourceNames = () => {
            const ruleData = rulesEngineSelectors.getRuleData(this.state);
            //TODO could/should use SourceUtils.getSourceFullNames
            const sources = this.getSources();
            return sources
                .map((sourceMapping) => RuleDataUtils.getSourceDataInfo(sourceMapping.sourceId, ruleData))
                .filter(TypeScriptUtils.isNotNullOrUndefined)
                .map((sourceDataInfo) => sourceDataInfo.description)
                .filter(TypeScriptUtils.isNotNullOrUndefined);
        };
        this.getEnvironmentNames = () => {
            const ruleData = rulesEngineSelectors.getRuleData(this.state);
            let names = [];
            this.getEnvironments().forEach((id) => {
                const name = RuleDataUtils.getEnvironmentName(id, ruleData);
                if (name !== '') {
                    names.push(name);
                }
            });
            return names;
        };
        //Accessors
        this.isCreature = () => ExtraUtils.isCreature(this.extra);
        this.isVehicle = () => ExtraUtils.isVehicle(this.extra);
        this.getName = () => ExtraAccessors.getName(this.extra);
        this.getSources = () => ExtraAccessors.getSources(this.extra);
        this.isHomebrew = () => ExtraAccessors.isHomebrew(this.extra);
        this.getMetaText = () => ExtraAccessors.getMetaText(this.extra);
        this.getUniqueKey = () => ExtraAccessors.getUniqueKey(this.extra);
        this.getGroupId = () => ExtraAccessors.getGroupId(this.extra);
        this.getId = () => ExtraAccessors.getId(this.extra);
        this.getMappingId = () => ExtraAccessors.getMappingId(this.extra);
        this.getTags = () => ExtraAccessors.getTags(this.extra);
        this.getEnvironments = () => ExtraAccessors.getEnvironments(this.extra);
        this.getMovementNames = () => ExtraAccessors.getMovementNames(this.extra);
        this.getMovementInfo = () => ExtraAccessors.getMovementInfo(this.extra);
        this.getFilterTypes = () => ExtraAccessors.getFilterTypes(this.extra);
        this.getSearchTags = () => ExtraAccessors.getSearchTags(this.extra);
        this.getSizeInfo = () => ExtraAccessors.getSizeInfo(this.extra);
        this.getType = () => ExtraAccessors.getType(this.extra);
        this.getHitPointInfo = () => ExtraAccessors.getHitPointInfo(this.extra);
        this.getArmorClassInfo = () => ExtraAccessors.getArmorClassInfo(this.extra);
        this.getAvatarUrl = () => ExtraAccessors.getAvatarUrl(this.extra);
        this.getNoteComponents = () => ExtraAccessors.getNoteComponents(this.extra);
        this.getExtraType = () => ExtraAccessors.getExtraType(this.extra);
        this.isCustomized = () => ExtraAccessors.isCustomized(this.extra);
        this.params = params;
        this.extra = params.extra;
        if (!this.extra) {
            throw new Error('constructed without Extra');
        }
    }
}
