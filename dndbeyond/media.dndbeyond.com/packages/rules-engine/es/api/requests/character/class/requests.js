import * as ApiAdapterUtils from '../../../../apiAdapter/utils';
import { ApiTypeEnum } from '../../../constants';
/**
 *
 */
export const postCharacterClass = ApiAdapterUtils.makePost(ApiTypeEnum.CHARACTER_SERVICE, 'class');
/**
 *
 */
export const deleteCharacterClass = ApiAdapterUtils.makeDelete(ApiTypeEnum.CHARACTER_SERVICE, 'class');
/**
 *
 */
export const putCharacterClassLevel = ApiAdapterUtils.makePut(ApiTypeEnum.CHARACTER_SERVICE, 'class/level');
/**
 *
 */
export const putCharacterClassFeatureChoice = ApiAdapterUtils.makePut(ApiTypeEnum.CHARACTER_SERVICE, 'class/feature/choice');
