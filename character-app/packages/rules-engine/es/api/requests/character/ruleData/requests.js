import * as ApiAdapterUtils from '../../../../apiAdapter/utils';
import { ApiTypeEnum } from '../../../constants';
/**
 *
 */
export const getCharacterRuleData = ApiAdapterUtils.makeGet(ApiTypeEnum.CHARACTER_SERVICE, 'rule-data', { removeDefaultParams: true });
