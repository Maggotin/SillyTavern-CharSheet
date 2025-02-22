import { SharedAppState } from "../stores/typings";

export const getToastMessages = (state: SharedAppState) => state.toastMessage;
