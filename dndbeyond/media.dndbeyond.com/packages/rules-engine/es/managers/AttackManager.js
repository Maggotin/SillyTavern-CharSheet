import { ActionAccessors } from "../engine/Action";
import { ItemAccessors, WeaponTypeEnum } from "../engine/Item";
import { RuleDataUtils } from "../engine/RuleData";
import { ActionManager, Constants, rulesEngineSelectors, } from "../index";
import { BaseManager } from './BaseManager';
export const attackManagerMap = new Map();
export const getAttackManager = (params) => {
    const { attack } = params;
    const key = attack.key;
    if (attackManagerMap.has(key)) {
        const attackManager = attackManagerMap.get(key);
        if (!attackManager) {
            throw new Error(`AttackManager for attack ${key} is null`);
        }
        if (attackManager.attack === attack) {
            return attackManager;
        }
    }
    const newAttackManager = new AttackManager(params);
    attackManagerMap.set(key, newAttackManager);
    return newAttackManager;
};
export class AttackManager extends BaseManager {
    constructor(params) {
        super(params);
        // Accessors
        this.getType = () => this.attack.type;
        this.getActivation = () => this.attack.activation;
        this.getData = () => this.attack.data;
        this.getKey = () => this.attack.key;
        // Utils
        this.isActionGroup = () => this.getActivation() === Constants.ActivationTypeEnum.ACTION;
        this.isBonusActionGroup = () => this.getActivation() === Constants.ActivationTypeEnum.BONUS_ACTION;
        this.isReactionGroup = () => this.getActivation() === Constants.ActivationTypeEnum.REACTION;
        this.isOtherGroup = () => {
            const activationType = this.getActivation();
            return (activationType !== Constants.ActivationTypeEnum.ACTION &&
                activationType !== Constants.ActivationTypeEnum.BONUS_ACTION &&
                activationType !== Constants.ActivationTypeEnum.REACTION);
        };
        this.getActionManager = () => {
            const action = this.getData();
            return ActionManager.getActionManager(ActionAccessors.getUniqueKey(action));
        };
        this.getLeveledSpellManager = (spellsManager) => {
            const spell = this.getData();
            return spellsManager.getLeveledSpellManagerBySpell(spell);
        };
        this.getItem = () => {
            return this.getData();
        };
        this.getItemActionMeta = () => {
            const item = this.getItem();
            const combinedMetaItems = [];
            const type = ItemAccessors.getType(item);
            if (type === WeaponTypeEnum.AMMUNITION) {
                combinedMetaItems.push('Ammunition');
            }
            else {
                const isHexWeapon = ItemAccessors.isHexWeapon(item);
                const isPactWeapon = ItemAccessors.isPactWeapon(item);
                const isDedicatedWeapon = ItemAccessors.isDedicatedWeapon(item);
                if (isHexWeapon || isPactWeapon || isDedicatedWeapon) {
                    if (isHexWeapon) {
                        combinedMetaItems.push('Hex Weapon');
                    }
                    if (isPactWeapon) {
                        combinedMetaItems.push('Pact Weapon');
                    }
                    if (isDedicatedWeapon) {
                        combinedMetaItems.push('Dedicated Weapon');
                    }
                }
                else {
                    const attackType = ItemAccessors.getAttackType(item);
                    let attackTypeName = '';
                    if (attackType) {
                        attackTypeName = RuleDataUtils.getAttackTypeRangeName(attackType);
                    }
                    combinedMetaItems.push(`${attackTypeName} Weapon`);
                }
            }
            if (ItemAccessors.isOffhand(item)) {
                combinedMetaItems.push('Dual Wield');
            }
            if (ItemAccessors.isAdamantine(item)) {
                combinedMetaItems.push('Adamantine');
            }
            if (ItemAccessors.isSilvered(item)) {
                combinedMetaItems.push('Silvered');
            }
            if (ItemAccessors.isCustomized(item)) {
                combinedMetaItems.push('Customized');
            }
            if (ItemAccessors.getMasteryName(item)) {
                combinedMetaItems.push('Mastery');
            }
            const metaItems = ItemAccessors.getMetaItems(item);
            return [...combinedMetaItems, ...metaItems];
        };
        this.getWeaponSpellDamageGroups = () => {
            return rulesEngineSelectors.getWeaponSpellDamageGroups(this.state);
        };
        this.params = params;
        this.attack = params.attack;
    }
}
