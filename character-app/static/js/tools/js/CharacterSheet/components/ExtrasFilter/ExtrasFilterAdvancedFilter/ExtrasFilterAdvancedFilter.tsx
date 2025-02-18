import React from "react";

export default class ExtrasFilterAdvancedFilter extends React.PureComponent {
  render() {
    return (
      <div className="ct-extras-filter__adv-filter">{this.props.children}</div>
    );
  }
}
