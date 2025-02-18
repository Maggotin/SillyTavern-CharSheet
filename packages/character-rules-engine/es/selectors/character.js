import { createSelector } from 'reselect';
import { CharacterGenerators } from '../engine/Character';
import { ValueGenerators } from '../engine/Value';
import { initialChoiceComponentState, } from '../generated';
import { SelectorHelpers } from '../utils';
export const getActions = (state) => state.character.actions;
export const getActiveSourceCategories = (state) => SelectorHelpers.getArrayOrNullFallback(state.character.activeSourceCategories);
export const getAdjustmentXp = (state) => state.character.adjustmentXp;
export const getAge = (state) => state.character.age;
export const getAlignmentId = (state) => state.character.alignmentId;
export const getBackground = (state) => state.character.background;
export const getBaseHp = (state) => state.character.baseHitPoints;
export const getBonusHp = (state) => state.character.bonusHitPoints;
export const getBonusStats = (state) => SelectorHelpers.getArrayOrNullFallback(state.character.bonusStats);
export const getCampaign = (state) => state.character.campaign;
export const getCampaignSetting = (state) => state.character.campaignSetting;
export const getCanEdit = (state) => state.character.canEdit;
export const getIsAssignedToPlayer = (state) => state.character.isAssignedToPlayer;
export const getCharacterValues = (state) => SelectorHelpers.getArrayOrNullFallback(state.character.characterValues);
export const getChoices = (state) => state.character.choices || initialChoiceComponentState;
export const getClassSpells = (state) => SelectorHelpers.getArrayOrNullFallback(state.character.classSpells);
export const getClasses = (state) => SelectorHelpers.getArrayOrNullFallback(state.character.classes);
export const getConditions = (state) => SelectorHelpers.getArrayOrNullFallback(state.character.conditions);
export const getConfiguration = (state) => state.character.configuration;
export const getCreatures = (state) => SelectorHelpers.getArrayOrNullFallback(state.character.creatures);
export const getCurrencies = (state) => state.character.currencies;
export const getCurrentXp = (state) => state.character.currentXp;
export const getCustomActions = (state) => SelectorHelpers.getArrayOrNullFallback(state.character.customActions);
export const getCustomDefenseAdjustments = (state) => SelectorHelpers.getArrayOrNullFallback(state.character.customDefenseAdjustments);
export const getCustomItems = (state) => SelectorHelpers.getArrayOrNullFallback(state.character.customItems);
export const getCustomProficiencies = (state) => SelectorHelpers.getArrayOrNullFallback(state.character.customProficiencies);
export const getCustomSenses = (state) => SelectorHelpers.getArrayOrNullFallback(state.character.customSenses);
export const getCustomSpeeds = (state) => SelectorHelpers.getArrayOrNullFallback(state.character.customSpeeds);
export const getDeathSaves = (state) => state.character.deathSaves;
export const getDecorations = (state) => state.character.decorations;
export const getEyes = (state) => state.character.eyes;
export const getFaith = (state) => state.character.faith;
export const getFeats = (state) => SelectorHelpers.getArrayOrNullFallback(state.character.feats);
export const getGender = (state) => state.character.gender;
export const getHair = (state) => state.character.hair;
export const getHeight = (state) => state.character.height;
export const getId = (state) => state.character.id;
export const getInspiration = (state) => state.character.inspiration;
export const getInventory = (state) => SelectorHelpers.getArrayOrNullFallback(state.character.inventory);
export const getLifestyleId = (state) => state.character.lifestyleId;
export const getModifiers = (state) => state.character.modifiers;
export const getName = (state) => state.character.name;
export const getNotes = (state) => state.character.notes;
export const getOptionalClassFeatures = (state) => SelectorHelpers.getArrayOrNullFallback(state.character.optionalClassFeatures);
export const getOptionalOrigins = (state) => SelectorHelpers.getArrayOrNullFallback(state.character.optionalOrigins);
export const getOptions = (state) => state.character.options;
export const getOverrideHp = (state) => state.character.overrideHitPoints;
export const getOverrideStats = (state) => SelectorHelpers.getArrayOrNullFallback(state.character.overrideStats);
export const getPactMagicSlots = (state) => SelectorHelpers.getArrayOrNullFallback(state.character.pactMagic);
export const getPreferences = (state) => state.character.preferences;
export const getRace = (state) => state.character.race;
export const getReadOnlyUrl = (state) => state.character.readonlyUrl;
export const getRemovedHp = (state) => state.character.removedHitPoints;
export const getSkin = (state) => state.character.skin;
export const getSpellSlots = (state) => SelectorHelpers.getArrayOrNullFallback(state.character.spellSlots);
export const getSpells = (state) => state.character.spells;
export const getStats = (state) => SelectorHelpers.getArrayOrNullFallback(state.character.stats);
export const getTempHp = (state) => state.character.temporaryHitPoints;
export const getTraits = (state) => state.character.traits;
export const getUserId = (state) => state.character.userId;
export const getUsername = (state) => state.character.username;
export const getWeight = (state) => state.character.weight;
export const getDeathSavesFailCount = (state) => state.character.deathSaves === null ? null : state.character.deathSaves.failCount;
export const getDeathSavesSuccessCount = (state) => state.character.deathSaves === null ? null : state.character.deathSaves.successCount;
export const getActions_class = (state) => state.character.actions === null ? [] : SelectorHelpers.getArrayOrNullFallback(state.character.actions.class);
export const getActions_feat = (state) => state.character.actions === null ? [] : SelectorHelpers.getArrayOrNullFallback(state.character.actions.feat);
export const getActions_race = (state) => state.character.actions === null ? [] : SelectorHelpers.getArrayOrNullFallback(state.character.actions.race);
export const getChoices_background = (state) => state.character.choices === null ? [] : SelectorHelpers.getArrayOrNullFallback(state.character.choices.background);
export const getChoices_class = (state) => state.character.choices === null ? [] : SelectorHelpers.getArrayOrNullFallback(state.character.choices.class);
export const getChoices_feat = (state) => state.character.choices === null ? [] : SelectorHelpers.getArrayOrNullFallback(state.character.choices.feat);
export const getChoices_race = (state) => state.character.choices === null ? [] : SelectorHelpers.getArrayOrNullFallback(state.character.choices.race);
/**
 * @name getChoices_choiceDefinitions()
 * @param state
 * @returns {Array<BuilderChoiceDefinitions>}
 * Returns empty array if Character choices is null
 * or choices definitions if choices property is populated.
 */
export const getChoices_choiceDefinitions = (state) => state.character.choices === null
    ? []
    : SelectorHelpers.getArrayOrNullFallback(state.character.choices.choiceDefinitions);
export const getModifiers_background = (state) => state.character.modifiers === null
    ? []
    : SelectorHelpers.getArrayOrNullFallback(state.character.modifiers.background);
export const getModifiers_class = (state) => state.character.modifiers === null ? [] : SelectorHelpers.getArrayOrNullFallback(state.character.modifiers.class);
export const getModifiers_condition = (state) => state.character.modifiers === null
    ? []
    : SelectorHelpers.getArrayOrNullFallback(state.character.modifiers.condition);
export const getModifiers_feat = (state) => state.character.modifiers === null ? [] : SelectorHelpers.getArrayOrNullFallback(state.character.modifiers.feat);
export const getModifiers_item = (state) => state.character.modifiers === null ? [] : SelectorHelpers.getArrayOrNullFallback(state.character.modifiers.item);
export const getModifiers_race = (state) => state.character.modifiers === null ? [] : SelectorHelpers.getArrayOrNullFallback(state.character.modifiers.race);
export const getOptions_class = (state) => state.character.options === null ? [] : SelectorHelpers.getArrayOrNullFallback(state.character.options.class);
export const getOptions_feat = (state) => state.character.options === null ? [] : SelectorHelpers.getArrayOrNullFallback(state.character.options.feat);
export const getOptions_race = (state) => state.character.options === null ? [] : SelectorHelpers.getArrayOrNullFallback(state.character.options.race);
export const getSpells_class = (state) => state.character.spells === null ? [] : SelectorHelpers.getArrayOrNullFallback(state.character.spells.class);
export const getSpells_feat = (state) => state.character.spells === null ? [] : SelectorHelpers.getArrayOrNullFallback(state.character.spells.feat);
export const getSpells_item = (state) => state.character.spells === null ? [] : SelectorHelpers.getArrayOrNullFallback(state.character.spells.item);
export const getSpells_race = (state) => state.character.spells === null ? [] : SelectorHelpers.getArrayOrNullFallback(state.character.spells.race);
/**
 * @returns {CustomSpeedLookup}
 */
export const getCustomSpeedLookup = createSelector([getCustomSpeeds], CharacterGenerators.generateCustomSpeedLookup);
/**
 * @returns {CustomSenseLookup}
 */
export const getCustomSenseLookup = createSelector([getCustomSenses], CharacterGenerators.generateCustomSenseLookup);
/**
 * @returns {ValueLookup}
 */
export const getCharacterValueLookup = createSelector([getCharacterValues], ValueGenerators.generateCharacterValueLookup);
/**
 * @returns {EntityValueLookup}
 */
export const getCharacterValueLookupByEntity = createSelector([getCharacterValues], ValueGenerators.generateCharacterEntityValueLookup);
/**
 * @returns {TypeValueLookup}
 */
export const getCharacterValueLookupByType = createSelector([getCharacterValues], ValueGenerators.generateCharacterTypeValueLookup);
export const getPremadeInfo = (state) => state.character.premadeInfo;
export const getStatus = (state) => state.character.status;
export const getStatusSlug = (state) => state.character.statusSlug;
