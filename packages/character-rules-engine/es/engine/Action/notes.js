import { TypeScriptUtils } from '../../utils';
import { LimitedUseAccessors, LimitedUseDerivers, LimitedUseRenderers } from '../LimitedUse';
import { NoteGenerators } from '../Note';
import { RuleDataUtils } from '../RuleData';
import { getLimitedUse, getNotes } from './accessors';
/**
 *
 * @param action
 */
function getUserNoteComponent(action) {
    const notes = getNotes(action);
    if (notes) {
        return NoteGenerators.createPlainText(notes);
    }
    return null;
}
/**
 *
 * @param action
 * @param ruleData
 * @param abilityLookup
 * @param proficiencyBonus
 */
function getLimitedUseNoteComponent(action, ruleData, abilityLookup, proficiencyBonus) {
    const limitedUse = getLimitedUse(action);
    if (!limitedUse) {
        return null;
    }
    const numberConsumed = LimitedUseAccessors.getMinNumberConsumed(limitedUse);
    const maxUses = LimitedUseDerivers.deriveMaxUses(limitedUse, abilityLookup, ruleData, proficiencyBonus);
    const numberUsed = LimitedUseAccessors.getNumberUsed(limitedUse);
    const numberRemaining = maxUses - numberUsed;
    if (maxUses === 1) {
        const resetType = LimitedUseAccessors.getResetType(limitedUse);
        const resetTypeAbbr = LimitedUseRenderers.renderLimitedUseResetAbbreviation(resetType);
        const isUsed = numberUsed === 1;
        const limitedUseResetTypeName = resetType === null ? '' : RuleDataUtils.getLimitedUseResetTypeName(resetType, ruleData);
        return NoteGenerators.createTooltip(`1/${resetTypeAbbr}${isUsed ? ' (Used)' : ''}`, `Once per ${limitedUseResetTypeName}${isUsed ? ' (Used)' : ''}`, {
            dynamicTitle: true,
        });
    }
    return NoteGenerators.createPlainText(`${numberConsumed} Use${numberConsumed !== 1 ? 's' : ''} (${numberRemaining}/${maxUses})`);
}
/**
 *
 * @param action
 * @param ruleData
 * @param abilityLookup
 * @param proficiencyBonus
 */
export function getNoteComponents(action, ruleData, abilityLookup, proficiencyBonus) {
    const notes = [];
    notes.push(getLimitedUseNoteComponent(action, ruleData, abilityLookup, proficiencyBonus));
    notes.push(getUserNoteComponent(action));
    return notes.filter(TypeScriptUtils.isNotNullOrUndefined);
}
