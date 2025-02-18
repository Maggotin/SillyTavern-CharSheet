import { orderBy } from "lodash";
import * as React from "react";

import {
  Collapsible,
  CollapsibleHeaderContent,
  LoadingPlaceholder,
} from "@dndbeyond/character-components/es";
import {
  CharacterTheme,
  InfusionChoice,
  InfusionChoiceUtils,
  InfusionUtils,
  Item,
  ItemUtils,
  KnownInfusionUtils,
  RuleData,
} from "@dndbeyond/character-rules-engine/es";

import { ItemName } from "~/components/ItemName";

import ItemDetail from "../../../../components/ItemDetail";
import { ThemeButton } from "../../../../components/common/Button";
import DataLoadingStatusEnum from "../../../../constants/DataLoadingStatusEnum";

interface Props {
  itemLoadingStatus: DataLoadingStatusEnum;
  items: Array<Item>;
  itemCanBeAddedLookup: Record<number, boolean>;
  infusionChoice: InfusionChoice;
  onItemSelected: (item: Item) => void;
  ruleData: RuleData;
  proficiencyBonus: number;
  theme: CharacterTheme;
}
export class InfusionChoicePaneStore extends React.PureComponent<Props> {
  static defaultProps = {
    items: [],
    itemLoadingStatus: DataLoadingStatusEnum.NOT_INITIALIZED,
    itemCanBeAddedLookup: {},
  };

  renderLoading = (): React.ReactNode => {
    return <LoadingPlaceholder />;
  };

  renderEmpty = (): React.ReactNode => {
    return (
      <div className="ct-infusion-choice-pane__inventory-empty">
        There are no items that match the requirements for infusion.
      </div>
    );
  };

  render() {
    const {
      infusionChoice,
      itemCanBeAddedLookup,
      itemLoadingStatus,
      items,
      onItemSelected,
      ruleData,
      proficiencyBonus,
      theme,
    } = this.props;

    if (
      itemLoadingStatus !== DataLoadingStatusEnum.NOT_INITIALIZED &&
      itemLoadingStatus !== DataLoadingStatusEnum.LOADED
    ) {
      return this.renderLoading();
    }

    const knownInfusion = InfusionChoiceUtils.getKnownInfusion(infusionChoice);
    if (knownInfusion === null) {
      return null;
    }

    const simulatedInfusion =
      KnownInfusionUtils.getSimulatedInfusion(knownInfusion);
    if (simulatedInfusion === null) {
      return null;
    }

    const availableItems = InfusionUtils.filterAvailableItems(
      items,
      simulatedInfusion,
      KnownInfusionUtils.getItemId(knownInfusion),
      itemCanBeAddedLookup
    );
    const orderedItems = orderBy(availableItems, (item) =>
      ItemUtils.getName(item)
    );

    if (!orderedItems.length) {
      return this.renderEmpty();
    }

    return (
      <div className="ct-infusion-choice-pane__inventory">
        {orderedItems.map((item) => {
          let headerNode = (
            <CollapsibleHeaderContent
              heading={<ItemName item={item} showLegacy={true} />}
              callout={
                <ThemeButton
                  onClick={onItemSelected.bind(this, item)}
                  size="small"
                  data-testid={`infusion-choose-item-button-${ItemUtils.getName(
                    item
                  )}`
                    .toLowerCase()
                    .replace(/\s/g, "-")}
                >
                  Choose
                </ThemeButton>
              }
            />
          );

          return (
            <Collapsible
              key={ItemUtils.getId(item)}
              layoutType="minimal"
              header={headerNode}
              className="ct-infusion-choice-pane__item"
            >
              <ItemDetail
                theme={theme}
                item={item}
                ruleData={ruleData}
                showCustomize={false}
                showActions={false}
                showImage={false}
                showAbilities={false}
                proficiencyBonus={proficiencyBonus}
              />
            </Collapsible>
          );
        })}
      </div>
    );
  }
}

export default InfusionChoicePaneStore;
