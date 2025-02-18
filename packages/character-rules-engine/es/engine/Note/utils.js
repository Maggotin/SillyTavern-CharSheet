import { DiceRenderers } from '../Dice';
import { FormatUtils } from '../Format';
import { getType } from './accessors';
import { DisplayIntentionEnum, NoteTypeEnum } from './constants';
function renderNotePlainText(note) {
    return `${note.data.text}${note.data.displayIntention === DisplayIntentionEnum.SCALED ? '*' : ''}`;
}
function renderNoteDistance(note) {
    return FormatUtils.renderDistance(note.data.distance);
}
function renderNoteAoeIcon(note) {
    return ` ${note.data.type}`; // space intentional
}
function renderNoteDamage(note) {
    let damageDisplay = '';
    if (note.data.damage !== null) {
        if (typeof note.data.damage === 'number') {
            damageDisplay = String(note.data.damage);
        }
        else {
            damageDisplay = DiceRenderers.renderDice(note.data.damage);
        }
    }
    return `${damageDisplay} ${note.data.type}`.trim();
}
function renderNoteDisadvantageIcon() {
    return ' Disadvantage'; // space intentional
}
function renderNote(note) {
    if (note === null) {
        return null;
    }
    switch (getType(note)) {
        case NoteTypeEnum.PLAIN_TEXT:
        case NoteTypeEnum.TOOLTIP:
            return renderNotePlainText(note);
        case NoteTypeEnum.DISTANCE:
            return renderNoteDistance(note);
        case NoteTypeEnum.AOE_ICON:
            return renderNoteAoeIcon(note);
        case NoteTypeEnum.DAMAGE:
            return renderNoteDamage(note);
        case NoteTypeEnum.DISADVANTAGE_ICON:
            return renderNoteDisadvantageIcon();
        case NoteTypeEnum.GROUP:
            return renderNoteGroup(note.data.notes, note.data.separator);
    }
    return null;
}
function renderNoteGroup(notes, separator = ' ') {
    if (notes === null) {
        return null;
    }
    return notes
        .map((note, idx) => {
        if (note === null) {
            return null;
        }
        return `${renderNote(note)}${idx + 1 < notes.length ? separator : ''}`;
    })
        .join('');
}
export function renderNoteComponents(notes) {
    return renderNoteGroup(notes, ', ');
}
