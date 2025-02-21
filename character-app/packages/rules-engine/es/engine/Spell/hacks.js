import { HelperUtils } from '../Helper';
import { ModifierValidators } from '../Modifier';
import { getSpellGroupInfoLookup } from './accessors';
import { SpellGroupEnum } from './constants';
/**
 * We needed to display very contextual verbiage for
 * spells that did damage and the healed based on that
 * damage on SpellDetail.tsx via SpellCaster.tsx on
 * the healing node.
 * - Ask Julie or Brian Life Domain Cleric
 * @param modifiers
 * @param spell
 * @param scaledHealingDie
 */
export function hack__isHealingDieAdditionalBonusFixedValue(modifiers, spell, scaledHealingDie) {
    if (!scaledHealingDie) {
        return false;
    }
    const damageModifiers = modifiers.filter((modifier) => ModifierValidators.isSpellDamageModifier(modifier));
    return (damageModifiers.length > 0 &&
        HelperUtils.lookupDataOrFallback(getSpellGroupInfoLookup(spell), SpellGroupEnum.HEALING, false) &&
        !scaledHealingDie.diceValue &&
        !scaledHealingDie.diceCount &&
        scaledHealingDie.fixedValue !== null);
}
