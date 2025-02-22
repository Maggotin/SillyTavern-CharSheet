import { visuallyHidden } from "@mui/utils";
import { useSelector } from "react-redux";

import {
  AbilitySummary,
  CampaignSummary,
  SavingThrowsSummary,
} from "@dndbeyond/character-components/es";
import {
  AbilityManager,
  DataOrigin,
  rulesEngineSelectors,
} from "@dndbeyond/character-rules-engine/es";

import { useSidebar } from "~/contexts/Sidebar";
import { useAbilities } from "~/hooks/useAbilities";

import { getDataOriginComponentInfo } from "../../../../../../subApps/sheet/components/Sidebar/helpers/paneUtils";
import { PaneComponentEnum } from "../../../../../../subApps/sheet/components/Sidebar/types";
import {
  appEnvSelectors,
  characterRollContextSelectors,
} from "../../../../Shared/selectors";
import { PaneIdentifierUtils } from "../../../../Shared/utils";
import MobileDivider from "../../../components/MobileDivider";
import SavingThrowsDetails from "../../../components/SavingThrowsDetails";
import Senses from "../../../components/Senses";
import SubsectionMobile from "../../../components/SubsectionMobile";

export default function MainMobile() {
  const abilities = useAbilities();
  const {
    pane: { paneHistoryStart, paneHistoryPush },
  } = useSidebar();
  const preferences = useSelector(rulesEngineSelectors.getCharacterPreferences);
  const savingThrowDiceAdjustments = useSelector(
    rulesEngineSelectors.getSavingThrowDiceAdjustments
  ); // TODO: GFS move to mangers
  const situationalBonusSavingThrowsLookup = useSelector(
    rulesEngineSelectors.getSituationalBonusSavingThrowsLookup
  ); // TODO: GFS move to mangers
  const passivePerception = useSelector(
    rulesEngineSelectors.getPassivePerception
  ); // TODO: GFS move to mangers
  const passiveInvestigation = useSelector(
    rulesEngineSelectors.getPassiveInvestigation
  ); // TODO: GFS move to mangers
  const passiveInsight = useSelector(rulesEngineSelectors.getPassiveInsight); // TODO: GFS move to mangers
  const senses = useSelector(rulesEngineSelectors.getSenseInfo); // TODO: GFS move to mangers
  const ruleData = useSelector(rulesEngineSelectors.getRuleData);
  const campaign = useSelector(rulesEngineSelectors.getCampaign);
  const theme = useSelector(rulesEngineSelectors.getCharacterTheme);
  const deathSaveInfo = useSelector(rulesEngineSelectors.getDeathSaveInfo);
  const diceEnabled = useSelector(appEnvSelectors.getDiceEnabled);
  const characterRollContext = useSelector(
    characterRollContextSelectors.getCharacterRollContext
  );
  const gameLog = useSelector(appEnvSelectors.getGameLog);

  const handleSensesManageShow = (): void => {
    paneHistoryStart(PaneComponentEnum.SENSE_MANAGE);
  };

  const handleSavingThrowsClick = (): void => {
    paneHistoryStart(PaneComponentEnum.SAVING_THROWS);
  };

  const handleAbilitySummaryClick = (ability: AbilityManager): void => {
    paneHistoryStart(
      PaneComponentEnum.ABILITY,
      PaneIdentifierUtils.generateAbility(ability)
    );
  };

  const handleAbilityClick = (ability: AbilityManager): void => {
    paneHistoryStart(
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

  const handleCampaignShow = (): void => {
    paneHistoryStart(PaneComponentEnum.CAMPAIGN);
  };

  return (
    <SubsectionMobile name="Main">
      <div
        className={`ct-main-mobile ${
          theme.isDarkMode ? "ct-main-mobile--dark-mode" : ""
        }`}
      >
        {campaign && (
          <CampaignSummary
            campaign={campaign}
            onCampaignShow={handleCampaignShow}
            className={
              theme.isDarkMode
                ? "ct-main-mobile__campaign-button--dark-mode"
                : ""
            }
            theme={theme}
            gameLog={gameLog}
          />
        )}
        <section className="ct-main-mobile__abilities">
          <h2 style={visuallyHidden}>Ability Scores</h2>
          {abilities.map((ability) => (
            <div className="ct-main-mobile__ability" key={ability.getStatKey()}>
              <AbilitySummary
                ability={ability}
                preferences={preferences}
                theme={theme}
                onClick={handleAbilitySummaryClick}
                diceEnabled={diceEnabled}
                rollContext={characterRollContext}
              />
            </div>
          ))}
        </section>
        <MobileDivider
          label="Saving Throws"
          onClick={handleSavingThrowsClick}
          theme={theme}
        />
        <section
          className={`ct-main-mobile__saving-throws ${
            theme.isDarkMode ? "ct-main-mobile__saving-throws--dark-mode" : ""
          }`}
        >
          <h2 style={visuallyHidden}>Saving Throws</h2>
          <SavingThrowsSummary
            abilities={abilities}
            situationalBonusSavingThrowsLookup={
              situationalBonusSavingThrowsLookup
            }
            onClick={handleAbilityClick}
            diceEnabled={diceEnabled}
            theme={theme}
            rollContext={characterRollContext}
          />
          <SavingThrowsDetails
            theme={theme}
            ruleData={ruleData}
            savingThrowDiceAdjustments={savingThrowDiceAdjustments}
            onDataOriginClick={handleDataOriginClick}
            deathSaveInfo={deathSaveInfo}
          />
        </section>
        <MobileDivider isEnd={true} theme={theme} />
        <MobileDivider
          label="Senses"
          onClick={handleSensesManageShow}
          theme={theme}
        />
        <h2 style={visuallyHidden}>Senses</h2>
        <Senses
          senses={senses}
          theme={theme}
          passiveInsight={Number(passiveInsight)}
          passiveInvestigation={Number(passiveInvestigation)}
          passivePerception={Number(passivePerception)}
          onClick={handleSensesManageShow}
        />
        <MobileDivider isEnd={true} theme={theme} />
      </div>
    </SubsectionMobile>
  );
}
