import React from "react";

interface Props {
  className: string;
}
export default class Subsections extends React.PureComponent<Props> {
  static defaultProps = {
    className: "",
  };

  render() {
    const { className } = this.props;

    return (
      <div className={`ct-subsections ${className}`}>{this.props.children}</div>
    );
  }
}
