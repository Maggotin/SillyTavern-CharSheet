import { orderBy } from "lodash";
import React from "react";

import {
  DarkFilterSvg,
  ThemedFilterSvg,
  LightFilterSvg,
} from "@dndbeyond/character-components/es";
import {
  AbilityLookup,
  ActivationUtils,
  CharacterTheme,
  ConditionUtils,
  Constants,
  HtmlSelectOption,
  ModifierUtils,
  RuleData,
  RuleDataUtils,
  Spell,
  SpellCasterInfo,
  SpellUtils,
} from "@dndbeyond/character-rules-engine/es";

import { FilterUtils } from "../../../Shared/utils";
import SpellsFilterArrayFilter from "./SpellsFilterArrayFilter";
import SpellsFilterExclusiveCheckboxFilter from "./SpellsFilterExclusiveCheckboxFilter";

interface Props {
  levelSpells: Array<Array<Spell>>;
  callout?: React.ReactNode;
  spellCasterInfo: SpellCasterInfo;
  ruleData: RuleData;
  abilityLookup: AbilityLookup;
  onDataUpdate: (filterData: any) => void; //TODO type filterData
  theme: CharacterTheme;
}
interface DefaultSpellsFilterState {
  filterQuery: string;
  filterTags: Array<string>;
  filterActivations: Array<number>;
  filterSavingThrows: Array<number>;
  filterConditions: Array<number>;
  filterDamageTypes: Array<string>;
  filterRanged: boolean | null;
  filterRitual: boolean | null;
  filterConcentration: boolean | null;
}
interface State extends DefaultSpellsFilterState {
  filteredLevelSpells: Array<Array<Spell>>;
  showAdvancedFilters: boolean;
}
export default class SpellsFilter extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      filterQuery: "",
      filteredLevelSpells: props.levelSpells,
      filterTags: [],
      filterActivations: [],
      filterSavingThrows: [],
      filterConditions: [],
      filterDamageTypes: [],
      filterRanged: null,
      filterRitual: null,
      filterConcentration: null,
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
    const { levelSpells } = this.props;

    if (levelSpells !== prevProps.levelSpells) {
      this.setState(
        {
          filteredLevelSpells: this.filterSpells(
            this.props,
            this.getFilters(prevState)
          ),
        },
        this.handleDataUpdate
      );
    }
  }

  getFilters = (state: State): DefaultSpellsFilterState => {
    const {
      filterQuery,
      filterTags,
      filterActivations,
      filterConcentration,
      filterConditions,
      filterDamageTypes,
      filterRanged,
      filterRitual,
      filterSavingThrows,
    } = state;
    return {
      filterQuery,
      filterTags,
      filterActivations,
      filterConcentration,
      filterConditions,
      filterDamageTypes,
      filterRanged,
      filterRitual,
      filterSavingThrows,
    };
  };

  filterSpells = (
    props: Props,
    filters: DefaultSpellsFilterState
  ): Array<Array<Spell>> => {
    const {
      filterQuery,
      filterTags,
      filterActivations,
      filterConcentration,
      filterConditions,
      filterDamageTypes,
      filterRanged,
      filterRitual,
      filterSavingThrows,
    } = filters;
    const { levelSpells } = props;

    return levelSpells.map((spells, level) => {
      return spells.filter((spell) => {
        if (
          filterQuery &&
          !FilterUtils.doesQueryMatchData(
            filterQuery,
            SpellUtils.getName(spell)
          )
        ) {
          return false;
        }

        if (filterTags.length) {
          let matches: boolean = false;
          let tags = SpellUtils.getTags(spell);
          tags.forEach((tag) => {
            if (!matches && filterTags.includes(tag)) {
              matches = true;
            }
          });
          if (!matches) {
            return false;
          }
        }

        if (filterActivations.length) {
          let activation = SpellUtils.getActivation(spell);
          let activationType = ActivationUtils.getType(activation);
          if (
            activationType === null ||
            !filterActivations.includes(activationType)
          ) {
            return false;
          }
        }

        if (filterConditions.length) {
          let conditions = SpellUtils.getConditions(spell);
          let matches: boolean = false;
          conditions.forEach((condition) => {
            if (!matches && filterConditions.includes(condition.conditionId)) {
              matches = true;
            }
          });
          if (!matches) {
            return false;
          }
        }

        if (filterSavingThrows.length) {
          let saveDcAbility = SpellUtils.getSaveDcAbility(spell);
          if (
            saveDcAbility === null ||
            !filterSavingThrows.includes(saveDcAbility)
          ) {
            return false;
          }
        }

        if (filterDamageTypes.length) {
          let modifiers = SpellUtils.getModifiers(spell);
          let matches: boolean = false;
          modifiers.forEach((modifier) => {
            const friendlySubtypeName =
              ModifierUtils.getFriendlySubtypeName(modifier);
            if (
              friendlySubtypeName === null ||
              (!matches && filterDamageTypes.includes(friendlySubtypeName))
            ) {
              matches = true;
            }
          });
          if (!matches) {
            return false;
          }
        }

        if (filterConcentration === true) {
          if (!SpellUtils.getConcentration(spell)) {
            return false;
          }
        } else if (filterConcentration === false) {
          if (SpellUtils.getConcentration(spell)) {
            return false;
          }
        }

        if (filterRitual === true) {
          if (!SpellUtils.getRitual(spell)) {
            return false;
          }
        } else if (filterRitual === false) {
          if (SpellUtils.getRitual(spell)) {
            return false;
          }
        }

        if (filterRanged === true) {
          if (
            SpellUtils.getAttackType(spell) !==
            Constants.AttackTypeRangeEnum.RANGED
          ) {
            return false;
          }
        } else if (filterRanged === false) {
          if (
            SpellUtils.getAttackType(spell) !==
            Constants.AttackTypeRangeEnum.MELEE
          ) {
            return false;
          }
        }

        return true;
      });
    });
  };

  getFilterCount = (): number => {
    const {
      filterTags,
      filterActivations,
      filterConcentration,
      filterConditions,
      filterDamageTypes,
      filterRanged,
      filterRitual,
      filterSavingThrows,
    } = this.state;

    let count: number = 0;
    count += filterTags.length;
    count += filterActivations.length;
    count += filterSavingThrows.length;
    count += filterConditions.length;
    count += filterDamageTypes.length;
    count += filterConcentration === null ? 0 : 1;
    count += filterRanged === null ? 0 : 1;
    count += filterRitual === null ? 0 : 1;
    return count;
  };

  isFiltering = (): boolean => {
    const { filterQuery } = this.state;
    const filterCount = this.getFilterCount();
    return filterCount > 0 || !!filterQuery;
  };

  getTagOptions = (tags: Array<string>): Array<HtmlSelectOption> => {
    return tags.sort().map((tag) => ({ label: tag, value: tag }));
  };

  getSavingThrowOptions = (
    savingThrows: Array<number>
  ): Array<HtmlSelectOption> => {
    const { ruleData } = this.props;

    return savingThrows.sort().map((abilityId) => {
      let abilityName = RuleDataUtils.getAbilityShortName(abilityId, ruleData);
      return {
        label: abilityName ? abilityName.toUpperCase() : "None",
        value: abilityId,
      };
    });
  };

  getActivationTypeOptions = (
    activationTypes: Array<number>
  ): Array<HtmlSelectOption> => {
    const { ruleData } = this.props;

    return orderBy(
      activationTypes.map((type) => {
        let activationInfo = RuleDataUtils.getActivationTypeInfo(
          type,
          ruleData
        );
        return {
          label: activationInfo === null ? "" : activationInfo.name,
          value: type,
        };
      }),
      (option) => option.label
    );
  };

  getConditionOptions = (
    conditions: Array<number>
  ): Array<HtmlSelectOption> => {
    const { ruleData } = this.props;

    return orderBy(
      conditions.map((conditionId) => {
        let conditionInfo = RuleDataUtils.getCondition(conditionId, ruleData);
        return {
          label:
            conditionInfo === null ? "" : ConditionUtils.getName(conditionInfo),
          value: conditionId,
        };
      }),
      (option) => option.label
    );
  };

  getDamageTypeOptions = (
    damageTypes: Array<string>
  ): Array<HtmlSelectOption> => {
    return damageTypes.sort().map((damageType) => ({
      label: damageType,
      value: damageType,
    }));
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
    this.setState(
      (prevState) => ({
        ...prevState,
        [propertyKey]: resetState,
        filteredLevelSpells: this.filterSpells(this.props, {
          ...this.getFilters(prevState),
          [propertyKey]: resetState,
        }),
      }),
      this.handleDataUpdate
    );
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
    const { levelSpells } = this.props;

    this.setState(
      {
        filterQuery: "",
        filterTags: [],
        filterActivations: [],
        filterSavingThrows: [],
        filterConditions: [],
        filterDamageTypes: [],
        filterRanged: null,
        filterRitual: null,
        filterConcentration: null,
        filteredLevelSpells: levelSpells,
      },
      this.handleDataUpdate
    );
  };

  handleQueryUpdate = (evt: React.ChangeEvent<HTMLInputElement>): void => {
    let value = evt.target.value;
    this.setState(
      (prevState) => ({
        filterQuery: value,
        filteredLevelSpells: this.filterSpells(this.props, {
          ...this.getFilters(prevState),
          filterQuery: value,
        }),
      }),
      this.handleDataUpdate
    );
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
      return {
        ...prevState,
        [arrayKey]: newFilterArray,
        filteredLevelSpells: this.filterSpells(this.props, {
          ...this.getFilters(prevState),
          [arrayKey]: newFilterArray,
        }),
      };
    }, this.handleDataUpdate);
  };

  handleExclusiveCheckboxFilterChange = (
    propertyKey: keyof State,
    value: boolean | null
  ): void => {
    this.setState((prevState: State) => {
      return {
        ...prevState,
        [propertyKey]: value,
        filteredLevelSpells: this.filterSpells(this.props, {
          ...this.getFilters(prevState),
          [propertyKey]: value,
        }),
      };
    }, this.handleDataUpdate);
  };

  renderAdvancedFilters = (): React.ReactNode => {
    const {
      filterTags,
      filterActivations,
      filterConditions,
      filterDamageTypes,
      filterRanged,
      filterSavingThrows,
    } = this.state;
    const { levelSpells } = this.props;

    let uniqueTags = new Set<string>();
    let uniqueSavingThrows = new Set<number>();
    let uniqueActivationTypes = new Set<number>();
    let uniqueConditions = new Set<number>();
    let uniqueDamageTypes = new Set<string>();
    for (let level = 0; level < levelSpells.length; level++) {
      let spells = levelSpells[level];
      for (let i = 0; i < spells.length; i++) {
        let spell = spells[i];

        let tags = SpellUtils.getTags(spell);
        for (let j = 0; j < tags.length; j++) {
          uniqueTags.add(tags[j]);
        }

        let conditions = SpellUtils.getConditions(spell);
        for (let j = 0; j < conditions.length; j++) {
          uniqueConditions.add(conditions[j].conditionId);
        }

        let modifiers = SpellUtils.getModifiers(spell);
        for (let j = 0; j < modifiers.length; j++) {
          let modifier = modifiers[j];
          if (ModifierUtils.isDamageModifier(modifier)) {
            let damageType = ModifierUtils.getFriendlySubtypeName(modifiers[j]);
            if (damageType !== null) {
              uniqueDamageTypes.add(damageType);
            }
          }
        }

        const saveDcAbility = SpellUtils.getSaveDcAbility(spell);
        if (saveDcAbility !== null) {
          uniqueSavingThrows.add(saveDcAbility);
        }

        const activationType = SpellUtils.getActivationType(spell);
        if (activationType !== null) {
          uniqueActivationTypes.add(activationType);
        }
      }
    }

    return (
      <div className="ct-spells-filter__adv-filters">
        <SpellsFilterArrayFilter
          onUpdate={this.handleFilterArrayToggle}
          label="Tags"
          propertyKey="filterTags"
          currentValues={filterTags}
          availableOptions={this.getTagOptions(Array.from(uniqueTags))}
        />
        <SpellsFilterArrayFilter
          onUpdate={this.handleFilterArrayToggle}
          label="Conditions"
          propertyKey="filterConditions"
          currentValues={filterConditions}
          availableOptions={this.getConditionOptions(
            Array.from(uniqueConditions)
          )}
        />
        <SpellsFilterArrayFilter
          onUpdate={this.handleFilterArrayToggle}
          label="Casting Time"
          propertyKey="filterActivations"
          currentValues={filterActivations}
          availableOptions={this.getActivationTypeOptions(
            Array.from(uniqueActivationTypes)
          )}
        />
        <SpellsFilterArrayFilter
          onUpdate={this.handleFilterArrayToggle}
          label="Saving Throw"
          propertyKey="filterSavingThrows"
          currentValues={filterSavingThrows}
          availableOptions={this.getSavingThrowOptions(
            Array.from(uniqueSavingThrows)
          )}
        />
        <SpellsFilterArrayFilter
          onUpdate={this.handleFilterArrayToggle}
          label="Damage Types"
          propertyKey="filterDamageTypes"
          currentValues={filterDamageTypes}
          availableOptions={this.getDamageTypeOptions(
            Array.from(uniqueDamageTypes)
          )}
        />
        <SpellsFilterExclusiveCheckboxFilter
          label="Attack Type"
          onUpdate={this.handleExclusiveCheckboxFilterChange}
          propertyKey="filterRanged"
          value={filterRanged}
          trueLabel="Ranged"
          falseLabel="Melee"
        />
        {/*<SpellsFilterExclusiveCheckboxFilter*/}
        {/*label="Ritual"*/}
        {/*onUpdate={this.handleExclusiveCheckboxFilterChange}*/}
        {/*propertyKey="filterRitual"*/}
        {/*value={filterRitual}*/}
        {/*/>*/}
        {/*<SpellsFilterExclusiveCheckboxFilter*/}
        {/*label="Concentration"*/}
        {/*onUpdate={this.handleExclusiveCheckboxFilterChange}*/}
        {/*propertyKey="filterConcentration"*/}
        {/*value={filterConcentration}*/}
        {/*/>*/}
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
        className="ct-spells-filter__active"
        onClick={this.handleFilterAdvancedToggle}
      >
        <div className="ct-spells-filter__active-label">{label}:</div>
        <div className="ct-spells-filter__active-value">
          {options.map((option) => option.label).join(" or ")}
        </div>
        <div className="ct-spells-filter__active-remove">
          <div
            className="ct-spells-filter__active-remove-icon"
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
        className="ct-spells-filter__active"
        onClick={this.handleFilterAdvancedToggle}
      >
        <div className="ct-spells-filter__active-label">{label}:</div>
        <div className="ct-spells-filter__active-value">
          {value ? trueLabel : falseLabel}
        </div>
        <div className="ct-spells-filter__active-remove">
          <div
            className="ct-spells-filter__active-remove-icon"
            onClick={this.handleBoolFilterClear.bind(this, propertyKey)}
          />
        </div>
      </div>
    );
  };

  renderFilterBarActives = (): React.ReactNode => {
    const {
      filterTags,
      filterActivations,
      filterConcentration,
      filterConditions,
      filterDamageTypes,
      filterRanged,
      filterRitual,
      filterSavingThrows,
    } = this.state;

    let activeNodes: Array<{ key: string; node: React.ReactNode }> = [];

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
    if (filterActivations.length) {
      activeNodes.push({
        key: "filterActivations",
        node: this.renderFilterBarActiveArray(
          "Casting",
          this.getActivationTypeOptions(filterActivations),
          "filterActivations"
        ),
      });
    }
    if (filterConditions.length) {
      activeNodes.push({
        key: "filterConditions",
        node: this.renderFilterBarActiveArray(
          filterConditions.length === 1 ? "Condition" : "Conditions",
          this.getConditionOptions(filterConditions),
          "filterConditions"
        ),
      });
    }
    if (filterSavingThrows.length) {
      activeNodes.push({
        key: "filterSavingThrows",
        node: this.renderFilterBarActiveArray(
          filterSavingThrows.length === 1 ? "Save" : "Saves",
          this.getSavingThrowOptions(filterSavingThrows),
          "filterSavingThrows"
        ),
      });
    }
    if (filterDamageTypes.length) {
      activeNodes.push({
        key: "filterDamageTypes",
        node: this.renderFilterBarActiveArray(
          filterDamageTypes.length === 1 ? "Damage Type" : "Damage Types",
          this.getDamageTypeOptions(filterDamageTypes),
          "filterDamageTypes"
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
    if (filterRitual !== null) {
      activeNodes.push({
        key: "filterRitual",
        node: this.renderFilterBarActiveExclusiveCheckbox(
          "Ritual",
          filterRitual,
          "filterRitual"
        ),
      });
    }
    if (filterConcentration !== null) {
      activeNodes.push({
        key: "filterConcentration",
        node: this.renderFilterBarActiveExclusiveCheckbox(
          "Concentration",
          filterConcentration,
          "filterConcentration"
        ),
      });
    }

    if (!activeNodes.length) {
      return null;
    }

    return (
      <div className="ct-spells-filter__actives">
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
    let advancedClassNames: Array<string> = ["ct-spells-filter__advanced"];
    let FilterIcon: React.ComponentType<any> = theme.isDarkMode
      ? LightFilterSvg
      : DarkFilterSvg;
    if (filterCount > 0) {
      advancedClassNames.push("ct-spells-filter__advanced--active");
      FilterIcon = ThemedFilterSvg;
    }

    let classNames: Array<string> = ["ct-spells-filter"];
    if (showAdvancedFilters) {
      classNames.push("ct-spells-filter--show-advanced");
    }
    if (hasFilter) {
      classNames.push("ct-spells-filter--has-filter");
    }

    return (
      <div className={classNames.join(" ")}>
        <div className="ct-spells-filter__interactions">
          <div className="ct-spells-filter__box">
            {this.renderFilterBarActives()}
            <div className="ct-spells-filter__primary">
              <div className="ct-spells-filter__primary-group ct-spells-filter__primary-group--first">
                <div className="ct-spells-filter__icon" />
              </div>
              <div className="ct-spells-filter__field">
                <input
                  className="ct-spells-filter__input"
                  type="search"
                  placeholder="Search Spell Names, Casting Times, Damage Types, Conditions or Tags"
                  value={filterQuery}
                  onChange={this.handleQueryUpdate}
                />
              </div>
              {hasFilter && (
                <div
                  className="ct-spells-filter__clear"
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
              <span className="ct-spells-filter__advanced-callout">
                {filterCount}
              </span>
            )}
          </div>
          {callout && (
            <div className="ct-spells-filter__callout">{callout}</div>
          )}
        </div>
        {showAdvancedFilters && this.renderAdvancedFilters()}
      </div>
    );
  }
}
