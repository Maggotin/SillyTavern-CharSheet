import clsx from "clsx";
import { FC, HTMLAttributes } from "react";

import ChevronLeft from "../../../../../../public/scripts/extensions/third-party/SillyTavern-CharSheet/src/fontawesome-cache/svgs/solid/chevron-left.svg";
import ChevronRight from "../../../../../../public/scripts/extensions/third-party/SillyTavern-CharSheet/src/fontawesome-cache/svgs/solid/chevron-right.svg";

import { Button } from "~/components/Button";
import { useCharacterTheme } from "~/contexts/CharacterTheme";
import { useSidebar } from "~/contexts/Sidebar/Sidebar";

import styles from "./styles.module.css";

interface PaneControlsProps extends HTMLAttributes<HTMLElement> {
  handlePrevious?: () => void;
  handleNext?: () => void;
}

export const PaneControls: FC<PaneControlsProps> = ({
  handlePrevious,
  handleNext,
  ...props
}) => {
  const { isDarkMode } = useCharacterTheme();
  const {
    pane: { activePane, showControls, isAtStart, isAtEnd },
  } = useSidebar();

  if (!activePane || !showControls) return null;

  const forceDarkMode = !isDarkMode && activePane.type === "CHARACTER_MANAGE";

  return (
    <nav className={styles.controls} {...props}>
      <Button
        className={clsx([styles.button, forceDarkMode && styles.dark])}
        size="xx-small"
        variant="text"
        disabled={isAtStart}
        onClick={isAtStart ? undefined : handlePrevious}
      >
        <ChevronLeft />
        <span className={styles.label}>Prev</span>
      </Button>
      <Button
        className={clsx([styles.button, forceDarkMode && styles.dark])}
        size="xx-small"
        variant="text"
        disabled={isAtEnd}
        onClick={isAtEnd ? undefined : handleNext}
      >
        <span className={styles.label}>Next</span>
        <ChevronRight />
      </Button>
    </nav>
  );
};
