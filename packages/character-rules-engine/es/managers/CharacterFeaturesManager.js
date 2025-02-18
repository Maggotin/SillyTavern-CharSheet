var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { orderBy } from 'lodash';
import { characterActions } from "../actions";
import { ApiAdapterUtils } from "../apiAdapter";
import { CharacterUtils } from "../engine/Character";
import { FeatAccessors, FeatSimulators } from "../engine/Feat";
import { HelperUtils } from "../engine/Helper";
import { featDefinitionMap, getFeatManager } from "./FeatManager";
import { apiCreatorSelectors, rulesEngineSelectors } from "../selectors";
import { FeaturesManager } from './FeaturesManager';
export class CharacterFeaturesManager extends FeaturesManager {
    constructor(params) {
        super(params);
        //TODO GFS THIS!!!!
        this.getBlessings = () => __awaiter(this, void 0, void 0, function* () {
            // TODO get the blessings only?
            /**
             * this could be on the character obj under blessings key
             */
            const blessingManagers = yield this.getCharacterFeatures();
            this.blessingManagers = blessingManagers;
            return blessingManagers;
        });
        this.getBlessing = (id) => { var _a; return (_a = this.blessingManagers.find((blessing) => id === blessing.getId())) !== null && _a !== void 0 ? _a : null; };
        // TODO is there value in moving these to hasFeatures and hasBlessings
        this.hasBlessings = () => __awaiter(this, void 0, void 0, function* () {
            const blessings = yield this.getBlessings();
            return blessings.length > 0;
        });
        this.hasBlessing = (blessing) => !!this.blessingManagers.find((characterBlessing) => characterBlessing.getId() === blessing.getId());
        this.handlePreferenceChange = (preferenceKey, value) => {
            const typedPrefKey = CharacterUtils.getPreferenceKey(preferenceKey);
            if (typedPrefKey !== null) {
                this.dispatch(characterActions.preferenceChoose(typedPrefKey, value));
            }
        };
        this.params = params;
        this.blessingManagers = [];
    }
    mapFeatsToManagers(feats) {
        return feats.map((feat) => getFeatManager(Object.assign(Object.assign({}, this.params), { feat })));
    }
    /**
     * Gets feat managers for all of the feats on the character.
     */
    getFeats() {
        const feats = rulesEngineSelectors.getFeats(this.state);
        return this.mapFeatsToManagers(feats);
    }
    /**
     * Gets feat managers for all feats except those tagged as being data origin only.
     */
    getStandardFeats() {
        const feats = rulesEngineSelectors.getStandardFeats(this.state);
        return this.mapFeatsToManagers(feats);
    }
    /**
     * Gets feat managers for feats with the designated primary data origin,
     * but only for feats that are tagged as being data origin only.
     * Useful for secret feats that come from Class Features or Racial Traits
     */
    getDataOriginOnlyFeatsByPrimary(primaryType, primaryId) {
        var _a;
        const lookup = rulesEngineSelectors.getDataOriginOnlyFeatLookup(this.state);
        const feats = (_a = lookup.byPrimary[primaryType][primaryId]) !== null && _a !== void 0 ? _a : [];
        return this.mapFeatsToManagers(feats);
    }
    /**
     * Gets feat managers for feats with the designated parent data origin,
     * but only for feats that are tagged as being data origin only.
     * Useful for secret feats that come from Backgrounds via Feat Lists
     */
    getDataOriginOnlyFeatsByParent(parentType, parentId) {
        var _a;
        const lookup = rulesEngineSelectors.getDataOriginOnlyFeatLookup(this.state);
        const feats = (_a = lookup.byParent[parentType][parentId]) !== null && _a !== void 0 ? _a : [];
        return this.mapFeatsToManagers(feats);
    }
    getFeatLookup() {
        return HelperUtils.generateNonNullLookup(this.getFeats(), (feat) => feat.getId());
    }
    getFeatById(id) {
        return HelperUtils.lookupDataOrFallback(this.getFeatLookup(), id);
    }
    updateFeatShoppe(currentShoppe) {
        const feats = currentShoppe.map((manager) => {
            const currentManager = this.getFeatById(manager.getId());
            if (currentManager) {
                return currentManager;
            }
            else {
                const featDefinitionContract = featDefinitionMap.get(manager.getId());
                if (featDefinitionContract) {
                    const simFeat = FeatSimulators.simulateFeat(featDefinitionContract);
                    return getFeatManager(Object.assign(Object.assign({}, this.params), { feat: simFeat }));
                }
                return manager;
            }
        });
        return feats;
    }
    transformLoadedFeats(data) {
        const feats = data.map((definition) => {
            featDefinitionMap.set(definition.id, definition);
            const simFeat = FeatSimulators.simulateFeat(definition);
            const featManager = this.getFeatById(FeatAccessors.getId(simFeat));
            return featManager ? featManager : getFeatManager(Object.assign(Object.assign({}, this.params), { feat: simFeat }));
        });
        return orderBy(feats, (feat) => feat.getName());
    }
    getFeatShoppe(additionalConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            const loadFeats = apiCreatorSelectors.makeLoadAvailableFeats(this.state);
            const response = yield loadFeats(additionalConfig);
            let data = ApiAdapterUtils.getResponseData(response);
            if (data) {
                return this.transformLoadedFeats(data);
            }
            return [];
        });
    }
    getBlessingShoppe(additionalConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            const blessings = yield this.getFeaturesShoppe({
                params: {
                    category: 'blessing',
                },
            });
            return orderBy(blessings, (blessing) => blessing.getName());
        });
    }
    //UTILS
    // filter to only allow one of each simulated repeatable feat group
    filterUniqueSimulatedRepeatableFeats(feats, parentFeats) {
        const tracker = new Set();
        return feats.filter((feat) => {
            if (!feat.isSimulatedRepeatableFeat()) {
                return true;
            }
            const repeatableGroupId = feat.getRepeatableGroupId();
            if (repeatableGroupId !== null) {
                // find the parent of repeatable feat group
                const parentFeat = parentFeats.find((f) => f.getId() === repeatableGroupId);
                // don't include repeatable feats if the parent is not added
                if (parentFeat === null || parentFeat === void 0 ? void 0 : parentFeat.isSimulatedRepeatableFeat()) {
                    return parentFeat.getId() === feat.getId();
                }
                if (tracker.has(repeatableGroupId)) {
                    return false;
                }
                tracker.add(repeatableGroupId);
                return true;
            }
            return false;
        });
    }
    //get an array of feats that are available to be added to the character
    getAvailableFeats(feats) {
        const available = feats.filter((feat) => feat.canAdd());
        const allRepeatableParentFeats = feats.filter((feat) => feat.isRepeatableFeatParent());
        return this.filterUniqueSimulatedRepeatableFeats(available, allRepeatableParentFeats);
    }
    //get an array of feats that are not available to be added to the character due to prerequisites not being met
    getUnavailableFeats(feats) {
        const getUnavailableFeats = feats.filter((feat) => !feat.canAdd());
        const allRepeatableParentFeats = feats.filter((feat) => feat.isRepeatableFeatParent());
        return this.filterUniqueSimulatedRepeatableFeats(getUnavailableFeats, allRepeatableParentFeats);
    }
    // PREFERENCES
    getEnforceFeatRules() {
        const preferences = rulesEngineSelectors.getCharacterPreferences(this.state);
        return preferences.enforceFeatRules;
    }
    setEnforceFeatRules(value) {
        const preferenceKey = 'enforceFeatRules';
        this.handlePreferenceChange(preferenceKey, value);
    }
}
