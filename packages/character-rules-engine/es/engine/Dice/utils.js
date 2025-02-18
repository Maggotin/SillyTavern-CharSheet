import { sortBy } from 'lodash';
import { RuleDataAccessors } from '../RuleData';
import { getCount, getFixedValue, getValue } from './accessors';
/**
 * Gets the lowest value for the specified die
 * @param die The die used to produce the lowest value
 */
export function getDiceMinValue(die) {
    const fixedValue = getFixedValue(die);
    const count = getCount(die);
    return (count ? count : 0) + (fixedValue ? fixedValue : 0);
}
/**
 * Gets the highest value for the specified die
 * @param die The die used to produce the highest value
 */
export function getDiceMaxValue(die) {
    const fixedValue = getFixedValue(die);
    let count = getCount(die);
    if (count === null) {
        count = 0;
    }
    const value = getValue(die);
    const finalValue = value === null ? 0 : value;
    return count * finalValue + (fixedValue ? fixedValue : 0);
}
/**
 * Gets an array of all possible values produce by the specified die.
 * @param die The die used to produce the range of values
 */
export function getDiceValuesRange(die) {
    const minValue = getDiceMinValue(die);
    const maxValue = getDiceMaxValue(die);
    const values = [];
    for (let i = minValue; i <= maxValue; i++) {
        values.push(i);
    }
    return values;
}
/**
 * Gets a random value from the specified die's range of values.
 * @param die The die used to produce a random value
 */
export function getDiceRandomValue(die) {
    const minValue = getDiceMinValue(die);
    const maxValue = getDiceMaxValue(die);
    return Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
}
/**
 * Gets the average roll for a specific die value.
 * @param dieValue The die used to produce the average value
 */
export function getAverageDieValue(dieValue) {
    return dieValue / 2 + 0.5;
}
/**
 * Gets the average roll, rounded up, for a specified die value.
 * @param dieValue The die used to produce the fixed value
 */
export function getFixedDieValue(dieValue) {
    return dieValue / 2 + 1;
}
/**
 * Gets the damage die used when a weapon with the versatile property is wielded with two hands.
 * @param dieValue The damage die used when the weapon is used normally
 * @param ruleData The config data provided by the server
 */
export function getVersatileDieValue(dieValue, ruleData) {
    const diceValues = RuleDataAccessors.getDiceValues(ruleData);
    if (diceValues === null) {
        return 0;
    }
    const versatileIdx = Math.min(diceValues.length - 1, diceValues.indexOf(dieValue) + 1);
    return diceValues[versatileIdx];
}
/**
 * Obtains the highest die from a specified list of dice.
 * @param dice The dice to search through
 */
export function getHighestDie(dice) {
    if (!dice.length) {
        return null;
    }
    const highestDie = sortBy(dice, [
        (die) => {
            let diceCount = getCount(die);
            diceCount = diceCount ? diceCount : 0;
            let diceValue = getValue(die);
            diceValue = diceValue ? diceValue : 0;
            const fixedValue = getFixedValue(die);
            return diceCount * getAverageDieValue(diceValue) + (fixedValue ? fixedValue : 0);
        },
    ]).pop();
    if (!highestDie) {
        return null;
    }
    return highestDie;
}
/**
 *
 * @param diceContract
 */
export function getAverageDiceValue(diceContract) {
    const fixedValue = diceContract.fixedValue ? diceContract.fixedValue : 0;
    const diceValue = diceContract.diceValue !== null ? diceContract.diceValue : 0;
    const diceCount = diceContract.diceCount !== null ? diceContract.diceCount : 0;
    return Math.floor(getAverageDieValue(diceValue) * diceCount) + fixedValue;
}
