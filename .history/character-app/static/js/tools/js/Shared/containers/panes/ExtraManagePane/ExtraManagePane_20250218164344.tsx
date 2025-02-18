//TODO: REI need to convert DB constants to enum
import axios, { Canceler } from "axios";
import { orderBy } from "lodash";
import React, { useContext } from "react";
import { connect, DispatchProp } from "react-redux";
import { v4 as uuidv4 } from "uuid";

import {
  Checkbox,
  Collapsible,
  LoadingPlaceholder,
  Select,
} from "../../character-components/es";
import {
  CharacterTheme,
  Constants,
  Creature,
  CreatureGroupRulesLookup,
  CreatureRule,
  CreatureUtils,
  ExtraManager,
  ExtrasManager,
  HelperUtils,
  MonsterDefinitionContract,
  RuleData,
  rulesEngineSelectors,
  SnippetData,
  VehicleManager,
} from "../../character-rules-engine/es";

import { HtmlContent } from "~/components/HtmlContent";
import { Reference } from "~/components/Reference";
import { useExtras } from "~/hooks/useExtras";
import { CreatureBlock } from "~/subApps/sheet/components/CreatureBlock";
import { Header } from "~/subApps/sheet/components/Sidebar/components/Header";

import VehicleBlock from "../../../components/VehicleBlock";
import { ThemeButton } from "../../../components/common/Button";
import { ExtrasManagerContext } from "../../../managers/ExtrasManagerContext";
import * as appEnvSelectors from "../../../selectors/appEnv";
import { SharedAppState } from "../../../stores/typings";
import {
  AppLoggerUtils,
  AppNotificationUtils,
  ComponentUtils,
  FilterUtils,
  GD_VehicleBlockProps,
} from "../../../utils";
import ExtraManagePaneAddListing from "./ExtraManagePaneAddListing";
import ExtraManagePaneCurrentListing from "./ExtraManagePaneCurrentListing";

//TODO: this comes from ExtrasManager types
interface ShoppeState {
  creatureDefinitions: Array<MonsterDefinitionContract>;
  creatureDefinitionLookup: Record<number, MonsterDefinitionContract>;
  creatures: Array<ExtraManager>;
  vehicles: Array<ExtraManager>;
}

interface CollapsibleComponentProps {
  metaItems: Array<React.ReactNode>;
  heading: string | null;
}
interface CreatureBlockProps {
  variant: "default" | "basic";
  creature: Creature;
  ruleData: RuleData;
  className: string;
}
export interface PagedListingProps {
  key: number | string;
  extra: ExtraManager;
  onAdd: (extra: ExtraManager, quantity: number) => void;
  collapsibleComponentProps: CollapsibleComponentProps;
  ContentComponent: React.ComponentType<any>;
  contentComponentProps: GD_VehicleBlockProps | CreatureBlockProps;
  showQuantity?: boolean;
}

enum DataRetrievalStatusEnum {
  NONE = "NONE",
  LOADING = "LOADING",
  LOADED = "LOADED",
}

interface Props extends DispatchProp {
  ruleData: RuleData;
  pageSize: number;
  creatureGroupRulesLookup: CreatureGroupRulesLookup;
  isReadonly: boolean;
  snippetData: SnippetData;
  theme: CharacterTheme;
  extras: Array<ExtraManager>;
  extrasManager: ExtrasManager;
}
interface State {
  selectedGroup: number | null;
  dataStatus: DataRetrievalStatusEnum;
  currentPage: number;
  filterQuery: string;
  filterRules: boolean;
  filterChallengeMin: number | null;
  filterChallengeMax: number | null;
  isCurrentExtrasCollapsed: boolean;

  extrasShoppe: ShoppeState;
}
class ExtraManagePane extends React.PureComponent<Props, State> {
  static defaultProps = {
    pageSize: 20,
  };

  loadMonstersCanceler: null | Canceler = null;
  loadVehiclesCanceler: null | Canceler = null;

  constructor(props: Props) {
    super(props);

    this.state = {
      selectedGroup: null,
      dataStatus: DataRetrievalStatusEnum.NONE,
      currentPage: 0,
      filterQuery: "",
      filterRules: true,
      filterChallengeMin: null,
      filterChallengeMax: null,
      isCurrentExtrasCollapsed: false,

      extrasShoppe: {
        creatureDefinitions: [],
        creatureDefinitionLookup: {},
        creatures: [],
        vehicles: [],
      },
    };
  }

  // componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>): void {
  //     const { definitionPool } = this.props;

  //     if (definitionPool !== prevProps.definitionPool) {
  //         //TODO: maybe need to handle this with the Shoppe
  //         // this.setState(this.generateVehicleStateData(this.props));
  //     }
  // }

  componentDidMount() {
    const { extrasManager } = this.props;

    if (extrasManager) {
      this.setState({
        dataStatus: DataRetrievalStatusEnum.LOADING,
      });
      extrasManager
        .getExtrasShoppe({
          groupId: null,
          onSuccess: (shoppeState: ShoppeState) => {
            this.setState({
              dataStatus: DataRetrievalStatusEnum.LOADED,
              extrasShoppe: shoppeState,
            });
          },
          additionalConfig: {
            cancelToken: new axios.CancelToken((c) => {
              this.loadMonstersCanceler = c;
            }),
          },
        })
        .then((response) => {
          this.loadMonstersCanceler = null;
          return response;
        })
        .catch(AppLoggerUtils.handleAdhocApiError);
    } else {
      this.setState({
        dataStatus: DataRetrievalStatusEnum.LOADED,
      });
    }
  }

  componentWillUnmount(): void {
    //TODO do these cancelers even work?
    if (this.loadMonstersCanceler !== null) {
      this.loadMonstersCanceler();
    }
    if (this.loadVehiclesCanceler !== null) {
      this.loadVehiclesCanceler();
    }
  }

  getLastPageIdx = <T extends any>(filteredItems: Array<T>): number => {
    const { pageSize } = this.props;

    return Math.ceil(filteredItems.length / pageSize) - 1;
  };

  getFilteredCreatures = (): Array<ExtraManager> => {
    const { extrasManager } = this.props;
    const {
      filterRules,
      filterQuery,
      filterChallengeMin,
      filterChallengeMax,
      selectedGroup,
      extrasShoppe,
    } = this.state;

    const { creatures, creatureDefinitionLookup } = extrasShoppe;

    let creatureToFilter: Array<ExtraManager> = filterRules
      ? extrasManager.getCreaturesFilteredByRules(
          creatures,
          creatureDefinitionLookup,
          selectedGroup
        )
      : creatures;
    let filteredCreatures = creatureToFilter.filter((extra) => {
      if (
        filterQuery !== "" &&
        !FilterUtils.doesQueryMatchData(
          filterQuery,
          extra.getName(),
          extra.getSearchTags()
        )
      ) {
        return false;
      }
      const creature = extra.simulateExtraData(
        selectedGroup,
        creatureDefinitionLookup
      ) as Creature;
      let challengeInfo = CreatureUtils.getChallengeInfo(creature);
      const hideCr = CreatureUtils.getHideCr(creature);
      // Treat hide Challenge Rating like a 0 for challenge rating values
      if (hideCr) {
        if (filterChallengeMin !== null && 0 < filterChallengeMin) {
          return false;
        }
        if (filterChallengeMax !== null && 0 > filterChallengeMax) {
          return false;
        }
      } else {
        if (
          filterChallengeMin !== null &&
          challengeInfo &&
          challengeInfo.value < filterChallengeMin
        ) {
          return false;
        }
        if (
          filterChallengeMax !== null &&
          challengeInfo &&
          challengeInfo.value > filterChallengeMax
        ) {
          return false;
        }
      }

      return true;
    });

    return orderBy(filteredCreatures, (extra) => extra.getName());
  };

  getCreateNames = (name: string, quantity: number): Array<string | null> => {
    let names: Array<string | null> = [];
    if (quantity > 1) {
      for (let i = 1; i <= quantity; i++) {
        names.push(`${name} ${i}`);
      }
    } else {
      names.push(null);
    }
    return names;
  };

  isFiltered = (): boolean => {
    const { filterQuery, filterRules } = this.state;

    if (filterRules) {
      return true;
    }

    if (filterQuery) {
      return true;
    }

    return false;
  };

  handlePageMore = (): void => {
    this.setState((prevState) => ({
      currentPage: prevState.currentPage + 1,
    }));
  };

  handleQueryChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const query = evt.target.value;

    this.setState({
      filterQuery: query,
      currentPage: 0,
    });
  };

  handleChallengeMinChange = (value: string): void => {
    this.setState({
      filterChallengeMin: HelperUtils.parseInputFloat(value),
    });
  };

  handleChallengeMaxChange = (value: string): void => {
    this.setState({
      filterChallengeMax: HelperUtils.parseInputFloat(value),
    });
  };

  handleRawToggle = (): void => {
    this.setState((prevState) => ({
      filterRules: !prevState.filterRules,
      currentPage: 0,
    }));
  };

  handleSelectedGroupChange = (value: string): void => {
    const { extrasManager } = this.props;
    const { extrasShoppe } = this.state;

    let selectedGroup = HelperUtils.parseInputInt(value, null);

    extrasManager.updateExtrasShoppe({
      currentShoppe: extrasShoppe,
      groupId: selectedGroup,
      onSuccess: (shoppeState: ShoppeState) => {
        this.setState((prevState) => {
          let filterChallengeMin = prevState.filterChallengeMin;
          let filterChallengeMax = prevState.filterChallengeMax;
          if (
            selectedGroup !== null &&
            extrasManager.hack__isSidekickGroup(selectedGroup)
          ) {
            filterChallengeMin = null;
            filterChallengeMax = null;
          }

          return {
            selectedGroup,
            isCurrentExtrasCollapsed: true,
            filterChallengeMax,
            filterChallengeMin,
            extrasShoppe: shoppeState,
          };
        });
      },
    });
  };

  handleCreateExtra = (extra: ExtraManager, quantity: number): void => {
    const { selectedGroup } = this.state;

    extra.handleAdd(
      { quantity, selectedGroup },
      AppNotificationUtils.handleExtraCreateAccepted.bind(this, extra.extra)
    );
  };

  handleRemoveExtra = (extra: ExtraManager): void => {
    extra.handleRemove();
  };

  handleCurrentExtrasVisibilityChange = (isCollapsed: boolean): void => {
    this.setState({
      isCurrentExtrasCollapsed: isCollapsed,
    });
  };

  renderFilterUi = (): React.ReactNode => {
    const {
      filterQuery,
      filterChallengeMin,
      filterChallengeMax,
      selectedGroup,
    } = this.state;
    const { extrasManager } = this.props;

    let challengeOptions = extrasManager.getChallengeOptions();
    let isSidekickGroup =
      selectedGroup !== null &&
      extrasManager.hack__isSidekickGroup(selectedGroup);

    return (
      <div className="ct-extra-manage-pane__filters">
        <div className="ct-extra-manage-pane__filter">
          <div className="ct-extra-manage-pane__filter-heading">Filter</div>
          <input
            type="search"
            className="ct-filter__query"
            value={filterQuery}
            onChange={this.handleQueryChange}
            placeholder="Name, Type, Subtype, Habitat, Tag, etc."
            spellCheck={false}
            autoComplete="off"
          />
        </div>
        {!isSidekickGroup && (
          <div className="ct-extra-manage-pane__filters-challenge">
            <div className="ct-extra-manage-pane__filters-challenge-heading">
              Challenge Range
            </div>
            <div className="ct-extra-manage-pane__filters-challenge-fields">
              <div className="ct-extra-manage-pane__filters-challenge-field">
                <Select
                  value={filterChallengeMin}
                  options={challengeOptions}
                  onChange={this.handleChallengeMinChange}
                  placeholder="--"
                />
              </div>
              <div className="ct-extra-manage-pane__filters-challenge-sep">
                --
              </div>
              <div className="ct-extra-manage-pane__filters-challenge-field">
                <Select
                  value={filterChallengeMax}
                  options={challengeOptions}
                  onChange={this.handleChallengeMaxChange}
                  placeholder="--"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  renderPagedListing = <T extends ExtraManager>(
    extras: Array<T>,
    listingComponentPropMappingFunc: (extra: T) => PagedListingProps
  ): React.ReactNode => {
    const { currentPage } = this.state;
    const { pageSize, isReadonly } = this.props;

    const pagedExtras = extras.slice(0, (currentPage + 1) * pageSize);

    return (
      <div className="ct-extra-manage-pane__listing">
        {pagedExtras.map((extra) => (
          <ExtraManagePaneAddListing
            {...listingComponentPropMappingFunc(extra)}
            isReadonly={isReadonly}
          />
        ))}
      </div>
    );
  };

  renderCreatures = (): React.ReactNode => {
    const { ruleData, theme, extrasManager } = this.props;
    const { extrasShoppe, selectedGroup } = this.state;
    const { creatureDefinitionLookup } = extrasShoppe;

    let filteredCreatures = this.getFilteredCreatures();

    return (
      <div className="ct-extra-manage-pane__extras">
        {this.renderFilterUi()}
        {this.renderPagedListing(filteredCreatures, (extraManager) => {
          const creature = extraManager.simulateExtraData(
            selectedGroup,
            creatureDefinitionLookup
          ) as Creature;
          const sourceNames = extraManager.getSourceNames();
          const References = extraManager.isHomebrew()
            ? [<Reference isDarkMode={theme.isDarkMode} name="Homebrew" />]
            : sourceNames.map((source) => (
                <Reference
                  name={source}
                  isDarkMode={theme.isDarkMode}
                  key={uuidv4()}
                />
              ));
          return {
            key: extraManager.getId(),
            extra: extraManager,
            onAdd: this.handleCreateExtra,
            collapsibleComponentProps: {
              metaItems: [
                ...extrasManager.generateCreatureMeta(creature),
                ...References,
              ],
              heading: extraManager.getName(),
            },
            ContentComponent: CreatureBlock,
            contentComponentProps: {
              variant: "basic",
              creature,
              ruleData: ruleData,
              className: "ddbc-creature-block",
            },
          };
        })}
        {this.renderPager(filteredCreatures)}
      </div>
    );
  };

  renderVehicles = (): React.ReactNode => {
    const { theme } = this.props;
    const { selectedGroup, extrasShoppe } = this.state;
    const { vehicles } = extrasShoppe;

    let orderedVehicles = orderBy(vehicles, (vehicle) => vehicle.getName());

    return (
      <div className="ct-extra-manage-pane__extras">
        {this.renderPagedListing(orderedVehicles, (vehicleExtra) => {
          const vehicle = vehicleExtra.simulateExtraData(
            selectedGroup
          ) as VehicleManager;
          const sourceNames = vehicleExtra.getSourceNames();
          const References = vehicleExtra.isHomebrew()
            ? [<Reference isDarkMode={theme.isDarkMode} name="Homebrew" />]
            : sourceNames.map((source) => (
                <Reference name={source} isDarkMode={theme.isDarkMode} />
              ));
          return {
            key: vehicleExtra.getId(),
            extra: vehicleExtra,
            onAdd: this.handleCreateExtra,
            collapsibleComponentProps: {
              metaItems: [...vehicle.generateVehicleMeta(), ...References],
              heading: vehicleExtra.getName(),
            },
            ContentComponent: VehicleBlock,
            contentComponentProps:
              ComponentUtils.generateVehicleBlockProps(vehicle),
            showQuantity: false,
          };
        })}
        {this.renderPager(vehicles)}
      </div>
    );
  };

  renderGroupSelector = (): React.ReactNode => {
    const { selectedGroup, filterRules, dataStatus } = this.state;
    const { creatureGroupRulesLookup, extrasManager } = this.props;

    const selectedGroupInfo = extrasManager.getCreatureGroupInfo(selectedGroup);

    let groupRules: Array<CreatureRule> | null =
      selectedGroup === null
        ? null
        : HelperUtils.lookupDataOrFallback(
            creatureGroupRulesLookup,
            selectedGroup
          );
    let isSidekickGroup: boolean =
      selectedGroup !== null &&
      extrasManager.hack__isSidekickGroup(selectedGroup);

    let hasGroupRules: boolean = !!groupRules || isSidekickGroup;
    let showNotDefaultNoRules: boolean =
      selectedGroupInfo !== null &&
      !selectedGroupInfo.enabledByDefault &&
      !hasGroupRules;

    return (
      <div className="ct-extra-manage-pane__selected-group">
        <div className="ct-extra-manage-pane__selected-group-chooser">
          <Select
            options={extrasManager.getGroupOptions()}
            value={selectedGroup}
            onChange={this.handleSelectedGroupChange}
            placeholder="-- Choose a Category --"
            disabled={dataStatus === DataRetrievalStatusEnum.LOADING}
          />
        </div>
        {selectedGroup && (
          <div className="ct-extra-manage-pane__selected-group-content">
            {selectedGroupInfo && selectedGroupInfo.description && (
              <HtmlContent
                className="ct-extra-manage-pane__selected-group-description"
                html={selectedGroupInfo.description}
                withoutTooltips
              />
            )}
            {showNotDefaultNoRules && (
              <div className="ct-extra-manage-pane__selected-group-warning">
                Adding a creature of this category will be outside of normal
                game rules.
              </div>
            )}
            {selectedGroupInfo && hasGroupRules && (
              <div className="ct-extra-manage-pane__selected-group-rules">
                <Checkbox
                  initiallyEnabled={filterRules}
                  onChange={this.handleRawToggle}
                  label={`Filter Using ${selectedGroupInfo.name} Rules`}
                />
              </div>
            )}
          </div>
        )}
      </div>
    );
    //`
  };

  renderManager = (): React.ReactNode => {
    const { dataStatus, selectedGroup } = this.state;

    if (dataStatus !== DataRetrievalStatusEnum.LOADED) {
      return <LoadingPlaceholder />;
    }

    let extrasNode: React.ReactNode;
    if (selectedGroup !== null) {
      if (selectedGroup === Constants.HACK_VEHICLE_GROUP_ID) {
        extrasNode = this.renderVehicles();
      } else {
        extrasNode = this.renderCreatures();
      }
    }

    return (
      <div className="ct-extra-manage-pane__manager">
        {this.renderGroupSelector()}
        {extrasNode}
      </div>
    );
  };

  renderPager = <T extends any>(filteredItems: Array<T>): React.ReactNode => {
    const { currentPage } = this.state;
    const lastPageIdx = this.getLastPageIdx(filteredItems);

    if (lastPageIdx < 1 || currentPage >= lastPageIdx) {
      return null;
    }

    return (
      <div className="ct-extra-manage-pane__pager">
        <ThemeButton block={true} onClick={this.handlePageMore}>
          Load More
        </ThemeButton>
      </div>
    );
  };

  renderCurrentExtras = (
    extras: Array<ExtraManager>,
    heading: string | null,
    groupId: number | Constants.ExtraGroupTypeEnum
  ): React.ReactNode => {
    const { ruleData, theme } = this.props;

    if (!extras.length) {
      return null;
    }

    let orderedExtras = orderBy(extras, (extra) => extra.getName());

    return (
      <div className="ct-extra-manage-pane__group" key={groupId}>
        <div className="ct-extra-manage-pane__group-heading">{heading}</div>
        <div className="ct-extra-manage-pane__group-items">
          {orderedExtras.map((extra) => (
            <ExtraManagePaneCurrentListing
              theme={theme}
              key={extra.getUniqueKey()}
              extra={extra}
              ruleData={ruleData}
              onRemove={this.handleRemoveExtra}
            />
          ))}
        </div>
      </div>
    );
  };

  renderCharacterExtras = (): React.ReactNode => {
    const { extrasManager, extras } = this.props;

    if (!extras.length) {
      return (
        <div className="ct-extra-manage-pane__default">
          Extras that you add will display here.
        </div>
      );
    }

    const groups = extrasManager.getExtrasGroups();
    const orderedCreatureGroupInfos = extrasManager.getGroupInfosForExtras();

    return (
      <div className="ct-extra-manage-pane__inventory">
        {orderedCreatureGroupInfos.map((groupInfo) =>
          this.renderCurrentExtras(
            groups[groupInfo.id],
            groupInfo.name,
            groupInfo.id
          )
        )}
      </div>
    );
  };

  render() {
    const { isCurrentExtrasCollapsed } = this.state;

    return (
      <div className="ct-extra-manage-pane">
        <Header>Manage Extras</Header>
        <Collapsible header="Add an Extra" initiallyCollapsed={false}>
          {this.renderManager()}
        </Collapsible>
        <Collapsible
          header="Current Extras"
          collapsed={isCurrentExtrasCollapsed}
          onChangeHandler={this.handleCurrentExtrasVisibilityChange}
        >
          {this.renderCharacterExtras()}
        </Collapsible>
      </div>
    );
  }
}

function mapStateToProps(state: SharedAppState) {
  return {
    ruleData: rulesEngineSelectors.getRuleData(state),
    creatureGroupRulesLookup:
      rulesEngineSelectors.getCreatureGroupRulesLookup(state),
    isReadonly: appEnvSelectors.getIsReadonly(state),
    snippetData: rulesEngineSelectors.getSnippetData(state),
    theme: rulesEngineSelectors.getCharacterTheme(state),
  };
}

function ExtraManagePaneContainer(props) {
  const { extrasManager } = useContext(ExtrasManagerContext);

  const extras = useExtras();

  return (
    <ExtraManagePane extrasManager={extrasManager} extras={extras} {...props} />
  );
}

export default connect(mapStateToProps)(ExtraManagePaneContainer);
