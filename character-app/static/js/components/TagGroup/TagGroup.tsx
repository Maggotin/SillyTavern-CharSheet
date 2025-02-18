import clsx from "clsx";
import { FC, HTMLAttributes } from "react";

import styles from "./styles.module.css";

export interface TagGroupProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  tags: Array<string>;
}

export const TagGroup: FC<TagGroupProps> = ({
  label,
  tags,
  className,
  ...props
}) => {
  if (!tags.length) return null;
  return (
    <div className={clsx([styles.tagGroup, className])} {...props}>
      <div className={styles.label}>{label}:</div>
      <div className={styles.group}>
        {tags.map((tag) => (
          <div className={styles.tag} key={tag}>
            {tag}
          </div>
        ))}
      </div>
    </div>
  );
};
