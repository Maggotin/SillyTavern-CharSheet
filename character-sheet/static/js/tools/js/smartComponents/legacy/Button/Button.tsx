import React from "react";

export interface ButtonProps {
  onClick?: ((evt: React.MouseEvent) => void) | (() => void);
  clsNames?: Array<string>;
  className: string;
  disabled?: boolean;
  styledDisabled: boolean;
  block?: boolean;
  size?: string;
  style?: string;
  active?: boolean;
  stopPropagation: boolean;
  enableConfirm: boolean;
  confirmText: string;
  confirmDuration: number;
  confirmSuccessDuration: number;
  isInteractive: boolean;
  role: string;
}
interface ButtonState {
  isConfirming: boolean;
  isConfirmed: boolean;
  currentDuration: number;
  confirmText: string;
}
export class Button extends React.PureComponent<ButtonProps, ButtonState> {
  static defaultProps = {
    className: "",
    styledDisabled: false,
    stopPropagation: true,
    enableConfirm: false,
    confirmText: "Confirm",
    confirmDuration: 3000,
    confirmSuccessDuration: 1000,
    isInteractive: true,
    role: "button",
  };

  confirmIntervalId: number;
  confirmSuccessTimeoutId: number;

  constructor(props: ButtonProps) {
    super(props);

    this.state = {
      isConfirming: false,
      isConfirmed: false,
      currentDuration: 0,
      confirmText: "",
    };
  }

  componentWillUnmount() {
    clearTimeout(this.confirmSuccessTimeoutId);
    clearInterval(this.confirmIntervalId);
  }

  handleConfirmClick = (evt: React.MouseEvent<HTMLButtonElement>): void => {
    const { isConfirming, isConfirmed } = this.state;
    const {
      confirmText,
      stopPropagation,
      confirmDuration,
      confirmSuccessDuration,
      onClick,
    } = this.props;

    if (stopPropagation) {
      evt.stopPropagation();
      evt.nativeEvent.stopImmediatePropagation();
    }

    if (isConfirmed) {
      this.setState({
        isConfirmed: false,
      });
      clearTimeout(this.confirmSuccessTimeoutId);
      return;
    }

    if (isConfirming) {
      this.setState({
        isConfirming: false,
        currentDuration: 0,
        isConfirmed: true,
      });
      if (onClick) {
        onClick(evt);
      }
      clearInterval(this.confirmIntervalId);
      this.confirmSuccessTimeoutId = window.setTimeout(() => {
        this.setState({
          isConfirmed: false,
        });
      }, confirmSuccessDuration);
    } else {
      this.setState({
        isConfirming: true,
        confirmText: `${confirmText} (${Math.round(confirmDuration / 1000)})`,
        currentDuration: 1000,
      });

      this.confirmIntervalId = window.setInterval(() => {
        if (this.state.currentDuration >= confirmDuration) {
          clearInterval(this.confirmIntervalId);
          this.setState({
            isConfirming: false,
            currentDuration: 0,
          });
        } else {
          this.setState((prevState) => ({
            confirmText: `${confirmText} (${Math.round(
              (confirmDuration - prevState.currentDuration) / 1000
            )})`,
            currentDuration: prevState.currentDuration + 1000,
          }));
        }
      }, 1000);
    }
  };

  handleClick = (evt: React.MouseEvent<HTMLButtonElement>): void => {
    const { onClick, stopPropagation, isInteractive } = this.props;

    if (onClick && isInteractive) {
      if (stopPropagation) {
        evt.stopPropagation();
        evt.nativeEvent.stopImmediatePropagation();
      }

      onClick(evt);
    }
  };

  render() {
    const { isConfirming, isConfirmed, confirmText } = this.state;
    const {
      children,
      className,
      clsNames,
      disabled,
      styledDisabled,
      size,
      block,
      active,
      style,
      enableConfirm,
      role,
      confirmSuccessDuration, // to be ignored on props spread
      confirmDuration, // to be ignored on props spread
      confirmText: _confirmText, // to be ignored on props spread
      isInteractive, // to be ignored on props spread
      stopPropagation, // to be ignored on props spread
      ...restProps
    } = this.props;

    let buttonBase: string = "character-button";
    let btnClassNames: Array<string> = [
      className,
      "ct-button",
      buttonBase,
      "ddbc-button",
    ];

    let buttonSizeBase: string = buttonBase;
    if (block) {
      buttonSizeBase += "-block";
    }

    switch (size) {
      case "oversized":
      case "large":
      case "medium":
      case "small":
        btnClassNames.push(`${buttonSizeBase}-${size}`);
        break;
      default:
        btnClassNames.push(`${buttonSizeBase}`);
    }

    let buttonStyleBase: string = buttonBase;

    switch (style) {
      case "dark":
        btnClassNames.push(
          active ? `${buttonStyleBase}-dark-active` : `${buttonStyleBase}-dark`
        );
        break;
      case "modal":
      case "modal-cancel":
        btnClassNames.push(`${buttonStyleBase}-${style}`);
        break;
      case "outline":
        btnClassNames.push(`${buttonStyleBase}-outline`);
        break;
      default:
        if (active) {
          btnClassNames.push(`${buttonStyleBase}-active`);
        }
    }

    if (styledDisabled && disabled) {
      btnClassNames.push(`${buttonBase}--disabled`);
    }

    if (clsNames) {
      btnClassNames = [...btnClassNames, ...clsNames];
    }

    if (enableConfirm) {
      btnClassNames.push("ct-button--confirm");

      if (isConfirming) {
        btnClassNames.push("ct-button--is-confirming");
      }
      if (isConfirmed) {
        btnClassNames.push("ct-button--is-confirmed");
      }
    }

    return (
      <button
        {...restProps}
        disabled={!styledDisabled && disabled}
        onClick={enableConfirm ? this.handleConfirmClick : this.handleClick}
        className={btnClassNames.join(" ")}
        role={role}
      >
        <span className="ct-button__content">{children}</span>
        {enableConfirm && (
          <React.Fragment>
            <span className="ct-button__confirming">{confirmText}</span>
            <span className="ct-button__confirmed" />
          </React.Fragment>
        )}
      </button>
    );
  }
}

export default Button;
