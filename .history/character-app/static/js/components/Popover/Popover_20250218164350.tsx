import clsx from "clsx";
import React, {
  FC,
  ReactElement,
  ReactNode,
  cloneElement,
  useEffect,
} from "react";

import { useIsVisible } from "../../ttui/hooks/useIsVisible";

import { useCharacterTheme } from "~/contexts/CharacterTheme";

import { Dialog } from "../Dialog";
import styles from "./styles.module.css";

/**
 * This is a popover component to handle dialogs that are dependent on a location from a trigger element.
 * It uses the useIsVisible hook to handle the visibility of the dialog. The position of the dialog
 * is determined by the position prop, which can be set to topLeft, topRight, left, right, bottomLeft, or bottomRight.
 * The maxWidth prop can be used to set the maximum width of the dialog. The trigger prop is the element that will trigger
 * the dialog to open.The popover component also handles the positioning of the dialog based on the trigger element. The
 * handleToggle function toggles the visibility of the dialog, and the handleClose function closes the dialog. The popover
 * component also adds an event listener to the cancel button in the dialog to close the dialog when clicked.
 *
 * In order for a cancel button to work, it must have a `data-cancel` attribute.
 **/
interface PopoverProps {
  className?: string;
  children?: ReactNode;
  position?:
    | "topLeft"
    | "topRight"
    | "left"
    | "right"
    | "bottomLeft"
    | "bottomRight"
    | "bottom";
  trigger: ReactElement;
  maxWidth?: number;
  variant?: "default" | "menu";
  "data-testid"?: string;
}

export const Popover: FC<PopoverProps> = ({
  children,
  className,
  maxWidth = 250,
  position = "bottomRight",
  trigger,
  variant = "default",
  ...props
}) => {
  const { ref: popoverRef, isVisible, setIsVisible } = useIsVisible(false);
  const { isDarkMode } = useCharacterTheme();

  const handleToggle = (e: MouseEvent) => {
    e?.stopPropagation();
    setIsVisible(!isVisible);
  };

  const handleClose = (e: MouseEvent) => {
    e?.stopPropagation();
    setIsVisible(false);
  };

  // Make a copy of the trigger element with an added `onClick` event listener
  const triggerWithHandlers = cloneElement(trigger, {
    onClick: (e: MouseEvent) => handleToggle(e),
  });

  useEffect(() => {
    // Check to see if the popover has a cancel button based on `data-cancel` attribute
    const cancelButton = popoverRef.current?.querySelector("[data-cancel]");

    // If there is a cancel button, add an event listener to close the popover
    if (cancelButton) {
      cancelButton.addEventListener("click", handleClose);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [popoverRef.current]);

  const mapChildrenWithProps = () => {
    // Check if children is a ReactElement
    if (React.isValidElement(children)) {
      // Create a copy of the ReactElement and attach handleClose function to it
      return cloneElement(children as ReactElement, {
        handleClose,
      });
    }
    // If not just return the children - means its a primitive type
    else {
      return children;
    }
  };

  return (
    <div
      className={clsx([styles.popoverContainer, isDarkMode && styles.dark])}
      ref={popoverRef}
    >
      {triggerWithHandlers}
      <Dialog
        className={clsx([
          styles.popover,
          styles[variant],
          styles[position],
          className,
        ])}
        style={{ maxWidth }}
        open={isVisible}
        onClose={handleClose}
        onClick={(e) => e.stopPropagation()}
        {...props}
      >
        {mapChildrenWithProps()}
      </Dialog>
    </div>
  );
};
