import axios, { Canceler } from "axios";
import { orderBy } from "lodash";
import * as React from "react";
import { useContext } from "react";
import { connect, DispatchProp } from "react-redux";

import {
  CreaturePreview,
  ItemPreview,
  MarketplaceCta,
  LoadingPlaceholder,
} from "@dndbeyond/character-components/es";
import {
  AccessUtils,
  ApiAdapterPromise,
  ApiAdapterRequestConfig,
  ApiAdapterUtils,
  ApiResponse,
  rulesEngineSelectors,
  BaseItemDefinitionContract,
  Constants,
  ContainerUtils,
  Creature,
  CreatureLookup,
  FormatUtils,
  HelperUtils,
  InfusionChoice,
  InfusionChoiceUtils,
  InfusionModifierDataContract,
  InfusionUtils,
  InventoryLookup,
  Item,
  ItemUtils,
  KnownInfusionUtils,
  Modifier,
  TypeValueLookup,
  serviceDataActions,
  RuleData,
  RuleDataUtils,
  DefinitionUtils,
  CharacterTheme,
  Container,
  ClassUtils,
  BaseCharClass,
} from "@dndbeyond/character-rules-engine/es";
import { InventoryManager } from "@dndbeyond/character-rules-engine/es";

import { HtmlContent } from "~/components/HtmlContent";
import { useSidebar } from "~/contexts/Sidebar";
import { PaneInfo } from "~/contexts/Sidebar/Sidebar";
import { Header } from "~/subApps/sheet/components/Sidebar/components/Header";
import {
  PaneComponentEnum,
  PaneIdentifiersInfusionChoice,
} from "~/subApps/sheet/components/Sidebar/types";

import { RemoveButton, ThemeButton } from "../../../components/common/Button";
import DataLoadingStatusEnum from "../../../constants/DataLoadingStatusEnum";
import { InventoryManagerContext } from "../../../managers/InventoryManagerContext";
import { apiCreatorSelectors, appEnvSelectors } from "../../../selectors";
import { SharedAppState } from "../../../stores/typings";
import { AppLoggerUtils, PaneIdentifierUtils } from "../../../utils";
import InfusionChoicePaneNewStore from "./InfusionChoicePaneNewStore";
import InfusionChoicePaneStep from "./InfusionChoicePaneStep";
import InfusionChoicePaneStore from "./InfusionChoicePaneStore";

enum UiViewEnum {
  REVIEW = "REVIEW",
  CHOOSE_ITEM = "CHOOSE_ITEM",
  CHOOSE_MODIFIER_GROUP = "CHOOSE_MODIFIER_GROUP",
}

type SimpleOnClickHandler = () => void;

interface Props extends DispatchProp {
  infusionChoices: Array<InfusionChoice>;
  inventory: Array<Item>;
  inventoryLookup: InventoryLookup;
  containers: Array<Container>;
  creatureLookup: CreatureLookup;
  ruleData: RuleData;
  globalModifiers: Array<Modifier>;
  typeValueLookup: TypeValueLookup;
  loadAvailableItems: (
    additionalConfig?: Partial<ApiAdapterRequestConfig>
  ) => ApiAdapterPromise<ApiResponse<Array<BaseItemDefinitionContract>>>;

  identifiers: PaneIdentifiersInfusionChoice;
  isReadonly: boolean;
  proficiencyBonus: number;
  maximumInfusions?: number;
  currentInfusions?: number;
  characterId: number;
  theme: CharacterTheme;
  inventoryManager: InventoryManager;
  classes: Array<BaseCharClass>;
  paneHistoryPush: PaneInfo["paneHistoryPush"];
}
interface StateData {
  infusionChoice: InfusionChoice | null;
  modifierGroupId: string | null;
  needsItemStore: boolean;
  itemCanBeAddedLookup: Record<number, boolean>;
}
interface State extends StateData {
  chosenItemId: number | null;
  inventoryItem: Item | null;
  newItem: Item | null;
  creatureId: number | null;
  loadingStatus: DataLoadingStatusEnum;
  storeItems: Array<Item>;
  uiView: UiViewEnum;
  overrideMaximumInfusions: boolean;
  maximumInfusions: number;
  currentInfusions: number;
  isRemoveModalOpen: boolean;
}
class InfusionChoicePane extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      ...this.getStateData(props, []),
      chosenItemId: null,
      inventoryItem: null,
      newItem: null,
      creatureId: null,
      loadingStatus: DataLoadingStatusEnum.NOT_LOADED,
      storeItems: [],
      uiView: UiViewEnum.REVIEW,
      overrideMaximumInfusions: false,
      maximumInfusions: 0,
      currentInfusions: 0,
      isRemoveModalOpen: false,
    };
  }

  loadItemsCanceler: null | Canceler = null;

  componentDidMount() {
    this.loadNeededItems();
    let maximumInfusions = 0;
    let currentInfusions = 0;
    this.props.classes.forEach((charClass) => {
      const classMaxInfusions = ClassUtils.deriveMaxInfusions(charClass);
      const classCurrentInfusions = this.props.infusionChoices.filter(
        (infusionChoice) =>
          InfusionChoiceUtils.getInfusion(infusionChoice) !== null
      ).length;
      if (classMaxInfusions && classMaxInfusions > maximumInfusions) {
        maximumInfusions = classMaxInfusions;
      }
      if (classCurrentInfusions && classCurrentInfusions > currentInfusions) {
        currentInfusions = classCurrentInfusions;
      }
    });
    this.setState({
      currentInfusions,
      maximumInfusions,
    });
  }

  componentDidUpdate(prevProps: Props, prevState: State, snapshot) {
    if (
      prevProps.infusionChoices !== this.props.infusionChoices ||
      prevProps.identifiers.id !== this.props.identifiers.id
    ) {
      this.setState(
        {
          ...this.getStateData(this.props, this.state.storeItems),
          chosenItemId: null,
          inventoryItem: null,
          newItem: null,
          creatureId: null,
          uiView: UiViewEnum.REVIEW,
          currentInfusions: this.props.infusionChoices.filter(
            (infusionChoice) =>
              InfusionChoiceUtils.getInfusion(infusionChoice) !== null
          ).length,
        },
        () => {
          this.loadNeededItems();
        }
      );
    }
  }

  componentWillUnmount(): void {
    if (this.loadItemsCanceler !== null) {
      this.loadItemsCanceler();
    }
  }

  loadNeededItems = (): void => {
    const { loadingStatus, needsItemStore } = this.state;
    const { loadAvailableItems, globalModifiers, typeValueLookup, ruleData } =
      this.props;

    if (needsItemStore && loadingStatus === DataLoadingStatusEnum.NOT_LOADED) {
      this.setState({
        loadingStatus: DataLoadingStatusEnum.LOADING,
      });

      loadAvailableItems({
        cancelToken: new axios.CancelToken((c) => {
          this.loadItemsCanceler = c;
        }),
      })
        .then((itemResponse) => {
          let storeItems: Array<Item> = [];
          const itemData = ApiAdapterUtils.getResponseData(itemResponse);
          if (itemData) {
            storeItems = itemData.map((itemDefinition) => {
              return ItemUtils.simulateItem(
                itemDefinition,
                globalModifiers,
                typeValueLookup,
                ruleData
              );
            });
          }

          this.setState({
            ...this.getStateData(this.props, storeItems),
            storeItems,
            loadingStatus: DataLoadingStatusEnum.LOADED,
          });
          this.loadItemsCanceler = null;
        })
        .catch(AppLoggerUtils.handleAdhocApiError);
    }
  };

  getStateData = (props: Props, storeItems: Array<Item>): StateData => {
    const infusionChoice = props.infusionChoices.find(
      (infusionChoice) =>
        props.identifiers.id === InfusionChoiceUtils.getKey(infusionChoice)
    );
    const forcedModifierData =
      infusionChoice !== null && infusionChoice
        ? InfusionChoiceUtils.getForcedModifierData(infusionChoice)
        : null;

    let needsItemStore: boolean = false;
    if (infusionChoice && !props.isReadonly) {
      const knownInfusion =
        InfusionChoiceUtils.getKnownInfusion(infusionChoice);
      if (knownInfusion) {
        const simulatedInfusion =
          KnownInfusionUtils.getSimulatedInfusion(knownInfusion);
        if (
          simulatedInfusion !== null &&
          InfusionUtils.getType(simulatedInfusion) ===
            Constants.InfusionTypeEnum.REPLICATE
        ) {
          needsItemStore = true;
        }
      }
    }

    let itemCanBeAddedLookup: Record<number, boolean> = storeItems.reduce(
      (acc, item) => {
        acc[ItemUtils.getId(item)] = ItemUtils.canBeAddedToInventory(item);
        return acc;
      },
      {}
    );

    return {
      infusionChoice: infusionChoice ? infusionChoice : null,
      modifierGroupId:
        forcedModifierData === null ? null : forcedModifierData.id,
      needsItemStore,
      itemCanBeAddedLookup,
    };
  };

  getActiveItemId = (): number | null => {
    const { infusionChoice, chosenItemId, itemCanBeAddedLookup } = this.state;

    if (infusionChoice === null) {
      return null;
    }

    const knownInfusion = InfusionChoiceUtils.getKnownInfusion(infusionChoice);
    if (knownInfusion === null) {
      return null;
    }

    const simulatedInfusion =
      KnownInfusionUtils.getSimulatedInfusion(knownInfusion);
    if (
      simulatedInfusion !== null &&
      InfusionUtils.getType(simulatedInfusion) ===
        Constants.InfusionTypeEnum.REPLICATE
    ) {
      let knownInfusionItemId = KnownInfusionUtils.getItemId(knownInfusion);
      if (
        InfusionUtils.hack__requiresItemChoice(
          simulatedInfusion,
          knownInfusionItemId,
          itemCanBeAddedLookup
        )
      ) {
        return chosenItemId;
      } else {
        return knownInfusionItemId;
      }
    }

    return chosenItemId;
  };

  handleChooseExistingItem = (item: Item): void => {
    this.setState({
      inventoryItem: item,
      newItem: null,
      chosenItemId: ItemUtils.getId(item),
      uiView: UiViewEnum.REVIEW,
    });
  };

  handleChooseNewItem = (item: Item): void => {
    this.setState({
      inventoryItem: null,
      newItem: item,
      chosenItemId: ItemUtils.getId(item),
      uiView: UiViewEnum.REVIEW,
    });
  };

  handleChooseModifierGroup = (modifierGroupId: string | null): void => {
    this.setState({
      modifierGroupId: modifierGroupId ? modifierGroupId : null,
      uiView: UiViewEnum.REVIEW,
    });
  };

  handleInfuse = (): void => {
    const { dispatch, characterId } = this.props;
    const {
      infusionChoice,
      inventoryItem,
      creatureId,
      modifierGroupId,
      newItem,
    } = this.state;

    if (infusionChoice === null) {
      return;
    }

    const knownInfusion = InfusionChoiceUtils.getKnownInfusion(infusionChoice);
    if (knownInfusion === null) {
      return;
    }

    const simulatedInfusion =
      KnownInfusionUtils.getSimulatedInfusion(knownInfusion);
    if (simulatedInfusion === null) {
      return;
    }

    const infusionId = InfusionUtils.getId(simulatedInfusion);
    if (infusionId === null) {
      return;
    }

    let inventoryMappingId: number | null = null;
    if (inventoryItem !== null) {
      inventoryMappingId = ItemUtils.getMappingId(inventoryItem);
    }
    let itemId: number | null = null;
    let itemTypeId: number | null = null;
    if (
      InfusionUtils.getType(simulatedInfusion) ===
      Constants.InfusionTypeEnum.REPLICATE
    ) {
      itemId = this.getActiveItemId();
      itemTypeId = Constants.MAGIC_ITEM_ENTITY_TYPE_ID;
    } else if (newItem !== null) {
      itemId = ItemUtils.getId(newItem);
      itemTypeId = ItemUtils.getDefinitionEntityTypeId(newItem);
    }

    const characterContainerDefinitionKey =
      ContainerUtils.getCharacterContainerDefinitionKey(characterId);

    dispatch(
      serviceDataActions.infusionMappingCreate({
        choiceKey: InfusionChoiceUtils.getKey(infusionChoice),
        infusionId,
        inventoryMappingId,
        modifierGroupId,
        itemId,
        itemTypeId,
        creatureId,
        containerEntityId:
          inventoryItem !== null
            ? ItemUtils.getContainerEntityId(inventoryItem)
            : DefinitionUtils.hack__getDefinitionKeyId(
                characterContainerDefinitionKey
              ),
        containerEntityTypeId:
          inventoryItem !== null
            ? ItemUtils.getContainerEntityTypeId(inventoryItem)
            : DefinitionUtils.hack__getDefinitionKeyType(
                characterContainerDefinitionKey
              ),
      })
    );
  };

  handleInfusionRemove = (): void => {
    const { dispatch, inventoryLookup } = this.props;
    const { infusionChoice } = this.state;

    if (infusionChoice === null) {
      return;
    }

    const infusion = InfusionChoiceUtils.getInfusion(infusionChoice);
    if (infusion) {
      const infusionId = InfusionUtils.getId(infusion);
      if (infusionId === null) {
        return;
      }

      const inventoryMappingId = InfusionUtils.getInventoryMappingId(infusion);
      const item = HelperUtils.lookupDataOrFallback(
        inventoryLookup,
        inventoryMappingId
      );

      if (item && ItemUtils.isContainer(item)) {
        this.handleRemoveContainer(item);
      } else {
        dispatch(
          serviceDataActions.infusionMappingDestroy(
            infusionId,
            InfusionUtils.getInventoryMappingId(infusion)
          )
        );
      }

      this.setState((state) => ({
        currentInfusions: state.currentInfusions - 1,
      }));
    }
  };

  handleRemoveInfusions = (itemIds: Array<number>): void => {
    const { dispatch } = this.props;

    itemIds.forEach((id) => {
      dispatch(serviceDataActions.infusionMappingsDestroy(itemIds));
    });
  };

  handleInfusionItemClick = (): void => {
    const { paneHistoryPush } = this.props;
    const { infusionChoice } = this.state;

    if (infusionChoice === null) {
      return;
    }

    const infusion = InfusionChoiceUtils.getInfusion(infusionChoice);
    if (infusion === null) {
      return;
    }

    const inventoryMappingId = InfusionUtils.getInventoryMappingId(infusion);

    if (inventoryMappingId) {
      paneHistoryPush(
        PaneComponentEnum.ITEM_DETAIL,
        PaneIdentifierUtils.generateItem(inventoryMappingId)
      );
    }
  };

  handleInfusionCreatureClick = (): void => {
    const { paneHistoryPush } = this.props;
    const { infusionChoice } = this.state;

    if (infusionChoice === null) {
      return;
    }

    const infusion = InfusionChoiceUtils.getInfusion(infusionChoice);
    if (infusion === null) {
      return;
    }

    const creatureMappingId = InfusionUtils.getCreatureMappingId(infusion);

    if (creatureMappingId) {
      paneHistoryPush(
        PaneComponentEnum.CREATURE,
        PaneIdentifierUtils.generateCreature(creatureMappingId)
      );
    }
  };

  handleChangeUiView = (uiView: UiViewEnum): void => {
    const { isReadonly } = this.props;

    if (isReadonly) {
      return;
    }

    this.setState({
      uiView,
    });
  };

  hasChosenInfusionItem = (): boolean => {
    if (this.getActiveItemId() === null) {
      return false;
    }

    return true;
  };

  hasChosenInfusionModifierData = (): boolean => {
    const { modifierGroupId } = this.state;

    return modifierGroupId !== null;
  };

  canCreateInfusion = (): boolean => {
    const {
      infusionChoice,
      itemCanBeAddedLookup,
      maximumInfusions,
      currentInfusions,
      overrideMaximumInfusions,
    } = this.state;

    if (!overrideMaximumInfusions && currentInfusions >= maximumInfusions) {
      return false;
    }

    if (infusionChoice === null) {
      return false;
    }

    const knownInfusion = InfusionChoiceUtils.getKnownInfusion(infusionChoice);
    if (knownInfusion === null) {
      return false;
    }

    const simulatedInfusion =
      KnownInfusionUtils.getSimulatedInfusion(knownInfusion);
    if (simulatedInfusion === null) {
      return false;
    }

    if (
      InfusionUtils.hack__requiresItemChoice(
        simulatedInfusion,
        KnownInfusionUtils.getItemId(knownInfusion),
        itemCanBeAddedLookup
      ) &&
      !this.hasChosenInfusionItem()
    ) {
      return false;
    }

    if (
      InfusionUtils.requiresModifierDataChoice(simulatedInfusion) &&
      !this.hasChosenInfusionModifierData()
    ) {
      return false;
    }

    return true;
  };

  renderChosenItem = (): React.ReactNode => {
    const { theme } = this.props;
    const { inventoryItem, newItem } = this.state;

    let chosenItem: Item | null = null;
    if (inventoryItem !== null) {
      chosenItem = inventoryItem;
    } else if (newItem !== null) {
      chosenItem = newItem;
    }

    if (chosenItem === null) {
      return null;
    }

    return <ItemPreview item={chosenItem} theme={theme} />;
  };

  renderChosenModifierGroup = (): React.ReactNode => {
    const { infusionChoice, modifierGroupId } = this.state;

    if (infusionChoice === null) {
      return null;
    }

    const knownInfusion = InfusionChoiceUtils.getKnownInfusion(infusionChoice);
    if (knownInfusion === null) {
      return null;
    }

    const simulatedInfusion =
      KnownInfusionUtils.getSimulatedInfusion(knownInfusion);
    if (simulatedInfusion === null) {
      return null;
    }

    const modifierData = InfusionUtils.getModifierData(simulatedInfusion);
    const foundModifierGroup = modifierData.find(
      (dataItem) => dataItem.id === modifierGroupId
    );

    if (!foundModifierGroup) {
      return null;
    }

    return foundModifierGroup.name;
  };

  renderUiChooseItem = (): React.ReactNode => {
    const { infusionChoice } = this.state;
    const {
      inventory,
      loadAvailableItems,
      globalModifiers,
      typeValueLookup,
      ruleData,
      proficiencyBonus,
      theme,
    } = this.props;

    if (infusionChoice === null) {
      return null;
    }

    const knownInfusion = InfusionChoiceUtils.getKnownInfusion(infusionChoice);
    if (knownInfusion === null) {
      return null;
    }

    const simulatedInfusion =
      KnownInfusionUtils.getSimulatedInfusion(knownInfusion);
    if (simulatedInfusion === null) {
      return null;
    }

    const itemRuleData = InfusionUtils.getItemRuleData(simulatedInfusion);

    let canChooseExisting: boolean = true;
    if (
      InfusionUtils.getType(simulatedInfusion) ===
      Constants.InfusionTypeEnum.REPLICATE
    ) {
      canChooseExisting = false;
    }

    return (
      <React.Fragment>
        <Header
          parent={this.renderInfusionChoiceName()}
          onClick={this.handleChangeUiView.bind(this, UiViewEnum.REVIEW)}
        >
          Choose an item to infuse
        </Header>
        <div className="ct-infusion-choice-pane__ui ct-infusion-choice-pane__ui--choose-item">
          {itemRuleData && (
            <div className="ct-infusion-choice-pane__ui-group">
              <div className="ct-infusion-choice-pane__ui-header">
                Requirements
              </div>
              <div className="ct-infusion-choice-pane__ui-content">
                {itemRuleData.text}
              </div>
            </div>
          )}
          {canChooseExisting && (
            <div className="ct-infusion-choice-pane__ui-group">
              <div className="ct-infusion-choice-pane__ui-header">
                Choose an existing item
              </div>
              <div className="ct-infusion-choice-pane__ui-content">
                <InfusionChoicePaneStore
                  theme={theme}
                  items={inventory}
                  infusionChoice={infusionChoice}
                  ruleData={ruleData}
                  onItemSelected={this.handleChooseExistingItem}
                  proficiencyBonus={proficiencyBonus}
                />
              </div>
            </div>
          )}
          <div className="ct-infusion-choice-pane__ui-group">
            <div className="ct-infusion-choice-pane__ui-header">
              Choose a new item
            </div>
            <div className="ct-infusion-choice-pane__ui-content">
              <InfusionChoicePaneNewStore
                theme={theme}
                loadAvailableItems={loadAvailableItems}
                globalModifiers={globalModifiers}
                typeValueLookup={typeValueLookup}
                infusionChoice={infusionChoice}
                ruleData={ruleData}
                onItemSelected={this.handleChooseNewItem}
                proficiencyBonus={proficiencyBonus}
              />
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  };

  renderUiChooseModifierGroup = (): React.ReactNode => {
    const { infusionChoice } = this.state;

    if (infusionChoice === null) {
      return null;
    }

    const knownInfusion = InfusionChoiceUtils.getKnownInfusion(infusionChoice);
    if (knownInfusion === null) {
      return null;
    }

    const simulatedInfusion =
      KnownInfusionUtils.getSimulatedInfusion(knownInfusion);
    if (simulatedInfusion === null) {
      return null;
    }

    const modifierDataType =
      InfusionUtils.getModifierDataType(simulatedInfusion);
    const modifierData = InfusionUtils.getModifierData(simulatedInfusion);

    let headerContentNode: React.ReactNode;
    let entries: Array<InfusionModifierDataContract> = [];
    switch (modifierDataType) {
      case Constants.InfusionModifierDataTypeEnum.DAMAGE_TYPE_CHOICE:
        headerContentNode = "Choose a Damage Type";
        entries = orderBy(modifierData, (data) => data.name);

        break;
      default:
      // not implemented
    }

    return (
      <React.Fragment>
        <Header
          parent={this.renderInfusionChoiceName()}
          onClick={this.handleChangeUiView.bind(this, UiViewEnum.REVIEW)}
        >
          Choose a variant for the infusion
        </Header>
        <div className="ct-infusion-choice-pane__ui ct-infusion-choice-pane__ui--choose-modifier-group">
          <div className="ct-infusion-choice-pane__ui-group">
            <div className="ct-infusion-choice-pane__ui-header">
              {headerContentNode}
            </div>
            <div className="ct-infusion-choice-pane__ui-content">
              {entries.map((entry) => (
                <div
                  className="ct-infusion-choice-pane__entry"
                  key={entry.id === null ? "" : entry.id}
                >
                  <div className="ct-infusion-choice-pane__entry-primary">
                    <div className="ct-infusion-choice-pane__entry-header">
                      {entry.name}
                    </div>
                  </div>
                  <div className="ct-infusion-choice-pane__entry-extra">
                    <ThemeButton
                      onClick={this.handleChooseModifierGroup.bind(
                        this,
                        entry.id
                      )}
                      size="small"
                      data-testid={`infusion-choose-item-button-${entry.name}`
                        .toLowerCase()
                        .replace(/\s/g, "-")}
                    >
                      Choose
                    </ThemeButton>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  };

  renderActions = (): React.ReactNode => {
    return (
      <div className="ct-infusion-choice-pane__actions">
        <ThemeButton
          onClick={this.handleInfuse}
          disabled={!this.canCreateInfusion()}
          data-testid="create-infusion-button"
        >
          Create Infusion
        </ThemeButton>
      </div>
    );
  };

  renderDescription = (): React.ReactNode => {
    const { infusionChoice } = this.state;

    if (infusionChoice === null) {
      return null;
    }

    const knownInfusion = InfusionChoiceUtils.getKnownInfusion(infusionChoice);
    if (knownInfusion === null) {
      return null;
    }

    const simulatedInfusion =
      KnownInfusionUtils.getSimulatedInfusion(knownInfusion);
    if (simulatedInfusion === null) {
      return null;
    }

    let contentNode: React.ReactNode;

    if (
      AccessUtils.isAccessible(InfusionUtils.getAccessType(simulatedInfusion))
    ) {
      const description = InfusionUtils.getDescription(simulatedInfusion);
      if (description) {
        contentNode = (
          <HtmlContent
            className="ct-infusion-choice-pane__description"
            html={description}
            withoutTooltips
          />
        );
      }
    } else {
      contentNode = this.renderMarketplaceCta();
    }

    return contentNode;
  };

  renderInfusionChoiceName = (): React.ReactNode => {
    const { infusionChoice } = this.state;

    if (infusionChoice === null) {
      return null;
    }

    const knownInfusion = InfusionChoiceUtils.getKnownInfusion(infusionChoice);
    if (knownInfusion === null) {
      return null;
    }

    const simulatedInfusion =
      KnownInfusionUtils.getSimulatedInfusion(knownInfusion);
    if (simulatedInfusion === null) {
      return null;
    }

    let extraNameNode: React.ReactNode;
    if (
      knownInfusion &&
      InfusionUtils.getType(simulatedInfusion) ===
        Constants.InfusionTypeEnum.REPLICATE
    ) {
      extraNameNode = `: ${KnownInfusionUtils.getItemName(knownInfusion)}`;
    }

    return (
      <React.Fragment>
        Infusion: {InfusionUtils.getName(simulatedInfusion)}
        {extraNameNode}
      </React.Fragment>
    );
  };

  renderUiReview = (): React.ReactNode => {
    const {
      newItem,
      inventoryItem,
      infusionChoice,
      itemCanBeAddedLookup,
      maximumInfusions,
      currentInfusions,
      overrideMaximumInfusions,
    } = this.state;

    const { isReadonly } = this.props;

    if (infusionChoice === null) {
      return null;
    }

    const knownInfusion = InfusionChoiceUtils.getKnownInfusion(infusionChoice);
    if (knownInfusion === null) {
      return null;
    }

    const simulatedInfusion =
      KnownInfusionUtils.getSimulatedInfusion(knownInfusion);
    if (simulatedInfusion === null) {
      return null;
    }

    const knownInfusionItemId = KnownInfusionUtils.getItemId(knownInfusion);
    const infusionType = InfusionUtils.getType(simulatedInfusion);
    const requiresItemChoice = InfusionUtils.hack__requiresItemChoice(
      simulatedInfusion,
      knownInfusionItemId,
      itemCanBeAddedLookup
    );

    const hasChosenInfusionItem = this.hasChosenInfusionItem();
    let itemHeaderNode: React.ReactNode;
    let itemContentNode: React.ReactNode;
    let itemExtraNode: React.ReactNode;
    let itemOnClick: SimpleOnClickHandler | undefined;
    if (requiresItemChoice) {
      itemOnClick = this.handleChangeUiView.bind(this, UiViewEnum.CHOOSE_ITEM);
      if (hasChosenInfusionItem) {
        if (newItem !== null) {
          itemHeaderNode = "New item to be infused";
        } else if (inventoryItem !== null) {
          itemHeaderNode = "Existing item to be infused";
        }
        itemContentNode = this.renderChosenItem();
        if (!isReadonly) {
          itemExtraNode = (
            <ThemeButton size="small" onClick={itemOnClick}>
              Change
            </ThemeButton>
          );
        }
      } else {
        itemHeaderNode = "Item to be infused";
        itemContentNode =
          currentInfusions >= maximumInfusions
            ? "Currently at Infusion Limit"
            : "No Item Chosen";
        if (!isReadonly) {
          itemExtraNode = (
            <ThemeButton
              size="small"
              disabled={
                !overrideMaximumInfusions &&
                currentInfusions >= maximumInfusions
              }
              onClick={itemOnClick}
              data-testid={`infusion-choose-items-button`}
            >
              Choose
            </ThemeButton>
          );
        }
      }
    } else if (infusionType === Constants.InfusionTypeEnum.REPLICATE) {
      itemHeaderNode = "Item to be replicated";
      itemContentNode = (
        <React.Fragment>
          {KnownInfusionUtils.getItemName(knownInfusion)}
        </React.Fragment>
      );
    }

    const modifierData = InfusionUtils.getModifierData(simulatedInfusion);
    const modifierDataType =
      InfusionUtils.getModifierDataType(simulatedInfusion);

    let modifierGroupHeaderNode: React.ReactNode = null;
    let modifierGroupContentNode: React.ReactNode = null;
    let modifierGroupExtraNode: React.ReactNode = null;
    let modifierGroupOnClick: SimpleOnClickHandler | undefined;
    if (
      modifierData !== null &&
      InfusionUtils.requiresModifierDataChoice(simulatedInfusion)
    ) {
      switch (modifierDataType) {
        case Constants.InfusionModifierDataTypeEnum.CLASS_LEVEL:
          modifierGroupHeaderNode = "Current Class Level Bonus";
          let forcedModifierData =
            InfusionChoiceUtils.getForcedModifierData(infusionChoice);
          if (forcedModifierData) {
            modifierGroupContentNode = forcedModifierData.name;
          }
          break;

        default:
          modifierGroupOnClick = this.handleChangeUiView.bind(
            this,
            UiViewEnum.CHOOSE_MODIFIER_GROUP
          );
          const hasChosenModifier = this.hasChosenInfusionModifierData();
          if (hasChosenModifier) {
            modifierGroupHeaderNode = "Chosen Variant";
            modifierGroupContentNode = this.renderChosenModifierGroup();
            modifierGroupExtraNode = (
              <ThemeButton size="small" onClick={modifierGroupOnClick}>
                Change
              </ThemeButton>
            );
          } else {
            modifierGroupHeaderNode = "Choose a Variant";
            modifierGroupContentNode = "No Variant Chosen";
            modifierGroupExtraNode = (
              <ThemeButton size="small" onClick={modifierGroupOnClick}>
                Choose
              </ThemeButton>
            );
          }
      }
    }

    return (
      <React.Fragment>
        <Header>{this.renderInfusionChoiceName()}</Header>
        {currentInfusions >= maximumInfusions && (
          <ThemeButton
            size="small"
            onClick={() => this.setState({ overrideMaximumInfusions: true })}
            data-testid="override-infusion-limit"
          >
            Override Infusion Limit
          </ThemeButton>
        )}
        <InfusionChoicePaneStep
          header={itemHeaderNode}
          onClick={
            overrideMaximumInfusions || currentInfusions < maximumInfusions
              ? itemOnClick
              : undefined
          }
          extra={itemExtraNode}
        >
          {itemContentNode}
        </InfusionChoicePaneStep>
        {modifierGroupContentNode !== null && (
          <InfusionChoicePaneStep
            header={modifierGroupHeaderNode}
            onClick={modifierGroupOnClick}
            extra={modifierGroupExtraNode}
          >
            {modifierGroupContentNode}
          </InfusionChoicePaneStep>
        )}
        {!isReadonly && this.renderActions()}
        {this.renderDescription()}
      </React.Fragment>
    );
  };

  handleRemoveContainer = (item: Item): void => {
    const { inventoryManager } = this.props;

    inventoryManager.handleRemove({ item });
  };

  renderRemoveActions = (): React.ReactNode => {
    const { inventoryLookup } = this.props;
    const { infusionChoice } = this.state;

    if (infusionChoice === null) {
      return;
    }

    const infusion = InfusionChoiceUtils.getInfusion(infusionChoice);
    if (!infusion) {
      return null;
    }
    const infusionId = InfusionUtils.getId(infusion);
    if (infusionId === null) {
      return;
    }

    return (
      <RemoveButton
        size="medium"
        style="filled"
        onClick={this.handleInfusionRemove}
        data-testid="remove-infusion-button"
      >
        Remove Infusion
      </RemoveButton>
    );
  };

  renderInfusedUi = (): React.ReactNode => {
    const { infusionChoice } = this.state;
    const { ruleData, creatureLookup, inventoryLookup, isReadonly, theme } =
      this.props;

    if (infusionChoice === null) {
      return null;
    }

    const infusion = InfusionChoiceUtils.getInfusion(infusionChoice);
    if (infusion === null) {
      return null;
    }

    const inventoryMappingId = InfusionUtils.getInventoryMappingId(infusion);
    const item = HelperUtils.lookupDataOrFallback(
      inventoryLookup,
      inventoryMappingId
    );
    const creatureMappingId = InfusionUtils.getCreatureMappingId(infusion);
    let creature: Creature | null = null;
    if (creatureMappingId !== null) {
      creature = HelperUtils.lookupDataOrFallback(
        creatureLookup,
        creatureMappingId
      );
    }

    return (
      <React.Fragment>
        <Header>{this.renderInfusionChoiceName()}</Header>
        {item !== null && (
          <InfusionChoicePaneStep
            header="Infused Item"
            onClick={this.handleInfusionItemClick}
          >
            <ItemPreview item={item} theme={theme} />
          </InfusionChoicePaneStep>
        )}
        {creature !== null && (
          <InfusionChoicePaneStep
            header="Infused Creature"
            onClick={this.handleInfusionCreatureClick}
          >
            <CreaturePreview creature={creature} ruleData={ruleData} />
          </InfusionChoicePaneStep>
        )}
        {!isReadonly && (
          <div className="ct-infusion-choice-pane__actions">
            {this.renderRemoveActions()}
          </div>
        )}
        {this.renderDescription()}
      </React.Fragment>
    );
  };

  renderLoadingUi = (): React.ReactNode => {
    return (
      <React.Fragment>
        <Header>{this.renderInfusionChoiceName()}</Header>
        <LoadingPlaceholder />
        {this.renderDescription()}
      </React.Fragment>
    );
  };

  renderMarketplaceCta = (): React.ReactNode => {
    const { infusionChoice } = this.state;
    const { ruleData } = this.props;

    if (infusionChoice === null) {
      return null;
    }

    const knownInfusion = InfusionChoiceUtils.getKnownInfusion(infusionChoice);
    if (knownInfusion === null) {
      return null;
    }

    const simulatedInfusion =
      KnownInfusionUtils.getSimulatedInfusion(knownInfusion);
    if (simulatedInfusion === null) {
      return null;
    }

    const sources = InfusionUtils.getSources(simulatedInfusion);

    let sourceNames: Array<string> = [];
    if (sources.length > 0) {
      sources.forEach((sourceMapping) => {
        let source = RuleDataUtils.getSourceDataInfo(
          sourceMapping.sourceId,
          ruleData
        );

        if (source !== null && source.description !== null) {
          sourceNames.push(source.description);
        }
      });
    }

    const sourceName =
      sourceNames.length > 0
        ? FormatUtils.renderNonOxfordCommaList(sourceNames)
        : null;

    return (
      <div className="ct-infusion-choice-pane__marketplace-cta">
        <MarketplaceCta
          showImage={false}
          sourceName={sourceName}
          description="To unlock this infusion, check out the Marketplace to view purchase options."
        />
      </div>
    );
  };

  render() {
    const { infusionChoice, needsItemStore, loadingStatus, uiView } =
      this.state;

    if (infusionChoice === null) {
      return null;
    }

    let infusion = InfusionChoiceUtils.getInfusion(infusionChoice);

    let contentNode: React.ReactNode;
    if (needsItemStore && loadingStatus !== DataLoadingStatusEnum.LOADED) {
      contentNode = this.renderLoadingUi();
    } else if (infusion === null) {
      switch (uiView) {
        case UiViewEnum.CHOOSE_ITEM:
          contentNode = this.renderUiChooseItem();
          break;

        case UiViewEnum.CHOOSE_MODIFIER_GROUP:
          contentNode = this.renderUiChooseModifierGroup();
          break;

        case UiViewEnum.REVIEW:
        default:
          contentNode = this.renderUiReview();
          break;
      }
    } else {
      contentNode = this.renderInfusedUi();
    }

    const choiceKey = InfusionChoiceUtils.getKey(infusionChoice);
    return (
      <div
        className="ct-infusion-choice-pane"
        key={choiceKey === null ? "" : choiceKey}
      >
        {contentNode}
      </div>
    );
  }
}

function mapStateToProps(state: SharedAppState) {
  return {
    infusionChoices: rulesEngineSelectors.getAvailableInfusionChoices(state),
    inventory: rulesEngineSelectors.getInventory(state),
    inventoryLookup: rulesEngineSelectors.getInventoryLookup(state),
    containers: rulesEngineSelectors.getInventoryContainers(state),
    creatureLookup: rulesEngineSelectors.getCreatureLookup(state),
    loadAvailableItems: apiCreatorSelectors.makeLoadAvailableItems(state),
    globalModifiers: rulesEngineSelectors.getValidGlobalModifiers(state),
    typeValueLookup: rulesEngineSelectors.getCharacterValueLookupByType(state),
    ruleData: rulesEngineSelectors.getRuleData(state),
    isReadonly: appEnvSelectors.getIsReadonly(state),
    proficiencyBonus: rulesEngineSelectors.getProficiencyBonus(state),
    characterId: rulesEngineSelectors.getId(state),
    theme: rulesEngineSelectors.getCharacterTheme(state),
    classes: rulesEngineSelectors.getClasses(state),
  };
}

function InfusionChoicePaneContainer(props) {
  const { inventoryManager } = useContext(InventoryManagerContext);
  const {
    pane: { paneHistoryPush },
  } = useSidebar();
  return (
    <InfusionChoicePane
      inventoryManager={inventoryManager}
      paneHistoryPush={paneHistoryPush}
      {...props}
    />
  );
}

export default connect(mapStateToProps)(InfusionChoicePaneContainer);
