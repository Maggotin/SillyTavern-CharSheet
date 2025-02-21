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
import { AbilityAccessors } from "../engine/Ability";
import { FeatureFlagEnum } from "../engine/FeatureFlagInfo";
import { characterSelectors, featureFlagInfoSelectors, rulesEngineSelectors } from "../selectors";
import { getAbilityManager } from './AbilityManager';
import { FeatureFlagManager } from './FeatureFlagManager';
// import { BlessingManager, getBlessingManager } from './FeatureManager';
import { FeaturesManager } from './FeaturesManager';
import { transformAbilityScores } from './utils/modifierTransformers';
export class AttributesManager extends FeaturesManager {
    constructor(params) {
        super(params);
        this.getHighestAbilityScore = (abilities) => {
            let orderedAbilities = orderBy(abilities, [(ability) => ability.getTotalScore(), (ability) => ability.getLabel()], ['desc', 'asc']);
            return orderedAbilities[0];
        };
        this.params = params;
    }
    getAbilities() {
        return __awaiter(this, void 0, void 0, function* () {
            const abilities = rulesEngineSelectors.getAbilities(this.state);
            const featureFlagsManager = new FeatureFlagManager(featureFlagInfoSelectors.getFeatureFlagInfo(this.state));
            const hasAccessToBlessing = featureFlagsManager.getFlag(FeatureFlagEnum.RELEASE_GATE_GFS_BLESSINGS_UI);
            if (!hasAccessToBlessing) {
                return abilities.map((ability) => {
                    return getAbilityManager(Object.assign(Object.assign({}, this.params), { ability }));
                });
            }
            else {
                // TODO: GFS this is all the wrong place
                // it should just be
                // const abilities = getCharacter.abilities ...
                const validGlobalModifiers = this.getValidGlobalModifiers();
                const baseStats = characterSelectors.getStats(this.state);
                const ruleData = rulesEngineSelectors.getRuleData(this.state);
                const { generatedFeature } = transformAbilityScores(validGlobalModifiers, baseStats, ruleData);
                // TODO: GFS THERE IS SOME MORE TO DO HERE
                const characterFeatureManagers = yield this.getCharacterFeatures();
                // TODO: GFS this should be part of the process and I should just ask for the the object here.
                const myAbilityState = this.processCharacter(generatedFeature);
                return abilities.map((ability) => {
                    var _a, _b, _c, _d, _e, _f;
                    const name = (_b = (_a = AbilityAccessors.getLabel(ability)) === null || _a === void 0 ? void 0 : _a.toLowerCase()) !== null && _b !== void 0 ? _b : 'The ability with no name';
                    return getAbilityManager(Object.assign(Object.assign({}, this.params), { ability: Object.assign(Object.assign({}, ability), { maxStatScore: (_c = myAbilityState.attributes[name].max) !== null && _c !== void 0 ? _c : null, modifier: (_d = myAbilityState.attributes[name].modifier) !== null && _d !== void 0 ? _d : null, score: (_e = myAbilityState.attributes[name].value) !== null && _e !== void 0 ? _e : null, totalScore: (_f = myAbilityState.attributes[name].value) !== null && _f !== void 0 ? _f : null }) }));
                });
            }
        });
    }
    getAbilitiesWithoutBlessings() {
        const abilities = rulesEngineSelectors.getAbilities(this.state);
        return abilities.map((ability) => {
            return getAbilityManager(Object.assign(Object.assign({}, this.params), { ability }));
        });
    }
    getValidGlobalModifiers() {
        const validGlobalModifiers = rulesEngineSelectors.getValidGlobalModifiers(this.state);
        return validGlobalModifiers;
    }
}
