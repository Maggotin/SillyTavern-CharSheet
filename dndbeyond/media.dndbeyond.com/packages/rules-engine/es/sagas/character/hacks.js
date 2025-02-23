import { call, put, select } from 'redux-saga/effects';
import { serviceDataActions } from '../../actions/serviceData';
import { ApiHacks } from '../../api';
import * as ApiAdapterUtils from '../../apiAdapter/utils';
import { AccessTypeEnum } from '../../engine/Access';
import { ClassAccessors } from '../../engine/Class';
import { ClassFeatureAccessors } from '../../engine/ClassFeature';
import { DefinitionPoolSimulators } from '../../engine/DefinitionPool';
import { RaceAccessors } from '../../engine/Race';
import { RacialTraitAccessors } from '../../engine/RacialTrait';
import * as rulesEngineSelectors from '../../selectors/composite/engine';
import { TypeScriptUtils } from '../../utils';
/**
 *
 * same as handleLoadDefinitions but using the temporary characterService game-data requests
 *
 * @param definitionType
 * @param definitionIds
 */
export function* hack__handleLoadDefinitions(definitionType, definitionIds) {
    try {
        // make the requests from the definition ids
        const serviceResponse = yield call(ApiHacks.hack__characterServiceMakeGetIdsDefinitionTypeRequest(definitionType), {
            ids: definitionIds,
        });
        let responseData = ApiAdapterUtils.getResponseData(serviceResponse);
        if (responseData !== null) {
            // compile all the definition and accessType responses
            yield put(serviceDataActions.definitionPoolAdd(responseData.definitionData, responseData.accessTypes));
        }
    }
    catch (error) { }
}
/**
 *
 */
export function* hack__simulateOwnedDefinitionData() {
    const race = yield select(rulesEngineSelectors.getRace);
    if (race) {
        yield call(hack__simulateOwnedRacialTraitDefinitionData, race);
    }
    yield call(hack__simulateOwnedClassFeatureDefinitionData);
}
/**
 *
 * @param race
 */
export function* hack__simulateOwnedRacialTraitDefinitionData(race) {
    const racialTraitDefinitions = RaceAccessors.getDefinitionRacialTraits(race)
        .map((contract) => {
        var _a;
        return (_a = RacialTraitAccessors.getDefinition(contract)) !== null && _a !== void 0 ? _a : null;
    })
        .filter(TypeScriptUtils.isNotNullOrUndefined);
    const racialTraitAccessTypeLookup = DefinitionPoolSimulators.simulateAccessTypeLookup(racialTraitDefinitions, AccessTypeEnum.OWNED);
    if (racialTraitDefinitions.length) {
        yield put(serviceDataActions.definitionPoolAdd(racialTraitDefinitions, racialTraitAccessTypeLookup));
    }
}
/**
 *
 */
export function* hack__simulateOwnedClassFeatureDefinitionData() {
    const classes = yield select(rulesEngineSelectors.getClasses);
    const classFeatureDefinitions = [];
    classes.forEach((charClass) => {
        ClassAccessors.getDefinitionClassFeatures(charClass).forEach((featureContract) => {
            const definition = ClassFeatureAccessors.getDefinition(featureContract);
            if (definition !== null) {
                classFeatureDefinitions.push(definition);
            }
        });
    });
    const classFeatureAccessTypeLookup = DefinitionPoolSimulators.simulateAccessTypeLookup(classFeatureDefinitions, AccessTypeEnum.OWNED);
    if (classFeatureDefinitions.length) {
        yield put(serviceDataActions.definitionPoolAdd(classFeatureDefinitions, classFeatureAccessTypeLookup));
    }
}
