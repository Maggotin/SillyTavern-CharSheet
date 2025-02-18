import clsx from "clsx";
import { createRef, FC, HTMLAttributes, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { DataOriginName } from "../../character-components/es";
import { Constants, ItemManager } from "../../character-rules-engine";

import { Button } from "~/components/Button";
import { Checkbox } from "~/components/Checkbox";
import { ItemName } from "~/components/ItemName";
import { useCharacterEngine } from "~/hooks/useCharacterEngine";
import { HP_DAMAGE_TAKEN_VALUE } from "~/subApps/sheet/constants";
import { Item, HitPointInfo, Creature } from "~/types";

import styles from "./styles.module.css";

interface Props extends HTMLAttributes<HTMLDivElement> {
  hpInfo: HitPointInfo;
  creature?: Creature;
  handleDamageUpdate?: (damageAmount: number) => void;
  vibrationAmount?: number;
}

// TODO This hitpoints adjuster doesn't work as a generic component for vehicles yet.

export const HitPointsAdjuster: FC<Props> = ({
  hpInfo,
  creature,
  handleDamageUpdate,
  vibrationAmount = 15,
  className,
  ...props
}) => {
  const {
    characterTheme,
    protectionSuppliers,
    deathSaveInfo,
    ruleData,
    characterActions,
    actionUtils,
    characterUtils,
    helperUtils,
    itemUtils,
    limitedUseUtils,
    modifierUtils,
    ruleDataUtils,
    creatureUtils,
  } = useCharacterEngine();

  const getInitialActiveProtectionSupplierKey = (): string | null => {
    const foundSupplier = protectionSuppliers.find(
      (supplier) =>
        supplier.availabilityStatus ===
        Constants.ProtectionAvailabilityStatusEnum.AVAILABLE
    );

    if (foundSupplier) {
      return foundSupplier.key;
    }

    return null;
  };

  const [tickCount, setTickCount] = useState(0);
  const [healingAmount, setHealingAmount] = useState<number | null>(null);
  const [damageAmount, setDamageAmount] = useState<number | null>(null);
  const [hpDifference, setHpDifference] = useState(
    characterUtils.calculateHitPoints(hpInfo, 0)
  );
  const [isValueChanged, setIsValueChanged] = useState<boolean>(false);
  const [activeProtectionSupplierKey, setActiveProtectionSupplierKey] =
    useState<string | null>(getInitialActiveProtectionSupplierKey());

  const damageInput = createRef<HTMLInputElement>();
  const healingInput = createRef<HTMLInputElement>();

  const dispatch = useDispatch();

  /* --- Helper Functions --- */

  const reset = (newTemp: number | null): void => {
    if (hpInfo.tempHp !== newTemp && newTemp !== null) {
      creature
        ? dispatch(
            characterActions.creatureHitPointsSet(
              creatureUtils.getMappingId(creature),
              hpInfo.removedHp,
              newTemp
            )
          )
        : dispatch(characterActions.hitPointsSet(hpInfo.removedHp, newTemp));
    }
    setTickCount(0);
    setHealingAmount(0);
    setDamageAmount(0);
    setIsValueChanged(false);
    setActiveProtectionSupplierKey(getInitialActiveProtectionSupplierKey());
  };

  const onKeyUpSave = (evt: React.KeyboardEvent<HTMLInputElement>): void => {
    if (evt.key === "Enter") {
      onClickSave();
    }
  };

  // onKeyDown must be used for the Escape key to reset the adjuster because the
  // Sidebar uses onKeyDown to close when the Escape key is pressed.
  const onKeyDownCancel = (
    evt: React.KeyboardEvent<HTMLInputElement>
  ): void => {
    evt.stopPropagation();
    evt.nativeEvent.stopImmediatePropagation();
    if (evt.key === "Escape") {
      reset(hpInfo.tempHp);
    }
  };

  /* --- On Input Change Functions --- */

  const onChangeHealing = (evt: React.ChangeEvent<HTMLInputElement>): void => {
    setTickCount(0);
    setHealingAmount(
      helperUtils.clampInt(
        helperUtils.parseInputInt(evt.target.value, HP_DAMAGE_TAKEN_VALUE.MIN),
        HP_DAMAGE_TAKEN_VALUE.MIN,
        HP_DAMAGE_TAKEN_VALUE.MAX
      )
    );
    setDamageAmount(0);
    setIsValueChanged(true);
  };

  const onChangeDamage = (evt: React.ChangeEvent<HTMLInputElement>): void => {
    setTickCount(0);
    setHealingAmount(0);
    setDamageAmount(
      helperUtils.clampInt(
        helperUtils.parseInputInt(evt.target.value, HP_DAMAGE_TAKEN_VALUE.MIN),
        HP_DAMAGE_TAKEN_VALUE.MIN,
        HP_DAMAGE_TAKEN_VALUE.MAX
      ) * -1
    );
    setIsValueChanged(true);
  };

  /* --- On Click Functions --- */

  const onClickIncrease = (): void => {
    setHealingAmount(
      healingAmount !== null && damageAmount === 0 ? healingAmount + 1 : 0
    );
    setDamageAmount(
      damageAmount !== null && damageAmount < 0 ? damageAmount + 1 : 0
    );
    setIsValueChanged(true);

    if (navigator.vibrate) {
      navigator.vibrate(vibrationAmount);
    }
  };

  const onClickDecrease = (): void => {
    setHealingAmount(
      healingAmount !== null && healingAmount > 0 ? healingAmount - 1 : 0
    );
    setDamageAmount(
      damageAmount !== null && healingAmount === 0 ? damageAmount - 1 : 0
    );
    setIsValueChanged(true);

    if (navigator.vibrate) {
      navigator.vibrate(vibrationAmount);
    }
  };

  const onClickSave = (): void => {
    const { newTemp, startHp, newHp } = hpDifference;

    let protectedHpResult: number | null = null;
    if (!creature) {
      if (
        startHp !== 0 &&
        newHp === 0 &&
        activeProtectionSupplierKey !== null
      ) {
        let foundActiveSupplier = protectionSuppliers.find(
          (supplier) => supplier.key === activeProtectionSupplierKey
        );

        if (foundActiveSupplier) {
          protectedHpResult = foundActiveSupplier.setHpValue;

          switch (foundActiveSupplier.type) {
            case Constants.ProtectionSupplierTypeEnum.ITEM: {
              const itemData = foundActiveSupplier.data as Item;
              const item = ItemManager.getItem(
                itemUtils.getMappingId(itemData)
              );

              const numberUsed = item.getNumberUsed();
              if (numberUsed !== null) {
                item.handleItemLimitedUseSet(numberUsed + 1);
              }
              break;
            }
            case Constants.ProtectionSupplierTypeEnum.RACIAL_TRAIT:
            case Constants.ProtectionSupplierTypeEnum.CLASS_FEATURE:
            case Constants.ProtectionSupplierTypeEnum.FEAT: {
              let action = foundActiveSupplier.action;
              if (action !== null) {
                let limitedUse = actionUtils.getLimitedUse(action);
                const id = actionUtils.getId(action);
                const entityTypeId = actionUtils.getEntityTypeId(action);
                const dataOriginType = actionUtils.getDataOriginType(action);

                if (
                  limitedUse !== null &&
                  id !== null &&
                  entityTypeId !== null
                ) {
                  const numberUsed = limitedUseUtils.getNumberUsed(limitedUse);
                  dispatch(
                    characterActions.actionUseSet(
                      id,
                      entityTypeId,
                      numberUsed + 1,
                      dataOriginType
                    )
                  );
                }
              }
              break;
            }
            default:
            // not implemented
          }
        }
      }
    }

    let removedHp: number = 0;
    if (protectedHpResult === null) {
      removedHp = hpInfo.totalHp - newHp;
    } else {
      removedHp = hpInfo.totalHp - protectedHpResult;
    }

    creature
      ? dispatch(
          characterActions.creatureHitPointsSet(
            creatureUtils.getMappingId(creature),
            removedHp,
            newTemp
          )
        )
      : dispatch(characterActions.hitPointsSet(removedHp, newTemp));

    const damage: number =
      damageAmount === null
        ? 0
        : Math.min(
            tickCount +
              (healingAmount === null ? 0 : healingAmount) +
              damageAmount,
            0
          );

    if (startHp === 0 && !creature) {
      if (newHp > 0) {
        dispatch(characterActions.deathSavesSet(0, 0));
      } else if (damage !== 0 && protectedHpResult === null) {
        dispatch(
          characterActions.deathSavesSet(
            Math.min(
              ruleDataUtils.getMaxDeathsavesFail(ruleData),
              deathSaveInfo.failCount + 1
            ),
            Math.min(
              ruleDataUtils.getMaxDeathsavesSuccess(ruleData),
              deathSaveInfo.successCount
            )
          )
        );
        reset(hpInfo.tempHp);
      }
    }

    if (startHp === newHp) {
      reset(newTemp);
    }
  };

  const onClickCancel = (): void => {
    reset(hpInfo.tempHp);
  };

  /* --- useEffects --- */

  useEffect(() => {
    const difference: number =
      (healingAmount === null ? 0 : healingAmount) +
      (damageAmount === null ? 0 : damageAmount) +
      tickCount;

    setHpDifference(characterUtils.calculateHitPoints(hpInfo, difference));
  }, [healingAmount, damageAmount, tickCount, hpInfo]);

  useEffect(() => {
    reset(hpInfo.tempHp);
  }, [hpInfo, protectionSuppliers]);

  useEffect(() => {
    if (handleDamageUpdate) {
      const damageValue: number =
        damageAmount === null
          ? 0
          : Math.min(
              tickCount +
                (healingAmount === null ? 0 : healingAmount) +
                damageAmount,
              0
            );
      handleDamageUpdate(damageValue);
    }
  }, [tickCount, healingAmount, damageAmount]);

  /* --- Render Functions --- */

  const renderProtectionInfo = (): React.ReactNode => {
    const { startHp, newHp } = hpDifference;

    if (
      !isValueChanged ||
      startHp === 0 ||
      newHp !== 0 ||
      protectionSuppliers.length === 0
    ) {
      return null;
    }

    return (
      <>
        {protectionSuppliers.map((protectionSupplier) => {
          if (
            protectionSupplier.availabilityStatus !==
            Constants.ProtectionAvailabilityStatusEnum.AVAILABLE
          ) {
            return null;
          }

          let dataOrigin = modifierUtils.getDataOrigin(
            protectionSupplier.modifier
          );
          let isEnabled =
            activeProtectionSupplierKey !== null &&
            protectionSupplier.key === activeProtectionSupplierKey;

          //TODO remove if check and ItemName => use DataOriginName when EntityDataOriginLookup is available to be passed as a prop to DataOriginName
          let nameNode: React.ReactNode = null;
          if (
            protectionSupplier.type ===
            Constants.ProtectionSupplierTypeEnum.ITEM
          ) {
            nameNode = <ItemName item={protectionSupplier.data as Item} />;
          } else {
            nameNode = (
              <DataOriginName dataOrigin={dataOrigin} theme={characterTheme} />
            );
          }

          return (
            <div
              className={clsx([styles.row, styles.protectionNotice])}
              key={protectionSupplier.key}
            >
              <Checkbox
                checked={isEnabled}
                themed
                darkMode={characterTheme.isDarkMode}
                id={`${protectionSupplier.key}-checkbox`}
                onClick={() => {
                  isEnabled = !isEnabled;
                  setActiveProtectionSupplierKey(
                    isEnabled ? protectionSupplier.key : null
                  );
                }}
              />
              <label htmlFor={`${protectionSupplier.key}-checkbox`}>
                Instead of dropping to 0 hit points, use{" "}
                <strong>{nameNode}</strong> to set hit points to{" "}
                <strong>{protectionSupplier.setHpValue}</strong>
              </label>
            </div>
          );
        })}
      </>
    );
  };

  return (
    <div
      className={clsx([styles.column, styles.container, className])}
      {...props}
    >
      <div className={clsx([styles.row, styles.container])}>
        <div className={clsx([styles.column, styles.inputsContainer])}>
          <div
            className={clsx([styles.inputContainer, styles.healingContainer])}
          >
            <label
              htmlFor="healing-input"
              className={clsx([styles.inputLabel, styles.positiveColor])}
            >
              Healing
            </label>
            <input
              ref={healingInput}
              type="number"
              id="healing-input"
              className={styles.input}
              value={
                healingAmount === null
                  ? ""
                  : Math.max(
                      tickCount +
                        healingAmount +
                        (damageAmount === null ? 0 : damageAmount),
                      0
                    )
              }
              min={HP_DAMAGE_TAKEN_VALUE.MIN}
              max={HP_DAMAGE_TAKEN_VALUE.MAX}
              onChange={onChangeHealing}
              onKeyUp={onKeyUpSave}
              onKeyDown={onKeyDownCancel}
            />
          </div>
          <div className={clsx([styles.row, styles.newValues])}>
            <div
              className={clsx([
                styles.column,
                hpDifference.newHp > hpDifference.startHp &&
                  styles.positiveColor,
                hpDifference.newHp < hpDifference.startHp &&
                  styles.negativeColor,
              ])}
            >
              <span className={styles.label}>New HP</span>
              <span className={styles.value} data-testid="new-hp">
                {hpDifference.newHp}
              </span>
            </div>
            {hpInfo.tempHp !== null && hpInfo.tempHp > 0 && (
              <div
                className={clsx([
                  styles.column,
                  hpDifference.newTemp > hpInfo.tempHp && styles.positiveColor,
                  hpDifference.newTemp < hpInfo.tempHp && styles.negativeColor,
                ])}
              >
                <span className={styles.label}>New Temp</span>
                <span className={styles.value} data-testid="new-temp-hp">
                  {hpDifference.newTemp}
                </span>
              </div>
            )}
          </div>
          <div
            className={clsx([styles.inputContainer, styles.damageContainer])}
          >
            <label
              htmlFor="damage-input"
              className={clsx([styles.inputLabel, styles.negativeColor])}
            >
              Damage
            </label>
            <input
              ref={damageInput}
              type="number"
              id="damage-input"
              className={styles.input}
              value={
                damageAmount === null
                  ? ""
                  : Math.abs(
                      Math.min(
                        tickCount +
                          (healingAmount === null ? 0 : healingAmount) +
                          damageAmount,
                        0
                      )
                    )
              }
              min={HP_DAMAGE_TAKEN_VALUE.MIN}
              max={HP_DAMAGE_TAKEN_VALUE.MAX}
              onChange={onChangeDamage}
              onKeyUp={onKeyUpSave}
              onKeyDown={onKeyDownCancel}
            />
          </div>
        </div>
        <div className={clsx([styles.column, styles.modifyButtons])}>
          <Button
            onClick={onClickIncrease}
            themed
            size="xx-small"
            className={styles.increase}
            aria-label="Increase Hit Points"
          />
          <Button
            onClick={onClickDecrease}
            themed
            size="xx-small"
            className={styles.decrease}
            aria-label="Decrease Hit Points"
          />
        </div>
      </div>
      {!creature && renderProtectionInfo()}
      {isValueChanged && (
        <div className={clsx([styles.row, styles.applyButtons])}>
          <Button onClick={onClickSave} size="xx-small" themed>
            Apply Changes
          </Button>
          <Button
            onClick={onClickCancel}
            variant="outline"
            size="xx-small"
            themed
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
};
