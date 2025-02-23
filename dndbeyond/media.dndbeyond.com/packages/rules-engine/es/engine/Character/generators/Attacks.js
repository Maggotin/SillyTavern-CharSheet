import { orderBy } from 'lodash';
import { ActionAccessors } from '../../Action';
import { ActivationAccessors, ActivationTypeEnum } from '../../Activation';
import { ItemAccessors } from '../../Item';
import { ModifierAccessors, ModifierValidators } from '../../Modifier';
import { SpellAccessors } from '../../Spell';
import { AttackSourceTypeEnum } from '../constants';
/**
 *
 * @param actions
 * @param itemAttacks
 * @param spellAttackList
 * @param customAttacks
 */
export function generateAttacks(actions, itemAttacks, spellAttackList, customAttacks) {
    const attacks = [];
    itemAttacks.forEach((attack) => {
        let activation = ActivationTypeEnum.ACTION;
        if (ItemAccessors.isOffhand(attack)) {
            activation = ActivationTypeEnum.BONUS_ACTION;
        }
        attacks.push({
            type: AttackSourceTypeEnum.ITEM,
            key: `${AttackSourceTypeEnum.ITEM}-${attack.id}`,
            activation,
            data: attack,
        });
    });
    spellAttackList.forEach((attack) => {
        attacks.push({
            type: AttackSourceTypeEnum.SPELL,
            key: `${AttackSourceTypeEnum.SPELL}-${SpellAccessors.getUniqueKey(attack)}`,
            activation: SpellAccessors.getActivationType(attack),
            data: attack,
        });
    });
    actions.forEach((action, idx) => {
        if (!ActionAccessors.displayAsAttack(action)) {
            return;
        }
        attacks.push({
            type: AttackSourceTypeEnum.ACTION,
            key: `${AttackSourceTypeEnum.ACTION}-${idx}-${ActionAccessors.getUniqueKey(action)}`,
            activation: ActivationAccessors.getType(ActionAccessors.getActivation(action)),
            data: action,
        });
    });
    customAttacks.forEach((attack) => {
        if (!ActionAccessors.displayAsAttack(attack)) {
            return;
        }
        attacks.push({
            type: AttackSourceTypeEnum.CUSTOM,
            key: `${AttackSourceTypeEnum.CUSTOM}-${ActionAccessors.getUniqueKey(attack)}`,
            activation: ActivationAccessors.getType(ActionAccessors.getActivation(attack)),
            data: attack,
        });
    });
    return attacks;
}
/**
 *
 * @param modifiers
 */
export function generateAttacksPerActionInfo(modifiers) {
    const extraAttackModifiers = modifiers.filter((modifier) => ModifierValidators.isSetExtraAttacksModifier(modifier));
    const sortedExtraAttackModifiers = orderBy(extraAttackModifiers, [
        (modifier) => ModifierAccessors.getValue(modifier),
        (modifier) => {
            const restriction = ModifierAccessors.getRestriction(modifier);
            return restriction !== null && restriction.length;
        },
    ], ['asc', 'desc']);
    const attacksPerActionBestModifier = sortedExtraAttackModifiers.pop();
    const defaultValue = 0;
    const defaultRestriction = '';
    let attackInfoValue = defaultValue;
    let attackInfoRestriction = defaultRestriction;
    if (attacksPerActionBestModifier) {
        const bestModiferValue = ModifierAccessors.getValue(attacksPerActionBestModifier);
        attackInfoValue = bestModiferValue ? bestModiferValue : defaultValue;
        const bestModifierRestriction = ModifierAccessors.getRestriction(attacksPerActionBestModifier);
        attackInfoRestriction = bestModifierRestriction ? bestModifierRestriction : defaultRestriction;
    }
    return {
        value: 1 + attackInfoValue,
        restriction: attackInfoRestriction,
    };
}
