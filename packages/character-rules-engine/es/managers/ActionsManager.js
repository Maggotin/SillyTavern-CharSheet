import { orderBy } from 'lodash';
import { RuleDataUtils } from "../engine/RuleData";
import { Constants } from "../index";
import { getActionManager } from "./ActionManager";
import { getActivatableManager } from "./ActivatableManager";
import { getAttackManager } from "./AttackManager";
import { MessageManager } from "./MessageManager";
import { rulesEngineSelectors } from "../selectors";
export var ActivationGroupKeyEnum;
(function (ActivationGroupKeyEnum) {
    ActivationGroupKeyEnum["ACTIONS"] = "ACTIONS";
    ActivationGroupKeyEnum["BONUS_ACTIONS"] = "BONUS_ACTIONS";
    ActivationGroupKeyEnum["REACTIONS"] = "REACTIONS";
    ActivationGroupKeyEnum["OTHER"] = "OTHER";
})(ActivationGroupKeyEnum || (ActivationGroupKeyEnum = {}));
export class ActionsManager extends MessageManager {
    constructor(params) {
        super(params);
        this.params = params;
    }
    getActions() {
        const actions = rulesEngineSelectors.getActions(this.state);
        return actions.map((action) => getActionManager(Object.assign(Object.assign({}, this.params), { action })));
    }
    getCustomActions() {
        const customActions = rulesEngineSelectors.getCustomActions(this.state);
        return customActions.map((action) => getActionManager(Object.assign(Object.assign({}, this.params), { action })));
    }
    getAttacksPerActionInfo() {
        return rulesEngineSelectors.getAttacksPerActionInfo(this.state);
    }
    getAttackGroups() {
        const attackGroups = {};
        const attacks = rulesEngineSelectors.getAttacks(this.state);
        const attackManagers = attacks.map((attack) => getAttackManager(Object.assign(Object.assign({}, this.params), { attack })));
        attackGroups[ActivationGroupKeyEnum.ACTIONS] = attackManagers.filter((manager) => manager.isActionGroup());
        attackGroups[ActivationGroupKeyEnum.BONUS_ACTIONS] = attackManagers.filter((manager) => manager.isBonusActionGroup());
        attackGroups[ActivationGroupKeyEnum.REACTIONS] = attackManagers.filter((manager) => manager.isReactionGroup());
        attackGroups[ActivationGroupKeyEnum.OTHER] = attackManagers.filter((manager) => manager.isOtherGroup());
        return attackGroups;
    }
    getBasicActions() {
        const ruleData = rulesEngineSelectors.getRuleData(this.state);
        return ruleData.basicActions;
    }
    getBasicActionGroups() {
        const basicActionGroups = {};
        const ruleData = rulesEngineSelectors.getRuleData(this.state);
        const actionBasicActions = RuleDataUtils.getActivationTypeBasicActions(Constants.ActivationTypeEnum.ACTION, ruleData);
        const bonusBasicActions = RuleDataUtils.getActivationTypeBasicActions(Constants.ActivationTypeEnum.BONUS_ACTION, ruleData);
        const reactionBasicActions = RuleDataUtils.getActivationTypeBasicActions(Constants.ActivationTypeEnum.REACTION, ruleData);
        const otherBasicActions = [
            ...RuleDataUtils.getActivationTypeBasicActions(Constants.ActivationTypeEnum.NO_ACTION, ruleData),
            ...RuleDataUtils.getActivationTypeBasicActions(Constants.ActivationTypeEnum.MINUTE, ruleData),
            ...RuleDataUtils.getActivationTypeBasicActions(Constants.ActivationTypeEnum.HOUR, ruleData),
            ...RuleDataUtils.getActivationTypeBasicActions(Constants.ActivationTypeEnum.SPECIAL, ruleData),
        ];
        basicActionGroups[ActivationGroupKeyEnum.ACTIONS] = ActionsManager.sortBasicActions(actionBasicActions);
        basicActionGroups[ActivationGroupKeyEnum.BONUS_ACTIONS] = ActionsManager.sortBasicActions(bonusBasicActions);
        basicActionGroups[ActivationGroupKeyEnum.REACTIONS] = ActionsManager.sortBasicActions(reactionBasicActions);
        basicActionGroups[ActivationGroupKeyEnum.OTHER] = ActionsManager.sortBasicActions(otherBasicActions);
        return basicActionGroups;
    }
    static sortBasicActions(basicActions) {
        return orderBy(basicActions, [(basicAction) => basicAction.name], ['asc']);
    }
    getActionGroups() {
        const actionGroups = {};
        const activatables = rulesEngineSelectors.getActivatables(this.state);
        const activatableManagers = activatables.map((activatable) => getActivatableManager(Object.assign(Object.assign({}, this.params), { activatable })));
        actionGroups[ActivationGroupKeyEnum.ACTIONS] = activatableManagers.filter((manager) => manager.isActionGroup());
        actionGroups[ActivationGroupKeyEnum.BONUS_ACTIONS] = activatableManagers.filter((manager) => manager.isBonusActionGroup());
        actionGroups[ActivationGroupKeyEnum.REACTIONS] = activatableManagers.filter((manager) => manager.isReactionGroup());
        actionGroups[ActivationGroupKeyEnum.OTHER] = activatableManagers.filter((manager) => manager.isOtherGroup());
        return actionGroups;
    }
    getRitualSpellGroups() {
        const ritualSpellGroups = {};
        const ritualSpells = rulesEngineSelectors.getRitualSpells(this.state);
        ritualSpellGroups[ActivationGroupKeyEnum.ACTIONS] = [];
        ritualSpellGroups[ActivationGroupKeyEnum.BONUS_ACTIONS] = [];
        ritualSpellGroups[ActivationGroupKeyEnum.REACTIONS] = [];
        ritualSpellGroups[ActivationGroupKeyEnum.OTHER] = ritualSpells;
        return ritualSpellGroups;
    }
}
