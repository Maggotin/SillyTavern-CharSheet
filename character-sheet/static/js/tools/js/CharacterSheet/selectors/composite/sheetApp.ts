import { createSelector } from "reselect";

import config from "~/config";

import { appEnvSelectors } from "../../../Shared/selectors";

const BASE_PATHNAME = config.basePathname;

export const getBuilderUrl = createSelector(
  [appEnvSelectors.getCharacterId],
  (characterId) => `${BASE_PATHNAME}/${characterId}/builder/class/manage`
);
