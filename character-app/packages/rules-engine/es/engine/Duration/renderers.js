import { FormatUtils } from '../Format';
import { SpellDurationTypeEnum } from '../Spell';
import { getInterval, getType, getUnit } from './accessors';
import { DurationUnitEnum } from './constants';
import { isSpellDurationContract } from './utils';
/**
 *
 * @param duration
 * @param usesConcentration
 */
export function renderDuration(duration, usesConcentration = false) {
    const durationInterval = getInterval(duration);
    const durationUnit = getUnit(duration);
    let durationType = null;
    if (isSpellDurationContract(duration)) {
        durationType = getType(duration);
    }
    let durationString = '';
    if (durationType !== null &&
        durationType !== SpellDurationTypeEnum.TIME &&
        durationType !== SpellDurationTypeEnum.CONCENTRATION) {
        durationString += durationType;
    }
    if (durationInterval && durationInterval > 0) {
        durationString += ` ${durationInterval} ${durationUnit}${durationInterval !== 1 ? 's' : ''}`;
    }
    durationString = durationString.trim();
    if (usesConcentration) {
        durationString = `Concentration, up to ${durationString}`;
    }
    return FormatUtils.upperCaseFirstLetterOnly(durationString);
}
/**
 *
 * @param duration
 */
export function renderDurationAbbreviation(duration) {
    const durationInterval = getInterval(duration);
    const durationUnit = getUnit(duration);
    let durationType = null;
    if (isSpellDurationContract(duration)) {
        durationType = getType(duration);
    }
    let durationString = '';
    if (durationType &&
        durationType !== SpellDurationTypeEnum.TIME &&
        durationType !== SpellDurationTypeEnum.CONCENTRATION) {
        durationString = durationType;
    }
    else if (durationInterval && durationInterval > 0) {
        durationString = `${durationInterval}${renderDurationUnitAbbreviation(durationUnit)}`;
    }
    return durationString;
}
/**
 *
 * @param unit
 */
export function renderDurationUnitAbbreviation(unit) {
    switch (unit) {
        case DurationUnitEnum.DAY:
            return 'd';
        case DurationUnitEnum.HOUR:
            return 'h';
        case DurationUnitEnum.MINUTE:
            return 'm';
        case DurationUnitEnum.ROUND:
            return 'Rnd';
        default:
        // not implemented
    }
    return '';
}
