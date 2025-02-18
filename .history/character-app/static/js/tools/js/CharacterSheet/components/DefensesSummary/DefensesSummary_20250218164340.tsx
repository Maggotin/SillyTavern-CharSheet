import { orderBy } from "lodash";
import React from "react";

import { Tooltip } from "../../character-common-components/es";
import {
  ResistanceIcon,
  ImmunityIcon,
  VulnerabilityIcon,
} from "../../character-components/es";
import {
  CharacterTheme,
  DefenseAdjustmentGroup,
  FormatUtils,
} from "../../character-rules-engine/es";

const DEFENSE_GROUP = {
  RESISTANCE: "Resistance",
  IMMUNITY: "Immunity",
  VULNERABILITY: "Vulnerability",
};

interface Props {
  resistances: Array<DefenseAdjustmentGroup>;
  immunities: Array<DefenseAdjustmentGroup>;
  vulnerabilities: Array<DefenseAdjustmentGroup>;
  onClick?: () => void;
  theme?: CharacterTheme;
}
export default class DefensesSummary extends React.PureComponent<Props> {
  handleClick = (evt: React.MouseEvent): void => {
    const { onClick } = this.props;

    if (onClick) {
      evt.stopPropagation();
      evt.nativeEvent.stopImmediatePropagation();
      onClick();
    }
  };

  renderDamageAdjustmentList = (
    defenses: Array<DefenseAdjustmentGroup>
  ): React.ReactNode => {
    const { theme } = this.props;
    let orderedDefenses = orderBy(defenses, (group) => group.name);
    return (
      <React.Fragment>
        {orderedDefenses.map((defense: DefenseAdjustmentGroup, idx) => (
          <span
            className={`ct-defenses-summary__defense ${
              theme?.isDarkMode ? "ct-defenses-summary__defense--dark-mode" : ""
            }`}
            key={`${defense.name}-${idx}`}
          >
            <Tooltip
              isDarkMode={theme?.isDarkMode}
              title={defense.sources.join(", ")}
              tippyOpts={{ dynamicTitle: true }}
            >
              {defense.name}
              {defense.hasCustom ? "*" : ""}
            </Tooltip>
          </span>
        ))}
      </React.Fragment>
    );
    //`
  };

  renderDamageAdjustmentGroup = (
    groupType: string,
    label: string,
    damageAdjustments: Array<DefenseAdjustmentGroup>,
    isSingleLine: boolean,
    theme: CharacterTheme | undefined
  ): React.ReactNode => {
    if (!damageAdjustments.length) {
      return null;
    }

    let classNames: Array<string> = ["ct-defenses-summary__group"];
    if (isSingleLine) {
      classNames.push("ct-defenses-summary__group--single");
    }
    let iconComponent: React.ReactNode;

    switch (FormatUtils.slugify(groupType)) {
      case "resistance":
        iconComponent = <ResistanceIcon theme={theme} />;
        break;
      case "immunity":
        iconComponent = <ImmunityIcon theme={theme} />;
        break;
      case "vulnerability":
        iconComponent = <VulnerabilityIcon theme={theme} />;
        break;
      default:
        iconComponent = null;
        break;
    }

    return (
      <div className={classNames.join(" ")}>
        <span className="ct-defenses-summary__group-preview">
          {iconComponent}
        </span>
        <span className="ct-defenses-summary__group-items">
          {this.renderDamageAdjustmentList(damageAdjustments)}
        </span>
      </div>
    );
    //`
  };

  renderDefault = (): React.ReactNode => {
    const { theme } = this.props;

    return (
      <div
        className={`ct-defenses-summary__default ${
          theme?.isDarkMode ? "ct-defenses-summary__default--dark-mode" : ""
        }`}
      >
        Resistances, Immunities, or Vulnerabilities
      </div>
    );
  };

  renderDefenseGroups = (): React.ReactNode => {
    const { resistances, vulnerabilities, immunities, theme } = this.props;

    let isSingleLine: boolean =
      resistances.length > 0 &&
      vulnerabilities.length > 0 &&
      immunities.length > 0;
    return (
      <React.Fragment>
        {this.renderDamageAdjustmentGroup(
          DEFENSE_GROUP.RESISTANCE,
          "Resistances",
          resistances,
          isSingleLine,
          theme
        )}
        {this.renderDamageAdjustmentGroup(
          DEFENSE_GROUP.IMMUNITY,
          "Immunity",
          immunities,
          isSingleLine,
          theme
        )}
        {this.renderDamageAdjustmentGroup(
          DEFENSE_GROUP.VULNERABILITY,
          "Vulnerabilities",
          vulnerabilities,
          isSingleLine,
          theme
        )}
      </React.Fragment>
    );
  };

  render() {
    const { resistances, vulnerabilities, immunities } = this.props;

    let contentNode: React.ReactNode;
    if (!resistances.length && !vulnerabilities.length && !immunities.length) {
      contentNode = this.renderDefault();
    } else {
      contentNode = this.renderDefenseGroups();
    }

    return (
      <div className="ct-defenses-summary" onClick={this.handleClick}>
        {contentNode}
      </div>
    );
  }
}
