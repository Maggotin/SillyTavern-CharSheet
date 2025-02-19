import { toWords } from "number-to-words";
import { FC, useEffect, useRef } from "react";

import SpinnerThird from "@dndbeyond/fontawesome-cache/svgs/regular/spinner-third.svg";

import useApiCall from "~/hooks/useApiCall";

import config from "../../../../../config";
import { logUnlockSubscribeClicked } from "../../../../../helpers/analytics";
import { unlockCharacters } from "../../../../../helpers/characterServiceApi";
import { getId } from "../../../../../state/selectors/characterUtils";
import { CharacterGridProps } from "../CharacterGrid";
import { FinalizeUnlock } from "../FinalizeUnlock";
import styles from "./styles.module.css";

interface SecondaryHeaderProps
  extends Pick<
    CharacterGridProps,
    "maxCharacterSlotsAllowed" | "characters" | "hasLockedCharacters"
  > {
  characterCount: number;
  subscriptionTier: string;
  characterIdsToUnlock: Array<number>;
}

export const SecondaryHeader: FC<SecondaryHeaderProps> = ({
  hasLockedCharacters,
  maxCharacterSlotsAllowed,
  characterCount,
  subscriptionTier,
  characters,
  characterIdsToUnlock,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [
    finalizeUnlock,
    isFinalizingUnlock,
    // Unlock state depends on context state passed by Waterdeep on the root element so we have to do a full page reload after a successful unlock.
  ] = useApiCall(unlockCharacters, () => window.location.reload());

  useEffect(() => {
    if (isFinalizingUnlock) {
      // Hacky workaround since showModal() isn't
      // supported by TypeScript <4.8.3
      (dialogRef.current as any)?.showModal();
    } else {
      // Hacky workaround since close() isn't
      // supported by TypeScript <4.8.3
      (dialogRef.current as any)?.close();
    }
  }, [isFinalizingUnlock]);

  if (hasLockedCharacters) {
    return (
      <>
        {/* Loading Dialog */}
        <dialog
          className={styles.dialog}
          ref={dialogRef}
          onClick={(evt) => {
            evt.stopPropagation();
            evt.nativeEvent.stopImmediatePropagation();
          }}
        >
          <SpinnerThird className={styles.spinner} />
        </dialog>

        {/* Max Characters Alert */}
        <div className={styles.alert}>
          <p className={styles.alertTitle}>Character Slots Exceeded</p>
          Your current D&amp;D Beyond Membership is:{" "}
          <strong>
            {subscriptionTier.toUpperCase()} ({maxCharacterSlotsAllowed} slots).{" "}
          </strong>
          To continue, select up to{" "}
          <strong>
            {maxCharacterSlotsAllowed
              ? `${toWords(
                  maxCharacterSlotsAllowed
                )} (${maxCharacterSlotsAllowed}) `
              : "unlimited "}
          </strong>
          characters to activate. Your other characters will be deactivated
          until you restore them by deleting an active character to free up a
          slot, or by adding more slots with a{` `}
          <a
            href={`${config.ddbBaseUrl}/subscribe`}
            onClick={() => logUnlockSubscribeClicked()}
          >
            D&amp;D Beyond Subscription
          </a>
        </div>

        {/* Bottom Unlock Bar */}
        <div className={styles.bottomBar}>
          <div className={styles.bottomContainer}>
            <p className={styles.bottomText}>
              Selected:{" "}
              <strong>
                {characterIdsToUnlock.length} / {maxCharacterSlotsAllowed}
              </strong>
            </p>
            <FinalizeUnlock
              charactersToUnlock={characters.filter((character) =>
                characterIdsToUnlock.includes(getId(character))
              )}
              finalizeUnlock={() => finalizeUnlock(characterIdsToUnlock)}
              disabled={isFinalizingUnlock}
              maxCharacterSlotsAllowed={maxCharacterSlotsAllowed}
            />
          </div>
        </div>
      </>
    );
  }

  if (characterCount === 0) {
    return (
      <div className="stcs-characters-listing-count-active">
        Character slots allow players to create characters. Once created, all of
        your characters will appear in the list below.
      </div>
    );
  }

  return null;
};
