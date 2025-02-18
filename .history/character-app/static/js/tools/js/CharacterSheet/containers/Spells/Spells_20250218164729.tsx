import { visuallyHidden } from "@mui/utils";
import React from "react";
import { connect, DispatchProp } from "react-redux";

import {
  ConcentrationIcon,
  RitualIcon,
} from "@dndbeyond/character-components/es";
import {
  AbilityLookup,
  ApiRequestHelpers,
  characterActions,
  CharacterTheme,
  ClassUtils,
  Constants,
  DataOriginRefData,
  ExperienceInfo,
  FormatUtils,
  Hack__BaseCharClass,
  HelperUtils,
  InventoryLookup,
  InventoryManager,
  ItemManager,
  RuleData,
  rulesEngineSelectors,
  ScaledSpell,
  SpellCasterInfo,
  SpellSlotContract,
  SpellUtils,
} from "../../character-rules-engine/es";
import { IRollContext } from "@dndbeyond/dice";

import { TabFilter } from "~/components/TabFilter";
import { PaneInfo, useSidebar } from "~/contexts/Sidebar/Sidebar";
import { PaneComponentEnum } from "~/subApps/sheet/components/Sidebar/types";

import SpellsLevel from "../../../Shared/components/SpellsLevel";
import SpellsLevelCasting from "../../../Shared/components/SpellsLevelCasting";
import { ThemeButton } from "../../../Shared/components/common/Button";
import {
  appEnvSelectors,
  characterRollContextSelectors,
} from "../../../Shared/selectors";
import { PaneIdentifierUtils } from "../../../Shared/utils";
import ContentGroup from "../../components/ContentGroup";
import SpellsFilter from "../../components/SpellsFilter";
import { SheetAppState } from "../../typings";
import styles from "./styles.module.css";

const ALL_LEVELS: number = -1;

function filterLevelSpells(
  levelSpells: Array<Array<ScaledSpell>>,
  testFunc: (spell: ScaledSpell) => boolean
): Array<Array<ScaledSpell>> {
  return levelSpells.map((spells) => spells.filter((spell) => testFunc(spell)));
}

function hasFilteredLevelSpells(
  levelSpells: Array<Array<ScaledSpell>>,
  testFunc: (spell: ScaledSpell) => boolean
): boolean {
  return levelSpells.reduce((acc, spells) => {
    return (
      acc ||
      spells.reduce((spellAcc, spell) => {
        return spellAcc || testFunc(spell);
      }, false)
    );
  }, false);
}

interface Props extends DispatchProp {
  levelSpells: Array<Array<ScaledSpell>>;
  spellCasterInfo: SpellCasterInfo;
  ruleData: RuleData;
  abilityLookup: AbilityLookup;
  xpInfo: ExperienceInfo;
  isReadonly: boolean;
  spellSlots: Array<SpellSlotContract>;
  pactMagicSlots: Array<SpellSlotContract>;
  showNotes: boolean;
  theme: CharacterTheme;
  diceEnabled: boolean;
  dataOriginRefData: DataOriginRefData;
  proficiencyBonus: number;
  characterRollContext: IRollContext;
  inventoryManager: InventoryManager;
  inventoryLookup: InventoryLookup;
  partyInventoryLookup: InventoryLookup;
  paneHistoryStart: PaneInfo["paneHistoryStart"];
}
interface StateFilterData {
  filteredLevelSpells: Array<Array<ScaledSpell>>;
  showAdvancedFilters: boolean;
  isFiltering: boolean;
}
interface State {
  filterData: StateFilterData;
  ritualLevelSpells: Array<Array<ScaledSpell>>;
  concentrationLevelSpells: Array<Array<ScaledSpell>>;
  hasRitualSpells: boolean;
  hasConcentrationSpells: boolean;
}
class Spells extends React.PureComponent<Props, State> {
  static defaultProps = {
    showNotes: true,
  };

  constructor(props) {
    super(props);

    this.state = {
      filterData: {
        filteredLevelSpells: [],
        showAdvancedFilters: false,
        isFiltering: false,
      },
      ritualLevelSpells: filterLevelSpells(
        props.levelSpells,
        SpellUtils.isRitual
      ),
      concentrationLevelSpells: filterLevelSpells(
        props.levelSpells,
        SpellUtils.getConcentration
      ),
      hasRitualSpells: hasFilteredLevelSpells(
        props.levelSpells,
        SpellUtils.isRitual
      ),
      hasConcentrationSpells: hasFilteredLevelSpells(
        props.levelSpells,
        SpellUtils.getConcentration
      ),
    };
  }

  componentDidUpdate(prevProps: Props, prevState: State): void {
    if (this.props.levelSpells !== prevProps.levelSpells) {
      this.setState({
        ritualLevelSpells: filterLevelSpells(
          this.props.levelSpells,
          SpellUtils.isRitual
        ),
        concentrationLevelSpells: filterLevelSpells(
          this.props.levelSpells,
          SpellUtils.getConcentration
        ),
        hasRitualSpells: hasFilteredLevelSpells(
          this.props.levelSpells,
          SpellUtils.isRitual
        ),
        hasConcentrationSpells: hasFilteredLevelSpells(
          this.props.levelSpells,
          SpellUtils.getConcentration
        ),
      });
    }
  }

  handleSpellSlotSet = (level: number, used: number): void => {
    const { dispatch } = this.props;

    const spellLevelSpellSlotRequestsDataKey =
      ApiRequestHelpers.getSpellLevelSpellSlotRequestsDataKey(level);
    if (spellLevelSpellSlotRequestsDataKey !== null) {
      dispatch(
        characterActions.spellLevelSpellSlotsSet({
          [spellLevelSpellSlotRequestsDataKey]: used,
        })
      );
    }
  };

  handleSpellSlotChange = (level: number, changeAmount: number): void => {
    const { spellSlots } = this.props;

    const usedAmount = this.getUsedSpellSlotLevelAmount(
      level,
      changeAmount,
      spellSlots
    );

    if (usedAmount !== null) {
      this.handleSpellSlotSet(level, usedAmount);
    }
  };

  handlePactSlotSet = (level: number, used: number): void => {
    const { dispatch } = this.props;

    const spellLevelPactMagicRequestsDataKey =
      ApiRequestHelpers.getSpellLevelPactMagicRequestsDataKey(level);

    if (spellLevelPactMagicRequestsDataKey !== null) {
      dispatch(
        characterActions.spellLevelPactMagicSlotsSet({
          [spellLevelPactMagicRequestsDataKey]: used,
        })
      );
    }
  };

  handlePactSlotChange = (level: number, changeAmount: number): void => {
    const { pactMagicSlots } = this.props;

    const usedAmount = this.getUsedSpellSlotLevelAmount(
      level,
      changeAmount,
      pactMagicSlots
    );

    if (usedAmount !== null) {
      this.handlePactSlotSet(level, usedAmount);
    }
  };

  getUsedSpellSlotLevelAmount = (
    level: number,
    changeAmount: number,
    spellSlots: Array<SpellSlotContract>
  ): number | null => {
    const foundSlotLevel = spellSlots.find(
      (spellSlot) => spellSlot.level === level
    );

    if (!foundSlotLevel) {
      return null;
    }

    const usedAmount: number = foundSlotLevel.used + changeAmount;
    const maxAmount: number = foundSlotLevel.available;

    return HelperUtils.clampInt(usedAmount, 0, maxAmount);
  };

  handleSpellLimitedUseSet = (
    mappingId: number,
    mappingTypeId: number,
    uses: number,
    dataOrigin: Constants.DataOriginTypeEnum
  ): void => {
    const { dispatch } = this.props;
    dispatch(
      characterActions.spellUseSet(mappingId, mappingTypeId, uses, dataOrigin)
    );
  };

  handleItemLimitedUseSet = (
    mappingId: number,
    mappingTypeId: number,
    uses: number
  ): void => {
    let item: ItemManager | null = null;
    item = ItemManager.getItem(mappingId);
    if (item) {
      item.handleItemLimitedUseSet(uses);
    }
  };

  handleSpellDetailShow = (spell: ScaledSpell, castLevel: number): void => {
    const { paneHistoryStart } = this.props;

    const mappingId = SpellUtils.getMappingId(spell);
    if (mappingId !== null) {
      const dataOrigin = SpellUtils.getDataOrigin(spell);
      const dataOriginType = SpellUtils.getDataOriginType(spell);

      switch (dataOriginType) {
        case Constants.DataOriginTypeEnum.CLASS:
          paneHistoryStart(
            PaneComponentEnum.CLASS_SPELL_DETAIL,
            PaneIdentifierUtils.generateClassSpell(
              ClassUtils.getMappingId(
                dataOrigin.primary as Hack__BaseCharClass
              ),
              mappingId,
              castLevel
            )
          );
          break;

        default:
          paneHistoryStart(
            PaneComponentEnum.CHARACTER_SPELL_DETAIL,
            PaneIdentifierUtils.generateCharacterSpell(mappingId, castLevel)
          );
      }
    }
  };

  handleManageSpellsOpen = (): void => {
    const { paneHistoryStart } = this.props;
    paneHistoryStart(PaneComponentEnum.SPELL_MANAGE);
  };

  handleFilterUpdate = (filterData: StateFilterData): void => {
    this.setState({
      filterData,
    });
  };

  renderEmptySpellLevel = (level: number): React.ReactNode => {
    let spellAbbr = FormatUtils.renderSpellLevelAbbreviation(level);
    return (
      <div className="ct-spells__empty-spell-level">
        You do not have any {spellAbbr}-level spells or spells that scale to{" "}
        {spellAbbr} level available, but you can cast lower level spells using
        your {spellAbbr}-level spell slots.
      </div>
    );
  };

  renderManageButton = (): React.ReactNode => {
    const { isReadonly } = this.props;

    if (isReadonly) {
      return null;
    }

    return (
      <ThemeButton
        style="outline"
        size="medium"
        onClick={this.handleManageSpellsOpen}
      >
        Manage Spells
      </ThemeButton>
    );
  };

  renderSpellLevels = (
    levelSpells: Array<Array<ScaledSpell>>,
    showLevels: Array<number>,
    filterRitual: boolean = false,
    filterConcentration: boolean = false
  ): React.ReactNode => {
    const { filterData, ritualLevelSpells, concentrationLevelSpells } =
      this.state;
    const {
      spellCasterInfo,
      ruleData,
      xpInfo,
      abilityLookup,
      isReadonly,
      showNotes,
      diceEnabled,
      theme,
      dataOriginRefData,
      proficiencyBonus,
      characterRollContext,
    } = this.props;

    return (
      <React.Fragment>
        {levelSpells.map((spells, level) => {
          if (!showLevels.includes(ALL_LEVELS) && !showLevels.includes(level)) {
            return null;
          }

          let levelHasSlots =
            spellCasterInfo.availablePactMagicLevels.includes(level) ||
            spellCasterInfo.availableSpellLevels.includes(level);

          if (filterRitual) {
            spells = ritualLevelSpells[level];
          }
          if (filterConcentration) {
            spells = concentrationLevelSpells[level];
          }

          if ((filterRitual || filterConcentration) && !spells.length) {
            return null;
          }

          if (!spells.length && !levelHasSlots) {
            return null;
          }

          let filteredSpells = filterData.filteredLevelSpells[level];

          if (filteredSpells && filterRitual) {
            filteredSpells = filteredSpells.filter((spell) =>
              SpellUtils.isRitual(spell)
            );
          }
          if (filteredSpells && filterConcentration) {
            filteredSpells = filteredSpells.filter((spell) =>
              SpellUtils.getConcentration(spell)
            );
          }

          if (!filteredSpells) {
            return null;
          }
          let extraNode: React.ReactNode = (
            <SpellsLevelCasting
              level={level}
              spellCasterInfo={spellCasterInfo}
              onSpellSlotSet={this.handleSpellSlotSet}
              onPactSlotSet={this.handlePactSlotSet}
              showCastingInfo={false}
              isInteractive={!isReadonly}
              isDarkMode={theme?.isDarkMode}
            />
          );

          return (
            <ContentGroup
              header={FormatUtils.renderSpellLevelName(level)}
              extra={extraNode}
              key={level}
            >
              {spells.length ? (
                <SpellsLevel
                  level={level}
                  spells={filteredSpells}
                  spellCasterInfo={spellCasterInfo}
                  ruleData={ruleData}
                  xpInfo={xpInfo}
                  abilityLookup={abilityLookup}
                  onSpellClick={this.handleSpellDetailShow}
                  onSpellSlotChange={this.handleSpellSlotChange}
                  onPactSlotChange={this.handlePactSlotChange}
                  onSpellLimitedUseSet={this.handleSpellLimitedUseSet}
                  onItemLimitedUseSet={this.handleItemLimitedUseSet}
                  isInteractive={!isReadonly}
                  showNotes={showNotes}
                  diceEnabled={diceEnabled}
                  theme={theme}
                  dataOriginRefData={dataOriginRefData}
                  proficiencyBonus={proficiencyBonus}
                  rollContext={characterRollContext}
                />
              ) : (
                this.renderEmptySpellLevel(level)
              )}
            </ContentGroup>
          );
        })}
      </React.Fragment>
    );
  };

  render() {
    const { filterData, hasConcentrationSpells, hasRitualSpells } = this.state;
    const { ruleData, abilityLookup, levelSpells, spellCasterInfo, theme } =
      this.props;

    return (
      <section className="ct-spells">
        <h2 style={visuallyHidden}>Spells</h2>
        <div className="ct-spells__casting">
          <SpellsLevelCasting
            spellCasterInfo={spellCasterInfo}
            showSlots={false}
            isDarkMode={theme?.isDarkMode}
          />
        </div>
        <SpellsFilter
          abilityLookup={abilityLookup}
          levelSpells={levelSpells}
          spellCasterInfo={spellCasterInfo}
          ruleData={ruleData}
          onDataUpdate={this.handleFilterUpdate}
          callout={this.renderManageButton()}
          theme={theme}
        />
        {!filterData.showAdvancedFilters && (
          <div className="ct-spells__content">
            <TabFilter
              className={styles.tabFilter}
              filters={[
                ...levelSpells?.map((spells, level) => {
                  let levelHasSlots =
                    spellCasterInfo.availablePactMagicLevels.includes(level) ||
                    spellCasterInfo.availableSpellLevels.includes(level);

                  if (!spells.length && !levelHasSlots)
                    return { label: "", content: null };

                  let filterBadgeText: number | null = null;
                  const filteredSpells = filterData.filteredLevelSpells[level];
                  if (filterData.isFiltering && filteredSpells.length) {
                    filterBadgeText = filteredSpells.length;
                  }

                  return {
                    label: `${FormatUtils.renderSpellLevelAbbreviation(level)}`,
                    badge: filterBadgeText ?? undefined,
                    content: this.renderSpellLevels(levelSpells, [level]),
                  };
                }),
                ...(hasConcentrationSpells
                  ? [
                      {
                        label: (
                          <ConcentrationIcon
                            themeMode={theme?.isDarkMode ? "gray" : "dark"}
                          />
                        ),
                        content: this.renderSpellLevels(
                          levelSpells,
                          [ALL_LEVELS],
                          false,
                          true
                        ),
                      },
                    ]
                  : []),
                ...(hasRitualSpells
                  ? [
                      {
                        label: (
                          <RitualIcon
                            themeMode={theme?.isDarkMode ? "gray" : "dark"}
                          />
                        ),
                        content: this.renderSpellLevels(
                          levelSpells,
                          [ALL_LEVELS],
                          true
                        ),
                      },
                    ]
                  : []),
              ]}
            />
          </div>
        )}
      </section>
    );
  }
}

function mapStateToProps(state: SheetAppState) {
  return {
    levelSpells: rulesEngineSelectors.getLevelSpells(state),
    spellCasterInfo: rulesEngineSelectors.getSpellCasterInfo(state),
    abilityLookup: rulesEngineSelectors.getAbilityLookup(state),
    ruleData: rulesEngineSelectors.getRuleData(state),
    xpInfo: rulesEngineSelectors.getExperienceInfo(state),
    spellSlots: rulesEngineSelectors.getSpellSlots(state),
    pactMagicSlots: rulesEngineSelectors.getPactMagicSlots(state),
    theme: rulesEngineSelectors.getCharacterTheme(state),
    isReadonly: appEnvSelectors.getIsReadonly(state),
    diceEnabled: appEnvSelectors.getDiceEnabled(state),
    dataOriginRefData: rulesEngineSelectors.getDataOriginRefData(state),
    proficiencyBonus: rulesEngineSelectors.getProficiencyBonus(state),
    characterRollContext:
      characterRollContextSelectors.getCharacterRollContext(state),
  };
}

const SpellsContainer = (props) => {
  const {
    pane: { paneHistoryStart },
  } = useSidebar();
  return <Spells {...props} paneHistoryStart={paneHistoryStart} />;
};

export default connect(mapStateToProps)(SpellsContainer);
