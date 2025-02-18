import React from "react";

import { ThemeButton } from "../ThemeButton";

//Eventually remove and use character-components/Button/RemoveButton with theme override when needed

interface Props {
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  styledDisabled?: boolean;
  block?: boolean;
  size?: string;
  style?: string;
  active?: boolean;
  stopPropagation?: boolean;
  enableConfirm?: boolean;
  isInteractive?: boolean;
}
export default class RemoveButton extends React.PureComponent<Props, {}> {
  static defaultProps = {
    size: "small",
    style: "outline",
    stopPropagation: true,
  };

  render() {
    const { className, children, ...restProps } = this.props;

    let classNames: Array<string> = ["ct-remove-button"];
    if (className) {
      classNames.push(className);
    }

    return (
      <ThemeButton {...restProps} className={classNames.join(" ")}>
        {children ? children : "Delete"}
      </ThemeButton>
    );
  }
}
