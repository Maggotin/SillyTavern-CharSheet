import clsx from "clsx";
import { FC, HTMLAttributes } from "react";

import Lock from "../../fontawesome-cache/svgs/solid/lock.svg";
import Unlock from "../../fontawesome-cache/svgs/solid/unlock.svg";

import {
  SidebarAlignmentEnum,
  SidebarPlacementEnum,
} from "~/subApps/sheet/components/Sidebar/types";
import Tooltip from "~/tools/js/commonComponents/Tooltip";

import { AlignLeftIcon } from "../../svgs/AlignLeftIcon";
import { AlignRightIcon } from "../../svgs/AlignRightIcon";
import { ArrowsLeftIcon } from "../../svgs/ArrowsLeftIcon";
import { ArrowsRightIcon } from "../../svgs/ArrowsRightIcon";
import { FixedIcon } from "../../svgs/FixedIcon";
import { OverlayIcon } from "../../svgs/OverlayIcon";
import styles from "./styles.module.css";

interface VisibilityControlsProps extends HTMLAttributes<HTMLDivElement> {
  isLocked: boolean;
  isVisible: boolean;
  placement: SidebarPlacementEnum;
  alignment: SidebarAlignmentEnum;
  onToggleLock: () => void;
  onToggleVisibility: () => void;
  onTogglePlacement: (val: "overlay" | "fixed") => void;
  onToggleAlignment: (val: "left" | "right") => void;
}

export const VisibilityControls: FC<VisibilityControlsProps> = ({
  className,
  isLocked,
  isVisible,
  placement,
  alignment,
  onToggleLock,
  onToggleVisibility,
  onTogglePlacement,
  onToggleAlignment,
  ...props
}) => {
  const isActive = (value: "overlay" | "fixed" | "left" | "right") => {
    if (placement === value || alignment === value) return styles.active;
    return undefined;
  };

  const tippyOpts = {
    dynamicTitle: true,
    interactive: true,
  };

  return (
    <div
      className={clsx([
        styles.controls,
        alignment === "left" && styles.left,
        className,
      ])}
      {...props}
    >
      {isLocked ? (
        <Tooltip title="Locked" isDarkMode tippyOpts={tippyOpts}>
          <button
            className={styles.locked}
            onClick={onToggleLock}
            aria-label="Locked"
          >
            <Lock />
          </button>
        </Tooltip>
      ) : (
        <>
          <div className={styles.visibility}>
            <Tooltip
              className={!isVisible ? styles.closed : ""}
              title={isVisible ? "Hide Sidebar" : "Show Sidebar"}
              isDarkMode
              tippyOpts={{
                ...tippyOpts,
                placement: "top-end",
              }}
            >
              <button
                className={styles.arrows}
                onClick={onToggleVisibility}
                aria-label={isVisible ? "Hide sidebar" : "Show sidebar"}
              >
                {isVisible ? <ArrowsRightIcon /> : <ArrowsLeftIcon />}
              </button>
            </Tooltip>
            <Tooltip
              title="Unlocked"
              isDarkMode
              tippyOpts={tippyOpts}
              className={!isVisible ? styles.hidden : ""}
            >
              <button onClick={onToggleLock} aria-label="Unlocked">
                <Unlock />
              </button>
            </Tooltip>
          </div>
          <div
            className={clsx([styles.overlay, !isVisible ? styles.hidden : ""])}
          >
            <Tooltip title="Overlay" isDarkMode tippyOpts={tippyOpts}>
              <button
                className={isActive("overlay")}
                onClick={() => onTogglePlacement("overlay")}
                aria-label="Set to overlay position"
              >
                <OverlayIcon />
              </button>
            </Tooltip>
            <Tooltip title="Fixed" isDarkMode tippyOpts={tippyOpts}>
              <button
                className={isActive("fixed")}
                onClick={() => onTogglePlacement("fixed")}
                aria-label="Set to fixed position"
              >
                <FixedIcon />
              </button>
            </Tooltip>
          </div>
          <div
            className={clsx([
              styles.placement,
              alignment === "left" && styles.left,
              !isVisible ? styles.hidden : "",
            ])}
          >
            <Tooltip title="Left" isDarkMode tippyOpts={tippyOpts}>
              <button
                className={isActive("left")}
                onClick={() => onToggleAlignment("left")}
                aria-label="Align Left"
              >
                <AlignLeftIcon />
              </button>
            </Tooltip>
            <Tooltip title="Right" isDarkMode tippyOpts={tippyOpts}>
              <button
                className={isActive("right")}
                onClick={() => onToggleAlignment("right")}
                aria-label="Align Right"
              >
                <AlignRightIcon />
              </button>
            </Tooltip>
          </div>
        </>
      )}
    </div>
  );
};
