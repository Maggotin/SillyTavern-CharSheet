import React from "react";

interface Props {
  label: string;
  value: React.ReactNode;
  extraValue: React.ReactNode;
}
export default class VehicleBlockAttribute extends React.PureComponent<Props> {
  static defaultProps = {
    extraValue: null,
  };

  render() {
    const { label, value, extraValue } = this.props;

    return (
      <div className="ct-vehicle-block__attribute">
        <span className="ct-vehicle-block__attribute-label">{label}</span>
        <span className="ct-vehicle-block__attribute-data">
          <span className="ct-vehicle-block__attribute-data-value">
            {value}
          </span>
          {extraValue !== null && (
            <span className="ct-vehicle-block__attribute-data-extra">
              {extraValue}
            </span>
          )}
        </span>
      </div>
    );
  }
}
