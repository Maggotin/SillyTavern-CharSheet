import * as React from "react";

import { Tooltip } from "@dndbeyond/character-common-components/es";
import { CharacterTheme } from "@dndbeyond/character-rules-engine/es";

interface Props {
  className: string;
  tooltip: string;
  onClick?: () => void;
  enableTooltip: boolean;
  showIconOnEdge: boolean;
  showIcon: boolean;
  theme: CharacterTheme;
}
export default class ManageIcon extends React.PureComponent<Props> {
  static defaultProps = {
    tooltip: "Manage",
    enableTooltip: true,
    showIconOnEdge: true,
    showIcon: true,
    className: "",
  };

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
      tooltip,
      children,
      onClick,
      enableTooltip,
      showIconOnEdge,
      showIcon,
      className,
      theme,
    } = this.props;

    let classNames: Array<string> = [className, "ddbc-manage-icon"];
    if (showIconOnEdge) {
      classNames.push("ddbc-manage-icon--edge-icon");
    }
    if (showIcon) {
      classNames.push("ddbc-manage-icon--interactive");
    }
    if (theme?.isDarkMode) {
      classNames.push("ddbc-manage-icon--dark-mode");
    }

    let contentNode: React.ReactNode = (
      <React.Fragment>
        {children && (
          <span className="ddbc-manage-icon__content">{children}</span>
        )}
        {showIcon && (
          <span
            className={`ddbc-manage-icon__icon ${
              theme?.isDarkMode ? `ddbc-manage-icon__icon--dark-mode` : ""
            }`}
          />
        )}
      </React.Fragment>
    );

    if (enableTooltip) {
      return (
        <Tooltip
          title={tooltip}
          className={classNames.join(" ")}
          onClick={onClick}
          isInteractive={true}
          isDarkMode={theme?.isDarkMode}
        >
          {contentNode}
        </Tooltip>
      );
    }

    return (
      <span
        className={classNames.join(" ")}
        onClick={this.handleClick}
        role="button"
        aria-label="Manage"
      >
        {contentNode}
      </span>
    );
  }
}
