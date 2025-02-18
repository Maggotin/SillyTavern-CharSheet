import clsx from "clsx";
import { FC } from "react";

import CloseIcon from "../../fontawesome-cache/svgs/solid/x.svg";

import { Button } from "../Button";
import { Dialog, DialogProps } from "../Dialog";
import styles from "./styles.module.css";

export interface ConfirmModalProps extends DialogProps {
  heading?: string;
  onClose: () => void;
  onConfirm: () => void;
  confirmButtonText?: string;
}

export const ConfirmModal: FC<ConfirmModalProps> = ({
  children,
  className,
  heading,
  onClose,
  onConfirm,
  confirmButtonText,
  ...props
}) => {
  return (
    <Dialog
      className={clsx([styles.confirmModal, className])}
      onClose={onClose}
      modal
      {...props}
    >
      <header className={styles.header}>
        <h2>{heading}</h2>
        <Button
          className={styles.closeButton}
          size="x-small"
          variant="text"
          onClick={onClose}
          aria-label={`Close ${heading} Modal`}
          forceThemeMode="light"
        >
          <CloseIcon className={styles.closeIcon} />
        </Button>
      </header>
      <div className={styles.content}>{children}</div>
      <footer className={styles.footer}>
        <Button className={styles.footerButton} onClick={onClose}>
          Cancel
        </Button>
        <Button
          className={styles.footerButton}
          color="success"
          onClick={onConfirm}
          forceThemeMode="light"
        >
          {confirmButtonText || "Confirm"}
        </Button>
      </footer>
    </Dialog>
  );
};
