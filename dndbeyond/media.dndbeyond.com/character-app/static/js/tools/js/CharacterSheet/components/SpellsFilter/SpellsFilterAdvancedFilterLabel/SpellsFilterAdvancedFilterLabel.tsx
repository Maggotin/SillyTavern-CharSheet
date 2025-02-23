import React from "react";

export default class SpellsFilterAdvancedFilterLabel extends React.PureComponent {
  render() {
    return (
      <div className="ct-spells-filter__adv-filter-label">
        {this.props.children}
      </div>
    );
  }
}
