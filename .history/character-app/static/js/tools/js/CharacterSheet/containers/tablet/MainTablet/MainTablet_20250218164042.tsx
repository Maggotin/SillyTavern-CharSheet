import { visuallyHidden } from "@mui/utils";
import { useSelector } from "react-redux";

import {
  AbilitySummary,
  CampaignSummary,
  ManageIcon,
} from "@dndbeyond/character-components/es";
import {
  AbilityManager,
  rulesEngineSelectors,
  Skill,
  SkillUtils,
} from "../../rules-engine/es";

import { useSidebar } from "~/contexts/Sidebar";
import { useAbilities } from "~/hooks/useAbilities";

import { PaneComponentEnum } from "../../../../../../subApps/sheet/components/Sidebar/types";
import {
  appEnvSelectors,
  characterRollContextSelectors,
} from "../../../../Shared/selectors";
import { PaneIdentifierUtils } from "../../../../Shared/utils";
import ProficiencyGroupsBox from "../../../components/ProficiencyGroupsBox";
import SavingThrowsBox from "../../../components/SavingThrowsBox";
import SensesBox from "../../../components/SensesBox";
import SkillsBox from "../../../components/SkillsBox";
import SubsectionTablet from "../../../components/SubsectionTablet";

export default function MainTablet() {
  const abilities = useAbilities();

  const {
    pane: { paneHistoryStart },
  } = useSidebar();

  const preferences = useSelector(rulesEngineSelectors.getCharacterPreferences);
  const savingThrowDiceAdjustments = useSelector(
    rulesEngineSelectors.getSavingThrowDiceAdjustments
  );
  const situationalBonusSavingThrowsLookup = useSelector(
    rulesEngineSelectors.getSituationalBonusSavingThrowsLookup
  );
  const deathSaveInfo = useSelector(rulesEngineSelectors.getDeathSaveInfo);
  const passivePerception = useSelector(
    rulesEngineSelectors.getPassivePerception
  );
  const passiveInvestigation = useSelector(
    rulesEngineSelectors.getPassiveInvestigation
  );
  const passiveInsight = useSelector(rulesEngineSelectors.getPassiveInsight);
  const senses = useSelector(rulesEngineSelectors.getSenseInfo);
  const campaign = useSelector(rulesEngineSelectors.getCampaign);
  const skills = useSelector(rulesEngineSelectors.getSkills);
  const valueLookup = useSelector(rulesEngineSelectors.getCharacterValueLookup);
  const customSkills = useSelector(rulesEngineSelectors.getCustomSkills);
  const proficiencyGroups = useSelector(
    rulesEngineSelectors.getProficiencyGroups
  );
  const dimensions = useSelector(appEnvSelectors.getDimensions);
  const theme = useSelector(rulesEngineSelectors.getCharacterTheme);
  const isReadonly = useSelector(appEnvSelectors.getIsReadonly);
  const diceEnabled = useSelector(appEnvSelectors.getDiceEnabled);
  const ruleData = useSelector(rulesEngineSelectors.getRuleData);
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

  const handleProficienciesManageShow = (): void => {
    if (!isReadonly) {
      paneHistoryStart(PaneComponentEnum.PROFICIENCIES);
    }
  };

  const handleCampaignShow = (): void => {
    paneHistoryStart(PaneComponentEnum.CAMPAIGN);
  };

  const handleCustomSkillClick = (skill: Skill): void => {
    paneHistoryStart(
      PaneComponentEnum.CUSTOM_SKILL,
      PaneIdentifierUtils.generateCustomSkill(SkillUtils.getId(skill))
    );
  };

  const handleSkillsShow = (): void => {
    paneHistoryStart(PaneComponentEnum.SKILLS);
  };

  const handleSkillClick = (skill: Skill): void => {
    paneHistoryStart(
      PaneComponentEnum.SKILL,
      PaneIdentifierUtils.generateSkill(SkillUtils.getId(skill))
    );
  };

  return (
    <SubsectionTablet name="Main">
      <div className="ct-main-tablet">
        {campaign && (
          <CampaignSummary
            campaign={campaign}
            onCampaignShow={handleCampaignShow}
            className={
              theme.isDarkMode
                ? "ct-main-tablet__campaign-button--dark-mode"
                : ""
            }
            theme={theme}
            gameLog={gameLog}
          />
        )}
        <section className="ct-main-tablet__abilities">
          <h2 style={visuallyHidden}>Abilities</h2>
          {abilities.map((ability) => (
            <div className="ct-main-tablet__ability" key={ability.getStatKey()}>
              <AbilitySummary
                theme={theme}
                ability={ability}
                preferences={preferences}
                onClick={handleAbilitySummaryClick}
                diceEnabled={diceEnabled}
                rollContext={characterRollContext}
              />
            </div>
          ))}
        </section>
        <div className="ct-main-tablet__large-boxes">
          <div className="ct-main-tablet__large-boxes-bucket">
            <div className="ct-main-tablet__large-box">
              <SavingThrowsBox
                abilities={abilities}
                ruleData={ruleData}
                savingThrowDiceAdjustments={savingThrowDiceAdjustments}
                situationalBonusSavingThrowsLookup={
                  situationalBonusSavingThrowsLookup
                }
                deathSaveInfo={deathSaveInfo}
                onAbilityClick={handleAbilityClick}
                onClick={handleSavingThrowsClick}
                dimensions={dimensions}
                theme={theme}
                diceEnabled={diceEnabled}
                rollContext={characterRollContext}
              />
              <div className="ct-main-tablet__large-box-footer">
                <ManageIcon
                  onClick={handleSavingThrowsClick}
                  enableTooltip={false}
                  theme={theme}
                >
                  Saving Throws
                </ManageIcon>
              </div>
            </div>
            <div className="ct-main-tablet__large-box">
              <SensesBox
                senses={senses}
                passiveInsight={Number(passiveInsight)}
                passiveInvestigation={Number(passiveInvestigation)}
                passivePerception={Number(passivePerception)}
                onClick={handleSensesManageShow}
                dimensions={dimensions}
                theme={theme}
              />
              <div className="ct-main-tablet__large-box-footer">
                <ManageIcon
                  onClick={handleSensesManageShow}
                  enableTooltip={false}
                  theme={theme}
                >
                  Senses
                </ManageIcon>
              </div>
            </div>
            <div className="ct-main-tablet__large-box">
              <ProficiencyGroupsBox
                dimensions={dimensions}
                theme={theme}
                proficiencyGroups={proficiencyGroups}
                onClick={handleProficienciesManageShow}
              />
              <div className="ct-main-tablet__large-box-footer">
                <ManageIcon
                  onClick={handleProficienciesManageShow}
                  enableTooltip={false}
                  showIcon={!isReadonly}
                  theme={theme}
                >
                  Proficiencies & Training
                </ManageIcon>
              </div>
            </div>
          </div>
          <div className="ct-main-tablet__large-boxes-bucket">
            <div className="ct-main-tablet__large-box">
              <SkillsBox
                skills={skills}
                customSkills={customSkills}
                valueLookup={valueLookup}
                onCustomSkillClick={handleCustomSkillClick}
                onSkillClick={handleSkillClick}
                onEmptyClick={handleSkillsShow}
                dimensions={dimensions}
                theme={theme}
                diceEnabled={diceEnabled}
                ruleData={ruleData}
                rollContext={characterRollContext}
              />
              <div className="ct-main-tablet__large-box-footer">
                <ManageIcon
                  onClick={handleSkillsShow}
                  enableTooltip={false}
                  theme={theme}
                >
                  Skills
                </ManageIcon>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SubsectionTablet>
  );
}
