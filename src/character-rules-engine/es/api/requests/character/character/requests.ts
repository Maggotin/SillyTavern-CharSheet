import * as ApiAdapterUtils from '../../../../apiAdapter/utils';
import { ApiTypeEnum } from '../../../constants';
/**
 *
 */
export const putCharacterAbilityScore = ApiAdapterUtils.makePut(ApiTypeEnum.CHARACTER_SERVICE, 'character/ability-score');
/**
 *
 */
export const putCharacterAbilityScoreType = ApiAdapterUtils.makePut(ApiTypeEnum.CHARACTER_SERVICE, 'character/ability-score/type');
/**
 *
 */
export const putCharacterHelpText = ApiAdapterUtils.makePut(ApiTypeEnum.CHARACTER_SERVICE, 'character/help-text');
/**
 *
 */
export const getCharacterRestShort = ApiAdapterUtils.makeGet(ApiTypeEnum.CHARACTER_SERVICE, 'character/rest/short');
/**
 *
 */
export const postCharacterRestShort = ApiAdapterUtils.makePost(ApiTypeEnum.CHARACTER_SERVICE, 'character/rest/short');
/**
 *
 */
export const getCharacterRestLong = ApiAdapterUtils.makeGet(ApiTypeEnum.CHARACTER_SERVICE, 'character/rest/long');
/**
 *
 */
export const postCharacterRestLong = ApiAdapterUtils.makePost(ApiTypeEnum.CHARACTER_SERVICE, 'character/rest/long');
/**
 *
 */
export const putCharacterProgression = ApiAdapterUtils.makePut(ApiTypeEnum.CHARACTER_SERVICE, 'character/progression');
/**
 *
 */
export const putCharacterPreferences = ApiAdapterUtils.makePut(ApiTypeEnum.CHARACTER_SERVICE, 'character/preferences');
/**
 *
 */
export const putCharacterSourceCategories = ApiAdapterUtils.makePut(ApiTypeEnum.CHARACTER_SERVICE, 'character/source-categories');
export const putCharacterSources = ApiAdapterUtils.makePut(ApiTypeEnum.CHARACTER_SERVICE, `campaign-setting`);
/**
 *
 */
export const putCharacterInspiration = ApiAdapterUtils.makePut(ApiTypeEnum.CHARACTER_SERVICE, 'character/inspiration');
