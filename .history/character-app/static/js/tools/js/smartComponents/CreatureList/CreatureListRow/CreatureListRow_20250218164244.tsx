import * as React from "react";

import {
  Creature,
  CreatureUtils,
  Constants,
  RuleData,
  RuleDataUtils,
  CharacterTheme,
} from "../../character-rules-engine/es";

import { NumberDisplay } from "~/components/NumberDisplay";

import { NoteComponents } from "../../NoteComponents";

//TODO this component is currently replaced by ExtraListRow for Creatures and Vehicles as Extras

interface Props {
  creature: Creature;
  ruleData: RuleData;
  onShow?: (id: number) => void;
  onStatusChange?: (id: number, isActive: boolean) => void;
  showNotes: boolean;
  isReadonly: boolean;
  className: string;
  theme: CharacterTheme;
}

export default class CreatureListRow extends React.PureComponent<Props> {
  static defaultProps = {
    className: "",
  };

  handleClick = (evt: React.MouseEvent): void => {
    const { onShow, creature } = this.props;

    if (onShow) {
      evt.stopPropagation();
      evt.nativeEvent.stopImmediatePropagation();
      onShow(CreatureUtils.getMappingId(creature));
    }
  };

  handleActivate = (): void => {
    const { onStatusChange, creature } = this.props;

    if (onStatusChange) {
      onStatusChange(CreatureUtils.getMappingId(creature), true);
    }
  };

  handleDeactivate = (): void => {
    const { onStatusChange, creature } = this.props;

    if (onStatusChange) {
      onStatusChange(CreatureUtils.getMappingId(creature), false);
    }
  };

  renderMetaItems = (): React.ReactNode => {
    const { creature, ruleData } = this.props;

    let metaItems: Array<string> = [];

    const sizeInfo = RuleDataUtils.getCreatureSizeInfo(
      CreatureUtils.getSizeId(creature),
      ruleData
    );
    let size: string = "";
    if (sizeInfo && sizeInfo.name !== null) {
      size = sizeInfo.name;
    }

    let type = CreatureUtils.getTypeName(creature, ruleData);

    let description: string = `${size} ${type}`.trim();
    if (description) {
      metaItems.push(description);
    }

    return (
      <div className="ddbc-creature-list__row-meta">
        {metaItems.map((metaItem, idx) => (
          <span key={idx} className="ddbc-creature-list__row-meta-item">
            {metaItem}
          </span>
        ))}
      </div>
    );
  };

  renderHitPoints = (): React.ReactNode => {
    const { creature } = this.props;

    const hitPointInfo = CreatureUtils.getHitPointInfo(creature);
    const tempHp = hitPointInfo.tempHp === null ? 0 : hitPointInfo.tempHp;

    let classNames: Array<string> = ["ddbc-creature-list__row-hp"];
    if (tempHp > 0) {
      classNames.push("ddbc-creature-list__row-hp--has-temp");
    }

    return (
      <div className={classNames.join(" ")}>
        <span className="ddbc-creature-list__row-hp-value ddbc-creature-list__row-hp-value--current">
          {hitPointInfo.remainingHp + tempHp}
        </span>
        <span className="ddbc-creature-list__row-hp-sep">/</span>
        <span className="ddbc-creature-list__row-hp-value ddbc-creature-list__row-hp-value--total">
          {hitPointInfo.totalHp + tempHp}
        </span>
      </div>
    );
  };

  renderSpeed = (): React.ReactNode => {
    const { creature, ruleData, theme } = this.props;

    const movementInfo = CreatureUtils.getHighestMovementInfo(creature);

    let contentNode: React.ReactNode;
    if (movementInfo) {
      contentNode = (
        <React.Fragment>
          <div className="ddbc-creature-list__row-speed-value">
            <NumberDisplay type="distanceInFt" number={movementInfo.speed} />
          </div>
          {movementInfo.movementId !== Constants.MovementTypeEnum.WALK && (
            <div className="ddbc-creature-list__row-speed-callout">
              {RuleDataUtils.getMovementDescription(
                movementInfo.movementId,
                ruleData
              )}
            </div>
          )}
        </React.Fragment>
      );
    } else {
      contentNode = (
        <div className="ddbc-creature-list__row-speed-value">--</div>
      );
    }

    return <div className="ddbc-creature-list__row-speed">{contentNode}</div>;
  };

  render() {
    const { creature, ruleData, isReadonly, showNotes, className, theme } =
      this.props;

    const avatarUrl = CreatureUtils.getAvatarUrl(creature);
    const name = CreatureUtils.getName(creature);
    const armorClass = CreatureUtils.getArmorClass(creature);
    const movementInfo = CreatureUtils.getHighestMovementInfo(creature);
    const isActive = CreatureUtils.isActive(creature);

    let classNames: Array<string> = [className, "ddbc-creature-row"];

    return (
      <div className={classNames.join(" ")} onClick={this.handleClick}>
        <div className="ddbc-creature-list__row-preview">
          {avatarUrl && (
            <img
              className="ddbc-creature-list__row-img"
              src={avatarUrl}
              alt={`${name} preview`}
            />
          )}
        </div>
        <div className="ddbc-creature-list__row-primary">
          <div className="ddbc-creature-list__row-name">{name}</div>
          {this.renderMetaItems()}
        </div>
        <div className="ddbc-creature-list__row-ac">{armorClass}</div>
        {this.renderHitPoints()}
        {this.renderSpeed()}
        {showNotes && (
          <div className="ddbc-creature-list__row-notes">
            <NoteComponents
              notes={CreatureUtils.getNoteComponents(creature, ruleData)}
              theme={theme}
            />
          </div>
        )}
        {/*<div className="ddbc-creature-list__row-action">
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
  }
}
