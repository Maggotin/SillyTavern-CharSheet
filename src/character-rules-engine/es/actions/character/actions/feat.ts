import * as actionTypes from '../actionTypes/feat';

interface FeatsSetAction {
    type: typeof actionTypes.FEATS_SET;
    payload: {
        feats: unknown;
    };
    meta: {
        commit: {
            type: typeof actionTypes.FEATS_SET_COMMIT;
        };
    };
}

/**
 *
 * @param feats
 */
export function featsSet(feats: unknown): FeatsSetAction {
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

interface FeatChoiceSetRequestAction {
    type: typeof actionTypes.FEAT_CHOICE_SET_REQUEST;
    payload: {
        featId: unknown;
        choiceType: unknown;
        choiceId: unknown;
        optionValue: unknown;
    };
    meta: Record<string, never>;
}

/**
 *
 * @param featId
 * @param choiceType
 * @param choiceId
 * @param optionValue
 */
export function featChoiceSetRequest(
    featId: unknown,
    choiceType: unknown,
    choiceId: unknown,
    optionValue: unknown
): FeatChoiceSetRequestAction {
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

interface AdhocFeatCreateAction {
    type: typeof actionTypes.ADHOC_FEAT_CREATE;
    payload: {
        id: unknown;
    };
    meta: Record<string, never>;
}

/**
 *
 * @param id
 */
export function adhocFeatCreate(id: unknown): AdhocFeatCreateAction {
    return {
        type: actionTypes.ADHOC_FEAT_CREATE,
        payload: {
            id,
        },
        meta: {},
    };
}

interface AdhocFeatRemoveAction {
    type: typeof actionTypes.ADHOC_FEAT_REMOVE;
    payload: {
        id: unknown;
    };
    meta: Record<string, never>;
}

/**
 *
 * @param id
 */
export function adhocFeatRemove(id: unknown): AdhocFeatRemoveAction {
    return {
        type: actionTypes.ADHOC_FEAT_REMOVE,
        payload: {
            id,
        },
        meta: {},
    };
}

interface SetEntityFeatAction {
    type: typeof actionTypes.SET_ENTITY_FEAT;
    payload: {
        id: unknown;
        featureId: unknown;
        featureTypeId: unknown;
    };
    meta: Record<string, never>;
}

/**
 *
 * @param id
 * @param featureId
 * @param featureTypeId
 */
export function setEntityFeat(
    id: unknown,
    featureId: unknown,
    featureTypeId: unknown
): SetEntityFeatAction {
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