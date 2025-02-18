import clsx from "clsx";
import { FC, HTMLAttributes } from "react";

import { AdvantageIcon } from "@dndbeyond/character-components/es";

import { HtmlContent } from "~/components/HtmlContent";
import { NumberDisplay } from "~/components/NumberDisplay";
import { RuleKeyEnum } from "~/constants";
import { useCharacterEngine } from "~/hooks/useCharacterEngine";
import { useRuleData } from "~/hooks/useRuleData";
import { Header } from "~/subApps/sheet/components/Sidebar/components/Header";

import styles from "./styles.module.css";

interface Props extends HTMLAttributes<HTMLDivElement> {}
export const InitiativePane: FC<Props> = ({ ...props }) => {
  const { ruleDataUtils, initiativeScore } = useRuleData();
  const {
    ruleData,
    processedInitiative,
    hasInitiativeAdvantage,
    characterTheme,
    formatUtils,
  } = useCharacterEngine();

  const staticTotal = processedInitiative + initiativeScore.amount;

  let rule = ruleDataUtils.getRule(RuleKeyEnum.INITIATIVE, ruleData);

  return (
    <div {...props}>
      <Header>
        {hasInitiativeAdvantage && (
          <AdvantageIcon
            theme={characterTheme}
            title={"Advantage on Initiative"}
            className={styles.advantageIcon}
          />
        )}
        Initiative{" "}
        <span className={styles.modifier}>
          (
          <NumberDisplay
            type="signed"
            number={processedInitiative}
            className={styles.signedNumber}
          />
          )
        </span>
      </Header>
      <div className={styles.container}>
        <p>
          Initiative scores can replace rolls at your DM's discretion. Your
          initiative score equals {initiativeScore.amount} plus your DEX
          modifier.
        </p>
        <div
          className={clsx([
            styles.score,
            hasInitiativeAdvantage && styles.isAdvantage,
          ])}
        >
          <span className={styles.label}>Initiative Score: </span>
          <span className={styles.amount}>{staticTotal}</span>
        </div>
        <div className={clsx([hasInitiativeAdvantage && styles.isAdvantage])}>
          <span className={styles.labelSecondary}>
            With Advantage (
            {formatUtils.renderSignedNumber(initiativeScore.advantage)}):{" "}
          </span>
          <span className={styles.amount}>
            {staticTotal + initiativeScore.advantage}
          </span>
        </div>
        <div>
          <span className={styles.labelSecondary}>
            With Disadvantage (
            {formatUtils.renderSignedNumber(initiativeScore.disadvantage)}):{" "}
          </span>
          <span className={styles.amount}>
            {staticTotal + initiativeScore.disadvantage}
          </span>
        </div>
      </div>
      <HtmlContent
        html={rule && rule.description ? rule.description : ""}
        withoutTooltips
      />
    </div>
  );
};
