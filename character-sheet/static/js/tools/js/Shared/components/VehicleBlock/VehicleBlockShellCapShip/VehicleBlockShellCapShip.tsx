import React from "react";

interface Props {
  className: string;
  invertY?: boolean;
  invertX?: boolean;
}
export default class VehicleBlockShellCapShip extends React.PureComponent<Props> {
  static defaultProps = {
    className: "",
  };

  render() {
    const { className } = this.props;

    let classNames: Array<string> = [
      "ct-vehicle-block__shell-cap-ship",
      className,
    ];

    return <div className={classNames.join(" ")} />;
  }
}
