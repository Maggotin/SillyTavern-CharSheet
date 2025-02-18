import * as React from "react";

import { Tooltip } from "../../character-common-components/es";
import { CharacterTheme } from "../../character-rules-engine/es";

interface Props {
  isModified: boolean;
  className: string;
  theme?: CharacterTheme;
}

export default class NoProficiencyIcon extends React.PureComponent<Props> {
  static defaultProps = {
    isModified: false,
    className: "",
  };

  render() {
    const { isModified, className, theme } = this.props;

    let classNames: Array<string> = ["ddbc-no-proficiency-icon", className];
    if (isModified) {
      classNames.push("ddbc-no-proficiency-icon--modified");
    }
    if (theme?.isDarkMode) {
      classNames.push("ddbc-no-proficiency-icon--dark-mode");
    }

    return (
      <Tooltip title="Not Proficient" isDarkMode={theme?.isDarkMode}>
        <span className={classNames.join(" ")} />
      </Tooltip>
    );
  }
}
