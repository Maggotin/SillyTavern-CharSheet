import clsx from "clsx";
import React, {
  cloneElement,
  FC,
  HTMLAttributes,
  ReactElement,
  useEffect,
  useRef,
  useState,
} from "react";
import { v4 as uuidv4 } from "uuid";

import CloseIcon from "../../fontawesome-cache/svgs/solid/x.svg";

import { Button } from "~/components/Button";
import { Dialog } from "~/components/Dialog";
import { Textarea } from "~/components/Textarea";

import styles from "./styles.module.css";

interface EditorWithDialogProps extends HTMLAttributes<HTMLDivElement> {
  heading: ReactElement;
  placeholder: string;
  content: string;
  editButtonLabel: string;
  addButtonLabel: string;
  onSave?: (content: string) => void;
  extraNode?: React.ReactNode;
  saveOnBlur?: boolean;
}

export const EditorWithDialog: FC<EditorWithDialogProps> = ({
  addButtonLabel,
  className,
  editButtonLabel,
  content = "",
  extraNode,
  heading,
  onSave,
  placeholder,
  saveOnBlur = true,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const textareaInput = useRef<HTMLDivElement>(null);
  const id = uuidv4();
  const headingNode = cloneElement(heading, { className: styles.heading });

  const handleInputBlur = (content: string): void => {
    if (saveOnBlur) {
      if (onSave) onSave(content);
    }
  };

  const handleShowModal = () => {
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  const modalHeading: string = content.trim().length
    ? editButtonLabel
    : addButtonLabel;
  const buttonLabel: string = modalHeading;

  useEffect(() => {
    const body = document.querySelector("body");
    if (!body) return;

    // Prevent scrolling when modal is visible
    if (isOpen) {
      body.style.overflow = "hidden";
    } else {
      body.style.overflow = "";
    }
  }, [isOpen]);

  return (
    <div className={clsx([styles.container, className])} {...props}>
      <header className={styles.header}>
        {headingNode}
        <Button onClick={handleShowModal} size="xx-small" color="builder-green">
          {buttonLabel}
        </Button>
      </header>
      {content.trim().length > 0 && (
        <div className={styles.preview} data-testid="textarea-editor-preview">
          {content}
        </div>
      )}
      <Dialog
        className={styles.dialog}
        open={isOpen}
        onClose={handleCloseModal}
        data-testid="textarea-editor-modal"
        modal
      >
        <header className={styles.modalHeader}>
          <h2 className={styles.modalHeading}>{modalHeading}</h2>
          <button
            className={styles.closeButton}
            onClick={handleCloseModal}
            aria-label="Close modal"
          >
            <CloseIcon />
          </button>
        </header>
        <div className={styles.content}>
          <label className={styles.title} htmlFor={id}>
            {heading}
          </label>
          <Textarea
            className={styles.textarea}
            ref={textareaInput}
            id={id}
            placeholder={placeholder}
            value={content}
            onInputKeyUp={() => {}}
            onInputBlur={handleInputBlur}
          />
          {extraNode && <div className={styles.extra}>{extraNode}</div>}
        </div>
      </Dialog>
    </div>
  );
};
