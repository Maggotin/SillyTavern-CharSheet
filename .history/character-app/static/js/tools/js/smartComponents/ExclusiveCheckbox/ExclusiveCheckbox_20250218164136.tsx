import * as React from "react";

import { CharacterTheme } from "@dndbeyond/character-rules-engine/es";

import Checkbox from "../Checkbox";

interface Props {
  choices: Array<string>;
  onSelection?: (slotIdx: number) => void;
  activeChoice: number | null;
  theme?: CharacterTheme;
}

export default class ExclusiveCheckbox extends React.PureComponent<Props, {}> {
  handleSelection = (slotIdx: number): void => {
    const { onSelection } = this.props;

    if (onSelection) {
      onSelection(slotIdx);
    }
  };

  render() {
    const { activeChoice, choices, theme } = this.props;

    const parentClassNames: Array<string> = ["ddbc-exclusive-checkbox"];
    if (theme?.isDarkMode) {
      parentClassNames.push("ddbc-exclusive-checkbox--dark-mode");
    }

    return (
      <div className={parentClassNames.join(" ")}>
        {choices.map((choice, slotIdx) => {
          const classNames: Array<string> = ["ddbc-exclusive-checkbox__slot"];

          if (activeChoice === null) {
            classNames.push("ddbc-exclusive-checkbox__slot--active");
          } else {
            if (activeChoice === slotIdx) {
              classNames.push("ddbc-exclusive-checkbox__slot--selected");
            } else {
              classNames.push("ddbc-exclusive-checkbox__slot--inactive");
            }
          }

          return (
            <div key={slotIdx} className={classNames.join(" ")}>
              <Checkbox
                label={choice}
                enabled={activeChoice === slotIdx}
                onChange={this.handleSelection.bind(this, slotIdx)}
              />
            </div>
          );
        })}
      </div>
    );
  }
}
