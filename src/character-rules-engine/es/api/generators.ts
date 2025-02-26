import { CampaignAccessors } from '../engine/Campaign';
import { ContentSharingSettingEnum } from '../engine/Core';
import { CHARACTER_SERVICE_VERSION_KEY } from './constants';

/**
 *
 * @param apiPath
 * @param apiVersionOverride
 */
export function generateCharacterServiceApiPath(apiPath: string, apiVersionOverride?: string): string {
    return ['character', apiVersionOverride ?? CHARACTER_SERVICE_VERSION_KEY, apiPath].join('/');
}

/**
 *
 * @param campaign
 */
export function generateRequiredGameDataServiceParams(campaign: unknown | null) {
    return {
        campaignId: campaign === null ? null : CampaignAccessors.getId(campaign),
        sharingSetting: ContentSharingSettingEnum.SCOPE_TO_INDIVIDUAL_CAMPAIGN,
    };
}

/**
 *
 * @param characterId
 */
export function generateRequiredCharacterServiceParams(characterId: unknown) {
    return {
        characterId,
    };
}