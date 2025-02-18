import { orderBy } from "lodash";
import React from "react";

import { Button } from "../../character-components/es";
import {
  BaseSpellContract,
  CharacterTheme,
  CharClass,
  ClassUtils,
  Constants,
  DataOriginRefData,
  FormatUtils,
  RuleData,
  Spell,
  SpellCasterInfo,
  SpellUtils,
} from "../../character-rules-engine";

import { HtmlContent } from "~/components/HtmlContent";

import { ApiSpellsRequest } from "../../../selectors/composite/apiCreator";
import { SpellList, SpellListItem } from "../SpellList";
import SpellManagerGroup from "../SpellManagerGroup";

export default class ClassSpellListManager extends React.PureComponent<
  {
    charClass: CharClass;
    isSpellsKnownMaxed: boolean;
    isCantripsKnownMaxed: boolean;
    isPrepareMaxed: boolean;
    spells: Array<Spell>;
    activeSpells: Array<Spell>;
    ritualSpells: Array<Spell>;
    spellList: Array<any>;
    prepareMax: number;
    spellcastingModifier: number;
    classHeader: string;
    classSpellListIdx: number;
    onSpellPrepare: (spell: Spell, classMappingId: number) => void;
    onSpellUnprepare: (spell: Spell, classMappingId: number) => void;
    onSpellRemove: (spell: Spell, classMappingId: number) => void;
    onSpellAdd: (spell: Spell, classMappingId: number) => void;
    onAlwaysKnownLoad: (
      spells: Array<BaseSpellContract>,
      classId: number
    ) => void;
    showHeader: boolean;
    spellCasterInfo: SpellCasterInfo;
    ruleData: RuleData;
    dataOriginRefData: DataOriginRefData;
    loadRemainingSpellList: ApiSpellsRequest | null;
    loadAlwaysKnownSpells?: ApiSpellsRequest | null;
    overallSpellInfo: any;
    preparedSpellcaster: boolean;
    knownSpellcaster: boolean;
    spellbookSpellcaster: boolean;
    knownSpellIds: Array<any>;
    knownSpellCount: number;
    activeCantripsCount: number;
    preparedSpellCount: number;
    knownCantripsMax: number;
    knownSpellsMax: number;
    proficiencyBonus: number;
    theme: CharacterTheme;
    activeSourceCategories: Array<number>;
  },
  {
    showRitualSpells: boolean;
    visibleSpellGroups: {
      activeSpells: boolean;
      spellbook: boolean;
      addSpells: boolean;
    };
  }
> {
  static defaultProps = {
    classHeader: "",
    showHeader: true,
  };

  constructor(props) {
    super(props);

    const { spellbookSpellcaster, knownSpellCount, activeCantripsCount } =
      props;

    const isSpellbookEmpty = knownSpellCount === 0 && activeCantripsCount === 0;

    this.state = {
      showRitualSpells: false,
      visibleSpellGroups: {
        activeSpells:
          !spellbookSpellcaster || (spellbookSpellcaster && !isSpellbookEmpty),
        spellbook: spellbookSpellcaster && isSpellbookEmpty,
        addSpells: false,
      },
    };
  }

  handlePrepare = (spell) => {
    const { onSpellPrepare, charClass } = this.props;
    if (onSpellPrepare) {
      onSpellPrepare(spell, ClassUtils.getMappingId(charClass));
    }
  };

  handleUnprepare = (spell) => {
    const { onSpellUnprepare, charClass } = this.props;
    if (onSpellUnprepare) {
      onSpellUnprepare(spell, ClassUtils.getMappingId(charClass));
    }
  };

  handleRemove = (spell) => {
    const { onSpellRemove, charClass } = this.props;
    if (onSpellRemove) {
      onSpellRemove(spell, ClassUtils.getMappingId(charClass));
    }
  };

  handleAdd = (spell) => {
    const { onSpellAdd, charClass } = this.props;

    if (onSpellAdd) {
      onSpellAdd(spell, ClassUtils.getMappingId(charClass));
    }
  };

  handleAlwaysKnownLoad = (spells: Array<BaseSpellContract>): void => {
    const { onAlwaysKnownLoad, charClass } = this.props;

    if (onAlwaysKnownLoad) {
      onAlwaysKnownLoad(spells, ClassUtils.getActiveId(charClass));
    }
  };

  handleShowSpellGroup = (key) => {
    this.setState((prevState) => {
      let resetState = {
        activeSpells: false,
        addSpells: false,
        spellbook: false,
      };

      return {
        visibleSpellGroups: {
          ...resetState,
          [key]: !prevState.visibleSpellGroups[key],
        },
      };
    });
  };

  handleToggleRitualSpells = () => {
    this.setState((prevState) => ({
      showRitualSpells: !prevState.showRitualSpells,
    }));
  };

  doesAvailableSpellsHaveNotifications = () => {
    const {
      prepareMax,
      knownCantripsMax,
      knownSpellsMax,
      knownSpellCount,
      activeCantripsCount,
      preparedSpellCount,
    } = this.props;

    if (knownCantripsMax !== null && activeCantripsCount > knownCantripsMax) {
      return true;
    }

    if (prepareMax && preparedSpellCount > prepareMax) {
      return true;
    }

    if (knownSpellsMax && knownSpellCount > knownSpellsMax) {
      return true;
    }

    return false;
  };

  renderSpellListSpellStatus = () => {
    const {
      charClass,
      prepareMax,
      knownCantripsMax,
      knownSpellsMax,
      knownSpellCount,
      activeCantripsCount,
      preparedSpellCount,
    } = this.props;
    const spellCastingLearningStyle = ClassUtils.getSpellCastingLearningStyle(charClass);

    let cantripsDisplay = "";
    let cantripsClsNames = ["spell-manager-info-cantrips"];
    if (knownCantripsMax !== null) {
      if (activeCantripsCount === knownCantripsMax) {
        cantripsDisplay = `Cantrips: ${knownCantripsMax}`;
      } else {
        cantripsDisplay = `Cantrips: ${activeCantripsCount}/${knownCantripsMax}`;

        if (activeCantripsCount > knownCantripsMax) {
          cantripsClsNames.push("spell-manager-info-exceeded");
        }
      }
    }

    const spellDisplayListType = spellCastingLearningStyle === Constants.SpellCastingLearningStyle.Prepared
      ? "Prepared"
      : "Known";
    let spellsDisplay = "";
    let spellsClsNames = ["spell-manager-info-spells"];
    if (prepareMax) {
      if (preparedSpellCount === prepareMax) {
        spellsDisplay = `Prepared Spells: ${preparedSpellCount}`;
      } else {
        spellsDisplay = `Prepared Spells: ${preparedSpellCount}/${prepareMax}`;

        if (preparedSpellCount > prepareMax) {
          spellsClsNames.push("spell-manager-info-exceeded");
        }
      }

      spellsDisplay += `<span class="spell-manager-info-extra">(${knownSpellCount} Known)</span>`;
    } else if (knownSpellsMax) {
      if (knownSpellCount === knownSpellsMax) {
        spellsDisplay = `${spellDisplayListType} Spells: ${knownSpellCount}`;
      } else {
        spellsDisplay = `${spellDisplayListType} Spells: ${knownSpellCount}/${knownSpellsMax}`;

        if (knownSpellCount > knownSpellsMax) {
          spellsClsNames.push("spell-manager-info-exceeded");
        }
      }
    }

    return (
      <div className="spell-manager-info">
        <div className={cantripsClsNames.join(" ")}>{cantripsDisplay}</div>
        <HtmlContent
          className={spellsClsNames.join(" ")}
          html={spellsDisplay}
          withoutTooltips
        />
      </div>
    );
  };

  render() {
    const { visibleSpellGroups, showRitualSpells } = this.state;
    const {
      charClass,
      spells,
      prepareMax,
      isSpellsKnownMaxed,
      isCantripsKnownMaxed,
      isPrepareMaxed,
      activeSpells,
      ritualSpells,
      spellcastingModifier,
      loadRemainingSpellList,
      loadAlwaysKnownSpells,
      preparedSpellcaster,
      knownSpellcaster,
      spellbookSpellcaster,
      knownSpellIds,
      knownSpellCount,
      activeCantripsCount,
      showHeader,
      spellCasterInfo,
      ruleData,
      overallSpellInfo,
      dataOriginRefData,
      proficiencyBonus,
      theme,
      activeSourceCategories,
    } = this.props;
    const spellCastingLearningStyle = ClassUtils.getSpellCastingLearningStyle(charClass);

    const activeGroupHeading = knownSpellcaster && spellCastingLearningStyle !== Constants.SpellCastingLearningStyle.Prepared
      ? "Known Spells"
      : "Prepared Spells";

    const addGroupHeading = knownSpellcaster || spellbookSpellcaster
      ? "Add Spells"
      : "Known Spells";

    const addButtonText = Constants.SpellCastingLearningStyleAddText[spellCastingLearningStyle];
    const removeButtonText = Constants.SpellCastingLearningStyleRemoveText[spellCastingLearningStyle];

    let addGroupHeadingNotificationNode;
    if (this.doesAvailableSpellsHaveNotifications()) {
      addGroupHeadingNotificationNode = (
        <div className="class-spell-list-heading-notification">!</div>
      );
    }

    let activeSpellsConClsNames = ["class-spell-list"];
    if (visibleSpellGroups.activeSpells) {
      activeSpellsConClsNames.push("class-spell-list-opened");
    } else {
      activeSpellsConClsNames.push("class-spell-list-collapsed");
    }

    let ritualSpellsConClsNames = ["class-spell-list-rituals"];
    if (showRitualSpells) {
      ritualSpellsConClsNames.push("class-spell-list-opened");
    } else {
      ritualSpellsConClsNames.push("class-spell-list-collapsed");
    }

    let spellbookConClsNames = ["class-spell-list"];
    if (visibleSpellGroups.spellbook) {
      spellbookConClsNames.push("class-spell-list-opened");
    } else {
      spellbookConClsNames.push("class-spell-list-collapsed");
    }

    let addSpellsConClsNames = ["class-spell-list"];
    if (visibleSpellGroups.addSpells) {
      addSpellsConClsNames.push("class-spell-list-opened");
    } else {
      addSpellsConClsNames.push("class-spell-list-collapsed");
    }

    let classPortraitUrl = ClassUtils.getPortraitUrl(charClass);
    let className = ClassUtils.getName(charClass);

    const isSpellbookEmpty = knownSpellCount === 0 && activeCantripsCount === 0;

    const orderedActiveSpells = orderBy(activeSpells, [
      (spell) => SpellUtils.getLevel(spell),
      (spell) => SpellUtils.getName(spell),
      (spell) => SpellUtils.getExpandedDataOriginRef(spell) !== null,
      (spell) => SpellUtils.getUniqueKey(spell),
    ]);

    return (
      <div className="class-spell-list-manager">
        {showHeader && (
          <div className="class-spell-list-manager-header">
            <div className="class-spell-list-manager-preview">
              <img
                className="class-spell-list-manager-preview-img"
                src={classPortraitUrl}
                alt=""
              />
            </div>
            <div className="class-spell-list-manager-heading">{className}</div>
            <div className="class-spell-list-manager-modifier">
              Spellcasting Modifier:{" "}
              {FormatUtils.renderSignedNumber(spellcastingModifier)}
            </div>
          </div>
        )}
        <div className={activeSpellsConClsNames.join(" ")}>
          <div
            className="class-spell-list-header"
            onClick={this.handleShowSpellGroup.bind(this, "activeSpells")}
          >
            <div className="class-spell-list-heading">
              {activeGroupHeading}
              <span className="class-spell-list-heading-extra">
                ({activeSpells.length})
              </span>
            </div>
            <div className="class-spell-list-trigger" />
          </div>
          {visibleSpellGroups.activeSpells && (
            <div className="class-spell-list-content">
              <div className="class-spell-list-actives">
                {orderedActiveSpells.map((spell) => {
                  const { canRemove, canPrepare, alwaysPrepared } = spell;

                  const showUnprepare = !alwaysPrepared && canPrepare;

                  let footerNode;
                  if (canRemove || showUnprepare) {
                    footerNode = (
                      <div className="spell-list-item-content-actions">
                        {showUnprepare && (
                          <Button
                            size="small"
                            style={"outline"}
                            onClick={this.handleUnprepare.bind(this, spell)}
                          >
                            Unprepare Spell
                          </Button>
                        )}
                        {canRemove && (
                          <div
                            className="spell-manager-spell-remove"
                            onClick={this.handleRemove.bind(this, spell)}
                          >
                            <span className="spell-manager-spell-remove-icon" />{" "}
                            Remove Spell
                          </div>
                        )}
                      </div>
                    );
                  }

                  return (
                    <SpellListItem
                      theme={theme}
                      spell={spell}
                      key={SpellUtils.getUniqueKey(spell)}
                      footerNode={footerNode}
                      spellCasterInfo={spellCasterInfo}
                      ruleData={ruleData}
                      dataOriginRefData={dataOriginRefData}
                      proficiencyBonus={proficiencyBonus}
                    />
                  );
                })}
                {orderedActiveSpells.length === 0 && (
                  <div className="class-spell-list-empty">
                    {spellbookSpellcaster && (
                      <div>You currently have no prepared spells.</div>
                    )}
                    {preparedSpellcaster && (
                      <div>
                        You currently have no prepared spells. Learn and prepare
                        spells from your list of available spells below.
                      </div>
                    )}
                    {knownSpellcaster && (
                      <div>
                        You currently have no known spells. Learn spells from
                        your list of available spells below.
                      </div>
                    )}
                  </div>
                )}
              </div>
              {ritualSpells.length > 0 && (
                <div className={ritualSpellsConClsNames.join(" ")}>
                  <div
                    className="class-spell-list-header"
                    onClick={this.handleToggleRitualSpells}
                  >
                    <div className="class-spell-list-heading">
                      Ritual Spells
                      <span className="class-spell-list-heading-extra">
                        ({ritualSpells.length})
                      </span>
                    </div>
                    <div className="class-spell-list-trigger" />
                  </div>
                  {showRitualSpells && (
                    <SpellList
                      theme={theme}
                      spells={ritualSpells}
                      castAsRitual={true}
                      spellCasterInfo={spellCasterInfo}
                      ruleData={ruleData}
                      dataOriginRefData={dataOriginRefData}
                      proficiencyBonus={proficiencyBonus}
                    />
                  )}
                </div>
              )}
            </div>
          )}
        </div>
        {spellbookSpellcaster && (
          <div className={spellbookConClsNames.join(" ")}>
            <div
              className="class-spell-list-header"
              onClick={this.handleShowSpellGroup.bind(this, "spellbook")}
            >
              <div className="class-spell-list-heading">Spellbook</div>
              <div className="class-spell-list-trigger" />
            </div>
            {visibleSpellGroups.spellbook && (
              <div className="class-spell-list-content">
                {isSpellbookEmpty && (
                  <div className="class-spell-list-empty">
                    You currently have no known spells. Learn spells from your
                    list of available spells below.
                  </div>
                )}
                {!isSpellbookEmpty && this.renderSpellListSpellStatus()}
                {!isSpellbookEmpty && (
                  <SpellManagerGroup
                    theme={theme}
                    isPrepareMaxed={isPrepareMaxed}
                    isCantripsKnownMaxed={isCantripsKnownMaxed}
                    isSpellsKnownMaxed={isSpellsKnownMaxed}
                    enableAdd={false}
                    enableSpellRemove={false}
                    spells={spells}
                    knownSpellIds={knownSpellIds}
                    onPrepare={this.handlePrepare}
                    onUnprepare={this.handleUnprepare}
                    onRemove={this.handleRemove}
                    onAdd={this.handleAdd}
                    addButtonText={addButtonText}
                    removeButtonText={"Remove"}
                    spellCasterInfo={spellCasterInfo}
                    ruleData={ruleData}
                    overallSpellInfo={overallSpellInfo}
                    dataOriginRefData={dataOriginRefData}
                    proficiencyBonus={proficiencyBonus}
                    activeSourceCategories={activeSourceCategories}
                  />
                )}
              </div>
            )}
          </div>
        )}
        <div className={addSpellsConClsNames.join(" ")}>
          <div
            className="class-spell-list-header"
            onClick={this.handleShowSpellGroup.bind(this, "addSpells")}
          >
            <div className="class-spell-list-heading">
              {addGroupHeading}
              {addGroupHeadingNotificationNode}
            </div>
            <div className="class-spell-list-trigger" />
          </div>
          {visibleSpellGroups.addSpells && (
            <div className="class-spell-list-content">
              {this.renderSpellListSpellStatus()}
              <SpellManagerGroup
                theme={theme}
                isPrepareMaxed={isPrepareMaxed}
                isCantripsKnownMaxed={isCantripsKnownMaxed}
                isSpellsKnownMaxed={isSpellsKnownMaxed}
                loadAlwaysKnownSpells={loadAlwaysKnownSpells}
                loadSpells={loadRemainingSpellList}
                spells={spells}
                enablePrepare={!spellbookSpellcaster}
                enableUnprepare={!spellbookSpellcaster}
                knownSpellIds={knownSpellIds}
                onAlwaysKnownLoad={this.handleAlwaysKnownLoad}
                onPrepare={this.handlePrepare}
                onUnprepare={this.handleUnprepare}
                onRemove={this.handleRemove}
                onAdd={this.handleAdd}
                addButtonText={addButtonText}
                removeButtonText={removeButtonText}
                spellCasterInfo={spellCasterInfo}
                ruleData={ruleData}
                overallSpellInfo={overallSpellInfo}
                dataOriginRefData={dataOriginRefData}
                proficiencyBonus={proficiencyBonus}
                activeSourceCategories={activeSourceCategories}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
}
