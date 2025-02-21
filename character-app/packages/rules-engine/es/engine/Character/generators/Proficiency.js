import { orderBy } from 'lodash';
import { EntityUtils } from '../../Entity';
import { HelperUtils } from '../../Helper';
import { ModifierAccessors, ModifierValidators } from '../../Modifier';
import { RuleDataAccessors, RuleDataUtils } from '../../RuleData';
import { AdjustmentTypeEnum, ProficiencyAdjustmentTypeEnum, ValueAccessors, ValueUtils, } from '../../Value';
import { deriveProficiencyBonus } from '../derivers';
import { isCustomSkillProficiency } from '../validators';
/**
 *
 * @param typeValueLookup
 * @param modifiers
 */
export function generateProficiencyLookup(typeValueLookup, modifiers) {
    let proficiencyLookup = {};
    ProficiencyAdjustmentTypeEnum.forEach((typeId) => {
        const values = ValueUtils.getTypeData(typeValueLookup, typeId);
        values.forEach((value) => {
            proficiencyLookup = Object.assign(Object.assign({}, proficiencyLookup), { [ValueAccessors.getEntityKey(value)]: 1 });
        });
    });
    modifiers
        .filter((modifier) => ModifierValidators.isProficiencyModifier(modifier) && ModifierAccessors.getEntityId(modifier))
        .forEach((modifier) => {
        proficiencyLookup = Object.assign(Object.assign({}, proficiencyLookup), { [ModifierAccessors.getEntityKey(modifier)]: 1 });
    });
    return proficiencyLookup;
}
/**
 *
 * @param currentLevel
 * @param modifiers
 * @param ruleData
 */
export function generateProficiencyBonus(currentLevel, modifiers, ruleData) {
    return deriveProficiencyBonus(currentLevel, modifiers, ruleData);
}
/**
 *
 * @param customProficiencies
 * @param valueLookupByType
 * @param modifiers
 * @param ruleData
 */
export function generateProficiencyGroups(customProficiencies, valueLookupByType, modifiers, ruleData) {
    const decoratedProficiencyGroups = RuleDataAccessors.getProficiencyGroups(ruleData).map((group) => (Object.assign(Object.assign({}, group), { modifiers: [], custom: [], values: [] })));
    const proficiencyGroupLookup = {};
    const customProficiencyGroupLookup = {};
    const customAdjustmentGroupLookup = {};
    decoratedProficiencyGroups.forEach((group, groupIdx) => {
        if (group.entityTypeIds !== null) {
            group.entityTypeIds.forEach((entityTypeId) => {
                proficiencyGroupLookup[entityTypeId] = groupIdx;
            });
        }
        if (group.customAdjustments !== null) {
            group.customAdjustments.forEach((adjustmentTypeId) => {
                customAdjustmentGroupLookup[adjustmentTypeId] = groupIdx;
            });
        }
        customProficiencyGroupLookup[group.customProficiencyGroup] = groupIdx;
    });
    modifiers.forEach((modifier) => {
        const entityTypeId = ModifierAccessors.getEntityTypeId(modifier);
        const isMasteryModifier = ModifierValidators.isValidWeaponMasteryModifier(modifier);
        if (entityTypeId !== null && !isMasteryModifier) {
            const groupLookupIdx = proficiencyGroupLookup[entityTypeId];
            if (typeof groupLookupIdx !== 'undefined') {
                decoratedProficiencyGroups[groupLookupIdx].modifiers.push(modifier);
            }
        }
    });
    customProficiencies.forEach((proficiency) => {
        const groupLookupIdx = customProficiencyGroupLookup[proficiency.type];
        if (typeof groupLookupIdx !== 'undefined') {
            decoratedProficiencyGroups[groupLookupIdx].custom.push(proficiency);
        }
    });
    Object.keys(customAdjustmentGroupLookup).forEach((adjustmentTypeId) => {
        if (valueLookupByType.hasOwnProperty(adjustmentTypeId)) {
            const groupLookupIdx = customAdjustmentGroupLookup[adjustmentTypeId];
            decoratedProficiencyGroups[groupLookupIdx].values.push(...valueLookupByType[adjustmentTypeId]);
        }
    });
    const proficiencyGroups = decoratedProficiencyGroups.map((group) => {
        if (group.label === 'Weapons') {
            RuleDataAccessors.getWeaponCategories(ruleData).forEach((category) => {
                if (group.modifiers.find((modifier) => ModifierValidators.isValidProficiencyWeaponCategoryModifier(modifier, category))) {
                    group.modifiers = group.modifiers.filter((modifier) => {
                        const weapon = RuleDataUtils.getWeaponByEntityId(ModifierAccessors.getEntityId(modifier), ModifierAccessors.getEntityTypeId(modifier), ruleData);
                        return !weapon || (weapon && weapon.categoryId !== category.id);
                    });
                }
            });
        }
        const uniqueProficiencyGroups = {};
        group.modifiers.forEach((modifier) => {
            const friendlySubTypeName = ModifierAccessors.getFriendlySubtypeName(modifier);
            if (friendlySubTypeName !== null) {
                if (!uniqueProficiencyGroups.hasOwnProperty(friendlySubTypeName)) {
                    uniqueProficiencyGroups[friendlySubTypeName] = {
                        label: friendlySubTypeName,
                        sources: [],
                        restriction: ModifierAccessors.getRestriction(modifier),
                    };
                }
                uniqueProficiencyGroups[friendlySubTypeName].sources.push(EntityUtils.getDataOriginName(ModifierAccessors.getDataOrigin(modifier), undefined, true));
            }
        });
        group.custom.forEach((proficiency) => {
            const proficiencyName = proficiency.name;
            if (proficiencyName !== null) {
                if (!uniqueProficiencyGroups.hasOwnProperty(proficiencyName)) {
                    uniqueProficiencyGroups[proficiencyName] = {
                        label: proficiencyName,
                        sources: [],
                    };
                }
                if (proficiency.notes !== null) {
                    uniqueProficiencyGroups[proficiencyName].sources.push(proficiency.notes);
                }
            }
        });
        const armorNameLookup = RuleDataUtils.getArmorNameLookup(ruleData);
        const weaponNameLookup = RuleDataUtils.getWeaponNameLookup(ruleData);
        const toolNameLookup = RuleDataUtils.getToolNameLookup(ruleData);
        group.values.forEach((charValue) => {
            let name = '';
            const valueId = ValueAccessors.getValueIntId(charValue);
            const notes = ValueAccessors.getNotes(charValue);
            if (valueId !== null) {
                switch (ValueAccessors.getTypeId(charValue)) {
                    case AdjustmentTypeEnum.ARMOR_PROFICIENCY_LEVEL:
                        name = armorNameLookup[valueId];
                        break;
                    case AdjustmentTypeEnum.WEAPON_PROFICIENCY_LEVEL:
                        name = weaponNameLookup[valueId];
                        break;
                    case AdjustmentTypeEnum.TOOL_PROFICIENCY_LEVEL:
                        name = toolNameLookup[valueId];
                        break;
                    case AdjustmentTypeEnum.LANGUAGE_PROFICIENCY_LEVEL:
                        name = RuleDataUtils.getLanguageName(valueId, ruleData);
                        break;
                    default:
                    // not implemented
                }
            }
            if (!uniqueProficiencyGroups.hasOwnProperty(name)) {
                uniqueProficiencyGroups[name] = {
                    label: name,
                    sources: [],
                };
            }
            uniqueProficiencyGroups[name].sources.push(notes ? notes : 'Custom');
        });
        return Object.assign(Object.assign({}, group), { modifierGroups: orderBy(HelperUtils.convertObjectToArray(uniqueProficiencyGroups), [
                (modifierGroup) => modifierGroup.label,
            ]) });
    });
    return proficiencyGroups;
}
/**
 *
 * @param proficiencies
 */
export function generateCustomSkillProficiencies(proficiencies) {
    return proficiencies.filter(isCustomSkillProficiency);
}
