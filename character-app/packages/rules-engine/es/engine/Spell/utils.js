import { DiceAccessors } from '../Dice';
import { HelperUtils } from '../Helper';
import { ModifierAccessors, ModifierValidators } from '../Modifier';
import { RuleDataUtils } from '../RuleData';
import { SpellGroupEnum } from '../Spell';
import { getAtHigherLevels, getBonusFixedDamage, getLevel, getRange, getSaveDcAbility, getScaleType, getSpellcastingModifier, getSpellGroupInfoLookup, } from './accessors';
import { getSpellScaledAtHigher } from './derivers';
/**
 * @deprecated
 */
export function getSaveDcAbilityKey(spell, ruleData) {
    return RuleDataUtils.getAbilityKey(getSaveDcAbility(spell), ruleData);
}
export function getSaveDcAbilityShortName(spell, ruleData) {
    return RuleDataUtils.getAbilityShortName(getSaveDcAbility(spell), ruleData);
}
/**
 * @param spell
 * @param modifier
 * @param atHigherLevelInfo
 * @param castLevel
 */
export function getSpellFinalScaledDie(spell, modifier, atHigherLevelInfo, castLevel = null) {
    let scaledDie = atHigherLevelInfo === null ? ModifierAccessors.getDie(modifier) : atHigherLevelInfo.die;
    if (scaledDie === null) {
        return null;
    }
    const fixedDiceValue = DiceAccessors.getFixedValue(scaledDie);
    let fixedValue = (fixedDiceValue === null ? 0 : fixedDiceValue) + getBonusFixedDamage(spell);
    if (ModifierAccessors.getUsePrimaryStat(modifier)) {
        fixedValue += getSpellcastingModifier(spell);
    }
    const isHealingHitModifier = ModifierValidators.isSpellHealingHitPointsModifier(modifier);
    const spellGroupInfoLookup = getSpellGroupInfoLookup(spell);
    const healingGroupInfo = HelperUtils.lookupDataOrFallback(spellGroupInfoLookup, SpellGroupEnum.HEALING);
    if (isHealingHitModifier && healingGroupInfo) {
        fixedValue += healingGroupInfo.bonusFixedValue;
        if (healingGroupInfo.useCastLevel && castLevel) {
            fixedValue += castLevel - getLevel(spell);
        }
    }
    return Object.assign(Object.assign({}, scaledDie), { fixedValue });
}
export function getScaledRange(spell, castLevel) {
    var _a, _b, _c;
    const spellRange = getRange(spell);
    if (spellRange === null) {
        return null;
    }
    const higherLevel = getSpellScaledAtHigher(spell, getScaleType(spell), (_b = (_a = getAtHigherLevels(spell)) === null || _a === void 0 ? void 0 : _a.range) !== null && _b !== void 0 ? _b : [], null, castLevel);
    return Object.assign(Object.assign({}, spellRange), { rangeValue: (_c = higherLevel === null || higherLevel === void 0 ? void 0 : higherLevel.range) !== null && _c !== void 0 ? _c : spellRange.rangeValue });
}
/**
 *
 * @param spell
 */
export function makeKnownKey(mappingId, mappingEntityTypeId) {
    return `${mappingId}-${mappingEntityTypeId}`;
}
/**
 *
 * @param spell
 */
export function makeLeveledKnownKey(mappingId, mappingEntityTypeId, castLevel) {
    return `${makeKnownKey(mappingId, mappingEntityTypeId)}-${castLevel}`;
}
/**
 * Given a ClassSpellInfo object and a SpellID, determine if the spell is known by the character
 * using RPGSpell ID as key
 * @param spellList
 * @param spellId
 * @returns
 */
export const isSpellKnown = (spellList, spellId) => spellList.spells.some(
// Compare the given SpellID with the Spell Definition ID
// SpellID is the ID of the record from RPGSpell (SQL Server: Waterdeep)
(spell) => {
    var _a;
    return ((_a = spell.definition) === null || _a === void 0 ? void 0 : _a.id) === spellId &&
        spellList.knownSpellIds.some(
        // Compare the resulting Spell's ID with the KnownSpellID
        // KnownSpellID is a combination of the ClassMappingID of the record from CharacterSpellMapping (MySQL: YawningPortal)
        // and the EntityTypeID of its granting feature (i.e.- a Wizard's class spells will be granted as RPGClassSpellMapping) in 
        // the format of "{ClassMappingID}-{EntityTypeID}"
        (knownSpellId) => spell.id === Number(knownSpellId.split('-')[0]));
});
