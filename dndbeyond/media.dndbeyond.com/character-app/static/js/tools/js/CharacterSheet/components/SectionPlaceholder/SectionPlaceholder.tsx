import React from "react";

interface Props {
  name: string;
  IconComponent: React.ComponentType;
}
export default class SectionPlaceholder extends React.PureComponent<Props> {
  render() {
    const { name, IconComponent } = this.props;

    return (
      <div className="ct-section-placeholder">
        <div className="ct-section-placeholder__name">{name}</div>
        <div className="ct-section-placeholder__icon">
          <IconComponent />
        </div>
      </div>
    );
  }
}
