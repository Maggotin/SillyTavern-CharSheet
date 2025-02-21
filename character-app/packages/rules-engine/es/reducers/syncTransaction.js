import * as actionTypes from '../actions/syncTransaction/actionTypes';
export const initialState = {
    active: false,
    initiator: null,
};
function syncTransaction(state = initialState, action) {
    switch (action.type) {
        case actionTypes.ACTIVATE:
            return Object.assign(Object.assign({}, state), { active: true, initiator: action.payload.initiator });
        case actionTypes.DEACTIVATE:
            return Object.assign(Object.assign({}, state), { active: false, initiator: null });
        default:
        // not implemented
    }
    return state;
}
export default syncTransaction;
