import { SheetAppState } from "../typings";

export const getInitFailed = (state: SheetAppState) => state.sheet.initFailed;
export const getInitError = (state: SheetAppState) => state.sheet.initError;
