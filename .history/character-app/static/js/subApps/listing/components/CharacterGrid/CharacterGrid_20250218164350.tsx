import React, { useCallback, useEffect, useState } from "react";

import ArrowDown from "../../fontawesome-cache/svgs/regular/arrow-down-to-line.svg";
import { Button } from "../../ttui/components/Button";

import { MaxCharactersDialog } from "~/components/MaxCharactersDialog";
import config from "~/config";
import { UserPreferenceProvider } from "~/tools/js/smartComponents/UserPreference";

import { logUnlockSubscribeClicked } from "../../../../helpers/analytics";
import { byProp, createSortValue } from "../../../../helpers/sortUtils";
import useLocalStorage from "../../../../hooks/useLocalStorage";
import useSubscriptionTier, {
  FREE_TIER,
  HERO_TIER,
} from "../../../../hooks/useSubscriptionTier";
import useUserId from "../../../../hooks/useUserId";
import {
  getId,
  getSearchableTerms,
  getStatus,
  SortByPropMap,
} from "../../../../state/selectors/characterUtils";
import {
  CharacterData,
  CharacterStatusEnum,
  SortOrderEnum,
  SortTypeEnum,
} from "../../../../types";
import { ApiStatusIndicator } from "../ApiStatusIndicator";
import { CharacterCard } from "../CharacterCard";
import { SubscriptionBanner } from "../SubscriptionBanner";
import { SearchSort } from "./SearchSort";
import { SecondaryHeader } from "./SecondaryHeader";
import styles from "./styles.module.css";

const overrideStatusForUnlock = ({
  character,
  characterIdsToUnlock,
  hasLockedCharacters,
}) => {
  if (!hasLockedCharacters) {
    return getStatus(character);
  }

  return characterIdsToUnlock.includes(getId(character))
    ? CharacterStatusEnum.Active
    : CharacterStatusEnum.Locked;
};

export interface SortState {
  sortBy: SortTypeEnum;
  sortOrder: SortOrderEnum;
}

export interface CharacterGridProps {
  className?: string;
  isLoading: boolean;
  characters: Array<CharacterData>;
  loadingError?: Error | null;
  reload: () => void;
  hasLockedCharacters: boolean;
  maxCharacterSlotsAllowed: number | null;
  hasMaxCharacters: boolean;
}

export const CharacterGrid: React.FC<CharacterGridProps> = ({
  className = "",
  isLoading,
  characters,
  loadingError,
  reload,
  hasLockedCharacters,
  maxCharacterSlotsAllowed,
  hasMaxCharacters,
}) => {
  const userId = useUserId();
  const subscriptionTier = useSubscriptionTier();

  const [sortPreference, setSortPreference] = useLocalStorage<string>(
    `MY_CHARACTERS_SORT_PREFERENCE:${userId}`,
    createSortValue(SortTypeEnum.Created, SortOrderEnum.Ascending)
  );

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortState>({
    sortBy: SortTypeEnum.Created,
    sortOrder: SortOrderEnum.Ascending,
  });
  const [isMaxCharacterMessageOpen, setIsMaxCharacterMessageOpen] =
    useState(false);
  const [characterIdsToUnlock, setCharacterIdsToUnlock] = useState<
    Array<number>
  >([]);
  const canUnlockMore: boolean = maxCharacterSlotsAllowed
    ? characterIdsToUnlock.length < maxCharacterSlotsAllowed
    : true;

  useEffect(() => {
    // Don't try to set the sort if there is no preference or if the listing is currently loading results
    if (!sortPreference || isLoading) {
      return;
    }

    const [sortPreferenceBy, sortPreferenceOrder] = sortPreference.split("-");

    // If they are false then use the default
    if (!sortPreferenceBy || !sortPreferenceOrder) {
      return;
    }

    // Prevent an infinite loop of reloading once the sort preference has actually been applied
    if (
      sortPreferenceBy === sort.sortBy &&
      sortPreferenceOrder === sort.sortOrder
    ) {
      return;
    }

    setSort({
      sortBy: sortPreferenceBy as SortTypeEnum,
      sortOrder: sortPreferenceOrder as SortOrderEnum,
    });
  }, [isLoading, sortPreference, sort]);

  useEffect(() => {
    if (hasLockedCharacters && characterIdsToUnlock.length === 0) {
      setCharacterIdsToUnlock(
        characters
          .filter(
            (character) => getStatus(character) === CharacterStatusEnum.Active
          )
          .map(getId)
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasLockedCharacters, characters]);

  const unlockCharacter = useCallback(
    (character: CharacterData) => {
      if (!characterIdsToUnlock.includes(getId(character))) {
        setCharacterIdsToUnlock([...characterIdsToUnlock, getId(character)]);
      }
    },
    [characterIdsToUnlock]
  );

  const lockCharacter = useCallback(
    (character: CharacterData) => {
      if (characterIdsToUnlock.includes(getId(character))) {
        setCharacterIdsToUnlock(
          characterIdsToUnlock.filter((id) => id !== getId(character))
        );
      }
    },
    [characterIdsToUnlock]
  );

  let filteredCharacters = characters.filter((character) => {
    return getSearchableTerms(character)
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase());
  });

  const sortByPropSelector = SortByPropMap[sort.sortBy];

  if (sortByPropSelector) {
    filteredCharacters = filteredCharacters.sort(byProp(sortByPropSelector));

    if (sort.sortOrder === SortOrderEnum.Descending) {
      filteredCharacters.reverse();
    }
  }

  let lockedCharacters: Array<CharacterData> = [];
  if (!hasLockedCharacters && canUnlockMore) {
    lockedCharacters = filteredCharacters.filter(
      (character) => getStatus(character) === CharacterStatusEnum.Locked
    );
    filteredCharacters = filteredCharacters.filter(
      (character) => getStatus(character) === CharacterStatusEnum.Active
    );
  }

  const characterCount: number = characters.filter(
    (character) => getStatus(character) === CharacterStatusEnum.Active
  ).length;
  const overCharacterLimit: boolean =
    maxCharacterSlotsAllowed !== null &&
    characterCount >= maxCharacterSlotsAllowed;

  const createCharacterHref = !hasMaxCharacters
    ? `${config.basePathname}/builder`
    : undefined;
  const createCharacterOnClick = hasMaxCharacters
    ? () => setIsMaxCharacterMessageOpen(true)
    : undefined;

  return (
    <UserPreferenceProvider>
      <div
        className={[className, "ddb-characters-listing"]
          .filter(Boolean)
          .join(" ")}
      >
        <div className="ddb-characters-listing-header">
          {/*
                    The CTA component will be shown depending on some conditions:
                    - If the user doesn't have a subscription, and has 6 characters, show the Hero CTA
                    - If the user has a Hero subscription, show the Master CTA
                    Remember that the Images for the CTA's are served by Waterdeep (then, the images could be shown as broken)
                */}

          {subscriptionTier === FREE_TIER &&
            characterCount === maxCharacterSlotsAllowed && (
              <SubscriptionBanner
                iconType="hero"
                text="Your party is full. Unlock unlimited character creation."
                buttonLabel="Subscribe Now!"
                onClick={() =>
                  (window.location.href = `${config.ddbBaseUrl}/store/subscribe#plans`)
                }
              />
            )}

          {subscriptionTier.includes(HERO_TIER) &&
            characterCount === maxCharacterSlotsAllowed && (
              <SubscriptionBanner
                iconType="master"
                text="Unlock your full potential and EXCLUSIVE perks."
                buttonLabel="Upgrade Now!"
                onClick={() =>
                  (window.location.href = `${config.ddbBaseUrl}/store/subscribe#plans`)
                }
              />
            )}

          <header className={styles.header}>
            <h1 className={styles.h1}>My Characters</h1>
            <Button
              className={styles.button}
              href={createCharacterHref}
              onClick={createCharacterOnClick}
            >
              Create A Character
            </Button>
          </header>
          <div className={styles.subheader}>
            <p className={styles.slots}>
              Slots:
              <span className={styles.count}>
                {characterCount}/
                {/* TODO: Come back and use the subscription role to figure this out? This number won't be the same as our DB max int */}
                {maxCharacterSlotsAllowed === null ||
                maxCharacterSlotsAllowed === 2147483647
                  ? "Unlimited"
                  : `${maxCharacterSlotsAllowed} Used`}
              </span>
            </p>
            <div className={styles.pdfLinkWrapper}>
              <a
                href="https://media.dndbeyond.com/compendium-images/free-rules/ph/character-sheet.pdf"
                target="_blank"
                className={styles.pdfLink}
              >
                <ArrowDown className={styles.pdfLinkSvg}></ArrowDown>
                Download a blank character sheet
              </a>
            </div>
          </div>

          <div className="ddb-characters-listing-header-secondary">
            <SecondaryHeader
              hasLockedCharacters={hasLockedCharacters}
              maxCharacterSlotsAllowed={maxCharacterSlotsAllowed}
              characterCount={characterCount}
              characters={characters}
              characterIdsToUnlock={characterIdsToUnlock}
              subscriptionTier={subscriptionTier}
            />
          </div>
        </div>
        <SearchSort
          search={search}
          onSearch={setSearch}
          sort={sort}
          onSort={setSort}
          sortPreference={sortPreference}
          onSortPreference={setSortPreference}
        />
        <div className="ddb-characters-listing-body j-characters-listing__content">
          <div className="listing-container listing-container-ul RPGCharacter-listing">
            <div className="listing-body">
              <ul className="listing listing-rpgcharacter rpgcharacter-listing">
                {filteredCharacters.map((character) => (
                  <CharacterCard
                    key={`listing-item_${getId(character)}`}
                    character={{
                      ...character,
                      status: overrideStatusForUnlock({
                        character,
                        characterIdsToUnlock,
                        hasLockedCharacters,
                      }),
                    }}
                    hasLockedCharacters={hasLockedCharacters}
                    overCharacterLimit={overCharacterLimit}
                    reloadListing={reload}
                    lockCharacter={lockCharacter}
                    unlockCharacter={unlockCharacter}
                    canUnlockMore={canUnlockMore}
                    maxCharacterSlotsAllowed={maxCharacterSlotsAllowed}
                    currentCharacterCount={characterCount}
                  />
                ))}
              </ul>
              {filteredCharacters.length === 0 && (
                <>
                  {!!search ? (
                    <>
                      <p className={styles.noResultsTitle}>
                        It looks like we failed our investigation check.
                      </p>
                      <p className={styles.noResultsText}>
                        Cast guidance on us by refining your search, and
                        we&apos;ll try again!
                      </p>
                    </>
                  ) : (
                    <>
                      <p className={styles.noResultsTitle}>
                        Looks like you haven&apos;t created a character yet.
                      </p>
                      <p className={styles.noResultsText}>
                        Start your adventure by creating a character!
                      </p>
                    </>
                  )}
                </>
              )}
            </div>
            {lockedCharacters.length > 0 && (
              <>
                <h2 className={styles.deactivatedHeading}>
                  Deactivated Characters
                </h2>
                <p className={styles.deactivatedText}>
                  Activate characters by freeing up a slot, or add slots with a
                  <Button
                    className={styles.deactivatedButton}
                    variant="text"
                    size="small"
                    href={`${config.ddbBaseUrl}/subscribe`}
                    onClick={() => logUnlockSubscribeClicked()}
                  >
                    D&amp;D Beyond subscription.
                  </Button>
                </p>
                <div className="listing-body">
                  <ul className="listing listing-rpgcharacter rpgcharacter-listing">
                    {lockedCharacters.map((character) => (
                      <CharacterCard
                        key={`listing-item_${getId(character)}`}
                        character={{
                          ...character,
                          status: overrideStatusForUnlock({
                            character,
                            characterIdsToUnlock,
                            hasLockedCharacters,
                          }),
                        }} // TODO can this logic go in the utils?
                        hasLockedCharacters={hasLockedCharacters}
                        overCharacterLimit={overCharacterLimit}
                        reloadListing={reload}
                        lockCharacter={lockCharacter}
                        unlockCharacter={unlockCharacter}
                        canUnlockMore={canUnlockMore}
                        maxCharacterSlotsAllowed={maxCharacterSlotsAllowed}
                        currentCharacterCount={characterCount}
                      />
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="ddb-characters-listing__loading-indicator-wrapper">
          <ApiStatusIndicator
            isLoading={isLoading}
            error={loadingError || undefined}
            loadingMessage={"Loading Characters"}
            errorMessage={
              loadingError ? loadingError.message : "Error Loading Characters"
            }
          ></ApiStatusIndicator>
        </div>
        <div className="ddbcl-my-characters-listing__version">
          My Characters Version: v{config.version}
        </div>
        <MaxCharactersDialog
          open={isMaxCharacterMessageOpen}
          onClose={() => setIsMaxCharacterMessageOpen(false)}
        />
      </div>
    </UserPreferenceProvider>
  );
};
