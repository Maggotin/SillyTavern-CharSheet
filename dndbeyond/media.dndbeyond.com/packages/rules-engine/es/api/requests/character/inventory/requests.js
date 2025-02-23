import * as ApiAdapterUtils from '../../../../apiAdapter/utils';
import { ApiTypeEnum } from '../../../constants';
/**
 *
 */
export const putCharacterInventoryItemQuantity = ApiAdapterUtils.makePut(ApiTypeEnum.CHARACTER_SERVICE, 'inventory/item/quantity');
/**
 *
 */
export const putCharacterInventoryItemAttuned = ApiAdapterUtils.makePut(ApiTypeEnum.CHARACTER_SERVICE, 'inventory/item/attuned');
/**
 *
 */
export const putCharacterInventoryItemCharge = ApiAdapterUtils.makePut(ApiTypeEnum.CHARACTER_SERVICE, 'inventory/item/charge');
/**
 *
 */
export const putCharacterInventoryItemEquipped = ApiAdapterUtils.makePut(ApiTypeEnum.CHARACTER_SERVICE, 'inventory/item/equipped');
/**
 *
 */
export const putCharacterInventoryItemMove = ApiAdapterUtils.makePut(ApiTypeEnum.CHARACTER_SERVICE, 'inventory/item/move');
/**
 *
 */
export const postCharacterInventoryItem = ApiAdapterUtils.makePost(ApiTypeEnum.CHARACTER_SERVICE, 'inventory/item');
/**
 *
 */
export const deleteCharacterInventoryItem = ApiAdapterUtils.makeDelete(ApiTypeEnum.CHARACTER_SERVICE, 'inventory/item');
/**
 *
 */
export const putCharacterInventoryStartingType = ApiAdapterUtils.makePut(ApiTypeEnum.CHARACTER_SERVICE, 'inventory/starting-type');
/**
 * CURRENCY
 * TODO: Beyond Bits
 */
/**
 *
 */
export const putCharacterInventoryCurrency = ApiAdapterUtils.makePut(ApiTypeEnum.CHARACTER_SERVICE, 'inventory/currency');
/**
 *
 */
export const putCharacterInventoryCurrencyTransaction = ApiAdapterUtils.makePut(ApiTypeEnum.CHARACTER_SERVICE, 'inventory/currency/transaction');
/**
 *
 */
export const putCharacterInventoryCurrencyCopper = ApiAdapterUtils.makePut(ApiTypeEnum.CHARACTER_SERVICE, 'inventory/currency/copper');
/**
 *
 */
export const putCharacterInventoryCurrencyElectrum = ApiAdapterUtils.makePut(ApiTypeEnum.CHARACTER_SERVICE, 'inventory/currency/electrum');
/**
 *
 */
export const putCharacterInventoryCurrencyGold = ApiAdapterUtils.makePut(ApiTypeEnum.CHARACTER_SERVICE, 'inventory/currency/gold');
/**
 *
 */
export const putCharacterInventoryCurrencyPlatinum = ApiAdapterUtils.makePut(ApiTypeEnum.CHARACTER_SERVICE, 'inventory/currency/platinum');
/**
 *
 */
export const putCharacterInventoryCurrencySilver = ApiAdapterUtils.makePut(ApiTypeEnum.CHARACTER_SERVICE, 'inventory/currency/silver');
