import React from "react";

import {
  DisabledChevronDownSvg,
  DisabledChevronUpSvg,
} from "@dndbeyond/character-components/es";

export class CollapsibleHeading extends React.PureComponent<{
  className: string;
}> {
  static defaultProps = {
    className: "",
  };

  render() {
    const { className, children } = this.props;
    return (
      <div className={["collapsible-heading", className].join(" ")}>
        {children}
      </div>
    );
  }
}

export class CollapsibleHeaderCallout extends React.PureComponent<{
  extra: any;
  value: any;
}> {
  render() {
    let { extra, value } = this.props;

    return (
      <span className="collapsible-header-callout">
        <span className="collapsible-header-callout-extra">{extra}</span>
        <span className="collapsible-header-callout-value">{value}</span>
      </span>
    );
  }
}

export class CollapsibleHeader extends React.PureComponent<{
  clsIdent?: string;
  imgSrc?: string;
  imgKey?: string;
  iconClsNames: Array<string>;
  heading: any;
  metaItems: Array<string>;
  callout?: any;
}> {
  static defaultProps = {
    iconClsNames: [],
    metaItems: [],
  };

  constructMetaItems() {
    let { metaItems } = this.props;

    if (!metaItems) {
      return null;
    }

    return (
      <div className="collapsible-header-meta">
        {metaItems.map((item, idx) => {
          return (
            <span className="collapsible-header-meta-item" key={item + idx}>
              {item}
            </span>
          );
        })}
      </div>
    );
  }

  render() {
    const { clsIdent, heading, callout, imgSrc, imgKey, iconClsNames } =
      this.props;
    let calloutNode, headingNode;

    if (typeof heading === "string") {
      headingNode = (
        <CollapsibleHeading className="collapsible-heading">
          {heading}
        </CollapsibleHeading>
      );
    } else {
      headingNode = heading;
    }

    if (typeof callout === "string") {
      calloutNode = (
        <div className="collapsible-heading-callout">{callout}</div>
      );
    } else {
      calloutNode = (
        <div className="collapsible-heading-callout">{callout}</div>
      );
    }

    //TODO clean this up and use all of the same thing
    let iconStyles = {};
    let allIconClsNames = ["collapsible-header-icon"];
    let hasIcon = false;
    if (imgSrc) {
      iconStyles["backgroundImage"] = `url(${imgSrc})`;
      hasIcon = true;
    } else if (imgKey) {
      allIconClsNames.push(`collapsible-header-icon-${imgKey}`);
      hasIcon = true;
    } else if (iconClsNames.length) {
      allIconClsNames = [...allIconClsNames, ...iconClsNames];
      hasIcon = true;
    }

    //TODO fix name to conClsNames for consistency
    let conClassNames = [`collapsible-header-el`];
    if (clsIdent) {
      conClassNames.push(`collapsible-header-el-${clsIdent}`);
    }

    return (
      <div className={conClassNames.join(" ")}>
        {hasIcon && (
          <div className={allIconClsNames.join(" ")} style={iconStyles} />
        )}
        <div className="collapsible-header-info">
          {headingNode}
          {this.constructMetaItems()}
        </div>
        {calloutNode}
      </div>
    );
  }
}

export class Collapsible extends React.PureComponent<
  {
    trigger: any;
    clsNames: Array<string>;
    initiallyCollapsed: boolean;
    onChange?: (isCollapsed: boolean) => void;
    onOpened?: () => void;
    onClosed?: () => void;
  },
  {
    collapsed: boolean;
    mouseOverHeading: boolean;
  }
> {
  static defaultProps = {
    clsNames: [],
    initiallyCollapsed: true,
  };

  constructor(props) {
    super(props);

    this.state = {
      collapsed: props.initiallyCollapsed,
      mouseOverHeading: false,
    };
  }

  handleUpdate = () => {
    const { onChange, onOpened, onClosed } = this.props;
    const { collapsed } = this.state;

    if (collapsed) {
      if (onClosed) {
        onClosed();
      }
    } else {
      if (onOpened) {
        onOpened();
      }
    }

    if (onChange) {
      onChange(collapsed);
    }
  };

  handleClick = (evt) => {
    this.setState(
      (prevState, preProps) => ({
        collapsed: !prevState.collapsed,
      }),
      this.handleUpdate
    );
  };

  render() {
    const { collapsed } = this.state;
    const { trigger, clsNames, children } = this.props;

    let headerContent = trigger;
    if (typeof headerContent == "string") {
      headerContent = (
        <div className="collapsible-heading">{headerContent}</div>
      );
    }

    let conClassNames = ["collapsible"];
    if (clsNames) {
      conClassNames = [...clsNames, ...conClassNames];
    }
    conClassNames.push(
      this.state.collapsed ? "collapsible-collapsed" : "collapsible-opened"
    );

    let headerClassNames = ["collapsible-header"];
    if (this.state.mouseOverHeading) {
      headerClassNames.push("collapsible-header-over");
    }

    return (
      <div className={conClassNames.join(" ")}>
        <div className={headerClassNames.join(" ")} onClick={this.handleClick}>
          <div className="collapsible-header-content">{headerContent}</div>
          {collapsed ? <DisabledChevronDownSvg /> : <DisabledChevronUpSvg />}
        </div>
        {collapsed ? null : <div className="collapsible-body">{children}</div>}
      </div>
    );
  }
}

export default Collapsible;
