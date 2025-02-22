import React from "react";

export default class InventoryFilterAdvancedFilterOption extends React.PureComponent {
  render() {
    return (
      <div className="ct-inventory-filter__adv-filter-option">
        {this.props.children}
      </div>
    );
  }
}
