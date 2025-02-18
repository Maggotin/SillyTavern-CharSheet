import clsx from "clsx";
import { FC, HTMLAttributes, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  DigitalDiceWrapper,
  LightDiceSvg,
} from "../../character-components/es";
import { RollKind, RollRequest, RollType } from "../../dice";
import { GameLogContext } from "../../game-log-components";

import { useSidebar } from "~/contexts/Sidebar";
import { isNotNullOrUndefined } from "~/helpers/validation";
import { useCharacterEngine } from "~/hooks/useCharacterEngine";
import { getDataOriginComponentInfo } from "~/subApps/sheet/components/Sidebar/helpers/paneUtils";
import { PaneComponentEnum } from "~/subApps/sheet/components/Sidebar/types";
import DiceAdjustmentSummary from "~/tools/js/Shared/components/DiceAdjustmentSummary";
import {
  appEnvSelectors,
  characterRollContextSelectors,
} from "~/tools/js/Shared/selectors";
import { DataOrigin } from "~/types";

import { Heading } from "../../../components/Heading";
import { DeathSavesMarks } from "./DeathSavesMarks";
import styles from "./styles.module.css";

interface Props extends HTMLAttributes<HTMLDivElement> {
  damageValue: number;
}

export const DeathSavesManager: FC<Props> = ({
  damageValue,
  className,
  ...props
}) => {
  const {
    characterTheme,
    deathSaveInfo,
    ruleData,
    characterActions,
    ruleDataUtils,
  } = useCharacterEngine();

  const isDiceEnabled = useSelector(appEnvSelectors.getDiceEnabled);
  const characterRollContext = useSelector(
    characterRollContextSelectors.getCharacterRollContext
  );
  const [{ messageTargetOptions, defaultMessageTargetOption, userId }] =
    useContext(GameLogContext);
  const dispatch = useDispatch();

  const {
    pane: { paneHistoryPush },
  } = useSidebar();

  const oneHPRestoreType = ruleDataUtils
    .getRestoreTypes(ruleData)
    .find((r) => r.name === "OneHP");

  const hasAdvantage = deathSaveInfo.advantageAdjustments.length > 0;
  const hasDisadvantage = deathSaveInfo.disadvantageAdjustments.length > 0;

  let rollKind = RollKind.None;
  if (hasAdvantage && !hasDisadvantage) {
    rollKind = RollKind.Advantage;
  } else if (hasDisadvantage && !hasAdvantage) {
    rollKind = RollKind.Disadvantage;
  }

  /* --- On Click Functions --- */

  const onClickDataOrigin = (dataOrigin: DataOrigin): void => {
    let component = getDataOriginComponentInfo(dataOrigin);
    if (component.type !== PaneComponentEnum.ERROR_404) {
      paneHistoryPush(component.type, component.identifiers);
    }
  };

  const dispatchDeathSaves = (fails: number, successes: number) => {
    dispatch(
      characterActions.deathSavesSet(
        Math.min(ruleDataUtils.getMaxDeathsavesFail(ruleData), fails),
        Math.min(ruleDataUtils.getMaxDeathsavesSuccess(ruleData), successes)
      )
    );
  };

  const onFail = (evt?: React.MouseEvent, isCritical = false) => {
    const uses = isCritical ? 2 : 1;

    if (evt) {
      evt.nativeEvent.stopImmediatePropagation();
      evt.stopPropagation();
    }

    dispatchDeathSaves(
      deathSaveInfo.failCount + uses,
      deathSaveInfo.successCount
    );
  };

  const onFailClear = (evt?: React.MouseEvent) => {
    if (evt) {
      evt.nativeEvent.stopImmediatePropagation();
      evt.stopPropagation();
    }

    dispatchDeathSaves(deathSaveInfo.failCount - 1, deathSaveInfo.successCount);
  };

  const onSuccess = (evt?: React.MouseEvent) => {
    if (evt) {
      evt.nativeEvent.stopImmediatePropagation();
      evt.stopPropagation();
    }

    dispatchDeathSaves(deathSaveInfo.failCount, deathSaveInfo.successCount + 1);
  };

  const onSuccessClear = (evt?: React.MouseEvent) => {
    if (evt) {
      evt.nativeEvent.stopImmediatePropagation();
      evt.stopPropagation();
    }

    dispatchDeathSaves(deathSaveInfo.failCount, deathSaveInfo.successCount - 1);
  };

  return (
    <div className={clsx([styles.column, className])} {...props}>
      <div className={clsx([styles.row, styles.heading])}>
        <Heading>Death Saves</Heading>
        {isDiceEnabled && (
          <DigitalDiceWrapper
            diceNotation={"1d20"}
            onRollResults={(rollRequest: RollRequest) => {
              const roll = rollRequest.rolls[0].result?.total;

              if (roll) {
                if (roll === 1) {
                  onFail(undefined, true);
                } else if (roll === 20 && oneHPRestoreType) {
                  dispatch(characterActions.restoreLife(oneHPRestoreType.id));
                } else if (roll >= 10) {
                  onSuccess.bind(this)();
                } else {
                  onFail.bind(this)();
                }
              }
            }}
            rollType={RollType.Save}
            rollKind={rollKind}
            rollAction={"Death"}
            diceEnabled={isDiceEnabled}
            rollContext={characterRollContext}
            rollTargetOptions={
              messageTargetOptions?.entities
                ? Object.values(messageTargetOptions.entities).filter(
                    isNotNullOrUndefined
                  )
                : undefined
            }
            rollTargetDefault={defaultMessageTargetOption}
            userId={Number(userId)}
            advMenu={true}
          >
            <LightDiceSvg />
            <span>Roll</span>
          </DigitalDiceWrapper>
        )}
      </div>
      <div className={clsx([styles.row, styles.deathSavesGroups])}>
        <DeathSavesMarks
          label="Failures"
          type="fails"
          activeCount={deathSaveInfo.failCount}
          willBeActiveCount={damageValue !== 0 ? 1 : 0}
          totalCount={ruleData.maxDeathsavesFail}
          onUse={onFail}
          onClear={onFailClear}
        />
        <DeathSavesMarks
          label="Successes"
          type="successes"
          activeCount={deathSaveInfo.successCount}
          totalCount={ruleData.maxDeathsavesSuccess}
          onUse={onSuccess}
          onClear={onSuccessClear}
        />
      </div>
      {(!!deathSaveInfo.advantageAdjustments.length ||
        !!deathSaveInfo.disadvantageAdjustments.length) && (
        <div className={styles.diceAdjustments}>
          {deathSaveInfo.advantageAdjustments.map((diceAdjustment) => {
            return (
              <DiceAdjustmentSummary
                key={diceAdjustment.uniqueKey}
                diceAdjustment={diceAdjustment}
                ruleData={ruleData}
                theme={characterTheme}
                onDataOriginClick={onClickDataOrigin}
              />
            );
          })}
          {deathSaveInfo.disadvantageAdjustments.map((diceAdjustment) => {
            return (
              <DiceAdjustmentSummary
                key={diceAdjustment.uniqueKey}
                diceAdjustment={diceAdjustment}
                ruleData={ruleData}
                theme={characterTheme}
                onDataOriginClick={onClickDataOrigin}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
