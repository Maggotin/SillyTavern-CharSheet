import clsx from "clsx";
import { FC, HTMLAttributes } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "~/components/Button";
import { useCharacterEngine } from "~/hooks/useCharacterEngine";
import { navigationConfig } from "~/tools/js/CharacterBuilder/config";

import { RouteKey } from "../../constants";
import styles from "./styles.module.css";

export interface SpeciesDisplayProps extends HTMLAttributes<HTMLDivElement> {
  onRequestAction?: () => void;
  actionText?: string;
  headingText?: string;
}

export const SpeciesDisplay: FC<SpeciesDisplayProps> = ({
  actionText,
  className,
  headingText,
  ...props
}) => {
  const navigate = useNavigate();
  const { characterId, race, ruleData, ruleDataUtils } = useCharacterEngine();

  const { baseName, fullName, portraitAvatarUrl, subRaceShortName } =
    race || {};
  const portrait =
    portraitAvatarUrl || ruleDataUtils.getDefaultRaceImageUrl(ruleData);

  // Navigate back to the class manage page
  const handleNavigate = (): void =>
    navigate(
      navigationConfig
        .getRouteDefPath(RouteKey.RACE_MANAGE)
        .replace(":characterId", characterId)
    );

  return (
    <div className={clsx([styles.speciesDisplay, className])} {...props}>
      <h3 className={styles.heading}>{headingText || `Selected Species`}</h3>
      <div className={styles.content}>
        {portrait && (
          <img
            className={styles.portrait}
            src={portrait}
            alt={fullName || baseName || ""}
            width={50}
            height={50}
          />
        )}
        <p className={styles.species}>
          {subRaceShortName && (
            <span className={styles.subspecies}>{subRaceShortName}</span>
          )}
          {baseName}
        </p>
        <Button
          className={styles.button}
          onClick={handleNavigate}
          size="xx-small"
          variant="builder"
        >
          {actionText || `Change Species`}
        </Button>
      </div>
    </div>
  );
};
