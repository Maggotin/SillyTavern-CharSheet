import React from "react";

export default class ExtrasFilterAdvancedFilterOptions extends React.PureComponent {
  render() {
    return (
      <div className="ct-extras-filter__adv-filter-options">
        {this.props.children}
      </div>
    );
  }
}
