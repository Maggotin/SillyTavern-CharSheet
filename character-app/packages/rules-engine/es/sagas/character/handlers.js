import { all, call, put, select } from 'redux-saga/effects';
import { characterActions, characterEnvActions, featureFlagInfoActions, ruleDataActions, serviceDataActions, } from '../../actions';
import { ApiRequests } from '../../api';
import * as ApiUtils from '../../api/utils';
import * as ApiAdapterUtils from '../../apiAdapter/utils';
import { ConfigUtils } from '../../config';
import { BackgroundAccessors } from '../../engine/Background';
import { CampaignAccessors, PartyInventorySharingStateEnum } from '../../engine/Campaign';
import { CharacterDerivers } from '../../engine/Character';
import { ChoiceAccessors } from '../../engine/Choice';
import { ClassAccessors, ClassUtils } from '../../engine/Class';
import { ClassFeatureAccessors, ClassFeatureValidators } from '../../engine/ClassFeature';
import { ContainerAccessors, ContainerTypeEnum, ContainerUtils, ContainerValidators, } from '../../engine/Container';
import { AbilityScoreStatTypeEnum, AbilityScoreTypeEnum, BuilderChoiceSubtypeEnum, BuilderChoiceTypeEnum, EntityTypeEnum, PreferenceProgressionTypeEnum, StartingEquipmentTypeEnum, } from '../../engine/Core';
import { CreatureAccessors } from '../../engine/Creature';
import { DefinitionHacks, DefinitionTypeEnum, DefinitionUtils } from '../../engine/Definition';
import { hack__generateDefinitionKey } from '../../engine/Definition/hacks';
import { FeatAccessors } from '../../engine/Feat';
import { FeatureFlagEnum } from '../../engine/FeatureFlagInfo';
import { HelperUtils } from '../../engine/Helper';
import { InfusionAccessors } from '../../engine/Infusion';
import { InfusionChoiceAccessors, InfusionChoiceValidators } from '../../engine/InfusionChoice';
import { ItemAccessors, ItemDerivers, ItemUtils } from '../../engine/Item';
import { KnownInfusionAccessors } from '../../engine/KnownInfusion';
import { ModifierAccessors } from '../../engine/Modifier';
import { OptionalClassFeatureAccessors, OptionalClassFeatureSimulators, OptionalClassFeatureUtils, } from '../../engine/OptionalClassFeature';
import { OptionalOriginAccessors, OptionalOriginSimulators, OptionalOriginUtils } from '../../engine/OptionalOrigin';
import { RaceAccessors, RaceUtils } from '../../engine/Race';
import { RacialTraitAccessors } from '../../engine/RacialTrait';
import { RuleDataAccessors, RuleDataTypeEnum } from '../../engine/RuleData';
import { SpellAccessors, SpellDerivers } from '../../engine/Spell';
import { AdjustmentTypeEnum, ValueHacks } from '../../engine/Value';
import { VehicleAccessors } from '../../engine/Vehicle';
import * as NotificationUtils from '../../notification/utils';
import { CharacterLoadingStatusEnum } from '../../reducers/constants';
import * as SagaHelpers from '../../sagas/SagaHelpers';
import { characterSelectors, serviceDataSelectors } from '../../selectors';
import * as rulesEngineSelectors from '../../selectors/composite/engine';
import { TypeScriptUtils } from '../../utils';
import { callCommitAction } from '../../utils/ReduxActionUtils';
import { serviceDataSagaHandlers } from '../serviceData';
import { hack__handleLoadDefinitions, hack__simulateOwnedClassFeatureDefinitionData, hack__simulateOwnedDefinitionData, hack__simulateOwnedRacialTraitDefinitionData, } from './hacks';
//TODO - could make an autoUpdate func that runs all update handlers with optional data - we do these combos in a few places so could be useful
//TODO TCoE - pull out api handlers into own file
/**
 *
 * @param definitionType
 * @param definitionIds
 */
export function* handleLoadDefinitions(definitionType, definitionIds) {
    try {
        // make the requests from the definition ids
        const serviceResponse = yield call(ApiUtils.makeGetIdsDefinitionTypeRequest(definitionType), {
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
export function* handleLoadAlwaysKnownSpells() {
    const background = yield select(rulesEngineSelectors.getBackgroundInfo);
    let backgroundId;
    if (background !== null && !background.hasCustomBackground) {
        backgroundId = BackgroundAccessors.getId(background);
    }
    const classes = yield select(rulesEngineSelectors.getClasses);
    const alwaysPreparedClasses = classes.filter((charClass) => ClassAccessors.getKnowsAllSpells(charClass));
    const requests = alwaysPreparedClasses.map((charClass) => () => ApiRequests.getCharacterGameDataAlwaysKnownSpells({
        params: {
            classId: ClassAccessors.getActiveId(charClass),
            classLevel: ClassAccessors.getLevel(charClass),
            backgroundId,
        },
    }));
    const classAlwaysKnownSpellResponses = yield all(requests.map(call));
    for (let i = 0; i < classAlwaysKnownSpellResponses.length; i++) {
        const response = classAlwaysKnownSpellResponses[i];
        const data = ApiAdapterUtils.getResponseData(response);
        const charClass = alwaysPreparedClasses[i];
        if (data !== null && charClass) {
            yield put(callCommitAction(serviceDataActions.classAlwaysKnownSpellsSet, data, ClassAccessors.getActiveId(charClass)));
        }
    }
}
/**
 *
 */
export function* handleLoadCharacterLazyData() {
    yield call(handleLoadAlwaysKnownSpells);
}
/**
 *
 * @param action
 */
export function* handleCharacterLoad(action) {
    yield put(characterEnvActions.dataSet({
        loadingStatus: CharacterLoadingStatusEnum.LOADING,
    }));
    const flags = Object.values(FeatureFlagEnum);
    const [characterResponse, configDataResponse, featureFlagInfoResponse, vehicleConfigDataResponse] = yield all([
        call(ApiUtils.makeGetCharacterRequest(action.payload.characterId)),
        call(ApiRequests.getCharacterRuleData, {
            params: action.payload.requestParams,
        }),
        call(ApiRequests.getFeatureFlag, { flags }),
        call(ApiRequests.getGameDataRuleDataVehicle, {
            removeDefaultParams: true,
            params: action.payload.requestParams,
        }),
    ]);
    // get the response data
    const characterJson = ApiAdapterUtils.getResponseData(characterResponse);
    if (characterJson !== null) {
        yield put(characterActions.characterSet(characterJson));
    }
    // get the rule data response data put it into the state
    const configDataJson = ApiAdapterUtils.getResponseData(configDataResponse);
    if (configDataJson !== null) {
        yield put(ruleDataActions.dataSet(configDataJson));
    }
    // get the feature flag info response data put it into the state
    const featureFlagInfoJson = ApiAdapterUtils.getResponseData(featureFlagInfoResponse);
    if (featureFlagInfoJson !== null) {
        yield put(featureFlagInfoActions.dataSet(featureFlagInfoJson));
    }
    yield put(serviceDataActions.partyInventoryRequest());
    // get the vehicle rule data response data put it into the state
    const vehicleConfigDataSourceData = ApiAdapterUtils.getResponseData(vehicleConfigDataResponse);
    if (vehicleConfigDataSourceData !== null) {
        yield put(callCommitAction(serviceDataActions.ruleDataPoolKeySet, RuleDataTypeEnum.VEHICLE, vehicleConfigDataSourceData));
    }
    const [vehicleMappingsResponse, componentMappingsResponse, infusionsKnownResponse, infusionResponse] = yield all([
        call(ApiRequests.getCharacterVehicles),
        call(ApiRequests.getCharacterVehicleComponents),
        call(ApiRequests.getCharacterKnownInfusions),
        call(ApiRequests.getCharacterInfusionItems),
    ]);
    const vehicleMappings = ApiAdapterUtils.getResponseData(vehicleMappingsResponse);
    const componentMappings = ApiAdapterUtils.getResponseData(componentMappingsResponse);
    const infusionMappings = ApiAdapterUtils.getResponseData(infusionResponse);
    const knownInfusionMappings = ApiAdapterUtils.getResponseData(infusionsKnownResponse);
    // get all infusion definitions
    let infusionDefinitionIds = new Set();
    if (infusionMappings !== null && infusionMappings.length) {
        for (let i = 0; i < infusionMappings.length; i++) {
            const mapping = infusionMappings[i];
            yield put(callCommitAction(serviceDataActions.infusionMappingAdd, mapping));
            const definitionKey = InfusionAccessors.getDefinitionKey(mapping);
            if (definitionKey !== null) {
                infusionDefinitionIds.add(DefinitionUtils.getDefinitionKeyId(definitionKey));
            }
        }
    }
    if (knownInfusionMappings !== null && knownInfusionMappings.length) {
        for (let i = 0; i < knownInfusionMappings.length; i++) {
            const mapping = knownInfusionMappings[i];
            yield put(callCommitAction(serviceDataActions.knownInfusionMappingAdd, mapping));
            const definitionKey = KnownInfusionAccessors.getDefinitionKey(mapping);
            if (definitionKey !== null) {
                infusionDefinitionIds.add(DefinitionUtils.getDefinitionKeyId(definitionKey));
            }
        }
    }
    if (infusionDefinitionIds.size > 0) {
        yield call(handleLoadDefinitions, DefinitionTypeEnum.INFUSION, Array.from(infusionDefinitionIds));
    }
    // get vehicle definitions
    const definitionIds = new Set();
    if (vehicleMappings !== null && vehicleMappings.length) {
        for (let i = 0; i < vehicleMappings.length; i++) {
            const mapping = vehicleMappings[i];
            yield put(callCommitAction(serviceDataActions.vehicleMappingAdd, mapping));
            const definitionKey = VehicleAccessors.getDefinitionKey(mapping);
            if (definitionKey !== null) {
                definitionIds.add(DefinitionUtils.getDefinitionKeyId(definitionKey));
            }
        }
        yield call(handleLoadDefinitions, DefinitionTypeEnum.VEHICLE, Array.from(definitionIds));
    }
    if (componentMappings !== null && componentMappings.length) {
        for (let i = 0; i < componentMappings.length; i++) {
            yield put(callCommitAction(serviceDataActions.vehicleComponentMappingAdd, componentMappings[i]));
        }
    }
    //simulate game-data responses for granted class features and racial traits and add to definitionPool
    yield call(hack__simulateOwnedDefinitionData);
    //get optional class feature definitions
    const optionalClassFeatureMappings = yield select(characterSelectors.getOptionalClassFeatures);
    const optionalClassFeatureDefinitionIds = new Set();
    optionalClassFeatureMappings === null || optionalClassFeatureMappings === void 0 ? void 0 : optionalClassFeatureMappings.forEach((mapping) => {
        const definitionKey = OptionalClassFeatureAccessors.getDefinitionKey(mapping);
        if (definitionKey !== null) {
            const id = DefinitionHacks.hack__getDefinitionKeyId(definitionKey);
            if (id !== null) {
                optionalClassFeatureDefinitionIds.add(id);
            }
        }
    });
    if (optionalClassFeatureDefinitionIds.size) {
        yield call(hack__handleLoadDefinitions, DefinitionTypeEnum.CLASS_FEATURE, Array.from(optionalClassFeatureDefinitionIds));
    }
    //get optional origin definitions
    const optionalOriginsMappings = yield select(characterSelectors.getOptionalOrigins);
    const optionalOriginDefinitionIds = new Set();
    optionalOriginsMappings === null || optionalOriginsMappings === void 0 ? void 0 : optionalOriginsMappings.forEach((mapping) => {
        const definitionKey = OptionalOriginAccessors.getDefinitionKey(mapping);
        if (definitionKey !== null) {
            const id = DefinitionHacks.hack__getDefinitionKeyId(definitionKey);
            if (id !== null) {
                optionalOriginDefinitionIds.add(id);
            }
        }
    });
    if (optionalOriginDefinitionIds.size) {
        yield call(hack__handleLoadDefinitions, DefinitionTypeEnum.RACIAL_TRAIT, Array.from(optionalOriginDefinitionIds));
    }
    yield call(autoUpdateClassAlwaysPreparedSpells);
    if (action.payload.config.includeAlwaysKnownSpells) {
        yield call(handleLoadAlwaysKnownSpells);
    }
    yield call(handleLoadCharacterLazyData);
    // Get all available campaign settings
    const isCampaignSettingsActive = featureFlagInfoJson === null || featureFlagInfoJson === void 0 ? void 0 : featureFlagInfoJson[FeatureFlagEnum.RELEASE_GATE_CAMPAIGN_SETTINGS];
    if (isCampaignSettingsActive) {
        const allCampaignSettingsResponse = yield call(ApiRequests.getAllCampaignSettings);
        const allCampaignSettings = ApiAdapterUtils.getResponseData(allCampaignSettingsResponse);
        yield put(callCommitAction(serviceDataActions.campaignSettingsSet, allCampaignSettings));
    }
    yield put(characterEnvActions.dataSet({
        loadingStatus: CharacterLoadingStatusEnum.LOADED,
    }));
}
/**
 *
 */
export function* autoUpdateClassAlwaysPreparedSpells(classIdLimiters = []) {
    const classes = yield select(rulesEngineSelectors.getClasses);
    const alwaysPreparedClasses = classes
        .filter((charClass) => classIdLimiters.length ? classIdLimiters.includes(ClassAccessors.getActiveId(charClass)) : true)
        .filter((charClass) => ClassAccessors.getKnowsAllSpells(charClass));
    const requests = alwaysPreparedClasses.map((charClass) => () => ApiRequests.getCharacterGameDataAlwaysPreparedSpells({
        params: {
            classId: ClassAccessors.getActiveId(charClass),
            classLevel: ClassAccessors.getLevel(charClass),
        },
    }));
    const classAlwaysPreparedSpellResponses = yield all(requests.map(call));
    for (let i = 0; i < classAlwaysPreparedSpellResponses.length; i++) {
        const response = classAlwaysPreparedSpellResponses[i];
        const data = ApiAdapterUtils.getResponseData(response);
        const charClass = alwaysPreparedClasses[i];
        if (data !== null && charClass) {
            yield put(callCommitAction(serviceDataActions.classAlwaysPreparedSpellsSet, data, ClassAccessors.getActiveId(charClass)));
        }
    }
}
/**
 *
 * @param spellListIds
 */
export function* apiRemoveSpellsBySpellListIds(spellListIds) {
    var _a;
    if (!spellListIds.length) {
        return;
    }
    yield call(SagaHelpers.getApiRequestData, ApiRequests.deleteCharacterSpellRemoveBySpellListIds, {
        spellListIds,
    });
    const spellListIdLookup = spellListIds.reduce((acc, id) => {
        acc[id] = true;
        return acc;
    }, {});
    //TODO use generateClassSpellListSpellsLookup
    const classes = yield select(rulesEngineSelectors.getClasses);
    for (let i = 0; i < classes.length; i++) {
        const charClass = classes[i];
        const classMappingId = ClassAccessors.getMappingId(charClass);
        const spells = ClassAccessors.getSpells(charClass);
        for (let j = 0; j < spells.length; j++) {
            const spell = spells[j];
            if (HelperUtils.lookupDataOrFallback(spellListIdLookup, (_a = SpellAccessors.getSpellListId(spell)) !== null && _a !== void 0 ? _a : -1, false)) {
                yield put(callCommitAction(characterActions.spellRemove, spell, classMappingId));
            }
        }
    }
}
/**
 *
 * @param action
 */
export function* handleConditionAdd(action) {
    const hitPointInfo = yield select(rulesEngineSelectors.getHitPointInfo);
    const totalHp = hitPointInfo.totalHp;
    const data = yield call(SagaHelpers.getApiRequestData, ApiRequests.putCharacterCondition, Object.assign(Object.assign({}, action.payload), { totalHp }));
    yield call(handleDataUpdates, data);
}
/**
 *
 * @param action
 */
export function* handleConditionSet(action) {
    const hitPointInfo = yield select(rulesEngineSelectors.getHitPointInfo);
    const totalHp = hitPointInfo.totalHp;
    const data = yield call(SagaHelpers.getApiRequestData, ApiRequests.putCharacterCondition, Object.assign(Object.assign({}, action.payload), { totalHp }));
    yield call(handleDataUpdates, data);
}
/**
 *
 * @param action
 */
export function* handleConditionRemove(action) {
    const data = yield call(SagaHelpers.getApiRequestData, ApiRequests.deleteCharacterCondition, action.payload);
    yield call(handleDataUpdates, data);
}
/**
 *
 * @param action
 */
export function* handleRestoreLife(action) {
    const { restoreType } = action.payload;
    const hitPointInfo = yield select(rulesEngineSelectors.getHitPointInfo);
    const totalHp = hitPointInfo.totalHp;
    const data = yield call(SagaHelpers.getApiRequestData, ApiRequests.putCharacterLifeRestore, { totalHp, restoreType });
    yield call(handleDataUpdates, data);
}
/**
 *
 * @param action
 */
export function* handleAdhocFeatCreate(action) {
    const data = yield call(SagaHelpers.getApiRequestData, ApiRequests.postCharacterFeatAdHoc, action.payload);
    yield call(handleDataUpdates, data);
}
/**
 *
 * @param action
 */
export function* handleAdhocFeatRemove(action) {
    const data = yield call(SagaHelpers.getApiRequestData, ApiRequests.deleteCharacterFeatAdHoc, action.payload);
    yield call(handleDataUpdates, data);
}
/**
 *
 * @param action
 */
export function* handleSetEntityFeat(action) {
    const data = yield call(SagaHelpers.getApiRequestData, ApiRequests.postEntityFeat, action.payload);
    yield call(handleDataUpdates, data);
}
/**
 *
 * @param action
 */
export function* handleSendSocialImageData(action) {
    const socialImageData = yield select(rulesEngineSelectors.getSocialImageData);
    const isSheetReady = yield select(rulesEngineSelectors.isCharacterSheetReady);
    if (isSheetReady) {
        yield call(SagaHelpers.getApiRequestData, ApiRequests.putCharacterDecorationSocialImage, socialImageData);
    }
}
/**
 *
 * @param action
 */
export function* handleAbilityScoreSet(action) {
    let { statId, type, value } = action.payload;
    let requestParams = {
        statId,
        type,
        value,
    };
    yield call(SagaHelpers.getApiRequestData, ApiRequests.putCharacterAbilityScore, requestParams);
    switch (action.payload.type) {
        case AbilityScoreStatTypeEnum.OVERRIDE:
            yield put(callCommitAction(characterActions.abilityScoreOverrideSet, statId, value));
            break;
        case AbilityScoreStatTypeEnum.BONUS:
            yield put(callCommitAction(characterActions.abilityScoreBonusSet, statId, value));
            break;
        case AbilityScoreStatTypeEnum.BASE:
            yield put(callCommitAction(characterActions.abilityScoreBaseSet, statId, value));
            break;
        default:
        // not implemented
    }
}
/**
 *
 * @param action
 */
export function* handlePreferenceChoose(action) {
    const { key, value } = action.payload;
    switch (key) {
        case 'enableOptionalClassFeatures': {
            const classes = yield select(rulesEngineSelectors.getClasses);
            if (typeof value === 'boolean') {
                const spellListIdsToRemove = ClassUtils.getUpdateEnableOptionalClassFeaturesSpellListIdsToRemove(classes, value);
                yield call(apiRemoveSpellsBySpellListIds, spellListIdsToRemove);
            }
            break;
        }
        case 'enableOptionalOrigins': {
            const race = yield select(rulesEngineSelectors.getRace);
            if (race && typeof value === 'boolean') {
                const spellListIdsToRemove = RaceUtils.getUpdateEnableOptionalOriginsSpellListIdsToRemove(race, value);
                yield call(apiRemoveSpellsBySpellListIds, spellListIdsToRemove);
            }
            break;
        }
        default:
        //not implemented
    }
    const data = yield call(SagaHelpers.getApiRequestData, ApiRequests.putCharacterPreferences, {
        [key]: value,
    });
    yield put(callCommitAction(characterActions.preferenceSet, key, value));
    yield call(handleDataUpdates, data);
}
/**
 *
 * @param action
 */
export function* handlePortraitUpload(action) {
    const data = yield call(SagaHelpers.getApiRequestData, ApiRequests.postCharacterDecorationPortraitCustom, action.payload);
    const { avatarId, avatarUrl } = data;
    yield put(callCommitAction(characterActions.portraitSet, avatarId, avatarUrl));
}
/**
 *
 * @param action
 */
export function* handleRandomNameRequest(action) {
    const race = yield select(rulesEngineSelectors.getRace);
    let reqParams = {};
    if (race !== null) {
        reqParams = {
            raceDefinitionKey: RaceAccessors.getDefinitionKey(race),
        };
    }
    const name = yield call(SagaHelpers.getApiRequestData, ApiRequests.getCharacterNameRandom, {
        params: reqParams,
    });
    yield put(characterActions.nameSet(name));
}
/**
 *
 * @param action
 */
export function* handleRaceChoose(action) {
    const { race } = action.payload;
    const existingRace = yield select(rulesEngineSelectors.getRace);
    if (existingRace !== null) {
        yield call(apiRemoveSpellsBySpellListIds, RaceAccessors.getSpellListIds(existingRace));
        const existingOptionalOrigins = yield select(rulesEngineSelectors.getOptionalOrigins);
        const optionalOriginsIdsToRemove = existingOptionalOrigins.map(OptionalOriginAccessors.getRacialTraitId);
        yield call(apiRemoveOptionalOriginsCollection, {
            racialTraitIds: optionalOriginsIdsToRemove,
        });
    }
    const data = yield call(SagaHelpers.getApiRequestData, ApiRequests.putCharacterRace, {
        entityRaceId: RaceAccessors.getEntityRaceId(race),
        entityRaceTypeId: RaceAccessors.getEntityRaceTypeId(race),
    });
    yield call(hack__simulateOwnedRacialTraitDefinitionData, race);
    yield call(handleDataUpdates, data);
    yield call(autoUpdateChoices);
}
/**
 *
 * @param apiPayload
 */
export function* apiRemoveOptionalOriginsCollection(apiPayload) {
    if (!apiPayload.racialTraitIds.length) {
        return;
    }
    const data = yield call(SagaHelpers.getApiRequestData, ApiRequests.deleteCharacterOptionalFeatureOriginCollection, apiPayload);
    for (let i = 0; i < apiPayload.racialTraitIds.length; i++) {
        yield put(callCommitAction(characterActions.optionalOriginRemove, apiPayload.racialTraitIds[i]));
    }
    return data;
}
/**
 *
 * @param action
 */
export function* handleClassAddRequest(action) {
    const { charClass, level } = action.payload;
    const { id } = charClass;
    const data = yield call(SagaHelpers.getApiRequestData, ApiRequests.postCharacterClass, {
        classId: id,
        level,
    });
    const preferences = yield select(rulesEngineSelectors.getCharacterPreferences);
    const currentLevel = yield select(rulesEngineSelectors.getCurrentLevel);
    const totalClassLevel = yield select(rulesEngineSelectors.getTotalClassLevel);
    if (preferences.progressionType === PreferenceProgressionTypeEnum.XP && totalClassLevel > currentLevel) {
        const ruleData = yield select(rulesEngineSelectors.getRuleData);
        yield put(characterActions.xpSet(CharacterDerivers.deriveCurrentLevelXp(totalClassLevel, ruleData)));
    }
    yield call(handleDataUpdates, data);
    yield call(autoUpdateChoices);
    yield call(hack__simulateOwnedClassFeatureDefinitionData);
}
/**
 *
 * @param action
 */
export function* handleClassRemoveRequest(action) {
    const data = yield call(SagaHelpers.getApiRequestData, ApiRequests.deleteCharacterClass, action.payload);
    const baseClassLookup = yield select(rulesEngineSelectors.getBaseClassLookup);
    const charClassToRemove = HelperUtils.lookupDataOrFallback(baseClassLookup, action.payload.characterClassId);
    const optionalClassFeatures = yield select(rulesEngineSelectors.getOptionalClassFeatures);
    const optionalFeatureDefinitionKeys = new Set();
    optionalClassFeatures.forEach((feature) => {
        if (charClassToRemove === null) {
            return;
        }
        const definitionKey = OptionalClassFeatureAccessors.getDefinitionKey(feature);
        if (definitionKey === null) {
            return;
        }
        const classFeature = OptionalClassFeatureAccessors.getClassFeature(feature);
        if (classFeature === null) {
            return;
        }
        if (ClassFeatureValidators.isValidClassClassFeature(charClassToRemove, classFeature)) {
            optionalFeatureDefinitionKeys.add(definitionKey);
        }
    });
    const idsToRemove = Array.from(optionalFeatureDefinitionKeys)
        .map(DefinitionHacks.hack__getDefinitionKeyId)
        .filter(TypeScriptUtils.isNotNullOrUndefined);
    yield call(apiRemoveOptionalClassFeatureCollection, {
        classFeatureIds: idsToRemove,
    });
    if (action.payload.newCharacterXp !== null) {
        yield put(characterActions.xpSet(action.payload.newCharacterXp));
    }
    yield call(handleDataUpdates, data);
    yield call(autoUpdateInfusions);
    yield call(autoUpdateChoices);
}
/**
 *
 * @param apiPayload
 */
export function* apiRemoveOptionalClassFeatureCollection(apiPayload) {
    if (!apiPayload.classFeatureIds.length) {
        return;
    }
    const data = yield call(SagaHelpers.getApiRequestData, ApiRequests.deleteCharacterOptionalFeatureClassFeatureCollection, apiPayload);
    for (let i = 0; i < apiPayload.classFeatureIds.length; i++) {
        yield put(callCommitAction(characterActions.optionalClassFeatureRemove, apiPayload.classFeatureIds[i]));
    }
    return data;
}
/**
 *
 * @param action
 */
export function* handleOptionalClassFeatureCreate(action) {
    const data = yield call(apiOptionalClassFeatureCreate, action.payload);
    //may need autoUpdateInfusions at some point
    yield call(handleDataUpdates, data);
    yield call(autoUpdateChoices);
}
/**
 *
 * @param apiPayload
 */
export function* apiOptionalClassFeatureCreate(apiPayload) {
    const optionalClassFeatureResponseData = yield call(SagaHelpers.getApiRequestData, ApiRequests.postCharacterOptionalFeatureClassFeature, apiPayload);
    const mappingContract = OptionalClassFeatureSimulators.simulateOptionalClassFeatureContract(apiPayload.classFeatureId, apiPayload.affectedClassFeatureId);
    yield put(callCommitAction(characterActions.optionalClassFeatureAdd, mappingContract));
    return optionalClassFeatureResponseData;
}
/**
 *
 * @param action
 */
export function* handleOptionalClassFeatureSetRequest(action) {
    const optionalClassFeatures = yield select(rulesEngineSelectors.getOptionalClassFeatures);
    const optionalFeature = optionalClassFeatures.find((feature) => OptionalClassFeatureAccessors.getClassFeatureId(feature) === action.payload.classFeatureId);
    if (!optionalFeature) {
        return;
    }
    const spellListIds = OptionalClassFeatureUtils.getUpdateMappingSpellListIdsToRemove(optionalFeature, action.payload);
    yield call(apiRemoveSpellsBySpellListIds, spellListIds);
    const data = yield call(apiOptionalClassFeatureSet, action.payload);
    //may need autoUpdateInfusions at some point
    yield call(handleDataUpdates, data);
    yield call(autoUpdateChoices);
}
/**
 *
 * @param apiPayload
 */
export function* apiOptionalClassFeatureSet(apiPayload) {
    const data = yield call(SagaHelpers.getApiRequestData, ApiRequests.putCharacterOptionalFeatureClassFeature, apiPayload);
    const newMappingContract = OptionalClassFeatureSimulators.simulateOptionalClassFeatureContract(apiPayload.classFeatureId, apiPayload.affectedClassFeatureId);
    yield put(callCommitAction(characterActions.optionalClassFeatureSet, Object.assign({}, newMappingContract)));
    return data;
}
/**
 *
 * @param action
 */
export function* handleOptionalClassFeatureDestroy(action) {
    const optionalClassFeatures = yield select(rulesEngineSelectors.getOptionalClassFeatures);
    const optionalFeature = optionalClassFeatures.find((feature) => OptionalClassFeatureAccessors.getClassFeatureId(feature) === action.payload.classFeatureId);
    if (!optionalFeature) {
        return;
    }
    const spellListIds = OptionalClassFeatureUtils.getRemoveMappingSpellListIds(optionalFeature);
    yield call(apiRemoveSpellsBySpellListIds, spellListIds);
    const data = yield call(apiOptionalClassFeatureDestroy, action.payload);
    //may need autoUpdateInfusions at some point
    yield call(handleDataUpdates, data);
    yield call(autoUpdateChoices);
}
/**
 *
 * @param apiPayload
 */
export function* apiOptionalClassFeatureDestroy(apiPayload) {
    const data = yield call(SagaHelpers.getApiRequestData, ApiRequests.deleteCharacterOptionalFeatureClassFeature, apiPayload);
    yield put(callCommitAction(characterActions.optionalClassFeatureRemove, apiPayload.classFeatureId));
    return data;
}
/**
 *
 * @param action
 */
export function* handleOptionalOriginCreate(action) {
    const data = yield call(apiOptionalOriginCreate, action.payload);
    yield call(handleDataUpdates, data);
    yield call(autoUpdateChoices);
}
/**
 *
 * @param apiPayload
 */
export function* apiOptionalOriginCreate(apiPayload) {
    const data = yield call(SagaHelpers.getApiRequestData, ApiRequests.postCharacterOptionalFeatureOrigin, apiPayload);
    const mappingContract = OptionalOriginSimulators.simulateOptionalOriginContract(apiPayload.racialTraitId, apiPayload.affectedRacialTraitId);
    yield put(callCommitAction(characterActions.optionalOriginAdd, mappingContract));
    return data;
}
/**
 *
 * @param action
 */
export function* handleOptionalOriginSetRequest(action) {
    const optionalOrigins = yield select(rulesEngineSelectors.getOptionalOrigins);
    const optionalOrigin = optionalOrigins.find((origin) => OptionalOriginAccessors.getRacialTraitId(origin) === action.payload.racialTraitId);
    if (!optionalOrigin) {
        return;
    }
    const spellListIds = OptionalOriginUtils.getUpdateMappingSpellListIdsToRemove(optionalOrigin, action.payload);
    yield call(apiRemoveSpellsBySpellListIds, spellListIds);
    const data = yield call(apiOptionalOriginSet, action.payload);
    yield call(handleDataUpdates, data);
    yield call(autoUpdateChoices);
}
/**
 *
 * @param apiPayload
 */
export function* apiOptionalOriginSet(apiPayload) {
    const data = yield call(SagaHelpers.getApiRequestData, ApiRequests.putCharacterOptionalFeatureOrigin, apiPayload);
    const newMappingContract = OptionalOriginSimulators.simulateOptionalOriginContract(apiPayload.racialTraitId, apiPayload.affectedRacialTraitId);
    yield put(callCommitAction(characterActions.optionalOriginSet, Object.assign({}, newMappingContract)));
    return data;
}
/**
 *
 * @param action
 */
export function* handleOptionalOriginDestroy(action) {
    const optionalOrigins = yield select(rulesEngineSelectors.getOptionalOrigins);
    const optionalOrigin = optionalOrigins.find((origin) => OptionalOriginAccessors.getRacialTraitId(origin) === action.payload.racialTraitId);
    if (!optionalOrigin) {
        return;
    }
    const spellListIds = OptionalOriginUtils.getRemoveMappingSpellListIds(optionalOrigin);
    yield call(apiRemoveSpellsBySpellListIds, spellListIds);
    const data = yield call(apiOptionalOriginDestroy, action.payload);
    yield call(handleDataUpdates, data);
    yield call(autoUpdateChoices);
}
/**
 *
 * @param action
 */
export function* handleCampaignSettingSetRequest(action) {
    const CampaignSetting = yield select(rulesEngineSelectors.getCampaignSetting);
    if (!CampaignSetting) {
        return;
    }
    const data = yield call(apiCampaignSettingSet, action.payload);
    yield call(handleDataUpdates, data);
    yield call(autoUpdateChoices);
}
/**
 *
 * @param apiPayload
 */
export function* apiCampaignSettingSet(apiPayload) {
    const data = yield call(SagaHelpers.getApiRequestData, ApiRequests.putCharacterCampaignSetting, apiPayload);
    yield put(callCommitAction(characterActions.campaignSettingSet, Object.assign({}, apiPayload)));
    return data;
}
/**
 *
 * @param apiPayload
 */
export function* apiOptionalOriginDestroy(apiPayload) {
    const data = yield call(SagaHelpers.getApiRequestData, ApiRequests.deleteCharacterOptionalFeatureOrigin, apiPayload);
    yield put(callCommitAction(characterActions.optionalOriginRemove, apiPayload.racialTraitId));
    return data;
}
/**
 *
 * @param action
 */
export function* handleCustomItemCreate(action) {
    //TODO v5.1: remove when mobile moves up - keep the if logic - remove everything in the else
    const containerLookup = yield select(rulesEngineSelectors.getContainerLookup);
    const { includeCustomItems } = ConfigUtils.getCurrentRulesEngineConfig();
    const { quantity, description, containerDefinitionKey, cost, name, notes, weight, partyId } = action.payload;
    const isSharedContainer = containerDefinitionKey
        ? ContainerValidators.validateIsShared(containerDefinitionKey, containerLookup)
        : false;
    if (includeCustomItems) {
        const data = yield call(SagaHelpers.getApiRequestData, ApiRequests.postCharacterCustomItem, {
            quantity,
            description,
            cost,
            name,
            notes,
            weight,
            containerEntityId: containerDefinitionKey
                ? DefinitionHacks.hack__getDefinitionKeyId(containerDefinitionKey)
                : null,
            containerEntityTypeId: containerDefinitionKey
                ? DefinitionHacks.hack__getDefinitionKeyType(containerDefinitionKey)
                : null,
            partyId: isSharedContainer ? partyId : null,
        });
        //put data for item/notes and customItem
        if (data.addItems) {
            if (notes) {
                yield put(callCommitAction(characterActions.valueSet, AdjustmentTypeEnum.NOTES, notes, null, ValueHacks.hack__toString(ItemAccessors.getMappingId(data.addItems[0])), ValueHacks.hack__toString(ItemAccessors.getMappingEntityTypeId(data.addItems[0])), null, null, partyId));
            }
            const customItem = ItemDerivers.deriveOriginalCustomContract(data.addItems[0], notes);
            yield put(callCommitAction(characterActions.customItemAdd, customItem));
            yield call(handleCommitAddItems, data.addItems);
        }
        if (action.meta.accept) {
            action.meta.accept();
        }
        yield call(handleDataUpdates, data);
    }
    else {
        const data = yield call(SagaHelpers.getApiRequestData, ApiRequests.postCharacterCustomItemV5, action.payload);
        yield put(callCommitAction(characterActions.customItemAdd, data));
    }
}
/**
 *
 * @param action
 */
export function* handleCustomItemDestroy(action) {
    //TODO v5.1: remove when mobile moves up
    //no longer need useCustomItems flag
    //keep the if logic - remove everything in the else
    const { includeCustomItems } = ConfigUtils.getCurrentRulesEngineConfig();
    const { id, partyId, mappingId } = action.payload;
    if (includeCustomItems) {
        const data = yield call(SagaHelpers.getApiRequestData, ApiRequests.deleteCharacterCustomItem, action.payload);
        //if partyId is passed in, the item is shared
        if (!partyId) {
            // remove Item and CustomItem from character
            yield put(callCommitAction(characterActions.itemRemove, mappingId));
            yield put(callCommitAction(characterActions.customItemRemove, id));
        }
        else {
            // remove Item from party
            yield put(callCommitAction(serviceDataActions.partyItemRemove, mappingId));
        }
    }
    else {
        //Calls the V5 version and commits to character custom items
        yield put(characterActions.customItemRemove(id));
    }
    if (action.meta.accept) {
        action.meta.accept();
    }
}
export function* handleCustomItemSet(action) {
    //TODO v5.1: remove when mobile moves up
    //no longer need useCustomItems flag
    //keep the if logic - remove everything in the else
    const { includeCustomItems } = ConfigUtils.getCurrentRulesEngineConfig();
    const { id, properties, mappingId, partyId } = action.payload;
    if (includeCustomItems) {
        const data = yield call(SagaHelpers.getApiRequestData, ApiRequests.putCharacterCustomItem, Object.assign({ id,
            mappingId, partyId: partyId !== null && partyId !== void 0 ? partyId : null }, properties));
        //if partyId is passed in, the item is shared
        if (!partyId) {
            // update Item and CustomItem from character
            yield put(callCommitAction(characterActions.customItemSet, id, properties));
        }
        if (data.addItems) {
            if (typeof properties.notes !== undefined) {
                yield put(callCommitAction(characterActions.valueSet, AdjustmentTypeEnum.NOTES, properties.notes, null, ValueHacks.hack__toString(ItemAccessors.getMappingId(data.addItems[0])), ValueHacks.hack__toString(ItemAccessors.getMappingEntityTypeId(data.addItems[0])), null, null, partyId));
            }
            yield call(handleCommitAddItems, data.addItems);
        }
    }
    else {
        //Calls the V5 version and commits to character custom items
        const data = yield call(SagaHelpers.getApiRequestData, ApiRequests.putCharacterCustomItemV5, Object.assign({ id }, properties));
        yield put(callCommitAction(characterActions.customItemSet, id, properties));
    }
    if (action.meta.accept) {
        action.meta.accept();
    }
}
/**
 *
 * @param action
 */
export function* handleItemCustomizationsDelete(action) {
    const { mappingId, mappingEntityTypeId, partyId } = action.payload;
    const id = ValueHacks.hack__toString(mappingId);
    const entityTypeId = ValueHacks.hack__toString(mappingEntityTypeId);
    yield put(characterActions.entityValuesRemove(id, entityTypeId, null, null, partyId));
    if (action.meta.accept) {
        action.meta.accept();
    }
}
export function* handleContainerDestroy(item, removeContents) {
    const itemMappingId = ItemAccessors.getMappingId(item);
    const containerLookup = yield select(rulesEngineSelectors.getContainerLookup);
    const inventoryLookup = yield select(rulesEngineSelectors.getInventoryLookup);
    const partyInventoryLookup = yield select(rulesEngineSelectors.getPartyInventoryLookup);
    const container = HelperUtils.lookupDataOrFallback(containerLookup, DefinitionHacks.hack__generateDefinitionKey(ContainerTypeEnum.ITEM, itemMappingId));
    if (container) {
        if (removeContents) {
            const itemMappingIdsToRemove = ContainerAccessors.getItemMappingIds(container);
            for (let i = 0; i < itemMappingIdsToRemove.length; i++) {
                const foundItem = HelperUtils.lookupDataOrFallback(inventoryLookup, itemMappingIdsToRemove[i]);
                const foundPartyItem = HelperUtils.lookupDataOrFallback(partyInventoryLookup, itemMappingIdsToRemove[i]);
                if (foundItem || foundPartyItem) {
                    let infusion;
                    if (foundItem) {
                        infusion = ItemAccessors.getInfusion(foundItem);
                    }
                    else if (foundPartyItem) {
                        infusion = ItemAccessors.getInfusion(foundPartyItem);
                    }
                    if (infusion) {
                        const infusionId = InfusionAccessors.getId(infusion);
                        if (infusionId !== null) {
                            yield put(callCommitAction(serviceDataActions.infusionMappingRemove, infusionId, itemMappingIdsToRemove[i]));
                        }
                    }
                }
                if (foundItem) {
                    yield put(callCommitAction(characterActions.itemRemove, itemMappingIdsToRemove[i], true));
                }
                else if (foundPartyItem) {
                    yield put(callCommitAction(serviceDataActions.partyItemRemove, itemMappingIdsToRemove[i], true));
                }
            }
        }
        else {
            const itemMappingIdsToMove = ContainerAccessors.getItemMappingIds(container);
            const isShared = ContainerAccessors.isShared(container);
            const characterId = yield select(rulesEngineSelectors.getId);
            for (let i = 0; i < itemMappingIdsToMove.length; i++) {
                if (isShared) {
                    const campaign = yield select(rulesEngineSelectors.getCampaign);
                    if (campaign) {
                        yield put(callCommitAction(serviceDataActions.partyItemMoveSet, itemMappingIdsToMove[i], CampaignAccessors.getId(campaign), ContainerTypeEnum.CAMPAIGN));
                    }
                }
                else {
                    yield put(callCommitAction(characterActions.itemMoveSet, itemMappingIdsToMove[i], characterId, ContainerTypeEnum.CHARACTER));
                }
            }
            const infusion = ItemAccessors.getInfusion(item);
            if (infusion) {
                yield put(callCommitAction(serviceDataActions.infusionMappingRemove, InfusionAccessors.getId(infusion), itemMappingId));
            }
        }
        if (ContainerAccessors.isShared(container)) {
            yield put(serviceDataActions.partyItemRemove(itemMappingId, removeContents));
        }
        else {
            yield put(characterActions.itemRemove(itemMappingId, removeContents));
        }
    }
}
/**
 *
 * @param action
 */
export function* handleItemDestroy(action) {
    const { id, removeContainerContents } = action.payload;
    // handle the case where the item is the characters item
    const inventoryLookup = yield select(rulesEngineSelectors.getInventoryLookup);
    let item = HelperUtils.lookupDataOrFallback(inventoryLookup, id);
    if (item) {
        //if item isContainer, handle removing container and contents
        if (ItemAccessors.isContainer(item)) {
            yield call(handleContainerDestroy, item, removeContainerContents);
        }
        else {
            //item is not container, just remove it (removeContainerContents should be false for now)
            yield put(characterActions.itemRemove(id, false));
        }
        if (action.meta.accept) {
            action.meta.accept();
        }
        return;
    }
    //handle the case where the item is the party's item
    const partyInventoryLookup = yield select(rulesEngineSelectors.getPartyInventoryLookup);
    item = HelperUtils.lookupDataOrFallback(partyInventoryLookup, id);
    if (item) {
        //if item isContainer, handle removing container and contents
        //  TODO IMS: check that this works with shared containers
        if (ItemAccessors.isContainer(item)) {
            yield call(handleContainerDestroy, item, removeContainerContents);
        }
        else {
            //item is not container, just remove it (removeContainerContents should be false for now)
            yield put(serviceDataActions.partyItemRemove(id, false));
            const partyInfo = yield select(serviceDataSelectors.getPartyInfo);
            if (partyInfo &&
                CampaignAccessors.getSharingState(partyInfo) === PartyInventorySharingStateEnum.DELETE_ONLY) {
                const partyInventory = CampaignAccessors.getPartyBaseInventoryContracts(partyInfo);
                // If all that is left if what we just deleted
                if (partyInventory.length === 1 && ItemAccessors.getId(partyInventory[0]) === id) {
                    yield put(serviceDataActions.partyCampaignInfoSet(Object.assign(Object.assign({}, partyInfo), { sharingState: PartyInventorySharingStateEnum.OFF })));
                }
            }
        }
        if (action.meta.accept) {
            action.meta.accept();
        }
        return;
    }
}
/**
 *
 * @param action
 */
export function* handleItemCreate(action) {
    var _a, _b;
    const { item, quantity, containerDefinitionKey } = action.payload;
    const data = yield call(SagaHelpers.getApiRequestData, ApiRequests.postCharacterInventoryItem, {
        equipment: [
            {
                containerEntityId: containerDefinitionKey
                    ? DefinitionHacks.hack__getDefinitionKeyId(containerDefinitionKey)
                    : undefined,
                containerEntityTypeId: containerDefinitionKey
                    ? DefinitionHacks.hack__getDefinitionKeyType(containerDefinitionKey)
                    : undefined,
                entityId: ItemAccessors.getDefinitionId(item),
                entityTypeId: ItemAccessors.getDefinitionEntityTypeId(item),
                quantity,
            },
        ],
    }, { onError: (_a = action === null || action === void 0 ? void 0 : action.meta) === null || _a === void 0 ? void 0 : _a.reject, onSuccess: (_b = action === null || action === void 0 ? void 0 : action.meta) === null || _b === void 0 ? void 0 : _b.accept });
    if (data.addItems) {
        yield call(handleCommitAddItems, data.addItems);
    }
    if (action.meta.accept) {
        action.meta.accept();
    }
    yield call(handleDataUpdates, data);
}
function* handleCommitAddItems(addItems) {
    const containers = yield select(rulesEngineSelectors.getInventoryContainers);
    for (let i = 0; i < addItems.length; i++) {
        const itemContainer = ContainerUtils.getItemParentContainer(containers, ItemAccessors.getContainerDefinitionKey(addItems[i]));
        if (itemContainer && ContainerAccessors.isShared(itemContainer)) {
            yield put(callCommitAction(serviceDataActions.partyItemAdd, addItems[i]));
        }
        else {
            yield put(callCommitAction(characterActions.itemAdd, addItems[i]));
        }
    }
}
/**
 *
 * @param action
 */
export function* handleItemMove(action) {
    var _a;
    const containerLookup = yield select(rulesEngineSelectors.getContainerLookup);
    const inventoryLookup = yield select(rulesEngineSelectors.getInventoryLookup);
    const partyInventoryLookup = yield select(rulesEngineSelectors.getPartyInventoryLookup);
    const item = (_a = HelperUtils.lookupDataOrFallback(inventoryLookup, action.payload.id)) !== null && _a !== void 0 ? _a : HelperUtils.lookupDataOrFallback(partyInventoryLookup, action.payload.id);
    if (!item) {
        return;
    }
    const isCurrentContainerShared = ItemUtils.isShared(item, containerLookup);
    const isDestinationContainerShared = ContainerValidators.validateIsShared(DefinitionHacks.hack__generateDefinitionKey(action.payload.containerEntityTypeId, action.payload.containerEntityId), containerLookup);
    const isItemContainer = ItemAccessors.isContainer(item);
    yield call(SagaHelpers.sendApiRequest, ApiRequests.putCharacterInventoryItemMove, action.payload);
    if (isCurrentContainerShared) {
        //currently in party
        if (isDestinationContainerShared) {
            //still in party
            yield put(callCommitAction(serviceDataActions.partyItemMoveSet, action.payload.id, action.payload.containerEntityId, action.payload.containerEntityTypeId));
        }
        else {
            if (isItemContainer) {
                const inventoryItems = yield select(rulesEngineSelectors.getPartyInventory);
                const itemContainer = HelperUtils.lookupDataOrFallback(containerLookup, DefinitionHacks.hack__generateDefinitionKey(EntityTypeEnum.ITEM, ItemAccessors.getMappingId(item)));
                // If item is container we need to move contents to inventory
                if (itemContainer) {
                    const inventoryInContainer = ContainerUtils.getInventoryItems(itemContainer, inventoryItems);
                    for (let i = 0; i < inventoryInContainer.length; i++) {
                        yield put(callCommitAction(characterActions.itemAdd, Object.assign(Object.assign({}, inventoryInContainer[i]), { containerEntityId: ContainerAccessors.getMappingId(itemContainer), containerEntityTypeId: ContainerAccessors.getContainerType(itemContainer), containerDefinitionKey: ContainerAccessors.getDefinitionKey(itemContainer) })));
                        yield put(callCommitAction(serviceDataActions.partyItemRemove, ItemAccessors.getMappingId(inventoryInContainer[i])));
                    }
                }
            }
            //moving to character
            yield put(callCommitAction(characterActions.itemAdd, Object.assign(Object.assign({}, item), { containerEntityId: action.payload.containerEntityId, containerEntityTypeId: action.payload.containerEntityTypeId, containerDefinitionKey: DefinitionHacks.hack__generateDefinitionKey(action.payload.containerEntityTypeId, action.payload.containerEntityId) })));
            yield put(callCommitAction(serviceDataActions.partyItemRemove, ItemAccessors.getMappingId(item)));
        }
    }
    else {
        //currently on character
        if (isDestinationContainerShared) {
            if (isItemContainer) {
                const inventoryItems = yield select(rulesEngineSelectors.getInventory);
                const itemContainer = HelperUtils.lookupDataOrFallback(containerLookup, DefinitionHacks.hack__generateDefinitionKey(EntityTypeEnum.ITEM, ItemAccessors.getMappingId(item)));
                // If item is container we need to move contents to party inventory
                if (itemContainer) {
                    const inventoryInContainer = ContainerUtils.getInventoryItems(itemContainer, inventoryItems);
                    for (let i = 0; i < inventoryInContainer.length; i++) {
                        yield put(callCommitAction(serviceDataActions.partyItemAdd, Object.assign(Object.assign({}, inventoryInContainer[i]), { containerEntityId: ContainerAccessors.getMappingId(itemContainer), containerEntityTypeId: ContainerAccessors.getContainerType(itemContainer), containerDefinitionKey: ContainerAccessors.getDefinitionKey(itemContainer) })));
                        yield put(callCommitAction(characterActions.itemRemove, ItemAccessors.getMappingId(inventoryInContainer[i])));
                    }
                }
            }
            //moving to party
            yield put(callCommitAction(serviceDataActions.partyItemAdd, Object.assign(Object.assign({}, item), { containerEntityId: action.payload.containerEntityId, containerEntityTypeId: action.payload.containerEntityTypeId, containerDefinitionKey: DefinitionHacks.hack__generateDefinitionKey(action.payload.containerEntityTypeId, action.payload.containerEntityId) })));
            yield put(callCommitAction(characterActions.itemRemove, ItemAccessors.getMappingId(item)));
        }
        else {
            //still on character
            yield put(callCommitAction(characterActions.itemMoveSet, action.payload.id, action.payload.containerEntityId, action.payload.containerEntityTypeId));
        }
    }
    if (action.meta.accept) {
        action.meta.accept();
    }
}
/**
 *
 * @param action
 */
export function* handleItemEquippedSet(action) {
    var _a;
    // If we are unequipping and item is attuned, unattune it as well
    const containerLookup = yield select(rulesEngineSelectors.getContainerLookup);
    const inventoryLookup = yield select(rulesEngineSelectors.getInventoryLookup);
    const partyInventoryLookup = yield select(rulesEngineSelectors.getPartyInventoryLookup);
    const item = (_a = HelperUtils.lookupDataOrFallback(inventoryLookup, action.payload.id)) !== null && _a !== void 0 ? _a : HelperUtils.lookupDataOrFallback(partyInventoryLookup, action.payload.id);
    if (!action.payload.value) {
        if (item !== null && ItemAccessors.isAttuned(item)) {
            yield put(characterActions.itemAttuneSet(action.payload.id, false));
        }
    }
    const equipParams = {
        id: action.payload.id,
        value: action.payload.value,
    };
    yield call(SagaHelpers.sendApiRequest, ApiRequests.putCharacterInventoryItemEquipped, equipParams);
    if (item) {
        if (ItemUtils.isShared(item, containerLookup)) {
            yield put(callCommitAction(serviceDataActions.partyItemEquippedSet, ...Object.values(action.payload)));
        }
        else {
            yield put(callCommitAction(characterActions.itemEquippedSet, ...Object.values(action.payload)));
        }
    }
    if (action.meta.accept) {
        action.meta.accept();
    }
}
export function* handleItemAttuneSet(action) {
    var _a;
    const containerLookup = yield select(rulesEngineSelectors.getContainerLookup);
    const inventoryLookup = yield select(rulesEngineSelectors.getInventoryLookup);
    const partyInventoryLookup = yield select(rulesEngineSelectors.getPartyInventoryLookup);
    const item = (_a = HelperUtils.lookupDataOrFallback(inventoryLookup, action.payload.id)) !== null && _a !== void 0 ? _a : HelperUtils.lookupDataOrFallback(partyInventoryLookup, action.payload.id);
    const attuneParams = Object.assign({}, action.payload);
    yield call(SagaHelpers.sendApiRequest, ApiRequests.putCharacterInventoryItemAttuned, attuneParams);
    if (item) {
        if (ItemUtils.isShared(item, containerLookup)) {
            yield put(callCommitAction(serviceDataActions.partyItemAttuneSet, ...Object.values(action.payload)));
        }
        else {
            yield put(callCommitAction(characterActions.itemAttuneSet, ...Object.values(action.payload)));
        }
    }
    if (action.meta.accept) {
        action.meta.accept();
    }
}
export function* handleItemQuantitySet(action) {
    var _a;
    const containerLookup = yield select(rulesEngineSelectors.getContainerLookup);
    const inventoryLookup = yield select(rulesEngineSelectors.getInventoryLookup);
    const partyInventoryLookup = yield select(rulesEngineSelectors.getPartyInventoryLookup);
    const item = (_a = HelperUtils.lookupDataOrFallback(inventoryLookup, action.payload.id)) !== null && _a !== void 0 ? _a : HelperUtils.lookupDataOrFallback(partyInventoryLookup, action.payload.id);
    const quantityParams = Object.assign({}, action.payload);
    yield call(SagaHelpers.sendApiRequest, ApiRequests.putCharacterInventoryItemQuantity, quantityParams);
    if (item) {
        if (ItemUtils.isShared(item, containerLookup)) {
            yield put(callCommitAction(serviceDataActions.partyItemQuantitySet, ...Object.values(action.payload)));
        }
        else {
            yield put(callCommitAction(characterActions.itemQuantitySet, ...Object.values(action.payload)));
        }
    }
    if (action.meta.accept) {
        action.meta.accept();
    }
}
export function* handleItemChargesSet(action) {
    var _a;
    const containerLookup = yield select(rulesEngineSelectors.getContainerLookup);
    const inventoryLookup = yield select(rulesEngineSelectors.getInventoryLookup);
    const partyInventoryLookup = yield select(rulesEngineSelectors.getPartyInventoryLookup);
    const item = (_a = HelperUtils.lookupDataOrFallback(inventoryLookup, action.payload.id)) !== null && _a !== void 0 ? _a : HelperUtils.lookupDataOrFallback(partyInventoryLookup, action.payload.id);
    const chargeParams = Object.assign(Object.assign({}, action.payload), { charges: action.payload.uses });
    yield call(SagaHelpers.sendApiRequest, ApiRequests.putCharacterInventoryItemCharge, chargeParams);
    if (item) {
        if (ItemUtils.isShared(item, containerLookup)) {
            yield put(callCommitAction(serviceDataActions.partyItemChargesSet, ...Object.values(action.payload)));
        }
        else {
            yield put(callCommitAction(characterActions.itemChargesSet, ...Object.values(action.payload)));
        }
    }
    if (action.meta.accept) {
        action.meta.accept();
    }
}
/**
 *
 * @param action
 */
export function* handleStartingEquipmentAdd(action) {
    const { items, gold, custom } = action.payload;
    if (items && !items.length && !gold && custom && !custom.length) {
        yield put(characterActions.startingEquipmentTypeSet(StartingEquipmentTypeEnum.GUIDED));
        if (action.meta.reject) {
            action.meta.reject();
        }
        return;
    }
    let itemsResponse = null;
    if (items && items.length) {
        let params = {
            equipment: items,
        };
        itemsResponse = yield call(SagaHelpers.sendApiRequest, ApiRequests.postCharacterInventoryItem, params);
    }
    let goldResponse = null;
    if (gold) {
        const currentCurrencies = yield select(characterSelectors.getCurrencies);
        const currentGold = currentCurrencies === null ? 0 : currentCurrencies.gp;
        let goldParams = {
            amount: currentGold + gold,
        };
        goldResponse = yield call(SagaHelpers.sendApiRequest, ApiRequests.putCharacterInventoryCurrencyGold, goldParams);
        yield put(callCommitAction(characterActions.currencyGoldSet, goldParams.amount));
    }
    let customResponse = null;
    if (custom && custom.length) {
        const currentNotes = yield select(characterSelectors.getNotes);
        const personalPossessions = `${currentNotes && currentNotes.personalPossessions ? currentNotes.personalPossessions + '\n' : ''}${custom.join('\n')}`;
        const noteParams = {
            personalPossessions,
        };
        customResponse = yield call(SagaHelpers.sendApiRequest, ApiRequests.putCharacterDescriptionNotes, noteParams);
        yield put(callCommitAction(characterActions.noteSet, 'personalPossessions', personalPossessions));
    }
    if ((itemsResponse && itemsResponse.data.success) ||
        (goldResponse && goldResponse.data.success) ||
        (customResponse && customResponse.data.success)) {
        if (itemsResponse && itemsResponse.data.success) {
            const data = ApiAdapterUtils.getResponseData(itemsResponse);
            if (data && data.addItems) {
                for (let i = 0; i < data.addItems.length; i++) {
                    yield put(callCommitAction(characterActions.itemAdd, data.addItems[i]));
                }
            }
        }
        yield put(characterActions.startingEquipmentTypeSet(StartingEquipmentTypeEnum.GUIDED));
        if (action.meta.accept) {
            action.meta.accept();
        }
    }
    else {
        //TODO do something with error
    }
}
/**
 *
 * @param action
 */
export function* handleStartingGoldAdd(action) {
    const { gold } = action.payload;
    let goldResponse = null;
    if (gold) {
        const currentCurrencies = yield select(characterSelectors.getCurrencies);
        const currentGold = currentCurrencies === null ? 0 : currentCurrencies.gp;
        let goldParams = {
            amount: currentGold + gold,
        };
        goldResponse = yield call(SagaHelpers.sendApiRequest, ApiRequests.putCharacterInventoryCurrencyGold, goldParams);
        yield put(callCommitAction(characterActions.currencyGoldSet, goldParams.amount));
    }
    if (goldResponse && goldResponse.data.success) {
        yield put(characterActions.startingEquipmentTypeSet(StartingEquipmentTypeEnum.GUIDED));
        if (action.meta.accept) {
            action.meta.accept();
        }
    }
    else {
        //TODO do something with error
    }
}
/**
 *
 * @param action
 */
export function* handleCurrencyTransactionSet(action) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    let data = yield call(SagaHelpers.getApiRequestData, ApiRequests.putCharacterInventoryCurrencyTransaction, action.payload, {
        onSuccess: action.meta.accept,
        onError: action.meta.reject,
    });
    // if the request fails because it is offline(mobile-only) the we still want to process the change.
    if (data.isOfflineResponse && action.payload.destinationEntityTypeId && action.payload.destinationEntityId) {
        const containerEntityTypeId = action.payload.destinationEntityTypeId;
        const containerEntityId = action.payload.destinationEntityId;
        const containerDefinitionKey = hack__generateDefinitionKey(containerEntityTypeId, containerEntityId);
        const containerLookup = yield select(rulesEngineSelectors.getContainerLookup);
        const container = HelperUtils.lookupDataOrFallback(containerLookup, containerDefinitionKey);
        if (container) {
            const coins = container
                ? ContainerAccessors.getCoin(container)
                : null;
            if (coins) {
                data.cp = (coins.cp || 0) + ((_b = (_a = action.payload) === null || _a === void 0 ? void 0 : _a.cp) !== null && _b !== void 0 ? _b : 0);
                data.ep = (coins.ep || 0) + ((_d = (_c = action.payload) === null || _c === void 0 ? void 0 : _c.ep) !== null && _d !== void 0 ? _d : 0);
                data.gp = (coins.gp || 0) + ((_f = (_e = action.payload) === null || _e === void 0 ? void 0 : _e.gp) !== null && _f !== void 0 ? _f : 0);
                data.pp = (coins.pp || 0) + ((_h = (_g = action.payload) === null || _g === void 0 ? void 0 : _g.pp) !== null && _h !== void 0 ? _h : 0);
                data.sp = (coins.sp || 0) + ((_k = (_j = action.payload) === null || _j === void 0 ? void 0 : _j.sp) !== null && _k !== void 0 ? _k : 0);
            }
        }
    }
    if (data) {
        if (action.payload.destinationEntityTypeId === ContainerTypeEnum.CHARACTER) {
            yield put(callCommitAction(characterActions.currenciesSet, data));
        }
        else if (action.payload.destinationEntityTypeId === ContainerTypeEnum.CAMPAIGN) {
            yield put(callCommitAction(serviceDataActions.partyCurrenciesSet, data));
        }
        else if (action.payload.destinationEntityId && action.payload.destinationEntityTypeId) {
            const containerLookup = yield select(rulesEngineSelectors.getContainerLookup);
            const isShared = ContainerValidators.validateIsShared(hack__generateDefinitionKey(action.payload.destinationEntityTypeId, action.payload.destinationEntityId), containerLookup);
            if (isShared) {
                yield put(callCommitAction(serviceDataActions.partyItemCurrencySet, data, action.payload.destinationEntityId));
            }
            else {
                yield put(callCommitAction(characterActions.itemCurrencySet, data, action.payload.destinationEntityId));
            }
        }
        if (action.meta.accept) {
            action.meta.accept();
        }
    }
}
/**
 *
 * @param action
 */
export function* handleRacialTraitChoiceSetRequest(action) {
    const { racialTraitId, choiceId } = action.payload;
    yield call(apiRacialTraitChoiceSet, action);
    const race = yield select(rulesEngineSelectors.getRace);
    if (race) {
        const racialTrait = RaceAccessors.getRacialTraits(race).find((racialTrait) => RacialTraitAccessors.getId(racialTrait) === racialTraitId);
        if (racialTrait) {
            const racialTraitChoice = RacialTraitAccessors.getChoices(racialTrait).find((choice) => ChoiceAccessors.getId(choice) === choiceId);
            if (racialTraitChoice) {
                yield call(autoUpdateChoices, racialTraitChoice);
            }
        }
    }
}
/**
 *
 * @param action
 */
function* apiRacialTraitChoiceSet(action) {
    const { racialTraitId, choiceType, choiceId, optionValue } = action.payload;
    const data = yield call(SagaHelpers.getApiRequestData, ApiRequests.putCharacterRaceRacialTraitChoice, {
        racialTraitId,
        type: choiceType,
        choiceKey: choiceId,
        choiceValue: optionValue,
    });
    yield call(handleDataUpdates, data);
}
/**
 *
 * @param action
 */
export function* handleClassFeatureChoiceSetRequest(action) {
    const { classId, classFeatureId, choiceId, choiceType, optionValue } = action.payload;
    let oldClasses = yield select(rulesEngineSelectors.getClasses);
    let oldCharClass = oldClasses.find((charClass) => ClassAccessors.getActiveId(charClass) === classId);
    if (choiceType === BuilderChoiceTypeEnum.SUB_CLASS_OPTION && oldCharClass) {
        const subclass = ClassAccessors.getSubclass(oldCharClass);
        if (subclass !== null) {
            const spellListIds = ClassAccessors.getActiveClassFeatures(oldCharClass)
                .filter((classFeature) => ClassFeatureAccessors.getClassId(classFeature) === subclass.id)
                .map(ClassFeatureAccessors.getSpellListIds)
                .reduce((acc, ids) => acc.concat(ids), []);
            yield call(apiRemoveSpellsBySpellListIds, spellListIds);
        }
    }
    yield call(apiClassFeatureChoiceSet, action);
    const classes = yield select(rulesEngineSelectors.getClasses);
    const charClass = classes.find((charClass) => !!oldCharClass && ClassAccessors.getId(charClass) === ClassAccessors.getId(oldCharClass));
    if (charClass) {
        const classFeature = ClassAccessors.getClassFeatures(charClass).find((classFeature) => ClassFeatureAccessors.getId(classFeature) === classFeatureId);
        if (classFeature) {
            const classFeatureChoice = ClassFeatureAccessors.getChoices(classFeature).find((choice) => ChoiceAccessors.getId(choice) === choiceId);
            yield call(autoUpdateChoices, classFeatureChoice);
        }
        if (optionValue !== null && choiceType === BuilderChoiceTypeEnum.SUB_CLASS_OPTION) {
            // Need to get the "new" activeId since the subclass ID has changed
            yield call(autoUpdateClassAlwaysPreparedSpells, [ClassAccessors.getActiveId(charClass)]);
            yield call(hack__simulateOwnedClassFeatureDefinitionData);
        }
    }
}
/**
 *
 * @param action
 */
function* apiClassFeatureChoiceSet(action) {
    const { classId, classFeatureId, choiceType, choiceId, optionValue, parentChoiceId } = action.payload;
    const classMappingIdLookup = yield select(rulesEngineSelectors.getClassMappingIdLookupByActiveId);
    const classMappingId = HelperUtils.lookupDataOrFallback(classMappingIdLookup, classId);
    if (classMappingId !== null) {
        const data = yield call(SagaHelpers.getApiRequestData, ApiRequests.putCharacterClassFeatureChoice, {
            classId,
            classMappingId,
            classFeatureId,
            type: choiceType,
            choiceKey: choiceId,
            choiceValue: optionValue,
            parentChoiceId,
        });
        yield call(handleDataUpdates, data);
    }
}
/**
 *
 * @param action
 */
export function* handleFeatChoiceSetRequest(action) {
    const { featId, choiceId } = action.payload;
    yield call(apiFeatChoiceSet, action);
    const feats = yield select(rulesEngineSelectors.getFeats);
    const feat = feats.find((feat) => FeatAccessors.getId(feat) === featId);
    if (feat) {
        const featChoice = FeatAccessors.getChoices(feat).find((choice) => ChoiceAccessors.getId(choice) === choiceId);
        yield call(autoUpdateChoices, featChoice);
    }
}
/**
 *
 * @param action
 */
function* apiFeatChoiceSet(action) {
    const { featId, choiceType, choiceId, optionValue } = action.payload;
    const data = yield call(SagaHelpers.getApiRequestData, ApiRequests.putCharacterFeatChoice, {
        id: featId,
        type: choiceType,
        choiceKey: choiceId,
        choiceValue: optionValue,
    });
    yield call(handleDataUpdates, data);
}
/**
 *
 * @param action
 */
function* apiClassLevelSet(action) {
    const { classId, level, newCharacterXp } = action.payload;
    const classMappingIdLookup = yield select(rulesEngineSelectors.getClassMappingIdLookupByActiveId);
    const classMappingId = HelperUtils.lookupDataOrFallback(classMappingIdLookup, classId);
    if (classMappingId !== null) {
        const data = yield call(SagaHelpers.getApiRequestData, ApiRequests.putCharacterClassLevel, {
            classId,
            classMappingId,
            level,
        });
        if (newCharacterXp !== null) {
            yield put(characterActions.xpSet(newCharacterXp));
        }
        yield call(handleDataUpdates, data);
    }
}
/**
 *
 * @param action
 */
export function* handleClassLevelSetRequest(action) {
    const { classId, level } = action.payload;
    let oldClasses = yield select(rulesEngineSelectors.getClasses);
    let oldCharClass = oldClasses.find((charClass) => ClassAccessors.getActiveId(charClass) === classId);
    if (oldCharClass) {
        const oldLevel = ClassAccessors.getLevel(oldCharClass);
        // if leveling down
        if (level < oldLevel) {
            const oldClassId = ClassAccessors.getId(oldCharClass);
            const removedClassFeatures = ClassAccessors.getActiveClassFeatures(oldCharClass).filter((classFeature) => ClassFeatureAccessors.getRequiredLevel(classFeature) > level);
            const isRemovingSubclass = removedClassFeatures.some((feature) => ClassFeatureAccessors.getChoices(feature).some((choice) => ChoiceAccessors.getType(choice) === BuilderChoiceTypeEnum.SUB_CLASS_OPTION));
            const removedSpellListIds = ClassAccessors.getActiveClassFeatures(oldCharClass)
                .filter((classFeature) => ClassFeatureAccessors.getRequiredLevel(classFeature) > level ||
                (isRemovingSubclass && ClassFeatureAccessors.getClassId(classFeature) !== oldClassId))
                .map(ClassFeatureAccessors.getSpellListIds)
                .reduce((acc, spellListIds) => acc.concat(spellListIds), []);
            yield call(apiRemoveSpellsBySpellListIds, removedSpellListIds);
        }
    }
    yield call(apiClassLevelSet, action);
    yield call(autoUpdateInfusions);
    yield call(autoUpdateChoices);
    yield call(autoUpdateClassAlwaysPreparedSpells, [action.payload.classId]);
}
/**
 *
 * @param action
 */
export function* handleXpSetRequest(action) {
    const { currentXp } = action.payload;
    yield call(SagaHelpers.sendApiRequest, ApiRequests.putCharacterProgression, { currentXp });
    yield put(characterActions.xpSet(currentXp));
}
/**
 *
 * @param action
 */
export function* handleSpellCreate(action) {
    const { characterClassId, spell } = action.payload;
    const data = yield call(SagaHelpers.getApiRequestData, ApiRequests.postCharacterSpell, {
        characterClassId,
        spellId: SpellAccessors.getId(spell),
        id: SpellAccessors.getMappingId(spell),
        entityTypeId: SpellAccessors.getMappingEntityTypeId(spell),
    });
    yield put(callCommitAction(characterActions.spellAdd, data, characterClassId));
    if (action.meta.accept) {
        action.meta.accept();
    }
}
/**
 *
 * @param action
 */
export function* handleSpellRemove(action) {
    const { spell } = action.payload;
    let mappingId = SpellAccessors.getMappingId(spell);
    let mappingEntityTypeId = SpellAccessors.getMappingEntityTypeId(spell);
    let [contextId, contextTypeId] = SpellDerivers.deriveExpandedContextIds(spell);
    yield put(callCommitAction(characterActions.entityValuesRemove, mappingId, mappingEntityTypeId, contextId, contextTypeId));
    if (action.meta.accept) {
        action.meta.accept();
    }
}
/**
 *
 * @param action
 */
export function* handleSpellPrepareSet(action) {
    // If this is preparing a spell, we need to find out if this is a known spellcaster who may not be
    // mapped to the spell directly yet.  We can use the service data we got for class always known spells
    // to simulate adding the mapping to the state without waiting for the server.
    const spellClasses = yield select(rulesEngineSelectors.getSpellClasses);
    let mappedSpell;
    for (let i = 0; i < spellClasses.length; i++) {
        const charClass = spellClasses[i];
        const characterClassId = ClassAccessors.getMappingId(charClass);
        if (action.payload.characterClassId !== characterClassId) {
            continue;
        }
        const classSpellMappings = yield select(characterSelectors.getClassSpells);
        const classSpellMapping = classSpellMappings.find((classSpellMapping) => classSpellMapping.characterClassId === characterClassId);
        if (!classSpellMapping || !classSpellMapping.spells) {
            continue;
        }
        mappedSpell = classSpellMapping.spells.find((spell) => {
            return (SpellAccessors.getMappingId(spell) === action.payload.id &&
                SpellAccessors.getMappingEntityTypeId(spell) === action.payload.entityTypeId &&
                SpellAccessors.getId(spell) === action.payload.spellId);
        });
        if (!ClassAccessors.getKnowsAllSpells(charClass)) {
            continue;
        }
        if (!mappedSpell) {
            const classAlwaysKnownSpells = yield select(serviceDataSelectors.getClassAlwaysKnownSpells);
            const alwaysKnownSpells = HelperUtils.lookupDataOrFallback(classAlwaysKnownSpells, ClassAccessors.getActiveId(charClass));
            if (alwaysKnownSpells) {
                const spellContract = alwaysKnownSpells.find((spell) => {
                    return (SpellAccessors.getMappingId(spell) === action.payload.id &&
                        SpellAccessors.getMappingEntityTypeId(spell) === action.payload.entityTypeId &&
                        SpellAccessors.getId(spell) === action.payload.spellId);
                });
                if (spellContract) {
                    yield put(callCommitAction(characterActions.spellAdd, spellContract, ClassAccessors.getMappingId(charClass)));
                    yield put(callCommitAction(characterActions.spellPreparedSet, spellContract, characterClassId, action.payload.prepared));
                }
            }
        }
    }
    if (mappedSpell) {
        yield put(callCommitAction(characterActions.spellPreparedSet, mappedSpell, action.payload.characterClassId, action.payload.prepared));
    }
    yield call(SagaHelpers.getApiRequestData, ApiRequests.putCharacterSpellPrepared, action.payload);
    if (action.meta.accept) {
        action.meta.accept();
    }
}
/**
 *
 * @param action
 */
export function* handleSpellCustomizationsDelete(action) {
    const { mappingId, mappingEntityTypeId, contextId, contextTypeId } = action.payload;
    yield put(characterActions.entityValuesRemove(ValueHacks.hack__toString(mappingId), ValueHacks.hack__toString(mappingEntityTypeId), ValueHacks.hack__toString(contextId), ValueHacks.hack__toString(contextTypeId)));
}
/**
 * @param action
 * @param data
 */
function* updateBackgroundResult(action, data) {
    yield call(handleDataUpdates, data);
    yield call(autoUpdateChoices);
}
/**
 *
 * @param action
 */
export function* handleBackgroundSetRequest(action) {
    const existingBackground = yield select(rulesEngineSelectors.getBackgroundInfo);
    if (existingBackground !== null) {
        yield call(apiRemoveSpellsBySpellListIds, BackgroundAccessors.getSpellListIds(existingBackground));
    }
    yield put(callCommitAction(characterActions.backgroundHasCustomSet, false));
    const data = yield call(SagaHelpers.getApiRequestData, ApiRequests.putCharacterBackground, action.payload);
    yield call(updateBackgroundResult, action, data);
}
/**
 *
 * @param action
 */
export function* handleBackgroundChoiceSetRequest(action) {
    yield call(apiBackgroundChoiceSet, action);
}
/**
 *
 * @param action
 */
function* apiBackgroundChoiceSet(action) {
    const { choiceType, choiceId, optionValue } = action.payload;
    const data = yield call(SagaHelpers.getApiRequestData, ApiRequests.putCharacterBackgroundChoice, {
        type: choiceType,
        choiceKey: choiceId,
        choiceValue: optionValue,
    });
    yield call(handleDataUpdates, data);
}
/**
 *
 * @param action
 */
export function* handleBackgroundHasCustomSetRequest(action) {
    // if you are switching to a custom background, attempt to remove any spells if the background has spellListIds
    if (action.payload.hasCustomBackground) {
        const existingBackground = yield select(rulesEngineSelectors.getBackgroundInfo);
        if (existingBackground !== null) {
            yield call(apiRemoveSpellsBySpellListIds, BackgroundAccessors.getSpellListIds(existingBackground));
        }
    }
    yield put(callCommitAction(characterActions.backgroundHasCustomSet, action.payload.hasCustomBackground));
    const data = yield call(SagaHelpers.getApiRequestData, ApiRequests.putCharacterConfigurationHasCustomBackground, action.payload);
    yield call(updateBackgroundResult, action, data);
}
/**
 *
 * @param action
 */
export function* handleBackgroundCustomSetRequest(action) {
    const { properties } = action.payload;
    const data = yield call(SagaHelpers.getApiRequestData, ApiRequests.putCharacterCustomBackground, {
        name: properties.name,
        description: properties.description,
        backgroundFeatureId: properties.featureId,
        backgroundCharacteristicsId: properties.characteristicsId,
        backgroundType: properties.modifierType,
    });
    yield call(updateBackgroundResult, action, data);
}
/**
 *
 */
export function* autoUpdateInfusions() {
    const choices = yield select(rulesEngineSelectors.getInfusionChoices);
    // handle choices that exist are could be invalid
    for (let i = 0; i < choices.length; i++) {
        const choice = choices[i];
        let isAvailable = InfusionChoiceValidators.validateIsAvailable(choice);
        if (!isAvailable) {
            const knownInfusion = InfusionChoiceAccessors.getKnownInfusion(choice);
            const choiceKey = InfusionChoiceAccessors.getKey(choice);
            if (knownInfusion && choiceKey !== null) {
                yield call(serviceDataSagaHandlers.handleKnownInfusionDestroy, serviceDataActions.knownInfusionMappingDestroy(choiceKey));
            }
        }
    }
    const infusionChoiceLookup = yield select(rulesEngineSelectors.getInfusionChoiceLookup);
    const knownInfusions = yield select(rulesEngineSelectors.getKnownInfusions);
    // handle known infusions that exist that no longer have a choice (ex: class remove)
    if (knownInfusions.length) {
        for (let i = 0; i < knownInfusions.length; i++) {
            const knownInfusion = knownInfusions[i];
            const choiceKey = KnownInfusionAccessors.getChoiceKey(knownInfusion);
            if (choiceKey !== null && !HelperUtils.lookupDataOrFallback(infusionChoiceLookup, choiceKey)) {
                yield call(serviceDataSagaHandlers.handleKnownInfusionDestroy, serviceDataActions.knownInfusionMappingDestroy(choiceKey));
            }
        }
    }
}
/**
 *
 * @param lastChoice
 */
function* autoUpdateChoices(lastChoice = null) {
    yield call(autoUpdateProficiencyChoices, lastChoice);
    yield call(autoUpdateClassFeatureChoices);
    yield call(autoUpdateRacialTraitChoices);
    yield call(autoUpdateBackgroundChoices);
    yield call(autoUpdateExpertiseChoices);
}
/**
 *
 * @param choice
 * @param lastChoice
 */
function isOtherProficiencyChoice(choice, lastChoice) {
    return (ChoiceAccessors.getType(choice) === BuilderChoiceTypeEnum.MODIFIER_SUB_CHOICE &&
        (ChoiceAccessors.getSubType(choice) === BuilderChoiceSubtypeEnum.PROFICIENCY ||
            ChoiceAccessors.getSubType(choice) === BuilderChoiceSubtypeEnum.EXPERTISE_NO_REQUIREMENT) &&
        ChoiceAccessors.getOptionValue(choice) !== null &&
        (!lastChoice || (!!lastChoice && ChoiceAccessors.getId(lastChoice) !== ChoiceAccessors.getId(choice))));
}
/**
 *
 * @param lastChoice
 */
function* autoUpdateProficiencyChoices(lastChoice) {
    let builderChoiceInfo = yield select(rulesEngineSelectors.getChoiceInfo);
    let background = yield select(rulesEngineSelectors.getBackgroundInfo);
    if (background) {
        let choices = BackgroundAccessors.getChoices(background);
        for (let choice of choices) {
            if (isOtherProficiencyChoice(choice, lastChoice)) {
                let selectedChoiceOption = ChoiceAccessors.getOptions(choice).find((option) => option.id === ChoiceAccessors.getOptionValue(choice));
                let existingProficiencyModifiers = [];
                // TODO fix once https://intellij-support.jetbrains.com/hc/en-us/community/posts/360003813400-Typescript-expression-can-t-follow-value-has-been-checked-for-undefined-outside-of-it
                existingProficiencyModifiers = builderChoiceInfo.proficiencyModifiers.filter((modifier) => selectedChoiceOption &&
                    ModifierAccessors.getFriendlySubtypeName(modifier) === selectedChoiceOption.label);
                if (existingProficiencyModifiers.length > 1) {
                    let choiceId = ChoiceAccessors.getId(choice);
                    if (choiceId !== null) {
                        yield call(apiBackgroundChoiceSet, {
                            type: 'SIMULATED_CHOICE',
                            payload: {
                                choiceType: ChoiceAccessors.getType(choice),
                                choiceId: choiceId,
                                optionValue: null,
                            },
                        });
                        if (selectedChoiceOption) {
                            NotificationUtils.dispatchMessage('Background Proficiency Removed', `The ${selectedChoiceOption.label} skill was removed from your background. Choose a new background skill in the Background section.`);
                        }
                    }
                }
                builderChoiceInfo = yield select(rulesEngineSelectors.getChoiceInfo);
            }
        }
    }
    let classes = yield select(rulesEngineSelectors.getClasses);
    for (let charClass of classes) {
        let classFeatures = ClassAccessors.getClassFeatures(charClass);
        for (let classFeature of classFeatures) {
            let choices = ClassFeatureAccessors.getChoices(classFeature);
            for (let choice of choices) {
                if (isOtherProficiencyChoice(choice, lastChoice)) {
                    let selectedFeatureChoiceOption = ChoiceAccessors.getOptions(choice).find((option) => option.id === ChoiceAccessors.getOptionValue(choice));
                    // TODO fix once https://intellij-support.jetbrains.com/hc/en-us/community/posts/360003813400-Typescript-expression-can-t-follow-value-has-been-checked-for-undefined-outside-of-it
                    let existingProficiencyModifiers = builderChoiceInfo.proficiencyModifiers.filter((modifier) => selectedFeatureChoiceOption &&
                        ModifierAccessors.getFriendlySubtypeName(modifier) === selectedFeatureChoiceOption.label);
                    if (existingProficiencyModifiers.length > 1) {
                        let classId = charClass.subclassDefinition === null
                            ? ClassAccessors.getId(charClass)
                            : charClass.subclassDefinition.id;
                        yield call(apiClassFeatureChoiceSet, {
                            type: 'SIMULATED_CHOICE',
                            payload: {
                                classId,
                                classFeatureId: ClassFeatureAccessors.getId(classFeature),
                                choiceType: ChoiceAccessors.getType(choice),
                                choiceId: ChoiceAccessors.getId(choice),
                                optionValue: null,
                                parentChoiceId: ChoiceAccessors.getParentChoiceId(choice),
                            },
                        });
                        if (selectedFeatureChoiceOption) {
                            NotificationUtils.dispatchMessage('Class Feature Proficiency Removed', `The ${selectedFeatureChoiceOption.label} proficiency was removed from the "${ClassFeatureAccessors.getName(classFeature)}" class feature.
                                 Choose a new proficiency skill in the Class section.`);
                        }
                    }
                    builderChoiceInfo = yield select(rulesEngineSelectors.getChoiceInfo);
                }
            }
        }
    }
    let race = yield select(rulesEngineSelectors.getRace);
    if (race) {
        let racialTraits = RaceAccessors.getRacialTraits(race);
        for (let racialTrait of racialTraits) {
            let choices = RacialTraitAccessors.getChoices(racialTrait);
            for (let choice of choices) {
                if (isOtherProficiencyChoice(choice, lastChoice)) {
                    let selectedTraitChoiceOption = ChoiceAccessors.getOptions(choice).find((option) => option.id === ChoiceAccessors.getOptionValue(choice));
                    // TODO fix once https://intellij-support.jetbrains.com/hc/en-us/community/posts/360003813400-Typescript-expression-can-t-follow-value-has-been-checked-for-undefined-outside-of-it
                    let existingProficiencyModifiers = builderChoiceInfo.proficiencyModifiers.filter((modifier) => selectedTraitChoiceOption &&
                        ModifierAccessors.getFriendlySubtypeName(modifier) === selectedTraitChoiceOption.label);
                    if (existingProficiencyModifiers.length > 1) {
                        yield call(apiRacialTraitChoiceSet, {
                            type: 'SIMULATED_CHOICE',
                            payload: {
                                racialTraitId: RacialTraitAccessors.getId(racialTrait),
                                choiceType: ChoiceAccessors.getType(choice),
                                choiceId: ChoiceAccessors.getId(choice),
                                optionValue: null,
                            },
                        });
                        if (selectedTraitChoiceOption) {
                            NotificationUtils.dispatchMessage('Racial Trait Proficiency Removed', `The ${selectedTraitChoiceOption.label} proficiency was removed from the "${RacialTraitAccessors.getName(racialTrait)}" racial trait.
                                Choose a new proficiency skill in the Race section.`);
                        }
                    }
                    builderChoiceInfo = yield select(rulesEngineSelectors.getChoiceInfo);
                }
            }
        }
    }
}
/**
 *
 */
function* autoUpdateExpertiseChoices() {
    let builderChoiceInfo = yield select(rulesEngineSelectors.getChoiceInfo);
    let classes = yield select(rulesEngineSelectors.getClasses);
    for (let charClass of classes) {
        let classFeatures = ClassAccessors.getClassFeatures(charClass);
        for (let classFeature of classFeatures) {
            let choices = ClassFeatureAccessors.getChoices(classFeature);
            for (let choice of choices) {
                if (ChoiceAccessors.getType(choice) === BuilderChoiceTypeEnum.MODIFIER_SUB_CHOICE &&
                    ChoiceAccessors.getSubType(choice) === BuilderChoiceSubtypeEnum.EXPERTISE &&
                    ChoiceAccessors.getOptionValue(choice)) {
                    let selectedFeatureChoiceOption = ChoiceAccessors.getOptions(choice).find((option) => option.id === ChoiceAccessors.getOptionValue(choice));
                    // TODO fix once https://intellij-support.jetbrains.com/hc/en-us/community/posts/360003813400-Typescript-expression-can-t-follow-value-has-been-checked-for-undefined-outside-of-it
                    let existingProficiencyModifier = builderChoiceInfo.proficiencyModifiers.find((modifier) => !!selectedFeatureChoiceOption &&
                        ModifierAccessors.getFriendlySubtypeName(modifier) === selectedFeatureChoiceOption.label);
                    if (!existingProficiencyModifier) {
                        let classId = charClass.subclassDefinition === null
                            ? ClassAccessors.getId(charClass)
                            : charClass.subclassDefinition.id;
                        yield call(apiClassFeatureChoiceSet, {
                            type: 'SIMULATED_CHOICE',
                            payload: {
                                classId,
                                classFeatureId: ClassFeatureAccessors.getId(classFeature),
                                choiceType: ChoiceAccessors.getType(choice),
                                choiceId: ChoiceAccessors.getId(choice),
                                optionValue: null,
                                parentChoiceId: ChoiceAccessors.getParentChoiceId(choice),
                            },
                        });
                        if (selectedFeatureChoiceOption) {
                            NotificationUtils.dispatchMessage('Class Feature Expertise Removed', `The ${selectedFeatureChoiceOption.label} expertise was removed from the "${ClassFeatureAccessors.getName(classFeature)}" class feature.
                                Choose a new expertise skill in the Class section.`);
                        }
                    }
                }
            }
        }
    }
    let race = yield select(rulesEngineSelectors.getRace);
    if (race) {
        let racialTraits = RaceAccessors.getRacialTraits(race);
        for (let racialTrait of racialTraits) {
            let choices = RacialTraitAccessors.getChoices(racialTrait);
            for (let choice of choices) {
                if (ChoiceAccessors.getType(choice) === BuilderChoiceTypeEnum.MODIFIER_SUB_CHOICE &&
                    ChoiceAccessors.getSubType(choice) === BuilderChoiceSubtypeEnum.EXPERTISE &&
                    ChoiceAccessors.getOptionValue(choice)) {
                    let selectedTraitChoiceOption = ChoiceAccessors.getOptions(choice).find((option) => option.id === ChoiceAccessors.getOptionValue(choice));
                    // TODO fix once https://intellij-support.jetbrains.com/hc/en-us/community/posts/360003813400-Typescript-expression-can-t-follow-value-has-been-checked-for-undefined-outside-of-it
                    let existingProficiencyModifier = builderChoiceInfo.proficiencyModifiers.find((modifier) => !!selectedTraitChoiceOption &&
                        ModifierAccessors.getFriendlySubtypeName(modifier) === selectedTraitChoiceOption.label);
                    if (!existingProficiencyModifier) {
                        yield call(apiRacialTraitChoiceSet, {
                            type: 'SIMULATED_CHOICE',
                            payload: {
                                racialTraitId: RacialTraitAccessors.getId(racialTrait),
                                choiceType: ChoiceAccessors.getType(choice),
                                choiceId: ChoiceAccessors.getId(choice),
                                optionValue: null,
                            },
                        });
                        if (selectedTraitChoiceOption) {
                            NotificationUtils.dispatchMessage('Racial Trait Expertise Removed', `The ${selectedTraitChoiceOption.label} expertise was removed from the "${RacialTraitAccessors.getName(racialTrait)}" racial trait.
                                Choose a new expertise skill in the Race section.`);
                        }
                    }
                }
            }
        }
    }
}
/**
 *
 */
function* autoUpdateBackgroundChoices() {
    let background = yield select(rulesEngineSelectors.getBackgroundInfo);
    let choicesChanged = 0;
    if (background) {
        let choices = BackgroundAccessors.getChoices(background);
        for (let choice of choices) {
            let choiceInfo = yield select(rulesEngineSelectors.getChoiceInfo);
            let defaultSubtypes = ChoiceAccessors.getDefaultSubtypes(choice);
            if (defaultSubtypes.length === 1 &&
                !choiceInfo.proficiencyModifiers.find((modifier) => ModifierAccessors.getFriendlySubtypeName(modifier) === defaultSubtypes[0])) {
                const selectOption = ChoiceAccessors.getOptions(choice).find((option) => option.label === defaultSubtypes[0]);
                if (selectOption) {
                    let choiceId = ChoiceAccessors.getId(choice);
                    if (choiceId !== null) {
                        yield call(apiBackgroundChoiceSet, {
                            type: 'SIMULATED_CHOICE',
                            payload: {
                                choiceType: ChoiceAccessors.getType(choice),
                                choiceId: choiceId,
                                optionValue: selectOption.id,
                            },
                        });
                        choicesChanged += 1;
                    }
                }
            }
        }
    }
    return choicesChanged;
}
/**
 *
 */
function* autoUpdateClassFeatureChoices() {
    let classes = yield select(rulesEngineSelectors.getClasses);
    let choicesChanged = 0;
    for (let charClass of classes) {
        let subclass = ClassAccessors.getSubclass(charClass);
        let classId = subclass === null ? ClassAccessors.getId(charClass) : subclass.id;
        let classFeatures = ClassAccessors.getClassFeatures(charClass);
        for (let classFeature of classFeatures) {
            let choices = ClassFeatureAccessors.getChoices(classFeature);
            for (let choice of choices) {
                let choiceInfo = yield select(rulesEngineSelectors.getChoiceInfo);
                let defaultSubtypes = ChoiceAccessors.getDefaultSubtypes(choice);
                if (defaultSubtypes.length === 1 &&
                    !choiceInfo.proficiencyModifiers.find((modifier) => ModifierAccessors.getFriendlySubtypeName(modifier) === defaultSubtypes[0])) {
                    const selectOption = ChoiceAccessors.getOptions(choice).find((option) => option.label === defaultSubtypes[0]);
                    if (selectOption) {
                        yield call(apiClassFeatureChoiceSet, {
                            type: 'SIMULATED_CHOICE',
                            payload: {
                                classId,
                                classFeatureId: ClassFeatureAccessors.getId(classFeature),
                                choiceType: ChoiceAccessors.getType(choice),
                                choiceId: ChoiceAccessors.getId(choice),
                                optionValue: selectOption.id,
                                parentChoiceId: ChoiceAccessors.getParentChoiceId(choice),
                            },
                        });
                        choicesChanged += 1;
                    }
                }
            }
        }
    }
    return choicesChanged;
}
/**
 *
 */
function* autoUpdateRacialTraitChoices() {
    let race = yield select(rulesEngineSelectors.getRace);
    let choicesChanged = 0;
    if (race) {
        let racialTraits = RaceAccessors.getRacialTraits(race);
        for (let racialTrait of racialTraits) {
            let choices = RacialTraitAccessors.getChoices(racialTrait);
            for (let choice of choices) {
                let choiceInfo = yield select(rulesEngineSelectors.getChoiceInfo);
                let defaultSubtypes = ChoiceAccessors.getDefaultSubtypes(choice);
                if (defaultSubtypes.length === 1 &&
                    !choiceInfo.proficiencyModifiers.find((modifier) => ModifierAccessors.getFriendlySubtypeName(modifier) === defaultSubtypes[0])) {
                    const selectOption = ChoiceAccessors.getOptions(choice).find((option) => option.label === defaultSubtypes[0]);
                    if (selectOption) {
                        yield call(apiRacialTraitChoiceSet, {
                            type: 'SIMULATED_CHOICE',
                            payload: {
                                racialTraitId: RacialTraitAccessors.getId(racialTrait),
                                choiceType: ChoiceAccessors.getType(choice),
                                choiceId: ChoiceAccessors.getId(choice),
                                optionValue: selectOption.id,
                            },
                        });
                        choicesChanged += 1;
                    }
                }
            }
        }
    }
    return choicesChanged;
}
/**
 *
 * @param action
 */
export function* handleCustomProficiencyCreate(action) {
    const data = yield call(SagaHelpers.getApiRequestData, ApiRequests.postCharacterCustomProficiency, action.payload);
    yield put(callCommitAction(characterActions.customProficiencyAdd, data));
}
/**
 *
 * @param action
 */
export function* handleCustomActionCreate(action) {
    const data = yield call(SagaHelpers.getApiRequestData, ApiRequests.postCharacterCustomAction, action.payload);
    yield put(callCommitAction(characterActions.customActionAdd, data));
}
/**
 *
 * @param action
 */
export function* handleActionCustomizationsDelete(action) {
    const { mappingId, mappingEntityTypeId } = action.payload;
    yield put(characterActions.entityValuesRemove(mappingId, mappingEntityTypeId));
}
/**
 *
 * @param apiPayload
 */
export function* apiCreatureCreate(apiPayload) {
    const creatureResponseData = yield call(SagaHelpers.getApiRequestData, ApiRequests.postCharacterCreature, apiPayload);
    for (let i = 0; i < creatureResponseData.length; i++) {
        let creatureData = creatureResponseData[i];
        yield put(callCommitAction(characterActions.creatureAdd, creatureData));
    }
    return creatureResponseData;
}
/**
 *
 * @param action
 */
export function* handleCreatureCreate(action) {
    yield call(apiCreatureCreate, action.payload);
    if (action.meta.accept) {
        action.meta.accept();
    }
}
/**
 *
 * @param action
 */
export function* handleCreatureCustomizationsDelete(action) {
    const { mappingId, mappingEntityTypeId } = action.payload;
    const creatureLookup = yield select(rulesEngineSelectors.getCreatureLookup);
    const creature = HelperUtils.lookupDataOrFallback(creatureLookup, mappingId);
    if (creature !== null) {
        const creatureProperties = {
            description: null,
            groupId: CreatureAccessors.getGroupId(creature),
            name: null,
        };
        yield put(characterActions.creatureDataSet(mappingId, creatureProperties));
    }
    yield put(characterActions.entityValuesRemove(ValueHacks.hack__toString(mappingId), ValueHacks.hack__toString(mappingEntityTypeId)));
}
/**
 *
 * @param apiPayload
 */
export function* apiItemsCreate(apiPayload) {
    const itemResponseData = yield call(SagaHelpers.getApiRequestData, ApiRequests.postCharacterInventoryItem, apiPayload);
    const addedItems = itemResponseData.addItems === null ? [] : itemResponseData.addItems;
    for (let i = 0; i < addedItems.length; i++) {
        yield put(callCommitAction(characterActions.itemAdd, addedItems[i]));
    }
    yield call(handleDataUpdates, itemResponseData);
    return addedItems;
}
/**
 *
 * @param action
 */
export function* handleShortRest(action) {
    const data = yield call(SagaHelpers.getApiRequestData, ApiRequests.postCharacterRestShort, action.payload);
    yield call(handleDataUpdates, data);
}
/**
 *
 * @param action
 */
export function* handleLongRest(action) {
    const data = yield call(SagaHelpers.getApiRequestData, ApiRequests.postCharacterRestLong, action.payload);
    yield call(handleDataUpdates, data);
}
/**
 *
 * @param result
 */
function* handleDataUpdates(result) {
    let resultKeys = Object.keys(result);
    let componentUpdates = {};
    for (let i = 0; i < resultKeys.length; i++) {
        switch (resultKeys[i]) {
            case 'actions':
                componentUpdates.actions = result.actions;
                break;
            case 'activeSourceCategories':
                yield put(callCommitAction(characterActions.activeSourceCategoriesSet, result.activeSourceCategories));
                break;
            case 'background':
                yield put(callCommitAction(characterActions.backgroundSet, result.background));
                break;
            case 'bonusHitPoints':
                yield put(callCommitAction(characterActions.bonusHitPointsSet, result.bonusHitPoints));
                break;
            case 'classes':
                yield put(callCommitAction(characterActions.classesSet, result.classes));
                break;
            case 'choices':
                componentUpdates.choices = result.choices;
                break;
            case 'feats':
                yield put(callCommitAction(characterActions.featsSet, result.feats));
                break;
            case 'baseHitPoints':
                yield put(callCommitAction(characterActions.baseHitPointsSet, result.baseHitPoints));
                break;
            case 'modifiers':
                componentUpdates.modifiers = result.modifiers;
                break;
            case 'options':
                componentUpdates.options = result.options;
                break;
            case 'overrideHitPoints':
                yield put(callCommitAction(characterActions.overrideHitPointsSet, result.overrideHitPoints));
                break;
            case 'pactMagic':
                yield put(callCommitAction(characterActions.pactMagicSet, result.pactMagic));
                break;
            case 'race':
                yield put(callCommitAction(characterActions.raceSet, result.race));
                break;
            case 'spellSlots':
                yield put(callCommitAction(characterActions.spellSlotsSet, result.spellSlots));
                break;
            case 'spells':
                componentUpdates.spells = result.spells;
                break;
            case 'temporaryHitPoints':
                //TODO get separate updates for these
                if (result.hasOwnProperty('removedHitPoints')) {
                    yield put(callCommitAction(characterActions.hitPointsSet, result.removedHitPoints, result.temporaryHitPoints));
                }
                break;
            case 'removedHitPoints':
                if (result.hasOwnProperty('temporaryHitPoints')) {
                    yield put(callCommitAction(characterActions.hitPointsSet, result.removedHitPoints, result.temporaryHitPoints));
                }
                break;
            case 'conditions':
                yield put(callCommitAction(characterActions.conditionsSet, result.conditions));
                break;
            case 'deathSaves':
                yield put(callCommitAction(characterActions.deathSavesSet, result.deathSaves.failCount, result.deathSaves.successCount));
                break;
        }
    }
    let classSpells = yield select(characterSelectors.getClassSpells);
    let updateClassSpells = false;
    if (result.hasOwnProperty('removeClassSpells')) {
        classSpells = classSpells.filter((classSpell) => !result.removeClassSpells.includes(classSpell.characterClassId));
        updateClassSpells = true;
    }
    if (result.hasOwnProperty('updateClassSpells')) {
        result.updateClassSpells.forEach((updateClassSpell) => {
            let idx = classSpells.findIndex((classSpell) => classSpell.characterClassId === updateClassSpell.characterClassId);
            classSpells[idx] = updateClassSpell;
        });
        updateClassSpells = true;
    }
    if (result.hasOwnProperty('addClassSpells')) {
        classSpells = [...classSpells, ...result.addClassSpells];
        updateClassSpells = true;
    }
    if (result.hasOwnProperty('classSpells')) {
        classSpells = result.classSpells;
        updateClassSpells = true;
    }
    if (updateClassSpells) {
        componentUpdates['classSpells'] = classSpells;
    }
    if (Object.keys(componentUpdates).length) {
        yield put(callCommitAction(characterActions.characterComponentsSet, componentUpdates));
    }
}
export function* handleShowHelpTextSetRequest(action) {
    yield call(SagaHelpers.sendApiRequest, ApiRequests.putCharacterHelpText, action.payload);
    yield put(characterActions.showHelpTextSet(action.payload.showHelpText));
}
export function* handleStartingEquipmentTypeSet(action) {
    yield call(SagaHelpers.sendApiRequest, ApiRequests.putCharacterInventoryStartingType, action.payload);
    yield put(characterActions.startingEquipmentTypeSetCommit(action.payload));
}
export function* handleSetAbilityScoreTypeRequest(action) {
    const { abilityScoreType } = action.payload;
    let requestParams = {
        abilityScoreType,
    };
    yield call(SagaHelpers.sendApiRequest, ApiRequests.putCharacterAbilityScoreType, requestParams);
    yield put(characterActions.abilityScoreTypeSetCommit(abilityScoreType));
    let newScoreValue;
    switch (action.payload.abilityScoreType) {
        case AbilityScoreTypeEnum.STANDARD_ARRAY:
        case AbilityScoreTypeEnum.MANUAL:
            newScoreValue = null;
            break;
        case AbilityScoreTypeEnum.POINT_BUY:
        default:
            newScoreValue = 8;
            break;
    }
    const ruleData = yield select(rulesEngineSelectors.getRuleData);
    const stats = RuleDataAccessors.getStats(ruleData);
    for (let i = 0; i < stats.length; i++) {
        let statData = stats[i];
        yield put(callCommitAction(characterActions.abilityScoreBaseSet, statData.id, newScoreValue));
    }
}
export function* handlePremadeInfoGet(action) {
    const premadeCharacterResponse = yield call(SagaHelpers.sendApiRequest, ApiRequests.getPremadeInfo, { characterId: action.payload.characterId });
    let responseData = ApiAdapterUtils.getResponseData(premadeCharacterResponse);
    if (responseData) {
        yield put(characterActions.premadeInfoSetCommit(responseData));
    }
}
