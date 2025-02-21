import * as actionTypes from '../actionTypes';
/**
 *
 * @param feats
 */
export function featsSet(feats) {
    return {
        type: actionTypes.FEATS_SET,
        payload: {
            feats,
        },
        meta: {
            commit: {
                type: actionTypes.FEATS_SET_COMMIT,
            },
        },
    };
}
/**
 *
 * @param featId
 * @param choiceType
 * @param choiceId
 * @param optionValue
 */
export function featChoiceSetRequest(featId, choiceType, choiceId, optionValue) {
    return {
        type: actionTypes.FEAT_CHOICE_SET_REQUEST,
        payload: {
            featId,
            choiceType,
            choiceId,
            optionValue,
        },
        meta: {},
    };
}
/**
 *
 * @param id
 */
export function adhocFeatCreate(id) {
    return {
        type: actionTypes.ADHOC_FEAT_CREATE,
        payload: {
            id,
        },
        meta: {},
    };
}
/**
 *
 * @param id
 */
export function adhocFeatRemove(id) {
    return {
        type: actionTypes.ADHOC_FEAT_REMOVE,
        payload: {
            id,
        },
        meta: {},
    };
}
/**
 *
 * @param id
 * @param featureId
 * @param featureTypeId
 */
export function setEntityFeat(id, featureId, featureTypeId) {
    return {
        type: actionTypes.SET_ENTITY_FEAT,
        payload: {
            id,
            featureId,
            featureTypeId,
        },
        meta: {}, // TODO consider passing accept and reject callbacks into meta
    };
}
