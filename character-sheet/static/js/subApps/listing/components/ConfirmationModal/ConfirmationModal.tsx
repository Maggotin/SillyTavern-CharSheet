import * as React from "react";
import { useEffect, useRef, useState } from "react";

import TriangleExclamation from "@dndbeyond/fontawesome-cache/svgs/regular/triangle-exclamation.svg";
import { Button } from "@dndbeyond/ttui/components/Button";

import styles from "./styles.module.css";

export interface ConfirmationModalProps {
  onClose: () => void;
  onConfirm: () => void;
  typeValueToConfirm?: string;
  isOpen: boolean;
  message: React.ReactNode;
  title: string;
  confirmText?: string;
}

export const ConfirmationModal = ({
  onClose,
  onConfirm,
  typeValueToConfirm,
  isOpen,
  message,
  title,
  confirmText = "Confirm",
}: ConfirmationModalProps) => {
  const [confirmEnabled, setConfirmEnabled] = useState(!typeValueToConfirm);
  const [inputValue, setInputValue] = useState("");

  const dialogRef = useRef<HTMLDialogElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const isMatch =
      value?.toLowerCase().trim() === typeValueToConfirm?.toLowerCase();

    setInputValue(value);

    if (isMatch) {
      setConfirmEnabled(true);
    } else if (confirmEnabled) {
      setConfirmEnabled(false);
    }
  };

  const handleConfirm = (e) => {
    e.preventDefault();
    if (confirmEnabled) onConfirm();
  };

  const handleClickBackdrop = (e) => {
    const rect = dialogRef.current?.getBoundingClientRect();
    const isClickInDialog =
      rect &&
      rect.top <= e.clientY &&
      e.clientY <= rect.top + rect.height &&
      rect.left <= e.clientX &&
      e.clientX <= rect.left + rect.width;

    if (!isClickInDialog) onClose();
  };

  useEffect(() => {
    if (isOpen) {
      // Hacky workaround since showModal() isn't
      // supported by TypeScript <4.8.3
      (dialogRef.current as any)?.showModal();
    } else {
      // Hacky workaround since close() isn't
      // supported by TypeScript <4.8.3
      (dialogRef.current as any)?.close();
    }
  }, [onClose, isOpen]);

  return (
    <dialog
      className={styles.confirmationDialog}
      ref={dialogRef}
      onClick={handleClickBackdrop}
      aria-labelledby="confirm-dialog"
    >
      <div className={styles.container}>
        <header className={styles.header}>
          <div id="confirm-dialog" className={styles.title}>
            {title}
          </div>
          {!typeValueToConfirm ? (
            <div className={styles.text}>{message}</div>
          ) : (
            <div className={styles.alert}>
              <TriangleExclamation className={styles.alertIcon} />
              <span className={styles.alertText}>{message}</span>
            </div>
          )}
        </header>
        {typeValueToConfirm && (
          <input
            type="text"
            className={styles.input}
            onChange={handleChange}
            value={inputValue}
            autoFocus
          />
        )}
        <footer className={styles.footer}>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            autoFocus={confirmEnabled}
            disabled={!confirmEnabled}
            onClick={handleConfirm}
          >
            {confirmText}
          </Button>
        </footer>
      </div>
    </dialog>
  );
};
