import clsx from "clsx";

import { CharacterStatusSlug } from "../../rules-engine/es";

import styles from "./styles.module.css";

interface PremadeCharacterEditStatusProps {
  characterStatus: CharacterStatusSlug | null;
  isReadonly: boolean;
  isBuilderView?: boolean;
}

export const PremadeCharacterEditStatus = ({
  characterStatus,
  isReadonly,
  isBuilderView,
}: PremadeCharacterEditStatusProps) => {
  return (
    <>
      {characterStatus === CharacterStatusSlug.PREMADE && !isReadonly && (
        <div
          className={clsx([
            styles.editStateIndicator,
            isBuilderView && styles.editStateIndicatorBuilder,
          ])}
        >
          Premade <strong>EDIT</strong> mode <strong>ENABLED</strong>
        </div>
      )}
    </>
  );
};
