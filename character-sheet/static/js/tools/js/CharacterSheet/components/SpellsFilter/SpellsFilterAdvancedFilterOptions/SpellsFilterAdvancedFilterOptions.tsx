import React from "react";

export default class SpellsFilterAdvancedFilterOptions extends React.PureComponent {
  render() {
    return (
      <div className="ct-spells-filter__adv-filter-options">
        {this.props.children}
      </div>
    );
  }
}
