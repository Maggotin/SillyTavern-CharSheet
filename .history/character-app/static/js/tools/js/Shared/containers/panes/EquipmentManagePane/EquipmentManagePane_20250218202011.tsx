import React from "react";
import { useContext } from "react";
import { connect } from "react-redux";

import {
  Collapsible,
  CollapsibleHeaderContent,
  CollapsibleHeading,
} from "@dndbeyond/character-components/es";
import {
  ApiAdapterPromise,
  ApiAdapterRequestConfig,
  ApiResponse,
  rulesEngineSelectors,
  BaseItemDefinitionContract,
  RuleData,
  CampaignUtils,
  CharacterTheme,
  Container,
  ContainerUtils,
  InventoryManager,
  Constants,
  serviceDataSelectors,
  PartyInfo,
  ItemManager,
} from "@dndbeyond/character-rules-engine/es";

import { Button } from "~/components/Button";
import { ItemName } from "~/components/ItemName";
import { Link } from "~/components/Link";
import { NumberDisplay } from "~/components/NumberDisplay";
import { Popover } from "~/components/Popover";
import { PopoverContent } from "~/components/PopoverContent";
import { useSidebar } from "~/contexts/Sidebar";
import { PaneInfo } from "~/contexts/Sidebar/Sidebar";
import { Header } from "~/subApps/sheet/components/Sidebar/components/Header";
import { PaneComponentEnum } from "~/subApps/sheet/components/Sidebar/types";

import { CustomItemCreator } from "../../../components/CustomItemCreator";
import EquipmentShop from "../../../components/EquipmentShop";
import ItemDetail from "../../../components/ItemDetail";
import { ItemSlotManager } from "../../../components/ItemSlotManager";
import { ThemeButtonWithMenu } from "../../../components/common/Button";
import { InventoryManagerContext } from "../../../managers/InventoryManagerContext";
import { SharedAppState } from "../../../stores/typings";

interface Props {
  loadAvailableItems: (
    additionalConfig?: Partial<ApiAdapterRequestConfig>
  ) => ApiAdapterPromise<ApiResponse<Array<BaseItemDefinitionContract>>>;
  ruleData: RuleData;
  proficiencyBonus: number;
  containers: Array<Container>;
  theme: CharacterTheme;
  partyInfo: PartyInfo | null;
  inventoryManager: InventoryManager;
  paneHistoryPush: PaneInfo["paneHistoryPush"];
}

class EquipmentManagePane extends React.PureComponent<Props> {
  renderInventory = (inventory: Array<ItemManager>): React.ReactNode => {
    const {
      theme,
      ruleData,
      proficiencyBonus,
      inventoryManager,
      partyInfo,
      containers,
    } = this.props;

    return inventory.map((item) => {
      const isContainer = item.isContainer();
      const container = inventoryManager.getContainer(
        item.generateContainerDefinitionKey()
      );

      const canMove = inventoryManager.canMoveItem(item.item);

      const calloutButton: React.ReactNode = isContainer ? (
        <Popover
          trigger={
            <Button size="xx-small" variant="outline" themed>
              Delete
            </Button>
          }
          position="bottomRight"
          data-testid="remove-container-button"
          maxWidth={250}
        >
          <PopoverContent
            title={`Remove ${item.getName()}?`}
            content={`Removing the ${item.getName()} will also remove all of its ${
              container && container.hasInfusions() ? "infusions and " : " "
            } contents.`}
            confirmText="Delete"
            onConfirm={() => item.handleRemove()}
            withCancel
          />
        </Popover>
      ) : canMove ? (
        <ThemeButtonWithMenu
          showSingleOption={true}
          containerEl={
            document.querySelector("stcs-sidebar__portal") as HTMLElement
          }
          groupedOptions={ContainerUtils.getGroupedOptions(
            item.getContainerDefinitionKey(),
            containers,
            "Move To:",
            partyInfo
              ? CampaignUtils.getSharingState(partyInfo)
              : Constants.PartyInventorySharingStateEnum.OFF
          )}
          buttonStyle="outline"
          onSelect={(containerDefinitionKey) =>
            item.handleMove({ containerDefinitionKey })
          }
        >
          Move
        </ThemeButtonWithMenu>
      ) : (
        <Button
          onClick={() => item.handleRemove()}
          size="xx-small"
          variant="outline"
          themed
        >
          Delete
        </Button>
      );

      return (
        <Collapsible
          key={item.getUniqueKey()}
          className={`ct-equipment-manage-pane__item${
            item.isContainer()
              ? " ct-equipment-manage-pane__item--is-container"
              : ""
          }`}
          layoutType={"minimal"}
          header={
            <CollapsibleHeaderContent
              heading={
                <div className="ct-equipment-manage-pane__item-header">
                  <div className="ct-equipment-manage-pane__item-header-action">
                    <ItemSlotManager
                      isUsed={!!item.isEquipped()}
                      theme={theme}
                      canUse={inventoryManager.canEquipUnequipItem(item.item)}
                      onSet={(uses) => {
                        //TODO need different component than SlotManager for item equipped/unequipped
                        if (uses === 0) {
                          item.handleUnequip();
                        }

                        if (uses === 1) {
                          item.handleEquip();
                        }
                      }}
                      useTooltip={false}
                      showEmptySlot={!isContainer}
                    />
                  </div>
                  <div
                    className={`ct-equipment-manage-pane__item-header-name${
                      isContainer
                        ? " ct-equipment-manage-pane__item-header-name--is-container"
                        : ""
                    }`}
                  >
                    {isContainer ? (
                      "Container details"
                    ) : (
                      <ItemName item={item.item} showLegacy={true} />
                    )}
                  </div>
                </div>
              }
              callout={calloutButton}
            />
          }
        >
          <ItemDetail
            theme={theme}
            item={item.item}
            ruleData={ruleData}
            showCustomize={false}
            showImage={false}
            proficiencyBonus={proficiencyBonus}
          />
        </Collapsible>
      );
    });
  };

  renderContainers = (): React.ReactNode => {
    const { theme, inventoryManager } = this.props;

    return inventoryManager.getAllContainers().map((container) => {
      const containerInventory = container.getInventoryItems({
        includeContainer: true,
      }).items;

      const inventoryLength = containerInventory.length;
      let isEmpty: boolean = inventoryLength === 0;

      let headerNode: React.ReactNode = (
        <CollapsibleHeaderContent
          heading={
            <CollapsibleHeading>{`${container.getName()} (${inventoryLength})`}</CollapsibleHeading>
          }
          callout={
            <div className="ct-equipment-manage-pane__callout">
              <NumberDisplay
                type="weightInLb"
                number={container.getWeightInfo().total}
              />
            </div>
          }
        />
      );

      return (
        <Collapsible header={headerNode} key={container.getDefinitionKey()}>
          <div className="ct-equipment-manage-pane__inventory">
            {this.renderInventory(containerInventory)}

            {isEmpty && (
              <div className="ct-equipment-manage-pane__empty-container">
                There are no items in your {container.getName()}
              </div>
            )}
          </div>
        </Collapsible>
      );
    });
  };

  render() {
    const {
      ruleData,
      proficiencyBonus,
      containers,
      theme,
      partyInfo,
      paneHistoryPush,
    } = this.props;

    return (
      <div className="ct-equipment-manage-pane">
        <Header>Manage Inventory</Header>
        <Collapsible header="Add Items" initiallyCollapsed={false}>
          <EquipmentShop
            partyInfo={partyInfo}
            containers={containers}
            theme={theme}
            ruleData={ruleData}
            proficiencyBonus={proficiencyBonus}
          />
          <CustomItemCreator containers={containers} />
        </Collapsible>

        {/*container collapsibles*/}
        {this.renderContainers()}

        <div className="ct-equipment-manage-pane__links">
          <div className="ct-equipment-manage-pane__link">
            <Link
              useTheme={true}
              onClick={() =>
                paneHistoryPush(PaneComponentEnum.STARTING_EQUIPMENT)
              }
            >
              Starting Equipment
            </Link>
          </div>
          <div className="ct-equipment-manage-pane__link">
            <Link
              useTheme={true}
              onClick={() => paneHistoryPush(PaneComponentEnum.CURRENCY)}
            >
              Currency
            </Link>
          </div>
          <div className="ct-equipment-manage-pane__link">
            <Link
              useTheme={true}
              onClick={() => paneHistoryPush(PaneComponentEnum.ENCUMBRANCE)}
            >
              Encumbrance
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state: SharedAppState) {
  return {
    ruleData: rulesEngineSelectors.getRuleData(state),
    proficiencyBonus: rulesEngineSelectors.getProficiencyBonus(state),
    containers: rulesEngineSelectors.getInventoryContainers(state),
    theme: rulesEngineSelectors.getCharacterTheme(state),
    partyInfo: serviceDataSelectors.getPartyInfo(state),
  };
}

function EquipmentManagePaneContainer(props) {
  const { inventoryManager } = useContext(InventoryManagerContext);
  const {
    pane: { paneHistoryPush },
  } = useSidebar();
  return (
    <EquipmentManagePane
      inventoryManager={inventoryManager}
      paneHistoryPush={paneHistoryPush}
      {...props}
    />
  );
}

export default connect(mapStateToProps)(EquipmentManagePaneContainer);
