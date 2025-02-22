import clsx from "clsx";
import { HTMLAttributes } from "react";
import { useSelector } from "react-redux";

import Pen from "@dndbeyond/fontawesome-cache/svgs/light/pen.svg";

import { appEnvSelectors } from "../../tools/js/Shared/selectors";
import styles from "./styles.module.css";

interface EditableNameProps extends HTMLAttributes<HTMLDivElement> {
  onClick: () => void;
}

/**
 * Component which displays children with an edit button to the right. It is
 * used in panes to give custom names to items, etc.
 */
export const EditableName = ({
  children,
  className,
  onClick,
  ...props
}: EditableNameProps) => {
  const isReadOnly = useSelector(appEnvSelectors.getIsReadonly);

  return (
    <div className={clsx([styles.editableName, className])} {...props}>
      <div>{children}</div>
      {!isReadOnly && (
        <button
          className={styles.button}
          onClick={onClick}
          aria-label="Edit name"
        >
          <Pen className={styles.icon} />
        </button>
      )}
    </div>
  );
};
