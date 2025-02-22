import React from "react";

export default class ExtrasFilterAdvancedFilterOption extends React.PureComponent {
  render() {
    return (
      <div className="ct-extras-filter__adv-filter-option">
        {this.props.children}
      </div>
    );
  }
}
