import clsx from "clsx";
import { FC, HTMLAttributes } from "react";
import { useSelector } from "react-redux";

import {
  BeveledBoxSvg317x89,
  BoxBackground,
} from "../../character-components/es";
import { Constants } from "../../character-rules-engine";

import { useSidebar } from "~/contexts/Sidebar/Sidebar";
import { useCharacterEngine } from "~/hooks/useCharacterEngine";
import { appEnvSelectors } from "~/tools/js/Shared/selectors";

import { PaneComponentEnum } from "../Sidebar/types";
import { DeathSummary } from "./DeathSummary";
import { HitPointsQuickAdjust } from "./HitPointsQuickAdjust";
import { HitPointsSummary } from "./HitPointsSummary";
import styles from "./styles.module.css";

interface Props extends HTMLAttributes<HTMLDivElement> {}

export const HitPointsBox: FC<Props> = ({ className, ...props }) => {
  const {
    pane: { paneHistoryStart },
  } = useSidebar();

  const isReadonly = useSelector(appEnvSelectors.getIsReadonly);

  const { hpInfo, deathCause, characterTheme } = useCharacterEngine();

  const onClick = (evt: React.MouseEvent): void => {
    if (!isReadonly) {
      evt.stopPropagation();
      evt.nativeEvent.stopImmediatePropagation();
      paneHistoryStart(PaneComponentEnum.HEALTH_MANAGE);
    }
  };

  return (
    <div
      className={clsx([styles.hitPointsBox, className])}
      onClick={onClick}
      {...props}
    >
      <BoxBackground
        StyleComponent={BeveledBoxSvg317x89}
        theme={characterTheme}
      />
      {deathCause === Constants.DeathCauseEnum.CONDITION ||
      hpInfo.remainingHp <= 0 ? (
        <DeathSummary />
      ) : (
        <div className={styles.content}>
          <h1 className={styles.label}>Hit Points</h1>
          <HitPointsQuickAdjust />
          <HitPointsSummary hpInfo={hpInfo} />
        </div>
      )}
    </div>
  );
};
