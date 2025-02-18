import { uniqueId } from 'lodash';
import { call, put, select, takeEvery } from 'redux-saga/effects';
import * as characterSelectors from "../../selectors/character";
import * as types from '../../actions/character/actionTypes';
import { syncTransactionActions } from '../../actions/syncTransaction';
import * as apiShared from '../../api/requests';
import { OverrideApiException } from '../../apiAdapter';
import { SpellAccessors } from '../../engine/Spell';
import { CharacterLoadingStatusEnum } from '../../reducers/constants';
import * as characterEnvSelectors from '../../selectors/characterEnv';
import * as syncTransactionSelectors from '../../selectors/syncTransaction';
import * as sagaHandlers from './handlers';
const SYNC_ACTION_LOOKUP = {
    //ACTION
    [types.CUSTOM_ACTION_CREATE]: true,
    //BACKGROUND
    [types.BACKGROUND_CHOOSE]: true,
    [types.BACKGROUND_CHOICE_SET_REQUEST]: true,
    [types.BACKGROUND_HAS_CUSTOM_SET_REQUEST]: true,
    [types.BACKGROUND_CUSTOM_SET_REQUEST]: true,
    //CHARACTER
    [types.XP_SET_REQUEST]: true,
    [types.RANDOM_NAME_REQUEST]: true,
    [types.RESTORE_LIFE]: true,
    [types.PORTRAIT_UPLOAD]: true,
    [types.CUSTOM_PROFICIENCY_CREATE]: true,
    [types.SHORT_REST]: true,
    [types.LONG_REST]: true,
    [types.STARTING_EQUIPMENT_ADD_REQUEST]: true,
    [types.STARTING_GOLD_ADD_REQUEST]: true,
    //CLASS
    [types.CLASS_ADD_REQUEST]: true,
    [types.CLASS_REMOVE_REQUEST]: true,
    [types.CLASS_LEVEL_SET_REQUEST]: true,
    //CLASS_FEATURE
    [types.CLASS_FEATURE_CHOICE_SET_REQUEST]: true,
    //CONDITION
    [types.CONDITION_ADD]: true,
    [types.CONDITION_SET]: true,
    [types.CONDITION_REMOVE]: true,
    //CONFIGURATION
    [types.ABILITY_SCORE_TYPE_SET_REQUEST]: true,
    //CORE
    [types.ACTIVE_SOURCE_CATEGORIES_SET]: true,
    [types.ACTIVE_SOURCES_SET]: true,
    [types.PREFERENCE_CHOOSE]: true,
    [types.SEND_SOCIAL_IMAGE_DATA]: true,
    //CREATURE
    [types.CREATURE_CREATE]: true,
    //FEAT
    [types.FEAT_CHOICE_SET_REQUEST]: true,
    [types.ADHOC_FEAT_CREATE]: true,
    [types.ADHOC_FEAT_REMOVE]: true,
    [types.SET_ENTITY_FEAT]: true,
    //ITEM
    [types.ITEM_CREATE]: true,
    [types.CUSTOM_ITEM_CREATE]: true,
    [types.ITEM_DESTROY]: true,
    [types.CUSTOM_ITEM_DESTROY]: true,
    //CURRENCY
    [types.CURRENCY_TRANSACTION_SET]: true,
    //OPTIONAL_FEATURES
    [types.OPTIONAL_CLASS_FEATURE_CREATE]: true,
    [types.OPTIONAL_CLASS_FEATURE_SET_REQUEST]: true,
    [types.OPTIONAL_CLASS_FEATURE_DESTROY]: true,
    [types.OPTIONAL_ORIGIN_CREATE]: true,
    [types.OPTIONAL_ORIGIN_SET_REQUEST]: true,
    [types.OPTIONAL_ORIGIN_DESTROY]: true,
    //RACE
    [types.RACE_CHOOSE]: true,
    //RACIAL_TRAIT
    [types.RACIAL_TRAIT_CHOICE_SET_REQUEST]: true,
    //SPELL
    [types.SPELL_CREATE]: true,
};
/**
 *
 * @param action
 */
function isSyncAction(action) {
    return !!SYNC_ACTION_LOOKUP[action.type];
}
/**
 *
 * @param meta
 * //TODO find a better solution for checking props on meta
 */
function isCommonCommitAction(meta) {
    return meta.commit !== undefined;
}
/**
 *
 * @param meta
 * //TODO find a better solution for checking props on meta
 */
function isPostAction(meta) {
    return meta.postAction !== undefined;
}
/**
 *
 */
export default function* saga() {
    yield takeEvery(Object.keys(types).map((key) => types[key]), filter);
}
/**
 *
 * @param action
 */
function* filter(action) {
    var _a;
    const characterLoadingStatus = yield select(characterEnvSelectors.getLoadingStatus);
    //TODO: CanEdit
    // const isReadonly: ReturnType<typeof characterEnvSelectors.getIsReadonly> = yield select(
    //     characterEnvSelectors.getIsReadonly,
    // );
    const canEdit = yield select(characterSelectors.getCanEdit);
    if (!canEdit && characterLoadingStatus === CharacterLoadingStatusEnum.LOADED) {
        return;
    }
    let transactionInitiatorId = null;
    if (action.meta) {
        transactionInitiatorId = yield call(executeSyncTransactionActivate, action);
        try {
            yield call(executeApi, action);
            yield call(executeHandler, action);
            yield call(executePostAction, action);
            yield call(executeSyncTransactionDeactivate, action, transactionInitiatorId);
        }
        catch (error) {
            if (error instanceof OverrideApiException) {
                yield call(executeSyncTransactionDeactivate, action, transactionInitiatorId);
                if ((_a = action.meta) === null || _a === void 0 ? void 0 : _a.reject) {
                    action.meta.reject();
                }
            }
            else {
                throw error;
            }
        }
    }
}
/**
 *
 * @param action
 */
function* executePostAction(action) {
    if (isPostAction(action.meta)) {
        for (let i = 0; i < action.meta.postAction.type.length; i++) {
            yield put({
                type: action.meta.postAction.type[i],
                payload: action.payload,
            });
        }
    }
}
/**
 *
 * @param action
 */
function* executeSyncTransactionActivate(action) {
    const isSyncTransactionActive = yield select(syncTransactionSelectors.getActive);
    let transactionInitiatorId = null;
    if (isSyncAction(action) && !isSyncTransactionActive) {
        transactionInitiatorId = uniqueId();
        yield put(syncTransactionActions.activate(transactionInitiatorId));
    }
    return transactionInitiatorId;
}
/**
 *
 * @param action
 * @param transactionInitiatorId
 */
function* executeSyncTransactionDeactivate(action, transactionInitiatorId) {
    if (isSyncAction(action)) {
        let syncTransactionInitiator = yield select(syncTransactionSelectors.getInitiator);
        if (syncTransactionInitiator === transactionInitiatorId) {
            yield put(syncTransactionActions.deactivate());
        }
    }
}
/**
 *
 * @param action
 */
function* executeApi(action) {
    let apiLookup = {
        // ACTION
        [types.ACTION_USE_SET]: apiShared.putCharacterActionLimitedUse,
        [types.CUSTOM_ACTION_REMOVE]: apiShared.deleteCharacterCustomAction,
        [types.CUSTOM_ACTION_SET]: apiShared.putCharacterCustomAction,
        //CHARACTER
        [types.XP_SET]: apiShared.putCharacterProgression,
        [types.NAME_SET]: apiShared.putCharacterDescriptionName,
        [types.NOTE_SET]: apiShared.putCharacterDescriptionNotes,
        [types.TRAIT_SET]: apiShared.putCharacterDescriptionTraits,
        [types.BASE_HIT_POINTS_SET]: apiShared.putCharacterLifeHpBase,
        [types.BONUS_HIT_POINTS_SET]: apiShared.putCharacterLifeHpBonus,
        [types.OVERRIDE_HIT_POINTS_SET]: apiShared.putCharacterLifeHpOverride,
        [types.HAIR_SET]: apiShared.putCharacterDescriptionHair,
        [types.SKIN_SET]: apiShared.putCharacterDescriptionSkin,
        [types.EYES_SET]: apiShared.putCharacterDescriptionEyes,
        [types.HEIGHT_SET]: apiShared.putCharacterDescriptionHeight,
        [types.WEIGHT_SET]: apiShared.putCharacterDescriptionWeight,
        [types.AGE_SET]: apiShared.putCharacterDescriptionAge,
        [types.GENDER_SET]: apiShared.putCharacterDescriptionGender,
        [types.ALIGNMENT_SET]: apiShared.putCharacterDescriptionAlignment,
        [types.LIFESTYLE_SET]: apiShared.putCharacterDescriptionLifestyle,
        [types.FAITH_SET]: apiShared.putCharacterDescriptionFaith,
        [types.PORTRAIT_SET]: apiShared.putCharacterDecorationPortrait,
        [types.HIT_POINTS_SET]: apiShared.putCharacterLifeHpDamageTaken,
        [types.INSPIRATION_SET]: apiShared.putCharacterInspiration,
        [types.CURRENCIES_SET]: apiShared.putCharacterInventoryCurrency,
        [types.CURRENCY_COPPER_SET]: apiShared.putCharacterInventoryCurrencyCopper,
        [types.ITEM_CURRENCY_COPPER_SET]: apiShared.putCharacterInventoryCurrencyCopper,
        [types.CURRENCY_ELECTRUM_SET]: apiShared.putCharacterInventoryCurrencyElectrum,
        [types.ITEM_CURRENCY_ELECTRUM_SET]: apiShared.putCharacterInventoryCurrencyElectrum,
        [types.CURRENCY_GOLD_SET]: apiShared.putCharacterInventoryCurrencyGold,
        [types.ITEM_CURRENCY_GOLD_SET]: apiShared.putCharacterInventoryCurrencyGold,
        [types.CURRENCY_PLATINUM_SET]: apiShared.putCharacterInventoryCurrencyPlatinum,
        [types.ITEM_CURRENCY_PLATINUM_SET]: apiShared.putCharacterInventoryCurrencyPlatinum,
        [types.CURRENCY_SILVER_SET]: apiShared.putCharacterInventoryCurrencySilver,
        [types.ITEM_CURRENCY_SILVER_SET]: apiShared.putCharacterInventoryCurrencySilver,
        [types.DEATHSAVES_SET]: apiShared.putCharacterLifeDeathSaves,
        [types.MOVEMENT_ADD]: apiShared.postCharacterCustomMovement,
        [types.MOVEMENT_SET]: apiShared.putCharacterCustomMovement,
        [types.MOVEMENT_REMOVE]: apiShared.deleteCharacterCustomMovement,
        [types.SENSE_ADD]: apiShared.postCharacterCustomSense,
        [types.SENSE_SET]: apiShared.putCharacterCustomSense,
        [types.SENSE_REMOVE]: apiShared.deleteCharacterCustomSense,
        [types.CUSTOM_PROFICIENCY_REMOVE]: apiShared.deleteCharacterCustomProficiency,
        [types.CUSTOM_PROFICIENCY_SET]: apiShared.putCharacterCustomProficiency,
        [types.CUSTOM_DEFENSE_ADJUSTMENT_ADD]: apiShared.postCharacterCustomDefenseAdjustment,
        [types.CUSTOM_DEFENSE_ADJUSTMENT_SET]: apiShared.putCharacterCustomDefenseAdjustment,
        [types.CUSTOM_DEFENSE_ADJUSTMENT_REMOVE]: apiShared.deleteCharacterCustomDefenseAdjustment,
        //CORE
        [types.ACTIVE_SOURCE_CATEGORIES_SET]: apiShared.putCharacterSourceCategories,
        [types.ACTIVE_SOURCES_SET]: apiShared.putCharacterSources,
        [types.BACKDROP_SET]: apiShared.putCharacterDecorationBackdrop,
        [types.FRAME_SET]: apiShared.putCharacterDecorationFrame,
        [types.THEME_SET]: apiShared.putCharacterDecorationThemeColor,
        //CREATURE
        [types.CREATURE_REMOVE]: apiShared.deleteCharacterCreature,
        [types.CREATURE_DATA_SET]: apiShared.putCharacterCreature,
        [types.CREATURE_HIT_POINTS_SET]: apiShared.putCharacterCreatureHp,
        [types.CREATURE_ACTIVE_SET]: apiShared.putCharacterCreatureStatus,
        //ITEM
        //TODO v5.1: remove this v5 guy when mobile moves up to Custom Items
        [types.CUSTOM_ITEM_REMOVE]: apiShared.deleteCharacterCustomItemV5,
        [types.ITEM_REMOVE]: apiShared.deleteCharacterInventoryItem,
        //SPELL
        [types.SPELL_REMOVE]: apiShared.deleteCharacterSpell,
        [types.SPELL_USE_SET]: apiShared.putCharacterActionLimitedUse,
        [types.SPELL_LEVEL_SPELL_SLOTS_SET]: apiShared.putCharacterSpellSlots,
        [types.SPELL_LEVEL_PACT_MAGIC_SLOTS_SET]: apiShared.putCharacterSpellPactMagic,
        //VALUE
        [types.VALUE_SET]: apiShared.putCharacterCustomValue,
        [types.VALUE_REMOVE]: apiShared.deleteCharacterCustomValue,
        [types.ENTITY_VALUES_REMOVE]: apiShared.deleteCharacterCustomEntityValues,
        //PREMADE INFO
        [types.PREMADE_INFO_ADD]: apiShared.addPremadeInfo,
        [types.PREMADE_INFO_UPDATE]: apiShared.setPremadeInfo,
        [types.PREMADE_INFO_DELETE]: apiShared.deletePremadeInfo,
    };
    let apiPayload = action.payload;
    //transforming payloads where api payload is different from action payload
    switch (action.type) {
        //ACTION
        case types.ACTION_USE_SET: {
            const payload = {
                id: action.payload.id,
                entityTypeId: action.payload.entityTypeId,
                uses: action.payload.uses,
            };
            apiPayload = payload;
            break;
        }
        case types.CUSTOM_ACTION_SET: {
            const payload = Object.assign({ id: action.payload.id }, action.payload.properties);
            apiPayload = payload;
            break;
        }
        //CHARACTER
        case types.NOTE_SET: {
            const payload = {
                [action.payload.noteType]: action.payload.content,
            };
            apiPayload = payload;
            break;
        }
        case types.TRAIT_SET: {
            const payload = {
                [action.payload.traitType]: action.payload.content,
            };
            apiPayload = payload;
            break;
        }
        case types.DEATHSAVES_SET: {
            const payload = {
                failCount: action.payload.fails,
                successCount: action.payload.successes,
            };
            apiPayload = payload;
            break;
        }
        case types.CUSTOM_PROFICIENCY_SET: {
            const payload = Object.assign({ id: action.payload.id }, action.payload.properties);
            apiPayload = payload;
            break;
        }
        //CORE
        case types.BACKDROP_SET: {
            const { backdropAvatarId, largeBackdropAvatarId, smallBackdropAvatarId, thumbnailBackdropAvatarId } = action.payload.backdrop;
            const payload = {
                backdropAvatarId,
                largeBackdropAvatarId,
                smallBackdropAvatarId,
                thumbnailBackdropAvatarId,
            };
            apiPayload = payload;
            break;
        }
        case types.FRAME_SET: {
            const { frameAvatarId } = action.payload.frame;
            const payload = {
                frameAvatarId,
            };
            apiPayload = payload;
            break;
        }
        case types.THEME_SET: {
            const { themeColor } = action.payload;
            const payload = {
                themeColorId: themeColor ? themeColor.themeColorId : themeColor,
            };
            apiPayload = payload;
            break;
        }
        //CREATURE
        case types.CREATURE_DATA_SET: {
            const payload = Object.assign({ id: action.payload.id }, action.payload.properties);
            apiPayload = payload;
            break;
        }
        //ITEM
        case types.ITEM_CHARGES_SET: {
            const payload = {
                id: action.payload.id,
                charges: action.payload.uses,
            };
            apiPayload = payload;
            break;
        }
        //SPELL
        case types.SPELL_REMOVE: {
            const { spell, characterClassId } = action.payload;
            const payload = {
                spellId: SpellAccessors.getId(spell),
                characterClassId,
                entityTypeId: SpellAccessors.getMappingEntityTypeId(spell),
                id: SpellAccessors.getMappingId(spell),
            };
            apiPayload = payload;
            break;
        }
        case types.SPELL_USE_SET: {
            const { id, entityTypeId, uses } = action.payload;
            const payload = {
                id,
                entityTypeId,
                uses,
            };
            apiPayload = payload;
            break;
        }
        default:
        // not implemented
    }
    let apiRequest = apiLookup[action.type] ? apiLookup[action.type] : null;
    if (isCommonCommitAction(action.meta) && apiRequest !== null) {
        yield put({
            type: action.meta.commit.type,
            payload: action.payload,
            meta: {},
        });
        if (action.meta.accept) {
            action.meta.accept();
        }
    }
    if (apiRequest !== null) {
        yield call(apiRequest, apiPayload);
    }
}
function* executeHandler(action) {
    let handlerLookup = {
        //ACTION
        [types.ACTION_CUSTOMIZATIONS_DELETE]: sagaHandlers.handleActionCustomizationsDelete,
        [types.CUSTOM_ACTION_CREATE]: sagaHandlers.handleCustomActionCreate,
        //BACKGROUND
        [types.BACKGROUND_CHOOSE]: sagaHandlers.handleBackgroundSetRequest,
        [types.BACKGROUND_CHOICE_SET_REQUEST]: sagaHandlers.handleBackgroundChoiceSetRequest,
        [types.BACKGROUND_HAS_CUSTOM_SET_REQUEST]: sagaHandlers.handleBackgroundHasCustomSetRequest,
        [types.BACKGROUND_CUSTOM_SET_REQUEST]: sagaHandlers.handleBackgroundCustomSetRequest,
        //CAMPAIGN_SETTING
        [types.CAMPAIGN_SETTING_SET_REQUEST]: sagaHandlers.handleCampaignSettingSetRequest,
        //CHARACTER
        [types.CHARACTER_LOAD]: sagaHandlers.handleCharacterLoad,
        [types.XP_SET_REQUEST]: sagaHandlers.handleXpSetRequest,
        [types.RANDOM_NAME_REQUEST]: sagaHandlers.handleRandomNameRequest,
        [types.RESTORE_LIFE]: sagaHandlers.handleRestoreLife,
        [types.PORTRAIT_UPLOAD]: sagaHandlers.handlePortraitUpload,
        [types.CUSTOM_PROFICIENCY_CREATE]: sagaHandlers.handleCustomProficiencyCreate,
        [types.SHORT_REST]: sagaHandlers.handleShortRest,
        [types.LONG_REST]: sagaHandlers.handleLongRest,
        [types.ABILITY_SCORE_SET]: sagaHandlers.handleAbilityScoreSet,
        [types.STARTING_EQUIPMENT_ADD_REQUEST]: sagaHandlers.handleStartingEquipmentAdd,
        [types.STARTING_GOLD_ADD_REQUEST]: sagaHandlers.handleStartingGoldAdd,
        [types.LOAD_LAZY_CHARACTER_DATA]: sagaHandlers.handleLoadCharacterLazyData,
        //CLASS
        [types.CLASS_ADD_REQUEST]: sagaHandlers.handleClassAddRequest,
        [types.CLASS_REMOVE_REQUEST]: sagaHandlers.handleClassRemoveRequest,
        [types.CLASS_LEVEL_SET_REQUEST]: sagaHandlers.handleClassLevelSetRequest,
        //CLASS_FEATURE
        [types.CLASS_FEATURE_CHOICE_SET_REQUEST]: sagaHandlers.handleClassFeatureChoiceSetRequest,
        //CONDITION
        [types.CONDITION_SET]: sagaHandlers.handleConditionSet,
        [types.CONDITION_ADD]: sagaHandlers.handleConditionAdd,
        [types.CONDITION_REMOVE]: sagaHandlers.handleConditionRemove,
        //CONFIGURATION
        [types.ABILITY_SCORE_TYPE_SET_REQUEST]: sagaHandlers.handleSetAbilityScoreTypeRequest,
        [types.SHOW_HELP_TEXT_SET_REQUEST]: sagaHandlers.handleShowHelpTextSetRequest,
        [types.STARTING_EQUIPMENT_TYPE_SET]: sagaHandlers.handleStartingEquipmentTypeSet,
        //CORE
        [types.PREFERENCE_CHOOSE]: sagaHandlers.handlePreferenceChoose,
        [types.SEND_SOCIAL_IMAGE_DATA]: sagaHandlers.handleSendSocialImageData,
        //CREATURE
        [types.CREATURE_CREATE]: sagaHandlers.handleCreatureCreate,
        [types.CREATURE_CUSTOMIZATIONS_DELETE]: sagaHandlers.handleCreatureCustomizationsDelete,
        //FEAT
        [types.FEAT_CHOICE_SET_REQUEST]: sagaHandlers.handleFeatChoiceSetRequest,
        [types.ADHOC_FEAT_CREATE]: sagaHandlers.handleAdhocFeatCreate,
        [types.ADHOC_FEAT_REMOVE]: sagaHandlers.handleAdhocFeatRemove,
        [types.SET_ENTITY_FEAT]: sagaHandlers.handleSetEntityFeat,
        //ITEM
        [types.ITEM_CREATE]: sagaHandlers.handleItemCreate,
        [types.CUSTOM_ITEM_CREATE]: sagaHandlers.handleCustomItemCreate,
        [types.CUSTOM_ITEM_SET]: sagaHandlers.handleCustomItemSet,
        [types.ITEM_CUSTOMIZATIONS_DELETE]: sagaHandlers.handleItemCustomizationsDelete,
        [types.ITEM_EQUIPPED_SET]: sagaHandlers.handleItemEquippedSet,
        [types.ITEM_ATTUNE_SET]: sagaHandlers.handleItemAttuneSet,
        [types.ITEM_QUANTITY_SET]: sagaHandlers.handleItemQuantitySet,
        [types.ITEM_DESTROY]: sagaHandlers.handleItemDestroy,
        [types.CUSTOM_ITEM_DESTROY]: sagaHandlers.handleCustomItemDestroy,
        [types.ITEM_CHARGES_SET]: sagaHandlers.handleItemChargesSet,
        [types.ITEM_MOVE_SET]: sagaHandlers.handleItemMove,
        //CURRENCY
        [types.CURRENCY_TRANSACTION_SET]: sagaHandlers.handleCurrencyTransactionSet,
        //OPTIONAL_FEATURES
        [types.OPTIONAL_CLASS_FEATURE_CREATE]: sagaHandlers.handleOptionalClassFeatureCreate,
        [types.OPTIONAL_CLASS_FEATURE_SET_REQUEST]: sagaHandlers.handleOptionalClassFeatureSetRequest,
        [types.OPTIONAL_CLASS_FEATURE_DESTROY]: sagaHandlers.handleOptionalClassFeatureDestroy,
        [types.OPTIONAL_ORIGIN_CREATE]: sagaHandlers.handleOptionalOriginCreate,
        [types.OPTIONAL_ORIGIN_SET_REQUEST]: sagaHandlers.handleOptionalOriginSetRequest,
        [types.OPTIONAL_ORIGIN_DESTROY]: sagaHandlers.handleOptionalOriginDestroy,
        //RACE
        [types.RACE_CHOOSE]: sagaHandlers.handleRaceChoose,
        //RACIAL_TRAIT
        [types.RACIAL_TRAIT_CHOICE_SET_REQUEST]: sagaHandlers.handleRacialTraitChoiceSetRequest,
        //SPELL
        [types.SPELL_CREATE]: sagaHandlers.handleSpellCreate,
        [types.SPELL_REMOVE]: sagaHandlers.handleSpellRemove,
        [types.SPELL_CUSTOMIZATIONS_DELETE]: sagaHandlers.handleSpellCustomizationsDelete,
        [types.SPELL_PREPARED_SET]: sagaHandlers.handleSpellPrepareSet,
        //PREMADE INFO
        [types.PREMADE_INFO_GET]: sagaHandlers.handlePremadeInfoGet,
    };
    let handler = handlerLookup[action.type] ? handlerLookup[action.type] : null;
    if (handler !== null) {
        yield call(handler, action);
    }
}
