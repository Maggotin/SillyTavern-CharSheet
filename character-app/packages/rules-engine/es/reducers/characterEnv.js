import * as actionTypes from '../actions/characterEnv/actionTypes';
import { CharacterLoadingStatusEnum } from './constants';
export const initialEnvState = {
    context: null,
    loadingStatus: CharacterLoadingStatusEnum.NOT_INITIALIZED,
};
function characterEnv(state = initialEnvState, action) {
    switch (action.type) {
        case actionTypes.DATA_SET:
            return Object.assign(Object.assign({}, state), action.payload);
        default:
        // not implemented
    }
    return state;
}
export default characterEnv;
