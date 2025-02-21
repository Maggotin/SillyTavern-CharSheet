import { groupBy, orderBy } from 'lodash';
import { DataOriginGenerators } from '../DataOrigin';
import { HelperUtils } from '../Helper';
import { getComponentId, getComponentTypeId, getDisplayOrder, getId, getLabel, getOptionIds, getParentChoiceId, getType, } from './accessors';
/**
 *
 * @param choice
 */
export function generateDataOriginKey(choice) {
    return DataOriginGenerators.generateDataOriginKey(getComponentId(choice), getComponentTypeId(choice));
}
/**
 * @name generateChoiceComponentLookup
 * @param choices
 * @param choiceDefinitions
 * @description it takes choices and fills out the options via the optionIds and the choiceDefinitions and returns a lookup
 */
export function generateChoiceComponentLookup(choices, choiceDefinitions) {
    if (choiceDefinitions.length > 0) {
        choices.forEach((choice) => {
            var _a;
            // find the collection of choice definitions for this choice
            const options = ((_a = choiceDefinitions.find(({ id }) => id === `${getComponentTypeId(choice)}-${getType(choice)}`)) === null || _a === void 0 ? void 0 : _a.options) || null;
            const optionIds = getOptionIds(choice);
            if (options && optionIds.length) {
                // set existing list to empty array for phase 1 support
                choice.options = [];
                for (let i = 0; i < optionIds.length; i++) {
                    const optionId = optionIds[i];
                    // find the definition of the choice to add back to the list
                    const option = options.find((c) => c.id === optionId);
                    if (option) {
                        choice.options.push(option);
                    }
                }
            }
        });
    }
    return groupBy(choices, (choice) => generateDataOriginKey(choice));
}
/**
 *
 * @param proficiencyModifiers
 * @param expertiseModifiers
 * @param languageModifiers
 * @param kenseiModifiers
 * @param abilityLookup
 * @param classSpellLists
 */
export function generateChoiceData(proficiencyModifiers, expertiseModifiers, languageModifiers, kenseiModifiers, abilityLookup, classSpellLists) {
    return {
        proficiencyModifiers,
        expertiseModifiers,
        languageModifiers,
        kenseiModifiers,
        abilityLookup,
        classSpellLists,
    };
}
/**
 *
 * @param id
 * @param entityTypeId
 * @param choiceLookup
 * @param dataOriginType
 * @param primary
 * @param parent
 */
export function generateBaseChoices(id, entityTypeId, choiceLookup, dataOriginType, primary, parent = null) {
    const choices = HelperUtils.lookupDataOrFallback(choiceLookup, DataOriginGenerators.generateDataOriginKey(id, entityTypeId));
    if (!choices) {
        return [];
    }
    // create a sub choice lookup for later
    const subChoiceLookup = groupBy(choices.filter((choice) => getParentChoiceId(choice) !== null), (choice) => getParentChoiceId(choice));
    // get all choices that aren't children and sort them
    const orderedParentChoices = orderBy(choices.filter((choice) => getParentChoiceId(choice) === null), [getDisplayOrder, getType, (choice) => { var _a, _b; return (_b = (_a = getLabel(choice)) === null || _a === void 0 ? void 0 : _a.toLowerCase()) !== null && _b !== void 0 ? _b : null; }, getId]);
    // iterate over all non children choices, add choice, and then all ordered children after it into a flat array for parity
    const orderedChoices = [];
    orderedParentChoices.forEach((parentChoice) => {
        orderedChoices.push(parentChoice);
        const id = getId(parentChoice);
        if (id !== null) {
            let subChoices = HelperUtils.lookupDataOrFallback(subChoiceLookup, id);
            if (subChoices !== null) {
                let orderedSubChoices = orderBy(subChoices, [
                    getDisplayOrder,
                    getType,
                    (choice) => { var _a, _b; return (_b = (_a = getLabel(choice)) === null || _a === void 0 ? void 0 : _a.toLowerCase()) !== null && _b !== void 0 ? _b : null; },
                    getId,
                ]);
                orderedChoices.push(...orderedSubChoices);
            }
        }
    });
    return orderedChoices.map((choice) => (Object.assign(Object.assign({}, choice), { dataOrigin: DataOriginGenerators.generateDataOrigin(dataOriginType, primary, parent) })));
}
