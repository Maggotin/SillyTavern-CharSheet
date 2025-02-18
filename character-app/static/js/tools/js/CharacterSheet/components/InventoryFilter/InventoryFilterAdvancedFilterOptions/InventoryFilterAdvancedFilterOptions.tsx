import React from "react";

export default class InventoryFilterAdvancedFilterOptions extends React.PureComponent {
  render() {
    return (
      <div className="ct-inventory-filter__adv-filter-options">
        {this.props.children}
      </div>
    );
  }
}
