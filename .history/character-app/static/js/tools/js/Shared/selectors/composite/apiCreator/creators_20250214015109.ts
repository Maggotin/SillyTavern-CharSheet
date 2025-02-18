import { merge } from "lodash";
import { createSelector } from "reselect";

import {
  ApiAdapterResponse,
  ApiAdapterRequestConfig,
  ApiAdapterUtils,
  ApiResponse,
  ApiRequests,
  ApiUtils,
  BackgroundUtils,
  CharClass,
  ClassUtils,
  Constants,
  DefinitionBasedEntity,
  DefinitionBasedEntityDefinition,
  EntityRestrictionData,
  EntitledEntity,
  EntityUtils,
  rulesEngineSelectors,
  RaceUtils,
  StartingEquipmentContract,
  StartingEquipmentSlotContract,
  StartingEquipmentRuleSlotContract,
  StartingEquipmentRuleContract,
} from "@dndbeyond/character-rules-engine/es";

import * as appEnvSelectors from "../../appEnv";
import {
  MakeClassBasedApiClassFeaturesRequest,
  MakeClassBasedApiSpellsRequest,
} from "./typings";

// TODO: almost this entire file could/should come from RE managers
function restrictGameDataDefinitionResponseData<
  T extends ApiAdapterResponse<
    ApiResponse<EntitledEntity<DefinitionBasedEntityDefinition>>
  >
>(
  response: T,
  entityRestrictionData: EntityRestrictionData,
  characterId: number | null
): T {
  let originalData = ApiAdapterUtils.getResponseData(response);
  if (
    originalData !== null &&
    characterId !== null &&
    response.data.data !== undefined
  ) {
    response.data.data.definitionData =
      EntityUtils.filterNonRestrictedEntityDefinitions(
        originalData.definitionData,
        entityRestrictionData
      );
  }
  return response;
}

function restrictEntityDefinitionResponseData<
  T extends ApiAdapterResponse<
    ApiResponse<Array<DefinitionBasedEntityDefinition>>
  >
>(
  response: T,
  entityRestrictionData: EntityRestrictionData,
  characterId: number | null
): T {
  let originalData = ApiAdapterUtils.getResponseData(response);
  if (originalData !== null && characterId !== null) {
    response.data.data = EntityUtils.filterNonRestrictedEntityDefinitions(
      originalData,
      entityRestrictionData
    );
  }
  return response;
}

function restrictEntityResponseData<
  T extends ApiAdapterResponse<ApiResponse<Array<DefinitionBasedEntity>>>
>(
  response: T,
  entityRestrictionData: EntityRestrictionData,
  characterId: number | null
): T {
  let originalData = ApiAdapterUtils.getResponseData(response);
  if (originalData !== null && characterId !== null) {
    response.data.data = EntityUtils.filterNonRestrictedEntities(
      originalData,
      entityRestrictionData
    );
  }
  return response;
}

function restrictStartingEquipmentResponseData<
  T extends ApiAdapterResponse<ApiResponse<StartingEquipmentContract>>
>(
  response: T,
  entityRestrictionData: EntityRestrictionData,
  characterId: number | null
): T {
  let originalData = ApiAdapterUtils.getResponseData(response);
  if (originalData !== null && characterId !== null) {
    // StartingEquipmentContract has arrays of arrays to loop through to get to the entity definitions
    // that can be filtered on with `filterNonRestrictedEntities`. The nested loops are a code smell, but
    // there shouldn't be a big performance impact as no class has an insane amount of starting equipment.
    response.data.data = {
      slots:
        originalData.slots?.map((slot: StartingEquipmentSlotContract) => {
          return {
            ...slot,
            ruleSlots:
              slot.ruleSlots?.map(
                (ruleSlot: StartingEquipmentRuleSlotContract) => {
                  return {
                    ...ruleSlot,
                    rules:
                      ruleSlot.rules?.map(
                        (rule: StartingEquipmentRuleContract) => {
                          const definitions = rule.definitions?.map(
                            (definition) => {
                              return { definition: definition };
                            }
                          );
                          return {
                            ...rule,
                            definitions: definitions
                              ? EntityUtils.filterNonRestrictedEntities(
                                  definitions,
                                  entityRestrictionData
                                ).map((definition) => {
                                  return { ...definition.definition };
                                })
                              : null,
                          };
                        }
                      ) ?? null,
                  };
                }
              ) ?? null,
          };
        }) ?? null,
    };
  }
  return response;
}

export const makeLoadAvailableClasses = createSelector(
  [
    rulesEngineSelectors.getEntityRestrictionData,
    appEnvSelectors.getCharacterId,
  ],
  (entityRestrictionData, characterId) =>
    (additionalConfig?: ApiAdapterRequestConfig) => {
      return ApiRequests.getCharacterGameDataClasses(additionalConfig).then(
        (response) =>
          restrictEntityDefinitionResponseData(
            response,
            entityRestrictionData,
            characterId
          )
      );
    }
);

export const makeLoadAvailableSubclasses = createSelector(
  [
    rulesEngineSelectors.getEntityRestrictionData,
    appEnvSelectors.getCharacterId,
  ],
  (entityRestrictionData, characterId) =>
    (baseClassId: number, additionalConfig?: ApiAdapterRequestConfig) => {
      const requiredConfig: ApiAdapterRequestConfig = {
        params: {
          baseClassId,
        },
      };
      return ApiRequests.getCharacterGameDataSubclasses(
        merge({}, additionalConfig, requiredConfig)
      ).then((response) =>
        restrictEntityDefinitionResponseData(
          response,
          entityRestrictionData,
          characterId
        )
      );
    }
);

export const makeLoadAvailableRaces = createSelector(
  [
    rulesEngineSelectors.getEntityRestrictionData,
    appEnvSelectors.getCharacterId,
  ],
  (entityRestrictionData, characterId) =>
    (additionalConfig?: ApiAdapterRequestConfig) => {
      return ApiRequests.getCharacterGameDataRaces(additionalConfig).then(
        (response) =>
          restrictEntityDefinitionResponseData(
            response,
            entityRestrictionData,
            characterId
          )
      );
    }
);

export const makeLoadAvailableFeats = createSelector(
  [
    rulesEngineSelectors.getEntityRestrictionData,
    appEnvSelectors.getCharacterId,
  ],
  (entityRestrictionData, characterId) =>
    (additionalConfig?: ApiAdapterRequestConfig) => {
      return ApiRequests.getCharacterGameDataFeats(additionalConfig).then(
        (response) =>
          restrictEntityDefinitionResponseData(
            response,
            entityRestrictionData,
            characterId
          )
      );
    }
);

export const makeLoadAvailableItems = createSelector(
  [
    rulesEngineSelectors.getEntityRestrictionData,
    appEnvSelectors.getCharacterId,
  ],
  (entityRestrictionData, characterId) =>
    (additionalConfig?: ApiAdapterRequestConfig) => {
      return ApiRequests.getCharacterGameDataItems(additionalConfig).then(
        (response) =>
          restrictEntityDefinitionResponseData(
            response,
            entityRestrictionData,
            characterId
          )
      );
    }
);

export const makeLoadAvailableMonsters = createSelector(
  [
    rulesEngineSelectors.getEntityRestrictionData,
    appEnvSelectors.getCharacterId,
  ],
  (entityRestrictionData, characterId) =>
    (additionalConfig?: ApiAdapterRequestConfig) => {
      return ApiRequests.getCharacterGameDataMonsters(additionalConfig).then(
        (response) =>
          restrictEntityDefinitionResponseData(
            response,
            entityRestrictionData,
            characterId
          )
      );
    }
);

export const makeLoadAvailableInfusions = createSelector(
  [
    rulesEngineSelectors.getEntityRestrictionData,
    appEnvSelectors.getCharacterId,
  ],
  (entityRestrictionData, characterId) =>
    (additionalConfig?: ApiAdapterRequestConfig) => {
      return ApiUtils.makeGetAllDefinitionTypeRequest(
        Constants.DefinitionTypeEnum.INFUSION
      )(additionalConfig).then((response) =>
        restrictGameDataDefinitionResponseData(
          response,
          entityRestrictionData,
          characterId
        )
      );
    }
);

export const makeLoadAvailableVehicles = createSelector(
  [
    rulesEngineSelectors.getEntityRestrictionData,
    appEnvSelectors.getCharacterId,
  ],
  (entityRestrictionData, characterId) =>
    (additionalConfig?: ApiAdapterRequestConfig) => {
      return ApiUtils.makeGetAllDefinitionTypeRequest(
        Constants.DefinitionTypeEnum.VEHICLE
      )(additionalConfig).then((response) =>
        restrictGameDataDefinitionResponseData(
          response,
          entityRestrictionData,
          characterId
        )
      );
    }
);

export const makeLoadClassStartingEquipment = createSelector(
  [
    rulesEngineSelectors.getStartingClass,
    rulesEngineSelectors.getEntityRestrictionData,
    appEnvSelectors.getCharacterId,
  ],
  (startingClass, entityRestrictionData, characterId) => {
    let id: number = -1;
    if (startingClass) {
      id = ClassUtils.getId(startingClass);
    }

    return (additionalConfig?: ApiAdapterRequestConfig) => {
      const requiredConfig: ApiAdapterRequestConfig = {
        params: {
          id,
        },
      };
      return ApiRequests.getCharacterGameDataClassStartingEquipment(
        merge({}, additionalConfig, requiredConfig)
      ).then((response) =>
        restrictStartingEquipmentResponseData(
          response,
          entityRestrictionData,
          characterId
        )
      );
    };
  }
);

export const makeLoadBackgroundStartingEquipment = createSelector(
  [rulesEngineSelectors.getBackgroundInfo],
  (backgroundInfo) => {
    let id: number = -1;
    if (backgroundInfo) {
      id = BackgroundUtils.getId(backgroundInfo);
    }

    return (additionalConfig?: ApiAdapterRequestConfig) => {
      const requiredConfig: ApiAdapterRequestConfig = {
        params: {
          id,
        },
      };
      return ApiRequests.getCharacterGameDataBackgroundStartingEquipment(
        merge({}, additionalConfig, requiredConfig)
      );
    };
  }
);

// TODO: still used in builder but could be used from RE
export const makeLoadClassRemainingSpells = createSelector(
  [
    rulesEngineSelectors.getClasses,
    rulesEngineSelectors.getGlobalSpellListIds,
    rulesEngineSelectors.getEntityRestrictionData,
    appEnvSelectors.getCharacterId,
  ],
  (
    classes,
    globalSpellListIds,
    entityRestrictionData,
    characterId
  ): MakeClassBasedApiSpellsRequest => {
    return (charClass: CharClass) => {
      if (
        !ClassUtils.isSpellcastingActive(charClass) &&
        !ClassUtils.isPactMagicActive(charClass)
      ) {
        return null;
      }

      return (additionalConfig?: ApiAdapterRequestConfig) => {
        const requiredConfig: ApiAdapterRequestConfig = {
          params: {
            classId: ClassUtils.getActiveId(charClass),
            classLevel: ClassUtils.getLevel(charClass),
            spellListIds: [
              ...globalSpellListIds,
              ...ClassUtils.getSpellListIds(charClass),
            ],
          },
        };
        return ApiRequests.getCharacterGameDataSpells(
          merge({}, additionalConfig, requiredConfig)
        ).then((response) =>
          restrictEntityResponseData(
            response,
            entityRestrictionData,
            characterId
          )
        );
      };
    };
  }
);

// TODO: still used in builder but could be used from RE
export const makeLoadClassAlwaysKnownSpells = createSelector(
  [
    rulesEngineSelectors.getClasses,
    rulesEngineSelectors.getGlobalSpellListIds,
    rulesEngineSelectors.getEntityRestrictionData,
    appEnvSelectors.getCharacterId,
  ],
  (
    classes,
    globalSpellListIds,
    entityRestrictionData,
    characterId
  ): MakeClassBasedApiSpellsRequest => {
    return (charClass: CharClass) => {
      if (!ClassUtils.getKnowsAllSpells(charClass)) {
        return null;
      }

      return (additionalConfig?: ApiAdapterRequestConfig) => {
        const requiredConfig: ApiAdapterRequestConfig = {
          params: {
            classId: ClassUtils.getActiveId(charClass),
            classLevel: ClassUtils.getLevel(charClass),
            spellListIds: [
              ...globalSpellListIds,
              ...ClassUtils.getSpellListIds(charClass),
            ],
          },
        };
        return ApiRequests.getCharacterGameDataAlwaysKnownSpells(
          merge({}, additionalConfig, requiredConfig)
        ).then((response) =>
          restrictEntityResponseData(
            response,
            entityRestrictionData,
            characterId
          )
        );
      };
    };
  }
);

export const makeLoadAvailableBackgrounds = createSelector(
  [
    rulesEngineSelectors.getEntityRestrictionData,
    appEnvSelectors.getCharacterId,
  ],
  (entityRestrictionData, characterId) =>
    (additionalConfig?: ApiAdapterRequestConfig) => {
      return ApiRequests.getCharacterGameDataBackgrounds(additionalConfig).then(
        (response) =>
          restrictEntityDefinitionResponseData(
            response,
            entityRestrictionData,
            characterId
          )
      );
    }
);

export const makeLoadAvailableOptionalRacialTraits = createSelector(
  [rulesEngineSelectors.getRace],
  (race) => (additionalConfig?: ApiAdapterRequestConfig) => {
    const requiredConfig: ApiAdapterRequestConfig = {
      params: {
        entityRaceId: race ? RaceUtils.getEntityRaceId(race) : -1,
        entityRaceTypeId: race ? RaceUtils.getEntityRaceTypeId(race) : -1,
      },
    };
    return ApiRequests.getCharacterGameDataRacialTraits(
      merge({}, additionalConfig, requiredConfig)
    );
  }
);

export const makeLoadAvailableOptionalClassFeatures = createSelector(
  [rulesEngineSelectors.getClasses],
  (classes): MakeClassBasedApiClassFeaturesRequest => {
    return (charClass: CharClass) => {
      return (additionalConfig?: ApiAdapterRequestConfig) => {
        const requiredConfig: ApiAdapterRequestConfig = {
          params: {
            classId: ClassUtils.getActiveId(charClass),
          },
        };
        return ApiRequests.getCharacterGameDataClassFeatures(
          merge({}, additionalConfig, requiredConfig)
        );
      };
    };
  }
);
