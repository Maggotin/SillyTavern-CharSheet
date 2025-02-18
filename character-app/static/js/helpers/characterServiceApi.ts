import { CharacterData, UserPreferences } from "~/types";

import config, {
  characterServiceBaseUrl,
  ddbBaseUrl,
  userServiceBaseUrl,
} from "../config";
import { getId, getCampaignId } from "../state/selectors/characterUtils";
import { applyQueriesClientSide, queryListToMap } from "./queryUtils";
import { summon } from "./summon";
import { getUserId } from "./userApi";

export const getCharacters = async () => {
  try {
    const userId = await getUserId();
    const req = await summon(
      `${characterServiceBaseUrl}/characters/list?userId=${userId}`
    );
    return req.json();
  } catch {
    throw new Error("Non-OK response from GET characters");
  }
};

export const getItems = async ({ queries }) => {
  const characters = await getCharacters();
  applyQueriesClientSide(queryListToMap(queries));

  return new Promise((resolve) =>
    resolve({
      json: () => new Promise((resolve2) => resolve2(characters)),
    })
  );
};

export const copyCharacter = (character: CharacterData) => {
  try {
    const characterId = getId(character);

    return summon(`${characterServiceBaseUrl}/character/copy`, {
      method: "POST",
      body: JSON.stringify({ characterId }),
    });
  } catch (err) {
    throw err;
  }
};

export const claimCharacter = (characterId: number, isAssigned: boolean) => {
  try {
    return summon(`${characterServiceBaseUrl}/premade/claim`, {
      method: "POST",
      body: JSON.stringify({ characterId, isAssigned }),
    });
  } catch (err) {
    throw err;
  }
};

export const getCharacterSlots = async () => {
  try {
    const req = await summon(`${config.userServiceBaseUrl}/slot-limit`);
    const res = await req.json();
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const deleteCharacter = (character: CharacterData) => {
  try {
    const characterId = getId(character);

    return summon(`${characterServiceBaseUrl}/character`, {
      method: "DELETE",
      body: JSON.stringify({ characterId }),
    });
  } catch (err) {
    throw err;
  }
};

export const leaveCampaign = (character: CharacterData) => {
  try {
    const campaignId = getCampaignId(character);
    const characterId = getId(character);

    return summon(
      `${ddbBaseUrl}/api/campaign/${campaignId}/character/${characterId}`,
      {
        method: "DELETE",
      }
    );
  } catch (err) {
    throw err;
  }
};

export const joinCampaign = (campaignJoinCode: string, characterId: number) => {
  try {
    return summon(`${ddbBaseUrl}/api/campaign/join/${campaignJoinCode}`, {
      method: "POST",
      body: JSON.stringify({ characterId }),
    });
  } catch (err) {
    throw err;
  }
};

export const unlockCharacters = (characterIds: Array<number>) => {
  try {
    return summon(`${userServiceBaseUrl}/unlock`, {
      method: "POST",
      body: JSON.stringify({ characterIds }),
    });
  } catch (err) {
    throw err;
  }
};

export const activateCharacter = (character: CharacterData) => {
  try {
    const characterId = getId(character);

    return summon(
      `${characterServiceBaseUrl}/characters/${characterId}/status/activate`,
      {
        method: "PUT",
      }
    );
  } catch (err) {
    throw err;
  }
};

export const getFeatureFlagsFromCharacterService = (flags: Array<string>) => {
  try {
    return summon(`${characterServiceBaseUrl}/featureflag`, {
      method: "POST",
      body: JSON.stringify({ flags }),
    });
  } catch (err) {
    throw err;
  }
};

/**
 * Get all sources that the user is able to use.
 */
export const getAllEntitledSources = (campaignId?: number) => {
  try {
    return summon(
      `${userServiceBaseUrl}/entitled-sources${
        campaignId ? `?campaignId=${campaignId}` : ""
      }`
    );
  } catch (err) {
    throw err;
  }
};

export const getUserPreferences = () => {
  try {
    return summon(`${config.userServiceBaseUrl}/preferences`);
  } catch (err) {
    throw err;
  }
};

export const updateUserPreferences = (preferences: UserPreferences) => {
  try {
    return summon(`${config.userServiceBaseUrl}/preferences`, {
      method: "POST",
      body: JSON.stringify(preferences),
    });
  } catch (err) {
    throw err;
  }
};

export const getRulesData = () => {
  try {
    return summon(`${characterServiceBaseUrl}/rule-data`, {
      method: "GET",
    });
  } catch (err) {
    throw err;
  }
};
