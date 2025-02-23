import React from "react";

export default class InventoryFilterAdvancedFilter extends React.PureComponent {
  render() {
    return (
      <div className="ct-inventory-filter__adv-filter">
        {this.props.children}
      </div>
    );
  }
}
