import * as ApiAdapterUtils from '../../../../apiAdapter/utils';
import { ApiTypeEnum } from '../../../constants';
/**
 *
 */
export const getCharacterShareUrl = ApiAdapterUtils.makeGet(ApiTypeEnum.CHARACTER_SERVICE, 'share/url');
