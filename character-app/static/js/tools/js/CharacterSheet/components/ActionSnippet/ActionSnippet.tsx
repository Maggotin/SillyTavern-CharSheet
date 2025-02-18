import React from "react";

import { Snippet } from "@dndbeyond/character-components/es";
import {
  AbilityLookup,
  Action,
  ActionUtils,
  ActivationContract,
  ActivationUtils,
  BaseInventoryContract,
  ClassUtils,
  Constants,
  ClassFeatureContract,
  InfusionUtils,
  ItemUtils,
  LevelScaleContract,
  RuleData,
  SnippetData,
  ClassFeatureUtils,
  InventoryLookup,
  HelperUtils,
  Hack__BaseCharClass,
  CharacterTheme,
} from "@dndbeyond/character-rules-engine/es";

import { ItemName } from "~/components/ItemName";

import { FeatureSnippetLimitedUse } from "../FeatureSnippet";

interface Props {
  action: Action;
  activation: ActivationContract;
  showActivationInfo: boolean;

  onActionClick?: (action: Action) => void;
  onActionUseSet?: (action: Action, used: number) => void;

  abilityLookup: AbilityLookup;
  inventoryLookup: InventoryLookup;
  ruleData: RuleData;
  snippetData: SnippetData;
  isInteractive: boolean;
  proficiencyBonus: number;
  theme: CharacterTheme;
}
export default class ActionSnippet extends React.PureComponent<Props> {
  static defaultProps = {
    showActivationInfo: false,
  };

  handleActionUseSet = (action: Action, uses: number): void => {
    const { onActionUseSet } = this.props;

    if (onActionUseSet) {
      onActionUseSet(action, uses);
    }
  };

  handleActionClick = (evt: React.MouseEvent): void => {
    const { action, onActionClick } = this.props;

    if (onActionClick) {
      evt.stopPropagation();
      evt.nativeEvent.stopImmediatePropagation();
      onActionClick(action);
    }
  };

  render() {
    const {
      action,
      ruleData,
      abilityLookup,
      snippetData,
      isInteractive,
      showActivationInfo,
      inventoryLookup,
      activation,
      proficiencyBonus,
      theme,
    } = this.props;

    let limitedUse = ActionUtils.getLimitedUse(action);
    let name: React.ReactNode = ActionUtils.getName(action);
    let dataOrigin = ActionUtils.getDataOrigin(action);
    let dataOriginType = ActionUtils.getDataOriginType(action);

    let classLevel: number | null = null;
    let scaleValue: LevelScaleContract | null = null;

    switch (dataOriginType) {
      case Constants.DataOriginTypeEnum.CLASS_FEATURE:
        classLevel = ClassUtils.getLevel(
          dataOrigin.parent as Hack__BaseCharClass
        );
        scaleValue = ClassFeatureUtils.getLevelScale(
          dataOrigin.primary as ClassFeatureContract
        );
        break;
      case Constants.DataOriginTypeEnum.RACE:
        //scaleValue = RacialTraitUtils.getLevelScale(dataOrigin.primary); //TODO this doesn't exist.. is it still needed?
        break;
      case Constants.DataOriginTypeEnum.ITEM: {
        if (!name) {
          const itemContract = dataOrigin.primary as BaseInventoryContract;
          const itemMappingId = ItemUtils.getMappingId(itemContract);
          const item = HelperUtils.lookupDataOrFallback(
            inventoryLookup,
            itemMappingId
          );

          if (item !== null) {
            const infusion = ItemUtils.getInfusion(item);
            name = (
              <React.Fragment>
                <ItemName item={item} />
                {infusion !== null && (
                  <span className="ct-feature-snippet__heading-extra">
                    (Infusion: {InfusionUtils.getName(infusion)})
                  </span>
                )}
              </React.Fragment>
            );
          }
        }
        break;
      }
    }

    let activationDisplay: React.ReactNode;
    if (showActivationInfo && activation) {
      activationDisplay = (
        <span
          className={`ct-feature-snippet__heading-activation ${
            theme.isDarkMode
              ? "ct-feature-snippet__heading-activation--dark-mode"
              : ""
          }`}
        >
          ({ActivationUtils.renderActivation(activation, ruleData)})
        </span>
      );
    }

    return (
      <div className="ct-feature-snippet" onClick={this.handleActionClick}>
        <div
          className={`ct-feature-snippet__heading ${
            theme.isDarkMode ? "ct-feature-snippet__heading--dark-mode" : ""
          }`}
        >
          {name} {activationDisplay}
        </div>
        <div className="ct-feature-snippet__content">
          <Snippet
            snippetData={snippetData}
            theme={theme}
            classLevel={classLevel}
            levelScale={scaleValue}
            limitedUse={limitedUse}
            proficiencyBonus={proficiencyBonus}
          >
            {ActionUtils.getSnippet(action)}
          </Snippet>
        </div>
        <FeatureSnippetLimitedUse
          component={action}
          theme={theme}
          limitedUse={limitedUse}
          onUseSet={this.handleActionUseSet}
          abilityLookup={abilityLookup}
          ruleData={ruleData}
          isInteractive={isInteractive}
          proficiencyBonus={proficiencyBonus}
        />
      </div>
    );
  }
}
