import React from "react";

import { GD_VehicleBlockFeaturesProps } from "../../../utils/Component";

interface Props extends GD_VehicleBlockFeaturesProps {}
export default class VehicleBlockFeatures extends React.PureComponent<Props> {
  static defaultProps = {
    features: [],
  };

  render() {
    const { features } = this.props;

    if (features.length === 0) {
      return null;
    }

    return (
      <div className="ct-vehicle-block__features">
        {features.map((feature, idx) => {
          return (
            <div
              className="ct-vehicle-block__features-feature"
              key={`${feature.name}-${idx}`}
            >
              <span className="ct-vehicle-block__features-feature-name">
                {feature.name}.
              </span>{" "}
              <span className="ct-vehicle-block__features-feature-description">
                {feature.description}
              </span>
            </div>
          );
        })}
      </div>
    );
  }
}
