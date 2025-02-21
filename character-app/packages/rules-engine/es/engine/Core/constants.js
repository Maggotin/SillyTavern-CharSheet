export const FEET_IN_MILES = 5280;
export const POUNDS_IN_TON = 2000;
export var AppContextTypeEnum;
(function (AppContextTypeEnum) {
    AppContextTypeEnum["BUILDER"] = "BUILDER";
    AppContextTypeEnum["SHEET"] = "SHEET";
})(AppContextTypeEnum || (AppContextTypeEnum = {}));
export var AbilityScoreTypeEnum;
(function (AbilityScoreTypeEnum) {
    AbilityScoreTypeEnum[AbilityScoreTypeEnum["STANDARD_ARRAY"] = 1] = "STANDARD_ARRAY";
    AbilityScoreTypeEnum[AbilityScoreTypeEnum["MANUAL"] = 2] = "MANUAL";
    AbilityScoreTypeEnum[AbilityScoreTypeEnum["POINT_BUY"] = 3] = "POINT_BUY";
})(AbilityScoreTypeEnum || (AbilityScoreTypeEnum = {}));
export var AbilityStatEnum;
(function (AbilityStatEnum) {
    AbilityStatEnum[AbilityStatEnum["STRENGTH"] = 1] = "STRENGTH";
    AbilityStatEnum[AbilityStatEnum["DEXTERITY"] = 2] = "DEXTERITY";
    AbilityStatEnum[AbilityStatEnum["CONSTITUTION"] = 3] = "CONSTITUTION";
    AbilityStatEnum[AbilityStatEnum["INTELLIGENCE"] = 4] = "INTELLIGENCE";
    AbilityStatEnum[AbilityStatEnum["WISDOM"] = 5] = "WISDOM";
    AbilityStatEnum[AbilityStatEnum["CHARISMA"] = 6] = "CHARISMA";
})(AbilityStatEnum || (AbilityStatEnum = {}));
export var AbilitySkillEnum;
(function (AbilitySkillEnum) {
    AbilitySkillEnum[AbilitySkillEnum["ATHLETICS"] = 2] = "ATHLETICS";
    AbilitySkillEnum[AbilitySkillEnum["ACROBATICS"] = 3] = "ACROBATICS";
    AbilitySkillEnum[AbilitySkillEnum["SLEIGHT_OF_HAND"] = 4] = "SLEIGHT_OF_HAND";
    AbilitySkillEnum[AbilitySkillEnum["STEALTH"] = 5] = "STEALTH";
    AbilitySkillEnum[AbilitySkillEnum["ARCANA"] = 6] = "ARCANA";
    AbilitySkillEnum[AbilitySkillEnum["HISTORY"] = 7] = "HISTORY";
    AbilitySkillEnum[AbilitySkillEnum["INVESTIGATION"] = 8] = "INVESTIGATION";
    AbilitySkillEnum[AbilitySkillEnum["NATURE"] = 9] = "NATURE";
    AbilitySkillEnum[AbilitySkillEnum["RELIGION"] = 10] = "RELIGION";
    AbilitySkillEnum[AbilitySkillEnum["ANIMAL_HANDLING"] = 11] = "ANIMAL_HANDLING";
    AbilitySkillEnum[AbilitySkillEnum["INSIGHT"] = 12] = "INSIGHT";
    AbilitySkillEnum[AbilitySkillEnum["MEDICINE"] = 13] = "MEDICINE";
    AbilitySkillEnum[AbilitySkillEnum["PERCEPTION"] = 14] = "PERCEPTION";
    AbilitySkillEnum[AbilitySkillEnum["SURVIVAL"] = 15] = "SURVIVAL";
    AbilitySkillEnum[AbilitySkillEnum["DECEPTION"] = 16] = "DECEPTION";
    AbilitySkillEnum[AbilitySkillEnum["INTIMIDATION"] = 17] = "INTIMIDATION";
    AbilitySkillEnum[AbilitySkillEnum["PERFORMANCE"] = 18] = "PERFORMANCE";
    AbilitySkillEnum[AbilitySkillEnum["PERSUASION"] = 19] = "PERSUASION";
})(AbilitySkillEnum || (AbilitySkillEnum = {}));
export var AttackTypeRangeEnum;
(function (AttackTypeRangeEnum) {
    AttackTypeRangeEnum[AttackTypeRangeEnum["MELEE"] = 1] = "MELEE";
    AttackTypeRangeEnum[AttackTypeRangeEnum["RANGED"] = 2] = "RANGED";
})(AttackTypeRangeEnum || (AttackTypeRangeEnum = {}));
export var AdjustmentDataTypeEnum;
(function (AdjustmentDataTypeEnum) {
    AdjustmentDataTypeEnum[AdjustmentDataTypeEnum["INTEGER"] = 1] = "INTEGER";
    AdjustmentDataTypeEnum[AdjustmentDataTypeEnum["DECIMAL"] = 2] = "DECIMAL";
    AdjustmentDataTypeEnum[AdjustmentDataTypeEnum["STRING"] = 3] = "STRING";
    AdjustmentDataTypeEnum[AdjustmentDataTypeEnum["BOOLEAN"] = 4] = "BOOLEAN";
})(AdjustmentDataTypeEnum || (AdjustmentDataTypeEnum = {}));
export var AdjustmentConstraintTypeEnum;
(function (AdjustmentConstraintTypeEnum) {
    AdjustmentConstraintTypeEnum[AdjustmentConstraintTypeEnum["MINIMUM"] = 1] = "MINIMUM";
    AdjustmentConstraintTypeEnum[AdjustmentConstraintTypeEnum["MAXIMUM"] = 2] = "MAXIMUM";
})(AdjustmentConstraintTypeEnum || (AdjustmentConstraintTypeEnum = {}));
export var DamageAdjustmentTypeEnum;
(function (DamageAdjustmentTypeEnum) {
    DamageAdjustmentTypeEnum[DamageAdjustmentTypeEnum["RESISTANCE"] = 1] = "RESISTANCE";
    DamageAdjustmentTypeEnum[DamageAdjustmentTypeEnum["IMMUNITY"] = 2] = "IMMUNITY";
    DamageAdjustmentTypeEnum[DamageAdjustmentTypeEnum["VULNERABILITY"] = 3] = "VULNERABILITY";
})(DamageAdjustmentTypeEnum || (DamageAdjustmentTypeEnum = {}));
export var DefenseAdjustmentTypeEnum;
(function (DefenseAdjustmentTypeEnum) {
    DefenseAdjustmentTypeEnum[DefenseAdjustmentTypeEnum["CONDITION_ADJUSTMENT"] = 1] = "CONDITION_ADJUSTMENT";
    DefenseAdjustmentTypeEnum[DefenseAdjustmentTypeEnum["DAMAGE_ADJUSTMENT"] = 2] = "DAMAGE_ADJUSTMENT";
})(DefenseAdjustmentTypeEnum || (DefenseAdjustmentTypeEnum = {}));
export var WeaponCategoryEnum;
(function (WeaponCategoryEnum) {
    WeaponCategoryEnum[WeaponCategoryEnum["SIMPLE"] = 1] = "SIMPLE";
    WeaponCategoryEnum[WeaponCategoryEnum["MARTIAL"] = 2] = "MARTIAL";
    WeaponCategoryEnum[WeaponCategoryEnum["FIREARMS"] = 3] = "FIREARMS";
})(WeaponCategoryEnum || (WeaponCategoryEnum = {}));
export var WeightTypeEnum;
(function (WeightTypeEnum) {
    WeightTypeEnum[WeightTypeEnum["HALF"] = 1] = "HALF";
    WeightTypeEnum[WeightTypeEnum["NORMAL"] = 2] = "NORMAL";
    WeightTypeEnum[WeightTypeEnum["DOUBLE"] = 3] = "DOUBLE";
})(WeightTypeEnum || (WeightTypeEnum = {}));
export var ProficiencyLevelEnum;
(function (ProficiencyLevelEnum) {
    ProficiencyLevelEnum[ProficiencyLevelEnum["NONE"] = 1] = "NONE";
    ProficiencyLevelEnum[ProficiencyLevelEnum["HALF"] = 2] = "HALF";
    ProficiencyLevelEnum[ProficiencyLevelEnum["FULL"] = 3] = "FULL";
    ProficiencyLevelEnum[ProficiencyLevelEnum["EXPERT"] = 4] = "EXPERT";
})(ProficiencyLevelEnum || (ProficiencyLevelEnum = {}));
export var StealthCheckTypeEnum;
(function (StealthCheckTypeEnum) {
    StealthCheckTypeEnum[StealthCheckTypeEnum["NONE"] = 1] = "NONE";
    StealthCheckTypeEnum[StealthCheckTypeEnum["DISADVANTAGE"] = 2] = "DISADVANTAGE";
})(StealthCheckTypeEnum || (StealthCheckTypeEnum = {}));
export var FeatureTypeEnum;
(function (FeatureTypeEnum) {
    FeatureTypeEnum[FeatureTypeEnum["GRANTED"] = 1] = "GRANTED";
    FeatureTypeEnum[FeatureTypeEnum["ADDITIONAL"] = 2] = "ADDITIONAL";
    FeatureTypeEnum[FeatureTypeEnum["REPLACEMENT"] = 3] = "REPLACEMENT";
})(FeatureTypeEnum || (FeatureTypeEnum = {}));
export const DB_STRING_WILDSHAPE_2024 = 'Wild Shape (2024)';
export const DB_STRING_MEDIUM_ARMOR_MASTER = 'Medium Armor Master';
export const DB_STRING_SPELLCASTING = 'Spellcasting';
export const DB_STRING_PACT_MAGIC = 'Pact Magic';
export const DB_STRING_ELDRITCH_ADEPT = 'Eldritch Adept';
export const DB_STRING_MARTIAL_ARTS = 'Martial Arts';
export const DB_STRING_DEDICATED_WEAPON = 'Dedicated Weapon';
export const DB_STRING_INTEGRATED_PROTECTION = 'Integrated Protection';
export const DB_STRING_IMPROVED_PACT_WEAPON = 'Improved Pact Weapon';
export const DB_STRING_CARAPACE = 'Carapace';
export const DB_STRING_VERDAN = 'Verdan';
export const DB_STRING_BOOK_OF_ANCIENT_SECRETS = 'Book of Ancient Secrets';
export const DB_STRING_INFUSE_ITEM = 'Infuse Item';
export const DB_STRING_RITUAL_CASTER_BARD = 'Ritual Caster (Bard)';
export const DB_STRING_RITUAL_CASTER_CLERIC = 'Ritual Caster (Cleric)';
export const DB_STRING_RITUAL_CASTER_DRUID = 'Ritual Caster (Druid)';
export const DB_STRING_RITUAL_CASTER_SORCERER = 'Ritual Caster (Sorcerer)';
export const DB_STRING_RITUAL_CASTER_WARLOCK = 'Ritual Caster (Warlock)';
export const DB_STRING_RITUAL_CASTER_WIZARD = 'Ritual Caster (Wizard)';
export const DB_STRING_RITUAL_CASTER_LIST = [
    DB_STRING_RITUAL_CASTER_BARD,
    DB_STRING_RITUAL_CASTER_CLERIC,
    DB_STRING_RITUAL_CASTER_DRUID,
    DB_STRING_RITUAL_CASTER_SORCERER,
    DB_STRING_RITUAL_CASTER_WARLOCK,
    DB_STRING_RITUAL_CASTER_WIZARD,
];
export var PreferenceAbilityScoreDisplayTypeEnum;
(function (PreferenceAbilityScoreDisplayTypeEnum) {
    PreferenceAbilityScoreDisplayTypeEnum[PreferenceAbilityScoreDisplayTypeEnum["SCORES_TOP"] = 1] = "SCORES_TOP";
    PreferenceAbilityScoreDisplayTypeEnum[PreferenceAbilityScoreDisplayTypeEnum["MODIFIERS_TOP"] = 2] = "MODIFIERS_TOP";
})(PreferenceAbilityScoreDisplayTypeEnum || (PreferenceAbilityScoreDisplayTypeEnum = {}));
export var PreferencePrivacyTypeEnum;
(function (PreferencePrivacyTypeEnum) {
    PreferencePrivacyTypeEnum[PreferencePrivacyTypeEnum["PRIVATE"] = 1] = "PRIVATE";
    PreferencePrivacyTypeEnum[PreferencePrivacyTypeEnum["CAMPAIGN_ONLY"] = 2] = "CAMPAIGN_ONLY";
    PreferencePrivacyTypeEnum[PreferencePrivacyTypeEnum["PUBLIC"] = 3] = "PUBLIC";
})(PreferencePrivacyTypeEnum || (PreferencePrivacyTypeEnum = {}));
export var PreferenceSharingTypeEnum;
(function (PreferenceSharingTypeEnum) {
    PreferenceSharingTypeEnum[PreferenceSharingTypeEnum["FULL"] = 1] = "FULL";
    PreferenceSharingTypeEnum[PreferenceSharingTypeEnum["LIMITED"] = 2] = "LIMITED";
    PreferenceSharingTypeEnum[PreferenceSharingTypeEnum["STAT_BLOCK"] = 3] = "STAT_BLOCK";
})(PreferenceSharingTypeEnum || (PreferenceSharingTypeEnum = {}));
export var PreferenceEncumbranceTypeEnum;
(function (PreferenceEncumbranceTypeEnum) {
    PreferenceEncumbranceTypeEnum[PreferenceEncumbranceTypeEnum["ENCUMBRANCE"] = 1] = "ENCUMBRANCE";
    PreferenceEncumbranceTypeEnum[PreferenceEncumbranceTypeEnum["NONE"] = 2] = "NONE";
    PreferenceEncumbranceTypeEnum[PreferenceEncumbranceTypeEnum["VARIANT"] = 3] = "VARIANT";
})(PreferenceEncumbranceTypeEnum || (PreferenceEncumbranceTypeEnum = {}));
export var PreferenceHitPointTypeEnum;
(function (PreferenceHitPointTypeEnum) {
    PreferenceHitPointTypeEnum[PreferenceHitPointTypeEnum["FIXED"] = 1] = "FIXED";
    PreferenceHitPointTypeEnum[PreferenceHitPointTypeEnum["MANUAL"] = 2] = "MANUAL";
})(PreferenceHitPointTypeEnum || (PreferenceHitPointTypeEnum = {}));
export var PreferenceProgressionTypeEnum;
(function (PreferenceProgressionTypeEnum) {
    PreferenceProgressionTypeEnum[PreferenceProgressionTypeEnum["MILESTONE"] = 1] = "MILESTONE";
    PreferenceProgressionTypeEnum[PreferenceProgressionTypeEnum["XP"] = 2] = "XP";
})(PreferenceProgressionTypeEnum || (PreferenceProgressionTypeEnum = {}));
export var SpeedMovementKeyEnum;
(function (SpeedMovementKeyEnum) {
    SpeedMovementKeyEnum["WALK"] = "walk";
    SpeedMovementKeyEnum["FLY"] = "fly";
    SpeedMovementKeyEnum["BURROW"] = "burrow";
    SpeedMovementKeyEnum["SWIM"] = "swim";
    SpeedMovementKeyEnum["CLIMB"] = "climb";
})(SpeedMovementKeyEnum || (SpeedMovementKeyEnum = {}));
export var MovementTypeEnum;
(function (MovementTypeEnum) {
    MovementTypeEnum[MovementTypeEnum["WALK"] = 1] = "WALK";
    MovementTypeEnum[MovementTypeEnum["BURROW"] = 2] = "BURROW";
    MovementTypeEnum[MovementTypeEnum["CLIMB"] = 3] = "CLIMB";
    MovementTypeEnum[MovementTypeEnum["FLY"] = 4] = "FLY";
    MovementTypeEnum[MovementTypeEnum["SWIM"] = 5] = "SWIM";
})(MovementTypeEnum || (MovementTypeEnum = {}));
export var SenseTypeEnum;
(function (SenseTypeEnum) {
    SenseTypeEnum[SenseTypeEnum["BLINDSIGHT"] = 1] = "BLINDSIGHT";
    SenseTypeEnum[SenseTypeEnum["DARKVISION"] = 2] = "DARKVISION";
    SenseTypeEnum[SenseTypeEnum["TREMORSENSE"] = 3] = "TREMORSENSE";
    SenseTypeEnum[SenseTypeEnum["TRUESIGHT"] = 4] = "TRUESIGHT";
    SenseTypeEnum[SenseTypeEnum["PASSIVE_PERCEPTION"] = 5] = "PASSIVE_PERCEPTION";
})(SenseTypeEnum || (SenseTypeEnum = {}));
export var NoteKeyEnum;
(function (NoteKeyEnum) {
    NoteKeyEnum["ALLIES"] = "allies";
    NoteKeyEnum["ENEMIES"] = "enemies";
    NoteKeyEnum["BACKSTORY"] = "backstory";
    NoteKeyEnum["ORGANIZATIONS"] = "organizations";
    NoteKeyEnum["OTHER"] = "otherNotes";
    NoteKeyEnum["OTHER_HOLDINGS"] = "otherHoldings";
    NoteKeyEnum["PERSONAL_POSSESSIONS"] = "personalPossessions";
})(NoteKeyEnum || (NoteKeyEnum = {}));
export var TraitTypeEnum;
(function (TraitTypeEnum) {
    TraitTypeEnum["PERSONALITY_TRAITS"] = "personalityTraits";
    TraitTypeEnum["IDEALS"] = "ideals";
    TraitTypeEnum["BONDS"] = "bonds";
    TraitTypeEnum["FLAWS"] = "flaws";
    TraitTypeEnum["APPEARANCE"] = "appearance";
})(TraitTypeEnum || (TraitTypeEnum = {}));
export var WeightSpeedTypeEnum;
(function (WeightSpeedTypeEnum) {
    WeightSpeedTypeEnum["NORMAL"] = "normal";
    WeightSpeedTypeEnum["ENCUMBERED"] = "encumbered";
    WeightSpeedTypeEnum["HEAVILY_ENCUMBERED"] = "heavilyEncumbered";
    WeightSpeedTypeEnum["PUSH_DRAG_LIFT"] = "pushDragLift";
    WeightSpeedTypeEnum["OVER_CARRYING_CAPACITY"] = "overCarryingCapacity";
})(WeightSpeedTypeEnum || (WeightSpeedTypeEnum = {}));
export var CustomProficiencyTypeEnum;
(function (CustomProficiencyTypeEnum) {
    CustomProficiencyTypeEnum[CustomProficiencyTypeEnum["SKILL"] = 1] = "SKILL";
    CustomProficiencyTypeEnum[CustomProficiencyTypeEnum["TOOL"] = 2] = "TOOL";
    CustomProficiencyTypeEnum[CustomProficiencyTypeEnum["LANGUAGE"] = 3] = "LANGUAGE";
    CustomProficiencyTypeEnum[CustomProficiencyTypeEnum["ARMOR"] = 4] = "ARMOR";
    CustomProficiencyTypeEnum[CustomProficiencyTypeEnum["WEAPON"] = 5] = "WEAPON";
})(CustomProficiencyTypeEnum || (CustomProficiencyTypeEnum = {}));
export var SaveTypeEnum;
(function (SaveTypeEnum) {
    SaveTypeEnum["ADVANTAGE"] = "Advantage";
    SaveTypeEnum["DISADVANTAGE"] = "Disadvantage";
    SaveTypeEnum["BONUS"] = "Bonus";
})(SaveTypeEnum || (SaveTypeEnum = {}));
export var CreatureSizeNameEnum;
(function (CreatureSizeNameEnum) {
    CreatureSizeNameEnum["TINY"] = "Tiny";
    CreatureSizeNameEnum["SMALL"] = "Small";
    CreatureSizeNameEnum["MEDIUM"] = "Medium";
    CreatureSizeNameEnum["LARGE"] = "Large";
    CreatureSizeNameEnum["HUGE"] = "Huge";
    CreatureSizeNameEnum["GARGANTUAN"] = "Gargantuan";
})(CreatureSizeNameEnum || (CreatureSizeNameEnum = {}));
export var CreatureSizeEnum;
(function (CreatureSizeEnum) {
    CreatureSizeEnum[CreatureSizeEnum["TINY"] = 2] = "TINY";
    CreatureSizeEnum[CreatureSizeEnum["SMALL"] = 3] = "SMALL";
    CreatureSizeEnum[CreatureSizeEnum["MEDIUM"] = 4] = "MEDIUM";
    CreatureSizeEnum[CreatureSizeEnum["LARGE"] = 5] = "LARGE";
    CreatureSizeEnum[CreatureSizeEnum["HUGE"] = 6] = "HUGE";
    CreatureSizeEnum[CreatureSizeEnum["GARGANTUAN"] = 7] = "GARGANTUAN";
})(CreatureSizeEnum || (CreatureSizeEnum = {}));
export var ActivatableTypeEnum;
(function (ActivatableTypeEnum) {
    ActivatableTypeEnum["ACTION"] = "ACTION";
    ActivatableTypeEnum["RACE"] = "RACE";
    ActivatableTypeEnum["OPTION"] = "OPTION";
    ActivatableTypeEnum["CHARACTER_SPELL"] = "CHARACTER_SPELL";
    ActivatableTypeEnum["CLASS_FEATURE"] = "CLASS_FEATURE";
    ActivatableTypeEnum["CLASS_SPELL"] = "CLASS_SPELL";
    ActivatableTypeEnum["FEAT"] = "FEAT";
})(ActivatableTypeEnum || (ActivatableTypeEnum = {}));
export var SituationalBonusSavingThrowTypeEnum;
(function (SituationalBonusSavingThrowTypeEnum) {
    SituationalBonusSavingThrowTypeEnum["MODIFIER"] = "MODIFIER";
})(SituationalBonusSavingThrowTypeEnum || (SituationalBonusSavingThrowTypeEnum = {}));
export var AbilityScoreStatTypeEnum;
(function (AbilityScoreStatTypeEnum) {
    AbilityScoreStatTypeEnum[AbilityScoreStatTypeEnum["BASE"] = 1] = "BASE";
    AbilityScoreStatTypeEnum[AbilityScoreStatTypeEnum["BONUS"] = 2] = "BONUS";
    AbilityScoreStatTypeEnum[AbilityScoreStatTypeEnum["OVERRIDE"] = 3] = "OVERRIDE";
})(AbilityScoreStatTypeEnum || (AbilityScoreStatTypeEnum = {}));
export var BuilderChoiceTypeEnum;
(function (BuilderChoiceTypeEnum) {
    BuilderChoiceTypeEnum[BuilderChoiceTypeEnum["ONE_MODIFIER_TYPE_CHOICE"] = 1] = "ONE_MODIFIER_TYPE_CHOICE";
    BuilderChoiceTypeEnum[BuilderChoiceTypeEnum["MODIFIER_SUB_CHOICE"] = 2] = "MODIFIER_SUB_CHOICE";
    BuilderChoiceTypeEnum[BuilderChoiceTypeEnum["FEATURE_OPTION"] = 3] = "FEATURE_OPTION";
    BuilderChoiceTypeEnum[BuilderChoiceTypeEnum["ENTITY_SPELL_OPTION"] = 4] = "ENTITY_SPELL_OPTION";
    BuilderChoiceTypeEnum[BuilderChoiceTypeEnum["DRAGONBORN_OPTION"] = 5] = "DRAGONBORN_OPTION";
    BuilderChoiceTypeEnum[BuilderChoiceTypeEnum["FEAT_CHOICE_OPTION"] = 6] = "FEAT_CHOICE_OPTION";
    BuilderChoiceTypeEnum[BuilderChoiceTypeEnum["SUB_CLASS_OPTION"] = 7] = "SUB_CLASS_OPTION";
    BuilderChoiceTypeEnum[BuilderChoiceTypeEnum["RACIAL_TRAIT_OPTION"] = 8] = "RACIAL_TRAIT_OPTION";
    BuilderChoiceTypeEnum[BuilderChoiceTypeEnum["FEAT_OPTION"] = 9] = "FEAT_OPTION";
})(BuilderChoiceTypeEnum || (BuilderChoiceTypeEnum = {}));
export var BuilderChoiceSubtypeEnum;
(function (BuilderChoiceSubtypeEnum) {
    BuilderChoiceSubtypeEnum[BuilderChoiceSubtypeEnum["PROFICIENCY"] = 1] = "PROFICIENCY";
    BuilderChoiceSubtypeEnum[BuilderChoiceSubtypeEnum["EXPERTISE"] = 2] = "EXPERTISE";
    BuilderChoiceSubtypeEnum[BuilderChoiceSubtypeEnum["LANGUAGE"] = 3] = "LANGUAGE";
    BuilderChoiceSubtypeEnum[BuilderChoiceSubtypeEnum["KNOWN_SPELLS"] = 4] = "KNOWN_SPELLS";
    BuilderChoiceSubtypeEnum[BuilderChoiceSubtypeEnum["ABILITY_SCORE"] = 5] = "ABILITY_SCORE";
    BuilderChoiceSubtypeEnum[BuilderChoiceSubtypeEnum["EXPERTISE_NO_REQUIREMENT"] = 6] = "EXPERTISE_NO_REQUIREMENT";
    BuilderChoiceSubtypeEnum[BuilderChoiceSubtypeEnum["KENSEI"] = 7] = "KENSEI";
})(BuilderChoiceSubtypeEnum || (BuilderChoiceSubtypeEnum = {}));
export var StartingEquipmentTypeEnum;
(function (StartingEquipmentTypeEnum) {
    StartingEquipmentTypeEnum[StartingEquipmentTypeEnum["MANUAL"] = 1] = "MANUAL";
    StartingEquipmentTypeEnum[StartingEquipmentTypeEnum["MONEY"] = 2] = "MONEY";
    StartingEquipmentTypeEnum[StartingEquipmentTypeEnum["GUIDED"] = 3] = "GUIDED";
})(StartingEquipmentTypeEnum || (StartingEquipmentTypeEnum = {}));
export var MulticlassSpellSlotRoundingEnum;
(function (MulticlassSpellSlotRoundingEnum) {
    MulticlassSpellSlotRoundingEnum[MulticlassSpellSlotRoundingEnum["DOWN"] = 1] = "DOWN";
    MulticlassSpellSlotRoundingEnum[MulticlassSpellSlotRoundingEnum["UP"] = 2] = "UP";
})(MulticlassSpellSlotRoundingEnum || (MulticlassSpellSlotRoundingEnum = {}));
export var ProficiencyRoundingEnum;
(function (ProficiencyRoundingEnum) {
    ProficiencyRoundingEnum[ProficiencyRoundingEnum["DOWN"] = 1] = "DOWN";
    ProficiencyRoundingEnum[ProficiencyRoundingEnum["UP"] = 2] = "UP";
})(ProficiencyRoundingEnum || (ProficiencyRoundingEnum = {}));
export var RuleKeyEnum;
(function (RuleKeyEnum) {
    RuleKeyEnum["ARMOR_CLASS"] = "Armor Class";
    RuleKeyEnum["PROFICIENCY_BONUS"] = "Proficiency Bonus";
    RuleKeyEnum["SAVING_THROWS"] = "Saving Throws";
    RuleKeyEnum["INITIATIVE"] = "Initiative";
    RuleKeyEnum["INSPIRATION"] = "Inspiration";
    RuleKeyEnum["SPEED"] = "Speed";
    RuleKeyEnum["SENSES"] = "Senses";
    RuleKeyEnum["DEATH_SAVING_THROWS"] = "Death Saving Throws";
})(RuleKeyEnum || (RuleKeyEnum = {}));
export var ContentSharingSettingEnum;
(function (ContentSharingSettingEnum) {
    ContentSharingSettingEnum[ContentSharingSettingEnum["SCOPE_TO_ALL_CAMPAIGNS"] = 1] = "SCOPE_TO_ALL_CAMPAIGNS";
    ContentSharingSettingEnum[ContentSharingSettingEnum["SCOPE_TO_INDIVIDUAL_CAMPAIGN"] = 2] = "SCOPE_TO_INDIVIDUAL_CAMPAIGN";
})(ContentSharingSettingEnum || (ContentSharingSettingEnum = {}));
export var CharacterColorEnum;
(function (CharacterColorEnum) {
    CharacterColorEnum["RED"] = "#C53131";
    CharacterColorEnum["OFF_WHITE"] = "#FEFEFE";
    CharacterColorEnum["DARKMODE_TRANSPARENT"] = "#10161ADB";
    CharacterColorEnum["DARKMODE_BLACK"] = "#10161A";
    CharacterColorEnum["DARKMODE_TEXT"] = "#b0b7bd";
})(CharacterColorEnum || (CharacterColorEnum = {}));
export var SourceTypeEnum;
(function (SourceTypeEnum) {
    SourceTypeEnum[SourceTypeEnum["PRIMARY"] = 1] = "PRIMARY";
    SourceTypeEnum[SourceTypeEnum["SECONDARY"] = 2] = "SECONDARY";
    SourceTypeEnum[SourceTypeEnum["HIDDEN"] = 3] = "HIDDEN";
})(SourceTypeEnum || (SourceTypeEnum = {}));
export var AdditionalTypeEnum;
(function (AdditionalTypeEnum) {
    AdditionalTypeEnum[AdditionalTypeEnum["ADDITIONAL_TARGETS"] = 1] = "ADDITIONAL_TARGETS";
    AdditionalTypeEnum[AdditionalTypeEnum["EXTENDED_DURATION"] = 3] = "EXTENDED_DURATION";
    AdditionalTypeEnum[AdditionalTypeEnum["EXTENDED_AREA"] = 9] = "EXTENDED_AREA";
    AdditionalTypeEnum[AdditionalTypeEnum["ADDITIONAL_CREATURES"] = 11] = "ADDITIONAL_CREATURES";
    AdditionalTypeEnum[AdditionalTypeEnum["SPECIAL"] = 12] = "SPECIAL";
    AdditionalTypeEnum[AdditionalTypeEnum["ADDITIONAL_POINTS"] = 15] = "ADDITIONAL_POINTS";
    AdditionalTypeEnum[AdditionalTypeEnum["ADDITIONAL_COUNT"] = 16] = "ADDITIONAL_COUNT";
    AdditionalTypeEnum[AdditionalTypeEnum["EXTENDED_RANGE"] = 17] = "EXTENDED_RANGE";
})(AdditionalTypeEnum || (AdditionalTypeEnum = {}));
export var DisplayConfigurationTypeEnum;
(function (DisplayConfigurationTypeEnum) {
    DisplayConfigurationTypeEnum["RACIAL_TRAIT"] = "RACIALTRAIT";
    DisplayConfigurationTypeEnum["ABILITY_SCORE"] = "ABILITYSCORE";
    DisplayConfigurationTypeEnum["LANGUAGE"] = "LANGUAGE";
    DisplayConfigurationTypeEnum["CLASS_FEATURE"] = "CLASSFEATURE";
    DisplayConfigurationTypeEnum["ITEM"] = "ITEM";
    DisplayConfigurationTypeEnum["FEAT"] = "FEAT";
})(DisplayConfigurationTypeEnum || (DisplayConfigurationTypeEnum = {}));
export var DisplayConfigurationValueEnum;
(function (DisplayConfigurationValueEnum) {
    DisplayConfigurationValueEnum[DisplayConfigurationValueEnum["OFF"] = 0] = "OFF";
    DisplayConfigurationValueEnum[DisplayConfigurationValueEnum["ON"] = 1] = "ON";
})(DisplayConfigurationValueEnum || (DisplayConfigurationValueEnum = {}));
export var EntityTypeEnum;
(function (EntityTypeEnum) {
    EntityTypeEnum[EntityTypeEnum["CHARACTER"] = 1581111423] = "CHARACTER";
    EntityTypeEnum[EntityTypeEnum["ITEM"] = 1439493548] = "ITEM";
    EntityTypeEnum[EntityTypeEnum["CAMPAIGN"] = 618115330] = "CAMPAIGN";
    EntityTypeEnum[EntityTypeEnum["FEAT_LIST"] = 67468084] = "FEAT_LIST";
    EntityTypeEnum[EntityTypeEnum["CLASS_FEATURE_OPTION_KNOWN"] = 1362008556] = "CLASS_FEATURE_OPTION_KNOWN";
    EntityTypeEnum[EntityTypeEnum["CLASS_FEATURE"] = 12168134] = "CLASS_FEATURE";
})(EntityTypeEnum || (EntityTypeEnum = {}));
export var CoinTypeEnum;
(function (CoinTypeEnum) {
    CoinTypeEnum["cp"] = "cp";
    CoinTypeEnum["ep"] = "ep";
    CoinTypeEnum["gp"] = "gp";
    CoinTypeEnum["pp"] = "pp";
    CoinTypeEnum["sp"] = "sp";
})(CoinTypeEnum || (CoinTypeEnum = {}));
export var CoinNamesEnum;
(function (CoinNamesEnum) {
    CoinNamesEnum["GOLD"] = "Gold";
    CoinNamesEnum["COPPER"] = "Copper";
    CoinNamesEnum["SILVER"] = "Silver";
    CoinNamesEnum["ELECTRUM"] = "Electrum";
    CoinNamesEnum["PLATINUM"] = "Platinum";
})(CoinNamesEnum || (CoinNamesEnum = {}));
//TODO move over more constants from App.ts in tools client and dedup usages
export const SIGNED_32BIT_INT_MAX_VALUE = 1000000000;
export const SIGNED_32BIT_INT_MIN_VALUE = -1000000000;
export const CURRENCY_VALUE = {
    MAX: SIGNED_32BIT_INT_MAX_VALUE,
    MIN: 0,
};
export const INITIAL_ASI_TAG_NAME = '__INITIAL_ASI';
export const DISPLAY_WITH_DATA_ORIGIN_TAG_NAME = '__DISPLAY_WITH_DATA_ORIGIN';
export const DISGUISE_FEAT_TAG_NAME = '__DISGUISE_FEAT';
export const DefaultCharacterName = 'Hero With No Name';
export const ABILITY_STAT_MENTAL_LIST = [
    AbilityStatEnum.INTELLIGENCE,
    AbilityStatEnum.WISDOM,
    AbilityStatEnum.CHARISMA,
];
export const ABILITY_STAT_PHYSICAL_LIST = [
    AbilityStatEnum.STRENGTH,
    AbilityStatEnum.DEXTERITY,
    AbilityStatEnum.CONSTITUTION,
];
