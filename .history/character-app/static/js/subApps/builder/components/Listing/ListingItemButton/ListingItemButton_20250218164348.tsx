import clsx from "clsx";
import { FC, HTMLAttributes, MouseEvent } from "react";

import ChevronRight from "../../fontawesome-cache/svgs/solid/chevron-right.svg";

import { LegacyBadge } from "~/components/LegacyBadge";
import { ListingItem } from "~/subApps/builder/types";

import styles from "./styles.module.css";

export interface ListingItemProps extends HTMLAttributes<HTMLButtonElement> {
  item: ListingItem;
  isDisabled?: boolean;
  onQuickSelect?: (entity: ListingItem["entity"]) => void;
}

export const ListingItemButton: FC<ListingItemProps> = ({
  className,
  item,
  isDisabled,
  onQuickSelect,
  ...props
}) => {
  const {
    entityTypeId,
    error,
    heading,
    id,
    image,
    isLegacy,
    metaItems,
    text,
    type,
    onClick,
    ...itemProps
  } = item;

  const handleClick = (e: MouseEvent) => {
    e.preventDefault();
    //QuickSelect is from Quick and RandomBuild modes only
    if (onQuickSelect && !isDisabled) {
      onQuickSelect(item.entity);
    } else if (onClick && !isDisabled) {
      onClick(id);
    }
  };

  return (
    <button
      className={clsx([styles.button, className])}
      onClick={handleClick}
      aria-disabled={isDisabled}
      key={id}
      {...props}
    >
      {image && (
        <img src={image} alt={`${heading} avatar`} className={styles.image} />
      )}
      <div>
        <header className={styles.header}>
          <h3 className={styles.heading}>{heading}</h3>
          {isLegacy && <LegacyBadge className={styles.tag} />}
        </header>
        {text && <p className={styles.text}>{text}</p>}
        {metaItems && metaItems.length > 0 && (
          <div className={styles.metaItems}>
            {metaItems.map((metaItem, idx) => (
              <span className={styles[metaItem.type]} key={idx}>
                {metaItem.text}
              </span>
            ))}
          </div>
        )}
      </div>
      <ChevronRight className={styles.icon} />
    </button>
  );
};
