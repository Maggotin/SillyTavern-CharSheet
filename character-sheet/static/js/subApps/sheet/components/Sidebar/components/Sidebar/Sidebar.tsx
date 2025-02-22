import clsx from "clsx";
import { FC, HTMLAttributes, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useSelector } from "react-redux";
import { DOWN, SwipeEventData, UP } from "react-swipeable";

import { syncTransactionSelectors } from "@dndbeyond/character-rules-engine";

import { Swipeable } from "~/components/Swipeable";
import { useCharacterTheme } from "~/contexts/CharacterTheme";
import { useSidebar } from "~/contexts/Sidebar";

import { getPaneProperties } from "../../helpers/paneUtils";
import { SidebarAlignmentEnum, SidebarPlacementEnum } from "../../types";
import { Pane } from "../Pane";
import { VisibilityControls } from "../VisiblilityControls";
import styles from "./styles.module.css";

export interface SidebarProps extends HTMLAttributes<HTMLDivElement> {
  setSwipedAmount?: (amount: number) => void;
}

/**
 * This component is responsible for rendering the sidebar and its contents. It uses volatile state to manage the visibility, placement, and alignment of the sidebar. It also uses the `Pane` component to render the active pane (the content of the sidebar) and the `VisibilityControls` component to render the controls for the sidebar. The sidebar is rendered as a portal to the body of the document.
 */

export const Sidebar: FC<SidebarProps> = ({
  children,
  className,
  setSwipedAmount,
  ...props
}) => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const { isDarkMode } = useCharacterTheme();
  const isSyncActive = useSelector(syncTransactionSelectors.getActive);
  const {
    sidebar: {
      isLocked,
      isVisible,
      placement,
      alignment,
      setIsVisible,
      setIsLocked,
      setPlacement,
      setAlignment,
    },
    pane: { activePane, paneHistoryNext, paneHistoryPrevious },
  } = useSidebar();

  const { isFullWidth, forceDarkMode } = getPaneProperties(activePane);

  const handlePrevious = () => paneHistoryPrevious();

  const handleNext = () => paneHistoryNext();

  const handleTogglePlacement = (place: SidebarPlacementEnum) =>
    setPlacement(place);

  const handleToggleAlignment = (align: SidebarAlignmentEnum) =>
    setAlignment(align);

  const handleToggleLock = () => setIsLocked(!isLocked);

  const handleToggleVisibility = () => {
    if (isLocked) return;
    if (isVisible && setSwipedAmount) setSwipedAmount(0);
    setIsVisible(!isVisible);
  };

  const handleSwipe = ({ deltaX, dir }: SwipeEventData): void => {
    const isVerticalChange = [UP, DOWN].includes(dir);
    if (!isVerticalChange && setSwipedAmount) setSwipedAmount(deltaX);
  };

  const handleEscape = (e: KeyboardEvent) => {
    if (
      e.key === "Escape" &&
      isVisible &&
      !isLocked &&
      placement !== SidebarPlacementEnum.FIXED
    )
      handleToggleVisibility();
  };

  const handleClickOutside = (e: MouseEvent) => {
    const sidebar = sidebarRef.current;
    const containsElement =
      e.composedPath().indexOf(sidebar as EventTarget) !== -1;
    const target = e.target as HTMLElement;
    const isDiceControl = target?.classList?.contains(
      "dice_notification_controls"
    );
    const isFixed = placement === SidebarPlacementEnum.FIXED;

    // If element clicked is a dice control, don't close the sidebar
    if (isDiceControl) return;

    // If element clicked is not in the sidebar, and the sidebar is visible, not locked, and not fixed, close the sidebar
    if (sidebar && !containsElement && isVisible && !isLocked && !isFixed)
      handleToggleVisibility();
  };

  useEffect(() => {
    document.body.addEventListener("keydown", handleEscape);
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.body.removeEventListener("keydown", handleEscape);
      document.removeEventListener("click", handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible, isLocked, placement]);

  return createPortal(
    <div className="ct-sidebar__portal">
      <div
        className={clsx([
          styles.mask,
          isVisible ? styles.visible : styles.hidden,
          isDarkMode && styles.dark,
        ])}
      />
      <div>
        <Swipeable
          handlerFunctions={{
            onSwipedRight: handleToggleVisibility,
            onSwiping: handleSwipe,
          }}
        >
          <div
            role="dialog"
            aria-label="Information Sidebar"
            className={clsx([
              "ct-sidebar",
              styles.sidebar,
              styles[alignment],
              isVisible ? styles.visible : styles.hidden,
              isFullWidth && "ct-sidebar--is-full-width",
              isDarkMode && "ct-sidebar--is-dark-mode",
            ])}
            ref={sidebarRef}
            {...props}
          >
            <div className="ct-sidebar__inner">
              <VisibilityControls
                isVisible={isVisible}
                isLocked={isLocked}
                placement={placement}
                alignment={alignment}
                onToggleVisibility={handleToggleVisibility}
                onToggleLock={handleToggleLock}
                onToggleAlignment={handleToggleAlignment}
                onTogglePlacement={handleTogglePlacement}
              />
              {isVisible && (
                <Pane
                  isFullWidth={isFullWidth}
                  forceDarkMode={forceDarkMode || isDarkMode}
                  handlePrevious={handlePrevious}
                  handleNext={handleNext}
                />
              )}
            </div>
            {isSyncActive && <div className={styles.syncBlocker} />}
          </div>
        </Swipeable>
      </div>
    </div>,
    document.body
  );
};
