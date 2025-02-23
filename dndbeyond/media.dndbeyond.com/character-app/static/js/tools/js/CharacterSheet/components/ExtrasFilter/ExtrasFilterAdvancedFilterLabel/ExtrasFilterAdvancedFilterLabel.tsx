import React from "react";

export default class ExtrasFilterAdvancedFilterLabel extends React.PureComponent {
  render() {
    return (
      <div className="ct-extras-filter__adv-filter-label">
        {this.props.children}
      </div>
    );
  }
}
