import { createSelector } from "reselect";

import { DefaultCharacterName } from "~/constants";

import config from "../../config";
import {
  AppData,
  CharacterData,
  QueryResponseData,
  ShortCharacterContract,
  SortTypeEnum,
} from "../../types";

const BASE_PATHNAME = config.basePathname;

export const getCharacter = (state: CharacterData) => state || {};

export const getId = createSelector([getCharacter], ({ id }) => id);

// Username is added by MyCharactersListing since it comes from the JWT, not the API
export const getUsername = createSelector(
  [getCharacter],
  ({ userName }) => userName
);

export const getName = createSelector(
  [getCharacter],
  ({ name }) => name || DefaultCharacterName
);

export const getLevel = createSelector([getCharacter], ({ level }) => level);

export const getStatus = createSelector([getCharacter], ({ status }) => status);

export const getStatusSlug = createSelector(
  [getCharacter],
  ({ statusSlug }) => statusSlug
);

export const getClassDescription = createSelector(
  [getCharacter],
  ({ classDescription }) => classDescription
);

export const getRaceName = createSelector(
  [getCharacter],
  ({ raceName }) => raceName
);

export const getSecondaryInfo = createSelector(
  [getCharacter],
  ({ characterSecondaryInfo }) => characterSecondaryInfo
);

export const getAvatarUrl = createSelector(
  [getCharacter],
  ({ avatarUrl }) => avatarUrl
);

export const getBackdropUrl = createSelector(
  [getCharacter],
  ({ backdropUrl }) => backdropUrl
);

export const getCoverImageUrl = createSelector(
  [getCharacter],
  ({ coverImageUrl }) => coverImageUrl
);

export const getCreatedDate = createSelector(
  [getCharacter],
  ({ createdDate }) => createdDate
);

export const getLastModifiedDate = createSelector(
  [getCharacter],
  ({ lastModifiedDate }) => lastModifiedDate
);

export const getIsAssigned = createSelector(
  [getCharacter],
  ({ isAssigned }) => isAssigned
);

export const getCampaignId = createSelector(
  [getCharacter],
  ({ campaignId }) => campaignId
);

export const isInCampaign = createSelector([getCampaignId], Boolean);

export const getCampaignName = createSelector(
  [getCharacter],
  ({ campaignName }) => campaignName
);

export const getCampaignDetailsLink = createSelector(
  [getCampaignId],
  (id) => `${config.ddbBaseUrl}/campaigns/${id}`
);

export const getDetailsLink = createSelector(
  [getUsername, getId],
  (username, id) => `${BASE_PATHNAME}/${id}`
);

export const getEditLink = createSelector(
  [getUsername, getId],
  (username, id) => `${BASE_PATHNAME}/${id}/builder/home/basic`
);

export const getSearchableTerms = createSelector(
  [
    isInCampaign,
    getLevel,
    getName,
    getClassDescription,
    getRaceName,
    getCampaignName,
  ],
  (isInCampaign, level, name, classDescription, raceName, campaignName) =>
    [
      isInCampaign && "campaign",
      level.toString(),
      `level ${level}`,
      `lvl ${level}`,
      name,
      classDescription,
      raceName,
      campaignName,
    ].filter(Boolean)
);

// Analytics labels to use if a match is found in getSearchableTerms (by index)
export const getSearchableTermsAnalyticsLabel = createSelector(
  [isInCampaign, getLevel],
  (isInCampaign, level) =>
    [
      isInCampaign && "campaign",
      "# (level)",
      `level #`,
      `lvl #`,
      "name",
      "class description",
      "race name",
      "campaign name",
    ].filter(Boolean)
);

export const generateCharacter = (
  character: ShortCharacterContract,
  userName: string | null
): CharacterData => {
  return {
    ...character,
    userName,
  };
};

export const generateAppData = (
  userName: string | null,
  data?: QueryResponseData
): AppData => {
  const characters = data?.data?.characters || [];

  return {
    characters: characters.map((character) =>
      generateCharacter(character, userName)
    ),
    maxCharacterSlotsAllowed: data?.data?.characterSlotLimit || null,
    hasLockedCharacters: data?.data?.canUnlockCharacters || false,
  };
};

export const SortByPropMap = {
  [SortTypeEnum.Created]: getCreatedDate,
  [SortTypeEnum.Level]: getLevel,
  [SortTypeEnum.Modified]: getLastModifiedDate,
  [SortTypeEnum.Name]: getName,
};
