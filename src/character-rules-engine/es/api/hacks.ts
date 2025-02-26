import * as ApiAdapterUtils from '../apiAdapter/utils';
import { ApiTypeEnum } from './constants';
import { getGameDataDefinitionTypeBasePath } from './utils';
import { DefinitionTypeEnum } from '../engine/Definition';

/**
 *
 * @param definitionType
 * @param config
 */
export function hack__characterServiceMakeGetIdsDefinitionTypeRequest(definitionType: typeof DefinitionTypeEnum, config: unknown) {
    let apiPath = ['game-data', getGameDataDefinitionTypeBasePath(definitionType), 'collection'].join('/');
    return ApiAdapterUtils.makePost(ApiTypeEnum.HACK__CHARACTER_SERVICE_GAME_DATA, apiPath, config);
}