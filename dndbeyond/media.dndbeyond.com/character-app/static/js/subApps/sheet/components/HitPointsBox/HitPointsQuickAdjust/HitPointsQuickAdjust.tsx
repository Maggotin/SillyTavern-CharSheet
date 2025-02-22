import clsx from "clsx";
import { FC, HTMLAttributes, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Button } from "~/components/Button";
import { useCharacterEngine } from "~/hooks/useCharacterEngine";
import { useUnpropagatedClick } from "~/hooks/useUnpropagatedClick";
import { appEnvSelectors } from "~/tools/js/Shared/selectors";

import { HP_DAMAGE_TAKEN_VALUE } from "../../../constants";
import styles from "./styles.module.css";

interface Props extends HTMLAttributes<HTMLDivElement | HTMLButtonElement> {}

export const HitPointsQuickAdjust: FC<Props> = ({ className, ...props }) => {
  const dispatch = useDispatch();

  const { hpInfo, characterActions, characterUtils, helperUtils } =
    useCharacterEngine();
  const isReadonly = useSelector(appEnvSelectors.getIsReadonly);

  const [adjustmentValue, setAdjustmentValue] = useState<number | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const adjustHitPoints = (adjustmentSign: number): void => {
    const difference = adjustmentSign * (adjustmentValue ?? 0);

    const { newTemp, newRemovedHp } = characterUtils.calculateHitPoints(
      hpInfo,
      difference
    );

    dispatch(characterActions.hitPointsSet(newRemovedHp, newTemp));

    setAdjustmentValue(null);
    setIsHovered(false);
  };

  const onHealClick = useUnpropagatedClick(() => {
    adjustHitPoints(1);
  });

  const onDamageClick = useUnpropagatedClick(() => {
    adjustHitPoints(-1);
  });

  const onFocus = (): void => {
    setIsFocused(true);
  };

  const onMouseEnter = (): void => {
    setIsHovered(true);
  };

  const onMouseLeave = (): void => {
    setIsHovered(false);
  };

  const onBlur = (evt: React.FocusEvent<HTMLInputElement>): void => {
    setAdjustmentValue(helperUtils.parseInputInt(evt.target.value));
    setIsFocused(false);
  };

  const onChange = (evt: React.ChangeEvent<HTMLInputElement>): void => {
    setAdjustmentValue(helperUtils.parseInputInt(evt.target.value));
  };

  const onWheel = (evt: WheelEvent): void => {
    if (isHovered || isFocused) {
      evt.preventDefault();
      let direction = evt.deltaY < 0 ? 1 : -1;
      if (!isReadonly) {
        let newValue = (adjustmentValue ?? 0) + direction;
        newValue = helperUtils.clampInt(newValue ?? 0, 0, hpInfo.totalHp * 2);
        setAdjustmentValue(newValue);
      }
    }
  };

  const onScroll = (evt: Event): void => {
    if (isHovered || isFocused) {
      evt.preventDefault();
    }
  };

  useEffect(() => {
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onScroll);
    };
  });

  return (
    <div className={clsx([styles.container, className])} {...props}>
      <Button
        size="xx-small"
        variant="outline"
        themed
        disabled={isReadonly}
        onClick={onHealClick}
        className={clsx([styles.button, styles.heal])}
      >
        Heal
      </Button>
      <input
        className={styles.input}
        data-testid="hp-adjust-input"
        type="number"
        aria-label="Hit Points Adjustment"
        value={adjustmentValue ?? ""}
        min={HP_DAMAGE_TAKEN_VALUE.MIN}
        max={HP_DAMAGE_TAKEN_VALUE.MAX}
        onClick={useUnpropagatedClick()}
        onFocus={onFocus}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onChange={onChange}
        onBlur={onBlur}
        readOnly={isReadonly}
      />
      <Button
        size="xx-small"
        variant="outline"
        themed
        disabled={isReadonly}
        onClick={onDamageClick}
        className={clsx([styles.button, styles.damage])}
      >
        Damage
      </Button>
    </div>
  );
};
