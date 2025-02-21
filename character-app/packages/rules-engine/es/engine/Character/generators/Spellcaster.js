import { AbilityAccessors } from '../../Ability';
import { ClassAccessors } from '../../Class';
import { ModifierDerivers, ModifierValidators } from '../../Modifier';
/**
 *
 * @param modifiers
 * @param xpInfo
 * @param proficiencyBonus
 * @param abilityLookup
 * @param spellListDataOriginLookup
 */
export function generateOverallSpellInfo(modifiers, xpInfo, proficiencyBonus, abilityLookup, spellListDataOriginLookup) {
    const bonusCantripDamageModifiers = modifiers.filter((modifier) => ModifierValidators.isBonusCantripDamage(modifier));
    const bonusCantripDamageModifierTotal = ModifierDerivers.sumModifiers(bonusCantripDamageModifiers, abilityLookup);
    return {
        bonusCantripDamage: bonusCantripDamageModifierTotal,
        characterLevel: xpInfo.currentLevel,
        proficiencyBonus,
        abilityLookup,
        modifiers,
        spellListDataOriginLookup,
    };
}
/**
 *
 * @param classes
 * @param characterLevel
 * @param spellSlots
 * @param pactMagicSlots
 * @param castableSpellLevels
 * @param castablePactMagicLevels
 * @param availableSpellLevels
 * @param availablePactMagicLevels
 * @param maxLevel
 * @param abilityLookup
 * @param classSpellInfoLookup
 */
export function generateSpellCasterInfo(classes, characterLevel, spellSlots, pactMagicSlots, castableSpellLevels, castablePactMagicLevels, availableSpellLevels, availablePactMagicLevels, maxLevel, abilityLookup, classSpellInfoLookup) {
    var _a, _b, _c, _d;
    const castingInfo = {
        modifiers: [],
        spellAttacks: [],
        saveDcs: [],
    };
    for (let i = 0; i < classes.length; i++) {
        const charClass = classes[i];
        const spellRules = ClassAccessors.getSpellRules(charClass);
        if (spellRules === null) {
            continue;
        }
        let modifier = 0;
        if (spellRules.spellcastingAbilityStatId) {
            modifier = AbilityAccessors.getModifier(abilityLookup[spellRules.spellcastingAbilityStatId]);
        }
        const classSpellInfo = classSpellInfoLookup[ClassAccessors.getId(charClass)];
        const spellAttack = classSpellInfo.toHit;
        const saveDc = classSpellInfo.spellSaveDc;
        if (ClassAccessors.isSpellcastingActive(charClass) || ClassAccessors.isPactMagicActive(charClass)) {
            const existingModifierIndex = castingInfo.modifiers.findIndex((existingModifier) => existingModifier.value === modifier);
            if (existingModifierIndex > -1) {
                castingInfo.modifiers[existingModifierIndex].sources.push(charClass);
            }
            else {
                castingInfo.modifiers.push({
                    value: modifier,
                    sources: [charClass],
                });
            }
            const existingSpellAttackIndex = castingInfo.spellAttacks.findIndex((existingSpellAttack) => existingSpellAttack.value === spellAttack);
            if (existingSpellAttackIndex > -1) {
                castingInfo.spellAttacks[existingSpellAttackIndex].sources.push(charClass);
            }
            else {
                castingInfo.spellAttacks.push({
                    value: spellAttack,
                    sources: [charClass],
                });
            }
            const existingSaveDcIndex = castingInfo.saveDcs.findIndex((existingSaveDc) => existingSaveDc.value === saveDc);
            if (existingSaveDcIndex > -1) {
                castingInfo.saveDcs[existingSaveDcIndex].sources.push(charClass);
            }
            else {
                castingInfo.saveDcs.push({
                    value: saveDc,
                    sources: [charClass],
                });
            }
        }
    }
    const firstAvailableSpellSlotLevel = (_a = availableSpellLevels.sort()[0]) !== null && _a !== void 0 ? _a : null;
    const firstAvailablePactMagicSlotLevel = (_b = availablePactMagicLevels.sort()[0]) !== null && _b !== void 0 ? _b : null;
    const lastAvailableSpellSlotLevel = (_c = availableSpellLevels.sort().reverse()[0]) !== null && _c !== void 0 ? _c : null;
    const lastAvailablePactMagicSlotLevel = (_d = availablePactMagicLevels.sort().reverse()[0]) !== null && _d !== void 0 ? _d : null;
    return {
        characterLevel,
        spellSlots,
        pactMagicSlots,
        castableSpellLevels,
        castablePactMagicLevels,
        availableSpellLevels,
        availablePactMagicLevels,
        firstAvailableSpellSlotLevel,
        firstAvailablePactMagicSlotLevel,
        lastAvailableSpellSlotLevel,
        lastAvailablePactMagicSlotLevel,
        maxLevel,
        castingInfo,
    };
}
/**
 *
 * @param classSpellLists
 * @param characterSpells
 */
export function generateHasSpells(classSpellLists, characterSpells) {
    return !!(classSpellLists.length || characterSpells.length);
}
