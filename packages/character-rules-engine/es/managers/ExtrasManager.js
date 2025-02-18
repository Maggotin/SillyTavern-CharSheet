var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { groupBy } from 'lodash';
import * as ApiAdapterUtils from "../apiAdapter/utils";
import { CreatureRuleUtils } from "../engine/CreatureRule";
import { DefinitionTypeEnum } from "../engine/Definition";
import { DefinitionPoolUtils } from "../engine/DefinitionPool";
import { TypeScriptUtils } from "../utils";
import { characterActions, serviceDataActions } from '../actions';
import { CreatureAccessors, CreatureGroupFlagEnum, CreatureSimulators, DB_STRING_GROUP_SIDEKICK, DB_STRING_TAG_SIDEKICK, } from '../engine/Creature';
import { ExtraAccessors, ExtraGenerators, ExtraUtils, HACK_VEHICLE_GROUP_ID, } from '../engine/Extra';
import { RuleDataGenerators, RuleDataUtils } from '../engine/RuleData';
import { VehicleSimulators } from '../engine/Vehicle';
import { apiCreatorSelectors, rulesEngineSelectors, serviceDataSelectors } from '../selectors';
import { getExtraManager } from './ExtraManager';
import { MessageManager } from './MessageManager';
export class ExtrasManager extends MessageManager {
    constructor(params) {
        super(params);
        //Shoppe
        //TODO optimize to not make api calls when updates are called (see FeatShoppe)
        this.getExtrasShoppe = ({ groupId, onSuccess, additionalConfig, }) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const loadAvailableMonsters = apiCreatorSelectors.makeLoadAvailableMonsters(this.state);
            const loadAvailableVehicles = apiCreatorSelectors.makeLoadAvailableVehicles(this.state);
            const monsterResponse = (yield loadAvailableMonsters(additionalConfig));
            const vehicleResponse = yield loadAvailableVehicles(additionalConfig);
            // forced to do any because of stupid typings - pulled from ExtraManagePane - fix it eventually?
            const monsterResponseDefinitions = (_a = ApiAdapterUtils.getResponseData(monsterResponse)) !== null && _a !== void 0 ? _a : [];
            const vehicleResponseDefinitions = ApiAdapterUtils.getResponseData(vehicleResponse);
            const transformedCreatures = groupId !== null ? this.transformLoadedCreatures(monsterResponseDefinitions, groupId) : [];
            if (vehicleResponseDefinitions !== null && vehicleResponseDefinitions.definitionData.length > 0) {
                this.dispatch(serviceDataActions.definitionPoolAdd(vehicleResponseDefinitions.definitionData, vehicleResponseDefinitions.accessTypes));
            }
            const ruleData = rulesEngineSelectors.getRuleData(this.state);
            const definitionPool = serviceDataSelectors.getDefinitionPool(this.state);
            const vehicleDefinitions = DefinitionPoolUtils.getTypedDefinitionList(DefinitionTypeEnum.VEHICLE, definitionPool);
            let vehicles = vehicleDefinitions
                .map((vehicleDef) => VehicleSimulators.simulateVehicle(vehicleDef, definitionPool, ruleData))
                .filter(TypeScriptUtils.isNotNullOrUndefined)
                .map((vehicle) => this.generateVehicleExtraManager(vehicle));
            //TODO should this be something we store somehwere other than the shoppe?
            const creatureDefinitionLookup = monsterResponseDefinitions.reduce((lookup, definition) => {
                const id = definition.id;
                lookup[id] = definition;
                return lookup;
            }, {});
            const shoppeState = {
                creatureDefinitionLookup,
                creatureDefinitions: monsterResponseDefinitions,
                creatures: transformedCreatures.map((creature) => this.generateCreatureExtraManager(creature)),
                vehicles,
            };
            onSuccess(shoppeState);
            return shoppeState;
        });
        //Update Shoppe with a selected group
        this.updateExtrasShoppe = ({ currentShoppe, groupId, onSuccess, }) => {
            const transformedCreatures = groupId !== null ? this.transformLoadedCreatures(currentShoppe.creatureDefinitions, groupId) : [];
            const newShoppeState = Object.assign(Object.assign({}, currentShoppe), { creatures: transformedCreatures.map((creature) => this.generateCreatureExtraManager(creature)) });
            onSuccess(newShoppeState);
            return newShoppeState;
        };
        this.transformLoadedCreatures = (creatureDefinitions, groupId) => {
            const ruleData = rulesEngineSelectors.getRuleData(this.state);
            if (groupId === null) {
                return [];
            }
            return creatureDefinitions.map((definition) => CreatureSimulators.simulateCreature(definition, groupId, ruleData));
        };
        //TODO this could use some cleanup?
        this.getCreaturesFilteredByRules = (creatures, creatureDefinitionLookup, groupId) => {
            const creatureRules = rulesEngineSelectors.getCreatureRules(this.state);
            const creatureDatas = creatures.map((manager) => manager.simulateExtraData(groupId, creatureDefinitionLookup));
            let groupCreatures = this.getCreaturesFilteredByGroupFlags(creatureDatas, groupId);
            let filteredCreatures = [];
            let unmatchedCreatures = [...groupCreatures];
            let hasRules = false;
            creatureRules.forEach((rule) => {
                if (groupId === null || !CreatureRuleUtils.isRuleGroup(rule, groupId)) {
                    return;
                }
                let testableCreatures = [...unmatchedCreatures];
                unmatchedCreatures = [];
                testableCreatures.forEach((creature) => {
                    if (CreatureRuleUtils.isValidCreature(creature, rule)) {
                        filteredCreatures.push(creature);
                    }
                    else {
                        unmatchedCreatures.push(creature);
                    }
                });
                hasRules = true;
            });
            return hasRules
                ? filteredCreatures.map((creature) => this.generateCreatureExtraManager(creature))
                : groupCreatures.map((creature) => this.generateCreatureExtraManager(creature));
        };
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
        /**
         * @deprecated
         * should use ExtraManager
         */
        this.handleAdd = ({ extra, quantity, selectedGroup }, onSuccess, onError) => {
            var _a;
            const extraId = ExtraAccessors.getId(extra);
            if (ExtraUtils.isCreature(extra)) {
                if (selectedGroup && typeof extraId === 'number') {
                    let names = [];
                    if (quantity > 1) {
                        for (let i = 1; i <= quantity; i++) {
                            names.push(`${ExtraAccessors.getName(extra)} ${i}`);
                        }
                    }
                    else {
                        names.push(null);
                    }
                    this.dispatch(characterActions.creatureCreate(selectedGroup, extraId, names, this.handleAcceptOnSuccess(onSuccess)));
                }
            }
            else if (ExtraUtils.isVehicle(extra)) {
                if (typeof extraId === 'string') {
                    this.dispatch(serviceDataActions.vehicleMappingCreate(extraId, (_a = ExtraAccessors.getName(extra)) !== null && _a !== void 0 ? _a : 'Vehicle', this.handleAcceptOnSuccess(onSuccess)));
                }
            }
        };
        /**
         * @deprecated
         * should use ExtraManager
         */
        this.handleRemove = ({ extra }, onSuccess, onError) => {
            const mappingId = ExtraAccessors.getMappingId(extra);
            if (ExtraUtils.isCreature(extra)) {
                this.dispatch(characterActions.creatureRemove(mappingId));
            }
            else if (ExtraUtils.isVehicle(extra)) {
                this.dispatch(serviceDataActions.vehicleMappingRemove(mappingId));
            }
        };
        /**
         * @deprecated
         * should use ExtraManager
         */
        this.handleSetActive = ({ extra, isActive }, onSuccess, onError) => {
            this.dispatch(characterActions.creatureActiveSet(ExtraAccessors.getMappingId(extra), isActive));
        };
        //Getters?
        this.getCharacterExtras = () => {
            return rulesEngineSelectors.getExtras(this.state);
        };
        this.getCharacterExtraManagers = () => {
            return this.getCharacterExtras().map((extra) => getExtraManager(Object.assign(Object.assign({}, this.params), { extra })));
        };
        //START HERE!!!!!!!!!!!! Extras.tsx - manager :)
        // getCharacterVehicles = () => {
        // }
        // getAllVehicles = () => {
        // }
        /**
         * @deprecated
         * should use ExtraManager
         */
        this.getExtraData = (extra) => {
            if (ExtraUtils.isCreature(extra)) {
                const creatureLookup = rulesEngineSelectors.getCreatureLookup(this.state);
                return ExtraUtils.getTypedExtra(extra, creatureLookup);
            }
            else if (ExtraUtils.isVehicle(extra)) {
                const vehicleLookup = rulesEngineSelectors.getVehicleLookup(this.state);
                return ExtraUtils.getTypedExtra(extra, vehicleLookup);
            }
            else {
                return null;
            }
        };
        //UTILS
        //should this be in generators?
        this.generateExtrasGroupsManagers = (extraManagers) => {
            return groupBy(extraManagers, (extra) => extra.getGroupId());
        };
        //TODO these are probably managers - or use other filter utils
        this.getExtrasGroups = (filteredExtras) => {
            const extras = filteredExtras !== null && filteredExtras !== void 0 ? filteredExtras : this.getCharacterExtraManagers();
            return this.generateExtrasGroupsManagers(extras);
        };
        this.getGroupInfosForExtras = (filteredExtras) => {
            const ruleData = rulesEngineSelectors.getRuleData(this.state);
            const extraManagers = filteredExtras !== null && filteredExtras !== void 0 ? filteredExtras : this.getCharacterExtraManagers();
            const extras = extraManagers.map((manager) => manager.extra);
            return ExtraGenerators.generateCurrentExtraGroupInfos(extras, ruleData);
        };
        /**
         *
         * @deprecated for getGroupInfosForExtras
         */
        this.getCurrentGroupInfos = (filteredExtras) => {
            const ruleData = rulesEngineSelectors.getRuleData(this.state);
            const extras = filteredExtras !== null && filteredExtras !== void 0 ? filteredExtras : this.getCharacterExtras();
            return ExtraGenerators.generateCurrentExtraGroupInfos(extras, ruleData);
        };
        this.getGroupOptions = () => {
            const ruleData = rulesEngineSelectors.getRuleData(this.state);
            let creatureGroupOptions = RuleDataGenerators.getCreatureGroupGroupedOptions(ruleData);
            return [
                {
                    optGroupLabel: 'Creature',
                    options: creatureGroupOptions,
                },
                {
                    optGroupLabel: 'Object',
                    options: [
                        {
                            label: 'Vehicle',
                            value: HACK_VEHICLE_GROUP_ID,
                        },
                    ],
                },
            ];
        };
        this.hack__isSidekickGroup = (groupId) => {
            const creatureGroupInfo = this.getCreatureGroupInfo(groupId);
            return !!creatureGroupInfo && creatureGroupInfo.name === DB_STRING_GROUP_SIDEKICK;
        };
        //TODO move to CreatureManager or ExtraManager
        this.getCreatureGroupInfo = (groupId) => {
            if (groupId === null) {
                return null;
            }
            const ruleData = rulesEngineSelectors.getRuleData(this.state);
            return RuleDataUtils.getCreatureGroupInfo(groupId, ruleData);
        };
        //TODO move to CreatureManager or ExtraManager
        this.getCreaturesFilteredByGroupFlags = (creatures, groupId) => {
            if (groupId === null) {
                return creatures;
            }
            let groupInfo = this.getCreatureGroupInfo(groupId);
            if (groupInfo && groupInfo.flagInfoLookup[CreatureGroupFlagEnum.CANNOT_BE_SWARM]) {
                creatures = creatures.filter((creature) => !CreatureAccessors.isSwarm(creature));
            }
            if (this.hack__isSidekickGroup(groupId)) {
                creatures = creatures.filter((creature) => CreatureAccessors.getTags(creature).includes(DB_STRING_TAG_SIDEKICK));
            }
            return creatures;
        };
        this.getChallengeOptions = () => {
            const ruleData = rulesEngineSelectors.getRuleData(this.state);
            return RuleDataGenerators.getChallengeOptions(ruleData);
        };
        this.generateVehicleExtraManager = (vehicle) => {
            const ruleData = rulesEngineSelectors.getRuleData(this.state);
            return getExtraManager(Object.assign(Object.assign({}, this.params), { extra: ExtraGenerators.generateVehicleExtra(vehicle, ruleData) }));
        };
        this.generateCreatureExtraManager = (creature) => {
            const ruleData = rulesEngineSelectors.getRuleData(this.state);
            return getExtraManager(Object.assign(Object.assign({}, this.params), { extra: ExtraGenerators.generateCreatureExtra(creature, ruleData) }));
        };
        /**
         * @deprecated - for VehicleManager
         */
        this.generateVehicleMeta = (vehicle) => {
            const ruleData = rulesEngineSelectors.getRuleData(this.state);
            return ExtraGenerators.generateVehicleMeta(vehicle, ruleData);
        };
        this.generateCreatureMeta = (creature) => {
            const ruleData = rulesEngineSelectors.getRuleData(this.state);
            return ExtraGenerators.generateCreatureMeta(creature, ruleData);
        };
        /**
         * @deprecated
         * should use ExtraManager
         */
        this.getSourceNames = (extra) => {
            const ruleData = rulesEngineSelectors.getRuleData(this.state);
            const sources = this.getSources(extra);
            return sources
                .map((sourceMapping) => RuleDataUtils.getSourceDataInfo(sourceMapping.sourceId, ruleData))
                .filter(TypeScriptUtils.isNotNullOrUndefined)
                .map((sourceDataInfo) => sourceDataInfo.description)
                .filter(TypeScriptUtils.isNotNullOrUndefined);
        };
        //Accessors
        /**
         * @deprecated
         * should use ExtraManager
         */
        this.isCreature = (extra) => ExtraUtils.isCreature(extra);
        /**
         * @deprecated
         * should use ExtraManager
         */
        this.isVehicle = (extra) => ExtraUtils.isVehicle(extra);
        /**
         * @deprecated
         * should use ExtraManager
         */
        this.getName = (extra) => ExtraAccessors.getName(extra);
        /**
         * @deprecated
         * should use ExtraManager
         */
        this.getSources = (extra) => ExtraAccessors.getSources(extra);
        /**
         * @deprecated
         * should use ExtraManager
         */
        this.isHomebrew = (extra) => ExtraAccessors.isHomebrew(extra);
        /**
         * @deprecated
         * should use ExtraManager
         */
        this.getMetaText = (extra) => ExtraAccessors.getMetaText(extra);
        /**
         * @deprecated
         * should use ExtraManager
         */
        this.getUniqueKey = (extra) => ExtraAccessors.getUniqueKey(extra);
        this.params = params;
    }
}
