import { SharedAppState } from "../stores/typings";

export const getRollResultComponentGroupsLookup = (state: SharedAppState) =>
  state.rollResult.data;
export const getRollResultComponentSimulatedGroupsLookup = (
  state: SharedAppState
) => state.rollResult.simulatedData;
export const getRollStatusLookup = (state: SharedAppState) =>
  state.rollResult.dataStatus;
