import { TypeScriptUtils } from '../../utils';
import { InfusionAccessors } from '../Infusion';
import { NoteGenerators } from '../Note';
import { getEnvironmentTags, getInfusion, getNotes, getTags } from './accessors';
export function getTagNoteComponents(creature) {
    const tags = getTags(creature);
    return NoteGenerators.createGroup(tags.map((tag) => NoteGenerators.createPlainText(tag)), ', ');
}
export function getEnvironmentNoteComponents(creature) {
    const envTags = getEnvironmentTags(creature);
    return NoteGenerators.createGroup(envTags.map((tag) => NoteGenerators.createPlainText(tag)), ', ');
}
function getUserNoteComponent(creature) {
    const notes = getNotes(creature);
    if (notes) {
        return NoteGenerators.createPlainText(notes);
    }
    return null;
}
function getInfusionNoteComponent(creature) {
    const infusion = getInfusion(creature);
    if (infusion) {
        return NoteGenerators.createPlainText(`Infusion: ${InfusionAccessors.getName(infusion)}`);
    }
    return null;
}
export function getNoteComponents(creature, ruleData) {
    const notes = [];
    notes.push(getUserNoteComponent(creature));
    notes.push(getInfusionNoteComponent(creature));
    notes.push(getTagNoteComponents(creature));
    notes.push(getEnvironmentNoteComponents(creature));
    return notes.filter(TypeScriptUtils.isNotNullOrUndefined);
}
