import * as ApiAdapterUtils from '../../../../apiAdapter/utils';
import { ApiTypeEnum } from '../../../constants';
/**
 *
 */
export const postCharacterCreature = ApiAdapterUtils.makePost(ApiTypeEnum.CHARACTER_SERVICE, 'creature');
/**
 *
 */
export const deleteCharacterCreature = ApiAdapterUtils.makeDelete(ApiTypeEnum.CHARACTER_SERVICE, 'creature');
/**
 *
 */
export const putCharacterCreature = ApiAdapterUtils.makePut(ApiTypeEnum.CHARACTER_SERVICE, 'creature');
/**
 *
 */
export const putCharacterCreatureStatus = ApiAdapterUtils.makePut(ApiTypeEnum.CHARACTER_SERVICE, 'creature/status');
/**
 *
 */
export const putCharacterCreatureHp = ApiAdapterUtils.makePut(ApiTypeEnum.CHARACTER_SERVICE, 'creature/hp');
