import { useSelector } from "react-redux";

import { ManageIcon } from "../../character-components/es";
import {
  AbilityManager,
  rulesEngineSelectors,
} from "../../character-rules-engine/es";

import { useSidebar } from "~/contexts/Sidebar";
import { useAbilities } from "~/hooks/useAbilities";
import { PaneComponentEnum } from "~/subApps/sheet/components/Sidebar/types";

import {
  Subsection,
  SubsectionFooter,
} from "../../../Shared/components/Subsection";
import {
  appEnvSelectors,
  characterRollContextSelectors,
} from "../../../Shared/selectors";
import { PaneIdentifierUtils } from "../../../Shared/utils";
import SavingThrowsBox from "../../components/SavingThrowsBox";

export default function SavingThrowsDesktop() {
  const abilities = useAbilities();

  const {
    pane: { paneHistoryStart },
  } = useSidebar();
  const ruleData = useSelector(rulesEngineSelectors.getRuleData);
  const savingThrowDiceAdjustments = useSelector(
    rulesEngineSelectors.getSavingThrowDiceAdjustments
  ); // TODO: GFS move to mangers
  const situationalBonusSavingThrowsLookup = useSelector(
    rulesEngineSelectors.getSituationalBonusSavingThrowsLookup
  ); // TODO: GFS move to mangers
  const deathSaveInfo = useSelector(rulesEngineSelectors.getDeathSaveInfo);
  const dimensions = useSelector(appEnvSelectors.getDimensions);
  const theme = useSelector(rulesEngineSelectors.getCharacterTheme);
  const isReadonly = useSelector(appEnvSelectors.getIsReadonly);
  const diceEnabled = useSelector(appEnvSelectors.getDiceEnabled);
  const characterRollContext = useSelector(
    characterRollContextSelectors.getCharacterRollContext
  );
  const handleManageShow = (): void => {
    paneHistoryStart(PaneComponentEnum.SAVING_THROWS);
  };

  const handleAbilityClick = (ability: AbilityManager): void => {
    paneHistoryStart(
      PaneComponentEnum.ABILITY_SAVING_THROW,
      PaneIdentifierUtils.generateAbilitySavingThrows(ability.getId())
    );
  };

  return (
    <Subsection name="Abilities">
      <SavingThrowsBox
        ruleData={ruleData}
        abilities={abilities}
        savingThrowDiceAdjustments={savingThrowDiceAdjustments}
        situationalBonusSavingThrowsLookup={situationalBonusSavingThrowsLookup}
        deathSaveInfo={deathSaveInfo}
        onAbilityClick={handleAbilityClick}
        onInfoClick={handleManageShow}
        dimensions={dimensions}
        theme={theme}
        diceEnabled={diceEnabled}
        rollContext={characterRollContext}
      />
      <SubsectionFooter>
        <ManageIcon
          onClick={handleManageShow}
          tooltip={isReadonly ? "View" : "Manage"}
          theme={theme}
        >
          Saving Throws
        </ManageIcon>
      </SubsectionFooter>
    </Subsection>
  );
}
