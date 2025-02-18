import clsx from "clsx";
import { createRef, FC, HTMLAttributes, useState } from "react";
import { useDispatch } from "react-redux";

import { useCharacterEngine } from "~/hooks/useCharacterEngine";
import {
  HP_BONUS_VALUE,
  HP_DAMAGE_TAKEN_VALUE,
  HP_OVERRIDE_MAX_VALUE,
  HP_TEMP_VALUE,
} from "~/subApps/sheet/constants";

import styles from "./styles.module.css";

interface Props extends HTMLAttributes<HTMLDivElement> {}

export const HitPointsOverrides: FC<Props> = ({ className, ...props }) => {
  const { characterActions, hpInfo, ruleData, ruleDataUtils, helperUtils } =
    useCharacterEngine();
  const dispatch = useDispatch();

  const [maxModifier, setMaxModifier] = useState<number | null>(hpInfo.bonusHp);
  const [maxOverride, setMaxOverride] = useState<number | null>(
    hpInfo.overrideHp
  );

  const maxModifierInput = createRef<HTMLInputElement>();
  const maxOverrideInput = createRef<HTMLInputElement>();

  /* --- Helper functions --- */

  const updateDamageTaken = (maxHp: number) => {
    if (hpInfo.totalHp !== null) {
      let maxDiff = hpInfo.totalHp - maxHp;
      if (maxDiff > 0) {
        let newRemovedHp = Math.max(
          HP_DAMAGE_TAKEN_VALUE.MIN,
          hpInfo.removedHp - maxDiff
        );
        if (newRemovedHp !== hpInfo.removedHp) {
          dispatch(
            characterActions.hitPointsSet(
              newRemovedHp,
              hpInfo.tempHp ?? HP_TEMP_VALUE.MIN
            )
          );
        }
      }
    }
  };

  const onKeyUp = (
    func: any,
    evt: React.KeyboardEvent<HTMLInputElement>
  ): void => {
    if (evt.key === "Enter") {
      func(evt);
    }
  };

  /* --- Max hit point modifier functions --- */

  const onChangeMaxModifier = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setMaxModifier(helperUtils.parseInputInt(evt.target.value));
  };

  const onBlurMaxModifier = (evt: React.FocusEvent<HTMLInputElement>) => {
    let value = helperUtils.parseInputInt(evt.target.value);
    if (value !== null) {
      value = helperUtils.clampInt(
        value,
        HP_BONUS_VALUE.MIN,
        HP_BONUS_VALUE.MAX
      );
    }

    if (value !== null) {
      updateDamageTaken(hpInfo.baseTotalHp + value);
    }

    if (value !== hpInfo.bonusHp) {
      dispatch(characterActions.bonusHitPointsSet(value));
    }

    setMaxModifier(value);
  };

  /* --- Max hit point override functions --- */

  const onChangeMaxOverride = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setMaxOverride(helperUtils.parseInputInt(evt.target.value));
  };

  const onBlurMaxOverride = (evt: React.FocusEvent<HTMLInputElement>) => {
    let value = helperUtils.parseInputInt(evt.target.value);
    if (value !== null) {
      value = helperUtils.clampInt(
        value,
        ruleDataUtils.getMinimumHpTotal(ruleData),
        HP_OVERRIDE_MAX_VALUE
      );
    }

    if (value !== null) {
      updateDamageTaken(value);
    }

    if (value !== hpInfo.overrideHp) {
      //TODO fix when it can accept null
      dispatch(characterActions.overrideHitPointsSet(value as number));
    }

    setMaxOverride(value);
  };

  return (
    <div className={clsx([styles.row, styles.overrides, className])} {...props}>
      <label className={clsx([styles.column, styles.override, styles.label])}>
        Max HP Modifier
        <input
          ref={maxModifierInput}
          className={styles.input}
          type="number"
          value={maxModifier ?? ""}
          min={HP_BONUS_VALUE.MIN}
          max={HP_BONUS_VALUE.MAX}
          onChange={onChangeMaxModifier}
          onBlur={onBlurMaxModifier}
          onKeyUp={onKeyUp.bind(this, onBlurMaxModifier)}
          placeholder="--"
        />
      </label>
      <label className={clsx([styles.column, styles.override, styles.label])}>
        Override Max HP
        <input
          ref={maxOverrideInput}
          className={styles.input}
          type="number"
          value={maxOverride ?? ""}
          min={ruleDataUtils.getMinimumHpTotal(ruleData)}
          max={HP_OVERRIDE_MAX_VALUE}
          onChange={onChangeMaxOverride}
          onBlur={onBlurMaxOverride}
          onKeyUp={onKeyUp.bind(this, onBlurMaxOverride)}
          placeholder="--"
        />
      </label>
    </div>
  );
};
