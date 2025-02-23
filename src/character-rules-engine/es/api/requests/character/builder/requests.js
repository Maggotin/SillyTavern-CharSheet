import * as ApiAdapterUtils from '../../../../apiAdapter/utils';
import { ApiTypeEnum } from '../../../constants';
/**
 *
 */
export const postCharacterBuilderStandardBuild = ApiAdapterUtils.makePost(ApiTypeEnum.CHARACTER_SERVICE, 'builder/standard-build', {
    removeDefaultParams: true,
});
/**
 *
 */
export const postCharacterBuilderRandomBuild = ApiAdapterUtils.makePost(ApiTypeEnum.CHARACTER_SERVICE, 'builder/random-build', {
    removeDefaultParams: true,
});
/**
 *
 */
export const postCharacterBuilderQuickBuild = ApiAdapterUtils.makePost(ApiTypeEnum.CHARACTER_SERVICE, 'builder/quick-build', {
    removeDefaultParams: true,
});
