import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import {
  FeatureManager,
  FeaturesManager,
  rulesEngineSelectors,
} from "@dndbeyond/character-rules-engine/es";

import { useSidebar } from "~/contexts/Sidebar";
import { PaneComponentEnum } from "~/subApps/sheet/components/Sidebar/types";
import { PaneIdentifierUtils } from "~/tools/js/Shared/utils";
import { Snippet } from "~/tools/js/smartComponents";

import { CharacterFeaturesManagerContext } from "../../../Shared/managers/CharacterFeaturesManagerContext";

interface Props {
  // onActionUseSet: (action: Action, uses: number) => void;
  // onActionClick: (action: Action) => void;
  // onSpellClick: (spell: Spell) => void;
  // onSpellUseSet: (spell: Spell, uses: number) => void;
  // onFeatureClick: (feat: FeatManager) => void;
  // snippetData: SnippetData;
  // ruleData: RuleData;
  // abilityLookup: AbilityLookup;
  // dataOriginRefData: DataOriginRefData;
  // isReadonly: boolean;
  // proficiencyBonus: number;
  // theme: CharacterTheme;
}
export const BlessingsDetail: React.FC<Props> = () => {
  const { characterFeaturesManager } = useContext(
    CharacterFeaturesManagerContext
  );
  const {
    pane: { paneHistoryStart },
  } = useSidebar();

  const [blessings, setBlessings] = useState<Array<FeatureManager>>([]);

  useEffect(() => {
    async function onUpdate() {
      const blessings = await characterFeaturesManager.getBlessings();
      setBlessings(blessings);
    }
    return FeaturesManager.subscribeToUpdates({ onUpdate });
  }, [setBlessings]);

  const snippetData = useSelector(rulesEngineSelectors.getSnippetData);
  // const ruleData = useSelector(rulesEngineSelectors.getRuleData);
  // const abilityLookup = useSelector(rulesEngineSelectors.getAbilityLookup);
  // const dataOriginRefData = useSelector(rulesEngineSelectors.getDataOriginRefData);
  // const isReadonly = useSelector(appEnvSelectors.getIsReadonly);
  const proficiencyBonus = useSelector(
    rulesEngineSelectors.getProficiencyBonus
  );
  const theme = useSelector(rulesEngineSelectors.getCharacterTheme);

  return (
    <div className="ct-blessings-detail">
      {blessings.length ? (
        <React.Fragment>
          {blessings.map((blessing) => (
            <div
              onClick={(evt: React.MouseEvent) => {
                evt.stopPropagation();
                evt.nativeEvent.stopImmediatePropagation();

                paneHistoryStart(
                  PaneComponentEnum.BLESSING_DETAIL,
                  PaneIdentifierUtils.generateBlessing(blessing.getId())
                );
              }}
              className={"ct-feature-snippet"}
              key={blessing.getId()}
            >
              <div
                className={`ct-feature-snippet__heading ${
                  theme?.isDarkMode
                    ? "ct-feature-snippet__heading--dark-mode"
                    : ""
                }`}
              >
                {blessing.getName()}
              </div>
              <div className="ct-feature-snippet__content">
                <Snippet
                  snippetData={snippetData}
                  proficiencyBonus={proficiencyBonus}
                  theme={theme}
                >
                  {blessing.getDescription()}
                </Snippet>
              </div>
            </div>
          ))}
        </React.Fragment>
      ) : (
        <div
          className={`ct-blessings-detail__default ${
            theme.isDarkMode ? "ct-blessings-detail__default--dark-mode" : ""
          }`}
        >
          <p>There is nothing here.</p>
        </div>
      )}
    </div>
  );
};
export default BlessingsDetail;
