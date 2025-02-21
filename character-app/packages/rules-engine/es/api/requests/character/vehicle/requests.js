import * as ApiAdapterUtils from '../../../../apiAdapter/utils';
import { ApiTypeEnum } from '../../../constants';
/**
 *
 */
export const getCharacterVehicles = ApiAdapterUtils.makeGet(ApiTypeEnum.CHARACTER_SERVICE, 'vehicles');
/**
 *
 */
export const postCharacterVehicle = ApiAdapterUtils.makePost(ApiTypeEnum.CHARACTER_SERVICE, 'vehicle');
/**
 *
 */
export const deleteCharacterVehicle = ApiAdapterUtils.makeDelete(ApiTypeEnum.CHARACTER_SERVICE, 'vehicle');
/**
 *
 */
export const putCharacterVehicle = ApiAdapterUtils.makePut(ApiTypeEnum.CHARACTER_SERVICE, 'vehicle');
/**
 *
 */
export const putCharacterVehicleFuel = ApiAdapterUtils.makePut(ApiTypeEnum.CHARACTER_SERVICE, 'vehicle/fuel');
/**
 *
 */
export const postCharacterVehicleCondition = ApiAdapterUtils.makePost(ApiTypeEnum.CHARACTER_SERVICE, 'vehicle/condition');
/**
 *
 */
export const putCharacterVehicleCondition = ApiAdapterUtils.makePut(ApiTypeEnum.CHARACTER_SERVICE, 'vehicle/condition');
/**
 *
 */
export const deleteCharacterVehicleCondition = ApiAdapterUtils.makeDelete(ApiTypeEnum.CHARACTER_SERVICE, 'vehicle/condition');
/**
 *
 */
export const getCharacterVehicleComponents = ApiAdapterUtils.makeGet(ApiTypeEnum.CHARACTER_SERVICE, 'vehicle/components');
/**
 *
 */
export const postCharacterVehicleComponent = ApiAdapterUtils.makePost(ApiTypeEnum.CHARACTER_SERVICE, 'vehicle/component');
/**
 *
 */
export const putCharacterVehicleComponent = ApiAdapterUtils.makePut(ApiTypeEnum.CHARACTER_SERVICE, 'vehicle/component');
/**
 *
 */
export const putCharacterVehicleComponentHp = ApiAdapterUtils.makePut(ApiTypeEnum.CHARACTER_SERVICE, 'vehicle/component/hp');
