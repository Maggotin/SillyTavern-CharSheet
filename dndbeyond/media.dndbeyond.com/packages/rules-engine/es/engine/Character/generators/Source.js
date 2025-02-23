import { CampaignSettingAccessors } from '../../CampaignSetting';
import { FeatureFlagEnum, FeatureFlagInfoUtils } from '../../FeatureFlagInfo';
import { RuleDataAccessors } from '../../RuleData';
/**
 *
 * @param activeSourceCategories
 * @param campaignSetting
 * @param ruleData
 */
export function generateActiveSources(activeSourceCategories, customCampaignSetting, campaignSetting, ruleData, featureFlagInfo) {
    // console.log('customCampaignSetting', customCampaignSetting);
    const isCampaignSettingsActive = FeatureFlagInfoUtils.getFeatureFlagInfoValue(FeatureFlagEnum.RELEASE_GATE_CAMPAIGN_SETTINGS, featureFlagInfo);
    const sourceData = RuleDataAccessors.getSourceData(ruleData);
    let campaignSettingSources = [];
    if (customCampaignSetting) {
        if (customCampaignSetting.campaignSettingId) {
            campaignSettingSources = CampaignSettingAccessors.getAvailableSourceIds(campaignSetting[0]);
        }
        else {
            campaignSettingSources = CampaignSettingAccessors.getEnabledSourceIds(customCampaignSetting);
        }
    }
    // Return the Campaign Setting sources if the feature is enabled and they have been set
    if (isCampaignSettingsActive && (campaignSettingSources === null || campaignSettingSources === void 0 ? void 0 : campaignSettingSources.length)) {
        return sourceData.filter((source) => campaignSettingSources === null || campaignSettingSources === void 0 ? void 0 : campaignSettingSources.includes(source.id));
    }
    // Otherwise return the sources mapped to the specified Source Category
    return sourceData.filter((source) => activeSourceCategories.includes(source.sourceCategoryId));
}
