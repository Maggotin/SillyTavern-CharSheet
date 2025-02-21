import { PartyInventorySharingStateEnum } from './constants';
/**
 *
 * @param campaign
 * @deprecated Use the new getCharacters
 */
export function getCharacter(campaign) {
    return campaign.characters;
}
/**
 *
 * @param campaign
 * @returns {Array<ShortCharacterContract>}
 */
export function getCharacters(campaign) {
    return campaign.characters;
}
/**
 *
 * @param campaign
 */
export function getDescription(campaign) {
    return campaign.description;
}
/**
 *
 * @param campaign
 */
export function getDmUserId(campaign) {
    return campaign.dmUserId;
}
/**
 *
 * @param campaign
 */
export function getId(campaign) {
    return campaign.id;
}
/**
 *
 * @param campaign
 */
export function getDmUsername(campaign) {
    return campaign.dmUsername;
}
/**
 *
 * @param campaign
 */
export function getLink(campaign) {
    return campaign.link;
}
/**
 *
 * @param campaign
 */
export function getName(campaign) {
    return campaign.name;
}
/**
 *
 * @param campaign
 */
export function getPublicNotes(campaign) {
    return campaign.publicNotes;
}
/**
 *
 * @param partyInfo
 * @returns {Array<BaseInventoryContract>}
 */
export function getPartyBaseInventoryContracts(partyInfo) {
    return partyInfo.partyInventory;
}
/**
 *
 * @param partyInfo
 */
export function getSharingState(partyInfo) {
    var _a;
    return (_a = partyInfo.sharingState) !== null && _a !== void 0 ? _a : PartyInventorySharingStateEnum.OFF;
}
/**
 *
 * @param partyInfo
 */
export function getItemSpells(partyInfo) {
    var _a, _b;
    return (_b = (_a = partyInfo.spells) === null || _a === void 0 ? void 0 : _a.item) !== null && _b !== void 0 ? _b : [];
}
/**
 *
 * @param partyInfo
 */
export function getItemModifiers(partyInfo) {
    var _a, _b;
    return (_b = (_a = partyInfo.modifiers) === null || _a === void 0 ? void 0 : _a.item) !== null && _b !== void 0 ? _b : [];
}
/**
 *
 * @param partyInfo
 */
export function getCoin(partyInfo) {
    return partyInfo.coin;
}
