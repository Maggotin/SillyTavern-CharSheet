import React from "react";

import { Tooltip } from "@dndbeyond/character-common-components/es";
import {
  CharacterTheme,
  ProficiencyGroup,
} from "../../rules-engine/es";

interface Props {
  proficiencyGroups: Array<ProficiencyGroup>;
  onClick?: () => void;
  theme?: CharacterTheme;
}
export default class ProficiencyGroups extends React.PureComponent<Props> {
  handleClick = (evt: React.MouseEvent): void => {
    const { onClick } = this.props;

    if (onClick) {
      evt.stopPropagation();
      evt.nativeEvent.stopImmediatePropagation();
      onClick();
    }
  };

  render() {
    const { proficiencyGroups, theme } = this.props;

    return (
      <div className="ct-proficiency-groups" onClick={this.handleClick}>
        {proficiencyGroups.map((group) => {
          let itemsNode: React.ReactNode = "None";
          if (group.modifierGroups.length) {
            itemsNode = (
              <React.Fragment>
                {group.modifierGroups.map((modifierGroup, idx) => {
                  let title: string = modifierGroup.sources.join(", ");
                  return (
                    <Tooltip
                      isDarkMode={theme?.isDarkMode}
                      tippyOpts={{
                        dynamicTitle: true,
                      }}
                      title={title}
                      key={modifierGroup.label}
                    >
                      <span
                        className={`ct-proficiency-groups__group-item ${
                          theme?.isDarkMode
                            ? "ct-proficiency-groups__group-item--dark-mode"
                            : ""
                        }`}
                      >
                        {modifierGroup.label}
                        {modifierGroup.restriction
                          ? ` (${modifierGroup.restriction})`
                          : ""}
                        {idx + 1 !== group.modifierGroups.length ? ", " : ""}
                      </span>
                    </Tooltip>
                  );
                })}
              </React.Fragment>
            );
          }

          return (
            <div
              className="ct-proficiency-groups__group"
              key={group.label ? group.label : ""}
              style={
                theme?.isDarkMode
                  ? { borderColor: `${theme.themeColor}66` }
                  : undefined
              }
            >
              <div
                className={`ct-proficiency-groups__group-label ${
                  theme?.isDarkMode
                    ? "ct-proficiency-groups__group-label--dark-mode"
                    : ""
                }`}
              >
                {group.label}
              </div>
              <div
                className={`ct-proficiency-groups__group-items ${
                  theme?.isDarkMode
                    ? "ct-proficiency-groups__group-items--dark-mode"
                    : ""
                }`}
              >
                {itemsNode}
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}
