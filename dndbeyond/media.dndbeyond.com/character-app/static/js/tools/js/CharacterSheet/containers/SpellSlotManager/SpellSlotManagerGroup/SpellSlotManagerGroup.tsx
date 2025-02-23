import React from "react";

import {
  Collapsible,
  CollapsibleHeaderContent,
} from "@dndbeyond/character-components/es";
import {
  FormatUtils,
  SpellSlotContract,
} from "@dndbeyond/character-rules-engine/es";

import SpellSlotManagerLevel from "../SpellSlotManagerLevel";

interface Props {
  heading: string;
  slots: Array<SpellSlotContract>;
  onSlotSet?: (level: number, used: number) => void;
  isReadonly: boolean;
}
export default class SpellSlotManagerGroup extends React.PureComponent<Props> {
  renderCallout = (): React.ReactNode => {
    const { slots } = this.props;

    return (
      <div className="ct-spell-slot-manager__group-summary">
        {slots.map((levelSlots) => (
          <div
            className="ct-spell-slot-manager__group-level"
            key={levelSlots.level}
          >
            <div className="ct-spell-slot-manager__group-level-name">
              {FormatUtils.ordinalize(levelSlots.level)}
            </div>
            <div className="ct-spell-slot-manager__group-level-available">
              {levelSlots.available === 0 ? "-" : levelSlots.available}
            </div>
          </div>
        ))}
      </div>
    );
  };

  render() {
    const { slots, onSlotSet, heading, isReadonly } = this.props;

    let headerNode: React.ReactNode = (
      <CollapsibleHeaderContent
        heading={heading}
        callout={this.renderCallout()}
      />
    );

    if (!slots.length) {
      return null;
    }

    return (
      <Collapsible header={headerNode} className="ct-spell-slot-manager__group">
        <div className="ct-spell-slot-manager__levels">
          {slots.map((levelSlots) => {
            if (levelSlots.available === 0) {
              return null;
            }
            return (
              <SpellSlotManagerLevel
                key={levelSlots.level}
                {...levelSlots}
                onSlotSet={onSlotSet}
                isInteractive={!isReadonly}
              />
            );
          })}
        </div>
      </Collapsible>
    );
  }
}
