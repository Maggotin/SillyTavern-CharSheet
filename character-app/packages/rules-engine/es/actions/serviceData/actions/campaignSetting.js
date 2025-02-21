import * as actionTypes from '../actionTypes';
export function campaignSettingsSet(campaignSettings) {
    return {
        type: actionTypes.CAMPAIGN_SETTINGS_SET,
        payload: campaignSettings,
        meta: {
            commit: {
                type: actionTypes.CAMPAIGN_SETTINGS_SET_COMMIT,
            },
        },
    };
}
