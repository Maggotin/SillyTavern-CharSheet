import * as React from "react";

import { Tooltip } from "@dndbeyond/character-common-components/es";
import {
  CharacterTheme,
  Creature,
  CreatureUtils,
} from "../../rules-engine/es";

interface Props {
  creature: Creature;
  onClick?: (creature: Creature) => void;
  className: string;
  theme?: CharacterTheme;
}
export default class CreatureName extends React.PureComponent<Props> {
  static defaultProps = {
    className: "",
  };

  handleClick = (evt: React.MouseEvent): void => {
    const { onClick, creature } = this.props;

    if (onClick) {
      evt.stopPropagation();
      evt.nativeEvent.stopImmediatePropagation();

      onClick(creature);
    }
  };

  render() {
    const { creature, className, theme } = this.props;

    let isCustomized = CreatureUtils.isCustomized(creature);
    let classNames: Array<string> = [className, "ddbc-creature-name"];

    return (
      <span className={classNames.join(" ")} onClick={this.handleClick}>
        {CreatureUtils.getName(creature)}
        {isCustomized && (
          <Tooltip
            title="Creature is Customized"
            className="ddbc-creature-name__customized"
            isDarkMode={theme?.isDarkMode}
          >
            *
          </Tooltip>
        )}
      </span>
    );
  }
}
