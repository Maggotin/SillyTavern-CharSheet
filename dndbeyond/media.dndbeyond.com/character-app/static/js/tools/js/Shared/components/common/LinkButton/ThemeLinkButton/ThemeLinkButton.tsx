import * as React from "react";

import LinkButton from "../LinkButton";

interface Props {
  url: string;
  className?: string;
  block?: boolean;
  size: "oversized" | "large" | "medium" | "small";
  style: "filled" | "outline";
  disabled?: boolean;
  download?: string | boolean;
  target?: string;
}
export default class ThemeLinkButton extends React.PureComponent<Props, {}> {
  static defaultProps = {
    className: "",
    style: "filled",
  };

  render() {
    const { className, style, ...restProps } = this.props;

    let classNames: Array<string> = [
      "ct-theme-button",
      `ct-theme-button--${style}`,
    ];
    if (className) {
      classNames.push(className);
    }

    return <LinkButton {...restProps} className={classNames.join(" ")} />;
  }
}
