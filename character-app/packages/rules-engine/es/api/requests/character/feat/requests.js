import * as ApiAdapterUtils from '../../../../apiAdapter/utils';
import { ApiTypeEnum } from '../../../constants';
export const putCharacterFeatChoice = ApiAdapterUtils.makePut(ApiTypeEnum.CHARACTER_SERVICE, 'feat/choice');
export const postCharacterFeatAdHoc = ApiAdapterUtils.makePost(ApiTypeEnum.CHARACTER_SERVICE, 'feat/ad-hoc');
export const deleteCharacterFeatAdHoc = ApiAdapterUtils.makeDelete(ApiTypeEnum.CHARACTER_SERVICE, 'feat/ad-hoc');
export const postEntityFeat = ApiAdapterUtils.makePost(ApiTypeEnum.CHARACTER_SERVICE, 'feat/from-entity');
