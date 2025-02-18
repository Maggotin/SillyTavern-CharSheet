import * as React from "react";

interface Props {
  className: string;
  viewBox: string;
  preserveAspectRatio?: string;
}

export default class BaseSvg extends React.PureComponent<Props> {
  static defaultProps = {
    className: "",
    viewBox: "0 0 100 100",
  };

  render() {
    const { className, viewBox, children, preserveAspectRatio } = this.props;

    let classNames: Array<string> = ["ddbc-svg", className];

    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={viewBox}
        className={classNames.join(" ")}
        preserveAspectRatio={preserveAspectRatio}
      >
        {children}
      </svg>
    );
  }
}
