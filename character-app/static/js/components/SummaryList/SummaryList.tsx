import { FC, HTMLAttributes } from "react";

import styles from "./styles.module.css";

export interface SummaryListProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  list: Array<string>;
}

export const SummaryList: FC<SummaryListProps> = ({
  title,
  list,
  ...props
}) => {
  if (!list.length) {
    return null;
  }

  return (
    <div {...props}>
      <p className={styles.title}>
        {title}: <span className={styles.listItems}>{list.join(", ")}</span>
      </p>
    </div>
  );
};
