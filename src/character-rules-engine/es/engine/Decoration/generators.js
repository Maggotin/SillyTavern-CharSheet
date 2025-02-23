import { CharacterColorEnum } from '../Core';
import { HelperUtils } from '../Helper';
import { getAvatarId, getAvatarUrl, getBackdropAvatarId, getBackdropAvatarUrl, getDefaultBackdrop, getFrameAvatarDecorationKey, getFrameAvatarId, getFrameAvatarUrl, getLargeBackdropAvatarId, getLargeBackdropAvatarUrl, getPortraitDecorationKey, getSmallBackdropAvatarId, getSmallBackdropAvatarUrl, getThemeColor, getThumbnailBackdropAvatarId, getThumbnailBackdropAvatarUrl, } from './accessors';
/**
 *
 * @param decorationContract
 * @param characterPreferences
 */
export function generateDecorationInfo(decorationContract, characterPreferences) {
    return {
        avatarInfo: generateAvatarInfo(decorationContract),
        backdropInfo: generateBackdropInfo(decorationContract),
        characterTheme: generateCharacterTheme(decorationContract ? getThemeColor(decorationContract) : null, characterPreferences),
    };
}
/**
 *
 * @param decorationContract
 */
export function generateAvatarInfo(decorationContract) {
    const frameId = decorationContract ? getFrameAvatarId(decorationContract) : null;
    return {
        avatarId: decorationContract ? getAvatarId(decorationContract) : null,
        avatarUrl: decorationContract ? getAvatarUrl(decorationContract) : null,
        portraitDecorationKey: decorationContract ? getPortraitDecorationKey(decorationContract) : null,
        frameAvatarDecorationKey: decorationContract ? getFrameAvatarDecorationKey(decorationContract) : null,
        frameId,
        frameUrl: decorationContract ? getFrameAvatarUrl(decorationContract) : null,
    };
}
/**
 *
 * @param themeColorContract
 * @param characterPreferences
 */
export function generateCharacterTheme(themeColorContract, characterPreferences) {
    var _a, _b, _c, _d;
    //Dark Mode Preference
    const isDarkMode = (_a = characterPreferences === null || characterPreferences === void 0 ? void 0 : characterPreferences.enableDarkMode) !== null && _a !== void 0 ? _a : false;
    return {
        name: (_b = themeColorContract === null || themeColorContract === void 0 ? void 0 : themeColorContract.name) !== null && _b !== void 0 ? _b : 'DDB Red',
        backgroundColor: isDarkMode ? CharacterColorEnum.DARKMODE_TRANSPARENT : CharacterColorEnum.OFF_WHITE,
        isDefault: themeColorContract === null,
        themeColor: (_c = themeColorContract === null || themeColorContract === void 0 ? void 0 : themeColorContract.themeColor) !== null && _c !== void 0 ? _c : CharacterColorEnum.RED,
        themeColorId: (_d = themeColorContract === null || themeColorContract === void 0 ? void 0 : themeColorContract.themeColorId) !== null && _d !== void 0 ? _d : null,
        isDarkMode,
    };
}
/**
 *
 * TODO DECO clean me up please
 * @param decorationContract
 */
export function generateBackdropInfo(decorationContract) {
    if (decorationContract === null) {
        return {
            backdropAvatarId: null,
            backdropAvatarUrl: null,
            largeBackdropAvatarId: null,
            largeBackdropAvatarUrl: null,
            smallBackdropAvatarId: null,
            smallBackdropAvatarUrl: null,
            thumbnailBackdropAvatarId: null,
            thumbnailBackdropAvatarUrl: null,
        };
    }
    const defaultBackdrop = getDefaultBackdrop(decorationContract);
    const backdropAvatarId = getBackdropAvatarId(decorationContract);
    if (backdropAvatarId === null) {
        return {
            backdropAvatarId,
            backdropAvatarUrl: HelperUtils.lookupDataOrFallback(defaultBackdrop, 'backdropAvatarUrl'),
            largeBackdropAvatarId: null,
            largeBackdropAvatarUrl: HelperUtils.lookupDataOrFallback(defaultBackdrop, 'largeBackdropAvatarUrl'),
            smallBackdropAvatarId: null,
            smallBackdropAvatarUrl: HelperUtils.lookupDataOrFallback(defaultBackdrop, 'smallBackdropAvatarUrl'),
            thumbnailBackdropAvatarId: null,
            thumbnailBackdropAvatarUrl: HelperUtils.lookupDataOrFallback(defaultBackdrop, 'thumbnailBackdropAvatarUrl'),
        };
    }
    return {
        backdropAvatarId,
        backdropAvatarUrl: getBackdropAvatarUrl(decorationContract),
        largeBackdropAvatarId: getLargeBackdropAvatarId(decorationContract),
        largeBackdropAvatarUrl: getLargeBackdropAvatarUrl(decorationContract),
        smallBackdropAvatarId: getSmallBackdropAvatarId(decorationContract),
        smallBackdropAvatarUrl: getSmallBackdropAvatarUrl(decorationContract),
        thumbnailBackdropAvatarId: getThumbnailBackdropAvatarId(decorationContract),
        thumbnailBackdropAvatarUrl: getThumbnailBackdropAvatarUrl(decorationContract),
    };
}
