import clsx from "clsx";
import { FC, HTMLAttributes } from "react";

import {
  BoxBackground,
  InspirationBoxSvg,
  InspirationTokenSvg,
} from "@dndbeyond/character-components/es";

import { useCharacterEngine } from "~/hooks/useCharacterEngine";

import styles from "./styles.module.css";

interface Props extends HTMLAttributes<HTMLDivElement> {
  inspiration: boolean;
  onToggle?: () => void;
  onClick?: () => void;
  isInteractive: boolean;
  isMobile?: boolean;
}
export const Inspiration: FC<Props> = ({
  inspiration,
  onClick,
  onToggle,
  isInteractive,
  isMobile,
  ...props
}) => {
  const { characterTheme: theme } = useCharacterEngine();

  const inspirationText = "Heroic Inspiration";

  const handleToggleClick = (evt: React.MouseEvent): void => {
    if (onToggle && isInteractive) {
      evt.stopPropagation();
      evt.nativeEvent.stopImmediatePropagation();
      onToggle();
    }
  };

  const handleClick = (evt: React.MouseEvent): void => {
    if (onClick) {
      evt.stopPropagation();
      evt.nativeEvent.stopImmediatePropagation();
      onClick();
    }
  };

  if (isMobile) {
    return (
      <div className={styles.mobileWrapper} {...props}>
        <div
          className={clsx([
            styles.mobileButton,
            inspiration && styles.active,
            isInteractive && styles.interactive,
          ])}
          onClick={handleToggleClick}
          role="checkbox"
          aria-checked={!!inspiration}
          data-testid="inspiration"
        >
          {inspirationText}
        </div>
      </div>
    );
  }

  return (
    <div onClick={handleClick} {...props}>
      <div
        className={clsx([styles.box, isInteractive && styles.interactive])}
        onClick={handleToggleClick}
        role="checkbox"
        aria-checked={!!inspiration}
        data-testid="inspiration"
      >
        <BoxBackground StyleComponent={InspirationBoxSvg} theme={theme} />
        <div className={styles.status}>
          {inspiration && <InspirationTokenSvg theme={theme} />}
        </div>
      </div>
      <div
        className={clsx([styles.label, theme.isDarkMode && styles.dark])}
        onClick={handleClick}
        data-testid="inspiration-label"
      >
        {inspirationText}
      </div>
    </div>
  );
};
