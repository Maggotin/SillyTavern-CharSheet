import { DataOriginTypeEnum } from '../DataOrigin';
import { getSubType, getType } from './accessors';
import { ModifierSubTypeEnum, ModifierTypeEnum } from './constants';
import { generateModifier } from './generators';
import { simulateModifierContract } from './simulators';
// TODO remove for "Integrated Protection" hack fix
export function hack__isProficiencyLightArmor(modifier) {
    return (getType(modifier) === ModifierTypeEnum.PROFICIENCY && getSubType(modifier) === ModifierSubTypeEnum.LIGHT_ARMOR);
}
export function hack__updateDisadvantageModifiers(disadvantageSaveModifiers, nonProficientArmorItems) {
    nonProficientArmorItems.forEach((item) => {
        disadvantageSaveModifiers.push(generateModifier(simulateModifierContract({
            id: 'SIMULATED_DISADV_STR_SAVES_ARMOR_PROF',
            friendlyTypeName: 'Disadvantage',
            friendlySubtypeName: 'Strength Saving Throws',
            type: ModifierTypeEnum.DISADVANTAGE,
            subType: ModifierSubTypeEnum.STRENGTH_SAVING_THROWS,
            restriction: 'when not proficient with armor worn',
        }), DataOriginTypeEnum.ITEM, item));
        disadvantageSaveModifiers.push(generateModifier(simulateModifierContract({
            id: 'SIMULATED_DISADV_DEX_SAVES_ARMOR_PROF',
            friendlyTypeName: 'Disadvantage',
            friendlySubtypeName: 'Dexterity Saving Throws',
            type: ModifierTypeEnum.DISADVANTAGE,
            subType: ModifierSubTypeEnum.DEXTERITY_SAVING_THROWS,
            restriction: 'when not proficient with armor worn',
        }), DataOriginTypeEnum.ITEM, item));
    });
    return disadvantageSaveModifiers;
}
