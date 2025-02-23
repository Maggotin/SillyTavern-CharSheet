import { createSelector } from 'reselect';
import { ApiGenerators } from '../../api';
import { AbilityGenerators } from '../../engine/Ability';
import { ActionGenerators } from '../../engine/Action';
import { BackgroundGenerators } from '../../engine/Background';
import { CampaignGenerators } from '../../engine/Campaign';
import { CharacterDerivers, CharacterGenerators, CharacterHacks, CharacterUtils, } from '../../engine/Character';
import { ChoiceGenerators } from '../../engine/Choice';
import { ClassDerivers, ClassGenerators } from '../../engine/Class';
import { ClassFeatureGenerators } from '../../engine/ClassFeature';
import { ConditionGenerators } from '../../engine/Condition';
import { ContainerGenerators } from '../../engine/Container';
import { CoreGenerators } from '../../engine/Core';
import { CreatureGenerators } from '../../engine/Creature';
import { CreatureRuleGenerators } from '../../engine/CreatureRule';
import { DataOriginGenerators } from '../../engine/DataOrigin';
import { DecorationAccessors, DecorationGenerators } from '../../engine/Decoration';
import { DiceGenerators } from '../../engine/Dice';
import { EntityGenerators } from '../../engine/Entity';
import { ExtraGenerators } from '../../engine/Extra';
import { FeatGenerators } from '../../engine/Feat';
import { InfusionGenerators } from '../../engine/Infusion';
import { InfusionChoiceGenerators } from '../../engine/InfusionChoice';
import { ItemDerivers, ItemGenerators, ItemUtils } from '../../engine/Item';
import { KnownInfusionGenerators } from '../../engine/KnownInfusion';
import { ModifierGenerators } from '../../engine/Modifier';
import { OptionGenerators } from '../../engine/Option';
import { OptionalClassFeatureGenerators } from '../../engine/OptionalClassFeature';
import { OptionalOriginGenerators } from '../../engine/OptionalOrigin';
import { PdfGenerators, PdfHacks } from '../../engine/Pdf';
import { PrerequisiteGenerators } from '../../engine/Prerequisite';
import { RaceGenerators } from '../../engine/Race';
import { RuleDataAccessors, RuleDataGenerators } from '../../engine/RuleData';
import { SkillGenerators } from '../../engine/Skill';
import { SnippetGenerators } from '../../engine/Snippet';
import { SpellDerivers, SpellGenerators } from '../../engine/Spell';
import { ValueUtils } from '../../engine/Value';
import { VehicleGenerators } from '../../engine/Vehicle';
import { VehicleComponentGenerators } from '../../engine/VehicleComponent';
import * as characterSelectors from '../character';
import * as characterEnvSelectors from '../characterEnv';
import * as featureFlagInfoSelectors from '../featureFlagInfo';
import * as ruleDataSelectors from '../ruleData';
import * as serviceDataSelectors from '../serviceData';
/**
 * PassThrough exports from other selectors
 */
export * from './app/characterPassThrough';
/**
 * @returns {RequiredGameDataServiceParams}
 */
export const getRequiredGameDataServiceParams = createSelector([characterSelectors.getCampaign], ApiGenerators.generateRequiredGameDataServiceParams);
/**
 * @returns {RequiredCharacterServiceParams}
 */
export const getRequiredCharacterServiceParams = createSelector([characterSelectors.getId], ApiGenerators.generateRequiredCharacterServiceParams);
/**
 * @returns {RuleData}
 */
export const getRuleData = createSelector([ruleDataSelectors.getAllData, serviceDataSelectors.getRuleDataPool], RuleDataGenerators.generateRuleData);
/**
 * @returns {SpellListDataOriginLookup}
 */
export const getSpellListDataOriginLookup = createSelector([
    characterSelectors.getRace,
    characterSelectors.getClasses,
    characterSelectors.getBackground,
    characterSelectors.getOptionalOrigins,
    characterSelectors.getOptionalClassFeatures,
    serviceDataSelectors.getDefinitionPool,
], SpellGenerators.generateSpellListDataOriginLookup);
/**
 * @returns {Record<string, Array<ActionContract>>}
 */
export const getFeatActionLookup = createSelector([characterSelectors.getActions_feat], ActionGenerators.generateActionComponentLookup);
/**
 * @returns {Record<string, Array<ModifierContract>>}
 */
export const getFeatModifierLookup = createSelector([characterSelectors.getModifiers_feat], ModifierGenerators.generateModifierComponentLookup);
/**
 * @returns {Record<string, Array<CharacterOptionContract>>}
 */
export const getFeatOptionLookup = createSelector([characterSelectors.getOptions_feat], OptionGenerators.generateOptionComponentLookup);
/**
 * @returns {Record<string, Array<BuilderChoiceContract>>}
 */
export const getFeatChoiceLookup = createSelector([characterSelectors.getChoices_feat, characterSelectors.getChoices_choiceDefinitions], ChoiceGenerators.generateChoiceComponentLookup);
/**
 * @returns {Record<string, Array<BaseSpellContract>>}
 */
export const getFeatSpellsLookup = createSelector([characterSelectors.getSpells_feat], SpellGenerators.generateSpellComponentLookup);
/**
 * @returns {Record<string, Array<ModifierContract>>}
 */
export const getConditionModifierLookup = createSelector([characterSelectors.getModifiers_condition], ModifierGenerators.generateModifierComponentLookup);
/**
 * @returns {Record<string, Array<ModifierContract>>}
 */
export const getRaceModifierLookup = createSelector([characterSelectors.getModifiers_race], ModifierGenerators.generateModifierComponentLookup);
/**
 * @returns {Record<string, Array<BaseSpellContract>>}
 */
export const getRaceSpellLookup = createSelector([characterSelectors.getSpells_race], SpellGenerators.generateSpellComponentLookup);
/**
 * @returns {Record<string, Array<ActionContract>>}
 */
export const getRaceActionLookup = createSelector([characterSelectors.getActions_race], ActionGenerators.generateActionComponentLookup);
/**
 * @returns {Record<string, Array<BuilderChoiceContract>>}
 */
export const getRaceChoiceLookup = createSelector([characterSelectors.getChoices_race, characterSelectors.getChoices_choiceDefinitions], ChoiceGenerators.generateChoiceComponentLookup);
/**
 * @returns {Record<string, Array<CharacterOptionContract>>}
 */
export const getRaceOptionLookup = createSelector([characterSelectors.getOptions_race], OptionGenerators.generateOptionComponentLookup);
/**
 * @returns {Record<string, Array<BuilderChoiceContract>>}
 */
export const getClassChoiceLookup = createSelector([characterSelectors.getChoices_class, characterSelectors.getChoices_choiceDefinitions], ChoiceGenerators.generateChoiceComponentLookup);
/**
 * @returns {Record<string, Array<ModifierContract>>}
 */
export const getClassModifierLookup = createSelector([characterSelectors.getModifiers_class], ModifierGenerators.generateModifierComponentLookup);
/**
 * @returns {Record<string, Array<BaseSpellContract>>}
 */
export const getClassSpellLookup = createSelector([characterSelectors.getSpells_class], SpellGenerators.generateSpellComponentLookup);
/**
 * @returns {Record<string, Array<ActionContract>>}
 */
export const getClassActionLookup = createSelector([characterSelectors.getActions_class], ActionGenerators.generateActionComponentLookup);
/**
 * @returns {Record<string, Array<CharacterOptionContract>>}
 */
export const getClassOptionLookup = createSelector([characterSelectors.getOptions_class], OptionGenerators.generateOptionComponentLookup);
/**
 * @returns {CharacterConfiguration}
 */
export const getCharacterConfiguration = createSelector([characterSelectors.getConfiguration], CharacterGenerators.generateCharacterConfiguration);
/**
 * @returns {CharacterPreferences}
 */
export const getCharacterPreferences = createSelector([characterSelectors.getPreferences, featureFlagInfoSelectors.getFeatureFlagInfo], CharacterGenerators.generateCharacterPreferences);
/**
 * @returns {CharacterNotes}
 */
export const getCharacterNotes = createSelector([characterSelectors.getNotes], CharacterGenerators.generateCharacterNotes);
/**
 * @returns {CharacterTraits}
 */
export const getCharacterTraits = createSelector([characterSelectors.getTraits], CharacterGenerators.generateCharacterTraits);
/**
 * @returns {Array<number>}
 */
export const getActiveSourceCategories = createSelector([characterSelectors.getActiveSourceCategories], (sourceCategories) => sourceCategories);
/**
 * @returns {Array<SourceData>}
 */
export const getActiveSources = createSelector([
    getActiveSourceCategories,
    characterSelectors.getCampaignSetting,
    serviceDataSelectors.getCampaignSettings,
    getRuleData,
    featureFlagInfoSelectors.getFeatureFlagInfo,
], CharacterGenerators.generateActiveSources);
/**
 * @returns {Record<number, SourceData>}
 */
export const getActiveSourceLookup = createSelector([getActiveSources], RuleDataGenerators.generateSourceDataLookup);
/**
 * @returns {EntityRestrictionData}
 */
export const getEntityRestrictionData = createSelector([getCharacterPreferences, getActiveSourceLookup], EntityGenerators.generateEntityRestrictionData);
/**
 * @returns {Record<string, Array<ModifierContract>>}
 */
export const getBackgroundModifierLookup = createSelector([characterSelectors.getModifiers_background], ModifierGenerators.generateModifierComponentLookup);
/**
 * @returns {Record<string, Array<BuilderChoiceContract>>}
 */
export const getBackgroundChoiceLookup = createSelector([characterSelectors.getChoices_background, characterSelectors.getChoices_choiceDefinitions], ChoiceGenerators.generateChoiceComponentLookup);
/**
 * @returns {Array<BaseFeat>}
 */
export const getBaseFeats = createSelector([
    characterSelectors.getFeats,
    getFeatOptionLookup,
    getFeatActionLookup,
    getFeatChoiceLookup,
    getFeatModifierLookup,
    getFeatSpellsLookup,
    characterSelectors.getCharacterValueLookup,
    getSpellListDataOriginLookup,
    getRuleData,
], FeatGenerators.generateBaseFeats);
/**
 * @returns {Record<string, Array<FeatDetailsContract>>}
 */
export const getBaseFeatLookup = createSelector([getBaseFeats], FeatGenerators.generateFeatComponentLookup);
/**
 * @returns {Background | null}
 */
export const getBackgroundInfo = createSelector([
    characterSelectors.getBackground,
    getBackgroundModifierLookup,
    getBackgroundChoiceLookup,
    characterSelectors.getChoices,
    getBaseFeats,
], BackgroundGenerators.generateBackground);
/**
 * @returns {Array<Condition>}
 */
export const getActiveConditions = createSelector([characterSelectors.getConditions, getConditionModifierLookup, getRuleData], ConditionGenerators.generateConditions);
/**
 * @returns {Array<OptionalClassFeature>}
 */
export const getOptionalClassFeatures = createSelector([
    characterSelectors.getOptionalClassFeatures,
    serviceDataSelectors.getDefinitionPool,
    characterSelectors.getClasses,
    characterSelectors.getChoices,
    getBaseFeats,
], OptionalClassFeatureGenerators.generateOptionalClassFeatures);
/**
 * @returns {OptionalClassFeatureLookup}
 */
export const getOptionalClassFeatureLookup = createSelector([getOptionalClassFeatures], OptionalClassFeatureGenerators.generateOptionalClassFeatureLookup);
/**
 * @returns {Array<OptionalOrigin>}
 */
export const getOptionalOrigins = createSelector([characterSelectors.getOptionalOrigins, serviceDataSelectors.getDefinitionPool], OptionalOriginGenerators.generateOptionalOrigins);
/**
 * @returns {OptionalOriginLookup}
 */
export const getOptionalOriginLookup = createSelector([getOptionalOrigins], OptionalOriginGenerators.generateOptionalOriginLookup);
/**
 *
 */
export const getKnownInfusions = createSelector([serviceDataSelectors.getKnownInfusionsMappings, serviceDataSelectors.getDefinitionPool, characterSelectors.getId], KnownInfusionGenerators.generateKnownInfusions);
/**
 *
 */
export const getKnownInfusionLookup = createSelector([getKnownInfusions], KnownInfusionGenerators.generateKnownInfusionLookup);
/**
 *
 */
export const getKnownInfusionLookupByChoiceKey = createSelector([getKnownInfusions], KnownInfusionGenerators.generateKnownInfusionLookupByChoiceKey);
/**
 *
 */
export const getKnownReplicatedItems = createSelector([getKnownInfusions], KnownInfusionGenerators.generateKnownReplicatedItems);
/**
 *
 */
export const getInfusions = createSelector([serviceDataSelectors.getInfusionsMappings, serviceDataSelectors.getDefinitionPool], InfusionGenerators.generateInfusions);
/**
 *
 */
export const getInfusionChoiceInfusionLookup = createSelector([getInfusions], InfusionGenerators.generateInfusionChoiceInfusionLookup);
/**
 *
 */
export const getInventoryInfusionLookup = createSelector([getInfusions], InfusionGenerators.generateInventoryInfusionLookup);
/**
 *
 */
export const getCreatureInfusionLookup = createSelector([getInfusions], InfusionGenerators.generateCreatureInfusionLookup);
/**
 * @returns {ClassesLookupData}
 */
const getClassesLookupData = createSelector([
    getClassModifierLookup,
    getClassSpellLookup,
    getClassActionLookup,
    getClassChoiceLookup,
    getClassOptionLookup,
    characterSelectors.getCharacterValueLookup,
    getBaseFeatLookup,
    getInfusionChoiceInfusionLookup,
    getKnownInfusionLookupByChoiceKey,
    getSpellListDataOriginLookup,
], ClassGenerators.generateClassesLookupData);
/**
 * @returns {Array<BaseCharClass>}
 */
const getBaseClasses = createSelector([
    characterSelectors.getClasses,
    getOptionalClassFeatures,
    characterSelectors.getClassSpells,
    serviceDataSelectors.getClassAlwaysPreparedSpells,
    serviceDataSelectors.getClassAlwaysKnownSpells,
    characterEnvSelectors.getContext,
    getRuleData,
    getClassesLookupData,
    serviceDataSelectors.getDefinitionPool,
    getCharacterPreferences,
    characterSelectors.getId,
    characterSelectors.getChoices,
    getBaseFeats,
], ClassGenerators.generateBaseCharClasses);
/**
 * @returns {Record<number, ClassFeature>}
 */
export const getClassFeatureLookup = createSelector([getBaseClasses], ClassGenerators.generateClassFeatureLookup);
/**
 * @returns {BaseClassLookup}
 */
export const getBaseClassLookup = createSelector([getBaseClasses], ClassGenerators.generateBaseClassLookup);
/**
 * @returns {ClassMappingIdLookup}
 */
export const getClassMappingIdLookupByActiveId = createSelector([getBaseClasses], ClassGenerators.generateClassMappingIdLookupByActiveId);
/**
 * @returns {boolean}
 */
export const isMulticlassCharacter = createSelector([getBaseClasses], ClassDerivers.deriveIsMulticlassCharacter);
/**
 *
 */
export const getInfusionChoices = createSelector([getBaseClasses], InfusionChoiceGenerators.generateAggregatedInfusionChoices);
/**
 *
 */
export const getAvailableInfusionChoices = createSelector([getInfusionChoices], InfusionChoiceGenerators.generateAvailableInfusionChoices);
/**
 *
 */
export const getInfusionChoiceLookup = createSelector([getInfusionChoices], InfusionChoiceGenerators.generateInfusionChoiceLookup);
/**
 * @returns {number}
 */
export const getTotalClassLevel = createSelector([getBaseClasses], ClassGenerators.generateTotalClassLevel);
/**
 * @returns {number}
 */
export const getCurrentLevel = createSelector([characterSelectors.getCurrentXp, characterSelectors.getPreferences, getTotalClassLevel, getRuleData], CharacterGenerators.generateCurrentLevel);
/**
 * @returns {ExperienceInfo}
 */
export const getExperienceInfo = createSelector([getTotalClassLevel, getCurrentLevel, characterSelectors.getCurrentXp, getRuleData], CharacterGenerators.generateExperienceInfo);
/**
 * @returns {Hack__RaceDataLookups}
 */
const getRaceLookupData = createSelector([
    getRaceOptionLookup,
    getRaceActionLookup,
    getRaceChoiceLookup,
    getRaceModifierLookup,
    getRaceSpellLookup,
    getBaseFeatLookup,
    characterSelectors.getCharacterValueLookup,
    getSpellListDataOriginLookup,
], RaceGenerators.generateRaceLookupData);
/**
 * @returns {boolean}
 */
export const getIsInitialAsiFromFeat = createSelector([characterSelectors.getFeats], FeatGenerators.generateIsInitialAsiFromFeat);
/**
 * @returns {Race | null}
 */
export const getRace = createSelector([
    characterSelectors.getRace,
    getOptionalOrigins,
    getRaceLookupData,
    getExperienceInfo,
    characterEnvSelectors.getContext,
    getRuleData,
    serviceDataSelectors.getDefinitionPool,
    getCharacterPreferences,
    getIsInitialAsiFromFeat,
], RaceGenerators.generateRace);
/**
 * @returns {Array<Feat>}
 */
export const getFeats = createSelector([getBaseFeats, getBaseClasses, getRace, characterSelectors.getBackground, characterSelectors.getChoices_class], FeatGenerators.generateAggregatedFeats);
/**
 * All the feats, except those tagged as data origin only.
 * @returns {Array<Feat>}
 */
export const getStandardFeats = createSelector([getFeats], FeatGenerators.generateStandardFeats);
/**
 * The feats that are tagged as being paired with a data origin.
 * For example, the new background ASI feats should only ever be displayed
 * with the data origin, not with other feats.
 * @returns {DataOriginFeatLookup}
 */
export const getDataOriginOnlyFeatLookup = createSelector([getFeats], FeatGenerators.generateDataOriginPairedFeats);
/**
 * @returns {Record<number, Feat>}
 */
export const getFeatLookup = createSelector([getFeats], FeatGenerators.generateFeatLookup);
/**
 * @returns {Array<number>}
 */
export const getGlobalRaceSpellListIds = createSelector([getRace], RaceGenerators.generateGlobalSpellListIds);
/**
 * @returns {Array<number>}
 */
export const getGlobalBackgroundSpellListIds = createSelector([getBackgroundInfo], BackgroundGenerators.generateGlobalSpellListIds);
/**
 * @returns {Array<number>}
 */
export const getGlobalSpellListIds = createSelector([getGlobalRaceSpellListIds, getGlobalBackgroundSpellListIds], SpellGenerators.generateGlobalSpellListIds);
/**
 * @returns {DecorationInfo}
 */
export const getDecorationInfo = createSelector([characterSelectors.getDecorations, characterSelectors.getPreferences], DecorationGenerators.generateDecorationInfo);
/**
 * @returns {CharacterTheme}
 */
export const getCharacterTheme = createSelector([getDecorationInfo], DecorationAccessors.getCharacterTheme);
/**
 * @returns {Record<string, Array<ModifierContract>>}
 */
export const getItemModifierLookup = createSelector([characterSelectors.getModifiers_item, serviceDataSelectors.getPartyInfo], ModifierGenerators.generateItemModifierLookup);
/**
 * @returns {Record<string, Array<BaseSpellContract>>}
 */
export const getItemSpellLookup = createSelector([characterSelectors.getSpells_item, serviceDataSelectors.getPartyInfo], SpellGenerators.generateItemSpellLookup);
/**
 * returns all BaseItems from characters inventory
 * @returns {Array<BaseItem>}
 */
const getBaseInventory = createSelector([
    characterSelectors.getInventory,
    getItemModifierLookup,
    getItemSpellLookup,
    characterSelectors.getCharacterValueLookup,
    getInventoryInfusionLookup,
    getRuleData,
], ItemGenerators.generateBaseItems);
/**
 * returns all shared BaseItems from party inventory
 * @returns {Array<BaseItem>}
 */
const getBasePartyInventory = createSelector([
    serviceDataSelectors.getPartyInfo,
    getItemModifierLookup,
    getItemSpellLookup,
    characterSelectors.getCharacterValueLookup,
    getInventoryInfusionLookup,
    getRuleData,
], CampaignGenerators.generateBasePartyInventory);
/**
 * returns all BaseItems from all Inventories
 * @returns {Array<BaseItem>}
 */
const getAllBaseInventory = createSelector([getBaseInventory, getBasePartyInventory], (getBaseInventory, getBasePartyInventory) => [...getBaseInventory, ...getBasePartyInventory]);
/**
 * returns all BaseItems equipped to current character
 * @returns {Array<BaseItem>}
 */
const getEquippedBaseItems = createSelector([getAllBaseInventory, characterSelectors.getId], ItemGenerators.generateEquippedItems);
/**
 * @returns {SizeContract | null}
 */
export const getSize = createSelector([getRace], CharacterGenerators.generateSize);
/**
 * @returns {WeightSpeedContract | null}
 */
export const getWeightSpeeds = createSelector([getRace], CharacterGenerators.generateWeightSpeeds);
/**
 * @returns {AlignmentContract | null}
 */
export const getAlignment = createSelector([characterSelectors.getAlignmentId, getRuleData], CharacterGenerators.generateAlignment);
/**
 * @returns {CharacterLifestyleContract | null}
 */
export const getLifestyle = createSelector([characterSelectors.getLifestyleId, getRuleData], CharacterGenerators.generateLifestyle);
/**
 * @returns {Array<Modifier>}
 */
export const getRaceModifiers = createSelector([getRace], RaceGenerators.generateRaceModifiers);
/**
 * @returns {Array<Modifier>}
 */
export const getClassesModifiers = createSelector([getBaseClasses, isMulticlassCharacter], ClassGenerators.generateClassesModifiers);
/**
 * @returns {Array<Modifier>}
 */
export const getFeatModifiers = createSelector([getBaseFeats], FeatGenerators.generateFeatModifiers);
/**
 * @returns {Array<Modifier>}
 */
export const getBackgroundModifiers = createSelector([getBackgroundInfo], BackgroundGenerators.generateBackgroundModifiers);
/**
 * @returns {Array<Modifier>}
 */
export const getValidEquipmentModifiers = createSelector([getEquippedBaseItems], ItemGenerators.generateValidEquipmentModifiers);
/**
 * @returns {Array<Modifier>}
 */
export const getMiscModifiers = createSelector([getValidEquipmentModifiers, getFeatModifiers, getBackgroundModifiers], ModifierGenerators.generateMiscModifiers);
/**
 * @returns {Array<Modifier>}
 */
export const getConditionModifiers = createSelector([getActiveConditions], ConditionGenerators.generateConditionModifiers);
/**
 * @returns {Array<Modifier>}
 */
export const getValidGlobalModifiers = createSelector([
    getRaceModifiers,
    getClassesModifiers,
    getFeatModifiers,
    getBackgroundModifiers,
    getValidEquipmentModifiers,
    getConditionModifiers,
], ModifierGenerators.generateValidGlobalModifiers);
/**
 * @returns {DeathSaveInfo}
 */
export const getDeathSaveInfo = createSelector([characterSelectors.getDeathSaves, getValidGlobalModifiers], CharacterGenerators.generateDeathSaveInfo);
/**
 * @returns {Record<string, number>}
 */
export const getProficiencyLookup = createSelector([characterSelectors.getCharacterValueLookupByType, getValidGlobalModifiers], CharacterGenerators.generateProficiencyLookup);
/**
 * @returns {number}
 */
export const getProficiencyBonus = createSelector([getCurrentLevel, getValidGlobalModifiers, getRuleData], CharacterGenerators.generateProficiencyBonus);
/**
 * @returns {number}
 */
export const getAttunedItemCountMax = createSelector([getRuleData, getValidGlobalModifiers], ItemGenerators.generateAttunedItemCountMax);
/**
 * @returns {Array<BaseItem>}
 */
const getAttunedBaseItems = createSelector([getEquippedBaseItems, getAttunedItemCountMax], ItemGenerators.generateEquippedAttunedItems);
/**
 * @returns {ModifierData}
 */
const getModifierDataPreAbilities = createSelector([getProficiencyBonus, getAttunedBaseItems], ModifierGenerators.generateModifierDataPreAbilities);
/**
 * @returns {Array<Ability>}
 */
export const getAbilities = createSelector([
    characterSelectors.getStats,
    characterSelectors.getBonusStats,
    characterSelectors.getOverrideStats,
    getRaceModifiers,
    getClassesModifiers,
    getMiscModifiers,
    getValidGlobalModifiers,
    getProficiencyBonus,
    getModifierDataPreAbilities,
    getRuleData,
    characterSelectors.getCharacterValueLookup,
], AbilityGenerators.generateAbilities);
/**
 * @returns {Array<RacialTrait>}
 */
export const getCurrentLevelRacialTraits = createSelector([getRace, getTotalClassLevel], RaceGenerators.generateCurrentLevelRacialTraits);
/**
 * @returns {Record<number, Ability>}
 */
export const getAbilityLookup = createSelector([getAbilities], AbilityGenerators.generateAbilityLookup);
/**
 * @returns {Record<string, Ability>}
 */
export const getAbilityKeyLookup = createSelector([getAbilities], AbilityGenerators.generateAbilityKeyLookup);
/**
 * @returns {PrerequisiteData}
 */
export const getPrerequisiteData = createSelector([
    getRace,
    getProficiencyLookup,
    getAbilityLookup,
    getCurrentLevel,
    getBaseClassLookup,
    getFeatLookup,
    getClassFeatureLookup,
], PrerequisiteGenerators.generatePrerequisiteData);
/**
 * @returns {number}
 */
export const getDexModifier = createSelector([getAbilityLookup], ModifierGenerators.generateDexModifier);
/**
 * @returns {number}
 */
export const getConModifier = createSelector([getAbilityLookup], ModifierGenerators.generateConModifier);
/**
 * @returns {number}
 */
export const getStrScore = createSelector([getAbilityLookup], ModifierGenerators.generateStrScore);
/**
 * @returns {ModifierData}
 */
export const getModifierData = createSelector([getAbilityLookup, getModifierDataPreAbilities, getAttunedBaseItems], ModifierGenerators.generateModifierData);
/**
 * @returns {Record<number, ClassSpellcasterInfo>}
 */
export const getClassSpellInfoLookup = createSelector([getBaseClasses, getRuleData, getProficiencyBonus, getValidGlobalModifiers, getAbilityLookup], ClassGenerators.generateClassSpellInfoLookup);
/**
 * @returns {OverallSpellInfo}
 */
export const getOverallSpellInfo = createSelector([getValidGlobalModifiers, getExperienceInfo, getProficiencyBonus, getAbilityLookup, getSpellListDataOriginLookup], CharacterGenerators.generateOverallSpellInfo);
/**
 * @returns {Array<CharClass>}
 */
export const getClasses = createSelector([
    getBaseClasses,
    getClassSpellInfoLookup,
    getOverallSpellInfo,
    getSpellListDataOriginLookup,
    characterSelectors.getCharacterValueLookup,
    getRuleData,
    getModifierData,
], ClassGenerators.generateCharClasses);
/**
 *
 */
export const getClassSpellListSpellsLookup = createSelector([getClasses], ClassGenerators.generateClassSpellListSpellsLookup);
/**
 * @returns {CharClass | null}
 */
export const getStartingClass = createSelector([getClasses], ClassGenerators.generateStartingClass);
/**
 * @returns {Array<CreatureRule>}
 */
export const getClassCreatureRules = createSelector([getClasses, getExperienceInfo, getRuleData], ClassFeatureGenerators.generateClassCreatureRules);
/**
 * @returns {Array<CreatureRule>}
 */
export const getRaceCreatureRules = createSelector([getRace, getExperienceInfo, getRuleData], RaceGenerators.generateRaceCreatureRules);
/**
 * @returns {Array<CreatureRule>}
 */
export const getFeatCreatureRules = createSelector([getFeats, getExperienceInfo, getRuleData], FeatGenerators.generateFeatCreatureRules);
/**
 * @returns {Array<CreatureRule>}
 */
export const getCreatureRules = createSelector([getClassCreatureRules, getRaceCreatureRules, getFeatCreatureRules], CreatureRuleGenerators.generateCreatureRules);
/**
 * @returns {Record<number, Array<CreatureRule>>}
 */
export const getCreatureGroupRulesLookup = createSelector([getCreatureRules], CreatureRuleGenerators.generateCreatureGroupRulesLookup);
/**
 * @returns {number | null}
 */
export const getMartialArtsLevel = createSelector([getClasses, getEquippedBaseItems], CharacterGenerators.generateMartialArtsLevel);
/**
 * @returns {Array<DataOriginBaseAction>}
 */
export const getInnateNaturalActions = createSelector([getRuleData, characterSelectors.getCharacterValueLookup], ActionGenerators.generateInnateBaseActions);
/**
 * @returns {Array<CustomProficiencyContract>}
 */
export const getCustomSkillProficiencies = createSelector([characterSelectors.getCustomProficiencies], CharacterGenerators.generateCustomSkillProficiencies);
/**
 * @returns {Array<string>}
 */
export const getLanguages = createSelector([getValidGlobalModifiers], CharacterGenerators.generateLanguages);
/**
 * @returns {number | null}
 */
export const getOverridePassivePerception = createSelector([characterSelectors.getCharacterValueLookup], ValueUtils.getOverridePassivePerceptionValue);
/**
 * @returns {number | null}
 */
export const getOverridePassiveInvestigation = createSelector([characterSelectors.getCharacterValueLookup], ValueUtils.getOverridePassiveInvestigationValue);
/**
 * @returns {number | null}
 */
export const getOverridePassiveInsight = createSelector([characterSelectors.getCharacterValueLookup], ValueUtils.getOverridePassiveInsightValue);
/**
 * @returns {number}
 */
export const getProcessedInitiative = createSelector([getValidGlobalModifiers, getAbilityLookup, getProficiencyBonus], CharacterGenerators.getInitiative);
/**
 * @returns {boolean}
 */
export const getHasInitiativeAdvantage = createSelector([getValidGlobalModifiers], CharacterGenerators.generateHasInitiativeAdvantage);
/**
 * @returns {number}
 */
export const getStaticInitiative = createSelector([getProcessedInitiative, ruleDataSelectors.getInitiativeScore], CharacterGenerators.getStaticInitiative);
/**
 * @returns {boolean}
 */
export const getDedicatedWeaponEnabled = createSelector([getClasses], ClassGenerators.generateDedicatedWeaponEnabled);
/**
 * @returns {boolean}
 */
export const getHexWeaponEnabled = createSelector([getClasses], ClassGenerators.generateHexWeaponEnabled);
/**
 * @returns {boolean}
 */
export const getPactWeaponEnabled = createSelector([getClasses], ClassGenerators.generatePactWeaponEnabled);
/**
 * @returns {boolean}
 */
export const getImprovedPactWeaponEnabled = createSelector([getClasses], ClassGenerators.generateImprovedPactWeaponEnabled);
/**
 * TODO: add return here
 */
export const hack__getSpecialWeaponPropertiesEnabled = createSelector([getHexWeaponEnabled, getPactWeaponEnabled, getImprovedPactWeaponEnabled, getDedicatedWeaponEnabled], CharacterHacks.hack__generateSpecialWeaponPropertiesEnabled);
/**
 * TODO v5.1: should be able to remove this selector and all usages after mobile can support customItems as Items
 * @returns {Array<Item>}
 */
export const getCustomItems = createSelector([characterSelectors.getCustomItems, getRuleData, characterSelectors.getId], ItemGenerators.generateCustomItems);
/**
 * returns Items in characters inventory
 * @returns {Array<Item>}
 */
export const getInventory = createSelector([
    getBaseInventory,
    getAbilityLookup,
    getProficiencyBonus,
    getValidGlobalModifiers,
    characterSelectors.getCharacterValueLookupByEntity,
    characterSelectors.getCharacterValueLookupByType,
    characterSelectors.getCharacterValueLookup,
    getMartialArtsLevel,
    getRuleData,
    hack__getSpecialWeaponPropertiesEnabled,
], ItemGenerators.generateItems);
/**
 * returns Items in party inventory
 * @returns {Array<Item>}
 */
export const getPartyInventory = createSelector([
    getBasePartyInventory,
    getAbilityLookup,
    getProficiencyBonus,
    getValidGlobalModifiers,
    characterSelectors.getCharacterValueLookupByEntity,
    characterSelectors.getCharacterValueLookupByType,
    characterSelectors.getCharacterValueLookup,
    getMartialArtsLevel,
    getRuleData,
    hack__getSpecialWeaponPropertiesEnabled,
], ItemGenerators.generateItems);
/**
 * returns all Items in all inventories
 * @returns {Array<Item>}
 */
export const getAllInventoryItems = createSelector([getInventory, getPartyInventory], (getInventory, getPartyInventory) => [...getInventory, ...getPartyInventory]);
/**
 *
 */
export const getInventoryLookup = createSelector([getInventory], ItemGenerators.generateInventoryLookup);
/**
 *
 */
export const getPartyInventoryLookup = createSelector([getPartyInventory], ItemGenerators.generateInventoryLookup);
/**
 * TODO v5.1: remove customItems from this selector when mobile moves up to 5.1 customItems as Items
 * @returns {Array<Container>}
 */
export const getInventoryContainers = createSelector([
    getInventory,
    getCustomItems,
    characterSelectors.getId,
    serviceDataSelectors.getPartyInfo,
    getPartyInventory,
    featureFlagInfoSelectors.getFeatureFlagInfo,
    characterSelectors.getCurrencies,
    characterSelectors.getPreferences,
    getRuleData,
], ContainerGenerators.generateContainers);
export const getCharacterInventoryContainers = createSelector([getInventoryContainers], ContainerGenerators.generateCharacterContainers);
export const getPartyInventoryContainers = createSelector([getInventoryContainers], ContainerGenerators.generatePartyContainers);
/**
 * @returns {ContainerLookup}
 */
export const getContainerLookup = createSelector([getInventoryContainers], ContainerGenerators.generateContainerLookup);
/**
 * @returns {Array<Modifier>}
 */
export const getProficiencyModifiers = createSelector([getValidGlobalModifiers], ModifierGenerators.generateProficiencyModifiers);
/**
 * @returns {Array<Modifier>}
 */
export const getExpertiseModifiers = createSelector([getValidGlobalModifiers], ModifierGenerators.generateExpertiseModifiers);
/**
 * @returns {Array<Modifier>}
 */
export const getUniqueProficiencyModifiers = createSelector([getProficiencyModifiers], ModifierGenerators.generateUniqueProficiencyModifiers);
/**
 * returns all items equipped to current character from both inventory and party inventory
 * @returns {Array<Item>}
 */
export const getEquippedItems = createSelector([getAllInventoryItems, characterSelectors.getId], ItemGenerators.generateEquippedItems);
/**
 * @returns {ArmorItemArmorClass | null}
 */
export const getHighestAcEquippedArmor = createSelector([getEquippedItems, getDexModifier, getValidGlobalModifiers, getAbilityLookup, getRuleData], CharacterGenerators.generateHighestAcEquippedArmor);
/**
 * @returns {ArmorItemArmorClass | null}
 */
export const getHighestAcEquippedShield = createSelector([getEquippedItems, getDexModifier, getValidGlobalModifiers, getAbilityLookup, getRuleData], CharacterGenerators.generateHighestAcEquippedShield);
/**
 * @returns {Array<Skill>}
 */
export const getCustomSkills = createSelector([getCustomSkillProficiencies, getProficiencyBonus, getAbilityLookup, getValidGlobalModifiers, getEquippedItems], SkillGenerators.generateCustomSkills);
/**
 * @returns {Array<Skill>}
 */
export const getSkills = createSelector([
    getAbilityLookup,
    getValidGlobalModifiers,
    getProficiencyBonus,
    getRuleData,
    characterSelectors.getCharacterValueLookup,
    getEquippedItems,
], SkillGenerators.generateSkills);
/**
 * @returns {Record<number, Skill>}
 */
export const getSkillLookup = createSelector([getSkills], SkillGenerators.generateSkillLookup);
/**
 * @returns {number | null}
 */
export const getPassivePerception = createSelector([getSkills, getValidGlobalModifiers, getAbilityLookup, getOverridePassivePerception], CharacterGenerators.generatePassivePerception);
/**
 * @returns {number | null}
 */
export const getPassiveInvestigation = createSelector([getSkills, getValidGlobalModifiers, getAbilityLookup, getOverridePassiveInvestigation], CharacterGenerators.generatePassiveInvestigation);
/**
 * @returns {number | null}
 */
export const getPassiveInsight = createSelector([getSkills, getValidGlobalModifiers, getAbilityLookup, getOverridePassiveInsight], CharacterGenerators.generatePassiveInsight);
/**
 * note - inventory here is only to check for infusion actions,
 *        item attacks are added in getAttacks selector
 * @returns {Array<Action>}
 */
export const getActions = createSelector([
    getFeats,
    getRace,
    getClasses,
    getInnateNaturalActions,
    getInventory,
    getProficiencyBonus,
    getAbilityLookup,
    getValidGlobalModifiers,
    getMartialArtsLevel,
    getRuleData,
    getModifierData,
    characterSelectors.getCharacterValueLookup,
], ActionGenerators.generateAggregatedActions);
/**
 * @returns {ActionLookup}
 */
export const getActionLookup = createSelector([getActions], ActionGenerators.generateActionLookup);
/**
 * @returns {ArmorClassAdjustments}
 */
export const getAcAdjustments = createSelector([characterSelectors.getCharacterValueLookup], CharacterGenerators.generateArmorClassAdjustments);
/**
 * @returns {Array<ArmorClassSupplier>}
 */
export const getArmorClassSuppliers = createSelector([
    getHighestAcEquippedArmor,
    getHighestAcEquippedShield,
    getValidGlobalModifiers,
    getAbilityLookup,
    getEquippedItems,
    characterSelectors.getCharacterValueLookup,
    getRuleData,
    getModifierData,
], CharacterGenerators.generateArmorClassSuppliers);
/**
 * @returns {number}
 */
export const getAcTotal = createSelector([getArmorClassSuppliers, getAcAdjustments], CharacterGenerators.generateArmorClassTotal);
/**
 * @returns {number}
 */
export const getCarryCapacity = createSelector([getStrScore, getSize, getValidGlobalModifiers], CharacterUtils.getCarryCapacity);
/**
 * @returns {number}
 */
export const getPushDragLiftWeight = createSelector([getCarryCapacity], CharacterUtils.getPushDragLiftWeight);
/**
 * @returns {number}
 */
export const getEncumberedWeight = createSelector([getStrScore, getSize, getValidGlobalModifiers], CharacterUtils.getEncumberedWeight);
/**
 * @returns {number}
 */
export const getHeavilyEncumberedWeight = createSelector([getStrScore, getSize, getValidGlobalModifiers], CharacterUtils.getHeavilyEncumberedWeight);
/**
 * @returns {number}
 * @deprecated move to getCointainerCoinWeight
 */
export const getCoinWeight = createSelector([characterSelectors.getCurrencies, characterSelectors.getPreferences, getRuleData], CharacterGenerators.generateCoinWeight);
/**
 * @returns {number}
 * @deprecated move to getContainerItemWeight
 */
export const getItemWeight = createSelector([getInventory, getCustomItems], CharacterGenerators.generateItemWeight);
/**
 * @returns {number}
 */
export const getContainerItemWeight = createSelector([getCharacterInventoryContainers, getPartyInventoryContainers, characterSelectors.getId], CharacterGenerators.generateContainerItemWeight);
/**
 * @returns {number}
 */
export const getCointainerCoinWeight = createSelector([
    getCharacterInventoryContainers,
    getPartyInventoryContainers,
    characterSelectors.getId,
    characterSelectors.getPreferences,
], CharacterGenerators.generateCointainerCoinWeight);
/**
 * @returns {number}
 * @deprecated move to getTotalCarriedWeight
 */
export const getTotalWeight = createSelector([getItemWeight, getCoinWeight], CharacterGenerators.generateTotalWeight);
/**
 * @returns {number}
 */
export const getTotalCarriedWeight = createSelector([getContainerItemWeight, getCointainerCoinWeight], CharacterGenerators.generateTotalWeight);
/**
 * @returns {number}
 */
export const getArmorSpeedAdjustmentAmount = createSelector([getEquippedItems, getStrScore, getCharacterPreferences, getValidGlobalModifiers], ItemDerivers.deriveArmorSpeedAdjustmentAmount);
/**
 * @returns {WeightSpeedTypeEnum}
 * @deprecated move to getCurrentCarriedWeightType
 */
export const getCurrentWeightType = createSelector([getTotalWeight, getStrScore, getSize, characterSelectors.getPreferences, getValidGlobalModifiers], CharacterDerivers.deriveCurrentWeightSpeedType);
/**
 * @returns {WeightSpeedTypeEnum}
 */
export const getCurrentCarriedWeightType = createSelector([getTotalCarriedWeight, getStrScore, getSize, characterSelectors.getPreferences, getValidGlobalModifiers], CharacterDerivers.deriveCurrentWeightSpeedType);
/**
 * @returns {SpeedInfo}
 * @deprecated move to getCurrentCarriedWeightSpeed
 */
export const getCurrentWeightSpeed = createSelector([
    getWeightSpeeds,
    getCurrentWeightType,
    getArmorSpeedAdjustmentAmount,
    getValidGlobalModifiers,
    characterSelectors.getCustomSpeedLookup,
    getHighestAcEquippedArmor,
], CharacterGenerators.generateSpeedInfo);
/**
 * @returns {SpeedInfo}
 */
export const getCurrentCarriedWeightSpeed = createSelector([
    getWeightSpeeds,
    getCurrentCarriedWeightType,
    getArmorSpeedAdjustmentAmount,
    getValidGlobalModifiers,
    characterSelectors.getCustomSpeedLookup,
    getHighestAcEquippedArmor,
], CharacterGenerators.generateSpeedInfo);
/**
 * @returns {Array<Speed>}
 */
export const getSpeeds = createSelector([getCurrentCarriedWeightSpeed, characterSelectors.getCustomSpeedLookup, getRuleData], CharacterGenerators.generateSpeeds);
/**
 * @returns {Array<Item>}
 */
export const getAttunedItems = createSelector([getEquippedItems, getAttunedItemCountMax], ItemGenerators.generateEquippedAttunedItems);
/**
 * @returns {boolean}
 */
export const hasMaxAttunedItems = createSelector([getAttunedItems, getAttunedItemCountMax], ItemGenerators.generateHasMaxAttunedItems);
/**
 * @returns {Array<Item | null>}
 */
export const getAttunedSlots = createSelector([getAttunedItems, getAttunedItemCountMax], ItemUtils.getAttunedSlots);
/**
 * @returns {Array<Spell>}
 */
export const getCharacterSpells = createSelector([
    getValidGlobalModifiers,
    getAllInventoryItems,
    getFeats,
    getRace,
    getClasses,
    getProficiencyBonus,
    getAbilityLookup,
    getClassSpellInfoLookup,
    getOverallSpellInfo,
    characterSelectors.getCharacterValueLookup,
    getRuleData,
    getModifierData,
], SpellGenerators.generateCharacterSpells);
/**
 * @returns {Array<Spell>}
 */
export const getActiveCharacterSpells = createSelector([getCharacterSpells, getInventoryInfusionLookup, characterSelectors.getId], SpellGenerators.generateActiveCharacterSpells);
/**
 * @returns {Array<CharClass>}
 */
export const getSpellcastingClasses = createSelector([getClasses], ClassGenerators.generateSpellcastingClasses);
/**
 * @returns {Array<CharClass>}
 */
export const getPactMagicClasses = createSelector([getClasses], ClassGenerators.generatePactMagicClasses);
/**
 * @returns {Array<SpellSlotContract>}
 */
export const getPactMagicSlots = createSelector([getPactMagicClasses, characterSelectors.getPactMagicSlots, getRuleData], SpellDerivers.derivePactMagicSlotsInfo);
/**
 * @returns {Array<SpellSlotContract>}
 */
export const getSpellSlots = createSelector([getSpellcastingClasses, characterSelectors.getSpellSlots, getRuleData], SpellDerivers.deriveSpellSlotsInfo);
/**
 * @returns {Array<SpellSlotInfo>}
 */
export const getCombinedSpellSlots = createSelector([getSpellSlots, getPactMagicSlots, getRuleData], SpellDerivers.deriveCombinedSpellSlotsInfo);
/**
 * @returns {number}
 */
export const getMaxSpellSlotLevel = createSelector([getSpellSlots], SpellGenerators.generateMaxSpellSlotLevel);
/**
 * @returns {number}
 */
export const getMaxPactMagicSlotLevel = createSelector([getPactMagicSlots], SpellGenerators.generateMaxSpellSlotLevel);
/**
 * @returns {number}
 */
export const getCombinedMaxSpellSlotLevel = createSelector([getMaxSpellSlotLevel, getMaxPactMagicSlotLevel], SpellGenerators.generateCombinedMaxSpellSlotLevel);
/**
 * @returns {Array<number>}
 */
export const getAvailableSpellSlotLevels = createSelector([getSpellSlots], SpellGenerators.generateAvailableSpellSlotLevels);
/**
 * @returns {Array<number>}
 */
export const getAvailablePactMagicSlotLevels = createSelector([getPactMagicSlots], SpellGenerators.generateAvailableSpellSlotLevels);
/**
 * @returns {Array<number>}
 */
export const getCastableSpellSlotLevels = createSelector([getSpellSlots], SpellGenerators.generateCastableSpellSlotLevels);
/**
 * @returns {Array<number>}
 */
export const getCastablePactMagicSlotLevels = createSelector([getPactMagicSlots], SpellGenerators.generateCastableSpellSlotLevels);
/**
 * @return {Array<CharClass>}
 */
export const getSpellClasses = createSelector([getSpellcastingClasses, getPactMagicClasses], ClassGenerators.generateAggregatedSpellClasses);
/**
 * @returns {Array<ClassSpellInfo>}
 */
export const getClassSpellLists = createSelector([getTotalClassLevel, getSpellClasses, getAbilityLookup, getProficiencyBonus, getValidGlobalModifiers], SpellGenerators.generateClassSpellLists);
/**
 * @returns {Array<Spell>}
 */
export const getClassSpells = createSelector([getSpellClasses], SpellGenerators.generateClassSpells);
/**
 * @returns {Array<Spell>}
 */
export const getActiveClassSpells = createSelector([getClassSpells], SpellGenerators.generateActiveClassSpells);
/**
 * return all active spell attacks for getAttacks
 * @returns {Array<Spell>}
 */
export const getActiveSpellAttackList = createSelector([getClassSpellLists, getActiveCharacterSpells], SpellGenerators.generateActiveSpellAttackList);
/**
 * @returns {Array<WeaponSpellDamageGroup>}
 */
export const getWeaponSpellDamageGroups = createSelector([getActiveClassSpells, getActiveCharacterSpells, getExperienceInfo], SpellGenerators.generateWeaponSpellDamageGroups);
/**
 * returns all equipped, weapon behavior Gear Items - used in getItemAttacks
 * @returns {Array<Item>}
 */
export const getGearWeaponItems = createSelector([
    getAllBaseInventory,
    getAbilityLookup,
    getProficiencyBonus,
    getValidGlobalModifiers,
    characterSelectors.getCharacterValueLookupByEntity,
    characterSelectors.getCharacterValueLookupByType,
    characterSelectors.getCharacterValueLookup,
    getMartialArtsLevel,
    getRuleData,
    hack__getSpecialWeaponPropertiesEnabled,
    characterSelectors.getId,
], ItemGenerators.generateGearWeaponItems);
/**
 * returns all Gear and Weapon items with attacks or marked display as attack
 * @returns {Array<Item>}
 */
export const getItemAttacks = createSelector([getEquippedItems, getGearWeaponItems], ItemGenerators.generateOrderedItemAttacks);
/**
 * @returns {SpellCasterInfo}
 */
export const getSpellCasterInfo = createSelector([
    getClasses,
    getTotalClassLevel,
    getSpellSlots,
    getPactMagicSlots,
    getCastableSpellSlotLevels,
    getCastablePactMagicSlotLevels,
    getAvailableSpellSlotLevels,
    getAvailablePactMagicSlotLevels,
    getCombinedMaxSpellSlotLevel,
    getAbilityLookup,
    getClassSpellInfoLookup,
], CharacterGenerators.generateSpellCasterInfo);
/**
 * @returns {Array<Action>}
 */
export const getCustomActions = createSelector([
    characterSelectors.getCustomActions,
    getProficiencyBonus,
    getAbilityLookup,
    characterSelectors.getCharacterValueLookup,
    getValidGlobalModifiers,
    getMartialArtsLevel,
    getRuleData,
    getModifierData,
], ActionGenerators.generateCustomActions);
/**
 * @returns {Array<Activatable>}
 */
export const getActivatables = createSelector([
    getActiveCharacterSpells,
    getActiveClassSpells,
    getClasses,
    getRace,
    getBaseFeats,
    getInnateNaturalActions,
    getCustomActions,
    getEquippedItems,
], CharacterGenerators.generateActivatables);
/**
 * @returns {Array<Spell>}
 */
export const getRitualSpells = createSelector([getActiveCharacterSpells, getClassSpells], SpellGenerators.generateRitualSpells);
/**
 * @returns {Array<Array<ScaledSpell>>}
 */
export const getLevelSpells = createSelector([
    getExperienceInfo,
    getClassSpells,
    getActiveCharacterSpells,
    getProficiencyBonus,
    getSpellCasterInfo,
    getRuleData,
    getCharacterPreferences,
    getAbilityLookup,
], SpellGenerators.generateLevelSpells);
/**
 * https://github.com/reduxjs/reselect/issues/378
 */
const hack__getHitPointParts = createSelector([
    characterSelectors.getBaseHp,
    characterSelectors.getOverrideHp,
    characterSelectors.getBonusHp,
    characterSelectors.getTempHp,
    characterSelectors.getRemovedHp,
], CharacterHacks.hack__generateHitPointParts);
/**
 * @returns {CharacterHitPointInfo}
 */
export const getHitPointInfo = createSelector([
    hack__getHitPointParts,
    getTotalClassLevel,
    getClasses,
    getAbilityLookup,
    getRaceModifiers,
    getClassesModifiers,
    getMiscModifiers,
    getValidGlobalModifiers,
    characterSelectors.getPreferences,
    getRuleData,
], CharacterGenerators.generateHitPointInfo);
/**
 * @returns {Array<Modifier>}
 */
export const getLanguageModifiers = createSelector([getValidGlobalModifiers], ModifierGenerators.generateLanguageModifiers);
/**
 * @returns {Array<Modifier>}
 */
export const getKenseiModifiers = createSelector([getValidGlobalModifiers], ModifierGenerators.generateKenseiModifiers);
/**
 * @returns {Array<ProtectionSupplier>}
 */
export const getProtectionSuppliers = createSelector([
    getClasses,
    getRace,
    getFeats,
    getAllInventoryItems,
    getModifierData,
    getAbilityLookup,
    getRuleData,
    getProficiencyBonus,
    characterSelectors.getId,
], CharacterGenerators.generateProtectionSuppliers);
/**
 * @returns {CreatureOwnerData}
 */
export const getCreatureOwnerData = createSelector([getClasses, getSkillLookup, getProficiencyBonus, getAbilityLookup, getPassivePerception], CreatureGenerators.generateCreatureOwnerData);
/**
 * @returns {Array<Creature>}
 */
export const getCreatures = createSelector([
    characterSelectors.getCreatures,
    getCreatureOwnerData,
    characterSelectors.getCharacterValueLookup,
    getCreatureInfusionLookup,
    getRuleData,
], CreatureGenerators.generateCreatures);
/**
 * @returns {CreatureLookup}
 */
export const getCreatureLookup = createSelector([getCreatures], CreatureGenerators.generateCreatureLookup);
/**
 *
 */
export const getVehicleComponentLookup = createSelector([serviceDataSelectors.getVehicleComponentMappings], VehicleComponentGenerators.generateVehicleComponentLookup);
/**
 *
 */
export const getVehicles = createSelector([
    serviceDataSelectors.getVehicleMappings,
    getVehicleComponentLookup,
    serviceDataSelectors.getDefinitionPool,
    getRuleData,
], VehicleGenerators.generateVehicles);
/**
 *
 */
export const getVehicleLookup = createSelector([getVehicles], VehicleGenerators.generateVehicleLookup);
/**
 * @returns {ChoiceData}
 */
export const getChoiceInfo = createSelector([
    getProficiencyModifiers,
    getExpertiseModifiers,
    getLanguageModifiers,
    getKenseiModifiers,
    getAbilityLookup,
    getClassSpellLists,
], ChoiceGenerators.generateChoiceData);
/**
 * @returns {Array<DamageAdjustmentContract>}
 */
export const getResistanceData = createSelector([getRuleData], CharacterGenerators.generateResistanceData);
/**
 * @returns {Array<DamageAdjustmentContract>}
 */
export const getVulnerabilityData = createSelector([getRuleData], CharacterGenerators.generateVulnerabilityData);
/**
 * @returns {Array<DamageAdjustmentContract>}
 */
export const getDamageImmunityData = createSelector([getRuleData], CharacterGenerators.generateImmunityData);
/**
 * @returns {Array<ConditionContract>}
 */
export const getConditionImmunityData = createSelector([getRuleData], RuleDataAccessors.getConditions);
/**
 * @returns {DeathCauseEnum}
 */
export const getDeathCause = createSelector([characterSelectors.getDeathSaves, getValidGlobalModifiers, getRuleData], CharacterGenerators.generateDeathCause);
/**
 * @returns {boolean}
 */
export const isDead = createSelector([getDeathCause], CharacterGenerators.generateIsDead);
/**
 * @returns {Array<Modifier>}
 */
export const getValidResistanceModifiers = createSelector([getValidGlobalModifiers], ModifierGenerators.generateResistanceModifiers);
/**
 * @returns {Array<Modifier>}
 */
export const getValidImmunityModifiers = createSelector([getValidGlobalModifiers], ModifierGenerators.generateImmunityModifiers);
/**
 * @returns {Array<Modifier>}
 */
export const getValidVulnerabilityModifiers = createSelector([getValidGlobalModifiers], ModifierGenerators.generateVulnerabilityModifiers);
/**
 * @returns {Array<Modifier>}
 */
export const getBonusSavingThrowModifiers = createSelector([getValidGlobalModifiers, getModifierData, getRuleData], ModifierGenerators.generateBonusSavingThrowModifiers);
/**
 * @returns {Array<Modifier>}
 */
export const getRestrictedBonusSavingThrowModifiers = createSelector([getBonusSavingThrowModifiers], ModifierGenerators.generateRestrictedBonusSavingThrowModifiers);
/**
 * @returns {Array<Modifier>}
 */
export const getAdvantageSavingThrowModifiers = createSelector([getValidGlobalModifiers, getRuleData], ModifierGenerators.generateAdvantageSavingThrowModifiers);
/**
 * @returns {Array<Modifier>}
 */
export const getDisadvantageSavingThrowModifiers = createSelector([getValidGlobalModifiers, getEquippedItems, getRuleData], ModifierGenerators.generateDisadvantageSavingThrowModifiers);
/**
 * @returns {Array<SituationalSavingThrowInfo>}
 */
export const getSituationalBonusSavingThrows = createSelector([getHighestAcEquippedShield, getValidGlobalModifiers, getRuleData], CharacterGenerators.generateSituationalBonusSavingThrows);
/**
 * @returns {Record<number, Array<SituationalSavingThrowInfo>>}
 */
export const getSituationalBonusSavingThrowsLookup = createSelector([getSituationalBonusSavingThrows], CharacterGenerators.generateSituationalBonusSavingThrowsLookup);
/**
 * @returns {Array<DiceAdjustment>}
 */
export const getSavingThrowDiceAdjustments = createSelector([getBonusSavingThrowModifiers, getAdvantageSavingThrowModifiers, getDisadvantageSavingThrowModifiers], DiceGenerators.generateSavingThrowDiceAdjustments);
/**
 * @returns {Array<CustomDamageAdjustment>}
 */
export const getCustomDamageAdjustments = createSelector([characterSelectors.getCustomDefenseAdjustments, getRuleData], CharacterGenerators.generateCustomDamageAdjustments);
/**
 * @returns {Array<CustomConditionAdjustment>}
 */
export const getCustomConditionAdjustments = createSelector([characterSelectors.getCustomDefenseAdjustments, getRuleData], CharacterGenerators.generateCustomConditionAdjustments);
/**
 * @returns {Array<CustomDamageAdjustment>}
 */
export const getCustomResistanceDamageAdjustments = createSelector([getCustomDamageAdjustments], CharacterGenerators.generateCustomResistanceDamageAdjustments);
/**
 * @returns {Array<CustomDamageAdjustment>}
 */
export const getCustomImmunityDamageAdjustments = createSelector([getCustomDamageAdjustments], CharacterGenerators.generateCustomImmunityDamageAdjustments);
/**
 * @returns {Array<CustomDamageAdjustment>}
 */
export const getCustomVulnerabilityDamageAdjustments = createSelector([getCustomDamageAdjustments], CharacterGenerators.generateCustomVulnerabilityDamageAdjustments);
/**
 * @returns {Array<DefenseAdjustment>}
 */
export const getActiveResistances = createSelector([getCustomResistanceDamageAdjustments, getValidResistanceModifiers, getRuleData], CharacterGenerators.generateActiveResistances);
/**
 * @returns {Array<DefenseAdjustment>}
 */
export const getActiveImmunities = createSelector([getCustomImmunityDamageAdjustments, getCustomConditionAdjustments, getValidImmunityModifiers, getRuleData], CharacterGenerators.generateActiveImmunities);
/**
 * @returns {Array<DefenseAdjustment>}
 */
export const getActiveVulnerabilities = createSelector([getCustomVulnerabilityDamageAdjustments, getValidVulnerabilityModifiers, getRuleData], CharacterGenerators.generateActiveVulnerabilities);
/**
 * @returns {Array<DefenseAdjustmentGroup>}
 */
export const getActiveGroupedResistances = createSelector([getActiveResistances], CharacterUtils.groupDefenseAdjustments);
/**
 * @returns {Array<DefenseAdjustmentGroup>}
 */
export const getActiveGroupedImmunities = createSelector([getActiveImmunities], CharacterUtils.groupDefenseAdjustments);
/**
 * @returns {Array<DefenseAdjustmentGroup>}
 */
export const getActiveGroupedVulnerabilities = createSelector([getActiveVulnerabilities], CharacterUtils.groupDefenseAdjustments);
/**
 * @returns {boolean}
 */
export const hasSpells = createSelector([getClassSpellLists, getActiveCharacterSpells], CharacterGenerators.generateHasSpells);
/**
 * @returns {Array<Attack>}
 */
export const getAttacks = createSelector([getActions, getItemAttacks, getActiveSpellAttackList, getCustomActions], CharacterGenerators.generateAttacks);
/**
 * @returns {SenseInfo}
 */
export const getSenseInfo = createSelector([getValidGlobalModifiers, getAbilityLookup, characterSelectors.getCustomSenseLookup], CharacterGenerators.generateSenseInfo);
/**
 * @returns {AttacksPerActionInfo}
 */
export const getAttacksPerActionInfo = createSelector([getValidGlobalModifiers], CharacterGenerators.generateAttacksPerActionInfo);
/**
 * @returns {Array<ProficiencyGroup>}
 */
export const getProficiencyGroups = createSelector([
    characterSelectors.getCustomProficiencies,
    characterSelectors.getCharacterValueLookupByType,
    getValidGlobalModifiers,
    getRuleData,
], CharacterGenerators.generateProficiencyGroups);
/**
 * @returns {SnippetData}
 */
export const getSnippetData = createSelector([getProficiencyBonus, getAbilityKeyLookup, getAbilityLookup, getExperienceInfo, getHitPointInfo, getRuleData], SnippetGenerators.generateSnippetData);
/**
 * @returns {boolean}
 */
export const isCharacterSheetReady = createSelector([characterSelectors.getRace, characterSelectors.getClasses, characterSelectors.getStats, getCharacterConfiguration], CharacterGenerators.generateIsCharacterSheetReady);
/**
 *  @returns {SocialImageData}
 */
export const getSocialImageData = createSelector([getAbilities, getAcTotal, getHitPointInfo, getProcessedInitiative], CoreGenerators.generateSocialImageData);
/**
 *  @returns {DataOriginRefDataTypedData<Background, null>}
 */
export const getDataOriginRefBackgroundData = createSelector([getBackgroundInfo], BackgroundGenerators.generateRefBackgroundData);
/**
 *  @returns {DataOriginRefDataTypedData<CharClass, null>}
 */
export const getDataOriginRefClassData = createSelector([getClasses], ClassGenerators.generateRefClassData);
/**
 *  @returns {DataOriginRefDataTypedData<ClassFeature, CharClass>}
 */
export const getDataOriginRefClassFeatureData = createSelector([getClasses], ClassFeatureGenerators.generateRefClassFeatureData);
/**
 *  @returns {DataOriginRefDataTypedData<Condition, null>}
 */
export const getDataOriginRefConditionData = createSelector([getActiveConditions], ConditionGenerators.generateRefConditionData);
/**
 *  @returns {DataOriginRefDataTypedData<Feat, null>}
 */
export const getDataOriginRefFeatData = createSelector([getFeats], FeatGenerators.generateRefFeatData);
/**
 *  @returns {DataOriginRefDataTypedData<Item, null>}
 */
export const getDataOriginRefItemData = createSelector([getInventory], ItemGenerators.generateRefItemData);
/**
 *  @returns {DataOriginRefDataTypedData<RacialTrait, Race>}
 */
export const getDataOriginRefRaceData = createSelector([getRace], RaceGenerators.generateRefRaceData);
/**
 *  @returns {DataOriginRefDataTypedData<Vehicle, null>}
 */
export const getDataOriginRefVehicleData = createSelector([getVehicles], VehicleGenerators.generateRefVehicleData);
function refDataFeatListGenerator() {
    // Dummy generator. No extra data is needed for Feat Lists
    return {};
}
export const getDataOriginRefFeatListData = createSelector([], refDataFeatListGenerator);
/**
 *  @returns {DataOriginRefData}
 */
export const getDataOriginRefData = createSelector([
    getDataOriginRefBackgroundData,
    getDataOriginRefClassData,
    getDataOriginRefClassFeatureData,
    getDataOriginRefConditionData,
    getDataOriginRefFeatData,
    getDataOriginRefItemData,
    getDataOriginRefRaceData,
    getDataOriginRefVehicleData,
    getDataOriginRefFeatListData,
], DataOriginGenerators.generateDataOriginRefData);
/**
 * @returns {Array<Extra>}
 */
export const getExtras = createSelector([getCreatures, getVehicles, getRuleData], ExtraGenerators.generateExtras);
/**
 * @returns {Hack__PdfDataBucket1AndBucket2Parts}
 */
const hack__getPdfDataBucket1AndBucket2Parts = createSelector([getRuleData, getAbilityLookup, getProficiencyBonus], PdfHacks.hack__generatePdfDataBucket1AndBucket2Parts);
/**
 * @returns {PdfDataBucket1}
 */
export const getPdfDataBucket1 = createSelector([
    getSkills,
    getCustomSkills,
    getSpellSlots,
    getPactMagicSlots,
    getCreatures,
    getAttacks,
    getWeaponSpellDamageGroups,
    getClassSpells,
    getActiveCharacterSpells,
    getCurrentLevel,
    hack__getPdfDataBucket1AndBucket2Parts,
], PdfGenerators.generatePdfDataBucket1);
/**
 * @returns {PdfDataBucket2}
 */
export const getPdfDataBucket2 = createSelector([
    getActivatables,
    getClasses,
    getRace,
    getFeats,
    getBonusSavingThrowModifiers,
    getAdvantageSavingThrowModifiers,
    getDisadvantageSavingThrowModifiers,
    getInventory,
    getCustomItems,
    getSnippetData,
    hack__getPdfDataBucket1AndBucket2Parts,
], PdfGenerators.generatePdfDataBucket2);
/**
 * @returns {PdfDataBucket3}
 */
export const getPdfDataBucket3 = createSelector([
    getActiveGroupedResistances,
    getActiveGroupedImmunities,
    getActiveGroupedVulnerabilities,
    getHitPointInfo,
    getClassSpellLists,
    getClassSpellInfoLookup,
    getBackgroundInfo,
    getProficiencyGroups,
    getUniqueProficiencyModifiers,
    getPassivePerception,
    getPassiveInsight,
    getPassiveInvestigation,
], PdfGenerators.generatePdfDataBucket3);
/**
 * @returns {PdfDataBucket4}
 */
export const getPdfDataBucket4 = createSelector([
    getAbilities,
    characterSelectors.getCurrentXp,
    getCarryCapacity,
    getEncumberedWeight,
    getPushDragLiftWeight,
    getTotalWeight,
    getAcTotal,
    getProcessedInitiative,
    getSpeeds,
    getSenseInfo,
    getRuleData,
    getCharacterPreferences,
], PdfGenerators.generatePdfDataBucket4);
/**
 * @returns {PdfDataBucket5}
 */
export const getPdfDataBucket5 = createSelector([
    characterSelectors.getAge,
    characterSelectors.getHeight,
    characterSelectors.getWeight,
    characterSelectors.getEyes,
    characterSelectors.getSkin,
    characterSelectors.getHair,
    getSize,
    characterSelectors.getFaith,
    characterSelectors.getGender,
    getAlignment,
], PdfGenerators.generatePdfDataBucket5);
/**
 * @returns {PdfDataBucket6}
 */
export const getPdfDataBucket6 = createSelector([
    characterSelectors.getCurrencies,
    getLanguages,
    characterSelectors.getName,
    getCharacterNotes,
    getProficiencyBonus,
    getCharacterTraits,
], PdfGenerators.generatePdfDataBucket6);
/**
 *  @returns {PdfData}
 */
export const getPdfExportData = createSelector([getPdfDataBucket1, getPdfDataBucket2, getPdfDataBucket3, getPdfDataBucket4, getPdfDataBucket5, getPdfDataBucket6], PdfGenerators.generatePdfData);
