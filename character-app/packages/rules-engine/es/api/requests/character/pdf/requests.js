import * as ApiAdapterUtils from '../../../../apiAdapter/utils';
import { ApiTypeEnum } from '../../../constants';
/**
 *
 */
export const postCharacterPdf = ApiAdapterUtils.makePost(ApiTypeEnum.CHARACTER_SERVICE, 'pdf');
/**
 *
 */
export const getCharacterPdf = ApiAdapterUtils.makePost(ApiTypeEnum.CHARACTER_SERVICE, 'pdf');
