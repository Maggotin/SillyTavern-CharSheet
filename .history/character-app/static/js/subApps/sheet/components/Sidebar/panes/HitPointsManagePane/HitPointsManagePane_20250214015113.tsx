import { FC, HTMLAttributes, useState } from "react";
import { useDispatch } from "react-redux";

import { Constants } from "@dndbeyond/character-rules-engine";

import { HtmlContent } from "~/components/HtmlContent";
import { RuleKeyEnum } from "~/constants";
import { useCharacterEngine } from "~/hooks/useCharacterEngine";
import { Header } from "~/subApps/sheet/components/Sidebar/components/Header";
import { Heading } from "~/subApps/sheet/components/Sidebar/components/Heading";
import { toastMessageActions } from "~/tools/js/Shared/actions";
import { ShortModelInfoContract } from "~/types";

import { HitPointsSummary } from "../../../HitPointsBox/HitPointsSummary";
import { DeathSavesManager } from "./DeathSavesManager/DeathSavesManager";
import { HitPointsAdjuster } from "./HitPointsAdjuster";
import { HitPointsOverrides } from "./HitPointsOverrides";
import { RestoreLifeManager } from "./RestoreLifeManager/RestoreLifeManager";
import styles from "./styles.module.css";

interface Props extends HTMLAttributes<HTMLDivElement> {}
export const HitPointsManagePane: FC<Props> = ({ className, ...props }) => {
  const { hpInfo, deathCause, ruleData, ruleDataUtils, characterActions } =
    useCharacterEngine();
  const dispatch = useDispatch();

  const [damage, setDamage] = useState<number>(0);

  const handleDamageUpdate = (damageValue: number) => {
    setDamage(damageValue);
  };

  const onRestoreToLife = (restoreType: ShortModelInfoContract): void => {
    const restoreChoice = restoreType.name === "Full" ? "full" : "1";

    dispatch(characterActions.restoreLife(restoreType.id));
    dispatch(
      toastMessageActions.toastSuccess(
        "Character Restored to Life",
        `You have been restored to life with ${restoreChoice} HP.`
      )
    );
  };

  const renderDeathSavesRules = (): React.ReactNode => {
    if (
      hpInfo.remainingHp > 0 ||
      (deathCause !== Constants.DeathCauseEnum.NONE &&
        deathCause !== Constants.DeathCauseEnum.DEATHSAVES)
    ) {
      return null;
    }

    const deathSavesRule = ruleDataUtils.getRule(
      RuleKeyEnum.DEATH_SAVING_THROWS,
      ruleData
    );

    return (
      <div>
        <Heading>Death Saving Throws Rules</Heading>
        <HtmlContent
          html={deathSavesRule?.description ? deathSavesRule.description : ""}
          withoutTooltips
        />
      </div>
    );
  };

  return (
    <div className={className} {...props}>
      <Header>HP Management</Header>
      <div className={styles.container}>
        {hpInfo.remainingHp <= 0 &&
          (deathCause === Constants.DeathCauseEnum.NONE ||
            deathCause === Constants.DeathCauseEnum.DEATHSAVES) && (
            <DeathSavesManager damageValue={damage} className={styles.border} />
          )}
        {deathCause !== Constants.DeathCauseEnum.NONE && (
          <RestoreLifeManager
            onSave={onRestoreToLife}
            className={styles.border}
          />
        )}
        <HitPointsSummary
          hpInfo={hpInfo}
          showOriginalMax
          showPermanentInputs
          className={styles.border}
        />
        <HitPointsAdjuster
          hpInfo={hpInfo}
          handleDamageUpdate={handleDamageUpdate}
          className={styles.border}
        />
        <HitPointsOverrides className={styles.border} />
        {hpInfo.remainingHp <= 0 &&
          (deathCause === Constants.DeathCauseEnum.NONE ||
            deathCause === Constants.DeathCauseEnum.DEATHSAVES) &&
          renderDeathSavesRules()}
      </div>
    </div>
  );
};
