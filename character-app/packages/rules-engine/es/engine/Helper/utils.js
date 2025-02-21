import { sortBy, reduce } from 'lodash';
/**
 *
 * @param obj - Keyed object to be converted to an array
 * @returns An array of the object's keys' values
 */
export function convertObjectToArray(obj) {
    return Object.keys(obj).reduce((acc, objKey) => {
        acc.push(obj[objKey]);
        return acc;
    }, []);
}
/**
 *
 * @param collection
 * @param sortStrategies
 */
export function getLast(collection, sortStrategies = []) {
    if (!collection.length) {
        return null;
    }
    const lastItem = sortBy(collection, sortStrategies).pop();
    return lastItem !== null && lastItem !== void 0 ? lastItem : null;
}
export function parseInputInt(value, fallback = null) {
    if (value === '') {
        return fallback;
    }
    if (value === null) {
        return null;
    }
    const number = parseInt(value);
    if (isNaN(number)) {
        return fallback;
    }
    return number;
}
export function parseInputFloat(value, fallback = null) {
    if (value === '') {
        return fallback;
    }
    if (value === null) {
        return fallback;
    }
    const number = parseFloat(value);
    if (isNaN(number)) {
        return fallback;
    }
    return number;
}
/**
 *
 * @param number
 * @param min
 * @param max
 */
export function clampInt(number, min = null, max = null) {
    let clampedNumber = number;
    if (min !== null) {
        clampedNumber = Math.max(clampedNumber, min);
    }
    if (max !== null) {
        clampedNumber = Math.min(clampedNumber, max);
    }
    return clampedNumber;
}
/**
 *
 */
export function generateGuid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return `${s4() + s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
}
export function lookupDataOrFallback(lookup, identifier, fallback = null) {
    if (!lookup) {
        return fallback;
    }
    if (lookup.hasOwnProperty(identifier)) {
        return lookup[identifier];
    }
    return fallback;
}
export function generateNonNullLookup(collection, iterateeFunc) {
    return reduce(collection, (acc, item) => {
        const iteratee = iterateeFunc(item);
        if (iteratee !== null && !acc[iteratee]) {
            acc[iteratee] = item;
        }
        return acc;
    }, {});
}
