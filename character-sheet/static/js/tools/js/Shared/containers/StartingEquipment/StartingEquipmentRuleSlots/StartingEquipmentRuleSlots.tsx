import React from "react";

import {
  BaseItemDefinitionContract,
  Modifier,
  RuleData,
  StartingEquipmentRuleSlotContract,
  TypeValueLookup,
} from "@dndbeyond/character-rules-engine/es";
import { Constants, ItemUtils } from "@dndbeyond/character-rules-engine/es";

import StartingEquipmentRuleSlot from "../StartingEquipmentRuleSlot";
import { StartingEquipmentRuleSlotSelection } from "../typings";

interface Props {
  ruleSlots: Array<StartingEquipmentRuleSlotContract>;
  onRuleSlotSelection: (
    selections: Array<StartingEquipmentRuleSlotSelection>
  ) => void;
  onRuleSelection: (
    slotIdx: number,
    ruleIdx: number,
    dataId: number | null
  ) => void;
  activeIdx: number | null;
  globalModifiers: Array<Modifier>;
  valueLookupByType: TypeValueLookup;
  ruleData: RuleData;
}
export default class StartingEquipmentRuleSlots extends React.PureComponent<Props> {
  static defaultProps = {
    activeIdx: null,
  };

  isRuleSlotDisabled = (
    ruleSlot: StartingEquipmentRuleSlotContract
  ): boolean => {
    const { globalModifiers, valueLookupByType, ruleData } = this.props;

    let isDisabled: boolean = false;
    let proficiencyRuleTypes: Array<Constants.StartingEquipmentRuleTypeEnum> = [
      Constants.StartingEquipmentRuleTypeEnum.WEAPON,
      Constants.StartingEquipmentRuleTypeEnum.ARMOR,
    ];

    if (ruleSlot.rules) {
      ruleSlot.rules
        .filter(
          (rule) =>
            rule.proficiencyRequired &&
            proficiencyRuleTypes.includes(rule.ruleType)
        )
        .forEach((rule) => {
          if (rule.definitions) {
            rule.definitions.forEach((item: BaseItemDefinitionContract) => {
              let simulatedItem = ItemUtils.simulateItem(
                item,
                globalModifiers,
                valueLookupByType,
                ruleData
              );
              if (!ItemUtils.hasProficiency(simulatedItem)) {
                isDisabled = true;
              }
            });
          }
        });
    }

    return isDisabled;
  };

  render() {
    const {
      ruleSlots,
      activeIdx,
      onRuleSelection,
      onRuleSlotSelection,
      ruleData,
    } = this.props;

    return (
      <div className="starting-equipment-rule-slots">
        {ruleSlots.map((ruleSlot, ruleSlotIdx) => (
          <StartingEquipmentRuleSlot
            key={ruleSlotIdx}
            isMultiSlot={ruleSlots.length > 1}
            slotIdx={ruleSlotIdx}
            onRuleSelection={onRuleSelection}
            onRuleSlotSelection={onRuleSlotSelection}
            isActive={activeIdx === null || activeIdx === ruleSlotIdx}
            isSelected={activeIdx === ruleSlotIdx}
            isDisabled={this.isRuleSlotDisabled(ruleSlot)}
            {...ruleSlot}
            rules={ruleSlot.rules ? ruleSlot.rules : []}
            ruleData={ruleData}
          />
        ))}
      </div>
    );
  }
}
