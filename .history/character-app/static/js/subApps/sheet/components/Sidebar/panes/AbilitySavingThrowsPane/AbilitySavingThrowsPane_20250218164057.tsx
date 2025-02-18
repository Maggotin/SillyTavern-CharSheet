import { ComponentType, FC, HTMLAttributes, ReactNode } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  AbilityIcon,
  Collapsible,
  DarkModeNegativeBonusNegativeSvg,
  DarkModePositiveBonusPositiveSvg,
  NegativeBonusNegativeSvg,
  PositiveBonusPositiveSvg,
} from "@dndbeyond/character-components/es";
import {
  AbilityUtils,
  characterActions,
  Constants,
  FormatUtils,
  ModifierUtils,
  ValueUtils,
} from "../../rules-engine/es";

import { HtmlContent } from "~/components/HtmlContent";
import { NumberDisplay } from "~/components/NumberDisplay";
import { RuleKeyEnum } from "~/constants";
import { useCharacterTheme } from "~/contexts/CharacterTheme";
import { useSidebar } from "~/contexts/Sidebar";
import { useCharacterEngine } from "~/hooks/useCharacterEngine";
import { useRuleData } from "~/hooks/useRuleData";
import { Header } from "~/subApps/sheet/components/Sidebar/components/Header";
import { Preview } from "~/subApps/sheet/components/Sidebar/components/Preview";
import { Ability, SituationalSavingThrowInfo, StatDataContract } from "~/types";

import EditorBox from "../../../../../../tools/js/Shared/components/EditorBox";
import ValueEditor from "../../../../../../tools/js/Shared/components/ValueEditor";
import { appEnvSelectors } from "../../../../../../tools/js/Shared/selectors";
import { PaneInitFailureContent } from "../../components/PaneInitFailureContent";
import {
  PaneComponentEnum,
  PaneIdentifiersAbilitySavingThrow,
} from "../../types";
import styles from "./styles.module.css";

/*
AbilitySavingThrowsPane is the specific Sidebar for each Ability Saving Throw on a character - (Strength, Dexterity, Constitution, Wisdom, Intelligence, Charisma) - it displays the details, modifiers, any customizations and overrides, as well as the situational bonuses.
*/

interface Props extends HTMLAttributes<HTMLDivElement> {
  identifiers: PaneIdentifiersAbilitySavingThrow | null;
}

export const AbilitySavingThrowsPane: FC<Props> = ({
  identifiers,
  ...props
}) => {
  const dispatch = useDispatch();

  const {
    ruleData,
    situationalBonusSavingThrowsLookup,
    abilityLookup,
    entityValueLookup,
  } = useCharacterEngine();
  const { ruleDataUtils } = useRuleData();

  const { isDarkMode } = useCharacterTheme();
  const isReadonly = useSelector(appEnvSelectors.getIsReadonly);
  const {
    pane: { paneHistoryPush },
  } = useSidebar();

  const abilityDataLookup = ruleDataUtils.getStatsLookup(ruleData);
  const ability: Ability | null = identifiers && abilityLookup[identifiers.id];
  const abilityData: StatDataContract | null =
    identifiers && abilityDataLookup[identifiers.id];
  const situationalBonusSavingThrowsInfo: SituationalSavingThrowInfo[] | null =
    identifiers && situationalBonusSavingThrowsLookup[identifiers.id];

  const rulesText = ruleDataUtils.getRule(RuleKeyEnum.SAVING_THROWS, ruleData);

  const handleCustomDataUpdate = (
    key: number,
    value: any,
    source: string
  ): void => {
    if (!abilityData) return;

    dispatch(
      characterActions.valueSet(
        key,
        value,
        source,
        ValueUtils.hack__toString(abilityData.id),
        ValueUtils.hack__toString(abilityData.entityTypeId)
      )
    );
  };

  const handleParentClick = (): void => {
    paneHistoryPush(PaneComponentEnum.SAVING_THROWS);
  };

  if (!ability || !abilityData) {
    return <PaneInitFailureContent />;
  }
  const statId = AbilityUtils.getId(ability);

  let sidebarPreviewNode: ReactNode = (
    <Preview>
      <AbilityIcon
        className={styles.icon}
        statId={statId}
        themeMode={isDarkMode ? "light" : "dark"}
      />
    </Preview>
  );

  return (
    <div key={statId} {...props}>
      <Header
        preview={sidebarPreviewNode}
        parent="Saving Throws"
        onClick={handleParentClick}
      >
        {abilityData.name} Saving Throw
        <span className={styles.modifier}>
          <NumberDisplay type="signed" number={AbilityUtils.getSave(ability)} />
        </span>
      </Header>
      {!isReadonly && (
        <Collapsible
          layoutType={"minimal"}
          header="Customize"
          className={styles.customize}
        >
          <EditorBox className={styles.editorBox}>
            <ValueEditor
              dataLookup={ValueUtils.getEntityData(
                entityValueLookup,
                ValueUtils.hack__toString(abilityData.id),
                ValueUtils.hack__toString(abilityData.entityTypeId)
              )}
              onDataUpdate={handleCustomDataUpdate}
              valueEditors={[
                Constants.AdjustmentTypeEnum.SAVING_THROW_OVERRIDE,
                Constants.AdjustmentTypeEnum.SAVING_THROW_MAGIC_BONUS,
                Constants.AdjustmentTypeEnum.SAVING_THROW_MISC_BONUS,
                Constants.AdjustmentTypeEnum.SAVING_THROW_PROFICIENCY_LEVEL,
              ]}
              ruleData={ruleData}
            />
          </EditorBox>
        </Collapsible>
      )}
      {situationalBonusSavingThrowsInfo && (
        <div className={styles.situational}>
          {situationalBonusSavingThrowsInfo.map((situationalBonus) => {
            let abilityNode: ReactNode;

            if (
              situationalBonus.type ===
              Constants.SituationalBonusSavingThrowTypeEnum.MODIFIER
            ) {
              let restriction = ModifierUtils.getRestriction(
                situationalBonus.extra
              );
              if (restriction) {
                restriction = restriction.trim();
                restriction = FormatUtils.lowerCaseLetters(restriction, 0);
                abilityNode = <>{restriction}</>;
              }
            }

            if (!abilityNode) {
              abilityNode = <>on saves</>;
            }

            const saveAmount = situationalBonus.value;
            let IconComponent: ComponentType<any>;
            if (situationalBonus.value >= 0) {
              IconComponent = isDarkMode
                ? DarkModePositiveBonusPositiveSvg
                : PositiveBonusPositiveSvg;
            } else {
              IconComponent = isDarkMode
                ? DarkModeNegativeBonusNegativeSvg
                : NegativeBonusNegativeSvg;
            }

            return (
              <div
                className={styles.situationalBonus}
                key={situationalBonus.key}
              >
                <IconComponent className={styles.situationalBonusIcon} />
                <span className={styles.situationalBonusValue}>
                  {saveAmount}
                </span>
                <span className={styles.situationalBonusRestriction}>
                  {abilityNode}
                </span>
              </div>
            );
          })}
        </div>
      )}
      {rulesText && rulesText.description && (
        <HtmlContent
          className={styles.description}
          html={rulesText.description}
          withoutTooltips
        />
      )}
    </div>
  );
};
