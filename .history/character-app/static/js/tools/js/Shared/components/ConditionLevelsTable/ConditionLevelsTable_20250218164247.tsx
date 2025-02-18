import * as React from "react";

import { ConditionLevelEffectLookup } from "../../character-rules-engine/es";

import SlotManager from "../SlotManager";
import { ThemeButton } from "../common/Button";

interface Props {
  conditionName: string;
  levels: Array<number>;
  levelEffectLookup: ConditionLevelEffectLookup | null;
  levelOverrides: Record<number, string>;
  activeLevel: number | null;
  isInteractive: boolean;
  onLevelChange: (value: number | null) => void;
}
export default class ConditionLevelsTable extends React.PureComponent<Props> {
  static defaultProps = {
    activeLevel: null,
    isInteractive: false,
    onLevelChange: null,
    levelOverrides: {},
    levelEffectLookup: null,
  };

  handleLevelChange = (level: number | null, used: number): void => {
    const { onLevelChange, activeLevel } = this.props;

    let value: number | null = level;
    if (level !== null && activeLevel === level) {
      value = level > 1 ? level - 1 : null;
    }

    if (onLevelChange) {
      onLevelChange(value);
    }
  };

  renderEffect = (level: number): string => {
    const { levelEffectLookup, levelOverrides } = this.props;

    if (levelOverrides.hasOwnProperty(level)) {
      return levelOverrides[level];
    }

    let effect: string = "";
    if (levelEffectLookup !== null && levelEffectLookup.hasOwnProperty(level)) {
      effect = levelEffectLookup[level];
    }

    return effect;
  };

  render() {
    const { conditionName, levels, activeLevel, isInteractive } = this.props;

    return (
      <div className="ct-condition-levels-table">
        <table className="ct-condition-levels-table__table">
          <thead>
            <tr>
              <th>Applied</th>
              <th>Level</th>
              <th>Effect</th>
            </tr>
          </thead>
          <tbody>
            {levels.map((level, idx) => {
              let isActive: boolean = level === activeLevel;
              let isImplied: boolean =
                activeLevel !== null && level < activeLevel;

              let classNames: Array<string> = [
                "ct-condition-levels-table__table-slot",
              ];
              if (isActive) {
                classNames.push(
                  "ct-condition-levels-table__table-slot--active"
                );
              }
              if (isImplied) {
                classNames.push(
                  "ct-condition-levels-table__table-slot--implied"
                );
              }
              if (isInteractive) {
                classNames.push(
                  "ct-condition-levels-table__table-slot--interactive"
                );
              }

              return (
                <tr key={`${level}-${idx}`}>
                  <td className={classNames.join(" ")}>
                    <SlotManager
                      size="small"
                      available={1}
                      onSet={this.handleLevelChange.bind(this, level)}
                      isInteractive={isInteractive}
                      used={isActive || isImplied ? 1 : 0}
                    />
                  </td>
                  <td>{level}</td>
                  <td className="left-align">{this.renderEffect(level)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {isInteractive && activeLevel !== null && (
          <div className="ct-condition-levels-table__actions">
            <div className="ct-condition-levels-table__actions-action">
              <ThemeButton
                size="small"
                style="outline"
                onClick={this.handleLevelChange.bind(this, null)}
              >
                Remove All {conditionName}
              </ThemeButton>
            </div>
          </div>
        )}
      </div>
    );
  }
}
