import * as React from "react";

import LinkButton from "../LinkButton";

interface Props {
  url: string;
  className?: string;
  block?: boolean;
  size: "oversized" | "large" | "medium" | "small";
  disabled?: boolean;
  download?: string | boolean;
  onClick?: (isDisabled: boolean) => void;
}
export default class BuilderLinkButton extends React.PureComponent<Props, {}> {
  static defaultProps = {
    className: "",
  };

  render() {
    const { className, ...restProps } = this.props;

    let classNames: Array<string> = ["builder-button"];
    if (className) {
      classNames.push(className);
    }

    return <LinkButton {...restProps} className={classNames.join(" ")} />;
  }
}
