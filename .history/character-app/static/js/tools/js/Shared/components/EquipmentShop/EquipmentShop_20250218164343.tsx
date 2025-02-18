import axios, { Canceler } from "axios";
import React from "react";
import { useContext } from "react";

import { LoadingPlaceholder } from "../../character-components/es";
import {
  Container,
  ContainerUtils,
  CharacterTheme,
  Item,
  RuleData,
  PartyInfo,
  InventoryManager,
  ItemManager,
  ContainerManager,
} from "../../character-rules-engine/es";

import { ItemFilter } from "~/components/ItemFilter";

import { InventoryManagerContext } from "../../managers/InventoryManagerContext";
import { AppLoggerUtils } from "../../utils";
import { ThemeButton } from "../common/Button";
import { EquipmentShopItem } from "./EquipmentShopItem";

interface Props {
  items?: Array<Item>;
  pageSize: number;
  // CAN THIS GO AS WELL!?
  ruleData: RuleData;
  proficiencyBonus: number;
  containers: Array<Container>;
  theme: CharacterTheme;
  limitAddToCurrentContainer: Container | null;
  partyInfo: PartyInfo | null;
  inventoryManager: InventoryManager;
}
interface State {
  query: "";
  shoppeContainer: ContainerManager | null;
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
export class EquipmentShop extends React.PureComponent<Props, State> {
  static defaultProps = {
    pageSize: 12,
    limitAddToCurrentContainer: null,
  };

  // TODO: I am going to hold off on this

  loadItemsCanceler: null | Canceler = null;

  constructor(props: Props) {
    super(props);

    this.state = {
      query: "",
      shoppeContainer: null,
      filteredItems: props.items ? props.items : [],
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
    const { inventoryManager } = this.props;

    if (inventoryManager) {
      this.setState({
        loading: true,
      });

      // promise or callback vs async/await? geeze
      inventoryManager
        .getInventoryShoppe({
          onSuccess: (shoppeContainer: ContainerManager) => {
            this.setState({
              shoppeContainer,
              loading: false,
              loaded: true,
            });
          },
          additionalApiConfig: {
            cancelToken: new axios.CancelToken((c) => {
              this.loadItemsCanceler = c;
            }),
          },
        })
        .then((res) => {
          this.loadItemsCanceler = null;
          return res;
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

  isFiltered = (): boolean => {
    const {
      filterQuery,
      filterTypes,
      filterProficient,
      filterMagic,
      filterBasic,
      filterContainer,
      filterSourceCategories,
    } = this.state;

    if (filterProficient || filterMagic || filterBasic || filterContainer) {
      return true;
    }

    if (filterQuery) {
      return true;
    }

    if (filterTypes.length || filterSourceCategories.length) {
      return true;
    }

    return false;
  };

  handlePageMore = (): void => {
    this.setState((prevState) => ({
      currentPage: prevState.currentPage + 1,
    }));
  };

  handleQueryChange = (evt: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({
      filterQuery: evt.target.value,
      currentPage: 0,
    });
  };

  handleFilterItemType = (type: string): void => {
    this.setState((prevState: State) => ({
      filterTypes: prevState.filterTypes.includes(type)
        ? prevState.filterTypes.filter((t) => t !== type)
        : [...prevState.filterTypes, type],
      currentPage: 0,
    }));
  };

  handleSourceCategoryClick = (categoryId: number): void => {
    this.setState((prevState: State) => ({
      filterSourceCategories: prevState.filterSourceCategories.includes(
        categoryId
      )
        ? prevState.filterSourceCategories.filter((cat) => cat !== categoryId)
        : [...prevState.filterSourceCategories, categoryId],
      currentPage: 0,
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

  handleProficientToggle = (): void => {
    this.setState((prevState: State) => ({
      filterProficient: !prevState.filterProficient,
      currentPage: 0,
    }));
  };

  handleBasicToggle = (): void => {
    this.setState((prevState: State) => ({
      filterBasic: !prevState.filterBasic,
      currentPage: 0,
    }));
  };

  handleMagicToggle = (): void => {
    this.setState((prevState: State) => ({
      filterMagic: !prevState.filterMagic,
      currentPage: 0,
    }));
  };

  handleContainerToggle = (): void => {
    this.setState((prevState: State) => ({
      filterContainer: !prevState.filterContainer,
      currentPage: 0,
    }));
  };

  renderPager = (
    filteredItems: Array<ItemManager>,
    totalItems: number
  ): React.ReactNode => {
    if (!this.isFiltered()) {
      return null;
    }

    if (filteredItems.length >= totalItems) {
      return null;
    }

    return (
      <div className="ct-equipment-shop__pager">
        <ThemeButton block={true} onClick={this.handlePageMore}>
          Load More
        </ThemeButton>
      </div>
    );
  };

  renderPagedListing = (filteredItems: Array<ItemManager>): React.ReactNode => {
    const { currentPage } = this.state;
    const {
      pageSize,
      ruleData,
      proficiencyBonus,
      containers,
      theme,
      limitAddToCurrentContainer,
      partyInfo,
    } = this.props;

    if (!this.isFiltered()) {
      return null;
    }

    const pagedFilteredItems: Array<ItemManager> = filteredItems.slice(
      0,
      (currentPage + 1) * pageSize
    );

    return (
      <div className="ct-equipment-shop__items">
        {pagedFilteredItems.length ? (
          pagedFilteredItems.map((item, idx) => {
            let filteredContainers = containers;
            const isContainer = item.isContainer();
            const isPack = item.isPack();
            if (isContainer || isPack) {
              filteredContainers = containers.filter(
                (container) =>
                  ContainerUtils.isCharacterContainer(container) ||
                  ContainerUtils.isPartyContainer(container)
              );
            } else if (limitAddToCurrentContainer) {
              filteredContainers = [limitAddToCurrentContainer];
            }
            return (
              <EquipmentShopItem
                key={`${item.getDefinitionId()}-${idx}`}
                containers={filteredContainers}
                theme={theme}
                item={item}
                ruleData={ruleData}
                proficiencyBonus={proficiencyBonus}
                partyInfo={partyInfo}
              />
            );
          })
        ) : (
          <div className="ct-equipment-shop__empty">No Results Found</div>
        )}
      </div>
    );
  };

  renderUi = (): React.ReactNode => {
    const {
      filterTypes,
      filterQuery,
      filterProficient,
      filterBasic,
      filterMagic,
      filterContainer,
      filterSourceCategories,
      currentPage,
    } = this.state;
    const { pageSize } = this.props;

    const itemData = this.state.shoppeContainer?.getInventoryItems({
      filterOptions: {
        filterTypes,
        filterQuery,
        filterProficient,
        filterBasic,
        filterMagic,
        filterContainer,
        filterSourceCategories,
      },
      paginationOptions: {
        currentPage,
        pageSize,
      },
      isShoppe: true,
    });

    const items = itemData?.items ?? [];
    const totalItems = itemData?.totalItems ?? 0;
    const sourceCategories = itemData?.sourceCategories || [];

    return (
      <React.Fragment>
        <ItemFilter
          filterQuery={filterQuery}
          onQueryChange={(value) =>
            this.setState({
              filterQuery: value,
            })
          }
          filterTypes={filterTypes}
          sourceCategories={sourceCategories}
          onFilterButtonClick={this.handleFilterItemType}
          onCheckboxChange={this.handleToggleFilter}
          onSourceCategoryClick={this.handleSourceCategoryClick}
          filterSourceCategories={filterSourceCategories}
          filterProficient={filterProficient}
          filterBasic={filterBasic}
          filterMagic={filterMagic}
          filterContainer={filterContainer}
          themed
        />
        {this.renderPagedListing(items)}
        {this.renderPager(items, totalItems)}
      </React.Fragment>
    );
  };

  renderLoading = (): React.ReactNode => {
    return <LoadingPlaceholder />;
  };

  render() {
    const { loaded, loading } = this.state;

    return (
      <div className="ct-equipment-shop">
        {loading && this.renderLoading()}
        {!loading && loaded && this.renderUi()}
      </div>
    );
  }
}

export default function EquipmentShopContainer(props) {
  const { inventoryManager } = useContext(InventoryManagerContext);
  return <EquipmentShop inventoryManager={inventoryManager} {...props} />;
}
