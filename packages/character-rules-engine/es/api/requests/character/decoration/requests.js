import * as ApiAdapterUtils from '../../../../apiAdapter/utils';
import { ApiTypeEnum } from '../../../constants';
/**
 *
 */
export const putCharacterDecorationBackdrop = ApiAdapterUtils.makePut(ApiTypeEnum.CHARACTER_SERVICE, 'decoration/backdrop');
/**
 *
 */
export const putCharacterDecorationFrame = ApiAdapterUtils.makePut(ApiTypeEnum.CHARACTER_SERVICE, 'decoration/frame');
/**
 *
 */
export const putCharacterDecorationPortrait = ApiAdapterUtils.makePut(ApiTypeEnum.CHARACTER_SERVICE, 'decoration/portrait');
/**
 * user uploaded portrait file
 */
export const postCharacterDecorationPortraitCustom = ApiAdapterUtils.makePost(ApiTypeEnum.CHARACTER_SERVICE, 'decoration/portrait/custom');
/**
 *
 */
export const putCharacterDecorationThemeColor = ApiAdapterUtils.makePut(ApiTypeEnum.CHARACTER_SERVICE, 'decoration/theme-color');
/**
 *
 */
export const putCharacterDecorationSocialImage = ApiAdapterUtils.makePut(ApiTypeEnum.CHARACTER_SERVICE, 'decoration/social-image');
