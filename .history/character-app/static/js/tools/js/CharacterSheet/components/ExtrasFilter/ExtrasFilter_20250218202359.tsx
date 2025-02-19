import { orderBy, intersection } from "lodash";
import React from "react";

import {
  DarkFilterSvg,
  ThemedFilterSvg,
  LightFilterSvg,
} from "@dndbeyond/character-components/es";
import {
  CharacterTheme,
  ExtraManager,
  ExtrasFilterData,
  HtmlSelectOption,
} from "@dndbeyond/character-rules-engine/es";

import { FilterUtils } from "../../../Shared/utils";
import ExtrasFilterArrayFilter from "./ExtrasFilterArrayFilter";

interface Props {
  extras: Array<ExtraManager>;
  callout?: React.ReactNode;
  onDataUpdate: (filterData: ExtrasFilterData) => void;
  theme: CharacterTheme;
}
interface DefaultExtrasFilterState {
  filterQuery: string;
  filterTypes: Array<string>;
  filterSubTypes: Array<string>;
  filterEnvironments: Array<string>;
  filterTags: Array<string>;
  filterMovements: Array<string>;
}
interface State extends DefaultExtrasFilterState {
  filteredExtras: Array<ExtraManager>;
  showAdvancedFilters: boolean;
}

type ExtraFilterPropertyKey = keyof State;

export default class ExtrasFilter extends React.PureComponent<Props, State> {
  defaultFilterState: DefaultExtrasFilterState = {
    filterQuery: "",
    filterTypes: [],
    filterSubTypes: [],
    filterEnvironments: [],
    filterTags: [],
    filterMovements: [],
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      ...this.defaultFilterState,
      filteredExtras: props.extras,
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
    const { extras } = this.props;

    if (extras !== prevProps.extras) {
      this.setState(
        {
          filteredExtras: this.filterExtras(
            this.props,
            this.getFilters(prevState)
          ),
        },
        this.handleDataUpdate
      );
    }
  }

  getFilters = (state: State): DefaultExtrasFilterState => {
    const {
      filterQuery,
      filterTypes,
      filterSubTypes,
      filterEnvironments,
      filterTags,
      filterMovements,
    } = state;
    return {
      filterQuery,
      filterTypes,
      filterSubTypes,
      filterEnvironments,
      filterTags,
      filterMovements,
    };
  };

  filterExtras = (
    props: Props,
    filters: DefaultExtrasFilterState
  ): Array<ExtraManager> => {
    const {
      filterQuery,
      filterTypes,
      filterSubTypes,
      filterEnvironments,
      filterTags,
      filterMovements,
    } = filters;

    return props.extras.filter((extra) => {
      if (
        filterQuery &&
        !FilterUtils.doesQueryMatchData(
          filterQuery,
          extra.getName(),
          extra.getSearchTags()
        )
      ) {
        return false;
      }

      if (
        filterTypes.length &&
        !intersection(filterTypes, extra.getFilterTypes()).length
      ) {
        return false;
      }

      if (
        filterEnvironments.length &&
        !intersection(filterEnvironments, extra.getEnvironmentNames()).length
      ) {
        return false;
      }

      if (
        filterTags.length &&
        !intersection(filterTags, extra.getTags()).length
      ) {
        return false;
      }

      if (
        filterMovements.length &&
        !intersection(filterMovements, extra.getMovementNames()).length
      ) {
        return false;
      }

      return true;
    });
  };

  getFilterCount = (): number => {
    const {
      filterTypes,
      filterSubTypes,
      filterEnvironments,
      filterTags,
      filterMovements,
    } = this.state;

    let count: number = 0;
    count += filterTags.length;
    count += filterTypes.length;
    count += filterSubTypes.length;
    count += filterEnvironments.length;
    count += filterMovements.length;
    return count;
  };

  getTagOptions = (tags: Array<string>): Array<HtmlSelectOption> => {
    return tags.sort().map((tag) => ({ label: tag, value: tag }));
  };

  getTypeOptions = (types: Array<string>): Array<HtmlSelectOption> => {
    return orderBy(
      types.map((type) => ({
        label: type,
        value: type,
      })),
      "label"
    );
  };

  getEnvironmentOptions = (
    environmentNames: Array<string>
  ): Array<HtmlSelectOption> => {
    return orderBy(
      environmentNames.map((name) => ({
        label: name,
        value: name,
      })),
      "label"
    );
  };

  getMovementOptions = (names: Array<string>): Array<HtmlSelectOption> => {
    return orderBy(
      names.map((name) => ({
        label: name,
        value: name,
      })),
      "label"
    );
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
    propertyKey: ExtraFilterPropertyKey,
    resetState: Array<string> | Array<number> | null
  ): void => {
    this.setState((prevState: State) => {
      let extras = this.filterExtras(this.props, {
        ...this.getFilters(prevState),
        [propertyKey]: resetState,
      });
      return {
        ...prevState,
        [propertyKey]: resetState,
        filteredExtras: extras,
      };
    }, this.handleDataUpdate);
  };

  handleArrayFilterClear = (
    propertyKey: ExtraFilterPropertyKey,
    evt: React.MouseEvent
  ): void => {
    evt.stopPropagation();
    evt.nativeEvent.stopImmediatePropagation();
    this.handleFilterClear(propertyKey, []);
  };

  handleBoolFilterClear = (
    propertyKey: ExtraFilterPropertyKey,
    evt: React.MouseEvent
  ): void => {
    evt.stopPropagation();
    evt.nativeEvent.stopImmediatePropagation();
    this.handleFilterClear(propertyKey, null);
  };

  handleFiltersClear = (): void => {
    const { extras } = this.props;
    this.setState(
      {
        ...this.defaultFilterState,
        filteredExtras: extras,
      },
      this.handleDataUpdate
    );
  };

  handleQueryUpdate = (evt: React.ChangeEvent<HTMLInputElement>): void => {
    let value = evt.target.value;
    this.setState((prevState: State) => {
      let extras = this.filterExtras(this.props, {
        ...this.getFilters(prevState),
        filterQuery: value,
      });
      return {
        filterQuery: value,
        filteredExtras: extras,
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
      let extras = this.filterExtras(this.props, {
        ...this.getFilters(prevState),
        [arrayKey]: newFilterArray,
      });
      return {
        ...prevState,
        [arrayKey]: newFilterArray,
        filteredExtras: extras,
      };
    }, this.handleDataUpdate);
  };

  handleExclusiveCheckboxFilterChange = (
    propertyKey: ExtraFilterPropertyKey,
    value: boolean | null
  ): void => {
    this.setState((prevState: State) => {
      let extras = this.filterExtras(this.props, {
        ...this.getFilters(prevState),
        [propertyKey]: value,
      });
      return {
        ...prevState,
        [propertyKey]: value,
        filteredExtras: extras,
      };
    }, this.handleDataUpdate);
  };

  renderAdvancedFilters = (): React.ReactNode => {
    const {
      filterTypes,
      filterSubTypes,
      filterEnvironments,
      filterTags,
      filterMovements,
    } = this.state;
    const { extras } = this.props;

    let uniqueTags: Set<string> = new Set();
    let uniqueTypes: Set<string> = new Set();
    let uniqueEnvironments: Set<string> = new Set();
    let uniqueMovements: Set<string> = new Set();
    for (let i = 0; i < extras.length; i++) {
      let extra = extras[i];

      extra.getFilterTypes().forEach((type) => uniqueTypes.add(type));

      let tags = extra.getTags();
      tags.forEach((tag) => uniqueTags.add(tag));

      // let environmentIds = extra.getEnvironments();
      let environmentNames = extra.getEnvironmentNames();
      environmentNames.forEach((name) => uniqueEnvironments.add(name));

      let movementNames = extra.getMovementNames();
      movementNames.forEach((name) => uniqueMovements.add(name));
    }

    return (
      <div className="ct-extras-filter__adv-filters">
        <ExtrasFilterArrayFilter
          onUpdate={this.handleFilterArrayToggle}
          label="Type"
          propertyKey="filterTypes"
          currentValues={filterTypes}
          availableOptions={this.getTypeOptions(Array.from(uniqueTypes))}
        />
        <ExtrasFilterArrayFilter
          onUpdate={this.handleFilterArrayToggle}
          label="Tags"
          propertyKey="filterTags"
          currentValues={filterTags}
          availableOptions={this.getTagOptions(Array.from(uniqueTags))}
        />
        <ExtrasFilterArrayFilter
          onUpdate={this.handleFilterArrayToggle}
          label="Environments"
          propertyKey="filterEnvironments"
          currentValues={filterEnvironments}
          availableOptions={this.getEnvironmentOptions(
            Array.from(uniqueEnvironments)
          )}
        />
        <ExtrasFilterArrayFilter
          onUpdate={this.handleFilterArrayToggle}
          label="Movements"
          propertyKey="filterMovements"
          currentValues={filterMovements}
          availableOptions={this.getMovementOptions(
            Array.from(uniqueMovements)
          )}
        />
      </div>
    );
  };

  renderFilterBarActiveArray = (
    label: string,
    options: Array<HtmlSelectOption>,
    propertyKey: ExtraFilterPropertyKey
  ): React.ReactNode => {
    return (
      <div
        className="ct-extras-filter__active"
        onClick={this.handleFilterAdvancedToggle}
      >
        <div className="ct-extras-filter__active-label">{label}:</div>
        <div className="ct-extras-filter__active-value">
          {options.map((option) => option.label).join(" or ")}
        </div>
        <div className="ct-extras-filter__active-remove">
          <div
            className="ct-extras-filter__active-remove-icon"
            onClick={this.handleArrayFilterClear.bind(this, propertyKey)}
          />
        </div>
      </div>
    );
  };

  renderFilterBarActiveExclusiveCheckbox = (
    label: string,
    value: boolean,
    propertyKey: ExtraFilterPropertyKey,
    trueLabel: string = "Yes",
    falseLabel: string = "No"
  ): React.ReactNode => {
    return (
      <div
        className="ct-extras-filter__active"
        onClick={this.handleFilterAdvancedToggle}
      >
        <div className="ct-extras-filter__active-label">{label}:</div>
        <div className="ct-extras-filter__active-value">
          {value ? trueLabel : falseLabel}
        </div>
        <div className="ct-extras-filter__active-remove">
          <div
            className="ct-extras-filter__active-remove-icon"
            onClick={this.handleBoolFilterClear.bind(this, propertyKey)}
          />
        </div>
      </div>
    );
  };

  renderFilterBarActives = (): React.ReactNode => {
    const {
      filterTypes,
      filterSubTypes,
      filterEnvironments,
      filterTags,
      filterMovements,
    } = this.state;

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
    if (filterEnvironments.length) {
      activeNodes.push({
        key: "filterEnvironments",
        node: this.renderFilterBarActiveArray(
          filterEnvironments.length === 1 ? "Habitat" : "Habitats",
          this.getEnvironmentOptions(filterEnvironments),
          "filterEnvironments"
        ),
      });
    }
    if (filterMovements.length) {
      activeNodes.push({
        key: "filterMovements",
        node: this.renderFilterBarActiveArray(
          filterMovements.length === 1 ? "Movement" : "Movements",
          this.getMovementOptions(filterMovements),
          "filterMovements"
        ),
      });
    }

    if (!activeNodes.length) {
      return null;
    }

    return (
      <div className="ct-extras-filter__actives">
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

    let advancedClassNames: Array<string> = ["ct-extras-filter__advanced"];
    let FilterIcon: React.ComponentType<any> = theme.isDarkMode
      ? LightFilterSvg
      : DarkFilterSvg;
    if (filterCount > 0) {
      advancedClassNames.push("ct-extras-filter__advanced--active");
      FilterIcon = ThemedFilterSvg;
    }

    let classNames: Array<string> = ["ct-extras-filter"];
    if (showAdvancedFilters) {
      classNames.push("ct-extras-filter--show-advanced");
    }
    if (hasFilter) {
      classNames.push("ct-extras-filter--has-filter");
    }

    return (
      <div className={classNames.join(" ")}>
        <div className="ct-extras-filter__interactions">
          <div className="ct-extras-filter__box">
            {this.renderFilterBarActives()}
            <div className="ct-extras-filter__primary">
              <div className="ct-extras-filter__primary-groupstcs-extras-filter__primary-group--first">
                <div className="ct-extras-filter__icon" />
              </div>
              <div className="ct-extras-filter__field">
                <input
                  className="ct-extras-filter__input"
                  type="search"
                  placeholder="Search Names, Types, or Tags"
                  value={filterQuery}
                  onChange={this.handleQueryUpdate}
                />
              </div>
              {hasFilter && (
                <div
                  className="ct-extras-filter__clear"
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
              <span className="ct-extras-filter__advanced-callout">
                {filterCount}
              </span>
            )}
          </div>
          {callout && (
            <div className="ct-extras-filter__callout">{callout}</div>
          )}
        </div>
        {showAdvancedFilters && this.renderAdvancedFilters()}
      </div>
    );
  }
}
