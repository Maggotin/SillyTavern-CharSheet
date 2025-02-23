import { getCharacterTheme } from './accessors';
/**
 *
 * @param decorationInfo
 */
export function isDarkMode(decorationInfo) {
    return getCharacterTheme(decorationInfo).isDarkMode;
}
/**
 *
 * @param decorationInfo
 */
export function isDefaultTheme(decorationInfo) {
    return getCharacterTheme(decorationInfo).isDefault;
}
