import * as React from "react";

import {
  DarkChevronUpSvg,
  DisabledChevronDownSvg,
  LightChevronUpSvg,
} from "../Svg";
import CollapsibleHeaderContent from "./CollapsibleHeaderContent";

interface Props {
  header: React.ReactNode;
  headerFooter?: React.ReactNode;
  className: string;
  initiallyCollapsed: boolean;
  collapsed?: boolean;
  overrideCollapsed?: boolean;
  onChangeHandler?: (isCollapsed: boolean) => void;
  layoutType: "standard" | "minimal";
  useBuilderStyles?: boolean;
}

interface State {
  isCollapsed: boolean;
  isDarkMode: boolean;
}

export class Collapsible extends React.PureComponent<Props, State> {
  static defaultProps = {
    initiallyCollapsed: true,
    className: "",
    layoutType: "standard",
    useBuilderStyles: false,
  };

  constructor(props: Props) {
    super(props);

    let initialCollapsed = props.initiallyCollapsed;
    if (typeof props.collapsed !== "undefined") {
      initialCollapsed = props.collapsed;
    }

    this.state = {
      isCollapsed: initialCollapsed,
      isDarkMode: false,
    };
  }

  componentDidMount() {
    this.setState({
      isDarkMode: !!global.document.getElementsByClassName(
        "ct-character-sheet--dark-mode"
      ).length,
    });
  }

  componentDidUpdate(
    prevProps: Readonly<Props>,
    prevState: Readonly<State>,
    snapshot?: any
  ): void {
    const { collapsed, overrideCollapsed } = this.props;

    // Allow for the collapsed prop to set the state if the prop previously set the state
    if (
      typeof prevProps.collapsed !== "undefined" &&
      typeof collapsed !== "undefined" &&
      collapsed !== prevProps.collapsed
    ) {
      this.setState({
        isCollapsed: collapsed,
      });
    }

    // Allow the overrideCollapsed prop to set the state if the component previously set its own state
    if (
      typeof overrideCollapsed !== "undefined" &&
      this.state.isCollapsed === prevState.isCollapsed
    ) {
      this.setState({
        isCollapsed: overrideCollapsed,
      });
    }
  }

  handleClick = (evt: React.MouseEvent): void => {
    evt.stopPropagation();
    const { onChangeHandler } = this.props;

    this.setState((prevState, preProps) => {
      let newIsCollapsed = !prevState.isCollapsed;

      if (onChangeHandler) {
        onChangeHandler(newIsCollapsed);
        return {
          isCollapsed: prevState.isCollapsed,
        };
      } else {
        return {
          isCollapsed: newIsCollapsed,
        };
      }
    });
  };

  render() {
    const { isCollapsed, isDarkMode } = this.state;
    const {
      header,
      className,
      children,
      headerFooter,
      layoutType,
      useBuilderStyles,
    } = this.props;

    let headerContentNode: React.ReactNode;
    if (typeof header === "string") {
      headerContentNode = <CollapsibleHeaderContent heading={header} />;
    } else {
      headerContentNode = header;
    }

    let classNames: Array<string> = ["ddbc-collapsible", className];
    classNames.push(
      isCollapsed ? "ddbc-collapsible--collapsed" : "ddbc-collapsible--opened"
    );

    switch (layoutType) {
      case "minimal":
        classNames.push("ddbc-collapsible--minimal");
        break;

      default:
      // not implements
    }

    let chevronNode: React.ReactNode = <DisabledChevronDownSvg />;
    if (!isCollapsed) {
      chevronNode =
        isDarkMode && !useBuilderStyles ? (
          <LightChevronUpSvg />
        ) : (
          <DarkChevronUpSvg />
        );
    }

    return (
      <div className={classNames.join(" ")}>
        <div className="ddbc-collapsible__header" onClick={this.handleClick}>
          {headerContentNode}
          <div className="ddbc-collapsible__header-status">{chevronNode}</div>
        </div>
        {headerFooter && (
          <div className="ddbc-collapsible__header-footer">{headerFooter}</div>
        )}
        {!isCollapsed && (
          <div className="ddbc-collapsible__content">{children}</div>
        )}
      </div>
    );
  }
}

export default Collapsible;
