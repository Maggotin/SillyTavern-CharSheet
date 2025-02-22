import React from "react";

export default class SpellsFilterAdvancedFilterOption extends React.PureComponent {
  render() {
    return (
      <div className="ct-spells-filter__adv-filter-option">
        {this.props.children}
      </div>
    );
  }
}
