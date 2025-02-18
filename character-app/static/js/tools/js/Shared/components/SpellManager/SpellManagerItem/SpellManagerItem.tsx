import React from "react";

import {
  Collapsible,
  CollapsibleHeaderContent,
} from "@dndbeyond/character-components/es";
import {
  CharacterTheme,
  Constants,
  DataOriginRefData,
  EntityValueLookup,
  RuleData,
  SpellCasterInfo,
  SpellManager,
} from "@dndbeyond/character-rules-engine";

import { SpellName } from "~/components/SpellName";

import SpellDetail from "../../SpellDetail";
import { RemoveButton, ThemeButton } from "../../common/Button";

interface Props {
  spell: SpellManager;
  buttonUnprepareText?: string;
  buttonActiveStyle?: string;
  enableSpellRemove: boolean;
  isPrepareMaxed: boolean;
  isCantripsKnownMaxed: boolean;
  isSpellsKnownMaxed: boolean;
  addButtonText: string;
  enableAdd: boolean;
  enablePrepare: boolean;
  enableUnprepare: boolean;
  showExpandedType: boolean;
  showCustomize: boolean;
  onPrepare: () => void;
  onUnprepare: () => void;
  onRemove: () => void;
  onAdd: () => void;
  spellCasterInfo: SpellCasterInfo;
  ruleData: RuleData;
  entityValueLookup: EntityValueLookup;
  dataOriginRefData: DataOriginRefData;
  proficiencyBonus: number;
  theme: CharacterTheme;
}

export default function SpellManagerItem({
  spell,
  isPrepareMaxed,
  isCantripsKnownMaxed,
  isSpellsKnownMaxed,
  showExpandedType,
  showCustomize,
  onPrepare,
  onUnprepare,
  onRemove,
  onAdd,
  spellCasterInfo,
  ruleData,
  entityValueLookup,
  dataOriginRefData,
  proficiencyBonus,
  theme,
  enableSpellRemove = true,
  enableAdd = true,
  enablePrepare = true,
  enableUnprepare = true,
  buttonUnprepareText = "Prepared",
  addButtonText = "Prepare",
  buttonActiveStyle = "",
}: Props) {
  function handlePrepareToggle(): void {
    if (spell.isPrepared()) {
      onUnprepare();
    } else {
      onPrepare();
    }
  }

  function handleRemove(): void {
    onRemove();
  }

  function handleAdd(): void {
    onAdd();
  }

  function renderButtons(classNames: Array<string>): React.ReactNode {
    const alwaysPrepared = spell.isAlwaysPrepared();
    const isPrepared = spell.isPrepared();
    const canRemove = spell.canRemove();
    const canPrepare = spell.canPrepare();
    const canAdd = spell.canAdd();
    const isCantrip = spell.isCantrip();

    let isAddDisabled: boolean = false;
    if (isCantrip && isCantripsKnownMaxed) {
      isAddDisabled = true;
    }
    if (!isCantrip && isSpellsKnownMaxed) {
      isAddDisabled = true;
    }

    let showPrepare: boolean =
      !alwaysPrepared && canPrepare && (enablePrepare || enableUnprepare);

    let showRemove: boolean =
      canRemove &&
      (enableSpellRemove || (spell.isSpellbookCaster() && isCantrip));

    if (isCantrip) {
      addButtonText = Constants.SpellCastingLearningStyleAddText[Constants.SpellCastingLearningStyle.Learned];
      buttonUnprepareText = Constants.SpellCastingLearningStyleRemoveText[Constants.SpellCastingLearningStyle.Learned];
    }

    return (
      <div className={classNames.join(" ")}>
        {alwaysPrepared && (
          <div className="ct-spell-manager__spell-always">Always Prepared</div>
        )}
        {showPrepare && (
          <ThemeButton
            size="small"
            disabled={isPrepareMaxed && !isPrepared}
            style={isPrepared ? buttonActiveStyle : "outline"}
            onClick={handlePrepareToggle}
            stopPropagation={true}
          >
            {isPrepared ? buttonUnprepareText : addButtonText}
          </ThemeButton>
        )}
        {showRemove && (
          <RemoveButton onClick={handleRemove} style={buttonActiveStyle}>
            {buttonUnprepareText}
          </RemoveButton>
        )}
        {enableAdd && canAdd && (
          <ThemeButton
            size="small"
            onClick={handleAdd}
            disabled={isAddDisabled}
            style={"outline"}
            stopPropagation={true}
          >
            {addButtonText}
          </ThemeButton>
        )}
      </div>
    );
  }

  function renderHeader(): React.ReactNode {
    return (
      <CollapsibleHeaderContent
        heading={
          <SpellName
            spell={spell.spell}
            showExpandedType={showExpandedType}
            dataOriginRefData={dataOriginRefData}
            showLegacy={true}
          />
        }
        callout={renderButtons(["ct-spell-manager__spell-header-actions"])}
      />
    );
  }

  return (
    <Collapsible
      layoutType={"minimal"}
      header={renderHeader()}
      className="ct-spell-manager__spell"
    >
      <SpellDetail
        theme={theme}
        spell={spell.spell}
        isPreparedMaxed={isPrepareMaxed}
        enableCaster={false}
        spellCasterInfo={spellCasterInfo}
        ruleData={ruleData}
        onPrepareToggle={handlePrepareToggle}
        onRemove={handleRemove}
        entityValueLookup={entityValueLookup}
        showCustomize={showCustomize}
        proficiencyBonus={proficiencyBonus}
      />
    </Collapsible>
  );
}
