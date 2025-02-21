import { round } from 'lodash';
import { RuleDataAccessors } from '../RuleData';
import { CURRENCY_VALUE, FEET_IN_MILES } from './constants';
export function convertFeetToMiles(number, precision = 2) {
    return round(number / FEET_IN_MILES, precision);
}
/**
 *
 * @param key
 * @param displayConfiguration
 */
export function getDisplayConfigurationValue(key, displayConfiguration) {
    return displayConfiguration[key];
}
/**
 *
 * @param coin
 * @param ruleData
 */
export function convertTotalCoinToGold(coin, ruleData) {
    let totalGp = RuleDataAccessors.getCurrencyData(ruleData).reduce((acc, currency) => {
        if (currency.name) {
            let key = currency.name.toLowerCase();
            if (coin.hasOwnProperty(key)) {
                acc += coin[key] * currency.conversionFromGp;
            }
        }
        return acc;
    }, 0);
    return Math.floor(totalGp);
}
/**
 *
 * @param multiplier
 * @param adjustments
 */
export function getCurrencyTransactionAdjustment(multiplier, adjustments) {
    let adjustedCurrency = {};
    Object.keys(adjustments).forEach((coinKey) => {
        adjustedCurrency[coinKey] = Math.min(adjustments[coinKey] * multiplier, CURRENCY_VALUE.MAX);
    });
    return adjustedCurrency;
}
