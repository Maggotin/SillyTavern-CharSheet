import React from "react";

import { HtmlSelectOption } from "@dndbeyond/character-rules-engine/es";

import SpellsFilterAdvancedFilter from "../SpellsFilterAdvancedFilter";
import SpellsFilterAdvancedFilterLabel from "../SpellsFilterAdvancedFilterLabel";
import SpellsFilterAdvancedFilterOption from "../SpellsFilterAdvancedFilterOption";
import SpellsFilterAdvancedFilterOptions from "../SpellsFilterAdvancedFilterOptions";

interface Props {
  propertyKey: string;
  label: string;
  currentValues: Array<string | number>;
  availableOptions: Array<HtmlSelectOption>;
  onUpdate: (propertyKey: string, value: string | number) => void;
}
export default class SpellsFilterArrayFilter extends React.PureComponent<Props> {
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
      <SpellsFilterAdvancedFilter>
        <SpellsFilterAdvancedFilterLabel>
          {label}
        </SpellsFilterAdvancedFilterLabel>
        <SpellsFilterAdvancedFilterOptions>
          {availableOptions.map((option) => {
            let classNames: Array<string> = [
              "ct-spells-filter__adv-filter-button",
            ];
            if (currentValues.includes(option.value)) {
              classNames.push("ct-spells-filter__adv-filter-button--active");
            }
            return (
              <SpellsFilterAdvancedFilterOption key={option.value}>
                <span
                  className={classNames.join(" ")}
                  onClick={this.handleFilterArrayToggle.bind(
                    this,
                    option.value
                  )}
                >
                  {option.label}
                </span>
              </SpellsFilterAdvancedFilterOption>
            );
          })}
        </SpellsFilterAdvancedFilterOptions>
      </SpellsFilterAdvancedFilter>
    );
  }
}
