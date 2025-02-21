import * as ApiAdapterUtils from '../../../../apiAdapter/utils';
import { ApiTypeEnum } from '../../../constants';
/**
 *
 */
export const postCharacterOptionalFeatureClassFeature = ApiAdapterUtils.makePost(ApiTypeEnum.CHARACTER_SERVICE, 'optional-feature/class-feature');
/**
 *
 */
export const putCharacterOptionalFeatureClassFeature = ApiAdapterUtils.makePut(ApiTypeEnum.CHARACTER_SERVICE, 'optional-feature/class-feature');
/**
 *
 */
export const deleteCharacterOptionalFeatureClassFeature = ApiAdapterUtils.makeDelete(ApiTypeEnum.CHARACTER_SERVICE, 'optional-feature/class-feature');
/**
 *
 */
export const deleteCharacterOptionalFeatureClassFeatureCollection = ApiAdapterUtils.makeDelete(ApiTypeEnum.CHARACTER_SERVICE, 'optional-feature/class-feature/collection');
/**
 *
 */
export const postCharacterOptionalFeatureOrigin = ApiAdapterUtils.makePost(ApiTypeEnum.CHARACTER_SERVICE, 'optional-feature/racial-trait');
/**
 *
 */
export const putCharacterOptionalFeatureOrigin = ApiAdapterUtils.makePut(ApiTypeEnum.CHARACTER_SERVICE, 'optional-feature/racial-trait');
/**
 *
 */
export const deleteCharacterOptionalFeatureOrigin = ApiAdapterUtils.makeDelete(ApiTypeEnum.CHARACTER_SERVICE, 'optional-feature/racial-trait');
/**
 *
 */
export const deleteCharacterOptionalFeatureOriginCollection = ApiAdapterUtils.makeDelete(ApiTypeEnum.CHARACTER_SERVICE, 'optional-feature/racial-trait/collection');
