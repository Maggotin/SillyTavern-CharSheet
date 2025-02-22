import clsx from "clsx";
import { FC, HTMLAttributes } from "react";

import { useSidebar } from "~/contexts/Sidebar/Sidebar";
import { PaneBorder } from "~/svgs";

import { PaneContent } from "../PaneContent";
import { PaneControls } from "../PaneControls";
import styles from "./styles.module.css";

/**
 * The Pane component serves as a way to render the active pane inside of the sidebar. It is a simple component that renders the children passed to it. It is used in the Sidebar component to render the active pane inside of the sidebar. The `isFullWidth` prop determines whether the pane should have padding on the left and right or not. Panes such as CharacterManagePane have items which should be full width. Most panes should have padding on the left and right.
 **/
interface PaneProps extends HTMLAttributes<HTMLDivElement> {
  handlePrevious: () => void;
  handleNext: () => void;
  isFullWidth?: boolean;
  forceDarkMode?: boolean;
}

export const Pane: FC<PaneProps> = ({
  isFullWidth,
  forceDarkMode,
  handlePrevious,
  handleNext,
  ...props
}) => {
  const {
    pane: { activePane },
  } = useSidebar();

  return (
    <div className={styles.pane} {...props}>
      <PaneBorder
        className={clsx([styles.border, forceDarkMode && styles.dark])}
      />
      <div className={clsx([styles.gap, forceDarkMode && styles.dark])} />
      <div
        className={clsx([
          styles.content,
          forceDarkMode && styles.dark,
          isFullWidth && styles.fullWidth,
        ])}
      >
        <PaneControls handlePrevious={handlePrevious} handleNext={handleNext} />
        <PaneContent activePane={activePane} />
      </div>
      <PaneBorder
        className={clsx([
          styles.border,
          styles.bottom,
          forceDarkMode && styles.dark,
        ])}
      />
    </div>
  );
};
