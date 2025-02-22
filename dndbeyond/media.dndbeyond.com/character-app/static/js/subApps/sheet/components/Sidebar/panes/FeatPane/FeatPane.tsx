import { FC, HTMLAttributes, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Accordion } from "~/components/Accordion";
import { Button } from "~/components/Button";
import { HelperTextAccordion } from "~/components/HelperTextAccordion";
import { HtmlContent } from "~/components/HtmlContent";
import { useSidebar } from "~/contexts/Sidebar";
import { useCharacterEngine } from "~/hooks/useCharacterEngine";
import { FeatFeatureSnippet } from "~/tools/js/CharacterSheet/components/FeatureSnippet";
import { DetailChoiceFeat } from "~/tools/js/Shared/containers/DetailChoice";
import { CharacterFeaturesManagerContext } from "~/tools/js/Shared/managers/CharacterFeaturesManagerContext";
import { appEnvSelectors } from "~/tools/js/Shared/selectors";
import { PaneIdentifierUtils } from "~/tools/js/Shared/utils";
import { DdbBadgeSvg } from "~/tools/js/smartComponents/Svg";
import { Action, Spell } from "~/types";

import { Header } from "../../components/Header";
import { PaneInitFailureContent } from "../../components/PaneInitFailureContent";
import { getDataOriginComponentInfo } from "../../helpers/paneUtils";
import { PaneComponentEnum, PaneIdentifiersFeat } from "../../types";
import styles from "./styles.module.css";

interface Props extends HTMLAttributes<HTMLDivElement> {
  identifiers: PaneIdentifiersFeat | null;
}

export const FeatPane: FC<Props> = ({ identifiers, ...props }) => {
  const dispatch = useDispatch();
  const {
    actionUtils,
    characterActions,
    spellUtils,
    snippetData,
    ruleData,
    abilityLookup,
    proficiencyBonus,
    originRef: dataOriginRefData,
    characterTheme: theme,
    entityUtils,
  } = useCharacterEngine();

  const { characterFeaturesManager } = useContext(
    CharacterFeaturesManagerContext
  );

  const {
    pane: { paneHistoryPush, paneHistoryStart },
  } = useSidebar();

  const isReadonly = useSelector(appEnvSelectors.getIsReadonly);

  const feat = identifiers?.id
    ? characterFeaturesManager.getFeatById(identifiers.id)
    : null;

  const handleActionUseSet = (action: Action, uses: number): void => {
    const id = actionUtils.getId(action);
    const entityTypeId = actionUtils.getEntityTypeId(action);
    if (id !== null && entityTypeId !== null) {
      dispatch(
        characterActions.actionUseSet(
          id,
          entityTypeId,
          uses,
          actionUtils.getDataOriginType(action)
        )
      );
    }
  };

  const handleSpellUseSet = (spell: Spell, uses: number): void => {
    const mappingId = spellUtils.getMappingId(spell);
    const mappingEntityTypeId = spellUtils.getMappingEntityTypeId(spell);

    if (mappingId && mappingEntityTypeId) {
      dispatch(
        characterActions.spellUseSet(
          mappingId,
          mappingEntityTypeId,
          uses,
          spellUtils.getDataOriginType(spell)
        )
      );
    }
  };

  const handleSpellDetailShow = (spell: Spell): void => {
    const mappingId = spellUtils.getMappingId(spell);
    if (mappingId !== null) {
      paneHistoryPush(
        PaneComponentEnum.CHARACTER_SPELL_DETAIL,
        PaneIdentifierUtils.generateCharacterSpell(mappingId)
      );
    }
  };

  const handleActionShow = (action: Action): void => {
    const mappingId = actionUtils.getMappingId(action);
    const mappingEntityTypeId = actionUtils.getMappingEntityTypeId(action);
    if (mappingId !== null && mappingEntityTypeId !== null) {
      paneHistoryPush(
        PaneComponentEnum.ACTION,
        PaneIdentifierUtils.generateAction(mappingId, mappingEntityTypeId)
      );
    }
  };

  const handleParentClick = (): void => {
    if (feat) {
      let component = getDataOriginComponentInfo(feat.getDataOrigin());
      if (component.type !== PaneComponentEnum.ERROR_404) {
        paneHistoryPush(component.type, component.identifiers);
      }
    }
  };

  if (feat === null) {
    return <PaneInitFailureContent />;
  }

  const prerequisiteDescription = feat.getPrerequisiteDescription();

  return (
    <div key={feat.getId()} {...props}>
      <Header
        parent={entityUtils.getDataOriginName(feat.getDataOrigin(), "", true)}
        onClick={handleParentClick}
      >
        {feat.getName()}
      </Header>
      <HelperTextAccordion
        builderHelperText={feat.getHelperText()}
        size="small"
        useTheme
      />
      {prerequisiteDescription && (
        <div className={styles.prereq}>
          Prerequisite: {prerequisiteDescription}
        </div>
      )}
      <FeatFeatureSnippet
        feat={feat}
        onActionUseSet={handleActionUseSet}
        onActionClick={handleActionShow}
        onSpellUseSet={handleSpellUseSet}
        onSpellClick={handleSpellDetailShow}
        onFeatureClick={() =>
          paneHistoryStart(
            PaneComponentEnum.FEAT_DETAIL,
            PaneIdentifierUtils.generateFeat(feat.getId())
          )
        }
        showHeader={false}
        showDescription={true}
        snippetData={snippetData}
        ruleData={ruleData}
        abilityLookup={abilityLookup}
        dataOriginRefData={dataOriginRefData}
        isReadonly={isReadonly}
        proficiencyBonus={proficiencyBonus}
        theme={theme}
      />
      {!isReadonly && feat.getChoices().length > 0 && (
        <div className={styles.choices}>
          <DetailChoiceFeat featId={feat.getId()} />
        </div>
      )}
      {!feat.isHiddenFeat() &&
        !isReadonly && ( // don't show "Delete" if readonly mode, or a hidden feat
          <div className={styles.footer}>
            <Button
              variant="outline"
              size="xx-small"
              themed
              onClick={() => {
                paneHistoryStart(PaneComponentEnum.FEATS_MANAGE);
                feat.handleRemove();
              }}
            >
              Delete
            </Button>
          </div>
        )}
    </div>
  );
};
