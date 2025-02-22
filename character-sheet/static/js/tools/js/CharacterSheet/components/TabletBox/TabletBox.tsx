import React from "react";

import { ManageIcon } from "@dndbeyond/character-components/es";
import { CharacterTheme } from "@dndbeyond/character-rules-engine/es";

import MobileDivider from "../MobileDivider";

interface Props {
  header: React.ReactNode;
  onHeaderClick?: () => void;
  className: string;
  isReadonly: boolean;
  theme: CharacterTheme;
}
export default class TabletBox extends React.PureComponent<Props> {
  static defaultProps = {
    className: "",
    isReadonly: false,
  };

  handleHeaderClick = (evt: React.MouseEvent): void => {
    const { onHeaderClick } = this.props;

    if (onHeaderClick) {
      evt.stopPropagation();
      evt.nativeEvent.stopImmediatePropagation();
      onHeaderClick();
    }
  };

  render() {
    const { header, children, className, onHeaderClick, isReadonly, theme } =
      this.props;

    let classNames: Array<string> = ["ct-tablet-box", className];

    let hasOnClick: boolean = !!onHeaderClick;

    return (
      <div className={classNames.join(" ")}>
        <MobileDivider theme={theme} isTablet={true} />
        <div className="ct-tablet-box__border">
          <div
            className={`ct-tablet-box__inner ${
              theme.isDarkMode ? "ct-tablet-box__inner--dark-mode" : ""
            }`}
          >
            <div
              className={`ct-tablet-box__header ${
                theme.isDarkMode ? "ct-tablet-box__header--dark-mode" : ""
              }`}
            >
              <div
                className="ct-tablet-box__header-content"
                onClick={this.handleHeaderClick}
              >
                {header}
                {!isReadonly && hasOnClick && (
                  <ManageIcon
                    theme={theme}
                    enableTooltip={false}
                    showIconOnEdge={false}
                  />
                )}
              </div>
            </div>
            <div className="ct-tablet-box__content">{children}</div>
          </div>
        </div>
        <MobileDivider theme={theme} isEnd={true} isTablet={true} />
      </div>
    );
  }
}
