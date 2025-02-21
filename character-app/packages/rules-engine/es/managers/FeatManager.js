import { characterActions } from "../actions";
import { ChoiceUtils } from "../engine/Choice";
import { DisplayConfigurationTypeEnum } from "../engine/Core";
import { DataOriginTypeEnum } from "../engine/DataOrigin";
import { DefinitionHacks } from "../engine/Definition";
import { FeatAccessors, FeatUtils } from "../engine/Feat";
import { PrerequisiteUtils, PrerequisiteValidators } from "../engine/Prerequisite";
import { RuleDataUtils } from "../engine/RuleData";
import { SourceUtils } from "../engine/Source";
import { rulesEngineSelectors } from "../selectors";
import { BaseManager } from './BaseManager';
export const featDefinitionMap = new Map();
const featMangerMap = new Map();
export const getFeatManager = (params) => {
    const { feat } = params;
    const featId = FeatAccessors.getId(feat);
    if (featMangerMap.has(featId)) {
        const FeatManager = featMangerMap.get(featId);
        if (!FeatManager) {
            throw new Error(`FeatManager for feat ${featId} is null`);
        }
        if (FeatManager.params.feat === feat) {
            return FeatManager;
        }
    }
    const newFeatManager = new FeatManager(params);
    featMangerMap.set(featId, newFeatManager);
    return newFeatManager;
};
export class FeatManager extends BaseManager {
    constructor(params) {
        super(params);
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
        this.handleAdd = (onSuccess, onError) => {
            return this.dispatch(characterActions.adhocFeatCreate(this.getId()));
        };
        this.handleRemove = (onSuccess, onError) => {
            featMangerMap.delete(this.getId());
            return this.dispatch(characterActions.adhocFeatRemove(this.getId()));
        };
        //Accessors
        this.getId = () => FeatAccessors.getId(this.feat);
        this.getEntityTypeId = () => FeatAccessors.getEntityTypeId(this.feat);
        this.getName = () => FeatAccessors.getName(this.feat);
        this.getDataOrigin = () => FeatAccessors.getDataOrigin(this.feat);
        this.getDataOriginType = () => FeatAccessors.getDataOriginType(this.feat);
        this.getActions = () => FeatAccessors.getActions(this.feat);
        this.getChoices = () => FeatAccessors.getChoices(this.feat);
        this.getOptions = () => FeatAccessors.getOptions(this.feat);
        this.getSpells = () => FeatAccessors.getSpells(this.feat);
        this.getPrerequisites = () => FeatAccessors.getPrerequisites(this.feat);
        this.getPrerequisiteDescription = () => FeatAccessors.getPrerequisiteDescription(this.feat);
        this.getDescription = () => FeatAccessors.getDescription(this.feat);
        this.getSources = () => FeatAccessors.getSources(this.feat);
        this.getSnippet = () => FeatAccessors.getSnippet(this.feat);
        this.isRepeatable = () => FeatAccessors.isRepeatable(this.feat);
        this.getRepeatableParentId = () => FeatAccessors.getRepeatableParentId(this.feat);
        this.isHomebrew = () => FeatAccessors.isHomebrew(this.feat);
        this.getDefinition = () => FeatAccessors.getDefinition(this.feat);
        // Possible TODO for the future: We may add data to Entity Tags to distinguish
        // user-facing categories from technical-only tags.
        this.getCategories = () => FeatAccessors.getCategories(this.feat);
        //Utils
        this.getPrerequisiteFailures = () => {
            const prerequisiteData = rulesEngineSelectors.getPrerequisiteData(this.state);
            return PrerequisiteUtils.getPrerequisiteGroupingFailures(this.getPrerequisites(), prerequisiteData);
        };
        this.getRepeatableGroupId = () => FeatUtils.getRepeatableGroupId(this.feat);
        this.isRepeatableFeatParent = () => this.isRepeatable() && this.getRepeatableParentId() === null;
        this.getDefinitionKey = () => {
            return DefinitionHacks.hack__generateDefinitionKey(this.getEntityTypeId(), this.getId());
        };
        this.getHelperText = () => {
            return RuleDataUtils.getBuilderHelperTextByDefinitionKeys([this.getDefinitionKey()], rulesEngineSelectors.getRuleData(this.state), DisplayConfigurationTypeEnum.FEAT);
        };
        //validate that a feat meets its prereqs
        this.canAdd = () => {
            const prerequisiteData = rulesEngineSelectors.getPrerequisiteData(this.state);
            const prereqs = this.getPrerequisites();
            return PrerequisiteValidators.validatePrerequisiteGrouping(prereqs, prerequisiteData);
        };
        this.isHiddenFeat = () => FeatUtils.isHiddenFeat(this.feat);
        this.isSimulatedRepeatableFeat = () => {
            return this.isRepeatable() && this.getDataOriginType() === DataOriginTypeEnum.SIMULATED;
        };
        this.getPrimarySourceName = () => this.isHomebrew()
            ? 'Homebrew'
            : SourceUtils.getSourceFullNames(this.getSources(), rulesEngineSelectors.getRuleData(this.state))[0];
        this.getSourceCategory = () => {
            var _a;
            const ruleData = rulesEngineSelectors.getRuleData(this.state);
            const sources = this.getSources();
            if (sources.length === 0)
                return null;
            const sourceData = RuleDataUtils.getSourceDataInfo(sources[0].sourceId, ruleData);
            return (_a = sourceData === null || sourceData === void 0 ? void 0 : sourceData.sourceCategory) !== null && _a !== void 0 ? _a : null;
        };
        this.params = params;
        this.feat = params.feat;
    }
    static getFeatManager(id) {
        const featManager = featMangerMap.get(id);
        if (!featManager) {
            throw new Error(`featManager for feat ${id} is null`);
        }
        return featManager;
    }
    handleChoiceChange(featId, choiceType, choiceId, optionValue) {
        this.dispatch(characterActions.featChoiceSetRequest(featId, choiceType, choiceId, optionValue));
    }
    hasUnfinishedChoices() {
        return this.getUnfinishedChoices().length > 0;
    }
    getUnfinishedChoices() {
        return this.getChoices().filter((choice) => ChoiceUtils.isTodo(choice));
    }
}
