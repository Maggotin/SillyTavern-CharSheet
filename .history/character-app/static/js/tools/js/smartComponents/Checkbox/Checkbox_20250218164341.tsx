import * as React from "react";

import { CharacterTheme } from "../../character-rules-engine";

import { CharacterColorEnum } from "../../../../constants";
import { PositiveCheckSvg, ThemedCheckSvg, CheckSvg } from "../Svg";

interface Props {
  className: string;
  initiallyEnabled: boolean;
  enabled?: boolean;
  onChange?: (isEnabled: boolean) => void;
  onChangePromise?: (
    newIsEnabled: boolean,
    accept: () => void,
    reject: () => void
  ) => void;
  label?: string;
  preventDefault: boolean;
  stopPropagation: boolean;
  isInteractive?: boolean;
  theme?: CharacterTheme;
  variant?: "primary" | "theme";
}

interface State {
  enabled: boolean;
}

export default class Checkbox extends React.PureComponent<Props, State> {
  static defaultProps = {
    isInteractive: true,
    initiallyEnabled: false,
    preventDefault: false,
    stopPropagation: false,
    className: "",
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      enabled:
        typeof props.enabled !== "undefined"
          ? props.enabled
          : props.initiallyEnabled,
    };
  }

  componentDidUpdate(
    prevProps: Readonly<Props>,
    prevState: Readonly<State>,
    snapshot?: any
  ): void {
    const { enabled, initiallyEnabled } = this.props;

    if (
      typeof enabled !== "undefined" ||
      initiallyEnabled !== prevState.enabled
    ) {
      this.setState({
        enabled: typeof enabled === "undefined" ? initiallyEnabled : enabled,
      });
    }
  }

  handleClick = (evt: React.MouseEvent): void => {
    const { onChangePromise, preventDefault, stopPropagation } = this.props;
    const { enabled } = this.state;

    const newValue: boolean = !enabled;

    if (stopPropagation) {
      evt.stopPropagation();
      evt.nativeEvent.stopImmediatePropagation();
    }

    if (preventDefault) {
      evt.preventDefault();
    }

    if (onChangePromise) {
      onChangePromise(
        newValue,
        () => {
          this.setEnabled();
        },
        () => {}
      );
    } else {
      this.setEnabled();
    }
  };

  setEnabled = (): void => {
    const { onChange } = this.props;

    this.setState((prevState) => {
      let newValue = !prevState.enabled;

      if (onChange) {
        onChange(newValue);
      }

      return {
        enabled: newValue,
      };
    });
  };

  render() {
    const { enabled } = this.state;
    const { label, className, isInteractive, theme, variant } = this.props;

    const toggleConClasses: Array<string> = [
      "ddbc-checkbox",
      "character-checkbox",
      className,
    ];
    if (enabled) {
      toggleConClasses.push("ddbc-checkbox--is-enabled");
      toggleConClasses.push("character-checkbox-enabled");
    } else {
      toggleConClasses.push("ddbc-checkbox--is-disabled");
      toggleConClasses.push("character-checkbox-disabled");
    }
    if (isInteractive) {
      toggleConClasses.push("ddbc-checkbox--is-interactive");
      toggleConClasses.push("character-checkbox-interactive");
    }

    return (
      <div
        className={toggleConClasses.join(" ")}
        onClick={isInteractive ? this.handleClick : undefined}
        role="checkbox"
        aria-checked={enabled}
      >
        <div className="ddbc-checkbox__input character-checkbox-input">
          {enabled &&
            (variant === "primary" ? (
              <CheckSvg
                fillColor={CharacterColorEnum.RED}
                secondaryFillColor=""
              />
            ) : theme ? (
              <ThemedCheckSvg theme={theme} />
            ) : (
              <PositiveCheckSvg />
            ))}
        </div>
        {label && (
          <div className="ddbc-checkbox__label character-checkbox-label">
            {label}
          </div>
        )}
      </div>
    );
  }
}
