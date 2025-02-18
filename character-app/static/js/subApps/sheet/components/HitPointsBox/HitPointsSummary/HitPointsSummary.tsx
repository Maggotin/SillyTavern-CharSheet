import clsx from "clsx";
import { FC, HTMLAttributes, useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";

import { useCharacterEngine } from "~/hooks/useCharacterEngine";
import accessibility from "~/styles/accessibility.module.css";
import { HP_TEMP_VALUE } from "~/subApps/sheet/constants";
import { appEnvSelectors } from "~/tools/js/Shared/selectors";
import { CharacterHitPointInfo, Creature, HitPointInfo } from "~/types";

import styles from "./styles.module.css";

interface Props extends HTMLAttributes<HTMLDivElement> {
  hpInfo: CharacterHitPointInfo | HitPointInfo;
  creature?: Creature;
  showOriginalMax?: boolean;
  showPermanentInputs?: boolean;
}

export const HitPointsSummary: FC<Props> = ({
  hpInfo,
  creature,
  showOriginalMax = false,
  showPermanentInputs = false,
  className,
  ...props
}) => {
  // TODO This hitpoints summary doesn't work as a generic component for vehicles yet. Works for creatures and characters.

  const { characterActions, creatureUtils, helperUtils } = useCharacterEngine();

  const isReadonly = useSelector(appEnvSelectors.getIsReadonly);

  const [isCurrentEditorVisible, setIsCurrentEditorVisible] = useState(false);
  const [isTempEditorVisible, setIsTempEditorVisible] = useState(false);
  const [currentValue, setCurrentValue] = useState<number | null>(
    hpInfo.remainingHp
  );
  const [tempValue, setTempValue] = useState<number | null>(hpInfo.tempHp);
  const [isMaxDifferent, setIsMaxDifferent] = useState<boolean>(false);

  const currentEditorRef = useRef<HTMLInputElement | null>(null);
  const tempEditorRef = useRef<HTMLInputElement | null>(null);

  const currentId = uuidv4();
  const tempId = uuidv4();

  const dispatch = useDispatch();

  /* --- Current hit point functions --- */

  const onCurrentInputChange = (
    evt: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setCurrentValue(helperUtils.parseInputInt(evt.target.value));
  };

  const onCurrentInputClick = (
    evt: React.MouseEvent<HTMLInputElement>
  ): void => {
    evt.stopPropagation();
    evt.nativeEvent.stopImmediatePropagation();
  };

  const onCurrentClick = (evt: React.MouseEvent<HTMLButtonElement>): void => {
    if (!isReadonly) {
      evt.stopPropagation();
      evt.nativeEvent.stopImmediatePropagation();
      setIsCurrentEditorVisible(true);
    }
  };

  const dispatchCurrentHp = (value: number | null) => {
    if (value === null) {
      value = hpInfo.remainingHp;
    } else {
      let newRemovedAmount = hpInfo.totalHp - value;
      newRemovedAmount = helperUtils.clampInt(
        newRemovedAmount,
        0,
        hpInfo.totalHp
      );
      value = hpInfo.totalHp - newRemovedAmount;
      if (newRemovedAmount !== hpInfo.removedHp) {
        creature
          ? dispatch(
              characterActions.creatureHitPointsSet(
                creatureUtils.getMappingId(creature),
                newRemovedAmount,
                hpInfo.tempHp ?? HP_TEMP_VALUE.MIN
              )
            )
          : dispatch(
              characterActions.hitPointsSet(
                newRemovedAmount,
                hpInfo.tempHp ?? HP_TEMP_VALUE.MIN
              )
            );
      }
    }
    setCurrentValue(value);
    setIsCurrentEditorVisible(false);
  };

  const onCurrentInputBlur = (
    evt: React.FocusEvent<HTMLInputElement>
  ): void => {
    let current: number | null = helperUtils.parseInputInt(evt.target.value);
    dispatchCurrentHp(current);
  };

  const onCurrentInputEnter = (
    evt: React.KeyboardEvent<HTMLInputElement>
  ): void => {
    if (evt.key === "Enter") {
      let current: number | null = helperUtils.parseInputInt(
        evt.currentTarget.value
      );
      dispatchCurrentHp(current);
    }
  };

  /* --- Temp hit point functions --- */

  const onTempInputClick = (evt: React.MouseEvent<HTMLInputElement>): void => {
    evt.stopPropagation();
    evt.nativeEvent.stopImmediatePropagation();
  };

  const onTempClick = (evt: React.MouseEvent<HTMLButtonElement>): void => {
    if (!isReadonly) {
      evt.stopPropagation();
      evt.nativeEvent.stopImmediatePropagation();
      setIsTempEditorVisible(true);
    }
  };

  const onTempInputChange = (
    evt: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setTempValue(helperUtils.parseInputInt(evt.target.value));
  };

  const dispatchTempHp = (value: number | null) => {
    if (value === null) {
      value = hpInfo.tempHp;
    } else {
      value = helperUtils.clampInt(value, HP_TEMP_VALUE.MIN, HP_TEMP_VALUE.MAX);
      if (value !== hpInfo.tempHp) {
        creature
          ? dispatch(
              characterActions.creatureHitPointsSet(
                creatureUtils.getMappingId(creature),
                hpInfo.removedHp,
                value
              )
            )
          : dispatch(characterActions.hitPointsSet(hpInfo.removedHp, value));
      }
    }
    setTempValue(value);
    setIsTempEditorVisible(false);
  };

  const onTempInputBlur = (evt: React.FocusEvent<HTMLInputElement>): void => {
    let temp: number | null = helperUtils.parseInputInt(evt.target.value);
    dispatchTempHp(temp);
  };

  const onTempInputEnter = (
    evt: React.KeyboardEvent<HTMLInputElement>
  ): void => {
    if (evt.key === "Enter") {
      let temp: number | null = helperUtils.parseInputInt(
        evt.currentTarget.value
      );
      dispatchTempHp(temp);
    }
  };

  /* --- useEffects --- */

  useEffect(() => {
    if (isTempEditorVisible) {
      tempEditorRef.current?.focus();
    }
  }, [isTempEditorVisible]);

  useEffect(() => {
    if (isCurrentEditorVisible) {
      currentEditorRef.current?.focus();
    }
  }, [isCurrentEditorVisible]);

  useEffect(() => {
    setCurrentValue(hpInfo.remainingHp);
  }, [hpInfo.remainingHp]);

  useEffect(() => {
    setTempValue(hpInfo.tempHp);
  }, [hpInfo.tempHp]);

  useEffect(() => {
    if (showOriginalMax && (hpInfo.overrideHp || hpInfo.bonusHp)) {
      setIsMaxDifferent(true);
    } else {
      setIsMaxDifferent(false);
    }
  }, [hpInfo.overrideHp, hpInfo.bonusHp, showOriginalMax]);

  /* --- Render Functions --- */

  const renderTempHitPoints = (): React.ReactNode => {
    if (isTempEditorVisible || showPermanentInputs) {
      return (
        <div>
          <input
            data-testid="temp-hp-input"
            id={tempId}
            ref={tempEditorRef}
            className={styles.input}
            type="number"
            value={tempValue ?? ""}
            min={HP_TEMP_VALUE.MIN}
            max={HP_TEMP_VALUE.MAX}
            onChange={onTempInputChange}
            onBlur={onTempInputBlur}
            onClick={onTempInputClick}
            onKeyDown={onTempInputEnter}
          />
        </div>
      );
    }

    if (!tempValue) {
      return (
        <button
          id={tempId}
          className={clsx([
            styles.valueButton,
            styles.tempEmpty,
            styles.number,
          ])}
          onClick={onTempClick}
        >
          --
        </button>
      );
    }

    return (
      <button
        id={tempId}
        className={clsx([styles.valueButton, styles.number])}
        onClick={onTempClick}
      >
        {tempValue}
      </button>
    );
  };

  return (
    <div className={clsx([styles.container, className])} {...props}>
      <div className={styles.innerContainer}>
        <div className={styles.item}>
          <label
            htmlFor={currentId}
            className={styles.label}
            aria-label={`Current hit points ${currentValue}, change current hit points`}
          >
            Current
          </label>
          {isCurrentEditorVisible || showPermanentInputs ? (
            <div>
              <input
                data-testid="current-hp-input"
                id={currentId}
                ref={currentEditorRef}
                className={styles.input}
                type="number"
                value={currentValue ?? ""}
                min={0}
                max={hpInfo.totalHp}
                onChange={onCurrentInputChange}
                onBlur={onCurrentInputBlur}
                onClick={onCurrentInputClick}
                onKeyDown={onCurrentInputEnter}
              />
            </div>
          ) : (
            <button
              id={currentId}
              className={clsx([styles.valueButton, styles.number])}
              onClick={onCurrentClick}
            >
              {currentValue}
            </button>
          )}
        </div>
        <div className={styles.item}>
          <div className={styles.spacer} />
          <span className={clsx([styles.number, styles.slash])}>/</span>
        </div>
        <div className={styles.item}>
          <span className={styles.label} aria-hidden="true">
            Max
          </span>
          <span
            className={accessibility.screenreaderOnly}
          >{`Max hit points`}</span>
          <div className={clsx([styles.number, styles.maxContainer])}>
            <span
              data-testid="max-hp"
              className={clsx([
                styles.max,
                isMaxDifferent &&
                  "baseTotalHp" in hpInfo &&
                  (hpInfo.totalHp - hpInfo.baseTotalHp > 0
                    ? styles.positive
                    : styles.negative),
              ])}
            >
              {hpInfo.totalHp}
            </span>
            {isMaxDifferent && "baseTotalHp" in hpInfo && (
              <span
                data-testid="origin-max-hp"
                className={clsx([styles.originalMax])}
              >
                ({hpInfo.baseTotalHp})
              </span>
            )}
          </div>
        </div>
      </div>
      <div className={clsx([styles.item, styles.temp])}>
        <label
          htmlFor={tempId}
          aria-label={
            !tempValue
              ? "Temporary hit points 0, set temporary hit points"
              : `Temporary hit points ${tempValue}, change temporary hit points`
          }
          className={styles.label}
        >
          Temp
        </label>
        {renderTempHitPoints()}
      </div>
    </div>
  );
};
