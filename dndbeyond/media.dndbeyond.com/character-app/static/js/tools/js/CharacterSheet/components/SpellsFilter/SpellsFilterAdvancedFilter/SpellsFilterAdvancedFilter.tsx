import React from "react";

export default class SpellsFilterAdvancedFilter extends React.PureComponent {
  render() {
    return (
      <div className="ct-spells-filter__adv-filter">{this.props.children}</div>
    );
  }
}
