import React from "react";

import { HtmlSelectOption } from "../../rules-engine/es";

import InventoryFilterAdvancedFilter from "../InventoryFilterAdvancedFilter";
import InventoryFilterAdvancedFilterLabel from "../InventoryFilterAdvancedFilterLabel";
import InventoryFilterAdvancedFilterOption from "../InventoryFilterAdvancedFilterOption";
import InventoryFilterAdvancedFilterOptions from "../InventoryFilterAdvancedFilterOptions";

interface Props {
  propertyKey: string;
  label: string;
  currentValues: Array<string | number>;
  availableOptions: Array<HtmlSelectOption>;
  onUpdate: (propertyKey: string, value: string | number) => void;
}
export default class InventoryFilterArrayFilter extends React.PureComponent<Props> {
  handleFilterArrayToggle = (
    value: string | number,
    evt: React.MouseEvent
  ): void => {
    const { onUpdate, propertyKey } = this.props;

    if (onUpdate) {
      onUpdate(propertyKey, value);
    }
  };

  render() {
    const { availableOptions, currentValues, label } = this.props;

    return (
      <InventoryFilterAdvancedFilter>
        <InventoryFilterAdvancedFilterLabel>
          {label}
        </InventoryFilterAdvancedFilterLabel>
        <InventoryFilterAdvancedFilterOptions>
          {availableOptions.map((option) => {
            let classNames: Array<String> = [
              "ct-inventory-filter__adv-filter-button",
            ];
            if (currentValues.includes(option.value)) {
              classNames.push("ct-inventory-filter__adv-filter-button--active");
            }
            return (
              <InventoryFilterAdvancedFilterOption key={option.value}>
                <span
                  className={classNames.join(" ")}
                  onClick={this.handleFilterArrayToggle.bind(
                    this,
                    option.value
                  )}
                >
                  {option.label}
                </span>
              </InventoryFilterAdvancedFilterOption>
            );
          })}
        </InventoryFilterAdvancedFilterOptions>
      </InventoryFilterAdvancedFilter>
    );
  }
}
