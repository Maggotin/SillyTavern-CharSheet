import { ApiTypeEnum } from "../../constants";
import * as ApiAdapterUtils from '../../../apiAdapter/utils';
export const getCharacterFeatures = ApiAdapterUtils.makeInterpolatedGet(ApiTypeEnum.CHARACTER_SERVICE, 'features/{characterId}', { removeDefaultParams: true });
export const postCharacterFeature = ApiAdapterUtils.makePost(ApiTypeEnum.CHARACTER_SERVICE, 'feature');
export const deleteCharacterFeature = ApiAdapterUtils.makeDelete(ApiTypeEnum.CHARACTER_SERVICE, 'feature');
export const postFeaturesAndSubfeatures = ApiAdapterUtils.makePost(ApiTypeEnum.GAME_DATA_SERVICE, 'features/v1/features/collection');
