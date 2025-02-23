import { ActionAccessors } from "../engine/Action";
import { ActivationRenderers } from "../engine/Activation";
import { ClassFeatureUtils, ClassUtils, Constants, EntityUtils, HelperUtils, ItemUtils, RuleDataUtils, rulesEngineSelectors, } from "../index";
import { BaseManager } from './BaseManager';
export const actionManagerMap = new Map();
export const getActionManager = (params) => {
    const { action } = params;
    const key = action.uniqueKey;
    if (actionManagerMap.has(key)) {
        const actionManager = actionManagerMap.get(key);
        if (!actionManager) {
            throw new Error(`ActionManager for action ${key} is null`);
        }
        if (actionManager.action === action) {
            return actionManager;
        }
    }
    const newActionManager = new ActionManager(params);
    actionManagerMap.set(key, newActionManager);
    return newActionManager;
};
export class ActionManager extends BaseManager {
    constructor(params) {
        super(params);
        // Accessors
        this.getLimitedUse = () => ActionAccessors.getLimitedUse(this.action);
        this.getName = () => ActionAccessors.getName(this.action);
        this.getDataOrigin = () => ActionAccessors.getDataOrigin(this.action);
        this.getDataOriginType = () => ActionAccessors.getDataOriginType(this.action);
        this.getMappingId = () => ActionAccessors.getMappingId(this.action);
        this.getMappingEntityTypeId = () => ActionAccessors.getMappingEntityTypeId(this.action);
        this.getSnippet = () => ActionAccessors.getSnippet(this.action);
        this.getUniqueKey = () => ActionAccessors.getUniqueKey(this.action);
        this.getProficiency = () => ActionAccessors.isProficient(this.action);
        this.getDamage = () => ActionAccessors.getDamage(this.action);
        this.getRequiresAttackRoll = () => ActionAccessors.requiresAttackRoll(this.action);
        this.getToHit = () => ActionAccessors.getToHit(this.action);
        this.getRequiresSavingThrow = () => ActionAccessors.requiresSavingThrow(this.action);
        this.getSaveStatId = () => ActionAccessors.getSaveStatId(this.action);
        this.getAttackSaveValue = () => ActionAccessors.getAttackSaveValue(this.action);
        this.getAttackRangeId = () => ActionAccessors.getAttackRangeId(this.action);
        this.isOffhand = () => ActionAccessors.isOffhand(this.action);
        this.getActionTypeId = () => ActionAccessors.getActionTypeId(this.action);
        this.isCustomized = () => ActionAccessors.isCustomized(this.action);
        this.getAttackRange = () => ActionAccessors.getRange(this.action);
        this.getAttackReach = () => ActionAccessors.getReach(this.action);
        this.getActivation = () => ActionAccessors.getActivation(this.action);
        // Utils
        this.getClassLevel = () => ClassUtils.getLevel(this.getDataOrigin().parent); // when CLASS_FEATURE
        this.getScaleValue = () => ClassFeatureUtils.getLevelScale(this.getDataOrigin().primary); // when CLASS_FEATURE
        this.getItem = () => {
            // WHEN ITEM
            const inventoryLookup = rulesEngineSelectors.getInventoryLookup(this.state);
            const itemContract = this.getDataOrigin().primary;
            const itemMappingId = ItemUtils.getMappingId(itemContract);
            return HelperUtils.lookupDataOrFallback(inventoryLookup, itemMappingId);
        };
        this.getMetaItems = () => {
            const damage = this.getDamage();
            const attackTypeId = this.getAttackRangeId();
            let attackType = null;
            if (attackTypeId) {
                attackType = RuleDataUtils.getAttackTypeRangeName(attackTypeId);
            }
            const isOffhand = this.isOffhand();
            let combinedMetaItems = [];
            if (attackType) {
                combinedMetaItems.push(`${attackType} Attack`);
            }
            if (damage.isMartialArts) {
                combinedMetaItems.push('Martial Arts');
            }
            if (damage.value && damage.dataOrigin) {
                combinedMetaItems.push(EntityUtils.getDataOriginName(damage.dataOrigin));
            }
            switch (this.getActionTypeId()) {
                case Constants.ActionTypeEnum.WEAPON:
                    if (isOffhand) {
                        combinedMetaItems.push('Dual Wield');
                    }
                    break;
                default:
                // not implemented
            }
            if (this.isCustomized()) {
                combinedMetaItems.push('Customized');
            }
            return combinedMetaItems;
        };
        this.getActionType = (rangeType) => {
            const actionTypeId = this.getActionTypeId();
            let actionType = actionTypeId;
            switch (actionTypeId) {
                case Constants.ActionTypeEnum.WEAPON:
                    if (rangeType === Constants.AttackTypeRangeEnum.MELEE) {
                        actionType = Constants.ActionTypeEnum.GENERAL;
                    }
                    break;
                case Constants.ActionTypeEnum.GENERAL:
                    if (rangeType === Constants.AttackTypeRangeEnum.MELEE) {
                        actionType = Constants.ActionTypeEnum.WEAPON;
                    }
                    break;
                case Constants.ActionTypeEnum.SPELL:
                    break;
                default:
                //not implemented
            }
            return actionType;
        };
        this.getRenderedActivation = () => {
            let activation = this.getActivation();
            return activation
                ? ActivationRenderers.renderActivation(activation, rulesEngineSelectors.getRuleData(this.state))
                : null;
        };
        this.params = params;
        this.action = params.action;
    }
    static getActionManager(key) {
        const actionManager = actionManagerMap.get(key);
        if (!actionManager) {
            throw new Error(`ActionManager for action ${key} is null`);
        }
        return actionManager;
    }
}
