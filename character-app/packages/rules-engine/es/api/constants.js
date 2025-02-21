import { DefinitionTypeEnum } from '../engine/Definition';
export var ApiTypeEnum;
(function (ApiTypeEnum) {
    ApiTypeEnum["GAME_DATA_SERVICE"] = "GAME_DATA_SERVICE";
    ApiTypeEnum["CHARACTER_SERVICE"] = "CHARACTER_SERVICE";
    ApiTypeEnum["WEBSITE"] = "WEBSITE";
    ApiTypeEnum["HACK__CHARACTER_SERVICE_GAME_DATA"] = "HACK__CHARACTER_SERVICE_GAME_DATA";
})(ApiTypeEnum || (ApiTypeEnum = {}));
export const DEFINITION_SERVICE_VERSIONS = {
    [DefinitionTypeEnum.INFUSION]: 1,
    [DefinitionTypeEnum.VEHICLE]: 4,
};
export const CHARACTER_SERVICE_VERSION_KEY = 'v5';
export const CHARACTER_SERVICE_VERSION_KEY_OVERRIDE = 'v5.1';
