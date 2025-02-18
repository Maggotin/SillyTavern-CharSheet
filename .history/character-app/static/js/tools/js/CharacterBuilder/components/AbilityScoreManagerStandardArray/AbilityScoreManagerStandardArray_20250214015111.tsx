import { uniqueId } from "lodash";

import { Select } from "@dndbeyond/character-components/es";
import {
  AbilityManager,
  HelperUtils,
  HtmlSelectOption,
} from "@dndbeyond/character-rules-engine/es";

import { TypeScriptUtils } from "../../../Shared/utils";

const standardScores: Array<number> = [8, 10, 12, 13, 14, 15];

interface Props {
  abilities: Array<AbilityManager>;
}
export default function AbilityScoreManagerStandardArray({ abilities }: Props) {
  const usedScores = abilities
    .map((abilityScore) => abilityScore.getBaseScore())
    .filter(TypeScriptUtils.isNotNullOrUndefined);

  return (
    <div className="ability-score-manager ability-score-manager-standard">
      <div className="ability-score-manager-stats">
        {abilities.map((abilityScore) => {
          const uId = uniqueId("qry_");
          const availableScores = standardScores.reduce(
            (acc: Array<number>, score) => {
              if (
                !usedScores.includes(score) ||
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
              label: "" + score,
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
                    onChange={(value) => {
                      const parsedValue = HelperUtils.parseInputInt(value);
                      abilityScore.handleScoreChange(parsedValue);
                    }}
                    placeholder={"--"}
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
