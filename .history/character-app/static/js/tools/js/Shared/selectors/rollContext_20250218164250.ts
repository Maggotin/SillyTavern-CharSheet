import { createSelector } from "reselect";

import {
  DecorationUtils,
  rulesEngineSelectors,
} from "../../character-rules-engine/es";
import { IRollContext } from "@dndbeyond/dice";

import { appEnvSelectors } from "./index";

export const getCharacterRollContext = createSelector(
  [
    appEnvSelectors.getCharacterId,
    rulesEngineSelectors.getName,
    rulesEngineSelectors.getDecorationInfo,
  ],
  (characterId, name, decorationInfo): IRollContext => {
    return {
      entityId: characterId ? characterId.toString() : "",
      entityType: "character",
      name: name?.toString(),
      avatarUrl:
        DecorationUtils.getAvatarInfo(decorationInfo).avatarUrl?.toString(),
    };
  }
);
