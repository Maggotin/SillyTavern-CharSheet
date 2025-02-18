import { TypeScriptUtils } from '../../utils';
import { ClassAccessors } from '../Class';
import { ClassFeatureAccessors } from '../ClassFeature';
import { DataOriginGenerators } from '../DataOrigin';
import { HelperUtils } from '../Helper';
import { getKey } from './accessors';
import { deriveCanInfuse, deriveForcedModifierData } from './derivers';
import { validateIsAvailable } from './validators';
/**
 *
 * @param infusionChoiceDefinition
 * @param dataOriginType
 * @param primary
 * @param parent
 * @param infusionChoiceInfusionLookup
 * @param knownInfusionLookupByChoiceKey
 */
export function generateDataOriginBaseInfusionChoice(infusionChoiceDefinition, dataOriginType, primary, parent, infusionChoiceInfusionLookup, knownInfusionLookupByChoiceKey, characterId) {
    const choiceKey = getKey(infusionChoiceDefinition);
    if (!choiceKey) {
        return null;
    }
    const lookupKey = `${characterId}-${choiceKey}`;
    return Object.assign(Object.assign({}, infusionChoiceDefinition), { dataOrigin: DataOriginGenerators.generateDataOrigin(dataOriginType, primary, parent), infusion: HelperUtils.lookupDataOrFallback(infusionChoiceInfusionLookup, lookupKey), knownInfusion: HelperUtils.lookupDataOrFallback(knownInfusionLookupByChoiceKey, lookupKey) });
}
/**
 *
 * @param dataOriginBaseInfusionChoice
 */
export function generateInfusionChoice(dataOriginBaseInfusionChoice) {
    return Object.assign(Object.assign({}, dataOriginBaseInfusionChoice), { forcedModifierData: deriveForcedModifierData(dataOriginBaseInfusionChoice), canInfuse: deriveCanInfuse(dataOriginBaseInfusionChoice) });
}
/**
 *
 * @param infusionChoices
 * @param dataOriginType
 * @param primary
 * @param parent
 * @param infusionChoiceInfusionLookup
 * @param knownInfusionLookupByChoiceKey
 */
export function generateInfusionChoices(infusionChoices, dataOriginType, primary, parent, infusionChoiceInfusionLookup, knownInfusionLookupByChoiceKey, characterId) {
    return infusionChoices
        .map((infusionChoiceDefinition) => {
        const dataOriginBaseInfusionChoice = generateDataOriginBaseInfusionChoice(infusionChoiceDefinition, dataOriginType, primary, parent, infusionChoiceInfusionLookup, knownInfusionLookupByChoiceKey, characterId);
        if (!dataOriginBaseInfusionChoice) {
            return null;
        }
        return generateInfusionChoice(dataOriginBaseInfusionChoice);
    })
        .filter(TypeScriptUtils.isNotNullOrUndefined);
}
/**
 *
 * @param classes
 */
export function generateAggregatedInfusionChoices(classes) {
    const chosenItems = [];
    classes.forEach((charClass) => {
        ClassAccessors.getClassFeatures(charClass).forEach((feature) => {
            chosenItems.push(...ClassFeatureAccessors.getInfusionChoices(feature));
        });
    });
    return chosenItems;
}
/**
 *
 * @param infusionChoices
 */
export function generateAvailableInfusionChoices(infusionChoices) {
    return infusionChoices.filter(validateIsAvailable);
}
/**
 *
 * @param infusionChoices
 */
export function generateInfusionChoiceLookup(infusionChoices) {
    return HelperUtils.generateNonNullLookup(infusionChoices, getKey);
}
