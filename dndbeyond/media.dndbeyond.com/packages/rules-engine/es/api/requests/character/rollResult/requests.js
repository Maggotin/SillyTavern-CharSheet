import * as ApiAdapterUtils from '../../../../apiAdapter/utils';
import { ApiTypeEnum } from '../../../constants';
/**
 *
 */
export const getCharacterRollResultGroups = ApiAdapterUtils.makeGet(ApiTypeEnum.CHARACTER_SERVICE, 'roll-result-groups');
/**
 *
 */
export const postCharacterRollResultGroup = ApiAdapterUtils.makePost(ApiTypeEnum.CHARACTER_SERVICE, 'roll-result-group');
/**
 * PUT - UpdateRollResult(characterId, rollKey, nextRollKey, rollTotal, assignedValue, rollValues, groupKey, componentKey) - /character/v4/roll-result
 */
export const putCharacterRollResult = ApiAdapterUtils.makePut(ApiTypeEnum.CHARACTER_SERVICE, 'roll-result');
/**
 *
 */
export const putCharacterRollResultGroup = ApiAdapterUtils.makePut(ApiTypeEnum.CHARACTER_SERVICE, 'roll-result-group');
/**
 *
 */
export const putCharacterRollResultGroupOrder = ApiAdapterUtils.makePut(ApiTypeEnum.CHARACTER_SERVICE, 'roll-result-group/order');
/**
 *
 */
export const deleteCharacterRollResultGroup = ApiAdapterUtils.makeDelete(ApiTypeEnum.CHARACTER_SERVICE, 'roll-result-group');
/**
 *
 */
export const deleteCharacterRollResultGroups = ApiAdapterUtils.makeDelete(ApiTypeEnum.CHARACTER_SERVICE, 'roll-result-groups');
