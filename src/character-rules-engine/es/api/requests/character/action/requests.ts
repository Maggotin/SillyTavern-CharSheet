import * as ApiAdapterUtils from '../../../../apiAdapter/utils';
import { ApiTypeEnum } from '../../../constants';
/**
 *
 */
export const putCharacterActionLimitedUse = ApiAdapterUtils.makePut(ApiTypeEnum.CHARACTER_SERVICE, 'action/limited-use');
