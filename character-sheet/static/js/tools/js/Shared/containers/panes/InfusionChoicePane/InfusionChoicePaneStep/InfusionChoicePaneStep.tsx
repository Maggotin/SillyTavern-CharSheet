import * as React from "react";

interface Props {
  header: React.ReactNode;
  extra?: React.ReactNode;
  onClick?: () => void;
}
export class InfusionChoicePaneStep extends React.PureComponent<Props> {
  handleClick = (evt: React.MouseEvent): void => {
    const { onClick } = this.props;

    if (onClick) {
      evt.stopPropagation();
      evt.nativeEvent.stopImmediatePropagation();

      onClick();
    }
  };

  render() {
    const { header, extra, children } = this.props;

    return (
      <div className="ct-infusion-choice-pane__step" onClick={this.handleClick}>
        <div className="ct-infusion-choice-pane__step-primary">
          <div className="ct-infusion-choice-pane__step-header">{header}</div>
          <div className="ct-infusion-choice-pane__step-content">
            {children}
          </div>
        </div>
        {extra && (
          <div className="ct-infusion-choice-pane__step-extra">{extra}</div>
        )}
      </div>
    );
  }
}

export default InfusionChoicePaneStep;
