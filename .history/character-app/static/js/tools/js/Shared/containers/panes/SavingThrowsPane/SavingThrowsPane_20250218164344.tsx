import React from "react";
import { useSelector } from "react-redux";

import { SavingThrowsSummary } from "../../character-components/es";
import {
  AbilityManager,
  Constants,
  DataOrigin,
  RuleDataUtils,
  rulesEngineSelectors,
} from "../../character-rules-engine/es";

import { HtmlContent } from "~/components/HtmlContent";
import { useSidebar } from "~/contexts/Sidebar";
import { useAbilities } from "~/hooks/useAbilities";
import { Header } from "~/subApps/sheet/components/Sidebar/components/Header";
import { Heading } from "~/subApps/sheet/components/Sidebar/components/Heading";
import { getDataOriginComponentInfo } from "~/subApps/sheet/components/Sidebar/helpers/paneUtils";
import { PaneComponentEnum } from "~/subApps/sheet/components/Sidebar/types";

import SavingThrowsDetails from "../../../../CharacterSheet/components/SavingThrowsDetails";
import { characterRollContextSelectors } from "../../../selectors";
import { PaneIdentifierUtils } from "../../../utils";

export default function SavingThrowsPane() {
  const abilities = useAbilities();

  const ruleData = useSelector(rulesEngineSelectors.getRuleData);
  const situationalBonusSavingThrowsLookup = useSelector(
    rulesEngineSelectors.getSituationalBonusSavingThrowsLookup
  );
  const savingThrowDiceAdjustments = useSelector(
    rulesEngineSelectors.getSavingThrowDiceAdjustments
  );
  const deathSaveInfo = useSelector(rulesEngineSelectors.getDeathSaveInfo);
  const theme = useSelector(rulesEngineSelectors.getCharacterTheme);
  const characterRollContext = useSelector(
    characterRollContextSelectors.getCharacterRollContext
  );

  const {
    pane: { paneHistoryPush },
  } = useSidebar();

  const handleAbilityClick = (ability: AbilityManager): void => {
    paneHistoryPush(
      PaneComponentEnum.ABILITY_SAVING_THROW,
      PaneIdentifierUtils.generateAbilitySavingThrows(ability.getId())
    );
  };

  const handleDataOriginClick = (dataOrigin: DataOrigin): void => {
    let component = getDataOriginComponentInfo(dataOrigin);
    if (component.type !== PaneComponentEnum.ERROR_404) {
      paneHistoryPush(component.type, component.identifiers);
    }
  };

  const renderDescription = (): React.ReactNode => {
    let rulesText = RuleDataUtils.getRule(
      Constants.RuleKeyEnum.SAVING_THROWS,
      ruleData
    );
    if (rulesText === null || rulesText.description === null) {
      return null;
    }

    return (
      <HtmlContent
        className="ct-saving-throws-pane__description"
        html={rulesText.description}
        withoutTooltips
      />
    );
  };

  return (
    <div className="ct-saving-throws-pane">
      <Header>Saving Throws</Header>
      <SavingThrowsSummary
        abilities={abilities}
        situationalBonusSavingThrowsLookup={situationalBonusSavingThrowsLookup}
        onClick={handleAbilityClick}
        // diceEnabled={diceEnabled} // This would be cool but will take a bit of work
        theme={theme}
        rollContext={characterRollContext}
      />
      <div className="ct-saving-throws-pane__details">
        <Heading>Saving Throw Modifiers</Heading>
        <SavingThrowsDetails
          theme={theme}
          ruleData={ruleData}
          savingThrowDiceAdjustments={savingThrowDiceAdjustments}
          deathSaveInfo={deathSaveInfo}
          onDataOriginClick={handleDataOriginClick}
        />
      </div>
      {renderDescription()}
    </div>
  );
}
