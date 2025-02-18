import clsx from "clsx";
import { FC } from "react";

import { ButtonProps } from "../../ttui/components/Button";

import { Button } from "~/components/Button";

import styles from "./styles.module.css";

export interface SectionButtonProps extends ButtonProps {}

export const SectionButton: FC<SectionButtonProps> = ({
  className,
  onClick,
  ...props
}) => {
  return (
    <Button
      className={clsx([styles.sectionButton, className])}
      onClick={onClick}
      {...props}
    />
  );
};
