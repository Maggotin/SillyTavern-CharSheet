import flatten from "lodash/flatten";
import uniq from "lodash/uniq";
import React from "react";

import { Button } from "@dndbeyond/character-components/es";
import {
  AbilityLookup,
  Constants,
  Item,
  ItemUtils,
  LimitedUseUtils,
  RuleData,
} from "../../character-rules-engine/es";

import { CollapsibleHeader, CollapsibleHeading } from "../common/Collapsible";

export default class SourceCollapsibleHeader extends React.PureComponent<{
  heading: any;
  clsNames: Array<string>;
  initialMetaItems: Array<string>;
  additionalMetaItems: Array<string>;
  previewSrc: string;
  limitedUseAbilities?: Array<any>;
  slotTypeNameSingular: string;
  slotTypeNamePlural: string;
  onUsePoolSlot?: (idx: number) => void;
  onClearPoolSlot?: (idx: number) => void;
  abilityLookup?: AbilityLookup;
  sourceOptions?: Array<any>;
  item: Item;
  ruleData: RuleData;
  proficiencyBonus: number;
}> {
  static defaultProps = {
    heading: "",
    clsNames: [],
    initialMetaItems: [],
    additionalMetaItems: [],
    slotTypeNameSingular: "Use",
    slotTypeNamePlural: "Uses",
  };

  handleCollapsibleClearButtonClick = () => {
    const { onClearPoolSlot } = this.props;

    if (onClearPoolSlot) {
      onClearPoolSlot(0);
    }
  };

  handleCollapsibleUseButtonClick = () => {
    const { onUsePoolSlot } = this.props;

    if (onUsePoolSlot) {
      onUsePoolSlot(0);
    }
  };

  render() {
    const {
      item,
      abilityLookup,
      previewSrc,
      heading,
      limitedUseAbilities,
      slotTypeNameSingular,
      slotTypeNamePlural,
      initialMetaItems,
      additionalMetaItems,
      sourceOptions,
      ruleData,
      proficiencyBonus,
    } = this.props;

    const sourceLimitedUse = limitedUseAbilities ? limitedUseAbilities : [];
    const optionLimitedUse =
      sourceOptions && sourceOptions.length > 0
        ? flatten(
            sourceOptions.map(
              (sourceOption) => sourceOption.limitedUseAbilities
            )
          )
        : [];
    const allLimitedUse = [...sourceLimitedUse, ...optionLimitedUse];

    let metaItems: Array<string> = [];
    let callout;
    if (allLimitedUse.length > 1) {
      const resetTypes = uniq(
        allLimitedUse.map((limitedUseAbility) => limitedUseAbility.resetType)
      );
      if (resetTypes.length > 1) {
        metaItems.push("Multiple Resets");
      } else {
        metaItems.push(resetTypes[0]);
      }
    } else if (allLimitedUse.length === 1) {
      const firstLimitedUse = allLimitedUse[0];
      let statModifierUsesId =
        LimitedUseUtils.getStatModifierUsesId(firstLimitedUse);
      if (
        firstLimitedUse.maxUses === 1 &&
        !statModifierUsesId &&
        sourceLimitedUse.length === 1
      ) {
        if (
          firstLimitedUse.resetType ===
            Constants.LimitedUseResetTypeEnum.SHORT_REST ||
          firstLimitedUse.resetType ===
            Constants.LimitedUseResetTypeEnum.LONG_REST
        ) {
          metaItems.push(`Once per ${firstLimitedUse.resetType}`);
        } else {
          metaItems.push(`Reset: ${firstLimitedUse.resetType}`);
        }
        const isSlotUsed = firstLimitedUse.numberUsed === 1;
        callout = (
          <div className="limited-list-item-callout">
            <Button
              style={isSlotUsed ? "" : "outline"}
              onClick={
                isSlotUsed
                  ? this.handleCollapsibleClearButtonClick
                  : this.handleCollapsibleUseButtonClick
              }
            >
              {isSlotUsed ? "Used" : "Use"}
            </Button>
          </div>
        );
      } else {
        if (firstLimitedUse.maxUses === -1) {
          metaItems.push("Special");
          callout = (
            <div className="limited-list-item-callout">
              <span className="limited-list-item-callout-extra">Special</span>
            </div>
          );
        } else if (statModifierUsesId) {
          const scaledMaxUses = LimitedUseUtils.deriveMaxUses(
            firstLimitedUse,
            abilityLookup ? abilityLookup : {},
            ruleData,
            proficiencyBonus
          );
          metaItems.push(
            `${scaledMaxUses} ${
              scaledMaxUses === 1 ? slotTypeNameSingular : slotTypeNamePlural
            }`
          );

          callout = (
            <div className="limited-list-item-callout">
              <span className="limited-list-item-callout-extra">
                Remaining {slotTypeNamePlural}
              </span>
              <span className="limited-list-item-callout-value">
                {scaledMaxUses - firstLimitedUse.numberUsed}
              </span>
            </div>
          );
        } else {
          metaItems.push(`${firstLimitedUse.maxUses} ${slotTypeNamePlural}`);
          callout = (
            <div className="limited-list-item-callout">
              <span className="limited-list-item-callout-extra">
                Remaining {slotTypeNamePlural}
              </span>
              <span className="limited-list-item-callout-value">
                {firstLimitedUse.maxUses - firstLimitedUse.numberUsed}
              </span>
            </div>
          );
        }

        metaItems.push(firstLimitedUse.resetType);
      }
    } else if (item) {
      const isStackable = ItemUtils.isStackable(item);
      const quantity = ItemUtils.getQuantity(item);
      if (isStackable) {
        callout = (
          <div className="equipment-list-item-callout-quantity">
            <span className="equipment-list-item-callout-quantity-extra">
              Qty
            </span>
            <span className="equipment-list-item-callout-quantity-value">
              {quantity}
            </span>
          </div>
        );
      }
    }

    metaItems = [...initialMetaItems, ...metaItems, ...additionalMetaItems];

    let collapsibleHeading;
    if (typeof heading === "string") {
      collapsibleHeading = <CollapsibleHeading>{heading}</CollapsibleHeading>;
    } else {
      collapsibleHeading = heading;
    }

    return (
      <CollapsibleHeader
        imgSrc={previewSrc}
        heading={collapsibleHeading}
        metaItems={metaItems}
        callout={callout}
      />
    );
  }
}
