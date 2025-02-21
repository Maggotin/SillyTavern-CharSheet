import * as ApiAdapterUtils from '../../../../apiAdapter/utils';
import { ApiTypeEnum } from '../../../constants';
export const getPartyInventory = ApiAdapterUtils.makeInterpolatedGet(ApiTypeEnum.CHARACTER_SERVICE, 'party/inventory/{campaignId}', { removeDefaultParams: true });
// This response should have the sharing state on it
// shareStatus = `ON` (fully working, paid) `OFF` (should not be on) `DELETE_ONLY` (turned off, but still has things. Can claim or move out of campaign or delete, no adding more to the container)
