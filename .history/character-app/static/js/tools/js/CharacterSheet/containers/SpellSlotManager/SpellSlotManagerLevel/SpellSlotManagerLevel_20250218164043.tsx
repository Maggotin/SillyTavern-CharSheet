import React from "react";

import { FormatUtils } from "../../rules-engine/es";

import SlotManager from "../../../../Shared/components/SlotManager";

interface Props {
  level: number;
  available: number;
  used: number;
  onSlotSet?: (level: number, used: number) => void;
  isInteractive: boolean;
}
export default class SpellSlotManagerLevel extends React.PureComponent<Props> {
  handleSlotSet = (used: number): void => {
    const { onSlotSet, level } = this.props;

    if (onSlotSet) {
      onSlotSet(level, used);
    }
  };

  render() {
    let { level, available, used, isInteractive } = this.props;

    return (
      <div className="ct-spell-slot-manager__level">
        <div className="ct-spell-slot-manager__level-name">
          {FormatUtils.ordinalize(level)} Level
        </div>
        <SlotManager
          available={available}
          used={used}
          onSet={this.handleSlotSet}
          size="small"
          isInteractive={isInteractive}
        />
      </div>
    );
  }
}
