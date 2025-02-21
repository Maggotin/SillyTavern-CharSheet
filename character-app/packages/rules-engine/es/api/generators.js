import { CampaignAccessors } from '../engine/Campaign';
import { ContentSharingSettingEnum } from '../engine/Core';
import { CHARACTER_SERVICE_VERSION_KEY } from './constants';
/**
 *
 * @param apiPath
 */
export function generateCharacterServiceApiPath(apiPath, apiVersionOverride) {
    return ['character', apiVersionOverride !== null && apiVersionOverride !== void 0 ? apiVersionOverride : CHARACTER_SERVICE_VERSION_KEY, apiPath].join('/');
}
/**
 *
 * @param campaign
 */
export function generateRequiredGameDataServiceParams(campaign) {
    return {
        campaignId: campaign === null ? null : CampaignAccessors.getId(campaign),
        sharingSetting: ContentSharingSettingEnum.SCOPE_TO_INDIVIDUAL_CAMPAIGN,
    };
}
/**
 *
 * @param characterId
 */
export function generateRequiredCharacterServiceParams(characterId) {
    return {
        characterId,
    };
}
