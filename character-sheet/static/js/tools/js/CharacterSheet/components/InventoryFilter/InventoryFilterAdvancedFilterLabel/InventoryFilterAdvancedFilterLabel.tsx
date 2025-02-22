import React from "react";

export default class InventoryFilterAdvancedFilterLabel extends React.PureComponent {
  render() {
    return (
      <div className="ct-inventory-filter__adv-filter-label">
        {this.props.children}
      </div>
    );
  }
}
