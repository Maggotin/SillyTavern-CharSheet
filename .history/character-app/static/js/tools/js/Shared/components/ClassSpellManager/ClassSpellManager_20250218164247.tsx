import React, { useState } from "react";

import {
  Collapsible,
  CollapsibleHeaderContent,
  CollapsibleHeading,
} from "@dndbeyond/character-components/es";
import {
  CharacterTheme,
  CharClass,
  ClassUtils,
  Constants,
  DataOriginRefData,
  EntityValueLookup,
  Spell,
} from "../../character-rules-engine/es";

import SpellManager from "../SpellManager";

interface Props {
  charClass: CharClass;
  activeSpells: Array<Spell>;
  isPrepareMaxed: boolean;
  isCantripsKnownMaxed: boolean;
  isSpellsKnownMaxed: boolean;
  hasMultipleSpellClasses: boolean;
  activeFeatureCantripCount: number;
  knownFeatureSpellCount: number;
  knownSpellCount: number;
  activeCantripsCount: number;
  preparedSpellCount: number;
  knownCantripsMax: number | null;
  knownSpellsMax: number | null;
  prepareMax: number | null;
  entityValueLookup: EntityValueLookup;
  dataOriginRefData: DataOriginRefData;
  proficiencyBonus: number;
  theme: CharacterTheme;
}
interface State {
  collapsedGroups: {
    activeSpells: boolean;
    spellbook: boolean;
    addSpells: boolean;
  };
}
export default function ClassSpellManager({
  charClass,
  activeSpells,
  isPrepareMaxed,
  isCantripsKnownMaxed,
  isSpellsKnownMaxed,
  activeFeatureCantripCount,
  knownFeatureSpellCount,
  knownSpellCount,
  activeCantripsCount,
  preparedSpellCount,
  knownCantripsMax,
  knownSpellsMax,
  prepareMax,
  entityValueLookup,
  dataOriginRefData,
  proficiencyBonus,
  theme,
  hasMultipleSpellClasses = false,
}: Props) {
  const isSpellbookSpellcaster = ClassUtils.isSpellbookSpellcaster(charClass);
  const isSpellbookEmpty = knownSpellCount === 0 && activeCantripsCount === 0;

  const spellCastingLearningStyle = ClassUtils.getSpellCastingLearningStyle(charClass);
  const buttonAddText = Constants.SpellCastingLearningStyleAddText[spellCastingLearningStyle];
  const removeButtonText = Constants.SpellCastingLearningStyleRemoveText[spellCastingLearningStyle];
  const [state, setState] = useState({
    collapsedGroups: {
      activeSpells:
        hasMultipleSpellClasses || (isSpellbookSpellcaster && isSpellbookEmpty),
      spellbook:
        hasMultipleSpellClasses ||
        !isSpellbookSpellcaster ||
        (isSpellbookSpellcaster && !isSpellbookEmpty),
      addSpells: true,
    },
  });

  function handleShowSpellGroup(key: keyof State["collapsedGroups"]): void {
    let resetState = {
      activeSpells: true,
      addSpells: true,
      spellbook: true,
    };
    setState({
      ...state,
      collapsedGroups: {
        ...resetState,
        [key]: !state.collapsedGroups[key],
      },
    });
  }

  function doesAvailableSpellsHaveNotifications(): boolean {
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
  }

  function renderSpellListSpellStatus(): React.ReactNode {
    let featureSpellCount: number =
      activeFeatureCantripCount + knownFeatureSpellCount;
    let calloutNode: React.ReactNode;
    if (featureSpellCount > 0) {
      calloutNode = "*";
    }

    let cantripsNode: React.ReactNode = "";
    let cantripsClsNames: Array<string> = [
      "ct-class-spell-manager__info-entry",
      "ct-class-spell-manager__info-entry--cantrips",
    ];
    if (knownCantripsMax !== null) {
      if (activeCantripsCount === knownCantripsMax) {
        cantripsNode = `Cantrips: ${knownCantripsMax}`;
      } else {
        cantripsNode = `Cantrips: ${activeCantripsCount}/${knownCantripsMax}`;

        if (activeCantripsCount > knownCantripsMax) {
          cantripsClsNames.push("ct-class-spell-manager__info-entry--exceeded");
        }
      }
    }

    const spellDisplayListType = spellCastingLearningStyle === Constants.SpellCastingLearningStyle.Prepared
      ? "Prepared"
      : "Known";
    let spellsNode: React.ReactNode;
    let spellsExtraNode: React.ReactNode;
    let spellsClsNames: Array<string> = [
      "ct-class-spell-manager__info-entry",
      "ct-class-spell-manager__info-entry--spells",
    ];
    if (prepareMax) {
      if (preparedSpellCount === prepareMax) {
        spellsNode = `Prepared Spells: ${preparedSpellCount}`;
      } else {
        spellsNode = `Prepared Spells: ${preparedSpellCount}/${prepareMax}`;

        if (preparedSpellCount > prepareMax) {
          spellsClsNames.push("ct-class-spell-manager__info-entry--exceeded");
        }
      }

      spellsExtraNode = (
        <span className="ct-class-spell-manager__info-entry-extra">
          ({knownSpellCount} Known)
        </span>
      );
    } else if (knownSpellsMax) {
      if (knownSpellCount === knownSpellsMax) {
        spellsNode = `${spellDisplayListType} Spells: ${knownSpellCount}`;
      } else {
        spellsNode = `${spellDisplayListType} Spells: ${knownSpellCount}/${knownSpellsMax}`;

        if (knownSpellCount > knownSpellsMax) {
          spellsClsNames.push("ct-class-spell-manager__info-entry--exceeded");
        }
      }
    }

    return (
      <div className="ct-class-spell-manager__info">
        <div className={cantripsClsNames.join(" ")}>
          {cantripsNode}
          {calloutNode}
        </div>
        <div className={spellsClsNames.join(" ")}>
          {spellsNode}
          {spellsExtraNode}
          {calloutNode}
        </div>
        {featureSpellCount > 0 && (
          <div className="ct-class-spell-manager__info-features">
            *{featureSpellCount} spell
            {featureSpellCount !== 1 ? "s" : ""} included from class features.
          </div>
        )}
      </div>
    );
  }

  function renderEmptyActiveSpells(): React.ReactNode {
    return (
      <div className="ct-class-spell-manager__empty">
        {ClassUtils.isSpellbookSpellcaster(charClass) && (
          <React.Fragment>
            You currently have no prepared spells.
          </React.Fragment>
        )}
        {ClassUtils.isPreparedSpellcaster(charClass) && (
          <React.Fragment>
            You currently have no prepared spells. Learn and prepare spells from
            your list of available spells below.
          </React.Fragment>
        )}
        {ClassUtils.isKnownSpellcaster(charClass) && (
          <React.Fragment>
            You currently have no known spells. Learn spells from your list of
            available spells below.
          </React.Fragment>
        )}
      </div>
    );
  }

  function renderActiveSpells(): React.ReactNode {
    return (
      <div className="ct-class-spell-manager__active">
        <SpellManager
          charClassId={ClassUtils.getActiveId(charClass)}
          characterClassId={ClassUtils.getMappingId(charClass)}
          theme={theme}
          isPrepareMaxed={isPrepareMaxed}
          isCantripsKnownMaxed={isCantripsKnownMaxed}
          isSpellsKnownMaxed={isSpellsKnownMaxed}
          hasActiveSpells
          enableSpellRemove={!ClassUtils.isSpellbookSpellcaster(charClass)}
          enablePrepare={false}
          enableUnprepare={true}
          showFilters={false}
          addButtonText={buttonAddText}
          buttonActiveStyle="outline"
          buttonUnprepareText={removeButtonText}
          entityValueLookup={entityValueLookup}
          dataOriginRefData={dataOriginRefData}
          showCustomize={false}
          proficiencyBonus={proficiencyBonus}
        />
      </div>
    );
  }

  function renderActiveSpellsGroup(): React.ReactNode {
    const { collapsedGroups } = state;

    let heading: React.ReactNode = "Prepared Spells";
    if (ClassUtils.isKnownSpellcaster(charClass) && spellCastingLearningStyle !== Constants.SpellCastingLearningStyle.Prepared) {
      heading = "Known Spells";
    }

    let headingNode: React.ReactNode = (
      <CollapsibleHeading>
        {heading}
        <span className="ct-class-spell-manager__heading-extra">
          ({activeSpells.length})
        </span>
      </CollapsibleHeading>
    );

    let headerNode: React.ReactNode = (
      <CollapsibleHeaderContent heading={headingNode} />
    );

    return (
      <Collapsible
        collapsed={collapsedGroups.activeSpells}
        header={headerNode}
        onChangeHandler={handleShowSpellGroup.bind(this, "activeSpells")}
        className="ct-class-spell-manager__group"
      >
        {activeSpells.length > 0
          ? renderActiveSpells()
          : renderEmptyActiveSpells()}
      </Collapsible>
    );
  }

  function renderSpellbook(): React.ReactNode {
    const { collapsedGroups } = state;

    if (!ClassUtils.isSpellbookSpellcaster(charClass)) {
      return null;
    }

    let headerNode: React.ReactNode = (
      <CollapsibleHeaderContent heading="Spellbook" />
    );

    return (
      <Collapsible
        collapsed={collapsedGroups.spellbook}
        header={headerNode}
        onChangeHandler={handleShowSpellGroup.bind(this, "spellbook")}
        className="ct-class-spell-manager__group"
      >
        {isSpellbookEmpty && (
          <div className="ct-class-spell-manager__empty">
            You currently have no known spells. Learn spells from your list of
            available spells below.
          </div>
        )}
        {!isSpellbookEmpty && (
          <React.Fragment>
            {renderSpellListSpellStatus()}
            <SpellManager
              charClassId={ClassUtils.getActiveId(charClass)}
              characterClassId={ClassUtils.getMappingId(charClass)}
              theme={theme}
              isPrepareMaxed={isPrepareMaxed}
              isCantripsKnownMaxed={isCantripsKnownMaxed}
              isSpellsKnownMaxed={isSpellsKnownMaxed}
              enableAdd={false}
              enableSpellRemove={false}
              addButtonText={buttonAddText}
              buttonUnprepareText={removeButtonText}
              entityValueLookup={entityValueLookup}
              dataOriginRefData={dataOriginRefData}
              showCustomize={false}
              proficiencyBonus={proficiencyBonus}
            />
          </React.Fragment>
        )}
      </Collapsible>
    );
  }

  function renderAddSpells(): React.ReactNode {
    const { collapsedGroups } = state;

    let heading: React.ReactNode = "Add Spells";
    if (ClassUtils.isPreparedSpellcaster(charClass)) {
      heading = "Known Spells";
    }

    let headingNode: React.ReactNode = (
      <CollapsibleHeading>
        {heading}
        {doesAvailableSpellsHaveNotifications() && (
          <div className="ct-class-spell-manager__notification">!</div>
        )}
      </CollapsibleHeading>
    );

    let headerNode: React.ReactNode = (
      <CollapsibleHeaderContent heading={headingNode} />
    );

    return (
      <Collapsible
        collapsed={collapsedGroups.addSpells}
        header={headerNode}
        onChangeHandler={handleShowSpellGroup.bind(this, "addSpells")}
        className="ct-class-spell-manager__group"
      >
        {renderSpellListSpellStatus()}
        <SpellManager
          charClassId={ClassUtils.getActiveId(charClass)}
          characterClassId={ClassUtils.getMappingId(charClass)}
          theme={theme}
          isPrepareMaxed={isPrepareMaxed}
          isCantripsKnownMaxed={isCantripsKnownMaxed}
          isSpellsKnownMaxed={isSpellsKnownMaxed}
          shouldFetch
          enablePrepare={!ClassUtils.isSpellbookSpellcaster(charClass)}
          enableUnprepare={!ClassUtils.isSpellbookSpellcaster(charClass)}
          buttonUnprepareText={removeButtonText}
          addButtonText={buttonAddText}
          entityValueLookup={entityValueLookup}
          dataOriginRefData={dataOriginRefData}
          showExpandedType={true}
          showCustomize={false}
          proficiencyBonus={proficiencyBonus}
        />
      </Collapsible>
    );
  }
  return (
    <div className="ct-class-spell-manager">
      <div className="ct-class-spell-manager__header">
        <div className="ct-class-spell-manager__portrait">
          <img
            className="ct-class-spell-manager__portrait-img"
            src={ClassUtils.getPortraitUrl(charClass)}
            alt=""
          />
        </div>
        <div className="ct-class-spell-manager__heading">
          {ClassUtils.getName(charClass)}
        </div>
      </div>
      {renderAddSpells()}
      {renderActiveSpellsGroup()}
      {renderSpellbook()}
    </div>
  );
}
