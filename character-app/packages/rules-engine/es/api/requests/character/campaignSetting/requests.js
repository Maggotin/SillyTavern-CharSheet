import * as ApiAdapterUtils from '../../../../apiAdapter/utils';
import { ApiTypeEnum } from '../../../constants';
/**
 * Get data for single campaign setting
 */
export const getCampaignSetting = ApiAdapterUtils.makeInterpolatedGet(ApiTypeEnum.GAME_DATA_SERVICE, 'campaign-settings/v1/campaign-settings/{id}');
/**
 * Get data for all campaign settings
 */
export const getAllCampaignSettings = ApiAdapterUtils.makeGet(ApiTypeEnum.GAME_DATA_SERVICE, 'campaign-settings/v1/campaign-settings');
/**
 * Update campaign setting on character
 */
export const putCharacterCampaignSetting = ApiAdapterUtils.makePut(ApiTypeEnum.CHARACTER_SERVICE, 'campaign-setting');
