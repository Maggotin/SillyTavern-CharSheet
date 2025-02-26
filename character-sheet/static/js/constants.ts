import { Constants } from "src/character-rules-engine/es/constants";

import config from "./config";




const CategoryPrefix = "Character Listing";

export const EventCategories = {
  STCS_Character: `${CategoryPrefix} Character Card`,
  STCS_ListingFilter: `${CategoryPrefix} Filter`,
  STCS_ListingSort: `${CategoryPrefix} Sort`,
  STCS_Unlock: `${CategoryPrefix} Unlock`,
};


export const EventLabels = {
  Cancelled: "Cancelled",
  Clicked: "Clicked",
  Confirmed: "Confirmed",
};

export const InputLimits = {
  characterNameMaxLength: 128,
};

export const CharacterNameLimitMsg = `The max length for a name is ${InputLimits.characterNameMaxLength} characters.`;

export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif"];
export const FILE_SIZE_3MB = 3 * 1024 * 1024;

/**
 * Export constants from the rules engine to reduce the number of places where
 * they're being imported.
 **/
export const ActionCustomizationAdjustmentTypes =
  Constants.ACTION_CUSTOMIZATION_ADJUSTMENT_TYPES;
export const AllArmorList = Constants.ALL_ARMOR_LIST;
export const AbilityScoreStatTypeEnum = Constants.AbilityScoreStatTypeEnum;
export const AbilityScoreTypeEnum = Constants.AbilityScoreTypeEnum;
export const AbilitySkillEnum = Constants.AbilitySkillEnum;
export const AbilityStatEnum = Constants.AbilityStatEnum;
export const AbilityStatMentalList = Constants.ABILITY_STAT_MENTAL_LIST;
export const AbilityStatPhysicalList = Constants.ABILITY_STAT_PHYSICAL_LIST;
export const ActionTypeEnum = Constants.ActionTypeEnum;
export const ActivatableTypeEnum = Constants.ActivatableTypeEnum;
export const ActivationTypeEnum = Constants.ActivationTypeEnum;
export const AdditionalTypeEnum = Constants.AdditionalTypeEnum;
export const AdjustmentConstraintTypeEnum =
  Constants.AdjustmentConstraintTypeEnum;
export const AdjustmentDataTypeEnum = Constants.AdjustmentDataTypeEnum;
export const AdjustmentTypeEnum = Constants.AdjustmentTypeEnum;
export const AppContextTypeEnum = Constants.AppContextTypeEnum;
export const ArmorClassExtraTypeEnum = Constants.ArmorClassExtraTypeEnum;
export const ArmorClassTypeEnum = Constants.ArmorClassTypeEnum;
export const ArmorTypeEnum = Constants.ArmorTypeEnum;
export const AttackSourceTypeEnum = Constants.AttackSourceTypeEnum;
export const AttackSubtypeEnum = Constants.AttackSubtypeEnum;
export const AttackTypeRangeEnum = Constants.AttackTypeRangeEnum;
export const BackgroundModifierTypeEnum = Constants.BackgroundModifierTypeEnum;
export const CharacterColorEnum = Constants.CharacterColorEnum;
export const CoinNamesEnum = Constants.CoinNamesEnum;
export const CoinTypeEnum = Constants.CoinTypeEnum;
export const ComponentAdjustmentEnum = Constants.ComponentAdjustmentEnum;
export const ComponentCostTypeEnum = Constants.ComponentCostTypeEnum;
export const ConditionIdEnum = Constants.ConditionIdEnum;
export const ConditionTypeEnum = Constants.ConditionTypeEnum;
export const ContainerTypeEnum = Constants.ContainerTypeEnum;
export const CreatureGroupFlagEnum = Constants.CreatureGroupFlagEnum;
export const CreatureSizeEnum = Constants.CreatureSizeEnum;
export const CreatureSizeNameEnum = Constants.CreatureSizeNameEnum;
export const CustomProficiencyTypeEnum = Constants.CustomProficiencyTypeEnum;
export const DamageAdjustmentList = Constants.DAMAGE_ADJUSTMENT_LIST;
export const DbStringBookOfAncientSecrets =
  Constants.DB_STRING_BOOK_OF_ANCIENT_SECRETS;
export const DbStringCarapace = Constants.DB_STRING_CARAPACE;
export const DbStringDedicatedWeapon = Constants.DB_STRING_DEDICATED_WEAPON;
export const DbStringEldritchAdept = Constants.DB_STRING_ELDRITCH_ADEPT;
export const DbStringGroupSidekick = Constants.DB_STRING_GROUP_SIDEKICK;
export const DbStringImprovedPactWeapon =
  Constants.DB_STRING_IMPROVED_PACT_WEAPON;
export const DbStringInfuseItem = Constants.DB_STRING_INFUSE_ITEM;
export const DbStringIntegratedProtection =
  Constants.DB_STRING_INTEGRATED_PROTECTION;
export const DbStringMartialArts = Constants.DB_STRING_MARTIAL_ARTS;
export const DbStringMediumArmorMaster =
  Constants.DB_STRING_MEDIUM_ARMOR_MASTER;
export const DbStringPactMagic = Constants.DB_STRING_PACT_MAGIC;
export const DbStringRitualCasterBard = Constants.DB_STRING_RITUAL_CASTER_BARD;
export const DbStringRitualCasterCleric =
  Constants.DB_STRING_RITUAL_CASTER_CLERIC;
export const DbStringRitualCasterDruid =
  Constants.DB_STRING_RITUAL_CASTER_DRUID;
export const DbStringRitualCasterList = Constants.DB_STRING_RITUAL_CASTER_LIST;
export const DbStringRitualCasterSorcerer =
  Constants.DB_STRING_RITUAL_CASTER_SORCERER;
export const DbStringRitualCasterWarlock =
  Constants.DB_STRING_RITUAL_CASTER_WARLOCK;
export const DbStringRitualCasterWizard =
  Constants.DB_STRING_RITUAL_CASTER_WIZARD;
export const DbStringSpellcasting = Constants.DB_STRING_SPELLCASTING;
export const DbStringSpellEldritchBlast =
  Constants.DB_STRING_SPELL_ELDRITCH_BLAST;
export const DbStringTagSidekick = Constants.DB_STRING_TAG_SIDEKICK;
export const DbStringVerdan = Constants.DB_STRING_VERDAN;
export const DefaultFeatureFlagInfo = Constants.DEFAULT_FEATURE_FLAG_INFO;
export const DefinitionKeySeparator = Constants.DEFINITION_KEY_SEPARATOR;
export const DefinitionServiceVersions = Constants.DEFINITION_SERVICE_VERSIONS;
export const DiceRollKeyConceptSeparator =
  Constants.DICE_ROLL_KEY_CONCEPT_SEPARATOR;
export const DiceRollKeyDataSeparator = Constants.DICE_ROLL_KEY_DATA_SEPARATOR;
export const DamageAdjustmentTypeEnum = Constants.DamageAdjustmentTypeEnum;
export const DataOriginDataInfoKeyEnum = Constants.DataOriginDataInfoKeyEnum;
export const DataOriginTypeEnum = Constants.DataOriginTypeEnum;
export const DeathCauseEnum = Constants.DeathCauseEnum;
export const DefenseAdjustmentTypeEnum = Constants.DefenseAdjustmentTypeEnum;
export const DefinitionPoolTypeInfoKeyEnum =
  Constants.DefinitionPoolTypeInfoKeyEnum;
export const DefinitionTypeEnum = Constants.DefinitionTypeEnum;
export const DiceAdjustmentRollTypeEnum = Constants.DiceAdjustmentRollTypeEnum;
export const DiceAdjustmentTypeEnum = Constants.DiceAdjustmentTypeEnum;
export const DiceRollExcludeTypeEnum = Constants.DiceRollExcludeTypeEnum;
export const DisplayConfigurationTypeEnum =
  Constants.DisplayConfigurationTypeEnum;
export const DisplayConfigurationValueEnum =
  Constants.DisplayConfigurationValueEnum;
export const DisplayIntentionEnum = Constants.DisplayIntentionEnum;
export const DurationUnitEnum = Constants.DurationUnitEnum;
export const EntityLimitedUseScaleOperatorEnum =
  Constants.EntityLimitedUseScaleOperatorEnum;
export const EntityTypeEnum = Constants.EntityTypeEnum;
export const ExtraGroupTypeEnum = Constants.ExtraGroupTypeEnum;
export const ExtraTypeEnum = Constants.ExtraTypeEnum;
export const FeatureFlagList = Constants.FEATURE_FLAG_LIST;
export const FeetInMiles = Constants.FEET_IN_MILES;
export const FutureItemDefinitionType = Constants.FUTURE_ITEM_DEFINITION_TYPE;
export const FeatureFlagEnum = Constants.FeatureFlagEnum;
export const FeatureTypeEnum = Constants.FeatureTypeEnum;
export const HackVehicleGroupId = Constants.HACK_VEHICLE_GROUP_ID;
export const HeavyArmorList = Constants.HEAVY_ARMOR_LIST;
export const ItemCustomizationAdjustmentTypes =
  Constants.ITEM_CUSTOMIZATION_ADJUSTMENT_TYPES;
export const InfusionItemDataRuleTypeEnum =
  Constants.InfusionItemDataRuleTypeEnum;
export const InfusionModifierDataTypeEnum =
  Constants.InfusionModifierDataTypeEnum;
export const InfusionTypeEnum = Constants.InfusionTypeEnum;
export const ItemBaseTypeEnum = Constants.ItemBaseTypeEnum;
export const ItemBaseTypeIdEnum = Constants.ItemBaseTypeIdEnum;
export const ItemRarityNameEnum = Constants.ItemRarityNameEnum;
export const ItemTypeEnum = Constants.ItemTypeEnum;
export const LightArmorList = Constants.LIGHT_ARMOR_LIST;
export const LimitedUseResetTypeEnum = Constants.LimitedUseResetTypeEnum;
export const LimitedUseResetTypeNameEnum =
  Constants.LimitedUseResetTypeNameEnum;
export const LogMessageType = Constants.LogMessageType;
export const MagicItemAttackWithStatList =
  Constants.MAGIC_ITEM_ATTACK_WITH_STAT_LIST;
export const MagicItemEntityTypeId = Constants.MAGIC_ITEM_ENTITY_TYPE_ID;
export const MediumArmorList = Constants.MEDIUM_ARMOR_LIST;
export const ModifierBonusTypeEnum = Constants.ModifierBonusTypeEnum;
export const ModifierSubTypeEnum = Constants.ModifierSubTypeEnum;
export const ModifierTypeEnum = Constants.ModifierTypeEnum;
export const MovementTypeEnum = Constants.MovementTypeEnum;
export const MulticlassSpellSlotRoundingEnum =
  Constants.MulticlassSpellSlotRoundingEnum;
export const NoteKeyEnum = Constants.NoteKeyEnum;
export const NoteTypeEnum = Constants.NoteTypeEnum;
export const NotificationTypeEnum = Constants.NotificationTypeEnum;
export const PoundsInTon = Constants.POUNDS_IN_TON;
export const PropertyList = Constants.PROPERTY_LIST;
export const PartyInventorySharingStateEnum =
  Constants.PartyInventorySharingStateEnum;
export const PreferenceAbilityScoreDisplayTypeEnum =
  Constants.PreferenceAbilityScoreDisplayTypeEnum;
export const PreferenceEncumbranceTypeEnum =
  Constants.PreferenceEncumbranceTypeEnum;
export const PreferenceHitPointTypeEnum = Constants.PreferenceHitPointTypeEnum;
export const PreferencePrivacyTypeEnum = Constants.PreferencePrivacyTypeEnum;
export const PreferenceProgressionTypeEnum =
  Constants.PreferenceProgressionTypeEnum;
export const PreferenceSharingTypeEnum = Constants.PreferenceSharingTypeEnum;
export const PrerequisiteSubTypeEnum = Constants.PrerequisiteSubTypeEnum;
export const PrerequisiteTypeEnum = Constants.PrerequisiteTypeEnum;
export const ProficiencyAdjustmentTypeEnum =
  Constants.ProficiencyAdjustmentTypeEnum;
export const ProficiencyLevelEnum = Constants.ProficiencyLevelEnum;
export const ProficiencyRoundingEnum = Constants.ProficiencyRoundingEnum;
export const ProtectionAvailabilityStatusEnum =
  Constants.ProtectionAvailabilityStatusEnum;
export const ProtectionSupplierTypeEnum = Constants.ProtectionSupplierTypeEnum;
export const RaceTypeEnum = Constants.RaceTypeEnum;
export const RitualCastingTypeEnum = Constants.RitualCastingTypeEnum;
export const RuleDataTypeEnum = Constants.RuleDataTypeEnum;
export const RuleKeyEnum = Constants.RuleKeyEnum;
export const ShieldsList = Constants.SHIELDS_LIST;
export const SizeList = Constants.SIZE_LIST;
export const SpellCustomizationAdjustmentTypes =
  Constants.SPELL_CUSTOMIZATION_ADJUSTMENT_TYPES;
export const StatAbilityCheckList = Constants.STAT_ABILITY_CHECK_LIST;
export const StatAbilityScoreList = Constants.STAT_ABILITY_SCORE_LIST;
export const StatSavingThrowList = Constants.STAT_SAVING_THROW_LIST;
export const SaveTypeEnum = Constants.SaveTypeEnum;
export const SenseTypeEnum = Constants.SenseTypeEnum;
export const SituationalBonusSavingThrowTypeEnum =
  Constants.SituationalBonusSavingThrowTypeEnum;
export const SnippetAbilityKeyEnum = Constants.SnippetAbilityKeyEnum;
export const SnippetContentChunkTypeEnum =
  Constants.SnippetContentChunkTypeEnum;
export const SnippetMathOperatorEnum = Constants.SnippetMathOperatorEnum;
export const SnippetPostProcessTypeEnum = Constants.SnippetPostProcessTypeEnum;
export const SnippetSymbolEnum = Constants.SnippetSymbolEnum;
export const SnippetTagDataTypeEnum = Constants.SnippetTagDataTypeEnum;
export const SnippetTagValueTypeEnum = Constants.SnippetTagValueTypeEnum;
export const SnippetValueModifierTypeEnum =
  Constants.SnippetValueModifierTypeEnum;
export const SourceTypeEnum = Constants.SourceTypeEnum;
export const SpeedMovementKeyEnum = Constants.SpeedMovementKeyEnum;
export const SpellConditionTypeEnum = Constants.SpellConditionTypeEnum;
export const SpellDurationTypeEnum = Constants.SpellDurationTypeEnum;
export const SpellGroupEnum = Constants.SpellGroupEnum;
export const SpellPrepareTypeEnum = Constants.SpellPrepareTypeEnum;
export const SpellRangeTypeEnum = Constants.SpellRangeTypeEnum;
export const SpellRangeTypeNameEnum = Constants.SpellRangeTypeNameEnum;
export const SpellScaleTypeNameEnum = Constants.SpellScaleTypeNameEnum;
export const StartingEquipmentRuleTypeEnum =
  Constants.StartingEquipmentRuleTypeEnum;
export const StartingEquipmentTypeEnum = Constants.StartingEquipmentTypeEnum;
export const StatBlockTypeEnum = Constants.StatBlockTypeEnum;
export const StealthCheckTypeEnum = Constants.StealthCheckTypeEnum;
export const TraitTypeEnum = Constants.TraitTypeEnum;
export const UsableDiceAdjustmentTypeEnum =
  Constants.UsableDiceAdjustmentTypeEnum;
export const VehicleComponentGroupTypeEnum =
  Constants.VehicleComponentGroupTypeEnum;
export const VehicleConfigurationDisplayTypeEnum =
  Constants.VehicleConfigurationDisplayTypeEnum;
export const VehicleConfigurationKeyEnum =
  Constants.VehicleConfigurationKeyEnum;
export const VehicleConfigurationPrimaryComponentManageTypeEnum =
  Constants.VehicleConfigurationPrimaryComponentManageTypeEnum;
export const VehicleConfigurationSizeTypeEnum =
  Constants.VehicleConfigurationSizeTypeEnum;
export const WeaponCategoryEnum = Constants.WeaponCategoryEnum;
export const WeaponPropertyEnum = Constants.WeaponPropertyEnum;
export const WeaponTypeEnum = Constants.WeaponTypeEnum;
export const WeightSpeedTypeEnum = Constants.WeightSpeedTypeEnum;
export const WeightTypeEnum = Constants.WeightTypeEnum;

export const DefaultCharacterName = Constants.DefaultCharacterName;
