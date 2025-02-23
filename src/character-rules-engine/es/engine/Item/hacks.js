import { DB_STRING_CARAPACE, DB_STRING_INTEGRATED_PROTECTION } from '../Core';
import { DataOriginTypeEnum } from '../DataOrigin';
import { ModifierAccessors, ModifierDerivers, ModifierValidators } from '../Modifier';
import { RacialTraitAccessors } from '../RacialTrait';
import { getArmorTypeId } from './accessors';
import { ArmorTypeEnum } from './constants';
/**
 * TODO fix this dirty dirty hack for Integrated Protection
 * @param modifier
 * @param modifierData
 * @param hasLightArmorProficiency
 */
export function hack__getSetUnarmoredModifierValue(modifier, modifierData, hasLightArmorProficiency) {
    const dataOrigin = ModifierAccessors.getDataOrigin(modifier);
    const dataOriginType = ModifierAccessors.getDataOriginType(modifier);
    if (dataOriginType === DataOriginTypeEnum.RACE &&
        RacialTraitAccessors.getName(dataOrigin.primary) === DB_STRING_INTEGRATED_PROTECTION &&
        ModifierAccessors.getValue(modifier) === 1 &&
        !hasLightArmorProficiency) {
        return ModifierDerivers.deriveValue(modifier, modifierData, undefined, false);
    }
    return ModifierDerivers.deriveValue(modifier, modifierData);
}
/**
 * TODO fix this dirty dirty hack for Carapace
 * @param modifier
 * @param modifierData
 * @param isWearingHeavyArmor
 */
export function hack__deriveBonusArmorModifierValue(modifier, modifierData, isWearingHeavyArmor) {
    const dataOrigin = ModifierAccessors.getDataOrigin(modifier);
    const dataOriginType = ModifierAccessors.getDataOriginType(modifier);
    if (dataOriginType === DataOriginTypeEnum.RACE &&
        RacialTraitAccessors.getName(dataOrigin.primary) === DB_STRING_CARAPACE &&
        ModifierAccessors.getValue(modifier) === 1 &&
        isWearingHeavyArmor) {
        return 0;
    }
    return ModifierDerivers.deriveValue(modifier, modifierData);
}
// This is a very CLEAN hack, but should probably not be here
// If we have a global modifier turning off disadvantage on stealth, and it is
// medium armor master, we need to check if this is medium armor
// since we only remove disadvantage in that case for that modifier
/**
 *
 * @param item
 * @param modifiers
 * @returns {boolean}
 */
export function hack__deriveStealthMediumArmorMasterShouldReturnStealthDefinition(item, modifiers) {
    if (modifiers.length === 1) {
        if (ModifierValidators.isStealthDisadvantageRemoveModifierForMediumArmor(modifiers[0])) {
            const armorType = getArmorTypeId(item);
            if (armorType && armorType !== ArmorTypeEnum.MEDIUM_ARMOR) {
                return true;
            }
        }
    }
    return false;
}
