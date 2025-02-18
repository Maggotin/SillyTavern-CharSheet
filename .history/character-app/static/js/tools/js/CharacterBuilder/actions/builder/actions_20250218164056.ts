import {
  ClassDefinitionContract,
  RaceDefinitionContract,
} from "../../rules-engine/es";

import { builderActionTypes } from "../builder";
import {
  BuilderMethodSetAction,
  BuilderMethodSetActionPayload,
  BuilderMethodSetCommitAction,
  CharacterLoadedSetCommitAction,
  CharacterLoadingSetCommitAction,
  CharacterLoadRequestAction,
  ConfirmClassSetAction,
  ConfirmSpeciesSetAction,
  QuickBuildRequestAction,
  RandomBuildRequestAction,
  ShowHelpTextSetAction,
  StepBuildRequestAction,
  SuggestedNamesRequestAction,
  SuggestedNamesSetAction,
} from "./typings";

export function characterLoadRequest(): CharacterLoadRequestAction {
  return {
    type: builderActionTypes.CHARACTER_LOAD_REQUEST,
    payload: {},
  };
}

export function quickBuildRequest(
  entitySpeciesId: number | null,
  entitySpeciesTypeId: number | null,
  classId: number | null,
  name: string | null
): QuickBuildRequestAction {
  return {
    type: builderActionTypes.QUICK_BUILD_REQUEST,
    payload: {
      entityRaceId: entitySpeciesId,
      entityRaceTypeId: entitySpeciesTypeId,
      classId,
      name,
    },
  };
}

export function randomBuildRequest(
  level: number | null,
  entitySpeciesId: number | null,
  entitySpeciesTypeId: number | null,
  classId: number | null,
  allowMulticlass: boolean,
  allowFeats: boolean,
  name: string | null
): RandomBuildRequestAction {
  return {
    type: builderActionTypes.RANDOM_BUILD_REQUEST,
    payload: {
      level,
      entityRaceId: entitySpeciesId,
      entityRaceTypeId: entitySpeciesTypeId,
      classId,
      allowMulticlass,
      allowFeats,
      name,
    },
  };
}

export function stepBuildRequest(
  showHelpText: boolean
): StepBuildRequestAction {
  return {
    type: builderActionTypes.STEP_BUILD_REQUEST,
    payload: {
      showHelpText,
    },
  };
}

export function characterLoadingSetCommit(
  isLoading: boolean
): CharacterLoadingSetCommitAction {
  return {
    type: builderActionTypes.CHARACTER_LOADING_SET_COMMIT,
    payload: {
      isLoading,
    },
  };
}

export function characterLoadedSetCommit(
  isLoaded: boolean
): CharacterLoadedSetCommitAction {
  return {
    type: builderActionTypes.CHARACTER_LOADED_SET_COMMIT,
    payload: {
      isLoaded,
    },
  };
}

export function showHelpTextSet(showHelpText: boolean): ShowHelpTextSetAction {
  return {
    type: builderActionTypes.SHOW_HELP_TEXT_SET,
    payload: {
      showHelpText,
    },
  };
}

export function builderMethodSet(method: string): BuilderMethodSetAction {
  return {
    type: builderActionTypes.BUILDER_METHOD_SET,
    payload: {
      method,
    },
  };
}

export function builderMethodSetCommit(
  payload: BuilderMethodSetActionPayload
): BuilderMethodSetCommitAction {
  return {
    type: builderActionTypes.BUILDER_METHOD_SET_COMMIT,
    payload,
  };
}

export function confirmSpeciesSet(
  species: RaceDefinitionContract
): ConfirmSpeciesSetAction {
  return {
    type: builderActionTypes.CONFIRM_SPECIES_SET,
    payload: {
      race: species,
    },
  };
}

export function confirmClassSet(
  charClass: ClassDefinitionContract
): ConfirmClassSetAction {
  return {
    type: builderActionTypes.CONFIRM_CLASS_SET,
    payload: {
      charClass,
    },
  };
}

export function suggestedNamesSet(
  suggestedNames: Array<string>
): SuggestedNamesSetAction {
  return {
    type: builderActionTypes.SUGGESTED_NAMES_SET,
    payload: {
      suggestedNames,
    },
  };
}

export function suggestedNamesRequest(): SuggestedNamesRequestAction {
  return {
    type: builderActionTypes.SUGGESTED_NAMES_REQUEST,
    payload: {},
  };
}
