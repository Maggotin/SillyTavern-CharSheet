import React from "react";

import { HtmlSelectOption } from "@dndbeyond/character-rules-engine/es";

import ExtrasFilterAdvancedFilter from "../ExtrasFilterAdvancedFilter";
import ExtrasFilterAdvancedFilterLabel from "../ExtrasFilterAdvancedFilterLabel";
import ExtrasFilterAdvancedFilterOption from "../ExtrasFilterAdvancedFilterOption";
import ExtrasFilterAdvancedFilterOptions from "../ExtrasFilterAdvancedFilterOptions";

interface Props {
  propertyKey: string;
  label: string;
  currentValues: Array<string | number>;
  availableOptions: Array<HtmlSelectOption>;
  onUpdate: (propertyKey: string, value: string | number) => void;
}
export default class ExtrasFilterArrayFilter extends React.PureComponent<Props> {
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

    if (availableOptions.length === 0) {
      return null;
    }

    return (
      <ExtrasFilterAdvancedFilter>
        <ExtrasFilterAdvancedFilterLabel>
          {label}
        </ExtrasFilterAdvancedFilterLabel>
        <ExtrasFilterAdvancedFilterOptions>
          {availableOptions.map((option) => {
            let classNames: Array<string> = [
              "ct-extras-filter__adv-filter-button",
            ];
            if (currentValues.includes(option.value)) {
              classNames.push("ct-extras-filter__adv-filter-button--active");
            }
            return (
              <ExtrasFilterAdvancedFilterOption key={option.value}>
                <span
                  className={classNames.join(" ")}
                  onClick={this.handleFilterArrayToggle.bind(
                    this,
                    option.value
                  )}
                >
                  {option.label}
                </span>
              </ExtrasFilterAdvancedFilterOption>
            );
          })}
        </ExtrasFilterAdvancedFilterOptions>
      </ExtrasFilterAdvancedFilter>
    );
  }
}
