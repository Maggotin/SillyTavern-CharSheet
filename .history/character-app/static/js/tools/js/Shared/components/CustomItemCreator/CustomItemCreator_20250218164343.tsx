import React, { useCallback, useContext, useState } from "react";

import { Collapsible } from "../../character-components/es";
import {
  Container,
  ContainerUtils,
} from "../../character-rules-engine/es";

import { InventoryManagerContext } from "../../managers/InventoryManagerContext";
import { AppNotificationUtils } from "../../utils";
import CustomizeDataEditor from "../CustomizeDataEditor";
import EditorBox from "../EditorBox";
import SimpleQuantity from "../SimpleQuantity";
import { ThemeButtonWithMenu } from "../common/Button";

interface Props {
  containers: Array<Container>;
}

export const CustomItemCreator: React.FC<Props> = ({ containers }) => {
  const { inventoryManager } = useContext(InventoryManagerContext);

  const getInitialCustomItemState = () => ({
    cost: null,
    description: null,
    name: inventoryManager.getDefaultCustomItemName(),
    notes: null,
    weight: null,
    quantity: 1,
  });

  const [customItem, setCustomItemProps] = useState(
    getInitialCustomItemState()
  );

  const handleOnSelectSuccess = useCallback(() => {
    AppNotificationUtils.dispatchSuccess(
      "Custom Item Added",
      `Added ${customItem.name}`
    );
    setCustomItemProps(getInitialCustomItemState());
  }, [getInitialCustomItemState, customItem]);

  return (
    <Collapsible
      className="ct-equipment-manage-pane__custom"
      layoutType="minimal"
      header={"Add Custom Item"}
    >
      <EditorBox>
        <CustomizeDataEditor
          data={customItem}
          enableName={true}
          enableNotes={true}
          enableDescription={true}
          enableCost={true}
          enableWeight={true}
          maxNameLength={128}
          onDataUpdate={(data) => {
            setCustomItemProps({
              ...customItem,
              ...data,
            });
          }}
        />
        <div className="ct-custom-item-creator__actions">
          <div className="ct-custom-item-creator__action ct-custom-item-creator__action--amount">
            <SimpleQuantity
              quantity={customItem.quantity ?? 1}
              onUpdate={(quantity) => {
                setCustomItemProps({
                  ...customItem,
                  quantity,
                });
              }}
            />
          </div>
          <div className="ct-custom-item-creator__action">
            <ThemeButtonWithMenu
              onSelect={(containerDefinitionKey) =>
                inventoryManager.handleCustomAdd(
                  { customItem, containerDefinitionKey },
                  handleOnSelectSuccess
                )
              }
              groupedOptions={ContainerUtils.getGroupedOptions(
                null,
                containers,
                "Add To:",
                inventoryManager.getSharingState()
              )}
            >
              Add{" "}
              {customItem.quantity === 1
                ? " Item"
                : ` ${customItem.quantity} Items`}
            </ThemeButtonWithMenu>
          </div>
        </div>
      </EditorBox>
    </Collapsible>
  );
};

export default CustomItemCreator;
