import * as ApiAdapterUtils from '../../../../apiAdapter/utils';
import { ApiTypeEnum } from '../../../constants';
/**
 *
 */
export const putCharacterCondition = ApiAdapterUtils.makePut(ApiTypeEnum.CHARACTER_SERVICE, 'condition');
/**
 *
 */
export const deleteCharacterCondition = ApiAdapterUtils.makeDelete(ApiTypeEnum.CHARACTER_SERVICE, 'condition');
