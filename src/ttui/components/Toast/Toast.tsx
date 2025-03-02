import clsx from "clsx";
import React, { useEffect, useRef, type DialogHTMLAttributes, type FC } from "react";
import styles from "./Toast.module.css";

/**
 * Toast Usage
 * const [open, setOpen] = useState(false);
 *
 * const onClick = () => {
 *  setOpen(true);
 * };
 *
 * const onClose = () => {
 *  setOpen(false);
 * };
 *
 * <Button onClick={onClick}>Toast</Button>
 * <Toast
 *  open={open}
 *  autoHideDuration={6000}
 *  onClose={onClose}
 *  message="Note Archived"
 * />
 **/

interface ToastProps extends DialogHTMLAttributes<HTMLDialogElement> {
  align?: "left" | "right";
  autoHideDuration?: number;
  onClose: () => void;
}

let timer: NodeJS.Timeout | undefined;

export const Toast: FC<ToastProps> = ({
  align = "left",
  autoHideDuration = 6000,
  children,
  className,
  onClose,
  open,
  ...props
}) => {
  const ref = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    if (open) {
      // Prevent the Toast from grabbing focus
      ref.current?.setAttribute("open", "open");
      timer = setTimeout(onClose, autoHideDuration);
    } else {
      ref.current?.close?.();
      timer = undefined;
    }
    return () => clearTimeout(timer);
  }, [autoHideDuration, onClose, open]);

  return (
    <dialog
      className={clsx([styles.toast, styles[align], className])}
      ref={ref}
      {...props}
    >
      {children}
    </dialog>
  );
};
