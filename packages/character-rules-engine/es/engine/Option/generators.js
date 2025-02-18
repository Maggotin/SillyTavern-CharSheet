import { groupBy } from 'lodash';
import { ActionGenerators } from '../Action';
import { DataOriginGenerators } from '../DataOrigin';
import { FeatGenerators } from '../Feat';
import { HelperUtils } from '../Helper';
import { ModifierGenerators } from '../Modifier';
import { SpellGenerators } from '../Spell';
import { getComponentId, getComponentTypeId, getId, getEntityTypeId } from './accessors';
/**
 *
 * @param option
 */
export function generateDataOriginKey(option) {
    return DataOriginGenerators.generateDataOriginKey(getComponentId(option), getComponentTypeId(option));
}
/**
 *
 * @param options
 */
export function generateOptionComponentLookup(options) {
    return groupBy(options, (option) => generateDataOriginKey(option));
}
/**
 *
 * @param id
 * @param entityTypeId
 * @param optionLookup
 * @param dataOriginType
 * @param primary
 * @param parent
 */
export function generateDataOriginBaseOptions(id, entityTypeId, optionLookup, dataOriginType, primary, parent = null) {
    const options = HelperUtils.lookupDataOrFallback(optionLookup, DataOriginGenerators.generateDataOriginKey(id, entityTypeId));
    if (!options) {
        return [];
    }
    return options.map((option) => (Object.assign(Object.assign({}, option), { dataOrigin: DataOriginGenerators.generateDataOrigin(dataOriginType, primary, parent) })));
}
/**
 *
 * @param baseOptions
 * @param dataOriginType
 * @param featLookup
 * @param actionLookup
 * @param spellLookup
 * @param optionLookup
 * @param modifierLookup
 * @param valueLookup
 * @param spellListDataOriginLookup
 * @param ruleData
 * @param primary
 * @param parent
 */
export function generateOptions(baseOptions, dataOriginType, featLookup, actionLookup, spellLookup, optionLookup, modifierLookup, valueLookup, spellListDataOriginLookup, ruleData, primary, parent = null) {
    return baseOptions.map((option) => {
        const id = getId(option);
        const entityTypeId = getEntityTypeId(option);
        return Object.assign(Object.assign({}, option), { feats: FeatGenerators.generateDataOriginFeats(id, entityTypeId, featLookup, dataOriginType, primary, parent), actions: ActionGenerators.generateBaseActions(id, entityTypeId, actionLookup, valueLookup, dataOriginType, primary, parent), spells: SpellGenerators.generateBaseSpells(id, entityTypeId, spellLookup, dataOriginType, primary, parent, ruleData, spellListDataOriginLookup, valueLookup), modifiers: ModifierGenerators.generateModifiers(id, entityTypeId, modifierLookup, dataOriginType, primary, parent) });
    });
}
