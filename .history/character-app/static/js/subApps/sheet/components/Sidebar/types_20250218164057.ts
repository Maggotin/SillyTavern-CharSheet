import {
  AbilityManager,
  Constants,
} from "../../rules-engine/es";

export interface PaneIdentifiersCommonId {
  id: string | number;
}

export interface PaneIdentifiersIntId {
  id: number;
}

export interface PaneIdentifiersAction extends PaneIdentifiersCommonId {
  entityTypeId: string | null;
}

export interface PaneIdentifiersClassSpell {
  classId: number;
  spellId: number;
  castLevel?: number;
}

export interface PaneIdentifiersNote {
  noteType: string;
}

export interface PaneIdentifiersClassFeature extends PaneIdentifiersCommonId {
  classMappingId: number;
}

export interface PaneIdentifiersBasicAction extends PaneIdentifiersIntId {}
export interface PaneIdentifiersPreferenceHitPointConfirm
  extends PaneIdentifiersIntId {}
export interface PaneIdentifiersPreferenceProgressionConfirm
  extends PaneIdentifiersIntId {}
export interface PaneIdentifiersFeat extends PaneIdentifiersIntId {}

export interface PaneIdentifiersItem extends PaneIdentifiersCommonId {}
export interface PaneIdentifiersItem extends PaneIdentifiersCommonId {}
export interface PaneIdentifiersCustomItem extends PaneIdentifiersCommonId {}
export interface PaneIdentifiersCustomSkill extends PaneIdentifiersCommonId {}
export interface PaneIdentifiersCustomAction extends PaneIdentifiersCommonId {}
export interface PaneIdentifiersCharacterSpell extends PaneIdentifiersCommonId {
  castLevel?: number;
}
export interface PaneIdentifiersRacialTrait extends PaneIdentifiersCommonId {}
export interface PaneIdentifiersAbilitySavingThrow
  extends PaneIdentifiersCommonId {}
export interface PaneIdentifiersSkill extends PaneIdentifiersCommonId {}
export interface PaneIdentifiersCreature extends PaneIdentifiersCommonId {}
export interface PaneIdentifiersVehicle extends PaneIdentifiersCommonId {}
export interface PaneIdentifiersInfusionChoice
  extends PaneIdentifiersCommonId {}

export interface PaneIdentifiersAbility {
  ability: AbilityManager;
}

export interface PaneIdentifiersPreferenceOptionalClassFeaturesConfirm {
  spellListIds: Array<number>;
  newIsEnabled: boolean;
}

export interface PaneIdentifiersPreferenceOptionalOriginsConfirm {
  spellListIds: Array<number>;
  newIsEnabled: boolean;
}

export interface PaneIdentifiersVehicleComponent
  extends PaneIdentifiersCommonId {
  vehicleId: number;
}

export interface PaneIdentifiersVehicleActionStation
  extends PaneIdentifiersCommonId {
  vehicleId: number;
}

export interface PaneIdentifiersContainer {
  containerDefinitionKey: string;
  showAddItems?: boolean;
}

export interface PaneIdentifiersCurrencyContext {
  containerDefinitionKeyContext: string | null;
}

export interface PaneIdentifiersSettingsContext {
  context: string;
}

export interface PaneIdentifiersBlessing {
  id: string;
}

export interface PaneIdentifiersTrait {
  type: Constants.TraitTypeEnum;
}

export type PaneIdentifiers =
  | PaneIdentifiersAction
  | PaneIdentifiersClassSpell
  | PaneIdentifiersNote
  | PaneIdentifiersClassFeature
  | PaneIdentifiersRacialTrait
  | PaneIdentifiersItem
  | PaneIdentifiersBasicAction
  | PaneIdentifiersCharacterSpell
  | PaneIdentifiersFeat
  | PaneIdentifiersCustomAction
  | PaneIdentifiersCustomItem
  | PaneIdentifiersCustomSkill
  | PaneIdentifiersAbility
  | PaneIdentifiersSkill
  | PaneIdentifiersAbilitySavingThrow
  | PaneIdentifiersPreferenceHitPointConfirm
  | PaneIdentifiersPreferenceOptionalClassFeaturesConfirm
  | PaneIdentifiersPreferenceOptionalOriginsConfirm
  | PaneIdentifiersPreferenceProgressionConfirm
  | PaneIdentifiersCreature
  | PaneIdentifiersVehicle
  | PaneIdentifiersVehicleComponent
  | PaneIdentifiersInfusionChoice
  | PaneIdentifiersContainer
  | PaneIdentifiersCurrencyContext
  | PaneIdentifiersSettingsContext
  | PaneIdentifiersBlessing
  | PaneIdentifiersTrait;

export interface PaneComponentProperties {
  forceDarkMode?: boolean;
  isFullWidth?: boolean;
}

export type SidebarPaneComponent<T> = React.ComponentType<T>;

export interface PaneComponentInfo {
  type: PaneComponentEnum;
  identifiers?: PaneIdentifiers | null;
}

export enum PaneComponentEnum {
  ERROR_404 = "ERROR_404",
  ABILITY = "ABILITY",
  ABILITY_SAVING_THROW = "ABILITY_SAVING_THROW",
  ACTION = "ACTION",
  ARMOR_MANAGE = "ARMOR_MANAGE",
  BASIC_ACTION = "BASIC_ACTION",
  BACKGROUND = "BACKGROUND",
  BLESSING_DETAIL = "BLESSING_DETAIL",
  CAMPAIGN = "CAMPAIGN",
  CHARACTER_MANAGE = "CHARACTER_MANAGE",
  CHARACTER_SPELL_DETAIL = "CHARACTER_SPELL_DETAIL",
  CLASS_FEATURE_DETAIL = "CLASS_FEATURE_DETAIL",
  CLASS_SPELL_DETAIL = "CLASS_SPELL_DETAIL",
  CONDITION_MANAGE = "CONDITION_MANAGE",
  CONTAINER = "CONTAINER",
  CREATURE = "CREATURE",
  CURRENCY = "CURRENCY",
  CUSTOM_ACTIONS = "CUSTOM_ACTIONS",
  CUSTOM_ACTION = "CUSTOM_ACTION",
  CUSTOM_SKILL = "CUSTOM_SKILL",
  DECORATE = "DECORATE",
  DEFENSE_MANAGE = "DEFENSE_MANAGE",
  DESCRIPTION = "DESCRIPTION",
  ENCUMBRANCE = "ENCUMBRANCE",
  EQUIPMENT_MANAGE = "EQUIPMENT_MANAGE",
  EXPORT_PDF = "EXPORT_PDF",
  EXTRA_MANAGE = "EXTRA_MANAGE",
  FEAT_DETAIL = "FEAT_DETAIL",
  FEATS_MANAGE = "FEATS_MANAGE",
  GAME_LOG = "GAME_LOG",
  HEALTH_MANAGE = "HEALTH_MANAGE",
  INFUSION_CHOICE = "INFUSION_CHOICE",
  INITIATIVE = "INITIATIVE",
  INSPIRATION = "INSPIRATION",
  ITEM_DETAIL = "ITEM_DETAIL",
  LONG_REST = "LONG_REST",
  NOTE_MANAGE = "NOTE_MANAGE",
  POSSESSIONS_MANAGE = "POSSESSIONS_MANAGE",
  PREFERENCES = "PREFERENCES",
  PREFERENCES_HIT_POINT_CONFIRM = "PREFERENCES_HIT_POINT_CONFIRM",
  PREFERENCES_OPTIONAL_CLASS_FEATURES_CONFIRM = "PREFERENCES_OPTIONAL_CLASS_FEATURES_CONFIRM",
  PREFERENCES_OPTIONAL_ORIGINS_CONFIRM = "PREFERENCES_OPTIONAL_ORIGINS_CONFIRM",
  PREFERENCES_PROGRESSION_CONFIRM = "PREFERENCES_PROGRESSION_CONFIRM",
  PROFICIENCIES = "PROFICIENCIES",
  PROFICIENCY_BONUS = "PROFICIENCY_BONUS",
  SPECIES_TRAIT_DETAIL = "SPECIES_TRAIT_DETAIL",
  SAVING_THROWS = "SAVING_THROWS",
  SENSE_MANAGE = "SENSE_MANAGE",
  SETTINGS = "SETTINGS",
  SHARE_URL = "SHARE_URL",
  SHORT_REST = "SHORT_REST",
  SKILLS = "SKILLS",
  SKILL = "SKILL",
  SPEED_MANAGE = "SPEED_MANAGE",
  SPELL_MANAGE = "SPELL_MANAGE",
  STARTING_EQUIPMENT = "STARTING_EQUIPMENT",
  TRAIT = "TRAIT",
  VEHICLE = "VEHICLE",
  VEHICLE_COMPONENT = "VEHICLE_COMPONENT",
  VEHICLE_ACTION_STATION = "VEHICLE_ACTION_STATION",
  XP = "XP",
}

export enum SidebarPlacementEnum {
  FIXED = "fixed",
  OVERLAY = "overlay",
}

export enum SidebarAlignmentEnum {
  LEFT = "left",
  RIGHT = "right",
}

export interface SidebarPositionInfo {
  left: number | string;
  right: number | string;
}
