import clsx from "clsx";
import {
  forwardRef,
  HTMLAttributes,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { createPortal } from "react-dom";

import XMark from "@dndbeyond/fontawesome-cache/svgs/regular/xmark.svg";
import { Toast } from "@dndbeyond/ttui/components/Toast";

import { Notification } from "~/tools/js/Shared/stores/typings";

import styles from "./styles.module.css";

export interface NotificationSystemHandlers {
  addNotification: (notification: Notification) => void;
  removeNotification: (notification: Notification) => void;
}

const timeoutDuration = 5000;

interface NotificationSystemProps
  extends Omit<HTMLAttributes<HTMLElement>, "open" | "contentEditable"> {}

/**
 * NotificationSystem is a component that manages the display of notifications
 * in toast messages which appear in the character sheet.
 */
export const NotificationSystem = forwardRef<
  HTMLDialogElement,
  NotificationSystemProps
>(({ className, ...props }, ref) => {
  const [isOpen, setIsOpen] = useState(true);
  const [notifications, setNotifications] = useState<Array<Notification>>([]);
  const [notificationTimeoutHandle, setNotificationTimeoutHandle] = useState<
    number | undefined
  >();
  const [portal, setPortal] = useState<HTMLDivElement | null>(null);

  const addNotification = (notification) => {
    if (notifications.filter((n) => n.uid === notification.uid).length === 0) {
      setNotifications([...notifications, notification]);
    }
    clearTimeout(notificationTimeoutHandle);
    (function openNotification() {
      if (!isOpen) {
        setIsOpen(true);
      } else {
        setNotificationTimeoutHandle(() => {
          const handle = window.setTimeout(() => {
            openNotification();
          }, timeoutDuration + 100);
          return handle;
        });
      }
    })();
  };

  const removeNotification = (notification) => {
    notifications[0].onRemove?.();
    setNotifications(notifications.filter((n) => n.uid !== notification.uid));
  };

  useImperativeHandle<any, NotificationSystemHandlers>(
    ref,
    (): NotificationSystemHandlers => ({
      addNotification,
      removeNotification,
    })
  );

  const handleClose = () => {
    setIsOpen(false);
    removeNotification(notifications[0]);
  };

  useEffect(() => {
    const portalEl = document.createElement("div");
    portalEl.classList.add("ct-notification__portal");
    portalEl.style.zIndex = "100000";
    portalEl.style.position = "fixed";
    document.body.appendChild(portalEl);
    setPortal(portalEl);
    return () => {
      document.body.removeChild(portalEl);
    };
  }, []);

  return notifications[0] && portal
    ? createPortal(
        <Toast
          className={clsx([
            styles.toast,
            notifications[0].level && styles[notifications[0].level],
          ])}
          open={isOpen}
          onClose={handleClose}
          autoHideDuration={timeoutDuration}
          {...props}
        >
          <button
            className={styles.closeButton}
            onClick={handleClose}
            aria-label="Dismiss notification"
          >
            <XMark className={styles.closeIcon} />
          </button>
          <p className={styles.title}>{notifications[0].title}</p>
          <p className={styles.message}>{notifications[0].message}</p>
        </Toast>,
        portal
      )
    : null;
});
