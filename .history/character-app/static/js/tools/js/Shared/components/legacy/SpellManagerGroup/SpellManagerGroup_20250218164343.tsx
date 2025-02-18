import axios, { Canceler } from "axios";
import sortBy from "lodash/sortBy";
import React from "react";

import {
  Button,
  LoadingPlaceholder,
  TypeScriptUtils,
} from "../../character-components/es";
import {
  ApiAdapterUtils,
  BaseSpellContract,
  CharacterTheme,
  Constants,
  DataOriginRefData,
  EntityUtils,
  FormatUtils,
  HelperUtils,
  RuleData,
  RuleDataUtils,
  SourceUtils,
  Spell,
  SpellCasterInfo,
  SpellUtils,
} from "../../character-rules-engine/";

import { LegacyBadge } from "~/components/LegacyBadge";
import { Link } from "~/components/Link";
import { SpellFilter } from "~/components/SpellFilter";
import { SpellName } from "~/components/SpellName";

import DataLoadingStatusEnum from "../../../constants/DataLoadingStatusEnum";
import {
  ApiSpellsPromise,
  ApiSpellsRequest,
} from "../../../selectors/composite/apiCreator";
import { AppLoggerUtils, FilterUtils } from "../../../utils";
import SpellDetail from "../../SpellDetail";
import Collapsible, {
  CollapsibleHeader,
  CollapsibleHeading,
} from "../common/Collapsible";

export class SpellManagerGroupItem extends React.PureComponent<{
  spell: Spell;
  spellCasterInfo: any;
  ruleData: RuleData;
  dataOriginRefData: DataOriginRefData;
  enableRemove: boolean;
  enableSpellRemove: boolean;
  enableAdd: boolean;
  enablePrepare: boolean;
  enableUnprepare: boolean;
  isPrepareMaxed: boolean;
  isCantripsKnownMaxed: boolean;
  isSpellsKnownMaxed: boolean;
  addButtonText: string;
  removeButtonText: string;
  proficiencyBonus: number;
  theme: CharacterTheme;
  onPrepare: (spell: Spell) => void;
  onUnprepare: (spell: Spell) => void;
  onAdd: (spell: Spell) => void;
  onRemove: (spell: Spell) => void;
}> {
  static defaultProps = {
    enableRemove: true,
    enableSpellRemove: true,
    enableAdd: true,
    enablePrepare: true,
    enableUnprepare: true,
  };

  handlePrepareToggle = () => {
    const { spell, onPrepare, onUnprepare } = this.props;

    if (spell.prepared) {
      onUnprepare(spell);
    } else {
      onPrepare(spell);
    }
  };

  handleRemove = (evt) => {
    const { spell, onRemove } = this.props;

    evt.stopPropagation();
    evt.nativeEvent.stopImmediatePropagation();

    onRemove(spell);
  };

  handleAdd = () => {
    const { spell, onAdd } = this.props;
    onAdd(spell);
  };

  renderButtons = (clsNames, includeRemove) => {
    const {
      spell,
      isPrepareMaxed,
      isCantripsKnownMaxed,
      isSpellsKnownMaxed,
      enableRemove,
      enableAdd,
      enablePrepare,
    } = this.props;
    let { addButtonText, removeButtonText } = this.props;
    const { alwaysPrepared, canRemove, canPrepare, canAdd } = spell;

    let isAddDisabled = false;
    if (SpellUtils.getLevel(spell) === 0 && isCantripsKnownMaxed) {
      isAddDisabled = true;
    }
    if (SpellUtils.getLevel(spell) > 0 && isSpellsKnownMaxed) {
      isAddDisabled = true;
    }

    let showAlwaysPrepared =
      (!includeRemove && alwaysPrepared) ||
      (includeRemove && !canRemove && alwaysPrepared);

    if (SpellUtils.isCantrip(spell)) {
      addButtonText =
        Constants.SpellCastingLearningStyleAddText[
          Constants.SpellCastingLearningStyle.Learned
        ];
      removeButtonText =
        Constants.SpellCastingLearningStyleRemoveText[
          Constants.SpellCastingLearningStyle.Learned
        ];
    }

    return (
      <div className={clsNames.join(" ")}>
        {showAlwaysPrepared && (
          <div className="spell-manager-item-always-prepared">
            Always Prepared
          </div>
        )}
        {!alwaysPrepared && enablePrepare && canPrepare && (
          <Button
            size="small"
            disabled={isPrepareMaxed && !spell.prepared}
            style={spell.prepared ? "" : "outline"}
            onClick={this.handlePrepareToggle}
          >
            {spell.prepared ? removeButtonText : addButtonText}
          </Button>
        )}
        {includeRemove && enableRemove && canRemove && (
          <div
            className="spell-manager-spell-remove"
            onClick={this.handleRemove}
          >
            <span className="spell-manager-spell-remove-icon" />{" "}
            {removeButtonText}
          </div>
        )}
        {enableAdd && canAdd && (
          <Button
            size="small"
            onClick={this.handleAdd}
            disabled={isAddDisabled}
            style={"outline"}
          >
            {addButtonText}
          </Button>
        )}
      </div>
    );
  };

  renderHeader() {
    const { spell, enableSpellRemove, dataOriginRefData } = this.props;
    const level = SpellUtils.getLevel(spell);
    const concentration = SpellUtils.getConcentration(spell);
    const rangeArea = SpellUtils.getDefinitionRangeArea(spell);
    const attackType = SpellUtils.getAttackType(spell);
    const school = SpellUtils.getSchool(spell);
    const isLegacy = SpellUtils.isLegacy(spell);

    let heading = (
      <CollapsibleHeading>
        <div className="spell-list-heading">
          <SpellName spell={spell} showSpellLevel={false} showLegacy={false} />
          {isLegacy && <LegacyBadge variant="margin-left" />}
        </div>
      </CollapsibleHeading>
    );

    let metaItems: Array<string> = [];
    metaItems.push(FormatUtils.renderSpellLevelName(level));
    let expandedDataOriginRef = SpellUtils.getExpandedDataOriginRef(spell);
    if (expandedDataOriginRef !== null) {
      metaItems.push(
        EntityUtils.getDataOriginRefName(
          expandedDataOriginRef,
          dataOriginRefData
        )
      );
    }
    if (concentration) {
      metaItems.push("Concentration");
    }
    if (rangeArea) {
      metaItems.push(
        attackType && attackType === Constants.AttackTypeRangeEnum.RANGED
          ? `Range ${rangeArea}`
          : rangeArea
      );
    }

    let iconClsNames = [
      "spell-header-icon-school",
      `spell-header-icon-school-${FormatUtils.slugify(school)}`,
    ];

    return (
      <CollapsibleHeader
        iconClsNames={iconClsNames}
        clsIdent="spell-list-item"
        heading={heading}
        metaItems={metaItems}
        callout={this.renderButtons(
          ["spell-list-item-header-actions"],
          enableSpellRemove
        )}
      />
    );
  }

  render() {
    const {
      spell,
      spellCasterInfo,
      ruleData,
      isPrepareMaxed,
      proficiencyBonus,
      theme,
    } = this.props;

    return (
      <Collapsible trigger={this.renderHeader()} clsNames={["spell-list-item"]}>
        <SpellDetail
          theme={theme}
          spell={spell}
          isPreparedMaxed={isPrepareMaxed}
          enableCaster={false}
          spellCasterInfo={spellCasterInfo}
          ruleData={ruleData}
          showActions={false}
          showCustomize={false}
          proficiencyBonus={proficiencyBonus}
        />
        <div className="spell-list-item-actions">
          {this.renderButtons(["spell-list-item-content-actions"], true)}
        </div>
      </Collapsible>
    );
  }
}

enum LoadSpellType {
  ADDITIONAL = "ADDITIONAL",
  ALWAYS_KNOWN = "ALWAYS_KNOWN",
}
interface SpellManagerGroupProps {
  spells: Array<Spell>;
  spellCasterInfo: SpellCasterInfo;
  overallSpellInfo: any;
  knownSpellIds: Array<any>;
  ruleData: RuleData;
  dataOriginRefData: DataOriginRefData;
  loadSpells?: ApiSpellsRequest | null;
  loadAlwaysKnownSpells?: ApiSpellsRequest | null;
  enableRemove: boolean;
  enableSpellRemove: boolean;
  enableAdd: boolean;
  enablePrepare: boolean;
  enableUnprepare: boolean;
  isPrepareMaxed: boolean;
  isCantripsKnownMaxed: boolean;
  isSpellsKnownMaxed: boolean;
  addButtonText: string;
  removeButtonText: string;
  proficiencyBonus: number;
  theme: CharacterTheme;
  onAlwaysKnownLoad?: (spells: Array<BaseSpellContract>) => void;
  onPrepare: (spell: Spell) => void;
  onUnprepare: (spell: Spell) => void;
  onAdd: (spell: Spell) => void;
  onRemove: (spell: Spell) => void;
  activeSourceCategories: Array<number>;
}
interface SpellManagerGroupState {
  query: string;
  lazySpells: Array<Spell>;
  staticSpells: Array<Spell>;
  filteredSpells: Array<Spell>;
  currentPage: number;
  loadingStatus: DataLoadingStatusEnum;
  filterLevels: Array<number>;
  filterSourceCategories: Array<number>;
  filterQuery: string;
}
export default class SpellManagerGroup extends React.PureComponent<
  SpellManagerGroupProps,
  SpellManagerGroupState
> {
  static defaultProps = {
    enablePrepare: true,
    enableUnprepare: true,
    enableRemove: true,
    enableSpellRemove: true,
    enableAdd: true,
  };

  loadRuleCancelers: Array<Canceler> = [];

  constructor(props) {
    super(props);

    const { spells } = props;

    this.state = {
      query: "",
      lazySpells: [],
      staticSpells: spells,
      filteredSpells: spells,
      currentPage: 0,
      loadingStatus: DataLoadingStatusEnum.NOT_INITIALIZED,
      filterLevels: [],
      filterSourceCategories: [],
      filterQuery: "",
    };
  }

  fetchSpells = () => {
    const { loadSpells, loadAlwaysKnownSpells, onAlwaysKnownLoad } = this.props;

    if (!loadSpells && !loadAlwaysKnownSpells) {
      this.setState({
        loadingStatus: DataLoadingStatusEnum.LOADED,
      });
      return;
    }

    let requests: Array<ApiSpellsPromise> = [];
    let loadingRequestTypes: Array<LoadSpellType> = [];
    if (loadSpells) {
      requests.push(
        loadSpells({
          cancelToken: new axios.CancelToken((c) => {
            this.loadRuleCancelers.push(c);
          }),
        })
      );
      loadingRequestTypes.push(LoadSpellType.ADDITIONAL);
    }
    if (loadAlwaysKnownSpells) {
      requests.push(
        loadAlwaysKnownSpells({
          cancelToken: new axios.CancelToken((c) => {
            this.loadRuleCancelers.push(c);
          }),
        })
      );
      loadingRequestTypes.push(LoadSpellType.ALWAYS_KNOWN);
    }

    this.setState({
      loadingStatus: DataLoadingStatusEnum.LOADING,
    });

    axios
      .all(requests)
      .then((responses) => {
        let lazySpells: Array<Spell> = [];

        for (let i = 0; i < responses.length; i++) {
          let response = responses[i];
          let requestType = loadingRequestTypes[i];
          let spells = ApiAdapterUtils.getResponseData(response);
          switch (requestType) {
            case LoadSpellType.ADDITIONAL:
              lazySpells =
                spells !== null ? this.transformLoadedSpells(spells) : [];
              break;

            case LoadSpellType.ALWAYS_KNOWN:
              if (spells !== null && onAlwaysKnownLoad) {
                onAlwaysKnownLoad(spells);
              }
              break;

            default:
            // not implemented
          }
        }

        this.setState({
          lazySpells,
          loadingStatus: DataLoadingStatusEnum.LOADED,
        });
        this.loadRuleCancelers = [];
      })
      .catch(AppLoggerUtils.handleAdhocApiError);
  };

  componentDidMount() {
    this.fetchSpells();
  }

  componentWillUnmount(): void {
    if (this.loadRuleCancelers.length > 0) {
      this.loadRuleCancelers.forEach((cancel) => {
        cancel();
      });
    }
  }

  componentDidUpdate(
    prevProps: Readonly<SpellManagerGroupProps>,
    prevState: Readonly<SpellManagerGroupState>,
    snapshot?: any
  ): void {
    const { spells, spellCasterInfo } = this.props;

    if (spells !== prevProps.spells) {
      this.setState((prevState) => ({
        staticSpells: spells,
      }));
    }

    if (
      spellCasterInfo.characterLevel !==
      prevProps.spellCasterInfo.characterLevel
    ) {
      this.fetchSpells();
    }
  }

  getCombinedSpells = () => {
    const { lazySpells, staticSpells } = this.state;
    const { knownSpellIds } = this.props;

    const remainingLazySpells = lazySpells.filter(
      (spell) => !knownSpellIds.includes(SpellUtils.deriveKnownKey(spell))
    );

    return sortBy(
      [...remainingLazySpells, ...staticSpells],
      [
        (spell) => SpellUtils.getLevel(spell),
        (spell) => SpellUtils.getName(spell),
        (spell) => SpellUtils.getExpandedDataOriginRef(spell) !== null,
        (spell) => SpellUtils.getUniqueKey(spell),
      ]
    );
  };

  getFilteredSpells = (combinedSpells) => {
    const { filterLevels, filterQuery, filterSourceCategories } = this.state;
    const { ruleData } = this.props;

    const filteredSpells = combinedSpells.filter((spell) => {
      if (filterSourceCategories.length !== 0) {
        const spellSources = SpellUtils.getSources(spell);
        const sources = spellSources
          .map((source) =>
            HelperUtils.lookupDataOrFallback(
              RuleDataUtils.getSourceDataLookup(ruleData),
              source.sourceId
            )
          )
          .filter(TypeScriptUtils.isNotNullOrUndefined);

        const sourceCategoryId = sources[0]?.sourceCategory?.id || 0;
        if (!filterSourceCategories.includes(sourceCategoryId)) {
          return false;
        }
      }

      if (
        filterLevels.length !== 0 &&
        !filterLevels.includes(SpellUtils.getLevel(spell))
      ) {
        return false;
      }

      if (
        filterQuery !== "" &&
        !FilterUtils.doesQueryMatchData(filterQuery, SpellUtils.getName(spell))
      ) {
        return false;
      }

      return true;
    });

    return filteredSpells;
  };

  transformLoadedSpells = (data) => {
    const { ruleData, overallSpellInfo } = this.props;
    return data.map((spell) =>
      SpellUtils.simulateSpell(spell, overallSpellInfo, ruleData, null, null)
    );
  };

  handleFilterSpellLevel = (level: number) => {
    this.setState((prevState) => ({
      filterLevels: prevState.filterLevels.includes(level)
        ? prevState.filterLevels.filter((l) => l !== level)
        : [...prevState.filterLevels, level],
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

  render() {
    const {
      onPrepare,
      onUnprepare,
      onRemove,
      onAdd,
      isPrepareMaxed,
      isCantripsKnownMaxed,
      isSpellsKnownMaxed,
      addButtonText,
      removeButtonText,
      enableRemove,
      enableAdd,
      enablePrepare,
      enableUnprepare,
      enableSpellRemove,
      spellCasterInfo,
      ruleData,
      dataOriginRefData,
      proficiencyBonus,
      theme,
      activeSourceCategories,
    } = this.props;
    const { filterQuery, filterLevels, loadingStatus, filterSourceCategories } =
      this.state;

    const combinedSpells = this.getCombinedSpells();
    const filteredSpells = this.getFilteredSpells(combinedSpells);

    const spellDefinitions = combinedSpells
      .map((spell) => SpellUtils.getDefinition(spell))
      .filter(TypeScriptUtils.isNotNullOrUndefined);
    const sourceCategories = SourceUtils.getSimpleSourceCategoriesData(
      spellDefinitions,
      ruleData,
      activeSourceCategories
    );
    return (
      <div className="spell-manager-group">
        <SpellFilter
          spells={combinedSpells}
          sourceCategories={sourceCategories}
          filterQuery={filterQuery}
          filterLevels={filterLevels}
          onLevelFilterClick={this.handleFilterSpellLevel}
          onQueryChange={(value) =>
            this.setState({
              filterQuery: value,
            })
          }
          onSourceCategoryClick={this.handleSourceCategoryClick}
          filterSourceCategories={filterSourceCategories}
          buttonSize="x-small"
          filterStyle="builder"
        />
        <div className="ct-character-tools__marketplace-callout">
          Looking for something not in the list below? Unlock all official
          options in the <Link href="/marketplace">Marketplace</Link>.
        </div>
        {loadingStatus === DataLoadingStatusEnum.LOADING && (
          <LoadingPlaceholder />
        )}
        {loadingStatus === DataLoadingStatusEnum.LOADED &&
          (filteredSpells.length > 0 ? (
            filteredSpells.map((spell, idx) => (
              <SpellManagerGroupItem
                theme={theme}
                spell={spell}
                key={`${spell.id}-${idx}`}
                onPrepare={onPrepare}
                onUnprepare={onUnprepare}
                onRemove={onRemove}
                onAdd={onAdd}
                isPrepareMaxed={isPrepareMaxed}
                isCantripsKnownMaxed={isCantripsKnownMaxed}
                isSpellsKnownMaxed={isSpellsKnownMaxed}
                addButtonText={addButtonText}
                removeButtonText={removeButtonText}
                enableRemove={enableRemove}
                enableAdd={enableAdd}
                enablePrepare={enablePrepare}
                enableUnprepare={enableUnprepare}
                enableSpellRemove={enableSpellRemove}
                spellCasterInfo={spellCasterInfo}
                ruleData={ruleData}
                dataOriginRefData={dataOriginRefData}
                proficiencyBonus={proficiencyBonus}
              />
            ))
          ) : (
            <div>No Results Found</div>
          ))}
      </div>
    );
  }
}
