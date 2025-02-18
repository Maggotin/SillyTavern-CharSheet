import { uniqueId } from "lodash";

import { Select } from "@dndbeyond/character-components/es";
import {
  AbilityManager,
  HelperUtils,
  HtmlSelectOption,
} from "../../character-rules-engine/es";

const totalPoints: number = 27;
const scoreChoices: Array<number> = [8, 9, 10, 11, 12, 13, 14, 15];
const scorePoints: Record<number, number> = {
  8: 0,
  9: 1,
  10: 2,
  11: 3,
  12: 4,
  13: 5,
  14: 7,
  15: 9,
};

function renderScoreLabel(score: number, currentScore: number | null): string {
  if (currentScore !== null) {
    if (score > currentScore) {
      const pointDiff = scorePoints[score] - scorePoints[currentScore];
      return `${score} (-${pointDiff} Point${pointDiff === 1 ? "" : "s"})`;
    } else if (score < currentScore) {
      const pointDiff = scorePoints[currentScore] - scorePoints[score];
      return `${score} (+${pointDiff} Point${pointDiff === 1 ? "" : "s"})`;
    }
  }

  return "" + score;
}

interface Props {
  abilities: Array<AbilityManager>;
}
export default function AbilityScoreManagerPointBuy({ abilities }: Props) {
  const currentPoints = abilities.reduce((acc: number, abilityScore) => {
    const baseScore = abilityScore.getBaseScore();
    if (baseScore !== null) {
      return acc + scorePoints[baseScore];
    }
    return acc;
  }, 0);
  const remainingPoints: number = totalPoints - currentPoints;

  return (
    <div className="ability-score-manager ability-score-manager-point">
      <div className="ability-score-manager-points">
        <div className="ability-score-manager-points-heading">
          Points Remaining
        </div>
        <div className="ability-score-manager-points-value">
          <span className="ability-score-manager-points-value-remaining">
            {remainingPoints}
          </span>
          <span className="ability-score-manager-points-value-sep">/</span>
          <span className="ability-score-manager-points-value-total">
            {totalPoints}
          </span>
        </div>
      </div>
      <div className="ability-score-manager-stats">
        {abilities.map((abilityScore) => {
          const uId = uniqueId("qry_");
          const baseScore = abilityScore.getBaseScore();
          const availableScores = scoreChoices.reduce(
            (acc: Array<number>, score) => {
              let pointDiff = scorePoints[score];
              if (baseScore !== null) {
                pointDiff -= scorePoints[baseScore];
              }

              if (
                pointDiff < 0 ||
                (pointDiff > 0 && pointDiff <= remainingPoints) ||
                score === abilityScore.getBaseScore()
              ) {
                acc.push(score);
              }

              return acc;
            },
            []
          );
          const availableScoreOptions: Array<HtmlSelectOption> =
            availableScores.map((score) => ({
              label: renderScoreLabel(score, abilityScore.getBaseScore()),
              value: score,
            }));

          return (
            <div
              className="ability-score-manager-stat"
              key={abilityScore.getId()}
            >
              <div className="builder-field form-select-field">
                <span className="builder-field-label">
                  <label
                    className="builder-field-heading form-select-field-label"
                    htmlFor={uId}
                  >
                    {abilityScore.getLabel()}
                  </label>
                </span>
                <span className="builder-field-input">
                  <Select
                    id={uId}
                    options={availableScoreOptions}
                    value={abilityScore.getBaseScore()}
                    onChange={(value) =>
                      abilityScore.handleScoreChange(Number(value))
                    }
                    initialOptionRemoved={true}
                  />
                </span>
                <div className="ability-score-manager-stat-total">
                  Total: {abilityScore.getTotalScore() ?? "--"}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
