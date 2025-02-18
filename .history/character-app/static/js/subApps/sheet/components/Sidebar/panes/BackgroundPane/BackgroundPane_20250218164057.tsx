import { FC, HTMLAttributes } from "react";

import { BackgroundUtils } from "../../rules-engine/es";

import { HtmlContent } from "~/components/HtmlContent";
import { useCharacterEngine } from "~/hooks/useCharacterEngine";
import { useRuleData } from "~/hooks/useRuleData";
import { Header } from "~/subApps/sheet/components/Sidebar/components/Header";
import { Heading } from "~/subApps/sheet/components/Sidebar/components/Heading";
import { PaneInitFailureContent } from "~/subApps/sheet/components/Sidebar/components/PaneInitFailureContent";

import { FeatureSnippetChoices } from "../../../../../../tools/js/CharacterSheet/components/FeatureSnippet";
import styles from "./styles.module.css";

/*
This is the Sidebar display for Background. You can access this Pane by clicking on the Background data displayed in the Description tab section of the Character Sheet.
*/

interface BackgroundPaneProps extends HTMLAttributes<HTMLDivElement> {}
export const BackgroundPane: FC<BackgroundPaneProps> = ({ ...props }) => {
  const {
    ruleData,
    abilityLookup,
    backgroundInfo,
    snippetData,
    originRef,
    proficiencyBonus,
    characterTheme,
  } = useCharacterEngine();

  const { ruleDataUtils } = useRuleData();

  if (!backgroundInfo) {
    return <PaneInitFailureContent />;
  }

  const hasCustomBackground =
    BackgroundUtils.getHasCustomBackground(backgroundInfo);
  const description = BackgroundUtils.getDescription(backgroundInfo);
  const featureName = BackgroundUtils.getFeatureName(backgroundInfo);

  return (
    <div {...props}>
      <Header>{BackgroundUtils.getName(backgroundInfo)}</Header>
      <div className={styles.data}>
        <div className={styles.choices}>
          <FeatureSnippetChoices
            choices={BackgroundUtils.getChoices(backgroundInfo)}
            ruleData={ruleData}
            abilityLookup={abilityLookup}
            snippetData={snippetData}
            sourceDataLookup={ruleDataUtils.getSourceDataLookup(ruleData)}
            dataOriginRefData={originRef}
            proficiencyBonus={proficiencyBonus}
            theme={characterTheme}
          />
        </div>
      </div>
      {hasCustomBackground ? (
        <div className={styles.customDescription}>{description}</div>
      ) : (
        <HtmlContent html={description ? description : ""} withoutTooltips />
      )}
      {hasCustomBackground && featureName && (
        <div>
          <Heading>Feature: {featureName}</Heading>
          <HtmlContent
            html={BackgroundUtils.getFeatureDescription(backgroundInfo) ?? ""}
            withoutTooltips
          />
        </div>
      )}
    </div>
  );
};
