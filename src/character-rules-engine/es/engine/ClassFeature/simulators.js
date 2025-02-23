import { ClassAccessors } from '../Class';
import { DefinitionPoolUtils } from '../DefinitionPool';
import { FeatList } from '../FeatList';
import { getFeatListContracts } from './accessors';
export function simulateClassFeature(definitionKey, definitionPool, 
// Optional args. Sometimes this method is called just to get an object that kind of looks like
// a class feature, but is only used for a few properties.
classes, choiceComponents, baseFeats) {
    var _a;
    const definition = DefinitionPoolUtils.getClassFeatureDefinition(definitionKey, definitionPool);
    if (definition === null) {
        return null;
    }
    let levelScale = null;
    if (definition === null || definition === void 0 ? void 0 : definition.levelScales) {
        // Find class that correlates to feature
        const classFeatureClass = classes === null || classes === void 0 ? void 0 : classes.find((classIterator) => ClassAccessors.getId(classIterator) === definition.classId);
        if (classFeatureClass) {
            // Find max level scale of appropriate level
            (_a = definition.levelScales) === null || _a === void 0 ? void 0 : _a.forEach((definitionLevelScale) => {
                if (definitionLevelScale.level <= classFeatureClass.level) {
                    levelScale = definitionLevelScale;
                }
            });
        }
    }
    const classFeatureMapping = simulateClassFeatureContract({
        definition,
        levelScale,
    });
    const featLists = choiceComponents && baseFeats
        ? getFeatListContracts(classFeatureMapping).map((contract) => new FeatList(contract, choiceComponents.definitionKeyNameMap, baseFeats))
        : [];
    return Object.assign(Object.assign({}, classFeatureMapping), { actions: [], choices: [], feats: [], modifiers: [], options: [], spells: [], infusionChoices: [], accessType: DefinitionPoolUtils.getDefinitionAccessType(definitionKey, definitionPool), featLists });
}
/**
 *
 * @param classFeatureProps
 */
export function simulateClassFeatureContract(classFeatureProps) {
    return Object.assign({ levelScale: null, definition: null }, classFeatureProps);
}
