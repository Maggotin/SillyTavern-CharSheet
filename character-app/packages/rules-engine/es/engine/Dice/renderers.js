import { groupBy } from 'lodash';
import { FormatUtils } from '../Format';
import { getCount, getFixedValue, getValue } from './accessors';
/**
 * Formats the specified dice to be a human readable string
 * @param dice The dice that should be formatted
 */
export function renderDice(dice) {
    if (Array.isArray(dice)) {
        const diceGroups = groupBy(dice.map((die) => renderDie(die)));
        return Object.keys(diceGroups)
            .map((key) => `${key}${diceGroups[key].length > 1 ? ` (${diceGroups[key].length})` : ''}`)
            .join(', ');
    }
    return renderDie(dice);
}
/**
 * Formats the specified die to be a human readable string.
 * @param die The die that should be formatted
 */
export function renderDie(die) {
    if (die === null) {
        return '';
    }
    const diceCount = getCount(die);
    const diceValue = getValue(die);
    const fixedValue = getFixedValue(die);
    if (diceValue && diceCount) {
        return `${diceCount}d${diceValue}${fixedValue ? FormatUtils.renderSignedNumber(fixedValue) : ''}`;
    }
    if (!diceValue && !diceCount && fixedValue) {
        return FormatUtils.renderLocaleNumber(fixedValue);
    }
    return '';
}
