import { SharedAppState } from "../stores/typings";

export const getIsMobile = (state: SharedAppState) => state.appEnv.isMobile;
export const getIsReadonly = (state: SharedAppState) => state.appEnv.isReadonly;
export const getCanOverrideReadOnly = (state: SharedAppState) =>
  state.appEnv.canOverrideReadOnly;
export const getAuthEndpoint = (state: SharedAppState) =>
  state.appEnv.authEndpoint;
export const getCharacterServiceBaseUrl = (state: SharedAppState) =>
  state.appEnv.characterServiceBaseUrl;
export const getCharacterEndpoint = (state: SharedAppState) =>
  state.appEnv.characterEndpoint;
export const getCharacterId = (state: SharedAppState) =>
  state.appEnv.characterId;
export const getDimensions = (state: SharedAppState) => state.appEnv.dimensions;
export const getRedirect = (state: SharedAppState) => state.appEnv.redirect;
export const getUsername = (state: SharedAppState) => state.appEnv.username;
export const getUserId = (state: SharedAppState) => state.appEnv.userId;
export const getUserRoles = (state: SharedAppState) => state.appEnv.userRoles;
export const getDiceEnabled = (state: SharedAppState) =>
  state.appEnv.diceEnabled;
export const getDiceFeatureConfiguration = (state: SharedAppState) =>
  state.appEnv.diceFeatureConfiguration;
export const getGameLog = (state: SharedAppState) => state.appEnv.gameLog;
export const getCharacterSlots = (state: SharedAppState) =>
  state.appEnv.characterSlots;
