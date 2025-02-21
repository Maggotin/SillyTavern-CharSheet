import { TypeScriptUtils } from '../../utils';
import { AttackTypeRangeEnum, StealthCheckTypeEnum } from '../Core';
import { InfusionAccessors } from '../Infusion';
import { LimitedUseAccessors, LimitedUseDerivers } from '../LimitedUse';
import { NoteGenerators } from '../Note';
import { SpellAccessors } from '../Spell';
import { getAdditionalDamages, getAttackType, getLimitedUse, getLongRange, getNotes, getProperties, getRange, getStealthCheck, getStrengthRequirement, getTags, isAdamantine, isOffhand, isSilvered, getArmorClass, getInfusion, isCustom, } from './accessors';
import { WeaponPropertyEnum } from './constants';
import { deriveCategoryInfo } from './derivers';
import { getApplicableWeaponSpellDamageGroups, hasWeaponProperty, isBaseArmor, isBaseGear, isBaseWeapon, isShield, } from './utils';
import { validateIsWeaponLike } from './validators';
/**
 *
 * @param item
 * @param ruleData
 * @param abilityLookup
 * @param proficiencyBonus
 */
function getLimitedUseNoteComponent(item, ruleData, abilityLookup, proficiencyBonus) {
    const limitedUse = getLimitedUse(item);
    if (!limitedUse) {
        return null;
    }
    const maxUses = LimitedUseDerivers.deriveMaxUses(limitedUse, abilityLookup, ruleData, proficiencyBonus);
    const numberUsed = LimitedUseAccessors.getNumberUsed(limitedUse);
    const numberRemaining = maxUses - numberUsed;
    if (maxUses === 1) {
        return NoteGenerators.createPlainText(`1 Charge${numberUsed === 1 ? ' (Used)' : ''}`);
    }
    return NoteGenerators.createPlainText(`${numberRemaining}/${maxUses} Charges`);
}
function getPropertyNoteComponents(item) {
    const properties = getProperties(item);
    if (!properties.length) {
        return null;
    }
    const notes = [];
    properties.forEach((property, idx) => {
        if (property.name !== null) {
            notes.push(NoteGenerators.createPlainText(property.name));
        }
    });
    return NoteGenerators.createGroup(notes, ', ');
}
function getRangeNoteComponent(item) {
    if (getAttackType(item) === AttackTypeRangeEnum.RANGED ||
        hasWeaponProperty(item, WeaponPropertyEnum.THROWN) ||
        hasWeaponProperty(item, WeaponPropertyEnum.RANGE)) {
        const range = getRange(item);
        const longRange = getLongRange(item);
        return NoteGenerators.createPlainText(`Range (${range}/${longRange})`);
    }
    return null;
}
function getUserNoteComponent(item) {
    const notes = getNotes(item);
    if (notes) {
        return NoteGenerators.createPlainText(notes);
    }
    return null;
}
function getWeaponSpellDamageGroupsNoteComponents(item, weaponSpellDamageGroups, ruleData) {
    const filteredSpellDamage = getApplicableWeaponSpellDamageGroups(item, weaponSpellDamageGroups);
    if (!filteredSpellDamage.length) {
        return null;
    }
    const notes = [];
    filteredSpellDamage.forEach((spellDamageGroup) => {
        const damageNotes = spellDamageGroup.damageDice.map((damage) => NoteGenerators.createDamage(damage.type, damage.dice, damage.restriction ? damage.restriction : ''));
        const groupNotes = [
            NoteGenerators.createPlainText(SpellAccessors.getName(spellDamageGroup.spell)),
            NoteGenerators.createGroup(damageNotes, ', '),
        ].filter(TypeScriptUtils.isNotNullOrUndefined);
        notes.push(NoteGenerators.createGroup(groupNotes, ': '));
    });
    return NoteGenerators.createGroup(notes.filter(TypeScriptUtils.isNotNullOrUndefined), ', ');
}
/**
 *
 * @param item
 * @param weaponSpellDamageGroups
 * @param ruleData
 * @param abilityLookup
 * @param proficiencyBonus
 */
function getWeaponNoteComponents(item, weaponSpellDamageGroups, ruleData, abilityLookup, proficiencyBonus) {
    const notes = [];
    if (isBaseWeapon(item)) {
        const additionalDamages = getAdditionalDamages(item);
        if (additionalDamages) {
            additionalDamages.forEach((additionalDamage, idx) => {
                if (additionalDamage.damage !== null && additionalDamage.damageType !== null) {
                    notes.push(NoteGenerators.createGroup([
                        NoteGenerators.createPlainText('+'),
                        NoteGenerators.createDamage(additionalDamage.damageType, additionalDamage.damage, additionalDamage.info),
                    ], ''));
                }
            });
        }
    }
    notes.push(getLimitedUseNoteComponent(item, ruleData, abilityLookup, proficiencyBonus));
    if (isBaseWeapon(item)) {
        const category = deriveCategoryInfo(item, ruleData);
        if (category && category.name) {
            notes.push(NoteGenerators.createPlainText(category.name));
        }
        if (isOffhand(item)) {
            notes.push(NoteGenerators.createPlainText('Dual Wield'));
        }
        if (isSilvered(item)) {
            notes.push(NoteGenerators.createPlainText('Silvered'));
        }
        if (isAdamantine(item)) {
            notes.push(NoteGenerators.createPlainText('Adamantine'));
        }
    }
    if (isBaseWeapon(item) || isBaseGear(item)) {
        notes.push(getPropertyNoteComponents(item));
    }
    if (isBaseWeapon(item)) {
        notes.push(getRangeNoteComponent(item));
    }
    notes.push(getWeaponSpellDamageGroupsNoteComponents(item, weaponSpellDamageGroups, ruleData));
    notes.push(getUserNoteComponent(item));
    return notes.filter(TypeScriptUtils.isNotNullOrUndefined);
}
/**
 *
 * @param item
 * @param ruleData
 * @param abilityLookup
 * @param proficiencyBonus
 */
function getArmorNoteComponents(item, ruleData, abilityLookup, proficiencyBonus) {
    const notes = [];
    notes.push(getLimitedUseNoteComponent(item, ruleData, abilityLookup, proficiencyBonus));
    const armorClass = getArmorClass(item);
    const strengthRequirement = getStrengthRequirement(item);
    const stealthCheck = getStealthCheck(item);
    if (isShield(item)) {
        notes.push(NoteGenerators.createPlainText(`+${armorClass} AC`));
    }
    else {
        notes.push(NoteGenerators.createPlainText(`AC ${armorClass}`));
    }
    if (strengthRequirement) {
        notes.push(NoteGenerators.createPlainText(`Str ${strengthRequirement}`));
    }
    if (stealthCheck === StealthCheckTypeEnum.DISADVANTAGE) {
        notes.push(NoteGenerators.createGroup([
            NoteGenerators.createPlainText('Stealth'),
            NoteGenerators.createDisadvantageIcon(),
        ]));
    }
    notes.push(getUserNoteComponent(item));
    return notes.filter(TypeScriptUtils.isNotNullOrUndefined);
}
/**
 *
 * @param item
 * @param ruleData
 * @param abilityLookup
 * @param proficiencyBonus
 */
function getGearNoteComponents(item, ruleData, abilityLookup, proficiencyBonus) {
    const notes = [];
    notes.push(getLimitedUseNoteComponent(item, ruleData, abilityLookup, proficiencyBonus));
    const tags = getTags(item);
    tags.forEach((tag) => {
        notes.push(NoteGenerators.createPlainText(tag));
    });
    notes.push(getUserNoteComponent(item));
    return notes.filter(TypeScriptUtils.isNotNullOrUndefined);
}
function getCustomNoteComponents(item) {
    const notes = [];
    notes.push(getUserNoteComponent(item));
    return notes.filter(TypeScriptUtils.isNotNullOrUndefined);
}
function getInfusionNoteComponents(item, infusion) {
    const notes = [];
    notes.push(NoteGenerators.createPlainText(`Infusion: ${InfusionAccessors.getName(infusion)}`));
    return notes;
}
/**
 *
 * @param item
 * @param weaponSpellDamageGroups
 * @param ruleData
 * @param abilityLookup
 * @param proficiencyBonus
 */
export function getNoteComponents(item, weaponSpellDamageGroups, ruleData, abilityLookup, proficiencyBonus) {
    const notes = [];
    const infusion = getInfusion(item);
    if (infusion) {
        notes.push(...getInfusionNoteComponents(item, infusion));
    }
    if (isBaseWeapon(item)) {
        notes.push(...getWeaponNoteComponents(item, weaponSpellDamageGroups, ruleData, abilityLookup, proficiencyBonus));
    }
    else if (isBaseArmor(item)) {
        notes.push(...getArmorNoteComponents(item, ruleData, abilityLookup, proficiencyBonus));
    }
    else if (isCustom(item)) {
        notes.push(...getCustomNoteComponents(item));
    }
    else if (isBaseGear(item)) {
        if (validateIsWeaponLike(item)) {
            notes.push(...getWeaponNoteComponents(item, weaponSpellDamageGroups, ruleData, abilityLookup, proficiencyBonus));
        }
        else {
            notes.push(...getGearNoteComponents(item, ruleData, abilityLookup, proficiencyBonus));
        }
    }
    return notes.filter(TypeScriptUtils.isNotNullOrUndefined);
}
