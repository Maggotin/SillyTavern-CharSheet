import * as messageTypes from "./messageTypes";
import { ShowCharacterSheetMessage } from "./typings";

export function createShowCharacterSheetMessage(
  characterId: number
): ShowCharacterSheetMessage {
  return {
    type: messageTypes.SHOW_CHARACTER_SHEET,
    payload: {
      characterId,
    },
  };
}
