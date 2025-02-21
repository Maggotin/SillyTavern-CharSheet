import * as ApiAdapterUtils from '../../../../apiAdapter/utils';
import { ApiTypeEnum, CHARACTER_SERVICE_VERSION_KEY_OVERRIDE } from '../../../constants';
/**
 *
 */
export const putCharacterCustomValue = ApiAdapterUtils.makePut(ApiTypeEnum.CHARACTER_SERVICE, 'custom/value');
/**
 *
 */
export const deleteCharacterCustomValue = ApiAdapterUtils.makeDelete(ApiTypeEnum.CHARACTER_SERVICE, 'custom/value');
/**
 *
 */
export const deleteCharacterCustomEntityValues = ApiAdapterUtils.makeDelete(ApiTypeEnum.CHARACTER_SERVICE, 'custom/entity/values');
/**
 *
 */
export const postCharacterCustomProficiency = ApiAdapterUtils.makePost(ApiTypeEnum.CHARACTER_SERVICE, 'custom/proficiency');
/**
 *
 */
export const putCharacterCustomProficiency = ApiAdapterUtils.makePut(ApiTypeEnum.CHARACTER_SERVICE, 'custom/proficiency');
/**
 *
 */
export const deleteCharacterCustomProficiency = ApiAdapterUtils.makeDelete(ApiTypeEnum.CHARACTER_SERVICE, 'custom/proficiency');
/**
 *
 */
export const postCharacterCustomMovement = ApiAdapterUtils.makePost(ApiTypeEnum.CHARACTER_SERVICE, 'custom/movement');
/**
 *
 */
export const putCharacterCustomMovement = ApiAdapterUtils.makePut(ApiTypeEnum.CHARACTER_SERVICE, 'custom/movement');
/**
 *
 */
export const deleteCharacterCustomMovement = ApiAdapterUtils.makeDelete(ApiTypeEnum.CHARACTER_SERVICE, 'custom/movement');
/**
 *
 */
export const postCharacterCustomAction = ApiAdapterUtils.makePost(ApiTypeEnum.CHARACTER_SERVICE, 'custom/action');
/**
 *
 */
export const deleteCharacterCustomAction = ApiAdapterUtils.makeDelete(ApiTypeEnum.CHARACTER_SERVICE, 'custom/action');
/**
 *
 */
export const putCharacterCustomAction = ApiAdapterUtils.makePut(ApiTypeEnum.CHARACTER_SERVICE, 'custom/action');
/**
 * TODO v5.1: Remove this and usages when mobile moves up
 */
export const postCharacterCustomItemV5 = ApiAdapterUtils.makePost(ApiTypeEnum.CHARACTER_SERVICE, 'custom/item');
/**
 * TODO v5.1: Remove this and usages when mobile moves up
 */
export const deleteCharacterCustomItemV5 = ApiAdapterUtils.makeDelete(ApiTypeEnum.CHARACTER_SERVICE, 'custom/item');
/**
 * TODO v5.1: Remove this and usages when mobile moves up
 */
export const putCharacterCustomItemV5 = ApiAdapterUtils.makePut(ApiTypeEnum.CHARACTER_SERVICE, 'custom/item');
/**
 *
 */
export const postCharacterCustomItem = ApiAdapterUtils.makePost(ApiTypeEnum.CHARACTER_SERVICE, 'custom/item', undefined, CHARACTER_SERVICE_VERSION_KEY_OVERRIDE);
/**
 *
 */
export const deleteCharacterCustomItem = ApiAdapterUtils.makeDelete(ApiTypeEnum.CHARACTER_SERVICE, 'custom/item', undefined, CHARACTER_SERVICE_VERSION_KEY_OVERRIDE);
/**
 *
 */
export const putCharacterCustomItem = ApiAdapterUtils.makePut(ApiTypeEnum.CHARACTER_SERVICE, 'custom/item', undefined, CHARACTER_SERVICE_VERSION_KEY_OVERRIDE);
/**
 *
 */
export const postCharacterCustomSense = ApiAdapterUtils.makePost(ApiTypeEnum.CHARACTER_SERVICE, 'custom/sense');
/**
 *
 */
export const putCharacterCustomSense = ApiAdapterUtils.makePut(ApiTypeEnum.CHARACTER_SERVICE, 'custom/sense');
/**
 *
 */
export const deleteCharacterCustomSense = ApiAdapterUtils.makeDelete(ApiTypeEnum.CHARACTER_SERVICE, 'custom/sense');
/**
 *
 */
export const postCharacterCustomDefenseAdjustment = ApiAdapterUtils.makePost(ApiTypeEnum.CHARACTER_SERVICE, 'custom/defense-adjustment');
/**
 *
 */
export const putCharacterCustomDefenseAdjustment = ApiAdapterUtils.makePut(ApiTypeEnum.CHARACTER_SERVICE, 'custom/defense-adjustment');
/**
 *
 */
export const deleteCharacterCustomDefenseAdjustment = ApiAdapterUtils.makeDelete(ApiTypeEnum.CHARACTER_SERVICE, 'custom/defense-adjustment');
