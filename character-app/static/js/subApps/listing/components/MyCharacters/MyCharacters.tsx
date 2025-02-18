import { useLayoutEffect, useEffect, useState } from "react";

import { useHeadContext } from "~/contexts/Head";

import { SessionNames } from "../../../../constants";
import { initAnalytics } from "../../../../helpers/analytics";
import { getFeatureFlagsFromCharacterService } from "../../../../helpers/characterServiceApi";
import useLocalStorage from "../../../../hooks/useLocalStorage";
import useUserId from "../../../../hooks/useUserId";
import useUserName from "../../../../hooks/useUserName";
import {
  generateAppData,
  getStatus,
} from "../../../../state/selectors/characterUtils";
import { CharacterStatusEnum, QueryResponseData } from "../../../../types";
import { CharacterGrid } from "../CharacterGrid";
import { Header } from "../Header";
import { PlayerAppBanner } from "../PlayerAppBanner";
import "./MyCharacters.scss";

interface Props {
  characterQuery: {
    isLoading: boolean;
    data: QueryResponseData | undefined;
    refetch: () => void;
    error: Error | null;
  };
}

export const MyCharacters = ({ characterQuery }: Props) => {
  useEffect(() => {
    initAnalytics(SessionNames.DDB);
  }, []);
  const userId = useUserId();
  const userName = useUserName();
  const { setTitle } = useHeadContext();
  const [storeUrls, setStoreUrls] = useState({
    appleStoreLink: "",
    googlePlayStoreLink: "",
  });

  useLayoutEffect(() => {
    document
      .getElementsByTagName("body")[0]
      .classList.add(
        "site",
        "site-dndbeyond",
        "site-www",
        "body-mycontent",
        "body-mycontent-characterindex"
      );
    return () => {
      document
        .getElementsByTagName("body")[0]
        .classList.remove(
          "site",
          "site-dndbeyond",
          "site-www",
          "body-mycontent",
          "body-mycontent-characterindex"
        );
    };
  }, []);

  useEffect(() => {
    async function getFlags() {
      try {
        const flagResponse = await getFeatureFlagsFromCharacterService([
          "players-app-apple-store-link",
          "players-app-google-play-store-link",
        ]);
        const { data } = await flagResponse.json();
        setStoreUrls({
          appleStoreLink: data["players-app-apple-store-link"],
          googlePlayStoreLink: data["players-app-google-play-store-link"],
        });
      } catch (e) {
        /* no-op */
      }
    }
    getFlags();
  }, []);

  useEffect(() => {
    setTitle("My Characters");
  }, [setTitle]);

  const [playerAppBannerDismissed, setPlayerAppBannerDismissed] =
    useLocalStorage(
      `MY_CHARACTERS_PLAYER_APP_BANNER_DISMISSED:${userId}`,
      false
    );

  const showPlayerAppBanner: boolean = !playerAppBannerDismissed;

  const { isLoading, data, refetch, error } = characterQuery;
  const { characters, hasLockedCharacters, maxCharacterSlotsAllowed } =
    generateAppData(userName, data);
  // Check for max active characters
  const hasMaxCharacters =
    characters?.filter(
      (character) => getStatus(character) === CharacterStatusEnum.Active
    ).length >= (maxCharacterSlotsAllowed ?? Infinity);

  return (
    <div className="my-characters-wrapper">
      <Header hasMaxCharacters={hasMaxCharacters} />
      <div className="content">
        {showPlayerAppBanner && (
          <PlayerAppBanner
            appleStoreLink={storeUrls.appleStoreLink}
            googlePlayStoreLink={storeUrls.googlePlayStoreLink}
            onDismiss={() => setPlayerAppBannerDismissed(true)}
          />
        )}
        <CharacterGrid
          className="ddbcl-my-characters-listing"
          hasLockedCharacters={hasLockedCharacters}
          maxCharacterSlotsAllowed={maxCharacterSlotsAllowed}
          characters={characters}
          isLoading={isLoading}
          hasMaxCharacters={hasMaxCharacters}
          reload={refetch}
          loadingError={error}
        />
        {showPlayerAppBanner && (
          <PlayerAppBanner
            appleStoreLink={storeUrls.appleStoreLink}
            googlePlayStoreLink={storeUrls.googlePlayStoreLink}
            onDismiss={() => setPlayerAppBannerDismissed(true)}
          />
        )}
      </div>
    </div>
  );
};
