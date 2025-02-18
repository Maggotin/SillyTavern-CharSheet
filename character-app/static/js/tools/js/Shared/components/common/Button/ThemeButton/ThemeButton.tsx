import React from "react";

import { Button } from "@dndbeyond/character-components/es";

interface Props {
  onClick?: ((evt: React.MouseEvent<HTMLButtonElement>) => void) | (() => void);
  className: string;
  disabled?: boolean;
  styledDisabled?: boolean;
  block?: boolean;
  size?: string;
  style?: string;
  active?: boolean;
  stopPropagation?: boolean;
  enableConfirm?: boolean;
  confirmText?: string;
  confirmDuration?: number;
  isInteractive?: boolean;
}
export default class ThemeButton extends React.PureComponent<Props, {}> {
  static defaultProps = {
    className: "",
    style: "filled",
    stopPropagation: true,
    isInteractive: true,
  };

  render() {
    const { style, className, isInteractive, ...restProps } = this.props;

    let classNames: Array<string> = ["ct-theme-button"];
    if (className) {
      classNames.push(className);
    }
    if (style) {
      classNames.push(`ct-theme-button--${style}`);
    } else {
      classNames.push("ct-theme-button--filled");
    }
    if (isInteractive) {
      classNames.push("ct-theme-button--interactive");
    }

    return (
      <Button
        {...restProps}
        className={classNames.join(" ")}
        isInteractive={isInteractive}
      />
    );
  }
}
