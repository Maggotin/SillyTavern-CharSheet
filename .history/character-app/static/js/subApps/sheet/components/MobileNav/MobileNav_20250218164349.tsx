import clsx from "clsx";
import { FC, HTMLAttributes } from "react";
import { createPortal } from "react-dom";

import GridIcon from "../../fontawesome-cache/svgs/solid/grid.svg";
import { useIsVisible } from "../../ttui/hooks/useIsVisible";

import { useSidebar } from "~/contexts/Sidebar";
import { useUnpropagatedClick } from "~/hooks/useUnpropagatedClick";

import { sidebarId } from "../../constants";
import { ArrowsLeftIcon } from "../Sidebar/svgs/ArrowsLeftIcon";
import { ArrowsRightIcon } from "../Sidebar/svgs/ArrowsRightIcon";
import { SectionMenu } from "./SectionMenu";
import styles from "./styles.module.css";

export interface MobileNavProps extends HTMLAttributes<HTMLDivElement> {}

export const MobileNav: FC<MobileNavProps> = ({ className, ...props }) => {
  const {
    ref,
    isVisible: isMenuVisible,
    setIsVisible: setIsMenuVisible,
  } = useIsVisible(false);
  const { sidebar } = useSidebar();

  const handleToggleSidebar = useUnpropagatedClick(() => {
    setIsMenuVisible(false);
    sidebar.setIsVisible(!sidebar.isVisible);
  });

  const handleToggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  const handleCloseMenu = (e: MouseEvent) => {
    e?.stopPropagation();
    setIsMenuVisible(false);
  };

  return createPortal(
    <div className={clsx([styles.mobileNav, className])} ref={ref} {...props}>
      {!sidebar.isVisible && (
        <div>
          <button
            className={styles.navToggle}
            onClick={handleToggleMenu}
            aria-label="Show navigation"
          >
            <GridIcon className={styles.icon} />
          </button>
          <SectionMenu open={isMenuVisible} onClose={handleCloseMenu} />
        </div>
      )}
      <button
        className={styles.sidebarToggle}
        onClick={handleToggleSidebar}
        aria-controls={sidebarId}
        aria-label={`${sidebar.isVisible ? "Hide" : "Show"} sidebar`}
      >
        {sidebar.isVisible ? (
          <ArrowsRightIcon className={styles.icon} />
        ) : (
          <ArrowsLeftIcon className={styles.icon} />
        )}
      </button>
    </div>,
    document.body
  );
};
