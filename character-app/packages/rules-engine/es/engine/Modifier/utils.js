import { getBonusTypes } from './accessors';
/**
 *
 * @param modifiers
 * @param modifierBonusType
 */
export function countModifierBonusTypes(modifiers, modifierBonusType) {
    let count = 0;
    for (let i = 0; i < modifiers.length; i++) {
        const modifier = modifiers[i];
        const modifierBonusTypes = getBonusTypes(modifier);
        if (modifierBonusTypes && modifierBonusTypes.includes(modifierBonusType)) {
            count += 1;
        }
    }
    return count;
}
/**
 *
 * @param modifiers
 * @param filter
 * @param filterArgs
 */
export function filterModifiers(modifiers, filter, filterArgs = []) {
    return modifiers.filter((modifier) => filter(modifier, ...filterArgs));
}
