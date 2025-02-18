import React from "react";

import { Checkbox, Select } from "../../character-components/es";
import {
  BaseItemDefinitionContract,
  Constants,
  HelperUtils,
  ItemUtils,
  RuleData,
  SourceUtils,
  StartingEquipmentRuleContract,
  StartingEquipmentUtils,
} from "../../character-rules-engine/es";

import { HtmlContent } from "~/components/HtmlContent";

import { TypeScriptUtils } from "../../../utils";
import { StartingEquipmentRuleSlotSelection } from "../typings";

interface Props {
  isMultiSlot: boolean;
  rules: Array<StartingEquipmentRuleContract>;
  name: string | null;
  slotIdx: number;
  onRuleSlotSelection: (
    selections: Array<StartingEquipmentRuleSlotSelection>
  ) => void;
  onRuleSelection: (
    slotIdx: number,
    ruleIdx: number,
    dataId: number | null
  ) => void;
  isActive: boolean;
  isSelected: boolean;
  isDisabled: boolean;
  ruleData: RuleData;
}
export default class StartingEquipmentRuleSlot extends React.PureComponent<Props> {
  static defaultProps = {
    isMultiSlot: false,
    rules: [],
    name: "",
    slotIdx: 0,
    isActive: true,
    isSelected: false,
    isDisabled: false,
  };

  componentDidMount() {
    const { isMultiSlot, rules } = this.props;

    if (
      !isMultiSlot &&
      rules.length &&
      rules[0].ruleType !== Constants.StartingEquipmentRuleTypeEnum.INSTRUCTION
    ) {
      this.handleSelection();
    }
  }

  handleSelection = (): void => {
    const { rules, onRuleSlotSelection, slotIdx, isDisabled } = this.props;

    if (isDisabled) {
      return;
    }

    if (onRuleSlotSelection) {
      onRuleSlotSelection(
        rules
          .filter(
            (rule) =>
              rule.ruleType !==
              Constants.StartingEquipmentRuleTypeEnum.INSTRUCTION
          )
          .map((rule, ruleIdx): StartingEquipmentRuleSlotSelection => {
            let defaultDataId: number = 0;

            if (
              StartingEquipmentUtils.deriveIsEquipmentStartingEquipmentRuleType(
                rule.ruleType
              ) &&
              rule.definitions &&
              rule.definitions.length
            ) {
              let firstItem = rule.definitions[0];
              defaultDataId = firstItem.id;
            }

            let dataId: number | null;
            if (rule.definitions && rule.definitions.length === 1) {
              dataId = defaultDataId;
            } else {
              dataId = null;
            }

            return {
              ruleSlotIdx: slotIdx,
              ruleIdx,
              dataId,
            };
          })
      );
    }
  };

  handleRuleSelection = (ruleIdx: number, id: string): void => {
    const { onRuleSelection, slotIdx, isDisabled } = this.props;

    if (isDisabled) {
      return;
    }

    if (onRuleSelection) {
      onRuleSelection(slotIdx, ruleIdx, HelperUtils.parseInputInt(id));
    }
  };

  render() {
    const {
      rules,
      name,
      isMultiSlot,
      isActive,
      isSelected,
      isDisabled,
      ruleData,
    } = this.props;

    let classNames: Array<string> = ["starting-equipment-rule-slot"];
    if ((!isMultiSlot || (isMultiSlot && isActive)) && !isDisabled) {
      classNames.push("starting-equipment-rule-slot-active");
    } else {
      classNames.push("starting-equipment-rule-slot-inactive");
    }
    if (isSelected) {
      classNames.push("starting-equipment-rule-slot-selected");
    }
    if (isDisabled) {
      classNames.push("starting-equipment-rule-slot-disabled");
    }

    let isInstruction: boolean = !!rules.find(
      (rule) =>
        rule.ruleType === Constants.StartingEquipmentRuleTypeEnum.INSTRUCTION
    );
    let isOnlyInstruction: boolean = false;
    if (
      isInstruction &&
      !rules.find(
        (rule) =>
          rule.ruleType !== Constants.StartingEquipmentRuleTypeEnum.INSTRUCTION
      )
    ) {
      isOnlyInstruction = true;
      classNames.push("starting-equipment-rule-slot-instruction");
    }

    let hasCustom: boolean = !!rules.find(
      (rule) => rule.ruleType === Constants.StartingEquipmentRuleTypeEnum.CUSTOM
    );
    let hasMixedCustom: boolean = false;
    if (
      hasCustom &&
      rules.find(
        (rule) =>
          rule.ruleType !== Constants.StartingEquipmentRuleTypeEnum.CUSTOM
      )
    ) {
      hasMixedCustom = true;
    }

    let itemPacks: Array<BaseItemDefinitionContract> = rules
      .filter((rule) => {
        let isPack: boolean = false;
        if (rule.definitions && rule.definitions.length) {
          let firstItem = rule.definitions[0];
          isPack = ItemUtils.isDefinitionPack(firstItem);
        }

        return (
          isPack &&
          rule.ruleType === Constants.StartingEquipmentRuleTypeEnum.GEAR
        );
      })
      .map((rule) => rule.definitions && rule.definitions[0])
      .filter(TypeScriptUtils.isNotNullOrUndefined);

    return (
      <div
        className={classNames.join(" ")}
        onClick={isOnlyInstruction ? undefined : this.handleSelection}
      >
        <div className="starting-equipment-rule-slot-selection">
          {!isOnlyInstruction && (
            <div className="starting-equipment-rule-slot-checkmark">
              <Checkbox
                initiallyEnabled={isSelected}
                onChange={this.handleSelection}
                stopPropagation={true}
              />
            </div>
          )}
        </div>
        <div className="starting-equipment-rule-content">
          <div className="starting-equipment-rule-slot-name">{name}</div>
          {isDisabled && (
            <div className="starting-equipment-disabled-message">
              Missing required proficiency
            </div>
          )}
          {isSelected && (
            <div className="starting-equipment-rules">
              {rules.map((rule, ruleIdx) => {
                const { definitions, ruleType } = rule;

                let contentNode: React.ReactNode;
                if (
                  ruleType === Constants.StartingEquipmentRuleTypeEnum.ARMOR ||
                  ruleType === Constants.StartingEquipmentRuleTypeEnum.GEAR ||
                  ruleType === Constants.StartingEquipmentRuleTypeEnum.WEAPON ||
                  ruleType ===
                    Constants.StartingEquipmentRuleTypeEnum.ARMOR_TYPE ||
                  ruleType ===
                    Constants.StartingEquipmentRuleTypeEnum.GEAR_TYPE ||
                  ruleType ===
                    Constants.StartingEquipmentRuleTypeEnum.WEAPON_TYPE
                ) {
                  if (definitions && definitions.length > 1) {
                    const groupedOptions =
                      SourceUtils.getGroupedOptionsBySourceCategory(
                        definitions,
                        ruleData
                      );
                    contentNode = (
                      <div className="starting-equipment-rule">
                        <Select
                          options={groupedOptions}
                          value={null}
                          preventClickPropagating={true}
                          onChange={this.handleRuleSelection.bind(
                            this,
                            ruleIdx
                          )}
                        />
                      </div>
                    );
                  }
                }

                if (!contentNode) {
                  return null;
                }

                return (
                  <div className="starting-equipment-rule" key={ruleIdx}>
                    {contentNode}
                  </div>
                );
              })}
              {itemPacks.length > 0 && (
                <div className="starting-equipment-packs">
                  {(itemPacks as any).map(
                    (itemDefinition: BaseItemDefinitionContract) => (
                      <div
                        className="starting-equipment-pack"
                        key={itemDefinition.id}
                      >
                        {itemPacks.length > 1 && (
                          <div className="starting-equipment-pack-name">
                            {itemDefinition.name}
                          </div>
                        )}
                        {itemDefinition.description && (
                          <HtmlContent
                            className="starting-equipment-pack-desc"
                            html={itemDefinition.description}
                            withoutTooltips
                          />
                        )}
                      </div>
                    )
                  )}
                </div>
              )}
              {hasCustom && (
                <div className="starting-equipment-custom-add">
                  <div className="starting-equipment-custom-add-label">
                    {hasMixedCustom ? "Some item(s) " : "Item(s) "}
                    will be added to <strong>Other Possessions</strong>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
}
