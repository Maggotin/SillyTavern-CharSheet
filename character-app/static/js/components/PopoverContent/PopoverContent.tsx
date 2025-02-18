import { FC, ReactNode } from "react";

import { Button } from "../Button";
import styles from "./styles.module.css";

interface PopoverContentProps {
  title?: string;
  content: string;
  confirmText?: ReactNode;
  onConfirm?: () => void;
  withCancel?: boolean;
  handleClose?: () => void;
}

export const PopoverContent: FC<PopoverContentProps> = ({
  title,
  content,
  confirmText = "Confirm",
  onConfirm,
  withCancel,
  handleClose,
}) => (
  <>
    {title && <header className={styles.deletePopoverHeader}>{title}</header>}
    <div className={styles.deletePopoverContent}>{content}</div>
    <footer className={styles.deletePopoverFooter}>
      {withCancel && (
        <Button
          size="x-small"
          variant="outline"
          color="secondary"
          themed
          data-cancel
        >
          Cancel
        </Button>
      )}
      {onConfirm && (
        <Button
          onClick={() => {
            if (handleClose) handleClose();
            if (onConfirm) onConfirm();
          }}
          size="x-small"
          variant="outline"
          color="secondary"
          themed
        >
          {confirmText}
        </Button>
      )}
    </footer>
  </>
);
