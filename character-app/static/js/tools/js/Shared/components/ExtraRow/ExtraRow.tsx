import React, { FC, HTMLAttributes } from "react";

import { Tooltip } from "@dndbeyond/character-common-components/es";
import { NoteComponents } from "@dndbeyond/character-components/es";
import {
  CharacterTheme,
  Constants,
  Creature,
  ExtraManager,
} from "@dndbeyond/character-rules-engine/es";

import { NumberDisplay } from "~/components/NumberDisplay";
import { useCharacterEngine } from "~/hooks/useCharacterEngine";

import ExtraName from "../ExtraName";

interface Props extends HTMLAttributes<HTMLDivElement> {
  extra: ExtraManager;
  onShow?: (extra: ExtraManager) => void;
  onStatusChange?: (extra: ExtraManager, newStatus: boolean) => void;
  showNotes: boolean;
  isReadonly: boolean;
  theme: CharacterTheme;
}

export const ExtraRow: FC<Props> = ({
  extra,
  onShow,
  onStatusChange,
  showNotes,
  isReadonly = false,
  theme,
  ...props
}) => {
  const { hpInfo } = useCharacterEngine();

  let avatarUrl = extra.getAvatarUrl();
  if (!avatarUrl) {
    avatarUrl = "";
  }
  const name = extra.getName();

  const handleClick = (evt: React.MouseEvent): void => {
    if (onShow) {
      evt.stopPropagation();
      evt.nativeEvent.stopImmediatePropagation();
      onShow(extra);
    }
  };

  const handleActivate = (): void => {
    if (onStatusChange) {
      onStatusChange(extra, true);
    }
  };

  const handleDeactivate = (): void => {
    if (onStatusChange) {
      onStatusChange(extra, false);
    }
  };

  const renderMetaItems = (): React.ReactNode => {
    let metaItems: Array<string> = [];

    const sizeInfo = extra.getSizeInfo();
    let size: string = "";
    if (sizeInfo !== null && sizeInfo.name !== null) {
      size = sizeInfo.name;
    }

    let type = extra.getType();
    let typeName: string = "";
    if (type) {
      typeName = type;
    }

    let description: string = `${size} ${typeName.toLowerCase()}`.trim();
    if (description) {
      metaItems.push(description);
    }

    return (
      <div
        className={`ct-extra-row__meta ${
          theme.isDarkMode ? "ct-extra-row__meta--dark-mode" : ""
        }`}
      >
        {metaItems.map((metaItem, idx) => (
          <span key={idx} className="ct-extra-row__meta-item">
            {metaItem}
          </span>
        ))}
      </div>
    );
  };

  const renderHitPoints = (): React.ReactNode => {
    let useOwnerHp = false;
    if (extra.isCreature()) {
      const extraData = extra.getExtraData() as Creature;
      if (extraData) {
        useOwnerHp = extraData.useOwnerHp;
      }
    }

    const hitPointInfo = useOwnerHp ? hpInfo : extra.getHitPointInfo().data;
    const showTooltip = useOwnerHp
      ? false
      : extra.getHitPointInfo().showTooltip;

    let contentNode: React.ReactNode = null;
    if (hitPointInfo !== null) {
      let totalHp: number = hitPointInfo.totalHp ? hitPointInfo.totalHp : 0;
      let remainingHp: number = hitPointInfo.remainingHp
        ? hitPointInfo.remainingHp
        : 0;
      let tempHp: number = hitPointInfo.tempHp ? hitPointInfo.tempHp : 0;

      const current: number = remainingHp + tempHp;
      const total: number = totalHp + tempHp;

      contentNode = (
        <React.Fragment>
          <span className="ct-extra-row__hp-valuestcs-extra-row__hp-value--current">
            {current}
          </span>
          <span className="ct-extra-row__hp-sep">/</span>
          <span className="ct-extra-row__hp-valuestcs-extra-row__hp-value--total">
            {total}
          </span>
        </React.Fragment>
      );
    } else {
      contentNode = (
        <span className="ct-extra-row__hp-valuestcs-extra-row__hp-value--current">
          --
        </span>
      );
    }

    let classNames: Array<string> = ["ct-extra-row__hp"];
    if (
      hitPointInfo !== null &&
      hitPointInfo.tempHp !== null &&
      hitPointInfo.tempHp > 0
    ) {
      classNames.push("ct-extra-row__hp--has-temp");
    }

    if (theme.isDarkMode) {
      classNames.push("ct-extra-row__hp--dark-mode");
    }
    return (
      <div className={classNames.join(" ")}>
        {contentNode}
        {showTooltip && renderAdditionalInfoTooltip()}
      </div>
    );
  };

  const renderSpeed = (): React.ReactNode => {
    const movementInfo = extra.getMovementInfo();

    const { data, label, showTooltip } = movementInfo;

    let contentNode: React.ReactNode = null;
    if (data !== null) {
      contentNode = (
        <React.Fragment>
          <div className="ct-extra-row__speed-value">
            <NumberDisplay type="distanceInFt" number={data.speed} />
            {showTooltip && renderAdditionalInfoTooltip()}
          </div>
          {data.movementId !== Constants.MovementTypeEnum.WALK && (
            <div className="ct-extra-row__speed-callout">{label}</div>
          )}
        </React.Fragment>
      );
    } else {
      contentNode = (
        <div className="ct-extra-row__speed-value">
          --
          {showTooltip && renderAdditionalInfoTooltip()}
        </div>
      );
    }

    return (
      <div
        className={`ct-extra-row__speed ${
          theme.isDarkMode ? "ct-extra-row__speed--dark-mode" : ""
        }`}
      >
        {contentNode}
      </div>
    );
  };

  const renderArmorClass = (): React.ReactNode => {
    let armorClassInfo = extra.getArmorClassInfo();

    let armorClassText: string | number = "--";
    if (armorClassInfo.value !== null) {
      armorClassText = armorClassInfo.value;
    }

    return (
      <React.Fragment>
        {armorClassText}
        {armorClassInfo.showTooltip && renderAdditionalInfoTooltip()}
      </React.Fragment>
    );
  };

  const renderAdditionalInfoTooltip = (): React.ReactNode => {
    return (
      <Tooltip
        isDarkMode={theme.isDarkMode}
        title={"View the full description for additional info"}
        className={`ct-extra-row__tooltip ${
          theme.isDarkMode ? "ct-extra-row__tooltip--dark-mode" : ""
        }`}
      >
        *
      </Tooltip>
    );
  };

  return (
    <div className="ct-extra-row" onClick={handleClick}>
      <div className="ct-extra-row__preview">
        {avatarUrl && (
          <img
            className="ct-extra-row__img"
            src={avatarUrl}
            alt={`${name} preview`}
          />
        )}
      </div>
      <div className="ct-extra-row__primary">
        <div
          className={`ct-extra-row__name ${
            theme.isDarkMode ? "ct-extra-row__name--dark-mode" : ""
          }`}
        >
          <ExtraName theme={theme} extra={extra} />
        </div>
        {renderMetaItems()}
      </div>
      <div
        className={`ct-extra-row__ac ${
          theme.isDarkMode ? "ct-extra-row__ac--dark-mode" : ""
        }`}
      >
        {renderArmorClass()}
      </div>
      {renderHitPoints()}
      {renderSpeed()}
      {showNotes && (
        <div className="ct-extra-row__notes">
          <NoteComponents theme={theme} notes={extra.getNoteComponents()} />
        </div>
      )}
      {/*<div className="ct-extra-row__action">
                  <SlotManager
                      used={isActive ? 1 : 0}
                      available={1}
                      size="small"
                      onUse={this.handleActivate}
                      onClear={this.handleDeactivate}
                      isInteractive={!isReadonly}
                  />
              </div>*/}
    </div>
  );
};
