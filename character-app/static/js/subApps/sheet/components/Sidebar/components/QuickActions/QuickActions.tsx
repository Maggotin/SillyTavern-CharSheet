import { FC, HTMLAttributes } from "react";

import { ThemeButton } from "~/tools/js/Shared/components/common/Button";

import styles from "./styles.module.css";

interface Props extends HTMLAttributes<HTMLDivElement> {
  actions: { label: string; onClick: () => void; disabled: boolean }[];
}

export const QuickActions: FC<Props> = ({ actions, ...props }) => {
  return (
    <div className={styles.container}>
      <div className={styles.title}>Quick Actions:</div>
      <div className={styles.buttons}>
        {actions.map((item, idx) => {
          return (
            <ThemeButton
              key={idx}
              size="medium"
              onClick={item.onClick}
              isInteractive={!item.disabled}
            >
              {item.label}
            </ThemeButton>
          );
        })}
      </div>
    </div>
  );
};
