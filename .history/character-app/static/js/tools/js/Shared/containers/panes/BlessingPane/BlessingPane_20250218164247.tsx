import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import {
  rulesEngineSelectors,
  FeatureManager,
} from "../../character-rules-engine/es";

import { Header } from "~/subApps/sheet/components/Sidebar/components/Header";
import { PaneInitFailureContent } from "~/subApps/sheet/components/Sidebar/components/PaneInitFailureContent";
import { PaneIdentifiersBlessing } from "~/subApps/sheet/components/Sidebar/types";
import { Snippet } from "~/tools/js/smartComponents";

import { CharacterFeaturesManagerContext } from "../../../managers/CharacterFeaturesManagerContext";

interface Props {
  identifiers: PaneIdentifiersBlessing | null;
}
const BlessingPane: React.FC<Props> = ({ identifiers }) => {
  const { characterFeaturesManager } = useContext(
    CharacterFeaturesManagerContext
  );

  const snippetData = useSelector(rulesEngineSelectors.getSnippetData);
  // const ruleData = useSelector(rulesEngineSelectors.getRuleData);
  // const abilityLookup = useSelector(rulesEngineSelectors.getAbilityLookup);
  // const dataOriginRefData = useSelector(rulesEngineSelectors.getDataOriginRefData);
  // const isReadonly = useSelector(appEnvSelectors.getIsReadonly);
  const proficiencyBonus = useSelector(
    rulesEngineSelectors.getProficiencyBonus
  );
  const theme = useSelector(rulesEngineSelectors.getCharacterTheme);

  const [blessing, setBlessing] = useState<FeatureManager | null>(undefined!);

  useEffect(() => {
    const id = identifiers?.id ?? null;

    if (id) {
      const blessing = characterFeaturesManager.getBlessing(id);
      setBlessing(blessing);
    }
  }, [identifiers, characterFeaturesManager]);

  if (blessing === null) {
    return <PaneInitFailureContent />;
  }

  return blessing ? (
    <div className="ct-blessing-pane" key={blessing.getId()}>
      <Header>{blessing.getName()}</Header>
      <Snippet
        snippetData={snippetData}
        proficiencyBonus={proficiencyBonus}
        theme={theme}
      >
        {blessing.getDescription()}
      </Snippet>
    </div>
  ) : null;
};

export default BlessingPane;
