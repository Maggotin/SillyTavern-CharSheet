import { DataOriginTypeEnum } from '../DataOrigin';
import { deriveCharacterLevel, deriveIsCastAsRitual, deriveName } from './derivers';
import { generateBaseSpell, generateDataOriginSpell } from './generators';
/**
 *
 * @param spell
 * @param overallInfo
 * @param ruleData
 * @param primary
 * @param parent
 */
export function simulateSpell(spell, overallInfo, ruleData, primary, parent) {
    const dataOriginSpell = generateDataOriginSpell(spell, DataOriginTypeEnum.SIMULATED, primary, parent, overallInfo.spellListDataOriginLookup);
    const baseSpell = generateBaseSpell(dataOriginSpell, {}, ruleData);
    return Object.assign(Object.assign({}, baseSpell), { attackSaveValue: null, bonusFixedDamage: 0, canPrepare: false, canRemove: false, characterLevel: deriveCharacterLevel(baseSpell, overallInfo.characterLevel), isCustomized: false, isCastAsRitual: deriveIsCastAsRitual(baseSpell), name: deriveName(baseSpell, {}), notes: '', spellcastingModifier: 0, toHit: null, canAdd: true, entity: spell, spellGroupInfoLookup: {} });
}
