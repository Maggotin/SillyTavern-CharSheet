import * as React from "react";
import Tippy from "tippy.js";

export interface TippyOpts {
  arrow?: boolean;
  delay?: number;
  animation?: string;
  duration?: Array<number>;
  dynamicTitle?: boolean;
  placement?: string;
}

interface Props {
  tippyOpts?: TippyOpts;
  className: string;
  title: string;
  style: object;
  isInteractive: boolean;
  enabled: boolean;
  onClick?: () => void;
  isDarkMode?: boolean;
}

const defaultTippsOpts: TippyOpts = {
  arrow: true,
  delay: 300,
  animation: "fade",
  duration: [250, 250],
};

export default class Tooltip extends React.Component<Props> {
  static defaultProps = {
    style: {},
    isInteractive: false,
    enabled: true,
    className: "",
    isDarkMode: false,
  };

  tooltipDOM: HTMLElement | null = null;
  //TODO type tippy once tippy.js has been updated to a newer version https://github.com/atomiks/tippyjs/pull/329
  tippy: any | null = null;

  constructor(props: Props) {
    super(props);

    if (props.enabled) {
      this.initTippy = this.initTippy.bind(this);
      this.destroyTippy = this.destroyTippy.bind(this);
    }
  }

  componentDidMount() {
    const { enabled } = this.props;

    if (enabled) {
      this.initTippy();
    }
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.title !== prevProps.title ||
      this.props.isDarkMode !== prevProps.isDarkMode
    ) {
      this.initTippy();
    }
  }

  componentWillUnmount() {
    const { enabled } = this.props;

    if (enabled) {
      this.destroyTippy();
    }
  }

  initTippy(): void {
    const { isDarkMode } = this.props;
    if (typeof window === "undefined" || typeof document === "undefined") {
      return;
    }

    if (this.tooltipDOM) {
      this.tooltipDOM.setAttribute("title", this.props.title);
      this.tippy = Tippy(this.tooltipDOM, {
        ...defaultTippsOpts,
        ...this.props.tippyOpts,
        theme: isDarkMode ? "custom-dark" : "",
      });
    }
  }

  destroyTippy(): void {
    if (typeof window === "undefined" || typeof document === "undefined") {
      return;
    }
    if (
      this.tippy &&
      this.tooltipDOM &&
      // @ts-ignore
      this.tooltipDOM._tippy
    ) {
      // @ts-ignore
      this.tooltipDOM._tippy.destroy();
      this.tooltipDOM = null;
      this.tippy = null;
    }
  }

  handleClick = (evt: React.MouseEvent): void => {
    const { onClick } = this.props;

    if (onClick) {
      evt.stopPropagation();
      evt.nativeEvent.stopImmediatePropagation();
      onClick();
    }
  };

  render() {
    const {
      className,
      style,
      title,
      children,
      enabled,
      isInteractive,
      tippyOpts,
      isDarkMode,
      onClick,
      ...elProps
    } = this.props;

    let classNames: Array<string> = ["ddbc-tooltip", className];
    if (isInteractive) {
      classNames.push("ddbc-tooltip--is-interactive");
    }

    if (isDarkMode) {
      classNames.push("ddbc-tooltip--dark-mode");
    }

    if (!enabled) {
      return <React.Fragment>{children}</React.Fragment>;
    }

    return (
      <span
        title={title}
        style={{
          ...style,
        }}
        className={classNames.join(" ")}
        ref={(tooltip) => {
          this.tooltipDOM = tooltip;
        }}
        onClick={this.handleClick}
        {...elProps}
      >
        {children}
      </span>
    );
  }
}
