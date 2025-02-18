import { getCharacters } from './accessors';
import { PartyInventorySharingStateEnum } from './constants';
/**
 *
 * @param sharingState
 * @returns {Boolean}
 * @description Returns true as long as the sharing state is not OFF. WARNING: DELETE_ONLY overlaps with the inactive sharing state
 */
export function isSharingStateActive(sharingState) {
    return sharingState !== PartyInventorySharingStateEnum.OFF;
}
/**
 *
 * @param sharingState
 * @returns {Boolean}
 * @description Returns true as long as the sharing state is not ON. WARNING: DELETE_ONLY overlaps with the active sharing state
 */
export function isSharingStateInactive(sharingState) {
    return sharingState !== PartyInventorySharingStateEnum.ON;
}
/**
 *
 * @param campaign
 * @param characterId
 * @returns {CampaignDataContract | null}
 */
export function getCharacterById(campaign, characterId) {
    var _a, _b;
    return (_b = (_a = getCharacters(campaign)) === null || _a === void 0 ? void 0 : _a.find((character) => character.characterId === characterId)) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param campaign
 * @param characterId
 * @returns {string}
 */
export function getCharacterName(campaign, characterId) {
    var _a, _b;
    return (_b = (_a = getCharacterById(campaign, characterId)) === null || _a === void 0 ? void 0 : _a.characterName) !== null && _b !== void 0 ? _b : '';
}
/**
 * @description Given a character id, this determines whether or not that character in the campaign is assigned
 * to a player.
 * @param campaign
 * @param characterId
 * @returns {boolean}
 */
export function isCharacterAssignedToAPlayer(campaign, characterId) {
    var _a;
    return !!((_a = getCharacterById(campaign, characterId)) === null || _a === void 0 ? void 0 : _a.isAssigned);
}
