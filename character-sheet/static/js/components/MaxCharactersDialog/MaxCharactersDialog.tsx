import { HTMLAttributes, useEffect, useRef } from "react";

import { Button } from "@dndbeyond/ttui/components/Button";

import { MaxCharactersMessageText } from "../MaxCharactersMessageText";
import styles from "./styles.module.css";

interface MaxCharactersDialogProps extends HTMLAttributes<HTMLDialogElement> {
  open: boolean;
  onClose: () => void;
  useMyCharactersLink?: boolean;
}

export const MaxCharactersDialog: React.FC<MaxCharactersDialogProps> = ({
  open,
  onClose,
  useMyCharactersLink,
  ...props
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const handleClickBackdrop = (e) => {
    const rect = dialogRef.current?.getBoundingClientRect();
    const isClickInDialog =
      rect &&
      rect.top <= e.clientY &&
      e.clientY <= rect.top + rect.height &&
      rect.left <= e.clientX &&
      e.clientX <= rect.left + rect.width;

    if (!isClickInDialog) (dialogRef.current as any)?.close();
  };

  useEffect(() => {
    if (open) {
      // Hacky workaround since showModal() isn't
      // supported by TypeScript <4.8.3
      (dialogRef.current as any)?.showModal();
    } else {
      // Hacky workaround since close() isn't
      // supported by TypeScript <4.8.3
      (dialogRef.current as any)?.close();
    }
  }, [onClose, open]);

  return (
    <dialog
      className={styles.maxCharactersDialog}
      ref={dialogRef}
      onClick={handleClickBackdrop}
      {...props}
    >
      <header>
        <h2 className={styles.dialogTitle}>Your character slots are full</h2>
      </header>
      <MaxCharactersMessageText useMyCharactersLink={useMyCharactersLink} />
      <footer className={styles.dialogFooter}>
        <Button href="/store/subscribe" variant="outline">
          Subscribe
        </Button>
        <Button onClick={onClose}>Close</Button>
      </footer>
    </dialog>
  );
};
