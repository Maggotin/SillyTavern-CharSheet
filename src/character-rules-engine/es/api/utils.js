import * as ApiAdapterUtils from '../apiAdapter/utils';
import { ConfigUtils } from '../config';
import { DefinitionTypeEnum } from '../engine/Definition';
import { HelperUtils } from '../engine/Helper';
import { ApiTypeEnum, DEFINITION_SERVICE_VERSIONS } from './constants';
/**
 *
 * @param url
 * @param id
 */
export function makeGetIdUrl(url, id) {
    return url.replace('{id}', id);
}
/**
 *
 * @param definitionType
 */
export function getGameDataDefinitionTypeBasePath(definitionType) {
    let basePath = '';
    switch (definitionType) {
        case DefinitionTypeEnum.VEHICLE:
            basePath = 'vehicle';
            break;
        case DefinitionTypeEnum.INFUSION:
            basePath = 'infusion';
            break;
        case DefinitionTypeEnum.RACIAL_TRAIT:
            basePath = 'racial-trait';
            break;
        case DefinitionTypeEnum.CLASS_FEATURE:
            basePath = 'class-feature';
            break;
        default:
        // not implemented
    }
    return basePath;
}
/**
 *
 * @param definitionType
 */
export function getGameDataDefinitionTypeVersion(definitionType) {
    let version = HelperUtils.lookupDataOrFallback(DEFINITION_SERVICE_VERSIONS, definitionType, -1);
    return `v${version}`;
}
/**
 *
 * @param definitionType
 * @param config
 */
export function makeGetAllDefinitionTypeRequest(definitionType, config) {
    let apiPath = [
        getGameDataDefinitionTypeBasePath(definitionType),
        getGameDataDefinitionTypeVersion(definitionType),
        'collection',
    ].join('/');
    return ApiAdapterUtils.makeGet(ApiTypeEnum.GAME_DATA_SERVICE, apiPath, config);
}
/**
 *
 * @param definitionType
 * @param id
 */
export function makeGetDefinitionTypeRequest(definitionType, id) {
    let apiPath = [
        getGameDataDefinitionTypeBasePath(definitionType),
        getGameDataDefinitionTypeVersion(definitionType),
        '{id}',
    ].join('/');
    return ApiAdapterUtils.makeGet(ApiTypeEnum.GAME_DATA_SERVICE, makeGetIdUrl(apiPath, id));
}
/**
 *
 * @param definitionType
 * @param config
 */
export function makeGetIdsDefinitionTypeRequest(definitionType, config) {
    let apiPath = [
        getGameDataDefinitionTypeBasePath(definitionType),
        getGameDataDefinitionTypeVersion(definitionType),
        'collection',
    ].join('/');
    return ApiAdapterUtils.makePost(ApiTypeEnum.GAME_DATA_SERVICE, apiPath, config);
}
/**
 * TODO consider makeInterpolatedGet for gets with params
 * TODO support character/v3/characters/full/{userId}
 * TODO support character/v3/characters/short/{userId}
 * @param characterId
 */
export function makeGetCharacterRequest(characterId) {
    //TODO v5.1: when mobile moves up to support customItems access if we can remove this
    const { includeCustomItems } = ConfigUtils.getCurrentRulesEngineConfig();
    let config = {
        removeDefaultParams: true,
    };
    if (includeCustomItems) {
        config = Object.assign(Object.assign({}, config), { params: { includeCustomItems } });
    }
    return ApiAdapterUtils.makeGet(ApiTypeEnum.CHARACTER_SERVICE, makeGetIdUrl('character/{id}', characterId.toString()), config);
}
