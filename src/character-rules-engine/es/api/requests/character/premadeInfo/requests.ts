import * as ApiAdapterUtils from '../../../../apiAdapter/utils';
import { ApiTypeEnum } from '../../../constants';
export const getPremadeInfo = ApiAdapterUtils.makeInterpolatedGet(ApiTypeEnum.CHARACTER_SERVICE, 'premade/{characterId}', {
    removeDefaultParams: true,
});
export const addPremadeInfo = ApiAdapterUtils.makePost(ApiTypeEnum.CHARACTER_SERVICE, 'premade');
export const setPremadeInfo = ApiAdapterUtils.makePut(ApiTypeEnum.CHARACTER_SERVICE, 'premade');
export const deletePremadeInfo = ApiAdapterUtils.makeDelete(ApiTypeEnum.CHARACTER_SERVICE, 'premade');
