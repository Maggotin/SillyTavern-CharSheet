import { NoteTypeEnum } from './constants';
export function createGroup(notes, separator = ' ', key = null) {
    if (!notes.length) {
        return null;
    }
    return {
        type: NoteTypeEnum.GROUP,
        data: {
            key,
            separator,
            notes,
        },
    };
}
export function createPlainText(text, displayIntention = null) {
    return {
        type: NoteTypeEnum.PLAIN_TEXT,
        data: {
            text,
            displayIntention,
        },
    };
}
export function createTooltip(text, tooltip = null, tooltipOpts = {}, displayIntention = null) {
    return {
        type: NoteTypeEnum.TOOLTIP,
        data: {
            text,
            tooltip,
            displayIntention,
            tooltipOpts,
        },
    };
}
export function createDamage(type, damage, info = '') {
    return {
        type: NoteTypeEnum.DAMAGE,
        data: {
            type,
            damage,
            info,
        },
    };
}
export function createDisadvantageIcon() {
    return {
        type: NoteTypeEnum.DISADVANTAGE_ICON,
        data: {},
    };
}
export function createDistance(distance) {
    return {
        type: NoteTypeEnum.DISTANCE,
        data: {
            distance,
        },
    };
}
export function createAoeIcon(type) {
    return {
        type: NoteTypeEnum.AOE_ICON,
        data: {
            type,
        },
    };
}
