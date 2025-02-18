import {
  AbilityManager,
  Constants,
} from "@dndbeyond/character-rules-engine/es";

import {
  PaneIdentifiersAction,
  PaneIdentifiersClassSpell,
  PaneIdentifiersNote,
  PaneIdentifiersClassFeature,
  PaneIdentifiersRacialTrait,
  PaneIdentifiersItem,
  PaneIdentifiersBasicAction,
  PaneIdentifiersCharacterSpell,
  PaneIdentifiersFeat,
  PaneIdentifiersCustomAction,
  PaneIdentifiersCustomItem,
  PaneIdentifiersCustomSkill,
  PaneIdentifiersAbility,
  PaneIdentifiersSkill,
  PaneIdentifiersAbilitySavingThrow,
  PaneIdentifiersPreferenceHitPointConfirm,
  PaneIdentifiersPreferenceProgressionConfirm,
  PaneIdentifiersCreature,
  PaneIdentifiersVehicle,
  PaneIdentifiersVehicleComponent,
  PaneIdentifiersVehicleActionStation,
  PaneIdentifiersInfusionChoice,
  PaneIdentifiersPreferenceOptionalClassFeaturesConfirm,
  PaneIdentifiersPreferenceOptionalOriginsConfirm,
  PaneIdentifiersContainer,
  PaneIdentifiersCurrencyContext,
  PaneIdentifiersBlessing,
  PaneIdentifiersTrait,
} from "~/subApps/sheet/components/Sidebar/types";

//TODO move this to subapps Sidebar

/**
 *
 * @param mappingId
 * @param mappingEntityTypeId
 */
export function generateAction(
  mappingId: string,
  mappingEntityTypeId: string | null
): PaneIdentifiersAction {
  return {
    id: mappingId,
    entityTypeId: mappingEntityTypeId,
  };
}

/**
 *
 * @param id
 */
export function generateBasicAction(id: number): PaneIdentifiersBasicAction {
  return {
    id,
  };
}

/**
 *
 * @param mappingId
 */
export function generateItem(mappingId: number): PaneIdentifiersItem {
  return {
    id: mappingId,
  };
}

/**
 *
 * @param mappingId
 */
export function generateCharacterSpell(
  mappingId: number,
  castLevel?: number
): PaneIdentifiersCharacterSpell {
  return {
    id: mappingId,
    castLevel,
  };
}

/**
 *
 * @param classMappingId
 * @param spellMappingId
 */
export function generateClassSpell(
  classMappingId: number,
  spellMappingId: number,
  castLevel?: number
): PaneIdentifiersClassSpell {
  return {
    classId: classMappingId,
    spellId: spellMappingId,
    castLevel,
  };
}

/**
 *
 * @param noteType
 */
export function generateNote(noteType: string): PaneIdentifiersNote {
  return {
    noteType,
  };
}

/**
 *
 * @param classFeatureId
 * @param classMappingId
 */
export function generateClassFeature(
  classFeatureId: number,
  classMappingId: number
): PaneIdentifiersClassFeature {
  return {
    classMappingId,
    id: classFeatureId,
  };
}

/**
 *
 * @param racialTraitId
 */
export function generateRacialTrait(
  racialTraitId: number
): PaneIdentifiersRacialTrait {
  return {
    id: racialTraitId,
  };
}

/**
 *
 * @param id
 */
export function generateFeat(id: number): PaneIdentifiersFeat {
  return {
    id,
  };
}

/**
 *
 * @param id
 */
export function generateBlessing(id: string): PaneIdentifiersBlessing {
  return {
    id,
  };
}

/**
 *
 * @param id
 */
export function generateCustomAction(id: string): PaneIdentifiersCustomAction {
  return {
    id,
  };
}

/**
 *
 * @param type
 */
export function generateTrait(
  type: Constants.TraitTypeEnum
): PaneIdentifiersTrait {
  return {
    type,
  };
}

/**
 *
 * @param mappingId
 */
export function generateCustomItem(
  mappingId: number
): PaneIdentifiersCustomItem {
  return {
    id: mappingId,
  };
}

/**
 *
 * @param mappingId
 */
export function generateCustomSkill(
  mappingId: number
): PaneIdentifiersCustomSkill {
  return {
    id: mappingId,
  };
}

/**
 *
 * @param id
 */
export function generateAbility(
  ability: AbilityManager
): PaneIdentifiersAbility {
  return {
    ability,
  };
}

/**
 *
 * @param id
 */
export function generateSkill(id: number): PaneIdentifiersSkill {
  return {
    id,
  };
}

/**
 *
 * @param abilityId
 */
export function generateAbilitySavingThrows(
  abilityId: number
): PaneIdentifiersAbilitySavingThrow {
  return {
    id: abilityId,
  };
}

/**
 *
 * @param hitPointType
 */
export function generatePreferenceHitPointConfirm(
  hitPointType: number
): PaneIdentifiersPreferenceHitPointConfirm {
  return {
    id: hitPointType,
  };
}

/**
 *
 * @param progressionType
 */
export function generatePreferenceProgressionConfirm(
  progressionType: number
): PaneIdentifiersPreferenceProgressionConfirm {
  return {
    id: progressionType,
  };
}

/**
 *
 * @param spellListIds
 * @param newIsEnabled
 */
export function generatePreferenceOptionalClassFeaturesConfirm(
  spellListIds: Array<number>,
  newIsEnabled: boolean
): PaneIdentifiersPreferenceOptionalClassFeaturesConfirm {
  return {
    spellListIds,
    newIsEnabled,
  };
}

/**
 *
 * @param spellListIds
 * @param newIsEnabled
 */
export function generatePreferenceOptionalOriginsConfirm(
  spellListIds: Array<number>,
  newIsEnabled: boolean
): PaneIdentifiersPreferenceOptionalOriginsConfirm {
  return {
    spellListIds,
    newIsEnabled,
  };
}

/**
 *
 * @param creatureMappingId
 */
export function generateCreature(
  creatureMappingId: number
): PaneIdentifiersCreature {
  return {
    id: creatureMappingId,
  };
}

/**
 *
 * @param vehicleMappingId
 */
export function generateVehicle(vehicleMappingId): PaneIdentifiersVehicle {
  return {
    id: vehicleMappingId,
  };
}

/**
 *
 * @param componentId
 * @param vehicleId
 */
export function generateVehicleComponent(
  componentId: number,
  vehicleId: number
): PaneIdentifiersVehicleComponent {
  return {
    vehicleId,
    id: componentId,
  };
}

/**
 *
 * @param stationId
 * @param vehicleId
 */
export function generateVehicleActionStation(
  stationId: number,
  vehicleId: number
): PaneIdentifiersVehicleActionStation {
  return {
    vehicleId,
    id: stationId,
  };
}

/**
 *
 * @param id
 */
export function generateInfusionChoice(
  id: string
): PaneIdentifiersInfusionChoice {
  return {
    id,
  };
}

/**
 *
 * @param containerDefinitionKey
 */
export function generateContainer(
  containerDefinitionKey: string,
  showAddItems?: boolean
): PaneIdentifiersContainer {
  return {
    containerDefinitionKey,
    showAddItems,
  };
}

/**
 *
 * @param containerDefinitionKeyContext
 */
export function generateCurrencyContext(
  containerDefinitionKeyContext: string | null
): PaneIdentifiersCurrencyContext {
  return {
    containerDefinitionKeyContext,
  };
}
