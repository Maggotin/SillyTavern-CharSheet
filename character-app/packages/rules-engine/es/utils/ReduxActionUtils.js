/**
 *
 * @param {function} actionCreator
 * @param {...*} params
 */
export function callCommitAction(actionCreator, ...params) {
    let action = actionCreator(...params);
    return {
        type: action.meta.commit.type,
        payload: action.payload,
    };
}
