import { visuallyHidden } from "@mui/utils";
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  rulesEngineSelectors,
  ClassUtils,
  FeatureUtils,
  InfusionChoiceUtils,
  RacialTrait,
  RacialTraitUtils,
  FeaturesManager,
  FeatManager,
  Action,
  ActionUtils,
  Spell,
  SpellUtils,
} from "@dndbeyond/character-rules-engine/es";

import { TabFilter } from "~/components/TabFilter";
import { useFeatureFlags } from "~/contexts/FeatureFlag";
import { useSidebar } from "~/contexts/Sidebar";
import { PaneComponentEnum } from "~/subApps/sheet/components/Sidebar/types";
import { SpeciesDetail } from "~/subApps/sheet/components/SpeciesDetail";
import { ThemeButton } from "~/tools/js/Shared/components/common/Button";

import {
  handleActionUseSet,
  handleSpellUseSet,
} from "../../../../../handlers/commonHandlers";
import { CharacterFeaturesManagerContext } from "../../../Shared/managers/CharacterFeaturesManagerContext";
import { appEnvSelectors } from "../../../Shared/selectors";
import { PaneIdentifierUtils } from "../../../Shared/utils";
import BlessingsDetail from "../../components/BlessingsDetail";
import ClassesDetail from "../../components/ClassesDetail";
import ContentGroup from "../../components/ContentGroup";
import FeatsDetail from "../../components/FeatsDetail";

//TODO we should break this file out into seperate components rather than have them all in one file

const SpeciesTraitsGroup: React.FC<{}> = () => {
  const dispatch = useDispatch();
  const { characterFeaturesManager } = useContext(
    CharacterFeaturesManagerContext
  );

  const {
    pane: { paneHistoryStart },
  } = useSidebar();

  const snippetData = useSelector(rulesEngineSelectors.getSnippetData);
  const ruleData = useSelector(rulesEngineSelectors.getRuleData);
  const abilityLookup = useSelector(rulesEngineSelectors.getAbilityLookup);
  const dataOriginRefData = useSelector(
    rulesEngineSelectors.getDataOriginRefData
  );
  const isReadonly = useSelector(appEnvSelectors.getIsReadonly);
  const proficiencyBonus = useSelector(
    rulesEngineSelectors.getProficiencyBonus
  ) as number;
  const theme = useSelector(rulesEngineSelectors.getCharacterTheme);
  const speciesTraits = useSelector(
    rulesEngineSelectors.getCurrentLevelRacialTraits
  ) as RacialTrait[];

  const handleFeatClick = (feat: FeatManager): void => {
    paneHistoryStart(
      PaneComponentEnum.FEAT_DETAIL,
      PaneIdentifierUtils.generateFeat(feat.getId())
    );
  };

  const handleActionClick = (action: Action): void => {
    const mappingId = ActionUtils.getMappingId(action);
    const mappingEntityTypeId = ActionUtils.getMappingEntityTypeId(action);

    if (mappingId !== null && mappingEntityTypeId !== null) {
      paneHistoryStart(
        PaneComponentEnum.ACTION,
        PaneIdentifierUtils.generateAction(mappingId, mappingEntityTypeId)
      );
    }
  };

  const handleSpellDetailClick = (spell: Spell): void => {
    const mappingId = SpellUtils.getMappingId(spell);
    if (mappingId !== null) {
      paneHistoryStart(
        PaneComponentEnum.CHARACTER_SPELL_DETAIL,
        PaneIdentifierUtils.generateCharacterSpell(mappingId)
      );
    }
  };

  return (
    <ContentGroup header="Species Traits">
      <SpeciesDetail
        onActionUseSet={(action, uses) =>
          handleActionUseSet(action, uses, dispatch)
        }
        onActionClick={(action) => handleActionClick(action)}
        onSpellClick={(spell) => handleSpellDetailClick(spell)}
        onSpellUseSet={(spell, uses) =>
          handleSpellUseSet(spell, uses, dispatch)
        }
        onFeatureClick={(feature) => {
          paneHistoryStart(
            PaneComponentEnum.SPECIES_TRAIT_DETAIL,
            PaneIdentifierUtils.generateRacialTrait(
              RacialTraitUtils.getId(feature)
            )
          );
        }}
        feats={characterFeaturesManager
          .getFeats()
          .map((manager) => manager.feat)}
        isReadonly={isReadonly}
        snippetData={snippetData}
        ruleData={ruleData}
        abilityLookup={abilityLookup}
        dataOriginRefData={dataOriginRefData}
        proficiencyBonus={proficiencyBonus}
        theme={theme}
        speciesTraits={speciesTraits}
        onFeatClick={(feat) => handleFeatClick(feat)}
        featuresManager={characterFeaturesManager}
      />
    </ContentGroup>
  );
};

const ClassFeaturesGroup: React.FC<{}> = () => {
  const dispatch = useDispatch();
  const { characterFeaturesManager } = useContext(
    CharacterFeaturesManagerContext
  );

  const {
    pane: { paneHistoryStart },
  } = useSidebar();

  const classes = useSelector(rulesEngineSelectors.getClasses);
  const snippetData = useSelector(rulesEngineSelectors.getSnippetData);
  const ruleData = useSelector(rulesEngineSelectors.getRuleData);
  const abilityLookup = useSelector(rulesEngineSelectors.getAbilityLookup);
  const dataOriginRefData = useSelector(
    rulesEngineSelectors.getDataOriginRefData
  );
  const isReadonly = useSelector(appEnvSelectors.getIsReadonly);
  const proficiencyBonus = useSelector(
    rulesEngineSelectors.getProficiencyBonus
  );
  const theme = useSelector(rulesEngineSelectors.getCharacterTheme);

  const handleFeatClick = (feat: FeatManager): void => {
    paneHistoryStart(
      PaneComponentEnum.FEAT_DETAIL,
      PaneIdentifierUtils.generateFeat(feat.getId())
    );
  };

  const handleActionClick = (action: Action): void => {
    const mappingId = ActionUtils.getMappingId(action);
    const mappingEntityTypeId = ActionUtils.getMappingEntityTypeId(action);

    if (mappingId !== null && mappingEntityTypeId !== null) {
      paneHistoryStart(
        PaneComponentEnum.ACTION,
        PaneIdentifierUtils.generateAction(mappingId, mappingEntityTypeId)
      );
    }
  };

  const handleSpellDetailClick = (spell: Spell): void => {
    const mappingId = SpellUtils.getMappingId(spell);
    if (mappingId !== null) {
      paneHistoryStart(
        PaneComponentEnum.CHARACTER_SPELL_DETAIL,
        PaneIdentifierUtils.generateCharacterSpell(mappingId)
      );
    }
  };

  return (
    <ContentGroup header="Class Features">
      <ClassesDetail
        classes={classes}
        onActionUseSet={(action, uses) =>
          handleActionUseSet(action, uses, dispatch)
        }
        onActionClick={(action) => handleActionClick(action)}
        onSpellClick={(spell) => handleSpellDetailClick(spell)}
        onSpellUseSet={(spell, uses) =>
          handleSpellUseSet(spell, uses, dispatch)
        }
        onFeatureClick={(feature, charClass) => {
          paneHistoryStart(
            PaneComponentEnum.CLASS_FEATURE_DETAIL,
            PaneIdentifierUtils.generateClassFeature(
              FeatureUtils.getId(feature),
              ClassUtils.getMappingId(charClass)
            )
          );
        }}
        onInfusionChoiceClick={(infusionChoice) => {
          const choiceKey = InfusionChoiceUtils.getKey(infusionChoice);
          if (choiceKey !== null) {
            paneHistoryStart(
              PaneComponentEnum.INFUSION_CHOICE,
              PaneIdentifierUtils.generateInfusionChoice(choiceKey)
            );
          }
        }}
        feats={characterFeaturesManager
          .getFeats()
          .map((manager) => manager.feat)}
        isReadonly={isReadonly}
        snippetData={snippetData}
        ruleData={ruleData}
        abilityLookup={abilityLookup}
        dataOriginRefData={dataOriginRefData}
        proficiencyBonus={proficiencyBonus}
        theme={theme}
        onFeatClick={(feat) => handleFeatClick(feat)}
        featuresManager={characterFeaturesManager}
      />
    </ContentGroup>
  );
};

const FeatsGroup: React.FC<{}> = () => {
  const dispatch = useDispatch();
  const { gfsBlessingsUiFlag } = useFeatureFlags();
  const {
    pane: { paneHistoryStart },
  } = useSidebar();

  const snippetData = useSelector(rulesEngineSelectors.getSnippetData);
  const ruleData = useSelector(rulesEngineSelectors.getRuleData);
  const abilityLookup = useSelector(rulesEngineSelectors.getAbilityLookup);
  const dataOriginRefData = useSelector(
    rulesEngineSelectors.getDataOriginRefData
  );
  const isReadonly = useSelector(appEnvSelectors.getIsReadonly);
  const proficiencyBonus = useSelector(
    rulesEngineSelectors.getProficiencyBonus
  );
  const theme = useSelector(rulesEngineSelectors.getCharacterTheme);

  const handleFeatClick = (feat: FeatManager): void => {
    paneHistoryStart(
      PaneComponentEnum.FEAT_DETAIL,
      PaneIdentifierUtils.generateFeat(feat.getId())
    );
  };

  const handleActionClick = (action: Action): void => {
    const mappingId = ActionUtils.getMappingId(action);
    const mappingEntityTypeId = ActionUtils.getMappingEntityTypeId(action);

    if (mappingId !== null && mappingEntityTypeId !== null) {
      paneHistoryStart(
        PaneComponentEnum.ACTION,
        PaneIdentifierUtils.generateAction(mappingId, mappingEntityTypeId)
      );
    }
  };

  const handleSpellDetailClick = (spell: Spell): void => {
    const mappingId = SpellUtils.getMappingId(spell);
    if (mappingId !== null) {
      paneHistoryStart(
        PaneComponentEnum.CHARACTER_SPELL_DETAIL,
        PaneIdentifierUtils.generateCharacterSpell(mappingId)
      );
    }
  };

  return (
    <ContentGroup header="Feats">
      {!isReadonly && (
        <div className="ct-features__management-link">
          <ThemeButton
            onClick={() => paneHistoryStart(PaneComponentEnum.FEATS_MANAGE)}
            style="outline"
            size="medium"
          >
            Manage {gfsBlessingsUiFlag ? "Features" : "Feats"}
          </ThemeButton>
        </div>
      )}
      <FeatsDetail
        onActionUseSet={(action, uses) =>
          handleActionUseSet(action, uses, dispatch)
        }
        onActionClick={(action) => handleActionClick(action)}
        onSpellClick={(spell) => handleSpellDetailClick(spell)}
        onSpellUseSet={(spell, uses) =>
          handleSpellUseSet(spell, uses, dispatch)
        }
        onFeatureClick={(feat) => handleFeatClick(feat)}
        isReadonly={isReadonly}
        snippetData={snippetData}
        ruleData={ruleData}
        abilityLookup={abilityLookup}
        dataOriginRefData={dataOriginRefData}
        proficiencyBonus={proficiencyBonus}
        theme={theme}
      />
    </ContentGroup>
  );
};

const BlessingsGroup: React.FC<{}> = () => {
  return (
    <ContentGroup header="Blessings">
      <BlessingsDetail />
    </ContentGroup>
  );
};

const Features: React.FC<{}> = () => {
  const { gfsBlessingsUiFlag } = useFeatureFlags();
  const { characterFeaturesManager } = useContext(
    CharacterFeaturesManagerContext
  );

  const [hasBlessings, setHasBlessings] = useState(false);

  useEffect(() => {
    async function onUpdate() {
      const hasBlessings = gfsBlessingsUiFlag
        ? await characterFeaturesManager.hasBlessings()
        : false;
      setHasBlessings(hasBlessings);
    }
    return FeaturesManager.subscribeToUpdates({ onUpdate });
  }, [setHasBlessings]);

  return (
    <section className="ct-features">
      <h2 style={visuallyHidden}>Features and Traits</h2>
      <TabFilter
        filters={[
          {
            label: "Class Features",
            content: <ClassFeaturesGroup />,
          },
          {
            label: "Species Traits",
            content: <SpeciesTraitsGroup />,
          },
          {
            label: "Feats",
            content: <FeatsGroup />,
          },
          ...(gfsBlessingsUiFlag && hasBlessings
            ? [{ label: "Blessings", content: <BlessingsGroup /> }]
            : []),
        ]}
      />
    </section>
  );
};

export default Features;
