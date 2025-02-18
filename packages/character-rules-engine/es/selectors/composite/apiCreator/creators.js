import { merge } from 'lodash';
import { createSelector } from 'reselect';
import { ApiRequests, ApiUtils } from "../../../api";
import { ApiAdapterUtils } from "../../../apiAdapter";
import { BackgroundAccessors } from "../../../engine/Background";
import { ClassAccessors } from "../../../engine/Class";
import { DefinitionTypeEnum } from "../../../engine/Definition";
import { EntityUtils, } from "../../../engine/Entity";
import { RaceAccessors } from "../../../engine/Race";
import * as characterSelectors from "../../character";
import * as rulesEngineSelectors from "../engine";
function restrictGameDataDefinitionResponseData(response, entityRestrictionData, characterId) {
    let originalData = ApiAdapterUtils.getResponseData(response);
    if (originalData !== null && characterId !== null && response.data.data !== undefined) {
        response.data.data.definitionData = EntityUtils.filterNonRestrictedEntityDefinitions(originalData.definitionData, entityRestrictionData);
    }
    return response;
}
function restrictEntityDefinitionResponseData(response, entityRestrictionData, characterId) {
    let originalData = ApiAdapterUtils.getResponseData(response);
    if (originalData !== null && characterId !== null) {
        const filteredDataData = EntityUtils.filterNonRestrictedEntityDefinitions(originalData, entityRestrictionData);
        const newResponseData = Object.assign({}, response.data, { data: filteredDataData });
        return Object.assign({}, response, { data: newResponseData });
    }
    return response;
}
function restrictEntityResponseData(response, entityRestrictionData, characterId) {
    let originalData = ApiAdapterUtils.getResponseData(response);
    if (originalData !== null && characterId !== null) {
        const filteredDataData = EntityUtils.filterNonRestrictedEntities(originalData, entityRestrictionData);
        const newResponseData = Object.assign({}, response.data, { data: filteredDataData });
        return Object.assign({}, response, { data: newResponseData });
    }
    return response;
}
export const makeLoadAvailableClasses = createSelector([rulesEngineSelectors.getEntityRestrictionData, characterSelectors.getId], (entityRestrictionData, characterId) => (additionalConfig) => {
    return ApiRequests.getCharacterGameDataClasses(additionalConfig).then((response) => restrictEntityDefinitionResponseData(response, entityRestrictionData, characterId));
});
export const makeLoadAvailableSubclasses = createSelector([rulesEngineSelectors.getEntityRestrictionData, characterSelectors.getId], (entityRestrictionData, characterId) => (baseClassId, additionalConfig) => {
    const requiredConfig = {
        params: {
            baseClassId,
        },
    };
    return ApiRequests.getCharacterGameDataSubclasses(merge({}, additionalConfig, requiredConfig)).then((response) => restrictEntityDefinitionResponseData(response, entityRestrictionData, characterId));
});
export const makeLoadAvailableRaces = createSelector([rulesEngineSelectors.getEntityRestrictionData, characterSelectors.getId], (entityRestrictionData, characterId) => (additionalConfig) => {
    return ApiRequests.getCharacterGameDataRaces(additionalConfig).then((response) => restrictEntityDefinitionResponseData(response, entityRestrictionData, characterId));
});
export const makeLoadAvailableFeats = createSelector([rulesEngineSelectors.getEntityRestrictionData, characterSelectors.getId], (entityRestrictionData, characterId) => (additionalConfig) => {
    return ApiRequests.getCharacterGameDataFeats(additionalConfig).then((response) => restrictEntityDefinitionResponseData(response, entityRestrictionData, characterId));
});
export const makeLoadAvailableItems = createSelector([rulesEngineSelectors.getEntityRestrictionData, characterSelectors.getId], (entityRestrictionData, characterId) => (additionalConfig) => {
    return ApiRequests.getCharacterGameDataItems(additionalConfig).then((response) => restrictEntityDefinitionResponseData(response, entityRestrictionData, characterId));
});
export const makeLoadAvailableMonsters = createSelector([rulesEngineSelectors.getEntityRestrictionData, characterSelectors.getId], (entityRestrictionData, characterId) => (additionalConfig) => {
    return ApiRequests.getCharacterGameDataMonsters(additionalConfig).then((response) => restrictEntityDefinitionResponseData(response, entityRestrictionData, characterId));
});
export const makeLoadAvailableInfusions = createSelector([rulesEngineSelectors.getEntityRestrictionData, characterSelectors.getId], (entityRestrictionData, characterId) => (additionalConfig) => {
    return ApiUtils.makeGetAllDefinitionTypeRequest(DefinitionTypeEnum.INFUSION)(additionalConfig).then((response) => restrictGameDataDefinitionResponseData(response, entityRestrictionData, characterId));
});
export const makeLoadAvailableVehicles = createSelector([rulesEngineSelectors.getEntityRestrictionData, characterSelectors.getId], (entityRestrictionData, characterId) => (additionalConfig) => {
    return ApiUtils.makeGetAllDefinitionTypeRequest(DefinitionTypeEnum.VEHICLE)(additionalConfig).then((response) => restrictGameDataDefinitionResponseData(response, entityRestrictionData, characterId));
});
export const makeLoadClassStartingEquipment = createSelector([rulesEngineSelectors.getStartingClass], (startingClass) => {
    let id = -1;
    if (startingClass) {
        id = ClassAccessors.getId(startingClass);
    }
    return (additionalConfig) => {
        const requiredConfig = {
            params: {
                id,
            },
        };
        return ApiRequests.getCharacterGameDataClassStartingEquipment(merge({}, additionalConfig, requiredConfig));
    };
});
export const makeLoadBackgroundStartingEquipment = createSelector([rulesEngineSelectors.getBackgroundInfo], (backgroundInfo) => {
    let id = -1;
    if (backgroundInfo) {
        id = BackgroundAccessors.getId(backgroundInfo);
    }
    return (additionalConfig) => {
        const requiredConfig = {
            params: {
                id,
            },
        };
        return ApiRequests.getCharacterGameDataBackgroundStartingEquipment(merge({}, additionalConfig, requiredConfig));
    };
});
export const makeLoadClassRemainingSpells = createSelector([
    rulesEngineSelectors.getGlobalSpellListIds,
    rulesEngineSelectors.getEntityRestrictionData,
    characterSelectors.getId,
], (globalSpellListIds, entityRestrictionData, characterId) => {
    return (charClass) => {
        if (!ClassAccessors.isSpellcastingActive(charClass) && !ClassAccessors.isPactMagicActive(charClass)) {
            return null;
        }
        return (additionalConfig) => {
            const requiredConfig = {
                params: {
                    classId: ClassAccessors.getActiveId(charClass),
                    classLevel: ClassAccessors.getLevel(charClass),
                    spellListIds: [...globalSpellListIds, ...ClassAccessors.getSpellListIds(charClass)],
                },
            };
            return ApiRequests.getCharacterGameDataSpells(merge({}, additionalConfig, requiredConfig)).then((response) => restrictEntityResponseData(response, entityRestrictionData, characterId));
        };
    };
});
export const makeLoadClassAlwaysKnownSpells = createSelector([
    rulesEngineSelectors.getClasses,
    rulesEngineSelectors.getGlobalSpellListIds,
    rulesEngineSelectors.getEntityRestrictionData,
    characterSelectors.getId,
], (classes, globalSpellListIds, entityRestrictionData, characterId) => {
    return (charClass) => {
        if (!ClassAccessors.getKnowsAllSpells(charClass)) {
            return null;
        }
        return (additionalConfig) => {
            const requiredConfig = {
                params: {
                    classId: ClassAccessors.getActiveId(charClass),
                    classLevel: ClassAccessors.getLevel(charClass),
                    spellListIds: [...globalSpellListIds, ...ClassAccessors.getSpellListIds(charClass)],
                },
            };
            return ApiRequests.getCharacterGameDataAlwaysKnownSpells(merge({}, additionalConfig, requiredConfig)).then((response) => restrictEntityResponseData(response, entityRestrictionData, characterId));
        };
    };
});
export const makeLoadAvailableBackgrounds = createSelector([rulesEngineSelectors.getEntityRestrictionData, characterSelectors.getId], (entityRestrictionData, characterId) => (additionalConfig) => {
    return ApiRequests.getCharacterGameDataBackgrounds(additionalConfig).then((response) => restrictEntityDefinitionResponseData(response, entityRestrictionData, characterId));
});
export const makeLoadAvailableOptionalRacialTraits = createSelector([rulesEngineSelectors.getRace], (race) => (additionalConfig) => {
    const requiredConfig = {
        params: {
            entityRaceId: race ? RaceAccessors.getEntityRaceId(race) : -1,
            entityRaceTypeId: race ? RaceAccessors.getEntityRaceTypeId(race) : -1,
        },
    };
    return ApiRequests.getCharacterGameDataRacialTraits(merge({}, additionalConfig, requiredConfig));
});
export const makeLoadAvailableOptionalClassFeatures = createSelector([rulesEngineSelectors.getClasses], (classes) => {
    return (charClass) => {
        return (additionalConfig) => {
            const requiredConfig = {
                params: {
                    classId: ClassAccessors.getActiveId(charClass),
                },
            };
            return ApiRequests.getCharacterGameDataClassFeatures(merge({}, additionalConfig, requiredConfig));
        };
    };
});
//----------------------------
// BELOW LIES GFS
//----------------------------
// TODO: restrictEntityDefinitionResponseData is filtering by homebrew and sources categories based on preferences
//  so maybe that should just be part of the api.
//  if you change it during game you would have to make the api call again.
export const makeLoadAvailableFeatures = createSelector([rulesEngineSelectors.getEntityRestrictionData, characterSelectors.getId], (entityRestrictionData, characterId) => (additionalConfig) => {
    return ApiRequests.getCharacterGameDataFeatures(additionalConfig).then((response) => 
    // restrictEntityDefinitionResponseData(response, entityRestrictionData, characterId)
    response);
});
