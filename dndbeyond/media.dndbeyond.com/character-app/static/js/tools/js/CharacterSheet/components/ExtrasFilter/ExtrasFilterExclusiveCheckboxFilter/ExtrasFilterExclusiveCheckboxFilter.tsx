import React from "react";

import { Checkbox } from "@dndbeyond/character-components/es";

import ExtrasFilterAdvancedFilter from "../ExtrasFilterAdvancedFilter";
import ExtrasFilterAdvancedFilterLabel from "../ExtrasFilterAdvancedFilterLabel";
import ExtrasFilterAdvancedFilterOption from "../ExtrasFilterAdvancedFilterOption";
import ExtrasFilterAdvancedFilterOptions from "../ExtrasFilterAdvancedFilterOptions";

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
export default class ExclusiveCheckboxFilter extends React.PureComponent<
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
      <ExtrasFilterAdvancedFilter>
        <ExtrasFilterAdvancedFilterLabel>
          {label}
        </ExtrasFilterAdvancedFilterLabel>
        <ExtrasFilterAdvancedFilterOptions>
          <ExtrasFilterAdvancedFilterOption>
            <div className="ct-extras-filter__adv-filter-checkbox">
              <div className="ct-extras-filter__adv-filter-checkbox-input">
                <Checkbox
                  onChange={this.handleUpdate.bind(this, true)}
                  enabled={value === true}
                />
              </div>
              <div
                className="ct-extras-filter__adv-filter-checkbox-label"
                onClick={this.handleUpdate.bind(this, true)}
              >
                {trueLabel}
              </div>
            </div>
          </ExtrasFilterAdvancedFilterOption>
          <ExtrasFilterAdvancedFilterOption>
            <div className="ct-extras-filter__adv-filter-checkbox">
              <div className="ct-extras-filter__adv-filter-checkbox-input">
                <Checkbox
                  onChange={this.handleUpdate.bind(this, false)}
                  enabled={value === false}
                />
              </div>
              <div
                className="ct-extras-filter__adv-filter-checkbox-label"
                onClick={this.handleUpdate.bind(this, false)}
              >
                {falseLabel}
              </div>
            </div>
          </ExtrasFilterAdvancedFilterOption>
          <ExtrasFilterAdvancedFilterOption>
            <div className="ct-extras-filter__adv-filter-checkbox">
              <div className="ct-extras-filter__adv-filter-checkbox-input">
                <Checkbox
                  onChange={this.handleUpdate.bind(this, null)}
                  enabled={value === null}
                />
              </div>
              <div
                className="ct-extras-filter__adv-filter-checkbox-label"
                onClick={this.handleUpdate.bind(this, null)}
              >
                {nullLabel}
              </div>
            </div>
          </ExtrasFilterAdvancedFilterOption>
        </ExtrasFilterAdvancedFilterOptions>
      </ExtrasFilterAdvancedFilter>
    );
  }
}
