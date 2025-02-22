import { createSelector } from "reselect";

import * as appEnvSelectors from "../../Shared/selectors/appEnv";
import * as NavigationUtils from "../utils/navigationUtils";

export const getProfileCharacterListingUrl = () =>
  NavigationUtils.getCharacterListingUrl();

export const getCharacterSheetUrl = createSelector(
  [appEnvSelectors.getCharacterId],
  (characterId) => {
    return NavigationUtils.getCharacterSheetUrl(characterId);
  }
);
