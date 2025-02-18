import React from "react";

import {
  Modifier,
  RuleData,
  StartingEquipmentSlotContract,
  TypeValueLookup,
} from "../../character-rules-engine/es";

import StartingEquipmentRuleSlots from "../StartingEquipmentRuleSlots";
import { StartingEquipmentRuleSlotSelection } from "../typings";

interface Props {
  slots: Array<StartingEquipmentSlotContract>;
  onRuleSlotSelection: (
    selections: Array<StartingEquipmentRuleSlotSelection>
  ) => void;
  onRuleSelection: (
    slotIdx: number,
    ruleIdx: number,
    dataId: number | null
  ) => void;
  activeRuleSlots: Array<number | null>;
  globalModifiers: Array<Modifier>;
  valueLookupByType: TypeValueLookup;
  ruleData: RuleData;
}
export default class StartingEquipmentSlots extends React.PureComponent<Props> {
  render() {
    const {
      slots,
      activeRuleSlots,
      globalModifiers,
      valueLookupByType,
      ruleData,
      onRuleSelection,
      onRuleSlotSelection,
    } = this.props;

    return (
      <div className="starting-equipment-slots">
        {slots.map((slot, slotIdx) => (
          <div className="starting-equipment-slot" key={slotIdx}>
            <StartingEquipmentRuleSlots
              ruleSlots={slot.ruleSlots ? slot.ruleSlots : []}
              onRuleSelection={onRuleSelection.bind(this, slotIdx)}
              onRuleSlotSelection={onRuleSlotSelection.bind(this, slotIdx)}
              activeIdx={activeRuleSlots[slotIdx]}
              globalModifiers={globalModifiers}
              valueLookupByType={valueLookupByType}
              ruleData={ruleData}
            />
          </div>
        ))}
      </div>
    );
  }
}
