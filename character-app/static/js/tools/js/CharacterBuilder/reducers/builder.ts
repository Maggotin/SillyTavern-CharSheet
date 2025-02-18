import { BuilderAction, builderActionTypes } from "../actions/builder";
import { BuilderState } from "../typings";

const initialState: BuilderState = {
  method: null,
  confirmSpecies: null,
  confirmClass: null,
  isCharacterLoading: false,
  isCharacterLoaded: false,
  suggestedNames: [],
};
function builder(
  state: BuilderState = initialState,
  action: BuilderAction
): BuilderState {
  switch (action.type) {
    case builderActionTypes.BUILDER_METHOD_SET_COMMIT:
      return {
        ...state,
        method: action.payload.method,
      };

    case builderActionTypes.CONFIRM_SPECIES_SET:
      return {
        ...state,
        confirmSpecies: action.payload.race,
      };

    case builderActionTypes.CONFIRM_CLASS_SET:
      return {
        ...state,
        confirmClass: action.payload.charClass,
      };

    case builderActionTypes.CHARACTER_LOADING_SET_COMMIT:
      return {
        ...state,
        isCharacterLoading: action.payload.isLoading,
      };

    case builderActionTypes.CHARACTER_LOADED_SET_COMMIT:
      return {
        ...state,
        isCharacterLoaded: action.payload.isLoaded,
      };

    case builderActionTypes.SUGGESTED_NAMES_SET:
      return {
        ...state,
        suggestedNames: action.payload.suggestedNames,
      };

    default:
    // not implemented
  }

  return state;
}

export default builder;
