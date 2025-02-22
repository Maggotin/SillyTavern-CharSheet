import clsx from "clsx";
import { FC, HTMLAttributes } from "react";

import { GroupedListingItem, ListingItem } from "../../types";
import { ListingGroup } from "./ListingGroup";
import { ListingItemButton } from "./ListingItemButton/ListingItemButton";
import styles from "./styles.module.css";

export interface ListingProps extends HTMLAttributes<HTMLDivElement> {
  items: Array<ListingItem | GroupedListingItem>;
  disabledIds?: Array<number | string>;
  onQuickSelect?: (entity: ListingItem["entity"]) => void;
}

/**
 * A generic listing component that displays a list of items. Items cannot be
 * internal because it is used for both races/species and classes. Keeping the
 * data fetch outside this component allows for more flexibility.
 */

export const Listing: FC<ListingProps> = ({
  className,
  items,
  disabledIds,
  onQuickSelect,
  ...props
}) => {
  return (
    <div className={clsx([styles.listing, className])} {...props}>
      {items.length > 0 ? (
        items.map((item) => {
          const isDisabled = disabledIds && disabledIds.includes(item.id);

          return item.type === "group" ? (
            <ListingGroup
              item={item as GroupedListingItem}
              key={item.id + "group"}
              disabledIds={disabledIds}
              onQuickSelect={onQuickSelect}
            />
          ) : (
            <ListingItemButton
              item={item as ListingItem}
              isDisabled={isDisabled}
              key={item.id}
              onQuickSelect={onQuickSelect}
            />
          );
        })
      ) : (
        <p className={styles.notFound}>No Listings Found</p>
      )}
    </div>
  );
};
