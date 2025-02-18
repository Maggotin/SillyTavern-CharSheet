import * as React from "react";

import { Tooltip } from "@dndbeyond/character-common-components/es";
import { CharacterTheme } from "../../rules-engine/es";

interface Props {
  title: string;
  className: string;
  theme?: CharacterTheme;
}

export default class TodoIcon extends React.PureComponent<Props> {
  static defaultProps = {
    title: "Missing",
    className: "",
  };

  render() {
    const { title, className, theme } = this.props;

    let classNames: Array<string> = [className, "ddbc-todo-icon"];

    return (
      <Tooltip
        title={title}
        className={classNames.join(" ")}
        isDarkMode={theme?.isDarkMode}
      >
        !
      </Tooltip>
    );
  }
}
