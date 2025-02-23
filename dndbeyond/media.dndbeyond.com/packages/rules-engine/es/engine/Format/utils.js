import { CoreUtils, FEET_IN_MILES, POUNDS_IN_TON } from '../Core';
/**
 * Gets the ordinal suffix for the specified number
 * @param number The number to get the suffix for
 */
export function getOrdinalSuffix(number) {
    switch (number) {
        case 1:
            return 'st';
        case 2:
            return 'nd';
        case 3:
            return 'rd';
        default:
            return 'th';
    }
}
/**
 * Converts the specified number to an ordinal string
 * @param number The number to convert
 */
export function ordinalize(number) {
    let ret = '';
    switch (number) {
        case 1:
            ret = '1st';
            break;
        case 2:
            ret = '2nd';
            break;
        case 3:
            ret = '3rd';
            break;
        default:
            ret = `${number}th`;
    }
    return ret;
}
/**
 *
 * @param str
 * @param fallback
 */
export function cobaltSlugify(str, fallback = '') {
    if (!str) {
        return fallback;
    }
    return (str
        // nonAsciiRegex removal
        .replace(/[^\x00-\x7F]/g, '')
        .toLowerCase()
        // single quotes
        .replace(/'/g, '')
        // remove entities, replace with a space.
        .replace(/&\w+;/g, ' ')
        // replace any non-word character with a space.
        .replace(/\W+/g, ' ')
        // remove any leading or trailing whitespace.
        .trim()
        // change any spaces to dashes
        .replace(/\s+/g, '-')
        // remove start dashes
        .replace(/^-+/, '')
        // remove end dashes
        .replace(/-+$/, ''));
}
/**
 * Formats the specified string as a slug and will fallback on the optional argument
 * if the specified string is null
 * @param str The string to be formatted
 * @param fallback The fallback if the str argument is null
 */
export function slugify(str, fallback = '') {
    if (!str) {
        return fallback;
    }
    return str
        .toLowerCase()
        .replace(/[^\w\d\-_]+/g, '-')
        .replace(/[\-]+/g, '-')
        .replace(/^-/, '')
        .replace(/-$/, '');
}
/**
 * Formats the specified string as a slug in camelCase format
 * and will fallback to the optional argument if the specified string is null
 * @param str The string to be formatted
 * @param fallback The fallback if the str argument is null
 */
export function camelSlugify(str, fallback = '') {
    if (!str) {
        return fallback;
    }
    const result = slugify(str, fallback).replace(new RegExp('[-][a-z]', 'ig'), (s) => s.substr(1, 1).toUpperCase());
    return result.charAt(0).toLowerCase() + result.slice(1);
}
/**
 *
 * @param str
 * @param fallback
 */
export function stripTooltipTags(str, fallback = '') {
    if (!str) {
        return fallback;
    }
    return str.replace(/\[[^\]]+]([^;\]]*?);?([^;\]]*?)\[\/[^\]]+]/g, '$2');
}
/**
 * Formats the specified number as a distance with the appropriate unit
 * @param distance The distance measured in feet to format
 */
export function renderDistance(distance) {
    let displayNumber = distance;
    let label = 'ft.';
    if (distance !== 0 && distance % FEET_IN_MILES === 0) {
        displayNumber = CoreUtils.convertFeetToMiles(distance);
        label = `mile${Math.abs(displayNumber) === 1 ? '' : 's'}`;
    }
    return `${displayNumber} ${label}`;
}
/**
 * Formats the specified number as a weight with unit
 * @param weight The weight expressed as a number
 */
export function renderWeight(weight) {
    return `${Math.ceil(weight)} lb`;
}
/**
 *
 * @param weight
 */
export function renderWeightTons(weight) {
    const weightTons = weight / POUNDS_IN_TON;
    if (weightTons === 1) {
        return `${weightTons} ton`;
    }
    const roundedWeight = Math.round(weightTons * 100) / 100;
    return `${roundedWeight} tons`;
}
/**
 * Formats the specified spell level for display
 * @param level The spell level
 */
export function renderSpellLevelName(level) {
    let levelName;
    if (level === 0) {
        levelName = 'Cantrip';
    }
    else {
        levelName = `${ordinalize(level)} Level`;
    }
    return levelName;
}
/**
 * Formats the specified spell level for display in an express form
 * @param level The spell level
 */
export function renderSpellLevelShortName(level) {
    if (level === 0) {
        return 'Cantrip';
    }
    return ordinalize(level);
}
/**
 * Formats the specified spell level for display in an abbreviated form
 * @param level The spell level
 */
export function renderSpellLevelAbbreviation(level) {
    let levelName;
    if (level === 0) {
        levelName = '- 0 -';
    }
    else {
        levelName = ordinalize(level);
    }
    return levelName;
}
/**
 * Wrapper function
 * @param number
 */
export function renderLocaleNumber(number) {
    return number.toLocaleString();
}
/**
 * Formats a specified numeric representation of challenge rating for display
 * @param challengeRating The challenge rating to format
 */
export function renderChallengeRating(challengeRating) {
    switch (challengeRating) {
        case 0.125:
            return '1/8';
        case 0.25:
            return '1/4';
        case 0.5:
            return '1/2';
        default:
            return renderLocaleNumber(challengeRating);
    }
}
/**
 * Formats the specified number for display with an explicit sign (positive or negative)
 * and represents commonly used decimal numbers as fractions
 * @param number The number to format for display
 */
export function renderSignedNumber(number) {
    return number >= 0 ? `+${number}` : renderLocaleNumber(number);
}
/**
 * Converts a substring from uppercase letters to lowercase within a specified string
 * @param str The string to perform the operation on
 * @param start The start index in str
 * @param length The number of characters to lowercase
 */
export function lowerCaseLetters(str, start, length = 1) {
    let startPart = str.substring(0, start);
    let lowerStrPart = str.substring(start, start + length);
    if (lowerStrPart) {
        lowerStrPart = lowerStrPart.toLowerCase();
    }
    const remainingStrPart = str.substring(start + length);
    return startPart + lowerStrPart + remainingStrPart;
}
/**
 *
 * @param str
 */
export function upperCaseFirstLetterOnly(str) {
    let firstLetter = str.substring(0, 1);
    if (firstLetter) {
        firstLetter = firstLetter.toUpperCase();
    }
    return firstLetter + str.substring(1).toLowerCase();
}
// renderNonOxfordCommaList(['movement', 'control', 'weapon']);
// > movement, control and weapon
// renderNonOxfordCommaList(['control', 'weapon']);
// > control and weapon
// renderNonOxfordCommaList(['weapon']);
// > weapon
/**
 *
 * @param arr
 */
export function renderNonOxfordCommaList(arr) {
    return [arr.slice(0, arr.length - 1).join(', '), arr[arr.length - 1]].filter((text) => text).join(' and ');
}
/**
 *
 * @param number
 */
export function convertSingleDigitIntToWord(number) {
    switch (number) {
        case 0:
            return 'zero';
        case 1:
            return 'one';
        case 2:
            return 'two';
        case 3:
            return 'three';
        case 4:
            return 'four';
        case 5:
            return 'five';
        case 6:
            return 'six';
        case 7:
            return 'seven';
        case 8:
            return 'eight';
        case 9:
            return 'nine';
        default:
        //not implemented
    }
    return '';
}
