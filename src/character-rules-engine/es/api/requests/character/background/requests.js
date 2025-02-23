import * as ApiAdapterUtils from '../../../../apiAdapter/utils';
import { ApiTypeEnum } from '../../../constants';
/**
 *
 */
export const putCharacterBackground = ApiAdapterUtils.makePut(ApiTypeEnum.CHARACTER_SERVICE, 'background');
/**
 *
 */
export const putCharacterBackgroundChoice = ApiAdapterUtils.makePut(ApiTypeEnum.CHARACTER_SERVICE, 'background/choice');
/**
 *
 */
export const putCharacterCustomBackground = ApiAdapterUtils.makePut(ApiTypeEnum.CHARACTER_SERVICE, 'custom/background');
/**
 *
 */
export const putCharacterConfigurationHasCustomBackground = ApiAdapterUtils.makePut(ApiTypeEnum.CHARACTER_SERVICE, 'configuration/has-custom-background');
