import { characterActions } from "../actions";
import { AbilityAccessors } from "../engine/Ability";
import { AbilityScoreStatTypeEnum } from "../engine/Core";
import { HelperUtils } from "../engine/Helper";
import { RuleDataAccessors } from "../engine/RuleData";
import { rulesEngineSelectors } from "../selectors";
import { FeaturesManager } from './FeaturesManager';
export const abilityDefinitionMap = new Map();
const abilityMangerMap = new Map();
export const getAbilityManager = (params) => {
    const { ability } = params;
    const abilityId = AbilityAccessors.getId(ability);
    if (abilityMangerMap.has(abilityId)) {
        const abilityManager = abilityMangerMap.get(abilityId);
        if (!abilityManager) {
            throw new Error(`AbilityManager for ability ${abilityId} is null`);
        }
        if (abilityManager.ability === ability) {
            return abilityManager;
        }
    }
    const newAbilityManager = new AbilityManager(params);
    abilityMangerMap.set(abilityId, newAbilityManager);
    return newAbilityManager;
};
export class AbilityManager extends FeaturesManager {
    constructor(params) {
        super(params);
        //Accessors
        this.getId = () => AbilityAccessors.getId(this.ability);
        this.getEntityTypeId = () => AbilityAccessors.getEntityTypeId(this.ability);
        this.getName = () => AbilityAccessors.getName(this.ability);
        this.getLabel = () => AbilityAccessors.getLabel(this.ability);
        this.getStatKey = () => AbilityAccessors.getStatKey(this.ability);
        this.getBaseScore = () => AbilityAccessors.getBaseScore(this.ability);
        this.getTotalScore = () => AbilityAccessors.getTotalScore(this.ability);
        this.getModifier = () => AbilityAccessors.getModifier(this.ability);
        this.getMaxStatScore = () => AbilityAccessors.getMaxStatScore(this.ability);
        this.getProficiencyLevel = () => AbilityAccessors.getProficiencyLevel(this.ability);
        this.getIsSaveProficiencyModified = () => AbilityAccessors.getIsSaveProficiencyModified(this.ability);
        this.getSave = () => AbilityAccessors.getSave(this.ability);
        this.getIsSaveModifierModified = () => AbilityAccessors.getIsSaveModifierModified(this.ability);
        this.getOverrideScore = () => AbilityAccessors.getOverrideScore(this.ability);
        this.getOtherBonus = () => AbilityAccessors.getOtherBonus(this.ability);
        this.getRacialBonus = () => AbilityAccessors.getRacialBonus(this.ability);
        this.getClassBonuses = () => AbilityAccessors.getClassBonuses(this.ability);
        this.getMiscBonus = () => AbilityAccessors.getMiscBonus(this.ability);
        this.getSetScore = () => AbilityAccessors.getSetScore(this.ability);
        this.getStackingBonus = () => AbilityAccessors.getStackingBonus(this.ability);
        this.getAllStatBonusSuppliers = () => AbilityAccessors.getAllStatBonusSuppliers(this.ability);
        this.getStatSetScoreSuppliers = () => AbilityAccessors.getStatSetScoreSuppliers(this.ability);
        this.getStatMaxBonusSuppliers = () => AbilityAccessors.getStatMaxBonusSuppliers(this.ability);
        this.getStackingBonusSuppliers = () => AbilityAccessors.getStackingBonusSuppliers(this.ability);
        //handlers
        this.handleScoreChange = (value) => {
            this.dispatch(characterActions.abilityScoreSet(this.getId(), AbilityScoreStatTypeEnum.BASE, value));
        };
        this.handleOverrideScoreChange = (value) => {
            const ruleData = rulesEngineSelectors.getRuleData(this.state);
            const minStatScore = RuleDataAccessors.getMinStatScore(ruleData);
            const maxStatScore = RuleDataAccessors.getMaxStatScore(ruleData);
            if (value !== null) {
                value = HelperUtils.clampInt(value, minStatScore, maxStatScore);
            }
            this.dispatch(characterActions.abilityScoreSet(this.getId(), AbilityScoreStatTypeEnum.OVERRIDE, value));
            return value;
        };
        this.handleOtherBonusChange = (value) => {
            // TODO: lets get a why to this
            const minBonusScore = -10;
            const maxBonusScore = 10;
            if (value !== null) {
                value = HelperUtils.clampInt(value, minBonusScore, maxBonusScore);
            }
            this.dispatch(characterActions.abilityScoreSet(this.getId(), AbilityScoreStatTypeEnum.BONUS, value));
            return value;
        };
        this.params = params;
        this.ability = params.ability;
    }
    //Rule data accessors
    getAbilityRuleData() {
        const ruleData = rulesEngineSelectors.getRuleData(this.state);
        const abilityDataLookup = RuleDataAccessors.getStatsLookup(ruleData);
        return abilityDataLookup[this.getId()];
    }
    getCompendiumText() {
        const abilityRuleData = this.getAbilityRuleData();
        // TODO: we should accessor all the things?
        // maybe gfs will be the time to do it?
        return abilityRuleData.compendiumText;
    }
}
