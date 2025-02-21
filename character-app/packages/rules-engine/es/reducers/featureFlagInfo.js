import * as actionTypes from '../actions/featureFlagInfo/actionTypes';
import { DEFAULT_FEATURE_FLAG_INFO } from '../engine/FeatureFlagInfo';
export const initialState = DEFAULT_FEATURE_FLAG_INFO;
export default function featureFlagInfoReducer(state = initialState, action) {
    switch (action.type) {
        case actionTypes.DATA_SET:
            return action.payload;
        default:
        // not implemented
    }
    return state;
}
