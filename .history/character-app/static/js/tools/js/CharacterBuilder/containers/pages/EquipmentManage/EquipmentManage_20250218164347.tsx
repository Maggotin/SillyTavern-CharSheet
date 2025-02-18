import React from "react";
import { useContext } from "react";
import { connect, DispatchProp } from "react-redux";
import { Dispatch } from "redux";

import {
  Collapsible,
  CollapsibleHeaderContent,
  CollapsibleHeading,
} from "../../character-components/es";
import {
  ApiAdapterPromise,
  ApiAdapterRequestConfig,
  ApiResponse,
  BaseItemDefinitionContract,
  characterActions,
  CharacterConfiguration,
  CharacterCurrencyContract,
  CharacterNotes,
  CharacterTheme,
  Constants,
  ContainerLookup,
  ContainerUtils,
  DefinitionUtils,
  InventoryManager,
  FormatUtils,
  HelperUtils,
  InfusionUtils,
  Item,
  ItemUtils,
  Modifier,
  RuleData,
  rulesEngineSelectors,
  serviceDataActions,
  TypeValueLookup,
  CoinManager,
} from "../../character-rules-engine/es";

import { EditorWithDialog } from "~/subApps/builder/components/EditorWithDialog";
import { RouteKey } from "~/subApps/builder/constants";

import { confirmModalActions } from "../../../../Shared/actions/confirmModal";
import * as toastActions from "../../../../Shared/actions/toastMessage/actions";
import { ArmorListItem } from "../../../../Shared/components/legacy/ArmorList";
import { CurrencyList } from "../../../../Shared/components/legacy/CurrencyList";
import { EquipmentManagerShop } from "../../../../Shared/components/legacy/EquipmentManagerShop";
import { GearListItem } from "../../../../Shared/components/legacy/GearList";
import { WeaponListItem } from "../../../../Shared/components/legacy/WeaponList";
import { CURRENCY_VALUE } from "../../../../Shared/constants/App";
import StartingEquipment from "../../../../Shared/containers/StartingEquipment";
import { CurrencyErrorTypeEnum } from "../../../../Shared/containers/panes/CurrencyPane/CurrencyPaneConstants";
import { CoinManagerContext } from "../../../../Shared/managers/CoinManagerContext";
import { InventoryManagerContext } from "../../../../Shared/managers/InventoryManagerContext";
import * as apiCreatorSelectors from "../../../../Shared/selectors/composite/apiCreator";
import { SharedAppState } from "../../../../Shared/stores/typings";
import { AppNotificationUtils } from "../../../../Shared/utils";
import Page from "../../../components/Page";
import { PageBody } from "../../../components/PageBody";
import { PageHeader } from "../../../components/PageHeader";
import { BuilderAppState } from "../../../typings";
import ConnectedBuilderPage from "../ConnectedBuilderPage";

function launchContainerRemovalModal(
  item: Item,
  dispatch: Dispatch,
  inventoryManager: InventoryManager
) {
  return dispatch(
    confirmModalActions.create({
      conClsNames: ["confirm-modal-remove", "confirm-modal-container-remove"],
      heading: `Remove ${ItemUtils.getName(item)}`,
      acceptBtnClsNames: ["character-button-remove"],
      content: (
        <div className="equipment-manage__warning">
          <p>
            Removing the <strong>{ItemUtils.getName(item)}</strong> will also
            remove all of its contents.
          </p>
        </div>
      ),
      onConfirm: () => {
        inventoryManager.handleRemove({ item });
      },
    })
  );
}

function connectedItemMapStateToProps(state: SharedAppState) {
  return {
    ruleData: rulesEngineSelectors.getRuleData(state),
    theme: rulesEngineSelectors.getCharacterTheme(state),
  };
}

function connectedItemMapPropsToDispatch(dispatch, ownProps) {
  const {
    inventoryManager,
    containerLookup,
  }: { inventoryManager: InventoryManager; containerLookup: ContainerLookup } =
    ownProps;
  return {
    onRemove: (item) => {
      const isContainer = ItemUtils.isContainer(item);
      if (isContainer) {
        launchContainerRemovalModal(item, dispatch, inventoryManager);
      } else {
        inventoryManager.handleRemove({ item });
      }
    },
    onRemoveInfusion: (item) => {
      const infusion = ItemUtils.getInfusion(item);
      if (infusion) {
        const infusionId = InfusionUtils.getId(infusion);
        if (infusionId === null) {
          return;
        }

        if (ItemUtils.isContainer(item)) {
          const container = HelperUtils.lookupDataOrFallback(
            containerLookup,
            DefinitionUtils.hack__generateDefinitionKey(
              Constants.ContainerTypeEnum.ITEM,
              ItemUtils.getMappingId(item)
            )
          );
          if (container) {
            const infusion = ItemUtils.getInfusion(item);
            if (ContainerUtils.hasInfusions(container) && !infusion) {
              // Pop up the infusion modal
              dispatch(
                confirmModalActions.create({
                  conClsNames: [
                    "confirm-modal-remove",
                    "confirm-modal-container-remove",
                  ],
                  heading: `Remove ${ItemUtils.getName(item)}: Infusions?`,
                  acceptBtnClsNames: ["character-button-remove"],
                  content: (
                    <div className="equipment-manage__warning">
                      <p>
                        <strong>Notice:</strong> In accordance with Artificer
                        guidance the Waste Management Guild of Sharn (the City
                        of Towers) requires the removal of all Infusions prior
                        to disposal of any items.
                      </p>
                    </div>
                  ),
                  onConfirm: () => {
                    dispatch(
                      serviceDataActions.infusionMappingsDestroy(
                        ContainerUtils.getInfusedItemMappingIds(container)
                      )
                    );
                    launchContainerRemovalModal(
                      item,
                      dispatch,
                      inventoryManager
                    );
                  },
                })
              );
            } else if (infusion) {
              inventoryManager.handleRemove({ item });
            } else {
              // pop up the container modal
              launchContainerRemovalModal(item, dispatch, inventoryManager);
            }
          }
        } else {
          dispatch(
            serviceDataActions.infusionMappingDestroy(
              infusionId,
              InfusionUtils.getInventoryMappingId(infusion)
            )
          );
        }
      }
    },
    onUnequip: (item) => inventoryManager.handleUnequip({ item }),
    onEquip: (item) => inventoryManager.handleEquip({ item }),
    onAttune: (item) => inventoryManager.handleAttune({ item }),
    onUnattune: (item) => inventoryManager.handleUnattune({ item }),
    onQuantitySet: (item, quantity) =>
      inventoryManager.handleQuantitySet({ item, quantity }),
  };
}
const ConnectedArmorListItem = connect(
  connectedItemMapStateToProps,
  connectedItemMapPropsToDispatch
)(ArmorListItem);
const ConnectedWeaponListItem = connect(
  connectedItemMapStateToProps,
  connectedItemMapPropsToDispatch
)(WeaponListItem);
const ConnectedGearListItem = connect(
  connectedItemMapStateToProps,
  connectedItemMapPropsToDispatch
)(GearListItem);

interface Props extends DispatchProp {
  configuration: CharacterConfiguration;
  inventory: Array<Item>;
  containerLookup: ContainerLookup;
  totalWeight: number;
  notes: CharacterNotes;
  ruleData: RuleData;
  hasMaxAttunedItems: boolean;
  characterId: number;
  theme: CharacterTheme;
  loadAvailableItems: (
    additionalConfig?: Partial<ApiAdapterRequestConfig>
  ) => ApiAdapterPromise<ApiResponse<Array<BaseItemDefinitionContract>>>;
  globalModifiers: Array<Modifier>;
  valueLookupByType: TypeValueLookup;
  proficiencyBonus: number;
  inventoryManager: InventoryManager;
  coinManager: CoinManager;
  activeSourceCategories: Array<number>;
}
interface State {
  showStartingEquipment: boolean;
}
class EquipmentManage extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      showStartingEquipment: props.configuration.startingEquipmentType === null,
    };
  }

  textareaInput = React.createRef<HTMLDivElement>();

  componentDidUpdate(
    prevProps: Readonly<Props>,
    prevState: Readonly<State>,
    snapshot?: any
  ): void {
    const { configuration } = this.props;

    if (configuration !== prevProps.configuration) {
      this.setState({
        showStartingEquipment: configuration.startingEquipmentType === null,
      });
    }
  }

  handleItemAdd = (
    item: Item,
    amount: number,
    containerDefinitionKey: string
  ): void => {
    const { inventoryManager } = this.props;

    inventoryManager.handleAdd(
      { item, amount, containerDefinitionKey },
      AppNotificationUtils.handleItemAddAccepted.bind(this, item, amount)
    );
  };

  handleCurrencyChange = (coin: CharacterCurrencyContract): void => {
    const { coinManager } = this.props;

    coinManager.handleCoinSet({
      coin,
      containerDefinitionKey: coinManager.getCharacterContainerDefinitionKey(),
    });
  };

  handleCurrencyError = (
    currencyName: string,
    errorType: CurrencyErrorTypeEnum
  ): void => {
    const { dispatch } = this.props;

    let message: string = "";
    if (errorType === CurrencyErrorTypeEnum.MIN) {
      message =
        "Cannot set currency to a negative value, the previous amount has been set instead.";
    }

    if (errorType === CurrencyErrorTypeEnum.MAX) {
      message = `The max amount allowed for each currency type is ${FormatUtils.renderLocaleNumber(
        CURRENCY_VALUE.MAX
      )}, the previous value has been set instead.`;
    }

    if (errorType !== null) {
      dispatch(
        toastActions.toastError(
          `Unable to Set Currency: ${currencyName}`,
          message
        )
      );
    }
  };

  renderStartingEquipment = (): React.ReactNode => {
    const { showStartingEquipment } = this.state;

    let headingNode: React.ReactNode = (
      <CollapsibleHeading>Starting Equipment</CollapsibleHeading>
    );

    let headerNode: React.ReactNode = (
      <CollapsibleHeaderContent heading={headingNode} />
    );

    return (
      <Collapsible
        header={headerNode}
        className="equipment-manage__starting"
        useBuilderStyles={true}
        initiallyCollapsed={!showStartingEquipment}
        collapsed={!showStartingEquipment}
        onChangeHandler={(isCollapsed) => {
          this.setState({
            showStartingEquipment: !isCollapsed,
          });
        }}
      >
        <StartingEquipment
          onStartingEquipmentChoose={() => {
            this.setState({
              showStartingEquipment: false,
            });
          }}
          isInitialView={true}
        />
      </Collapsible>
    );
  };

  renderItem = (
    item: Item,
    itemParams,
    weaponLabels,
    armorLabels,
    gearLabels
  ): React.ReactNode => {
    const { hasMaxAttunedItems, containerLookup, inventoryManager } =
      this.props;

    const container = HelperUtils.lookupDataOrFallback(
      containerLookup,
      ItemUtils.getContainerDefinitionKey(item)
    );
    const key = `${ItemUtils.getUniqueKey(item)}-${
      container ? ContainerUtils.getDefinitionKey(container) : "empty:container"
    }`;
    const params = {
      container: container,
      containerLookup,
      item,
      inventoryManager,
      key,
      atAttuneMax: hasMaxAttunedItems,
      ...itemParams,
    };

    if (ItemUtils.isWeaponContract(item)) {
      let finalWeaponLabels = weaponLabels;
      if (ItemUtils.isAmmunition(item)) {
        //TODO fix this to be cleaner
        finalWeaponLabels = {
          ...weaponLabels,
          equipLabel: "Use",
          unequipLabel:
            weaponLabels.unequipLabel === "Stow"
              ? weaponLabels.unequipLabel
              : "In Use",
        };
      }

      return <ConnectedWeaponListItem {...params} {...finalWeaponLabels} />;
    } else if (ItemUtils.isArmorContract(item)) {
      return <ConnectedArmorListItem {...params} {...armorLabels} />;
    } else if (ItemUtils.isGearContract(item)) {
      return <ConnectedGearListItem {...params} {...gearLabels} />;
    }

    return null;
  };

  renderItemList = (): React.ReactNode => {
    const { inventory } = this.props;

    const weaponLabels = {
      equipLabel: "Wield",
      unequipLabel: "Wielding",
    };
    const armorLabels = {
      equipLabel: "Wear",
      unequipLabel: "Wearing",
    };
    const gearLabels = {
      equipLabel: "Use",
      unequipLabel: "In Use",
    };
    const itemParams = {
      showRemove: true,
      showEquip: true,
      showUnequip: true,
      showHeaderAction: true,
    };

    return (
      <React.Fragment>
        {ItemUtils.sortInventoryItems(inventory).map((item) =>
          this.renderItem(
            item,
            itemParams,
            weaponLabels,
            armorLabels,
            gearLabels
          )
        )}
      </React.Fragment>
    );
  };

  renderInventory = (): React.ReactNode => {
    const { inventory, totalWeight } = this.props;

    const itemTotal: number = inventory.length;

    let headerNode: React.ReactNode = (
      <CollapsibleHeaderContent
        heading={
          <CollapsibleHeading>
            Current Inventory ({itemTotal})
          </CollapsibleHeading>
        }
        callout={
          <div className="equipment-manage__callout">
            Total Weight: {FormatUtils.renderWeight(totalWeight)}
          </div>
        }
      />
    );

    return (
      <Collapsible
        header={headerNode}
        className="equipment-manage__inventory"
        useBuilderStyles={true}
        initiallyCollapsed={itemTotal === 0}
        collapsed={itemTotal === 0}
      >
        {itemTotal === 0 ? (
          <div className="equipment-manager__inventory-empty">
            You currently have no items in your inventory. Add Starting
            Equipment above or Add Items from the list of available items below.
          </div>
        ) : (
          this.renderItemList()
        )}
      </Collapsible>
    );
  };

  renderOtherPossessions = (): React.ReactNode => {
    const { notes, dispatch } = this.props;

    return (
      <Collapsible
        header={"Other Possessions"}
        className="equipment-manage__possessions"
        useBuilderStyles={true}
      >
        <EditorWithDialog
          heading={<h3>Personal Possessions</h3>}
          editButtonLabel="Edit Possessions"
          addButtonLabel="Add Possessions"
          placeholder="Add personal possessions here..."
          content={notes[Constants.NoteKeyEnum.PERSONAL_POSSESSIONS] ?? ""}
          onSave={(content) => {
            dispatch(
              characterActions.noteSet(
                Constants.NoteKeyEnum.PERSONAL_POSSESSIONS,
                content
              )
            );
          }}
        />
      </Collapsible>
    );
  };

  renderAddItems = (): React.ReactNode => {
    const {
      ruleData,
      characterId,
      theme,
      loadAvailableItems,
      globalModifiers,
      valueLookupByType,
      proficiencyBonus,
      activeSourceCategories,
    } = this.props;

    const characterContainerKey =
      ContainerUtils.getCharacterContainerDefinitionKey(characterId);

    return (
      <Collapsible
        header={"Add Items"}
        className="equipment-manage__add-items"
        useBuilderStyles={true}
      >
        <EquipmentManagerShop
          theme={theme}
          loadItems={loadAvailableItems}
          globalModifiers={globalModifiers}
          valueLookupByType={valueLookupByType}
          onItemAdd={this.handleItemAdd}
          ruleData={ruleData}
          proficiencyBonus={proficiencyBonus}
          containerDefinitionKey={characterContainerKey}
          activeSourceCategories={activeSourceCategories}
        />
      </Collapsible>
    );
  };

  renderCurrency = (): React.ReactNode => {
    const { coinManager } = this.props;

    const coin = coinManager.getContainerCoin(
      coinManager.getCharacterContainerDefinitionKey()
    );

    if (!coin) {
      return null;
    }

    let headerNode: React.ReactNode = (
      <CollapsibleHeaderContent
        heading={<CollapsibleHeading>Currency</CollapsibleHeading>}
        callout={
          <div className="equipment-manage__callout">
            Total in GP:{" "}
            {FormatUtils.renderLocaleNumber(
              coinManager.getTotalContainerCoinInGold(
                coinManager.getCharacterContainerDefinitionKey()
              )
            )}
          </div>
        }
      />
    );

    return (
      <Collapsible
        header={headerNode}
        className="equipment-manage__currency"
        useBuilderStyles={true}
      >
        <CurrencyList
          {...coin}
          onChange={this.handleCurrencyChange}
          onError={this.handleCurrencyError}
          totalGp={coinManager.getTotalContainerCoinInGold(
            coinManager.getCharacterContainerDefinitionKey()
          )}
        />
      </Collapsible>
    );
  };

  render() {
    return (
      <Page>
        <PageBody>
          <PageHeader>Choose Equipment</PageHeader>
          <div className="equipment-manage">
            {this.renderStartingEquipment()}
            {this.renderInventory()}
            {this.renderOtherPossessions()}
            {this.renderAddItems()}
            {this.renderCurrency()}
          </div>
        </PageBody>
      </Page>
    );
  }
}

function EquipmentManageContainer(props) {
  const { inventoryManager } = useContext(InventoryManagerContext);
  const { coinManager } = useContext(CoinManagerContext);

  return (
    <EquipmentManage
      coinManager={coinManager}
      inventoryManager={inventoryManager}
      {...props}
    />
  );
}

export default ConnectedBuilderPage(
  EquipmentManageContainer,
  RouteKey.EQUIPMENT_MANAGE,
  (state: BuilderAppState) => {
    return {
      configuration: rulesEngineSelectors.getCharacterConfiguration(state),
      inventory: rulesEngineSelectors.getInventory(state),
      containerLookup: rulesEngineSelectors.getContainerLookup(state),
      totalWeight: rulesEngineSelectors.getTotalCarriedWeight(state),
      notes: rulesEngineSelectors.getCharacterNotes(state),
      currencies: rulesEngineSelectors.getCurrencies(state),
      ruleData: rulesEngineSelectors.getRuleData(state),
      hasMaxAttunedItems: rulesEngineSelectors.hasMaxAttunedItems(state),
      proficiencyBonus: rulesEngineSelectors.getProficiencyBonus(state),
      characterId: rulesEngineSelectors.getId(state),
      loadAvailableItems: apiCreatorSelectors.makeLoadAvailableItems(state),
      globalModifiers: rulesEngineSelectors.getValidGlobalModifiers(state),
      valueLookupByType:
        rulesEngineSelectors.getCharacterValueLookupByType(state),
      theme: rulesEngineSelectors.getCharacterTheme(state),
      activeSourceCategories:
        rulesEngineSelectors.getActiveSourceCategories(state),
    };
  }
);
