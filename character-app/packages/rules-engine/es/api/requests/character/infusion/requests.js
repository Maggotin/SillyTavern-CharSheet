import * as ApiAdapterUtils from '../../../../apiAdapter/utils';
import { ApiTypeEnum } from '../../../constants';
/**
 *
 */
export const getCharacterInfusionItems = ApiAdapterUtils.makeGet(ApiTypeEnum.CHARACTER_SERVICE, 'infusion/items');
/**
 *
 */
export const postCharacterInfusion = ApiAdapterUtils.makePost(ApiTypeEnum.CHARACTER_SERVICE, 'infusion/item');
/**
 *
 */
export const deleteCharacterInfusion = ApiAdapterUtils.makeDelete(ApiTypeEnum.CHARACTER_SERVICE, 'infusion/item');
/**
 *
 */
export const getCharacterKnownInfusions = ApiAdapterUtils.makeGet(ApiTypeEnum.CHARACTER_SERVICE, 'known-infusions');
/**
 *
 */
export const postCharacterKnownInfusion = ApiAdapterUtils.makePost(ApiTypeEnum.CHARACTER_SERVICE, 'known-infusion');
/**
 *
 */
export const putCharacterKnownInfusion = ApiAdapterUtils.makePut(ApiTypeEnum.CHARACTER_SERVICE, 'known-infusion');
/**
 *
 */
export const deleteCharacterKnownInfusion = ApiAdapterUtils.makeDelete(ApiTypeEnum.CHARACTER_SERVICE, 'known-infusion');
