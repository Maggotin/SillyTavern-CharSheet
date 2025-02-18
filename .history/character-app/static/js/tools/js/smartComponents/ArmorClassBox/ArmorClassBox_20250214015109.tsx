import { visuallyHidden } from "@mui/utils";
import * as React from "react";

import { CharacterTheme } from "@dndbeyond/character-rules-engine/es";

import BoxBackground from "../BoxBackground";
import ArmorClassBoxSvg from "../Svg/boxes/ArmorClassBoxSvg";

interface Props {
  armorClass: number;
  theme: CharacterTheme;
  onClick?: () => void;
  className: string;
}

export default class ArmorClassBox extends React.PureComponent<Props> {
  static defaultProps = {
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
    const { armorClass, className, theme } = this.props;

    let classNames: Array<string> = [className, "ddbc-armor-class-box"];

    return (
      <section className={classNames.join(" ")} onClick={this.handleClick}>
        <BoxBackground StyleComponent={ArmorClassBoxSvg} theme={theme} />
        <h2 style={visuallyHidden}>Armor Class</h2>
        <div
          className={`ddbc-armor-class-box__label ${
            theme.isDarkMode ? "ddbc-armor-class-box__label--dark-mode" : ""
          }`}
        >
          Armor
        </div>
        <div
          className={`ddbc-armor-class-box__value ${
            theme.isDarkMode ? "ddbc-armor-class-box__value--dark-mode" : ""
          }`}
          data-testid="armor-class-value"
        >
          {armorClass}
        </div>
        <div
          className={`ddbc-armor-class-box__label ${
            theme.isDarkMode ? "ddbc-armor-class-box__label--dark-mode" : ""
          }`}
        >
          Class
        </div>
      </section>
    );
  }
}
