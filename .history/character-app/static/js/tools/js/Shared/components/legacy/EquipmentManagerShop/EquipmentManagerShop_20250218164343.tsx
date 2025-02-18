import axios, { Canceler } from "axios";
import sortBy from "lodash/sortBy";
import React from "react";

import {
  LoadingPlaceholder,
  Button,
  TypeScriptUtils,
} from "../../character-components/es";
import {
  ApiAdapterPromise,
  ApiAdapterUtils,
  ApiResponse,
  ApiAdapterRequestConfig,
  BaseItemDefinitionContract,
  HelperUtils,
  Item,
  ItemUtils,
  Modifier,
  RuleData,
  RuleDataUtils,
  TypeValueLookup,
  CharacterTheme,
  SourceUtils,
} from "../../character-rules-engine/es";

import { ItemFilter } from "~/components/ItemFilter";
import { ItemName } from "~/components/ItemName";
import { LegacyBadge } from "~/components/LegacyBadge";

import { AppLoggerUtils, FilterUtils } from "../../../utils";
import ItemDetail from "../../ItemDetail";
import EquipmentListItem from "../EquipmentListItem";
import { CollapsibleHeader, CollapsibleHeading } from "../common/Collapsible";

//TODO: This component should be removed and replaced with the EquipmentShop component
export class EquipmentManagerShopItem extends React.PureComponent<
  {
    item: Item;
    onItemAdd: (
      item: Item,
      amount: number,
      containerDefinitionKey: string
    ) => void;
    minAddAmount: number;
    maxAddAmount: number;
    ruleData: RuleData;
    proficiencyBonus: number;
    containerDefinitionKey: string;
    theme: CharacterTheme;
  },
  {
    amount: number | null;
  }
> {
  static defaultProps = {
    enableAdd: true,
    minAddAmount: 1,
    maxAddAmount: 10,
  };

  constructor(props) {
    super(props);

    this.state = {
      amount: 1,
    };
  }

  handleAmountChange = (evt) => {
    this.setState({
      amount: evt.target.value,
    });
  };

  handleAmountBlur = (evt) => {
    const { minAddAmount, maxAddAmount } = this.props;

    const parsedValue = HelperUtils.parseInputInt(evt.target.value);
    let clampedValue: number | null = null;
    if (parsedValue) {
      clampedValue = HelperUtils.clampInt(
        parsedValue,
        minAddAmount,
        maxAddAmount
      );
    }

    this.setState({
      amount: clampedValue,
    });
  };

  handleDecrementCountClick = () => {
    const { minAddAmount } = this.props;

    this.setState((prevState, props) => ({
      amount: Math.max(
        (prevState.amount === null ? 0 : prevState.amount) - 1,
        minAddAmount
      ),
    }));
  };

  handleIncrementCountClick = () => {
    this.setState((prevState, props) => ({
      amount: (prevState.amount === null ? 0 : prevState.amount) + 1,
    }));
  };

  handleAdd = () => {
    const { amount } = this.state;
    const { item, onItemAdd, minAddAmount, containerDefinitionKey } =
      this.props;

    onItemAdd(
      item,
      amount === null ? minAddAmount : amount,
      containerDefinitionKey
    );
  };

  renderButtons = () => {
    const { item } = this.props;

    return (
      <div className="equipment-list-header-actions">
        <Button size="small" onClick={this.handleAdd}>
          Add
        </Button>
      </div>
    );
  };

  renderHeader(item, metaItems, defaultImageUrl) {
    const { theme } = this.props;
    const { canAttune, avatarUrl } = item.definition;
    const isLegacy = ItemUtils.isLegacy(item);

    const heading = (
      <CollapsibleHeading>
        <div className="equipment-list-heading">
          <span className="equipment-list-heading-text">
            <ItemName item={item} />
          </span>
          <span className="equipment-list-heading-icons">
            {canAttune ? (
              <i className="equipment-list-heading-icon i-req-attunement" />
            ) : (
              ""
            )}
          </span>
          {isLegacy && <LegacyBadge variant="margin-left" />}
        </div>
      </CollapsibleHeading>
    );

    let imageUrl = avatarUrl;
    if (!imageUrl) {
      imageUrl = defaultImageUrl;
    }

    return (
      <CollapsibleHeader
        imgSrc={imageUrl ? imageUrl : ""}
        heading={heading}
        metaItems={metaItems}
        callout={this.renderButtons()}
      />
    );
  }

  render() {
    const { amount } = this.state;
    const {
      item,
      minAddAmount,
      maxAddAmount,
      ruleData,
      proficiencyBonus,
      theme,
    } = this.props;

    let metaItems = [ItemUtils.getType(item)];
    let defaultImageUrl: string | null = null;

    if (ItemUtils.isWeaponContract(item)) {
      defaultImageUrl = RuleDataUtils.getDefaultWeaponImageUrl(ruleData);
    } else if (ItemUtils.isGearContract(item)) {
      const subType = ItemUtils.getSubType(item);
      if (subType) {
        metaItems.push(subType);
      }

      defaultImageUrl = RuleDataUtils.getDefaultGearImageUrl(ruleData);
    } else if (ItemUtils.isArmorContract(item)) {
      const baseArmorName = ItemUtils.getBaseArmorName(item);
      if (baseArmorName) {
        metaItems.push(baseArmorName);
      }

      defaultImageUrl = RuleDataUtils.getDefaultArmorImageUrl(ruleData);
    }

    const totalAmount: number =
      (amount === null ? 1 : amount) * ItemUtils.getBundleSize(item);

    return (
      <EquipmentListItem
        header={this.renderHeader(item, metaItems, defaultImageUrl)}
      >
        <ItemDetail
          theme={theme}
          item={item}
          ruleData={ruleData}
          showCustomize={false}
          showActions={false}
          proficiencyBonus={proficiencyBonus}
        />
        <div className="equipment-list-item-actions">
          <div className="equipment-list-item-action">
            <div className="equipment-list-item-amount">
              <div className="equipment-list-item-amount-label">
                Amount to add
              </div>
              <div className="equipment-list-item-amount-controls">
                <div className="equipment-list-item-amount-decrease">
                  <Button
                    clsNames={["button-action-decrease"]}
                    onClick={this.handleDecrementCountClick}
                    disabled={amount !== null && amount <= minAddAmount}
                  />
                </div>
                <div className="equipment-list-item-amount-value">
                  <input
                    type="number"
                    value={amount === null ? "" : amount}
                    className="character-input equipment-list-item-amount-input"
                    onChange={this.handleAmountChange}
                    onBlur={this.handleAmountBlur}
                    min={minAddAmount}
                    max={maxAddAmount}
                  />
                </div>
                <div className="equipment-list-item-amount-increase">
                  <Button
                    clsNames={["button-action-increase"]}
                    onClick={this.handleIncrementCountClick}
                    disabled={amount !== null && amount >= maxAddAmount}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="equipment-list-item-action">
            <Button onClick={this.handleAdd}>
              Add {totalAmount === 1 ? " Item" : ` ${totalAmount} Items`}
            </Button>
          </div>
        </div>
      </EquipmentListItem>
    );
  }
}

interface EquipmentManagerShopProps {
  loadItems?: (
    additionalConfig?: Partial<ApiAdapterRequestConfig>
  ) => ApiAdapterPromise<ApiResponse<Array<BaseItemDefinitionContract>>>;
  items?: Array<any>;
  globalModifiers: Array<Modifier>;
  valueLookupByType: TypeValueLookup;
  pageSize: number;
  onItemAdd: (
    item: Item,
    amount: number,
    containerDefinitionKey: string
  ) => void;
  ruleData: RuleData;
  proficiencyBonus: number;
  containerDefinitionKey: string;
  theme: CharacterTheme;
  activeSourceCategories: Array<number>;
}
interface EquipmentManagerShopState {
  query: string;
  lazyItems: Array<Item>;
  staticItems: Array<Item>;
  filteredItems: Array<Item>;
  currentPage: number;
  loading: boolean;
  loaded: boolean;
  filterTypes: Array<string>;
  filterQuery: string;
  filterProficient: boolean;
  filterBasic: boolean;
  filterMagic: boolean;
  filterContainer: boolean;
  filterSourceCategories: Array<number>;
}
export default class EquipmentManagerShop extends React.PureComponent<
  EquipmentManagerShopProps,
  EquipmentManagerShopState
> {
  static defaultProps = {
    pageSize: 30,
  };

  loadItemsCanceler: null | Canceler = null;

  constructor(props) {
    super(props);

    const { items } = props;

    this.state = {
      query: "",
      lazyItems: [],
      staticItems: items,
      filteredItems: items,
      currentPage: 0,
      loading: false,
      loaded: false,
      filterTypes: [],
      filterQuery: "",
      filterProficient: false,
      filterBasic: false,
      filterMagic: false,
      filterContainer: false,
      filterSourceCategories: [],
    };
  }

  componentDidMount() {
    const { loadItems } = this.props;

    if (loadItems) {
      this.setState({
        loading: true,
      });

      loadItems({
        cancelToken: new axios.CancelToken((c) => {
          this.loadItemsCanceler = c;
        }),
      })
        .then((response) => {
          let data = ApiAdapterUtils.getResponseData(response);
          let transformedItems: Array<Item> = [];
          if (data) {
            transformedItems = this.transformLoadedItems(
              data.filter((item) => item.canBeAddedToInventory)
            );
          }

          this.setState((prevState, prevProps) => {
            return {
              lazyItems: transformedItems,
              loaded: true,
              loading: false,
            };
          });
          this.loadItemsCanceler = null;
        })
        .catch(AppLoggerUtils.handleAdhocApiError);
    } else {
      this.setState({
        loaded: true,
      });
    }
  }

  componentWillUnmount(): void {
    if (this.loadItemsCanceler !== null) {
      this.loadItemsCanceler();
    }
  }

  componentDidUpdate(
    prevProps: Readonly<EquipmentManagerShopProps>,
    prevState: Readonly<EquipmentManagerShopState>,
    snapshot?: any
  ): void {
    const { items } = this.props;

    if (items && items !== prevProps.items) {
      this.setState((prevState) => ({
        staticItems: items,
      }));
    }
  }

  getCombinedItems = () => {
    const { lazyItems, staticItems } = this.state;

    return sortBy(
      [...lazyItems],
      [
        (item) => ItemUtils.getRarityLevel(item),
        (item) => ItemUtils.getName(item),
      ]
    );
  };

  getFilteredItems = (combinedItems: Item[]) => {
    const {
      filterQuery,
      filterTypes,
      filterProficient,
      filterMagic,
      filterBasic,
      filterContainer,
      filterSourceCategories,
    } = this.state;

    return combinedItems.filter((item) => {
      if (filterSourceCategories.length !== 0) {
        const itemSourceCategories = ItemUtils.getAllSourceCategoryIds(item);
        if (
          !filterSourceCategories.some((id) =>
            itemSourceCategories.includes(id)
          )
        ) {
          return false;
        }
      }

      if (
        filterProficient &&
        (ItemUtils.isWeaponContract(item) || ItemUtils.isArmorContract(item)) &&
        !item.proficiency
      ) {
        return false;
      }

      const itemFilterType = ItemUtils.getDefintionFilterType(item);
      if (
        itemFilterType &&
        filterTypes.length !== 0 &&
        !filterTypes.includes(itemFilterType)
      ) {
        return false;
      }

      let searchTags: Array<string> = [];
      if (ItemUtils.isGearContract(item)) {
        const subType = ItemUtils.getSubType(item);
        if (subType !== null) {
          searchTags.push(subType);
        }
      }
      if (
        filterQuery !== "" &&
        !FilterUtils.doesQueryMatchData(
          filterQuery,
          ItemUtils.getName(item),
          searchTags
        )
      ) {
        return false;
      }

      if (filterMagic && !filterBasic && !ItemUtils.isMagic(item)) {
        return false;
      }

      if (filterBasic && !filterMagic && ItemUtils.isMagic(item)) {
        return false;
      }

      if (
        filterContainer &&
        !filterBasic &&
        !filterMagic &&
        !ItemUtils.isContainer(item)
      ) {
        return false;
      }

      return true;
    });
  };

  transformLoadedItems = (
    data: Array<BaseItemDefinitionContract>
  ): Array<Item> => {
    const { globalModifiers, valueLookupByType, ruleData } = this.props;

    return data.map((definition) =>
      ItemUtils.simulateItem(
        definition,
        globalModifiers,
        valueLookupByType,
        ruleData
      )
    );
  };

  getLastPageIdx = (filteredItems) => {
    const { pageSize } = this.props;

    return Math.ceil(filteredItems.length / pageSize) - 1;
  };

  handlePageMore = () => {
    this.setState((prevState) => ({
      currentPage: prevState.currentPage + 1,
    }));
  };

  handleQueryChange = (evt) => {
    const query = evt.target.value;

    this.setState({
      filterQuery: query,
      currentPage: 0,
    });
  };

  handleFilterItemType = (type) => {
    this.setState((prevState) => ({
      filterTypes: prevState.filterTypes.includes(type)
        ? prevState.filterTypes.filter((t) => t !== type)
        : [...prevState.filterTypes, type],
      currentPage: 0,
    }));
  };

  handleSourceCategoryClick = (categoryId: number) => {
    this.setState((prevState) => ({
      filterSourceCategories: prevState.filterSourceCategories.includes(
        categoryId
      )
        ? prevState.filterSourceCategories.filter((cat) => cat !== categoryId)
        : [...prevState.filterSourceCategories, categoryId],
    }));
  };

  handleToggleFilter = (type: string): void => {
    switch (type) {
      case "Proficient":
        this.handleProficientToggle();
        break;
      case "Common":
        this.handleBasicToggle();
        break;
      case "Magical":
        this.handleMagicToggle();
        break;
      case "Container":
        this.handleContainerToggle();
        break;
      default:
    }
  };

  handleProficientToggle = () => {
    this.setState((prevState) => ({
      filterProficient: !prevState.filterProficient,
      currentPage: 0,
    }));
  };

  handleBasicToggle = () => {
    this.setState((prevState) => ({
      filterBasic: !prevState.filterBasic,
      currentPage: 0,
    }));
  };

  handleMagicToggle = () => {
    this.setState((prevState) => ({
      filterMagic: !prevState.filterMagic,
      currentPage: 0,
    }));
  };

  handleContainerToggle = (): void => {
    this.setState((prevState) => ({
      filterContainer: !prevState.filterContainer,
      currentPage: 0,
    }));
  };

  renderPager = (filteredItems) => {
    const { currentPage } = this.state;
    const lastPageIdx = this.getLastPageIdx(filteredItems);

    if (lastPageIdx < 1 || currentPage >= lastPageIdx) {
      return null;
    }

    return (
      <div className="equipment-manager-shop-pager">
        <Button block={true} onClick={this.handlePageMore}>
          Load More
        </Button>
      </div>
    );
  };

  renderPagedListing = (filteredItems) => {
    const { currentPage } = this.state;
    const {
      pageSize,
      onItemAdd,
      ruleData,
      proficiencyBonus,
      containerDefinitionKey,
      theme,
    } = this.props;

    const pagedFilteredItems = filteredItems.slice(
      0,
      (currentPage + 1) * pageSize
    );

    return (
      <div className="equipment-manager-shop-items">
        {pagedFilteredItems.length ? (
          pagedFilteredItems.map((item, idx) => (
            <EquipmentManagerShopItem
              theme={theme}
              item={item}
              key={`${item.id}-${idx}`}
              onItemAdd={onItemAdd}
              ruleData={ruleData}
              proficiencyBonus={proficiencyBonus}
              containerDefinitionKey={containerDefinitionKey}
            />
          ))
        ) : (
          <div className="equipment-manager-shop-no-results">
            No Results Found
          </div>
        )}
      </div>
    );
  };

  renderUi = () => {
    const {
      filterTypes,
      filterQuery,
      filterProficient,
      filterBasic,
      filterMagic,
      filterContainer,
      filterSourceCategories,
    } = this.state;
    const { ruleData, activeSourceCategories } = this.props;
    const combinedItems = this.getCombinedItems();
    const filteredItems = this.getFilteredItems(combinedItems);

    const itemDefinitions = combinedItems
      .map((item) => ItemUtils.getDefinition(item))
      .filter(TypeScriptUtils.isNotNullOrUndefined);
    const sourceCategories = SourceUtils.getSimpleSourceCategoriesData(
      itemDefinitions,
      ruleData,
      activeSourceCategories
    );

    return (
      <div>
        <ItemFilter
          sourceCategories={sourceCategories}
          filterQuery={filterQuery}
          onQueryChange={(value) =>
            this.setState({
              filterQuery: value,
            })
          }
          filterTypes={filterTypes}
          onFilterButtonClick={this.handleFilterItemType}
          onCheckboxChange={this.handleToggleFilter}
          onSourceCategoryClick={this.handleSourceCategoryClick}
          filterSourceCategories={filterSourceCategories}
          filterProficient={filterProficient}
          filterBasic={filterBasic}
          filterMagic={filterMagic}
          filterContainer={filterContainer}
          buttonSize="x-small"
          filterStyle="builder"
        />
        {this.renderPagedListing(filteredItems)}
        {this.renderPager(filteredItems)}
      </div>
    );
  };

  renderLoading = () => {
    return <LoadingPlaceholder />;
  };

  render() {
    const { loaded, loading } = this.state;

    return (
      <div className="equipment-manager-shop">
        {loading && this.renderLoading()}
        {!loading && loaded && this.renderUi()}
      </div>
    );
  }
}
