import React from "react";
import { useContext } from "react";
import { connect, DispatchProp } from "react-redux";

import {
  rulesEngineSelectors,
  CampaignUtils,
  serviceDataActions,
  Constants,
  Container,
  ContainerUtils,
  InventoryManager,
  InfusionUtils,
  Item,
  ItemUtils,
  RuleData,
  GroupedMenuOption,
  serviceDataSelectors,
  PartyInfo,
} from "../../character-rules-engine/es";

import { Button } from "~/components/Button";
import { Popover } from "~/components/Popover";
import { PopoverContent } from "~/components/PopoverContent";
import { useSidebar } from "~/contexts/Sidebar";
import { PaneInfo } from "~/contexts/Sidebar/Sidebar";
import { PaneComponentEnum } from "~/subApps/sheet/components/Sidebar/types";

import SimpleQuantity from "../../components/SimpleQuantity";
import {
  RemoveButton,
  ThemeButton,
  ThemeButtonWithMenu,
} from "../../components/common/Button";
import { InventoryManagerContext } from "../../managers/InventoryManagerContext";
import * as appEnvSelectors from "../../selectors/appEnv";
import { SharedAppState } from "../../stores/typings";
import { PaneIdentifierUtils } from "../../utils";

interface LabelLookup {
  consume: string;
  remove: string;
  unequip: string;
  equip: string;
  attune: string;
  unattune: string;
}

interface Props extends DispatchProp {
  item: Item;
  hasMaxAttunedItems: boolean;
  ruleData: RuleData;
  isReadonly: boolean;
  containers: Array<Container>;
  onPostRemoveNavigation?: PaneComponentEnum;
  partyInfo: PartyInfo | null;
  inventoryManager: InventoryManager;
  paneHistoryStart: PaneInfo["paneHistoryStart"];
}
interface State {
  quantity: number;
  newQuantity: number;
}
class ItemDetailActions extends React.PureComponent<Props, State> {
  static defaultProps = {
    hasMaxAttunedItems: false,
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      quantity: ItemUtils.getQuantity(props.item),
      newQuantity: ItemUtils.getQuantity(props.item),
    };
  }

  componentDidUpdate(
    prevProps: Readonly<Props>,
    prevState: Readonly<State>,
    snapshot?: any
  ): void {
    const { item } = this.props;

    const nextQuantity = ItemUtils.getQuantity(item);
    if (nextQuantity !== prevState.quantity) {
      this.setState({
        quantity: nextQuantity,
        newQuantity: nextQuantity,
      });
    }
  }

  handleQuantityUpdate = (newValue: number): void => {
    const { item, inventoryManager } = this.props;

    inventoryManager.handleQuantitySet({ item, quantity: newValue });
  };

  handleRemove = (): void => {
    const { paneHistoryStart, item, onPostRemoveNavigation, inventoryManager } =
      this.props;

    if (onPostRemoveNavigation) {
      paneHistoryStart(onPostRemoveNavigation);
    }

    inventoryManager.handleRemove({ item });

    if (ItemUtils.isContainer(item)) {
      paneHistoryStart(PaneComponentEnum.EQUIPMENT_MANAGE);
    }
  };

  handleRemoveInfusion = (): void => {
    const { dispatch, paneHistoryStart, item } = this.props;

    const infusion = ItemUtils.getInfusion(item);
    if (infusion) {
      const infusionId = InfusionUtils.getId(infusion);
      if (infusionId === null) {
        return;
      }

      if (
        InfusionUtils.getType(infusion) === Constants.InfusionTypeEnum.REPLICATE
      ) {
        const choiceKey = InfusionUtils.getChoiceKey(infusion);
        if (choiceKey !== null) {
          paneHistoryStart(
            PaneComponentEnum.INFUSION_CHOICE,
            PaneIdentifierUtils.generateInfusionChoice(choiceKey)
          );
        }
      }

      dispatch(
        serviceDataActions.infusionMappingDestroy(
          infusionId,
          InfusionUtils.getInventoryMappingId(infusion)
        )
      );
    }
  };

  handleRemoveInfusions = (itemIds: Array<number>): void => {
    const { dispatch } = this.props;

    itemIds.forEach((id) => {
      dispatch(serviceDataActions.infusionMappingsDestroy(itemIds));
    });
  };

  handleUnequip = (): void => {
    const { inventoryManager, item } = this.props;
    inventoryManager.handleUnequip({ item });
  };

  handleEquip = (): void => {
    const { inventoryManager, item } = this.props;
    inventoryManager.handleEquip({ item });
  };

  handleAttune = (): void => {
    const { inventoryManager, item } = this.props;

    inventoryManager.handleEquip({ item });
    inventoryManager.handleAttune({ item });
  };

  handleUnattune = (): void => {
    const { inventoryManager, item } = this.props;

    inventoryManager.handleUnattune({ item });
  };

  handleMove = (containerDefinitionKey: string): void => {
    const { inventoryManager, item } = this.props;

    inventoryManager.handleMove({ item, containerDefinitionKey });
  };

  getLabels = (): LabelLookup => {
    return {
      consume: "Consume",
      remove: "Delete Item",
      unequip: "Unequip",
      equip: "Equip",
      attune: "Attune",
      unattune: "Unattune",
    };
  };

  getContainerOptions = (): Array<GroupedMenuOption> => {
    const { containers, item, partyInfo } = this.props;

    return ContainerUtils.getGroupedOptions(
      ItemUtils.getContainerDefinitionKey(item),
      containers,
      "Move To:",
      partyInfo
        ? CampaignUtils.getSharingState(partyInfo)
        : Constants.PartyInventorySharingStateEnum.OFF
    );
  };

  renderRemove = (): React.ReactNode => {
    const { item, containers, isReadonly, inventoryManager } = this.props;

    const canRemoveItem = inventoryManager.canRemoveItem(item);
    if (isReadonly || !canRemoveItem) {
      return null;
    }

    const infusion = ItemUtils.getInfusion(item);

    const name = ItemUtils.getName(item);
    const isContainer = ItemUtils.isContainer(item);

    if (isContainer) {
      const container = containers.find((container) => {
        return (
          ContainerUtils.getContainerType(container) ===
            Constants.ContainerTypeEnum.ITEM &&
          ContainerUtils.getMappingId(container) ===
            ItemUtils.getMappingId(item)
        );
      });

      if (container) {
        if (infusion) {
          return (
            <RemoveButton
              onClick={this.handleRemove}
              className="ct-item-detail__action"
              data-testid="remove-infusion-button"
            >
              Remove Infusion
            </RemoveButton>
          );
        }
        const hasInfusions = ContainerUtils.hasInfusions(container);

        return (
          <Popover
            trigger={
              <Button size="xx-small" variant="outline" themed>
                Delete
              </Button>
            }
            position="bottom"
            data-testid="delete-item-button"
            maxWidth={250}
          >
            <PopoverContent
              title={`Remove ${name}?`}
              content={`Removing the ${name} will also remove all of its ${
                hasInfusions ? "infusions and " : " "
              } contents.`}
              confirmText="Delete"
              onConfirm={() => this.handleRemove()}
              withCancel
            />
          </Popover>
          // <RemoveButtonWithModal
          //   className="ct-item-detail__action"
          //   style={"outline"}
          //   size="small"
          //   modalTitle={`Delete ${name}?`}
          //   modalContent={`Deleting the ${name} will also delete all of its${
          //     hasInfusions ? " infusions and" : ""
          //   } contents.`}
          //   confirmCallback={() => {
          //     this.handleRemove();
          //   }}
          //   data-testid="delete-item-button"
          // />
        );
      }
    }

    if (infusion) {
      return (
        <RemoveButton
          onClick={this.handleRemoveInfusion}
          className="ct-item-detail__action"
          data-testid="remove-infusion-button"
        >
          Remove Infusion
        </RemoveButton>
      );
    }

    return (
      <RemoveButton
        onClick={this.handleRemove}
        className="ct-item-detail__action"
        data-testid="delete-item-button"
      >
        Delete
      </RemoveButton>
    );
  };

  render() {
    const {
      item,
      hasMaxAttunedItems,
      isReadonly,
      containers,
      inventoryManager,
    } = this.props;

    const labels = this.getLabels();
    const containerMoveOptions = this.getContainerOptions();
    const isEquipped = ItemUtils.isEquipped(item);
    const isAttuned = ItemUtils.isAttuned(item);
    const isStackable = ItemUtils.isStackable(item);
    const quantity = ItemUtils.getQuantity(item);
    const isContainer = ItemUtils.getDefinitionIsContainer(item);
    const parentContainer = ContainerUtils.getItemParentContainer(
      containers,
      ItemUtils.getContainerDefinitionKey(item)
    );
    if (!parentContainer) {
      return null;
    }
    const canEquip = inventoryManager.canEquipUnequipItem(item);
    const canAttune = inventoryManager.canAttuneUnattuneItem(item);
    const canModifyQuantity = inventoryManager.canModifyQuantity(item);
    const canMoveItem =
      inventoryManager.canMoveItem(item) &&
      !isContainer &&
      !isReadonly &&
      !!containers.length;
    const canShareItem = inventoryManager.canShareItem(item) && !isReadonly;
    const canClaimItem = inventoryManager.canClaimItem(item) && !isReadonly;

    return (
      <div className="ct-item-detail__actions">
        {isStackable && (
          <SimpleQuantity
            quantity={quantity}
            onUpdate={this.handleQuantityUpdate}
            isReadonly={isReadonly || !canModifyQuantity}
          />
        )}

        {canEquip && !isReadonly && (
          <ThemeButton
            onClick={isEquipped ? this.handleUnequip : this.handleEquip}
            style={isEquipped ? "" : "outline"}
            size="small"
            className="ct-item-detail__action"
            data-testid="equip-item-button"
          >
            {isEquipped ? labels.unequip : labels.equip}
          </ThemeButton>
        )}
        {canAttune && !isReadonly && (
          <ThemeButton
            onClick={isAttuned ? this.handleUnattune : this.handleAttune}
            style={isAttuned ? "" : "outline"}
            size="small"
            disabled={hasMaxAttunedItems && !isAttuned}
            className="ct-item-detail__action"
            data-testid="attune-item-button"
          >
            {isAttuned ? labels.unattune : labels.attune}
          </ThemeButton>
        )}
        {canShareItem && (
          <ThemeButton
            style="outline"
            onClick={() => {
              const definitionKey =
                inventoryManager.getPartyEquipmentContainerDefinitionKey();
              if (definitionKey) {
                this.handleMove(definitionKey);
              }
            }}
            size="small"
            className="ct-item-detail__action"
            data-testid="move-item-button"
          >
            Move
          </ThemeButton>
        )}
        {canClaimItem && (
          <ThemeButton
            style="outline"
            onClick={() => {
              const definitionKey =
                inventoryManager.getCharacterContainerDefinitionKey();
              if (definitionKey) {
                this.handleMove(definitionKey);
              }
            }}
            size="small"
            className="ct-item-detail__action"
            data-testid="move-item-button"
          >
            Move
          </ThemeButton>
        )}
        {canMoveItem && (
          <ThemeButtonWithMenu
            buttonStyle="outline"
            containerEl={
              document.querySelector(".ct-sidebar__portal") as HTMLElement
            }
            className="ct-item-detail__action"
            groupedOptions={containerMoveOptions}
            showSingleOption={true}
            onSelect={this.handleMove}
          >
            Move
          </ThemeButtonWithMenu>
        )}
        {this.renderRemove()}
      </div>
    );
  }
}

function mapStateToProps(state: SharedAppState) {
  return {
    ruleData: rulesEngineSelectors.getRuleData(state),
    isReadonly: appEnvSelectors.getIsReadonly(state),
    hasMaxAttunedItems: rulesEngineSelectors.hasMaxAttunedItems(state),
    containers: rulesEngineSelectors.getInventoryContainers(state),
    partyInfo: serviceDataSelectors.getPartyInfo(state),
  };
}

function ItemDetailActionsContainer(props) {
  const { inventoryManager } = useContext(InventoryManagerContext);
  const {
    pane: { paneHistoryStart },
  } = useSidebar();
  return (
    <ItemDetailActions
      inventoryManager={inventoryManager}
      paneHistoryStart={paneHistoryStart}
      {...props}
    />
  );
}

export default connect(mapStateToProps)(ItemDetailActionsContainer);
