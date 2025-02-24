import clsx from "clsx";
import { FC, HTMLAttributes, MouseEvent, useState } from "react";

import ChevronDown from "../../../../../../public/scripts/extensions/third-party/SillyTavern-CharSheet/src/fontawesome-cache/svgs/solid/chevron-down.svg";

import { LegacyBadge } from "~/components/LegacyBadge";
import { GroupedListingItem } from "~/subApps/builder/types";

import { ListingItemButton } from "../ListingItemButton";
import styles from "./styles.module.css";

export interface ListingGroupProps extends HTMLAttributes<HTMLDetailsElement> {
  item: GroupedListingItem;
  disabledIds?: Array<number | string>;
  onQuickSelect?: (entity: GroupedListingItem["entity"]) => void;
}

export const ListingGroup: FC<ListingGroupProps> = ({
  className,
  item,
  disabledIds,
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

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleToggle = (e: MouseEvent) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  return (
    <details className={styles.details} key={id} open={isOpen} {...props}>
      <summary
        className={clsx([styles.summary, className])}
        onClick={handleToggle}
      >
        {image && (
          <img src={image} alt={`${heading} avatar`} className={styles.image} />
        )}
        <div>
          <header className={styles.header}>
            <h3 className={styles.heading}>
              {heading}{" "}
              <span
                className={styles.count}
              >{`(${itemProps.listItems.length})`}</span>
            </h3>
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
        <ChevronDown className={styles.icon} />
      </summary>
      <div className={styles.content}>
        {itemProps.listItems.map((item) => (
          <ListingItemButton
            item={item}
            isDisabled={disabledIds && disabledIds.includes(item.id)}
            key={item.id}
            onQuickSelect={onQuickSelect}
          />
        ))}
      </div>
    </details>
  );
};
