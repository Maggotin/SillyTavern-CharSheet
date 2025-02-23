export const FEET_IN_MILES = 5280;
export const POUNDS_IN_TON = 2000;

export enum AppContextTypeEnum {
  SHEET = 'SHEET'
}

export enum AbilityScoreTypeEnum {
  STANDARD_ARRAY = 1,
  MANUAL = 2,
  POINT_BUY = 3
}

export enum AbilityStatEnum {
  STRENGTH = 1,
  DEXTERITY = 2,
  CONSTITUTION = 3,
  INTELLIGENCE = 4,
  WISDOM = 5,
  CHARISMA = 6
}

export enum AbilitySkillEnum {
  ATHLETICS = 2,
  ACROBATICS = 3,
  SLEIGHT_OF_HAND = 4,
  STEALTH = 5,
  ARCANA = 6,
  HISTORY = 7,
  INVESTIGATION = 8,
  NATURE = 9,
  RELIGION = 10,
  ANIMAL_HANDLING = 11,
  INSIGHT = 12,
  MEDICINE = 13,
  PERCEPTION = 14,
  SURVIVAL = 15,
  DECEPTION = 16,
  INTIMIDATION = 17,
  PERFORMANCE = 18,
  PERSUASION = 19
}

export enum AttackTypeRangeEnum {
  MELEE = 1,
  RANGED = 2
}

export enum AdjustmentDataTypeEnum {
  INTEGER = 1,
  DECIMAL = 2,
  STRING = 3,
  BOOLEAN = 4
}

export enum AdjustmentConstraintTypeEnum {
  MINIMUM = 1,
  MAXIMUM = 2
}

export enum DamageAdjustmentTypeEnum {
  RESISTANCE = 1,
  IMMUNITY = 2,
  VULNERABILITY = 3
}

export enum DefenseAdjustmentTypeEnum {
  CONDITION_ADJUSTMENT = 1,
  DAMAGE_ADJUSTMENT = 2
}

export enum WeaponCategoryEnum {
  SIMPLE = 1,
  MARTIAL = 2,
  FIREARMS = 3
}

export enum WeightTypeEnum {
  HALF = 1,
  NORMAL = 2,
  DOUBLE = 3
}

export enum ProficiencyLevelEnum {
  NONE = 1,
  HALF = 2,
  FULL = 3,
  EXPERT = 4
}

export enum StealthCheckTypeEnum {
  NONE = 1,
  DISADVANTAGE = 2
}

export enum FeatureTypeEnum {
  GRANTED = 1,
  ADDITIONAL = 2,
  REPLACEMENT = 3
}

// Database string constants
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

export enum PreferenceAbilityScoreDisplayTypeEnum {
  SCORES_TOP = 1,
  MODIFIERS_TOP = 2
}

export enum PreferencePrivacyTypeEnum {
  PRIVATE = 1,
  CAMPAIGN_ONLY = 2,
  PUBLIC = 3
}

export enum PreferenceSharingTypeEnum {
  FULL = 1,
  LIMITED = 2,
  STAT_BLOCK = 3
}

export enum PreferenceEncumbranceTypeEnum {
  ENCUMBRANCE = 1,
  NONE = 2,
  VARIANT = 3
}

export enum PreferenceHitPointTypeEnum {
  FIXED = 1,
  MANUAL = 2
}

export enum PreferenceProgressionTypeEnum {
  MILESTONE = 1,
  XP = 2
}

export enum SpeedMovementKeyEnum {
  WALK = 'walk',
  FLY = 'fly',
  BURROW = 'burrow',
  SWIM = 'swim',
  CLIMB = 'climb'
}

export enum MovementTypeEnum {
  WALK = 1,
  BURROW = 2,
  CLIMB = 3,
  FLY = 4,
  SWIM = 5
}

export enum SenseTypeEnum {
  BLINDSIGHT = 1,
  DARKVISION = 2,
  TREMORSENSE = 3,
  TRUESIGHT = 4,
  PASSIVE_PERCEPTION = 5
}

export enum NoteKeyEnum {
  ALLIES = 'allies',
  ENEMIES = 'enemies',
  BACKSTORY = 'backstory',
  ORGANIZATIONS = 'organizations',
  OTHER = 'otherNotes',
  OTHER_HOLDINGS = 'otherHoldings',
  PERSONAL_POSSESSIONS = 'personalPossessions'
}

export enum TraitTypeEnum {
  PERSONALITY_TRAITS = 'personalityTraits',
  IDEALS = 'ideals',
  BONDS = 'bonds',
  FLAWS = 'flaws',
  APPEARANCE = 'appearance'
}

export enum WeightSpeedTypeEnum {
  NORMAL = 'normal',
  ENCUMBERED = 'encumbered',
  HEAVILY_ENCUMBERED = 'heavilyEncumbered',
  PUSH_DRAG_LIFT = 'pushDragLift',
  OVER_CARRYING_CAPACITY = 'overCarryingCapacity'
}

export enum CustomProficiencyTypeEnum {
  SKILL = 1,
  TOOL = 2,
  LANGUAGE = 3,
  ARMOR = 4,
  WEAPON = 5
}

export enum SaveTypeEnum {
  ADVANTAGE = 'Advantage',
  DISADVANTAGE = 'Disadvantage',
  BONUS = 'Bonus'
}

export enum CreatureSizeNameEnum {
  TINY = 'Tiny',
  SMALL = 'Small',
  MEDIUM = 'Medium',
  LARGE = 'Large',
  HUGE = 'Huge',
  GARGANTUAN = 'Gargantuan'
}

export enum CreatureSizeEnum {
  TINY = 2,
  SMALL = 3,
  MEDIUM = 4,
  LARGE = 5,
  HUGE = 6,
  GARGANTUAN = 7
}

export enum ActivatableTypeEnum {
  ACTION = 'ACTION',
  RACE = 'RACE',
  OPTION = 'OPTION',
  CHARACTER_SPELL = 'CHARACTER_SPELL',
  CLASS_FEATURE = 'CLASS_FEATURE',
  CLASS_SPELL = 'CLASS_SPELL',
  FEAT = 'FEAT'
}

export enum SituationalBonusSavingThrowTypeEnum {
  MODIFIER = 'MODIFIER'
}

export enum AbilityScoreStatTypeEnum {
  BASE = 1,
  BONUS = 2,
  OVERRIDE = 3
}

export enum BuilderChoiceTypeEnum {
  ONE_MODIFIER_TYPE_CHOICE = 1,
  MODIFIER_SUB_CHOICE = 2,
  FEATURE_OPTION = 3,
  ENTITY_SPELL_OPTION = 4,
  DRAGONBORN_OPTION = 5,
  FEAT_CHOICE_OPTION = 6,
  SUB_CLASS_OPTION = 7,
  RACIAL_TRAIT_OPTION = 8,
  FEAT_OPTION = 9
}

export enum BuilderChoiceSubtypeEnum {
  PROFICIENCY = 1,
  EXPERTISE = 2,
  LANGUAGE = 3,
  KNOWN_SPELLS = 4,
  ABILITY_SCORE = 5,
  EXPERTISE_NO_REQUIREMENT = 6,
  KENSEI = 7
}

export enum StartingEquipmentTypeEnum {
  MANUAL = 1,
  MONEY = 2,
  GUIDED = 3
}

export enum MulticlassSpellSlotRoundingEnum {
  DOWN = 1,
  UP = 2
}

export enum ProficiencyRoundingEnum {
  DOWN = 1,
  UP = 2
}

export enum RuleKeyEnum {
  ARMOR_CLASS = 'Armor Class',
  PROFICIENCY_BONUS = 'Proficiency Bonus',
  SAVING_THROWS = 'Saving Throws',
  INITIATIVE = 'Initiative',
  INSPIRATION = 'Inspiration',
  SPEED = 'Speed',
  SENSES = 'Senses',
  DEATH_SAVING_THROWS = 'Death Saving Throws'
}

export enum CharacterColorEnum {
  RED = '#C53131',
  OFF_WHITE = '#FEFEFE',
  DARKMODE_TRANSPARENT = '#10161ADB',
  DARKMODE_BLACK = '#10161A',
  DARKMODE_TEXT = '#b0b7bd'
}

export enum SourceTypeEnum {
  PRIMARY = 1,
  SECONDARY = 2,
  HIDDEN = 3
}

export enum AdditionalTypeEnum {
  ADDITIONAL_TARGETS = 1,
  EXTENDED_DURATION = 3,
  EXTENDED_AREA = 9,
  ADDITIONAL_CREATURES = 11,
  SPECIAL = 12,
  ADDITIONAL_POINTS = 15,
  ADDITIONAL_COUNT = 16,
  EXTENDED_RANGE = 17
}

export enum DisplayConfigurationTypeEnum {
  RACIAL_TRAIT = 'RACIALTRAIT',
  ABILITY_SCORE = 'ABILITYSCORE',
  LANGUAGE = 'LANGUAGE',
  CLASS_FEATURE = 'CLASSFEATURE',
  ITEM = 'ITEM',
  FEAT = 'FEAT'
}

export enum DisplayConfigurationValueEnum {
  OFF = 0,
  ON = 1
}

export enum EntityTypeEnum {
  CHARACTER = 1581111423,
  ITEM = 1439493548,
  FEAT_LIST = 67468084,
  CLASS_FEATURE_OPTION_KNOWN = 1362008556,
  CLASS_FEATURE = 12168134
}

export enum CoinTypeEnum {
  cp = 'cp',
  ep = 'ep',
  gp = 'gp',
  pp = 'pp',
  sp = 'sp'
}

export enum CoinNamesEnum {
  GOLD = 'Gold',
  COPPER = 'Copper',
  SILVER = 'Silver',
  ELECTRUM = 'Electrum',
  PLATINUM = 'Platinum'
}

export const SIGNED_32BIT_INT_MAX_VALUE = 1000000000;
export const SIGNED_32BIT_INT_MIN_VALUE = -1000000000;

export const CURRENCY_VALUE = {
  MAX: SIGNED_32BIT_INT_MAX_VALUE,
  MIN: 0,
} as const;

export const INITIAL_ASI_TAG_NAME = '__INITIAL_ASI';
export const DISPLAY_WITH_DATA_ORIGIN_TAG_NAME = '__DISPLAY_WITH_DATA_ORIGIN';
export const DISGUISE_FEAT_TAG_NAME = '__DISGUISE_FEAT';
export const DefaultCharacterName = 'Hero With No Name';

export const ABILITY_STAT_MENTAL_LIST = [
  AbilityStatEnum.INTELLIGENCE,
  AbilityStatEnum.WISDOM,
  AbilityStatEnum.CHARISMA,
] as const;

export const ABILITY_STAT_PHYSICAL_LIST = [
  AbilityStatEnum.STRENGTH,
  AbilityStatEnum.DEXTERITY,
  AbilityStatEnum.CONSTITUTION,
] as const;

export const Constants = {
  FEET_IN_MILES,
  POUNDS_IN_TON,
  AppContextTypeEnum,
  AbilityScoreTypeEnum,
  AbilityStatEnum,
  AbilitySkillEnum,
  AttackTypeRangeEnum,
  AdjustmentDataTypeEnum,
  AdjustmentConstraintTypeEnum,
  DamageAdjustmentTypeEnum,
  DefenseAdjustmentTypeEnum,
  WeaponCategoryEnum,
  WeightTypeEnum,
  ProficiencyLevelEnum,
  StealthCheckTypeEnum,
  FeatureTypeEnum,
  DB_STRING_WILDSHAPE_2024,
  DB_STRING_MEDIUM_ARMOR_MASTER,
  DB_STRING_SPELLCASTING,
  DB_STRING_PACT_MAGIC,
  DB_STRING_ELDRITCH_ADEPT,
  DB_STRING_MARTIAL_ARTS,
  DB_STRING_DEDICATED_WEAPON,
  DB_STRING_INTEGRATED_PROTECTION,
  DB_STRING_IMPROVED_PACT_WEAPON,
  DB_STRING_CARAPACE,
  DB_STRING_VERDAN,
  DB_STRING_BOOK_OF_ANCIENT_SECRETS,
  DB_STRING_INFUSE_ITEM,
  DB_STRING_RITUAL_CASTER_BARD,
  DB_STRING_RITUAL_CASTER_CLERIC,
  DB_STRING_RITUAL_CASTER_DRUID,
  DB_STRING_RITUAL_CASTER_SORCERER,
  DB_STRING_RITUAL_CASTER_WARLOCK,
  DB_STRING_RITUAL_CASTER_WIZARD,
  DB_STRING_RITUAL_CASTER_LIST,
  PreferenceAbilityScoreDisplayTypeEnum,
  PreferencePrivacyTypeEnum,
  PreferenceSharingTypeEnum,
  PreferenceEncumbranceTypeEnum,
  PreferenceHitPointTypeEnum,
  PreferenceProgressionTypeEnum,
  SpeedMovementKeyEnum,
  MovementTypeEnum,
  SenseTypeEnum,
  NoteKeyEnum,
  TraitTypeEnum,
  WeightSpeedTypeEnum,
  CustomProficiencyTypeEnum,
  SaveTypeEnum,
  CreatureSizeNameEnum,
  CreatureSizeEnum,
  ActivatableTypeEnum,
  SituationalBonusSavingThrowTypeEnum,
  AbilityScoreStatTypeEnum,
  BuilderChoiceTypeEnum,
  BuilderChoiceSubtypeEnum,
  StartingEquipmentTypeEnum,
  MulticlassSpellSlotRoundingEnum,
  ProficiencyRoundingEnum,
  RuleKeyEnum,
  CharacterColorEnum,
  SourceTypeEnum,
  AdditionalTypeEnum,
  DisplayConfigurationTypeEnum,
  DisplayConfigurationValueEnum,
  EntityTypeEnum,
  CoinTypeEnum,
  CoinNamesEnum,
  SIGNED_32BIT_INT_MAX_VALUE,
  SIGNED_32BIT_INT_MIN_VALUE,
  CURRENCY_VALUE,
  INITIAL_ASI_TAG_NAME,
  DISPLAY_WITH_DATA_ORIGIN_TAG_NAME,
  DISGUISE_FEAT_TAG_NAME,
  DefaultCharacterName,
  ABILITY_STAT_MENTAL_LIST,
  ABILITY_STAT_PHYSICAL_LIST,
} as const;
