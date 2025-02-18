import React, { useCallback, useContext, useState } from "react";

import {
  CharacterTheme,
  ContainerManager,
  ItemManager,
} from "../../character-rules-engine/es";

import { useSidebar } from "~/contexts/Sidebar";
import { PaneComponentEnum } from "~/subApps/sheet/components/Sidebar/types";

import { ThemeButton } from "../../../Shared/components/common/Button";
import { InventoryManagerContext } from "../../../Shared/managers/InventoryManagerContext";
import { PaneIdentifierUtils } from "../../../Shared/utils";
import InventoryItem from "../../components/InventoryItem";
import { InventoryTableHeader } from "../../components/InventoryTableHeader";

interface Props {
  container: ContainerManager;
  inventory: Array<ItemManager>;
  showNotes?: boolean;
  isReadonly: boolean;
  theme: CharacterTheme;
  showTableHeader?: boolean;
}

interface InventoryActionsProps
  extends Pick<Props, "isReadonly" | "container" | "inventory"> {
  onContainerClick: (
    evt: React.MouseEvent | React.KeyboardEvent,
    container: ContainerManager,
    showAddItems: boolean
  ) => void;
  showContents: boolean;
  onShowContentsClick: (showContents: boolean) => void;
}
const InventoryActions: React.FC<InventoryActionsProps> = ({
  isReadonly,
  container,
  inventory,
  onContainerClick,
  onShowContentsClick,
  showContents,
}) => {
  const { inventoryManager } = useContext(InventoryManagerContext);

  if (isReadonly) {
    return null;
  }

  const containerName = container.getName();

  const classNames: Array<string> = ["ct-inventory__actions"];
  if (inventory.length > 0 && showContents) {
    classNames.push("ct-inventory__actions--collapsed");
  }

  return (
    <div className={classNames.join(" ")}>
      {inventoryManager.canAddToContainer(container.container) ? (
        <span
          role="button"
          className="ct-inventory__action"
          onClick={(evt) => onContainerClick(evt, container, true)}
          onKeyDown={(evt) => {
            if (evt.key === "Enter") {
              onContainerClick(evt, container, true);
            }
          }}
        >
          {container.isCharacterContainer()
            ? `+ Add ${containerName}`
            : `+ Add items to your ${containerName}`}
        </span>
      ) : (
        <span />
      )}
      {inventory.length > 0 && (
        <span
          role="button"
          className="ct-inventory__action"
          onClick={() => onShowContentsClick(!showContents)}
          onKeyDown={(evt) => {
            if (evt.key === "Enter") {
              onShowContentsClick(!showContents);
            }
          }}
        >
          {showContents ? "Hide Contents" : "Show Contents"}
        </span>
      )}
    </div>
  );
};

const EmptyInventory: React.FC<InventoryActionsProps> = ({
  isReadonly,
  container,
  inventory,
  ...restProps
}) => {
  const {
    pane: { paneHistoryStart },
  } = useSidebar();

  if (isReadonly) {
    return (
      <div className="ct-inventory__empty">
        No equipment has been added for this character.
      </div>
    );
  }

  if (container.isCharacterContainer()) {
    return (
      <div className="ct-inventory__choose">
        <div className="ct-inventory__choose-actions">
          <div className="ct-inventory__choose-action">
            <ThemeButton
              block={true}
              onClick={() =>
                paneHistoryStart(PaneComponentEnum.STARTING_EQUIPMENT)
              }
              stopPropagation={true}
            >
              Starting Equipment or Gold
            </ThemeButton>
          </div>
          <div className="ct-inventory__choose-action-sep">or</div>
          <div className="ct-inventory__choose-action">
            <ThemeButton
              block={true}
              onClick={() =>
                paneHistoryStart(PaneComponentEnum.EQUIPMENT_MANAGE)
              }
              stopPropagation={true}
            >
              Add Items
            </ThemeButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <InventoryActions
      inventory={inventory}
      container={container}
      isReadonly={isReadonly}
      onContainerClick={restProps.onContainerClick}
      showContents={restProps.showContents}
      onShowContentsClick={restProps.onShowContentsClick}
    />
  );
};

const Inventory: React.FC<Props> = ({
  container,
  inventory,
  showNotes = true,
  isReadonly,
  theme,
  showTableHeader = true,
}) => {
  const [showContents, setShowContents] = useState(true);
  const {
    pane: { paneHistoryStart },
  } = useSidebar();

  const handleContainerShow = useCallback(
    (
      evt: React.MouseEvent | React.KeyboardEvent,
      container: ContainerManager,
      showAddItems: boolean
    ): void => {
      evt.nativeEvent.stopImmediatePropagation();
      evt.stopPropagation();

      paneHistoryStart(
        PaneComponentEnum.CONTAINER,
        PaneIdentifierUtils.generateContainer(
          container.getDefinitionKey(),
          showAddItems
        )
      );
    },
    [container]
  );

  const isEmpty: boolean = inventory.length === 0;

  return (
    <div className="ct-inventory">
      {/*<h2 style={visuallyHidden}>Inventory</h2>*/}
      {showTableHeader && <InventoryTableHeader showNotes={showNotes} />}
      <div className="ct-inventory__items">
        {isEmpty ? (
          <EmptyInventory
            inventory={inventory}
            container={container}
            isReadonly={isReadonly}
            onShowContentsClick={setShowContents}
            showContents={showContents}
            onContainerClick={handleContainerShow}
          />
        ) : (
          <React.Fragment>
            {showContents &&
              inventory.map((item) => (
                <InventoryItem
                  key={item.getUniqueKey()}
                  item={item}
                  onEquip={item.handleEquip}
                  onUnequip={item.handleUnequip}
                  onItemShow={(mappingId) =>
                    paneHistoryStart(
                      PaneComponentEnum.ITEM_DETAIL,
                      PaneIdentifierUtils.generateItem(mappingId)
                    )
                  }
                  showNotes={showNotes}
                  theme={theme}
                  isReadonly={isReadonly}
                />
              ))}
            <InventoryActions
              inventory={inventory}
              container={container}
              isReadonly={isReadonly}
              onContainerClick={handleContainerShow}
              onShowContentsClick={setShowContents}
              showContents={showContents}
            />
          </React.Fragment>
        )}
      </div>
    </div>
  );
};

export default Inventory;
