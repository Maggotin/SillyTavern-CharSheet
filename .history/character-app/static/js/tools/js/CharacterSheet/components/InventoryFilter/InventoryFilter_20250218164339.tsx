import { orderBy } from "lodash";
import React from "react";

import {
  DarkFilterSvg,
  ThemedFilterSvg,
  LightFilterSvg,
} from "../../character-components/es";
import {
  CharacterTheme,
  Constants,
  HtmlSelectOption,
  Item,
  ItemUtils,
  RuleData,
} from "../../character-rules-engine/es";

import { FilterUtils } from "../../../Shared/utils";
import InventoryFilterArrayFilter from "./InventoryFilterArrayFilter";
import InventoryFilterExclusiveCheckboxFilter from "./InventoryFilterExclusiveCheckboxFilter";

interface Props {
  inventory: Array<Item>;
  partyInventory: Array<Item>;
  callout?: React.ReactNode;
  ruleData: RuleData;
  onDataUpdate: (filterData: any) => void; //TODO type filterData
  theme: CharacterTheme;
}
interface DefaultInventoryFilterState {
  filterQuery: string;
  filterTypes: Array<number>;
  filterRarities: Array<string>;
  filterTags: Array<string>;
  filterRanged: boolean | null;
}
interface State extends DefaultInventoryFilterState {
  filteredInventory: Array<Item>;
  filteredPartyInventory: Array<Item>;
  showAdvancedFilters: boolean;
}
export default class InventoryFilter extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      filteredInventory: this.getInventory(props),
      filteredPartyInventory: this.getPartyInventory(props),
      filterQuery: "",
      filterTypes: [],
      filterRarities: [],
      filterTags: [],
      filterRanged: null,
      showAdvancedFilters: false,
    };
  }

  componentDidMount() {
    this.handleDataUpdate();
  }

  componentDidUpdate(
    prevProps: Readonly<Props>,
    prevState: Readonly<State>,
    snapshot?: any
  ): void {
    const { inventory, partyInventory } = this.props;

    if (
      inventory !== prevProps.inventory ||
      partyInventory !== prevProps.partyInventory
    ) {
      let inventory = this.filterItems(
        this.props,
        this.getFilters(prevState),
        this.getInventory(this.props)
      );
      let partyInventory = this.filterItems(
        this.props,
        this.getFilters(prevState),
        this.getPartyInventory(this.props)
      );
      this.setState(
        {
          filteredInventory: inventory,
          filteredPartyInventory: partyInventory,
        },
        this.handleDataUpdate
      );
    }
  }

  getFilters = (state: State): DefaultInventoryFilterState => {
    const {
      filterQuery,
      filterTypes,
      filterRarities,
      filterTags,
      filterRanged,
    } = state;
    return {
      filterQuery,
      filterTypes,
      filterRarities,
      filterTags,
      filterRanged,
    };
  };

  filterItems = (
    props: Props,
    filters: DefaultInventoryFilterState,
    inventory: Array<Item>
  ): Array<Item> => {
    const {
      filterQuery,
      filterTypes,
      filterRarities,
      filterTags,
      filterRanged,
    } = filters;

    return inventory.filter((item) => {
      if (
        filterQuery &&
        !FilterUtils.doesQueryMatchData(filterQuery, ItemUtils.getName(item))
      ) {
        return false;
      }

      if (filterTags.length) {
        let matches: boolean = false;
        let tags = ItemUtils.getTags(item);
        tags.forEach((tag) => {
          if (!matches && filterTags.includes(tag)) {
            matches = true;
          }
        });
        if (!matches) {
          return false;
        }
      }

      if (filterTypes.length) {
        if (!filterTypes.includes(ItemUtils.getBaseTypeId(item))) {
          return false;
        }
      }

      if (filterRarities.length) {
        let rarity = ItemUtils.getRarity(item);
        if (rarity === null || !filterRarities.includes(rarity)) {
          return false;
        }
      }

      if (filterRanged === true) {
        if (
          ItemUtils.getAttackType(item) !== Constants.AttackTypeRangeEnum.RANGED
        ) {
          return false;
        }
      } else if (filterRanged === false) {
        if (
          ItemUtils.getAttackType(item) !== Constants.AttackTypeRangeEnum.MELEE
        ) {
          return false;
        }
      }

      return true;
    });
  };

  getFilterCount = (): number => {
    const { filterTypes, filterRarities, filterTags, filterRanged } =
      this.state;

    let count: number = 0;
    count += filterTags.length;
    count += filterTypes.length;
    count += filterRarities.length;
    count += filterRanged === null ? 0 : 1;
    return count;
  };

  getTagOptions = (tags: Array<string>): Array<HtmlSelectOption> => {
    return tags.sort().map((tag) => ({ label: tag, value: tag }));
  };

  getRarityOptions = (rarities: Array<string>): Array<HtmlSelectOption> => {
    return rarities.sort().map((rarity) => {
      return {
        label: rarity,
        value: rarity,
      };
    });
  };

  getTypeOptions = (types: Array<number>): Array<HtmlSelectOption> => {
    return orderBy(
      types.map((type) => {
        return {
          label:
            type === 0 ? "Custom" : ItemUtils.deriveBaseTypeNameFromId(type),
          value: type,
        };
      }),
      "label"
    );
  };

  getInventory = (props: Props): Array<Item> => {
    return [...props.inventory];
  };

  getPartyInventory = (props: Props): Array<Item> => {
    return [...props.partyInventory];
  };

  isFiltering = (): boolean => {
    const { filterQuery } = this.state;

    const filterCount = this.getFilterCount();
    return filterCount > 0 || !!filterQuery;
  };

  handleDataUpdate = (): void => {
    const { onDataUpdate } = this.props;

    if (onDataUpdate) {
      onDataUpdate({
        ...this.state,
        filterCount: this.getFilterCount(),
        isFiltering: this.isFiltering(),
      });
    }
  };

  handleFilterClear = (
    propertyKey: keyof State,
    resetState: Array<string> | Array<number> | null
  ): void => {
    this.setState((prevState: State) => {
      let inventory = this.filterItems(
        this.props,
        {
          ...this.getFilters(prevState),
          [propertyKey]: resetState,
        },
        this.getInventory(this.props)
      );
      let partyInventory = this.filterItems(
        this.props,
        {
          ...this.getFilters(prevState),
          [propertyKey]: resetState,
        },
        this.getPartyInventory(this.props)
      );
      return {
        ...prevState,
        [propertyKey]: resetState,
        filteredInventory: inventory,
        filteredPartyInventory: partyInventory,
      };
    }, this.handleDataUpdate);
  };

  handleArrayFilterClear = (
    propertyKey: keyof State,
    evt: React.MouseEvent
  ): void => {
    evt.stopPropagation();
    evt.nativeEvent.stopImmediatePropagation();
    this.handleFilterClear(propertyKey, []);
  };

  handleBoolFilterClear = (
    propertyKey: keyof State,
    evt: React.MouseEvent
  ): void => {
    evt.stopPropagation();
    evt.nativeEvent.stopImmediatePropagation();
    this.handleFilterClear(propertyKey, null);
  };

  handleFiltersClear = (): void => {
    const inventory = this.getInventory(this.props);
    this.setState(
      {
        filteredInventory: inventory,
        filterQuery: "",
        filterTypes: [],
        filterRarities: [],
        filterTags: [],
        filterRanged: null,
      },
      this.handleDataUpdate
    );
  };

  handleQueryUpdate = (evt: React.ChangeEvent<HTMLInputElement>): void => {
    let value = evt.target.value;
    this.setState((prevState: State) => {
      let inventory = this.filterItems(
        this.props,
        {
          ...this.getFilters(prevState),
          filterQuery: value,
        },
        this.getInventory(this.props)
      );
      let partyInventory = this.filterItems(
        this.props,
        {
          ...this.getFilters(prevState),
          filterQuery: value,
        },
        this.getPartyInventory(this.props)
      );
      return {
        filterQuery: value,
        filteredInventory: inventory,
        filteredPartyInventory: partyInventory,
      };
    }, this.handleDataUpdate);
  };

  handleFilterAdvancedToggle = (): void => {
    this.setState(
      (prevState: State) => ({
        showAdvancedFilters: !prevState.showAdvancedFilters,
      }),
      this.handleDataUpdate
    );
  };

  //TODO get array key by filtering for array type
  handleFilterArrayToggle = (
    arrayKey: string,
    value: string | number
  ): void => {
    this.setState((prevState: State) => {
      let includesItem: boolean = prevState[arrayKey].includes(value);
      let newFilterArray: Array<string> | Array<number> = [];
      if (includesItem) {
        newFilterArray = prevState[arrayKey].filter(
          (filterTag) => filterTag !== value
        );
      } else {
        newFilterArray = [...prevState[arrayKey], value];
      }
      let inventory = this.filterItems(
        this.props,
        {
          ...this.getFilters(prevState),
          [arrayKey]: newFilterArray,
        },
        this.getInventory(this.props)
      );
      let partyInventory = this.filterItems(
        this.props,
        {
          ...this.getFilters(prevState),
          [arrayKey]: newFilterArray,
        },
        this.getPartyInventory(this.props)
      );
      return {
        ...prevState,
        [arrayKey]: newFilterArray,
        filteredInventory: inventory,
        filteredPartyInventory: partyInventory,
      };
    }, this.handleDataUpdate);
  };

  handleExclusiveCheckboxFilterChange = (
    propertyKey: keyof State,
    value: boolean | null
  ): void => {
    this.setState((prevState: State) => {
      let inventory = this.filterItems(
        this.props,
        {
          ...this.getFilters(prevState),
          [propertyKey]: value,
        },
        this.getInventory(this.props)
      );
      let partyInventory = this.filterItems(
        this.props,
        {
          ...this.getFilters(prevState),
          [propertyKey]: value,
        },
        this.getPartyInventory(this.props)
      );
      return {
        ...prevState,
        [propertyKey]: value,
        filteredInventory: inventory,
        filteredPartyInventory: partyInventory,
      };
    }, this.handleDataUpdate);
  };

  renderAdvancedFilters = (): React.ReactNode => {
    const { filterTags, filterRarities, filterTypes, filterRanged } =
      this.state;

    const inventory = this.getInventory(this.props);

    let uniqueTags = new Set<string>();
    let uniqueRarities = new Set<string>();
    let uniqueTypes = new Set<number>();
    for (let i = 0; i < inventory.length; i++) {
      let item = inventory[i];

      let tags = ItemUtils.getTags(item);
      for (let j = 0; j < tags.length; j++) {
        uniqueTags.add(tags[j]);
      }

      let rarity = ItemUtils.getRarity(item);
      if (rarity !== null) {
        uniqueRarities.add(rarity);
      }

      uniqueTypes.add(ItemUtils.getBaseTypeId(item));
    }

    return (
      <div className="ct-inventory-filter__adv-filters">
        <InventoryFilterArrayFilter
          onUpdate={this.handleFilterArrayToggle}
          label="Item Type"
          propertyKey="filterTypes"
          currentValues={filterTypes}
          availableOptions={this.getTypeOptions(Array.from(uniqueTypes))}
        />
        <InventoryFilterArrayFilter
          onUpdate={this.handleFilterArrayToggle}
          label="Tags"
          propertyKey="filterTags"
          currentValues={filterTags}
          availableOptions={this.getTagOptions(Array.from(uniqueTags))}
        />
        <InventoryFilterArrayFilter
          onUpdate={this.handleFilterArrayToggle}
          label="Rarity"
          propertyKey="filterRarities"
          currentValues={filterRarities}
          availableOptions={this.getRarityOptions(Array.from(uniqueRarities))}
        />
        <InventoryFilterExclusiveCheckboxFilter
          label="Attack Type"
          onUpdate={this.handleExclusiveCheckboxFilterChange}
          propertyKey="filterRanged"
          value={filterRanged}
          trueLabel="Ranged"
          falseLabel="Melee"
        />
      </div>
    );
  };

  renderFilterBarActiveArray = (
    label: string,
    options: Array<HtmlSelectOption>,
    propertyKey: keyof State
  ): React.ReactNode => {
    return (
      <div
        className="ct-inventory-filter__active"
        onClick={this.handleFilterAdvancedToggle}
      >
        <div className="ct-inventory-filter__active-label">{label}:</div>
        <div className="ct-inventory-filter__active-value">
          {options.map((option) => option.label).join(" or ")}
        </div>
        <div className="ct-inventory-filter__active-remove">
          <div
            className="ct-inventory-filter__active-remove-icon"
            onClick={this.handleArrayFilterClear.bind(this, propertyKey)}
          />
        </div>
      </div>
    );
  };

  renderFilterBarActiveExclusiveCheckbox = (
    label: string,
    value: boolean,
    propertyKey: keyof State,
    trueLabel: string = "Yes",
    falseLabel: string = "No"
  ) => {
    return (
      <div
        className="ct-inventory-filter__active"
        onClick={this.handleFilterAdvancedToggle}
      >
        <div className="ct-inventory-filter__active-label">{label}:</div>
        <div className="ct-inventory-filter__active-value">
          {value ? trueLabel : falseLabel}
        </div>
        <div className="ct-inventory-filter__active-remove">
          <div
            className="ct-inventory-filter__active-remove-icon"
            onClick={this.handleBoolFilterClear.bind(this, propertyKey)}
          />
        </div>
      </div>
    );
  };

  renderFilterBarActives = (): React.ReactNode => {
    const { filterTags, filterRarities, filterTypes, filterRanged } =
      this.state;

    let activeNodes: Array<{ key: string; node: React.ReactNode }> = [];

    if (filterTypes.length) {
      activeNodes.push({
        key: "filterTypes",
        node: this.renderFilterBarActiveArray(
          filterTypes.length === 1 ? "Type" : "Types",
          this.getTypeOptions(filterTypes),
          "filterTypes"
        ),
      });
    }
    if (filterTags.length) {
      activeNodes.push({
        key: "filterTags",
        node: this.renderFilterBarActiveArray(
          filterTags.length === 1 ? "Tag" : "Tags",
          this.getTagOptions(filterTags),
          "filterTags"
        ),
      });
    }
    if (filterRarities.length) {
      activeNodes.push({
        key: "filterRarities",
        node: this.renderFilterBarActiveArray(
          "Rarity",
          this.getRarityOptions(filterRarities),
          "filterRarities"
        ),
      });
    }
    if (filterRanged !== null) {
      activeNodes.push({
        key: "filterRanged",
        node: this.renderFilterBarActiveExclusiveCheckbox(
          "Attack Type",
          filterRanged,
          "filterRanged",
          "Ranged",
          "Melee"
        ),
      });
    }

    if (!activeNodes.length) {
      return null;
    }

    return (
      <div className="ct-inventory-filter__actives">
        {activeNodes.map((activeNode) => (
          <React.Fragment key={activeNode.key}>
            {activeNode.node}
          </React.Fragment>
        ))}
      </div>
    );
  };

  render() {
    const { filterQuery, showAdvancedFilters } = this.state;
    const { callout, theme } = this.props;

    const filterCount = this.getFilterCount();
    const hasFilter = this.isFiltering();

    let advancedClassNames: Array<string> = ["ct-inventory-filter__advanced"];
    let FilterIcon: React.ComponentType<any> = theme.isDarkMode
      ? LightFilterSvg
      : DarkFilterSvg;
    if (filterCount > 0) {
      advancedClassNames.push("ct-inventory-filter__advanced--active");
      FilterIcon = ThemedFilterSvg;
    }

    let classNames: Array<string> = ["ct-inventory-filter"];
    if (showAdvancedFilters) {
      classNames.push("ct-inventory-filter--show-advanced");
    }
    if (hasFilter) {
      classNames.push("ct-inventory-filter--has-filter");
    }

    return (
      <div className={classNames.join(" ")}>
        <div className="ct-inventory-filter__interactions">
          <div className="ct-inventory-filter__box">
            {this.renderFilterBarActives()}
            <div className="ct-inventory-filter__primary">
              <div className="ct-inventory-filter__primary-group ct-inventory-filter__primary-group--first">
                <div className="ct-inventory-filter__icon" />
              </div>
              <div className="ct-inventory-filter__field">
                <input
                  className="ct-inventory-filter__input"
                  type="search"
                  placeholder="Search Item Names, Types, Rarities, or Tags"
                  value={filterQuery}
                  onChange={this.handleQueryUpdate}
                />
              </div>
              {hasFilter && (
                <div
                  className="ct-inventory-filter__clear"
                  onClick={this.handleFiltersClear}
                >
                  Clear X
                </div>
              )}
            </div>
          </div>
          <div
            className={advancedClassNames.join(" ")}
            onClick={this.handleFilterAdvancedToggle}
          >
            <FilterIcon theme={theme} />
            {filterCount > 0 && (
              <span className="ct-inventory-filter__advanced-callout">
                {filterCount}
              </span>
            )}
          </div>
          {callout && (
            <div className="ct-inventory-filter__callout">{callout}</div>
          )}
        </div>
        {showAdvancedFilters && this.renderAdvancedFilters()}
      </div>
    );
  }
}
