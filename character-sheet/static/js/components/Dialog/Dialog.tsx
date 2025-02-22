import clsx from "clsx";
import { HTMLAttributes, useEffect, useRef } from "react";

import styles from "./styles.module.css";

export interface DialogProps extends HTMLAttributes<HTMLDialogElement> {
  open: boolean;
  onClose: (e?: MouseEvent) => void;
  useMyCharactersLink?: boolean;
  modal?: boolean;
}

export const Dialog: React.FC<DialogProps> = ({
  open,
  onClose,
  modal,
  children,
  className,
  ...props
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const handleClose = (e?: MouseEvent) => {
    onClose(e);
    dialogRef.current?.close();
  };

  const handleClickBackdrop = (e) => {
    const rect = dialogRef.current?.getBoundingClientRect();
    const isClickInDialog =
      rect &&
      rect.top <= e.clientY &&
      e.clientY <= rect.top + rect.height &&
      rect.left <= e.clientX &&
      e.clientX <= rect.left + rect.width;

    if (!isClickInDialog) handleClose();
  };

  useEffect(() => {
    if (modal && open) dialogRef.current?.showModal();

    if (!open) handleClose();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialogRef.current, open, modal]);

  return (
    <dialog
      className={clsx([styles.dialog, className])}
      ref={dialogRef}
      onClick={modal ? handleClickBackdrop : undefined}
      open={modal ? undefined : open}
      aria-modal={modal}
      {...props}
    >
      {children}
    </dialog>
  );
};
