import { useSelector } from "react-redux";

import {
  RuleDataUtils as ruleDataUtils,
  ruleDataSelectors as s,
} from "@dndbeyond/character-rules-engine";

/**
 * A hook that provides access to the rule data state without having to
 * import rules engine all over the place in your components. This reduces
 * touchpoints to the rules engine and makes it easier to refactor the rules
 * engine in the future.
 */
export const useRuleData = () => ({
  // Export all data coming from the RuleData selectors
  allData: useSelector(s.getAllData),
  abilityScoreDisplayTypes: useSelector(s.getAbilityScoreDisplayTypes),
  abilitySkills: useSelector(s.getAbilitySkills),
  activationTypes: useSelector(s.getActivationTypes),
  additionalLevelTypes: useSelector(s.getAdditionalLevelTypes),
  adjustmentDataTypes: useSelector(s.getAdjustmentDataTypes),
  adjustmentTypes: useSelector(s.getAdjustmentTypes),
  alignments: useSelector(s.getAlignments),
  aoeTypes: useSelector(s.getAoeTypes),
  armor: useSelector(s.getArmor),
  basicActions: useSelector(s.getBasicActions),
  baseWeaponReach: useSelector(s.getBaseWeaponReach),
  basicMaxStatScore: useSelector(s.getBasicMaxStatScore),
  challengeRatings: useSelector(s.getChallengeRatings),
  conditionTypes: useSelector(s.getConditionTypes),
  conditions: useSelector(s.getConditions),
  creatureGroupCategories: useSelector(s.getCreatureGroupCategories),
  creatureGroupFlags: useSelector(s.getCreatureGroupFlags),
  creatureGroups: useSelector(s.getCreatureGroups),
  creatureSizes: useSelector(s.getCreatureSizes),
  currencyData: useSelector(s.getCurrencyData),
  damageAdjustments: useSelector(s.getDamageAdjustments),
  damageTypes: useSelector(s.getDamageTypes),
  defaultArmorImageUrl: useSelector(s.getDefaultArmorImageUrl),
  defaultAttunedItemCountMax: useSelector(s.getDefaultAttunedItemCountMax),
  defaultGearImageUrl: useSelector(s.getDefaultGearImageUrl),
  defaultRacePortraitUrl: useSelector(s.getDefaultRacePortraitUrl),
  defaultWeaponImageUrl: useSelector(s.getDefaultWeaponImageUrl),
  diceValues: useSelector(s.getDiceValues),
  environments: useSelector(s.getEnvironments),
  initiativeScore: useSelector(s.getInitiativeScore),
  languageTypeId: useSelector(s.getLanguageTypeId),
  languages: useSelector(s.getLanguages),
  levelExperiencePoints: useSelector(s.getLevelExperiencePoints),
  levelProficiencyBonuses: useSelector(s.getLevelProficiencyBonuses),
  lifestyles: useSelector(s.getLifestyles),
  limitedUseResetTypes: useSelector(s.getLimitedUseResetTypes),
  longRestMinHitDiceUsedRecovered: useSelector(
    s.getLongRestMinimumHitDiceUsedRecovered
  ),
  maxAttunedItemCountMax: useSelector(s.getMaxAttunedItemCountMax),
  maxCharacterLevel: useSelector(s.getMaxCharacterLevel),
  maxDeathsavesFail: useSelector(s.getMaxDeathsavesFail),
  maxDeathsavesSuccess: useSelector(s.getMaxDeathsavesSuccess),
  maxSpellLevel: useSelector(s.getMaxSpellLevel),
  maxStatScore: useSelector(s.getMaxStatScore),
  minAttunedItemCountMax: useSelector(s.getMinAttunedItemCountMax),
  minStatScore: useSelector(s.getMinStatScore),
  minimumHpTotal: useSelector(s.getMinimumHpTotal),
  minimumLimitedUseMaxUse: useSelector(s.getMinimumLimitedUseMaxUse),
  monsterSubTypes: useSelector(s.getMonsterSubTypes),
  monsterTypes: useSelector(s.getMonsterTypes),
  movements: useSelector(s.getMovements),
  multiClassSpellSlots: useSelector(s.getMultiClassSpellSlots),
  naturalActions: useSelector(s.getNaturalActions),
  noArmorAcAmount: useSelector(s.getNoArmorAcAmount),
  pactMagicMultiClassSpellSlots: useSelector(
    s.getPactMagicMultiClassSpellSlots
  ),
  privacyTypes: useSelector(s.getPrivacyTypes),
  proficiencyGroups: useSelector(s.getProficiencyGroups),
  raceGroups: useSelector(s.getRaceGroups),
  rangeTypes: useSelector(s.getRangeTypes),
  ritualCastingTimeMinuteAddition: useSelector(
    s.getRitualCastingTimeMinuteAddition
  ),
  rules: useSelector(s.getRules),
  senses: useSelector(s.getSenses),
  sharingTypes: useSelector(s.getSharingTypes),
  sourceCategories: useSelector(s.getSourceCategories),
  sources: useSelector(s.getSources),
  spellComponents: useSelector(s.getSpellComponents),
  spellConditionTypes: useSelector(s.getSpellConditionTypes),
  spellRangeTypes: useSelector(s.getSpellRangeTypes),
  statModifiers: useSelector(s.getStatModifiers),
  stats: useSelector(s.getStats),
  stealthCheckTypes: useSelector(s.getStealthCheckTypes),
  stringMartialArts: useSelector(s.getStringMartialArts),
  stringPactMagic: useSelector(s.getStringPactMagic),
  stringSpellCasting: useSelector(s.getStringSpellCasting),
  stringSpellEldritchBlast: useSelector(s.getStringSpellEldritchBlast),
  weapons: useSelector(s.getWeapons),
  weaponCategories: useSelector(s.getWeaponCategories),
  weaponProperties: useSelector(s.getWeaponProperties),
  weaponPropertyReachDistance: useSelector(s.getWeaponPropertyReachDistance),

  // Export all utils from RuleDataUtils
  ruleDataUtils,
});
