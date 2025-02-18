import { FC, HTMLAttributes } from "react";

import styles from "./styles.module.css";

interface MaxCharactersMessageTextProps extends HTMLAttributes<HTMLDivElement> {
  includeTitle?: boolean;
  useLinks?: boolean;
  useMyCharactersLink?: boolean;
}

export const MaxCharactersMessageText: FC<MaxCharactersMessageTextProps> = ({
  includeTitle,
  useLinks,
  useMyCharactersLink,
  ...props
}) => {
  const subscribe = useLinks ? (
    <a className={styles.link} href="/store/subscribe">
      Subscribe
    </a>
  ) : (
    "Subscribe"
  );

  const myCharacters =
    useMyCharactersLink || useLinks ? (
      <a className={styles.link} href="/characters">
        My Characters
      </a>
    ) : (
      "My Characters"
    );

  return (
    <div {...props}>
      {includeTitle && (
        <p className={styles.messageTitle}>
          Oops! Your character slots are full.
        </p>
      )}
      <p className={styles.messageSubtext}>
        You&apos;re quite the adventurer! {subscribe} to unlock additional
        slots, or return to {myCharacters} and delete a character to make room.
      </p>
    </div>
  );
};
