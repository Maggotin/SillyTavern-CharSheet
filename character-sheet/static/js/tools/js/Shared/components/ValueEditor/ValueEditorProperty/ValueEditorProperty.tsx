import React from "react";

interface Props {
  isBlock: boolean;
  propertyKey: number;
  className: string;
}
export default class ValueEditorProperty extends React.PureComponent<Props> {
  static defaultProps = {
    isBlock: false,
    className: "",
  };

  render() {
    const { className, isBlock, propertyKey } = this.props;

    let classNames: Array<string> = [
      className,
      "ct-value-editor__property",
      `ct-value-editor__property--${propertyKey}`,
    ];
    if (isBlock) {
      classNames.push("ct-value-editor__property--block");
    }

    return <div className={classNames.join(" ")}>{this.props.children}</div>;
  }
}
