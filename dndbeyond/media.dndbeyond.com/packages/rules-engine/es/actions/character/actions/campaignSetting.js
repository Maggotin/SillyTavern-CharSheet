import * as actionTypes from '../actionTypes';
/**
 *
 * @param racialTraitId
 * @param affectedRacialTraitId
 */
export function campaignSettingSetRequest(CampaignSettingContract) {
    return {
        type: actionTypes.CAMPAIGN_SETTING_SET_REQUEST,
        payload: Object.assign({}, CampaignSettingContract),
        meta: {},
    };
}
/**
 *
 * @param CustomCampaignSettingContract
 */
export function campaignSettingSet(CampaignSettingContract) {
    return {
        type: actionTypes.CAMPAIGN_SETTING_SET,
        payload: Object.assign({}, CampaignSettingContract),
        meta: {
            commit: {
                type: actionTypes.CAMPAIGN_SETTING_SET_COMMIT,
            },
        },
    };
}
