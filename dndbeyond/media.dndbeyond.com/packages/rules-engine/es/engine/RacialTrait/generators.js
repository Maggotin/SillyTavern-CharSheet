import { ActionGenerators } from '../Action';
import { ChoiceGenerators } from '../Choice';
import { DataOriginTypeEnum } from '../DataOrigin';
import { DefinitionPoolUtils } from '../DefinitionPool';
import { FeatGenerators } from '../Feat';
import { ModifierGenerators } from '../Modifier';
import { OptionGenerators } from '../Option';
import { SpellGenerators } from '../Spell';
import { getDefinitionKey, getEntityTypeId, getId } from './accessors';
/**
 *
 * @param race
 * @param racialTrait
 * @param optionLookup
 * @param actionLookup
 * @param choiceLookup
 * @param modifierLookup
 * @param spellLookup
 * @param featLookup
 * @param valueLookup
 * @param spellListDataOriginLookup
 * @param ruleData
 * @param definitionPool
 */
export function generateRacialTrait(race, racialTrait, optionLookup, actionLookup, choiceLookup, modifierLookup, spellLookup, featLookup, valueLookup, spellListDataOriginLookup, ruleData, definitionPool) {
    const id = getId(racialTrait);
    const entityTypeId = getEntityTypeId(racialTrait);
    const actions = ActionGenerators.generateBaseActions(id, entityTypeId, actionLookup, valueLookup, DataOriginTypeEnum.RACE, racialTrait, race);
    const choices = ChoiceGenerators.generateBaseChoices(id, entityTypeId, choiceLookup, DataOriginTypeEnum.RACE, racialTrait, race);
    const spells = SpellGenerators.generateBaseSpells(id, entityTypeId, spellLookup, DataOriginTypeEnum.RACE, racialTrait, race, ruleData, spellListDataOriginLookup, valueLookup);
    const modifiers = ModifierGenerators.generateModifiers(id, entityTypeId, modifierLookup, DataOriginTypeEnum.RACE, racialTrait, race);
    const feats = FeatGenerators.generateDataOriginFeats(id, entityTypeId, featLookup, DataOriginTypeEnum.RACE, racialTrait, race);
    const options = generateRacialTraitOptions(racialTrait, race, featLookup, actionLookup, spellLookup, optionLookup, modifierLookup, valueLookup, spellListDataOriginLookup, ruleData);
    const generatedRacialTrait = Object.assign(Object.assign({}, racialTrait), { actions,
        choices,
        feats,
        modifiers,
        spells,
        options, accessType: DefinitionPoolUtils.getDefinitionAccessType(getDefinitionKey(racialTrait), definitionPool) });
    return generatedRacialTrait;
}
/**
 *
 * @param racialTrait
 * @param race
 * @param featLookup
 * @param actionLookup
 * @param spellLookup
 * @param optionLookup
 * @param modifierLookup
 * @param valueLookup
 * @param spellListDataOriginLookup
 * @param ruleData
 */
export function generateRacialTraitOptions(racialTrait, race, featLookup, actionLookup, spellLookup, optionLookup, modifierLookup, valueLookup, spellListDataOriginLookup, ruleData) {
    const baseOptions = OptionGenerators.generateDataOriginBaseOptions(getId(racialTrait), getEntityTypeId(racialTrait), optionLookup, DataOriginTypeEnum.RACE, racialTrait, race);
    return OptionGenerators.generateOptions(baseOptions, DataOriginTypeEnum.RACE, featLookup, actionLookup, spellLookup, optionLookup, modifierLookup, valueLookup, spellListDataOriginLookup, ruleData, racialTrait, race);
}
