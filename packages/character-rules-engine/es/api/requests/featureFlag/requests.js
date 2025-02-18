import * as ApiAdapterUtils from '../../../apiAdapter/utils';
import { ApiTypeEnum } from '../../constants';
/**
 * This is a temporary character service endpoint and will eventually be moved to a feature flag service
 */
export const getFeatureFlag = ApiAdapterUtils.makePost(ApiTypeEnum.CHARACTER_SERVICE, 'featureflag');
