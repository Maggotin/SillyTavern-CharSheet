import React from "react";

import {
  AbilityLookup,
  DataOriginBaseAction,
  DataOriginSpell,
  Constants,
  EntityLimitedUseContract,
  LimitedUseUtils,
  RuleData,
  RuleDataUtils,
  CharacterTheme,
} from "@dndbeyond/character-rules-engine/es";

import SlotManager from "../../../../Shared/components/SlotManager";
import SlotManagerLarge from "../../../../Shared/components/SlotManagerLarge";

interface Props {
  component: DataOriginBaseAction | DataOriginSpell;
  limitedUse: EntityLimitedUseContract | null;
  onUseSet?: (
    component: DataOriginBaseAction | DataOriginSpell,
    uses: number
  ) => void;

  ruleData: RuleData;
  abilityLookup: AbilityLookup;
  isInteractive: boolean;
  largeLimitedUseAmount: number;
  proficiencyBonus: number;
  theme: CharacterTheme;
}
export default class FeatureSnippetLimitedUse extends React.PureComponent<Props> {
  static defaultProps = {
    largeLimitedUseAmount: 8,
  };

  handleUseSet = (uses: number): void => {
    const { onUseSet, component } = this.props;

    if (onUseSet) {
      onUseSet(component, uses);
    }
  };

  renderSmallAmountSlotPool = (): React.ReactNode => {
    const {
      limitedUse,
      ruleData,
      abilityLookup,
      isInteractive,
      proficiencyBonus,
    } = this.props;

    if (!limitedUse) {
      return null;
    }

    const numberUsed = LimitedUseUtils.getNumberUsed(limitedUse);
    const maxUses = LimitedUseUtils.deriveMaxUses(
      limitedUse,
      abilityLookup,
      ruleData,
      proficiencyBonus
    );

    if (!maxUses) {
      return null;
    }

    return (
      <SlotManager
        used={numberUsed}
        available={maxUses}
        size={"small"}
        onSet={this.handleUseSet}
        isInteractive={isInteractive}
      />
    );
  };

  renderLargeAmountSlotPool = (): React.ReactNode => {
    const {
      limitedUse,
      ruleData,
      abilityLookup,
      isInteractive,
      proficiencyBonus,
    } = this.props;

    if (!limitedUse) {
      return null;
    }

    const numberUsed = LimitedUseUtils.getNumberUsed(limitedUse);
    const maxUses = LimitedUseUtils.deriveMaxUses(
      limitedUse,
      abilityLookup,
      ruleData,
      proficiencyBonus
    );

    if (!maxUses) {
      return null;
    }

    return (
      <SlotManagerLarge
        label="Current:"
        available={maxUses}
        used={numberUsed}
        onSet={this.handleUseSet}
        isInteractive={isInteractive}
      />
    );
  };

  render() {
    const {
      limitedUse,
      ruleData,
      abilityLookup,
      largeLimitedUseAmount,
      proficiencyBonus,
      theme,
    } = this.props;

    if (!limitedUse) {
      return null;
    }

    let resetType = LimitedUseUtils.getResetType(limitedUse);
    let maxUses = LimitedUseUtils.deriveMaxUses(
      limitedUse,
      abilityLookup,
      ruleData,
      proficiencyBonus
    );
    let numberUsed = LimitedUseUtils.getNumberUsed(limitedUse);
    let totalSlots = Math.max(maxUses, numberUsed);

    let usagesNode: React.ReactNode;
    let extraNode: React.ReactNode;
    if (totalSlots >= largeLimitedUseAmount) {
      usagesNode = maxUses;
      extraNode = this.renderLargeAmountSlotPool();
    } else if (maxUses === -1) {
      usagesNode = "Unlimited";
    } else {
      usagesNode = this.renderSmallAmountSlotPool();
    }

    let resetNode: React.ReactNode;
    if (
      resetType !== Constants.LimitedUseResetTypeEnum.SHORT_REST &&
      resetType !== Constants.LimitedUseResetTypeEnum.LONG_REST
    ) {
      resetNode = "Special";
    } else {
      resetNode = RuleDataUtils.getLimitedUseResetTypeName(resetType, ruleData);
    }

    return (
      <React.Fragment>
        <div
          className={`ct-feature-snippet__limited-use ${
            theme.isDarkMode ? "ct-feature-snippet__limited-use--dark-mode" : ""
          }`}
        >
          <div className="ct-feature-snippet__limited-use-usages">
            {usagesNode}
          </div>
          <div className="ct-feature-snippet__limited-use-sep">/</div>
          <div className="ct-feature-snippet__limited-use-reset">
            {resetNode}
          </div>
        </div>
        {extraNode && (
          <div className="ct-feature-snippet__limited-use-extra">
            {extraNode}
          </div>
        )}
      </React.Fragment>
    );
  }
}
