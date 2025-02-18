import { ActionAccessors } from "../engine/Action";
import { ActivatableTypeEnum } from "../engine/Core";
import { ActionManager, Constants } from "../index";
import { BaseManager } from './BaseManager';
export const activatableManagerMap = new Map();
export const getActivatableManager = (params) => {
    const { activatable } = params;
    const key = activatable.key;
    if (activatableManagerMap.has(key)) {
        const activatableManager = activatableManagerMap.get(key);
        if (!activatableManager) {
            throw new Error(`ActivatableManager for activatable ${key} is null`);
        }
        if (activatableManager.activatable === activatable) {
            return activatableManager;
        }
    }
    const newActivatableManager = new ActivatableManager(params);
    activatableManagerMap.set(key, newActivatableManager);
    return newActivatableManager;
};
export class ActivatableManager extends BaseManager {
    constructor(params) {
        super(params);
        // Accessors
        this.getSortText = () => this.activatable.sortText;
        this.getType = () => this.activatable.type;
        this.getActivationType = () => this.activatable.activation.activationType;
        this.getEntity = () => this.activatable.entity;
        this.getEntityAsActionManager = () => {
            const action = this.getEntity();
            return ActionManager.getActionManager(ActionAccessors.getUniqueKey(action));
        };
        // Utils
        this.isFeature = () => {
            const type = this.getType();
            return type !== ActivatableTypeEnum.CLASS_SPELL && type !== ActivatableTypeEnum.CHARACTER_SPELL;
        };
        this.isSpell = () => {
            const type = this.getType();
            return type === ActivatableTypeEnum.CLASS_SPELL || type === ActivatableTypeEnum.CHARACTER_SPELL;
        };
        this.isAction = () => this.getType() === ActivatableTypeEnum.ACTION;
        this.isActionGroup = () => this.getActivationType() === Constants.ActivationTypeEnum.ACTION && !this.isSpell();
        this.isBonusActionGroup = () => this.getActivationType() === Constants.ActivationTypeEnum.BONUS_ACTION;
        this.isReactionGroup = () => this.getActivationType() === Constants.ActivationTypeEnum.REACTION;
        this.isOtherGroup = () => {
            const activationType = this.getActivationType();
            return (activationType !== Constants.ActivationTypeEnum.ACTION &&
                activationType !== Constants.ActivationTypeEnum.BONUS_ACTION &&
                activationType !== Constants.ActivationTypeEnum.REACTION);
        };
        this.params = params;
        this.activatable = params.activatable;
    }
}
