import { CreatureRuleGenerators } from '../CreatureRule';
import { DataOriginDataInfoKeyEnum, DataOriginGenerators, DataOriginTypeEnum, } from '../DataOrigin';
import { OptionAccessors } from '../Option';
import { RacialTraitAccessors, RacialTraitGenerators } from '../RacialTrait';
import { RuleDataUtils } from '../RuleData';
import { getRacialTraits, getSpellListIds, getVisibleRacialTraits } from './accessors';
import { deriveCalledOutRacialTraits, deriveConsolidatedRacialTraits, deriveOrderedRacialTraits, deriveRaceSize, deriveSpellListIds, deriveVisibleRacialTraits, } from './derivers';
import { hack__filterOutAsi } from './hacks';
/**
 *
 * @param optionLookup
 * @param actionLookup
 * @param choiceLookup
 * @param modifierLookup
 * @param spellLookup
 * @param featLookup
 * @param valueLookup
 * @param spellListDataOriginLookup
 */
export function generateRaceLookupData(optionLookup, actionLookup, choiceLookup, modifierLookup, spellLookup, featLookup, valueLookup, spellListDataOriginLookup) {
    return {
        actionLookup,
        choiceLookup,
        featLookup,
        modifierLookup,
        optionLookup,
        spellListDataOriginLookup,
        spellLookup,
        valueLookup,
    };
}
/**
 *
 * @param race
 * @param optionalOrigins
 * @param raceLookupData
 * @param experienceInfo
 * @param appContext
 * @param ruleData
 * @param definitionPool
 * @param characterPreferences
 */
export function generateRace(race, optionalOrigins, raceLookupData, experienceInfo, appContext, ruleData, definitionPool, characterPreferences, isInitialAsiFromFeat) {
    if (!race) {
        return race;
    }
    const raceModifiers = [];
    const raceSpells = [];
    const raceFeats = [];
    const raceActions = [];
    // Process racial traits:
    // Consolidate from multiple sources, apply filtering, apply ordering,
    // then generate the hydrated RacialTrait from the contracts.
    const traitContracts = deriveOrderedRacialTraits(hack__filterOutAsi(deriveConsolidatedRacialTraits(race, optionalOrigins, characterPreferences.enableOptionalOrigins), isInitialAsiFromFeat));
    const generatedRacialTraits = traitContracts.map((racialTrait) => {
        const generatedRacialTrait = RacialTraitGenerators.generateRacialTrait(race, racialTrait, raceLookupData.optionLookup, raceLookupData.actionLookup, raceLookupData.choiceLookup, raceLookupData.modifierLookup, raceLookupData.spellLookup, raceLookupData.featLookup, raceLookupData.valueLookup, raceLookupData.spellListDataOriginLookup, ruleData, definitionPool);
        raceModifiers.push(...RacialTraitAccessors.getModifiers(generatedRacialTrait));
        raceSpells.push(...RacialTraitAccessors.getSpells(generatedRacialTrait));
        raceFeats.push(...RacialTraitAccessors.getFeats(generatedRacialTrait));
        raceActions.push(...RacialTraitAccessors.getActions(generatedRacialTrait));
        RacialTraitAccessors.getOptions(generatedRacialTrait).forEach((option) => {
            raceSpells.push(...OptionAccessors.getSpells(option));
            raceFeats.push(...OptionAccessors.getFeats(option));
            raceActions.push(...OptionAccessors.getActions(option));
            raceModifiers.push(...OptionAccessors.getModifiers(option));
        });
        return generatedRacialTrait;
    });
    const visibleRacialTraits = deriveVisibleRacialTraits(generatedRacialTraits, appContext);
    const [sizeId, size] = deriveRaceSize(race, experienceInfo, raceModifiers);
    const sizeInfo = RuleDataUtils.getCreatureSizeInfo(sizeId, ruleData);
    return Object.assign(Object.assign({}, race), { modifiers: raceModifiers, racialTraits: generatedRacialTraits, optionalOrigins,
        visibleRacialTraits, calledOutRacialTraits: deriveCalledOutRacialTraits(generatedRacialTraits, ruleData), spells: raceSpells, feats: raceFeats, actions: raceActions, sizeInfo,
        sizeId,
        size, spellListIds: deriveSpellListIds(generatedRacialTraits) });
}
/**
 *
 * @param race
 * @param xpInfo
 * @param ruleData
 */
export function generateRaceCreatureRules(race, xpInfo, ruleData) {
    const rules = [];
    if (!race) {
        return rules;
    }
    getRacialTraits(race).forEach((racialTrait) => {
        const dataOrigin = DataOriginGenerators.generateDataOrigin(DataOriginTypeEnum.RACE, racialTrait, race);
        const featureRules = RacialTraitAccessors.getCreatureRules(racialTrait);
        featureRules.forEach((rule) => {
            rules.push(CreatureRuleGenerators.generateRule(rule, dataOrigin, xpInfo, ruleData));
        });
        const options = RacialTraitAccessors.getOptions(racialTrait);
        options.forEach((option) => {
            const optionRules = OptionAccessors.getCreatureRules(option);
            optionRules.forEach((rule) => {
                rules.push(CreatureRuleGenerators.generateRule(rule, dataOrigin, xpInfo, ruleData));
            });
        });
    });
    return rules;
}
/**
 *
 * @param race
 */
export function generateRaceModifiers(race) {
    const modifiers = [];
    if (race === null) {
        return modifiers;
    }
    getRacialTraits(race).forEach((racialTrait) => {
        modifiers.push(...RacialTraitAccessors.getModifiers(racialTrait));
        RacialTraitAccessors.getOptions(racialTrait).forEach((option) => {
            modifiers.push(...OptionAccessors.getModifiers(option));
        });
    });
    return modifiers;
}
/**
 *
 * @param race
 */
export function generateRefRaceData(race) {
    let data = {};
    if (race !== null) {
        getRacialTraits(race).forEach((racialTrait) => {
            data[RacialTraitAccessors.getUniqueKey(racialTrait)] = {
                [DataOriginDataInfoKeyEnum.PRIMARY]: racialTrait,
                [DataOriginDataInfoKeyEnum.PARENT]: race,
            };
        });
    }
    return data;
}
/**
 *
 * @param race
 */
export function generateGlobalSpellListIds(race) {
    return race ? getSpellListIds(race) : [];
}
export function generateCurrentLevelRacialTraits(race, characterLevel) {
    const traits = race ? getVisibleRacialTraits(race) : [];
    return traits.filter((trait) => {
        const requiredLevel = RacialTraitAccessors.getRequiredLevel(trait);
        return characterLevel >= requiredLevel;
    });
}
