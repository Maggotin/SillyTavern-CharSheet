import clsx from "clsx";
import { useState, type FC, type HTMLAttributes } from "react";
import styles from "./styles.module.css";
import { useSelector } from "react-redux";
import { appEnvSelectors } from "~/tools/js/Shared/selectors";

export interface ToggleProps
  extends Omit<HTMLAttributes<HTMLButtonElement>, "onClick"> {
  
  checked?: boolean;
  color?: "primary" | "secondary" | "warning" | "error" | "info" | "success" | "themed";
  onClick?: (isEnabled: boolean) => void;
  onChangePromise?: (
    newIsEnabled: boolean,
    accept: () => void,
    reject: () => void
  ) => void;
  disabled?: boolean;
}

export const Toggle: FC<ToggleProps> = ({
  checked,
  className,
  color = "primary",
  onClick,
  onChangePromise,
  ...props
}) => {
  const isReadonly = useSelector(appEnvSelectors.getIsReadonly);
  const [enabled, setEnabled] = useState(checked);

  const handleClick = (evt: React.MouseEvent): void => {
    if (!isReadonly) {
      evt.stopPropagation();
      evt.nativeEvent.stopImmediatePropagation();

      if (onChangePromise) {
        onChangePromise(
          !enabled,
          () => {
            setEnabled(!enabled);
          },
          () => {}
        );
      } else if (onClick) {
        onClick(!enabled);
        setEnabled(!enabled);
      }
    }
  };

  return (
    <button
      className={clsx([
        styles.toggle,
        styles[color],
        checked && styles.checked,
        className,
      ])}
      onClick={handleClick}
      aria-pressed={checked}
      {...props}
    />
  );
};
