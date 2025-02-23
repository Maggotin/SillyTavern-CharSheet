import * as ApiAdapterUtils from '../../../../apiAdapter/utils';
import { ApiTypeEnum } from '../../../constants';
/**
 *
 */
export const postCharacterSpell = ApiAdapterUtils.makePost(ApiTypeEnum.CHARACTER_SERVICE, 'spell');
/**
 *
 */
export const deleteCharacterSpell = ApiAdapterUtils.makeDelete(ApiTypeEnum.CHARACTER_SERVICE, 'spell');
/**
 *
 */
export const putCharacterSpellPrepared = ApiAdapterUtils.makePut(ApiTypeEnum.CHARACTER_SERVICE, 'spell/prepared');
/**
 *
 */
export const putCharacterSpellSlots = ApiAdapterUtils.makePut(ApiTypeEnum.CHARACTER_SERVICE, 'spell/slots');
/**
 *
 */
export const putCharacterSpellPactMagic = ApiAdapterUtils.makePut(ApiTypeEnum.CHARACTER_SERVICE, 'spell/pact-magic');
/**
 *
 */
export const deleteCharacterSpellRemoveBySpellListIds = ApiAdapterUtils.makeDelete(ApiTypeEnum.CHARACTER_SERVICE, 'spell/remove-by-spell-list-ids');
