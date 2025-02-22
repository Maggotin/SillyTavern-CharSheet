import clsx from "clsx";
import { HTMLAttributes, FC } from "react";

import { CloseSvg } from "@dndbeyond/character-components/es";

import styles from "./styles.module.css";

interface Props extends HTMLAttributes<HTMLDivElement> {
  type: "successes" | "fails";
  label: string;
  activeCount: number;
  totalCount: number;
  willBeActiveCount?: number;
  onUse: (evt: React.MouseEvent) => void;
  onClear: (evt: React.MouseEvent) => void;
}

export const DeathSavesMarks: FC<Props> = ({
  type,
  label,
  activeCount,
  totalCount,
  willBeActiveCount = 0,
  onUse,
  onClear,
  className,
  ...props
}) => {
  // TODO: Need to make these marks accessible - they currently cannot be interacted with with a keyboard.

  let marks: Array<React.ReactNode> = [];
  let availableSlots: number = totalCount;

  for (let i = 0; i < activeCount; i++) {
    marks.push(
      <span
        className={styles.mark}
        key={`${type}-active-${i}`}
        onClick={onClear}
      >
        <CloseSvg
          fillColor={type === "successes" ? "#00c797" : "#c53131"}
          secondaryFillColor=""
          key={`${type}-active-${i}`}
          className={clsx([styles.mark, styles.activeMark])}
        />
      </span>
    );
  }

  availableSlots -= activeCount;

  for (let i = 0; i < Math.min(availableSlots, willBeActiveCount); i++) {
    marks.push(
      <span
        key={`${type}-willbe-${i}`}
        className={clsx([
          styles.mark,
          styles.willBeActive,
          type === "fails" && styles.willBeFail,
        ])}
      />
    );
  }

  availableSlots -= willBeActiveCount;

  for (let i = 0; i < Math.min(availableSlots, totalCount); i++) {
    marks.push(
      <span
        key={`${type}-inactive-${i}`}
        className={clsx([styles.mark])}
        onClick={onUse}
      />
    );
  }

  return (
    <div
      className={clsx([styles.container, className])}
      data-testid={`${type}-group`}
      {...props}
    >
      <p className={styles.label}>{label}</p>
      <div className={styles.marks}>{marks}</div>
    </div>
  );
};
