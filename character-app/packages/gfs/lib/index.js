import { FeaturePreprocessor } from './FeaturePreprocessor';
import { initProgram } from './LoopResolutionCalculator';
export * from './types';
export function generateCharacterState(_a) {
    var rootFeatureIds = _a.rootFeatureIds, featureMap = _a.featureMap;
    var derivedStatements = new FeaturePreprocessor().process({ rootFeatureIds: rootFeatureIds, featureMap: featureMap });
    var state = initProgram({
        expressions: derivedStatements,
    });
    return state;
}
