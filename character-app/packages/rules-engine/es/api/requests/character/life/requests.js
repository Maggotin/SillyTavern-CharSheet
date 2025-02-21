import * as ApiAdapterUtils from '../../../../apiAdapter/utils';
import { ApiTypeEnum } from '../../../constants';
/**
 *
 */
export const putCharacterLifeRestore = ApiAdapterUtils.makePut(ApiTypeEnum.CHARACTER_SERVICE, 'life/restore');
/**
 *
 */
export const putCharacterLifeHpBase = ApiAdapterUtils.makePut(ApiTypeEnum.CHARACTER_SERVICE, 'life/hp/base');
/**
 *
 */
export const putCharacterLifeHpBonus = ApiAdapterUtils.makePut(ApiTypeEnum.CHARACTER_SERVICE, 'life/hp/bonus');
/**
 *
 */
export const putCharacterLifeHpOverride = ApiAdapterUtils.makePut(ApiTypeEnum.CHARACTER_SERVICE, 'life/hp/override');
/**
 *
 */
export const putCharacterLifeHpDamageTaken = ApiAdapterUtils.makePut(ApiTypeEnum.CHARACTER_SERVICE, 'life/hp/damage-taken');
/**
 *
 */
export const putCharacterLifeDeathSaves = ApiAdapterUtils.makePut(ApiTypeEnum.CHARACTER_SERVICE, 'life/death-saves');
