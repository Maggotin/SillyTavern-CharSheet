import React from "react";

import { BaseSvg } from "@dndbeyond/character-components/es";

interface Props {
  className: string;
  fillColor: string;
}
export default class VehicleBlockSeparatorInfernal extends React.PureComponent<Props> {
  static defaultProps = {
    className: "",
    fillColor: "#9D3856",
  };

  render() {
    const { className, fillColor } = this.props;

    let classNames: Array<string> = [
      "ct-vehicle-block__separator-infernal",
      className,
    ];

    return (
      <BaseSvg viewBox="0 0 1619.42 32.05" className={classNames.join(" ")}>
        <polygon
          fill={fillColor}
          points="998.33,16.03 1619.42,25.35 809.71,32.05 0,25.35 621.09,16.03 0,12.45 809.71,0 1619.42,12.45 "
        />
      </BaseSvg>
    );
  }
}
