import { DefinitionTypeEnum } from '../engine/Definition';

export enum ApiTypeEnum {
    GAME_DATA_SERVICE = "GAME_DATA_SERVICE",
    CHARACTER_SERVICE = "CHARACTER_SERVICE",
    WEBSITE = "WEBSITE",
    HACK__CHARACTER_SERVICE_GAME_DATA = "HACK__CHARACTER_SERVICE_GAME_DATA"
}

export const DEFINITION_SERVICE_VERSIONS: Record<typeof DefinitionTypeEnum, number> = {
    [DefinitionTypeEnum.INFUSION]: 1,
    [DefinitionTypeEnum.VEHICLE]: 4,
};

export const CHARACTER_SERVICE_VERSION_KEY = 'v5';
export const CHARACTER_SERVICE_VERSION_KEY_OVERRIDE = 'v5.1';