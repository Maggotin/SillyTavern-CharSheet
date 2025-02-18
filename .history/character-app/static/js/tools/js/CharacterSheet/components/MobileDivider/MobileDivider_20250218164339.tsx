import React from "react";

import {
  BeveledEdgeCornerSvg,
  BeveledEdgeRepeatSvg,
  ManageIcon,
} from "../../character-components/es";
import { CharacterTheme } from "../../character-rules-engine/es";

interface Props {
  label?: string;
  isEnd: boolean;
  onClick?: () => void;
  isReadonly: boolean;
  theme: CharacterTheme;
  isTablet: boolean;
}
export default class MobileDivider extends React.PureComponent<Props> {
  static defaultProps = {
    isEnd: false,
    isReadonly: false,
    isTablet: false,
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
    const { label, isEnd, onClick, isReadonly, theme, isTablet } = this.props;

    let classNames: Array<string> = ["ct-mobile-divider"];
    if (label) {
      classNames.push("ct-mobile-divider--has-label");
    }
    if (isEnd) {
      classNames.push("ct-mobile-divider--end");
    }

    let hasOnClick: boolean = !!onClick;

    return (
      <div className={classNames.join(" ")} onClick={this.handleClick}>
        <div className="ct-mobile-divider__divider">
          <div className="ct-mobile-divider__edge ct-mobile-divider__edge--first">
            <BeveledEdgeCornerSvg theme={theme} isTablet={isTablet} />
          </div>
          <div className="ct-mobile-divider__repeat">
            <BeveledEdgeRepeatSvg theme={theme} isTablet={isTablet} />
          </div>
          <div className="ct-mobile-divider__edge ct-mobile-divider__edge--last">
            <BeveledEdgeCornerSvg theme={theme} isTablet={isTablet} />
          </div>
        </div>
        {label && (
          <div
            className={`ct-mobile-divider__label ${
              theme.isDarkMode ? "ct-mobile-divider__label--dark-mode" : ""
            }`}
          >
            <span className="ct-mobile-divider__label-text">
              {label}
              {hasOnClick && !isReadonly && (
                <ManageIcon
                  theme={theme}
                  enableTooltip={false}
                  showIconOnEdge={false}
                />
              )}
            </span>
          </div>
        )}
      </div>
    );
  }
}
