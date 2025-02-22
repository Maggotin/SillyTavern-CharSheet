import * as React from "react";

import CollapsibleHeaderCallout from "../CollapsibleHeaderCallout";
import CollapsibleHeading from "../CollapsibleHeading";

interface Props {
  heading: React.ReactNode;
  metaItems?: Array<React.ReactNode>;
  callout?: React.ReactNode;
  className: string;
}

export default class CollapsibleHeaderContent extends React.PureComponent<
  Props,
  {}
> {
  static defaultProps = {
    className: "",
  };

  renderMetaItems(): React.ReactNode {
    const { metaItems } = this.props;

    if (!metaItems) {
      return null;
    }

    return (
      <div className="ddbc-collapsible__header-meta">
        {metaItems.map((item, idx) => (
          <span className="ddbc-collapsible__header-meta-item" key={idx}>
            {item}
          </span>
        ))}
      </div>
    );
  }

  render() {
    const { className, heading, callout } = this.props;

    let headingNode: React.ReactNode;
    if (typeof heading === "string") {
      headingNode = <CollapsibleHeading>{heading}</CollapsibleHeading>;
    } else {
      headingNode = heading;
    }

    let calloutNode: React.ReactNode;
    if (typeof callout === "string") {
      calloutNode = <CollapsibleHeaderCallout value={callout} />;
    } else {
      calloutNode = callout;
    }

    let classNames: Array<string> = [
      "ddbc-collapsible__header-content",
      className,
    ];

    return (
      <div className={classNames.join(" ")}>
        <div className="ddbc-collapsible__header-content-primary">
          {headingNode}
          {this.renderMetaItems()}
        </div>
        {calloutNode && (
          <div className="ddbc-collapsible__header-content-callout">
            {calloutNode}
          </div>
        )}
      </div>
    );
  }
}
