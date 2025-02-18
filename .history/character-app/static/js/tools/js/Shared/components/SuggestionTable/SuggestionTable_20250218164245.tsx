import React from "react";

import { BackgroundCharacteristicContract } from "../../character-rules-engine/es";

import { ThemeButton } from "../common/Button";

interface Props {
  suggestions: Array<BackgroundCharacteristicContract>;
  tableLabel: React.ReactNode;
  dieLabel: React.ReactNode;
  useButtonLabel: React.ReactNode;
  randomizeButtonLabel: React.ReactNode;
  onSuggestionUse?: (
    idx: number,
    diceRoll: number,
    description: string | null
  ) => void;
}
export default class SuggestionTable extends React.PureComponent<Props> {
  static defaultProps = {
    useButtonLabel: "+ Add",
    randomizeButtonLabel: "Random",
    suggestions: [],
  };

  handleSuggestionUse = (
    idx: number,
    diceRoll: number,
    description: string | null
  ): void => {
    const { onSuggestionUse } = this.props;

    if (onSuggestionUse) {
      onSuggestionUse(idx, diceRoll, description);
    }
  };

  handleRandomClick = (): void => {
    const { onSuggestionUse, suggestions } = this.props;

    if (onSuggestionUse) {
      let randomIdx: number = Math.floor(Math.random() * suggestions.length);
      let randomSuggestion: BackgroundCharacteristicContract =
        suggestions[randomIdx];
      onSuggestionUse(
        randomIdx,
        randomSuggestion.diceRoll,
        randomSuggestion.description
      );
    }
  };

  render() {
    const {
      suggestions,
      dieLabel,
      tableLabel,
      useButtonLabel,
      randomizeButtonLabel,
    } = this.props;

    return (
      <div className="ct-suggestions-table">
        <table className="ct-suggestions-table__table">
          <thead>
            <tr className="ct-suggestions-table__header">
              <th className="ct-suggestions-table__header-col ct-suggestions-table__col--die">
                {dieLabel}
              </th>
              <th className="ct-suggestions-table__header-col ct-suggestions-table__col--desc">
                {tableLabel}
              </th>
              <th className="ct-suggestions-table__header-col ct-suggestions-table__col--action">
                <ThemeButton size="small" onClick={this.handleRandomClick}>
                  {randomizeButtonLabel}
                </ThemeButton>
              </th>
            </tr>
          </thead>
          <tbody>
            {suggestions.map((suggestion, idx) => (
              <tr className="ct-suggestions-table__item" key={idx}>
                <td className="ct-suggestions-table__item-col ct-suggestions-table__col--die">
                  {suggestion.diceRoll}
                </td>
                <td className="ct-suggestions-table__item-col ct-suggestions-table__col--desc">
                  {suggestion.description}
                </td>
                <td className="ct-suggestions-table__item-col ct-suggestions-table__col--action">
                  <ThemeButton
                    size="small"
                    onClick={this.handleSuggestionUse.bind(
                      this,
                      idx,
                      suggestion.diceRoll,
                      suggestion.description
                    )}
                  >
                    {useButtonLabel}
                  </ThemeButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}
