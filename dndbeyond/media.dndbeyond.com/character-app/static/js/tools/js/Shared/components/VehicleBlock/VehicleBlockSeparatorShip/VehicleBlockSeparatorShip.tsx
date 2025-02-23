import React from "react";

interface Props {
  className: string;
}
export default class VehicleBlockSeparatorShip extends React.PureComponent<Props> {
  static defaultProps = {
    className: "",
  };

  render() {
    const { className } = this.props;

    let classNames: Array<string> = [
      "ct-vehicle-block__separator-ship",
      className,
    ];

    return (
      <div className={classNames.join(" ")}>
        <div className="ct-vehicle-block__separator-ship-border" />
      </div>
    );
  }
}
