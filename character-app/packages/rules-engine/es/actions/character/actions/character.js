import * as actionTypes from '../actionTypes';
/**
 *
 */
export function characterLoad(characterId, requestParams = {}, config = {}) {
    return {
        type: actionTypes.CHARACTER_LOAD,
        payload: {
            characterId,
            requestParams,
            config: Object.assign({ includeAlwaysKnownSpells: false }, config),
        },
        meta: {
            postAction: {
                type: [actionTypes.CHARACTER_LOAD_POST_ACTION],
            },
        },
    };
}
export function loadLazyCharacterData() {
    return {
        type: actionTypes.LOAD_LAZY_CHARACTER_DATA,
        payload: {},
        meta: {},
    };
}
/**
 *
 * @param currentXp
 */
export function xpSetRequest(currentXp) {
    return {
        type: actionTypes.XP_SET_REQUEST,
        payload: {
            currentXp,
        },
        meta: {},
    };
}
/**
 *
 * @param currentXp
 */
export function xpSet(currentXp) {
    return {
        type: actionTypes.XP_SET,
        payload: {
            currentXp,
        },
        meta: {
            commit: {
                type: actionTypes.XP_SET_COMMIT,
            },
        },
    };
}
/**
 *
 */
export function randomNameRequest() {
    return {
        type: actionTypes.RANDOM_NAME_REQUEST,
        payload: {},
        meta: {},
    };
}
/**
 *
 * @param name
 */
export function nameSet(name) {
    return {
        type: actionTypes.NAME_SET,
        payload: {
            name,
        },
        meta: {
            commit: {
                type: actionTypes.NAME_SET_COMMIT,
            },
        },
    };
}
/**
 *
 * @param restoreType
 */
export function restoreLife(restoreType) {
    return {
        type: actionTypes.RESTORE_LIFE,
        payload: {
            restoreType,
        },
        meta: {},
    };
}
/**
 *
 * @param name
 * @param type
 */
export function customProficiencyCreate(name, type) {
    return {
        type: actionTypes.CUSTOM_PROFICIENCY_CREATE,
        payload: {
            name,
            type,
        },
        meta: {},
    };
}
/**
 *
 * @param classHitDiceUsed
 * @param resetMaxHpModifier
 */
export function shortRest(classHitDiceUsed, resetMaxHpModifier) {
    return {
        type: actionTypes.SHORT_REST,
        payload: {
            classHitDiceUsed,
            resetMaxHpModifier,
        },
        meta: {},
    };
}
/**
 *
 * @param resetMaxHpModifier
 * @param adjustConditionLevel
 */
export function longRest(resetMaxHpModifier, adjustConditionLevel) {
    return {
        type: actionTypes.LONG_REST,
        payload: {
            resetMaxHpModifier,
            adjustConditionLevel,
        },
        meta: {},
    };
}
/**
 *
 * @param noteType
 * @param content
 */
export function noteSet(noteType, content) {
    return {
        type: actionTypes.NOTE_SET,
        payload: {
            noteType,
            content,
        },
        meta: {
            commit: {
                type: actionTypes.NOTE_SET_COMMIT,
            },
        },
    };
}
/**
 *
 * @param traitType
 * @param content
 */
export function traitSet(traitType, content) {
    return {
        type: actionTypes.TRAIT_SET,
        payload: {
            traitType,
            content,
        },
        meta: {
            commit: {
                type: actionTypes.TRAIT_SET_COMMIT,
            },
        },
    };
}
/**
 *
 * @param baseHitPoints
 */
export function baseHitPointsSet(baseHitPoints) {
    return {
        type: actionTypes.BASE_HIT_POINTS_SET,
        payload: {
            baseHitPoints,
        },
        meta: {
            commit: {
                type: actionTypes.BASE_HIT_POINTS_SET_COMMIT,
            },
        },
    };
}
/**
 *
 * @param bonusHitPoints
 */
export function bonusHitPointsSet(bonusHitPoints) {
    return {
        type: actionTypes.BONUS_HIT_POINTS_SET,
        payload: {
            bonusHitPoints,
        },
        meta: {
            commit: {
                type: actionTypes.BONUS_HIT_POINTS_SET_COMMIT,
            },
        },
    };
}
/**
 *
 * @param overrideHitPoints
 */
export function overrideHitPointsSet(overrideHitPoints) {
    return {
        type: actionTypes.OVERRIDE_HIT_POINTS_SET,
        payload: {
            overrideHitPoints,
        },
        meta: {
            commit: {
                type: actionTypes.OVERRIDE_HIT_POINTS_SET_COMMIT,
            },
        },
    };
}
/**
 *
 * @param statId
 * @param type
 * @param value
 */
export function abilityScoreSet(statId, type, value) {
    return {
        type: actionTypes.ABILITY_SCORE_SET,
        payload: {
            statId,
            type,
            value,
        },
        meta: {},
    };
}
/**
 *
 * @param hair
 */
export function hairSet(hair) {
    return {
        type: actionTypes.HAIR_SET,
        payload: {
            hair,
        },
        meta: {
            commit: {
                type: actionTypes.HAIR_SET_COMMIT,
            },
        },
    };
}
/**
 *
 * @param skin
 */
export function skinSet(skin) {
    return {
        type: actionTypes.SKIN_SET,
        payload: {
            skin,
        },
        meta: {
            commit: {
                type: actionTypes.SKIN_SET_COMMIT,
            },
        },
    };
}
/**
 *
 * @param eyes
 */
export function eyesSet(eyes) {
    return {
        type: actionTypes.EYES_SET,
        payload: {
            eyes,
        },
        meta: {
            commit: {
                type: actionTypes.EYES_SET_COMMIT,
            },
        },
    };
}
/**
 *
 * @param height
 */
export function heightSet(height) {
    return {
        type: actionTypes.HEIGHT_SET,
        payload: {
            height,
        },
        meta: {
            commit: {
                type: actionTypes.HEIGHT_SET_COMMIT,
            },
        },
    };
}
/**
 *
 * @param weight
 */
export function weightSet(weight) {
    return {
        type: actionTypes.WEIGHT_SET,
        payload: {
            weight,
        },
        meta: {
            commit: {
                type: actionTypes.WEIGHT_SET_COMMIT,
            },
        },
    };
}
/**
 *
 * @param age
 */
export function ageSet(age) {
    return {
        type: actionTypes.AGE_SET,
        payload: {
            age,
        },
        meta: {
            commit: {
                type: actionTypes.AGE_SET_COMMIT,
            },
        },
    };
}
/**
 *
 * @param gender
 */
export function genderSet(gender) {
    return {
        type: actionTypes.GENDER_SET,
        payload: {
            gender,
        },
        meta: {
            commit: {
                type: actionTypes.GENDER_SET_COMMIT,
            },
        },
    };
}
/**
 *
 * @param alignmentId
 */
export function alignmentSet(alignmentId) {
    return {
        type: actionTypes.ALIGNMENT_SET,
        payload: {
            alignmentId,
        },
        meta: {
            commit: {
                type: actionTypes.ALIGNMENT_SET_COMMIT,
            },
        },
    };
}
/**
 *
 * @param lifestyleId
 */
export function lifestyleSet(lifestyleId) {
    return {
        type: actionTypes.LIFESTYLE_SET,
        payload: {
            lifestyleId,
        },
        meta: {
            commit: {
                type: actionTypes.LIFESTYLE_SET_COMMIT,
            },
        },
    };
}
/**
 *
 * @param faith
 */
export function faithSet(faith) {
    return {
        type: actionTypes.FAITH_SET,
        payload: {
            faith,
        },
        meta: {
            commit: {
                type: actionTypes.FAITH_SET_COMMIT,
            },
        },
    };
}
/**
 *
 * @param removedHitPoints
 * @param temporaryHitPoints
 */
export function hitPointsSet(removedHitPoints, temporaryHitPoints) {
    return {
        type: actionTypes.HIT_POINTS_SET,
        payload: {
            removedHitPoints,
            temporaryHitPoints,
        },
        meta: {
            commit: {
                type: actionTypes.HIT_POINTS_SET_COMMIT,
            },
        },
    };
}
/**
 *
 * @param inspiration
 */
export function inspirationSet(inspiration) {
    return {
        type: actionTypes.INSPIRATION_SET,
        payload: {
            inspiration,
        },
        meta: {
            commit: {
                type: actionTypes.INSPIRATION_SET_COMMIT,
            },
        },
    };
}
/**
 *
 * @param currencies
 * @param destinationEntityTypeId
 * @param destinationEntityId
 * @param accept
 * @param reject
 */
export function currenciesSet(currencies, destinationEntityTypeId, destinationEntityId, accept, reject) {
    return {
        type: actionTypes.CURRENCIES_SET,
        payload: Object.assign(Object.assign({}, currencies), { destinationEntityTypeId,
            destinationEntityId }),
        meta: {
            commit: {
                type: actionTypes.CURRENCIES_SET_COMMIT,
            },
            accept,
            reject,
        },
    };
}
/**
 *
 * @param amount
 * @param destinationEntityTypeId
 * @param destinationEntityId
 */
export function currencyCopperSet(amount, destinationEntityTypeId, destinationEntityId) {
    return {
        type: actionTypes.CURRENCY_COPPER_SET,
        payload: {
            amount,
            destinationEntityId,
            destinationEntityTypeId,
        },
        meta: {
            commit: {
                type: actionTypes.CURRENCY_COPPER_SET_COMMIT,
            },
        },
    };
}
/**
 *
 * @param amount
 * @param destinationEntityTypeId
 * @param destinationEntityId
 */
export function currencyElectrumSet(amount, destinationEntityTypeId, destinationEntityId) {
    return {
        type: actionTypes.CURRENCY_ELECTRUM_SET,
        payload: {
            amount,
            destinationEntityId,
            destinationEntityTypeId,
        },
        meta: {
            commit: {
                type: actionTypes.CURRENCY_ELECTRUM_SET_COMMIT,
            },
        },
    };
}
/**
 *
 * @param transactionPayload
 * @param accept
 * @param reject
 */
export function currencyTransactionSet(transactionPayload, accept, reject) {
    return {
        type: actionTypes.CURRENCY_TRANSACTION_SET,
        payload: Object.assign({}, transactionPayload),
        meta: {
            accept,
            reject,
        },
    };
}
/**
 *
 * @param amount
 * @param destinationEntityTypeId
 * @param destinationEntityId
 */
export function currencyGoldSet(amount, destinationEntityTypeId, destinationEntityId) {
    return {
        type: actionTypes.CURRENCY_GOLD_SET,
        payload: {
            amount,
            destinationEntityId,
            destinationEntityTypeId,
        },
        meta: {
            commit: {
                type: actionTypes.CURRENCY_GOLD_SET_COMMIT,
            },
        },
    };
}
/**
 *
 * @param amount
 * @param destinationEntityTypeId
 * @param destinationEntityId
 */
export function currencyPlatinumSet(amount, destinationEntityTypeId, destinationEntityId) {
    return {
        type: actionTypes.CURRENCY_PLATINUM_SET,
        payload: {
            amount,
            destinationEntityId,
            destinationEntityTypeId,
        },
        meta: {
            commit: {
                type: actionTypes.CURRENCY_PLATINUM_SET_COMMIT,
            },
        },
    };
}
/**
 *
 * @param amount
 * @param destinationEntityTypeId
 * @param destinationEntityId
 */
export function currencySilverSet(amount, destinationEntityTypeId, destinationEntityId) {
    return {
        type: actionTypes.CURRENCY_SILVER_SET,
        payload: {
            amount,
            destinationEntityId,
            destinationEntityTypeId,
        },
        meta: {
            commit: {
                type: actionTypes.CURRENCY_SILVER_SET_COMMIT,
            },
        },
    };
}
/**
 *
 * @param starting
 * @param accept
 * @param reject
 */
export function startingEquipmentAddRequest(starting, accept, reject) {
    return {
        type: actionTypes.STARTING_EQUIPMENT_ADD_REQUEST,
        payload: Object.assign({}, starting),
        meta: {
            accept,
            reject,
        },
    };
}
/**
 *
 * @param gold
 * @param accept
 * @param reject
 */
export function startingGoldAddRequest(gold, accept, reject) {
    return {
        type: actionTypes.STARTING_GOLD_ADD_REQUEST,
        payload: {
            gold,
        },
        meta: {
            accept,
            reject,
        },
    };
}
/**
 *
 * @param fails
 * @param successes
 */
export function deathSavesSet(fails, successes) {
    return {
        type: actionTypes.DEATHSAVES_SET,
        payload: {
            fails,
            successes,
        },
        meta: {
            commit: {
                type: actionTypes.DEATHSAVES_SET_COMMIT,
            },
        },
    };
}
/**
 *
 * @param customSpeed
 */
export function movementAdd(customSpeed) {
    return {
        type: actionTypes.MOVEMENT_ADD,
        payload: Object.assign({}, customSpeed),
        meta: {
            commit: {
                type: actionTypes.MOVEMENT_ADD_COMMIT,
            },
        },
    };
}
/**
 *
 * @param customSpeed
 */
export function movementSet(customSpeed) {
    return {
        type: actionTypes.MOVEMENT_SET,
        payload: Object.assign({}, customSpeed),
        meta: {
            commit: {
                type: actionTypes.MOVEMENT_SET_COMMIT,
            },
        },
    };
}
/**
 *
 * @param movementId
 */
export function movementRemove(movementId) {
    return {
        type: actionTypes.MOVEMENT_REMOVE,
        payload: {
            movementId,
        },
        meta: {
            commit: {
                type: actionTypes.MOVEMENT_REMOVE_COMMIT,
            },
        },
    };
}
/**
 *
 * @param customSense
 */
export function senseAdd(customSense) {
    return {
        type: actionTypes.SENSE_ADD,
        payload: Object.assign({}, customSense),
        meta: {
            commit: {
                type: actionTypes.SENSE_ADD_COMMIT,
            },
        },
    };
}
/**
 *
 * @param customSense
 */
export function senseSet(customSense) {
    return {
        type: actionTypes.SENSE_SET,
        payload: Object.assign({}, customSense),
        meta: {
            commit: {
                type: actionTypes.SENSE_SET_COMMIT,
            },
        },
    };
}
/**
 *
 * @param senseId
 */
export function senseRemove(senseId) {
    return {
        type: actionTypes.SENSE_REMOVE,
        payload: {
            senseId,
        },
        meta: {
            commit: {
                type: actionTypes.SENSE_REMOVE_COMMIT,
            },
        },
    };
}
/**
 *
 * @param proficiency
 */
export function customProficiencyAdd(proficiency) {
    return {
        type: actionTypes.CUSTOM_PROFICIENCY_ADD,
        payload: {
            proficiency,
        },
        meta: {
            commit: {
                type: actionTypes.CUSTOM_PROFICIENCY_ADD_COMMIT,
            },
        },
    };
}
/**
 *
 * @param id
 */
export function customProficiencyRemove(id) {
    return {
        type: actionTypes.CUSTOM_PROFICIENCY_REMOVE,
        payload: {
            id,
        },
        meta: {
            commit: {
                type: actionTypes.CUSTOM_PROFICIENCY_REMOVE_COMMIT,
            },
        },
    };
}
/**
 *
 * @param id
 * @param properties
 */
export function customProficiencySet(id, properties) {
    return {
        type: actionTypes.CUSTOM_PROFICIENCY_SET,
        payload: {
            id,
            properties,
        },
        meta: {
            commit: {
                type: actionTypes.CUSTOM_PROFICIENCY_SET_COMMIT,
            },
        },
    };
}
/**
 *
 * @param customDefenseAdjustment
 */
export function customDefenseAdjustmentAdd(customDefenseAdjustment) {
    return {
        type: actionTypes.CUSTOM_DEFENSE_ADJUSTMENT_ADD,
        payload: Object.assign({}, customDefenseAdjustment),
        meta: {
            commit: {
                type: actionTypes.CUSTOM_DEFENSE_ADJUSTMENT_ADD_COMMIT,
            },
        },
    };
}
/**
 *
 * @param customDefenseAdjustment
 */
export function customDefenseAdjustmentSet(customDefenseAdjustment) {
    return {
        type: actionTypes.CUSTOM_DEFENSE_ADJUSTMENT_SET,
        payload: Object.assign({}, customDefenseAdjustment),
        meta: {
            commit: {
                type: actionTypes.CUSTOM_DEFENSE_ADJUSTMENT_SET_COMMIT,
            },
        },
    };
}
/**
 *
 * @param type
 * @param adjustmentId
 */
export function customDefenseAdjustmentRemove(type, adjustmentId) {
    return {
        type: actionTypes.CUSTOM_DEFENSE_ADJUSTMENT_REMOVE,
        payload: {
            type,
            adjustmentId,
        },
        meta: {
            commit: {
                type: actionTypes.CUSTOM_DEFENSE_ADJUSTMENT_REMOVE_COMMIT,
            },
        },
    };
}
/**
 *
 * @param statId
 * @param value
 */
export function abilityScoreBonusSet(statId, value) {
    return {
        type: actionTypes.ABILITY_SCORE_BONUS_SET,
        payload: {
            statId,
            value,
        },
        meta: {
            commit: {
                type: actionTypes.ABILITY_SCORE_BONUS_SET_COMMIT,
            },
        },
    };
}
/**
 *
 * @param statId
 * @param value
 */
export function abilityScoreOverrideSet(statId, value) {
    return {
        type: actionTypes.ABILITY_SCORE_OVERRIDE_SET,
        payload: {
            statId,
            value,
        },
        meta: {
            commit: {
                type: actionTypes.ABILITY_SCORE_OVERRIDE_SET_COMMIT,
            },
        },
    };
}
/**
 *
 * @param statId
 * @param value
 */
export function abilityScoreBaseSet(statId, value) {
    return {
        type: actionTypes.ABILITY_SCORE_BASE_SET,
        payload: {
            statId,
            value,
        },
        meta: {
            commit: {
                type: actionTypes.ABILITY_SCORE_BASE_SET_COMMIT,
            },
        },
    };
}
/**
 *
 * @param status
 */
export function statusSet(status) {
    return {
        type: actionTypes.STATUS_SET,
        payload: {
            status,
        },
        meta: {
            commit: {
                type: actionTypes.STATUS_SET_COMMIT,
            },
        },
    };
}
/**
 *
 * @param statusSlug
 */
export function statusSlugSet(statusSlug) {
    return {
        type: actionTypes.STATUS_SLUG_SET,
        payload: {
            statusSlug,
        },
        meta: {
            commit: {
                type: actionTypes.STATUS_SLUG_SET_COMMIT,
            },
        },
    };
}
