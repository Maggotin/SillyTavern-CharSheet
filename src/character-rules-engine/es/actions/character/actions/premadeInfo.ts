import * as actionTypes from '../actionTypes/premadeInfo';

interface PremadeInfo {
    // Define the structure of premadeInfo here
    // For now, we'll use Record<string, unknown>
}

interface PremadeInfoSetCommitAction {
    type: typeof actionTypes.PREMADE_INFO_SET_COMMIT;
    payload: PremadeInfo;
    meta: Record<string, never>;
}

export function premadeInfoSetCommit(premadeInfo: PremadeInfo): PremadeInfoSetCommitAction {
    return {
        type: actionTypes.PREMADE_INFO_SET_COMMIT,
        payload: premadeInfo,
        meta: {},
    };
}

interface PremadeInfoAddAction {
    type: typeof actionTypes.PREMADE_INFO_ADD;
    payload: PremadeInfo;
    meta: {
        commit: {
            type: typeof actionTypes.PREMADE_INFO_SET_COMMIT;
        };
    };
}

export function premadeInfoAdd(premadeInfo: PremadeInfo): PremadeInfoAddAction {
    return {
        type: actionTypes.PREMADE_INFO_ADD,
        payload: premadeInfo,
        meta: {
            commit: {
                type: actionTypes.PREMADE_INFO_SET_COMMIT,
            },
        },
    };
}

interface PremadeInfoGetAction {
    type: typeof actionTypes.PREMADE_INFO_GET;
    payload: {
        characterId: unknown;
    };
    meta: {
        commit: {
            type: typeof actionTypes.PREMADE_INFO_SET_COMMIT;
        };
    };
}

export function premadeInfoGet(characterId: unknown): PremadeInfoGetAction {
    return {
        type: actionTypes.PREMADE_INFO_GET,
        payload: {
            characterId,
        },
        meta: {
            commit: {
                type: actionTypes.PREMADE_INFO_SET_COMMIT,
            },
        },
    };
}

interface PremadeInfoUpdateAction {
    type: typeof actionTypes.PREMADE_INFO_UPDATE;
    payload: PremadeInfo;
    meta: {
        commit: {
            type: typeof actionTypes.PREMADE_INFO_SET_COMMIT;
        };
    };
}

export function premadeInfoUpdate(premadeInfo: PremadeInfo): PremadeInfoUpdateAction {
    return {
        type: actionTypes.PREMADE_INFO_UPDATE,
        payload: premadeInfo,
        meta: {
            commit: {
                type: actionTypes.PREMADE_INFO_SET_COMMIT,
            },
        },
    };
}

interface PremadeInfoDeleteAction {
    type: typeof actionTypes.PREMADE_INFO_DELETE;
    payload: {
        characterId: unknown;
    };
    meta: {
        commit: {
            type: typeof actionTypes.PREMADE_INFO_REMOVE_COMMIT;
        };
    };
}

export function premadeInfoDelete(characterId: unknown): PremadeInfoDeleteAction {
    return {
        type: actionTypes.PREMADE_INFO_DELETE,
        payload: {
            characterId,
        },
        meta: {
            commit: {
                type: actionTypes.PREMADE_INFO_REMOVE_COMMIT,
            },
        },
    };
}