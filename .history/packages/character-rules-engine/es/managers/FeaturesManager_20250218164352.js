var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { generateCharacterState } from '../../character-gfs';
import { ApiRequests } from "../api";
import { ApiAdapterUtils } from "../apiAdapter";
import { getCurrentRulesEngineConfig } from "../config/utils";
import { HelperUtils } from "../engine/Helper";
import { apiCreatorSelectors, rulesEngineSelectors } from "../selectors";
import { TypeScriptUtils } from "../utils";
import { FeatureManager } from './FeatureManager';
import { MessageManager } from './MessageManager';
export const featureMap = new Map();
export const subscriptionsMap = new Map();
const featureManagerMap = new Map();
export const getFeatureManager = (params) => {
    const { feature } = params;
    const featureId = feature.featureId; //TODO GFS Accessors?
    if (featureManagerMap.has(featureId)) {
        const FeatureManager = featureManagerMap.get(featureId);
        if (!FeatureManager) {
            throw new Error(`FeatureManager for feature ${featureId} is null`);
        }
        if (FeatureManager.params.feature === feature) {
            return FeatureManager;
        }
    }
    const newFeatureManager = new FeatureManager(params);
    featureManagerMap.set(featureId, newFeatureManager);
    return newFeatureManager;
};
// we want this cached across all instances of the FeaturesManager
let rootCharacterFeatureManagers = null; // needs
let allCharacterFeatureManagers = null; // needs
let availableFeaturesResponseData = null; // not required to bust
export class FeaturesManager extends MessageManager {
    constructor(params = {}) {
        super(params);
        // these values are used for caching and may need to be busted when the character changes
        this.randomId = 0; // helpful for debugging
        this.runSubscriptions = () => {
            subscriptionsMap.forEach((cb) => cb());
        };
        this.transformLoadedFeatures = (features) => {
            return features.map((feature) => {
                featureMap.set(feature.featureId, feature);
                return getFeatureManager({ feature, runSubscriptions: this.runSubscriptions, bustCache: this.bustCache });
            });
        };
        this.getAvailableFeatures = (additionalConfig) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (availableFeaturesResponseData) {
                return availableFeaturesResponseData;
            }
            const loadFeatures = apiCreatorSelectors.makeLoadAvailableFeatures(this.state);
            const response = yield loadFeatures(additionalConfig);
            availableFeaturesResponseData = (_a = ApiAdapterUtils.getResponseData(response)) !== null && _a !== void 0 ? _a : [];
            availableFeaturesResponseData.map((feature) => {
                featureMap.set(feature.featureId, feature);
            });
            return availableFeaturesResponseData;
        });
        this.getFeaturesShoppe = (additionalConfig) => __awaiter(this, void 0, void 0, function* () {
            let data = yield this.getAvailableFeatures(additionalConfig);
            if (data) {
                return this.transformLoadedFeatures(data);
            }
            return [];
        });
        this.getAllCharacterFeatures = (rootCharacterFeatureIds) => __awaiter(this, void 0, void 0, function* () {
            var _b;
            if (allCharacterFeatureManagers) {
                return allCharacterFeatureManagers;
            }
            const allFeaturesAndSubFeatureResponse = yield ApiRequests.postFeaturesAndSubfeatures({
                featureIds: rootCharacterFeatureIds,
            });
            const allFeaturesAndSubFeatureData = (_b = ApiAdapterUtils.getResponseData(allFeaturesAndSubFeatureResponse)) !== null && _b !== void 0 ? _b : [];
            allFeaturesAndSubFeatureData.map((feature) => {
                featureMap.set(feature.featureId, feature);
            });
            const allFeaturesAndSubFeatureIds = allFeaturesAndSubFeatureData.map((feature) => feature.featureId);
            allCharacterFeatureManagers = allFeaturesAndSubFeatureIds
                .map((id) => {
                const feature = featureMap.get(id);
                return feature
                    ? getFeatureManager({ feature, runSubscriptions: this.runSubscriptions, bustCache: this.bustCache })
                    : null;
            })
                .filter(TypeScriptUtils.isNotNullOrUndefined);
            return allCharacterFeatureManagers || [];
        });
        this.bustCache = () => __awaiter(this, void 0, void 0, function* () {
            availableFeaturesResponseData = null;
            rootCharacterFeatureManagers = null;
            allCharacterFeatureManagers = null;
        });
        this.getCharacterFeatures = () => __awaiter(this, void 0, void 0, function* () {
            var _c;
            if (rootCharacterFeatureManagers) {
                return rootCharacterFeatureManagers;
            }
            const characterId = rulesEngineSelectors.getId(this.state);
            const characterFeatureResponse = yield ApiRequests.getCharacterFeatures({ characterId });
            const characterFeatureData = (_c = ApiAdapterUtils.getResponseData(characterFeatureResponse)) !== null && _c !== void 0 ? _c : [];
            const characterFeatureIds = characterFeatureData.map((feature) => feature.id);
            if (characterFeatureIds.length > 0) {
                yield this.getAvailableFeatures({
                    params: {
                        category: 'blessing',
                    },
                });
                yield this.getAllCharacterFeatures(characterFeatureIds);
            }
            rootCharacterFeatureManagers = characterFeatureIds
                .map((id) => {
                const feature = featureMap.get(id);
                return feature
                    ? getFeatureManager({ feature, runSubscriptions: this.runSubscriptions, bustCache: this.bustCache })
                    : null;
            })
                .filter(TypeScriptUtils.isNotNullOrUndefined);
            return rootCharacterFeatureManagers;
        });
        this.processCharacter = (generatedFeature) => {
            featureMap.set(generatedFeature.featureId, generatedFeature);
            return generateCharacterState({
                rootFeatureIds: [
                    generatedFeature.featureId,
                    ...((rootCharacterFeatureManagers === null || rootCharacterFeatureManagers === void 0 ? void 0 : rootCharacterFeatureManagers.map((featureManager) => featureManager.getId())) || []),
                ],
                featureMap,
            });
        };
        this.randomId = Math.floor(Math.random() * 1000000);
    }
}
// manage subscriptions
FeaturesManager.subscribeToUpdates = ({ onUpdate, shouldInit = true }) => {
    // TODO: maybe from lib.
    const mapKey = HelperUtils.generateGuid();
    // connect to redux for updates
    let unsubscribe;
    if (getCurrentRulesEngineConfig().store) {
        const store = getCurrentRulesEngineConfig().store;
        unsubscribe = store === null || store === void 0 ? void 0 : store.subscribe(() => {
            onUpdate();
        });
    }
    subscriptionsMap.set(mapKey, onUpdate);
    if (shouldInit) {
        onUpdate();
    }
    return () => {
        subscriptionsMap.delete(mapKey);
        if (unsubscribe) {
            unsubscribe();
        }
    };
};
