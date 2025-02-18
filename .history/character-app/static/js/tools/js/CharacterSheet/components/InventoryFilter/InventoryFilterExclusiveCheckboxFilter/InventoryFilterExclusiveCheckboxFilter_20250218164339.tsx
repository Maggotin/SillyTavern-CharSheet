import React from "react";

import { Checkbox } from "../../character-components/es";

import InventoryFilterAdvancedFilter from "../InventoryFilterAdvancedFilter";
import InventoryFilterAdvancedFilterLabel from "../InventoryFilterAdvancedFilterLabel";
import InventoryFilterAdvancedFilterOption from "../InventoryFilterAdvancedFilterOption";
import InventoryFilterAdvancedFilterOptions from "../InventoryFilterAdvancedFilterOptions";

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
export default class InventoryFilterExclusiveCheckboxFilter extends React.PureComponent<
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
      <InventoryFilterAdvancedFilter>
        <InventoryFilterAdvancedFilterLabel>
          {label}
        </InventoryFilterAdvancedFilterLabel>
        <InventoryFilterAdvancedFilterOptions>
          <InventoryFilterAdvancedFilterOption>
            <div className="ct-inventory-filter__adv-filter-checkbox">
              <div className="ct-inventory-filter__adv-filter-checkbox-input">
                <Checkbox
                  onChange={this.handleUpdate.bind(this, true)}
                  enabled={value === true}
                />
              </div>
              <div
                className="ct-inventory-filter__adv-filter-checkbox-label"
                onClick={this.handleUpdate.bind(this, true)}
              >
                {trueLabel}
              </div>
            </div>
          </InventoryFilterAdvancedFilterOption>
          <InventoryFilterAdvancedFilterOption>
            <div className="ct-inventory-filter__adv-filter-checkbox">
              <div className="ct-inventory-filter__adv-filter-checkbox-input">
                <Checkbox
                  onChange={this.handleUpdate.bind(this, false)}
                  enabled={value === false}
                />
              </div>
              <div
                className="ct-inventory-filter__adv-filter-checkbox-label"
                onClick={this.handleUpdate.bind(this, false)}
              >
                {falseLabel}
              </div>
            </div>
          </InventoryFilterAdvancedFilterOption>
          <InventoryFilterAdvancedFilterOption>
            <div className="ct-inventory-filter__adv-filter-checkbox">
              <div className="ct-inventory-filter__adv-filter-checkbox-input">
                <Checkbox
                  onChange={this.handleUpdate.bind(this, null)}
                  enabled={value === null}
                />
              </div>
              <div
                className="ct-inventory-filter__adv-filter-checkbox-label"
                onClick={this.handleUpdate.bind(this, null)}
              >
                {nullLabel}
              </div>
            </div>
          </InventoryFilterAdvancedFilterOption>
        </InventoryFilterAdvancedFilterOptions>
      </InventoryFilterAdvancedFilter>
    );
  }
}
