import React from "react";

interface Props {
  url: string;
  className: string;
  block: boolean;
  size: "oversized" | "large" | "medium" | "small";
  disabled: boolean;
  download?: string | boolean;
  onClick?: (isDisabled: boolean) => void;
  target?: string;
}
export default class LinkButton extends React.PureComponent<Props, {}> {
  static defaultProps = {
    className: "",
    clsNames: [],
    block: false,
    disabled: false,
  };

  handleClick = (evt: React.MouseEvent) => {
    const { onClick, disabled } = this.props;

    if (onClick) {
      onClick(disabled);
    }
  };

  render() {
    const {
      disabled,
      block,
      size,
      className,
      url,
      children,
      download,
      target,
    } = this.props;

    let classNames: Array<string> = ["ct-button", className];

    let buttonSizeBase: string = "character-button";
    if (block) {
      buttonSizeBase += "-block";
    }

    let buttonSizeFinal: string;
    switch (size) {
      case "oversized":
      case "large":
      case "medium":
      case "small":
        buttonSizeFinal = `${buttonSizeBase}-${size}`;
        break;
      default:
        buttonSizeFinal = buttonSizeBase;
    }
    classNames.push(buttonSizeFinal);

    if (disabled) {
      classNames.push("character-button-disabled");
      classNames.push(`${buttonSizeFinal}-disabled`);
    }

    if (disabled) {
      return (
        <span className={classNames.join(" ")} onClick={this.handleClick}>
          {children}
        </span>
      );
    } else {
      return (
        <a
          href={url}
          target={target}
          download={download}
          className={classNames.join(" ")}
          onClick={this.handleClick}
        >
          {children}
        </a>
      );
    }
  }
}
