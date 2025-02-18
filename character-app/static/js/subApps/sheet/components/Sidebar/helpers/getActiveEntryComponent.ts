import { CreaturePane } from "~/subApps/sheet/components/Sidebar/panes/CreaturePane";
import { GameLogPane } from "~/subApps/sheet/components/Sidebar/panes/GameLogPane";
import BlessingPane from "~/tools/js/Shared/containers/panes/BlessingPane";
import CharacterSpellPane from "~/tools/js/Shared/containers/panes/CharacterSpellPane";
import ClassSpellPane from "~/tools/js/Shared/containers/panes/ClassSpellPane";
import ConditionManagePane from "~/tools/js/Shared/containers/panes/ConditionManagePane";
import ContainerPane from "~/tools/js/Shared/containers/panes/ContainerPane";
import CurrencyPane from "~/tools/js/Shared/containers/panes/CurrencyPane";
import CustomActionPane from "~/tools/js/Shared/containers/panes/CustomActionPane";
import CustomActionsPane from "~/tools/js/Shared/containers/panes/CustomActionsPane";
import CustomSkillPane from "~/tools/js/Shared/containers/panes/CustomSkillPane";
import DecoratePane from "~/tools/js/Shared/containers/panes/DecoratePane";
import DefenseManagePane from "~/tools/js/Shared/containers/panes/DefenseManagePane";
import DescriptionPane from "~/tools/js/Shared/containers/panes/DescriptionPane";
import EncumbrancePane from "~/tools/js/Shared/containers/panes/EncumbrancePane";
import EquipmentManagePane from "~/tools/js/Shared/containers/panes/EquipmentManagePane";
import { ExportPdfPane } from "~/tools/js/Shared/containers/panes/ExportPdfPane";
import ExtraManagePane from "~/tools/js/Shared/containers/panes/ExtraManagePane";
import InfusionChoicePane from "~/tools/js/Shared/containers/panes/InfusionChoicePane";
import ItemPane from "~/tools/js/Shared/containers/panes/ItemPane";
import LongRestPane from "~/tools/js/Shared/containers/panes/LongRestPane";
import NoteManagePane from "~/tools/js/Shared/containers/panes/NoteManagePane";
import { PreferencesHitPointConfirmPane } from "~/tools/js/Shared/containers/panes/PreferencesHitPointConfirmPane";
import PreferencesOptionalClassFeaturesConfirmPane from "~/tools/js/Shared/containers/panes/PreferencesOptionalClassFeaturesConfirmPane/PreferencesOptionalClassFeaturesConfirmPane";
import PreferencesOptionalOriginsConfirmPane from "~/tools/js/Shared/containers/panes/PreferencesOptionalOriginsConfirmPane/PreferencesOptionalOriginsConfirmPane";
import PreferencesPane, {
  OptionsPane,
} from "~/tools/js/Shared/containers/panes/PreferencesPane";
import { PreferencesProgressionConfirmPane } from "~/tools/js/Shared/containers/panes/PreferencesProgressionConfirmPane";
import ProficienciesPane from "~/tools/js/Shared/containers/panes/ProficienciesPane";
import ProficiencyBonusPane from "~/tools/js/Shared/containers/panes/ProficiencyBonusPane";
import SavingThrowsPane from "~/tools/js/Shared/containers/panes/SavingThrowsPane";
import SenseManagePane from "~/tools/js/Shared/containers/panes/SenseManagePane";
import SettingsPane from "~/tools/js/Shared/containers/panes/SettingsPane";
import { ShareUrlPane } from "~/tools/js/Shared/containers/panes/ShareUrlPane";
import ShortRestPane from "~/tools/js/Shared/containers/panes/ShortRestPane";
import SkillPane from "~/tools/js/Shared/containers/panes/SkillPane";
import SkillsPane from "~/tools/js/Shared/containers/panes/SkillsPane";
import SpeciesTraitPane from "~/tools/js/Shared/containers/panes/SpeciesTraitPane";
import SpeedManagePane from "~/tools/js/Shared/containers/panes/SpeedManagePane";
import SpellManagePane from "~/tools/js/Shared/containers/panes/SpellManagePane";
import StartingEquipmentPane from "~/tools/js/Shared/containers/panes/StartingEquipmentPane";
import TraitPane from "~/tools/js/Shared/containers/panes/TraitPane";
import VehicleComponentPane from "~/tools/js/Shared/containers/panes/VehicleComponentPane";
import VehiclePane from "~/tools/js/Shared/containers/panes/VehiclePane";

import { AbilityPane } from "../panes/AbilityPane";
import { AbilitySavingThrowsPane } from "../panes/AbilitySavingThrowsPane";
import { ActionPane } from "../panes/ActionPane";
import { ArmorManagePane } from "../panes/ArmorManagePane";
import { BackgroundPane } from "../panes/BackgroundPane";
import { BasicActionPane } from "../panes/BasicActionPane";
import { CampaignPane } from "../panes/CampaignPane";
import { CharacterManagePane } from "../panes/CharacterManagePane";
import { ClassFeaturePane } from "../panes/ClassFeaturePane";
import { FeatPane } from "../panes/FeatPane";
import { FeatsManagePane } from "../panes/FeatsManagePane";
import { HitPointsManagePane } from "../panes/HitPointsManagePane";
import { InitiativePane } from "../panes/InitiativePane";
import { InspirationPane } from "../panes/InspirationPane";
import { XpPane } from "../panes/XpPane";
import { PaneComponentEnum, SidebarPaneComponent } from "../types";

// Refactor this to a hook that returns a component?
export const getActiveEntryComponent = (
  hasCampaignSettingFlag: boolean,
  componentType?: PaneComponentEnum
): SidebarPaneComponent<any> | null => {
  if (!componentType) return null;

  switch (componentType) {
    case PaneComponentEnum.HEALTH_MANAGE:
      return HitPointsManagePane;

    case PaneComponentEnum.ITEM_DETAIL:
      return ItemPane;

    case PaneComponentEnum.CHARACTER_SPELL_DETAIL:
      return CharacterSpellPane;

    case PaneComponentEnum.CLASS_SPELL_DETAIL:
      return ClassSpellPane;

    case PaneComponentEnum.ABILITY:
      return AbilityPane;

    case PaneComponentEnum.SKILLS:
      return SkillsPane;

    case PaneComponentEnum.PROFICIENCIES:
      return ProficienciesPane;

    case PaneComponentEnum.XP:
      return XpPane;

    case PaneComponentEnum.SHORT_REST:
      return ShortRestPane;

    case PaneComponentEnum.LONG_REST:
      return LongRestPane;

    case PaneComponentEnum.SPELL_MANAGE:
      return SpellManagePane;

    case PaneComponentEnum.CONDITION_MANAGE:
      return ConditionManagePane;

    case PaneComponentEnum.SPEED_MANAGE:
      return SpeedManagePane;

    case PaneComponentEnum.SENSE_MANAGE:
      return SenseManagePane;

    case PaneComponentEnum.DEFENSE_MANAGE:
      return DefenseManagePane;

    case PaneComponentEnum.ARMOR_MANAGE:
      return ArmorManagePane;

    case PaneComponentEnum.FEATS_MANAGE:
      return FeatsManagePane;

    case PaneComponentEnum.NOTE_MANAGE:
      return NoteManagePane;

    case PaneComponentEnum.TRAIT:
      return TraitPane;

    case PaneComponentEnum.CAMPAIGN:
      return CampaignPane;

    case PaneComponentEnum.EQUIPMENT_MANAGE:
      return EquipmentManagePane;

    case PaneComponentEnum.CURRENCY:
      return CurrencyPane;

    case PaneComponentEnum.ENCUMBRANCE:
      return EncumbrancePane;

    case PaneComponentEnum.STARTING_EQUIPMENT:
      return StartingEquipmentPane;

    case PaneComponentEnum.CUSTOM_ACTIONS:
      return CustomActionsPane;

    case PaneComponentEnum.CUSTOM_ACTION:
      return CustomActionPane;

    case PaneComponentEnum.CLASS_FEATURE_DETAIL:
      return ClassFeaturePane;

    case PaneComponentEnum.FEAT_DETAIL:
      return FeatPane;

    case PaneComponentEnum.SPECIES_TRAIT_DETAIL:
      return SpeciesTraitPane;

    case PaneComponentEnum.BACKGROUND:
      return BackgroundPane;

    case PaneComponentEnum.DESCRIPTION:
      return DescriptionPane;

    case PaneComponentEnum.PROFICIENCY_BONUS:
      return ProficiencyBonusPane;

    case PaneComponentEnum.INSPIRATION:
      return InspirationPane;

    case PaneComponentEnum.INITIATIVE:
      return InitiativePane;

    case PaneComponentEnum.ACTION:
      return ActionPane;

    case PaneComponentEnum.PREFERENCES:
      return hasCampaignSettingFlag ? OptionsPane : PreferencesPane;

    case PaneComponentEnum.SKILL:
      return SkillPane;

    case PaneComponentEnum.CUSTOM_SKILL:
      return CustomSkillPane;

    case PaneComponentEnum.SAVING_THROWS:
      return SavingThrowsPane;

    case PaneComponentEnum.ABILITY_SAVING_THROW:
      return AbilitySavingThrowsPane;

    case PaneComponentEnum.BASIC_ACTION:
      return BasicActionPane;

    case PaneComponentEnum.PREFERENCES_HIT_POINT_CONFIRM:
      return PreferencesHitPointConfirmPane;

    case PaneComponentEnum.PREFERENCES_OPTIONAL_CLASS_FEATURES_CONFIRM:
      return PreferencesOptionalClassFeaturesConfirmPane;

    case PaneComponentEnum.PREFERENCES_OPTIONAL_ORIGINS_CONFIRM:
      return PreferencesOptionalOriginsConfirmPane;

    case PaneComponentEnum.PREFERENCES_PROGRESSION_CONFIRM:
      return PreferencesProgressionConfirmPane;

    case PaneComponentEnum.SHARE_URL:
      return ShareUrlPane;

    case PaneComponentEnum.CREATURE:
      return CreaturePane;

    case PaneComponentEnum.VEHICLE:
      return VehiclePane;

    case PaneComponentEnum.VEHICLE_COMPONENT:
      return VehicleComponentPane;

    case PaneComponentEnum.EXTRA_MANAGE:
      return ExtraManagePane;

    case PaneComponentEnum.INFUSION_CHOICE:
      return InfusionChoicePane;

    case PaneComponentEnum.EXPORT_PDF:
      return ExportPdfPane;

    case PaneComponentEnum.CHARACTER_MANAGE:
      return CharacterManagePane;

    case PaneComponentEnum.GAME_LOG:
      return GameLogPane;

    case PaneComponentEnum.CONTAINER:
      return ContainerPane;

    case PaneComponentEnum.DECORATE:
      return DecoratePane;

    case PaneComponentEnum.SETTINGS:
      return SettingsPane;

    case PaneComponentEnum.BLESSING_DETAIL:
    default:
      return BlessingPane;
  }
};
