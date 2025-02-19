import { visuallyHidden } from "@mui/utils";
import { useDispatch, useSelector } from "react-redux";

import { AbilitySummary } from "@dndbeyond/character-components/es";
import {
  AbilityManager,
  characterActions,
  rulesEngineSelectors,
} from "@dndbeyond/character-rules-engine/es";

import { useSidebar } from "~/contexts/Sidebar";
import { useAbilities } from "~/hooks/useAbilities";
import { HitPointsBox } from "~/subApps/sheet/components/HitPointsBox/HitPointsBox";
import { Inspiration } from "~/subApps/sheet/components/Inspiration";
import { PaneComponentEnum } from "~/subApps/sheet/components/Sidebar/types";

import {
  appEnvSelectors,
  characterRollContextSelectors,
} from "../../../Shared/selectors";
import { PaneIdentifierUtils } from "../../../Shared/utils";
import ProficiencyBonusBox from "../../components/ProficiencyBonusBox";
import SpeedBox from "../../components/SpeedBox";

export default function QuickInfo() {
  const abilities = useAbilities();
  const dispatch = useDispatch();
  const {
    pane: { paneHistoryStart },
  } = useSidebar();

  const proficiencyBonus = useSelector(
    rulesEngineSelectors.getProficiencyBonus
  );
  const speeds = useSelector(rulesEngineSelectors.getCurrentCarriedWeightSpeed);
  const preferences = useSelector(rulesEngineSelectors.getCharacterPreferences);
  const inspiration = useSelector(rulesEngineSelectors.getInspiration);
  const theme = useSelector(rulesEngineSelectors.getCharacterTheme);
  const isReadonly = useSelector(appEnvSelectors.getIsReadonly);
  const ruleData = useSelector(rulesEngineSelectors.getRuleData);
  const diceEnabled = useSelector(appEnvSelectors.getDiceEnabled);
  const characterRollContext = useSelector(
    characterRollContextSelectors.getCharacterRollContext
  );

  const handleProficiencyBonusClick = (): void => {
    paneHistoryStart(PaneComponentEnum.PROFICIENCY_BONUS);
  };

  const handleInspirationLabelClick = (): void => {
    paneHistoryStart(PaneComponentEnum.INSPIRATION);
  };

  const handleSpeedsClick = (): void => {
    paneHistoryStart(PaneComponentEnum.SPEED_MANAGE);
  };

  const handleToggleInspiration = (): void => {
    dispatch(characterActions.inspirationSet(!inspiration));
  };

  const handleAbilitySummaryClick = (ability: AbilityManager): void => {
    paneHistoryStart(
      PaneComponentEnum.ABILITY,
      PaneIdentifierUtils.generateAbility(ability)
    );
  };

  let inspirationClasses = ["ct-quick-info__inspiration-status"];
  if (inspiration) {
    inspirationClasses.push("ct-quick-info__inspiration-status--active");
  } else {
    inspirationClasses.push("ct-quick-info__inspiration-status--inactive");
  }

  return (
    <div className="ct-quick-info">
      <section className="ct-quick-info__abilities">
        <h2 style={visuallyHidden}>Ability Scores</h2>
        {abilities.map((ability) => (
          <div className="ct-quick-info__ability" key={ability.getStatKey()}>
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
      <div className="ct-quick-info__boxstcs-quick-info__box--proficiency">
        <ProficiencyBonusBox
          theme={theme}
          proficiencyBonus={proficiencyBonus}
          onClick={handleProficiencyBonusClick}
        />
      </div>
      <div className="ct-quick-info__boxstcs-quick-info__box--speed">
        <SpeedBox
          speeds={speeds}
          preferences={preferences}
          theme={theme}
          ruleData={ruleData}
          onClick={handleSpeedsClick}
        />
      </div>
      <section className="ct-quick-info__inspiration">
        <h2 style={visuallyHidden}>Inspiration</h2>
        <Inspiration
          inspiration={!!inspiration}
          onToggle={handleToggleInspiration}
          onClick={handleInspirationLabelClick}
          isInteractive={!isReadonly}
        />
      </section>
      <section className="ct-quick-info__health">
        <HitPointsBox />
      </section>
    </div>
  );
}
