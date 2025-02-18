import React from "react";

import { Checkbox } from "../../character-components/es";

import SpellsFilterAdvancedFilter from "../SpellsFilterAdvancedFilter";
import SpellsFilterAdvancedFilterLabel from "../SpellsFilterAdvancedFilterLabel";
import SpellsFilterAdvancedFilterOption from "../SpellsFilterAdvancedFilterOption";
import SpellsFilterAdvancedFilterOptions from "../SpellsFilterAdvancedFilterOptions";

interface Props {
  propertyKey: string;
  label: string;
  value: boolean | null;
  onUpdate: (propertyKey: string, value: boolean | null) => void;
  trueLabel: string;
  falseLabel: string;
  nullLabel: string;
}
interface State {
  value: boolean | null;
}
export default class SpellsFilterExclusiveCheckboxFilter extends React.PureComponent<
  Props,
  State
> {
  static defaultProps = {
    trueLabel: "Yes",
    falseLabel: "No",
    nullLabel: "Both",
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      value: props.value,
    };
  }

  componentDidUpdate(
    prevProps: Readonly<Props>,
    prevState: Readonly<State>
  ): void {
    const { value } = this.props;

    if (value !== prevState.value) {
      this.setState({
        value,
      });
    }
  }

  handleUpdate = (value: boolean | null): void => {
    const { onUpdate, propertyKey } = this.props;

    if (onUpdate) {
      onUpdate(propertyKey, value);
    }
    this.setState({
      value,
    });
  };

  render() {
    const { value } = this.state;
    const { label, trueLabel, falseLabel, nullLabel } = this.props;

    return (
      <SpellsFilterAdvancedFilter>
        <SpellsFilterAdvancedFilterLabel>
          {label}
        </SpellsFilterAdvancedFilterLabel>
        <SpellsFilterAdvancedFilterOptions>
          <SpellsFilterAdvancedFilterOption>
            <div className="ct-spells-filter__adv-filter-checkbox">
              <div className="ct-spells-filter__adv-filter-checkbox-input">
                <Checkbox
                  onChange={this.handleUpdate.bind(this, true)}
                  enabled={value === true}
                />
              </div>
              <div
                className="ct-spells-filter__adv-filter-checkbox-label"
                onClick={this.handleUpdate.bind(this, true)}
              >
                {trueLabel}
              </div>
            </div>
          </SpellsFilterAdvancedFilterOption>
          <SpellsFilterAdvancedFilterOption>
            <div className="ct-spells-filter__adv-filter-checkbox">
              <div className="ct-spells-filter__adv-filter-checkbox-input">
                <Checkbox
                  onChange={this.handleUpdate.bind(this, false)}
                  enabled={value === false}
                />
              </div>
              <div
                className="ct-spells-filter__adv-filter-checkbox-label"
                onClick={this.handleUpdate.bind(this, false)}
              >
                {falseLabel}
              </div>
            </div>
          </SpellsFilterAdvancedFilterOption>
          <SpellsFilterAdvancedFilterOption>
            <div className="ct-spells-filter__adv-filter-checkbox">
              <div className="ct-spells-filter__adv-filter-checkbox-input">
                <Checkbox
                  onChange={this.handleUpdate.bind(this, null)}
                  enabled={value === null}
                />
              </div>
              <div
                className="ct-spells-filter__adv-filter-checkbox-label"
                onClick={this.handleUpdate.bind(this, null)}
              >
                {nullLabel}
              </div>
            </div>
          </SpellsFilterAdvancedFilterOption>
        </SpellsFilterAdvancedFilterOptions>
      </SpellsFilterAdvancedFilter>
    );
  }
}
