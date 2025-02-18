import * as React from "react";

import { Tooltip } from "@dndbeyond/character-common-components/es";
import {
  CharacterTheme,
  Constants,
  ExtraManager,
} from "../../character-rules-engine/es";

interface Props {
  extra: ExtraManager;
  onClick?: (extra: ExtraManager) => void;
  className: string;
  theme?: CharacterTheme;
}
export default class ExtraName extends React.PureComponent<Props> {
  static defaultProps = {
    className: "",
  };

  handleClick = (evt: React.MouseEvent): void => {
    const { onClick, extra } = this.props;

    if (onClick) {
      evt.stopPropagation();
      evt.nativeEvent.stopImmediatePropagation();

      onClick(extra);
    }
  };

  render() {
    const { extra, className, theme } = this.props;

    let title: string = "Customized";

    switch (extra.getExtraType()) {
      case Constants.ExtraTypeEnum.CREATURE:
        title = `Creature is ${title}`;
        break;
      case Constants.ExtraTypeEnum.VEHICLE:
        title = `Vehicle is ${title}`;
        break;
      default:
      //not implemented
    }

    let isCustomized = extra.isCustomized();
    let classNames: Array<string> = [className, "ddbc-extra-name"];

    return (
      <span className={classNames.join(" ")} onClick={this.handleClick}>
        {extra.getName()}
        {isCustomized && (
          <Tooltip
            isDarkMode={theme?.isDarkMode}
            title={title}
            className="ddbc-extra-name__customized"
          >
            *
          </Tooltip>
        )}
      </span>
    );
  }
}
