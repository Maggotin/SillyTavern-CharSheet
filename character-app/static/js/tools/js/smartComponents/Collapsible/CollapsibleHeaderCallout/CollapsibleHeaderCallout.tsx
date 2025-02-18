import * as React from "react";

interface Props {
  extra: React.ReactNode;
  value: React.ReactNode;
}

export default class CollapsibleHeaderCallout extends React.PureComponent<
  Props,
  {}
> {
  static defaultProps = {
    extra: null,
  };

  render() {
    const { extra, value } = this.props;

    return (
      <span className="ddbc-collapsible__header-callout">
        <span className="ddbc-collapsible__header-callout-extra">{extra}</span>
        <span className="ddbc-collapsible__header-callout-value">{value}</span>
      </span>
    );
  }
}
