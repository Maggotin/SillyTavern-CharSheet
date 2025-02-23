import { SharedAppState } from "../stores/typings";

export const getError = (state: SharedAppState) => state.appInfo.error;
