import clsx from "clsx";
import { FC, HTMLAttributes, ReactNode } from "react";

import { DataOriginName } from "@dndbeyond/character-components/es";
import {
  FormatUtils,
  ItemUtils,
  ModifierUtils,
} from "@dndbeyond/character-rules-engine";

import { ItemName } from "~/components/ItemName";
import { NumberDisplay } from "~/components/NumberDisplay";
import { ArmorClassExtraTypeEnum, ArmorClassTypeEnum } from "~/constants";
import { useSidebar } from "~/contexts/Sidebar";
import { useCharacterEngine } from "~/hooks/useCharacterEngine";
import { PaneIdentifierUtils } from "~/tools/js/Shared/utils";
import { Item, DataOrigin, Modifier } from "~/types";

import { getDataOriginComponentInfo } from "../../../helpers/paneUtils";
import { PaneComponentEnum } from "../../../types";
import styles from "./styles.module.css";

export interface ArmorClassDetailProps extends HTMLAttributes<HTMLDivElement> {}

export const ArmorClassDetail: FC<ArmorClassDetailProps> = ({
  className,
  ...props
}) => {
  const {
    pane: { paneHistoryPush },
  } = useSidebar();
  const { acAdjustments, acSuppliers, characterTheme } = useCharacterEngine();
  let hasOverrideAcAdjustment =
    acAdjustments.overrideAc && acAdjustments.overrideAc.value !== null;

  const handleItemDetailShow = (item: Item): void => {
    paneHistoryPush(
      PaneComponentEnum.ITEM_DETAIL,
      PaneIdentifierUtils.generateItem(ItemUtils.getMappingId(item))
    );
  };

  const handleDataOriginShowDetail = (dataOrigin: DataOrigin): void => {
    let component = getDataOriginComponentInfo(dataOrigin);
    if (component.type !== PaneComponentEnum.ERROR_404) {
      paneHistoryPush(component.type, component.identifiers);
    }
  };

  return (
    <div
      className={clsx([
        styles.items,
        hasOverrideAcAdjustment && styles.itemsOverridden,
      ])}
    >
      {acSuppliers.map((armorSupplier, idx) => {
        const { type, amount, extra, extraType } = armorSupplier;

        if (!amount) {
          return null;
        }

        let amountDisplay: ReactNode;
        switch (type) {
          case ArmorClassTypeEnum.ARMOR:
          case ArmorClassTypeEnum.OVERRIDE_BASE_ARMOR:
            amountDisplay = amount;
            break;
          default:
            amountDisplay = <NumberDisplay type="signed" number={amount} />;
        }

        let extraDisplay: ReactNode;
        switch (type) {
          case ArmorClassTypeEnum.DEX_BONUS:
            extraDisplay = extra === null ? "" : `Max ${extra}`;
            break;

          default:
            switch (extraType) {
              case ArmorClassExtraTypeEnum.MODIFIER:
                extraDisplay = (
                  <DataOriginName
                    dataOrigin={ModifierUtils.getDataOrigin(extra as Modifier)}
                    onClick={handleDataOriginShowDetail}
                    theme={characterTheme}
                  />
                );
                break;

              case ArmorClassExtraTypeEnum.ITEM:
                if (extra) {
                  extraDisplay = (
                    <ItemName
                      item={extra as Item}
                      onClick={() => handleItemDetailShow(extra as Item)}
                    />
                  );
                } else {
                  extraDisplay = "None";
                }
                break;

              case ArmorClassExtraTypeEnum.NUMBER:
                extraDisplay = extra
                  ? FormatUtils.renderLocaleNumber(extra as number)
                  : "";
                break;

              case ArmorClassExtraTypeEnum.STRING:
              default:
                extraDisplay = extra;
            }
            break;
        }

        return (
          <div
            className={styles.item}
            key={idx}
            {...props}
            data-testid="armor-class-detail"
          >
            <div className={styles.value}>{amountDisplay}</div>
            <div className={styles.label}>
              <span>{type}</span>
              {extraDisplay && (
                <span className={styles.source}>({extraDisplay})</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
