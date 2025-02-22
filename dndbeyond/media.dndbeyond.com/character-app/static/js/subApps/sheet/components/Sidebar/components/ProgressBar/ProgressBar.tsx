import clsx from "clsx";
import { FC, HTMLAttributes } from "react";

import { Bar } from "./Bar";
import styles from "./styles.module.css";

export interface ProgressBarProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onClick"> {
  options: Array<number>;
  value: number | null;
  onClick: (val: string | number | null) => void;
  isInteractive?: boolean;
}

export const ProgressBar: FC<ProgressBarProps> = ({
  className,
  options,
  value,
  onClick,
  isInteractive,
  ...props
}) => {
  const handleClick = (val: number | null) => {
    const isAlreadyNull = value === null && val === null;
    if (!isInteractive || isAlreadyNull) return;
    onClick(val);
  };

  return (
    <div className={clsx([styles.progressBar, className])} {...props}>
      <Bar
        value={null}
        variant={value !== null ? "implied" : "inactive"}
        onClick={() => handleClick(null)}
        aria-disabled={!isInteractive}
      >
        --
      </Bar>
      {options.map((number) => (
        <Bar
          variant={
            number === value
              ? "active"
              : !!value && number < value
              ? "implied"
              : "inactive"
          }
          value={number}
          onClick={() => handleClick(number)}
          aria-disabled={!isInteractive}
          key={`progress-bar-${number}`}
        >
          {number}
        </Bar>
      ))}
    </div>
  );
};
