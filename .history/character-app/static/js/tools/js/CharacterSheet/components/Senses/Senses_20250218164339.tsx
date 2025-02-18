import React from "react";

import {
  BoxBackground,
  ThemedSenseRowBoxSvg,
  ThemedSenseRowSmallBoxSvg,
} from "../../character-components/es";
import {
  CharacterTheme,
  Constants,
  FormatUtils,
  RuleDataUtils,
  SenseInfo,
} from "../../character-rules-engine/es";

import { TypeScriptUtils } from "../../../Shared/utils";

interface Props {
  passivePerception: number;
  passiveInvestigation: number;
  passiveInsight: number;
  senses: SenseInfo;
  rowStyle: "small" | "normal";
  onClick?: () => void;
  theme: CharacterTheme;
}
export default class Senses extends React.PureComponent<Props> {
  static defaultProps = {
    rowStyle: "normal",
  };

  handleClick = (evt: React.MouseEvent): void => {
    const { onClick } = this.props;

    if (onClick) {
      evt.stopPropagation();
      evt.nativeEvent.stopImmediatePropagation();
      onClick();
    }
  };

  getSenseSummary = (senseKey: Constants.SenseTypeEnum): string | null => {
    const { senses } = this.props;

    let senseValue = senses[senseKey];
    if (!senseValue) {
      return null;
    }

    return `${RuleDataUtils.getSenseTypeLabel(
      senseKey
    )} ${FormatUtils.renderDistance(senseValue)}`;
  };

  renderSummaryInfo = (): React.ReactNode => {
    const { theme } = this.props;

    let senseKeys: Array<Constants.SenseTypeEnum> = [
      Constants.SenseTypeEnum.BLINDSIGHT,
      Constants.SenseTypeEnum.DARKVISION,
      Constants.SenseTypeEnum.TREMORSENSE,
      Constants.SenseTypeEnum.TRUESIGHT,
    ];

    let senseSummaries: Array<string> = senseKeys
      .map((senseKey) => this.getSenseSummary(senseKey))
      .filter(TypeScriptUtils.isNotNullOrUndefined);

    let summaryClasses: Array<string> = ["ct-senses__summary"];
    if (!senseSummaries.length) {
      summaryClasses.push("ct-senses__summary--empty");
    }
    if (theme?.isDarkMode) {
      summaryClasses.push("ct-senses__summary--dark-mode");
    }

    if (senseSummaries.length) {
      return (
        <div className={summaryClasses.join(" ")}>
          {senseSummaries.join(", ")}
        </div>
      );
    }

    return (
      <div className={summaryClasses.join(" ")}>Additional Sense Types</div>
    );
  };

  render() {
    const {
      passiveInsight,
      passiveInvestigation,
      passivePerception,
      rowStyle,
      theme,
    } = this.props;

    let StyleComponent: React.ComponentType<any> = ThemedSenseRowBoxSvg;
    if (rowStyle === "small") {
      StyleComponent = ThemedSenseRowSmallBoxSvg;
    }

    return (
      <div className="ct-senses" onClick={this.handleClick}>
        <div className="ct-senses__callouts">
          <div className="ct-senses__callout">
            <BoxBackground
              StyleComponent={StyleComponent}
              theme={{
                ...theme,
                themeColor: `${theme?.themeColor}80`,
              }}
            />
            <div
              className={`ct-senses__callout-value ${
                theme?.isDarkMode ? "ct-senses__callout-value--dark-mode" : ""
              }`}
            >
              {passivePerception}
            </div>
            <div
              className={`ct-senses__callout-label ${
                theme?.isDarkMode ? "ct-senses__callout-label--dark-mode" : ""
              }`}
            >
              Passive Perception
            </div>
          </div>
          <div className="ct-senses__callout">
            <BoxBackground
              StyleComponent={StyleComponent}
              theme={{
                ...theme,
                themeColor: `${theme?.themeColor}80`,
              }}
            />
            <div
              className={`ct-senses__callout-value ${
                theme?.isDarkMode ? "ct-senses__callout-value--dark-mode" : ""
              }`}
            >
              {passiveInvestigation}
            </div>
            <div
              className={`ct-senses__callout-label ${
                theme?.isDarkMode ? "ct-senses__callout-label--dark-mode" : ""
              }`}
            >
              Passive Investigation
            </div>
          </div>
          <div className="ct-senses__callout">
            <BoxBackground
              StyleComponent={StyleComponent}
              theme={{
                ...theme,
                themeColor: `${theme?.themeColor}80`,
              }}
            />
            <div
              className={`ct-senses__callout-value ${
                theme?.isDarkMode ? "ct-senses__callout-value--dark-mode" : ""
              }`}
            >
              {passiveInsight}
            </div>
            <div
              className={`ct-senses__callout-label ${
                theme?.isDarkMode ? "ct-senses__callout-label--dark-mode" : ""
              }`}
            >
              Passive Insight
            </div>
          </div>
        </div>
        {this.renderSummaryInfo()}
      </div>
    );
  }
}
