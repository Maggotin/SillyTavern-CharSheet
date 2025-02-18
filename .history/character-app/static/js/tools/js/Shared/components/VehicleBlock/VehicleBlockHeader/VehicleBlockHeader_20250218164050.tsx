import React from "react";

import { Constants, FormatUtils } from "../../rules-engine/es";

import { GD_VehicleBlockHeaderProps } from "../../../utils/Component";
import InlineSeparatedNodes from "../../common/InlineSeparatedNodes";

interface Props extends GD_VehicleBlockHeaderProps {}
export default class VehicleBlockHeader extends React.PureComponent<Props> {
  renderTypeInfo = (): React.ReactNode => {
    const { sizeName, typeName } = this.props;

    if (sizeName === null && typeName === null) {
      return null;
    }

    let size: string = sizeName !== null ? sizeName : "";
    let type: string = typeName !== null ? typeName.toLowerCase() : "";

    return [size, type].join(" ").trim();
  };

  renderDimensions = (): React.ReactNode => {
    const { weight, width, length } = this.props;

    let dimensions: Array<string> = [];

    let lengthDisplay: string | null =
      length !== null ? FormatUtils.renderDistance(length) : null;
    if (lengthDisplay !== null) {
      dimensions.push(lengthDisplay);
    }

    let widthDisplay: string | null =
      width !== null ? FormatUtils.renderDistance(width) : null;
    if (widthDisplay !== null) {
      dimensions.push(widthDisplay);
    }

    let metaTextSizeNodes: Array<React.ReactNode> = [];

    if (dimensions.length > 0) {
      metaTextSizeNodes.push(dimensions.join(" by "));
    }

    let weightDisplay: string | null =
      weight !== null ? `${FormatUtils.renderWeight(weight)}.` : null;
    if (weightDisplay !== null) {
      metaTextSizeNodes.push(weightDisplay);
    }

    if (metaTextSizeNodes.length === 0) {
      return null;
    }

    return (
      <React.Fragment>
        (<InlineSeparatedNodes nodes={metaTextSizeNodes} />)
      </React.Fragment>
    );
  };

  render() {
    const { name, displayType } = this.props;

    const typeInfo = this.renderTypeInfo();
    const dimensions = this.renderDimensions();

    return (
      <div className="ct-vehicle-block__header">
        <div className="ct-vehicle-block__name">
          {name !== null ? name : ""}
        </div>
        {displayType !==
          Constants.VehicleConfigurationDisplayTypeEnum.SPELLJAMMER && (
          <div className="ct-vehicle-block__meta">
            {typeInfo} {dimensions}
          </div>
        )}
      </div>
    );
  }
}
