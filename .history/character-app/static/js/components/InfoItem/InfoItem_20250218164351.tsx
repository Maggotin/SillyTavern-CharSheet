import clsx from "clsx";
import { FC, HTMLAttributes } from "react";

import { InfoItem as TtuiInfoItem } from "../../ttui/components/InfoItem";

import { useUnpropagatedClick } from "~/hooks/useUnpropagatedClick";

import styles from "./styles.module.css";

interface InfoItemProps extends HTMLAttributes<HTMLElement> {
  label: string;
  color?: "primary"; // Not needed here, but fixes ts error
  inline?: boolean;
}

/**
 * This component is an attribute for a given item, spell, or other entity.
 * The InfoItemList component is a customized version of the InfoItem component from
 * the ../../ttui library.
 **/
export const InfoItem: FC<InfoItemProps> = ({
  className,
  onClick,
  ...props
}) => {
  const handleClick = useUnpropagatedClick(onClick);

  return (
    <TtuiInfoItem
      className={clsx([styles.item, className])}
      onClick={onClick ? handleClick : undefined}
      {...props}
    />
  );
};
