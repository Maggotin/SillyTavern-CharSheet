import { orderBy } from "lodash";
import React from "react";
import { useContext } from "react";
import { connect, DispatchProp } from "react-redux";

import { Collapsible } from "@dndbeyond/character-components/es";
import {
  ApiAdapterPromise,
  ApiAdapterRequestConfig,
  ApiResponse,
  BaseItemDefinitionContract,
  CharacterTheme,
  Constants,
  Container,
  ContainerLookup,
  ContainerUtils,
  DataOrigin,
  EntityValueLookup,
  InventoryManager,
  Infusion,
  InfusionChoiceLookup,
  InfusionUtils,
  Item,
  ItemUtils,
  Modifier,
  PartyInfo,
  RuleData,
  rulesEngineSelectors,
  serviceDataSelectors,
  SnippetData,
  Spell,
  TypeValueLookup,
  WeaponSpellDamageGroup,
  ItemManager,
  ContainerManager,
  CharacterCurrencyContract,
  FormatUtils,
  CoinManager,
} from "../../character-rules-engine/es";

import { EditableName } from "~/components/EditableName";
import { ItemName } from "~/components/ItemName";
import { Link } from "~/components/Link";
import { useSidebar } from "~/contexts/Sidebar";
import { PaneInfo } from "~/contexts/Sidebar/Sidebar";
import { Header } from "~/subApps/sheet/components/Sidebar/components/Header";
import { Preview } from "~/subApps/sheet/components/Sidebar/components/Preview";
import {
  getDataOriginComponentInfo,
  getSpellComponentInfo,
} from "~/subApps/sheet/components/Sidebar/helpers/paneUtils";
import {
  PaneComponentEnum,
  PaneIdentifiersContainer,
} from "~/subApps/sheet/components/Sidebar/types";

import { PaneInitFailureContent } from "../../../../../../subApps/sheet/components/Sidebar/components/PaneInitFailureContent";
import { CURRENCY_VALUE } from "../../../../Shared/constants/App";
import { CoinManagerContext } from "../../../../Shared/managers/CoinManagerContext";
import * as toastActions from "../../../actions/toastMessage/actions";
import ContainerActions from "../../../components/ContainerActions";
import ItemDetail from "../../../components/ItemDetail";
import { InventoryManagerContext } from "../../../managers/InventoryManagerContext";
import { apiCreatorSelectors, appEnvSelectors } from "../../../selectors";
import { SharedAppState } from "../../../stores/typings";
import { AppNotificationUtils, PaneIdentifierUtils } from "../../../utils";
import ItemDetailActions from "../../ItemDetailActions";
import { CurrencyErrorTypeEnum } from "../CurrencyPane/CurrencyPaneConstants";

interface Props extends DispatchProp {
  weaponSpellDamageGroups: Array<WeaponSpellDamageGroup>;
  ruleData: RuleData;
  snippetData: SnippetData;
  entityValueLookup: EntityValueLookup;
  infusionChoiceLookup: InfusionChoiceLookup;
  identifiers: PaneIdentifiersContainer | null;
  isReadonly: boolean;
  proficiencyBonus: number;
  theme: CharacterTheme;
  containers: Array<Container>;
  globalModifiers: Array<Modifier>;
  loadAvailableItems: (
    additionalConfig?: Partial<ApiAdapterRequestConfig>
  ) => ApiAdapterPromise<ApiResponse<Array<BaseItemDefinitionContract>>>;
  valueLookupByType: TypeValueLookup;
  inventory: Array<Item>;
  containerLookup: ContainerLookup;
  partyInfo: PartyInfo | null;
  inventoryManager: InventoryManager;
  coinManager: CoinManager;
  paneHistoryPush: PaneInfo["paneHistoryPush"];
}
interface State {
  item: ItemManager | null;
  currentContainer: ContainerManager | null;
  isCustomizeClosed: boolean;
}
class ContainerPane extends React.PureComponent<Props, State> {
  constructor(props) {
    super(props);

    this.state = this.generateStateData(props, true);
  }

  componentDidUpdate(
    prevProps: Readonly<Props>,
    prevState: Readonly<State>
  ): void {
    const { inventory, identifiers, containerLookup } = this.props;

    if (
      inventory !== prevProps.inventory ||
      containerLookup !== prevProps.containerLookup ||
      identifiers !== prevProps.identifiers
    ) {
      this.setState(
        this.generateStateData(this.props, prevState.isCustomizeClosed)
      );
    }
  }

  generateStateData = (props: Props, isCustomizeClosed: boolean): State => {
    const { identifiers, inventoryManager } = props;

    let foundItem: ItemManager | null = null;
    let foundContainer: ContainerManager | null = null;
    if (identifiers?.containerDefinitionKey) {
      foundContainer = inventoryManager.getContainer(
        identifiers.containerDefinitionKey
      );
      foundItem = foundContainer ? foundContainer.getContainerItem() : null;
    }

    return {
      item: foundItem ?? null,
      currentContainer: foundContainer ?? null,
      isCustomizeClosed,
    };
  };

  handleCustomDataUpdate = (
    adjustmentType: Constants.AdjustmentTypeEnum,
    value: any
  ): void => {
    const { item } = this.state;
    const { inventoryManager } = this.props;

    if (item) {
      inventoryManager.handleCustomizationSet({
        item: item.item,
        adjustmentType,
        value,
      });
    }
  };

  handleRemoveCustomizations = (): void => {
    const { item } = this.state;
    const { inventoryManager } = this.props;

    if (item) {
      inventoryManager.handleCustomizationsRemove({ item: item.item });
    }
  };

  handleAdd = (
    item: Item,
    amount: number,
    containerDefinitionKey: string
  ): void => {
    const { inventoryManager } = this.props;
    inventoryManager.handleAdd(
      { item, amount, containerDefinitionKey },
      AppNotificationUtils.handleItemAddAccepted.bind(this, item, amount),
      AppNotificationUtils.handleItemAddRejected.bind(this, item, amount)
    );
  };

  handleItemMove = (item: Item, containerDefinitionKey: string): void => {
    const { inventoryManager } = this.props;
    inventoryManager.handleMove({ item, containerDefinitionKey });
  };

  handleItemSetEquip = (item: Item, uses: number): void => {
    const { inventoryManager } = this.props;
    //TODO need different component than SlotManager for item equipped/unequipped
    if (uses === 0) {
      inventoryManager.handleUnequip({ item });
    }

    if (uses === 1) {
      inventoryManager.handleEquip({ item });
    }
  };

  handleDataOriginClick = (dataOrigin: DataOrigin) => {
    const { paneHistoryPush } = this.props;

    let component = getDataOriginComponentInfo(dataOrigin);
    if (component.type !== PaneComponentEnum.ERROR_404) {
      paneHistoryPush(component.type, component.identifiers);
    }
  };

  handleSpellClick = (spell: Spell): void => {
    const { paneHistoryPush } = this.props;

    let component = getSpellComponentInfo(spell);
    if (component.type) {
      paneHistoryPush(component.type, component.identifiers);
    }
  };

  handleInfusionClick = (infusion: Infusion): void => {
    const { paneHistoryPush } = this.props;

    const choiceKey = InfusionUtils.getChoiceKey(infusion);
    if (choiceKey !== null) {
      paneHistoryPush(
        PaneComponentEnum.INFUSION_CHOICE,
        PaneIdentifierUtils.generateInfusionChoice(choiceKey)
      );
    }
  };

  handleManageShow = (): void => {
    const { paneHistoryPush } = this.props;

    paneHistoryPush(PaneComponentEnum.EQUIPMENT_MANAGE);
  };

  handleStartingEquipmentShow = (): void => {
    const { paneHistoryPush } = this.props;
    paneHistoryPush(PaneComponentEnum.STARTING_EQUIPMENT);
  };

  handleCurrencyShow = (): void => {
    const { paneHistoryPush } = this.props;
    paneHistoryPush(PaneComponentEnum.CURRENCY);
  };

  handleEncumbranceShow = (): void => {
    const { paneHistoryPush } = this.props;
    paneHistoryPush(PaneComponentEnum.ENCUMBRANCE);
  };

  sortInventoryItems = (inventory: Array<Item>): Array<Item> => {
    return orderBy(
      inventory,
      [
        (item) => ItemUtils.getRarityLevel(item),
        (item) => ItemUtils.getName(item),
        (item) => ItemUtils.getMappingId(item),
      ],
      ["desc", "asc", "asc"]
    );
  };

  handleOpenCustomize = () => {
    this.setState({ isCustomizeClosed: !this.state.isCustomizeClosed });
  };

  hasCurrencyValueChanged = (
    value: number,
    currencyKey: keyof CharacterCurrencyContract,
    coin: CharacterCurrencyContract
  ): boolean => {
    return value !== coin[currencyKey];
  };

  handleCurrencyChangeError = (
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

  handleCurrencyAdjust = (
    coin: Partial<CharacterCurrencyContract>,
    multiplier: 1 | -1,
    containerDefinitionKey: string
  ): void => {
    const { coinManager, dispatch } = this.props;

    let actionLabel: string = "";
    if (multiplier === 1) {
      actionLabel = "Add";
    } else if (multiplier === -1) {
      actionLabel = "Delete";
    }

    coinManager.handleTransaction(
      { coin, containerDefinitionKey, multiplier },
      () => {
        // dispatch(toastActions.toastSuccess(
        //     `A ${containerDefinitionKey === coinManager.getPartyEquipmentContainerDefinitionKey() ? 'Party' : ''}Coin transaction was completed!`,
        //     'could list the updates?'
        // ));
      },
      () => {
        dispatch(
          toastActions.toastError(
            `Unable to make transaction: ${actionLabel} Coin`,
            "Cannot set currency to a negative value, the previous amount has been set instead."
          )
        );
      }
    );
  };

  handleAmountSet = (
    containerDefinitionKey: string,
    key: keyof CharacterCurrencyContract,
    amount: number
  ): void => {
    const { coinManager } = this.props;
    const coin = coinManager.getContainerCoin(containerDefinitionKey);

    if (coin && this.hasCurrencyValueChanged(amount, key, coin)) {
      coinManager.handleAmountSet({
        key,
        amount,
        containerDefinitionKey,
      });
    }
  };

  render() {
    const { item, currentContainer, isCustomizeClosed } = this.state;
    const {
      weaponSpellDamageGroups,
      ruleData,
      snippetData,
      entityValueLookup,
      infusionChoiceLookup,
      isReadonly,
      proficiencyBonus,
      theme,
      containers,
      globalModifiers,
      loadAvailableItems,
      valueLookupByType,
      inventory,
      identifiers,
      partyInfo,
      inventoryManager,
    } = this.props;

    if (currentContainer === null) {
      return <PaneInitFailureContent />;
    }

    const shopOpenInitially = identifiers?.showAddItems ?? false;

    const canCustomize = item
      ? inventoryManager.canCustomizeItem(item.item)
      : false;

    return (
      <div className="ct-container-pane">
        <Header
          preview={
            <Preview imageUrl={item ? item.getAvatarUrl() : undefined} />
          }
        >
          {item ? (
            <EditableName onClick={this.handleOpenCustomize}>
              <ItemName item={item.item} />
            </EditableName>
          ) : (
            currentContainer.getName()
          )}
        </Header>
        {item && (
          <Collapsible
            header="Item Description"
            initiallyCollapsed={shopOpenInitially}
            overrideCollapsed={shopOpenInitially}
            className="ct-container-pane__content"
          >
            <ItemDetail
              className="ct-container-pane__item-detail"
              theme={theme}
              key={item.getUniqueKey()}
              item={item.item}
              weaponSpellDamageGroups={weaponSpellDamageGroups}
              ruleData={ruleData}
              snippetData={snippetData}
              onCustomDataUpdate={this.handleCustomDataUpdate}
              onCustomizationsRemove={this.handleRemoveCustomizations}
              onDataOriginClick={this.handleDataOriginClick}
              onSpellClick={this.handleSpellClick}
              onInfusionClick={this.handleInfusionClick}
              entityValueLookup={entityValueLookup}
              infusionChoiceLookup={infusionChoiceLookup}
              isReadonly={isReadonly}
              proficiencyBonus={proficiencyBonus}
              showActions={false}
              showCustomize={canCustomize}
              container={currentContainer.container}
              isCustomizeClosed={isCustomizeClosed}
              onCustomizeClick={this.handleOpenCustomize}
            />
          </Collapsible>
        )}
        <ContainerActions
          currentContainer={currentContainer.container}
          containers={containers}
          ruleData={ruleData}
          proficiencyBonus={proficiencyBonus}
          theme={theme}
          globalModifiers={globalModifiers}
          loadAvailableItems={loadAvailableItems}
          valueLookupByType={valueLookupByType}
          onItemAdd={this.handleAdd}
          onItemMove={this.handleItemMove}
          onItemEquip={this.handleItemSetEquip}
          inventory={this.sortInventoryItems(
            ContainerUtils.getInventoryItems(
              currentContainer.container,
              inventory
            )
          )}
          shopOpenInitially={shopOpenInitially}
          isReadonly={isReadonly}
          partyInfo={partyInfo}
          handleCurrencyChangeError={this.handleCurrencyChangeError.bind(this)}
          handleCurrencyAdjust={this.handleCurrencyAdjust.bind(this)}
          handleAmountSet={this.handleAmountSet.bind(this)}
        />
        {!isReadonly && item && <ItemDetailActions item={item.item} />}
        {!isReadonly && currentContainer.isCharacterContainer() && (
          <div className="ct-container-pane__links">
            <div className="ct-container-pane__link">
              <Link useTheme={true} onClick={this.handleManageShow}>
                Manage Inventory
              </Link>
            </div>
            <div className="ct-container-pane__link">
              <Link useTheme={true} onClick={this.handleStartingEquipmentShow}>
                Starting Equipment
              </Link>
            </div>
            <div className="ct-container-pane__link">
              <Link useTheme={true} onClick={this.handleCurrencyShow}>
                Currency
              </Link>
            </div>
            <div className="ct-container-pane__link">
              <Link useTheme={true} onClick={this.handleEncumbranceShow}>
                Encumbrance
              </Link>
            </div>
          </div>
        )}
      </div>
    );
  }
}

function mapStateToProps(state: SharedAppState) {
  return {
    ruleData: rulesEngineSelectors.getRuleData(state),
    weaponSpellDamageGroups:
      rulesEngineSelectors.getWeaponSpellDamageGroups(state),
    entityValueLookup:
      rulesEngineSelectors.getCharacterValueLookupByEntity(state),
    snippetData: rulesEngineSelectors.getSnippetData(state),
    infusionChoiceLookup: rulesEngineSelectors.getInfusionChoiceLookup(state),
    isReadonly: appEnvSelectors.getIsReadonly(state),
    proficiencyBonus: rulesEngineSelectors.getProficiencyBonus(state),
    theme: rulesEngineSelectors.getCharacterTheme(state),
    containers: rulesEngineSelectors.getInventoryContainers(state),
    globalModifiers: rulesEngineSelectors.getValidGlobalModifiers(state),
    loadAvailableItems: apiCreatorSelectors.makeLoadAvailableItems(state),
    valueLookupByType:
      rulesEngineSelectors.getCharacterValueLookupByType(state),
    inventory: rulesEngineSelectors.getAllInventoryItems(state),
    containerLookup: rulesEngineSelectors.getContainerLookup(state),
    partyInfo: serviceDataSelectors.getPartyInfo(state),
  };
}
function ContainerPaneContainer(props) {
  const { inventoryManager } = useContext(InventoryManagerContext);
  const { coinManager } = useContext(CoinManagerContext);
  const {
    pane: { paneHistoryPush },
  } = useSidebar();
  return (
    <ContainerPane
      inventoryManager={inventoryManager}
      coinManager={coinManager}
      paneHistoryPush={paneHistoryPush}
      {...props}
    />
  );
}
export default connect(mapStateToProps)(ContainerPaneContainer);
